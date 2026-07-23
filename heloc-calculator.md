---
layout: tool
title: HELOC Calculator – Home Equity Line of Credit Repayment Estimator
description: Calculate interest-only draw period payments and fully amortizing repayment period payments for Home Equity Lines of Credit (HELOC).
permalink: /heloc-calculator
tool_id: heloc-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: lineOfCredit
    label: HELOC Credit Line / Amount Borrowed
    type: number
    default: 50000
    step: 5000
    min: 5000
    currency: true
    placeholder: "e.g., 50000"

  - id: interestRate
    label: Variable Interest Rate (%)
    type: number
    default: 8.50
    step: 0.25
    min: 0.1
    max: 25
    suffix: '%'
    placeholder: "e.g., 8.50"

  - id: drawPeriodYears
    label: Draw Period Duration (Years)
    type: number
    default: 10
    step: 1
    min: 1
    max: 15
    placeholder: "e.g., 10"

  - id: repaymentPeriodYears
    label: Repayment Period Duration (Years)
    type: number
    default: 20
    step: 1
    min: 5
    max: 20
    placeholder: "e.g., 20"

outputs:
  - id: drawPeriodMonthlyPayment
    label: Interest-Only Draw Period Payment
  - id: repaymentPeriodMonthlyPayment
    label: Fully Amortizing Repayment Payment
  - id: totalDrawInterest
    label: Total Interest Paid During Draw Period
  - id: totalRepaymentInterest
    label: Total Interest Paid During Repayment

charts:
  tabs:
    - id: breakdown
      label: HELOC Repayment Phases
    - id: interest
      label: Phase Interest Comparison

history_columns:
  - key: lineOfCredit
    label: Credit Line
    source: input
  - key: interestRate
    label: Rate %
    source: input
  - key: drawPeriodMonthlyPayment
    label: Draw Payment
    source: output
  - key: repaymentPeriodMonthlyPayment
    label: Repayment Payment
    source: output

js_file: assets/js/calculators/heloc-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "HELOC Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate HELOC monthly payments during interest-only draw periods and principal-plus-interest repayment periods."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Dual-Phase HELOC Modeling — calculate interest-only draw payments vs fully amortizing repayment payments"
    - "Payment Shock Warnings — prepare for payment jumps when the draw period ends"
    - "Variable Interest Rate Impact — test rate adjustment scenarios"
    - "170+ World Currencies — auto-format monetary outputs"
    - "100% Private — all calculations run locally in your browser"
    - "Exportable History — log and export past calculations to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: HELOC Calculator

howto:
  name: "How to Calculate HELOC Payments"
  description: "Evaluate your HELOC cash flow during the draw phase and repayment phase."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Enter HELOC amount"
      text: "Input the expected balance or credit line drawn."
    - name: "Set interest rate"
      text: "Enter current variable HELOC interest rate."
    - name: "Set draw & repayment terms"
      text: "Specify draw period years (e.g. 10 yrs) and repayment years (e.g. 20 yrs)."

faq:
  - question: "How does a HELOC work?"
    answer: "A Home Equity Line of Credit (HELOC) is a revolving line of credit secured by home equity. During the initial draw period (typically 10 years), you can draw funds and pay interest-only. After the draw period ends, the loan enters repayment (typically 10-20 years) where principal and interest must be fully repaid."
  - question: "What is HELOC payment shock?"
    answer: "Payment shock occurs when a HELOC transitions from the interest-only draw period to the repayment period, causing monthly payments to significantly increase as principal payments begin."
---

# HELOC Calculator – Home Equity Line of Credit Repayment Estimator

A **Home Equity Line of Credit (HELOC)** offers flexible revolving credit backed by your home's equity. Use our free **HELOC Calculator** to compare interest-only draw payments against fully amortizing repayment payments.

<!-- more -->

## How a HELOC Repayment Structure Works

1. **Draw Period (Years 1–10)**: You can draw funds as needed up to your credit limit. Monthly payments during this phase are interest-only.
2. **Repayment Period (Years 11–30)**: The line of credit closes. You can no longer draw funds, and payments adjust to amortize both principal and interest over the remaining term.

---

## HELOC Payment Phase Comparison Table ($50,000 Borrowed @ 8.5%)

| Phase | Duration | Monthly Payment | Payment Type | Phase Interest Paid |
|---|---|---|---|---|
| **Draw Period** | Years 1–10 (10 Yrs) | **$354.17** | Interest-Only | **$42,500** |
| **Repayment Period** | Years 11–30 (20 Yrs) | **$433.91** | Principal + Interest | **$54,138** |
| **Payment Shock Jump** | Year 11 Shift | **+$79.74 / month (+22.5%)** | Full Amortization | Total Int: **$96,638** |

---

## Frequently Asked Questions

### How does a HELOC work?
A Home Equity Line of Credit (HELOC) is a revolving line of credit secured by home equity. During the initial draw period (typically 10 years), you can draw funds and pay interest-only. After the draw period ends, the loan enters repayment (typically 10-20 years) where principal and interest must be fully repaid.

### What is HELOC payment shock?
Payment shock occurs when a HELOC transitions from the interest-only draw period to the repayment period, causing monthly payments to significantly increase as principal payments begin.
