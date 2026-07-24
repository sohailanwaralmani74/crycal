---
layout: tool
title: "Cohort Churn & Retention Rate Calculator | SaaS"
description: "Calculate cohort churn rates, customer retention curves, net MRR retention, and decay velocity over time across customer signup cohorts."
permalink: /churn-by-cohort-calculator
tool_id: churn-by-cohort-calculator
category: saas-churn-retention
hide_sidebar: true

inputs:
  - id: cohortStartCustomers
    label: Initial Cohort Customer Count (Month 0)
    type: number
    default: 200
    step: 10
    min: 1
    placeholder: "e.g., 200"

  - id: month1Retained
    label: Customers Retained at Month 1
    type: number
    default: 180
    step: 5
    min: 0
    placeholder: "e.g., 180"

  - id: month3Retained
    label: Customers Retained at Month 3
    type: number
    default: 160
    step: 5
    min: 0
    placeholder: "e.g., 160"

  - id: month6Retained
    label: Customers Retained at Month 6
    type: number
    default: 145
    step: 5
    min: 0
    placeholder: "e.g., 145"

  - id: month12Retained
    label: Customers Retained at Month 12
    type: number
    default: 130
    step: 5
    min: 0
    placeholder: "e.g., 130"

  - id: cohortInitialArpu
    label: Initial Monthly Revenue per User (ARPU)
    type: number
    default: 150.00
    step: 10.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 150.00"

outputs:
  - id: month1RetentionRate
    label: Month 1 Retention Rate (%)
  - id: month6RetentionRate
    label: Month 6 Retention Rate (%)
  - id: month12RetentionRate
    label: Month 12 Retention Rate (%)
  - id: cumulative12MoChurnRate
    label: 12-Month Cumulative Churn Rate (%)
  - id: cohort12MoMrr
    label: Retained Cohort MRR at Month 12

charts:
  tabs:
    - id: retentionCurve
      label: Customer Retention Curve (%)
    - id: mrrDecay
      label: Retained Cohort MRR ($)

history_columns:
  - key: cohortStartCustomers
    label: Initial Cohort
    source: input
  - key: month12Retained
    label: Month 12 Active
    source: input
  - key: month12RetentionRate
    label: M12 Retention %
    source: output
  - key: cumulative12MoChurnRate
    label: 12M Churn %
    source: output
  - key: cohort12MoMrr
    label: M12 MRR ($)
    source: output

js_file: assets/js/calculators/churn-by-cohort-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Churn by Cohort Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Track customer retention decay curves, monthly cohort churn, net MRR retention, and long-term customer survival rates."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates Month 1, Month 3, Month 6, and Month 12 customer retention percentages"
    - "Determines cumulative cohort churn rates over 12 months"
    - "Models cohort MRR decay and revenue trajectory over time"
    - "Generates retention curve visualizations to evaluate product-market fit"

breadcrumb:
  - name: Home
    url: /
  - name: SaaS Churn & Retention
    url: /saas-churn-retention
  - name: Churn by Cohort Calculator

howto:
  name: "How to Calculate Cohort Churn and Retention"
  description: "Measure customer retention curves and cumulative churn across signup cohorts over a 12-month period."
  step:
    - name: "Define initial cohort size (Month 0)"
      text: "Enter total new customers acquired during a specific signup month or quarter."
    - name: "Input retained customer counts"
      text: "Enter active customer totals remaining at Month 1, Month 3, Month 6, and Month 12 checkpoints."
    - name: "Set initial ARPU per customer"
      text: "Input starting average monthly revenue earned per account to model cohort revenue decay."
    - name: "Analyze retention curve output"
      text: "Review calculated retention percentages and evaluate if the retention curve flattens in later months."

