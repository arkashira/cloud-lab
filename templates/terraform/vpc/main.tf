provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "sandbox_vpc" {
  cidr_block = var.vpc_cidr

  tags = merge(
    {
      Name = "${var.environment_name}-vpc"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
      Sandbox     = "true"
    },
    var.additional_tags
  )
}

resource "aws_internet_gateway" "sandbox_igw" {
  vpc_id = aws_vpc.sandbox_vpc.id

  tags = merge(
    {
      Name = "${var.environment_name}-igw"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
    },
    var.additional_tags
  )
}

resource "aws_subnet" "private_subnets" {
  count = length(var.private_subnets_cidr)

  vpc_id            = aws_vpc.sandbox_vpc.id
  cidr_block        = var.private_subnets_cidr[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]

  tags = merge(
    {
      Name        = "${var.environment_name}-private-subnet-${count.index}"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
      SubnetType  = "Private"
    },
    var.additional_tags
  )
}

resource "aws_subnet" "public_subnets" {
  count = length(var.public_subnets_cidr)

  vpc_id            = aws_vpc.sandbox_vpc.id
  cidr_block        = var.public_subnets_cidr[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch = true

  tags = merge(
    {
      Name        = "${var.environment_name}-public-subnet-${count.index}"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
      SubnetType  = "Public"
    },
    var.additional_tags
  )
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.sandbox_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sandbox_igw.id
  }

  tags = merge(
    {
      Name        = "${var.environment_name}-public-rt"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
    },
    var.additional_tags
  )
}

resource "aws_route_table_association" "public_subnet_associations" {
  count          = length(aws_subnet.public_subnets)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_security_group" "sandbox_sg" {
  name        = "${var.environment_name}-sandbox-sg"
  description = "Security group for sandbox instances"
  vpc_id      = aws_vpc.sandbox_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    {
      Name        = "${var.environment_name}-security-group"
      Environment = var.environment_name
      ManagedBy   = "Terraform"
      Project     = "cloud-lab"
    },
    var.additional_tags
  )
}