---
layout: tool
title: "Home Sale Capital Gains Exclusion | IRS Sec 121 Tool"
description: "Calculate capital gains tax on primary residence sales using IRS Section 121 exclusions ($250k single / $500k married). 100% private browser tool."
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
    - name: "Input purchase & sale prices"
      text: "Enter original purchase price, home sale price, improvements, and selling costs."

faq:
  - question: "What is the IRS Section 121 home sale tax exclusion?"
    answer: "IRS Section 121 allows eligible homeowners to exclude up to $250,000 of capital gains (or $500,000 for married couples filing jointly) from federal income tax upon selling their primary residence."
  - question: "What ownership and residence test rules apply to Section 121?"
    answer: "To qualify for the full exclusion, you must have owned the home and used it as your primary residence for at least 2 out of the 5 years preceding the sale date."
  - question: "How do capital improvements increase a home's adjusted cost basis?"
    answer: "Un-reimbursed permanent improvements (like room additions, roof replacement, kitchen remodeling, or new HVAC systems) are added to your purchase price, reducing net taxable capital gains."
  - question: "Can real estate agent commissions and closing fees reduce capital gains?"
    answer: "Yes, selling expenses—including real estate agent commissions, legal fees, title search costs, and escrow charges—are deducted from gross sale proceeds."
  - question: "How often can you claim the Section 121 primary residence exclusion?"
    answer: "You can claim the Section 121 tax exclusion once every two years, provided you meet the 2-in-5-year ownership and primary residency requirements."
  - question: "Are partial Section 121 exclusions allowed for premature home sales?"
    answer: "Yes, partial exclusions are allowed if a sale is forced by qualifying unforeseen circumstances, including job relocation over 50 miles, health conditions, or divorce."
  - question: "Is confidential property and transaction data stored anywhere?"
    answer: "No, all capital gain exclusion calculations run 100% locally inside your web browser. No property values, sale amounts, or personal tax data leave your device."
---

# Home Sale Capital Gains Exclusion Calculator

Calculate capital gains tax on primary residence sales and evaluate the **IRS Section 121 Exclusion** ($250,000 Single / $500,000 Married) with 100% private browser execution.

<!-- more -->

## Why Use the Home Sale Capital Gains Exclusion Calculator?

Selling a primary residence often results in capital appreciation. Internal Revenue Code Section 121 provides a tax exclusion, allowing individual taxpayers to exclude up to $250,000 of capital gains (or $500,000 for married couples filing jointly) from federal income taxation. However, significant appreciation can generate gains exceeding exclusion limits.

Accurately calculating net taxable gain requires building your property's adjusted cost basis. Cost basis includes original purchase price plus capital improvements (such as roof replacement or kitchen remodels) and selling fees like realtor commissions. Subtracting these adjustments from sales proceeds minimizes taxable excess gains. This calculator models your cost basis, applies Section 121 limits, and projects capital gains taxes securely and privately.

## Mathematical Formulas & Mechanics

The calculation computes adjusted cost basis, net realized gain, Section 121 tax exclusion, and remaining taxable profit.

### 1. Adjusted Cost Basis Calculation
Adjusted cost basis ($B_{adj}$) equals original purchase price ($P_{buy}$) plus capital improvements ($I_{cap}$):

$$B_{adj} = P_{buy} + I_{cap}$$

### 2. Net Realized Gain & Taxable Profit
Net sales proceeds ($P_{net}$) subtract commissions and selling fees ($S_{fees}$) from sale price ($P_{sale}$):

$$P_{net} = P_{sale} - S_{fees}$$

$$G_{realized} = P_{net} - B_{adj}$$

Taxable capital gain ($G_{taxable}$) applies statutory exclusion limits ($E_{cap}$):

$$E_{applied} = \min\left(G_{realized}, E_{cap}\right)$$

$$G_{taxable} = \max\left(0, G_{realized} - E_{applied}\right)$$

Where $P_{sale}$ represents gross price, $I_{cap}$ represents qualified improvements, $S_{fees}$ includes closing costs, and $G_{taxable}$ is profit subject to tax.

## Real-World Comparison & Benchmark Table

| Original Purchase Price | Capital Improvements | Selling Price | Selling Expenses | Adjusted Basis | Realized Gain | Filing Status Exclusion | Taxable Capital Gain |
|---|---|---|---|---|---|---|---|
| **$250,000** | $30,000 | $450,000 | $25,000 | $280,000 | $145,000 | Single ($250k Cap) | **$0** |
| **$300,000** | $45,000 | $650,000 | $35,000 | $345,000 | $270,000 | Single ($250k Cap) | **$20,000** |
| **$300,000** | $45,000 | $650,000 | $35,000 | $345,000 | $270,000 | Married ($500k Cap) | **$0** |
| **$450,000** | $80,000 | $1,150,000 | $65,000 | $530,000 | $555,000 | Married ($500k Cap) | **$55,000** |
| **$600,000** | $120,000 | $1,500,000 | $85,000 | $720,000 | $695,000 | Married ($500k Cap) | **$195,000** |

## Step-by-Step How-To Guide

1. **Enter Gross Home Sale Price**: Input final sale price agreed upon in closing documents.
2. **Input Original Purchase Price**: Enter original home purchase price paid when acquiring the property.
3. **Add Documented Capital Improvements**: Input total cost of permanent structural additions and major renovations.
4. **Enter Selling Expenses**: Include realtor commission fees, legal costs, title charges, and escrow fees.
5. **Select Filing Status**: Choose Single ($250,000 exclusion cap) or Married Filing Jointly ($500,000 exclusion cap).

## Frequently Asked Questions

### What is the IRS Section 121 home sale tax exclusion?
IRS Section 121 allows eligible homeowners to exclude up to $250,000 of capital gains (or $500,000 for married couples filing jointly) from federal income tax upon selling their primary residence.

### What ownership and residence test rules apply to Section 121?
To qualify for the full exclusion, you must have owned the home and used it as your primary residence for at least 2 out of the 5 years preceding the sale date.

### How do capital improvements increase a home's adjusted cost basis?
Un-reimbursed permanent improvements (like room additions, roof replacement, kitchen remodeling, or new HVAC systems) are added to your purchase price, reducing net taxable capital gains.

### Can real estate agent commissions and closing fees reduce capital gains?
Yes, selling expenses—including real estate agent commissions, legal fees, title search costs, and escrow charges—are deducted from gross sale proceeds.

### How often can you claim the Section 121 primary residence exclusion?
You can claim the Section 121 tax exclusion once every two years, provided you meet the 2-in-5-year ownership and primary residency requirements.

### Are partial Section 121 exclusions allowed for premature home sales?
Yes, partial exclusions are allowed if a sale is forced by qualifying unforeseen circumstances, including job relocation over 50 miles, health conditions, or divorce.

### Is confidential property and transaction data stored anywhere?
No, all capital gain exclusion calculations run 100% locally inside your web browser. No property values, sale amounts, or personal tax data leave your device.
