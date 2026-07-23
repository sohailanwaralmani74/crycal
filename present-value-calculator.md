---
layout: tool
title: Present Value Calculator – Find the Value of Future Money Today
description: Use the Present Value Calculator to find out how much a future sum of money is worth today, based on a discount rate and time period.
permalink: /present-value-calculator
tool_id: present-value-calculator
category: growth
hide_sidebar: true

inputs:
  - id: futureValue
    label: Future Value
    type: number
    default: 50000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 50000"

  - id: discountRate
    label: Discount Rate (Annual)
    type: number
    default: 6
    step: 0.1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 6"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: annually
    options:
      - annually
      - quarterly
      - monthly
      - daily

  - id: timeYears
    label: Time Period (Years)
    type: number
    default: 10
    step: 1
    min: 1
    max: 50
    placeholder: "e.g., 10"

outputs:
  - id: presentValue
    label: Present Value
  - id: totalDiscount
    label: Total Discount Applied
  - id: discountPercent
    label: Discount as % of Future Value
  - id: effectiveDiscountRate
    label: Effective Periodic Discount Rate

js_file: assets/js/calculators/present-value-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Present Value Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Present Value Calculator to find out how much a future sum of money is worth today, based on a discount rate and time period."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Present Value of a Future Lump Sum"
    - "Multiple Compounding Frequencies"
    - "Discount Rate Analysis"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Present Value Calculator

howto:
  name: "How to Use the Present Value Calculator"
  description: "Follow these steps to find the present value of a future sum."
  step:
    - name: "Enter the future value"
      text: "Enter the amount of money you expect to receive in the future."
    - name: "Enter the discount rate"
      text: "Enter the annual discount rate (your required rate of return)."
    - name: "Select compounding frequency"
      text: "Choose how often the discount rate compounds."
    - name: "Enter the time period"
      text: "Enter the number of years until you receive the future value."
    - name: "View your results"
      text: "See the present value and total discount applied."

faq:
  - question: "What is present value?"
    answer: "Present value is the current worth of a future sum of money, discounted back at a specific rate to account for the time value of money."
  - question: "How is present value calculated?"
    answer: "Present value is calculated by dividing the future value by (1 + discount rate/compounding periods) raised to the power of the number of compounding periods."
  - question: "Why does money today have more value than money in the future?"
    answer: "Money available today can be invested to earn a return, so a dollar today is generally worth more than a dollar received in the future — this is the time value of money."
  - question: "What discount rate should I use?"
    answer: "The discount rate typically reflects your required rate of return, cost of capital, or a benchmark like inflation or a risk-free rate such as Treasury yields."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Calculate the Present Value of Future Money

Use the **Present Value Calculator** to find out how much a future sum of money is worth today, based on a discount rate and time period.

<!-- more -->

## How the Present Value Calculator Works

**Present value (PV)** tells you what a future sum of money is worth in today's dollars, accounting for the time value of money. It's a core concept in finance used for valuing investments, bonds, settlements, and business decisions.

This **present value calculator** computes:

- **Present Value** — the future sum's worth today
- **Total Discount Applied** — how much value is lost to discounting
- **Discount as % of Future Value** — the proportional reduction
- **Effective Periodic Discount Rate** — the rate per compounding period

---

## Present Value Formula

**PV = FV ÷ (1 + r/n)^(n×t)**

Where:
- **FV** = Future Value
- **r** = Annual discount rate (as a decimal)
- **n** = Compounding periods per year
- **t** = Time in years

---

## Present Value Examples

### Example 1: Lump Sum in 10 Years

| Variable | Value |
|----------|-------|
| Future Value | $50,000 |
| Discount Rate | 6% |
| Compounding | Annually |
| Time Period | 10 years |
| **Present Value** | **$27,919** |

### Example 2: Settlement in 5 Years

| Variable | Value |
|----------|-------|
| Future Value | $100,000 |
| Discount Rate | 4% |
| Compounding | Quarterly |
| Time Period | 5 years |
| **Present Value** | **$81,939** |

---

## Who Benefits from the Present Value Calculator?

This **PV calculator** is designed for:

- **Investors** evaluating whether a future payout is worth it today
- **Business owners** valuing future cash flows from a project
- **Legal professionals** calculating settlement values
- **Students** learning time value of money concepts

---

## Frequently Asked Questions

### What is present value?
Present value is the current worth of a future sum of money, discounted back at a specific rate to account for the time value of money.

### How is present value calculated?
Present value is calculated by dividing the future value by (1 + discount rate/compounding periods) raised to the power of the number of compounding periods.

### Why does money today have more value than money in the future?
Money available today can be invested to earn a return, so a dollar today is generally worth more than a dollar received in the future — this is the time value of money.

### What discount rate should I use?
The discount rate typically reflects your required rate of return, cost of capital, or a benchmark like inflation or a risk-free rate such as Treasury yields.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.
