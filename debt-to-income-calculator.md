---
layout: tool
title: "Debt To Income | Interactive Online Tool"
description: "Calculate your debt-to-income (DTI) ratio to understand your financial health. Enter your monthly income and debts to see your DTI percentage."
permalink: /debt-to-income-calculator
tool_id: debt-to-income
category: budgeting
hide_sidebar: true

inputs:
  - id: monthlyIncome
    label: Gross Monthly Income
    type: number
    default: 6000
    step: 100
    min: 0
    currency: true
    placeholder: "Your total monthly income before taxes"

  - id: otherIncome
    label: Other Monthly Income
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Spouse, side gig, rental income"

  - id: mortgagePayment
    label: Monthly Mortgage / Rent
    type: number
    default: 1500
    step: 50
    min: 0
    currency: true
    placeholder: "Your monthly housing payment"

  - id: carPayment
    label: Monthly Auto Payment
    type: number
    default: 400
    step: 50
    min: 0
    currency: true
    placeholder: "Monthly car or other vehicle payment"

  - id: creditCardMinimum
    label: Monthly Credit Card Minimum
    type: number
    default: 200
    step: 25
    min: 0
    currency: true
    placeholder: "Minimum payment on all cards"

  - id: studentLoanPayment
    label: Monthly Student Loan Payment
    type: number
    default: 300
    step: 25
    min: 0
    currency: true
    placeholder: "Monthly student loan payment"

  - id: personalLoanPayment
    label: Monthly Personal Loan Payment
    type: number
    default: 0
    step: 25
    min: 0
    currency: true
    placeholder: "Monthly personal loan payment"

  - id: otherDebtPayment
    label: Monthly Other Debt Payment
    type: number
    default: 0
    step: 25
    min: 0
    currency: true
    placeholder: "Alimony, child support, other debts"

  - id: includeFrontEnd
    label: Include Housing Only?
    type: select
    default: false
    options:
      - true
      - false

outputs:
  - id: totalMonthlyIncome
    label: Total Monthly Income
  - id: totalMonthlyDebt
    label: Total Monthly Debt Payments
  - id: dtiRatio
    label: Debt-to-Income Ratio

  - id: dtiCategory
    label: DTI Category
  - id: frontEndRatio
    label: Front-End DTI (Housing Only)

  - id: backEndRatio
    label: Back-End DTI (All Debts)


charts:
  tabs:
    - id: comparison
      label: Comparison
    - id: breakdown
      label: Breakdown
    - id: distribution
      label: Distribution

history_columns:
  - key: monthlyIncome
    label: Monthly Income
    source: input
  - key: totalMonthlyDebt
    label: Monthly Debt
    source: output
  - key: dtiRatio
    label: DTI (%)
    source: output
  - key: dtiCategory
    label: Category
    source: output

js_file: assets/js/calculators/debt-to-income.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Debt-to-Income Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your debt-to-income (DTI) ratio to understand your financial health. Enter your monthly income and debts to see your DTI percentage."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Front-End & Back-End DTI — see both housing-only and total debt ratios"
    - "Detailed Breakdown — see exactly how much debt you have by category"
    - "DTI Category — understand your financial health at a glance"
    - "Visual Charts — see your income vs debt breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Budgeting
    url: /budgeting
  - name: Debt-to-Income Calculator

howto:
  name: "How to Use the Debt-to-Income Calculator"
  description: "Follow these steps to calculate your DTI ratio."
  step:
    - name: "Enter your monthly income"
      text: "Enter your gross monthly income (before taxes)."
    - name: "Enter other income"
      text: "Enter any other monthly income from spouse, side gigs, or rental properties."
    - name: "Enter your debts"
      text: "Enter your monthly payments for mortgage, auto loans, credit cards, student loans, and other debts."
    - name: "View your results"
      text: "See your DTI ratio, category, and front-end/back-end breakdown."

faq:
  - question: "What is debt-to-income ratio (DTI)?"
    answer: "Your debt-to-income ratio is the percentage of your gross monthly income that goes toward debt payments. Lenders use it to evaluate your ability to manage monthly payments and repay loans."
  - question: "How is DTI calculated?"
    answer: "DTI = (Total Monthly Debt Payments ÷ Total Monthly Income) × 100. A lower DTI indicates better financial health and higher borrowing capacity."
  - question: "What is a good DTI ratio?"
    answer: "A DTI of 36% or less is considered good. 37-43% is acceptable but may limit borrowing options. Above 43% may make it difficult to get approved for loans."
  - question: "What is the difference between front-end and back-end DTI?"
    answer: "Front-end DTI only includes housing expenses (mortgage/rent, property taxes, insurance). Back-end DTI includes all debts (housing, auto, credit cards, student loans, etc.)."
  - question: "What is the maximum DTI for a mortgage?"
    answer: "Most conventional mortgages require a back-end DTI of 43% or less. FHA loans may allow up to 50% with compensating factors."

---

# Debt To Income Calculator

Use this debt-to-income calculator to calculate your DTI ratio and understand your financial health. Enter your monthly income and debts to see your DTI percentage, category, and front-end/back-end breakdown. This DTI ratio calculator helps you evaluate your borrowing capacity.

<!-- more -->

## Why Use This Debt-to-Income Ratio Calculator

Your debt-to-income ratio is one of the most important metrics for financial health. This DTI calculator helps you:

- **💰 Calculate Your DTI** — see your debt-to-income ratio instantly.
- **📊 Understand Your Category** — see if your DTI is excellent, good, or needs improvement.
- **📉 See Front-End vs Back-End** — understand housing-only vs total debt ratios.
- **📈 Visualize Your Finances** — see income vs debt breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Debt-to-Income Ratio Is Calculated

**Front-End DTI = (Housing Expenses ÷ Gross Monthly Income) × 100**

**Back-End DTI = (Total Debt Payments ÷ Gross Monthly Income) × 100**

**DTI Categories:**
- **0-20%:** Excellent — you're in great financial shape
- **21-36%:** Good — healthy debt levels
- **37-43%:** Acceptable — may limit borrowing options
- **44-50%:** High — may struggle to get approved
- **51%+:** Very High — likely debt stress

---

## How to Use This DTI Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **gross monthly income** (before taxes).
3.  Enter any **other monthly income** (spouse, side gig, rental).
4.  Enter your **monthly debt payments**:
    - Mortgage / Rent
    - Auto Payment
    - Credit Card Minimum
    - Student Loan Payment
    - Personal Loan Payment
    - Other Debt Payment
5.  View your results instantly — see your DTI ratio, category, and breakdown.

---

## Frequently Asked Questions

### What is debt-to-income ratio (DTI)?
Your debt-to-income ratio is the percentage of your gross monthly income that goes toward debt payments. Lenders use it to evaluate your ability to manage monthly payments and repay loans.

### How is DTI calculated?
DTI = (Total Monthly Debt Payments ÷ Total Monthly Income) × 100. A lower DTI indicates better financial health and higher borrowing capacity.

### What is a good DTI ratio?
A DTI of 36% or less is considered good. 37-43% is acceptable but may limit borrowing options. Above 43% may make it difficult to get approved for loans.

### What is the difference between front-end and back-end DTI?
Front-end DTI only includes housing expenses (mortgage/rent, property taxes, insurance). Back-end DTI includes all debts (housing, auto, credit cards, student loans, etc.).

### What is the maximum DTI for a mortgage?
Most conventional mortgages require a back-end DTI of 43% or less. FHA loans may allow up to 50% with compensating factors.

---

