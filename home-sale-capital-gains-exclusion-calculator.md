---
layout: tool
title: Home Sale Capital Gains Exclusion Calculator – IRS Section 121
description: Calculate capital gains tax on home sales and evaluate the IRS Section 121 primary residence exclusion ($250k single / $500k married).
permalink: /home-sale-capital-gains-exclusion-calculator
tool_id: home-sale-capital-gains-exclusion-calculator
category: tax
hide_sidebar: true

inputs:
  - id: sellingPrice
    label: Home Sale Price
    type: number
    default: 650000
    step: 25000
    min: 10000
    currency: true
    placeholder: "e.g., 650000"

  - id: originalPurchasePrice
    label: Original Purchase Price
    type: number
    default: 300000
    step: 10000
    min: 10000
    currency: true
    placeholder: "e.g., 300000"

  - id: capitalImprovements
    label: Capital Improvements & Renovations
    type: number
    default: 45000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 45000"

  - id: sellingCosts
    label: Selling Expenses (Realtor Commission & Closing)
    type: number
    default: 35000
    step: 2500
    min: 0
    currency: true
    placeholder: "e.g., 35000"

  - id: filingStatus
    label: Tax Filing Status
    type: select
    default: Married Filing Jointly ($500k Exclusion)
    options:
      - Single ($250k Exclusion)
      - Married Filing Jointly ($500k Exclusion)

outputs:
  - id: adjustedCostBasis
    label: Adjusted Cost Basis
  - id: netRealizedCapitalGain
    label: Total Realized Capital Gain
  - id: applicableExclusionAmount
    label: IRS Section 121 Exclusion Benefit
  - id: taxableCapitalGain
    label: Taxable Capital Gain Remaining

charts:
  tabs:
    - id: breakdown
      label: Gain vs Exclusion Summary
    - id: basis
      label: Cost Basis Components

history_columns:
  - key: sellingPrice
    label: Sale Price
    source: input
  - key: originalPurchasePrice
    label: Purchase Price
    source: input
  - key: filingStatus
    label: Status
    source: input
  - key: adjustedCostBasis
    label: Adjusted Basis
    source: output
  - key: netRealizedCapitalGain
    label: Total Gain
    source: output
  - key: taxableCapitalGain
    label: Taxable Gain
    source: output

js_file: assets/js/calculators/home-sale-capital-gains-exclusion-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Home Sale Capital Gains Exclusion Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Section 121 primary residence capital gains tax exclusions ($250,000 single / $500,000 married)."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRS Section 121 Exclusion Rules — calculate $250k single and $500k married joint tax exclusions"
    - "Adjusted Basis Calculation — include purchase price, capital improvements, and selling expenses"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Home Sale Capital Gains Exclusion Calculator

howto:
  name: "How to Calculate Home Sale Exclusion"
  description: "Determine tax-free capital gains on primary home sales."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input sale price & purchase price"
      text: "Enter home selling price, original purchase price, renovations, and selling costs."

faq:
  - question: "What is the IRS Section 121 Home Sale Exclusion?"
    answer: "Section 121 allows homeowners to exclude up to $250,000 (single) or $500,000 (married filing jointly) of capital gains from the sale of their primary residence, provided they owned and lived in the home for at least 2 of the 5 years preceding the sale."
---

# Home Sale Capital Gains Exclusion Calculator – IRS Section 121

Calculate capital gains taxes and tax-free profit allowances under **IRS Section 121**.

<!-- more -->

## Home Sale Tax Exclusion Scenario Table ($650,000 Sale Price)

| Metric / Step | Single Filer ($250k Cap) | Married Joint ($500k Cap) |
|---|---|---|
| **Sale Price** | $650,000 | $650,000 |
| **Adjusted Basis (Purchase + Upgrades + Costs)** | -$380,000 | -$380,000 |
| **Total Realized Gain** | **$270,000** | **$270,000** |
| **Section 121 Tax-Free Exclusion** | -$250,000 | -$270,000 (Up to $500k) |
| **Remaining Taxable Capital Gain** | **$20,000 Taxable** | **$0.00 TAXABLE (100% Tax-Free)** |

---

## Frequently Asked Questions

### What is the IRS Section 121 Home Sale Exclusion?
Section 121 allows homeowners to exclude up to $250,000 (single) or $500,000 (married filing jointly) of capital gains from the sale of their primary residence, provided they owned and lived in the home for at least 2 of the 5 years preceding the sale.
