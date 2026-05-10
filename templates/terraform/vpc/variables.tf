variable "region" {
  type        = string
  default     = "us-west-2"
  description = "AWS region"
}

variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets_cidr_blocks" {
  description = "The list of CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets_cidr_blocks" {
  description = "The list of CIDR blocks for private subnets."
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "The list of availability zones for subnets."
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

variable "name" {
  type        = string
  default     = "sandbox"
  description = "Name of the VPC"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Environment of the VPC"
}