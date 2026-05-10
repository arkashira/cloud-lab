package main

import (
	"reflect"
	"testing"
)

func TestGetResourceCount(t *testing.T) {
	m := NewMonitor()
	expected := 42
	if got := m.GetResourceCount(); got != expected {
		t.Fatalf("expected resource count %d, got %d", expected, got)
	}
}

func TestRunHealthChecks(t *testing.T) {
	m := NewMonitor()
	expected := map[string]string{
		"database": "healthy",
		"cache":    "healthy",
		"api":      "healthy",
	}
	if got := m.RunHealthChecks(); !reflect.DeepEqual(got, expected) {
		t.Fatalf("expected health checks %v, got %v", expected, got)
	}
}