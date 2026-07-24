---
layout: tool
title: "Option Pool Shuffle | Interactive Online Tool"
description: "Calculate the hidden founder dilution cost of creating an unallocated option pool pre-money versus post-money in venture capital term sheets."
permalink: /option-pool-shuffle-calculator
tool_id: option-pool-shuffle-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: preMoneyValuation
    label: Agreed Pre-Money Valuation
    type: number
    default: 10000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 10000000"

  - id: investmentAmount
    label: Investment Amount Raised
    type: number
    default: 2500000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 2500000"

  - id: optionPoolPercent
    label: Option Pool Target (% of Post-Money)
    type: number
    default: 10.0
    step: 0.5
    min: 0
    max: 30
    suffix: "%"
    placeholder: "e.g., 10.0"

  - id: existingFounderShares
    label: Existing Founder Shares
    type: number
    default: 10000000
    step: 500000
    min: 1
    placeholder: "e.g., 10000000"

outputs:
  - id: preMoneyFounderEquity
    label: Pre-Money Pool Founder Equity
  - id: postMoneyFounderEquity
    label: Post-Money Pool Founder Equity
  - id: shuffleDilutionImpact
    label: Extra Dilution Burden
  - id: dollarCostToFounders
    label: Financial Loss to Founders
  - id: effectivePreMoneyValuation
    label: Effective Founder Pre-Money

charts:
  tabs:
    - id: poolComparison
      label: Founder Ownership Comparison
    - id: capTableComparison
      label: Pre vs Post Money Pool Cap Table

history_columns:
  - key: preMoneyValuation
    label: Agreed Pre ($)
    source: input
  - key: investmentAmount
    label: Investment ($)
    source: input
  - key: optionPoolPercent
    label: Pool (%)
    source: input
  - key: preMoneyFounderEquity
    label: Pre-Pool Founder %
    source: output
  - key: shuffleDilutionImpact
    label: Extra Dilution %
    source: output

js_file: assets/js/calculators/option-pool-shuffle-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Option Pool Shuffle Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the option pool shuffle impact on founder equity dilution under pre-money vs post-money unallocated pool terms."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Pre-Money vs Post-Money Option Pool Dilution Modeling"
    - "Effective Pre-Money Valuation Adjustment"
    - "Founder Financial Loss Calculation"
    - "Interactive Cap Table Comparison Chart"
    - "100% Private Client Browser Computations"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Option Pool Shuffle Calculator

howto:
  name: "How to Calculate the Option Pool Shuffle Dilution Impact"
  description: "Follow these steps to analyze the hidden founder cost of creating an option pool pre-money."
  step:
    - name: "Enter Agreed Pre-Money Valuation"
      text: "Input headline valuation offered in the term sheet."
    - name: "Enter Investment Amount"
      text: "Input round investment capital."
    - name: "Input Target Option Pool Size"
      text: "Input required post-money option pool percentage (e.g., 10%)."
    - name: "Review Pre-Money vs Post-Money Pool Results"
      text: "Compare founder equity retention under both pool creation structures."

faq:
  - question: "What is the 'Option Pool Shuffle' in VC fundraising?"
    answer: "The 'Option Pool Shuffle' is a term sheet tactic where investors require the unallocated employee option pool to be created in the pre-money valuation. This effectively reduces the true pre-money valuation, forcing existing founders to absorb 100% of the option pool dilution."
  - question: "Why do investors prefer pre-money option pools?"
    answer: "Pre-money option pools ensure investors purchase their target ownership percentage (e.g., 20%) fully protected against immediate dilution from the option pool."
  - question: "How does creating a pool pre-money lower effective pre-money valuation?"
    answer: "If headline pre-money is $10M and a 10% post-money pool ($1.25M) is carved out pre-money, the true effective pre-money valuation for founders drops to $8.75M."
  - question: "How can founders negotiate the Option Pool Shuffle?"
    answer: "Founders can negotiate by: 1) Sizing the option pool based on a realistic 12–18 month hiring budget rather than a arbitrary 15% template; 2) Requesting a post-money option pool; or 3) Increasing the headline pre-money valuation."
  - question: "What is a typical option pool size for Series A rounds?"
    answer: "Series A option pools typically range between 8% and 12% of post-money capitalization, depending on existing team size and executive hiring plans."
  - question: "Is my financial calculation data stored?"
    answer: "No. All calculation algorithms run strictly in your web browser."

