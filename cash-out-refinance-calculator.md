---
layout: tool
title: Cash-Out Refinance Calculator – Calculate Cash Out & New Payment
description: Calculate how much equity you can cash out, your new mortgage balance, and updated monthly payments.
permalink: /cash-out-refinance-calculator
tool_id: cash-out-refinance-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: homeValue
    label: Current Home Value
    type: number
    default: 450000
    step: 5000
    min: 50000
    currency: true
    placeholder: "e.g., 450000"

  - id: currentBalance
    label: Existing Mortgage Balance
    type: number
    default: 250000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 250000"

  - id: maxLtvPercent
    label: Maximum Allowed LTV (%) (Standard 80%)
    type: number
    default: 80
    step: 5
    min: 50
    max: 95
    suffix: '%'
    placeholder: "e.g., 80"

  - id: newInterestRate
    label: New Interest Rate (%)
    type: number
    default: 6.50
    step: 0.125
    min: 0.1
    max: 20
    suffix: '%'
    placeholder: "e.g., 6.50"

  - id: newLoanTermYears
    label: New Loan Term (Years)
    type: number
    default: 30
    step: 5
    min: 10
    max: 30
    placeholder: "e.g., 30"

outputs:
  - id: maxLoanAmount
    label: Maximum Refinance Loan Amount
  - id: maxCashOutPayout
    label: Maximum Available Cash-Out
  - id: newMonthlyPayment
    label: New Monthly Mortgage Payment (P&I)

charts:
  tabs:
    - id: breakdown
      label: Cash-Out Summary
    - id: equity
      label: Retained Equity vs Cash-Out

history_columns:
  - key: homeValue
    label: Home Value
    source: input
  - key: currentBalance
    label: Existing Balance
    source: input
  - key: maxLtvPercent
    label: Max LTV %
    source: input
  - key: maxCashOutPayout
    label: Cash Payout
    source: output
  - key: newMonthlyPayment
    label: New Pmt
    source: output

js_file: assets/js/calculators/cash-out-refinance-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Cash-Out Refinance Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate maximum cash-out proceeds and new monthly mortgage payments."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "LTV Borrowing Limit Calculation — calculate max cash payout up to 80% or 85% LTV"
    - "New Monthly Payment Estimation — project updated P&I mortgage payments"
    - "Equity Retention Modeling — track remaining unborrowed equity in your home"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"
    - "Exportable History — log and export past calculations to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Cash-Out Refinance Calculator

howto:
  name: "How to Calculate Cash-Out Refinance Limits"
  description: "Determine your maximum allowable cash-out amount based on home equity."
  step:
    - name: "Select currency"
      text: "Choose your preferred currency from the header picker."
    - name: "Enter home value & balance"
      text: "Input home value and existing mortgage balance."
    - name: "Set LTV & new rate"
      text: "Specify maximum LTV (usually 80%) and new interest rate."
    - name: "Review cash proceeds"
      text: "Calculate maximum cash payout and new monthly payment."

faq:
  - question: "What is a cash-out refinance?"
    answer: "A cash-out refinance replaces your existing mortgage with a larger loan, allowing you to withdraw the difference in cash."
  - question: "How much cash can I get from a cash-out refinance?"
    answer: "Most conventional lenders allow you to borrow up to 80% of your home's appraised value minus your existing mortgage balance."
---

# Cash-Out Refinance Calculator – Calculate Cash Out & New Payment

Calculate how much equity you can cash out while refinancing your primary mortgage.

<!-- more -->

## How Cash-Out Refinancing Works

1. **Calculate Maximum Loan**: Most lenders allow up to **80% Loan-to-Value (LTV)** for cash-out refinancing on primary residences.
2. **Subtract Existing Debt**: The existing mortgage balance is paid off first from the new loan proceeds.
3. **Receive Cash**: The remaining balance after paying off the old mortgage and closing costs is paid to you in cash.

---

## Cash-Out Refinance Scenario ($450,000 Home Value @ 80% LTV)

| Existing Mortgage Balance | Max Refinance Loan (80%) | Available Cash Payout | New Monthly Payment (6.5%) | Retained Equity (20%) |
|---|---|---|---|---|
| **$250,000** | $360,000 | **$110,000** | **$2,275.46** | **$90,000** |
| **$200,000** | $360,000 | **$160,000** | **$2,275.46** | **$90,000** |

---

## Frequently Asked Questions

### What is a cash-out refinance?
A cash-out refinance replaces your existing mortgage with a larger loan, allowing you to withdraw the difference in cash.

### How much cash can I get from a cash-out refinance?
Most conventional lenders allow you to borrow up to 80% of your home's appraised value minus your existing mortgage balance.
