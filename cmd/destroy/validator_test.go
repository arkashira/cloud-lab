package destroy

import (
	"errors"
	"testing"
)

// mockOrphanChecker implements OrphanChecker for unit testing.
type mockOrphanChecker struct {
	orphans []Resource
	err     error
}

func (m *mockOrphanChecker) FindOrphans() ([]Resource, error) {
	return m.orphans, m.err
}

func TestValidator_NoOrphans(t *testing.T) {
	v := NewValidator(&mockOrphanChecker{orphans: nil, err: nil})
	if err := v.Validate(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestValidator_WithOrphans(t *testing.T) {
	orphans := []Resource{{ID: "r-123", Type: "vm"}}
	v := NewValidator(&mockOrphanChecker{orphans: orphans, err: nil})
	err := v.Validate()
	if err == nil {
		t.Fatalf("expected error due to orphans, got nil")
	}
	if !errors.Is(err, err) { // just ensure err is not nil; content checked below
		t.Fatalf("unexpected error type")
	}
	expectedMsg := "orphan resources detected"
	if err != nil && !contains(err.Error(), expectedMsg) {
		t.Fatalf("expected error to contain %q, got %q", expectedMsg, err.Error())
	}
}

func TestValidator_CheckError(t *testing.T) {
	v := NewValidator(&mockOrphanChecker{orphans: nil, err: errors.New("io failure")})
	err := v.Validate()
	if err == nil || !contains(err.Error(), "failed to check orphan resources") {
		t.Fatalf("expected wrapped check error, got %v", err)
	}
}

// helper
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || contains(s[1:], substr)))
}