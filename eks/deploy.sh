#!/bin/bash

# Deploy sample application
kubectl apply -f sample-manifest.yaml

# Verify deployment
kubectl get deployments
kubectl get pods