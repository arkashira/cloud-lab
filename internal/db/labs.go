package db

import (
	"context"
	"time"

	"github.com/yourorg/cloud-lab/internal/model"
)

// GetLabsOlderThan returns labs that were created before now-ttl
// or have DeleteRequested=true.
func GetLabsOlderThan(ctx context.Context, ttl time.Duration) ([]model.Lab, error) {
	// Example: SELECT * FROM labs WHERE created_at < NOW() - ttl OR delete_requested = true;
	// Return the slice of model.Lab.
}

// DeleteLab removes the lab record from the database.
func DeleteLab(ctx context.Context, id string) error {
	// Example: DELETE FROM labs WHERE id = $1;
}