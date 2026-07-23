---
layout: tool
title: Founder Dilution Calculator – Multi-Round Ownership Retention
description: Track founder ownership retention percentage and dollar equity value across Seed, Series A, and Series B venture capital funding rounds.
permalink: /founder-dilution-multiple-rounds-calculator
tool_id: founder-dilution-multiple-rounds-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: initialFounderOwnership
    label: Initial Founder Ownership (%)
    type: number
    default: 100.0
    step: 1
    min: 1
    max: 100
    suffix: "%"
    placeholder: "e.g., 100.0"

  - id: seedInvestment
    label: Seed Round Investment Raised
    type: number
    default: 1000000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 1000000"

  - id: seedPreMoney
    label: Seed Pre-Money Valuation
    type: number
    default: 4000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 4000000"

  - id: seriesAInvestment
    label: Series A Investment Raised
    type: number
    default: 5000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 5000000"

  - id: seriesAPreMoney
    label: Series A Pre-Money Valuation
    type: number
    default: 20000000
    step: 500000
    min: 0
    currency: true
    placeholder: "e.g., 20000000"

  - id: seriesBInvestment
    label: Series B Investment Raised
    type: number
    default: 15000000
    step: 1000000
    min: 0
    currency: true
    placeholder: "e.g., 15000000"

  - id: seriesBPreMoney
    label: Series B Pre-Money Valuation
    type: number
    default: 60000000
    step: 1000000
    min: 0
    currency: true
    placeholder: "e.g., 60000000"

outputs:
  - id: postSeedOwnership
    label: Founder Equity Post-Seed
  - id: postSeriesAOwnership
    label: Founder Equity Post-Series A
  - id: postSeriesBOwnership
    label: Founder Equity Post-Series B
  - id: totalDilution
    label: Total Cumulative Dilution Drop
  - id: founderEquityValue
    label: Founder Stake Dollar Value at Series B

charts:
  tabs:
    - id: ownershipWaterfall
      label: Founder Equity Retention Waterfall
    - id: capTableProgression
      label: Cap Table Progression across Stages

history_columns:
  - key: seedPreMoney
    label: Seed Pre ($)
    source: input
  - key: seriesAPreMoney
    label: Series A Pre ($)
    source: input
  - key: seriesBPreMoney
    label: Series B Pre ($)
    source: input
  - key: postSeriesBOwnership
    label: Series B Founder %
    source: output
  - key: founderEquityValue
    label: Founder Stake ($)
    source: output

js_file: assets/js/calculators/founder-dilution-multiple-rounds-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Founder Dilution Calculator (Multiple Rounds)"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Track founder ownership retention percentage and equity dollar value across Seed, Series A, and Series B funding rounds."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Multi-Round Dilution Modeling (Seed, Series A, Series B)"
    - "Founder Retention Waterfall Analysis"
    - "Post-Round Cap Table Composition Progression"
    - "Founder Stake Dollar Valuation Tracking"
    - "100% Private Client Browser Computation"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Founder Dilution Calculator

howto:
  name: "How to Track Founder Ownership Across Multiple Funding Rounds"
  description: "Follow these steps to model founder dilution from Seed to Series B."
  step:
    - name: "Enter Initial Founder Equity"
      text: "Input initial founder equity percentage at incorporation (default 100%)."
    - name: "Provide Seed Round Terms"
      text: "Enter investment raised and pre-money valuation for Seed."
    - name: "Provide Series A Terms"
      text: "Input Series A investment amount and pre-money valuation."
    - name: "Provide Series B Terms"
      text: "Input Series B investment amount and pre-money valuation."

