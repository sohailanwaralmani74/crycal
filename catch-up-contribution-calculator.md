---
layout: tool
title: Catch-Up Contribution Calculator – Age-Based Retirement Limits
description: Use the Catch-Up Contribution Calculator to find your total allowed retirement account contribution based on your age and account type, including SECURE 2.0 enhanced catch-up rules.
permalink: /catch-up-contribution-calculator
tool_id: catch-up-contribution-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: accountType
    label: Account Type
    type: select
    default: "401k"
    options:
      - "401k"
      - "403b"
      - "ira"
      - "simple_ira"

  - id: age
    label: Your Age
    type: number
    default: 55
    step: 1
    min: 18
    max: 100
    placeholder: "e.g., 55"

  - id: standardLimit
    label: Standard Contribution Limit (Under 50)
    type: number
    default: 23500
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 23500"

  - id: catchUp50
    label: Standard Catch-Up (Age 50-59 & 64+)
    type: number
    default: 7500
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 7500"

  - id: catchUp60to63
    label: Enhanced Catch-Up (Age 60-63)
    type: number
    default: 11250
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 11250"

outputs:
  - id: applicableCatchUp
    label: Applicable Catch-Up Amount
  - id: totalContributionLimit
    label: Total Allowed Contribution
  - id: percentIncrease
    label: Increase Over Standard Limit

js_file: assets/js/calculators/catch-up-contribution-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Catch-Up Contribution Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Catch-Up Contribution Calculator to find your total allowed retirement account contribution based on your age and account type, including SECURE 2.0 enhanced catch-up rules."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Age-Based Catch-Up Determination"
    - "SECURE 2.0 Enhanced Catch-Up (Age 60-63)"
    - "Support for 401(k), 403(b), IRA, and SIMPLE IRA"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: Catch-Up Contribution Calculator

howto:
  name: "How to Use the Catch-Up Contribution Calculator"
  description: "Follow these steps to find your total allowed contribution with catch-up."
  step:
    - name: "Select your account type"
      text: "Choose the type of retirement account you're contributing to."
    - name: "Enter your age"
      text: "Enter your age to determine catch-up eligibility."
    - name: "Confirm the contribution limits"
      text: "Check or update the current standard limit and catch-up amounts for your account type."
    - name: "View your results"
      text: "See your applicable catch-up amount and total allowed contribution."

faq:
  - question: "What is a catch-up contribution?"
    answer: "A catch-up contribution is an additional amount that individuals age 50 and older are permitted to contribute to retirement accounts beyond the standard annual limit, intended to help those closer to retirement save more."
  - question: "What is the SECURE 2.0 enhanced catch-up contribution?"
    answer: "Starting in 2025, employees ages 60 to 63 participating in 401(k), 403(b), or similar plans may be eligible for a higher 'super' catch-up limit than the standard age-50 catch-up amount, under the SECURE 2.0 Act."
  - question: "Do catch-up contribution limits apply to IRAs too?"
    answer: "Yes. Traditional and Roth IRAs also have a catch-up contribution amount available starting at age 50, though it's typically smaller than 401(k)-style plan catch-up amounts."
  - question: "Does the enhanced catch-up apply to everyone?"
    answer: "The enhanced age 60-63 catch-up generally applies to employer-sponsored plans like 401(k) and 403(b) plans; IRA catch-up amounts don't have this enhanced tier."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Calculate Your Age-Based Catch-Up Contribution

Use the **Catch-Up Contribution Calculator** to find your total allowed retirement account contribution based on your age and account type, including SECURE 2.0 enhanced catch-up rules.

<!-- more -->

## How the Catch-Up Contribution Calculator Works

**Catch-up contributions** let savers age 50 and older contribute more to their retirement accounts each year. Since 2025, SECURE 2.0 also introduced an even higher "super catch-up" for those ages 60 to 63 in workplace plans.

This **catch-up contribution calculator** computes:

- **Applicable Catch-Up Amount** — based on your age bracket
- **Total Allowed Contribution** — standard limit plus catch-up
- **Increase Over Standard Limit** — the percentage boost catch-up provides

---

## Catch-Up Contribution Rules

- **Under 50** — standard limit only, no catch-up
- **Age 50–59** — standard limit + standard catch-up
- **Age 60–63** — standard limit + enhanced catch-up (workplace plans only)
- **Age 64+** — standard limit + standard catch-up (reverts from enhanced tier)

---

## Catch-Up Contribution Examples

### Example 1: Age 55, 401(k)

| Variable | Value |
|----------|-------|
| Standard Limit | $23,500 |
| Catch-Up (50-59) | $7,500 |
| **Total Allowed** | **$31,000** |

### Example 2: Age 62, 401(k) with Enhanced Catch-Up

| Variable | Value |
|----------|-------|
| Standard Limit | $23,500 |
| Enhanced Catch-Up (60-63) | $11,250 |
| **Total Allowed** | **$34,750** |

---

## Who Benefits from the Catch-Up Contribution Calculator?

This **catch-up contribution calculator** is designed for:

- **Workers age 50+** maximizing retirement contributions in their final working years
- **Employees ages 60-63** taking advantage of the new enhanced catch-up tier
- **Financial planners** helping clients plan year-by-year contribution strategies
- **Anyone** unsure which catch-up tier applies to their age

---

## Frequently Asked Questions

### What is a catch-up contribution?
A catch-up contribution is an additional amount that individuals age 50 and older are permitted to contribute to retirement accounts beyond the standard annual limit, intended to help those closer to retirement save more.

### What is the SECURE 2.0 enhanced catch-up contribution?
Starting in 2025, employees ages 60 to 63 participating in 401(k), 403(b), or similar plans may be eligible for a higher "super" catch-up limit than the standard age-50 catch-up amount, under the SECURE 2.0 Act.

### Do catch-up contribution limits apply to IRAs too?
Yes. Traditional and Roth IRAs also have a catch-up contribution amount available starting at age 50, though it's typically smaller than 401(k)-style plan catch-up amounts.

### Does the enhanced catch-up apply to everyone?
The enhanced age 60-63 catch-up generally applies to employer-sponsored plans like 401(k) and 403(b) plans; IRA catch-up amounts don't have this enhanced tier.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.

<p class="tool-disclaimer">IRS contribution limits are adjusted periodically for inflation. Please verify current limits before relying on these results for tax filing purposes.</p>
