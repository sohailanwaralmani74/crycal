---
layout: "tool"
title: "MRR Growth Rate Calculator"
description: "Calculate Month-over-Month (MoM) revenue growth rate, Net New MRR, and Net Revenue Retention (NRR)."
permalink: "/mrr-growth-rate-calculator"
tool_id: "mrr-growth-rate-calculator"
category: "saas-revenue-growth-metrics"
hide_sidebar: true
inputs:
  - id: "startMrr"
    label: "Beginning MRR ($)"
    type: "number"
    default: 50000
    step: 2500
    min: 1
    currency: true
    placeholder: "e.g., 50000"
  - id: "newMrr"
    label: "New Customer MRR Added ($)"
    type: "number"
    default: 6000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 6000"
  - id: "expansionMrr"
    label: "Expansion / Upgrade MRR ($)"
    type: "number"
    default: 2500
    step: 250
    min: 0
    currency: true
    placeholder: "e.g., 2500"
  - id: "contractionMrr"
    label: "Downgrade / Contraction MRR ($)"
    type: "number"
    default: 1000
    step: 250
    min: 0
    currency: true
    placeholder: "e.g., 1000"
  - id: "churnedMrr"
    label: "Lost / Churned MRR ($)"
    type: "number"
    default: 1500
    step: 250
    min: 0
    currency: true
    placeholder: "e.g., 1500"
outputs:
  - id: "endingMrr"
    label: "Ending MRR ($)"
  - id: "netNewMrr"
    label: "Net New MRR ($)"
  - id: "momGrowthRate"
    label: "MoM Growth Rate (%)"
  - id: "annualizedGrowthRate"
    label: "Annualized CAGR (%)"
  - id: "netRetentionRate"
    label: "Net Revenue Retention (NRR)"
  - id: "status"
    label: "Growth Velocity Rating"
  - id: "recommendation"
    label: "Strategic Action Guidance"
charts:
  tabs:
    - id: "mrrWaterfall"
      label: "MRR Growth Waterfall"
    - id: "retentionSplit"
      label: "New & Expansion vs Churn"
history_columns:
  - key: "startMrr"
    label: "Start MRR"
    source: "input"
  - key: "netNewMrr"
    label: "Net New MRR"
    source: "output"
  - key: "momGrowthRate"
    label: "MoM Growth"
    source: "output"
  - key: "status"
    label: "Status"
    source: "output"
js_file: "assets/js/calculators/mrr-growth-rate-calculator.js"
structured_data:
  "@context" : "https://schema.org"
  "@type" : "SoftwareApplication"
  name: "MRR Growth Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Month-over-Month (MoM) revenue growth rate, Net New MRR, and Net Revenue Retention (NRR)."
  offers:
    "@type" : "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "MRR Growth Rate Calculator calculation engine"
    - "Interactive Chart.js visual breakdown"
    - "100% private in-browser client execution"
    - "Calculation history logging"
breadcrumb:
  - name: "Home"
    url: "/"
  - name: "SaaS Revenue Growth Metrics"
    url: "/saas-revenue-growth-metrics"
  - name: "MRR Growth Rate Calculator"
howto:
  name: "How to Use the MRR Growth Rate Calculator"
  description: "Follow these simple steps to calculate MRR Growth Rate Calculator metrics."
  step:
    - name: "Enter Core Operational Inputs"
      text: "Input your current monthly financial and subscriber metrics into the interactive form."
    - name: "Configure Cost & Volume Tiers"
      text: "Adjust software, team salaries, channel CAC, or plan pricing parameters."
    - name: "Evaluate Benchmark Ratings"
      text: "Review your output scores against SaaS industry standards."
    - name: "Inspect Interactive Charts"
      text: "Switch visual chart tabs to analyze detailed breakdowns and curves."
