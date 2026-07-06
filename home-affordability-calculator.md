---
layout: tool
title: Home Affordability Calculator
description: Calculate how much house you can afford based on your income, debts, down payment, and current interest rates. Plan your home purchase with confidence.
permalink: /home-affordability-calculator
tool_id: home-affordability
category: mortgage
hide_sidebar: true

inputs:
  - id: annualIncome
    label: Annual Household Income
    type: number
    default: 100000
    step: 1000
    min: 0
    currency: true

  - id: monthlyDebts
    label: Monthly Debt Payments
    type: number
    default: 500
    step: 50
    min: 0
    currency: true
    placeholder: "Credit cards, loans, etc."

  - id: downPayment
    label: Down Payment
    type: number
    default: 60000
    step: 1000
    min: 0
    currency: true

  - id: interestRate
    label: Mortgage Interest Rate (%)
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

  - id: propertyTax
    label: Annual Property Tax (%)
    type: number
    default: 1.2
    step: 0.05
    min: 0
    suffix: '%'

  - id: insurance
    label: Annual Home Insurance (%)
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'

  - id: hoaFees
    label: Monthly HOA Fees
    type: number
    default: 0
    step: 25
    min: 0
    currency: true

  - id: frontEndRatio
    label: Front-End DTI Limit (%)
    type: number
    default: 28.0
    step: 0.5
    min: 0
    max: 50
    suffix: '%'
    placeholder: "Housing expenses only"

  - id: backEndRatio
    label: Back-End DTI Limit (%)
    type: number
    default: 36.0
    step: 0.5
    min: 0
    max: 50
    suffix: '%'
    placeholder: "All monthly debts"

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
  - id: maxHomePrice
    label: Maximum Home Price
  - id: maxLoanAmount
    label: Maximum Loan Amount
  - id: monthlyPayment
    label: Estimated Monthly Payment
  - id: frontEndRatio
    label: Front-End DTI (%)
    unit: '%'
  - id: backEndRatio
    label: Back-End DTI (%)
    unit: '%'
  - id: remainingIncome
    label: Remaining Monthly Income

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: dti
      label: DTI Analysis
    - id: affordability
      label: Affordability

history_columns:
  - key: annualIncome
    label: Annual Income
    source: input
  - key: monthlyDebts
    label: Monthly Debts
    source: input
  - key: downPayment
    label: Down Payment
    source: input
  - key: interestRate
    label: Rate (%)
    source: input
  - key: loanTerm
    label: Term (yrs)
    source: input
  - key: maxHomePrice
    label: Max Home Price
    source: output
  - key: monthlyPayment
    label: Monthly Payment
    source: output

js_file: /assets/js/calculators/home-affordability.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Home Affordability Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate how much house you can afford based on your income, debts, down payment, and current interest rates. Plan your home purchase with confidence."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Maximum Home Price — see exactly how much house you can afford"
    - "DTI Analysis — track both front-end and back-end debt-to-income ratios"
    - "Monthly Payment Breakdown — understand all costs including taxes, insurance, and HOA"
    - "Visual Charts — see your affordability breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Home Affordability Calculator

howto:
  name: "How to Use the Home Affordability Calculator"
  description: "Follow these steps to find out how much home you can afford."
  step:
    - name: "Enter your annual household income"
      text: "Enter your total annual income before taxes."
    - name: "Enter your monthly debt payments"
      text: "Enter all monthly debt payments (credit cards, loans, etc.)."
    - name: "Enter your down payment"
      text: "Enter the amount you plan to put down."
    - name: "Enter the interest rate"
      text: "Enter the current mortgage interest rate."
    - name: "Set your loan term"
      text: "Choose your loan term (typically 30 or 15 years)."
    - name: "Enter property tax, insurance, and HOA"
      text: "Enter the estimated costs for your area."
    - name: "View your results"
      text: "See your maximum affordable home price, monthly payment, and DTI ratios."

