package eks

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestGenerateKubeconfig is a *very* light integration test.
// It will hit the real AWS API, so it requires valid AWS credentials
// and an existing cluster.  For a true unit test you would mock
// the EKS client, but that is out of scope for this demo.
func TestGenerateKubeconfig(t *testing.T) {
	clusterName := "my-eks-cluster"
	region := "us-west-2"

	cfg, err := GenerateKubeconfig(context.Background(), clusterName, region)
	assert.NoError(t, err, "GenerateKubeconfig should succeed")
	assert.NotEmpty(t, cfg, "kubeconfig should not be empty")
}