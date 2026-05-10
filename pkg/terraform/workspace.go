package terraform

import (
	"encoding/json"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// Workspace represents a sandboxed Terraform environment
type Workspace struct {
	ID           string    `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	LastActivity time.Time `json:"last_activity"`
	StatePath    string    `json:"state_path"`
}

// WorkspaceStore manages all active workspaces with thread-safe operations
type WorkspaceStore struct {
	sync.RWMutex
	workspaces map[string]*Workspace
}

var (
	workspaceStore = &WorkspaceStore{
		workspaces: make(map[string]*Workspace),
	}
	ttl = 24 * time.Hour
)

// CreateWorkspaceHandler handles POST /api/terraform/workspace
func CreateWorkspaceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := uuid.NewString()
	now := time.Now().UTC()
	statePath := "/tmp/terraform/" + id + ".tfstate"

	ws := &Workspace{
		ID:           id,
		CreatedAt:    now,
		LastActivity: now,
		StatePath:    statePath,
	}

	workspaceStore.Lock()
	workspaceStore.workspaces[id] = ws
	workspaceStore.Unlock()

	go scheduleDestruction(id, ttl)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ws)
}

// TouchWorkspace updates the last activity timestamp
func TouchWorkspace(id string) {
	workspaceStore.Lock()
	if ws, ok := workspaceStore.workspaces[id]; ok {
		ws.LastActivity = time.Now().UTC()
	}
	workspaceStore.Unlock()
}

// scheduleDestruction removes the workspace after TTL of inactivity
func scheduleDestruction(id string, delay time.Duration) {
	timer := time.NewTimer(delay)
	<-timer.C

	workspaceStore.Lock()
	ws, exists := workspaceStore.workspaces[id]
	if !exists {
		workspaceStore.Unlock()
		return
	}

	// If there has been activity since the timer started, reschedule
	if time.Since(ws.LastActivity) < ttl {
		remaining := ttl - time.Since(ws.LastActivity)
		workspaceStore.Unlock()
		go scheduleDestruction(id, remaining)
		return
	}

	// Delete workspace and clean up state file
	delete(workspaceStore.workspaces, id)
	workspaceStore.Unlock()

	// Cleanup state file (best-effort)
	_ = os.Remove(ws.StatePath)
}

// RegisterRoutes registers Terraform workspace endpoints
func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/terraform/workspace", CreateWorkspaceHandler).Methods("POST")
}

// /opt/axentx/cloud-lab/pkg/api/router.go
package api

import (
	"github.com/gorilla/mux"
	"github.com/axentx/cloud-lab/pkg/terraform"
)

// NewRouter creates the main HTTP router and registers all sub-routers
func NewRouter() *mux.Router {
	r := mux.NewRouter()
	terraform.RegisterRoutes(r)
	// Other module registrations would go here
	return r
}

// /opt/axentx/cloud-lab/cmd/server/main.go
package main

import (
	"log"
	"net/http"

	"github.com/axentx/cloud-lab/pkg/api"
)

func main() {
	r := api.NewRouter()
	log.Println("Starting cloud-lab API on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

// /opt/axentx/cloud-lab/pkg/terraform/workspace_test.go
package terraform

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestCreateWorkspaceHandler(t *testing.T) {
	// Setup router
	r := mux.NewRouter()
	RegisterRoutes(r)

	// Create request
	req := httptest.NewRequest(http.MethodPost, "/api/terraform/workspace", nil)
	rec := httptest.NewRecorder()

	// Serve
	r.ServeHTTP(rec, req)

	// Verify response
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected status 201, got %d", rec.Code)
	}

	var ws Workspace
	if err := json.NewDecoder(rec.Body).Decode(&ws); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if ws.ID == "" {
		t.Fatalf("expected non-empty workspace ID")
	}

	// Verify workspace stored
	workspaceStore.RLock()
	stored, ok := workspaceStore.workspaces[ws.ID]
	workspaceStore.RUnlock()

	if !ok {
		t.Fatalf("workspace not found in store")
	}

	if stored.ID != ws.ID {
		t.Fatalf("stored ID mismatch: %s vs %s", stored.ID, ws.ID)
	}
}