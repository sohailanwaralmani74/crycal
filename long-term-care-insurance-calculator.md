---
layout: tool
title: "Long Term Care Insurance | Interactive Online Tool"
description: "Estimate your long-term care insurance costs. Enter your age, base rate, coverage amount, benefit period, and factors to see your estimated premium."
permalink: /long-term-care-insurance-calculator
tool_id: long-term-care-insurance-calculator
category: insurance
hide_sidebar: true

inputs:
  - id: age
    label: Your Age
    type: number
    default: 55
    step: 1
    min: 20
    max: 90
    placeholder: "e.g., 55"

  - id: gender
    label: Gender
    type: select
    default: male
    options:
      - male
      - female
      - prefer-not

  - id: healthStatus
    label: Health Status
    type: select
    default: good
    options:
      - excellent
      - good
      - fair
      - poor

  - id: coverageAmount
    label: Desired Annual Benefit Amount
    type: number
    default: 50000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 50000"

  - id: benefitPeriod
    label: Benefit Period (Years)
    type: number
    default: 5
    step: 1
    min: 1
    max: 30
    placeholder: "e.g., 5"

  - id: eliminationPeriod
    label: Elimination Period (Days)
    type: number
    default: 90
    step: 10
    min: 0
    max: 365
    placeholder: "e.g., 90"

  - id: inflationProtection
    label: Inflation Protection
    type: select
    default: no
    options:
      - yes
      - no

  - id: maritalStatus
    label: Marital Status
    type: select
    default: single
    options:
      - single
      - married
      - domestic-partner

  - id: baseRate
    label: Base Annual Premium Rate (Your country's average)
    type: number
    default: 2800
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 2800"

  - id: healthFactor
    label: Health Factor (1.00 = average)
    type: number
    default: 1.00
    step: 0.05
    min: 0.50
    max: 2.00
    placeholder: "e.g., 1.00"

  - id: genderFactor
    label: Gender Factor (1.00 = average)
    type: number
    default: 1.00
    step: 0.05
    min: 0.50
    max: 1.50
    placeholder: "e.g., 1.00"

outputs:
  - id: monthlyPremium
    label: Estimated Monthly Premium
  - id: annualPremium
    label: Estimated Annual Premium
  - id: dailyBenefit
    label: Daily Benefit Amount
  - id: totalLifetimeBenefit
    label: Total Lifetime Benefit
  - id: premiumBreakdown
    label: Premium Breakdown

charts:
  tabs:
    - id: breakdown
      label: Premium Components

history_columns:
  - key: age
    label: Age
    source: input
  - key: gender
    label: Gender
    source: input
  - key: healthStatus
    label: Health Status
    source: input
  - key: coverageAmount
    label: Coverage Amount
    source: input
  - key: benefitPeriod
    label: Benefit Period
    source: input
  - key: eliminationPeriod
    label: Elimination Period
    source: input
  - key: inflationProtection
    label: Inflation Protection
    source: input
  - key: maritalStatus
    label: Marital Status
    source: input
  - key: baseRate
    label: Base Rate
    source: input
  - key: healthFactor
    label: Health Factor
    source: input
  - key: genderFactor
    label: Gender Factor
    source: input
  - key: monthlyPremium
    label: Monthly Premium
    source: output
  - key: annualPremium
    label: Annual Premium
    source: output
  - key: dailyBenefit
    label: Daily Benefit
    source: output
  - key: totalLifetimeBenefit
    label: Lifetime Benefit
    source: output

js_file: assets/js/calculators/long-term-care-insurance-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Long-Term Care Insurance Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate your long-term care insurance costs. Enter your age, base rate, coverage amount, benefit period, and factors to see your estimated premium."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Age & Health Status Factors"
    - "Coverage Amount & Benefit Period"
    - "Elimination Period & Inflation Protection"
    - "Monthly & Annual Premium Estimates"
    - "Daily Benefit & Lifetime Benefit"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Insurance
    url: /insurance
  - name: Long-Term Care Insurance Calculator

howto:
  name: "How to Use the Long-Term Care Insurance Calculator"
  description: "Follow these steps to estimate your long-term care insurance premium."
  step:
    - name: "Enter your age and gender"
      text: "Enter your current age and gender."
    - name: "Select your health status"
      text: "Choose your health status (Excellent, Good, Fair, Poor)."
    - name: "Enter your desired coverage"
      text: "Enter the annual benefit amount you want."
    - name: "Enter benefit period and elimination period"
      text: "Enter how many years benefits should last and the waiting period in days."
    - name: "Enter your country's base rate and factors"
      text: "Enter the average annual premium for your country, then adjust health and gender factors."
    - name: "View your results"
      text: "See your estimated monthly premium, annual premium, daily benefit, and lifetime benefit."

faq:
  - question: "What is long-term care insurance?"
    answer: "Long-term care insurance helps cover the cost of care services that are not typically covered by health insurance, such as nursing home care, assisted living, and in-home care."
  - question: "How much does long-term care insurance cost?"
    answer: "Costs vary by age, health, coverage amount, benefit period, and other factors. The calculator provides a personalized estimate."
  - question: "What is a benefit period?"
    answer: "A benefit period is the length of time the policy will pay for your care (e.g., 2 years, 5 years, or lifetime)."
  - question: "What is an elimination period?"
    answer: "An elimination period is the waiting period before benefits begin after a qualifying event. Typical periods are 30, 60, or 90 days."
  - question: "Why add inflation protection?"
    answer: "Inflation protection increases your benefit amount over time to keep pace with rising care costs, but it also raises your premium."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Long Term Care Insurance Calculator

Estimate your long‑term care insurance costs. Enter your age, base rate, coverage amount, benefit period, and factors to see your estimated premium — all without your data leaving your browser.

<!-- more -->

## How the Long‑Term Care Insurance Calculator Works

A **long term care insurance calculator** estimates the premium you can expect to pay for a long‑term care policy based on factors insurers use to determine rates.

This **long term care insurance cost calculator** considers:

- **Age** — premiums increase significantly with age
- **Gender** — women often have higher premiums due to longer life expectancy
- **Health Status** — excellent health gets lower rates
- **Coverage Amount** — higher daily/monthly benefits increase premiums
- **Benefit Period** — longer coverage periods cost more
- **Elimination Period** — longer waiting periods lower premiums
- **Inflation Protection** — adds cost but protects against rising care costs
- **Marital Status** — married couples may get discounts
- **Base Rate** — the average annual premium in your country
- **Health & Gender Factors** — custom adjustments based on your personal profile

---

## How Premiums Are Estimated

The calculator uses a **base rate** that you provide (the average annual premium for your country), then applies multiple factors:

### Adjustment Factors

| Factor | Impact |
|--------|--------|
| **Health Factor** | User‑entered (e.g., 1.00 = average, >1.00 = higher risk) |
| **Gender Factor** | User‑entered (e.g., 1.00 = average, >1.00 = higher risk) |
| **Benefit Period** | 1–2 yr: ×0.65, 3 yr: ×0.80, 5 yr: ×1.00, 10 yr: ×1.30, >10 yr: ×1.60 |
| **Elimination Period** | ≤30d: ×1.20, ≤60d: ×1.10, ≤90d: ×1.00, ≤180d: ×0.85, >180d: ×0.75 |
| **Inflation Protection** | Yes: ×1.45, No: ×1.00 |
| **Marital Status** | Married: ×0.90, Domestic Partner: ×0.95, Single: ×1.00 |

---

## Who Benefits from the Long‑Term Care Insurance Calculator?

This **long term care insurance cost estimator** is designed for:

- **Individuals** planning for future care needs
- **Couples** evaluating joint or individual policies
- **Financial planners** estimating client costs
- **Anyone** wanting a **long term care insurance quote** before contacting an insurer

---

## Frequently Asked Questions

### What is long-term care insurance?
Long‑term care insurance helps cover the cost of care services not covered by health insurance, such as nursing home care, assisted living, and in‑home care.

### How much does long-term care insurance cost?
Costs vary by age, health, coverage amount, benefit period, and other factors. The calculator provides a personalized estimate.

### What is a benefit period?
A benefit period is the length of time the policy will pay for your care (e.g., 2 years, 5 years, or lifetime).

### What is an elimination period?
An elimination period is the waiting period before benefits begin after a qualifying event. Typical periods are 30, 60, or 90 days.

### Why add inflation protection?
Inflation protection increases your benefit amount over time to keep pace with rising care costs, but it also raises your premium.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.