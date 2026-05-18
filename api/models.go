package api

import "time"

// TutorialStep represents a single step in the tutorial
type TutorialStep struct {
	ID          int           `json:"id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Command     string        `json:"command"`
	Timeout     time.Duration `json:"timeout,omitempty"`
}

// TutorialCommandRequest holds the request payload for executing a tutorial command
type TutorialCommandRequest struct {
	StepID  int    `json:"step_id"`
	Command string `json:"command"`
}

// CommandResult holds the result of a command execution
type CommandResult struct {
	StepID     int       `json:"step_id"`
	Success    bool      `json:"success"`
	Output     string    `json:"output"`
	Error      string    `json:"error,omitempty"`
	ExecutedAt time.Time `json:"executed_at"`
}

// Progress represents user progress through the tutorial
type Progress struct {
	CurrentStep int `json:"current_step"`
	TotalSteps  int `json:"total_steps"`
	Completed   int `json:"completed"`
}