---
layout: tool
title: I Bond Calculator – Calculate Your Series I Savings Bond Value
description: Use our free I Bond Calculator to determine the current value of your Series I Savings Bond. Enter your purchase date, amount, and fixed rate to see your bond's redemption value and total interest earned.
permalink: /i-bond-calculator
tool_id: i-bond-calculator
category: growth
hide_sidebar: true

inputs:
  - id: purchaseDate
    label: Purchase Date
    type: date

  - id: purchaseAmount
    label: Purchase Amount
    type: number
    default: 10000
    step: 25
    min: 25
    currency: true
    placeholder: "e.g., 10000"

  - id: fixedRate
    label: Fixed Rate (%)
    type: number
    default: 0.90
    step: 0.05
    min: 0
    max: 5
    suffix: '%'
    placeholder: "e.g., 0.90"

  - id: inflationRate
    label: Semiannual Inflation Rate (%)
    type: number
    default: 1.68
    step: 0.01
    min: -5
    max: 10
    suffix: '%'
    placeholder: "e.g., 1.68"

  - id: redemptionMonth
    label: Redemption Month (optional)
    type: month

outputs:
  - id: currentValue
    label: Current Bond Value
  - id: totalInterest
    label: Total Interest Earned
  - id: compositeRate
    label: Current Composite Rate
  - id: yearsHeld
    label: Years Held
  - id: annualizedReturn
    label: Annualized Return
  - id: nextRateChange
    label: Next Rate Change

charts:
  tabs:
    - id: growth
      label: Value Over Time
    - id: breakdown
      label: Interest Breakdown

history_columns:
  - key: purchaseDate
    label: Purchase Date
    source: input
  - key: purchaseAmount
    label: Purchase Amount
    source: input
  - key: fixedRate
    label: Fixed Rate (%)
    source: input
  - key: currentValue
    label: Current Value
    source: output
  - key: totalInterest
    label: Total Interest
    source: output

js_file: assets/js/calculators/i-bond-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "I Bond Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the current value of your Series I Savings Bond. Enter purchase date, amount, and fixed rate to see redemption value and total interest."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Current Bond Value Calculation"
    - "Composite Rate Calculation"
    - "Value Growth Visualization"
    - "Interest Breakdown Chart"
    - "Next Rate Change Notification"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: I Bond Calculator

howto:
  name: "How to Use the I Bond Calculator"
  description: "Follow these steps to calculate the current value of your Series I Savings Bond."
  step:
    - name: "Select your purchase date"
      text: "Use the calendar picker to select the date you purchased your I Bond."
    - name: "Enter your purchase amount"
      text: "Enter the amount you invested in the I Bond (minimum $25)."
    - name: "Enter the fixed rate"
      text: "Enter the fixed rate that was in effect when you purchased your bond."
    - name: "Enter the semiannual inflation rate"
      text: "Enter the current semiannual inflation rate (changes every May and November)."
    - name: "View your results"
      text: "See your bond's current value, total interest earned, composite rate, and annualized return."

faq:
  - question: "What is an I Bond?"
    answer: "A Series I Savings Bond (I Bond) is a U.S. government savings bond designed to protect your savings from inflation. It earns interest based on a fixed rate plus an inflation-adjusted rate that changes every six months."
  - question: "How is the I Bond composite rate calculated?"
    answer: "The composite rate is calculated using the formula: Composite Rate = [Fixed Rate + (2 × Semiannual Inflation Rate) + (Fixed Rate × Semiannual Inflation Rate)]. This rate is applied to your bond for a six-month period."
  - question: "What is the current I Bond rate?"
    answer: "As of May 2026, the composite rate is 4.26% with a 0.90% fixed rate for bonds purchased through October 2026."
  - question: "When do I Bond rates change?"
    answer: "I Bond inflation rates change twice a year — on May 1 and November 1 — based on the Consumer Price Index (CPI)."
  - question: "How often does interest compound on I Bonds?"
    answer: "I Bond interest is compounded semiannually. The composite rate is applied to the bond's value every six months."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# I Bond Calculator – Calculate Your Series I Savings Bond Value

