---
layout: tool
title: Required Minimum Distribution Calculator | US Only
description: Use our free RMD Calculator to calculate your required minimum distribution from retirement accounts. Enter your age, account balance, and see your RMD amount based on IRS life expectancy tables.
permalink: /rmd-calculator
tool_id: rmd-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: age
    label: Your Age (as of Dec 31)
    type: number
    default: 73
    step: 1
    min: 70
    max: 120
    placeholder: "e.g., 73"

  - id: accountBalance
    label: Retirement Account Balance (as of Dec 31)
    type: number
    default: 500000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 500000"

  - id: spouseBeneficiary
    label: Spouse Beneficiary Age (if applicable)
    type: number
    default: 0
    step: 1
    min: 0
    max: 120
    placeholder: "Enter 0 if not applicable"

  - id: accountType
    label: Account Type
    type: select
    default: traditional-ira
    options:
      - traditional-ira
      - 401k
      - 403b
      - inherited-ira
      - sep-ira
      - simple-ira

outputs:
  - id: rmdAmount
    label: Required Minimum Distribution (RMD)
  - id: lifeExpectancyFactor
    label: Life Expectancy Factor
  - id: distributionPeriod
    label: Distribution Period (years)
  - id: taxPenalty
    label: Potential Penalty (if RMD not taken)
  - id: rmdPercentage
    label: RMD as % of Account Balance

charts:
  tabs:
    - id: breakdown
      label: RMD Breakdown
    - id: projection
      label: RMD Projection (5 Years)

history_columns:
  - key: age
    label: Age
    source: input
  - key: accountBalance
    label: Account Balance
    source: input
  - key: rmdAmount
    label: RMD Amount
    source: output
  - key: rmdPercentage
    label: RMD %
    source: output

js_file: assets/js/calculators/rmd-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "RMD Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your required minimum distribution (RMD) from retirement accounts. Enter your age and account balance to see your RMD based on IRS life expectancy tables."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRS Life Expectancy Tables"
    - "Multiple Account Types Support"
    - "Spouse Beneficiary Calculation"
    - "Tax Penalty Estimate"
    - "Multi-Year Projection Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: RMD Calculator

howto:
  name: "How to Use the RMD Calculator"
  description: "Follow these steps to calculate your required minimum distribution."
  step:
    - name: "Enter your age"
      text: "Enter your age as of December 31 of the current year."
    - name: "Enter your account balance"
      text: "Enter the balance of your retirement account as of December 31."
    - name: "Enter spouse beneficiary age (optional)"
      text: "If your spouse is your sole beneficiary and is more than 10 years younger, enter their age."
    - name: "Select your account type"
      text: "Choose the type of retirement account you have."
    - name: "View your RMD"
      text: "See your required minimum distribution, life expectancy factor, and potential penalty."

faq:
  - question: "What is a Required Minimum Distribution (RMD)?"
    answer: "A Required Minimum Distribution (RMD) is the minimum amount you must withdraw from your retirement accounts each year once you reach a certain age (currently 73 for those born 1951-1959, and 75 for those born 1960 or later)."
  - question: "What age do I need to start taking RMDs?"
    answer: "The RMD age depends on your birth year. If you were born between 1951-1959, you must start at age 73. If you were born in 1960 or later, you must start at age 75."
  - question: "How is my RMD calculated?"
    answer: "Your RMD is calculated by dividing your retirement account balance as of December 31 by your life expectancy factor from the IRS Uniform Lifetime Table."
  - question: "What happens if I don't take my RMD?"
    answer: "If you fail to take your full RMD, the IRS imposes a 25% penalty on the amount not withdrawn (reduced to 10% if corrected within the correction window)."
  - question: "Can I withdraw more than my RMD?"
    answer: "Yes. You can always withdraw more than your RMD. However, you cannot use excess withdrawals in one year to offset RMDs in future years."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# RMD Calculator – Required Minimum Distribution Calculator

Calculate your Required Minimum Distribution (RMD) with our free **RMD Calculator**. Enter your age, account balance, and beneficiary information to see your RMD amount based on IRS life expectancy tables — all without your data leaving your browser.

<!-- more -->

## Why Use This RMD Calculator

Understanding your Required Minimum Distribution (RMD) is essential for retirement planning and tax compliance. Our **RMD Calculator** helps you:

