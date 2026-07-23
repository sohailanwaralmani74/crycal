---
layout: tool
title: Home Equity Loan Calculator – Fixed Rate Second Mortgage Estimator
description: Calculate monthly payments and lifetime interest costs for a fixed-rate home equity loan (second mortgage).
permalink: /home-equity-loan-calculator
tool_id: home-equity-loan-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: loanAmount
    label: Home Equity Loan Amount
    type: number
    default: 60000
    step: 5000
    min: 5000
    currency: true
    placeholder: "e.g., 60000"

  - id: interestRate
    label: Fixed Interest Rate (%)
    type: number
    default: 7.75
    step: 0.125
    min: 0.1
    max: 20
    suffix: '%'
    placeholder: "e.g., 7.75"

  - id: loanTermYears
    label: Loan Term (Years)
    type: number
    default: 15
    step: 5
    min: 5
    max: 30
    placeholder: "e.g., 15"

outputs:
  - id: monthlyPayment
    label: Fixed Monthly Payment
  - id: totalInterestPaid
    label: Total Lifetime Interest
  - id: totalRepayment
    label: Total Repayment Amount

charts:
  tabs:
    - id: breakdown
      label: Loan Cost Breakdown
    - id: amortization
      label: Amortization Schedule

history_columns:
  - key: loanAmount
    label: Loan Amount
    source: input
  - key: interestRate
    label: Rate %
    source: input
  - key: monthlyPayment
    label: Monthly Pmt
    source: output
  - key: totalInterestPaid
    label: Total Interest
    source: output
  - key: totalRepayment
    label: Total Cost
    source: output

js_file: assets/js/calculators/home-equity-loan-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Home Equity Loan Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate monthly payments and interest costs for fixed-rate home equity loans."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Fixed Monthly Payment Calculations — model predictable second mortgage costs"
    - "Lifetime Cost Breakdown — track total interest vs principal repayment"
    - "Term Length Options — compare 5, 10, 15, and 20 year fixed repayment terms"
    - "170+ World Currencies — auto-format monetary outputs"
    - "100% Private — all calculations run locally in your browser"
    - "Exportable History — log and export past calculations to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Home Equity Loan Calculator

howto:
  name: "How to Calculate Home Equity Loan Payments"
  description: "Calculate fixed monthly payments for a home equity loan."
  step:
    - name: "Select currency"
      text: "Choose your preferred currency from the header picker."
    - name: "Enter loan amount"
      text: "Input the desired home equity lump sum amount."
    - name: "Set interest rate & term"
      text: "Enter loan interest rate and term."

faq:
  - question: "What is a Home Equity Loan?"
    answer: "A home equity loan is a second mortgage that distributes a single lump-sum payout backed by your home's equity, with fixed monthly payments and a fixed interest rate."
  - question: "What is the difference between a Home Equity Loan and a HELOC?"
    answer: "A Home Equity Loan provides a lump-sum payout upfront with a fixed interest rate and fixed monthly payments. A HELOC is a revolving line of credit with a variable interest rate and an interest-only draw period."
---

# Home Equity Loan Calculator – Fixed Rate Second Mortgage Estimator

Calculate fixed monthly payments and total interest costs for a lump-sum **Home Equity Loan**.

<!-- more -->

## Home Equity Loan Key Features

- **Fixed Interest Rate**: Fixed monthly principal and interest payments for predictable budgeting.
- **Lump-Sum Disbursement**: Receive funds upfront for debt consolidation, home renovations, or major expenses.
- **Predictable Schedule**: Typical terms span 5, 10, 15, or 20 years.

---

## Home Equity Loan Term Comparison Table ($60,000 @ 7.75%)

| Term Length | Monthly Payment | Total Repayment | Total Interest Paid |
|---|---|---|---|
| **5 Years (60 Mos)** | **$1,209.68** | $72,581 | **$12,581** |
| **10 Years (120 Mos)**| **$720.57** | $86,468 | **$26,468** |
| **15 Years (180 Mos)**| **$564.91** | $101,684 | **$41,684** |

---

## Frequently Asked Questions

### What is a Home Equity Loan?
A home equity loan is a second mortgage that distributes a single lump-sum payout backed by your home's equity, with fixed monthly payments and a fixed interest rate.

### What is the difference between a Home Equity Loan and a HELOC?
A Home Equity Loan provides a lump-sum payout upfront with a fixed interest rate and fixed monthly payments. A HELOC is a revolving line of credit with a variable interest rate and an interest-only draw period.
