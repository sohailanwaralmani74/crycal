---
layout: tool
title: "Solo 401K Contribution | Interactive Online Tool"
description: "Use the Solo 401(k) Contribution Calculator to estimate your maximum allowed employee deferral, employer contribution, and total contribution as..."
permalink: /solo-401k-contribution-calculator
tool_id: solo-401k-contribution-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: netSelfEmploymentIncome
    label: Net Self-Employment Income
    type: number
    default: 150000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 150000"

  - id: age
    label: Your Age
    type: number
    default: 45
    step: 1
    min: 18
    max: 100
    placeholder: "e.g., 45"

  - id: employeeDeferralLimit
    label: Employee Deferral Limit (Under 50)
    type: number
    default: 23500
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 23500"

  - id: catchUp50
    label: Catch-Up Contribution (Age 50-59 & 64+)
    type: number
    default: 7500
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 7500"

  - id: catchUp60to63
    label: Enhanced Catch-Up (Age 60-63)
    type: number
    default: 11250
    step: 250
    min: 0
    currency: true
    placeholder: "e.g., 11250"

  - id: employerContributionPercent
    label: Employer Contribution Rate (% of Net SE Income)
    type: number
    default: 20
    step: 1
    min: 0
    max: 25
    suffix: '%'
    placeholder: "e.g., 20"

  - id: overallLimit
    label: Overall Combined Contribution Limit
    type: number
    default: 70000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 70000"

outputs:
  - id: employeeDeferral
    label: Maximum Employee Deferral
  - id: employerContribution
    label: Maximum Employer Contribution
  - id: totalContribution
    label: Total Solo 401(k) Contribution
  - id: remainingRoom
    label: Remaining Contribution Room vs. Overall Limit

js_file: assets/js/calculators/solo-401k-contribution-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Solo 401(k) Contribution Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Solo 401(k) Contribution Calculator to estimate your maximum allowed employee deferral, employer contribution, and total contribution as a self-employed business owner."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Employee Deferral Limit with Age-Based Catch-Up"
    - "Employer Contribution Estimate"
    - "SECURE 2.0 Enhanced Catch-Up (Age 60-63)"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: Solo 401(k) Contribution Calculator

howto:
  name: "How to Use the Solo 401(k) Contribution Calculator"
  description: "Follow these steps to estimate your maximum Solo 401(k) contribution."
  step:
    - name: "Enter your net self-employment income"
      text: "Enter your net earnings from self-employment after business expenses."
    - name: "Enter your age"
      text: "Enter your age to determine catch-up contribution eligibility."
    - name: "Confirm the IRS limits"
      text: "Check or update the current employee deferral limit, catch-up amounts, and overall limit."
    - name: "Enter your employer contribution rate"
      text: "Enter the percentage of net self-employment income you plan to contribute as the 'employer'."
    - name: "View your results"
      text: "See your maximum employee deferral, employer contribution, and total allowed contribution."

faq:
  - question: "What is a Solo 401(k)?"
    answer: "A Solo 401(k) is a retirement plan designed for self-employed individuals with no employees (other than a spouse), allowing contributions in both the 'employee' and 'employer' roles for higher total contribution limits."
  - question: "How much can I contribute to a Solo 401(k)?"
    answer: "You can contribute as an employee (elective deferral, up to the annual limit plus catch-up if eligible) and as an employer (a percentage of net self-employment income), subject to an overall combined dollar limit."
  - question: "What is the SECURE 2.0 enhanced catch-up contribution?"
    answer: "Starting in 2025, employees ages 60 to 63 may be eligible for a higher 'super' catch-up contribution limit than the standard age-50 catch-up, under provisions of the SECURE 2.0 Act."
  - question: "Can my spouse also contribute to my Solo 401(k)?"
    answer: "Yes, if your spouse works in the business and receives compensation, they can also make employee and employer contributions to the same Solo 401(k) plan, subject to their own limits."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Solo 401K Contribution Calculator

Use the **Solo 401(k) Contribution Calculator** to estimate your maximum allowed employee deferral, employer contribution, and total contribution as a self-employed business owner.

<!-- more -->

## How the Solo 401(k) Contribution Calculator Works

A **Solo 401(k)** allows self-employed individuals to contribute in two roles — as the "employee" (elective deferral) and as the "employer" (profit-sharing contribution) — often resulting in much higher total contribution limits than a SEP IRA.

This **Solo 401(k) calculator** computes:

- **Maximum Employee Deferral** — your elective deferral limit, including any catch-up
- **Maximum Employer Contribution** — your profit-sharing contribution as the business
- **Total Solo 401(k) Contribution** — combined employee + employer amount
- **Remaining Contribution Room** — how much room is left versus the overall IRS limit

---

## Solo 401(k) Contribution Formula

**Employee Deferral = Deferral Limit + Catch-Up (if age-eligible)**

**Employer Contribution = Net Self-Employment Income × Employer Contribution %**

**Total Contribution = MIN(Employee Deferral + Employer Contribution, Overall Limit + Catch-Up)**

---

## Solo 401(k) Examples

### Example 1: Business Owner Age 45

| Variable | Value |
|----------|-------|
| Net SE Income | $150,000 |
| Age | 45 |
| Employee Deferral | $23,500 |
| Employer Contribution (20%) | $30,000 |
| **Total Contribution** | **$53,500** |

### Example 2: Business Owner Age 62 (Enhanced Catch-Up)

| Variable | Value |
|----------|-------|
| Net SE Income | $200,000 |
| Age | 62 |
| Employee Deferral (with catch-up) | $34,750 |
| Employer Contribution (20%) | $40,000 |
| **Total Contribution** | **$74,750** |

---

## Who Benefits from the Solo 401(k) Contribution Calculator?

This **Solo 401(k) calculator** is designed for:

- **Self-employed individuals** with no full-time employees maximizing retirement savings
- **Freelancers and consultants** comparing Solo 401(k) vs. SEP IRA contribution limits
- **Business owners nearing retirement** using catch-up contributions to boost savings
- **Financial planners** modeling contribution strategies for self-employed clients

---

## Frequently Asked Questions

### What is a Solo 401(k)?
A Solo 401(k) is a retirement plan designed for self-employed individuals with no employees (other than a spouse), allowing contributions in both the "employee" and "employer" roles for higher total contribution limits.

### How much can I contribute to a Solo 401(k)?
You can contribute as an employee (elective deferral, up to the annual limit plus catch-up if eligible) and as an employer (a percentage of net self-employment income), subject to an overall combined dollar limit.

### What is the SECURE 2.0 enhanced catch-up contribution?
Starting in 2025, employees ages 60 to 63 may be eligible for a higher "super" catch-up contribution limit than the standard age-50 catch-up, under provisions of the SECURE 2.0 Act.

### Can my spouse also contribute to my Solo 401(k)?
Yes, if your spouse works in the business and receives compensation, they can also make employee and employer contributions to the same Solo 401(k) plan, subject to their own limits.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.

<p class="tool-disclaimer">IRS contribution limits are adjusted periodically for inflation and are subject to change. Please verify current limits before relying on these results for tax filing purposes.</p>
