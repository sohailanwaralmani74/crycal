---
layout: tool
title: "Crypto Tax Calculator | Capital Gains Tax Tool"
description: "Calculate cryptocurrency capital gains, short-term vs long-term tax rates, and net tax liabilities. 100% private and free browser-based calculator."
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
  - question: "Are cryptocurrency transactions taxable events?"
    answer: "Yes, the IRS treats cryptocurrency as property. Selling crypto for fiat currency, swapping one token for another, or spending crypto on purchases triggers taxable capital gains."
  - question: "What is the difference between short-term and long-term crypto tax rates?"
    answer: "Crypto held for one year or less is taxed at short-term ordinary income tax rates (10% to 37%), while crypto held over one year qualifies for lower long-term capital gains rates (0%, 15%, or 20%)."
  - question: "How is cryptocurrency cost basis calculated?"
    answer: "Cost basis equals total purchase price plus acquisition fees, trading commissions, and network gas fees incurred when buying or acquiring the cryptocurrency asset."
  - question: "Is trading one crypto asset for another token taxable?"
    answer: "Yes, crypto-to-crypto trades are taxable dispositions. The capital gain or loss is calculated based on the fair market value of the received token at the exact trade execution time."
  - question: "Can I offset crypto capital gains with crypto capital losses?"
    answer: "Yes, capital losses offset capital gains dollar-for-dollar. If total losses exceed gains, taxpayers can deduct up to $3,000 against ordinary income annually and roll over unused losses."
  - question: "How are staking rewards and crypto mining income taxed?"
    answer: "Staking rewards and mining yields are taxed as ordinary income upon receipt based on fair market value. Selling those tokens later creates a secondary capital gain or loss event."
  - question: "Is client crypto data kept private during calculations?"
    answer: "Yes, all calculation logic operates 100% locally inside your web browser. No transaction records, portfolio figures, or API keys leave your personal device."
---

# Crypto Tax Calculator

Calculate short-term and long-term capital gains tax on cryptocurrency sales, trades, and token swaps. Evaluate cost basis, tax bracket impacts, and net profit retention with 100% private browser execution.

<!-- more -->

## Why Use the Crypto Tax Calculator?

Navigating tax obligations for cryptocurrency transactions has become increasingly important as regulatory authorities expand reporting rules. The tax treatment of digital assets depends on holding periods, purchase cost basis, transaction fees, and your income tax bracket. Every disposition—including selling crypto for cash, exchanging tokens, or spending crypto—is classified as a taxable property event.

Failing to calculate crypto capital gains accurately can lead to reporting penalties or overpaying taxes. This calculator models net capital gains under short-term ordinary income rates and long-term capital gains rates. Reviewing potential tax burdens prior to tax deadlines helps investors optimize tax-loss harvesting strategies, choose optimal holding periods, and preserve net profits securely and privately.

## Mathematical Formulas & Mechanics

Cryptocurrency capital gains and losses follow standard property tax principles. Net tax obligations are computed by subtracting total cost basis from gross proceeds.

### 1. Net Capital Gain or Loss
The net capital gain or loss ($G$) is computed from total gross proceeds ($P$) minus total adjusted cost basis ($B_{cost}$), including purchase fees ($F_{buy}$) and sale commissions ($F_{sell}$):

$$B_{cost} = P_{purchase} + F_{buy}$$

$$G = (P_{sale} - F_{sell}) - B_{cost}$$

### 2. Tax Liability Computation
Estimated tax ($T_{crypto}$) depends on holding duration ($H$):

$$T_{crypto} = \begin{cases} G \times R_{ordinary}, & \text{if } H \le 365\text{ days (Short-Term)} \\ G \times R_{cap\_gains}, & \text{if } H > 365\text{ days (Long-Term)} \end{cases}$$

Where $R_{ordinary}$ represents marginal ordinary income tax rates, and $R_{cap\_gains}$ represents applicable long-term capital gains rates.

## Real-World Comparison & Benchmark Table

| Disposition Proceeds | Adjusted Cost Basis | Net Capital Gain | Short-Term Tax Rate (24%) | Long-Term Tax Rate (15%) | Tax Savings from Long-Term |
|---|---|---|---|---|---|
| **$10,000** | $4,000 | $6,000 | $1,440 | $900 | **$540** |
| **$25,000** | $14,000 | $11,000 | $2,640 | $1,650 | **$990** |
| **$50,000** | $20,000 | $30,000 | $7,200 | $4,500 | **$2,700** |
| **$100,000** | $35,000 | $65,000 | $15,600 | $9,750 | **$5,850** |
| **$250,000** | $80,000 | $170,000 | $40,800 | $25,500 | **$15,300** |

## Step-by-Step How-To Guide

1. **Input Total Cryptocurrency Proceeds**: Enter total fiat sale value or fair market value of assets received upon disposition.
2. **Enter Original Cost Basis**: Input purchase cost including trading fees and network gas costs.
3. **Select Asset Holding Period**: Choose between short-term (1 year or less) and long-term (over 1 year).
4. **Specify Applicable Tax Rate**: Enter your estimated marginal income tax bracket or capital gains percentage.
5. **Evaluate Net Results**: Review calculated net capital profit, tax liability, and tax savings from holding long-term.

## Frequently Asked Questions

### Are cryptocurrency transactions taxable events?
Yes, the IRS treats cryptocurrency as property. Selling crypto for fiat currency, swapping one token for another, or spending crypto on purchases triggers taxable capital gains.

### What is the difference between short-term and long-term crypto tax rates?
Crypto held for one year or less is taxed at short-term ordinary income tax rates (10% to 37%), while crypto held over one year qualifies for lower long-term capital gains rates (0%, 15%, or 20%).

### How is cryptocurrency cost basis calculated?
Cost basis equals total purchase price plus acquisition fees, trading commissions, and network gas fees incurred when buying or acquiring the cryptocurrency asset.

### Is trading one crypto asset for another token taxable?
Yes, crypto-to-crypto trades are taxable dispositions. The capital gain or loss is calculated based on the fair market value of the received token at the exact trade execution time.

### Can I offset crypto capital gains with crypto capital losses?
Yes, capital losses offset capital gains dollar-for-dollar. If total losses exceed gains, taxpayers can deduct up to $3,000 against ordinary income annually and roll over unused losses.

### How are staking rewards and crypto mining income taxed?
Staking rewards and mining yields are taxed as ordinary income upon receipt based on fair market value. Selling those tokens later creates a secondary capital gain or loss event.

### Is client crypto data kept private during calculations?
Yes, all calculation logic operates 100% locally inside your web browser. No transaction records, portfolio figures, or API keys leave your personal device.
