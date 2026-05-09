# 📊 breakeven.md – Cloud‑Lab + Enterprise‑Grade Portfolio Template  

---

## 1️⃣ Cost per **Active User** (monthly)

| Cost Component | Assumptions (per active user) | Unit Cost (US‑East‑1) | Monthly Cost (USD) |
|----------------|------------------------------|----------------------|--------------------|
| **Compute** – 1 × t3.medium (2 vCPU, 4 GiB) running 8 h / day (≈ 240 h/mo) | $0.0416 / h | 0.0416 × 240 = **$9.98** |
| **EBS Storage** – 30 GiB gp2 | $0.10 / GiB‑mo | 30 × 0.10 = **$3.00** |
| **S3 Object Store** – 20 GiB standard | $0.023 / GiB‑mo | 20 × 0.023 = **$0.46** |
| **Data Transfer** – 50 GB outbound | $0.09 / GB | 50 × 0.09 = **$4.50** |
| **Platform Overhead** – monitoring, licensing, support tooling (flat amortised) | – | – | **$2.00** |
| **Total Variable Cost / User** | – | – | **≈ $20.0** |

> **Takeaway:** Every paying seat costs us roughly **$20 / mo** to keep the sandbox alive and billable.

---

## 2️⃣ Pricing Tiers (per **seat** – monthly)

| Tier | Price (USD) | Core Features | Max Users (per org) |
|------|-------------|----------------|---------------------|
| **Starter** | **$29** | • 1 sandbox per user  <br>• Pre‑built Terraform/Ansible/EKS template (single‑env) <br>• Community Slack support <br>• 5 GB storage quota | Unlimited |
| **Professional** | **$79** | • Up to 3 collaborative sandboxes <br>• GitLab CI/CD pipelines pre‑wired <br>• Role‑based access (RBAC) <br>• Email support (24 h SLA) <br>• 20 GB storage quota | Unlimited |
| **Enterprise** | **$199** | • Unlimited sandboxes & VPC isolation <br>• SSO / SAML + SCIM provisioning <br>• Dedicated audit‑log & compliance reports <br>• Priority phone support (4 h SLA) <br>• 100 GB storage quota <br>• Custom template engineering (up to 2 per quarter) | Unlimited |

*All tiers include the underlying AWS sandbox infrastructure (the $20 variable cost above).*

---

## 3️⃣ Customer‑Acquisition Cost (CAC)

| Channel | Cost per Lead | Conversion % | CAC (USD) |
|---------|---------------|--------------|-----------|
| Paid LinkedIn ads | $1.20 | 2 % | $60 |
| Webinar + content marketing | $0.40 | 1 % | $40 |
| Direct sales outreach (AE) | $150 (salary‑portion) | 10 % | $150 |
| **Overall CAC range** | – | – | **$200 – $500** per new paying seat |

*We budget a **$350** average CAC for financial modelling.*

---

## 4️⃣ Lifetime Value (LTV)

*Assumptions*  

* Monthly churn = **5 %** (typical for SaaS dev‑tools) → **20 months** average tenure.  
* Mix of seats (realistic early‑stage distribution): **60 % Starter**, **30 % Professional**, **10 % Enterprise**.  

**Weighted ARPU**  

\[
\text{ARPU} = 0.6\times29 + 0.3\times79 + 0.1\times199 = \$61.0
\]

**LTV**  

\[
\text{LTV} = \text{ARPU} \times \frac{1}{\text{churn}} = 61 \times 20 = \boxed{\$1,220}
\]

*Since CAC maxes at $500, the LTV:CAC ratio is > 2.4 ×, satisfying the classic SaaS rule of thumb (> 3 × is ideal, but we are on a solid trajectory).*

---

## 5️⃣ Break‑Even Analysis  

### Fixed Monthly Overheads  
| Item | Monthly Cost (USD) |
|------|--------------------|
| Engineering (2 devs + 1 DevSecOps) | $15,000 |
| Cloud‑lab core platform (monitoring, CI, licensing) | $5,000 |
| Customer success / support (1 FTE) | $4,000 |
| General & admin (legal, finance, office) | $6,000 |
| **Total Fixed** | **$30,000** |

### Contribution Margin per User  

\[
\text{Contribution} = \text{Weighted ARPU} - \text{Variable Cost} = 61 - 20 = \$41
\]

### Users Required to Cover Fixed Costs  

\[
\text{Break‑Even Users} = \frac{30{,}000}{41} \approx \boxed{732\ \text{active seats}}
\]

*At 732 seats the business turns a net‑zero profit (ignoring taxes).*

---

## 6️⃣ Path to **$10 K MRR**

| Scenario | Seats Needed | Revenue Mix (Starter / Pro / Ent) |
|----------|--------------|-----------------------------------|
| **All Starter** | 345 (10 000 ÷ 29) | 345 × Starter |
| **All Professional** | 127 (10 000 ÷ 79) | 127 × Professional |
| **All Enterprise** | 51 (10 000 ÷ 199) | 51 × Enterprise |
| **Realistic Mix (60/30/10)** | **164** total | 98 × Starter (≈ $2,842) <br>49 × Professional (≈ $3,871) <br>16 × Enterprise (≈ $3,184) <br>**Total ≈ $10,000** |

> **Actionable Goal:** Acquire **≈ 100 Starter**, **≈ 50 Professional**, and **≈ 15 Enterprise** seats within the first 6 months.  
> *At the above CAC range, total acquisition spend ≈ $350 × 165 ≈ $57.8 k, which is recouped in ~ 5 months given the $1,220 LTV per seat.*

---

## 7️⃣ Summary of Key Numbers  

| Metric | Value |
|--------|-------|
| Variable cost / active user | **$20 / mo** |
| Weighted ARPU | **$61 / mo** |
| Contribution margin / user | **$41 / mo** |
| Fixed monthly overhead | **$30 k** |
| Break‑even seats | **≈ 732** |
| Average CAC | **$350** |
| LTV (20 mo) | **$1,220** |
| Seats for $10 k MRR (realistic mix) | **≈ 165** |

These figures give a clear, revenue‑first runway: once we cross ~ 750 paying seats we become cash‑positive, and the $10 k MRR milestone is reachable with a modest, targeted sales/marketing push.  

---  

*Prepared by the Cloud‑Lab Product Strategy Team – 2026‑05‑09*