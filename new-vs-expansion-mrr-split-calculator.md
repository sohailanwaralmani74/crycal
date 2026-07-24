---
layout: tool
title: "New Vs Expansion Mrr Split | Interactive Online Tool"
description: "Breakdown monthly MRR growth into % New Logo MRR vs % Expansion MRR. Evaluate customer acquisition reliance vs existing customer expansion."
permalink: /new-vs-expansion-mrr-split-calculator
tool_id: new-vs-expansion-mrr-split-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: newLogoMrr
    label: New Logo MRR ($)
    type: number
    default: 15000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 15000"

  - id: expansionMrr
    label: Expansion MRR ($)
    type: number
    default: 10000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: reactivatedMrr
    label: Reactivated MRR ($)
    type: number
    default: 2000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 2000"

outputs:
  - id: totalGrossNewMrr
    label: Total Gross New MRR Added
  - id: newLogoSharePct
    label: New Logo MRR Share (%)
  - id: expansionSharePct
    label: Expansion MRR Share (%)
  - id: reactivationSharePct
    label: Reactivation MRR Share (%)

charts:
  tabs:
    - id: split
      label: Gross New MRR Breakdown

history_columns:
  - key: newLogoMrr
    label: New Logo MRR
    source: input
  - key: expansionMrr
    label: Expansion MRR
    source: input
  - key: totalGrossNewMrr
    label: Total Gross Added
    source: output
  - key: newLogoSharePct
    label: New Logo %
    source: output
  - key: expansionSharePct
    label: Expansion %
    source: output

js_file: /assets/js/calculators/new-vs-expansion-mrr-split-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "New vs Expansion MRR Split Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Breakdown monthly MRR growth into % New Logo MRR vs % Expansion MRR. Evaluate customer acquisition reliance vs existing customer expansion."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "New Logo vs. Expansion Percentage Split"
    - "Reactivated MRR Attribution"
    - "Growth Source Efficiency Analysis"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: New vs Expansion MRR Split Calculator

howto:
  name: "How to Calculate New vs Expansion MRR Split"
  description: "Follow these steps to compute the percentage breakdown of monthly recurring revenue growth."
  step:
    - name: "Enter New Logo MRR"
      text: "Input revenue added from brand new customer signups."
    - name: "Enter Expansion MRR"
      text: "Input revenue added from existing customer upgrades and add-ons."
    - name: "Enter Reactivated MRR"
      text: "Input revenue from former cancelled customers returning."
    - name: "Review Percentage Split"
      text: "Analyze the percentage contribution of new logo acquisition vs. expansion."

faq:
  - question: "Why is the New vs. Expansion MRR split important for SaaS?"
    answer: "The split shows where growth originates. Early-stage SaaS companies rely mostly on New Logo MRR (70%–90%), while mature scale-ups generate 30%–50%+ of new MRR from account expansion."
  - question: "What is New Logo MRR?"
    answer: "New Logo MRR is monthly recurring revenue generated from first-time customers subscribing to your product during the period."
  - question: "What is Expansion MRR?"
    answer: "Expansion MRR is additional recurring revenue generated from existing customers upgrading their subscription plans or purchasing add-ons."
  - question: "What is Reactivated MRR?"
    answer: "Reactivated MRR is recurring revenue from previous customers who had cancelled but re-subscribed during the current evaluation period."
  - question: "What is a healthy MRR growth split for a Series A/B SaaS company?"
    answer: "A healthy target is 60%–70% New Logo MRR and 30%–40% Expansion MRR. As companies reach scale ($20M+ ARR), expansion should ideally represent 40%–50%+ of gross added MRR."
  - question: "How does the split impact Customer Acquisition Cost (CAC) payback?"
    answer: "High reliance on New Logo MRR increases overall sales & marketing costs (higher CAC). Increasing Expansion MRR lowers blended CAC payback significantly."
  - question: "How often should growth teams measure this split?"
    answer: "SaaS sales and growth leaders track the New vs. Expansion MRR split monthly to allocate marketing spend and Customer Success resources."

---

# New Vs Expansion Mrr Split Calculator

Calculate the percentage split of your monthly recurring revenue growth between **New Logo Acquisition**, **Account Expansion**, and **Customer Reactivation**.

<!-- more -->

## Why Use This New vs Expansion MRR Split Calculator

Relying entirely on new customer acquisition is expensive and unsustainable as a software business matures. This calculator helps you:

- **⚖️ Balance Growth Vectors** — measure the ratio between new customer acquisition and existing account upsells.
- **💰 Lower Blended CAC** — optimize growth strategies by shifting focus toward low-cost expansion revenue.
- **📈 Track Scale Maturity** — benchmark your growth split against early-stage vs. late-stage SaaS companies.
- **🎯 Align Sales & CS Alignment** — evaluate Sales team quota (New Logos) vs. Customer Success quota (Expansion).

---

## MRR Growth Split Formulas

$$\text{Total Gross New MRR} = \text{New Logo MRR} + \text{Expansion MRR} + \text{Reactivated MRR}$$

$$\text{New Logo Share (\%)} = \frac{\text{New Logo MRR}}{\text{Total Gross New MRR}} \times 100$$

$$\text{Expansion Share (\%)} = \frac{\text{Expansion MRR}}{\text{Total Gross New MRR}} \times 100$$

$$\text{Reactivation Share (\%)} = \frac{\text{Reactivated MRR}}{\text{Total Gross New MRR}} \times 100$$

---

## SaaS Maturity Stage Growth Split Benchmarks

| Company Stage | Typical ARR | New Logo MRR % | Expansion MRR % | Strategic Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Seed / Early Stage** | < $1M | 85% – 100% | 0% – 15% | Initial customer acquisition & PMF |
| **Series A / Scale-up** | $1M – $10M | 65% – 80% | 20% – 35% | Repeatable acquisition + early upsell motion |
| **Growth / Pre-IPO** | $10M – $50M+ | 45% – 60% | 40% – 55% | Compounding negative churn & enterprise expansion |

---

## How to Use This New vs Expansion MRR Split Calculator

1. Enter **New Logo MRR** added from new customers.
2. Enter **Expansion MRR** added from tier upgrades and add-ons.
3. Enter **Reactivated MRR** added from returning former customers.
4. Review **New Logo Share (%)**, **Expansion Share (%)**, and **Total Gross New MRR**.

---

## Frequently Asked Questions

### Why is the New vs. Expansion MRR split important for SaaS?
The split shows where growth originates. Early-stage SaaS companies rely mostly on New Logo MRR (70%–90%), while mature scale-ups generate 30%–50%+ of new MRR from account expansion.

### What is New Logo MRR?
New Logo MRR is monthly recurring revenue generated from first-time customers subscribing to your product during the period.

### What is Expansion MRR?
Expansion MRR is additional recurring revenue generated from existing customers upgrading their subscription plans or purchasing add-ons.

### What is Reactivated MRR?
Reactivated MRR is recurring revenue from previous customers who had cancelled but re-subscribed during the current evaluation period.

### What is a healthy MRR growth split for a Series A/B SaaS company?
A healthy target is 60%–70% New Logo MRR and 30%–40% Expansion MRR. As companies reach scale ($20M+ ARR), expansion should ideally represent 40%–50%+ of gross added MRR.

### How does the split impact Customer Acquisition Cost (CAC) payback?
High reliance on New Logo MRR increases overall sales & marketing costs (higher CAC). Increasing Expansion MRR lowers blended CAC payback significantly.

### How often should growth teams measure this split?
SaaS sales and growth leaders track the New vs. Expansion MRR split monthly to allocate marketing spend and Customer Success resources.
