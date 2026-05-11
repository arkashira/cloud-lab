package eks

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"
)

// ClusterSpec defines the desired state of an EKS cluster.
type ClusterSpec struct {
	Name       string
	Region     string
	NodeType   string
	NodeCount  int32
	VPCID      string
	SubnetIDs  []string
	KubeVersion string
}

// Provisioner is responsible for creating and destroying EKS clusters.
type Provisioner struct {
	eksClient *eks.Client
	ec2Client *ec2.Client
}

// NewProvisioner creates a new Provisioner with the given AWS config.
func NewProvisioner(cfg aws.Config) *Provisioner {
	return &Provisioner{
		eksClient: eks.NewFromConfig(cfg),
		ec2Client: ec2.NewFromConfig(cfg),
	}
}

// CreateCluster creates an EKS cluster and node group based on the spec.
func (p *Provisioner) CreateCluster(ctx context.Context, spec ClusterSpec) error {
	// Create the cluster
	_, err := p.eksClient.CreateCluster(ctx, &eks.CreateClusterInput{
		Name:          aws.String(spec.Name),
		RoleArn:       aws.String(fmt.Sprintf("arn:aws:iam::%s:role/EKSClusterRole", spec.VPCID)), // placeholder
		Version:       aws.String(spec.KubeVersion),
		ResourcesVpcConfig: &types.VpcConfigRequest{
			SubnetIds: spec.SubnetIDs,
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create cluster: %w", err)
	}

	// Wait for cluster to become ACTIVE
	waiter := eks.NewClusterActiveWaiter(p.eksClient)
	if err := waiter.Wait(ctx, &eks.DescribeClusterInput{Name: aws.String(spec.Name)}, 5*time.Minute); err != nil {
		return fmt.Errorf("cluster did not become active: %w", err)
	}

	// Create node group
	_, err = p.eksClient.CreateNodegroup(ctx, &eks.CreateNodegroupInput{
		ClusterName: aws.String(spec.Name),
		NodegroupName: aws.String(spec.Name + "-nodegroup"),
		NodeRole: aws.String(fmt.Sprintf("arn:aws:iam::%s:role/EKSNodeRole", spec.VPCID)), // placeholder
		ScalingConfig: &types.NodegroupScalingConfig{
			DesiredSize: aws.Int32(spec.NodeCount),
			MinSize:     aws.Int32(spec.NodeCount),
			MaxSize:     aws.Int32(spec.NodeCount),
		},
		Subnets: spec.SubnetIDs,
		InstanceTypes: []string{spec.NodeType},
	})
	if err != nil {
		return fmt.Errorf("failed to create nodegroup: %w", err)
	}

	return nil
}

// DeleteCluster deletes the EKS cluster and its node groups.
func (p *Provisioner) DeleteCluster(ctx context.Context, name string) error {
	_, err := p.eksClient.DeleteCluster(ctx, &eks.DeleteClusterInput{
		Name: aws.String(name),
	})
	if err != nil {
		return fmt.Errorf("failed to delete cluster: %w", err)
	}
	return nil
}