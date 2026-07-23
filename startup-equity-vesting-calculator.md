---
layout: tool
title: Startup Equity Vesting Calculator – Founder & Employee Vesting Schedule
description: Calculate vested equity shares, unvested shares, and dollar value based on a standard 4-year vesting schedule with a 1-year cliff.
permalink: /startup-equity-vesting-calculator
tool_id: startup-equity-vesting-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: totalGrantShares
    label: Total Granted Shares / Options
    type: number
    default: 100000
    step: 5000
    min: 0
    placeholder: "e.g., 100000"

  - id: companyValuation
    label: Current Company Valuation
    type: number
    default: 10000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 10000000"

  - id: totalCompanyShares
    label: Total Shares Outstanding
    type: number
    default: 10000000
    step: 500000
    min: 1
    placeholder: "e.g., 10000000"

  - id: vestingTermYears
    label: Vesting Duration (Years)
    type: number
    default: 4
    step: 1
    min: 1
    max: 10
    suffix: "yrs"
    placeholder: "e.g., 4"

  - id: cliffMonths
    label: Cliff Period (Months)
    type: number
    default: 12
    step: 1
    min: 0
    max: 36
    suffix: "mo"
    placeholder: "e.g., 12"

  - id: monthsElapsed
    label: Time Elapsed Since Grant (Months)
    type: number
    default: 18
    step: 1
    min: 0
    max: 120
    suffix: "mo"
    placeholder: "e.g., 18"

outputs:
  - id: vestedShares
    label: Vested Shares Count
  - id: unvestedShares
    label: Remaining Unvested Shares
  - id: vestedValue
    label: Dollar Value of Vested Equity
  - id: unvestedValue
    label: Dollar Value of Unvested Equity
  - id: vestedPercentage
    label: Percent Vested

charts:
  tabs:
    - id: vestingSchedule
      label: Vesting Curve Schedule
    - id: equityStatus
      label: Vested vs Unvested

history_columns:
  - key: totalGrantShares
    label: Granted Shares
    source: input
  - key: monthsElapsed
    label: Elapsed (Mo)
    source: input
  - key: vestedShares
    label: Vested Shares
    source: output
  - key: vestedValue
    label: Vested Value ($)
    source: output
  - key: vestedPercentage
    label: Vested (%)
    source: output

js_file: assets/js/calculators/startup-equity-vesting-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Startup Equity Vesting Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate vested stock options, unvested shares, and dollar values using 4-year vesting schedules with 1-year cliff."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "4-Year Vesting Schedule with 1-Year Cliff Modeling"
    - "Monthly Linear Vesting Calculations"
    - "Vested and Unvested Share Dollar Valuation"
    - "Interactive Cumulative Vesting Schedule Chart"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Startup Equity Vesting Calculator

howto:
  name: "How to Calculate Startup Equity Vesting"
  description: "Follow these steps to compute vested shares and equity dollar value over time."
  step:
    - name: "Enter Total Granted Shares"
      text: "Input the total number of stock options or shares awarded."
    - name: "Input Valuation & Shares Outstanding"
      text: "Provide current company valuation and total share count."
    - name: "Set Vesting Duration and Cliff"
      text: "Specify vesting term (usually 4 years) and cliff duration (usually 12 months)."
    - name: "Enter Time Elapsed"
      text: "Input total months elapsed since the grant date to view vested equity."

faq:
  - question: "What is a 4-year vesting schedule with a 1-year cliff?"
    answer: "A standard 4-year vesting schedule with a 1-year cliff means no shares vest during the first 12 months. At month 12, exactly 25% of the total grant vests at once, followed by 1/48th vesting monthly for the remaining 36 months."
  - question: "What happens if an employee leaves before the 1-year cliff?"
    answer: "If an employee leaves before reaching the 12-month cliff, zero shares vest, and all granted stock options return to the unallocated option pool."
  - question: "How is the dollar value of vested equity calculated?"
    answer: "Vested Dollar Value = Vested Shares × Current Share Price, where Share Price = Company Valuation ÷ Total Company Shares Outstanding."
  - question: "What is acceleration of vesting?"
    answer: "Acceleration allows unvested shares to vest immediately upon specific events, such as acquisition (Single-Trigger) or acquisition followed by termination (Double-Trigger)."
  - question: "Do founders also have vesting schedules?"
    answer: "Yes. Venture capital investors require co-founders to submit to 4-year reverse vesting schedules to ensure long-term alignment and protect company continuity."
  - question: "Is my equity data stored securely?"
    answer: "Yes. All computations execute locally in your client web browser with zero server data storage."

