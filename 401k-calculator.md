---
layout: tool
title: "401k Calculator | Retirement Savings & Employer Match"
description: "Estimate your 401k retirement savings with our free 401k calculator. Plan your contributions, employer match, and see your projected growth."
permalink: /401k-calculator/
tool_id: 401k
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
    label: Expected Retirement Age
    type: number
    default: 65
    step: 1
    min: 30
    max: 90

  - id: currentBalance
    label: Current 401k Balance
    type: number
    default: 25000
    step: 1000
    min: 0
    currency: true

  - id: annualSalary
    label: Annual Salary
    type: number
    default: 75000
    step: 1000
    min: 0
    currency: true

  - id: employeeContribution
    label: Employee Contribution
    type: number
    default: 6.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'

  - id: employerMatch
    label: Employer Match
    type: number
    default: 3.0
    step: 0.5
    min: 0
    max: 100
    suffix: '%'

  - id: annualReturn
    label: Expected Annual Return
    type: number
    default: 7.0
    step: 0.1
    min: 0
    suffix: '%'

  - id: feeRate
    label: Annual Fee Rate
    type: number
    default: 0.5
    step: 0.05
    min: 0
    suffix: '%'
    placeholder: "Fund management fees"

  - id: inflationRate
    label: Inflation Rate
    type: number
    default: 3.0
    step: 0.1
    min: 0
    suffix: '%'

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
  - id: totalContributions
    label: Total Contributions
  - id: totalEmployerMatch
    label: Total Employer Match
  - id: totalReturns
    label: Total Investment Returns
  - id: finalBalance
    label: Final 401k Balance
  - id: inflationAdjusted
    label: Inflation-Adjusted Value

charts:
  tabs:
    - id: growth
      label: Growth
    - id: breakdown
      label: Breakdown
    - id: contributions
      label: Contributions

history_columns:
  - key: currentAge
    label: Current Age
    source: input
  - key: retirementAge
    label: Retirement Age
    source: input
  - key: currentBalance
    label: Current Balance
    source: input
  - key: annualSalary
    label: Salary
    source: input
  - key: employeeContribution
    label: Employee %
    source: input
  - key: employerMatch
    label: Match %
    source: input
  - key: annualReturn
    label: Return (%)
    source: input
  - key: finalBalance
    label: Final Balance
    source: output

js_file: assets/js/calculators/401k.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "401k Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate your 401k retirement savings with our 401k calculator. Plan your contributions, employer match, and see your projected growth."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Employer Match Modeling — see the full power of your company match"
    - "Fee Impact Analysis — see how fees reduce your returns"
    - "Inflation Adjustment — see your purchasing power in today's dollars"
    - "Visual Growth Charts — track your 401k balance over time"
    - "Breakdown of Contributions vs Match vs Returns"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: 401k Calculator

howto:
  name: "How to Use the 401k Calculator"
  description: "Follow these steps to estimate your 401k retirement savings."
  step:
    - name: "Enter your current age"
      text: "Enter your current age."
    - name: "Set your expected retirement age"
      text: "Enter the age you plan to retire."
    - name: "Enter your current 401k balance"
      text: "Enter your current 401k account balance."
    - name: "Enter your annual salary"
      text: "Enter your gross annual salary."
    - name: "Set your employee contribution percentage"
      text: "Enter the percentage of your salary you contribute to your 401k."
    - name: "Enter your employer match percentage"
      text: "Enter the percentage of your salary your employer matches."
    - name: "Enter your expected annual return"
      text: "Enter your expected average annual return rate."
    - name: "Enter the annual fee rate"
      text: "Enter the expense ratio or management fee percentage."
    - name: "View your results"
      text: "See your final 401k balance, total contributions, employer match, and inflation-adjusted value."

