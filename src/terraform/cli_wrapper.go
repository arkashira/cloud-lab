package terraform

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// CLIWrapper wraps Terraform CLI commands
type CLIWrapper struct {
	workingDir string
}

// NewCLIWrapper creates a new CLIWrapper instance
func NewCLIWrapper(workingDir string) *CLIWrapper {
	return &CLIWrapper{workingDir: workingDir}
}

// Init runs terraform init
func (t *CLIWrapper) Init() error {
	cmd := exec.Command("terraform", "init")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("terraform init failed: %w\nOutput: %s", err, output)
	}
	return nil
}

// Plan runs terraform plan and returns the output
func (t *CLIWrapper) Plan() (string, error) {
	cmd := exec.Command("terraform", "plan", "-out=tfplan")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("terraform plan failed: %w\nOutput: %s", err, output)
	}
	return string(output), nil
}

// Apply runs terraform apply
func (t *CLIWrapper) Apply() error {
	cmd := exec.Command("terraform", "apply", "-auto-approve", "tfplan")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("terraform apply failed: %w\nOutput: %s", err, output)
	}
	return nil
}

// Destroy runs terraform destroy
func (t *CLIWrapper) Destroy() error {
	cmd := exec.Command("terraform", "destroy", "-auto-approve")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("terraform destroy failed: %w\nOutput: %s", err, output)
	}
	return nil
}

// Validate checks if the Terraform configuration is valid
func (t *CLIWrapper) Validate() error {
	cmd := exec.Command("terraform", "validate")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("terraform validate failed: %w\nOutput: %s", err, output)
	}
	return nil
}

// GetResources returns a list of resources managed by Terraform
func (t *CLIWrapper) GetResources() ([]string, error) {
	cmd := exec.Command("terraform", "state", "list")
	cmd.Dir = t.workingDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("failed to list terraform resources: %w\nOutput: %s", err, output)
	}
	
	outputStr := strings.TrimSpace(string(output))
	if outputStr == "" {
		return []string{}, nil
	}
	
	return strings.Split(outputStr, "\n"), nil
}

// WriteTFVars writes variables to a tfvars file
func (t *CLIWrapper) WriteTFVars(vars map[string]interface{}) error {
	var content strings.Builder
	for key, value := range vars {
		switch v := value.(type) {
		case string:
			content.WriteString(fmt.Sprintf("%s = \"%s\"\n", key, v))
		default:
			content.WriteString(fmt.Sprintf("%s = %v\n", key, v))
		}
	}
	
	tfvarsPath := filepath.Join(t.workingDir, "terraform.tfvars")
	err := os.WriteFile(tfvarsPath, []byte(content.String()), 0644)
	if err != nil {
		return fmt.Errorf("failed to write tfvars file: %w", err)
	}
	
	return nil
}