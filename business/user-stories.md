# user‑stories.md  

## Epic 1 – Workspace Management  

| # | Story | Acceptance Criteria | Complexity |
|---|-------|---------------------|------------|
| 1 | **As a team lead, I want to create a named collaborative workspace, so that my team can spin up isolated sandbox environments under a common banner.** | - A “Create Workspace” button appears on the dashboard.<br>- Workspace name must be unique within the tenant.<br>- Workspace is provisioned with a default VPC and IAM role scoped to the workspace.<br>- Workspace appears in the workspace list immediately after creation.<br>- Audit log records creator, timestamp, and workspace ID. | M |
| 2 | **As a team member, I want to join an existing workspace via an invitation link, so that I can start using the shared sandbox without admin overhead.** | - Invitation link contains a signed token valid for 7 days.<br>- Clicking the link prompts the user to accept and automatically adds them to the workspace.<br>- New member sees the workspace in their list with “Member” role.<br>- Workspace owner receives a notification of the new member.<br>- Permissions are enforced: members cannot delete the workspace. | S |
| 3 | **As an admin, I want to archive a workspace, so that unused sandboxes no longer consume resources but can be restored later.** | - “Archive” action is available only to workspace owners.<br>- Archiving stops all running resources and snapshots the IaC state.<br>- Archived workspaces are hidden from the active list but searchable in an “Archived” view.<br>- Restoration re‑creates resources from the snapshot with a single click.<br>- Archive/restore actions are logged with user and timestamp. | M |

---

## Epic 2 – Collaborative IaC Editing  

| # | Story | Acceptance Criteria | Complexity |
|---|-------|---------------------|------------|
| 4 | **As a developer, I want a real‑time shared code editor for Terraform files, so that multiple teammates can edit the same IaC script simultaneously.** | - Integrated Monaco editor loads the workspace’s `main.tf`.<br>- Changes are broadcast via WebSocket to all connected users.<br>- Presence indicator shows who is currently editing each file.<br>- Conflict‑resolution follows “last write wins” with an optional “undo” history.<br>- Editor autosaves every 5 seconds to the workspace’s Git repo. | L |
| 5 | **As a reviewer, I want to comment inline on IaC code, so that I can give feedback without leaving the sandbox UI.** | - Comment icon appears next to each line number.<br>- Clicking opens a thread anchored to that line.<br>- Comments are stored in the workspace’s GitLab merge‑request draft.<br>- Notification sent to the code author when a comment is added.<br>- Comments are visible to all workspace members. | M |
| 6 | **As a CI/CD engineer, I want the workspace to automatically run `terraform plan` on every commit, so that the team sees drift before applying changes.** | - Commit triggers a GitLab CI pipeline that runs `terraform init` and `terraform plan`.<br>- Plan output is displayed in the UI under a “Latest Plan” tab.<br>- Pipeline status (success/failure) is shown with a badge.<br>- Errors are highlighted with line numbers linking back to the editor.<br>- Plan results are retained for 30 days. | M |

---

## Epic 3 – GitLab Integration  

| # | Story | Acceptance Criteria | Complexity |
|---|-------|---------------------|------------|
| 7 | **As a workspace owner, I want to link the workspace to a GitLab project, so that all IaC code lives in a single source of truth.** | - OAuth flow lets the owner select a GitLab project (or create a new one).<br>- Repository is cloned into the workspace’s storage bucket.<br>- All editor changes are pushed as commits to the linked repo.<br>- Branch naming follows `lab/<workspace-id>` convention.<br>- Unlinking the repo prompts a confirmation and retains a read‑only snapshot. | M |
| 8 | **As a DevSecOps manager, I want merge‑request approvals enforced before `terraform apply` can run, so that changes are vetted for security compliance.** | - `terraform apply` job is gated behind a GitLab MR approval rule (e.g., 2 approvals).<br>- If approvals are missing, the UI shows a “Pending approvals” banner and blocks the apply button.<br>- Approved MR automatically triggers the apply pipeline.<br>- Audit log records approver, timestamp, and applied resources.<br>- Policy can be overridden only by a workspace admin with MFA. | L |
| 9 | **As a team member, I want to view the GitLab commit history from within cloud‑lab, so that I can trace who changed what and when.** | - “History” tab lists commits with author, message, and timestamp.<br>- Clicking a commit shows a diff view highlighting added/removed lines.<br>- Diff view is searchable and can be filtered by file type.<br>- Link to the corresponding GitLab commit page is provided.<br>- History respects the workspace’s access permissions. | S |

---

## Epic 4 – Access & Permissions  

| # | Story | Acceptance Criteria | Complexity |
|---|-------|---------------------|------------|
| 10 | **As a security officer, I want role‑based access control (RBAC) at the workspace level, so that I can restrict who can edit, apply, or delete resources.** | - Roles: Owner, Maintainer, Contributor, Viewer.<br>- Permissions matrix defines allowed actions per role.<br>- UI for assigning roles to members (search by email).<br>- Changes to roles are logged with actor and timestamp.<br>- Unauthorized actions result in a clear “Permission denied” error. | M |
| 11 | **As a compliance auditor, I want all workspace activity exported as a CSV report, so that I can feed it into external audit tools.** | - “Export Activity” button generates a CSV with columns: timestamp, user, action, resource, outcome.<br>- Export respects the selected date range (max 90 days).<br>- File download is secured via a one‑time token valid for 5 minutes.<br>- Export is only available to Owner and Viewer roles.<br>- Report includes a SHA‑256 hash for integrity verification. | S |
| 12 | **As a user, I want single‑sign‑on (SSO) via SAML/Okta, so that I can access cloud‑lab with my corporate credentials.** | - Admin can upload IdP metadata (XML) in the Settings page.<br>- Login page shows “Sign in with SSO” button.<br>- Successful SSO creates a user record linked to the IdP’s `NameID`.<br>- If SSO fails, fallback to native email/password login.<br>- Session timeout defaults to 8 hours of inactivity. | L |

---  

*All stories are written in Connextra format, include 3‑5 acceptance criteria, and are sized for sprint planning (S = ≤ 2 days, M = 2‑5 days, L = > 5 days).*