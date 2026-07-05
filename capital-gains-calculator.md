---
layout: tool
title: Capital Gains Calculator
description: Calculate your capital gains tax on stocks, real estate, crypto, and other assets. Enter your sale price, purchase price, costs, and exemptions — works for any country.
permalink: /capital-gains-calculator
tool_id: capital-gains
category: tax
hide_sidebar: true

inputs:
  - id: salePrice
    label: Sale Price
    type: number
    default: 50000
    step: 500
    min: 0
    currency: true
    placeholder: "Sale price of the asset"

  - id: purchasePrice
    label: Purchase Price
    type: number
    default: 30000
    step: 500
    min: 0
    currency: true
    placeholder: "Cost of acquiring the asset"

  - id: holdingPeriod
    label: Holding Period
    type: select
    default: long-term
    options:
      - long-term
      - short-term

  - id: holdingPeriodYears
    label: Holding Period (Years)
    type: number
    default: 2
    step: 0.5
    min: 0
    placeholder: "Number of years held"

  - id: longTermRate
    label: Long-Term Capital Gains Tax Rate (%)
    type: number
    default: 15.0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 15% for long-term gains"

  - id: shortTermRate
    label: Short-Term Capital Gains Tax Rate (%)
    type: number
    default: 25.0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 25% for short-term gains"

  - id: exemptionAmount
    label: Exemption / Allowance
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Annual tax-free allowance (e.g., $3,000 in US)"

  - id: sellingCosts
    label: Selling Costs (Brokerage, Fees, etc.)
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Costs incurred to sell the asset"

  - id: improvementCosts
    label: Improvement / Enhancement Costs
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Costs of improvements or renovations"

  - id: inflationAdjustment
    label: Apply Inflation Adjustment?
    type: select
    default: false
    options:
      - true
      - false

  - id: inflationRate
    label: Inflation Rate (%)
    type: number
    default: 3.0
    step: 0.1
    min: 0
    suffix: '%'
    placeholder: "e.g., 3% annual inflation"

outputs:
  - id: totalGain
    label: Total Capital Gain
  - id: costBasis
    label: Adjusted Cost Basis
  - id: taxableGain
    label: Taxable Gain
  - id: taxOwed
    label: Capital Gains Tax Owed
  - id: netProceeds
    label: Net Proceeds (After Tax)
  - id: effectiveRate
    label: Effective Tax Rate

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: comparison
      label: Comparison
    - id: distribution
      label: Distribution

history_columns:
  - key: salePrice
    label: Sale Price
    source: input
  - key: purchasePrice
    label: Purchase Price
    source: input
  - key: holdingPeriod
    label: Holding Period
    source: input
  - key: totalGain
    label: Total Gain
    source: output
  - key: taxOwed
    label: Tax Owed
    source: output
  - key: netProceeds
    label: Net Proceeds
    source: output

js_file: /assets/js/calculators/capital-gains.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Capital Gains Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your capital gains tax on stocks, real estate, crypto, and other assets. Enter your sale price, purchase price, costs, and exemptions — works for any country."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Short-Term & Long-Term Gains — choose your holding period"
    - "Custom Tax Rates — set your country's rates"
    - "Exemption / Allowance — annual tax-free allowance"
    - "Cost Basis Adjustment — selling costs, improvement costs"
    - "Inflation Adjustment — optional"
    - "Visual Charts — see your gain breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Capital Gains Calculator

howto:
  name: "How to Use the Capital Gains Calculator"
  description: "Follow these steps to calculate your capital gains tax."
  step:
    - name: "Enter the sale price"
      text: "Enter the amount you sold the asset for."
    - name: "Enter the purchase price"
      text: "Enter the amount you originally paid for the asset."
    - name: "Select the holding period"
      text: "Choose long-term or short-term based on how long you held the asset."
    - name: "Enter your tax rates"
      text: "Enter the capital gains tax rates for your country."
    - name: "Add costs and exemptions"
      text: "Enter selling costs, improvement costs, and any exemption/allowance."
    - name: "View your results"
      text: "See your total gain, tax owed, and net proceeds."

faq:
  - question: "What is capital gains tax?"
    answer: "Capital gains tax is a tax on the profit from the sale of an asset. It applies to stocks, real estate, crypto, and other investments."
  - question: "What is the difference between short-term and long-term capital gains?"
    answer: "Short-term capital gains are from assets held for less than the long-term threshold (typically 1 year in many countries). Long-term gains are from assets held for longer and are often taxed at a lower rate."
  - question: "How is the cost basis calculated?"
    answer: "Cost basis = Purchase Price + Improvement Costs + Selling Costs. It represents your total investment in the asset."
  - question: "Can I use this for any country?"
    answer: "Yes — you enter your own tax rates and exemption amounts. This tool works for any country's capital gains tax system."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Capital Gains Calculator – Calculate Your Investment Tax

Use this capital gains calculator to calculate the tax on your investment profits. Enter the sale price, purchase price, holding period, tax rates, costs, and exemptions — the tool works for any country. Whether you're selling stocks, real estate, or cryptocurrency, this capital gains tax calculator gives you an accurate estimate of your tax liability.

<!-- more -->

## Why Use This Capital Gains Tax Calculator

Understanding your capital gains tax is essential for investment planning. This capital gains calculator helps you:

- **💰 Calculate Your Tax** — see exactly how much tax you owe.
- **📊 Understand Your Gain** — see the breakdown of your profit.
- **🌍 Works for Any Country** — enter your own rates and exemptions.
- **📈 Visualize Your Tax** — see breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Capital Gains Tax Is Calculated

**Total Gain = Sale Price − (Purchase Price + Improvement Costs + Selling Costs)**

**Cost Basis = Purchase Price + Improvement Costs + Selling Costs**

**Taxable Gain = Total Gain − Exemption Amount**

**Tax Owed = Taxable Gain × Applicable Tax Rate**

**Net Proceeds = Sale Price − Tax Owed − Selling Costs**

---

## How to Use This Capital Gains Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter the **sale price** of the asset.
3.  Enter the **purchase price** of the asset.
4.  Select the **holding period** (long-term or short-term).
5.  Enter your **long-term and short-term tax rates**.
6.  Enter any **exemption / allowance** amount.
7.  Enter **selling costs** (brokerage, fees).
8.  Enter **improvement costs**.
9.  Toggle **inflation adjustment** if applicable.
10. View your results instantly — see your total gain, tax owed, and net proceeds.

---

## Frequently Asked Questions

### What is capital gains tax?
Capital gains tax is a tax on the profit from the sale of an asset. It applies to stocks, real estate, crypto, and other investments.

### What is the difference between short-term and long-term capital gains?
Short-term capital gains are from assets held for less than the long-term threshold (typically 1 year in many countries). Long-term gains are from assets held for longer and are often taxed at a lower rate.

### How is the cost basis calculated?
Cost basis = Purchase Price + Improvement Costs + Selling Costs. It represents your total investment in the asset.

### Can I use this for any country?
Yes — you enter your own tax rates and exemption amounts. This tool works for any country's capital gains tax system.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
