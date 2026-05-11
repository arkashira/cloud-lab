package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// EKSManifest represents the minimal fields required to create an EKS cluster.
type EKSManifest struct {
	Name          string `json:"name"`
	Region        string `json:"region"`
	InstanceType  string `json:"instance_type"`
	NodeCount     int    `json:"node_count"`
	KubernetesVersion string `json:"k8s_version"`
}

// LabResponse is the response returned after creating a lab.
type LabResponse struct {
	LabID     string `json:"lab_id"`
	Kubeconfig string `json:"kubeconfig"`
}

// eksService is a minimal interface to abstract EKS operations.
type eksService interface {
	CreateCluster(ctx context.Context, m EKSManifest) (string, string, error)
	DeleteCluster(ctx context.Context, labID string) error
}

// eksController implements the API endpoints for EKS labs.
type eksController struct {
	svc eksService
}

// NewEksController creates a new controller with the given service.
func NewEksController(svc eksService) *eksController {
	return &eksController{svc: svc}
}

// CreateLab handles POST /eks/labs
func (c *eksController) CreateLab(ctx echo.Context) error {
	var manifest EKSManifest
	if err := ctx.Bind(&manifest); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid manifest"})
	}

	// Validate required fields
	if manifest.Name == "" || manifest.Region == "" || manifest.InstanceType == "" || manifest.NodeCount <= 0 {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "missing required fields"})
	}

	// Call service to create cluster
	labID, kubeconfig, err := c.svc.CreateCluster(ctx.Request().Context(), manifest)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	resp := LabResponse{
		LabID:     labID,
		Kubeconfig: kubeconfig,
	}
	return ctx.JSON(http.StatusAccepted, resp)
}

// DeleteLab handles DELETE /eks/labs/:id
func (c *eksController) DeleteLab(ctx echo.Context) error {
	labID := ctx.Param("id")
	if labID == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "lab id required"})
	}
	if err := c.svc.DeleteCluster(ctx.Request().Context(), labID); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return ctx.NoContent(http.StatusNoContent)
}

// mockEksService is a simple in-memory implementation used for testing and
// demonstration purposes. In production this would interface with AWS SDK.
type mockEksService struct {
	clusters map[string]EKSManifest
}

// NewMockEksService creates a new mock service.
func NewMockEksService() *mockEksService {
	return &mockEksService{clusters: make(map[string]EKSManifest)}
}

func (m *mockEksService) CreateCluster(ctx context.Context, manifest EKSManifest) (string, string, error) {
	// Simulate cluster creation delay
	time.Sleep(2 * time.Second)

	labID := "lab-" + manifest.Name
	m.clusters[labID] = manifest

	// Return a fake kubeconfig
	kubeconfig := "apiVersion: v1\nclusters:\n- cluster:\n    server: https://example.com\n  name: " + labID
	return labID, kubeconfig, nil
}

func (m *mockEksService) DeleteCluster(ctx context.Context, labID string) error {
	delete(m.clusters, labID)
	return nil
}