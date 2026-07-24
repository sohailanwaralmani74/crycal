---
layout: tool
title: "Revenue Churn | Interactive Online Tool"
description: "Calculate your Gross and Net Revenue Churn percentages. Measure recurring dollars lost from cancellations and downgrades."
permalink: /revenue-churn-calculator
tool_id: revenue-churn-calculator
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

  - id: churnedMrr
    label: Churned MRR (Cancellations) ($)
    type: number
    default: 5000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 5000"

  - id: contractionMrr
    label: Contraction MRR (Downgrades) ($)
    type: number
    default: 2000
    step: 200
    min: 0
    currency: true
    placeholder: "e.g., 2000"

  - id: expansionMrr
    label: Expansion MRR (Upgrades) ($)
    type: number
    default: 4000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 4000"

outputs:
  - id: grossRevenueChurn
    label: Gross Revenue Churn Rate (%)
  - id: netRevenueChurn
    label: Net Revenue Churn Rate (%)
  - id: totalGrossDollarsLost
    label: Total Gross Dollar Loss
  - id: annualizedChurnCost
    label: Annualized Revenue Loss Impact

charts:
  tabs:
    - id: comparison
      label: Gross vs. Net Churn

history_columns:
  - key: startingMrr
    label: Starting MRR
    source: input
  - key: grossRevenueChurn
    label: Gross Churn (%)
    source: output
  - key: netRevenueChurn
    label: Net Churn (%)
    source: output
  - key: totalGrossDollarsLost
    label: Gross Dollar Loss
    source: output

js_file: /assets/js/calculators/revenue-churn-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Revenue Churn Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Gross and Net Revenue Churn percentages. Measure recurring dollars lost from cancellations and downgrades."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Gross Revenue Churn % Calculation"
    - "Net Revenue Churn % Calculation"
    - "Annualized Loss Impact Analysis"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Revenue Churn Calculator

howto:
  name: "How to Calculate Revenue Churn"
  description: "Follow these steps to calculate your Gross and Net Revenue Churn percentage."
  step:
    - name: "Enter Starting MRR"
      text: "Input your total starting monthly recurring revenue."
    - name: "Input Cancellations & Downgrades"
      text: "Enter churned MRR from cancellations and contraction MRR from downgrades."
    - name: "Input Expansion MRR"
      text: "Enter expansion MRR from upgrades to compute Net Revenue Churn."
    - name: "Review Churn Percentages"
      text: "Analyze both Gross Churn % and Net Churn %."

faq:
  - question: "What is Revenue Churn?"
    answer: "Revenue churn measures the percentage of recurring subscription dollars lost over a given period due to customer cancellations (churn) and plan downgrades (contraction)."
  - question: "What is the difference between Gross Revenue Churn and Net Revenue Churn?"
    answer: "Gross Revenue Churn looks only at lost dollars (cancellations + downgrades). Net Revenue Churn subtracts expansion MRR gained from existing accounts."
  - question: "Can Net Revenue Churn be negative?"
    answer: "Yes! Negative net revenue churn occurs when expansion MRR from existing customers exceeds lost revenue from cancellations and downgrades."
  - question: "What is the formula for Gross Revenue Churn?"
    answer: "Gross Revenue Churn % = [(Churned MRR + Contraction MRR) / Starting MRR] × 100."
  - question: "What is the formula for Net Revenue Churn?"
    answer: "Net Revenue Churn % = [(Churned MRR + Contraction MRR − Expansion MRR) / Starting MRR] × 100."
  - question: "Why is Revenue Churn more informative than Customer Logo Churn?"
    answer: "Because losing a $10,000/mo enterprise account has a vastly different financial impact than losing a $20/mo self-serve account."
  - question: "What is a healthy monthly Gross Revenue Churn rate for B2B SaaS?"
    answer: "For Enterprise SaaS, monthly gross churn should be below 0.5%–1.0%. For Mid-Market, below 1.0%–1.5%. For SMB SaaS, below 2.0%–3.0%."

---

# Revenue Churn Calculator

Calculate your Gross Revenue Churn (%) and Net Revenue Churn (%) rates to understand the exact financial leakage caused by cancellations and plan downgrades.

<!-- more -->

## Why Use This Revenue Churn Calculator

Measuring revenue churn is essential for identifying leaky bucket syndrome in your subscription pipeline. This calculator enables you to:

- **📉 Isolate Dollar Losses** — quantify the exact MRR lost from cancellations and contraction.
- **🔄 Calculate Net vs. Gross Churn** — determine if account expansion offsets gross dollar losses.
- **💸 Annualize Churn Cost** — see how monthly revenue loss compounds into annual ARR destruction.
- **🎯 Benchmark Health Metrics** — compare your revenue churn rate against SaaS industry standards.

---

## Revenue Churn Formulas

$$\text{Gross Revenue Churn (\%)} = \frac{\text{Churned MRR} + \text{Contraction MRR}}{\text{Starting MRR}} \times 100$$

$$\text{Net Revenue Churn (\%)} = \frac{\text{Churned MRR} + \text{Contraction MRR} - \text{Expansion MRR}}{\text{Starting MRR}} \times 100$$

$$\text{Annualized Revenue Loss Impact} = (\text{Churned MRR} + \text{Contraction MRR}) \times 12$$

---

## Gross vs. Net Revenue Churn Comparison

| Metric | Includes Expansion? | Target Range | Business Meaning |
| :--- | :--- | :--- | :--- |
| **Gross Revenue Churn** | No | < 1% / month | Measures pure leakage from dissatisfaction & downgrades |
| **Net Revenue Churn** | Yes | < 0% (Negative) | Measures net expansion performance of existing cohort |

---

## How to Use This Revenue Churn Calculator

1. Enter your **Starting MRR** at the start of the month.
2. Input **Churned MRR** (cancellations) and **Contraction MRR** (downgrades).
3. Input **Expansion MRR** (upgrades) to calculate Net Revenue Churn.
4. Review your **Gross Churn %**, **Net Churn %**, and **Annualized Revenue Loss Impact**.

---

## Frequently Asked Questions

### What is Revenue Churn?
Revenue churn measures the percentage of recurring subscription dollars lost over a given period due to customer cancellations (churn) and plan downgrades (contraction).

### What is the difference between Gross Revenue Churn and Net Revenue Churn?
Gross Revenue Churn looks only at lost dollars (cancellations + downgrades). Net Revenue Churn subtracts expansion MRR gained from existing accounts.

### Can Net Revenue Churn be negative?
Yes! Negative net revenue churn occurs when expansion MRR from existing customers exceeds lost revenue from cancellations and downgrades.

### What is the formula for Gross Revenue Churn?
Gross Revenue Churn % = [(Churned MRR + Contraction MRR) / Starting MRR] × 100.

### What is the formula for Net Revenue Churn?
Net Revenue Churn % = [(Churned MRR + Contraction MRR − Expansion MRR) / Starting MRR] × 100.

### Why is Revenue Churn more informative than Customer Logo Churn?
Because losing a $10,000/mo enterprise account has a vastly different financial impact than losing a $20/mo self-serve account.

### What is a healthy monthly Gross Revenue Churn rate for B2B SaaS?
For Enterprise SaaS, monthly gross churn should be below 0.5%–1.0%. For Mid-Market, below 1.0%–1.5%. For SMB SaaS, below 2.0%–3.0%.