faq:
  - question: "How much equity do founders typically retain by Series B?"
    answer: "Founders typically retain 15% to 30% cumulative ownership by the end of a Series B funding round, down from 100% at incorporation."
  - question: "How is multi-round equity dilution calculated?"
    answer: "Dilution compounds across rounds: Founder Ownership Post-Series B = Founder Ownership Post-Series A × (1 − Series B Investor Ownership %)."
  - question: "Does dilution mean founders are losing money?"
    answer: "No. A smaller percentage of a significantly larger post-money company valuation usually results in a much higher total dollar value for the founder's stake."
  - question: "What is a standard dilution percentage for Seed vs Series A vs Series B?"
    answer: "Seed rounds typically dilute 15%–20%, Series A rounds dilute 20%–25%, and Series B rounds dilute 15%–20%."
  - question: "How can founders minimize equity dilution across rounds?"
    answer: "Founders minimize dilution by building capital-efficient growth, negotiating higher pre-money valuations, and right-sizing option pools."
  - question: "Is my multi-round cap table data private?"
    answer: "Yes. All computations execute locally in your client web browser."

---

# Founder Dilution Calculator – Multi-Round Retention

Track founder equity retention and dollar value across Seed, Series A, and Series B funding rounds with our free **Founder Dilution Calculator**. Model cumulative compounding dilution across successive venture capital rounds.

<!-- more -->

## Managing Founder Dilution Across Funding Stages

As a startup grows from incorporation to Seed, Series A, and Series B, issuing new shares to investors reduces the founders' percentage ownership. However, strong valuation growth increases the dollar value of the remaining stake.

Key funding stages:
- **Incorporation**: Founders own 100%.
- **Seed Round**: Typically 15% – 20% investor dilution.
- **Series A Round**: Typically 20% – 25% investor dilution.
- **Series B Round**: Typically 15% – 20% investor dilution.

---

## Multi-Round Dilution Mathematical Model

For each stage $k$ (Seed, Series A, Series B):

$$V_{\text{post}, k} = V_{\text{pre}, k} + I_k$$

$$\text{Investor Ownership}_k = \frac{I_k}{V_{\text{post}, k}}$$

$$\text{Founder Ownership}_k = \text{Founder Ownership}_{k-1} \times \left( 1 - \text{Investor Ownership}_k \right)$$

$$\text{Founder Stake Value at Series B (\$)} = V_{\text{post}, \text{Series B}} \times \left( \frac{\text{Founder Ownership}_{\text{Series B}}}{100} \right)$$

---

## Multi-Round Equity Progression Example

| Stage | Investment Raised | Pre-Money Val | Post-Money Val | Founder Equity % | Founder Stake Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Incorporation** | $0 | $0 | $0 | **100.0%** | $0 |
| **Seed** | $1,000,000 | $4,000,000 | $5,000,000 | **80.0%** | **$4,000,000** |
| **Series A** | $5,000,000 | $20,000,000 | $25,000,000 | **64.0%** | **$16,000,000** |
| **Series B** | $15,000,000 | $60,000,000 | $75,000,000 | **51.2%** | **$38,400,000** |

---

## Step-by-Step Guide to Calculating Multi-Round Dilution

1. **Enter Initial Founder Equity**: Default is 100% at company incorporation.
2. **Enter Seed Round Details**: Input capital raised and pre-money valuation.
3. **Enter Series A Details**: Input Series A capital raised and pre-money valuation.
4. **Enter Series B Details**: Input Series B capital raised and pre-money valuation.
5. **Review Cumulative Retention**: Observe final founder ownership percentage and total stake value.

---

## Frequently Asked Questions

### How much equity do founders typically retain by Series B?
Founders typically retain 15% to 30% cumulative ownership by the end of a Series B funding round, down from 100% at incorporation.

### How is multi-round equity dilution calculated?
Dilution compounds across rounds: Founder Ownership Post-Series B = Founder Ownership Post-Series A × (1 − Series B Investor Ownership %).

### Does dilution mean founders are losing money?
No. A smaller percentage of a significantly larger post-money company valuation usually results in a much higher total dollar value for the founder's stake.

### What is a standard dilution percentage for Seed vs Series A vs Series B?
Seed rounds typically dilute 15%–20%, Series A rounds dilute 20%–25%, and Series B rounds dilute 15%–20%.

### How can founders minimize equity dilution across rounds?
Founders minimize dilution by building capital-efficient growth, negotiating higher pre-money valuations, and right-sizing option pools.

### Is my multi-round cap table data private?
Yes. All computations execute locally in your client web browser.
