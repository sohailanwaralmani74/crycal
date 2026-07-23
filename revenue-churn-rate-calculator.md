---
layout: tool
title: Revenue Churn Rate Calculator – Monthly & Annual Dollar Loss %
description: Calculate your monthly and annual Gross and Net Revenue Churn Rate percentages. Measure recurring dollar loss from cancellations and downgrades.
permalink: /revenue-churn-rate-calculator
tool_id: revenue-churn-rate-calculator
category: saas-churn-retention
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

  - id: grossLostMrr
    label: Gross Lost MRR (Churn + Contraction) ($)
    type: number
    default: 4000
    step: 250
    min: 0
    currency: true
    placeholder: "e.g., 4000"

  - id: expansionMrr
    label: Expansion MRR ($)
    type: number
    default: 6000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 6000"

outputs:
  - id: grossRevenueChurnRatePct
    label: Gross Monthly Revenue Churn Rate (%)
  - id: netRevenueChurnRatePct
    label: Net Monthly Revenue Churn Rate (%)
  - id: annualizedGrossRevenueChurnPct
    label: Annualized Gross Revenue Churn (%)
  - id: netRevenueRetentionPct
    label: Implied NRR (%)

charts:
  tabs:
    - id: comparison
      label: Gross vs. Net Revenue Churn Rate

history_columns:
  - key: startingMrr
    label: Starting MRR
    source: input
  - key: grossLostMrr
    label: Gross Lost MRR
    source: input
  - key: grossRevenueChurnRatePct
    label: Gross Churn Rate (%)
    source: output
  - key: netRevenueChurnRatePct
    label: Net Churn Rate (%)
    source: output

js_file: /assets/js/calculators/revenue-churn-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Revenue Churn Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your monthly and annual Gross and Net Revenue Churn Rate percentages. Measure recurring dollar loss from cancellations and downgrades."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Gross & Net Revenue Churn Rate (%) Calculation"
    - "Annualized Compounding Revenue Churn Rate"
    - "Implied Net Revenue Retention (NRR)"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Churn & Retention
    url: /saas-churn-retention
  - name: Revenue Churn Rate Calculator

howto:
  name: "How to Calculate Revenue Churn Rate"
  description: "Follow these steps to compute monthly Gross and Net Revenue Churn rates."
  step:
    - name: "Enter Starting MRR"
      text: "Input total starting MRR at the beginning of the period."
    - name: "Enter Gross Lost MRR"
      text: "Input dollar value lost from account cancellations and downgrades."
    - name: "Enter Expansion MRR"
      text: "Input revenue gained from existing account upgrades."
    - name: "Review Churn Rates"
      text: "Analyze Gross Revenue Churn Rate %, Net Revenue Churn Rate %, and implied NRR %."

faq:
  - question: "What is Revenue Churn Rate?"
    answer: "Revenue Churn Rate measures the percentage of recurring subscription dollars lost during a period due to customer cancellations (churn) and plan downgrades (contraction)."
  - question: "What is the formula for Gross Revenue Churn Rate %?"
    answer: "Gross Revenue Churn Rate (%) = (Gross Lost MRR / Starting MRR) × 100."
  - question: "What is the formula for Net Revenue Churn Rate %?"
    answer: "Net Revenue Churn Rate (%) = [(Gross Lost MRR − Expansion MRR) / Starting MRR] × 100."
  - question: "What does a negative Net Revenue Churn Rate mean?"
    answer: "A negative Net Revenue Churn Rate means expansion MRR from existing customers exceeded lost revenue from cancellations and downgrades (Net Negative Churn)."
  - question: "What is a healthy monthly Gross Revenue Churn Rate benchmark?"
    answer: "For Enterprise SaaS, monthly gross revenue churn should be under 0.5%–1.0%. For Mid-Market, under 1.0%–1.5%. For SMB SaaS, under 2.0%–3.0%."
  - question: "How does Revenue Churn Rate connect to Net Revenue Retention (NRR)?"
    answer: "Implied NRR (%) = 100% − Net Revenue Churn Rate (%). For example, a -2% Net Revenue Churn Rate yields an NRR of 102%."
  - question: "Why do investors emphasize Revenue Churn over Customer Logo Churn?"
    answer: "Revenue churn measures economic impact. Losing a high-paying enterprise account harms financial sustainability far more than losing several low-tier accounts."

