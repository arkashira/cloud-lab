resource "aws_vpc" "sandbox" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name        = "sandbox-vpc"
    Environment = "sandbox"
    Owner       = "axentx"
  }
}

resource "aws_subnet" "sandbox" {
  cidr_block = "10.0.1.0/24"
  vpc_id     = aws_vpc.sandbox.id
  tags = {
    Name        = "sandbox-subnet"
    Environment = "sandbox"
    Owner       = "axentx"
  }
}

resource "aws_security_group" "sandbox" {
  name        = "sandbox-sg"
  description = "Security group for sandbox"
  vpc_id      = aws_vpc.sandbox.id
  tags = {
    Name        = "sandbox-sg"
    Environment = "sandbox"
    Owner       = "axentx"
  }
}