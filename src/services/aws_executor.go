package services

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"
)

type RealEksExecutor struct {
	svc *eks.Client
}

func NewRealEksExecutor(cfg aws.Config) *RealEksExecutor {
	return &RealEksExecutor{svc: eks.NewFromConfig(cfg)}
}

func (r *RealEksExecutor) CreateCluster(ctx context.Context, manifest EksManifest) (string, string, error) {
	input := &eks.CreateClusterInput{
		Name:     aws.String(manifest.ClusterName),
		RoleArn:  aws.String("arn:aws:iam::123456789012:role/EKSClusterRole"), // replace with real role
		Version:  aws.String("1.28"),
		ResourcesVpcConfig: &types.VpcConfigRequest{
			SubnetIds: []string{"subnet-abc123", "subnet-def456"}, // replace with real subnets
		},
	}

	resp, err := r.svc.CreateCluster(ctx, input)
	if err != nil {
		return "", "", err
	}
	clusterName := aws.ToString(resp.Cluster.Name)

	// Wait until cluster is ACTIVE
	waiter := eks.NewClusterAvailableWaiter(r.svc)
	if err := waiter.Wait(ctx, &eks.DescribeClusterInput{Name: aws.String(clusterName)}, 5*time.Minute); err != nil {
		return clusterName, "", err
	}

	// Build a minimal kube‑config (real implementation would pull the endpoint, cert, etc.)
	kubeconfig := fmt.Sprintf(`apiVersion: v1
clusters:
- cluster:
    server: https://%s.eks.amazonaws.com
  name: %s
contexts:
- context:
    cluster: %s
    user: %s
  name: %s
current-context: %s
kind: Config
preferences: {}
users:
- name: %s
  user:
    token: dummy-token`, clusterName, clusterName, clusterName, clusterName, clusterName, clusterName, clusterName)

	return clusterName, kubeconfig, nil
}

func (r *RealEksExecutor) DeleteCluster(ctx context.Context, clusterID string) error {
	_, err := r.svc.DeleteCluster(ctx, &eks.DeleteClusterInput{Name: aws.String(clusterID)})
	return err
}