```markdown
# breakeven.md

## Cost per Active User (CAU)

| Resource     | Cost per Unit | Usage per User/Month | Monthly CAU Cost |
|--------------|---------------|-----------------------|------------------|
| Compute      | $0.01/hr      | 20 hrs                | $0.20            |
| Storage      | $0.02/GiB     | 5 GiB                 | $0.10            |
| Bandwidth    | $0.01/GiB     | 10 GiB                | $0.10            |
| **Total**    |               |                       | **$0.40**        |

> Assumptions: 20h/month compute usage, 5GiB storage, 10GiB bandwidth. All costs are conservative estimates from AWS pricing.

---

## Pricing Tiers

| Tier       | Price/Mo | Users/Seat | Features                                                                 |
|------------|----------|------------|--------------------------------------------------------------------------|
| **Starter**| $0.99    | 1          | 20h compute, 5GiB storage, 10GiB bandwidth, basic AWS labs                |
| **Pro**    | $4.99    | 1          | 100h compute, 20GiB storage, 50GiB bandwidth, advanced labs, 1 support ticket/month |
| **Enterprise** | $19.99 | 10         | 500h compute, 100GiB storage, 200GiB bandwidth, custom labs, priority support, SSO |

> All tiers include access to core AWS services, sandbox isolation, and automated cleanup.

---

## Customer Acquisition Cost (CAC)

| Channel           | CAC Range   | Notes                                  |
|-------------------|-------------|----------------------------------------|
| Organic SEO       | $0 - $1     | Free traffic via content marketing     |
| Paid Ads (Google) | $5 - $15    | High competition, low conversion       |
| Community Referral| $0 - $2     | Incentivized by referral program       |
| Influencer Promo  | $10 - $25   | Limited reach, high engagement         |

> **Average CAC**: **$5.00**

---

## Lifetime Value (LTV)

| Metric              | Value       |
|---------------------|-------------|
| Avg. Monthly Revenue/User | $4.99 (Pro tier) |
| Churn Rate          | 15% annually (~1.25% monthly) |
| LTV Calculation     | $4.99 / 0.0125 = **$399.20** |
| LTV/CAC Ratio       | $399.20 / $5.00 = **79.84x** |

> Conservative churn rate; assumes Pro-tier retention.

---

## Break-even Users Count

| Metric                     | Value         |
|----------------------------|---------------|
| Fixed Costs (dev, ops, etc)| $1,000/month  |
| Variable Cost per User     | $0.40         |
| Revenue per User (Pro)     | $4.99         |
| Contribution Margin/User   | $4.59         |
| Break-even Users           | $1,000 / $4.59 ≈ **218 users** |

> Assumes all users are on Pro tier (highest revenue).

---

## Path to $10K MRR

| Tier         | Users Needed | Total MRR |
|--------------|--------------|-----------|
| Pro (10 users) | 10           | $49.90    |
| Pro (200 users)| 200          | $998.00   |
| Enterprise (50 seats) | 50      | $999.50   |
| Pro (2000 users) | 2000       | $9,980    |

> **Break-even point reached at ~218 users.**
> To hit **$10K MRR**, ship **~2,000 Pro-tier users** or **~500 Enterprise-tier users** (10-seat groups).
```