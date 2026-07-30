---
layout: tool
title: "401k Calculator | Retirement Savings & Employer Match"
description: "Estimate your 401k retirement savings with our free 401k calculator. Plan your contributions, employer match, and see your projected growth."
permalink: /401k-calculator
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

# 401k Calculator - Project Growth, Interest & Contributions

Use this 401k calculator to estimate how much your 401k account will grow by retirement. Enter your current age, retirement age, current balance, salary, contribution percentage, employer match, expected return, and fees — the tool shows your final balance, total contributions, employer match, and inflation-adjusted value.

<!-- more -->

## Why Use This 401k Retirement Calculator

Your 401(k) is likely one of your largest retirement assets. This 401k estimator calculator helps you:

- **📊 See the Power of Compounding** — watch your 401k balance grow over time.
- **💼 Understand Your Employer Match** — see the full value of your company's contribution.
- **📉 Account for Fees** — see how fund expenses reduce your returns.
- **💰 Plan Your Contributions** — adjust your contribution percentage to meet your goals.
- **📜 Track Your History** — save, review, and export past calculations to CSV or Excel.

This 401k planner is ideal for:

- **Employees** — see if you're on track for retirement.
- **Job changers** — understand the impact of rolling over vs staying.
- **Financial planning** — use it as a 401k savings estimator for retirement projections.

---

## 401(k) Formula Used by This Tool

We use the standard compound interest formula with annual contributions (employee + employer):

**Future Value = Current Balance × (1 + r/n)^(nt) + Annual Contribution × [((1 + r/n)^(nt) - 1) / (r/n)]**

Where:

- **Annual Contribution** = Employee Contribution + Employer Match
- **Employee Contribution** = Salary × (Contribution % / 100)
- **Employer Match** = Salary × (Match % / 100)
- **r** = Annual Return Rate minus Annual Fee Rate (net return)
- **n** = Compounding Frequency per year
- **t** = Years until retirement

The Inflation-Adjusted Value is calculated by discounting the final balance using the inflation rate.

---

## How to Use This 401k Planner

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **current age** and **expected retirement age**.
3.  Enter your **current 401k balance**.
4.  Enter your **annual salary**.
5.  Set your **employee contribution percentage** (e.g., 6 for 6%).
6.  Enter your **employer match percentage** (e.g., 3 for 3%).
7.  Enter your **expected annual return** rate.
8.  Enter the **annual fee rate** (expense ratio).
9.  The tool updates instantly — see your final 401k balance, breakdown of contributions, employer match, returns, and inflation-adjusted value.

---

## 401k Calculator Frequently Asked Questions

### What is a 401k calculator?

A 401k calculator is a retirement planning tool that estimates how much your 401k account will grow over time based on your contributions, employer match, and investment returns.

### How does the 401k calculator work?

The 401k calculator projects your retirement balance using your current age, salary, contribution rates, expected returns, and fees. It also provides a detailed breakdown of your personal contributions versus employer matches and investment earnings.

### What is the 401k contribution limit?

For 2024, the base employee 401k contribution limit is $23,000, rising to $30,500 for those aged 50 and older. The total limit for combined employee and employer contributions is $69,000, or $76,500 for those 50 and older.

### What is a good 401k match?

A strong employer match typically covers 50% or 100% of your contributions up to 3% to 6% of your salary. You can adjust the fixed match percentage in the calculator to reflect your company's specific policy.

### How do fees impact my 401k growth?

Even small management fees of 0.5% to 1% can significantly reduce your total retirement savings over decades of investing. The calculator automatically subtracts annual fees from your balance to show their exact long-term impact.

---

