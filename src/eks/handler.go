package eks

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// Handler provides HTTP endpoints for EKS operations.
type Handler struct {
	provisioner *Provisioner
}

// NewHandler creates a new Handler with the given provisioner.
func NewHandler(p *Provisioner) *Handler {
	return &Handler{provisioner: p}
}

// RegisterRoutes registers the EKS routes on the given router.
func (h *Handler) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/eks/create", h.CreateCluster).Methods(http.MethodPost)
	r.HandleFunc("/eks/delete/{name}", h.DeleteCluster).Methods(http.MethodDelete)
}

// CreateCluster handles POST /eks/create to provision a new cluster.
func (h *Handler) CreateCluster(w http.ResponseWriter, r *http.Request) {
	var spec ClusterSpec
	if err := json.NewDecoder(r.Body).Decode(&spec); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	ctx := r.Context()
	if err := h.provisioner.CreateCluster(ctx, spec); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// DeleteCluster handles DELETE /eks/delete/{name} to destroy a cluster.
func (h *Handler) DeleteCluster(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	ctx := r.Context()
	if err := h.provisioner.DeleteCluster(ctx, name); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}