# partner‑targets.md  

**Product:** `cloud‑lab` – collaborative, browser‑based sandbox for building mock enterprise‑scale AWS environments with pre‑configured stacks and learning resources.  

---  

## Integration Roadmap (Quarterly)

| Quarter | Integration | SaaS/API | Affiliate / Rev‑Share | Effort* | Free‑Tier Limits (at launch) | Primary User Job Solved |
|---------|-------------|----------|-----------------------|--------|------------------------------|--------------------------|
| Q1‑24   | **GitHub Actions** | Source control & CI pipelines | 20 % of paid GitHub Enterprise seats that enable private repo usage for labs | **S** | 2 k actions min/mo, 500 MB storage | Auto‑provision lab environments from repo templates |
| Q1‑24   | **Terraform Cloud (VCS‑Driven Runs)** | IaC execution engine | 15 % of Terraform Cloud “Team & Governance” revenue for each active workspace | **M** | 5 k runs/mo, 1 GB state storage | Turn declarative stack definitions into live sandbox resources |
| Q2‑24   | **Slack Connect** | Team communication & notifications | $0.10 per active user‑month (referral) | **S** | 10 k messages/mo, 1 GB file storage | Real‑time lab status, alerts, and collaborative chat |
| Q2‑24   | **HashiCorp Vault (Cloud)** | Secrets management for mock credentials | 12 % of Vault “HCP” subscription per active tenant | **M** | 5 k secrets/mo, 2 GB storage | Securely inject fake API keys, DB passwords into labs |
| Q3‑24   | **Datadog APM** | Observability & performance dashboards | 10 % of Datadog “Pro” seat revenue per lab tenant | **M** | 5 M metrics/mo, 1 k custom dashboards | Give learners real‑time monitoring of their mock services |
| Q3‑24   | **Cloudflare Zero‑Trust Teams** | Secure edge access to lab UI | 8 % of Cloudflare “Teams” paid seats (per active user) | **L** | 50 k requests/day, 1 GB logs | Enforce SSO & per‑lab network policies for enterprise teams |
| Q4‑24   | **Atlassian Confluence Cloud** | Knowledge base & learning paths | 15 % of Confluence “Premium” revenue per linked space | **S** | 10 k pages, 2 GB attachments | Host curated tutorials, architecture diagrams, and lab docs |
| Q4‑24   | **Zapier** | No‑code workflow automation | $0.05 per active Zap (referral) | **S** | 100 tasks/mo, 5 Zaps | Let admins trigger lab spin‑up/down from external tools (e.g., LMS, CRM) |

\* **Effort** – Rough engineering effort to ship a production‑grade integration:  
- **S** (Small): < 2 weeks (API wrapper + OAuth flow).  
- **M** (Medium): 2‑6 weeks (webhooks, data sync, UI components).  
- **L** (Large): > 6 weeks (complex auth, multi‑tenant billing, deep UI embedding).

---

## Why These Partners?

| Partner | Rationale (Revenue + Product Fit) |
|--------|-----------------------------------|
| **GitHub** | Core to any dev workflow; labs need repo‑driven templates. GitHub’s affiliate program pays per paid seat, turning every enterprise customer into a revenue stream. |
| **Terraform Cloud** | Cloud‑lab’s value proposition is “instant, realistic infra”. Terraform is the de‑facto IaC tool; integration unlocks one‑click stack deployment and gives us a share of Terraform’s high‑margin “Team & Governance” tier. |
| **Slack** | Collaborative learning teams already live in Slack. Embedding lab status & alerts drives daily usage and yields a per‑user referral fee. |
| **HashiCorp Vault** | Mock environments must handle secret rotation without exposing real credentials. Vault’s revenue‑share aligns with our security‑focused user base. |
| **Datadog** | Observability is a key learning outcome. By surfacing Datadog dashboards inside labs we increase stickiness and capture a slice of Datadog’s subscription revenue. |
| **Cloudflare Zero‑Trust** | Enterprise customers demand secure access controls for shared sandboxes. Cloudflare’s partner program offers generous rev‑share on Teams seats, and the integration differentiates us from pure‑play sandbox tools. |
| **Confluence** | Learning resources are a core pillar of the new collaborative stacks. Embedding Confluence pages creates a seamless “lab + docs” experience and taps into Atlassian’s partner payouts. |
| **Zapier** | Enables non‑technical admins to connect cloud‑lab to LMS, HRIS, or ticketing systems without code, expanding our addressable market (training orgs, internal devops enablement). Referral fees are low‑friction and scale with usage. |

---

## Affiliate / Revenue‑Share Summary (Projected FY 2025)

| Partner | Rev‑Share % | Avg. $/Seat/mo (partner) | Expected # Paid Seats (cloud‑lab) | FY 2025 Rev (USD) |
|---------|-------------|--------------------------|----------------------------------|-------------------|
| GitHub | 20 % | $21 (Enterprise) | 250 | $1,050 |
| Terraform Cloud | 15 % | $35 (Team) | 180 | $945 |
| Slack | 10 % | $8 (Standard) | 300 | $240 |
| Vault | 12 % | $30 (HCP) | 120 | $432 |
| Datadog | 10 % | $23 (Pro) | 150 | $345 |
| Cloudflare Teams | 8 % | $12 (Teams) | 100 | $96 |
| Confluence | 15 % | $10 (Premium) | 200 | $300 |
| Zapier | 5 % | $5 (Starter) | 400 | $100 |
| **Total** | — | — | — | **$3,518** |

*Assumes 30 % conversion of free‑tier users to paid partner seats within 6 months of integration.*

---

### Next Steps  

1. **Finalize API contracts** with GitHub & Terraform Cloud (Q1‑24).  
2. **Build OAuth & webhook scaffolding** (common auth layer) – reusable for Slack, Vault, Cloudflare.  
3. **Launch beta integrations** to a pilot cohort of 50 enterprise learning teams.  
4. **Track affiliate conversions** via partner dashboards; iterate on UI/UX to boost adoption.  
5. **Publish partner‑enablement docs** (quick‑start guides, revenue‑share FAQ) to accelerate co‑marketing.  

---  

*Prepared by the Cloud‑Lab product team – Q2 2024.*