faq:
  - question: "How much house can I afford?"
    answer: "The amount depends on your income, debts, down payment, interest rate, and lender guidelines. This home affordability calculator gives you a clear estimate based on standard DTI limits."
  - question: "How is maximum home price calculated?"
    answer: "The affordability calculator uses your income, debts, down payment, and interest rate to determine the maximum loan amount you can qualify for — then adds your down payment to show the total home price you can afford."
  - question: "What are front-end and back-end DTI limits?"
    answer: "Front-end DTI is the percentage of your income going toward housing costs. Back-end DTI includes all monthly debts. Lenders typically use 28% and 36% as guidelines, but this calculator lets you adjust them."
  - question: "How expensive of a house can I afford?"
    answer: "This home affordability calculator factors in your full financial picture — including taxes, insurance, and HOA fees — so you can see how expensive of a home you can truly afford."
  - question: "How much home can you afford on a $100,000 salary?"
    answer: "With a $100,000 salary, minimal debts, and a 20% down payment, you can typically afford a home in the $300,000-$400,000 range, depending on interest rates and taxes. Use this calculator to get a personalized estimate."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Home Affordability Calculator – How Much House Can You Afford?

Use this home affordability calculator to find out how much house you can afford based on your income, debts, down payment, and current interest rates. Enter your annual income, monthly debts, down payment, and loan details — the tool shows your maximum affordable home price, estimated monthly payment, and front-end and back-end DTI ratios. Whether you're wondering "how much home can you afford?" or "how expensive of a house can I afford?", this affordability calculator gives you a clear answer.

<!-- more -->

## Why Use This Affordability Calculator

Buying a home is one of the biggest financial decisions you'll make. This affordability calculator helps you understand your budget before you start house hunting. Whether you're asking "how much home can we afford?" or "how much house payment can I afford?", this tool helps you:

- **💰 Find Your Maximum Home Price** — know exactly how much house you can afford.
- **📊 Understand Your DTI** — see your front-end and back-end debt-to-income ratios.
- **📈 See the Full Monthly Payment** — includes taxes, insurance, and HOA fees.
- **🔁 Compare Scenarios** — adjust inputs to see how they affect affordability.
- **📜 Track Your History** — save, review, and export past calculations to CSV or Excel.
- **🔒 100% Private** — all calculations run locally; your data never leaves your browser.

---

## How the Home Affordability Calculator Works

### Key Formulas

**Front-End DTI = (Housing Expenses ÷ Gross Monthly Income) × 100**

**Back-End DTI = (Total Monthly Debts ÷ Gross Monthly Income) × 100**

### Maximum Home Price Calculation

1. Calculate **maximum monthly housing payment** based on:
   - Front-End DTI limit: `(Annual Income ÷ 12) × (Front-End DTI / 100)`
   - Back-End DTI limit: `((Annual Income ÷ 12) × (Back-End DTI / 100)) − Monthly Debts`

2. Take the **lower** of the two limits.
3. Subtract property tax, insurance, and HOA fees to get the **maximum principal & interest payment**.
4. Use the **mortgage formula** to calculate the **maximum loan amount**.
5. Add your **down payment** to get the **maximum home price**.

---

## How to Use This Home Affordability Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **annual household income** (before taxes).
3.  Enter your **monthly debt payments** (credit cards, auto loans, student loans, etc.).
4.  Enter your **down payment**.
5.  Enter the **mortgage interest rate**.
6.  Choose your **loan term**.
7.  Enter **property tax**, **insurance**, and **HOA fees** for your area.
8.  Adjust the **DTI limits** if needed (default: 28% front-end, 36% back-end).
9.  The tool updates instantly — see your maximum affordable home price, monthly payment, and DTI ratios.

---

## Frequently Asked Questions

### How much house can I afford?
The amount depends on your income, debts, down payment, interest rate, and lender guidelines. This home affordability calculator gives you a clear estimate based on standard DTI limits.

### How is maximum home price calculated?
The affordability calculator uses your income, debts, down payment, and interest rate to determine the maximum loan amount you can qualify for — then adds your down payment to show the total home price you can afford.

### What are front-end and back-end DTI limits?
Front-end DTI is the percentage of your income going toward housing costs. Back-end DTI includes all monthly debts. Lenders typically use 28% and 36% as guidelines, but this calculator lets you adjust them.

### How expensive of a house can I afford?
This home affordability calculator factors in your full financial picture — including taxes, insurance, and HOA fees — so you can see how expensive of a home you can truly afford.

### How much home can you afford on a $100,000 salary?
With a $100,000 salary, minimal debts, and a 20% down payment, you can typically afford a home in the $300,000-$400,000 range, depending on interest rates and taxes. Use this calculator to get a personalized estimate.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

