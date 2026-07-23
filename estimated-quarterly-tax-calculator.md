---
layout: tool
title: Estimated Quarterly Tax Calculator – Freelance & Self-Employed Taxes
description: Calculate quarterly estimated tax payments for 1099 freelancers, independent contractors, and business owners.
permalink: /estimated-quarterly-tax-calculator
tool_id: estimated-quarterly-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: annualSelfEmploymentNetIncome
    label: Projected Net 1099 Business Income
    type: number
    default: 85000
    step: 5000
    min: 5000
    currency: true
    placeholder: "e.g., 85000"

  - id: filingStatus
    label: Tax Filing Status
    type: select
    default: Single
    options:
      - Single
      - Married Filing Jointly

  - id: estimatedStateTaxRate
    label: Estimated State Income Tax Rate (%)
    type: number
    default: 5.0
    step: 0.5
    min: 0
    max: 13.3
    suffix: '%'
    placeholder: "e.g., 5.0"

outputs:
  - id: selfEmploymentTaxAmount
    label: Total Self-Employment Tax (SE Tax 15.3%)
  - id: estimatedFederalIncomeTax
    label: Estimated Federal Income Tax
  - id: totalAnnualTaxObligation
    label: Total Combined Annual Tax Liability
  - id: quarterlyPaymentAmount
    label: Required Quarterly Tax Voucher Payment (Form 1040-ES)

charts:
  tabs:
    - id: breakdown
      label: Tax Liability Allocation
    - id: quarterly
      label: Quarterly Voucher Distribution

history_columns:
  - key: annualSelfEmploymentNetIncome
    label: 1099 Income
    source: input
  - key: filingStatus
    label: Status
    source: input
  - key: estimatedStateTaxRate
    label: State %
    source: input
  - key: selfEmploymentTaxAmount
    label: SE Tax
    source: output
  - key: totalAnnualTaxObligation
    label: Annual Total
    source: output
  - key: quarterlyPaymentAmount
    label: Quarterly Pmt
    source: output

js_file: assets/js/calculators/estimated-quarterly-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Estimated Quarterly Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate quarterly estimated tax payments (IRS Form 1040-ES) for self-employed freelancers and gig workers."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Self-Employment Tax Calculation — 15.3% Medicare & Social Security tax modeling"
    - "IRS Form 1040-ES Voucher Projection — calculate Q1, Q2, Q3, and Q4 tax installment payments"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Estimated Quarterly Tax Calculator

howto:
  name: "How to Calculate Quarterly Estimated Taxes"
  description: "Calculate Q1, Q2, Q3, and Q4 tax voucher payments."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input net business profit"
      text: "Enter total projected 1099 freelance revenue minus eligible business expenses."

faq:
  - question: "Who is required to pay quarterly estimated taxes?"
    answer: "Freelancers, 1099 contractors, small business owners, and investors who expect to owe $1,000 or more in federal income tax must pay quarterly estimated taxes to the IRS."
---

# Estimated Quarterly Tax Calculator – Freelance & Self-Employed Taxes

Calculate Form 1040-ES estimated tax voucher payments for **1099 Freelancers, Independent Contractors, and Gig Workers**.

<!-- more -->

## Quarterly Tax Due Dates (IRS 1040-ES)

- **Q1 Voucher**: Due **April 15**
- **Q2 Voucher**: Due **June 15**
- **Q3 Voucher**: Due **September 15**
- **Q4 Voucher**: Due **January 15** (of following tax year)

---

## 1099 Net Business Income Projections ($85,000 Net Income, Single)

| Tax Component | Calculation Basis | Annual Amount | Quarterly Voucher Payment |
|---|---|---|---|
| **Self-Employment Tax (15.3%)** | 92.35% of Net Income × 15.3% | **$12,010.00** | $3,002.50 / quarter |
| **Federal Income Tax** | Net Income minus SE Tax Deduction | **$8,820.00** | $2,205.00 / quarter |
| **State Income Tax (5%)** | Net Income × State Rate | **$4,250.00** | $1,062.50 / quarter |
| **Total Combined Tax** | Combined Annual Tax Obligation | **$25,080.00** | **$6,270.00 / quarter** |

---

## Frequently Asked Questions

### Who is required to pay quarterly estimated taxes?
Freelancers, 1099 contractors, small business owners, and investors who expect to owe $1,000 or more in federal income tax must pay quarterly estimated taxes to the IRS.
