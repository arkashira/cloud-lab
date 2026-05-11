package services

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
)

// EksManifest is the minimal payload a user submits to create a lab.
type EksManifest struct {
	ClusterName string
	NodeCount   int
}

// EksExecutor is an interface that hides the details of how a cluster is
// provisioned and destroyed.  Two concrete implementations are provided:
type EksExecutor interface {
	CreateCluster(ctx context.Context, m EksManifest) (clusterID string, kubeconfig string, err error)
	DeleteCluster(ctx context.Context, clusterID string) error
}

// LabInfo holds runtime state for a running lab.
type LabInfo struct {
	ClusterID   string
	Kubeconfig  string
	CreatedAt   time.Time
	ExpiresAt   time.Time
}