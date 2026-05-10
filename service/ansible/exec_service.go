package ansible

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

// ExecService runs Ansible playbooks on a bastion host.
type ExecService struct {
	BastionHost string // SSH address of the bastion – kept for future use
	LogStore    LogStore
	// Optional: a custom command factory for testing
	cmdFactory CommandFactory
}

// LogStore abstracts persistence of execution logs.
type LogStore interface {
	Store(ctx context.Context, runID string, logs []byte) error
	CleanupOlderThan(cutoff time.Time) error
}

// CommandFactory allows tests to inject custom exec.Command constructors.
type CommandFactory func(ctx context.Context, name string, arg ...string) *exec.Cmd

// Run executes the provided playbook zip on the bastion.
// It returns a unique runID and any error encountered.
func (s *ExecService) Run(ctx context.Context, playbookZip []byte) (string, error) {
	runID := generateRunID()

	// 1️⃣ Write zip to a temporary file
	tmpZip, err := writeTempFile("playbook-*.zip", playbookZip)
	if err != nil {
		return "", fmt.Errorf("temp‑zip: %w", err)
	}
	defer deleteFile(tmpZip)

	// 2️⃣ Extract zip to a temporary directory
	tmpDir, err := extractZip(tmpZip)
	if err != nil {
		return "", fmt.Errorf("extract‑zip: %w", err)
	}
	defer deleteDir(tmpDir)

	// 3️⃣ Build the ansible‑playbook command
	cmd := s.command(ctx, "ansible-playbook", "-i", "inventory", "site.yml")
	cmd.Dir = tmpDir

	// 4️⃣ Capture combined stdout/stderr
	var outBuf []byte
	outBuf, err = cmd.CombinedOutput()

	// 5️⃣ Persist logs – failure to store logs does NOT abort the run
	if storeErr := s.LogStore.Store(ctx, runID, outBuf); storeErr != nil {
		// Log the error somewhere – here we simply ignore it
	}

	// 6️⃣ Return runID and any execution error
	if err != nil {
		// Non‑zero exit code or other exec error
		return runID, fmt.Errorf("ansible playbook failed: %w", err)
	}
	return runID, nil
}

/* -------------------------------------------------------------------------- */
/*  Helpers – wrapped for testability                                        */
/* -------------------------------------------------------------------------- */

func (s *ExecService) command(ctx context.Context, name string, arg ...string) *exec.Cmd {
	if s.cmdFactory != nil {
		return s.cmdFactory(ctx, name, arg...)
	}
	return exec.CommandContext(ctx, name, arg...)
}

func generateRunID() string {
	return time.Now().UTC().Format("20060102150405")
}

func writeTempFile(pattern string, data []byte) (string, error) {
	f, err := os.CreateTemp("", pattern)
	if err != nil {
		return "", err
	}
	if _, err = f.Write(data); err != nil {
		f.Close()
		return "", err
	}
	if err = f.Close(); err != nil {
		return "", err
	}
	return f.Name(), nil
}

func extractZip(zipPath string) (string, error) {
	tmpDir, err := os.MkdirTemp("", "playbook-")
	if err != nil {
		return "", err
	}
	// Use the system unzip – safe because the zip is from a trusted source
	cmd := exec.Command("unzip", "-o", zipPath, "-d", tmpDir)
	if err = cmd.Run(); err != nil {
		os.RemoveAll(tmpDir)
		return "", err
	}
	return tmpDir, nil
}

func deleteFile(path string) {
	_ = os.Remove(path)
}

func deleteDir(path string) {
	_ = os.RemoveAll(path)
}

/* -------------------------------------------------------------------------- */
/*  Example LogStore implementation – in‑memory (for unit tests)             */
/* -------------------------------------------------------------------------- */

type InMemoryLogStore struct {
	mu   sync.Mutex
	data map[string][]byte
}

func NewInMemoryLogStore() *InMemoryLogStore {
	return &InMemoryLogStore{data: make(map[string][]byte)}
}

func (s *InMemoryLogStore) Store(ctx context.Context, runID string, logs []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[runID] = logs
	return nil
}

func (s *InMemoryLogStore) CleanupOlderThan(cutoff time.Time) error {
	// In‑memory store – nothing to clean up
	return nil
}

/* -------------------------------------------------------------------------- */
/*  Usage example (production)                                               */
/* -------------------------------------------------------------------------- */

func exampleUsage() {
	ctx := context.Background()
	store := NewInMemoryLogStore() // replace with DB implementation
	service := &ExecService{LogStore: store}

	zipData := []byte{ /* … */ } // read from S3, upload, etc.
	runID, err := service.Run(ctx, zipData)
	if err != nil {
		fmt.Printf("Run %s failed: %v\n", runID, err)
	} else {
		fmt.Printf("Run %s succeeded\n", runID)
	}

	// Enforce 7‑day retention
	cutoff := time.Now().Add(-7 * 24 * time.Hour)
	_ = store.CleanupOlderThan(cutoff)
}