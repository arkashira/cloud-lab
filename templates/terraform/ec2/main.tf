provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "example" {
  ami           = "ami-0c94855ba95c71c99"
  instance_type = "t3.micro"
}

output "instance_id" {
  value = aws_instance.example.id
}

output "instance_public_ip" {
  value = aws_instance.example.public_ip
}