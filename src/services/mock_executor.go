package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type MockEksExecutor struct{}

func (m *MockEksExecutor) CreateCluster(ctx context.Context, manifest EksManifest) (string, string, error) {
	if manifest.ClusterName == "" {
		return "", "", errors.New("cluster name required")
	}
	if manifest.NodeCount <= 0 {
		return "", "", errors.New("node count must be > 0")
	}

	// Simulate provisioning delay
	select {
	case <-time.After(2 * time.Second):
	case <-ctx.Done():
		return "", "", ctx.Err()
	}

	clusterID := uuid.New().String()
	kubeconfig := "apiVersion: v1\nclusters:\n- cluster:\n    server: https://dummy.eks.amazonaws.com\n  name: " + manifest.ClusterName + "\ncontexts:\n- context:\n    cluster: " + clusterID + "\n    user: " + clusterID + "\n  name: " + clusterID + "\ncurrent-context: " + clusterID + "\nkind: Config\npreferences: {}\nusers:\n- name: " + clusterID + "\n  user:\n    token: dummy-token"

	return clusterID, kubeconfig, nil
}

func (m *MockEksExecutor) DeleteCluster(ctx context.Context, clusterID string) error {
	if clusterID == "" {
		return errors.New("cluster ID required")
	}
	// Simulate deletion delay
	select {
	case <-time.After(500 * time.Millisecond):
	case <-ctx.Done():
		return ctx.Err()
	}
	return nil
}