package ansible

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"time"
)

// Result holds a summary of an Ansible run.
type Result struct {
	Changed int
	OK      int
	Failed  int
}

// Runner is responsible for executing Ansible playbooks against a set of hosts.
type Runner struct {
	// Path to the ansible-playbook binary. Defaults to "ansible-playbook".
	AnsiblePath string
	// Timeout for the entire playbook run.
	Timeout time.Duration
}

// NewRunner creates a Runner with sensible defaults.
func NewRunner() *Runner {
	return &Runner{
		AnsiblePath: "ansible-playbook",
		Timeout:     10 * time.Minute,
	}
}

// ValidateHosts ensures all provided host IPs belong to the given VPC CIDR.
// This is a lightweight check to prevent accidental access to external networks.
func (r *Runner) ValidateHosts(hosts []string, vpcCIDR string) error {
	_, cidrNet, err := net.ParseCIDR(vpcCIDR)
	if err != nil {
		return fmt.Errorf("invalid VPC CIDR %q: %w", vpcCIDR, err)
	}
	for _, h := range hosts {
		ip := net.ParseIP(h)
		if ip == nil {
			return fmt.Errorf("invalid host IP %q", h)
		}
		if !cidrNet.Contains(ip) {
			return fmt.Errorf("host %q is outside VPC %q", h, vpcCIDR)
		}
	}
	return nil
}

// Run executes the given playbook against the specified hosts.
// The output of the playbook is streamed to the provided writer in real time.
// A Result summary is returned once the playbook finishes.
func (r *Runner) Run(playbookPath string, hosts []string, vpcCIDR string, output io.Writer) (Result, error) {
	var res Result

	// 1. Validate hosts against VPC
	if err := r.ValidateHosts(hosts, vpcCIDR); err != nil {
		return res, err
	}

	// 2. Create a temporary inventory file
	invFile, err := os.CreateTemp("", "ansible-inventory-*.ini")
	if err != nil {
		return res, fmt.Errorf("creating inventory file: %w", err)
	}
	defer os.Remove(invFile.Name())

	if _, err := invFile.WriteString("[targets]\n"); err != nil {
		return res, fmt.Errorf("writing inventory: %w", err)
	}
	for _, h := range hosts {
		if _, err := invFile.WriteString(fmt.Sprintf("%s\n", h)); err != nil {
			return res, fmt.Errorf("writing inventory: %w", err)
		}
	}
	if err := invFile.Close(); err != nil {
		return res, fmt.Errorf("closing inventory: %w", err)
	}

	// 3. Build the ansible-playbook command
	cmd := exec.Command(
		r.AnsiblePath,
		"-i", invFile.Name(),
		playbookPath,
		"--diff", // show changes
		"--connection", "ssh",
		"--ssh-common-args", "-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null",
	)

	// 4. Capture stdout and stderr
	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		return res, fmt.Errorf("stdout pipe: %w", err)
	}
	stderrPipe, err := cmd.StderrPipe()
	if err != nil {
		return res, fmt.Errorf("stderr pipe: %w", err)
	}

	// 5. Start the command
	if err := cmd.Start(); err != nil {
		return res, fmt.Errorf("starting ansible: %w", err)
	}

	// 6. Stream output concurrently
	var outBuf bytes.Buffer
	go func() {
		scanner := bufio.NewScanner(io.MultiReader(stdoutPipe, stderrPipe))
		for scanner.Scan() {
			line := scanner.Text()
			fmt.Fprintln(output, line)
			outBuf.WriteString(line + "\n")
		}
	}()

	// 7. Wait with timeout
	done := make(chan error, 1)
	go func() {
		done <- cmd.Wait()
	}()

	select {
	case err := <-done:
		if err != nil {
			return res, fmt.Errorf("ansible failed: %w", err)
		}
	case <-time.After(r.Timeout):
		return res, fmt.Errorf("ansible timed out after %v", r.Timeout)
	}

	// 8. Parse result from output buffer (simplified parsing logic)
	// In practice, you'd parse the JSON or YAML output from Ansible for accurate counts.
	// For now, we simulate counting based on presence of keywords like "changed", "ok", etc.
	lines := strings.Split(strings.TrimSpace(outBuf.String()), "\n")
	for _, line := range lines {
		if strings.Contains(line, "changed=") {
			res.Changed++
		}
		if strings.Contains(line, "ok=") {
			res.OK++
		}
		if strings.Contains(line, "failed=") {
			res.Failed++
		}
	}

	return res, nil
}