---
layout: tool
title: "Kelly Criterion Calculator | Interactive Online Tool"
description: "Calculate the optimal position size using the Kelly Criterion Calculator. Kelly Criterion Calculator is browser based and free tool."
permalink: /kelly-criterion-calculator
tool_id: kelly-criterion
category: investing
hide_sidebar: true

inputs:
  - id: winProbability
    label: Win Probability (%)
    type: number
    default: 55.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 55% win rate"

  - id: winLossRatio
    label: AVG Win/Loss Ratio
    type: number
    default: 1.5
    step: 0.05
    min: 0.01
    placeholder: "e.g., 1.5 means avg win is 1.5x avg loss"

  - id: accountBalance
    label: Account Balance
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true

  - id: fractionalKelly
    label: Fractional Kelly (%)
    type: number
    default: 100
    step: 5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Use 50% for half-Kelly, 100% for full Kelly"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: monthly
    options:
      - annually
      - semi-annually
      - quarterly
      - monthly
      - daily

outputs:
  - id: kellyFraction
    label: Kelly Fraction

  - id: optimalBetSize
    label: Optimal Bet Size

  - id: optimalAmount
    label: Optimal Amount to Risk
  - id: expectedGrowthRate
    label: Expected Growth Rate

  - id: halfKellyAmount
    label: Half-Kelly Amount
  - id: quarterKellyAmount
    label: Quarter-Kelly Amount

charts:
  tabs:
    - id: comparison
      label: Comparison

history_columns:
  - key: winProbability
    label: Win Rate (%)
    source: input
  - key: winLossRatio
    label: W/L Ratio
    source: input
  - key: optimalBetSize
    label: Optimal Bet %
    source: output
  - key: optimalAmount
    label: Optimal Amount
    source: output

js_file: assets/js/calculators/kelly-criterion.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Kelly Criterion Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the optimal position size using the Kelly Criterion. Enter your win probability, win/loss ratio, and account balance to find the optimal bet fraction."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Optimal Position Sizing — find the mathematically optimal bet size"
    - "Fractional Kelly — use half-Kelly or quarter-Kelly for reduced risk"
    - "Expected Growth Rate — see the expected log growth of your account"
    - "Visual Comparison — see different Kelly fractions side by side"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Kelly Criterion Calculator

howto:
  name: "How to Use the Kelly Criterion Calculator"
  description: "Follow these steps to calculate your optimal position size."
  step:
    - name: "Enter your win probability"
      text: "Enter your historical win rate as a percentage (e.g., 55% for 55%)."
    - name: "Enter your win/loss ratio"
      text: "Enter your average win divided by your average loss (e.g., 1.5)."
    - name: "Enter your account balance"
      text: "Enter your total trading capital."
    - name: "Set fractional Kelly"
      text: "Choose 100% for full Kelly, 50% for half-Kelly, etc."
    - name: "View your results"
      text: "See your optimal bet size, the amount to risk, and expected growth rate."

faq:
  - question: "What is the Kelly Criterion?"
    answer: "The Kelly Criterion is a formula used to determine the optimal size of a series of bets. It maximizes the expected log growth of your capital over the long run."
  - question: "What is the Kelly formula?"
    answer: "f* = (bp - q) / b, where f* is the fraction of capital to bet, b is the net odds (win/loss ratio), p is the win probability, and q is the loss probability (1 - p)."
  - question: "What is fractional Kelly?"
    answer: "Fractional Kelly is a conservative version where you risk only a fraction (e.g., 50% or 25%) of the full Kelly bet. This reduces volatility while preserving much of the growth."
  - question: "What is a good Kelly percentage?"
    answer: "A good Kelly percentage depends on your risk tolerance. Full Kelly can be aggressive. Many traders use half-Kelly (50%) to reduce drawdowns while maintaining good growth."
  - question: "Can I use this for trading?"
    answer: "Yes — the Kelly Criterion is widely used by traders to size positions based on their edge and win rate."

---

# Kelly Criterion Calculator

Use this Kelly Criterion calculator to determine the optimal fraction of your capital to risk on each trade. Enter your win probability, win/loss ratio, and account balance — the tool shows your optimal bet size, the amount to risk, and expected growth rate. This Kelly bet calculator helps you maximize long-term growth.

<!-- more -->

## Why Use This Kelly Criterion Calculator

The Kelly Criterion is a mathematically proven formula for optimal position sizing. This Kelly bet calculator helps you:

- **💰 Calculate Optimal Bet Size** — find the mathematically optimal fraction.
- **📊 Understand Your Edge** — see how your win rate and ratio affect sizing.
- **⚖️ Reduce Risk** — use fractional Kelly for conservative sizing.
- **📈 Visualize Growth** — see the expected growth rate.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## Kelly Criterion Formula Used by This Tool

**Kelly Fraction = (bp - q) / b**

Where:
- **b** = Win/Loss Ratio (Average Win ÷ Average Loss)
- **p** = Win Probability (as a decimal)
- **q** = Loss Probability = 1 - p

**Optimal Bet Size = Kelly Fraction × Account Balance × Fractional Kelly**

**Expected Growth Rate = p × ln(1 + b × f) + q × ln(1 - f)**

Where f is the Kelly fraction.

---

## How to Use This Kelly Criterion Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **win probability** (your historical win rate).
3.  Enter your **win/loss ratio** (average win ÷ average loss).
4.  Enter your **account balance**.
5.  Set your **fractional Kelly** (100% for full Kelly, 50% for half-Kelly).
6.  View your results instantly — see your optimal bet size, amount to risk, and expected growth rate.

---

## Frequently Asked Questions

### What is the Kelly Criterion?
The Kelly Criterion is a formula used to determine the optimal size of a series of bets. It maximizes the expected log growth of your capital over the long run.

### What is the Kelly formula?
f* = (bp - q) / b, where f* is the fraction of capital to bet, b is the net odds (win/loss ratio), p is the win probability, and q is the loss probability (1 - p).

### What is fractional Kelly?
Fractional Kelly is a conservative version where you risk only a fraction (e.g., 50% or 25%) of the full Kelly bet. This reduces volatility while preserving much of the growth.

### What is a good Kelly percentage?
A good Kelly percentage depends on your risk tolerance. Full Kelly can be aggressive. Many traders use half-Kelly (50%) to reduce drawdowns while maintaining good growth.

### Can I use this for trading?
Yes — the Kelly Criterion is widely used by traders to size positions based on their edge and win rate.

---

