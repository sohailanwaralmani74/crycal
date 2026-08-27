---
layout: tool
title: "Amortization Calculator | Loan Payment & Interest Schedule"
description: "Free online Amortization. Calculate loan payments, interest growth, taxes, and financial metrics with instant browser math and charts."
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
    answer: "A loan amortization calculator uses your loan amount, interest rate, and term to calculate your fixed monthly payment. Then it breaks down every payment into principal and interest portions, tracking the remaining balance month by month until the loan is fully paid off."
  - question: "What is a loan amortization schedule?"
    answer: "A loan amortization schedule is a table showing every payment on a loan — broken down into how much reduces your debt (principal) and how much goes to the lender as interest. It maps the full life of the loan from the first payment to the last."
  - question: "What is the amortization formula?"
    answer: "The amortization formula calculates the fixed monthly payment needed to repay a loan. It is: M = P × r × (1 + r)^n / ((1 + r)^n − 1), where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the total number of payments."
  - question: "How does making extra payments affect my loan?"
    answer: "Extra payments reduce your principal faster, which lowers the total interest you pay and shortens your loan term. This amortization calculator shows you exactly how much time and money you can save."

---

# Amortization Calculator – See Exactly How Your Loan Payments Work

Ever wondered where your monthly loan payment actually goes? Our **Amortization Calculator** breaks it all down—showing you exactly how much goes toward principal versus interest, month by month. Whether you're planning a mortgage, auto loan, or personal loan, this tool gives you the full picture.

<!-- more -->

## Why You'll Love This Loan Calculator

Understanding your loan inside and out is one of the smartest financial moves you can make. Here's what our amortization calculator helps you do:

- **📋 See the Full Life of Your Loan** — every single payment, broken down by principal and interest
- **💰 Know Your Total Interest** — see exactly how much you'll pay the lender over the life of the loan
- **🔁 Test Extra Payments** — find out how adding just a little extra each month can save you time and money
- **📊 Visualize Your Progress** — charts that show your balance shrinking and interest breakdown over time
- **📜 Keep a Record** — save, review, and export your amortization schedules to CSV or Excel
- **🔒 100% Private** — everything runs locally in your browser; your numbers never leave your device

---

## The Math Behind It (Made Simple)

We use the standard amortization formula to calculate your fixed monthly payment:

**Monthly Payment =**  
Loan Amount × Monthly Rate × (1 + Monthly Rate)^Total Payments ÷ ((1 + Monthly Rate)^Total Payments − 1)

Here's what each part means:

- **Monthly Rate** = Your annual interest rate divided by 12
- **Total Payments** = Your loan term in years × 12

Each payment is then split into:

- **Interest Portion** = Remaining Balance × Monthly Rate *(what the lender earns)*
- **Principal Portion** = Monthly Payment − Interest Portion *(what actually reduces your debt)*

---

## How to Use This Calculator

Getting your full amortization schedule is quick and easy:

1. **Pick your currency** from the selector in the site header.
2. **Enter your loan amount** (the total you're borrowing).
3. **Add your annual interest rate** (APR).
4. **Set your loan term** in years.
5. Want to see how extra payments help? Add an optional **extra monthly payment**.
6. Watch your results appear instantly — monthly payment, total interest, payoff date, and a complete payment-by-payment breakdown.

---

## Amortization in Action: A Quick Example

| Input | Your Numbers |
|-------|---------------|
| Loan Amount | $250,000 |
| Interest Rate | 6.5% |
| Loan Term | 30 years |
| Extra Payment | $0 |

| Result | Value |
|--------|-------|
| Monthly Payment | $1,580 |
| Total Interest | $318,800 |
| Payoff Date | 30 years |

*Now imagine adding just $100 extra each month — you'd save thousands in interest and shave years off your loan term!*

---

## Common Questions About Amortization

### What is an amortization calculator?

It's a tool that shows you exactly how each loan payment is divided between principal and interest. It generates a complete schedule so you can see your loan balance shrink month by month.

### How does a loan amortization calculator work?

It takes your loan amount, interest rate, and term to calculate your fixed payment. Then it breaks down every single payment into principal and interest, tracking your remaining balance until the loan is fully paid off.

### What is a loan amortization schedule?

Think of it as a roadmap for your loan. It's a table that shows every payment over the life of your loan—how much goes to principal, how much to interest, and what's left on your balance after each payment.

### What's the amortization formula?

The formula calculates the fixed monthly payment you need to repay a loan. It factors in your loan amount, interest rate, and term to give you a consistent payment that covers both principal and interest over time.

### How do extra payments help?

Extra payments go straight to reducing your principal, which means you pay less interest overall and finish paying off your loan sooner. Our calculator shows you exactly how much time and money you'll save with those extra contributions.
---
