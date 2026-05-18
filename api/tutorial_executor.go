package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

type TutorialExecutor interface {
	ExecuteCommand(ctx context.Context, req TutorialCommandRequest) (*CommandResult, error)
	RunStep(ctx context.Context, step int) (*CommandResult, error)
	GetProgress(ctx context.Context) (*Progress, error)
	GetDeployedAppURL(ctx context.Context) (string, error)
}

type tutorialExecutor struct {
	steps []TutorialStep
}

func NewTutorialExecutor() TutorialExecutor {
	return &tutorialExecutor{
		steps: DefaultTutorialSteps(),
	}
}

// DefaultTutorialSteps returns the default tutorial steps
func DefaultTutorialSteps() []TutorialStep {
	return []TutorialStep{
		{
			ID:          1,
			Name:        "Create Resource Group",
			Description: "Create a resource group in Azure",
			Command:     "az group create --name myResourceGroup --location westus",
			Timeout:     60 * time.Second,
		},
		{
			ID:          2,
			Name:        "Create Storage Account",
			Description: "Create a storage account in the resource group",
			Command:     "az storage account create --resource-group myResourceGroup --name mystorageaccount --sku Standard_LRS",
			Timeout:     120 * time.Second,
		},
		{
			ID:          3,
			Name:        "Get Storage Account Keys",
			Description: "Retrieve storage account access keys",
			Command:     "az storage account keys list --resource-group myResourceGroup --account-name mystorageaccount",
			Timeout:     30 * time.Second,
		},
	}
}

func (e *tutorialExecutor) ExecuteCommand(ctx context.Context, req TutorialCommandRequest) (*CommandResult, error) {
	result := &CommandResult{
		StepID:     req.StepID,
		ExecutedAt: time.Now(),
	}

	// Parse command and args
	parts := strings.Fields(req.Command)
	if len(parts) == 0 {
		result.Error = "empty command"
		return result, fmt.Errorf("empty command")
	}

	cmd := exec.CommandContext(ctx, parts[0], parts[1:]...)
	
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	result.Output = stdout.String()

	if err != nil {
		result.Error = stderr.String()
		if result.Error == "" {
			result.Error = err.Error()
		}
		result.Success = false
		return result, err
	}

	result.Success = true
	return result, nil
}

func (e *tutorialExecutor) RunStep(ctx context.Context, step int) (*CommandResult, error) {
	// Find the step
	var stepDef TutorialStep
	found := false
	for _, s := range e.steps {
		if s.ID == step {
			stepDef = s
			found = true
			break
		}
	}

	if !found {
		return nil, fmt.Errorf("step %d not found", step)
	}

	// Execute with timeout
	req := TutorialCommandRequest{
		StepID:  step,
		Command: stepDef.Command,
	}

	// Apply step-specific timeout
	stepCtx := ctx
	if stepDef.Timeout > 0 {
		var cancel context.CancelFunc
		stepCtx, cancel = context.WithTimeout(ctx, stepDef.Timeout)
		defer cancel()
	}

	return e.ExecuteCommand(stepCtx, req)
}

func (e *tutorialExecutor) GetProgress(ctx context.Context) (*Progress, error) {
	// In production, this would read from persistent storage
	return &Progress{
		CurrentStep: 1,
		TotalSteps:  len(e.steps),
		Completed:   0,
	}, nil
}

func (e *tutorialExecutor) GetDeployedAppURL(ctx context.Context) (string, error) {
	// Placeholder - would query actual deployment status
	return "", nil
}