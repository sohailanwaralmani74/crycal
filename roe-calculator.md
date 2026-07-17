---
layout: tool
title: ROE Calculator –  Calculate You Equity Return
description: Calculate Return on Equity (ROE) with our free ROE Calculator. Enter net income and shareholders' equity to see the ROE percentage and analysis.
permalink: /roe-calculator
tool_id: roe-calculator
category: growth
hide_sidebar: true

inputs:
  - id: netIncome
    label: Net Income
    type: number
    default: 500000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 500000"

  - id: shareholdersEquity
    label: Shareholders' Equity
    type: number
    default: 2500000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 2500000"

  - id: averageEquity
    label: Average Shareholders' Equity (optional)
    type: number
    default: 0
    step: 10000
    min: 0
    currency: true
    placeholder: "Leave 0 to use end-of-period equity"

outputs:
  - id: roe
    label: Return on Equity (ROE)
  - id: roeBreakdown
    label: ROE Breakdown
  - id: performance
    label: Performance Assessment
  - id: netProfitMargin
    label: Net Profit Margin (if calculable)
  - id: assetTurnover
    label: Asset Turnover (if calculable)
  - id: equityMultiplier
    label: Equity Multiplier (if calculable)
  - id: recommendation
    label: Recommendation

charts:
  tabs:
    - id: breakdown
      label: ROE Breakdown
    - id: comparison
      label: DuPont Analysis

history_columns:
  - key: netIncome
    label: Net Income
    source: input
  - key: shareholdersEquity
    label: Shareholders' Equity
    source: input
  - key: roe
    label: ROE (%)
    source: output
  - key: performance
    label: Performance
    source: output

js_file: assets/js/calculators/roe-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "ROE Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Return on Equity (ROE) with our free ROE Calculator. Enter net income and shareholders' equity to see the ROE percentage and financial performance analysis."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "ROE Calculation"
    - "Performance Assessment"
    - "DuPont Analysis"
    - "Net Profit Margin, Asset Turnover, Equity Multiplier"
    - "Visual Breakdown Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: ROE Calculator

howto:
  name: "How to Use the ROE Calculator"
  description: "Follow these steps to calculate Return on Equity."
  step:
    - name: "Enter net income"
      text: "Enter the company's net income (profit after taxes)."
    - name: "Enter shareholders' equity"
      text: "Enter the total shareholders' equity (total assets minus total liabilities)."
    - name: "Enter average equity (optional)"
      text: "Enter average equity for a more accurate ROE calculation."
    - name: "View your results"
      text: "See the ROE percentage, performance assessment, and DuPont analysis."

faq:
  - question: "What is Return on Equity (ROE)?"
    answer: "Return on Equity (ROE) is a financial ratio that measures how effectively a company generates profits from its shareholders' equity. It is calculated by dividing net income by shareholders' equity."
  - question: "What is the ROE formula?"
    answer: "The ROE formula is: ROE = Net Income ÷ Shareholders' Equity. The result is expressed as a percentage."
  - question: "What is a good ROE?"
    answer: "A good ROE varies by industry. Generally, an ROE of 15-20% is considered healthy for established companies. High-growth companies may have ROE above 25%."
  - question: "What is the DuPont analysis?"
    answer: "DuPont analysis breaks down ROE into three components: Net Profit Margin, Asset Turnover, and Equity Multiplier. It helps identify what is driving the ROE."
  - question: "What is the difference between ROE and ROA?"
    answer: "ROE measures return on shareholders' equity, while ROA measures return on total assets. ROE is typically higher because it excludes debt financing."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# ROE Calculator – Return on Equity Calculator

Calculate Return on Equity (ROE) with our free **ROE Calculator**. Enter net income and shareholders' equity to see the ROE percentage and financial performance analysis — all without your data leaving your browser.

<!-- more -->

## What Is Return on Equity (ROE)?

**Return on Equity (ROE)** is a financial ratio that measures how effectively a company generates profits from its shareholders' equity. It shows how much profit each dollar of common stockholders' equity generates.[reference:0]

**The ROE formula is:**

**ROE = Net Income ÷ Shareholders' Equity**

The result is expressed as a percentage.[reference:1][reference:2]

## How Does the ROE Calculator Work?

This **ROE calculator** computes the return on equity ratio by dividing net income by shareholders' equity.[reference:3]It also provides:

- **Performance Assessment** — evaluates the ROE against industry benchmarks
- **DuPont Analysis** — breaks down ROE into Net Profit Margin, Asset Turnover, and Equity Multiplier[reference:4][reference:5]
- **Visual Breakdown** — charts showing the components of ROE

## Who Benefits from the ROE Calculator?

This **return on equity calculator** is designed for:

- **Investors** evaluating company profitability and management effectiveness[reference:6]
- **Financial analysts** assessing investment opportunities
- **Business owners** measuring operational efficiency
- **Students** learning financial ratio analysis
- **Management** identifying drivers of profitability

---

## Frequently Asked Questions

### What is Return on Equity (ROE)?
Return on Equity (ROE) is a financial ratio that measures how effectively a company generates profits from its shareholders' equity. It is calculated by dividing net income by shareholders' equity.

### What is the ROE formula?
The ROE formula is: ROE = Net Income ÷ Shareholders' Equity. The result is expressed as a percentage.[reference:7]

### What is a good ROE?
A good ROE varies by industry. Generally, an ROE of 15-20% is considered healthy for established companies. High-growth companies may have ROE above 25%.

### What is the DuPont analysis?
DuPont analysis breaks down ROE into three components: Net Profit Margin, Asset Turnover, and Equity Multiplier. It helps identify what is driving the ROE.[reference:8]

### What is the difference between ROE and ROA?
ROE measures return on shareholders' equity, while ROA measures return on total assets. ROE is typically higher because it excludes debt financing.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.