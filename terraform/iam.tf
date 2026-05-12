########################
# 1️⃣  Role definition #
########################
resource "aws_iam_role" "terraform_execution_role" {
  name               = "TerraformExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json

  tags = {
    Environment = "Sandbox"
    Owner       = "CloudLab"
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

########################
# 2️⃣  Policy definition #
########################
resource "aws_iam_policy" "terraform_policy" {
  name   = "TerraformExecutionPolicy"
  policy = data.aws_iam_policy_document.terraform_policy.json

  tags = {
    Environment = "Sandbox"
    Owner       = "CloudLab"
  }
}

data "aws_iam_policy_document" "terraform_policy" {
  # ---- EC2 & Security‑Group actions ----
  statement {
    effect = "Allow"

    actions = [
      "ec2:DescribeInstances",
      "ec2:RunInstances",
      "ec2:TerminateInstances",
      "ec2:CreateSecurityGroup",
      "ec2:DeleteSecurityGroup",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:CreateTags",
      "ec2:DeleteTags"
    ]

    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/Environment"
      values   = ["Sandbox"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/Owner"
      values   = ["CloudLab"]
    }
  }

  # ---- IAM role actions ----
  statement {
    effect = "Allow"

    actions = [
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:AttachRolePolicy",
      "iam:DetachRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:PassRole",
      "iam:GetRole",
      "iam:ListAttachedRolePolicies",
      "iam:ListRolePolicies"
    ]

    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/Environment"
      values   = ["Sandbox"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:RequestTag/Owner"
      values   = ["CloudLab"]
    }
  }

  # ---- Tag‑only actions (enforce tag keys) ----
  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateTags",
      "ec2:DeleteTags",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy"
    ]

    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "aws:TagKeys"
      values   = ["Environment", "Owner"]
    }
  }
}

########################
# 3️⃣  Attach policy #
########################
resource "aws_iam_role_policy_attachment" "terraform_policy_attachment" {
  role       = aws_iam_role.terraform_execution_role.name
  policy_arn = aws_iam_policy.terraform_policy.arn
}