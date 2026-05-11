package repo

import (
	"context"
	"errors"

	"github.com/yourorg/cloud-lab/internal/model"
)

// SandboxRepo is a mock in-memory repository for sandboxes.
type SandboxRepo struct {
	data map[string]model.Sandbox
}

// NewSandboxRepo creates a new SandboxRepo.
func NewSandboxRepo() *SandboxRepo {
	return &SandboxRepo{data: make(map[string]model.Sandbox)}
}

// FindActive returns all sandboxes with status "active".
func (r *SandboxRepo) FindActive(ctx context.Context) ([]model.Sandbox, error) {
	var res []model.Sandbox
	for _, sb := range r.data {
		if sb.Status == "active" {
			res = append(res, sb)
		}
	}
	return res, nil
}

// Delete removes a sandbox by ID.
func (r *SandboxRepo) Delete(ctx context.Context, id string) error {
	if _, ok := r.data[id]; !ok {
		return errors.New("sandbox not found")
	}
	delete(r.data, id)
	return nil
}