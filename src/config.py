"""Centralized configuration management."""
import os
from dataclasses import dataclass
from typing import List

@dataclass
class ComplianceConfig:
    """Configuration for compliance checks."""
    required_iam_policies: List[str] = None
    flow_log_group_name: str = "SandboxFlowLogs"
    flow_logs_role_arn: str = None
    vpc_cidr_block: str = "10.0.0.0/16"
    report_bucket: str = None
    session_prefix: str = "SandboxRole-"
    
    def __post_init__(self):
        self.required_iam_policies = self.required_iam_policies or [
            'AmazonS3ReadOnlyAccess',
            'AWSCloudFormationReadOnlyAccess'
        ]
        self.flow_logs_role_arn = self.flow_logs_role_arn or os.getenv(
            'FLOW_LOGS_ROLE_ARN', 
            'arn:aws:iam::123456789012:role/FlowLogsRole'
        )
        self.report_bucket = self.report_bucket or os.getenv(
            'REPORT_BUCKET',
            'compliance-reports'
        )

# Global config instance
config = ComplianceConfig()