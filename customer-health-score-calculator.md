---
layout: tool
title: "Customer Health Score & Retention Tool"
description: "Calculate composite customer health scores by weighting product adoption, support tickets, and NPS with instant, private browser execution."
permalink: /customer-health-score-calculator
tool_id: customer-health-score-calculator
category: saas-churn-retention
hide_sidebar: true

inputs:
  - id: productAdoptionScore
    label: Product Usage & License Activation Score (0-100)
    type: number
    default: 85
    step: 5
    min: 0
    max: 100
    placeholder: "e.g., 85"

  - id: customerNPS
    label: Net Promoter Score / CSAT (0-100)
    type: number
    default: 75
    step: 5
    min: 0
    max: 100
    placeholder: "e.g., 75"

  - id: supportTicketScore
    label: Support Ticket Health & SLA Score (0-100)
    type: number
    default: 90
    step: 5
    min: 0
    max: 100
    placeholder: "e.g., 90"

  - id: contractExecutiveEngagement
    label: Executive Sponsor & QBR Engagement (0-100)
    type: number
    default: 80
    step: 5
    min: 0
    max: 100
    placeholder: "e.g., 80"

  - id: weightAdoption
    label: Product Adoption Weight (%)
    type: number
    default: 40
    step: 5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 40"

  - id: weightNPS
    label: NPS/CSAT Weight (%)
    type: number
    default: 20
    step: 5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 20"

  - id: weightSupport
    label: Support Health Weight (%)
    type: number
    default: 20
    step: 5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 20"

  - id: weightExecutive
    label: Executive Engagement Weight (%)
    type: number
    default: 20
    step: 5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 20"

outputs:
  - id: compositeHealthScore
    label: Weighted Customer Health Score (0-100)
  - id: healthCategory
    label: Customer Health Status (Healthy, Warning, At Risk)
  - id: renewalProbability
    label: Estimated Renewal Probability (%)

charts:
  tabs:
    - id: healthFactorWeighting
      label: Health Factor Weighting Distribution
    - id: churnRiskDistribution
      label: Composite Score vs Churn Probability

history_columns:
  - key: productAdoptionScore
    label: Adoption (0-100)
    source: input
  - key: customerNPS
    label: NPS (0-100)
    source: input
  - key: compositeHealthScore
    label: Health Score
    source: output
  - key: healthCategory
    label: Health Status
    source: output

js_file: assets/js/calculators/customer-health-score-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Customer Health Score & Retention Tool"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate multi-dimensional customer health scores combining product adoption, CSAT/NPS, support tickets, and executive relationship metrics."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates weighted composite customer health scores on a 0-100 scale"
    - "Combines product telemetry, support ticket health, NPS, and QBR engagement"
    - "Categorizes accounts into Healthy (Green), Warning (Yellow), or At-Risk (Red)"
    - "Predicts account renewal probability percentages"

breadcrumb:
  - name: Home
    url: /
  - name: SaaS Churn & Retention
    url: /saas-churn-retention
  - name: Customer Health Score Calculator

howto:
  name: "How to Calculate Customer Health Score"
  description: "Calculate multi-factor customer health scores to predict churn and drive proactive CSM intervention."
  step:
    - name: "Grade product adoption"
      text: "Assign 0-100 score based on active seat utilization, login frequency, and key feature adoption."
    - name: "Grade customer sentiment"
      text: "Input CSAT survey rating or NPS score converted to a 0-100 scale."
    - name: "Evaluate support ticket health"
      text: "Grade support health (100 = zero escalation tickets; low score = open P1 bugs)."
    - name: "Set category weights"
      text: "Assign percentage weights (e.g., 40% adoption, 20% NPS, 20% support, 20% executive engagement)."

faq:
  - question: "What is a Customer Health Score in SaaS?"
    answer: "A Customer Health Score is a composite metric (0 to 100) that combines product usage telemetry, sentiment, support tickets, and relationship engagement to predict renewal likelihood."
  - question: "How do you calculate a composite Customer Health Score?"
    answer: "Composite Health Score = (Adoption Score * Weight) + (NPS Score * Weight) + (Support Score * Weight) + (Executive Score * Weight)."
  - question: "What are the standard health score thresholds for B2B accounts?"
    answer: "Scores 80 to 100 indicate Healthy (Green - high renewal probability); scores 60 to 79 indicate Warning (Yellow); scores below 60 indicate At-Risk (Red - high churn probability)."
  - question: "Why is product adoption weighted highest in health scores?"
    answer: "Product adoption measures actual user daily behavior. Even if a customer gives high CSAT scores, un-activated licenses indicate imminent renewal contraction."
  - question: "How does support ticket volume impact customer health scores?"
    answer: "Frequent unresolved support tickets or SLA breaches depress support health scores, alerting CSMs to technical friction before contract renewal."
  - question: "Can a customer with a high NPS score still churn?"
    answer: "Yes, 'happy churners' often express positive sentiment (high NPS) but churn due to executive turnover, budget cuts, or failure to adopt core workflow features."
  - question: "How often should customer health scores be updated?"
    answer: "Customer health scores should recalculate automatically in real time (or daily) based on product telemetry syncs and CSM survey inputs."
---

# Composite Customer Health & Churn Risk Index

Calculate weighted customer health scores ($0 \text{ to } 100$) by combining product adoption telemetry, CSAT/NPS sentiment, support ticket friction, and executive sponsor engagement.
All calculations execute 100% privately inside your web browser with real-time recalculations and total data privacy.

