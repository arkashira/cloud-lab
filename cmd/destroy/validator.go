package destroy

import (
	"fmt"
)

// Resource represents a generic cloud resource.
type Resource struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}

// OrphanChecker abstracts the source of orphan detection.
type OrphanChecker interface {
	FindOrphans() ([]Resource, error)
}

// Validator validates pre‑conditions before a destroy operation.
type Validator struct {
	OrphanChecker OrphanChecker
}

// NewValidator creates a Validator with the supplied OrphanChecker.
func NewValidator(oc OrphanChecker) *Validator {
	return &Validator{OrphanChecker: oc}
}

// Validate checks that no orphaned resources exist. It returns an error
// describing any found orphans, causing the destroy command to abort.
func (v *Validator) Validate() error {
	orphans, err := v.OrphanChecker.FindOrphans()
	if err != nil {
		return fmt.Errorf("failed to check orphan resources: %w", err)
	}
	if len(orphans) > 0 {
		return fmt.Errorf("orphan resources detected: %v", orphanIDs(orphans))
	}
	return nil
}

// orphanIDs extracts just the IDs from a slice of Resources for error messages.
func orphanIDs(resources []Resource) []string {
	ids := make([]string, len(resources))
	for i, r := range resources {
		ids[i] = r.ID
	}
	return ids
}