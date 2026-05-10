package main

import (
	"fmt"
	"time"
)

// Monitor encapsulates the logic for gathering and printing sandbox status.
type Monitor struct {
	interval time.Duration
}

// NewMonitor creates a Monitor that refreshes every 30 seconds.
func NewMonitor() *Monitor {
	return &Monitor{
		interval: 30 * time.Second,
	}
}

// GetResourceCount returns the total number of sandbox resources.
// In a real implementation this would query the cloud provider or internal state.
func (m *Monitor) GetResourceCount() int {
	// Placeholder value for demonstration purposes.
	return 42
}

// RunHealthChecks validates all sandbox components and returns their health status.
func (m *Monitor) RunHealthChecks() map[string]string {
	// Placeholder checks – replace with real health‑check logic.
	return map[string]string{
		"database": "healthy",
		"cache":    "healthy",
		"api":      "healthy",
	}
}

// PrintStatus outputs the current resource count and health information.
func (m *Monitor) PrintStatus() {
	count := m.GetResourceCount()
	health := m.RunHealthChecks()

	fmt.Printf("Resource Count: %d\n", count)
	fmt.Println("Health Checks:")
	for component, status := range health {
		fmt.Printf(" - %s: %s\n", component, status)
	}
	fmt.Println()
}

// Start begins the periodic status refresh loop. It prints an initial status
// immediately and then updates every 30 seconds until the process is terminated.
func (m *Monitor) Start() {
	ticker := time.NewTicker(m.interval)
	defer ticker.Stop()

	// Initial display.
	m.PrintStatus()

	for {
		select {
		case <-ticker.C:
			m.PrintStatus()
		}
	}
}