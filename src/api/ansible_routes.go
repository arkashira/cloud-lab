package api

import (
	"github.com/gin-gonic/gin"
)

func createLab(c *gin.Context) {
	// ... (same as Candidate 2)

	id := uuid.New().String()
	lab := &Lab{
		ID:        id,
		Playbook:  playbook,
		Status:    "pending",
		CreatedAt: time.Now(),
	}
	store.mu.Lock()
	store.labs[id] = lab
	store.mu.Unlock()

	// Start lab execution asynchronously
	go runLab(lab)

	c.JSON(http.StatusAccepted, gin.H{"lab_id": id})
}

func runLab(lab *Lab) {
	// Set status to running
	store.mu.Lock()
	lab.Status = "running"
	store.mu.Unlock()

	// Create EC2 instance
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	instanceID, err := store.createEC2Instance(ctx)
	if err != nil {
		store.mu.Lock()
		lab.Status = "failure"
		lab.Result = "failed to create EC2 instance"
		store.mu.Unlock()
		cancel()
		return
	}
	lab.ec2InstanceID = instanceID

	// Simulate 2 minute run
	ctx, cancel = context.WithTimeout(context.Background(), 2*time.Minute)
	lab.cancelFunc = cancel
	defer cancel()

	select {
	case <-ctx.Done():
		// finished
		store.mu.Lock()
		if ctx.Err() == context.DeadlineExceeded {
			lab.Status = "failure"
			lab.Result = "playbook execution timed out"
		} else {
			// For demo, we just succeed
			lab.Status = "success"
			lab.Result = "playbook executed successfully"
		}
		now := time.Now()
		lab.FinishedAt = &now
		store.mu.Unlock()

		// Terminate EC2 instance
		if lab.Status != "running" {
			store.terminateEC2Instance(context.Background(), lab.ec2InstanceID)
		}
	case <-time.After(2 * time.Minute):
		// should not happen due to context
	}
}

// ... (same as Candidate 2)