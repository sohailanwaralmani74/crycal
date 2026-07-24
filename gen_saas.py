import os
import re
from generate_all_35 import get_related_grid, base_dir

saas_pages = [
    {
        "filename": "saas-pricing-packaging.md",
        "category": "saas-pricing-packaging",
        "shortName": "Pricing & Packaging",
        "title": "SaaS Pricing Calculators: Tiers, Seats & Freemium",
        "description": "Model SaaS pricing strategies: per-seat vs usage pricing, freemium conversion, price increase churn, annual plan discounts, and gating.",
        "h1": "SaaS Pricing &amp; Packaging Calculators",
        "hero_p": "Design, test, and optimize subscription pricing models — compare cost-plus vs. value-based pricing, evaluate per-seat vs. usage-based tiers, project freemium conversion revenue, model price increase churn risks, and structure annual plan discounts. Explore our specialized calculators built for SaaS leaders.",
        "overview_h2": "Optimizing SaaS Subscription Pricing & Packaging Strategy",
        "overview_text": """
<p>
  Pricing is widely recognized as the single strongest growth lever in software-as-a-service (SaaS), far exceeding customer acquisition or retention in revenue sensitivity. Aligning price tiers with customer value metrics, structuring annual prepayment discounts, and grandfathering legacy plans requires rigorous quantitative financial modeling.
</p>
<p>
  Our <strong>SaaS Pricing Calculator</strong> compares cost-plus and value-based pricing benchmarks to establish optimal price points. To choose the right monetization model, the <strong>Per-Seat vs. Usage-Based Pricing Calculator</strong> evaluates revenue predictability and expansion potential across user-based vs. consumption-based tiers.
</p>
<p>
  For product-led growth (PLG) strategies, the <strong>Freemium Conversion Rate Calculator</strong> and <strong>Feature-Gating ROI Calculator</strong> model upgrade conversion rates and expansion revenue. Additionally, tools like the <strong>Price Increase Impact Calculator</strong> evaluate churn risk vs. net expansion profit.
</p>""",
        "benchmarks_h2": "SaaS Pricing & Packaging Industry Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard B2B SaaS pricing benchmarks and monetization metrics:
</p>
<ul>
  <li><strong>Annual Prepayment Discount Standard:</strong> Standard SaaS annual plan discounts range between 15% and 20% (equivalent to offering 2 months free), boosting upfront cash flow.</li>
  <li><strong>Freemium to Paid Conversion Rate:</strong> Healthy B2B freemium products convert 2% to 5% of free users to paid plans; top-tier developer PLG tools achieve 8%+.</li>
  <li><strong>Price Increase Net Sensitivity:</strong> A 10% price increase typically causes under 2% logo churn in sticky B2B products, yielding an 8%+ net increase in total ARR.</li>
  <li><strong>Value Metric Alignment:</strong> Over 70% of high-growth SaaS companies utilize usage-based or hybrid seat-plus-usage pricing metrics rather than flat seat caps.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical SaaS Pricing Strategy Guide",
        "guide_text": """
<p>
  Follow this step-by-step framework to evaluate and execute pricing changes:
</p>
<ol>
  <li><strong>Identify Your Core Value Metric:</strong> Select a scalable value metric (e.g., active users, stored gigabytes, API calls, monthly tracked contacts) that grows naturally with customer success.</li>
  <li><strong>Establish Clear Tiered Feature Packages:</strong> Create 3 to 4 distinct packaging tiers (Starter, Pro, Enterprise) with clear feature gates targeting distinct buyer personas.</li>
  <li><strong>Calculate Upfront Cash Incentive Discounts:</strong> Structure 15% to 20% annual plan discounts to incentivize upfront annual billing and reduce short-term churn.</li>
  <li><strong>Model Price Increase Net Revenue Impact:</strong> Simulate a 10% to 15% price increase against historical churn rates to verify net ARR expansion.</li>
  <li><strong>Implement Grace Periods &amp; Grandfathering:</strong> Offer legacy customers a 6-to-12-month grandfathering period before migrating them to new pricing structures.</li>
</ol>""",
        "faqs": [
            ("Which is better for B2B SaaS: per-seat pricing or usage-based pricing?",
             "Per-seat pricing provides predictable recurring revenue and is easier to sell, but can disincentivize adoption. Usage-based pricing aligns cost directly with value and drives higher net revenue retention (NRR)."),
            ("What is a good freemium to paid conversion rate for SaaS?",
             "A standard B2B SaaS freemium conversion rate is 2% to 5%. Free trial products with credit card required upfront typically convert at 15% to 25%."),
            ("How often should a SaaS company review and update pricing?",
             "SaaS companies should review pricing strategy every 6 months and deploy updated packaging or pricing increases every 12 to 18 months as product value expands.")
        ]
    },
    {
        "filename": "saas-unit-economics.md",
        "category": "saas-unit-economics",
        "shortName": "Unit Economics",
        "title": "SaaS Unit Economics Calculators: LTV, CAC & Margin",
        "description": "Calculate LTV/CAC ratio, CAC payback period, customer lifetime value, unit contribution margin, ARPU, ARPA, and cost of service.",
        "h1": "SaaS Unit Economics Calculators",
        "hero_p": "Calculate Customer Lifetime Value (LTV), Customer Acquisition Cost (CAC), LTV/CAC ratio, CAC payback period in months, Average Revenue Per User (ARPU/ARPA), unit contribution margin, and Cost of Service. Explore our specialized calculators built for SaaS CFOs and founders.",
        "overview_h2": "Mastering SaaS Unit Economics & Efficiency",
        "overview_text": """
<p>
  Unit economics form the fundamental financial health test of any software subscription business. Analyzing the relationship between the cost to acquire a customer (CAC) and the net profit generated over that customer's lifetime (LTV) determines whether scaling marketing and sales spend creates long-term enterprise value or burns capital inefficiently.
</p>
<p>
  Our <strong>LTV/CAC Ratio Calculator</strong> measures capital efficiency across acquisition channels. The <strong>CAC Payback Period Calculator</strong> computes the exact number of months required for gross profit from a customer to fully recoup sales and marketing acquisition costs.
</p>
<p>
  To analyze account expansion, the <strong>ARPU/ARPA Calculator</strong> and <strong>Customer Lifetime Value (LTV) Calculator</strong> evaluate average revenue metrics and churn-adjusted lifetime gross margin. Additionally, tools like the <strong>Cost of Service (COGS) Calculator</strong> ensure healthy Gross Margins.
</p>""",
        "benchmarks_h2": "SaaS Unit Economics Industry Benchmarks",
        "benchmarks_text": """
<p>
  Benchmark your subscription unit economics against venture-backed SaaS industry standards:
</p>
<ul>
  <li><strong>LTV/CAC Ratio Benchmark:</strong> A healthy LTV/CAC ratio is 3.0x or higher; ratios above 5.0x suggest under-investing in acquisition, while under 2.0x indicates unsustainable CAC.</li>
  <li><strong>CAC Payback Period Target:</strong> Target CAC payback period is under 12 months for SMB SaaS, 12 to 18 months for Mid-Market, and 18 to 24 months for Enterprise.</li>
  <li><strong>SaaS Gross Margin Benchmark:</strong> Subscription gross margins should be 75% to 85%+ (COGS includes hosting, customer support, and third-party API costs).</li>
  <li><strong>Magic Number Benchmark:</strong> A Sales Magic Number above 0.75x indicates efficient sales growth ready for aggressive capital scaling.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Unit Economics Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step financial framework to calculate unit economics metrics:
</p>
<ol>
  <li><strong>Calculate Fully Burdened CAC:</strong> Divide total sales &amp; marketing spend (salaries, ads, tools, commissions) by total new customers acquired in the period.</li>
  <li><strong>Determine ARPU and Gross Margin %:</strong> Calculate Average Revenue Per User (ARPU) and subtract direct Cost of Goods Sold (COGS) to find Gross Margin %.</li>
  <li><strong>Calculate Customer Lifetime (Months):</strong> Divide 1 by your monthly customer logo churn rate (e.g., 1 ÷ 0.02 monthly churn = 50 months lifetime).</li>
  <li><strong>Calculate LTV (Customer Lifetime Value):</strong> Multiply ARPU × Gross Margin % × Customer Lifetime in months (LTV = ARPU × GM% ÷ Churn).</li>
  <li><strong>Calculate CAC Payback Period:</strong> Divide fully burdened CAC by (ARPU × Gross Margin %) to determine payback period in months.</li>
</ol>""",
        "faqs": [
            ("What is a good LTV to CAC ratio for a SaaS startup?",
             "A healthy LTV/CAC ratio is 3:1 or higher. A 3:1 ratio means a customer generates three times more gross profit over their lifetime than it cost to acquire them."),
            ("How do you calculate CAC payback period?",
             "Divide fully burdened Customer Acquisition Cost (CAC) by monthly gross profit per customer (Monthly ARPU × Gross Margin %). The target is under 12 months for SMBs."),
            ("What expenses are included in SaaS Cost of Goods Sold (COGS)?",
             "SaaS COGS includes hosting/cloud infrastructure costs (AWS/GCP), customer support team salaries, customer onboarding costs, and third-party software APIs embedded in the product.")
        ]
    },
    {
        "filename": "saas-revenue-growth-metrics.md",
        "category": "saas-revenue-growth-metrics",
        "shortName": "Revenue & Growth Metrics",
        "title": "SaaS Growth Calculators: ARR, MRR & Rule of 40",
        "description": "Track SaaS revenue performance with ARR, MRR growth rate, CMGR, Net Revenue Retention (NRR), Gross Retention (GRR), and Rule of 40.",
        "h1": "SaaS Revenue &amp; Growth Metrics Calculators",
        "hero_p": "Calculate Annual Recurring Revenue (ARR), Monthly Recurring Revenue (MRR) growth rates, Compound Monthly Growth Rate (CMGR), Net Revenue Retention (NRR), Gross Revenue Retention (GRR), and the Rule of 40. Explore our specialized calculators built for SaaS finance teams.",
        "overview_h2": "Comprehensive SaaS Recurring Revenue & Retention Metrics",
        "overview_text": """
<p>
  Recurring revenue models require specialized accounting metrics to track business momentum, expansion velocity, and compounding financial health. Standard GAAP revenue lags behind operational reality, making Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Net Revenue Retention (NRR), and Gross Revenue Retention (GRR) the primary metrics evaluated by operators and investors.
</p>
<p>
  Our <strong>MRR &amp; ARR Calculator</strong> tracks new, expansion, contraction, and churned MRR components. The <strong>Net Revenue Retention (NRR) Calculator</strong> and <strong>Gross Revenue Retention (GRR) Calculator</strong> measure revenue expansion and churn from existing customer cohorts.
</p>
<p>
  To measure overall efficiency, the <strong>Rule of 40 Calculator</strong> balances revenue growth rate against operating profit margin. Additionally, tools like the <strong>CMGR Calculator</strong> model month-over-month growth compounding.
</p>""",
        "benchmarks_h2": "SaaS Revenue & Retention Industry Benchmarks",
        "benchmarks_text": """
<p>
  Benchmark your recurring revenue growth metrics against top-quartile B2B SaaS benchmarks:
</p>
<ul>
  <li><strong>Net Revenue Retention (NRR) Benchmark:</strong> Enterprise SaaS targets 120%+ NRR; Mid-Market targets 110% to 120% NRR; SMB SaaS targets 100%+ NRR.</li>
  <li><strong>Gross Revenue Retention (GRR) Ceiling:</strong> Top-tier SaaS companies achieve 90% to 95%+ GRR (which excludes expansion revenue and caps maximum churn).</li>
  <li><strong>The Rule of 40 Benchmark:</strong> Sum of Year-over-Year Revenue Growth Rate % + Free Cash Flow Margin % should equal or exceed 40% (e.g., 30% growth + 10% FCF margin = 40%).</li>
  <li><strong>CMGR Growth Target:</strong> Early-stage seed to Series A startups target 5% to 7%+ Compound Monthly Growth Rate (CMGR) in MRR.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical SaaS Revenue Metrics Guide",
        "guide_text": """
<p>
  Follow this step-by-step accounting framework to track recurring revenue metrics:
</p>
<ol>
  <li><strong>Segment Monthly Recurring Revenue (MRR):</strong> Break ending MRR into 4 core buckets: New MRR + Expansion MRR - Contraction MRR - Churned MRR.</li>
  <li><strong>Calculate Annual Recurring Revenue (ARR):</strong> Multiply normalized ending monthly recurring revenue by 12 (ARR = MRR × 12).</li>
  <li><strong>Calculate Net Revenue Retention (NRR):</strong> Formula: [(Starting MRR + Expansion - Contraction - Churn) ÷ Starting MRR] × 100 over a 12-month cohort.</li>
  <li><strong>Calculate Gross Revenue Retention (GRR):</strong> Formula: [(Starting MRR - Contraction - Churn) ÷ Starting MRR] × 100 (GRR cannot exceed 100%).</li>
  <li><strong>Calculate Rule of 40 Score:</strong> Add annual YoY ARR growth percentage to annual EBITDA or Free Cash Flow margin percentage.</li>
</ol>""",
        "faqs": [
            ("What is the difference between Net Revenue Retention (NRR) and Gross Revenue Retention (GRR)?",
             "NRR includes expansion revenue (upsells, cross-sells) from existing customers, allowing it to exceed 100%. GRR excludes expansion revenue, measuring pure revenue retention (max 100%)."),
            ("What is a good Rule of 40 score for a SaaS company?",
             "A Rule of 40 score of 40% or higher indicates strong balance between revenue growth and profitability. Top-tier IPO-bound SaaS companies achieve 50% to 60%+."),
            ("How do I calculate Compound Monthly Growth Rate (CMGR)?",
             "CMGR = (Ending MRR ÷ Starting MRR)^(1 ÷ Number of Months) - 1. It measures the steady compound monthly growth rate required to grow from starting to ending MRR.")
        ]
    },
    {
        "filename": "saas-churn-retention.md",
        "category": "saas-churn-retention",
        "shortName": "Churn & Retention",
        "title": "SaaS Churn Calculators: Logo, Revenue & Cohorts",
        "description": "Measure customer logo churn, revenue churn, cohort retention curves, involuntary churn rates, win-back rates, and churn costs.",
        "h1": "SaaS Churn &amp; Retention Metrics Calculators",
        "hero_p": "Calculate customer logo churn rate %, monthly/annual revenue churn %, cohort retention decay curves, involuntary credit card churn, win-back rate campaign ROI, and customer churn financial costs. Explore our specialized calculators built for customer success teams.",
        "overview_h2": "Understanding SaaS Churn Dynamics & Customer Retention",
        "overview_text": """
<p>
  Churn is the silent killer of recurring revenue growth. Even strong new customer acquisition cannot sustain a SaaS business if customer logo churn or revenue contraction drains the recurring subscriber base. Reducing churn accelerates compounding growth by creating a leaky-bucket-free customer foundation.
</p>
<p>
  Our <strong>Customer Logo Churn Calculator</strong> and <strong>Revenue Churn Rate Calculator</strong> measure logo loss vs. dollar loss over monthly and annual timeframes. The <strong>Cohort Retention Calculator</strong> tracks retention decay curves across customer signup cohorts over time.
</p>
<p>
  To address payment failures, the <strong>Involuntary Churn Calculator</strong> isolates credit card expiration failures from active cancellations. Additionally, tools like the <strong>Churn Cost Calculator</strong> quantify total financial revenue loss over multi-year horizons.
</p>""",
        "benchmarks_h2": "SaaS Churn & Retention Industry Benchmarks",
        "benchmarks_text": """
<p>
  Benchmark your customer churn metrics against acceptable B2B SaaS industry rates:
</p>
<ul>
  <li><strong>Monthly Logo Churn Target:</strong> Enterprise SaaS targets &lt; 0.5% monthly logo churn (&lt; 6% annual); Mid-Market targets 1% to 1.5% monthly; SMB SaaS targets &lt; 2% to 3% monthly.</li>
  <li><strong>Involuntary Credit Card Churn Share:</strong> Involuntary churn (failed credit cards, expired cards) accounts for 20% to 40% of total churn in B2C and SMB SaaS.</li>
  <li><strong>Negative Churn Benchmark:</strong> Achieved when expansion MRR from retained customers exceeds total dollar loss from churned and contracted customers (NRR &gt; 100%).</li>
  <li><strong>Customer Lifetime (Months) Formula:</strong> Average Customer Lifetime in months = 1 ÷ Monthly Logo Churn Rate decimal (e.g., 1 ÷ 0.015 = 66.7 months).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Churn Reduction Guide",
        "guide_text": """
<p>
  Follow this step-by-step methodology to audit churn and implement retention workflows:
</p>
<ol>
  <li><strong>Separate Logo Churn from Revenue Churn:</strong> Calculate logo churn percentage (customers lost ÷ starting customers) and revenue churn percentage (MRR lost ÷ starting MRR).</li>
  <li><strong>Isolate Voluntary vs. Involuntary Churn:</strong> Identify churn caused by active cancellations vs. failed credit card transactions and dunning errors.</li>
  <li><strong>Deploy Automated Dunning Systems:</strong> Implement automated pre-expiration emails, account updater APIs, and smart retry logic to recover failed payments.</li>
  <li><strong>Perform Cohort Analysis:</strong> Track customer retention by monthly cohort to identify when churn spikes (e.g., Month 3 onboarding drop-off vs Month 12 renewal).</li>
  <li><strong>Calculate Win-Back Campaign ROI:</strong> Model win-back offer discounts against reactivated customer lifetime value to optimize win-back campaigns.</li>
</ol>""",
        "faqs": [
            ("What is the difference between logo churn and revenue churn?",
             "Logo churn measures the percentage of customer accounts lost. Revenue churn measures the percentage of monthly recurring revenue (MRR) lost from cancellations and downgrades."),
            ("What is negative churn in SaaS?",
             "Negative churn occurs when expansion revenue (upsells, cross-sells) from existing retained customers exceeds the revenue lost from churned and contracted customers."),
            ("How do I reduce involuntary credit card churn?",
             "Reduce involuntary churn by using credit card auto-updater services (Stripe/Adyen), automated dunning email sequences, in-app billing alerts, and smart retry algorithms.")
        ]
    },
    {
        "filename": "saas-sales-funnel.md",
        "category": "saas-sales-funnel",
        "shortName": "Sales & Funnel",
        "title": "SaaS Sales Funnel Calculators: Win Rate & Quota",
        "description": "Optimize SaaS sales pipelines with conversion rates, sales cycle length, pipeline coverage ratios, quota attainment, and demo closes.",
        "h1": "SaaS Sales &amp; Funnel Optimization Calculators",
        "hero_p": "Calculate funnel conversion rates (MQL to SQL to Close), sales cycle length duration, pipeline coverage ratios, sales rep quota attainment, demo-to-close conversion rates, and quota-to-OTE ratios. Explore our specialized calculators built for SaaS sales leaders.",
        "overview_h2": "Optimizing B2B SaaS Sales Pipelines & Conversion",
        "overview_text": """
<p>
  B2B SaaS sales performance depends on building predictable pipeline conversion mechanics across every stage of the funnel — from Marketing Qualified Leads (MQLs) to Sales Qualified Leads (SQLs), opportunity demos, and closed-won deals. Sizing pipeline coverage and monitoring sales velocity ensures sales targets are met consistently.
</p>
<p>
  Our <strong>Sales Funnel Conversion Calculator</strong> maps stage-by-stage drop-off rates across the entire buyer journey. The <strong>Pipeline Coverage Ratio Calculator</strong> determines required open deal volume needed to achieve quarterly revenue quotas based on historical win rates.
</p>
<p>
  For sales team performance, the <strong>Win Rate Calculator</strong> and <strong>Sales Quota Attainment Calculator</strong> measure rep deal efficiency. Additionally, tools like the <strong>Sales Cycle Length Calculator</strong> optimize deal velocity.
</p>""",
        "benchmarks_h2": "SaaS Sales Pipeline Industry Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard B2B SaaS sales funnel conversion benchmarks:
</p>
<ul>
  <li><strong>Pipeline Coverage Ratio Target:</strong> Standard sales pipeline coverage target is 3.0x to 4.0x quota (e.g., $3M to $4M in open pipeline for a $1M quota).</li>
  <li><strong>MQL to SQL Conversion Benchmark:</strong> Healthy B2B SaaS funnels convert 12% to 18% of Marketing Qualified Leads (MQLs) into Sales Qualified Leads (SQLs).</li>
  <li><strong>Demo to Closed-Won Conversion:</strong> Executive demo-to-close conversion rates average 20% to 25% for qualified SQL opportunities.</li>
  <li><strong>Quota-to-OTE Ratio Standard:</strong> An Account Executive's annual quota should equal 4.0x to 5.0x their On-Target Earnings (OTE = Base Salary + Variable Commission).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Sales Funnel Optimization Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to audit your sales pipeline and forecast revenue:
</p>
<ol>
  <li><strong>Map Complete Sales Stage Definitions:</strong> Establish strict entry criteria for MQL, SQL, Opportunity Demo, Proposal, and Closed-Won deal stages.</li>
  <li><strong>Calculate Stage Conversion Rates:</strong> Measure historical percentage conversion between consecutive funnel stages (e.g., Demo to Proposal conversion %).</li>
  <li><strong>Calculate Overall Opportunity Win Rate:</strong> Divide total closed-won deals by total closed (won + lost) opportunities over a 90-day period.</li>
  <li><strong>Determine Required Pipeline Coverage:</strong> Divide target revenue quota by overall win rate to determine total required open pipeline volume.</li>
  <li><strong>Measure Sales Velocity Duration:</strong> Calculate average days required for a deal to move from initial MQL lead creation to signed contract.</li>
</ol>""",
        "faqs": [
            ("What is a good pipeline coverage ratio for B2B SaaS sales?",
             "A standard pipeline coverage ratio is 3x to 4x your target revenue quota. If your team's win rate is 25%, you need 4x pipeline coverage to hit your target."),
            ("How do you calculate sales win rate?",
             "Divide total closed-won deals by total closed opportunities (won + lost) over a specific time period. For example, 25 won deals out of 100 closed opportunities equals a 25% win rate."),
            ("What is a standard Quota-to-OTE ratio for SaaS Account Executives?",
             "A standard Quota-to-OTE ratio is 4x to 5x. For example, an AE with an On-Target Earning (OTE) of $150,000 should carry an annual sales quota of $600,000 to $750,000.")
        ]
    },
    {
        "filename": "saas-fundraising-valuation.md",
        "category": "saas-fundraising-valuation",
        "shortName": "Fundraising & Valuation",
        "title": "SaaS Valuation Calculators: Cap Table & Runway",
        "description": "Calculate SaaS ARR multiples, startup runway, cash burn rate, burn multiple, pre vs post money valuation, and SAFE note conversion.",
        "h1": "SaaS Fundraising &amp; Valuation Calculators",
        "hero_p": "Calculate SaaS valuation ARR revenue multiples, monthly cash burn rate &amp; operating runway, Burn Multiple capital efficiency, pre-money vs. post-money cap table dilution, SAFE note conversion, and founder equity ownership. Explore our specialized calculators built for SaaS founders.",
        "overview_h2": "SaaS Financial Modeling & Venture Capital Valuation",
        "overview_text": """
<p>
  Fundraising and capital allocation represent critical strategic milestones for venture-backed SaaS startups. Valuing a SaaS business requires evaluating ARR growth velocity, Net Revenue Retention, gross margins, and burn rate capital efficiency against current venture market valuation multiples.
</p>
<p>
  Our <strong>SaaS Valuation Calculator</strong> computes implied enterprise value based on ARR revenue multiples and growth tier benchmarks. The <strong>Runway Calculator</strong> and <strong>Burn Rate Calculator</strong> estimate exact months of operational runway remaining before cash exhaustion.
</p>
<p>
  To measure capital efficiency, the <strong>Burn Multiple Calculator</strong> evaluates net burn against net new ARR generated. Additionally, tools like the <strong>SAFE Note Conversion Calculator</strong> and <strong>Pre/Post-Money Valuation Calculator</strong> model cap table dilution.
</p>""",
        "benchmarks_h2": "SaaS Venture Capital & Valuation Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard venture capital benchmarks and SaaS valuation metrics:
</p>
<ul>
  <li><strong>Public/Private ARR Multiples:</strong> Public SaaS ARR multiples historically average 6x to 10x ARR; high-growth top-quartile SaaS (30%+ YoY) command 12x to 18x+ ARR multiples.</li>
  <li><strong>Target Startup Cash Runway:</strong> Startups should maintain a minimum of 18 to 24 months of cash runway following a equity financing round.</li>
  <li><strong>Burn Multiple Capital Efficiency:</strong> Burn Multiple (Net Burn ÷ Net New ARR): &lt; 1.0x is Amazing; 1.0x–1.5x is Good; 1.5x–2.0x is Suspect; &gt; 2.5x is Inefficient.</li>
  <li><strong>Founder Dilution per Round:</strong> Standard founder equity dilution is 15% to 25% for Seed rounds and 15% to 20% for Series A funding rounds.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical SaaS Valuation & Runway Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to model runway, valuation multiples, and cap table dilution:
</p>
<ol>
  <li><strong>Calculate Current Net Monthly Cash Burn:</strong> Subtract total monthly operating cash expenses from total monthly cash receipts (Net Burn = Cash Out - Cash In).</li>
  <li><strong>Calculate Remaining Operating Runway:</strong> Divide current total bank cash balance by net monthly cash burn rate to find months of runway remaining.</li>
  <li><strong>Calculate Burn Multiple:</strong> Divide total net cash burned over a 12-month period by total net new ARR added over that same 12-month period.</li>
  <li><strong>Apply Market ARR Valuation Multiple:</strong> Multiply ARR by market valuation multiple (e.g., $5M ARR × 10x multiple = $50M Pre-Money Valuation).</li>
  <li><strong>Model Post-Money Cap Table Dilution:</strong> Post-Money Valuation = Pre-Money Valuation + Investment Amount. Investor Ownership % = Investment ÷ Post-Money Valuation.</li>
</ol>""",
        "faqs": [
            ("How do you calculate a SaaS company valuation using ARR multiples?",
             "Multiply your Annual Recurring Revenue (ARR) by a market valuation multiple (e.g., $3M ARR × 8x ARR multiple = $24M Enterprise Valuation). Multiples depend on growth rate, NRR, and gross margin."),
            ("What is a good Burn Multiple for a SaaS startup?",
             "A Burn Multiple (Net Cash Burn ÷ Net New ARR Added) under 1.0x is exceptional. A Burn Multiple between 1.0x and 1.5x is healthy, while a score above 2.5x indicates capital inefficiency."),
            ("What is the difference between Pre-Money and Post-Money valuation?",
             "Pre-Money valuation is the company's value before receiving new investment capital. Post-Money valuation equals Pre-Money valuation plus the new investment amount ($20M Pre + $5M Investment = $25M Post).")
        ]
    },
    {
        "filename": "saas-marketing-ads.md",
        "category": "saas-marketing-ads",
        "shortName": "Marketing & Ads",
        "title": "SaaS Marketing Calculators: CAC, ROAS & Leads",
        "description": "Measure SaaS marketing performance with blended CAC, ROAS, Cost Per Lead (CPL), organic traffic value, and webinar campaign ROI.",
        "h1": "SaaS Marketing &amp; Ad Spend Calculators",
        "hero_p": "Calculate blended Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), Cost Per Lead (CPL), organic SEO traffic dollar value, content marketing ROI, and webinar campaign ROI. Explore our specialized calculators built for SaaS growth marketers.",
        "overview_h2": "Optimizing SaaS Growth Marketing & Paid Acquisition",
        "overview_text": """
<p>
  Growth marketing for SaaS requires managing customer acquisition costs across paid digital channels (Google Ads, LinkedIn, Meta), organic SEO content, webinars, and partner affiliate channels. Maximizing marketing efficiency depends on measuring blended CAC vs. paid channel CAC, Return on Ad Spend (ROAS), and lead conversion velocity.
</p>
<p>
  Our <strong>Blended CAC Calculator</strong> computes total acquisition cost across all marketing channels combined. The <strong>ROAS &amp; Paid Ad Spend Calculator</strong> measures direct revenue generated per dollar spent on digital ad campaigns.
</p>
<p>
  To evaluate content strategy, the <strong>SEO Traffic Value Calculator</strong> and <strong>Content Marketing ROI Estimator</strong> quantify organic search value. Additionally, tools like the <strong>CPL (Cost Per Lead) Calculator</strong> and <strong>Webinar ROI Calculator</strong> optimize campaign budget allocations.
</p>""",
        "benchmarks_h2": "SaaS Growth Marketing & Paid Channel Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard B2B SaaS growth marketing metrics and channel benchmarks:
</p>
<ul>
  <li><strong>Blended vs. Paid Channel CAC:</strong> Paid ad CAC (Google/LinkedIn) is typically 2x to 3x higher than overall blended CAC (which includes organic and referral traffic).</li>
  <li><strong>Target ROAS for Subscription SaaS:</strong> Target minimum ROAS on paid ad channels is 2.5x to 3.5x based on 12-month customer gross profit.</li>
  <li><strong>B2B SaaS Cost Per Lead (CPL) Range:</strong> B2B SaaS CPL ranges from $30–$80 for Google Search leads to $75–$200+ for targeted LinkedIn sponsored content leads.</li>
  <li><strong>Landing Page Conversion Rate:</strong> High-performing B2B SaaS demo landing pages convert 5% to 10% of visitor traffic into form leads.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical SaaS Marketing Optimization Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to audit marketing campaigns and optimize channel CAC:
</p>
<ol>
  <li><strong>Aggregate Total Marketing &amp; Ad Spend:</strong> Sum paid ad budgets, marketing software tools, agency retainer fees, and growth team salaries.</li>
  <li><strong>Calculate Blended CAC:</strong> Divide total marketing expenditures by total new customers acquired across all organic and paid channels.</li>
  <li><strong>Calculate Channel-Specific Paid CAC:</strong> Divide direct ad spend for a specific channel (e.g., LinkedIn Ads) by new customers sourced directly from that channel.</li>
  <li><strong>Measure First-Touch and Multi-Touch Attribution:</strong> Evaluate lead conversion rates across touchpoints using multi-touch attribution models.</li>
  <li><strong>Reallocate Budget to High-ROAS Channels:</strong> Shift marketing capital from low-performing ad channels toward channels with CAC payback periods under 12 months.</li>
</ol>""",
        "faqs": [
            ("What is the difference between Blended CAC and Paid CAC?",
             "Blended CAC divides total marketing spend by ALL customers acquired (including organic). Paid CAC isolates direct ad spend divided only by customers acquired from those specific paid ads."),
            ("What is a good Return on Ad Spend (ROAS) for SaaS?",
             "A good ROAS for SaaS paid ad campaigns is 2.5x to 3.5x based on first-year customer gross profit (or 300%+ ROAS over customer LTV)."),
            ("How do you calculate Cost Per Lead (CPL)?",
             "Divide total campaign ad spend by total leads generated (CPL = Ad Spend ÷ Total Leads). For example, $5,000 spent on Google Ads producing 100 leads equals a $50 CPL.")
        ]
    },
    {
        "filename": "saas-team-operations.md",
        "category": "saas-team-operations",
        "shortName": "Team & Operations",
        "title": "SaaS Operations Calculators: Support & Headcount",
        "description": "Forecast SaaS support ticket volumes, engineer cost per feature, employee utilization rates, software stack budgets, and hiring costs.",
        "h1": "SaaS Team &amp; Operations Calculators",
        "hero_p": "Forecast customer support ticket volume &amp; staffing costs, engineering cost per feature, employee utilization rates, software tool stack expenditures, contractor vs. full-time costs, and revenue per employee. Explore our specialized calculators built for SaaS COOs and VP Ops.",
        "overview_h2": "SaaS Operational Efficiency & Headcount Planning",
        "overview_text": """
<p>
  Scaling a SaaS company requires managing operational overhead, software stack subscriptions, engineering R&amp;D resource allocation, customer support ticket volume, and headcount planning. Labor costs represent 70% to 80% of total operating expenses (OpEx) in SaaS, making headcount efficiency and utilization vital.
</p>
<p>
  Our <strong>Support Ticket Volume &amp; Cost Calculator</strong> forecasts customer support staffing needs based on active user growth. The <strong>Engineering Cost Per Feature Calculator</strong> computes total R&amp;D salary investment required per product feature release.
</p>
<p>
  For workforce efficiency, the <strong>Employee Utilization Rate Calculator</strong> and <strong>Revenue Per Employee Calculator</strong> measure team productivity. Additionally, tools like the <strong>SaaS Tool Stack Cost Calculator</strong> audit internal software overhead.
</p>""",
        "benchmarks_h2": "SaaS Operations & Productivity Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard operational efficiency benchmarks and headcount metrics for SaaS:
</p>
<ul>
  <li><strong>Revenue Per Employee Benchmark:</strong> Efficient scale-up SaaS companies target $150,000 to $250,000+ ARR per full-time employee ($300k+ for mature public SaaS).</li>
  <li><strong>R&D Spend Share of Revenue:</strong> High-growth SaaS companies allocate 20% to 30% of total revenue toward R&amp;D engineering and product development.</li>
  <li><strong>Support Ticket Ratio Standard:</strong> Target customer support ticket ratio is 1 support ticket per 20 to 30 active monthly users (or under 0.05 tickets per user per month).</li>
  <li><strong>Billable Employee Utilization Target:</strong> Professional services and technical implementation teams target 75% to 85% billable utilization rates.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical SaaS Operational Planning Guide",
        "guide_text": """
<p>
  Follow this step-by-step framework to model operational headcount and support capacity:
</p>
<ol>
  <li><strong>Forecast Active User &amp; Customer Growth:</strong> Project monthly active user (MAU) and customer account growth over the next 12 to 24 months.</li>
  <li><strong>Calculate Support Ticket Volume Demand:</strong> Multiply projected active users by historical monthly ticket ratio to forecast monthly support ticket volume.</li>
  <li><strong>Size Customer Support Staffing Requirements:</strong> Divide total monthly tickets by average tickets solved per support agent (e.g., 400 tickets/agent/month).</li>
  <li><strong>Audit Internal SaaS Software Stack Costs:</strong> Aggregate monthly per-seat subscription tools across departments to calculate software OpEx per employee.</li>
  <li><strong>Measure Revenue Per Employee Ratio:</strong> Divide total Annual Recurring Revenue (ARR) by total full-time headcount to monitor workforce scaling efficiency.</li>
</ol>""",
        "faqs": [
            ("What is a good Revenue Per Employee ratio for a SaaS company?",
             "A healthy Revenue Per Employee ratio for a growing SaaS company is $150,000 to $250,000 of ARR per employee. Mature public SaaS companies often exceed $300,000+ per employee."),
            ("How much should a SaaS company spend on R&D engineering?",
             "High-growth SaaS companies typically invest 20% to 30% of their total revenue back into R&D (engineering, product management, design) to maintain product innovation."),
            ("How do you calculate employee utilization rate?",
             "Divide total billable or productive project hours by total available working hours over a period (e.g., 32 billable hours ÷ 40 available hours = 80% utilization rate).")
        ]
    }
]

def build_saas():
    for p in saas_pages:
        rel_grid = get_related_grid("saas", p["category"])
        
        faqs_html = []
        for q, a in p["faqs"]:
            faqs_html.append(f'  <h3>{q}</h3>\n  <p>\n    {a}\n  </p>')
        faqs_str = "\n".join(faqs_html)
        
        content = f"""---
layout: default
title: "{p['title']}"
description: "{p['description']}"
is_catpage: true
category: {p['category']}
permalink: /{p['category']}
shortName: "{p['shortName']}"
---

<section class="hero-section">
  <h1>{p['h1']}</h1>
  <p>
    {p['hero_p']}
  </p>
</section>

<!-- ============================================================ -->
<!-- TOOL GRID                                                     -->
<!-- ============================================================ -->

<div class="tool-list">
  {{% assign tools = site.data.tools | where: "category", page.category | where: "type", "tool" %}}
  {{% for tool in tools %}}
    <a href="{{{{ tool.url }}}}" class="tool-card">
      <span class="tool-card-title">{{{{ tool.title }}}}</span>
      <span class="tool-card-arrow">→</span>
    </a>
  {{% endfor %}}
</div>

<!-- ============================================================ -->
<!-- DETAILED CONTENT                                              -->
<!-- ============================================================ -->

<section class="content-section">
  <h2>{p['overview_h2']}</h2>
  {p['overview_text']}

  <h2>{p['benchmarks_h2']}</h2>
  {p['benchmarks_text']}

  <h2>{p['guide_h2']}</h2>
  {p['guide_text']}

  <h2>Frequently Asked Questions</h2>
{faqs_str}

{rel_grid}
</section>
"""
        filepath = os.path.join(base_dir, p["filename"])
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Wrote {p['filename']}")

if __name__ == "__main__":
    build_saas()
