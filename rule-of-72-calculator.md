---
layout: tool
title: Rule of 72 Calculator
description: Estimate how long it takes to double your money using the Rule of 72. Enter your expected annual return rate to see doubling time, or enter a target time to find the required rate.
permalink: /rule-of-72-calculator
tool_id: rule-of-72
category: growth
hide_sidebar: true

inputs:
  - id: annualRate
    label: Annual Return Rate (%)
    type: number
    default: 7.0
    step: 0.1
    min: 0.1
    suffix: '%'

  - id: targetTime
    label: Time to Double (years)
    type: number
    default: 0
    step: 0.5
    min: 0
    placeholder: "Set to 0 to use Rule of 72"

  - id: principal
    label: Starting Amount
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: Optional

outputs:
  - id: timeToDouble
    label: Time to Double
  - id: requiredRate
    label: Required Rate
    unit: '%'
  - id: finalBalance
    label: Final Balance
  - id: totalGrowth
    label: Total Growth

charts:
  tabs:
    - id: growth
      label: Growth
    - id: breakdown
      label: Breakdown

history_columns:
  - key: annualRate
    label: Rate (%)
    source: input
  - key: targetTime
    label: Target Years
    source: input
  - key: principal
    label: Starting Amount
    source: input
  - key: timeToDouble
    label: Time to Double
    source: output
  - key: finalBalance
    label: Final Balance
    source: output

js_file: assets/js/calculators/rule-of-72.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rule of 72 Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate how long it takes to double your money using the Rule of 72. Enter your expected annual return rate to see doubling time, or enter a target time to find the required rate."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Two Modes — calculate doubling time OR required return rate"
    - "Visual Growth Charts — see your money grow to 2x"
    - "Precise Calculation — uses both the Rule of 72 and exact formula"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Rule of 72 Calculator

howto:
  name: "How to Use the Rule of 72 Calculator"
  description: "Follow these steps to estimate your money's doubling time."
  step:
    - name: "Enter your annual return rate"
      text: "Enter your expected annual rate of return (e.g., 7 for 7%)."
    - name: "Set target time (optional)"
      text: "Enter a target time to find the required rate, or leave at 0 to calculate doubling time."
    - name: "Enter starting amount (optional)"
      text: "Enter a starting amount to see the final balance when your money doubles."
    - name: "View your results"
      text: "The tool shows your time to double, required rate, and final balance."

faq:
  - question: "What is the Rule of 72?"
    answer: "The Rule of 72 is a quick formula to estimate how long it takes for an investment to double at a fixed annual rate of return. Divide 72 by the annual rate to get the approximate number of years."
  - question: "How accurate is the Rule of 72?"
    answer: "The Rule of 72 is most accurate for rates between 6% and 10%. For rates outside this range, the error increases. This calculator shows both the Rule of 72 estimate and the exact calculation."
  - question: "What is the Rule of 72 formula?"
    answer: "The formula is: Years to Double = 72 ÷ Annual Rate. For example, at 8% return: 72 ÷ 8 = 9 years. The exact formula is: t = ln(2) / ln(1 + r)."
  - question: "Can I use this calculator for any rate?"
    answer: "Yes. Use it for stocks, bonds, savings accounts, or any investment with a fixed annual return rate. The calculator works for any positive rate."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Rule of 72 Calculator – Estimate Your Doubling Time

Use this Rule of 72 calculator to estimate how long it takes to double your money. Enter your expected annual return rate to see the doubling time, or enter a target time to find the required rate. Learn the Rule of 72 formula and see your investment growth visualised.

<!-- more -->

## Why Use This Rule of 72 Calculator

The Rule of 72 is one of the most useful shortcuts in personal finance. It helps you quickly estimate how long your money takes to double at a given rate. This Rule of 72 calculator makes the math instant and precise.

- **✅ Quick Estimates** — instantly see how long it takes to double your money.
- **⏱️ Two Modes** — calculate doubling time OR find the required rate to double by a specific date.
- **📈 Visual Growth Charts** — see your balance grow to 2×, 4×, and beyond.
- **📐 Rule of 72 Formula** — understand the math behind the estimate.
- **📜 Calculation History** — save, review, and export past results to CSV or Excel.
- **🌍 170+ Currencies** — automatically formats results in your local currency.
- **🔒 100% Private** — all calculations run locally; your data never leaves your browser.

---

## Rule of 72 Formula

The Rule of 72 formula is simple:

**Years to Double ≈ 72 ÷ Annual Rate**

For example:

- At **6%** return: 72 ÷ 6 = **12 years**
- At **8%** return: 72 ÷ 8 = **9 years**
- At **10%** return: 72 ÷ 10 = **7.2 years**

**Exact Formula (for comparison):**

**t = ln(2) / ln(1 + r)**

Where:

- **t** = Years to double
- **r** = Annual rate of return (as a decimal)
- **ln** = Natural logarithm

The Rule of 72 is most accurate for rates between 6% and 10%. This calculator shows both the Rule of 72 estimate and the exact calculation.

---

## How to Use This Tool

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **annual return rate** (e.g., 7 for 7%).
3.  Set a **target time** (optional) — enter a time in years to find the required rate. Leave at 0 to calculate doubling time.
4.  Enter a **starting amount** (optional) — see the final balance when your money doubles.
5.  The tool updates instantly — you'll see your time to double, required rate, and final balance.

---

## Frequently Asked Questions

### What is the Rule of 72?
The Rule of 72 is a quick formula to estimate how long it takes for an investment to double at a fixed annual rate of return. Divide 72 by the annual rate to get the approximate number of years.

### How accurate is the Rule of 72?
The Rule of 72 is most accurate for rates between 6% and 10%. For rates outside this range, the error increases. This calculator shows both the Rule of 72 estimate and the exact calculation.

### What is the Rule of 72 formula?
The formula is: Years to Double = 72 ÷ Annual Rate. For example, at 8% return: 72 ÷ 8 = 9 years. The exact formula is: t = ln(2) / ln(1 + r).

### Can I use this calculator for any rate?
Yes. Use it for stocks, bonds, savings accounts, or any investment with a fixed annual return rate. The calculator works for any positive rate.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

