package terraform

import (
	"encoding/json"
	"net/http"
)

// Module describes a pre‑built Terraform module that can be launched in a sandbox.
type Module struct {
	// Name is a short identifier (e.g., "vpc", "eks", "rds").
	Name string `json:"name"`
	// Description is a human‑readable summary of what the module provisions.
	Description string `json:"description"`
	// Version is the module version that the catalog advertises.
	Version string `json:"version,omitempty"`
	// Source is the Terraform Registry or VCS URL where the module lives.
	Source string `json:"source"`
}

/*
   In a real product the catalog would be loaded from a database,
   a configuration file, or a remote service.  For the purpose of the
   lab we keep a static slice – it is simple, deterministic and easy
   to test.
*/
var catalog = []Module{
	{
		Name:        "vpc",
		Description: "Creates a Virtual Private Cloud with public and private subnets",
		Version:     "1.0.0",
		Source:      "terraform-aws-modules/vpc/aws",
	},
	{
		Name:        "eks",
		Description: "Creates an Amazon EKS cluster with worker nodes",
		Version:     "1.0.0",
		Source:      "terraform-aws-modules/eks/aws",
	},
	{
		Name:        "rds",
		Description: "Creates an Amazon RDS database instance (PostgreSQL)",
		Version:     "1.0.0",
		Source:      "terraform-aws-modules/rds/aws",
	},
}

// GetModules returns a **copy** of the catalog so callers cannot mutate the
// internal slice.
func GetModules() []Module {
	out := make([]Module, len(catalog))
	copy(out, catalog)
	return out
}

// CatalogHandler writes the module catalog as JSON.
// It is intended to be mounted under /api/terraform/catalog.
func CatalogHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		// Explicitly reject non‑GET methods – the API is read‑only.
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	modules := GetModules()

	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	if err := enc.Encode(modules); err != nil {
		// If encoding fails we cannot recover – return a generic 500.
		http.Error(w, "failed to encode catalog", http.StatusInternalServerError)
	}
}