terraform {
  required_providers {
    terraform = {
      source  = "hashicorp/terraform"
      version = ">= 1.5.0"
    }
  }
}

provider "terraform" {
  alias  = "test"
  config = "outputs_test.tf"
}

locals {
  expected_tags = {
    lab  = "cloud-lab"
    user = "test-user"
  }
}

resource "terraform_data" "test_outputs" {
  count = 1

  provisioner "local-exec" {
    command = <<EOT
    set -e
    TF_VAR_test_user="test-user"
    terraform init -backend=false
    terraform validate
    terraform plan -out=tfplan -var-file=outputs_test.tf
    terraform apply -auto-approve -var-file=outputs_test.tf
    terraform output -json > outputs.json
    EOT
  }

  triggers = {
    always_run = timestamp()
  }
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "subnet_ids" {
  description = "List of subnet IDs"
  value       = module.vpc.subnet_ids
}

output "security_group_ids" {
  description = "List of security group IDs"
  value       = module.vpc.security_group_ids
}

output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = module.ec2.instance_id
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = module.s3.bucket_name
}

output "tags" {
  description = "The tags applied to resources"
  value       = local.expected_tags
}