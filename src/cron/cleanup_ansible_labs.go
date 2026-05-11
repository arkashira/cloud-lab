// ────────────────────────────────────────────────────────────────────────
// src/cron/cleanup_ansible_labs.go
// ────────────────────────────────────────────────────────────────────────
package cron

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/ssm"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/yourorg/cloud-lab/internal/db"
)

// Lab is the minimal record that the cleanup job needs.
type Lab struct {
	ID         string    // lab identifier – also used as S3 bucket name, SSM document name, etc.
	CreatedAt  time.Time // creation timestamp
	InstanceID string    // EC2 instance that belongs to the lab
}

// awsClients bundles all the AWS services that the cleanup job talks to.
// It is an interface so that the unit tests can inject fakes.
type awsClients interface {
	TerminateInstance(ctx context.Context, instanceID string) error
	DeleteBucket(ctx context.Context, bucketName string) error
	DeleteSSMDocument(ctx context.Context, docName string) error
	DeleteSQSQueue(ctx context.Context, queueURL string) error
}

// awsClient is the production implementation of awsClients.
type awsClient struct {
	ec2Client *ec2.Client
	s3Client  *s3.Client
	ssmClient *ssm.Client
	sqsClient *sqs.Client
}

func (c *awsClient) TerminateInstance(ctx context.Context, instanceID string) error {
	_, err := c.ec2Client.TerminateInstances(ctx, &ec2.TerminateInstancesInput{
		InstanceIds: []string{instanceID},
	})
	return err
}

func (c *awsClient) DeleteBucket(ctx context.Context, bucketName string) error {
	_, err := c.s3Client.DeleteBucket(ctx, &s3.DeleteBucketInput{
		Bucket: &bucketName,
	})
	return err
}

func (c *awsClient) DeleteSSMDocument(ctx context.Context, docName string) error {
	_, err := c.ssmClient.DeleteDocument(ctx, &ssm.DeleteDocumentInput{
		DocumentName: &docName,
	})
	return err
}

func (c *awsClient) DeleteSQSQueue(ctx context.Context, queueURL string) error {
	_, err := c.sqsClient.DeleteQueue(ctx, &sqs.DeleteQueueInput{
		QueueUrl: &queueURL,
	})
	return err
}

// NewAWSClient creates a production awsClient using the default SDK config.
func NewAWSClient(ctx context.Context) (awsClients, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}
	return &awsClient{
		ec2Client: ec2.NewFromConfig(cfg),
		s3Client:  s3.NewFromConfig(cfg),
		ssmClient: ssm.NewFromConfig(cfg),
		sqsClient: sqs.NewFromConfig(cfg),
	}, nil
}

// RunCleanup is the entry point for the cron job.
// It can be called from a main package, a Lambda handler, or a test.
func RunCleanup(ctx context.Context, awsC awsClients) {
	cutoff := time.Now().Add(-24 * time.Hour)

	// 1️⃣  Fetch labs older than 24h
	labs, err := db.GetLabsCreatedBefore(ctx, cutoff)
	if err != nil {
		log.Printf("[cleanup] failed to fetch old labs: %v", err)
		return
	}

	// 2️⃣  Process each lab independently
	for _, lab := range labs {
		if err := deleteLabResources(ctx, awsC, lab); err != nil {
			log.Printf("[cleanup] failed to delete resources for lab %s: %v", lab.ID, err)
			// Continue – we still want to delete the DB record
		}

		if err := db.DeleteLab(ctx, lab.ID); err != nil {
			log.Printf("[cleanup] failed to delete lab record %s: %v", lab.ID, err)
		} else {
			log.Printf("[cleanup] successfully cleaned up lab %s", lab.ID)
		}
	}
}

// deleteLabResources removes all AWS resources that belong to a lab.
// It logs every failure but never returns – the caller can decide what to do.
func deleteLabResources(ctx context.Context, awsC awsClients, lab Lab) error {
	// EC2
	if err := awsC.TerminateInstance(ctx, lab.InstanceID); err != nil {
		log.Printf("[cleanup] EC2 terminate failed for %s: %v", lab.InstanceID, err)
	}

	// S3 bucket – we assume the bucket name is the lab ID
	if err := awsC.DeleteBucket(ctx, lab.ID); err != nil {
		log.Printf("[cleanup] S3 delete failed for bucket %s: %v", lab.ID, err)
	}

	// SSM document – same naming convention
	if err := awsC.DeleteSSMDocument(ctx, lab.ID); err != nil {
		log.Printf("[cleanup] SSM delete failed for document %s: %v", lab.ID, err)
	}

	// SQS queue – in a real system you would store the queue URL in the DB.
	// For this example we just use the lab ID as a placeholder.
	if err := awsC.DeleteSQSQueue(ctx, lab.ID); err != nil {
		log.Printf("[cleanup] SQS delete failed for queue %s: %v", lab.ID, err)
	}

	return nil
}