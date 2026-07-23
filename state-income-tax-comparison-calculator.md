---
layout: tool
title: State Income Tax Comparison Calculator – Relocation Tax Savings
description: Compare state income tax liabilities, effective tax rates, and annual take-home pay across different U.S. states.
permalink: /state-income-tax-comparison-calculator
tool_id: state-income-tax-comparison-calculator
category: tax
hide_sidebar: true

inputs:
  - id: grossAnnualIncome
    label: Gross Annual Income / Salary
    type: number
    default: 120000
    step: 5000
    min: 10000
    currency: true
    placeholder: "e.g., 120000"

  - id: state1TaxRate
    label: Current State Effective Tax Rate (%)
    type: number
    default: 9.30
    step: 0.25
    min: 0
    max: 13.3
    suffix: '%'
    placeholder: "e.g., 9.30"

  - id: state2TaxRate
    label: Relocation State Effective Tax Rate (%)
    type: number
    default: 0.00
    step: 0.25
    min: 0
    max: 13.3
    suffix: '%'
    placeholder: "e.g., 0.00"

outputs:
  - id: state1TaxOwed
    label: Current State Annual Tax Owed
  - id: state2TaxOwed
    label: Relocation State Annual Tax Owed
  - id: annualStateTaxSavings
    label: Annual State Income Tax Savings

charts:
  tabs:
    - id: comparison
      label: State Tax Liability Comparison
    - id: takeHome
      label: Annual Take-Home Pay Boost

history_columns:
  - key: grossAnnualIncome
    label: Gross Income
    source: input
  - key: state1TaxRate
    label: State 1 Rate %
    source: input
  - key: state2TaxRate
    label: State 2 Rate %
    source: input
  - key: state1TaxOwed
    label: State 1 Tax
    source: output
  - key: state2TaxOwed
    label: State 2 Tax
    source: output
  - key: annualStateTaxSavings
    label: Annual Savings
    source: output

js_file: assets/js/calculators/state-income-tax-comparison-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "State Income Tax Comparison Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Compare state income tax liabilities and annual relocation tax savings between US states."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "State-by-State Income Tax Modeling — compare high-tax states against zero-income-tax states"
    - "Annual & Monthly Relocation Savings — calculate net take-home pay boosts from moving"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: State Income Tax Comparison Calculator

howto:
  name: "How to Compare State Income Taxes"
  description: "Calculate state income tax savings when moving to a lower-tax state."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input gross income & state rates"
      text: "Enter gross salary and effective tax rates for current vs target state."

faq:
  - question: "Which U.S. states have zero state income tax?"
    answer: "Currently, 9 U.S. states have no traditional state income tax on earned wages: Alaska, Florida, Nevada, New Hampshire (dividends/interest only), South Dakota, Tennessee, Texas, Washington, and Wyoming."
---

# State Income Tax Comparison Calculator – Relocation Tax Savings

Compare annual state income tax liabilities and net relocation cash savings between U.S. states with our free calculator.

<!-- more -->

## State Relocation Comparison Table ($120,000 Income)

| State Comparison | Effective Tax Rate | Annual State Tax Owed | Monthly State Tax | Annual Relocation Savings |
|---|---|---|---|---|
| **High Tax State (e.g., California)** | 9.30% | **$11,160.00** | $930.00 / mo | Baseline |
| **Moderate Tax State (e.g., Utah)** | 4.65% | **$5,580.00** | $465.00 / mo | **+$5,580.00 / year** |
| **Zero Income Tax State (e.g., Texas)** | **0.00%** | **$0.00** | **$0.00 / mo** | **+$11,160.00 / year** |

---

## Frequently Asked Questions

### Which U.S. states have zero state income tax?
Currently, 9 U.S. states have no traditional state income tax on earned wages: Alaska, Florida, Nevada, New Hampshire (dividends/interest only), South Dakota, Tennessee, Texas, Washington, and Wyoming.
