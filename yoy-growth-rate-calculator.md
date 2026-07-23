---
layout: tool
title: YoY Growth Rate Calculator – Year-Over-Year Growth
description: Calculate Year-over-Year (YoY) ARR growth percentage. Measure annual revenue expansion and compare growth velocity over 12-month periods.
permalink: /yoy-growth-rate-calculator
tool_id: yoy-growth-rate-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: priorYearRevenue
    label: Prior Year Revenue / ARR ($)
    type: number
    default: 1000000
    step: 50000
    min: 1
    currency: true
    placeholder: "e.g., 1000000"

  - id: currentYearRevenue
    label: Current Year Revenue / ARR ($)
    type: number
    default: 2500000
    step: 50000
    min: 0
    currency: true
    placeholder: "e.g., 2500000"

outputs:
  - id: yoyGrowthPercentage
    label: Year-Over-Year (YoY) Growth Rate (%)
  - id: absoluteDollarGrowth
    label: Absolute Dollar Growth ($)
  - id: growthMultiple
    label: Growth Multiple (x)
  - id: impliedMonthlyGrowthRate
    label: Implied Monthly CMGR (%)

charts:
  tabs:
    - id: comparison
      label: Prior vs. Current Year Revenue

history_columns:
  - key: priorYearRevenue
    label: Prior Year ARR
    source: input
  - key: currentYearRevenue
    label: Current Year ARR
    source: input
  - key: yoyGrowthPercentage
    label: YoY Growth (%)
    source: output
  - key: absoluteDollarGrowth
    label: Dollar Growth
    source: output

js_file: /assets/js/calculators/yoy-growth-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "YoY Growth Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Year-over-Year (YoY) ARR growth percentage. Measure annual revenue expansion and compare growth velocity over 12-month periods."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Year-Over-Year (YoY) Growth % Calculation"
    - "Absolute Dollar Revenue Increase"
    - "Implied CMGR Calculation"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: YoY Growth Rate Calculator

howto:
  name: "How to Calculate YoY Growth Rate"
  description: "Follow these steps to compute your Year-Over-Year ARR growth percentage."
  step:
    - name: "Enter Prior Year Revenue"
      text: "Input total ARR or annual revenue at the end of the previous year."
    - name: "Enter Current Year Revenue"
      text: "Input total ARR or annual revenue at the end of the current year."
    - name: "Review YoY Growth %"
      text: "Analyze your YoY growth percentage, absolute dollar increase, and growth multiple."

faq:
  - question: "What is Year-Over-Year (YoY) Growth Rate?"
    answer: "YoY Growth Rate compares financial metrics (such as ARR or revenue) in a given period to the exact same period in the previous year, eliminating seasonal fluctuations."
  - question: "What is the formula for YoY Growth Rate?"
    answer: "YoY Growth Rate (%) = [(Current Year Revenue − Prior Year Revenue) / Prior Year Revenue] × 100."
  - question: "What is a good YoY growth rate for SaaS startups?"
    answer: "Early-stage SaaS startups ($1M–$10M ARR) typically target 100%–300%+ YoY growth ('Triple, Triple, Double, Double'). Mature B2B SaaS companies ($50M+ ARR) benchmark at 30%–50%+ YoY."
  - question: "How does YoY growth differ from MoM growth?"
    answer: "Month-over-Month (MoM) tracks short-term monthly changes, whereas Year-over-Year (YoY) tracks 12-month annual growth momentum and irons out seasonal noise."
  - question: "What is the T2D3 growth framework in SaaS?"
    answer: "T2D3 stands for 'Triple, Triple, Double, Double, Double'—a venture growth benchmark where a startup grows from $1M to $3M (3x), $3M to $9M (3x), $9M to $18M (2x), $18M to $36M (2x), and $36M to $72M (2x)."
  - question: "Can YoY growth rate be negative?"
    answer: "Yes. If current year revenue is lower than prior year revenue, the resulting YoY growth rate is negative, indicating revenue contraction."
  - question: "How do venture capitalists evaluate YoY growth against Rule of 40?"
    answer: "VC investors combine YoY revenue growth rate percentage with free cash flow margin to calculate Rule of 40 financial efficiency."

