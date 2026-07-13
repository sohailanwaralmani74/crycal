---
layout: tool
title: Coast FIRE Calculator – When Can You Stop Saving for Retirement?
description: Use our free Coast FIRE Calculator to find your Coast FIRE number. Enter your current savings, retirement goals, and expected returns to see when you can stop contributing and coast to retirement.
permalink: /coast-fire-calculator
tool_id: coast-fire-calculator
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
    label: Target Retirement Age
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

  - id: annualSpending
    label: Expected Annual Retirement Spending
    type: number
    default: 50000
    step: 1000
    min: 0
    currency: true

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
  - id: fireTarget
    label: Your FIRE Number (Retirement Target)
  - id: coastFireNumber
    label: Your Coast FIRE Number
  - id: coastFireProgress
    label: Coast FIRE Progress (%)
  - id: coastFireStatus
    label: Coast FIRE Status
  - id: yearsToCoast
    label: Years Until Coast FIRE
  - id: coastAge
    label: Coast FIRE Age

charts:
  tabs:
    - id: growth
      label: Portfolio Growth
    - id: breakdown
      label: Coast FIRE Progress

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
  - key: annualSpending
    label: Annual Spending
    source: input
  - key: coastFireNumber
    label: Coast FIRE Number
    source: output
  - key: coastAge
    label: Coast FIRE Age
    source: output

js_file: assets/js/calculators/coast-fire-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Coast FIRE Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Coast FIRE number and find out when you can stop saving for retirement. Enter your current savings, retirement goals, and expected returns."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Coast FIRE Number Calculation"
    - "Retirement Goal Projection"
    - "Portfolio Growth Visualization"
    - "Coast FIRE Progress Tracker"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: Coast FIRE Calculator

howto:
  name: "How to Use the Coast FIRE Calculator"
  description: "Follow these steps to calculate your Coast FIRE number and retirement timeline."
  step:
    - name: "Enter your current age"
      text: "Enter your age today."
    - name: "Set your target retirement age"
      text: "Enter the age you plan to retire and start withdrawing from your portfolio."
    - name: "Enter your current retirement savings"
      text: "Enter the total amount you currently have saved in retirement accounts."
    - name: "Enter your expected annual retirement spending"
      text: "Estimate how much you'll need per year in retirement to live comfortably."
    - name: "Set your safe withdrawal rate"
      text: "The 4% rule is standard, but you can adjust based on your risk tolerance."
    - name: "Enter your expected annual return"
      text: "Use a realistic long-term return rate (7% is a common historical average)."
    - name: "View your Coast FIRE number"
      text: "See how much you need today to coast to retirement without additional contributions."

faq:
  - question: "What is Coast FIRE?"
    answer: "Coast FIRE (Financial Independence, Retire Early) is the point where your existing investments will grow to fully fund your retirement without any additional contributions. You can stop saving and let compound interest do the rest."
  - question: "How is Coast FIRE calculated?"
    answer: "The Coast FIRE formula is: Coast FIRE Number = FIRE Target / (1 + Return Rate)^Years to Retirement. This calculates how much you need invested today to reach your retirement goal through compound growth alone."
  - question: "What is the FIRE number?"
    answer: "Your FIRE number is the total amount you need to retire. It's typically calculated as: Annual Retirement Spending ÷ Safe Withdrawal Rate. Using the 4% rule, if you need $50,000 per year, your FIRE number is $1,250,000."
  - question: "What is a good Coast FIRE progress percentage?"
    answer: "100% means you've reached Coast FIRE. Below 100%, you still need to save more. Above 100%, your portfolio is already on track to exceed your retirement goal."
  - question: "Is the 4% safe withdrawal rate still valid?"
    answer: "The 4% rule is a guideline based on historical market data. Many experts suggest 3.5-4% for longer retirements. You can adjust this rate in the calculator to match your risk tolerance."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Coast FIRE Calculator – When Can You Stop Saving for Retirement?

Calculate your **Coast FIRE number** with our free Coast FIRE Calculator. Enter your current savings, retirement goals, and expected returns to see when you can stop contributing and let compound interest carry you to retirement — all without your data leaving your browser.

<!-- more -->

## Why Use This Coast FIRE Calculator

Coast FIRE is the financial sweet spot where you've saved enough that your investments will grow to fully fund your retirement — without adding another dollar. Our **Coast FIRE Calculator** helps you:

