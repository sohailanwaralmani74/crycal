---
layout: tool
title: "Barista Fire Calculator | Calculation & Analysis"
description: "Find your Barista FIRE number. Enter your current savings, retirement goals, and expected part-time income to see when you can semi-retire."
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

---

# Barista FIRE Calculator – Semi-Retire Sooner Than You Think

What if you could ditch the 9-to-5 grind years—or even decades—earlier than traditional retirement? That's exactly what Barista FIRE makes possible. Our **Barista FIRE Calculator** shows you how much you need to save so you can trade full-time work for a flexible, part-time lifestyle—without running out of money.

<!-- more -->

## Why This Calculator Changes the Game

Barista FIRE is the sweet spot where you've saved enough that a part-time job can cover your remaining expenses. Our calculator helps you:

- 🏖️ **Find Your Barista FIRE Number** — know exactly how much you need to semi-retire
- 📊 **Compare Full FIRE vs Barista FIRE** — see how much time and money part-time work saves you
- 💰 **Plan Your Part-Time Income** — figure out how much you need to earn to make it work
- ⏱️ **Estimate Your Timeline** — discover when you can transition to semi-retirement
- 📈 **Visualize Your Progress** — watch your portfolio grow toward your target
- 🔒 **100% Private** — all calculations run locally in your browser

---

## What Exactly Is Barista FIRE?

Think of Barista FIRE as **semi-retirement**—the best of both worlds. You:

- **Step away from full-time work** earlier than traditional retirement
- **Work part-time** (think: a coffee shop, consulting, freelancing, or any flexible gig)
- **Let your investments** cover the rest of your living costs
- **Enjoy more freedom** without the stress of saving for full retirement

The beauty? Your savings target is much lower than traditional FIRE because you only need to cover the **gap** between your expenses and your part-time income.

---

## The Simple Math Behind Barista FIRE

### Step 1: Your Full FIRE Number (No Work at All)
**Full FIRE Number =** Annual Expenses ÷ Safe Withdrawal Rate

If you need $50,000 per year and use the 4% rule, your full FIRE number is **$1,250,000**.

### Step 2: Your Barista FIRE Number (With Part-Time Work)
**Barista FIRE Number =** (Annual Expenses – Part-Time Income) ÷ Safe Withdrawal Rate

**Here's a real example:**

| Variable | Value |
|----------|-------|
| Annual Expenses | $50,000 |
| Part-Time Income | $25,000 |
| Expenses Gap | $25,000 |
| Safe Withdrawal Rate | 4% |
| **Barista FIRE Number** | **$625,000** |

*That's half the savings target—$625,000 vs. $1,250,000!*

---

## Barista FIRE vs Other FIRE Approaches

| FIRE Type | Savings Target | Work Status | Best For |
|-----------|---------------|-------------|----------|
| **Full FIRE** | Expenses ÷ SWR | No work | Complete financial independence |
| **Barista FIRE** | (Expenses – Part-Time Income) ÷ SWR | Part-time | Those who enjoy some structure but want flexibility |
| **Coast FIRE** | FIRE Target ÷ (1 + Return)^Years | Any work (no more saving) | Those who want to stop saving entirely |
| **Lean FIRE** | Minimal Expenses ÷ SWR | No work | Minimalists who live on very little |
| **Fat FIRE** | High Expenses ÷ SWR | No work | Luxury retirement with plenty of cushion |

---

## Meet Sarah: Barista FIRE in Real Life

**Sarah is 32.** Here's her plan:

| Variable | Value |
|----------|-------|
| Annual Expenses | $55,000 |
| Part-Time Income | $30,000 |
| Expenses Gap | $25,000 |
| Safe Withdrawal Rate | 4% |
| Current Savings | $200,000 |
| Expected Return | 7% |
| **Barista FIRE Number** | **$625,000** |
| **Years to Barista FIRE** | **~16 years** |
| **Barista FIRE Age** | **48** |

*At 48, Sarah can semi-retire with $625,000 invested, earn $30,000/year from part-time work, and let her investments cover the remaining $25,000/year.*

---

## How Part-Time Income Accelerates Your Timeline

The more you earn from part-time work, the faster you reach Barista FIRE:

| Part-Time Income | Barista FIRE Number | Years to Barista FIRE |
|------------------|---------------------|-----------------------|
| $0 (Full FIRE) | $1,250,000 | ~30 years |
| $15,000 | $875,000 | ~23 years |
| **$25,000** | **$625,000** | **~17 years** |
| $35,000 | $375,000 | ~10 years |
| $45,000 | $125,000 | ~3 years |

*The takeaway? Even a modest part-time income slashes your savings target—and your timeline.*

---

## How to Use This Calculator

Getting your personalized Barista FIRE plan is quick and easy:

1. **Enter your current age** — where you are right now.
2. **Set your target full retirement age** — when you want to stop working entirely.
3. **Enter your current retirement savings** — what you've already saved.
4. **Enter your expected annual expenses in retirement** — what you'll need each year.
5. **Enter your expected part-time income** — how much you'll earn from your flexible gig.
6. **Set your safe withdrawal rate** — 4% is standard, but you can adjust it.
7. **Enter your expected annual return** — a realistic long-term rate (7% is common).
8. **View your results instantly** — see your Barista FIRE number, progress, and timeline.

---

## Who Is This Calculator For?

This Barista FIRE tool is perfect for:

- **Anyone dreaming of early retirement** — but worried about saving a million+
- **Savers** — who want to escape the 9-to-5 but still enjoy some work
- **Creative, flexible thinkers** — who want to design their own work-life balance
- **Anyone** — curious about the FIRE movement and its more accessible options

---

## Common Questions About Barista FIRE

### What is Barista FIRE in plain English?

It's semi-retirement. You leave full-time work early, pick up a part-time gig (like a barista, consultant, or freelancer) to cover some expenses, and let your investments handle the rest. It's more accessible than traditional FIRE because you need less saved.

### How is Barista FIRE different from Coast FIRE?

- **Coast FIRE** — you stop saving entirely and let compound interest do the work; you may still work full-time.
- **Barista FIRE** — you continue working part-time to cover a portion of your living expenses while your investments cover the rest.

### How is the Barista FIRE number calculated?

**Barista FIRE Number =** (Annual Expenses – Annual Part-Time Income) ÷ Safe Withdrawal Rate.

Simple math, life-changing results.

### What's a typical Barista FIRE number?

It completely depends on your expenses and part-time income. For example, if your annual expenses are $50,000 and you earn $25,000 from part-time work, your target is $625,000. If you earn $35,000, your target drops to $375,000.

### How many hours would I need to work in Barista FIRE?

That's up to you! If you earn $25,000 per year at $25/hour, you'd work about **20 hours per week**. Our calculator shows you the numbers based on your income and hourly rate.

### Is Barista FIRE realistic?

Absolutely—especially if you're flexible about where you live, what you do, and how much you spend. The key is covering that gap between your expenses and your part-time income. The smaller the gap, the sooner you're there.

---

> **☕ Quick Tip:** Barista FIRE isn't just about coffee shop jobs—it's about any flexible, part-time work you enjoy. Consulting, freelance writing, teaching, or turning a hobby into income all count. The point isn't the job title—it's the freedom to design your own life.
---