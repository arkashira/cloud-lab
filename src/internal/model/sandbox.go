package model

// Sandbox represents internal sandbox entity.
type Sandbox struct {
	ID           string
	Status       string
	Tool         string
	CostEstimate float64
	Metrics      Metrics
}

// Metrics holds resource usage data.
type Metrics struct {
	CPU    float64
	Memory float64
	Network float64
}

// SandboxResponse is the API response shape.
type SandboxResponse struct {
	ID           string  `json:"id"`
	Status       string  `json:"status"`
	Tool         string  `json:"tool"`
	CostEstimate float64 `json:"cost_estimate"`
	Metrics      Metrics `json:"metrics"`
}