faq:
  - question: "What is cohort churn analysis in SaaS?"
    answer: "Cohort churn analysis tracks a specific group of customers who signed up during the same timeframe (e.g., January 2026 cohort) to measure how customer retention and revenue decay over subsequent months."
  - question: "Why is cohort churn better than blended monthly churn?"
    answer: "Blended monthly churn masks retention trends because high growth in new customers hides churn in older customer groups. Cohort analysis isolates specific customer age groups to reveal true long-term retention health."
  - question: "What is a 'flattening' retention curve?"
    answer: "A flattening retention curve occurs when customer retention stabilizes after initial onboarding (e.g., dropping to 70% in Month 3 and remaining flat through Month 12). A flat retention curve is the ultimate indicator of Product-Market Fit."
  - question: "What is a good 12-month customer retention rate for SaaS?"
    answer: "For B2B Enterprise SaaS, 12-month customer retention above 80% to 90% is excellent. For Mid-Market SaaS, 70% to 80% is healthy, while SMB/PLG SaaS targets 55% to 70% retention."
  - question: "How does cohort expansion affect cohort revenue?"
    answer: "If expansion revenue from retained customers (seat upgrades, upsells) exceeds lost revenue from churned customers, net cohort MRR increases over time—resulting in Net Negative Churn (NRR > 100%)."
  - question: "How do onboarding improvements show up in cohort analysis?"
    answer: "Onboarding improvements increase the Month 1 retention baseline (e.g., moving M1 retention from 80% to 90%), lifting the entire retention curve for subsequent months."
  - question: "What tools generate cohort retention triangles?"
    answer: "Popular SaaS analytics platforms that generate automated cohort retention matrices include Mixpanel, Amplitude, Baremetrics, ProfitWell, and ChartMogul."
---

# Churn by Cohort Calculator

Model customer retention curves, cumulative 12-month cohort churn, MRR decay velocity, and long-term customer survival rates across subscriber cohorts.

This 100% private, client-side calculator evaluates cohort retention math directly in your browser with zero data storage.

<!-- more -->

## Why Use the Churn by Cohort Calculator?

Measuring overall aggregate monthly churn can create dangerous false confidence for SaaS founders and executives. Rapid customer acquisition often masks high underlying churn rates because fresh signups artificially obscure lost customers.

Conducting **Cohort Churn Analysis** allows product, growth, and customer success teams to:

1. **Isolate Product-Market Fit:** Observe whether retention curves flatten into horizontal plateaus over time.
2. **Evaluate Onboarding Impact:** Measure how improvements to early user onboarding lift Month 1 and Month 3 retention baselines.
3. **Track Revenue Decay Velocity:** Model exact MRR erosion over 12 months to determine true Customer Lifetime Value (LTV).
4. **Compare Marketing Channel Retention:** Evaluate whether customers acquired through organic search retain better than paid ad signups.

---

## Mathematical Formulas & Mechanics

### 1. Cohort Retention Rate by Month ($M_t$)
$$\text{Retention Rate } R_t (\%) = \left( \frac{C_t}{C_0} \right) \times 100$$

Where $C_0$ is initial cohort customer count at Month 0, and $C_t$ is active customers remaining at Month $t$.

### 2. Cumulative Cohort Churn Rate
$$\text{Cumulative Churn Rate } K_t (\%) = 100 - R_t = \left( \frac{C_0 - C_t}{C_0} \right) \times 100$$

### 3. Retained Cohort MRR Trajectory
$$\text{Cohort MRR}_t = C_t \times \text{ARPU}_t$$

If expansion occurs within retained accounts:
$$\text{Cohort MRR}_t = C_0 \times \text{ARPU}_0 \times \left( \frac{\text{Net Revenue Retention (\%)}}{100} \right)$$

---

## Real-World Comparison & Benchmark Table

Standard 12-month cohort customer retention benchmarks across B2B and B2C SaaS models:

