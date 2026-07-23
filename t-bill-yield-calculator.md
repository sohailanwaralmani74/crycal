---
layout: tool
title: T-Bill Yield Calculator – Calculate Treasury Bill Return
description: Calculate your Treasury Bill yield with our free T-Bill Yield Calculator. Enter purchase price, face value, and days to maturity to see your discount yield, investment yield, and rate of return.
permalink: /t-bill-yield-calculator
tool_id: t-bill-yield-calculator
category: growth
hide_sidebar: true

inputs:
  - id: faceValue
    label: Face Value (Par Value)
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: purchasePrice
    label: Purchase Price
    type: number
    default: 9800
    step: 10
    min: 0
    currency: true
    placeholder: "e.g., 9800"

  - id: daysToMaturity
    label: Days to Maturity
    type: number
    default: 91
    step: 1
    min: 1
    max: 3650
    placeholder: "e.g., 91"

  - id: calculationType
    label: Yield Calculation Method
    type: select
    default: both
    options:
      - discount-yield
      - investment-yield
      - both

outputs:
  - id: discountYield
    label: Discount Yield (Bank Discount Yield)
  - id: investmentYield
    label: Investment Yield (Bond Equivalent Yield)
  - id: dollarReturn
    label: Dollar Return
  - id: annualizedReturn
    label: Annualized Return
  - id: effectiveYield
    label: Effective Annual Yield (with Compounding)
  - id: summaryDollarReturn
    label: Dollar Return
  - id: summaryDiscountYield
    label: Discount Yield
  - id: summaryInvestmentYield
    label: Investment Yield
  - id: summaryEffectiveYield
    label: Effective Annual Yield

charts:
  tabs:
    - id: breakdown
      label: Yield Comparison
    - id: growth
      label: Return Over Time

js_file: assets/js/calculators/t-bill-yield-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "T-Bill Yield Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Treasury Bill yield with our free T-Bill Yield Calculator. Enter purchase price, face value, and days to maturity to see your discount yield, investment yield, and rate of return."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Discount Yield Calculation"
    - "Investment Yield Calculation"
    - "Dollar Return"
    - "Annualized Return"
    - "Effective Annual Yield"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: T-Bill Yield Calculator

howto:
  name: "How to Use the T-Bill Yield Calculator"
  description: "Follow these steps to calculate your Treasury Bill yield."
  step:
    - name: "Enter face value"
      text: "Enter the face value (par value) of the Treasury Bill."
    - name: "Enter purchase price"
      text: "Enter the price you paid for the T-Bill."
    - name: "Enter days to maturity"
      text: "Enter the number of days until the T-Bill matures."
    - name: "Select calculation method"
      text: "Choose Discount Yield, Investment Yield, or Both."
    - name: "View your results"
      text: "See your discount yield, investment yield, dollar return, and annualized return."

faq:
  - question: "What is a T-Bill yield calculator?"
    answer: "A T-Bill yield calculator helps investors determine the return on Treasury Bills by calculating discount yield, investment yield, and annualized return based on purchase price, face value, and days to maturity."
  - question: "What is the formula for Treasury Bill yield?"
    answer: "The discount yield formula is: (Face Value − Purchase Price) ÷ Face Value × (360 ÷ Days to Maturity). The investment yield formula is: (Face Value − Purchase Price) ÷ Purchase Price × (365 ÷ Days to Maturity)."
  - question: "What is the difference between discount yield and investment yield?"
    answer: "Discount yield (bank discount yield) uses a 360-day year and face value as the denominator. Investment yield (bond equivalent yield) uses a 365-day year and purchase price as the denominator, making it more comparable to other investments."
  - question: "How is the yield to maturity calculated on a Treasury Bill?"
    answer: "Yield to maturity on a T-Bill is calculated using the investment yield formula: (Face Value − Purchase Price) ÷ Purchase Price × (365 ÷ Days to Maturity)."
  - question: "What is the formula for calculating yield on Treasury Bills?"
    answer: "The Treasury Bill yield formula is: Discount Yield = (Discount ÷ Face Value) × (360 ÷ Days). Investment Yield = (Discount ÷ Purchase Price) × (365 ÷ Days)."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# T-Bill Yield Calculator – Treasury Bill Rate & Return Estimator

Calculate your Treasury Bill yield with our free **T-Bill Yield Calculator**. Enter purchase price, face value, and days to maturity to see your discount yield, investment yield, and rate of return — all without your data leaving your browser.

<!-- more -->

## How the T-Bill Yield Calculator Works

A **treasury bill yield calculator** helps investors determine the return on short-term government securities. Treasury Bills (T-Bills) are sold at a discount to face value and mature at par, with the difference representing the investor's return.

This **t bill yield calculator** computes:

- **Discount Yield (Bank Discount Yield)** — uses a 360-day year and face value as the denominator
- **Investment Yield (Bond Equivalent Yield)** — uses a 365-day year and purchase price as the denominator
- **Dollar Return** — the total profit from the investment
- **Annualized Return** — return on an annualized basis
- **Effective Annual Yield** — annualized return with compounding

---

## T-Bill Yield Formulas

### Discount Yield (Bank Discount Yield)

**Discount Yield = (Face Value − Purchase Price) ÷ Face Value × (360 ÷ Days to Maturity)**

### Investment Yield (Bond Equivalent Yield)

**Investment Yield = (Face Value − Purchase Price) ÷ Purchase Price × (365 ÷ Days to Maturity)**

### Dollar Return

**Dollar Return = Face Value − Purchase Price**

### Effective Annual Yield

**Effective Annual Yield = (1 + Investment Yield)^(365 ÷ Days to Maturity) − 1**

---

## T-Bill Yield Comparison Table

| Days to Maturity | Purchase Price (for $10,000) | Discount Yield | Investment Yield |
|------------------|------------------------------|----------------|------------------|
| 28 days | $9,940 | 7.71% | 7.78% |
| 91 days | $9,800 | 7.91% | 8.19% |
| 182 days | $9,600 | 7.91% | 8.27% |
| 365 days | $9,200 | 7.91% | 8.70% |

---

## Who Benefits from the T-Bill Yield Calculator?

This **t bill interest rate calculator** is designed for:

- **Investors** evaluating Treasury Bill returns
- **Financial advisors** comparing fixed-income investments
- **Retail investors** building a diversified portfolio
- **Anyone** wanting to understand the **t bill yield formula**
- **Students** learning about **treasury bill yield to maturity calculator** concepts

---

## Frequently Asked Questions

### What is a T-Bill yield calculator?
A T-Bill yield calculator helps investors determine the return on Treasury Bills by calculating discount yield, investment yield, and annualized return.

### What is the formula for Treasury Bill yield?
The discount yield formula is: (Face Value − Purchase Price) ÷ Face Value × (360 ÷ Days to Maturity). The investment yield formula is: (Face Value − Purchase Price) ÷ Purchase Price × (365 ÷ Days to Maturity).

### What is the difference between discount yield and investment yield?
Discount yield uses a 360-day year and face value as the denominator. Investment yield uses a 365-day year and purchase price as the denominator, making it more comparable to other investments.

### How is the yield to maturity calculated on a Treasury Bill?
Yield to maturity on a T-Bill is calculated using the investment yield formula: (Face Value − Purchase Price) ÷ Purchase Price × (365 ÷ Days to Maturity).

### What is the formula for calculating yield on Treasury Bills?
The Treasury Bill yield formula is: Discount Yield = (Discount ÷ Face Value) × (360 ÷ Days). Investment Yield = (Discount ÷ Purchase Price) × (365 ÷ Days).

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.