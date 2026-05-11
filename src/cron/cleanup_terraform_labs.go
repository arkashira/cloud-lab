package cron

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/elbv2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type TerraformLab struct {
	ID          string    `bson:"id"`
	Name        string    `bson:"name"`
	CreatedAt   time.Time `bson:"created_at"`
	ExpiresAt   time.Time `bson:"expires_at"`
	Status      string    `bson:"status"`
	Region      string    `bson:"region"`
	InstanceID  string    `bson:"instance_id"`
	LoadBalancer string   `bson:"load_balancer"`
}

type CleanupService struct {
	mongoClient *mongo.Client
	awsSession  *session.Session
	labsPath    string
}

func NewCleanupService(mongoClient *mongo.Client, awsSession *session.Session, labsPath string) *CleanupService {
	return &CleanupService{
		mongoClient: mongoClient,
		awsSession:  awsSession,
		labsPath:    labsPath,
	}
}

func (cs *CleanupService) loadLabs() ([]TerraformLab, error) {
	f, err := os.Open(cs.labsPath)
	if os.IsNotExist(err) {
		return []TerraformLab{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("open labs file: %w", err)
	}
	defer f.Close()

	var labs []TerraformLab
	if err := json.NewDecoder(f).Decode(&labs); err != nil {
		return nil, fmt.Errorf("decode labs json: %w", err)
	}

	return labs, nil
}

func (cs *CleanupService) CleanupExpiredLabs(ctx context.Context) error {
	labs, err := cs.loadLabs()
	if err != nil {
		return fmt.Errorf("failed to load labs: %w", err)
	}

	collection := cs.mongoClient.Database("cloudlab").Collection("terraform_labs")

	// Find labs that have expired
	filter := bson.M{
		"expires_at": bson.M{"$lt": time.Now()},
		"status":     "active",
	}
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return fmt.Errorf("failed to find expired labs: %w", err)
	}
	defer cursor.Close(ctx)

	var expiredLabs []TerraformLab
	if err = cursor.All(ctx, &expiredLabs); err != nil {
		return fmt.Errorf("failed to decode labs: %w", err)
	}

	for _, lab := range labs {
		if contains(lab, expiredLabs) {
			log.Printf("Cleaning up expired lab: %s", lab.ID)

			// Terminate EC2 instance
			if err := cs.terminateEC2Instance(lab.InstanceID, lab.Region); err != nil {
				log.Printf("Failed to terminate EC2 instance %s: %v", lab.InstanceID, err)
			}

			// Delete Load Balancer
			if err := cs.deleteLoadBalancer(lab.LoadBalancer, lab.Region); err != nil {
				log.Printf("Failed to delete load balancer %s: %v", lab.LoadBalancer, err)
			}

			// Update database status
			_, err := collection.UpdateOne(
				ctx,
				bson.M{"id": lab.ID},
				bson.M{"$set": bson.M{
					"status": "expired",
					"deleted_at": time.Now(),
				}},
			)
			if err != nil {
				log.Printf("Failed to update lab status for %s: %v", lab.ID, err)
			}
		}
	}

	return nil
}

func (cs *CleanupService) terminateEC2Instance(instanceID, region string) error {
	svc := ec2.New(cs.awsSession, &aws.Config{Region: aws.String(region)})

	_, err := svc.TerminateInstances(&ec2.TerminateInstancesInput{
		InstanceIds: []*string{aws.String(instanceID)},
	})
	if err != nil {
		return fmt.Errorf("failed to terminate instance %s: %w", instanceID, err)
	}

	return nil
}

func (cs *CleanupService) deleteLoadBalancer(loadBalancerARN, region string) error {
	svc := elbv2.New(cs.awsSession, &aws.Config{Region: aws.String(region)})

	_, err := svc.DeleteLoadBalancer(&elbv2.DeleteLoadBalancerInput{
		LoadBalancerArn: aws.String(loadBalancerARN),
	})
	if err != nil {
		return fmt.Errorf("failed to delete load balancer %s: %w", loadBalancerARN, err)
	}

	return nil
}

func contains(lab TerraformLab, labs []TerraformLab) bool {
	for _, l := range labs {
		if l.ID == lab.ID {
			return true
		}
	}
	return false
}

func (cs *CleanupService) StartCleanupJob() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
			err := cs.CleanupExpiredLabs(ctx)
			cancel()

			if err != nil {
				log.Printf("Error during cleanup: %v", err)
			}
		}
	}
}

func envLabsPath() string {
	if p := os.Getenv("LABS_JSON_PATH"); p != "" {
		return p
	}
	return "./labs.json"
}