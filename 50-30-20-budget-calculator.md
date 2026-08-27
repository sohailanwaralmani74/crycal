---
layout: tool
title: "50/30/20 Budget Calculator | Needs, Wants & Savings Budgeting"
description: "Allocate your income using the 50/30/20 rule. Enter your after-tax income and see how much to spend on Needs, Wants, and Savings."
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
    answer: "You can adjust the 50/30/20 percentages to fit your personal financial goals and situation."

---

# 50/30/20 Budget Calculator – Plan Your Monthly Income with Ease

Struggling to figure out where your money should go each month? Our **50/30/20 Budget Calculator** takes the guesswork out of budgeting. Just enter your monthly income, and we'll show you exactly how much to allocate toward Needs, Wants, and Savings—all in seconds.

<!-- more -->

## Why You'll Love This Budget Tool

The 50/30/20 rule is one of the simplest, most effective ways to take control of your money. Here's what our calculator does for you:

- **💰 See Your Perfect Split** — instantly know how much to spend in each category
- **📊 Visualize Your Budget** — clear charts that make your numbers easy to understand
- **🔧 Make It Your Own** — adjust the percentages to match your personal goals
- **🌍 Works in Any Currency** — pick your currency from the global selector
- **📜 Keep Track** — save, review, and export your past budgets anytime
- **🔒 Totally Private** — everything runs locally on your device, no data shared

---

## How the 50/30/20 Rule Breaks Down

| Category | Percentage | What It Includes |
| :--- | :--- | :--- |
| **Needs** | 50% | Rent, utilities, groceries, transportation, insurance, and minimum debt payments — the essentials you can't skip |
| **Wants** | 30% | Dining out, entertainment, travel, subscriptions, hobbies — the fun stuff that makes life enjoyable |
| **Savings / Debt** | 20% | Emergency funds, retirement contributions, investments, and extra debt payments beyond the minimum |

---

## How to Use This Calculator

Getting started is as easy as 1-2-3:

1. **Pick your currency** from the selector in the site header.
2. **Enter your monthly income** — and tell us whether it's net (after tax) or gross (before tax).
3. **Adjust the percentages** (optional) to match your goals, then watch your personalized budget appear instantly.

---

## Why This Tool Makes Budgeting Smarter

No more guesswork or mental math. This calculator gives you a clear, reliable breakdown so you can make confident decisions about your money.

### What Makes It Different

- **Crystal-Clear Clarity** — no confusing formulas, just straightforward numbers you can act on
- **Try Different Scenarios** — adjust the percentages and see how your budget shifts in real time
- **Your Data Stays Yours** — everything runs locally in your browser, never on our servers
- **Export & Share** — save your budget to CSV or Excel, or share a link with your partner or advisor

---

## Common Questions About the 50/30/20 Rule

### What exactly is the 50/30/20 rule?

Simply put: allocate 50% of your after-tax income to Needs, 30% to Wants, and 20% to Savings and Debt Repayment. It's a simple, proven way to keep your spending balanced.

### What counts as Needs?

Think essentials — rent or mortgage, utilities, groceries, transportation, insurance, and the minimum payments on your debts.

### What counts as Wants?

Everything that's nice to have but not essential — eating out, movies, travel, streaming subscriptions, and those little luxuries.

### What counts as Savings / Debt?

This is where you build your future — emergency savings, retirement accounts, investments, and any extra debt payments above the minimum.

### Can I change the percentages?

Absolutely. Everyone's situation is different — feel free to tweak the numbers to fit your goals, whether that means saving more or giving yourself a little extra spending room.
---