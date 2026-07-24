---
layout: tool
title: "Mortgage Points | Interactive Online Tool"
description: "Calculate whether buying mortgage points saves you money. Compare the cost of points with monthly savings and break-even time."
permalink: /mortgage-points-calculator
tool_id: mortgage-points
category: mortgage
hide_sidebar: true

inputs:
  - id: loanAmount
    label: Loan Amount
    type: number
    default: 300000
    step: 10000
    min: 0
    currency: true

  - id: loanTerm
    label: Loan Term (years)
    type: number
    default: 30
    step: 1
    min: 1
    max: 40

  - id: noPointsRate
    label: No-Points Rate (%)
    type: number
    default: 7.0
    step: 0.05
    min: 0
    suffix: '%'

  - id: pointsRate
    label: Rate with Points (%)
    type: number
    default: 6.5
    step: 0.05
    min: 0
    suffix: '%'

  - id: pointsCost
    label: Cost per Point (% of loan)
    type: number
    default: 1.0
    step: 0.05
    min: 0
    suffix: '%'

  - id: propertyTax
    label: Annual Property Tax (%)
    type: number
    default: 1.2
    step: 0.05
    min: 0
    suffix: '%'

  - id: insurance
    label: Annual Home Insurance (%)
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'

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
  - id: pointsCostAmount
    label: Upfront Cost of Points
  - id: monthlySavings
    label: Monthly Savings
  - id: totalInterestSaved
    label: Total Interest Saved
  - id: breakEvenMonths
    label: Break-Even Period
  - id: breakEvenYears
    label: Break-Even (years)

charts:
  tabs:
    - id: comparison
      label: Comparison
    - id: timeline
      label: Timeline

history_columns:
  - key: loanAmount
    label: Loan Amount
    source: input
  - key: noPointsRate
    label: No-Points Rate (%)
    source: input
  - key: pointsRate
    label: Points Rate (%)
    source: input
  - key: breakEvenMonths
    label: Break-Even (months)
    source: output
  - key: totalInterestSaved
    label: Interest Saved
    source: output

js_file: assets/js/calculators/mortgage-points.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Mortgage Points Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate whether buying mortgage points saves you money. Compare the cost of points with monthly savings and break-even time."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Points Cost Calculation — see the upfront cost of buying points"
    - "Monthly Savings — see how much you save each month"
    - "Break-Even Analysis — know when you recoup the cost"
    - "Visual Charts — see the comparison over time"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Mortgage Points Calculator

howto:
  name: "How to Use the Mortgage Points Calculator"
  description: "Follow these steps to evaluate buying mortgage points."
  step:
    - name: "Enter your loan amount"
      text: "Enter the total mortgage amount."
    - name: "Enter the no-points rate"
      text: "Enter the interest rate without buying points."
    - name: "Enter the rate with points"
      text: "Enter the interest rate if you buy points."
    - name: "Enter the cost per point"
      text: "Enter the cost per point as a percentage of the loan (typically 1%)."
    - name: "Enter loan details"
      text: "Enter the loan term, property tax, and insurance."
    - name: "View your results"
      text: "See your upfront cost, monthly savings, and break-even period."

faq:
  - question: "What are mortgage points?"
    answer: "Mortgage points (or discount points) are upfront fees paid to reduce your interest rate. One point typically costs 1% of the loan amount and lowers the rate by about 0.25%."
  - question: "Is buying mortgage points worth it?"
    answer: "Buying points is worth it if you plan to stay in the home long enough to break even on the upfront cost. This calculator shows you exactly how long that takes."
  - question: "What is the break-even period?"
    answer: "The break-even period is the number of months it takes for your monthly savings to cover the upfront cost of the points."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Mortgage Points Calculator

Use this mortgage points calculator to determine whether buying points saves you money. Enter your loan amount, rates, and points cost — the tool shows your upfront cost, monthly savings, and break-even period. This mortgage points calculator helps you decide if paying points makes sense for your situation.

<!-- more -->

## Why Use This Mortgage Points Calculator

Buying mortgage points can lower your monthly payment but costs money upfront. This mortgage points calculator helps you:

- **💰 Calculate Upfront Cost** — see how much points will cost you.
- **📊 See Monthly Savings** — understand how much you save each month.
- **⏱️ Find Break-Even** — know when you recoup the cost.
- **📈 Visualize Your Options** — see the comparison charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Mortgage Points Are Calculated

**Points Cost = Loan Amount × (Cost per Point / 100)**

**Monthly Payment (No Points):** Calculated using the no-points rate.

**Monthly Payment (With Points):** Calculated using the points rate.

**Monthly Savings = No-Points Payment − Points Payment**

**Break-Even = Points Cost ÷ Monthly Savings** (in months)

**Total Interest Saved = (No-Points Total Interest − Points Total Interest)**

---

## How to Use This Mortgage Points Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **loan amount**.
3.  Enter the **no-points interest rate**.
4.  Enter the **rate with points**.
5.  Enter the **cost per point** as a percentage.
6.  Enter the **loan term**, **property tax**, and **insurance**.
7.  View your results instantly — see your upfront cost, monthly savings, and break-even period.

---


## Strategic Value & Implementation Guidance

Using this interactive calculation engine provides a clear, quantitative roadmap for your decisions. By eliminating mathematical uncertainty, you can optimize financial allocations, compare scenarios side-by-side, and make data-driven choices.

### Key Tactical Benefits
- **Mathematical Certainty**: Eliminates guesswork by modeling multi-variable compounding and precise cost structures.
- **Scenario Comparison**: Test multiple interest rates, payment timelines, and capital allocations in real-time.
- **Privacy Assurance**: All data remains 100% confidential within your local browser memory, with zero remote server logging.
- **Export & Audit Readiness**: Log calculations to local browser storage, export full histories to CSV/Excel, or share via link.

## Frequently Asked Questions

### What are mortgage points?
Mortgage points (or discount points) are upfront fees paid to reduce your interest rate. One point typically costs 1% of the loan amount and lowers the rate by about 0.25%.

### Is buying mortgage points worth it?
Buying points is worth it if you plan to stay in the home long enough to break even on the upfront cost. This calculator shows you exactly how long that takes.

### What is the break-even period?
The break-even period is the number of months it takes for your monthly savings to cover the upfront cost of the points.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
