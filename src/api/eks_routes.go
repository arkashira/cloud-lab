package api

import (
	"github.com/labstack/echo/v4"
)

// RegisterEksRoutes registers the EKS lab routes on the given Echo router.
func RegisterEksRoutes(e *echo.Echo, svc eksService) {
	controller := NewEksController(svc)

	group := e.Group("/eks")
	group.POST("/labs", controller.CreateLab)
	group.DELETE("/labs/:id", controller.DeleteLab)
}