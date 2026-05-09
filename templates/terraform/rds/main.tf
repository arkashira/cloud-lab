provider "aws" {
  region = "us-west-2"
}

resource "aws_db_instance" "example" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.4"
  instance_class       = "db.t3.micro"
  name                 = "exampledb"
  username             = "exampleuser"
  password             = "examplepassword"
  parameter_group_name = "default.postgres13"
  skip_final_snapshot  = true
}

output "db_instance_id" {
  value = aws_db_instance.example.id
}

output "db_instance_endpoint" {
  value = aws_db_instance.example.endpoint
}