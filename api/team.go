package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/axentx/cloud-lab/pkg/models"
	"github.com/axentx/cloud-lab/pkg/services"
)

// TeamCreateRequest represents the payload for creating a team.
type TeamCreateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// TeamCreateResponse represents the response after creating a team.
type TeamCreateResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// InviteRequest represents the payload for inviting a user.
type InviteRequest struct {
	Email string `json:"email"`
}

// InviteResponse represents the response after sending an invite.
type InviteResponse struct {
	Token string `json:"token"`
}

// AcceptInviteRequest represents the payload for accepting an invite.
type AcceptInviteRequest struct {
	UserID uuid.UUID `json:"user_id"`
}

// AcceptInviteResponse represents the response after accepting an invite.
type AcceptInviteResponse struct {
	TeamID uuid.UUID `json:"team_id"`
}

// RegisterTeamRoutes registers team related routes on the provided router.
func RegisterTeamRoutes(r *mux.Router, svc *services.TeamService) {
	r.HandleFunc("/teams", createTeamHandler(svc)).Methods("POST")
	r.HandleFunc("/teams/{id}/invite", inviteMemberHandler(svc)).Methods("POST")
	r.HandleFunc("/invites/{token}/accept", acceptInviteHandler(svc)).Methods("POST")
}

// createTeamHandler handles POST /teams
func createTeamHandler(svc *services.TeamService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req TeamCreateRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.Name == "" {
			http.Error(w, "name is required", http.StatusBadRequest)
			return
		}
		team, err := svc.CreateTeam(req.Name, req.Description)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := TeamCreateResponse{
			ID:          team.ID,
			Name:        team.Name,
			Description: team.Description,
			CreatedAt:   team.CreatedAt,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

// inviteMemberHandler handles POST /teams/{id}/invite
func inviteMemberHandler(svc *services.TeamService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		teamID, err := uuid.Parse(vars["id"])
		if err != nil {
			http.Error(w, "invalid team id", http.StatusBadRequest)
			return
		}
		var req InviteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.Email == "" {
			http.Error(w, "email is required", http.StatusBadRequest)
			return
		}
		token, err := svc.InviteMember(teamID, req.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		resp := InviteResponse{Token: token}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

// acceptInviteHandler handles POST /invites/{token}/accept
func acceptInviteHandler(svc *services.TeamService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		token := vars["token"]
		var req AcceptInviteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.UserID == uuid.Nil {
			http.Error(w, "user_id is required", http.StatusBadRequest)
			return
		}
		teamID, err := svc.AcceptInvite(token, req.UserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp := AcceptInviteResponse{TeamID: teamID}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}