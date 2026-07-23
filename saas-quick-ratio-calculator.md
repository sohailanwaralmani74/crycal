---
layout: tool
title: SaaS Quick Ratio Calculator – Growth Efficiency Metric
description: Calculate your SaaS Quick Ratio - (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR). Measure revenue growth efficiency against churn.
permalink: /saas-quick-ratio-calculator
tool_id: saas-quick-ratio-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: newMrr
    label: New Logo MRR ($)
    type: number
    default: 20000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 20000"

  - id: expansionMrr
    label: Expansion MRR ($)
    type: number
    default: 10000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: contractionMrr
    label: Contraction MRR ($)
    type: number
    default: 2000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 2000"

  - id: churnedMrr
    label: Churned MRR ($)
    type: number
    default: 4000
    step: 200
    min: 0
    currency: true
    placeholder: "e.g., 4000"

outputs:
  - id: quickRatio
    label: SaaS Quick Ratio
  - id: totalGrossAddition
    label: Gross MRR Additions ($)
  - id: totalGrossLoss
    label: Gross MRR Loss ($)
  - id: netMrrGrowth
    label: Net MRR Addition ($)

charts:
  tabs:
    - id: comparison
      label: Additions vs. Loss Ratio

history_columns:
  - key: newMrr
    label: New MRR
    source: input
  - key: expansionMrr
    label: Expansion MRR
    source: input
  - key: churnedMrr
    label: Churned MRR
    source: input
  - key: quickRatio
    label: Quick Ratio
    source: output
  - key: netMrrGrowth
    label: Net MRR Growth
    source: output

js_file: /assets/js/calculators/saas-quick-ratio-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "SaaS Quick Ratio Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your SaaS Quick Ratio: (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR). Measure revenue growth efficiency against churn."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Instant SaaS Quick Ratio Calculation"
    - "Gross Growth vs. Churn Comparison"
    - "Venture Benchmark Ratings"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: SaaS Quick Ratio Calculator

howto:
  name: "How to Calculate the SaaS Quick Ratio"
  description: "Follow these steps to compute your SaaS Quick Ratio growth efficiency metric."
  step:
    - name: "Enter New Logo MRR"
      text: "Input revenue added from brand new customer accounts during the month."
    - name: "Enter Expansion MRR"
      text: "Input revenue added from existing customer upgrades and add-ons."
    - name: "Enter Contraction MRR"
      text: "Input revenue lost from plan downgrades."
    - name: "Enter Churned MRR"
      text: "Input revenue lost from cancellations."
    - name: "Review Quick Ratio"
      text: "Analyze your Quick Ratio to evaluate revenue growth velocity relative to revenue loss."

faq:
  - question: "What is the SaaS Quick Ratio?"
    answer: "The SaaS Quick Ratio measures a subscription business's growth efficiency by dividing gross MRR gains (New MRR + Expansion MRR) by gross MRR losses (Contraction MRR + Churned MRR)."
  - question: "What is the formula for the SaaS Quick Ratio?"
    answer: "SaaS Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)."
  - question: "What is a good SaaS Quick Ratio benchmark?"
    answer: "A Quick Ratio of 4.0 or higher is considered excellent (venture-scale growth). A ratio between 2.0 and 4.0 is healthy, while a ratio below 1.0 means your business is shrinking."
  - question: "Why is the SaaS Quick Ratio named after the accounting quick ratio?"
    answer: "Both metrics assess liquidity and health under pressure. In SaaS, it evaluates whether new growth outpaces churn fast enough to support compounding momentum."
  - question: "How does high expansion MRR improve the Quick Ratio?"
    answer: "Expansion MRR increases the numerator without requiring new marketing acquisition spend, rapidly boosting your Quick Ratio efficiency."
  - question: "Can a company grow overall revenue with a Quick Ratio below 4.0?"
    answer: "Yes, any Quick Ratio above 1.0 means net MRR is positive, but companies with ratios between 1.0 and 2.0 burn significant capital replacing churned revenue."
  - question: "How often should founders check their SaaS Quick Ratio?"
    answer: "Founders and CFOs typically track the SaaS Quick Ratio monthly alongside CAC payback period and Net Revenue Retention (NRR)."

