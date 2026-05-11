package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/yourorg/eks-kubeconfig/internal/eks"
)

func main() {
	var (
		cluster = flag.String("cluster", "", "EKS cluster name")
		region  = flag.String("region", "", "AWS region (e.g. us-west-2)")
	)
	flag.Parse()

	if *cluster == "" || *region == "" {
		flag.Usage()
		os.Exit(1)
	}

	ctx := context.Background()
	kubeconfig, err := eks.GenerateKubeconfig(ctx, *cluster, *region)
	if err != nil {
		log.Fatalf("Error generating kubeconfig: %v", err)
	}

	fmt.Print(kubeconfig)
}