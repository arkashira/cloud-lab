package controllers

import (
	"encoding/json"
	"net/http"
)

// APIError represents a structured error response.
type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// Experiment represents a simple experiment model.
type Experiment struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ExperimentService defines the interface for experiment operations.
type ExperimentService interface {
	GetByID(id string) (*Experiment, error)
}

// ExperimentController handles HTTP requests related to experiments.
type ExperimentController struct {
	service ExperimentService
}

// NewExperimentController creates a new ExperimentController.
func NewExperimentController(service ExperimentService) *ExperimentController {
	return &ExperimentController{service: service}
}

// GetExperiment handles GET /experiments/:id requests.
func (c *ExperimentController) GetExperiment(w http.ResponseWriter, r *http.Request) {
	// Extract the experiment ID from the URL path.
	// Expected format: /experiments/{id}
	id := r.URL.Path[len("/experiments/"):]

	// Retrieve the experiment from the service.
	exp, err := c.service.GetByID(id)
	if err != nil {
		// If the error is a "not found" error, return 404.
		if err == ErrNotFound {
			respondWithError(w, http.StatusNotFound, "experiment not found")
			return
		}
		// For all other errors, return 500.
		respondWithError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	// Marshal the experiment into JSON and write the response.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(exp)
}

// ErrNotFound is returned when an experiment cannot be found.
var ErrNotFound = &APIError{Code: 404, Message: "not found"}

// respondWithError writes a JSON error response.
func respondWithError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(APIError{Code: status, Message: message})
}