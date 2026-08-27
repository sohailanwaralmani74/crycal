---
layout: tool
title: "Capital Gains Calculator | Tax Rates & Deductions"
description: "Calculate your capital gains tax on stocks, real estate, crypto, and other assets. Enter your sale price, purchase price, costs, and exemptions."
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

js_file: assets/js/calculators/capital-gains.js

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

---

# Capital Gains Calculator – Know Your Investment Tax Before You Sell

Selling stocks, crypto, or real estate? Before you celebrate your gains, it's worth knowing what the taxman will take. Our **Capital Gains Calculator** gives you a clear, accurate estimate of your tax liability—so you can plan your sale with confidence and avoid any surprises come tax time.

<!-- more -->

## Why This Calculator Is Essential for Investors

Understanding your capital gains tax isn't just about compliance—it's about smart planning. This calculator helps you:

- **💰 See Exactly What You Owe** — no guessing, just a clear number
- **📊 Break Down Your Gain** — understand what portion is profit and what's tax
- **🌍 Works for Any Country** — enter your own rates, exemptions, and rules
- **📈 Visualize the Breakdown** — clear charts that show where your money goes
- **📜 Save Your Calculations** — export to CSV or Excel for your records
- **🔒 100% Private** — everything runs locally, nothing is stored

---

## How Capital Gains Tax Works (Made Simple)

**Total Gain =** Sale Price − (Purchase Price + Improvements + Selling Costs)

**Your Cost Basis =** Purchase Price + Improvements + Selling Costs  
*(This is your total investment in the asset.)*

**Taxable Gain =** Total Gain − Any Exemptions or Allowances

**Tax Owed =** Taxable Gain × Your Applicable Tax Rate

**Net Proceeds =** Sale Price − Tax Owed − Selling Costs

---

## Real-World Example: See It in Action

Let's say you bought crypto for **$10,000**, spent **$500** on improvements, and sold it for **$25,000** with **$200** in selling fees:

| Step | Calculation | Result |
|------|-------------|--------|
| Cost Basis | $10,000 + $500 + $200 | $10,700 |
| Total Gain | $25,000 − $10,700 | $14,300 |
| Taxable Gain (after $3,000 exemption) | $14,300 − $3,000 | $11,300 |
| Tax Owed (at 15% long-term rate) | $11,300 × 15% | $1,695 |
| Net Proceeds | $25,000 − $1,695 − $200 | $23,105 |

*You walked away with $23,105 after tax and fees—knowing exactly what to expect.*

---

## How to Use This Calculator

Getting your tax estimate is quick and straightforward:

1. **Pick your currency** from the selector in the site header.
2. **Enter the sale price** — what you sold the asset for.
3. **Enter the purchase price** — what you originally paid.
4. **Select the holding period** — short-term or long-term (this affects your tax rate).
5. **Enter your long-term and short-term tax rates** — check your country's rules.
6. **Add any exemption or allowance** — like the $3,000 annual exemption in some countries.
7. **Enter selling costs** — brokerage fees, transaction fees, etc.
8. **Enter improvement costs** — any money you put into improving the asset.
9. **Toggle inflation adjustment** if it applies in your country.
10. **View your results instantly** — total gain, tax owed, and net proceeds.

---

## Who Benefits From This Calculator?

This capital gains tax tool is designed for:

- **Investors** — selling stocks, crypto, or other securities
- **Property owners** — selling real estate or land
- **Traders** — who need to estimate taxes on frequent trades
- **Anyone** — wanting to avoid surprises at tax time
- **Financial planners** — modeling tax scenarios for clients

---

## Common Questions About Capital Gains Tax

### What is capital gains tax in plain English?

It's the tax you pay on the profit you make when you sell an asset for more than you paid for it. That could be stocks, crypto, real estate, or even collectibles.

### What's the difference between short-term and long-term gains?

- **Short-term** — you held the asset for less than the long-term threshold (typically 1 year in many countries). Taxed at your ordinary income tax rate.
- **Long-term** — you held the asset for longer. Often taxed at a lower, preferential rate.

### What goes into my cost basis?

Your cost basis = what you paid for the asset + any improvements + selling costs. It's your total investment in the asset, and it reduces your taxable gain.

### Can I use this calculator for any country?

**Yes.** You enter your own tax rates, exemptions, and rules. The calculator works for any country's capital gains tax system.

### How can I reduce my capital gains tax?

- **Hold assets longer** — to qualify for long-term rates
- **Use exemptions** — like annual allowances or primary residence exclusions
- **Tax-loss harvesting** — sell losing investments to offset gains
- **Use tax-advantaged accounts** — like ISAs, IRAs, or 401(k)s

---

> **💡 Quick Tip:** Always run the numbers before you sell. Knowing your tax liability upfront helps you decide whether to sell now, wait, or structure your sale differently. A little planning can save you a lot in taxes.