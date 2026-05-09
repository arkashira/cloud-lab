variable "region" {
  description = "The AWS region where the VPC will be created."
  type        = string
  default     = "us-west-2"
}

variable "vpc_name" {
  description = "The name of the VPC."
  type        = string
  default     = "axentx-vpc"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}