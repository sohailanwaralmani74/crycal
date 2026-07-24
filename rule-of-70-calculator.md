---
layout: tool
title: "Rule Of 70 | Interactive Online Tool"
description: "Use the Rule of 70 Calculator to estimate how many years it takes for an investment, economy, or population to double at a given growth rate."
permalink: /rule-of-70-calculator
tool_id: rule-of-70-calculator
category: growth
hide_sidebar: true

inputs:
  - id: growthRate
    label: Annual Growth Rate
    type: number
    default: 7
    step: 0.1
    min: 0.01
    max: 100
    suffix: '%'
    placeholder: "e.g., 7"

  - id: initialValue
    label: Initial Value (Optional)
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 10000"

outputs:
  - id: doublingYears
    label: Years to Double (Rule of 70)
  - id: doublingYears72
    label: Years to Double (Rule of 72)
  - id: doublingYearsExact
    label: Exact Years to Double (Logarithmic)
  - id: doubledValue
    label: Value After Doubling

js_file: assets/js/calculators/rule-of-70-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rule of 70 Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Rule of 70 Calculator to estimate how many years it takes for an investment, economy, or population to double at a given growth rate."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Rule of 70 Doubling Time Estimate"
    - "Rule of 72 Comparison"
    - "Exact Logarithmic Doubling Time"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Rule of 70 Calculator

howto:
  name: "How to Use the Rule of 70 Calculator"
  description: "Follow these steps to estimate your doubling time using the Rule of 70."
  step:
    - name: "Enter your annual growth rate"
      text: "Enter the expected annual growth rate as a percentage."
    - name: "Enter an initial value (optional)"
      text: "Enter a starting value to see what it becomes after doubling."
    - name: "View your results"
      text: "See the estimated years to double using the Rule of 70, Rule of 72, and the exact logarithmic formula."

faq:
  - question: "What is the Rule of 70?"
    answer: "The Rule of 70 is a quick way to estimate how many years it takes for a value to double at a given annual growth rate, calculated by dividing 70 by the growth rate percentage."
  - question: "How accurate is the Rule of 70?"
    answer: "The Rule of 70 is a close approximation, most accurate for lower growth rates (roughly 1–10%). For higher rates, the exact logarithmic formula is more precise."
  - question: "What is the difference between the Rule of 70 and Rule of 72?"
    answer: "Both estimate doubling time. The Rule of 72 is more commonly used for investment returns because it divides evenly by more common rates (like 6, 8, 9, and 12), while the Rule of 70 is often preferred for population and economic growth."
  - question: "What is the exact formula for doubling time?"
    answer: "The exact doubling time is calculated as ln(2) divided by ln(1 + growth rate), which accounts precisely for compounding."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Rule Of 70 Calculator

Use the **Rule of 70 Calculator** to estimate how many years it takes for an investment, economy, or population to double at a given growth rate.

<!-- more -->

## How the Rule of 70 Calculator Works

The **Rule of 70** is a simple mental-math shortcut for estimating doubling time: divide 70 by the annual growth rate percentage. It's widely used in economics to estimate how quickly GDP, population, or prices will double.

This **doubling time calculator** computes:

- **Years to Double (Rule of 70)** — the quick approximation
- **Years to Double (Rule of 72)** — the investment-focused alternative
- **Exact Years to Double** — the precise logarithmic calculation
- **Value After Doubling** — what your starting value becomes

---

## Rule of 70 Formula

**Years to Double ≈ 70 ÷ Growth Rate (%)**

For comparison, the **Rule of 72**:

**Years to Double ≈ 72 ÷ Growth Rate (%)**

And the **exact** formula:

**Years to Double = ln(2) ÷ ln(1 + r)**

Where **r** is the annual growth rate as a decimal.

---

## Rule of 70 Examples

### Example 1: Investment Growth

| Variable | Value |
|----------|-------|
| Growth Rate | 7% |
| **Rule of 70 Estimate** | **10.0 years** |
| **Exact Doubling Time** | **10.24 years** |

### Example 2: Population Growth

| Variable | Value |
|----------|-------|
| Growth Rate | 2% |
| **Rule of 70 Estimate** | **35.0 years** |
| **Exact Doubling Time** | **35.00 years** |

---

## Who Benefits from the Rule of 70 Calculator?

This **Rule of 70 calculator** is designed for:

- **Economics students** studying GDP and population growth
- **Investors** estimating how quickly their portfolio could double
- **Policy analysts** projecting inflation's effect on purchasing power
- **Anyone** curious about compounding growth over time

---

## Frequently Asked Questions

### What is the Rule of 70?
The Rule of 70 is a quick way to estimate how many years it takes for a value to double at a given annual growth rate, calculated by dividing 70 by the growth rate percentage.

### How accurate is the Rule of 70?
The Rule of 70 is a close approximation, most accurate for lower growth rates (roughly 1–10%). For higher rates, the exact logarithmic formula is more precise.

### What is the difference between the Rule of 70 and Rule of 72?
Both estimate doubling time. The Rule of 72 is more commonly used for investment returns because it divides evenly by more common rates (like 6, 8, 9, and 12), while the Rule of 70 is often preferred for population and economic growth.

### What is the exact formula for doubling time?
The exact doubling time is calculated as ln(2) divided by ln(1 + growth rate), which accounts precisely for compounding.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.
