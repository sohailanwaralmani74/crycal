---
layout: tool
title: "Dilution | Interactive Online Tool"
description: "Calculate existing shareholder equity dilution percentage and post-round equity value after issuing new shares to investors and option pools."
permalink: /dilution-calculator
tool_id: dilution-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: preMoneyValuation
    label: Pre-Money Valuation
    type: number
    default: 10000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 10000000"

  - id: investmentAmount
    label: Investment Raised Amount
    type: number
    default: 2500000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 2500000"

  - id: existingFounderOwnership
    label: Existing Founder Ownership (%)
    type: number
    default: 80.0
    step: 1
    min: 1
    max: 100
    suffix: "%"
    placeholder: "e.g., 80.0"

  - id: optionPoolPercent
    label: New Option Pool (% of Post-Money)
    type: number
    default: 10.0
    step: 0.5
    min: 0
    max: 30
    suffix: "%"
    placeholder: "e.g., 10.0"

outputs:
  - id: postMoneyValuation
    label: Post-Money Valuation
  - id: investorOwnership
    label: Investor Ownership
  - id: newFounderOwnership
    label: New Founder Equity
  - id: founderDilution
    label: Founder Ownership Drop
  - id: founderValue
    label: Post-Round Founder Equity Value

charts:
  tabs:
    - id: postRoundCapTable
      label: Post-Round Cap Table
    - id: preVsPostOwnership
      label: Pre vs Post Ownership

history_columns:
  - key: preMoneyValuation
    label: Pre-Money ($)
    source: input
  - key: investmentAmount
    label: Investment ($)
    source: input
  - key: investorOwnership
    label: Investor Equity (%)
    source: output
  - key: newFounderOwnership
    label: Post-Round Founder Equity (%)
    source: output

js_file: assets/js/calculators/dilution-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Equity Dilution Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate startup equity dilution, post-money valuation, and post-round capitalization table percentages."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Post-Money Valuation Modeling"
    - "Investor Ownership Dilution Calculation"
    - "Option Pool Dilution Impact"
    - "Cap Table Breakdown Chart"
    - "Pre vs Post Ownership Comparison"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Equity Dilution Calculator

howto:
  name: "How to Calculate Startup Equity Dilution"
  description: "Follow these steps to model founder equity dilution after an investment round."
  step:
    - name: "Enter Pre-Money Valuation"
      text: "Input agreed company valuation prior to new capital."
    - name: "Input Investment Raised"
      text: "Enter total dollar amount being invested."
    - name: "Provide Current Founder Ownership %"
      text: "Input current pre-round founder stake percentage."
    - name: "Specify Option Pool Creation %"
      text: "Input unallocated option pool target percentage."

faq:
  - question: "What is equity dilution in a startup?"
    answer: "Equity dilution occurs when a company issues new shares to new investors or employee option pools, reducing the ownership percentage of existing shareholders."
  - question: "How is post-money valuation calculated?"
    answer: "Post-Money Valuation = Pre-Money Valuation + New Investment Amount."
  - question: "How does an unallocated option pool cause extra dilution?"
    answer: "Creating an unallocated option pool pre-money forces existing founders to absorb 100% of the pool dilution before new investor capital enters."
  - question: "Does dilution reduce the total dollar value of founder shares?"
    answer: "Not necessarily. Although founder percentage ownership decreases, if the valuation increases sufficiently, the dollar value of the founder's stake increases."
  - question: "What is a typical investor dilution percentage per round?"
    answer: "Priced Seed and Series A funding rounds typically dilute existing shareholders by 15% to 25% per round."
  - question: "Is my cap table data secure?"
    answer: "Yes. All computations execute locally in your web browser with zero server data storage."

---

# Dilution Calculator

Calculate founder ownership retention and equity dilution with our free **Equity Dilution Calculator**. Model post-money valuations, investor ownership stakes, option pool dilution, and post-round equity value.

<!-- more -->

## Understanding Startup Equity Dilution

When raising venture capital, startups issue new shares to investors rather than selling existing founder shares. Issuing new shares increases total shares outstanding, which dilutes existing shareholders' percentage ownership.

Key terms:
- **Pre-Money Valuation**: Valuation agreed upon before receiving investment ($V_{pre}$).
- **Investment Amount**: Amount of cash raised ($I$).
- **Post-Money Valuation**: $V_{post} = V_{pre} + I$.
- **Investor Ownership %**: $O_{investor} = \frac{I}{V_{post}} \times 100$.

---

## Equity Dilution Mathematical Formulas

$$\text{Post-Money Valuation} = V_{pre} + I$$

$$\text{Investor Ownership (\%)} = \left( \frac{I}{V_{post}} \right) \times 100$$

$$\text{New Founder Ownership (\%)} = O_{founder, pre} \times \left( 1 - \frac{O_{investor} + O_{pool}}{100} \right)$$

$$\text{Post-Round Founder Stake Value (\$)} = V_{post} \times \left( \frac{\text{New Founder Ownership}}{100} \right)$$

---

## Round Ownership Dilution Example

| Stage / Component | Pre-Round Stake | Post-Round Stake | Valuation Impact |
| :--- | :--- | :--- | :--- |
| **Founders** | 80.0% | **57.6%** | Value increases from $8.0M to $7.2M (with 10% Pool) |
| **New Investors** | 0.0% | **20.0%** | $2.5M invested at $12.5M Post |
| **Option Pool** | 0.0% | **10.0%** | Pre-money pool shuffle |
| **Existing Investors** | 20.0% | **12.4%** | Pro-rata dilution absorbed |

---

## Step-by-Step Guide to Calculating Equity Dilution

1. **Enter Pre-Money Valuation**: Input the negotiated valuation before new capital.
2. **Enter Investment Amount**: Input the total amount of fresh capital raised.
3. **Enter Founder Ownership %**: Provide current pre-round ownership percentage.
4. **Set Option Pool Target %**: Specify required unallocated option pool size.
5. **Review Post-Round Cap Table**: Inspect new ownership percentages and dollar values.

---

## Frequently Asked Questions

### What is equity dilution in a startup?
Equity dilution occurs when a company issues new shares to new investors or employee option pools, reducing the ownership percentage of existing shareholders.

### How is post-money valuation calculated?
Post-Money Valuation = Pre-Money Valuation + New Investment Amount.

### How does an unallocated option pool cause extra dilution?
Creating an unallocated option pool pre-money forces existing founders to absorb 100% of the pool dilution before new investor capital enters.

### Does dilution reduce the total dollar value of founder shares?
Not necessarily. Although founder percentage ownership decreases, if the valuation increases sufficiently, the dollar value of the founder's stake increases.

### What is a typical investor dilution percentage per round?
Priced Seed and Series A funding rounds typically dilute existing shareholders by 15% to 25% per round.

### Is my cap table data secure?
Yes. All computations execute locally in your web browser with zero server data storage.