- 📊 **Calculate RMD Amount** — know exactly how much you must withdraw.
- 📈 **Plan Withdrawals** — see your RMD as a percentage of your balance.
- 💰 **Avoid Penalties** — see the potential 25% penalty for missing RMDs.
- 🔮 **Project Future RMDs** — see 5-year projection of RMD amounts.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is a Required Minimum Distribution (RMD)?

A **Required Minimum Distribution (RMD)** is the minimum amount you must withdraw from your retirement accounts each year once you reach a certain age. The IRS requires these withdrawals to ensure that retirement savings are eventually taxed.

**Current RMD Rules:**

| Birth Year | RMD Age |
|------------|---------|
| 1951 – 1959 | 73 |
| 1960 or later | 75 |
| Before 1951 | 72 (pre-2023 rules) |

---

## How RMD Is Calculated

**The Formula:**

**RMD = Account Balance ÷ Life Expectancy Factor**

**Example:**

| Variable | Value |
|----------|-------|
| Age | 73 |
| Account Balance | $500,000 |
| Life Expectancy Factor | 26.5 |
| **RMD** | **$500,000 ÷ 26.5 = $18,868** |

---

## IRS Uniform Lifetime Table (Selected Ages)

| Age | Factor | Age | Factor |
|-----|--------|-----|--------|
| 70 | 27.4 | 81 | 18.7 |
| 71 | 26.5 | 82 | 18.0 |
| 72 | 25.6 | 83 | 17.3 |
| 73 | 24.7 | 84 | 16.6 |
| 74 | 23.8 | 85 | 15.9 |
| 75 | 22.9 | 86 | 15.3 |
| 76 | 22.0 | 87 | 14.6 |
| 77 | 21.2 | 88 | 14.0 |
| 78 | 20.3 | 89 | 13.4 |
| 79 | 19.5 | 90 | 12.8 |
| 80 | 18.7 | 95 | 9.6 |

---

## RMD Penalty

If you fail to take your full RMD, the IRS imposes a significant penalty:

| Penalty | Amount |
|---------|--------|
| **Standard Penalty** | 25% of the RMD amount not withdrawn |
| **Reduced Penalty** | 10% if corrected within the correction window |

**Example:** If your RMD is $18,868 and you take nothing:

- **Standard Penalty:** $18,868 × 25% = **$4,717**
- **Reduced Penalty:** $18,868 × 10% = **$1,887**

---

## How to Use This RMD Calculator

1. **Enter your age** — as of December 31 of the current year.
2. **Enter your account balance** — as of December 31.
3. **Enter spouse beneficiary age** (optional) — if your spouse is the sole beneficiary and more than 10 years younger.
4. **Select your account type** — Traditional IRA, 401(k), 403(b), etc.
5. **View your RMD** — see your required minimum distribution and potential penalty.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## Example: Calculating RMD

**Scenario:** John is 73 years old with a $500,000 Traditional IRA.

| Variable | Value |
|----------|-------|
| Age | 73 |
| Account Balance | $500,000 |
| Life Expectancy Factor | 24.7 |
| **RMD Amount** | **$500,000 ÷ 24.7 = $20,243** |
| RMD as % of Balance | 4.05% |
| Potential Penalty (25%) | $5,061 |

John must withdraw at least $20,243 from his IRA during the year.

---

## Frequently Asked Questions

### What is a Required Minimum Distribution (RMD)?
A Required Minimum Distribution (RMD) is the minimum amount you must withdraw from your retirement accounts each year once you reach a certain age.

### What age do I need to start taking RMDs?
The RMD age depends on your birth year. If you were born between 1951-1959, you must start at age 73. If you were born in 1960 or later, you must start at age 75.

### How is my RMD calculated?
Your RMD is calculated by dividing your retirement account balance as of December 31 by your life expectancy factor from the IRS Uniform Lifetime Table.

### What happens if I don't take my RMD?
If you fail to take your full RMD, the IRS imposes a 25% penalty on the amount not withdrawn (reduced to 10% if corrected within the correction window).

### Can I withdraw more than my RMD?
Yes. You can always withdraw more than your RMD. However, you cannot use excess withdrawals in one year to offset RMDs in future years.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.