| SaaS Business Model | Month 1 Retention Target | Month 3 Retention Target | Month 6 Retention Target | Month 12 Retention Target | Retention Curve Trajectory |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Enterprise B2B (>$50k ACV)** | $95\% - 98\%$ | $92\% - 96\%$ | $88\% - 94\%$ | **$85\% - 92\%$** | Very Flat (High Retention) |
| **Mid-Market B2B ($10k-$50k ACV)** | $90\% - 94\%$ | $82\% - 88\%$ | $76\% - 84\%$ | **$70\% - 80\%$** | Stabilizes at Month 6 |
| **SMB B2B (<$10k ACV)** | $80\% - 88\%$ | $68\% - 78\%$ | $60\% - 70\%$ | **$50\% - 65\%$** | Gradual Linear Decay |
| **B2C Consumer SaaS** | $60\% - 75\%$ | $45\% - 60\%$ | $35\% - 50\%$ | **$25\% - 40\%$** | Steep Early Drop-off |

---

## Step-by-Step How-To Guide

1. **Enter Initial Cohort Size (Month 0):** Input total number of new paying customer accounts acquired in your chosen cohort month.
2. **Input Retained Customer Counts:** Enter active remaining customers at Month 1, Month 3, Month 6, and Month 12 checkpoints.
3. **Set Starting ARPU:** Input average monthly subscription revenue per account at signup.
4. **Analyze Retention Curve:** Inspect calculated retention percentages to determine if retention stabilizes after Month 3.
5. **Review Retained Cohort MRR:** Examine month 12 retained MRR total to calculate true cohort financial value.

---


## Strategic Value & Implementation Guidance

Using this interactive calculation engine provides a clear, quantitative roadmap for your decisions. By eliminating mathematical uncertainty, you can optimize financial allocations, compare scenarios side-by-side, and make data-driven choices.

### Key Tactical Benefits
- **Mathematical Certainty**: Eliminates guesswork by modeling multi-variable compounding and precise cost structures.
- **Scenario Comparison**: Test multiple interest rates, payment timelines, and capital allocations in real-time.
- **Privacy Assurance**: All data remains 100% confidential within your local browser memory, with zero remote server logging.
- **Export & Audit Readiness**: Log calculations to local browser storage, export full histories to CSV/Excel, or share via link.

## Frequently Asked Questions

### What is cohort churn analysis in SaaS?
Cohort churn analysis tracks a specific group of customers who signed up during the same timeframe (e.g., January 2026 cohort) to measure how customer retention and revenue decay over subsequent months.

### Why is cohort churn better than blended monthly churn?
Blended monthly churn masks retention trends because high growth in new customers hides churn in older customer groups. Cohort analysis isolates specific customer age groups to reveal true long-term retention health.

### What is a 'flattening' retention curve?
A flattening retention curve occurs when customer retention stabilizes after initial onboarding (e.g., dropping to 70% in Month 3 and remaining flat through Month 12). A flat retention curve is the ultimate indicator of Product-Market Fit.

### What is a good 12-month customer retention rate for SaaS?
For B2B Enterprise SaaS, 12-month customer retention above 80% to 90% is excellent. For Mid-Market SaaS, 70% to 80% is healthy, while SMB/PLG SaaS targets 55% to 70% retention.

### How does cohort expansion affect cohort revenue?
If expansion revenue from retained customers (seat upgrades, upsells) exceeds lost revenue from churned customers, net cohort MRR increases over time—resulting in Net Negative Churn (NRR > 100%).

### How do onboarding improvements show up in cohort analysis?
Onboarding improvements increase the Month 1 retention baseline (e.g., moving M1 retention from 80% to 90%), lifting the entire retention curve for subsequent months.

### What tools generate cohort retention triangles?
Popular SaaS analytics platforms that generate automated cohort retention matrices include Mixpanel, Amplitude, Baremetrics, ProfitWell, and ChartMogul.



## Advanced Analysis & Strategic Guidelines

Understanding these metrics in detail provides founders, financial planners, and managers with an actionable framework for sustainable long-term decision making.

### Key Decision Factors
1. **Capital Optimization**: Focus cash flow and investment on channels delivering the highest net lifetime value.
2. **Risk Mitigation**: Build reserves to withstand macroeconomic fluctuations and rate adjustments.
3. **Data Integrity**: Audit inputs periodically against verified bank statements, billing receipts, or contracts.
4. **Privacy First**: Maintain complete confidentiality by leveraging client-side calculation tools that eliminate server transmission.
