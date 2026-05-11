package api

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gin-gonic/gin"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
)

type Lab struct {
	ID          string    `json:"id"`
	Playbook    []byte    `json:"-"`
	Status      string    `json:"status"` // pending, running, success, failure
	CreatedAt   time.Time `json:"created_at"`
	FinishedAt  *time.Time `json:"finished_at,omitempty"`
	Result      string    `json:"result,omitempty"`
	cancelFunc  context.CancelFunc
	ec2InstanceID string
}

type LabStore struct {
	mu   sync.RWMutex
	labs map[string]*Lab
}

var store = &LabStore{
	labs: make(map[string]*Lab),
	sess: session.Must(session.NewSession()),
	svc:  ec2.New(store.sess),
}

func (ac *LabStore) createEC2Instance(ctx context.Context) (string, error) {
	input := &ec2.RunInstancesInput{
		MinCount: aws.Int64(1),
		MaxCount: aws.Int64(1),
	}

	result, err := ac.svc.RunInstances(input)
	if err != nil {
		return "", fmt.Errorf("failed to create EC2 instance: %v", err)
	}

	return *result.Instances[0].InstanceId, nil
}

func (ac *LabStore) terminateEC2Instance(ctx context.Context, instanceID string) error {
	input := &ec2.TerminateInstancesInput{
		InstanceIds: []string{instanceID},
	}

	_, err := ac.svc.TerminateInstances(input)
	if err != nil {
		return fmt.Errorf("failed to terminate EC2 instance: %v", err)
	}

	return nil
}