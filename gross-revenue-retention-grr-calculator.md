---
layout: tool
title: "Gross Revenue Retention Grr | Interactive Online Tool"
description: "Calculate Gross Revenue Retention (GRR %) rate. Measure recurring revenue retained from existing customers excluding account expansion."
permalink: /gross-revenue-retention-grr-calculator
tool_id: gross-revenue-retention-grr-calculator
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

  - id: contractionMrr
    label: Contraction MRR ($)
    type: number
    default: 4000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 4000"

  - id: churnedMrr
    label: Churned MRR ($)
    type: number
    default: 6000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 6000"

outputs:
  - id: grrPercentage
    label: Gross Revenue Retention (GRR)
  - id: retainedMrr
    label: Retained MRR (Excl. Expansion)
  - id: grossRevenueLoss
    label: Total Gross Dollar Loss
  - id: grossLossRate
    label: Gross Revenue Churn Rate (%)

charts:
  tabs:
    - id: retention
      label: Gross Revenue Retention

history_columns:
  - key: startingMrr
    label: Starting MRR
    source: input
  - key: contractionMrr
    label: Contraction MRR
    source: input
  - key: churnedMrr
    label: Churned MRR
    source: input
  - key: grrPercentage
    label: GRR (%)
    source: output
  - key: retainedMrr
    label: Retained MRR
    source: output

js_file: /assets/js/calculators/gross-revenue-retention-grr-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Gross Revenue Retention (GRR) Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Gross Revenue Retention (GRR %) rate. Measure recurring revenue retained from existing customers excluding account expansion."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Instant GRR % Calculation"
    - "Gross Dollar Loss Breakdown"
    - "Baseline Retention Health Analysis"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Gross Revenue Retention (GRR) Calculator

howto:
  name: "How to Calculate Gross Revenue Retention (GRR)"
  description: "Follow these steps to calculate your SaaS Gross Revenue Retention percentage."
  step:
    - name: "Enter Starting MRR"
      text: "Input total monthly recurring revenue at the beginning of the period."
    - name: "Enter Contraction MRR"
      text: "Input revenue lost from customer plan downgrades."
    - name: "Enter Churned MRR"
      text: "Input revenue lost from customer cancellations."
    - name: "Analyze GRR %"
      text: "Review your GRR percentage to assess baseline churn floor without expansion masking."

faq:
  - question: "What is Gross Revenue Retention (GRR)?"
    answer: "Gross Revenue Retention (GRR) measures the percentage of recurring revenue retained from an existing cohort of customers over a period, accounting for downgrades and churn, but intentionally excluding expansion revenue."
  - question: "Why can GRR never exceed 100%?"
    answer: "Because expansion revenue is omitted from GRR. The maximum possible GRR is 100%, achieved when there is zero contraction and zero churn."
  - question: "What is a good GRR percentage for SaaS?"
    answer: "For Enterprise SaaS, 90%–95%+ is benchmark. For Mid-Market SaaS, 85%–90% is healthy. For SMB SaaS, 80%+ is typical due to higher baseline SMB business turnover."
  - question: "What is the formula for GRR?"
    answer: "GRR % = [(Starting MRR − Contraction MRR − Churned MRR) / Starting MRR] × 100."
  - question: "Why is GRR preferred by lenders and venture capital investors?"
    answer: "GRR isolates baseline customer retention. High expansion revenue can mask underlying customer dissatisfaction if NRR is high but GRR is low."
  - question: "What is the difference between GRR and NRR?"
    answer: "GRR measures baseline revenue stability (max 100%), while NRR measures net growth from existing customers (can exceed 100% via expansion)."
  - question: "How can SaaS companies improve GRR?"
    answer: "By reducing voluntary cancellations, improving onboarding, fixing payment failure workflows (dunning), and preventing customer downgrades."

---

# Gross Revenue Retention Grr Calculator

Calculate your Gross Revenue Retention (GRR %) rate to determine the true baseline stability of your SaaS subscription revenue, removing the masking effect of account upgrades and expansion revenue.

<!-- more -->

## Why Use This GRR Calculator

While Net Revenue Retention (NRR) shows overall net growth from existing customers, Gross Revenue Retention (GRR) reveals how much revenue you would retain if no customer ever upgraded. This GRR calculator helps you:

- **🛡️ Uncover True Customer Floor** — measure raw subscription loss without expansion distortions.
- **🔍 Detect Masked Churn** — spot hidden account erosion masked by hyper-expansion in power accounts.
- **🏦 Satisfy Debt & VC Due Diligence** — provide institutional investors with exact baseline retention metrics.
- **📊 Compare NRR vs. GRR Spread** — evaluate the gap between baseline retention and expansion performance.

---

## Gross Revenue Retention (GRR) Formula

$$\text{GRR (\%)} = \frac{\text{Starting MRR} - \text{Contraction MRR} - \text{Churned MRR}}{\text{Starting MRR}} \times 100$$

$$\text{Gross Revenue Loss} = \text{Contraction MRR} + \text{Churned MRR}$$

Where:
- **Starting MRR**: Total MRR at the start of the evaluation period.
- **Contraction MRR**: Dollar value of tier downgrades during the period.
- **Churned MRR**: Dollar value of full customer cancellations during the period.

---

## SaaS GRR Benchmarks Comparison

| SaaS Category | Target GRR Range | Maximum GRR | Risk Profile |
| :--- | :--- | :--- | :--- |
| **Enterprise SaaS ($50k+ ACV)** | 90% – 95%+ | 100% | Ultra-low risk; high retention & long contracts |
| **Mid-Market SaaS ($5k–$50k ACV)** | 85% – 90% | 100% | Moderate risk; strong product value required |
| **SMB & Self-Serve (<$5k ACV)** | 75% – 85% | 100% | Higher natural attrition; acquisition-dependent |

---

## How to Use This GRR Calculator

1. Input your **Starting MRR** at the beginning of the period.
2. Input **Contraction MRR** lost due to downgrades.
3. Input **Churned MRR** lost due to account cancellations.
4. Instantly view your **GRR %**, **Retained MRR**, and **Gross Revenue Loss**.

---

## Frequently Asked Questions

### What is Gross Revenue Retention (GRR)?
Gross Revenue Retention (GRR) measures the percentage of recurring revenue retained from an existing cohort of customers over a period, accounting for downgrades and churn, but intentionally excluding expansion revenue.

### Why can GRR never exceed 100%?
Because expansion revenue is omitted from GRR. The maximum possible GRR is 100%, achieved when there is zero contraction and zero churn.

### What is a good GRR percentage for SaaS?
For Enterprise SaaS, 90%–95%+ is benchmark. For Mid-Market SaaS, 85%–90% is healthy. For SMB SaaS, 80%+ is typical due to higher baseline SMB business turnover.

### What is the formula for GRR?
GRR % = [(Starting MRR − Contraction MRR − Churned MRR) / Starting MRR] × 100.

### Why is GRR preferred by lenders and venture capital investors?
GRR isolates baseline customer retention. High expansion revenue can mask underlying customer dissatisfaction if NRR is high but GRR is low.

### What is the difference between GRR and NRR?
GRR measures baseline revenue stability (max 100%), while NRR measures net growth from existing customers (can exceed 100% via expansion).

### How can SaaS companies improve GRR?
By reducing voluntary cancellations, improving onboarding, fixing payment failure workflows (dunning), and preventing customer downgrades.
