---
layout: tool
title: "Bond Yield To Maturity | Interactive Online Tool"
description: "Use the Bond Yield to Maturity Calculator to estimate the total return youll earn if you hold a bond until it matures, based on price, coupon..."
permalink: /bond-yield-to-maturity-calculator
tool_id: bond-yield-to-maturity-calculator
category: growth
hide_sidebar: true

inputs:
  - id: faceValue
    label: Face Value (Par Value)
    type: number
    default: 1000
    step: 50
    min: 0
    currency: true
    placeholder: "e.g., 1000"

  - id: currentPrice
    label: Current Market Price
    type: number
    default: 950
    step: 10
    min: 0
    currency: true
    placeholder: "e.g., 950"

  - id: couponRate
    label: Annual Coupon Rate
    type: number
    default: 5
    step: 0.1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 5"

  - id: yearsToMaturity
    label: Years to Maturity
    type: number
    default: 10
    step: 1
    min: 1
    max: 50
    placeholder: "e.g., 10"

  - id: paymentsPerYear
    label: Coupon Payments Per Year
    type: select
    default: "2"
    options:
      - "1"
      - "2"
      - "4"
      - "12"

outputs:
  - id: annualCoupon
    label: Annual Coupon Payment
  - id: approxYtm
    label: Approximate Yield to Maturity
  - id: preciseYtm
    label: Precise Yield to Maturity
  - id: currentYield
    label: Current Yield
  - id: totalReturn
    label: Total Return if Held to Maturity

js_file: assets/js/calculators/bond-yield-to-maturity-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Bond Yield to Maturity Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Bond Yield to Maturity Calculator to estimate the total return you'll earn if you hold a bond until it matures, based on price, coupon rate, and time to maturity."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Approximate YTM Formula"
    - "Precise YTM via Iterative Solving"
    - "Current Yield Calculation"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Bond Yield to Maturity Calculator

howto:
  name: "How to Use the Bond Yield to Maturity Calculator"
  description: "Follow these steps to estimate your bond's yield to maturity."
  step:
    - name: "Enter the face value"
      text: "Enter the bond's par (face) value, typically $1,000."
    - name: "Enter the current market price"
      text: "Enter what the bond currently costs to purchase."
    - name: "Enter the annual coupon rate"
      text: "Enter the bond's stated annual interest rate."
    - name: "Enter years to maturity"
      text: "Enter how many years remain until the bond matures."
    - name: "Select payment frequency"
      text: "Choose how often coupon payments are made per year."
    - name: "View your results"
      text: "See the bond's approximate and precise yield to maturity."

faq:
  - question: "What is yield to maturity (YTM)?"
    answer: "Yield to maturity is the total annualized return an investor can expect if a bond is held until it matures, accounting for coupon payments, purchase price, and face value."
  - question: "How is YTM calculated?"
    answer: "YTM can be approximated using a simplified formula, or calculated precisely by finding the discount rate that makes the present value of all future coupon payments and the face value equal to the bond's current price."
  - question: "What's the difference between current yield and YTM?"
    answer: "Current yield only considers annual coupon income relative to price, while YTM also factors in any gain or loss from the difference between the purchase price and face value at maturity."
  - question: "Why would a bond trade below face value?"
    answer: "A bond trades below face value (at a discount) when its coupon rate is lower than prevailing market interest rates, making it less attractive unless priced lower to compensate investors."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Bond Yield To Maturity Calculator

Use the **Bond Yield to Maturity Calculator** to estimate the total return you'll earn if you hold a bond until it matures, based on price, coupon rate, and time to maturity.

<!-- more -->

## How the Bond Yield to Maturity Calculator Works

**Yield to maturity (YTM)** is the most complete measure of a bond's return, accounting for coupon payments, the purchase price, and the face value received at maturity.

This **bond YTM calculator** computes:

- **Annual Coupon Payment** — the dollar amount paid each year
- **Approximate Yield to Maturity** — a quick estimate
- **Precise Yield to Maturity** — solved iteratively for accuracy
- **Current Yield** — annual coupon income relative to price
- **Total Return if Held to Maturity** — overall gain including price appreciation

---

## Bond YTM Formula

### Approximate YTM

**YTM ≈ [C + (F − P) ÷ n] ÷ [(F + P) ÷ 2]**

Where:
- **C** = Annual coupon payment
- **F** = Face value
- **P** = Current price
- **n** = Years to maturity

The **precise YTM** is found by solving for the rate **y** such that the present value of all coupon payments plus the face value equals the current price.

---

## Bond YTM Examples

### Example 1: Discount Bond

| Variable | Value |
|----------|-------|
| Face Value | $1,000 |
| Current Price | $950 |
| Coupon Rate | 5% |
| Years to Maturity | 10 |
| **Approximate YTM** | **5.54%** |

### Example 2: Premium Bond

| Variable | Value |
|----------|-------|
| Face Value | $1,000 |
| Current Price | $1,080 |
| Coupon Rate | 6% |
| Years to Maturity | 5 |
| **Approximate YTM** | **4.32%** |

---

## Who Benefits from the Bond Yield to Maturity Calculator?

This **bond yield calculator** is designed for:

- **Fixed-income investors** comparing bonds with different prices and coupons
- **Financial advisors** evaluating bond portfolios for clients
- **Students** learning bond valuation concepts
- **Anyone** deciding whether a bond's current price offers good value

---

## Frequently Asked Questions

### What is yield to maturity (YTM)?
Yield to maturity is the total annualized return an investor can expect if a bond is held until it matures, accounting for coupon payments, purchase price, and face value.

### How is YTM calculated?
YTM can be approximated using a simplified formula, or calculated precisely by finding the discount rate that makes the present value of all future coupon payments and the face value equal to the bond's current price.

### What's the difference between current yield and YTM?
Current yield only considers annual coupon income relative to price, while YTM also factors in any gain or loss from the difference between the purchase price and face value at maturity.

### Why would a bond trade below face value?
A bond trades below face value (at a discount) when its coupon rate is lower than prevailing market interest rates, making it less attractive unless priced lower to compensate investors.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.
