---
layout: tool
title: Personal Loan Calculator – Monthly Payment & Total Interest
description: Calculate monthly payments, total interest costs, and overall repayment for fixed-rate personal loans.
permalink: /personal-loan-calculator
tool_id: personal-loan-calculator
category: debt
hide_sidebar: true

inputs:
  - id: loanAmount
    label: Personal Loan Amount
    type: number
    default: 15000
    step: 1000
    min: 1000
    currency: true
    placeholder: "e.g., 15000"

  - id: interestRate
    label: Annual Interest Rate (%) (APR)
    type: number
    default: 10.50
    step: 0.25
    min: 0.1
    max: 36
    suffix: '%'
    placeholder: "e.g., 10.50"

  - id: loanTermMonths
    label: Loan Term (Months)
    type: number
    default: 36
    step: 12
    min: 6
    max: 84
    placeholder: "e.g., 36"

outputs:
  - id: monthlyPayment
    label: Monthly Payment
  - id: totalInterest
    label: Total Interest Cost
  - id: totalRepayment
    label: Total Repayment Amount

charts:
  tabs:
    - id: breakdown
      label: Principal vs Interest
    - id: amortization
      label: Amortization Schedule

history_columns:
  - key: loanAmount
    label: Loan Amount
    source: input
  - key: interestRate
    label: APR %
    source: input
  - key: loanTermMonths
    label: Term (Mos)
    source: input
  - key: monthlyPayment
    label: Monthly Pmt
    source: output
  - key: totalInterest
    label: Total Interest
    source: output

js_file: assets/js/calculators/personal-loan-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Personal Loan Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate monthly payments and total interest for fixed-rate personal loans."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Fixed Monthly Payment Calculation — determine exact monthly installments"
    - "APR & Total Cost Modeling — compare 12 to 84 month loan terms"
    - "Amortization Trajectory — view interest vs principal repayment per month"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"
    - "Exportable History — log and export past calculations to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Debt
    url: /debt
  - name: Personal Loan Calculator

howto:
  name: "How to Calculate Personal Loan Payments"
  description: "Calculate fixed monthly payments and interest costs for unsecured personal loans."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Enter loan amount"
      text: "Input the personal loan amount requested."
    - name: "Set APR & term"
      text: "Enter annual percentage rate (APR) and term in months."
    - name: "Review payments"
      text: "Examine monthly installment and total lifetime interest."

faq:
  - question: "What is a personal loan?"
    answer: "A personal loan is an unsecured fixed-rate loan provided by banks, credit unions, or online lenders that is repaid in fixed monthly installments over a set period."
  - question: "How does the loan term affect my monthly payment and total interest?"
    answer: "A shorter loan term results in higher monthly payments but significantly lower total interest. A longer term lowers monthly payments but increases total interest paid over the life of the loan."
---

# Personal Loan Calculator – Monthly Payment & Total Interest

Calculate fixed monthly payments and total interest costs for unsecured **Personal Loans** with our free calculator.

<!-- more -->

## Personal Loan Term Comparison Table ($15,000 Loan @ 10.5% APR)

| Loan Term | Monthly Payment | Total Repayment | Total Interest Paid |
|---|---|---|---|
| **24 Months (2 Yrs)** | **$695.59** | $16,694 | **$1,694** |
| **36 Months (3 Yrs)** | **$487.52** | $17,551 | **$2,551** |
| **48 Months (4 Yrs)** | **$384.09** | $18,436 | **$3,436** |
| **60 Months (5 Yrs)** | **$322.42** | $19,345 | **$4,345** |

---

## Frequently Asked Questions

### What is a personal loan?
A personal loan is an unsecured fixed-rate loan provided by banks, credit unions, or online lenders that is repaid in fixed monthly installments over a set period.

### How does the loan term affect my monthly payment and total interest?
A shorter loan term results in higher monthly payments but significantly lower total interest. A longer term lowers monthly payments but increases total interest paid over the life of the loan.