- 💰 **Find Your Coast FIRE Number** — know exactly how much you need today to coast to retirement.
- 📈 **Track Your Progress** — see how close you are to financial independence.
- 🏖️ **Plan Your Freedom** — discover when you can stop aggressive saving and start living more freely.
- 📊 **Visualize Growth** — watch your portfolio grow to your retirement target.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is Coast FIRE?

Coast FIRE is a variant of the FIRE (Financial Independence, Retire Early) movement. It means you've saved and invested enough that your existing portfolio — left alone to grow at a normal market rate — will reach your retirement number on its own, without any additional contributions.[reference:0][reference:1]

Think of it as hitting the savings finish line early. Your money does the rest of the work through compound interest.[reference:2]

Once you hit your Coast FIRE number:
- You can stop saving for retirement entirely[reference:3]
- You can take lower-paying but more fulfilling jobs[reference:4]
- You can work fewer hours or pursue passion projects[reference:5]
- You're no longer stressed about hitting a specific savings target each month[reference:6]

---

## The Coast FIRE Formula

The Coast FIRE formula calculates how much you need invested **today** so compound growth alone covers your retirement goal.[reference:7][reference:8]

**Step 1: Calculate Your FIRE Number**

**FIRE Number = Annual Retirement Spending ÷ Safe Withdrawal Rate**

Using the 4% rule: if you need $50,000 per year in retirement, your FIRE number is $1,250,000.[reference:9]

**Step 2: Calculate Your Coast FIRE Number**

**Coast FIRE Number = FIRE Number ÷ (1 + Expected Return)^Years to Retirement**[reference:10][reference:11]

**Example:**

| Variable | Value |
|----------|-------|
| Annual Retirement Spending              | $50,000 |
| Safe Withdrawal Rate                    | 4% |
| FIRE Number                             | $1,250,000 |
| Current Age                             | 30 |
| Retirement Age                          | 65 |
| Years to Retirement                     | 35 |
| Expected Return                         | 7% |
| **Coast FIRE Number**                   | **$1,250,000 ÷ (1.07)^35 = $117,000** |

If you have $117,000 invested at age 30, you can stop saving and still have $1.25 million by age 65.[reference:12]

---

## How to Use This Coast FIRE Calculator

1. **Enter your current age** — your age today.
2. **Set your target retirement age** — when you plan to retire.
3. **Enter your current retirement savings** — how much you have saved today.
4. **Enter your expected annual retirement spending** — how much you'll need per year in retirement.
5. **Set your safe withdrawal rate** — the 4% rule is standard (adjustable).
6. **Enter your expected annual return** — use a realistic long-term rate (7% is common).
7. **View your results** — see your Coast FIRE number, progress, and timeline.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## Coast FIRE Examples

| Scenario | Age | Savings | Return | Spending | Coast FIRE Number | Status |
|----------|-----|---------|--------|----------|-------------------|--------|
| Early Starter | 25 | $50,000 | 7% | $40,000 | $82,000 | Not yet |
| On Track | 35 | $200,000 | 7% | $60,000 | $221,000 | Approaching |
| Coast Achieved | 40 | $300,000 | 7% | $50,000 | $310,000 | ✅ Achieved! |
| Coast Exceeded | 45 | $500,000 | 7% | $50,000 | $221,000 | ✅ Exceeded |

---

## Frequently Asked Questions

### What is Coast FIRE?
Coast FIRE is the point where your existing investments will grow to fully fund your retirement without any additional contributions. You can stop saving and let compound interest do the rest.[reference:13]

### How is Coast FIRE calculated?
The Coast FIRE formula is: Coast FIRE Number = FIRE Target / (1 + Return Rate)^Years to Retirement. This calculates how much you need invested today to reach your retirement goal through compound growth alone.[reference:14]

### What is the FIRE number?
Your FIRE number is the total amount you need to retire. It's calculated as: Annual Retirement Spending ÷ Safe Withdrawal Rate. Using the 4% rule, if you need $50,000 per year, your FIRE number is $1,250,000.[reference:15]

### What is a good Coast FIRE progress percentage?
100% means you've reached Coast FIRE. Below 100%, you still need to save more. Above 100%, your portfolio is already on track to exceed your retirement goal.[reference:16]

### Is the 4% safe withdrawal rate still valid?
The 4% rule is a guideline based on historical market data. Many experts suggest 3.5-4% for longer retirements. You can adjust this rate in the calculator to match your risk tolerance.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.