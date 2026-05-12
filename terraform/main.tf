terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# ------------------------------------------------------------------
# 1. Common tags – keep them in one place
# ------------------------------------------------------------------
locals {
  common_tags = {
    Environment = "Sandbox"
    Owner       = "CloudLab"
  }
}

# ------------------------------------------------------------------
# 2. Security group – only SSH & HTTPS in, everything out
# ------------------------------------------------------------------
resource "aws_security_group" "cloud_lab_sg" {
  name        = "cloud_lab_sg"
  description = "Allow inbound SSH (22) and HTTPS (443) from anywhere"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Explicitly allow all outbound traffic – same as the default
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# ------------------------------------------------------------------
# 3. IAM role for Terraform (least‑privilege)
# ------------------------------------------------------------------
resource "aws_iam_role" "terraform_execution_role" {
  name = "terraform_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "ec2.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })

  tags = local.common_tags
}

# Custom policy that gives only the actions Terraform needs
resource "aws_iam_role_policy" "terraform_ec2_policy" {
  name = "terraform_ec2_policy"
  role = aws_iam_role.terraform_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "ec2:RunInstances",
          "ec2:TerminateInstances",
          "ec2:DescribeInstances",
          "ec2:CreateSecurityGroup",
          "ec2:DeleteSecurityGroup",
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress",
          "ec2:CreateTags",
          "ec2:DeleteTags",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeTags"
        ],
        Resource = "*"
      }
    ]
  })
}

# Instance profile so the EC2 instance can assume the role if needed
resource "aws_iam_instance_profile" "terraform_execution_profile" {
  name = "terraform_execution_profile"
  role = aws_iam_role.terraform_execution_role.name
}

# ------------------------------------------------------------------
# 4. EC2 instance – uses the SG and tags
# ------------------------------------------------------------------
resource "aws_instance" "cloud_lab_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"   # Amazon Linux 2 (us‑east‑1)
  instance_type          = "t2.micro"
  iam_instance_profile   = aws_iam_instance_profile.terraform_execution_profile.name
  vpc_security_group_ids = [aws_security_group.cloud_lab_sg.id]

  tags = local.common_tags
}