---
layout: tool
title: "Fire | Interactive Online Tool"
description: "Calculate your Financial Independence (FI) number and track your progress toward early retirement with our FIRE calculator."
permalink: /fire-calculator
tool_id: fire
category: retirement
hide_sidebar: true

inputs:
  - id: currentAge
    label: Your Current Age
    type: number
    default: 25
    step: 1
    min: 18
    max: 70

  - id: annualExpenses
    label: Annual Expenses
    type: number
    default: 40000
    step: 1000
    min: 0
    currency: true
    placeholder: "Your yearly spending"

  - id: currentSavings
    label: Savings / Investments
    type: number
    default: 25000
    step: 1000
    min: 0
    currency: true

  - id: annualIncome
    label: Annual Income (after tax)
    type: number
    default: 70000
    step: 1000
    min: 0
    currency: true
    placeholder: "Your take-home pay"

  - id: savingsRate
    label: Savings Rate (%)
    type: number
    default: 0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Optional — calculated automatically"

  - id: annualReturn
    label: Expected Annual Return
    type: number
    default: 7.0
    step: 0.1
    min: 0
    suffix: '%'

  - id: inflationRate
    label: Inflation Rate (%)
    type: number
    default: 3.0
    step: 0.1
    min: 0
    suffix: '%'

  - id: safeWithdrawalRate
    label: Safe Withdrawal Rate (%)
    type: number
    default: 4.0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Global benchmark: 3-4%"

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
  - id: fiNumber
    label: Your FI Number
  - id: timeToFI
    label: Years to Reach FI
  - id: ageAtFI
    label: Age at Financial Independence
  - id: savingsRateCalculated
    label: Your Savings Rate (%)

  - id: progressToFI
    label: Progress to FI (%)

  - id: netWorth
    label: Current Net Worth

charts:
  tabs:
    - id: growth
      label: Growth
    - id: milestone
      label: Milestone
    - id: breakdown
      label: Breakdown

history_columns:
  - key: currentAge
    label: Age
    source: input
  - key: annualExpenses
    label: Expenses
    source: input
  - key: currentSavings
    label: Savings
    source: input
  - key: annualIncome
    label: Income
    source: input
  - key: savingsRate
    label: Savings Rate (%)
    source: input
  - key: annualReturn
    label: Return (%)
    source: input
  - key: fiNumber
    label: FI Number
    source: output
  - key: timeToFI
    label: Years to FI
    source: output
  - key: ageAtFI
    label: Age at FI
    source: output

js_file: assets/js/calculators/fire.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "FIRE Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Financial Independence (FI) number and track your progress toward early retirement with our FIRE calculator. Plan your FIRE journey today."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "FI Number Calculation — see exactly how much you need to retire"
    - "Time to FI — know exactly when you'll reach financial independence"
    - "Savings Rate Tracker — see your savings rate and its impact"
    - "Progress Tracker — see how close you are to your FI goal"
    - "Visual Growth Charts — see your journey to FI"
    - "Milestone Tracking — watch your progress over time"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: FIRE Calculator

howto:
  name: "How to Use the FIRE Calculator"
  description: "Follow these steps to plan your financial independence journey."
  step:
    - name: "Enter your current age"
      text: "Enter your current age."
    - name: "Enter your annual expenses"
      text: "Enter how much you spend each year."
    - name: "Enter your current savings"
      text: "Enter your current savings and investment balance."
    - name: "Enter your annual income (after tax)"
      text: "Enter your take-home pay each year."
    - name: "Enter your savings rate (optional)"
      text: "Enter your savings rate, or leave at 0 to calculate automatically."
    - name: "Enter your expected annual return"
      text: "Enter your expected average annual return."
    - name: "Enter your safe withdrawal rate"
      text: "Enter the safe withdrawal rate you plan to use in retirement."
    - name: "View your results"
      text: "See your FI Number, time to FI, age at FI, and progress."