faq:
  - q: "What is Net New MRR?"
    a: "Net New MRR represents the net change in monthly recurring revenue added during the month after accounting for new customer additions, upgrades, downgrades, and lost accounts."
  - q: "What is a good MoM MRR growth rate benchmark?"
    a: "Early-stage SaaS startups ($100k-$1M ARR) target 10%-15%+ MoM growth. Growth-stage startups ($1M-$10M ARR) target 5%-8% MoM growth."
  - q: "What is Net Revenue Retention (NRR)?"
    a: "NRR measures recurring revenue retained from existing customers over a period, including expansion upgrades minus churn and contraction."
  - q: "What is a top-tier NRR benchmark?"
    a: "Top-tier Enterprise SaaS companies achieve 110%-130%+ NRR, indicating that revenue grows over time even with zero new customer acquisition."
  - q: "Is subscriber financial data stored?"
    a: "No. All calculations run strictly in your web browser."
---

# Calculate Monthly Recurring Revenue (MRR) Growth Rate

Calculate Month-over-Month (MoM) revenue growth rate, Net New MRR, and Net Revenue Retention (NRR). Use our free **MRR Growth Rate Calculator** to evaluate your SaaS business performance and make data-driven growth decisions — without any data leaving your browser.

<!-- more -->

## Why Use the MRR Growth Rate Calculator?

MRR Growth Rate tracks monthly recurring revenue trajectory while dissecting gross addition drivers (new sales & account expansion) versus revenue leakage (downgrades & customer churn).

Having accurate, real-time insights into this metric helps SaaS founders, CFOs, and growth teams optimize capital allocation, protect operating runway, and achieve top-tier venture scalability.

## Mathematical Formula & Derivation

The mathematical derivation for this financial metric is expressed as:

$$\text{Net New MRR} = \text{New MRR} + \text{Expansion MRR} - \text{Contraction MRR} - \text{Churned MRR}$$ \n$$\text{MoM Growth Rate \%} = \frac{\text{Net New MRR}}{\text{Beginning MRR}} \times 100\%$$ \n$$\text{Net Revenue Retention (NRR) \%} = \frac{\text{Beginning MRR} + \text{Expansion} - \text{Contraction} - \text{Churn}}{\text{Beginning MRR}} \times 100\%$$

Where all input values are evaluated over a standardized monthly or annual accounting period.

## Real-World SaaS Benchmark Comparison

| Company Scale | MoM Growth Target | Annualized CAGR Target | NRR Benchmark Target |
| --- | --- | --- | --- |
| Early Seed Stage | 10% - 15% MoM | 200% - 400%+ | 100% - 105% |
| Series A Stage | 6% - 10% MoM | 100% - 200% | 105% - 115% |
| Series B+ Stage | 3% - 6% MoM | 40% - 100% | 115% - 130%+ |

## Step-by-Step Calculation Guide

1. **Enter Core Financial Inputs:** Supply your monthly sales spend, user counts, ARPU, or recurring revenue figures.
2. **Review Intermediate Outputs:** Examine calculated gross profit, churn, payback, or unit contribution scores.
3. **Assess Benchmark Ratings:** Compare your results against SaaS industry standards to identify growth bottlenecks.
4. **Analyze Visual Charts:** Use the visual chart tabs below to inspect metric breakdowns over time.

---

## Frequently Asked Questions

### What is Net New MRR?
Net New MRR represents the net change in monthly recurring revenue added during the month after accounting for new customer additions, upgrades, downgrades, and lost accounts.

### What is a good MoM MRR growth rate benchmark?
Early-stage SaaS startups ($100k-$1M ARR) target 10%-15%+ MoM growth. Growth-stage startups ($1M-$10M ARR) target 5%-8% MoM growth.

### What is Net Revenue Retention (NRR)?
NRR measures recurring revenue retained from existing customers over a period, including expansion upgrades minus churn and contraction.

### What is a top-tier NRR benchmark?
Top-tier Enterprise SaaS companies achieve 110%-130%+ NRR, indicating that revenue grows over time even with zero new customer acquisition.

### Is subscriber financial data stored?
No. All calculations run strictly in your web browser.
