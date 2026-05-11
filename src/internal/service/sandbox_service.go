package service

import (
	"context"

	"github.com/yourorg/cloud-lab/internal/model"
	"github.com/yourorg/cloud-lab/internal/repo"
)

// SandboxService provides business logic for sandboxes.
type SandboxService struct {
	repo *repo.SandboxRepo
}

// NewSandboxService creates a new SandboxService.
func NewSandboxService(repo *repo.SandboxRepo) *SandboxService {
	return &SandboxService{repo: repo}
}

// ListActiveSandboxes returns all active sandboxes.
func (s *SandboxService) ListActiveSandboxes(ctx context.Context) ([]model.Sandbox, error) {
	return s.repo.FindActive(ctx)
}

// CleanupSandbox deletes a sandbox and its resources.
func (s *SandboxService) CleanupSandbox(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}