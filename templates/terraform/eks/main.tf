provider "aws" {
  region = "us-west-2"
}

resource "aws_eks_cluster" "example" {
  name     = "example-cluster"
  role_arn = aws_iam_role.example.arn

  vpc_config {
    security_group_ids = [aws_security_group.example.id]
    subnet_ids         = [aws_subnet.example.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.example,
  ]
}

resource "aws_security_group" "example" {
  name        = "example-sg"
  description = "Example security group"
  vpc_id      = aws_vpc.example.id
}

resource "aws_vpc" "example" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "example" {
  cidr_block = "10.0.1.0/24"
  vpc_id     = aws_vpc.example.id
  availability_zone = "us-west-2a"
}

output "cluster_id" {
  value = aws_eks_cluster.example.id
}

output "cluster_endpoint" {
  value = aws_eks_cluster.example.endpoint
}