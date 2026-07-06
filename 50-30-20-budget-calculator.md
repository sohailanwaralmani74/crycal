---
layout: tool
title: 50/30/20 Budget Calculator
description: Allocate your income using the 50/30/20 rule. Enter your after-tax income and see how much to spend on Needs, Wants, and Savings. Works for any currency.
permalink: /50-30-20-budget-calculator
tool_id: 503020-budget
category: budgeting
hide_sidebar: true

inputs:
  - id: incomeType
    label: Income Type
    type: select
    default: net
    options:
      - net
      - gross

  - id: totalIncome
    label: Monthly Income
    type: number
    default: 5000
    step: 50
    min: 0
    currency: true
    placeholder: "Enter your monthly income"

  - id: payFrequency
    label: Pay Frequency
    type: select
    default: monthly
    options:
      - monthly
      - bi-weekly
      - weekly

  - id: taxRate
    label: Tax Rate (%)
    type: number
    default: 0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Enter your effective tax rate (if using gross income)"

  - id: needsPercentage
    label: Needs Percentage (%)
    type: number
    default: 50.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Default 50%"

  - id: wantsPercentage
    label: Wants Percentage (%)
    type: number
    default: 30.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Default 30%"

  - id: savingsPercentage
    label: Savings / Debt Percentage (%)
    type: number
    default: 20.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Default 20%"

outputs:
  - id: netIncome
    label: Net Monthly Income
  - id: needsAmount
    label: Needs (50%)
  - id: wantsAmount
    label: Wants (30%)
  - id: savingsAmount
    label: Savings / Debt (20%)
  - id: needsPercentage
    label: Needs

  - id: wantsPercentage
    label: Wants

  - id: savingsPercentage
    label: Savings / Debt


charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: comparison
      label: Comparison
    - id: distribution
      label: Distribution

history_columns:
  - key: totalIncome
    label: Monthly Income
    source: input
  - key: payFrequency
    label: Frequency
    source: input
  - key: needsAmount
    label: Needs
    source: output
  - key: wantsAmount
    label: Wants
    source: output
  - key: savingsAmount
    label: Savings
    source: output

js_file: assets/js/calculators/50-30-20-budget.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "50/30/20 Budget Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Allocate your income using the 50/30/20 rule. Enter your after-tax income and see how much to spend on Needs, Wants, and Savings."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Custom Percentages — adjust the rule to fit your goals"
    - "Multiple Pay Frequencies — monthly, bi-weekly, weekly"
    - "Gross or Net Income — calculate from either"
    - "Visual Charts — see your budget breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Budgeting
    url: /budgeting
  - name: 50/30/20 Budget Calculator

howto:
  name: "How to Use the 50/30/20 Budget Calculator"
  description: "Follow these steps to allocate your income."
  step:
    - name: "Enter your income"
      text: "Enter your monthly income (after-tax or before-tax)."
    - name: "Select income type"
      text: "Choose whether you entered net or gross income."
    - name: "Enter tax rate (if using gross)"
      text: "If using gross income, enter your effective tax rate."
    - name: "Adjust percentages (optional)"
      text: "Customize the 50/30/20 split to match your goals."
    - name: "View your results"
      text: "See how much to allocate to Needs, Wants, and Savings."

faq:
  - question: "What is the 50/30/20 rule?"
    answer: "The 50/30/20 rule is a simple budgeting framework where you allocate 50% of your after-tax income to Needs, 30% to Wants, and 20% to Savings and Debt Repayment."
  - question: "What counts as Needs?"
    answer: "Needs are essential expenses like rent/mortgage, utilities, groceries, transportation, insurance, and minimum debt payments."
  - question: "What counts as Wants?"
    answer: "Wants are non-essential expenses like dining out, entertainment, travel, subscriptions, and luxury items."
  - question: "What counts as Savings / Debt?"
    answer: "Savings includes emergency funds, retirement contributions, investments, and extra debt payments beyond the minimum."
  - question: "Can I customize the percentages?"
    answer: "Yes — you can adjust the percentages to fit your personal financial goals and situation."

---

# 50/30/20 Budget Calculator – Allocate Your Income

Use this 50/30/20 budget calculator to allocate your income according to the popular 50/30/20 rule. Enter your monthly income and see exactly how much to spend on Needs, Wants, and Savings. This 50/30/20 rule calculator helps you build a simple, effective budget in seconds.

<!-- more -->

## Why Use This 50/30/20 Rule Calculator

The 50/30/20 rule is one of the simplest and most effective ways to budget. This calculator helps you:

- **💰 Allocate Your Income** — see exactly how much to spend in each category.
- **📊 Understand Your Spending** — visualize your budget breakdown.
- **🔧 Customize the Rule** — adjust percentages to fit your goals.
- **🌍 Works for Any Currency** — supports all currencies via the global picker.
- **📈 Visualize Your Budget** — see breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How the 50/30/20 Rule Works

| Category | Percentage | Description |
| :--- | :--- | :--- |
| **Needs** | 50% | Essential expenses (housing, utilities, groceries, transportation, insurance, minimum debt payments) |
| **Wants** | 30% | Non-essential expenses (dining out, entertainment, travel, subscriptions, hobbies) |
| **Savings / Debt** | 20% | Savings, investments, emergency fund, extra debt payments |

---

## How to Use This 50/30/20 Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **monthly income**.
3.  Select whether you entered **net or gross** income.
4.  If using gross income, enter your **effective tax rate**.
5.  Adjust the **percentages** (optional) to fit your goals.
6.  View your results instantly — see how much to allocate to Needs, Wants, and Savings.

---

## Frequently Asked Questions

### What is the 50/30/20 rule?
The 50/30/20 rule is a simple budgeting framework where you allocate 50% of your after-tax income to Needs, 30% to Wants, and 20% to Savings and Debt Repayment.

### What counts as Needs?
Needs are essential expenses like rent/mortgage, utilities, groceries, transportation, insurance, and minimum debt payments.

### What counts as Wants?
Wants are non-essential expenses like dining out, entertainment, travel, subscriptions, and luxury items.

### What counts as Savings / Debt?
Savings includes emergency funds, retirement contributions, investments, and extra debt payments beyond the minimum.

### Can I customize the percentages?
Yes — you can adjust the percentages to fit your personal financial goals and situation.

---
