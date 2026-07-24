---
layout: tool
title: "Perpetuity | Interactive Online Tool"
description: "Use the Perpetuity Calculator to find the present value of an infinite stream of cash flows, with support for both level and growing perpetuities."
permalink: /perpetuity-calculator
tool_id: perpetuity-calculator
category: growth
hide_sidebar: true

inputs:
  - id: cashFlow
    label: Annual Cash Flow (Next Payment)
    type: number
    default: 5000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 5000"

  - id: discountRate
    label: Discount Rate
    type: number
    default: 8
    step: 0.1
    min: 0.01
    max: 30
    suffix: '%'
    placeholder: "e.g., 8"

  - id: growthRate
    label: Growth Rate (0 for Level Perpetuity)
    type: number
    default: 0
    step: 0.1
    min: 0
    max: 20
    suffix: '%'
    placeholder: "e.g., 2"

outputs:
  - id: presentValue
    label: Present Value of Perpetuity
  - id: perpetuityType
    label: Perpetuity Type
  - id: valueIn10Years
    label: Cash Flow Value in Year 10
  - id: totalCashFlow10yr
    label: Total Cash Received (First 10 Years)

js_file: assets/js/calculators/perpetuity-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Perpetuity Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Perpetuity Calculator to find the present value of an infinite stream of cash flows, with support for both level and growing perpetuities."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Level Perpetuity Valuation"
    - "Growing Perpetuity (Gordon Growth) Valuation"
    - "10-Year Cash Flow Projection"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Perpetuity Calculator

howto:
  name: "How to Use the Perpetuity Calculator"
  description: "Follow these steps to value a perpetuity."
  step:
    - name: "Enter the annual cash flow"
      text: "Enter the next payment amount you expect to receive."
    - name: "Enter the discount rate"
      text: "Enter your required rate of return."
    - name: "Enter a growth rate (optional)"
      text: "Enter an annual growth rate if the cash flow is expected to grow, or leave at 0 for a level perpetuity."
    - name: "View your results"
      text: "See the present value of the perpetuity and a projection of future cash flows."

faq:
  - question: "What is a perpetuity?"
    answer: "A perpetuity is a stream of equal (or growing) cash flows that continues indefinitely, with no end date. Common examples include certain preferred stock dividends and some government bonds."
  - question: "How do you calculate the present value of a perpetuity?"
    answer: "The present value of a level perpetuity is calculated by dividing the annual cash flow by the discount rate: PV = C ÷ r."
  - question: "What is a growing perpetuity?"
    answer: "A growing perpetuity is a cash flow stream that increases at a constant rate each period. It's valued using the Gordon Growth Model: PV = C ÷ (r − g), where g is the growth rate."
  - question: "Why must the discount rate be greater than the growth rate?"
    answer: "If the growth rate equals or exceeds the discount rate, the present value formula produces an undefined or negative result, since the cash flows would grow faster than they're being discounted."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Perpetuity Calculator

Use the **Perpetuity Calculator** to find the present value of an infinite stream of cash flows, with support for both level and growing perpetuities.

<!-- more -->

## How the Perpetuity Calculator Works

A **perpetuity** is a series of equal (or steadily growing) payments that continue forever. Despite the infinite time horizon, the present value is finite because payments far in the future are discounted to nearly zero.

This **perpetuity calculator** computes:

- **Present Value of Perpetuity** — the current worth of the infinite cash flow stream
- **Perpetuity Type** — whether it's a level or growing perpetuity
- **Cash Flow Value in Year 10** — the projected payment amount 10 years out
- **Total Cash Received (First 10 Years)** — cumulative payments over a decade

---

## Perpetuity Formulas

### Level Perpetuity

**PV = C ÷ r**

### Growing Perpetuity (Gordon Growth Model)

**PV = C ÷ (r − g)**

Where:
- **C** = Next period's cash flow
- **r** = Discount rate (as a decimal)
- **g** = Growth rate (as a decimal)

---

## Perpetuity Examples

### Example 1: Level Perpetuity

| Variable | Value |
|----------|-------|
| Annual Cash Flow | $5,000 |
| Discount Rate | 8% |
| Growth Rate | 0% |
| **Present Value** | **$62,500** |

### Example 2: Growing Perpetuity

| Variable | Value |
|----------|-------|
| Annual Cash Flow | $5,000 |
| Discount Rate | 8% |
| Growth Rate | 3% |
| **Present Value** | **$100,000** |

---

## Who Benefits from the Perpetuity Calculator?

This **perpetuity valuation calculator** is designed for:

- **Finance students** learning time value of money concepts
- **Investors** valuing preferred stock or annuity-like assets
- **Analysts** applying the Gordon Growth Model to dividend-paying stocks
- **Anyone** evaluating an indefinite income stream

---

## Frequently Asked Questions

### What is a perpetuity?
A perpetuity is a stream of equal (or growing) cash flows that continues indefinitely, with no end date. Common examples include certain preferred stock dividends and some government bonds.

### How do you calculate the present value of a perpetuity?
The present value of a level perpetuity is calculated by dividing the annual cash flow by the discount rate: PV = C ÷ r.

### What is a growing perpetuity?
A growing perpetuity is a cash flow stream that increases at a constant rate each period. It's valued using the Gordon Growth Model: PV = C ÷ (r − g), where g is the growth rate.

### Why must the discount rate be greater than the growth rate?
If the growth rate equals or exceeds the discount rate, the present value formula produces an undefined or negative result, since the cash flows would grow faster than they're being discounted.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.