---

# Option Pool Shuffle Calculator

Calculate the hidden founder dilution cost of creating an unallocated option pool pre-money versus post-money with our free **Option Pool Shuffle Calculator**.

<!-- more -->

## What Is the "Option Pool Shuffle"?

In venture capital term sheets, investors frequently request an **unallocated option pool** (typically 10%–15% of post-money capitalization) for future key hires. However, *where* this pool is created changes founder dilution dramatically:

- **Pre-Money Pool (Standard Investor Term Sheet)**: The entire option pool is carved out of the pre-money valuation. **Founders absorb 100% of the dilution burden.**
- **Post-Money Pool (Founder-Friendly)**: The option pool is created after investment capital enters. **Investors and founders share dilution pro-rata.**

---

## Option Pool Shuffle Mathematical Formulas

$$\text{Post-Money Valuation } (V_{post}) = V_{pre} + I$$

$$\text{Option Pool Dollar Value } (V_{pool}) = V_{post} \times \left( \frac{\text{Pool \%}}{100} \right)$$

$$\text{Effective Pre-Money Valuation for Founders} = V_{pre} - V_{pool}$$

$$\text{Pre-Money Pool Founder Equity (\%)} = \frac{V_{pre} - V_{pool}}{V_{post}} \times 100$$

$$\text{Post-Money Pool Founder Equity (\%)} = \left( \frac{V_{pre}}{V_{post}} \right) \times \left( 1 - \frac{\text{Pool \%}}{100} \right) \times 100$$

---

## Pre-Money vs Post-Money Pool Comparison ($10M Pre, $2.5M Raised, 10% Pool)

| Cap Table Component | Pre-Money Pool (Investor Term) | Post-Money Pool (Founder Friendly) | Founder Impact |
| :--- | :--- | :--- | :--- |
| **Founder Ownership** | **70.0%** | **72.0%** | **+2.0% extra founder stake** |
| **Investor Ownership** | 20.0% | 18.0% | Investors share pool dilution |
| **Option Pool** | 10.0% | 10.0% | 10.0% pool created |
| **Effective Pre-Money** | **$8,750,000** | **$10,000,000** | **$1,250,000 hidden pre-money discount** |

---

## Step-by-Step Guide to Calculating Option Pool Dilution

1. **Enter Headline Pre-Money Valuation**: Input the proposed pre-money valuation.
2. **Enter Investment Amount**: Input the investment capital to be raised.
3. **Set Option Pool Target %**: Input required post-money option pool percentage.
4. **Compare Founder Ownership %**: Review founder equity under Pre-Money vs Post-Money pool structures.

---

## Frequently Asked Questions

### What is the 'Option Pool Shuffle' in VC fundraising?
The 'Option Pool Shuffle' is a term sheet tactic where investors require the unallocated employee option pool to be created in the pre-money valuation. This effectively reduces the true pre-money valuation, forcing existing founders to absorb 100% of the option pool dilution.

### Why do investors prefer pre-money option pools?
Pre-money option pools ensure investors purchase their target ownership percentage (e.g., 20%) fully protected against immediate dilution from the option pool.

### How does creating a pool pre-money lower effective pre-money valuation?
If headline pre-money is $10M and a 10% post-money pool ($1.25M) is carved out pre-money, the true effective pre-money valuation for founders drops to $8.75M.

### How can founders negotiate the Option Pool Shuffle?
Founders can negotiate by: 1) Sizing the option pool based on a realistic 12–18 month hiring budget rather than a arbitrary 15% template; 2) Requesting a post-money option pool; or 3) Increasing the headline pre-money valuation.

### What is a typical option pool size for Series A rounds?
Series A option pools typically range between 8% and 12% of post-money capitalization, depending on existing team size and executive hiring plans.

### Is my financial calculation data stored?
No. All calculation algorithms run strictly in your web browser.