---

# Revenue Churn Rate Calculator

Calculate your monthly **Gross Revenue Churn Rate (%)**, **Net Revenue Churn Rate (%)**, and **Annualized Revenue Churn Rate** to measure financial subscription leakage.

<!-- more -->

## Why Use This Revenue Churn Rate Calculator

Tracking recurring revenue loss is critical for financial predictability. This calculator enables you to:

- **💸 Quantify Dollar Leakage Rate** — measure the percentage of MRR lost each month to cancellations and downgrades.
- **🔄 Calculate Net Negative Churn** — verify if account expansion outweighs gross revenue loss.
- **📅 Model Annualized Revenue Loss** — project 12-month compounding dollar erosion.
- **🎯 Benchmark Executive Health** — evaluate your churn metrics against top SaaS investor benchmarks.

---

## Revenue Churn Rate Formulas

$$\text{Gross Monthly Revenue Churn (\%)} = \frac{\text{Gross Lost MRR}}{\text{Starting MRR}} \times 100$$

$$\text{Net Monthly Revenue Churn (\%)} = \frac{\text{Gross Lost MRR} - \text{Expansion MRR}}{\text{Starting MRR}} \times 100$$

$$\text{Annualized Gross Revenue Churn (\%)} = \left[ 1 - \left(1 - \frac{\text{Gross Monthly Churn}}{100}\right)^{12} \right] \times 100$$

$$\text{Implied NRR (\%)} = 100 - \text{Net Monthly Revenue Churn (\%)} \quad (\text{if measured monthly})$$

---

## Gross vs. Net Revenue Churn Rate Benchmarks

| SaaS Market Target | Gross Churn Rate (Max) | Net Churn Rate (Target) | Implied NRR |
| :--- | :--- | :--- | :--- |
| **Enterprise B2B** | < 0.8% / month | **< -1.5% (Negative)** | **115%+** |
| **Mid-Market B2B** | < 1.2% / month | **< 0% (Negative)** | **105%+** |
| **SMB & Self-Serve** | < 2.5% / month | 0.5% – 1.5% | 90% – 95% |

---

## How to Use This Revenue Churn Rate Calculator

1. Enter **Starting MRR ($)** at the beginning of the period.
2. Enter **Gross Lost MRR ($)** (cancellations + downgrades).
3. Enter **Expansion MRR ($)** (upgrades).
4. Review **Gross Revenue Churn Rate (%)**, **Net Revenue Churn Rate (%)**, and **Implied NRR (%)**.

---

## Frequently Asked Questions

### What is Revenue Churn Rate?
Revenue Churn Rate measures the percentage of recurring subscription dollars lost during a period due to customer cancellations (churn) and plan downgrades (contraction).

### What is the formula for Gross Revenue Churn Rate %?
Gross Revenue Churn Rate (%) = (Gross Lost MRR / Starting MRR) × 100.

### What is the formula for Net Revenue Churn Rate %?
Net Revenue Churn Rate (%) = [(Gross Lost MRR − Expansion MRR) / Starting MRR] × 100.

### What does a negative Net Revenue Churn Rate mean?
A negative Net Revenue Churn Rate means expansion MRR from existing customers exceeded lost revenue from cancellations and downgrades (Net Negative Churn).

### What is a healthy monthly Gross Revenue Churn Rate benchmark?
For Enterprise SaaS, monthly gross revenue churn should be under 0.5%–1.0%. For Mid-Market, under 1.0%–1.5%. For SMB SaaS, under 2.0%–3.0%.

### How does Revenue Churn Rate connect to Net Revenue Retention (NRR)?
Implied NRR (%) = 100% − Net Revenue Churn Rate (%). For example, a -2% Net Revenue Churn Rate yields an NRR of 102%.

### Why do investors emphasize Revenue Churn over Customer Logo Churn?
Revenue churn measures economic impact. Losing a high-paying enterprise account harms financial sustainability far more than losing several low-tier accounts.
