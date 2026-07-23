---
layout: tool
title: 403(b) Calculator – Project Your Retirement Plan Growth
description: Use the 403(b) Calculator to project your retirement account growth based on salary, contribution rate, employer match, and investment returns.
permalink: /403b-calculator
tool_id: 403b-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: currentBalance
    label: Current 403(b) Balance
    type: number
    default: 40000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 40000"

  - id: annualSalary
    label: Annual Salary
    type: number
    default: 75000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 75000"

  - id: contributionPercent
    label: Your Contribution Rate
    type: number
    default: 8
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 8"

  - id: employerMatchPercent
    label: Employer Match Rate (% of Salary Matched)
    type: number
    default: 3
    step: 0.5
    min: 0
    max: 25
    suffix: '%'
    placeholder: "e.g., 3"

  - id: annualReturn
    label: Expected Annual Return
    type: number
    default: 7
    step: 0.1
    min: 0
    max: 20
    suffix: '%'
    placeholder: "e.g., 7"

  - id: yearsToRetirement
    label: Years Until Retirement
    type: number
    default: 25
    step: 1
    min: 1
    max: 50
    placeholder: "e.g., 25"

  - id: annualSalaryGrowth
    label: Annual Salary Growth Rate
    type: number
    default: 2.5
    step: 0.1
    min: 0
    max: 15
    suffix: '%'
    placeholder: "e.g., 2.5"

outputs:
  - id: projectedBalance
    label: Projected Balance at Retirement
  - id: totalYourContributions
    label: Total Your Contributions
  - id: totalEmployerContributions
    label: Total Employer Match
  - id: totalGrowth
    label: Total Investment Growth

charts:
  tabs:
    - id: growth
      label: Balance Growth 
    - id: breakdown
      label: Contribution Sources

js_file: assets/js/calculators/403b-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "403(b) Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the 403(b) Calculator to project your retirement account growth based on salary, contribution rate, employer match, and investment returns."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Salary-Based Contribution Projection"
    - "Employer Match Modeling"
    - "Salary Growth Over Time"
    - "Visual Growth & Breakdown Charts"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: 403(b) Calculator

howto:
  name: "How to Use the 403(b) Calculator"
  description: "Follow these steps to project your 403(b) balance at retirement."
  step:
    - name: "Enter your current 403(b) balance"
      text: "Enter how much is currently in your 403(b) account."
    - name: "Enter your annual salary"
      text: "Enter your current gross annual salary."
    - name: "Enter your contribution rate"
      text: "Enter the percentage of salary you contribute each pay period."
    - name: "Enter your employer match rate"
      text: "Enter the percentage of salary your employer matches."
    - name: "Enter your expected annual return"
      text: "Enter your expected average annual investment return."
    - name: "Enter years until retirement and salary growth"
      text: "Enter how many years until retirement and your expected annual raise percentage."
    - name: "View your results"
      text: "See your projected balance at retirement and the growth breakdown."

faq:
  - question: "What is a 403(b) plan?"
    answer: "A 403(b) plan is a tax-advantaged retirement savings plan available to employees of public schools, nonprofit organizations, and certain ministers, functioning similarly to a 401(k) offered by for-profit employers."
  - question: "How is 403(b) growth calculated?"
    answer: "403(b) growth is calculated by compounding your existing balance and ongoing contributions (both yours and your employer's match) at your expected rate of return over your years until retirement."
  - question: "Does my employer match count toward my contribution limit?"
    answer: "No. Employer matching contributions do not count against your individual employee elective deferral limit, though they do count toward the overall combined contribution limit for the plan."
  - question: "What's the difference between a 403(b) and a 401(k)?"
    answer: "They function very similarly, but 403(b) plans are offered by nonprofit, educational, and religious organizations, while 401(k) plans are offered by for-profit employers. Both offer tax-deferred (or Roth) growth."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Project Your 403(b) Retirement Plan Growth

Use the **403(b) Calculator** to project your retirement account growth based on salary, contribution rate, employer match, and investment returns.

<!-- more -->

## How the 403(b) Calculator Works

A **403(b) plan** is a tax-advantaged retirement account for employees of schools, nonprofits, and certain religious organizations. This calculator projects your balance at retirement, factoring in rising salary and employer matching.

This **403(b) calculator** computes:

- **Projected Balance at Retirement** — your estimated ending balance
- **Total Your Contributions** — cumulative employee contributions over time
- **Total Employer Match** — cumulative employer contributions
- **Total Investment Growth** — how much your money grew from returns

---

## 403(b) Growth Formula

Each year, contributions are calculated as:

**Your Contribution = Salary × Contribution % (Salary grows annually by Salary Growth Rate)**

**Employer Match = Salary × Employer Match %**

The combined balance compounds monthly at the expected annual return until retirement.

---

## 403(b) Examples

### Example 1: Mid-Career Educator

| Variable | Value |
|----------|-------|
| Current Balance | $40,000 |
| Annual Salary | $75,000 |
| Contribution Rate | 8% |
| Employer Match | 3% |
| Annual Return | 7% |
| Years to Retirement | 25 |
| **Projected Balance** | **$556,000+** |

### Example 2: Early-Career Nonprofit Employee

| Variable | Value |
|----------|-------|
| Current Balance | $5,000 |
| Annual Salary | $55,000 |
| Contribution Rate | 6% |
| Employer Match | 2% |
| Annual Return | 7% |
| Years to Retirement | 35 |
| **Projected Balance** | **$480,000+** |

---

## Who Benefits from the 403(b) Calculator?

This **403(b) calculator** is designed for:

- **Teachers and school employees** planning for retirement
- **Nonprofit employees** projecting long-term savings growth
- **Healthcare workers** at nonprofit hospitals maximizing employer match
- **Financial planners** modeling retirement scenarios for nonprofit-sector clients

---

## Frequently Asked Questions

### What is a 403(b) plan?
A 403(b) plan is a tax-advantaged retirement savings plan available to employees of public schools, nonprofit organizations, and certain ministers, functioning similarly to a 401(k) offered by for-profit employers.

### How is 403(b) growth calculated?
403(b) growth is calculated by compounding your existing balance and ongoing contributions (both yours and your employer's match) at your expected rate of return over your years until retirement.

### Does my employer match count toward my contribution limit?
No. Employer matching contributions do not count against your individual employee elective deferral limit, though they do count toward the overall combined contribution limit for the plan.

### What's the difference between a 403(b) and a 401(k)?
They function very similarly, but 403(b) plans are offered by nonprofit, educational, and religious organizations, while 401(k) plans are offered by for-profit employers. Both offer tax-deferred (or Roth) growth.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.
