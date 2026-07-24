---
layout: tool
title: "Net Revenue Retention Nrr | Interactive Online Tool"
description: "Free online Net Revenue Retention Nrr. Calculate subscription pricing, MRR/ARR growth, unit economics, and churn with instant browser math and charts."
permalink: /net-revenue-retention-nrr-calculator
tool_id: net-revenue-retention-nrr-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: startingMrr
    label: Starting MRR ($)
    type: number
    default: 100000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 100000"

  - id: expansionMrr
    label: Expansion MRR ($)
    type: number
    default: 15000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 15000"

  - id: contractionMrr
    label: Contraction MRR ($)
    type: number
    default: 3000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 3000"

  - id: churnedMrr
    label: Churned MRR ($)
    type: number
    default: 5000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 5000"

outputs:
  - id: nrrPercentage
    label: Net Revenue Retention (NRR)
  - id: endingMrr
    label: Ending MRR from Existing Cohort
  - id: netGrowthDollar
    label: Net MRR Change
  - id: arrImpact
    label: Annualized Net Expansion Impact

charts:
  tabs:
    - id: breakdown
      label: MRR Waterfall Breakdown

history_columns:
  - key: startingMrr
    label: Starting MRR
    source: input
  - key: expansionMrr
    label: Expansion MRR
    source: input
  - key: churnedMrr
    label: Churned MRR
    source: input
  - key: nrrPercentage
    label: NRR (%)
    source: output
  - key: endingMrr
    label: Ending MRR
    source: output

js_file: /assets/js/calculators/net-revenue-retention-nrr-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Net Revenue Retention (NRR) Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Net Revenue Retention (NRR %) rate. Measure recurring revenue growth from existing customers accounting for expansion, contraction, and churn."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Instant NRR % Calculation"
    - "Cohort Revenue Waterfall Breakdown"
    - "Annualized Net Expansion Impact"
    - "100% Private Local Browser Calculations"
    - "Export Results to CSV"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Net Revenue Retention (NRR) Calculator

howto:
  name: "How to Calculate Net Revenue Retention (NRR)"
  description: "Follow these steps to calculate your SaaS Net Revenue Retention rate."
  step:
    - name: "Enter Starting MRR"
      text: "Input the total monthly recurring revenue at the beginning of the evaluation period."
    - name: "Enter Expansion MRR"
      text: "Input revenue gained from upgrades, add-ons, and cross-sells."
    - name: "Enter Contraction MRR"
      text: "Input revenue lost from plan downgrades."
    - name: "Enter Churned MRR"
      text: "Input revenue lost from customer cancellations."
    - name: "Review NRR %"
      text: "Analyze your NRR percentage to evaluate cohort expansion efficiency."

faq:
  - question: "What is Net Revenue Retention (NRR)?"
    answer: "Net Revenue Retention (NRR) measures the percentage of recurring revenue retained from an existing cohort of customers over a given period, including account upgrades (expansion), downgrades (contraction), and cancellations (churn)."
  - question: "What is a good NRR percentage for SaaS?"
    answer: "An NRR above 100% means existing customers are expanding faster than they are churning (net negative churn). For B2B SaaS, 100%–110% is solid, 110%–120% is great, and 120%+ (e.g., Snowflake, Twilio) is top-tier public SaaS benchmark."
  - question: "What is the formula for NRR?"
    answer: "NRR % = [(Starting MRR + Expansion MRR − Contraction MRR − Churned MRR) / Starting MRR] × 100."
  - question: "How does NRR differ from GRR?"
    answer: "GRR (Gross Revenue Retention) excludes expansion revenue and cannot exceed 100%. NRR includes expansion revenue and can exceed 100%."
  - question: "Does NRR include new customer acquisitions?"
    answer: "No. NRR exclusively tracks the revenue performance of an existing cohort of accounts present at the start of the period."
  - question: "Why do investors care so much about NRR?"
    answer: "NRR indicates product-market fit, customer satisfaction, and compounding sales efficiency. High NRR enables software companies to grow revenue even without acquiring new logos."
  - question: "How frequently should SaaS companies measure NRR?"
    answer: "Most SaaS companies measure NRR monthly and report trailing 12-month (TTM) NRR on a quarterly or annual basis."

