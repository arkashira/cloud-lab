# 📄 **user‑stories.md**

## Epic 1 – Account & Access  
*Enable developers to get into the sandbox quickly, securely, and with the right permissions.*

| # | User Story (Connextra) | Acceptance Criteria | Complexity |
|---|------------------------|---------------------|------------|
| 1 | **As a** new developer, **I want** to sign‑up with a single‑click social login (Google/GitHub), **so that** I can start a sandbox without creating a new password. | - OAuth flow redirects back to the app with a valid JWT.<br>- First‑time users are auto‑provisioned with a “Free‑Tier” sandbox quota (e.g., 2 concurrent labs).<br>- Email verification is optional but recommended; unverified users see a reminder banner.<br>- Errors (e.g., denied scopes) are displayed with clear remediation steps. | **S** |
| 2 | **As a** team lead, **I want** to invite teammates via an email link, **so that** we can share a common sandbox environment and manage usage centrally. | - Invite link contains a signed token that expires in 7 days.<br>- Invitee clicks link → auto‑creates an account linked to the inviter’s organization.<br>- Inviter can view invited members and revoke access from an “Org Settings” page.<br>- Audit log records invite creation, acceptance, and revocation. | **M** |
| 3 | **As a** security‑conscious user, **I want** to enable MFA on my account, **so that** my sandbox credentials are protected against compromise. | - MFA can be enabled via TOTP (Google Authenticator) or SMS.<br>- Once enabled, every login prompts for the second factor.<br>- Users can reset MFA via a verified email flow.<br>- UI shows MFA status prominently on the profile page. | **M** |

---

## Epic 2 – Sandbox Provisioning  
*Give developers instant, isolated AWS environments that mimic real accounts.*

| # | User Story (Connextra) | Acceptance Criteria | Complexity |
|---|------------------------|---------------------|------------|
| 4 | **As a** developer, **I want** to select a pre‑built “Lab Blueprint” (e.g., S3 bucket + Lambda), **so that** I can spin up a ready‑to‑use environment in under 2 minutes. | - Blueprint catalog displays name, short description, and estimated cost‑free resources.<br>- Selecting a blueprint triggers CloudFormation (or CDK) stack creation in a dedicated AWS Organization sub‑account.<br>- UI shows real‑time provisioning status (queued → creating → ready).<br>- On success, a “Connect” button provides AWS console URL with temporary credentials. | **M** |
| 5 | **As a** developer, **I want** to specify custom AWS region and resource limits, **so that** I can test region‑specific features without exceeding free‑tier caps. | - Region dropdown lists all supported regions (e.g., us‑east‑1, ap‑southeast‑1).<br>- Slider/input for max number of EC2 instances, S3 buckets, etc., capped at the free‑tier limits (e.g., ≤ 5 EC2, ≤ 10 GB S3).<br>- Validation prevents provisioning that would exceed limits.<br>- Provisioned resources respect the selected region. | **M** |
| 6 | **As a** DevOps engineer, **I want** to schedule automatic teardown of a sandbox after a configurable TTL (e.g., 4 hours), **so that** unused resources don’t linger and cost‑free guarantees are maintained. | - TTL can be set per lab (default 4 h, max 24 h).<br>- Countdown timer displayed on the lab dashboard.<br>- At TTL expiry, a background job deletes the underlying AWS sub‑account stack and notifies the owner via email & in‑app toast.<br>- Users can manually extend TTL before expiry. | **S** |

---

## Epic 3 – Resource Management & Monitoring  
*Allow users to interact with, observe, and control their sandbox resources safely.*

| # | User Story (Connextra) | Acceptance Criteria | Complexity |
|---|------------------------|---------------------|------------|
| 7 | **As a** developer, **I want** an integrated terminal that authenticates with my sandbox’s temporary credentials, **so that** I can run AWS CLI commands without manual credential handling. | - Terminal UI loads within the app (WebSocket‑backed).<br>- On launch, it injects temporary AccessKey/SecretKey/SessionToken (valid ≤ 1 hour).<br>- `aws sts get-caller-identity` returns the sandbox account ID.<br>- Session expires automatically; UI prompts to refresh. | **M** |
| 8 | **As a** developer, **I want** real‑time cost‑simulation metrics (e.g., “If this ran in a real account, cost would be $X/month”), **so that** I can understand the financial impact of my design. | - Cost model pulls AWS pricing API for selected region/services.<br>- Dashboard shows estimated monthly cost based on current resource count and usage patterns (e.g., 100 GB data transfer).<br>- Warning badge appears if estimated cost > $0 (i.e., beyond free tier).<br>- Users can toggle “Hide cost simulation”. | **L** |
| 9 | **As a** security‑aware user, **I want** to run a built‑in CSPM scan on my sandbox, **so that** I can see misconfigurations before moving to production. | - One‑click “Run Security Scan” triggers a lightweight CSPM engine (e.g., open‑source ScoutSuite fork).<br>- Results displayed as a list of findings with severity (Low/Medium/High) and remediation links.<br>- Scan completes within 2 minutes for typical labs.<br>- Findings are stored for 30 days and can be exported as CSV. | **L** |

---

## Epic 4 – Learning & Guidance  
*Provide contextual education so users get the most out of the sandbox.*

| # | User Story (Connextra) | Acceptance Criteria | Complexity |
|---|------------------------|---------------------|------------|
| 10 | **As a** beginner, **I want** step‑by‑step tutorials linked to each blueprint, **so that** I can learn the underlying AWS concepts while the lab runs. | - Each blueprint page includes a “Tutorial” tab with markdown‑rendered lessons.<br>- Lessons contain embedded code snippets, CLI commands, and “Run” buttons that execute the next step automatically.<br>- Progress bar tracks completed steps.<br>- Users can bookmark a lesson for later. | **M** |
| 11 | **As a** developer, **I want** to ask contextual questions to an AI assistant (e.g., “How do I grant read‑only access to this bucket?”), **so that** I get instant guidance without leaving the sandbox. | - Chat widget appears on the lab page, powered by a fine‑tuned LLM with AWS documentation context.<br>- Assistant can reference resources in the current sandbox (e.g., bucket name) and suggest CLI/Console actions.<br>- Responses include a “Copy to terminal” button.<br>- Conversation history persists for the duration of the lab. | **L** |
| 12 | **As a** product manager, **I want** usage analytics (e.g., most‑used services, drop‑off points in tutorials), **so that** we can iterate on the curriculum and improve engagement. | - Backend aggregates events: blueprint selection, tutorial step completion, AI‑assistant queries.<br>- Dashboard shows top 5 services, average session length, and tutorial completion rate.<br>- Data is anonymized per GDPR/PDPA standards.<br>- Exportable CSV for deeper analysis. | **M** |

---  

*All stories are sized for a two‑week sprint planning horizon. “L” items may be split into MVP sub‑tasks during backlog grooming.*