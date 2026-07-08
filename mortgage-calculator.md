---
layout: tool
title: Mortgage Calculator
description: Calculate your monthly mortgage payments with our free mortgage calculator. Estimate payments, total interest, and amortization schedule.
permalink: /mortgage-calculator
tool_id: mortgage
category: mortgage
hide_sidebar: true

inputs:
  - id: homePrice
    label: Home Price
    type: number
    default: 350000
    step: 1000
    min: 0
    currency: true

  - id: downPayment
    label: Down Payment
    type: number
    default: 70000
    step: 1000
    min: 0
    currency: true
    placeholder: "20% is typically recommended"

  - id: loanTerm
    label: Loan Term (years)
    type: number
    default: 30
    step: 1
    min: 1
    max: 40

  - id: interestRate
    label: Annual Interest Rate (%)
    type: number
    default: 6.5
    step: 0.05
    min: 0
    suffix: '%'

  - id: propertyTax
    label: Annual Property Tax (%)
    type: number
    default: 1.2
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "Estimated annual tax rate"

  - id: insurance
    label: Annual Home Insurance
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "Estimated annual insurance rate"

  - id: pmiRate
    label: PMI Rate (%)
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "0% if down payment ≥ 20%"

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
  - id: loanAmount
    label: Loan Amount
  - id: pmiPayment
    label: PMI Payment (monthly)
  - id: taxInsurancePayment
    label: Tax & Insurance (monthly)

charts:
  tabs:
    - id: amortization
      label: Amortization
    - id: breakdown
      label: Breakdown
    - id: monthly
      label: Monthly

history_columns:
  - key: homePrice
    label: Home Price
    source: input
  - key: downPayment
    label: Down Payment
    source: input
  - key: loanTerm
    label: Loan Term (yrs)
    source: input
  - key: interestRate
    label: Rate (%)
    source: input
  - key: propertyTax
    label: Tax (%)
    source: input
  - key: insurance
    label: Insurance (%)
    source: input
  - key: monthlyPayment
    label: Monthly Payment
    source: output
  - key: totalInterest
    label: Total Interest
    source: output

js_file: assets/js/calculators/mortgage.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Mortgage Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your monthly mortgage payments with our mortgage calculator. Estimate payments, total interest, and amortization schedule. Plan your home purchase today."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Monthly Payment Breakdown — see principal, interest, taxes, insurance, and PMI"
    - "Amortization Schedule — track your loan balance over time"
    - "Total Interest Calculation — understand the full cost of your mortgage"
    - "PMI Calculator — see when you can cancel PMI"
    - "Visual Amortization Charts — track your progress"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Mortgage Calculator

howto:
  name: "How to Use the Mortgage Calculator"
  description: "Follow these steps to estimate your monthly mortgage payments."
  step:
    - name: "Enter the home price"
      text: "Enter the total price of the home you're considering."
    - name: "Enter your down payment"
      text: "Enter the amount you plan to put down upfront."
    - name: "Choose your loan term"
      text: "Select the length of your mortgage (typically 15 or 30 years)."
    - name: "Enter the interest rate"
      text: "Enter the annual interest rate offered by your lender."
    - name: "Enter property tax and insurance rates"
      text: "Enter the estimated annual property tax and home insurance rates."
    - name: "Enter PMI rate (if applicable)"
      text: "Enter the PMI rate (0% if down payment ≥ 20%)."
    - name: "View your results"
      text: "See your monthly payment, total payment, total interest, and amortization schedule."

faq:
  - question: "How does the mortgage calculator work?"
    answer: "It calculates your monthly mortgage payment based on the loan amount, interest rate, loan term, property taxes, insurance, and PMI. The payment is then broken down into principal, interest, taxes, insurance, and PMI."
  - question: "What is PMI and when do I pay it?"
    answer: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It protects the lender if you default. You can request cancellation once your equity reaches 20%."
  - question: "What is the formula used for mortgage calculations?"
    answer: "We use the standard mortgage payment formula: M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of monthly payments."
  - question: "What is a good down payment?"
    answer: "A 20% down payment is ideal because it avoids PMI, reduces your monthly payment, and lowers the total interest paid. However, many programs allow down payments as low as 3-5%."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Mortgage Calculator – Estimate Your Monthly Payments

Use this mortgage calculator to estimate your monthly mortgage payments, total interest, and amortization schedule. Enter the home price, down payment, loan term, interest rate, property taxes, insurance, and PMI — the tool shows your full payment breakdown, total loan cost, and visual amortization schedule. Whether you're buying your first home or refinancing, this mortgage calculator helps you plan your home purchase with confidence.

<!-- more -->

## Why Use This Mortgage Payment Calculator

A mortgage is one of the largest financial commitments you'll ever make. This mortgage payment calculator helps you:

- **💰 Estimate Your Monthly Payment** — see exactly what you'll pay each month.
- **📊 Understand the Full Cost** — know how much interest you'll pay over the life of the loan.
- **📈 Track Your Equity** — see your amortization schedule and loan balance over time.
- **🔁 Compare Scenarios** — adjust inputs to see how they affect your payment.
- **📜 Track Your History** — save, review, and export past calculations to CSV or Excel.
- **🔒 100% Private** — all calculations run locally; your data never leaves your browser.

---

## Mortgage Formula Used by This Tool

We use the standard mortgage payment formula:

**M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)**

Where:

- **P** = Loan Amount (Home Price − Down Payment)
- **r** = Monthly Interest Rate (Annual Rate ÷ 12)
- **n** = Number of Monthly Payments (Loan Term × 12)

**Total Payment = Monthly Payment × n**
**Total Interest = Total Payment − Loan Amount**

**Taxes and Insurance** are added to the monthly payment using the rates you provide.
**PMI** is added when the down payment is less than 20%.

---

## How to Use This Mortgage Payment Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter the **home price** (total purchase price).
3.  Enter your **down payment** (amount you're paying upfront).
4.  Choose your **loan term** (e.g., 30 years).
5.  Enter the **annual interest rate** offered by your lender.
6.  Enter the **annual property tax rate** (typical: 1-2%).
7.  Enter the **annual home insurance rate** (typical: 0.3-0.8%).
8.  Enter the **PMI rate** (0% if down payment ≥ 20%).
9.  The tool updates instantly — see your monthly payment, total payment, total interest, and amortization schedule.

---

## Frequently Asked Questions

### How does the mortgage calculator work?
It calculates your monthly mortgage payment based on the loan amount, interest rate, loan term, property taxes, insurance, and PMI. The payment is then broken down into principal, interest, taxes, insurance, and PMI.

### What is PMI and when do I pay it?
Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It protects the lender if you default. You can request cancellation once your equity reaches 20%.

### What is the formula used for mortgage calculations?
We use the standard mortgage payment formula: M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of monthly payments.

### What is a good down payment?
A 20% down payment is ideal because it avoids PMI, reduces your monthly payment, and lowers the total interest paid. However, many programs allow down payments as low as 3-5%.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

