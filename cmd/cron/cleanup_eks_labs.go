package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"

	"github.com/yourorg/cloud-lab/internal/db"
	"github.com/yourorg/cloud-lab/internal/model"
)

const (
	// How often the cron job runs.
	cleanupInterval = 1 * time.Hour
	// How long a lab must exist before it is eligible for deletion.
	defaultTTL = 24 * time.Hour
)

// deleteCluster deletes an EKS cluster and waits until it is fully gone.
// If the cluster is already missing, the function simply returns nil.
func deleteCluster(ctx context.Context, client *eks.Client, lab model.Lab) error {
	_, err := client.DeleteCluster(ctx, &eks.DeleteClusterInput{
		Name: aws.String(lab.ClusterName),
	})
	if err != nil {
		// Ignore “not found” errors – the cluster is already gone.
		var notFound *types.ResourceNotFoundException
		if ok := aws.As(err, &notFound); ok {
			return nil
		}
		return err
	}

	// Wait until the cluster is actually deleted.
	waiter := eks.NewClusterDeletedWaiter(client)
	return waiter.Wait(ctx, &eks.DescribeClusterInput{
		Name: aws.String(lab.ClusterName),
	}, 5*time.Minute)
}

// cleanupEKSLabs is the core job that:
//
//   1. Pulls labs that are older than ttl or have DeleteRequested=true.
//   2. Deletes the corresponding EKS cluster.
//   3. Removes the lab record from the database.
func cleanupEKSLabs(ctx context.Context, cfg aws.Config, ttl time.Duration) {
	eksClient := eks.NewFromConfig(cfg)

	// 1. Get labs that need cleanup.
	labs, err := db.GetLabsOlderThan(ctx, ttl)
	if err != nil {
		log.Printf("[cron] failed to fetch old labs: %v", err)
		return
	}

	if len(labs) == 0 {
		log.Printf("[cron] no labs to clean up")
		return
	}

	// 2. Process each lab independently.
	for _, lab := range labs {
		if err := deleteCluster(ctx, eksClient, lab); err != nil {
			log.Printf("[cron] failed to delete cluster %s: %v", lab.ClusterName, err)
			continue
		}

		if err := db.DeleteLab(ctx, lab.ID); err != nil {
			log.Printf("[cron] failed to delete lab record %s: %v", lab.ID, err)
			continue
		}

		log.Printf("[cron] successfully cleaned up lab %s (%s)", lab.ID, lab.ClusterName)
	}
}

func main() {
	// Load AWS config (region, credentials, etc.).
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatalf("unable to load AWS SDK config: %v", err)
	}

	// Create a cancellable context that shuts down on SIGINT/SIGTERM.
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Graceful shutdown on OS signal.
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, os.Interrupt, os.Kill)
		<-sigCh
		log.Println("[cron] received shutdown signal")
		cancel()
	}()

	// Run the cleanup job immediately, then every cleanupInterval.
	ticker := time.NewTicker(cleanupInterval)
	defer ticker.Stop()

	// First run.
	cleanupEKSLabs(ctx, cfg, defaultTTL)

	for {
		select {
		case <-ctx.Done():
			log.Println("[cron] shutting down")
			return
		case <-ticker.C:
			cleanupEKSLabs(ctx, cfg, defaultTTL)
		}
	}
}