---

# Startup Equity Vesting Calculator – Founder & Employee Schedule

Calculate your vested shares, unvested shares, and current dollar equity value with our free **Startup Equity Vesting Calculator**. Model standard 4-year vesting schedules with a 1-year cliff and monthly linear vesting trajectories.

<!-- more -->

## How Startup Equity Vesting Works

Vesting protects companies and founders by ensuring that equity earned corresponds to time served and value created. The industry standard schedule is a **4-year vesting schedule with a 1-year cliff**.

Vesting Timeline Rules:
- **Months 0 to 11 (Before Cliff)**: 0% vested.
- **Month 12 (At Cliff)**: Exactly $\frac{12}{48} = 25\%$ of total granted shares vest instantly.
- **Months 13 to 48**: $\frac{1}{48}\text{th}$ of total grant vests linearly at the end of each month ($2.083\%$ per month).

---

## Vesting Mathematical Model

$$\text{Share Price } (P) = \frac{\text{Company Valuation}}{\text{Total Shares Outstanding}}$$

$$\text{Vested Shares } (S_{vested}) = \begin{cases} 0 & \text{if } t < t_{cliff} \\ \min\left(S_{total}, S_{total} \times \frac{t}{T \times 12}\right) & \text{if } t \ge t_{cliff} \end{cases}$$

$$\text{Vested Value (\$)} = S_{vested} \times P$$

$$\text{Unvested Shares} = S_{total} - S_{vested}$$

---

## Vesting Progress Table (100,000 Share Grant Example)

| Milestone | Time Elapsed | Percent Vested | Vested Shares | Vested Value ($10M Val / 10M Shares) |
| :--- | :--- | :--- | :--- | :--- |
| **Before Cliff** | Month 6 | 0.0% | 0 | $0 |
| **At Cliff** | Month 12 | 25.0% | 25,000 | $25,000 |
| **Mid-Point** | Month 24 | 50.0% | 50,000 | $50,000 |
| **Fully Vested** | Month 48 | 100.0% | 100,000 | $100,000 |

---

## Step-by-Step Guide to Calculating Vested Equity

1. **Enter Total Grant Shares**: Input granted options or restricted stock units (RSUs).
2. **Enter Company Valuation**: Input current preferred or 409A fair market valuation.
3. **Set Shares Outstanding**: Input total company shares issued.
4. **Set Vesting & Cliff Duration**: Default is 4 years duration with 12 months cliff.
5. **Set Months Elapsed**: Input number of months worked since the official grant date.

---

## Frequently Asked Questions

### What is a 4-year vesting schedule with a 1-year cliff?
A standard 4-year vesting schedule with a 1-year cliff means no shares vest during the first 12 months. At month 12, exactly 25% of the total grant vests at once, followed by 1/48th vesting monthly for the remaining 36 months.

### What happens if an employee leaves before the 1-year cliff?
If an employee leaves before reaching the 12-month cliff, zero shares vest, and all granted stock options return to the unallocated option pool.

### How is the dollar value of vested equity calculated?
Vested Dollar Value = Vested Shares × Current Share Price, where Share Price = Company Valuation ÷ Total Company Shares Outstanding.

### What is acceleration of vesting?
Acceleration allows unvested shares to vest immediately upon specific events, such as acquisition (Single-Trigger) or acquisition followed by termination (Double-Trigger).

### Do founders also have vesting schedules?
Yes. Venture capital investors require co-founders to submit to 4-year reverse vesting schedules to ensure long-term alignment and protect company continuity.

### Is my equity data stored securely?
Yes. All computations execute locally in your client web browser with zero server data storage.