<!-- more -->

## Why Use the Customer Health Score Calculator?

Relying on subjective CSM gut feel or waiting for contract renewal dates leads to surprise churn. By the time an at-risk customer announces non-renewal, it is usually too late to reverse their decision.

This **Customer Health Score Calculator** builds a data-driven risk index that categorizes accounts into **Healthy (Green)**, **Warning (Yellow)**, or **At-Risk (Red)** tiers to trigger proactive Customer Success playbooks.

### Key Benefits
* **Multi-Factor Algorithm:** Balances product telemetry, CSAT/NPS, support health, and executive QBRs.
* **Customizable Weighting:** Adjust category weights to match your specific SaaS product complexity.
* **Renewal Probability Model:** Converts composite scores into estimated account renewal percentages.
* **100% Private Browser Math:** Models confidential customer portfolio health privately in your browser.

---

## Mathematical Formulas & Mechanics

### 1. Weighted Composite Health Score
Composite Health Score ($H_{\text{composite}}$) calculated from normalized sub-scores ($S_i$) and percentage weights ($W_i$):

$$H_{\text{composite}} = \frac{\sum_{i=1}^{n} (S_i \times W_i)}{\sum_{i=1}^{n} W_i}$$

Where inputs include:
* $S_{\text{adopt}}$: Product Usage Score ($W_{\text{adopt}} = 40\%$)
* $S_{\text{nps}}$: NPS / CSAT Score ($W_{\text{nps}} = 20\%$)
* $S_{\text{support}}$: Support SLA Score ($W_{\text{support}} = 20\%$)
* $S_{\text{exec}}$: Executive Engagement Score ($W_{\text{exec}} = 20\%$)

### 2. Account Health Status & Renewal Probability
* **Healthy (Green):** $H_{\text{composite}} \ge 80 \longrightarrow \text{Renewal Prob} \ge 90\%$
* **Warning (Yellow):** $60 \le H_{\text{composite}} < 80 \longrightarrow \text{Renewal Prob} = 65\% – 85\%$
* **At Risk (Red):** $H_{\text{composite}} < 60 \longrightarrow \text{Renewal Prob} < 50\%$

---

## Real-World Comparison & Benchmark Table

The benchmark account health matrix below illustrates health score classifications, churn probabilities, and recommended Customer Success interventions:

| Composite Health Score | Health Status Tier | Predicted Renewal Probability | Estimated Churn Risk | Recommended CSM Playbook Action |
| :--- | :--- | :--- | :--- | :--- |
| **85 – 100 Score** | Healthy (Green) | 92% – 98% Renewal | Very Low Churn Risk | Executive QBR, Upsell / Expansion Pitch |
| **70 – 84 Score** | Good Standing | 80% – 91% Renewal | Low Churn Risk | Feature Adoption Training Session |
| **60 – 69 Score** | Warning (Yellow) | 60% – 79% Renewal | Moderate Churn Risk | Re-Onboarding Session, Admin Check-In |
| **45 – 59 Score** | At Risk (Red) | 35% – 59% Renewal | High Churn Risk | Executive Escalation, Support Ticket Blitz |
| **0 – 44 Score** | Critical Danger | < 35% Renewal | Critical Churn Hazard | Save Offer / Discount & Product Intervention |

---

## Step-by-Step How-To Guide

1. **Audit Product Adoption (0-100):** Measure active license utilization rate (e.g., 85 assigned seats out of 100 = 85 score).
2. **Input CSAT/NPS Sentiment (0-100):** Convert latest survey feedback or NPS score into a 100-point scale.
3. **Grade Support Ticket Health (0-100):** Deduct points for outstanding P1 bugs, slow SLA resolution, or high ticket frequency.
4. **Evaluate Executive Engagement (0-100):** Grade sponsor relationship stability and quarterly business review (QBR) attendance.
5. **Adjust Category Weights:** Assign weight percentages reflecting your product's key churn drivers (e.g., 40% adoption).

---

## Frequently Asked Questions

### What is a Customer Health Score in SaaS?
A Customer Health Score is a composite metric (0 to 100) that combines product usage telemetry, sentiment, support tickets, and relationship engagement to predict renewal likelihood.

### How do you calculate a composite Customer Health Score?
Composite Health Score = (Adoption Score * Weight) + (NPS Score * Weight) + (Support Score * Weight) + (Executive Score * Weight).

### What are the standard health score thresholds for B2B accounts?
Scores 80 to 100 indicate Healthy (Green - high renewal probability); scores 60 to 79 indicate Warning (Yellow); scores below 60 indicate At-Risk (Red - high churn probability).

### Why is product adoption weighted highest in health scores?
Product adoption measures actual user daily behavior. Even if a customer gives high CSAT scores, un-activated licenses indicate imminent renewal contraction.

### How does support ticket volume impact customer health scores?
Frequent unresolved support tickets or SLA breaches depress support health scores, alerting CSMs to technical friction before contract renewal.

### Can a customer with a high NPS score still churn?
Yes, 'happy churners' often express positive sentiment (high NPS) but churn due to executive turnover, budget cuts, or failure to adopt core workflow features.

### How often should customer health scores be updated?
Customer health scores should recalculate automatically in real time (or daily) based on product telemetry syncs and CSM survey inputs.
