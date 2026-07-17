---
layout: tool
title: Sustainable Growth Rate Calculator – Measure Organic Growth Potential
description: Calculate the sustainable growth rate for any company. Enter ROE, retention ratio, or dividend payout ratio to see maximum organic growth rate without external equity.
permalink: /sustainable-growth-rate-calculator
tool_id: sustainable-growth-rate-calculator
category: growth
hide_sidebar: true

inputs:
  - id: roe
    label: Return on Equity (ROE)
    type: number
    default: 15.0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 15.0"

  - id: retentionRatio
    label: Retention Ratio (Plowback Ratio)
    type: number
    default: 60.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 60.0"

  - id: dividendPayoutRatio
    label: Dividend Payout Ratio (%)
    type: number
    default: 40.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 40.0"

  - id: eps
    label: Earnings Per Share (EPS)
    type: number
    default: 5.00
    step: 0.01
    min: 0
    currency: true
    placeholder: "e.g., 5.00"

  - id: dps
    label: Dividends Per Share (DPS)
    type: number
    default: 2.00
    step: 0.01
    min: 0
    currency: true
    placeholder: "e.g., 2.00"

  - id: equity
    label: Total Equity
    type: number
    default: 1000000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 1000000"

  - id: netIncome
    label: Net Income
    type: number
    default: 150000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 150000"

outputs:
  - id: sgr
    label: Sustainable Growth Rate (SGR)
  - id: retentionDisplay
    label: Retention Ratio (if calculated)
  - id: dividendDisplay
    label: Dividend Payout Ratio (if calculated)
  - id: roeDisplay
    label: Return on Equity (if calculated)
  - id: retainedEarnings
    label: Retained Earnings
  - id: totalDividends
    label: Total Dividends Paid
  - id: status
    label: Growth Capacity Status
  - id: recommendation
    label: Recommendation

charts:
  tabs:
    - id: breakdown
      label: SGR Breakdown
    - id: comparison
      label: Growth Comparison

history_columns:
  - key: roe
    label: ROE (%)
    source: input
  - key: retentionRatio
    label: Retention (%)
    source: input
  - key: sgr
    label: SGR (%)
    source: output
  - key: status
    label: Status
    source: output

js_file: assets/js/calculators/sustainable-growth-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Sustainable Growth Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the sustainable growth rate (SGR) for any company. Enter ROE and retention ratio to see the maximum organic growth rate without external equity."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "SGR Calculation (ROE × Retention Ratio)"
    - "Retention Ratio from Dividends"
    - "Dividend Payout Ratio from DPS/EPS"
    - "Retained Earnings Projection"
    - "Visual Growth Breakdown Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Sustainable Growth Rate Calculator

howto:
  name: "How to Use the Sustainable Growth Rate Calculator"
  description: "Follow these steps to calculate a company's sustainable growth rate."
  step:
    - name: "Enter ROE (Return on Equity)"
      text: "Enter the company's ROE percentage."
    - name: "Enter the retention ratio"
      text: "Enter the percentage of earnings retained (or enter dividend payout ratio instead)."
    - name: "Enter optional values"
      text: "Enter EPS, DPS, equity, and net income for additional insights."
    - name: "View your results"
      text: "See the sustainable growth rate, retained earnings, and growth capacity status."

faq:
  - question: "What is the Sustainable Growth Rate (SGR)?"
    answer: "The Sustainable Growth Rate (SGR) is the maximum growth rate a company can achieve without raising additional equity or increasing financial leverage, using only internally generated earnings."
  - question: "What is the formula for sustainable growth rate?"
    answer: "The formula for sustainable growth rate is: SGR = Return on Equity (ROE) × Retention Ratio. The retention ratio is the percentage of earnings retained (1 − dividend payout ratio)."
  - question: "What is a good sustainable growth rate?"
    answer: "A good SGR varies by industry. Generally, an SGR between 10-20% is considered healthy for mature companies, while high-growth companies may have SGR above 25%."
  - question: "What is the difference between SGR and actual growth rate?"
    answer: "The actual growth rate is the company's real sales growth. The SGR is the maximum sustainable rate. If actual growth exceeds SGR, the company may need external financing."
  - question: "How does the sustainable growth rate formula work?"
    answer: "The sustainable growth rate formula works by multiplying ROE by the retention ratio. It shows how much a company can grow using its own earnings without external capital."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Sustainable Growth Rate Calculator – Measure Organic Growth Potential

Calculate the sustainable growth rate (SGR) for any company with our free **Sustainable Growth Rate Calculator**. Enter ROE and retention ratio to see the maximum organic growth rate without external equity — all without your data leaving your browser.

<!-- more -->

## What Is the Sustainable Growth Rate (SGR)?

The **Sustainable Growth Rate (SGR)** is the maximum growth rate a company can achieve without raising additional equity or increasing financial leverage. It represents the rate at which a company can grow using only internally generated earnings.

**The formula for sustainable growth rate is:**

**SGR = Return on Equity (ROE) × Retention Ratio**

Where:
- **ROE** = Net Income ÷ Total Equity (expressed as a percentage)
- **Retention Ratio** = 1 − Dividend Payout Ratio

The **sustainable growth rate formula** is widely used in corporate finance to assess whether a company's projected growth is achievable with its current financial policies.

## How Does the Sustainable Growth Rate Formula Work?

The **sustainable growth rate formula** works by measuring how much a company can grow using its own earnings without external capital.

**Step 1:** Calculate ROE (if not provided):
**ROE = Net Income ÷ Total Equity**

**Step 2:** Calculate Retention Ratio:
**Retention Ratio = 1 − (Dividends per Share ÷ Earnings per Share)**
or simply the percentage of earnings retained.

**Step 3:** Multiply:
**SGR = ROE × Retention Ratio**

**Example:**

| Variable | Value |
|----------|-------|
| Return on Equity (ROE) | 15% |
| Retention Ratio | 60% |
| **Sustainable Growth Rate** | **15% × 60% = 9%** |

This company can grow at a maximum of 9% per year without external financing.

## Who Benefits from the SGR Calculator?

This **sustainable growth rate calculator** is designed for:

- **Financial analysts** evaluating company growth potential
- **Business owners** planning long-term growth strategies
- **Investors** assessing investment opportunities
- **Students** learning the sustainable growth rate formula for CFA or finance courses
- **Management** determining if growth projections are realistic

The tool also provides the **sustainable growth rate example** with **formula for sustainable growth rate** and **sustainable rate of growth** calculations.

---

## Frequently Asked Questions

### What is the Sustainable Growth Rate (SGR)?
The SGR is the maximum growth rate a company can achieve without raising additional equity or increasing financial leverage, using only internally generated earnings.

### What is the formula for sustainable growth rate?
The formula is: SGR = Return on Equity (ROE) × Retention Ratio. The retention ratio is the percentage of earnings retained (1 − dividend payout ratio).

### What is a good sustainable growth rate?
A good SGR varies by industry. Generally, 10-20% is healthy for mature companies, while high-growth companies may have SGR above 25%.

### What is the difference between SGR and actual growth rate?
Actual growth is real sales growth. SGR is the maximum sustainable rate. If actual growth exceeds SGR, the company may need external financing.

### How does the sustainable growth rate formula work?
The formula works by multiplying ROE by the retention ratio, showing how much a company can grow using its own earnings without external capital.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.