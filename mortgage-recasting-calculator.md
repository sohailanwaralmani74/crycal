---
layout: tool
title: "Mortgage Recasting | Interactive Online Tool"
description: "Free online Mortgage Recasting. Calculate loan payments, interest growth, taxes, and financial metrics with instant browser math and charts."
permalink: /mortgage-recasting-calculator
tool_id: mortgage-recasting-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: loanBalance
    label: Current Loan Balance
    type: number
    default: 250000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 250000"

  - id: interestRate
    label: Current Interest Rate (%)
    type: number
    default: 6.5
    step: 0.125
    min: 0
    max: 15
    suffix: '%'
    placeholder: "e.g., 6.5"

  - id: remainingTerm
    label: Remaining Loan Term (Years)
    type: number
    default: 25
    step: 1
    min: 1
    max: 40
    placeholder: "e.g., 25"

  - id: lumpSumPayment
    label: Lump‑Sum Principal Payment
    type: number
    default: 50000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 50000"

  - id: recastFee
    label: Recast Fee (if applicable)
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 500"

  - id: originalTerm
    label: Original Loan Term (Years)
    type: number
    default: 30
    step: 1
    min: 1
    max: 40
    placeholder: "e.g., 30"

  - id: originalRate
    label: Original Interest Rate (%)
    type: number
    default: 6.5
    step: 0.125
    min: 0
    max: 15
    suffix: '%'
    placeholder: "e.g., 6.5"

outputs:
  - id: currentPayment
    label: Current Monthly Payment
  - id: recastPayment
    label: New Monthly Payment (After Recast)
  - id: monthlySavings
    label: Monthly Savings
  - id: totalInterestOriginal
    label: Total Interest (Current Path)
  - id: totalInterestRecast
    label: Total Interest (After Recast)
  - id: interestSavings
    label: Total Interest Savings
  - id: breakEvenMonths
    label: Break‑Even Period (Months)
  - id: recommendation
    label: Recommendation

charts:
  tabs:
    - id: comparison
      label: Payment Comparison
    - id: interest
      label: Interest Savings

history_columns:
  - key: loanBalance
    label: Loan Balance
    source: input
  - key: lumpSumPayment
    label: Lump‑Sum Payment
    source: input
  - key: currentPayment
    label: Current Payment
    source: output
  - key: recastPayment
    label: Recast Payment
    source: output
  - key: interestSavings
    label: Interest Savings
    source: output

js_file: assets/js/calculators/mortgage-recasting-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Mortgage Recasting Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use our free Mortgage Recasting Calculator to see how a lump‑sum payment reduces your monthly mortgage payment. Compare current vs recast payments instantly."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Current vs Recast Payment Comparison"
    - "Monthly Savings Calculation"
    - "Total Interest Savings"
    - "Break‑Even Period Analysis"
    - "Visual Payment & Interest Charts"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Mortgage Recasting Calculator

howto:
  name: "How to Use the Mortgage Recasting Calculator"
  description: "Follow these steps to evaluate your mortgage recast options."
  step:
    - name: "Enter your current loan balance"
      text: "Enter your current outstanding mortgage balance."
    - name: "Enter your interest rate"
      text: "Enter your current mortgage interest rate."
    - name: "Enter your remaining term"
      text: "Enter the remaining years on your mortgage."
    - name: "Enter your lump‑sum payment"
      text: "Enter the amount you plan to pay toward the principal."
    - name: "View your results"
      text: "See your new monthly payment, savings, and break‑even period."

faq:
  - question: "What is a mortgage recast?"
    answer: "A mortgage recast (re‑amortization) is when you make a large lump‑sum payment toward your principal and your lender recalculates your monthly payment based on the new lower balance, while keeping the same interest rate and loan term."
  - question: "How does a mortgage recast calculator work?"
    answer: "A mortgage recast calculator takes your current loan balance, interest rate, remaining term, and lump‑sum payment to compute your new monthly payment, total savings, and break‑even period."
  - question: "What is the difference between a recast and a refinance?"
    answer: "A recast keeps your existing interest rate and loan term, only lowering your monthly payment. A refinance replaces your entire loan with a new one, potentially changing the rate, term, and costs."
  - question: "Is there a fee to recast a mortgage?"
    answer: "Yes — most lenders charge a recast fee, typically between $150 and $500. The calculator includes a recast fee input to factor this cost into your analysis."
  - question: "How long does it take to break even on a mortgage recast?"
    answer: "The break‑even period is the number of months it takes for your monthly savings to cover the cost of the recast fee (if any)."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Mortgage Recasting Calculator

Use our free **Mortgage Recasting Calculator** to see how a lump‑sum payment reduces your monthly mortgage payment. Compare current vs recast payments instantly — all without your data leaving your browser.

<!-- more -->

## What Is a Mortgage Recast?

A **mortgage recast** — also called a **re‑amortization** — is a strategy where you make a large lump‑sum payment toward your loan principal, and your lender recalculates (re‑amortizes) your remaining monthly payments based on the new, lower balance. Your interest rate and loan term remain unchanged.

This is **different from a refinance**, which replaces your entire loan with a new one.

## How Does the Mortgage Recasting Calculator Work?

This **recast calculator mortgage** uses your current loan details and your proposed lump‑sum payment to compute:

- **New Monthly Payment** — your lower payment after the recast
- **Monthly Savings** — the difference between current and new payments
- **Total Interest Savings** — how much interest you save over the life of the loan
- **Break‑Even Period** — how long it takes for the monthly savings to cover the recast fee (if any)

The tool also shows a side‑by‑side comparison of your current payment schedule versus the recast payment schedule.

## Who Benefits from the Recast Mortgage Payment Calculator?

This **home loan recast calculator** is designed for:

- **Homeowners** with extra cash looking to lower their monthly mortgage burden
- **Homebuyers** who sold a previous home and want to apply proceeds to a new mortgage
- **Borrowers** who want to keep their current low interest rate but reduce payments
- **Anyone** considering a **mortgage loan recast calculator** to evaluate if recasting is worth it

---

## Frequently Asked Questions

### What is a mortgage recast?
A mortgage recast is when you make a large lump‑sum payment toward your principal and your lender recalculates your monthly payment based on the new lower balance, while keeping the same interest rate and loan term.

### How does a mortgage recast calculator work?
It takes your current loan balance, interest rate, remaining term, and lump‑sum payment to compute your new monthly payment, total savings, and break‑even period.

### What is the difference between a recast and a refinance?
A recast keeps your existing interest rate and loan term, only lowering your monthly payment. A refinance replaces your entire loan with a new one, potentially changing the rate, term, and costs.

### Is there a fee to recast a mortgage?
Yes — most lenders charge a recast fee, typically between $150 and $500. The calculator includes a recast fee input.

### How long does it take to break even on a mortgage recast?
The break‑even period is the number of months it takes for your monthly savings to cover the cost of the recast fee (if any).

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data uploaded, no signup.