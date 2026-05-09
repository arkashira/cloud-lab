variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "ami_id" {
  description = "ID of AMI to use for the instance"
  type        = string
  default     = "ami-0abcdef1234567890"
}

variable "instance_type" {
  description = "Type of instance to start"
  type        = string
  default     = "t2.micro"
}