---

# YoY Growth Rate Calculator

Calculate your **Year-Over-Year (YoY) Growth Rate (%)**, absolute dollar revenue gain, growth multiple (x), and implied compounding monthly growth rate (CMGR).

<!-- more -->

## Why Use This YoY Growth Rate Calculator

Year-over-year revenue expansion is the primary growth benchmark evaluated by venture capital investors, executive boards, and acquirers. This calculator helps you:

- **📊 Quantify Annual Revenue Velocity** — calculate exact percentage increase over 12 months.
- **🚀 Benchmark Against T2D3 Growth** — evaluate if your company is on track for venture-scale compounding.
- **💵 Track Absolute Dollar Scale** — measure net dollar growth added to annual recurring revenue.
- **📐 Compute Implied CMGR** — calculate the equivalent steady monthly growth rate required to achieve your annual target.

---

## YoY Growth Rate Formulas

$$\text{YoY Growth (\%)} = \frac{\text{Current Year Revenue} - \text{Prior Year Revenue}}{\text{Prior Year Revenue}} \times 100$$

$$\text{Absolute Dollar Growth} = \text{Current Year Revenue} - \text{Prior Year Revenue}$$

$$\text{Growth Multiple (x)} = \frac{\text{Current Year Revenue}}{\text{Prior Year Revenue}}$$

$$\text{Implied CMGR (\%)} = \left[ \left(\frac{\text{Current Year Revenue}}{\text{Prior Year Revenue}}\right)^{\frac{1}{12}} - 1 \right] \times 100$$

---

## Venture Capital T2D3 Growth Benchmarks

| Milestone Stage | Target ARR | Required YoY Growth | Benchmark Rating |
| :--- | :--- | :--- | :--- |
| **Year 1 (post $1M)** | $1M → $3M | **200% (3x)** | Elite Hyper-growth |
| **Year 2** | $3M → $9M | **200% (3x)** | Elite Hyper-growth |
| **Year 3** | $9M → $18M | **100% (2x)** | Scale-up momentum |
| **Year 4** | $18M → $36M | **100% (2x)** | Scale-up momentum |
| **Year 5 (Pre-IPO)** | $36M → $72M+ | **100% (2x)** | Pre-IPO market leader |

---

## How to Use This YoY Growth Rate Calculator

1. Enter **Prior Year Revenue / ARR ($)**.
2. Enter **Current Year Revenue / ARR ($)**.
3. Review **YoY Growth Rate (%)**, **Absolute Dollar Growth**, and **Implied Monthly CMGR**.

---

## Frequently Asked Questions

### What is Year-Over-Year (YoY) Growth Rate?
YoY Growth Rate compares financial metrics (such as ARR or revenue) in a given period to the exact same period in the previous year, eliminating seasonal fluctuations.

### What is the formula for YoY Growth Rate?
YoY Growth Rate (%) = [(Current Year Revenue − Prior Year Revenue) / Prior Year Revenue] × 100.

### What is a good YoY growth rate for SaaS startups?
Early-stage SaaS startups ($1M–$10M ARR) typically target 100%–300%+ YoY growth ("Triple, Triple, Double, Double"). Mature B2B SaaS companies ($50M+ ARR) benchmark at 30%–50%+ YoY.

### How does YoY growth differ from MoM growth?
Month-over-Month (MoM) tracks short-term monthly changes, whereas Year-over-Year (YoY) tracks 12-month annual growth momentum and irons out seasonal noise.

### What is the T2D3 growth framework in SaaS?
T2D3 stands for "Triple, Triple, Double, Double, Double"—a venture growth benchmark where a startup grows from $1M to $3M (3x), $3M to $9M (3x), $9M to $18M (2x), $18M to $36M (2x), and $36M to $72M (2x).

### Can YoY growth rate be negative?
Yes. If current year revenue is lower than prior year revenue, the resulting YoY growth rate is negative, indicating revenue contraction.

### How do venture capitalists evaluate YoY growth against Rule of 40?
VC investors combine YoY revenue growth rate percentage with free cash flow margin to calculate Rule of 40 financial efficiency.