faq:
  - question: "What is the FIRE movement?"
    answer: "FIRE stands for Financial Independence, Retire Early. It's a movement focused on achieving financial independence through aggressive saving and investing, allowing you to retire much earlier than the traditional retirement age."
  - question: "How is my FI Number calculated?"
    answer: "Your FI Number is calculated as: Annual Expenses ÷ Safe Withdrawal Rate. For example, if your annual expenses are $40,000 and your safe withdrawal rate is 4%, your FI Number is $1,000,000."
  - question: "What is a safe withdrawal rate?"
    answer: "A safe withdrawal rate is the percentage of your portfolio you can withdraw each year without running out of money. The traditional 4% rule is based on US data, but many FIRE enthusiasts use 3-4% depending on their risk tolerance and time horizon."
  - question: "How does my savings rate affect my FIRE journey?"
    answer: "Your savings rate is the single most important factor in FIRE. A higher savings rate means you're saving more and spending less, which accelerates your path to financial independence dramatically."
  - question: "What's the difference between leanFIRE, regular FIRE, and fatFIRE?"
    answer: "LeanFIRE involves retiring with a bare-minimum lifestyle (lower expenses). Regular FIRE is the standard approach with moderate expenses. FatFIRE involves retiring with a high-expense lifestyle, requiring a much larger FI Number."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Fire Calculator

Use this FIRE calculator to calculate your Financial Independence (FI) number and track your progress toward early retirement. Enter your annual expenses, current savings, income, expected return, and safe withdrawal rate — the tool shows your FI Number, time to reach FI, age at FI, and your progress percentage. Whether you're pursuing leanFIRE, regular FIRE, or fatFIRE, this financial independence calculator helps you plan your journey.

<!-- more -->

## Why Use This Financial Independence Calculator

The FIRE (Financial Independence, Retire Early) movement is about achieving freedom from the 9-to-5. This FIRE planning calculator helps you:

- **💰 Find Your FI Number** — know exactly how much you need to retire.
- **📈 Track Your Progress** — see how close you are to financial independence.
- **⏱️ Plan Your Timeline** — know when you'll achieve FI.
- **🔁 Optimize Your Savings** — see how your savings rate impacts your journey.
- **📜 Track Your History** — save, review, and export past calculations to CSV or Excel.
- **🔒 100% Private** — all calculations run locally; your data never leaves your browser.

---

## FIRE Formula Used by This Tool

**FI Number = Annual Expenses ÷ Safe Withdrawal Rate**

For example:

- Annual Expenses: $40,000
- Safe Withdrawal Rate: 4%
- FI Number: $40,000 ÷ 0.04 = **$1,000,000**

**Time to FI** is calculated by simulating your investment growth with monthly contributions until you reach your FI Number.

**Savings Rate** is calculated as: **(Annual Income − Annual Expenses) ÷ Annual Income × 100**

---

## How to Use This FIRE Planner

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **current age**.
3.  Enter your **annual expenses** (how much you spend per year).
4.  Enter your **current savings** (your existing investment/savings balance).
5.  Enter your **annual income** (after tax — your take-home pay).
6.  Enter your **savings rate** (optional — leave at 0 to auto-calculate).
7.  Enter your **expected annual return**.
8.  Enter your **safe withdrawal rate** (e.g., 4 for 4%).
9.  The tool updates instantly — see your FI Number, time to FI, age at FI, savings rate, and progress.

---

## Frequently Asked Questions

### What is the FIRE movement?
FIRE stands for Financial Independence, Retire Early. It's a movement focused on achieving financial independence through aggressive saving and investing, allowing you to retire much earlier than the traditional retirement age.

### How is my FI Number calculated?
Your FI Number is calculated as: Annual Expenses ÷ Safe Withdrawal Rate. For example, if your annual expenses are $40,000 and your safe withdrawal rate is 4%, your FI Number is $1,000,000.

### What is a safe withdrawal rate?
A safe withdrawal rate is the percentage of your portfolio you can withdraw each year without running out of money. The traditional 4% rule is based on US data, but many FIRE enthusiasts use 3-4% depending on their risk tolerance and time horizon.

### How does my savings rate affect my FIRE journey?
Your savings rate is the single most important factor in FIRE. A higher savings rate means you're saving more and spending less, which accelerates your path to financial independence dramatically.

### What's the difference between leanFIRE, regular FIRE, and fatFIRE?
LeanFIRE involves retiring with a bare-minimum lifestyle (lower expenses). Regular FIRE is the standard approach with moderate expenses. FatFIRE involves retiring with a high-expense lifestyle, requiring a much larger FI Number.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

