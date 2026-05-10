package terraform

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hashicorp/terraform-registry-client-go/terraform"
)

type Module struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Source      string   `json:"source"`
	Versions    []string `json:"versions"`
}

func (h *Handler) GetTerraformModules(c *gin.Context) {
	modules, err := terraform.ListModules()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	moduleList := make([]Module, len(modules))
	for i, module := range modules {
		moduleVersions := make([]string, len(module.Versions))
		for j, version := range module.Versions {
			moduleVersions[j] = version.Version
		}
		moduleList[i] = Module{
			ID:          module.Name.String(),
			Name:        module.Name.String(),
			Description: module.Description.String(),
			Source:      module.URL.String(),
			Versions:    moduleVersions,
		}
	}

	c.JSON(http.StatusOK, gin.H{"modules": moduleList})
}

func (h *Handler) GetTerraformModule(c *gin.Context) {
	name := c.Param("name")
	version := c.Query("version")

	// TODO: Implement getting a specific module version
	c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
}

// RegisterRoutes registers the Terraform catalog endpoint with the supplied mux.
// The caller can pass the default http.DefaultServeMux or any compatible mux.
func RegisterRoutes(mux http.Handler) {
	// Attempt to cast to *http.ServeMux to add a handler; if not possible, fall back to default.
	if serveMux, ok := mux.(*http.ServeMux); ok {
		serveMux.HandleFunc("/api/terraform/catalog", h.GetTerraformModules)
		serveMux.HandleFunc("/api/terraform/module/{name}", h.GetTerraformModule)
	}
}