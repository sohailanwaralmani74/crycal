---
layout: tool
title: Amortization Calculator
description: Generate a complete loan amortization schedule with our free amortization calculator. See monthly payments, total interest, and principal breakdown for any loan.
permalink: /amortization-calculator
tool_id: amortization
category: debt
hide_sidebar: true

inputs:
  - id: loanAmount
    label: Loan Amount
    type: number
    default: 200000
    step: 1000
    min: 0
    currency: true

  - id: interestRate
    label: Annual Interest Rate (%)
    type: number
    default: 6.5
    step: 0.05
    min: 0
    suffix: '%'

  - id: loanTerm
    label: Loan Term (years)
    type: number
    default: 30
    step: 1
    min: 1
    max: 40

  - id: extraPayment
    label: Extra Monthly Payment
    type: number
    default: 0
    step: 10
    min: 0
    currency: true
    placeholder: "Optional — pay off loan faster"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: monthly
    options:
      - annually
      - semi-annually
      - quarterly
      - monthly
      - daily

outputs:
  - id: monthlyPayment
    label: Monthly Payment
  - id: totalPayment
    label: Total Payment
  - id: totalInterest
    label: Total Interest
  - id: payoffDate
    label: Payoff Date

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: balance
      label: Balance
    - id: interest
      label: Interest

history_columns:
  - key: loanAmount
    label: Loan Amount
    source: input
  - key: interestRate
    label: Rate (%)
    source: input
  - key: loanTerm
    label: Term (yrs)
    source: input
  - key: extraPayment
    label: Extra Payment
    source: input
  - key: monthlyPayment
    label: Monthly Payment
    source: output
  - key: totalInterest
    label: Total Interest
    source: output
  - key: payoffDate
    label: Payoff Date
    source: output

js_file: assets/js/calculators/amortization.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Amortization Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Generate a complete loan amortization schedule with our free amortization calculator. See monthly payments, total interest, and principal breakdown for any loan."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Complete Amortization Schedule — see every payment, principal, and interest"
    - "Extra Payment Modeling — pay off your loan faster"
    - "Monthly Payment Breakdown — see principal vs interest over time"
    - "Visual Charts — track your loan balance and interest over time"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Debt
    url: /debt
  - name: Amortization Calculator

howto:
  name: "How to Use the Amortization Calculator"
  description: "Follow these steps to generate your loan amortization schedule."
  step:
    - name: "Enter your loan amount"
      text: "Enter the total amount you borrowed."
    - name: "Enter your annual interest rate"
      text: "Enter your loan's annual interest rate (APR)."
    - name: "Enter your loan term"
      text: "Enter the loan term in years."
    - name: "Set an extra payment (optional)"
      text: "Enter any extra amount you plan to pay each month to see how it affects your loan."
    - name: "View your results"
      text: "See your monthly payment, total interest, payoff date, and full amortization schedule."

faq:
  - question: "What is an amortization calculator?"
    answer: "An amortization calculator shows you how each loan payment is split between principal and interest. It generates a complete amortization schedule, helping you understand exactly how your loan balance decreases over time."
  - question: "How does a loan amortization calculator work?"
    answer: "It uses your loan amount, interest rate, and term to calculate your fixed monthly payment. Then it breaks down every payment into principal and interest portions, tracking the remaining balance month by month until the loan is fully paid off."
  - question: "What is a loan amortization schedule?"
    answer: "A loan amortization schedule is a table showing every payment on a loan — broken down into how much reduces your debt (principal) and how much goes to the lender as interest. It maps the full life of the loan from the first payment to the last."
  - question: "What is the amortization formula?"
    answer: "The amortization formula calculates the fixed monthly payment needed to repay a loan. It is: M = P × r × (1 + r)^n / ((1 + r)^n − 1), where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the total number of payments."
  - question: "How does making extra payments affect my loan?"
    answer: "Extra payments reduce your principal faster, which lowers the total interest you pay and shortens your loan term. This amortization calculator shows you exactly how much time and money you can save."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Amortization Calculator – Generate Your Loan Payment Schedule

Use this amortization calculator to generate a complete loan amortization schedule. Enter your loan amount, interest rate, term, and optional extra payment — the tool shows your monthly payment, total interest, and a full breakdown of every payment. Whether you're planning a mortgage, auto loan, or personal loan, this loan amortization calculator helps you understand exactly how your payments reduce your balance over time.

<!-- more -->

## Why Use This Amortization Schedule Calculator

Understanding how your loan payments work is essential for smart financial planning. This loan amortization calculator helps you:

- **📋 See the Full Picture** — every payment, principal, and interest for the life of your loan.
- **💰 Calculate Total Interest** — know exactly how much you'll pay in interest over the life of the loan.
- **🔁 Test Extra Payments** — see how extra payments shorten your term and save you money.
- **📊 Visualize Your Loan** — charts show your balance and interest breakdown over time.
- **📜 Track Your History** — save, review, and export past calculations to CSV or Excel.
- **🔒 100% Private** — all calculations run locally; your data never leaves your browser.

---

## Amortization Formula Used by This Tool

We use the standard amortization formula to calculate your fixed monthly payment:

**M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)**

Where:

- **M** = Monthly Payment
- **P** = Loan Amount (Principal)
- **r** = Monthly Interest Rate (Annual Rate ÷ 12)
- **n** = Total Number of Payments (Loan Term × 12)

Each payment is then broken down into:

- **Interest Portion** = Remaining Balance × Monthly Rate
- **Principal Portion** = Monthly Payment − Interest Portion

---

## How to Use This Mortgage Amortization Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **loan amount**.
3.  Enter your **annual interest rate** (APR).
4.  Enter your **loan term** in years.
5.  Set an optional **extra monthly payment** to see how it affects your loan.
6.  The tool updates instantly — see your monthly payment, total interest, payoff date, and complete amortization schedule.

---

## Frequently Asked Questions

### What is an amortization calculator?
An amortization calculator shows you how each loan payment is split between principal and interest. It generates a complete amortization schedule, helping you understand exactly how your loan balance decreases over time.

### How does a loan amortization calculator work?
It uses your loan amount, interest rate, and term to calculate your fixed monthly payment. Then it breaks down every payment into principal and interest portions, tracking the remaining balance month by month until the loan is fully paid off.

### What is a loan amortization schedule?
A loan amortization schedule is a table showing every payment on a loan — broken down into how much reduces your debt (principal) and how much goes to the lender as interest. It maps the full life of the loan from the first payment to the last.

### What is the amortization formula?
The amortization formula calculates the fixed monthly payment needed to repay a loan. It is: M = P × r × (1 + r)^n / ((1 + r)^n − 1), where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the total number of payments.

### How does making extra payments affect my loan?
Extra payments reduce your principal faster, which lowers the total interest you pay and shortens your loan term. This amortization calculator shows you exactly how much time and money you can save.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

