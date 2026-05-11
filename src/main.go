package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/elbv2"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"cloud-lab/src/cron"
)

func main() {
	// Initialize MongoDB connection
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()

	// Initialize AWS session
	awsSession, err := session.NewSession()
	if err != nil {
		log.Fatal(err)
	}

	// Load labs from JSON file
	labsPath := envLabsPath()
	labs, err := cron.LoadLabs(labsPath)
	if err != nil {
		log.Fatal(err)
	}

	// Create cleanup service
	cleanupService := cron.NewCleanupService(client, awsSession, labsPath)

	// Start cleanup job in background
	go cleanupService.StartCleanupJob()

	// Graceful shutdown handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down...")
}