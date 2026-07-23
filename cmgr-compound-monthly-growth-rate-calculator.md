---
layout: tool
title: Compound Monthly Growth Rate (CMGR) Calculator – SaaS Metric
description: Calculate your Compound Monthly Growth Rate (CMGR %). Measure true compounding monthly revenue growth across N months.
permalink: /cmgr-compound-monthly-growth-rate-calculator
tool_id: cmgr-compound-monthly-growth-rate-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: startingRevenue
    label: Starting Revenue / MRR ($)
    type: number
    default: 10000
    step: 500
    min: 1
    currency: true
    placeholder: "e.g., 10000"

  - id: endingRevenue
    label: Ending Revenue / MRR ($)
    type: number
    default: 25000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 25000"

  - id: durationMonths
    label: Duration (Number of Months)
    type: number
    default: 6
    step: 1
    min: 1
    max: 60
    placeholder: "e.g., 6"

outputs:
  - id: cmgrPercentage
    label: Compound Monthly Growth Rate (CMGR)
  - id: totalGrowthPercentage
    label: Total Period Revenue Growth (%)
  - id: annualizedEquivalentRate
    label: Annualized Equivalent Growth Rate (%)
  - id: projectedNextMonthMrr
    label: Projected Next Month MRR

charts:
  tabs:
    - id: compounding
      label: Monthly Compounding Trajectory

history_columns:
  - key: startingRevenue
    label: Starting MRR
    source: input
  - key: endingRevenue
    label: Ending MRR
    source: input
  - key: durationMonths
    label: Months
    source: input
  - key: cmgrPercentage
    label: CMGR (%)
    source: output
  - key: totalGrowthPercentage
    label: Total Growth (%)
    source: output

js_file: /assets/js/calculators/cmgr-compound-monthly-growth-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Compound Monthly Growth Rate (CMGR) Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Compound Monthly Growth Rate (CMGR %). Measure true compounding monthly revenue growth across N months."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Compound Monthly Growth Rate (CMGR %) Calculation"
    - "Total Period Growth % & Annualized Equivalent"
    - "Visual Compounding Growth Curve"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Compound Monthly Growth Rate (CMGR) Calculator

howto:
  name: "How to Calculate Compound Monthly Growth Rate (CMGR)"
  description: "Follow these steps to calculate your compounding monthly growth rate."
  step:
    - name: "Enter Starting Revenue"
      text: "Input MRR or revenue at the beginning of the evaluation period."
    - name: "Enter Ending Revenue"
      text: "Input MRR or revenue at the end of the evaluation period."
    - name: "Enter Duration in Months"
      text: "Input the total number of months between start and end dates."
    - name: "Review CMGR %"
      text: "Analyze your geometric compound monthly growth rate percentage."

faq:
  - question: "What is Compound Monthly Growth Rate (CMGR)?"
    answer: "CMGR is the geometric average month-over-month growth rate required for a business to grow from a starting revenue figure to an ending revenue figure over a specific number of months."
  - question: "What is the formula for CMGR?"
    answer: "CMGR (%) = [(Ending Revenue / Starting Revenue)^(1 / N) − 1] × 100, where N is the number of months."
  - question: "Why is CMGR superior to Average Monthly Growth Rate?"
    answer: "Arithmetic average monthly growth rate distorts true performance due to compounding. CMGR provides the exact geometric compounding rate."
  - question: "What is a good CMGR percentage for SaaS startups?"
    answer: "For early-stage startups ($0–$1M ARR), 10%–15%+ CMGR is top-tier (3x–5x annual growth). For Series A ($1M–$5M ARR), 5%–8% CMGR is benchmark."
  - question: "How do you annualize a monthly CMGR figure?"
    answer: "Annualized Rate (%) = [(1 + CMGR)^12 − 1] × 100."
  - question: "Can CMGR be used for non-revenue metrics like Active Users?"
    answer: "Yes! CMGR can be used to measure compounding monthly growth for Monthly Active Users (MAU), lead volume, or website traffic."
  - question: "How does CMGR compare to CAGR?"
    answer: "CAGR measures annual compounding over years. CMGR measures monthly compounding over months."

---

# Compound Monthly Growth Rate (CMGR) Calculator

Calculate your **Compound Monthly Growth Rate (CMGR %)** to measure true geometric month-over-month revenue growth across any N-month period.

<!-- more -->

## Why Use This CMGR Calculator

Simple average growth rates hide compounding effects and distort performance reporting. This CMGR calculator enables you to:

- **📈 Measure True Compounding Velocity** — calculate exact geometric monthly growth without arithmetic distortions.
- **🎯 Benchmark Venture Milestones** — evaluate whether your monthly growth meets VC expectations (e.g. 10%+ CMGR for Seed).
- **📅 Convert Monthly Growth to Annualized Rate** — see what a monthly CMGR yields over a full 12-month period.
- **🔮 Project Next-Month MRR** — extrapolate compounding growth into upcoming quarters.

---

## CMGR Formulas

$$\text{CMGR (\%)} = \left[ \left(\frac{\text{Ending Revenue}}{\text{Starting Revenue}}\right)^{\frac{1}{N}} - 1 \right] \times 100$$

$$\text{Total Growth (\%)} = \frac{\text{Ending Revenue} - \text{Starting Revenue}}{\text{Starting Revenue}} \times 100$$

$$\text{Annualized Equivalent (\%)} = \left[ (1 + \text{CMGR})^{12} - 1 \right] \times 100$$

Where $N$ is the duration in months.

---

## SaaS CMGR Benchmark Benchmarks

| Startup Phase | Target Monthly CMGR | Equivalent Annual Growth | VC Expectation |
| :--- | :--- | :--- | :--- |
| **Early Seed (< $500k ARR)** | 10% – 15% / mo | 213% – 435% / yr | High growth momentum & PMF discovery |
| **Series A ($1M – $5M ARR)** | 6% – 10% / mo | 101% – 213% / yr | Repeatable sales engine & scaling |
| **Series B ($5M – $20M ARR)** | 4% – 6% / mo | 60% – 101% / yr | Market expansion & retention efficiency |

---

## How to Use This CMGR Calculator

1. Enter **Starting Revenue / MRR ($)** at Month 0.
2. Enter **Ending Revenue / MRR ($)** at Month N.
3. Enter **Duration (Number of Months)**.
4. Review **CMGR %**, **Total Growth %**, and **Annualized Equivalent Growth Rate (%)**.

---

## Frequently Asked Questions

### What is Compound Monthly Growth Rate (CMGR)?
CMGR is the geometric average month-over-month growth rate required for a business to grow from a starting revenue figure to an ending revenue figure over a specific number of months.

### What is the formula for CMGR?
CMGR (%) = [(Ending Revenue / Starting Revenue)^(1 / N) − 1] × 100, where N is the number of months.

### Why is CMGR superior to Average Monthly Growth Rate?
Arithmetic average monthly growth rate distorts true performance due to compounding. CMGR provides the exact geometric compounding rate.

### What is a good CMGR percentage for SaaS startups?
For early-stage startups ($0–$1M ARR), 10%–15%+ CMGR is top-tier (3x–5x annual growth). For Series A ($1M–$5M ARR), 5%–8% CMGR is benchmark.

### How do you annualize a monthly CMGR figure?
Annualized Rate (%) = [(1 + CMGR)^12 − 1] × 100.

### Can CMGR be used for non-revenue metrics like Active Users?
Yes! CMGR can be used to measure compounding monthly growth for Monthly Active Users (MAU), lead volume, or website traffic.

### How does CMGR compare to CAGR?
CAGR measures annual compounding over years. CMGR measures monthly compounding over months.
