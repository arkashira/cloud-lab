package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestCreateCluster(t *testing.T) {
	ctrl := NewEKSController()
	r := mux.NewRouter()
	ctrl.RegisterRoutes(r)

	reqBody := map[string]string{
		"size":     "large",
		"nodeType": "t3.large",
	}
	body, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest("POST", "/eks/cluster", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}