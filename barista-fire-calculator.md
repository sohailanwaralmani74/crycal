---
layout: tool
title: Barista FIRE Calculator – Semi-Retirement Planner
description: Use our free Barista FIRE Calculator to find your Barista FIRE number. Enter your current savings, retirement goals, and expected part-time income to see when you can semi-retire.
permalink: /barista-fire-calculator
tool_id: barista-fire-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: currentAge
    label: Current Age
    type: number
    default: 30
    step: 1
    min: 18
    max: 80

  - id: retirementAge
    label: Target Retirement Age (Full Retirement)
    type: number
    default: 65
    step: 1
    min: 30
    max: 90

  - id: currentSavings
    label: Current Retirement Savings
    type: number
    default: 50000
    step: 1000
    min: 0
    currency: true

  - id: annualExpenses
    label: Expected Annual Retirement Expenses
    type: number
    default: 50000
    step: 1000
    min: 0
    currency: true

  - id: partTimeIncome
    label: Expected Annual Part-Time Income (Barista FIRE)
    type: number
    default: 25000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 25000"

  - id: safeWithdrawalRate
    label: Safe Withdrawal Rate (%)
    type: number
    default: 4.0
    step: 0.1
    min: 1
    max: 10
    suffix: '%'

  - id: expectedReturn
    label: Expected Annual Return (%)
    type: number
    default: 7.0
    step: 0.1
    min: 1
    max: 15
    suffix: '%'

outputs:
  - id: fullFireNumber
    label: Full FIRE Number (No Part-Time Work)
  - id: baristaFireNumber
    label: Barista FIRE Number (With Part-Time Income)
  - id: baristaFireGap
    label: Savings Gap to Barista FIRE
  - id: baristaFireProgress
    label: Barista FIRE Progress (%)
  - id: baristaFireStatus
    label: Barista FIRE Status
  - id: yearsToBarista
    label: Years Until Barista FIRE
  - id: baristaAge
    label: Barista FIRE Age
  - id: hoursPerWeek
    label: Estimated Weekly Hours Needed

charts:
  tabs:
    - id: growth
      label: Portfolio Growth
    - id: breakdown
      label: Barista FIRE Progress

history_columns:
  - key: currentAge
    label: Current Age
    source: input
  - key: retirementAge
    label: Retirement Age
    source: input
  - key: currentSavings
    label: Current Savings
    source: input
  - key: annualExpenses
    label: Annual Expenses
    source: input
  - key: partTimeIncome
    label: Part-Time Income
    source: input
  - key: baristaFireNumber
    label: Barista FIRE Number
    source: output
  - key: baristaAge
    label: Barista FIRE Age
    source: output

js_file: assets/js/calculators/barista-fire-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Barista FIRE Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Barista FIRE number and find out when you can semi-retire with part-time work. Enter your savings, expenses, and expected part-time income."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Barista FIRE Number Calculation"
    - "Full FIRE vs Barista FIRE Comparison"
    - "Part-Time Income Analysis"
    - "Portfolio Growth Visualization"
    - "Weekly Hours Estimation"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: Barista FIRE Calculator

howto:
  name: "How to Use the Barista FIRE Calculator"
  description: "Follow these steps to calculate your Barista FIRE number and semi-retirement timeline."
  step:
    - name: "Enter your current age"
      text: "Enter your age today."
    - name: "Set your target full retirement age"
      text: "Enter the age you plan to fully retire and stop all work."
    - name: "Enter your current retirement savings"
      text: "Enter the total amount you currently have saved in retirement accounts."
    - name: "Enter your expected annual retirement expenses"
      text: "Estimate how much you'll need per year in retirement to live comfortably."
    - name: "Enter your expected part-time income"
      text: "Estimate how much you'll earn annually from part-time work during Barista FIRE."
    - name: "Set your safe withdrawal rate"
      text: "The 4% rule is standard, but you can adjust based on your risk tolerance."
    - name: "Enter your expected annual return"
      text: "Use a realistic long-term return rate (7% is a common historical average)."
    - view: "View your Barista FIRE number"
      text: "See how much you need to semi-retire with part-time work."

faq:
  - question: "What is Barista FIRE?"
    answer: "Barista FIRE is a variation of the FIRE movement where you semi-retire early and work a part-time job to cover a portion of your living expenses. Your investments cover the rest, allowing you to enjoy a flexible lifestyle with less financial stress."
  - question: "How is Barista FIRE different from Coast FIRE?"
    answer: "Coast FIRE means you stop saving entirely and let compound interest work. Barista FIRE means you continue working part-time to cover some expenses while your investments grow. Barista FIRE is often more practical for people who want to ease into retirement gradually."
  - question: "How is Barista FIRE calculated?"
    answer: "Barista FIRE Number = (Annual Expenses – Annual Part-Time Income) ÷ Safe Withdrawal Rate. This calculates how much you need invested to cover the gap between your expenses and part-time income."
  - question: "What is a good Barista FIRE number?"
    answer: "Your Barista FIRE number depends on your expenses and part-time income. For example, if your annual expenses are $50,000 and you earn $25,000 from part-time work, your Barista FIRE number is $625,000 (using the 4% rule)."
  - question: "How many hours will I need to work in Barista FIRE?"
    answer: "The calculator estimates your hours based on your part-time income and hourly rate. If you earn $25,000 per year at $25/hour, you'd work about 20 hours per week."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Barista FIRE Calculator – Semi-Retirement Planner

Calculate your **Barista FIRE number** with our free Barista FIRE Calculator. Enter your current savings, retirement expenses, and expected part-time income to find out when you can semi-retire and enjoy a flexible lifestyle — all without your data leaving your browser.

