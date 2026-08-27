---
layout: tool
title: "Asset Allocation Calculator | Investment & Portfolio Return"
description: "Calculate optimal stock, bond, and cash asset allocation weights based on age and risk tolerance models."
permalink: /asset-allocation-calculator
tool_id: asset-allocation-calculator
category: investing
hide_sidebar: true

inputs:
  - id: currentAge
    label: Your Current Age
    type: number
    default: 35
    step: 1
    min: 18
    max: 90
    placeholder: "e.g., 35"

  - id: riskTolerance
    label: Risk Tolerance Profile
    type: select
    default: Moderate Growth
    options:
      - Conservative
      - Moderate Growth
      - Aggressive Growth

  - id: totalInvestableAssets
    label: Total Investable Assets
    type: number
    default: 150000
    step: 10000
    min: 1000
    currency: true
    placeholder: "e.g., 150000"

outputs:
  - id: recommendedStocksAmount
    label: Recommended Stock Allocation 
  - id: recommendedBondsAmount
    label: Recommended Bond Allocation 
  - id: recommendedCashAmount
    label: Recommended Cash Reserve 

charts:
  tabs:
    - id: breakdown
      label: Recommended Asset Class Weights
    - id: portfolioValues
      label: Dollar Asset Allocation

history_columns:
  - key: currentAge
    label: Age
    source: input
  - key: riskTolerance
    label: Risk Profile
    source: input
  - key: totalInvestableAssets
    label: Total Assets
    source: input
  - key: recommendedStocksAmount
    label: Stocks $
    source: output
  - key: recommendedBondsAmount
    label: Bonds $
    source: output
  - key: recommendedCashAmount
    label: Cash $
    source: output

js_file: assets/js/calculators/asset-allocation-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Asset Allocation Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate optimal stock, bond, and cash investment weights based on age and risk tolerance."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Rule of 110 Age-Based Asset Allocation — calculate optimal stock, bond, and cash ratios"
    - "Risk Tolerance Profile Adjustment — customize allocations for Conservative, Moderate, or Aggressive goals"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Asset Allocation Calculator

howto:
  name: "How to Calculate Asset Allocation"
  description: "Determine optimal portfolio weights."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Enter age & risk profile"
      text: "Input age, risk tolerance, and total portfolio balance."

faq:
  - question: "What is the Rule of 110 in asset allocation?"
    answer: "The Rule of 110 estimates your stock allocation percentage by subtracting your age from 110 (e.g., at age 35, 110 - 35 = 75% stocks, with 25% allocated to bonds and cash)."
  - question: "Why does age play a key role in asset allocation?"
    answer: "Younger investors have decades to recover from short-term stock market downturns and benefit from higher equity growth, while retirees require capital preservation and steady fixed income."
  - question: "What is the difference between stocks, bonds, and cash reserves?"
    answer: "Stocks offer high long-term capital growth with higher volatility. Bonds provide steady interest income and downside protection. Cash reserves offer emergency liquidity with zero volatility."
  - question: "How does risk tolerance adjust standard age-based rules?"
    answer: "Aggressive investors add 10% to 15% more stock exposure to standard age rules, while conservative investors reduce stock exposure by 10% to 15% in favor of bonds."
  - question: "What is a target-date fund?"
    answer: "A target-date fund automatically adjusts its asset allocation over time, shifting from aggressive equities to conservative bonds as you approach your target retirement year."
  - question: "How often should asset allocation models be reviewed?"
    answer: "You should review your asset allocation annually or whenever major life events occur (marriage, career changes, birth of a child, approaching retirement)."
---

# Asset Allocation Calculator – Match Your Money to Your Life Goals

Not sure how much of your portfolio should be in stocks vs. bonds? Our **Asset Allocation Calculator** gives you a clear, age-based starting point — so you can invest with confidence.

<!-- more -->

## The Simple Rule

**Rule of 110**: Stock % = 110 − Your Age. The rest goes to bonds and cash. Younger = more stocks. Older = more bonds.

## Example: $150,000 at Age 35

| Risk Profile | Stocks | Bonds | Cash |
|---|---|---|---|
| Conservative | 60% ($90k) | 30% ($45k) | 10% ($15k) |
| Moderate | **75% ($112.5k)** | **15% ($22.5k)** | **10% ($15k)** |
| Aggressive | 85% ($127.5k) | 5% ($7.5k) | 10% ($15k) |

## How to Use

1. Pick your currency.
2. Enter your age.
3. Choose your risk level (Conservative, Moderate, Aggressive).
4. Enter your portfolio size.
5. Get your allocation — instantly.

## Why It Matters

- **No guesswork** — clear math, clear answers
- **Test scenarios** — adjust age or risk to see what changes
- **100% private** — everything runs locally, nothing is stored
- **Export & share** — save or share your allocation plan

## Who Is This For?

- New investors getting started
- Mid-career savers fine-tuning
- Retirees shifting to stability
- Anyone who wants a clear starting point

## Common Questions

**What's the Rule of 110?** Subtract your age from 110 to find your stock percentage. At 35, that's 75% stocks.

**Why does age matter?** More time = more room for growth. Less time = more need for stability.

**What's the difference?** Stocks = growth. Bonds = stability. Cash = safety.

**How often should I review?** At least once a year, or after major life changes.
---