Calculate the current value of your Series I Savings Bond with our free **I Bond Calculator**. Select your purchase date, enter your purchase amount and fixed rate to see your bond's redemption value, total interest earned, and composite rate — all without your data leaving your browser.

<!-- more -->

## Why Use This I Bond Calculator

Series I Savings Bonds are a popular inflation-protected investment backed by the U.S. government. Our **I Bond Calculator** helps you:

- 💰 **Calculate Current Value** — know exactly what your I Bond is worth today.
- 📈 **Track Interest Growth** — see how much interest your bond has earned.
- 🔄 **Understand Composite Rates** — see how fixed and inflation rates combine.
- 📊 **Visualize Growth** — watch your bond's value grow over time.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is a Series I Savings Bond?

A **Series I Savings Bond** (I Bond) is a U.S. government savings bond that earns interest based on two components:

| Component | Description |
|-----------|-------------|
| **Fixed Rate** | Set at purchase and locked for the life of the bond (up to 30 years). |
| **Inflation Rate** | Adjusted twice a year (May 1 and November 1) based on the CPI. |

The combination of these two rates creates the **composite rate** — the actual interest your bond earns.

---

## The I Bond Composite Rate Formula

The composite rate is calculated using this formula:

**Composite Rate = [Fixed Rate + (2 × Semiannual Inflation Rate) + (Fixed Rate × Semiannual Inflation Rate)]**

**Example:**

| Variable | Value |
|----------|-------|
| Fixed Rate | 0.90% |
| Semiannual Inflation Rate | 1.68% |
| **Composite Rate** | **[0.0090 + (2 × 0.0168) + (0.0090 × 0.0168)] = 4.26%** |

---

## Current I Bond Rates (May 2026)

| Rate Type | Current Rate |
|-----------|--------------|
| **Composite Rate** | 4.26% |
| **Fixed Rate** | 0.90% |
| **Semiannual Inflation Rate** | 1.68% |
| **Effective Period** | May 1, 2026 – October 31, 2026 |

---

## How I Bond Interest Works

1. **Interest is compounded semiannually** — the composite rate is applied to your bond's value every six months.
2. **The fixed rate stays the same** — it's locked for the life of the bond (up to 30 years).
3. **The inflation rate changes** — every May and November based on CPI data.
4. **Interest is added to the bond's value** — you earn interest on interest (compounding).
5. **Penalty for early redemption** — if you redeem within 5 years, you forfeit the last 3 months of interest.

---

## How to Use This I Bond Calculator

1. **Select your purchase date** — use the calendar picker to select when you bought your I Bond.
2. **Enter your purchase amount** — how much you invested (minimum $25).
3. **Enter the fixed rate** — the fixed rate in effect when you purchased your bond.
4. **Enter the semiannual inflation rate** — the current inflation rate (check TreasuryDirect).
5. **View your results** — see your bond's current value, total interest, and composite rate.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## I Bond Interest Rate History

| Effective Date | Fixed Rate | Inflation Rate | Composite Rate |
|----------------|------------|----------------|----------------|
| May 2026 | 0.90% | 1.68% | 4.26% |
| Nov 2025 | 0.90% | 1.56% | 4.03% |
| May 2025 | 0.00% | 1.69% | 3.38% |
| Nov 2024 | 0.00% | 1.24% | 2.48% |
| May 2024 | 0.00% | 1.82% | 3.64% |

---

## Frequently Asked Questions

### What is an I Bond?
A Series I Savings Bond (I Bond) is a U.S. government savings bond designed to protect your savings from inflation. It earns interest based on a fixed rate plus an inflation-adjusted rate that changes every six months.

### How is the I Bond composite rate calculated?
The composite rate is calculated using the formula: Composite Rate = [Fixed Rate + (2 × Semiannual Inflation Rate) + (Fixed Rate × Semiannual Inflation Rate)].

### What is the current I Bond rate?
As of May 2026, the composite rate is 4.26% with a 0.90% fixed rate for bonds purchased through October 2026.

### When do I Bond rates change?
I Bond inflation rates change twice a year — on May 1 and November 1 — based on the Consumer Price Index (CPI).

### How often does interest compound on I Bonds?
I Bond interest is compounded semiannually. The composite rate is applied to the bond's value every six months.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.