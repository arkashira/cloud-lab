provider "aws" {
  region = "us-west-2"
}

resource "aws_iam_role" "example" {
  name        = "example-role"
  description = "Example role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Effect = "Allow"
      },
    ]
  })
}

resource "aws_iam_policy" "example" {
  name        = "example-policy"
  description = "Example policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = "*"
        Effect    = "Allow"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "example" {
  role       = aws_iam_role.example.name
  policy_arn = aws_iam_policy.example.arn
}

output "role_arn" {
  value = aws_iam_role.example.arn
}