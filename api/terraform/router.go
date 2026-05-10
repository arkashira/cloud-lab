package terraform

import (
	"net/http"
)

// Router builds the HTTP multiplexer for the Terraform API.
// All routes are prefixed with /api/terraform/ to keep the namespace tidy.
func Router() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/terraform/catalog", CatalogHandler)
	// Future endpoints (e.g. /apply, /destroy) can be added here.
	return mux
}