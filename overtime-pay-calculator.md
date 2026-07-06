---
layout: tool
title: Overtime Pay Calculator
description: Calculate regular pay, overtime pay, and double-time pay from your hourly rate and hours worked. Fully editable thresholds and multipliers — works anywhere in the world.
permalink: /overtime-pay-calculator
tool_id: overtime-pay
category: tax
hide_sidebar: true

inputs:
  - id: hourlyRate
    label: Hourly Rate
    type: number
    default: 25
    step: 0.5
    min: 0
    prefix: $
    currency: true

  - id: hoursWorked
    label: Hours Worked This Period
    type: number
    default: 45
    step: 1
    min: 0
    max: 168

  - id: regularThreshold
    label: Regular Hours Threshold
    type: number
    default: 40
    step: 1
    min: 0
    max: 168

  - id: overtimeMultiplier
    label: Overtime Multiplier
    type: number
    default: 1.5
    step: 0.1
    min: 1
    max: 5
    suffix: "x"

  - id: doubleTimeThreshold
    label: Double-Time Threshold
    type: number
    default: 0
    step: 1
    min: 0
    max: 168

  - id: doubleTimeMultiplier
    label: Double-Time Multiplier
    type: number
    default: 2.0
    step: 0.1
    min: 1
    max: 5
    suffix: "x"

  - id: periodsPerYear
    label: Pay Periods Per Year
    type: number
    default: 52
    step: 1
    min: 1
    max: 365

outputs:
  - id: regularPay
    label: Regular Pay
  - id: overtimePay
    label: Overtime Pay
  - id: doubleTimePay
    label: Double-Time Pay
  - id: totalPay
    label: Total Pay (This Period)
  - id: annualProjection
    label: Annual Projection

charts:
  tabs:
    - id: payBreakdown
      label: Pay Breakdown
    - id: hoursBreakdown
      label: Hours Breakdown
    - id: scenario
      label: More OT Scenarios

history_columns:
  - key: hourlyRate
    label: Rate
    source: input
  - key: hoursWorked
    label: Hours
    source: input
  - key: regularThreshold
    label: Threshold
    source: input
  - key: overtimeMultiplier
    label: OT Mult.
    source: input
  - key: totalPay
    label: Total Pay
    source: output

js_file: assets/js/calculators/overtime-pay.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Overtime Pay Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  browserRequirements: "Requires JavaScript"
  description: "Calculate regular pay, overtime pay, and double-time pay from your hourly rate and hours worked. Fully editable thresholds and multipliers — works anywhere in the world."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"

faq:
  - question: "How is overtime pay calculated?"
    answer: "Hours up to your regular threshold are paid at your normal hourly rate. Hours beyond that threshold are paid at your overtime multiplier (commonly 1.5x, known as time-and-a-half), and if you set a double-time threshold, hours beyond that are paid at your double-time multiplier instead."
  - question: "What is time and a half?"
    answer: "Time and a half means overtime hours are paid at 1.5 times your regular hourly rate. It's the most common overtime multiplier, but this calculator lets you enter any multiplier your employer or local rules actually use."
  - question: "Does every country use a 40-hour overtime threshold?"
    answer: "No. Overtime rules vary widely by country and even by industry or union agreement. This calculator has no built-in country rule — enter your own regular hours threshold and multiplier to match your actual situation, anywhere in the world."
  - question: "What is double-time?"
    answer: "Double-time means hours worked beyond a second, higher threshold are paid at double your regular rate (or whatever double-time multiplier applies). It's optional here — leave the Double-Time Threshold at 0 if it doesn't apply to you."
  - question: "Can I project my annual pay from this?"
    answer: "Yes. Set Pay Periods Per Year to match how often this hours pattern repeats (52 for weekly, 26 for bi-weekly, 12 for monthly), and the Annual Projection output multiplies your total pay for this period across the year."
  - question: "Is my data stored?"
    answer: "No. Everything runs locally in your browser."
---

# Overtime Pay Calculator

Calculate exactly how much you earn when you work beyond your regular hours. Enter your hourly rate, hours worked, and your own overtime rules — this calculator has no hardcoded country threshold, so it works whether your regular week is 35, 40, or 48 hours.

<!-- more -->

## How to Use This Tool

1. Select your **account currency** from the picker in the site header.
2. Enter your **hourly rate** and the **hours worked** this pay period.
3. Set your **regular hours threshold** — the point where overtime starts (commonly 40 hours/week, but this varies by country, industry, and employer).
4. Enter your **overtime multiplier** (1.5x is the most common, but enter whatever actually applies to you).
5. Optionally set a **double-time threshold and multiplier** if hours beyond a second point are paid even higher.
6. Set **Pay Periods Per Year** to see an annual projection based on this same pattern repeating.

## How Overtime Pay Actually Works

Overtime pay splits your hours into tiers, each paid at a different rate. The first tier — up to your regular threshold — is paid at your normal hourly rate. Every hour beyond that threshold is paid at your overtime multiplier, most commonly 1.5 times your regular rate (time-and-a-half). Some employers or jurisdictions add a third tier: hours beyond an even higher threshold get paid at a double-time multiplier, typically 2 times your regular rate.

There is no universal rule for where overtime starts or how much it pays — a 40-hour weekly threshold with 1.5x pay is common in the United States, but plenty of other countries, industries, and union agreements use different thresholds and multipliers entirely. That's why every number in this calculator is editable rather than fixed: enter the actual rules that apply to you, wherever you are.

The **Annual Projection** output is a simple extrapolation — it assumes the exact same hours-worked pattern repeats every pay period for a full year, which is a useful planning estimate but won't be exact if your overtime hours vary week to week.

---

## Frequently Asked Questions

### How is overtime pay calculated?
Hours up to your regular threshold are paid at your normal hourly rate. Hours beyond that threshold are paid at your overtime multiplier (commonly 1.5x, known as time-and-a-half), and if you set a double-time threshold, hours beyond that are paid at your double-time multiplier instead.

### What is time and a half?
Time and a half means overtime hours are paid at 1.5 times your regular hourly rate. It's the most common overtime multiplier, but this calculator lets you enter any multiplier your employer or local rules actually use.

### Does every country use a 40-hour overtime threshold?
No. Overtime rules vary widely by country and even by industry or union agreement. This calculator has no built-in country rule — enter your own regular hours threshold and multiplier to match your actual situation, anywhere in the world.

### What is double-time?
Double-time means hours worked beyond a second, higher threshold are paid at double your regular rate (or whatever double-time multiplier applies). It's optional here — leave the Double-Time Threshold at 0 if it doesn't apply to you.

### Can I project my annual pay from this?
Yes. Set Pay Periods Per Year to match how often this hours pattern repeats (52 for weekly, 26 for bi-weekly, 12 for monthly), and the Annual Projection output multiplies your total pay for this period across the year.

### Is my data stored?
No. Everything runs locally in your browser.

---
