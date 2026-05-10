package mockaws

import "time"

// Instance is the object that the mock provider pretends to be an AWS EC2 instance.
type Instance struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}