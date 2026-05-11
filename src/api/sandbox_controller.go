package api

import (
	"github.com/gin-gonic/gin"
	"github.com/yourorg/cloud-lab/internal/service"
	"github.com/yourorg/cloud-lab/internal/model"
)

// SandboxController handles HTTP requests related to sandboxes.
type SandboxController struct {
	svc *service.SandboxService
}

// NewSandboxController creates a new SandboxController.
func NewSandboxController(svc *service.SandboxService) *SandboxController {
	return &SandboxController{svc: svc}
}

// RegisterRoutes registers sandbox routes to the provided router.
func (c *SandboxController) RegisterRoutes(router *gin.Engine) {
	router.GET("/sandboxes", c.ListSandboxes)
	router.DELETE("/sandboxes/:id", c.DeleteSandbox)
}

// ListSandboxes handles GET /sandboxes and returns a list of active sandboxes.
func (c *SandboxController) ListSandboxes(ctx *gin.Context) {
	sandboxes, err := c.svc.ListActiveSandboxes(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list sandboxes"})
		return
	}

	resp := make([]model.SandboxResponse, 0, len(sandboxes))
	for _, sb := range sandboxes {
		resp = append(resp, model.SandboxResponse{
			ID:          sb.ID,
			Status:      sb.Status,
			Tool:        sb.Tool,
			CostEstimate: sb.CostEstimate,
			Metrics:     sb.Metrics,
		})
	}

	ctx.JSON(http.StatusOK, resp)
}

// DeleteSandbox handles DELETE /sandboxes/{id} to clean up resources.
func (c *SandboxController) DeleteSandbox(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := c.svc.CleanupSandbox(ctx.Request.Context(), id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete sandbox"})
		return
	}

	ctx.Status(http.StatusNoContent)
}