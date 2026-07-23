---
layout: tool
title: Crypto Tax Calculator – Capital Gains & Losses Estimator
description: Calculate short-term and long-term capital gains tax on cryptocurrency sales, trades, and conversions.
permalink: /crypto-tax-calculator
tool_id: crypto-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: totalProceeds
    label: Total Cryptocurrency Sale Proceeds
    type: number
    default: 25000
    step: 1000
    min: 100
    currency: true
    placeholder: "e.g., 25000"

  - id: totalCostBasis
    label: Original Purchase Cost Basis (including fees)
    type: number
    default: 14000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 14000"

  - id: holdingPeriod
    label: Holding Period Duration
    type: select
    default: Long-Term (Over 1 Year)
    options:
      - Short-Term (1 Year or Less)
      - Long-Term (Over 1 Year)

  - id: estimatedTaxRate
    label: Applicable Income / Capital Gains Tax Rate (%)
    type: number
    default: 15.0
    step: 1.0
    min: 0
    max: 45
    suffix: '%'
    placeholder: "e.g., 15.0"

outputs:
  - id: netCapitalGainLoss
    label: Total Capital Gain / Loss
  - id: estimatedCryptoTaxOwed
    label: Estimated Crypto Capital Gains Tax Owed

charts:
  tabs:
    - id: breakdown
      label: Capital Gain Breakdown
    - id: taxImpact
      label: Tax Owed vs Net Profit

history_columns:
  - key: totalProceeds
    label: Proceeds
    source: input
  - key: totalCostBasis
    label: Cost Basis
    source: input
  - key: holdingPeriod
    label: Holding Period
    source: input
  - key: netCapitalGainLoss
    label: Gain/Loss
    source: output
  - key: estimatedCryptoTaxOwed
    label: Tax Owed
    source: output

js_file: assets/js/calculators/crypto-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Crypto Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate cryptocurrency capital gains, losses, and tax obligations for Bitcoin and altcoins."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Short-Term vs Long-Term Crypto Tax Modeling — compare ordinary income rates against lower long-term capital gains rates"
    - "Cost Basis & Proceeds Calculation — calculate net profit across crypto trades"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Crypto Tax Calculator

howto:
  name: "How to Calculate Crypto Taxes"
  description: "Calculate capital gains taxes on cryptocurrency sales and crypto-to-crypto trades."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input sale proceeds & cost basis"
      text: "Enter total selling price and original purchase cost."

faq:
  - question: "Are cryptocurrency transactions taxable?"
    answer: "Yes! The IRS treats cryptocurrency as property. Selling crypto for cash, trading one cryptocurrency for another, or using crypto to buy goods triggers a taxable capital gains event."
---

# Crypto Tax Calculator – Capital Gains & Losses Estimator

Calculate short-term and long-term capital gains taxes on cryptocurrency transactions with our free calculator.

<!-- more -->

## Crypto Tax Scenario Table ($25,000 Sale Proceeds vs $14,000 Cost Basis)

| Holding Period | Net Capital Gain | Tax Rate Type | Applicable Tax Rate | Estimated Tax Owed | Net Profit Retained |
|---|---|---|---|---|---|
| **Short-Term (≤1 Year)** | **$11,000** | Ordinary Income Tax | 24.0% | **$2,640** | **$8,360** |
| **Long-Term (>1 Year)** | **$11,000** | Preferential Cap Gains | 15.0% | **$1,650** | **$9,350 (Save $990)** |

---

## Frequently Asked Questions

### Are cryptocurrency transactions taxable?
Yes! The IRS treats cryptocurrency as property. Selling crypto for cash, trading one cryptocurrency for another, or using crypto to buy goods triggers a taxable capital gains event.
