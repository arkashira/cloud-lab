provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "example" {
  bucket = "example-bucket"
  acl    = "private"
}

output "bucket_name" {
  value = aws_s3_bucket.example.id
}