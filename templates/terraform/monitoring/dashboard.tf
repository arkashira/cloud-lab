resource "aws_cloudwatch_dashboard" "axentx_sandbox_monitoring" {
  dashboard_name = "axentx-sandbox-monitoring"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title = "EC2 CPU Utilization"
          region = "us-east-1"
          metrics = [
            [
              "AWS/EC2",
              "CPUUtilization",
              {
                "id"      = "EC2CPU"
                "stat"    = "Average"
                "period"  = 60
                "unit"    = "Percent"
                "resource" = "axentx-ec2-*"
              }
            ]
          ]
          refresh = "P1M"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title = "EKS Pod Count"
          region = "us-east-1"
          metrics = [
            [
              "AWS/EKS",
              "PodCount",
              {
                "id"      = "EKSPods"
                "stat"    = "Sum"
                "period"  = 60
                "unit"    = "Count"
                "resource" = "axentx-eks-*"
              }
            ]
          ]
          refresh = "P1M"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title = "RDS CPU Utilization"
          region = "us-east-1"
          metrics = [
            [
              "AWS/RDS",
              "CPUUtilization",
              {
                "id"      = "RDSCPU"
                "stat"    = "Average"
                "period"  = 60
                "unit"    = "Percent"
                "resource" = "axentx-rds-*"
              }
            ]
          ]
          refresh = "P1M"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title = "S3 Request Count"
          region = "us-east-1"
          metrics = [
            [
              "AWS/S3",
              "NumberOfRequests",
              {
                "id"      = "S3Requests"
                "stat"    = "Sum"
                "period"  = 60
                "unit"    = "Count"
                "resource" = "axentx-s3-*"
              }
            ]
          ]
          refresh = "P1M"
        }
      }
    ]
  })
}

output "cloudwatch_dashboard_url" {
  value = aws_cloudwatch_dashboard.axentx_sandbox_monitoring.dashboard_url
}