faq:
  - question: "What is a 401k calculator?"
    answer: "A 401k calculator is a retirement planning tool that estimates how much your 401k account will grow over time based on your contributions, employer match, and investment returns."
  - question: "How does the 401k calculator work?"
    answer: "The 401k calculator projects your retirement balance using your current age, salary, contribution rates, expected returns, and fees. It also provides a detailed breakdown of your personal contributions versus employer matches and investment earnings."
  - question: "What is the 401k contribution limit?"
    answer: "For 2024, the base employee 401k contribution limit is $23,000, rising to $30,500 for those aged 50 and older. The total limit for combined employee and employer contributions is $69,000, or $76,500 for those 50 and older."
  - question: "What is a good 401k match?"
    answer: "A strong employer match typically covers 50% or 100% of your contributions up to 3% to 6% of your salary. You can adjust the fixed match percentage in the calculator to reflect your company's specific policy."
  - question: "How do fees impact my 401k growth?"
    answer: "Even small management fees of 0.5% to 1% can significantly reduce your total retirement savings over decades of investing. The calculator automatically subtracts annual fees from your balance to show their exact long-term impact."

---

# 401k Calculator – See How Your Retirement Savings Can Grow

Curious what your 401k could look like by the time you retire? Our **401k Calculator** gives you a clear, personalized projection. Just plug in a few details—your age, salary, contributions, employer match, and expected returns—and we'll show you your future balance, total contributions, employer match, and even the inflation-adjusted value.

<!-- more -->

## Why You'll Love This 401k Planner

Your 401(k) is one of the biggest building blocks of your retirement. This tool helps you:

- **📈 Watch Compounding in Action** — see your money multiply over time
- **💼 Maximize Your Employer Match** — understand exactly what your company's contribution is worth
- **📉 Spot the Impact of Fees** — see how even small expense ratios can affect your final balance
- **💰 Fine-Tune Your Savings** — adjust your contribution percentage to hit your retirement goals
- **📜 Keep a Record** — save and export your projections to CSV or Excel

This calculator is perfect for:

- **Employees** wondering if they're on track for retirement
- **Job changers** deciding whether to roll over or leave their 401k
- **Anyone** who wants a clear, realistic picture of their retirement future

---

## The Math Behind the Tool (Made Simple)

We use the standard compound interest formula, adding in your contributions (yours plus your employer's) each year:

**Future Value** = Your starting balance grows at your net return rate, plus every annual contribution grows over time

Here's what goes into it:

- **Annual Contribution** = What you put in + What your employer matches
- **Employee Contribution** = Your salary × (your contribution percentage)
- **Employer Match** = Your salary × (employer match percentage)
- **Net Return** = Expected return rate − Annual fee rate
- **Years** = Your retirement age − Your current age

We also adjust your final balance for inflation so you can see what it's really worth in today's dollars.

---

## How to Use This Calculator

Getting your retirement projection is quick and easy:

1. **Pick your currency** from the selector in the site header.
2. **Enter your current age** and your **expected retirement age**.
3. **Add your current 401k balance** and **annual salary**.
4. **Set your contribution percentage** (e.g., 6 for 6% of your salary).
5. **Enter your employer match percentage** (e.g., 3 for 3%).
6. **Choose your expected annual return** and **annual fee rate** (expense ratio).
7. Watch your results appear instantly — final balance, contribution breakdown, employer match value, and inflation-adjusted amount.

---

## Common Questions About 401k Planning

### What does this 401k calculator do?

It projects how much your 401k could grow by retirement, based on your contributions, employer match, expected returns, and fees. It gives you a clear breakdown of where your money comes from — your contributions, employer contributions, and investment growth.

### How accurate is the projection?

It's a solid estimate based on the numbers you provide. Your actual returns will vary with market performance, but this tool gives you a realistic starting point for planning.

### What's the 401k contribution limit for 2024?

For 2024, you can contribute up to $23,000 as an employee, or $30,500 if you're 50 or older. Combined with your employer, the total limit is $69,000 ($76,500 for those 50+).

### What's considered a good employer match?

A strong match is typically 50% to 100% of your contributions, up to 3% to 6% of your salary. Use our calculator to see exactly how your company's match adds up over time.

### Do fees really matter that much?

Yes — even a 0.5% to 1% annual fee can cost you tens of thousands of dollars over decades. Our calculator automatically subtracts fees so you can see their true impact on your retirement savings.

