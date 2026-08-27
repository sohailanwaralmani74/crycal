---
layout: tool
title: "Coast Fire Calculator | Calculation & Analysis"
description: "Enter your current savings, retirement goals, and expected returns to see when you can stop contributing and Coast FIRE number to retirement."
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

---

# Coast FIRE Calculator – Reach the Point Where Your Money Does All the Work

Imagine the day you stop saving for retirement—because you've already saved enough. That's Coast FIRE. Our **Coast FIRE Calculator** helps you find that number and see how close you are to financial freedom. No more aggressive saving—just let compound interest carry you the rest of the way.

<!-- more -->

## Why This Calculator Changes Everything

Coast FIRE is the sweet spot where your existing investments will grow to fully fund your retirement—without you adding another dollar. Our **Coast FIRE Calculator** helps you:

- 💰 **Find Your Coast FIRE Number** — know exactly how much you need today to coast to retirement
- 📈 **Track Your Progress** — see how close you are to financial independence
- 🏖️ **Plan Your Freedom** — discover when you can stop aggressive saving and start living more freely
- 📊 **Visualize Your Growth** — watch your portfolio grow to your retirement target over time
- 🔒 **100% Private** — all calculations run locally in your browser

---

## What Is Coast FIRE? (The Short Version)

**Coast FIRE** means you've saved and invested enough that your existing portfolio—left alone to grow at a normal market rate—will reach your retirement number on its own, without any additional contributions.

Think of it as hitting the savings finish line early. Your money does the rest of the work through the magic of compound interest.

**Once you hit your Coast FIRE number:**

- You can stop saving for retirement entirely
- You can take lower-paying but more fulfilling jobs
- You can work fewer hours or pursue passion projects
- You're no longer stressed about hitting a specific savings target each month

You're not necessarily retired—you're just **coasting**.

---

## The Simple Math Behind Coast FIRE

### Step 1: Your Full FIRE Number
**FIRE Number =** Annual Retirement Spending ÷ Safe Withdrawal Rate

If you need $50,000 per year and use the 4% rule, your full FIRE number is **$1,250,000**.

### Step 2: Your Coast FIRE Number
**Coast FIRE Number =** FIRE Number ÷ (1 + Expected Return)^Years to Retirement

**Here's a real example:**

| Variable | Value |
|----------|-------|
| Annual Retirement Spending | $50,000 |
| Safe Withdrawal Rate | 4% |
| FIRE Number | $1,250,000 |
| Current Age | 30 |
| Retirement Age | 65 |
| Years to Retirement | 35 |
| Expected Return | 7% |
| **Coast FIRE Number** | **$1,250,000 ÷ (1.07)^35 = $117,000** |

*If you have $117,000 invested at age 30, you can stop saving and still have $1.25 million by age 65. That's the power of compound interest.*

---

## Coast FIRE in Real Life: See the Scenarios

| Scenario | Age | Current Savings | Return | Retirement Spending | Coast FIRE Number | Status |
|----------|-----|-----------------|--------|---------------------|-------------------|--------|
| Early Starter | 25 | $50,000 | 7% | $40,000 | $82,000 | Not yet |
| On Track | 35 | $200,000 | 7% | $60,000 | $221,000 | Approaching |
| **Coast Achieved** | **40** | **$300,000** | **7%** | **$50,000** | **$310,000** | **✅ You're there!** |
| Coast Exceeded | 45 | $500,000 | 7% | $50,000 | $221,000 | ✅ Well ahead |

---

## How to Use This Calculator

Getting your Coast FIRE number is quick and straightforward:

1. **Enter your current age** — how old you are right now.
2. **Set your target retirement age** — when you want to stop working entirely.
3. **Enter your current retirement savings** — what you've saved so far.
4. **Enter your expected annual retirement spending** — how much you'll need each year in retirement.
5. **Set your safe withdrawal rate** — 4% is the standard, but you can adjust it.
6. **Enter your expected annual return** — a realistic long-term rate (7% is common for stock-heavy portfolios).
7. **View your results instantly** — see your Coast FIRE number, your progress, and your timeline.

The tool updates in real time—no "Calculate" button required.

---

## Who Benefits From This Calculator?

- **Young professionals** — who want to know if they're on track to coast
- **Mid-career savers** — looking to reduce stress and enjoy life more
- **Anyone** — dreaming of financial independence
- **Career-changers** — wanting to take a lower-paying, more fulfilling job
- **Curious savers** — wondering "how much is enough to just let it grow?"

---

## Common Questions About Coast FIRE

### What is Coast FIRE in plain English?

It's the point where your existing investments will grow to fully fund your retirement—without you adding another dollar. You can stop saving and let compound interest do the rest. You're not retired yet, but you're no longer stressed about saving.

### How is Coast FIRE calculated?

**Coast FIRE Number =** FIRE Target ÷ (1 + Return Rate)^Years to Retirement

This tells you how much you need invested today to reach your retirement goal through compound growth alone.

### What's the FIRE number?

It's the total amount you need to retire. You calculate it as: **Annual Retirement Spending ÷ Safe Withdrawal Rate**. Using the 4% rule, if you need $50,000 per year, your FIRE number is $1,250,000.

### What's a good Coast FIRE progress percentage?

- **100%** — you've reached Coast FIRE
- **Below 100%** — you still need to save more
- **Above 100%** — your portfolio is already on track to exceed your retirement goal

### Is the 4% safe withdrawal rate still valid?

The 4% rule is a widely used guideline based on historical market data. Many experts suggest 3.5% to 4% for longer retirements. You can adjust this rate in the calculator to match your risk tolerance.

### What if the market doesn't perform as expected?

That's a valid concern. The calculator uses a fixed return assumption, but real markets fluctuate. Most Coast FIRE planners use a conservative return estimate (like 6-7%) and monitor their progress over time. If markets underperform, you can always choose to save a little more.

---

> **🏖️ Quick Tip:** Coast FIRE isn't about quitting work entirely—it's about having the **freedom** to choose work you love without worrying about saving for retirement. Once you hit your Coast FIRE number, you can relax, work less, or pursue passion projects. Your future is already taken care of.
---