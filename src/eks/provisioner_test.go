package eks

import (
	"context"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
)

func TestProvisioner_CreateDeleteCluster(t *testing.T) {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		t.Skip("AWS SDK config not available, skipping integration test")
	}
	prov := NewProvisioner(cfg)

	spec := ClusterSpec{
		Name:        "test-cluster",
		Region:      cfg.Region,
		NodeType:    "t3.medium",
		NodeCount:   1,
		VPCID:       "123456789012",
		SubnetIDs:   []string{"subnet-abc123"},
		KubeVersion: "1.26",
	}

	ctx := context.Background()
	if err := prov.CreateCluster(ctx, spec); err != nil {
		t.Fatalf("CreateCluster failed: %v", err)
	}
	defer prov.DeleteCluster(ctx, spec.Name)

	if err := prov.DeleteCluster(ctx, spec.Name); err != nil {
		t.Fatalf("DeleteCluster failed: %v", err)
	}
}