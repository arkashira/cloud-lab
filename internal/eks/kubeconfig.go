package eks

import (
	"context"
	"encoding/base64"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/eks"
)

// GenerateKubeconfig returns a kube‑config YAML string that can be used
// with kubectl to talk to the specified EKS cluster.
//
// The function:
//
//   1. Creates an AWS session for the requested region.
//   2. Describes the cluster to get its endpoint, region, and CA data.
//   3. Calls GetClusterCredentials to obtain a short‑lived token.
//   4. Formats the data into a standard kube‑config.
//
// All errors are wrapped with context‑specific messages so callers can
// surface useful diagnostics.
func GenerateKubeconfig(ctx context.Context, clusterName, region string) (string, error) {
	// 1. Create a session that will be reused for all calls.
	sess, err := session.NewSession(&aws.Config{Region: aws.String(region)})
	if err != nil {
		return "", fmt.Errorf("aws session: %w", err)
	}

	eksClient := eks.New(sess)

	// 2. Describe the cluster.
	desc, err := eksClient.DescribeClusterWithContext(ctx, &eks.DescribeClusterInput{
		ClusterName: aws.String(clusterName),
	})
	if err != nil {
		return "", fmt.Errorf("describe cluster %q: %w", clusterName, err)
	}
	if desc.Cluster == nil {
		return "", fmt.Errorf("describe cluster %q: empty response", clusterName)
	}

	// 3. Get credentials (token) for the cluster.
	creds, err := eksClient.GetClusterCredentialsWithContext(ctx, &eks.GetClusterCredentialsInput{
		ClusterName: aws.String(clusterName),
	})
	if err != nil {
		return "", fmt.Errorf("get credentials for %q: %w", clusterName, err)
	}
	if creds == nil || creds.User == nil || creds.User.AccessToken == nil {
		return "", fmt.Errorf("get credentials for %q: empty token", clusterName)
	}

	// 4. Build the kube‑config YAML.
	// The certificate authority data is already base64‑encoded by AWS.
	caData := base64.StdEncoding.EncodeToString([]byte(*desc.Cluster.CertificateAuthority.Data))

	return fmt.Sprintf(`apiVersion: v1
kind: Config
clusters:
- name: %s
  cluster:
    server: %s
    certificate-authority-data: %s
contexts:
- name: %s
  context:
    cluster: %s
    user: %s
current-context: %s
users:
- name: %s
  user:
    token: %s
`, *desc.Cluster.Name, *desc.Cluster.Endpoint, caData,
		*desc.Cluster.Name, *desc.Cluster.Name, *desc.Cluster.Name,
		*desc.Cluster.Name, *desc.Cluster.Name, *creds.User.AccessToken), nil
}