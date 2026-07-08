---
layout: tool
title: Umbrella Insurance Calculator
description: Estimate how much umbrella liability coverage you need. Enter net worth, income, existing liability coverage, and assets to see protection gap.
permalink: /umbrella-insurance-calculator
tool_id: umbrella-insurance
category: insurance
hide_sidebar: true

inputs:
  - id: netWorth
    label: Net Worth
    type: number
    default: 500000
    step: 10000
    min: 0
    currency: true

  - id: annualIncome
    label: Annual Income
    type: number
    default: 100000
    step: 5000
    min: 0
    currency: true

  - id: homeLiability
    label: Home Liability Coverage
    type: number
    default: 300000
    step: 50000
    min: 0
    currency: true

  - id: autoLiability
    label: Auto Liability Coverage
    type: number
    default: 300000
    step: 50000
    min: 0
    currency: true

  - id: numberProperties
    label: Number of Properties
    type: number
    default: 1
    step: 1
    min: 0
    max: 10

  - id: numberVehicles
    label: Number of Vehicles
    type: number
    default: 2
    step: 1
    min: 0
    max: 10

  - id: umbrellaDeductible
    label: Umbrella Deductible
    type: number
    default: 0
    step: 1000
    min: 0
    currency: true
    placeholder: "Some policies have no deductible"

  - id: riskFactors
    label: Risk Factors
    type: select
    default: moderate
    options:
      - low
      - moderate
      - high

outputs:
  - id: existingLiability
    label: Existing Liability Coverage
  - id: assetsAtRisk
    label: Assets at Risk
  - id: recommendedCoverage
    label: Recommended Umbrella Coverage
  - id: protectionGap
    label: Protection Gap
  - id: estimatedPremium
    label: Estimated Annual Premium

charts:
  tabs:
    - id: comparison
      label: Comparison
    - id: breakdown
      label: Breakdown

history_columns:
  - key: netWorth
    label: Net Worth
    source: input
  - key: annualIncome
    label: Annual Income
    source: input
  - key: recommendedCoverage
    label: Recommended Coverage
    source: output
  - key: estimatedPremium
    label: Est. Premium
    source: output

js_file: assets/js/calculators/umbrella-insurance.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Umbrella Insurance Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate how much umbrella liability coverage you need. Enter your net worth, annual income, existing liability coverage, and assets to see your protection gap."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Assets at Risk — see what you need to protect"
    - "Protection Gap — see your uncovered exposure"
    - "Risk Factor Adjustment — low, moderate, or high risk"
    - "Premium Estimate — approximate annual cost"
    - "Visual Charts — see your coverage breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Insurance
    url: /insurance
  - name: Umbrella Insurance Calculator

howto:
  name: "How to Use the Umbrella Insurance Calculator"
  description: "Follow these steps to estimate your umbrella coverage needs."
  step:
    - name: "Enter your net worth"
      text: "Enter your total net worth (assets minus liabilities)."
    - name: "Enter your annual income"
      text: "Enter your gross annual income."
    - name: "Enter existing liability coverage"
      text: "Enter the liability coverage from your home and auto policies."
    - name: "Enter number of properties and vehicles"
      text: "Enter how many properties and vehicles you own."
    - name: "Select your risk factors"
      text: "Choose low, moderate, or high risk based on your situation."
    - name: "View your results"
      text: "See your recommended umbrella coverage and protection gap."

faq:
  - question: "What is umbrella insurance?"
    answer: "Umbrella insurance provides additional liability coverage beyond what your home, auto, and other policies offer. It protects your assets in case of a lawsuit."
  - question: "How much umbrella coverage do I need?"
    answer: "A common rule of thumb is to have enough umbrella coverage to protect your net worth and future income. This calculator helps you find a more precise number."
  - question: "What does umbrella insurance cover?"
    answer: "Umbrella insurance covers bodily injury, property damage, personal injury (libel, slander), and landlord liability. It also covers legal defense costs."
  - question: "How much does umbrella insurance cost?"
    answer: "Umbrella insurance is relatively inexpensive. A $1 million policy typically costs $150-$300 per year. Additional coverage is usually cheaper per million."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Umbrella Insurance Calculator – Protect Your Assets

Use this umbrella insurance calculator to estimate how much additional liability coverage you need to protect your assets. Enter your net worth, annual income, existing liability coverage, and assets — the tool shows your protection gap and recommended umbrella coverage. This umbrella liability calculator helps you protect your financial future.

<!-- more -->

## Why Use This Umbrella Insurance Calculator

Umbrella insurance protects your assets from lawsuits. This umbrella insurance calculator helps you:

- **💰 Calculate Assets at Risk** — see what you need to protect.
- **📊 Understand Your Protection Gap** — see your uncovered exposure.
- **📉 See Premium Estimates** — approximate annual cost.
- **📈 Visualize Your Coverage** — see the breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Umbrella Insurance Is Calculated

**Total Assets at Risk = Net Worth + (Annual Income × 5)**

**Existing Liability Coverage = Home Liability + Auto Liability**

**Protection Gap = Assets at Risk − Existing Liability Coverage**

**Recommended Umbrella Coverage = Protection Gap rounded up to the nearest $100,000**

**Risk Multiplier:** Low = 1.0, Moderate = 1.2, High = 1.5

**Annual Premium Estimate = (Recommended Coverage / $1,000,000) × $200 × Risk Multiplier**

---

## How to Use This Umbrella Liability Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **net worth**.
3.  Enter your **annual income**.
4.  Enter your **home liability coverage**.
5.  Enter your **auto liability coverage**.
6.  Enter the **number of properties** and **vehicles**.
7.  Select your **risk factor** (low, moderate, high).
8.  View your results instantly — see your recommended umbrella coverage and protection gap.

---

## Frequently Asked Questions

### What is umbrella insurance?
Umbrella insurance provides additional liability coverage beyond what your home, auto, and other policies offer. It protects your assets in case of a lawsuit.

### How much umbrella coverage do I need?
A common rule of thumb is to have enough umbrella coverage to protect your net worth and future income. This calculator helps you find a more precise number.

### What does umbrella insurance cover?
Umbrella insurance covers bodily injury, property damage, personal injury (libel, slander), and landlord liability. It also covers legal defense costs.

### How much does umbrella insurance cost?
Umbrella insurance is relatively inexpensive. A $1 million policy typically costs $150-$300 per year. Additional coverage is usually cheaper per million.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
