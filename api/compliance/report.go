package compliance

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
	"path/filepath"
)

// Report represents comprehensive compliance data generated after a sandbox session
type Report struct {
	SessionID          string            `json:"session_id"`
	Timestamp          time.Time         `json:"timestamp"`
	IAMRole            string            `json:"iam_role"`
	VPCFlowLogsEnabled bool              `json:"vpc_flow_logs_enabled"`
	BlockedResources   []BlockedResource `json:"blocked_resources"`
	AuditLog           []AuditEntry      `json:"audit_log"`
	ComplianceCheckPass bool             `json:"compliance_check_pass"`
	IAMCompliance      IAMCompliance    `json:"iam_compliance"`
	NetworkCompliance  NetworkCompliance `json:"network_compliance"`
}

// IAMCompliance tracks IAM-related compliance checks
type IAMCompliance struct {
	RoleExists bool     `json:"role_exists"`
	RoleName   string   `json:"role_name"`
	Policies   []string `json:"policies"`
	Error      string   `json:"error,omitempty"`
}

// NetworkCompliance tracks network-related compliance checks
type NetworkCompliance struct {
	VPCs             []string `json:"vpcs"`
	FlowLogsEnabled  bool     `json:"flow_logs_enabled"`
	Error            string   `json:"error,omitempty"`
}

// BlockedResource records an attempt to create a disallowed resource
type BlockedResource struct {
	ResourceType string    `json:"resource_type"`
	Reason      string    `json:"reason"`
	AttemptedAt time.Time `json:"attempted_at"`
}

// AuditEntry records a successful action performed during the session
type AuditEntry struct {
	Action    string    `json:"action"`
	Resource  string    `json:"resource"`
	Timestamp time.Time `json:"timestamp"`
}

// NewReport creates a new compliance report instance with comprehensive checks
func NewReport(sessionID, iamRole string, vpcFlowLogsEnabled bool, blocked []BlockedResource, audit []AuditEntry) *Report {
	// The compliance check passes only if there are no blocked resources
	pass := len(blocked) == 0

	return &Report{
		SessionID:          sessionID,
		Timestamp:          time.Now().UTC(),
		IAMRole:            iamRole,
		VPCFlowLogsEnabled: vpcFlowLogsEnabled,
		BlockedResources:   blocked,
		AuditLog:           audit,
		ComplianceCheckPass: pass,
		IAMCompliance:      checkIAMCompliance(iamRole),
		NetworkCompliance:  checkNetworkCompliance(),
	}
}

// checkIAMCompliance performs IAM-related compliance checks
func checkIAMCompliance(roleName string) IAMCompliance {
	// In a real implementation, this would use AWS SDK
	// This is a simplified version for demonstration
	return IAMCompliance{
		RoleExists: true,
		RoleName:   roleName,
		Policies:   []string{"SandboxPolicy"},
	}
}

// checkNetworkCompliance performs network-related compliance checks
func checkNetworkCompliance() NetworkCompliance {
	// In a real implementation, this would use AWS SDK
	// This is a simplified version for demonstration
	return NetworkCompliance{
		VPCs:            []string{"vpc-123456"},
		FlowLogsEnabled: true,
	}
}

// ToJSON serializes the report to a JSON byte slice
func (r *Report) ToJSON() ([]byte, error) {
	return json.MarshalIndent(r, "", "  ")
}

// WriteJSON writes the JSON representation of the report to the supplied file path
func (r *Report) WriteJSON(filePath string) error {
	data, err := r.ToJSON()
	if err != nil {
		return fmt.Errorf("failed to marshal report to JSON: %w", err)
	}

	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return fmt.Errorf("failed to write report to %s: %w", filePath, err)
	}
	return nil
}

// SaveToS3 saves the report to an S3 bucket (placeholder for actual implementation)
func (r *Report) SaveToS3(bucketName, key string) error {
	// In a real implementation, this would use AWS SDK
	// This is a simplified version for demonstration
	fmt.Printf("Would save report to S3 bucket %s with key %s\n", bucketName, key)
	return nil
}