package api

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/eks"
	"github.com/gorilla/mux"
	"k8s.io/client-go/tools/clientcmd"
)

type EKSController struct {
	eksClient *eks.EKS
}

type ClusterRequest struct {
	Size     string `json:"size"`
	NodeType string `json:"nodeType"`
}

func NewEKSController() *EKSController {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-west-2"),
	}))
	return &EKSController{
		eksClient: eks.New(sess),
	}
}

func (c *EKSController) CreateCluster(w http.ResponseWriter, r *http.Request) {
	var req ClusterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	input := &eks.CreateClusterInput{
		Name:   aws.String("sandbox-cluster"),
		RoleArn: aws.String("arn:aws:iam::123456789012:role/eks-cluster-role"),
		ResourcesVpcConfig: &eks.VpcConfigRequest{
			SubnetIds: aws.StringSlice([]string{"subnet-12345678", "subnet-87654321"}),
		},
	}

	_, err := c.eksClient.CreateCluster(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Configure kubectl context
	config := clientcmd.NewNonInteractiveClientConfig(
		clientcmd.NewDefaultClientConfigLoadingRules(),
		&clientcmd.ConfigOverrides{},
		nil,
	)
	restConfig, err := config.GetRestConfig()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Cluster created successfully",
		"config":  restConfig,
	})
}

func (c *EKSController) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/eks/cluster", c.CreateCluster).Methods("POST")
}