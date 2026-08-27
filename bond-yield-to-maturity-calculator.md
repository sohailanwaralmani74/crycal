---
layout: tool
title: "Bond Yield to Maturity Calculator | Compound Interest & Savings"
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
---

# Bond Yield to Maturity Calculator – Know Your True Bond Return

Thinking about buying a bond and wondering what you'll actually earn? Our **Bond Yield to Maturity Calculator** gives you the complete picture—accounting for the price you pay, the coupon payments you'll receive, and the face value you'll get back at maturity. No guesswork, just numbers you can trust.

<!-- more -->

## How This Bond Calculator Works

**Yield to maturity (YTM)** is the most complete measure of a bond's return. It factors in everything:

- The coupon payments you'll collect along the way
- The price you pay for the bond today
- The face value you'll receive when the bond matures

Our **bond YTM calculator** gives you:

- **Annual Coupon Payment** — what you'll earn each year in interest
- **Approximate Yield to Maturity** — a quick estimate to start with
- **Precise Yield to Maturity** — the exact, mathematically solved return
- **Current Yield** — your annual coupon income relative to what you paid
- **Total Return if Held to Maturity** — your overall gain, including any price appreciation

---

## The Math Behind It (Made Simple)

### Approximate YTM
**YTM ≈ [Annual Coupon + (Face Value − Price) ÷ Years to Maturity] ÷ [(Face Value + Price) ÷ 2]**

This gives you a quick, solid estimate.

### Precise YTM
The exact YTM is the discount rate that makes the present value of all future coupon payments plus the face value equal to the bond's current price. Our calculator finds this for you—no need to solve it by hand.

---

## Real-Life Examples

### Example 1: Discount Bond (Buying Below Face Value)

| Input | Your Numbers |
|-------|---------------|
| Face Value | $1,000 |
| Current Price | $950 |
| Coupon Rate | 5% |
| Years to Maturity | 10 |
| **Approximate YTM** | **5.54%** |

*You're paying less than face value, so your total return is higher than the coupon rate.*

### Example 2: Premium Bond (Buying Above Face Value)

| Input | Your Numbers |
|-------|---------------|
| Face Value | $1,000 |
| Current Price | $1,080 |
| Coupon Rate | 6% |
| Years to Maturity | 5 |
| **Approximate YTM** | **4.32%** |

*You're paying more than face value, so your total return is lower than the coupon rate.*

---

## How to Use This Calculator

Getting your bond's true yield is quick and straightforward:

1. **Enter the face value** — the amount you'll receive at maturity (typically $1,000 for most bonds).
2. **Enter the current price** — what you're paying for the bond today.
3. **Enter the coupon rate** — the annual interest rate the bond pays.
4. **Enter years to maturity** — how many years until the bond matures.
5. **View your results instantly** — see your yield to maturity, current yield, and total return.

---

## Who Benefits From This Calculator?

This bond yield tool is perfect for:

- **Fixed-income investors** — comparing bonds with different prices and coupon rates
- **Financial planners** — evaluating bond portfolios for clients
- **Students** — learning bond valuation concepts
- **Anyone** — wondering if a bond's current price offers good value

---

## Common Questions About Bond Yield to Maturity

### What is yield to maturity (YTM) in plain English?

It's the total annualized return you can expect if you buy a bond at its current price and hold it until it matures. It includes both the coupon payments you'll receive and any gain or loss from the difference between what you paid and the face value you'll get back.

### How is YTM different from the coupon rate?

The coupon rate is the fixed interest rate the bond pays—it doesn't change. YTM is your actual return, which can be higher or lower than the coupon rate depending on whether you bought the bond at a discount, premium, or face value.

### What's the difference between current yield and YTM?

- **Current yield** — your annual coupon income divided by the price you paid. It only considers interest income.
- **YTM** — includes interest income *plus* any gain or loss from the difference between your purchase price and the face value at maturity.

YTM gives you the complete picture.

### Why would a bond trade below face value (at a discount)?

When a bond's coupon rate is lower than current market interest rates, investors won't pay full price. The bond trades at a discount to compensate buyers for the lower coupon. Conversely, bonds with higher coupon rates trade at a premium.

### Is this calculator accurate for all bonds?

It's designed for plain-vanilla bonds with fixed coupon payments and a fixed maturity date. For callable bonds, floating-rate bonds, or other complex structures, additional factors come into play.

---

> **📊 Quick Tip:** YTM is your best tool for comparing bonds. Two bonds with the same coupon rate can have very different YTMs depending on what you pay for them. Always compare YTM—not just coupon rates—when evaluating fixed-income investments.
---