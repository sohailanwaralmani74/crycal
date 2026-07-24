---
layout: tool
title: "Pmi | Interactive Online Tool"
description: "Calculate your monthly PMI cost, total PMI paid, and when you can cancel Private Mortgage Insurance. Enter home price, down payment, and PMI rate."
permalink: /pmi-calculator
tool_id: pmi-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: homePrice
    label: Home Price
    type: number
    default: 300000
    step: 1000
    min: 0
    currency: true

  - id: downPayment
    label: Down Payment
    type: number
    default: 30000
    step: 1000
    min: 0
    currency: true

  - id: pmiRate
    label: Annual PMI Rate (%)
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "Typical range: 0.3% – 1.5%"

  - id: interestRate
    label: Mortgage Interest Rate (%)
    type: number
    default: 6.5
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "Used to calculate loan balance over time"

  - id: loanTerm
    label: Loan Term (years)
    type: number
    default: 30
    step: 1
    min: 1
    max: 40

  - id: propertyAppreciation
    label: Annual Property Appreciation (%)
    type: number
    default: 3.0
    step: 0.1
    min: 0
    suffix: '%'
    placeholder: "Optional — affects cancellation timing"

outputs:
  - id: loanAmount
    label: Loan Amount
  - id: monthlyPMI
    label: Monthly PMI Payment
  - id: annualPMI
    label: Annual PMI Cost
  - id: totalPMIPaid
    label: Total PMI Paid (until cancellation)
  - id: cancellationMonths
    label: Months Until PMI Cancellation
  - id: cancellationYears
    label: Years Until PMI Cancellation
  - id: cancellationBalance
    label: Loan Balance at Cancellation

charts:
  tabs:
    - id: timeline
      label: Timeline

history_columns:
  - key: homePrice
    label: Home Price
    source: input
  - key: downPayment
    label: Down Payment
    source: input
  - key: pmiRate
    label: PMI Rate (%)
    source: input
  - key: monthlyPMI
    label: Monthly PMI
    source: output
  - key: cancellationMonths
    label: Cancellation (months)
    source: output

js_file: /assets/js/calculators/pmi-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "PMI Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your monthly PMI cost, total PMI paid, and when you can cancel Private Mortgage Insurance. Enter home price, down payment, and PMI rate."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Monthly PMI Calculation"
    - "Total PMI Paid"
    - "PMI Cancellation Timeline"
    - "Amortization-based Balance Tracking"
    - "Appreciation Impact on Cancellation"
    - "170+ World Currencies"
    - "100% Private"
    - "Shareable Links"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: PMI Calculator

howto:
  name: "How to Use the PMI Calculator"
  description: "Follow these steps to calculate your PMI cost and cancellation timeline."
  step:
    - name: "Enter the home price"
      text: "Enter the total price of the home you're considering."
    - name: "Enter your down payment"
      text: "Enter the amount you plan to put down."
    - name: "Enter the PMI rate"
      text: "Enter the annual PMI rate (typically 0.3–1.5% of the loan amount)."
    - name: "Enter your mortgage rate and term"
      text: "Enter the interest rate and loan term to track the loan balance over time."
    - name: "Enter appreciation (optional)"
      text: "Enter the expected annual property appreciation to see how it affects cancellation timing."
    - name: "View your results"
      text: "See your monthly PMI, total PMI, and when you can cancel PMI."

faq:
  - question: "What is PMI?"
    answer: "Private Mortgage Insurance (PMI) is a type of insurance that protects the lender if you default on your mortgage. It is typically required when your down payment is less than 20% of the home price."
  - question: "How is PMI calculated?"
    answer: "PMI is calculated as an annual percentage of the loan amount, divided by 12 for monthly payments. The rate depends on your down payment percentage and credit score."
  - question: "When can I cancel PMI?"
    answer: "You can cancel PMI when your loan-to-value (LTV) ratio reaches 80% or less. This can happen through principal payments, property appreciation, or a combination of both. This calculator shows you the exact month you can request cancellation."
  - question: "Does PMI cost the same for everyone?"
    answer: "No. The PMI rate varies based on your down payment percentage and credit score. A larger down payment and higher credit score typically result in a lower PMI rate."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Pmi Calculator

Use this PMI calculator to estimate your monthly Private Mortgage Insurance cost and find out exactly when you can cancel it. Enter your home price, down payment, and PMI rate — the tool shows your monthly PMI, total PMI paid, and the loan balance at cancellation. This PMI cancellation calculator helps you plan your path to eliminating this added cost.

<!-- more -->

## Why Use This PMI Calculator

Private Mortgage Insurance is an added cost for many homebuyers who put down less than 20%. This PMI calculator helps you:

- **💰 Calculate Monthly PMI** — see exactly how much you're paying each month.
- **📊 Find Cancellation Date** — know when your LTV reaches 80% and you can request PMI removal.
- **📈 Understand the Impact** — see total PMI paid over the life of the loan.
- **🔁 Factor in Appreciation** — see how property value growth accelerates PMI cancellation.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How PMI Is Calculated

**Loan Amount = Home Price − Down Payment**

**Annual PMI Cost = Loan Amount × (PMI Rate / 100)**

**Monthly PMI = Annual PMI Cost ÷ 12**

**PMI Cancellation occurs when the loan balance drops to 80% of the home price (or current value with appreciation).**

The calculator simulates your loan amortization month by month using your interest rate and loan term, tracking the loan balance until it reaches the 80% LTV threshold. If you include property appreciation, the threshold is recalculated based on the appreciated home value, which can significantly shorten the PMI duration.

---

## How to Use This PMI Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter the **home price** of the property.
3.  Enter your **down payment** amount.
4.  Enter the **annual PMI rate** (your lender will provide this; typical range is 0.3% – 1.5%).
5.  Enter your **mortgage interest rate** and **loan term**.
6.  Optionally, enter the **expected annual property appreciation**.
7.  View your results instantly — see your monthly PMI, total PMI, and cancellation timeline.

---

## Frequently Asked Questions

### What is PMI?
Private Mortgage Insurance (PMI) is a type of insurance that protects the lender if you default on your mortgage. It is typically required when your down payment is less than 20% of the home price.

### How is PMI calculated?
PMI is calculated as an annual percentage of the loan amount, divided by 12 for monthly payments. The rate depends on your down payment percentage and credit score.

### When can I cancel PMI?
You can cancel PMI when your loan-to-value (LTV) ratio reaches 80% or less. This can happen through principal payments, property appreciation, or a combination of both. This calculator shows you the exact month you can request cancellation.

### Does PMI cost the same for everyone?
No. The PMI rate varies based on your down payment percentage and credit score. A larger down payment and higher credit score typically result in a lower PMI rate.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