---

# SaaS Quick Ratio Calculator

Calculate your SaaS Quick Ratio to evaluate how efficiently your revenue growth outpaces monthly churn and contraction losses.

<!-- more -->

## Why Use This SaaS Quick Ratio Calculator

Popularized by Social Capital venture partner Mamoon Hamid, the SaaS Quick Ratio is one of the most effective diagnostic metrics for growth quality. This calculator helps you:

- **⚡ Measure Growth Efficiency** — verify how many dollars of MRR you add for every dollar lost.
- **🛡️ Detect Heavy Churn Headwinds** — identify if sales efforts are being wasted filling a leaky bucket.
- **🎯 VC & Investment Pitching** — present standardized growth health metrics to venture capital investors.
- **📊 Compare Expansion vs. New Logo Efficiency** — optimize sales and customer success resource allocation.

---

## SaaS Quick Ratio Formula

$$\text{SaaS Quick Ratio} = \frac{\text{New MRR} + \text{Expansion MRR}}{\text{Contraction MRR} + \text{Churned MRR}}$$

$$\text{Net MRR Addition} = (\text{New MRR} + \text{Expansion MRR}) - (\text{Contraction MRR} + \text{Churned MRR})$$

---

## SaaS Quick Ratio Venture Benchmarks

| Quick Ratio | Growth Status | Business Health & Investor Reaction |
| :--- | :--- | :--- |
| **< 1.0** | Shrinking | Contracting revenue; severe churn crisis |
| **1.0 – 2.0** | Slow Growth | High churn drag; acquisition budget wasted replacing lost revenue |
| **2.0 – 4.0** | Solid Growth | Healthy baseline for growing SaaS companies |
| **4.0+** | Hyper-Growth | Elite venture-scale efficiency; growth far outpaces revenue leakage |

---

## How to Use This SaaS Quick Ratio Calculator

1. Enter **New Logo MRR** gained from new subscriptions.
2. Enter **Expansion MRR** gained from existing account upgrades.
3. Enter **Contraction MRR** lost from downgrades.
4. Enter **Churned MRR** lost from cancellations.
5. Instantly review your **SaaS Quick Ratio** and **Net MRR Addition**.

---

## Frequently Asked Questions

### What is the SaaS Quick Ratio?
The SaaS Quick Ratio measures a subscription business's growth efficiency by dividing gross MRR gains (New MRR + Expansion MRR) by gross MRR losses (Contraction MRR + Churned MRR).

### What is the formula for the SaaS Quick Ratio?
SaaS Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR).

### What is a good SaaS Quick Ratio benchmark?
A Quick Ratio of 4.0 or higher is considered excellent (venture-scale growth). A ratio between 2.0 and 4.0 is healthy, while a ratio below 1.0 means your business is shrinking.

### Why is the SaaS Quick Ratio named after the accounting quick ratio?
Both metrics assess liquidity and health under pressure. In SaaS, it evaluates whether new growth outpaces churn fast enough to support compounding momentum.

### How does high expansion MRR improve the Quick Ratio?
Expansion MRR increases the numerator without requiring new marketing acquisition spend, rapidly boosting your Quick Ratio efficiency.

### Can a company grow overall revenue with a Quick Ratio below 4.0?
Yes, any Quick Ratio above 1.0 means net MRR is positive, but companies with ratios between 1.0 and 2.0 burn significant capital replacing churned revenue.

### How often should founders check their SaaS Quick Ratio?
Founders and CFOs typically track the SaaS Quick Ratio monthly alongside CAC payback period and Net Revenue Retention (NRR).