---

# Net Revenue Retention Nrr Calculator

Calculate your Net Revenue Retention (NRR %) rate to measure how effectively your existing customer base grows over time. Evaluate revenue expansion from plan upgrades against losses from contraction and account churn.

<!-- more -->

## Why Use This NRR Calculator

Net Revenue Retention (NRR) is widely regarded as the single most critical health metric for subscription and SaaS businesses. This calculator enables you to:

- **📈 Measure Cohort Compounding** — verify if existing accounts expand overall (NRR > 100%).
- **⚖️ Balance Upgrades vs. Churn** — quantify whether expansion MRR offsets lost revenue from cancellations.
- **🎯 Benchmark Investor Metrics** — evaluate your NRR against top-tier VC and public SaaS benchmarks.
- **💰 Project Annualized Revenue Growth** — visualize the long-term dollar impact of current retention trends.

---

## Net Revenue Retention (NRR) Formula

$$\text{NRR (\%)} = \frac{\text{Starting MRR} + \text{Expansion MRR} - \text{Contraction MRR} - \text{Churned MRR}}{\text{Starting MRR}} \times 100$$

Where:
- **Starting MRR**: Total Monthly Recurring Revenue at the beginning of the period.
- **Expansion MRR**: Additional revenue from upgrades, cross-sells, and seat add-ons.
- **Contraction MRR**: Revenue lost due to customer tier downgrades.
- **Churned MRR**: Revenue lost due to complete account cancellations.

---

## SaaS NRR Benchmarks Comparison

| SaaS Segment | NRR Rating | Annual Cohort Growth Impact | Investor Takeaway |
| :--- | :--- | :--- | :--- |
| **Below 80%** | Poor | Severe contraction (-20%+/yr) | Leaky bucket; unsustainable without high acquisition |
| **80% – 95%** | Average (SMB) | Mild contraction | Typical for self-serve SMB SaaS |
| **100% – 110%** | Good (Mid-Market) | Healthy baseline (+0% to +10%) | Growth sustained by expansion |
| **110% – 120%** | Excellent (Enterprise) | Strong compounding (+10% to +20%) | High product stickiness and account expansion |
| **120%+** | Elite (Public SaaS Leaders) | Hyper-growth (+20%+/yr) | World-class negative net churn |

---

## How to Use This NRR Calculator

1. Enter your **Starting MRR** for the cohort at the beginning of the timeframe.
2. Input **Expansion MRR** gained from seat add-ons, cross-sells, or plan tier upgrades.
3. Input **Contraction MRR** lost from plan downgrades.
4. Input **Churned MRR** lost from account cancellations.
5. Review your **NRR %**, **Ending MRR**, and **Annualized Expansion Impact** instantly.

---

## Frequently Asked Questions

### What is Net Revenue Retention (NRR)?
Net Revenue Retention (NRR) measures the percentage of recurring revenue retained from an existing cohort of customers over a given period, including account upgrades (expansion), downgrades (contraction), and cancellations (churn).

### What is a good NRR percentage for SaaS?
An NRR above 100% means existing customers are expanding faster than they are churning (net negative churn). For B2B SaaS, 100%–110% is solid, 110%–120% is great, and 120%+ (e.g., Snowflake, Twilio) is top-tier public SaaS benchmark.

### What is the formula for NRR?
NRR % = [(Starting MRR + Expansion MRR − Contraction MRR − Churned MRR) / Starting MRR] × 100.

### How does NRR differ from GRR?
GRR (Gross Revenue Retention) excludes expansion revenue and cannot exceed 100%. NRR includes expansion revenue and can exceed 100%.

### Does NRR include new customer acquisitions?
No. NRR exclusively tracks the revenue performance of an existing cohort of accounts present at the start of the period.

### Why do investors care so much about NRR?
NRR indicates product-market fit, customer satisfaction, and compounding sales efficiency. High NRR enables software companies to grow revenue even without acquiring new logos.

### How frequently should SaaS companies measure NRR?
Most SaaS companies measure NRR monthly and report trailing 12-month (TTM) NRR on a quarterly or annual basis.
