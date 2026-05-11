# customer-journey.md  

## Cloud‑Lab + Collaborative Enterprise Sandbox  
*Target persona*: Junior‑to‑mid‑level cloud engineers, university CS/IT programs, and small‑to‑mid SaaS teams that need a risk‑free AWS playground for team‑based learning and proof‑of‑concepts.

| Phase | Trigger Event | Friction Points | User Emotions | Opportunities to Delight | Success Metric |
|-------|---------------|----------------|---------------|--------------------------|----------------|
| **Aware** | • Reads a blog post about “hands‑on AWS labs without credit‑card”  <br>• Sees a LinkedIn carousel titled *“Build a full‑stack enterprise environment in minutes”* | • Over‑saturation of free sandbox ads <br>• Unclear whether labs support team collaboration | Curious → Skeptical | • Eye‑catching demo GIF showing 3‑person team provisioning a VPC, RDS, and IAM roles in <30 s <br>• Free “Enterprise‑Ready Lab Blueprint” PDF with a QR code to sign‑up | **CTR on awareness assets** ≥ 4 % (clicks / impressions) |
| **Consider** | • Visits cloud‑lab landing page after clicking the demo <br>• Receives an invitation from a university instructor or manager | • Limited info on pricing & data‑privacy <br>• Uncertainty about integration with existing CI/CD pipelines | Analytical → Cautious | • Interactive pricing calculator that shows **$12 /seat /mo** for “Team Starter” (up to 5 seats) vs **$8 /seat /mo** for solo <br>• Live‑chat with a solutions engineer offering a 30‑min walkthrough <br>• Trust badge: ISO‑27001, SOC‑2 Type II | **Demo‑request conversion** ≥ 25 % (visitors → booked demo) |
| **Try** | • Starts a 7‑day free trial (no credit card) after clicking “Start Lab” | • Onboarding steps feel manual (creating AWS credentials, selecting a stack) <br>• First‑time users may hit quota limits on shared resources | Excited → Frustrated (if onboarding stalls) | • One‑click “Enterprise Blueprint” button that auto‑provisions a pre‑configured VPC, subnets, IAM groups, and sample micro‑services <br>• In‑app tutorial bot that guides through the first deployment, offering “Skip” or “Explain” options <br>• Real‑time health dashboard showing resource usage vs free‑tier limits | **Trial activation rate** ≥ 80 % (sign‑ups → first lab launched) |
| **Adopt** | • Team completes the first collaborative lab and sees tangible results (e.g., a working CI pipeline) | • Need to migrate labs to paid workspace <br>• Concerns about data export & lock‑in | Confident → Evaluative | • Seamless “Upgrade to Team Starter” flow that preserves all lab state, with a **$5 seat‑upgrade credit** for the first month <br>• Export‑as‑Terraform/CloudFormation feature for easy hand‑off to production <br>• Dedicated success manager who sends a “First‑Month Wins” checklist | **Paid conversion** ≥ 45 % (trial → paid seat) |
| **Expand** | • Team adds new members, requests additional services (e.g., Redshift, SageMaker) | • Pricing tiers may not align with growing usage <br>• Need for advanced analytics on lab performance | Proud → Ambitious | • Tiered “Enterprise Pro” plan: **$20 /seat /mo** with unlimited services, usage‑based discounts (e.g., 10 % off after 200 hrs/month) <br>• Community‑driven “Lab Marketplace” where users share custom blueprints; top contributors earn **$100 /quarter** credits <br>• Quarterly business reviews that surface cost‑saving insights (e.g., “Your team saved $1,200 /yr by using spot‑instance labs”) | **Expansion MRR growth** ≥ 30 % YoY (additional seats / upgrades) |

### Narrative Flow  

1. **Aware** – A learner sees a short, high‑impact visual that promises a *real* enterprise environment without any AWS bill. The visual’s speed and collaborative angle cut through the noise.  
2. **Consider** – The landing page answers the “Is this safe & affordable?” question instantly with transparent pricing and compliance badges, moving the prospect from curiosity to a concrete intent to test.  
3. **Try** – The friction‑free, one‑click blueprint eliminates the typical “setup hell” that kills most free trials. The in‑app bot acts as a personal tutor, keeping the excitement high.  
4. **Adopt** – By preserving lab state and offering a migration credit, the product removes the “trial‑to‑pay” barrier. Export capabilities reassure teams that the sandbox is a stepping stone, not a dead‑end.  
5. **Expand** – As teams mature, they need more services and governance. Tiered pricing, a marketplace for community blueprints, and data‑driven success reviews turn a single‑seat customer into a multi‑seat, long‑term revenue engine.

---  

**Key KPI Dashboard (Monthly)**  

| KPI | Target | Measurement Tool |
|-----|--------|------------------|
| Awareness CTR | ≥ 4 % | Google Ads / LinkedIn Analytics |
| Demo‑request conversion | ≥ 25 % | HubSpot / Calendly |
| Trial activation | ≥ 80 % | Mixpanel “First Lab Launched” event |
| Paid conversion (Trial → Paid) | ≥ 45 % | Stripe + Segment |
| Expansion MRR growth | ≥ 30 % YoY | Chargebee Revenue Reports |

---  

**Next Steps for Product Team**  

1. Build the **Enterprise Blueprint** (VPC + IAM + sample micro‑services) and expose via a single API call.  
2. Implement the **in‑app tutorial bot** using AWS Lex + Lambda for low‑latency guidance.  
3. Design the **pricing calculator** UI and integrate with Stripe Billing for seat‑based plans.  
4. Draft the **Lab Marketplace** schema and launch a beta with 10 power‑users.  

*End of document.*