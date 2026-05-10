provider "aws" {
  region = var.region
}

resource "aws_vpc" "sandbox" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = merge(
    { Name = var.name },
    { Environment = var.environment },
  )
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets_cidr_blocks)
  vpc_id            = aws_vpc.sandbox.id
  cidr_block        = element(var.public_subnets_cidr_blocks, count.index)
  availability_zone = element(var.availability_zones, count.index)
  tags = merge(
    { Name = "${var.name}-public-${count.index + 1}" },
    { Environment = var.environment },
  )
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnets_cidr_blocks)
  vpc_id            = aws_vpc.sandbox.id
  cidr_block        = element(var.private_subnets_cidr_blocks, count.index)
  availability_zone = element(var.availability_zones, count.index)
  tags = merge(
    { Name = "${var.name}-private-${count.index + 1}" },
    { Environment = var.environment },
  )
}

resource "aws_security_group" "allow_all" {
  name_prefix = "${var.name}-sg-"
  vpc_id      = aws_vpc.sandbox.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    { Name = "${var.name}-sg" },
    { Environment = var.environment },
  )
}