<!-- more -->

## Why Use This Barista FIRE Calculator

Barista FIRE is the sweet spot where you've saved enough that a part-time job can cover your remaining expenses. Our **Barista FIRE Calculator** helps you:

- 🏖️ **Find Your Barista FIRE Number** — know exactly how much you need to semi-retire.
- 📊 **Compare Full FIRE vs Barista FIRE** — see the difference part-time work makes.
- 💰 **Plan Your Part-Time Income** — understand how much you need to earn.
- ⏱️ **Estimate Your Timeline** — discover when you can transition to semi-retirement.
- 📈 **Visualize Growth** — watch your portfolio grow to your Barista FIRE target.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is Barista FIRE?

Barista FIRE is a flexible approach to early retirement where you:

- **Semi-retire early** (often in your 30s, 40s, or 50s)
- **Work part-time** (like a barista, consultant, or freelancer) to cover some expenses
- **Let your investments** cover the rest of your living costs
- **Enjoy more freedom** without the pressure of full-time work

This approach is more accessible than traditional FIRE because your savings target is lower — you only need to cover the **gap** between your expenses and your part-time income.

---

## The Barista FIRE Formula

The Barista FIRE formula calculates how much you need invested so your portfolio covers the gap between your expenses and part-time income.

**Step 1: Calculate Your Full FIRE Number (No Part-Time Work)**

**Full FIRE Number = Annual Expenses ÷ Safe Withdrawal Rate**

Using the 4% rule: if you need $50,000 per year, your full FIRE number is $1,250,000.

**Step 2: Calculate Your Barista FIRE Number (With Part-Time Work)**

**Barista FIRE Number = (Annual Expenses – Annual Part-Time Income) ÷ Safe Withdrawal Rate**

**Example:**

| Variable | Value |
|----------|-------|
| Annual Expenses | $50,000 |
| Part-Time Income | $25,000 |
| Expenses Gap | $25,000 |
| Safe Withdrawal Rate | 4% |
| **Barista FIRE Number** | **$25,000 ÷ 0.04 = $625,000** |

You need $625,000 invested, not $1,250,000 — that's **half the savings target**!

---

## Barista FIRE vs Other FIRE Approaches

| FIRE Type | Savings Target | Work Status | Ideal For |
|-----------|---------------|-------------|-----------|
| **Full FIRE** | Expenses ÷ SWR | No work | Those who want complete freedom |
| **Barista FIRE** | (Expenses – Part-Time Income) ÷ SWR | Part-time work | Those who enjoy some work but want flexibility |
| **Coast FIRE** | FIRE Target ÷ (1 + Return)^Years | Any work (no more saving) | Those who want to stop saving entirely |
| **Lean FIRE** | Minimal Expenses ÷ SWR | No work | Those who can live on very little |
| **Fat FIRE** | High Expenses ÷ SWR | No work | Those who want luxury retirement |

---

## How to Use This Barista FIRE Calculator

1. **Enter your current age** — your age today.
2. **Set your target full retirement age** — when you plan to fully retire.
3. **Enter your current retirement savings** — how much you have saved today.
4. **Enter your expected annual retirement expenses** — how much you'll need per year.
5. **Enter your expected part-time income** — how much you'll earn from part-time work.
6. **Set your safe withdrawal rate** — the 4% rule is standard (adjustable).
7. **Enter your expected annual return** — use a realistic long-term rate (7% is common).
8. **View your results** — see your Barista FIRE number, progress, and timeline.

---

## Example: Barista FIRE in Action

**Meet Sarah (Age 32):**

| Variable | Value |
|----------|-------|
| Annual Expenses | $55,000 |
| Part-Time Income (Barista) | $30,000 |
| Expenses Gap | $25,000 |
| Safe Withdrawal Rate | 4% |
| Current Savings | $200,000 |
| Expected Return | 7% |
| **Barista FIRE Number** | **$625,000** |
| **Years to Barista FIRE** | **~16 years** |
| **Barista FIRE Age** | **48** |

Sarah can semi-retire at age 48 with $625,000 invested, earning $30,000/year from part-time work, and letting her investments cover the remaining $25,000/year.

---

## How Part-Time Income Affects Your Timeline

| Part-Time Income | Barista FIRE Number | Years to Barista FIRE |
|------------------|---------------------|-----------------------|
| $0 (Full FIRE) | $1,250,000 | ~30 years |
| $15,000 | $875,000 | ~23 years |
| $25,000 | $625,000 | ~17 years |
| $35,000 | $375,000 | ~10 years |
| $45,000 | $125,000 | ~3 years |

Higher part-time income = lower savings target = faster Barista FIRE.

---

## Frequently Asked Questions

### What is Barista FIRE?
Barista FIRE is a variation of the FIRE movement where you semi-retire early and work a part-time job to cover a portion of your living expenses. Your investments cover the rest.

### How is Barista FIRE different from Coast FIRE?
Coast FIRE means you stop saving entirely and let compound interest work. Barista FIRE means you continue working part-time to cover some expenses while your investments grow.

### How is Barista FIRE calculated?
Barista FIRE Number = (Annual Expenses – Annual Part-Time Income) ÷ Safe Withdrawal Rate.

### What is a good Barista FIRE number?
Your Barista FIRE number depends on your expenses and part-time income. For example, if your annual expenses are $50,000 and you earn $25,000 from part-time work, your Barista FIRE number is $625,000.

### How many hours will I need to work in Barista FIRE?
The calculator estimates your hours based on your part-time income and hourly rate. If you earn $25,000 per year at $25/hour, you'd work about 20 hours per week.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.