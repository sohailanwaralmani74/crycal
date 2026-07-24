---
layout: tool
title: "Hourly To Salary | Interactive Online Tool"
description: "Convert your hourly wage into an annual salary — plus daily, weekly, and monthly pay. Works with any currency and any work schedule, anywhere in the world."
permalink: /hourly-to-salary-calculator
tool_id: hourly-to-salary
category: tax
hide_sidebar: true

inputs:
  - id: salaryAmount
    label: Hourly Wage
    type: number
    default: 25
    step: 0.5
    min: 0
    prefix: $
    currency: true

  - id: payPeriod
    label: This Is My
    type: select
    default: hourly
    options:
      - hourly
      - daily
      - weekly
      - biweekly
      - monthly
      - annual

  - id: hoursPerDay
    label: Hours Per Day
    type: number
    default: 8
    step: 0.5
    min: 1
    max: 24

  - id: daysPerWeek
    label: Days Per Week
    type: number
    default: 5
    step: 1
    min: 1
    max: 7

  - id: weeksPerYear
    label: Working Weeks Per Year
    type: number
    default: 52
    step: 1
    min: 1
    max: 52

  - id: taxRate
    label: Tax Rate
    type: number
    default: 0
    step: 0.1
    min: 0
    max: 100
    suffix: "%"

  - id: otherDeductions
    label: Other Deductions
    type: number
    default: 0
    step: 10
    min: 0
    prefix: $
    currency: true

outputs:
  - id: hourlyRate
    label: Hourly
  - id: dailyRate
    label: Daily
  - id: weeklyRate
    label: Weekly
  - id: biWeeklyRate
    label: Bi-Weekly
  - id: monthlyRate
    label: Monthly
  - id: annualRate
    label: Annual Salary
  - id: totalDeductions
    label: Total Deductions
  - id: takeHomePay
    label: Take-Home Pay (Annual)

charts:
  tabs:
    - id: compare
      label: Pay Periods
    - id: raise
      label: Raise Scenarios
    - id: workdays
      label: Work Schedule
    - id: takehome
      label: Take-Home Breakdown

history_columns:
  - key: salaryAmount
    label: Hourly Rate
    source: input
  - key: hoursPerDay
    label: Hrs/Day
    source: input
  - key: daysPerWeek
    label: Days/Wk
    source: input
  - key: taxRate
    label: Tax %
    source: input
  - key: annualRate
    label: Annual Salary
    source: output
  - key: takeHomePay
    label: Take-Home
    source: output

js_file: assets/js/calculators/salary-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Hourly to Salary Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Convert your hourly wage into an annual salary — plus daily, weekly, and monthly pay. Works with any currency and any work schedule, anywhere in the world."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"

faq:
  - question: "How do I convert an hourly wage to an annual salary?"
    answer: "Multiply your hourly rate by the hours you work per day, then by the days you work per week, then by the weeks you work per year. For a typical full-time schedule of 8 hours a day, 5 days a week, 52 weeks a year, that's hourly rate times 2,080."
  - question: "How much is $20 an hour annually?"
    answer: "At a typical full-time schedule (8 hours a day, 5 days a week, 52 weeks a year), $20 an hour works out to $41,600 a year before tax. Enter your own schedule above if it differs from full-time."
  - question: "How much is $25 an hour annually?"
    answer: "At a typical full-time schedule (8 hours a day, 5 days a week, 52 weeks a year), $25 an hour works out to $52,000 a year before tax. Enter your own schedule above if it differs from full-time."
  - question: "Does this account for overtime pay?"
    answer: "No. This calculator assumes a consistent schedule at your entered hourly rate. If you regularly work overtime at a different rate, calculate your regular and overtime pay separately and add them together."
  - question: "Is the annual salary shown my take-home pay?"
    answer: "Not by default — it's your gross salary. Enter your own Tax Rate and Other Deductions below to see an estimated Take-Home Pay based on your own numbers, since tax rules vary too much by country to calculate automatically."
  - question: "Does this work for any country or currency?"
    answer: "Yes. The math is based purely on your hourly rate and your work schedule, with no country-specific rules built in, so it works with any currency and any work pattern worldwide."
  - question: "Is my data stored?"
    answer: "No. Everything runs locally in your browser."
---

# Hourly To Salary Calculator

Know your hourly wage and want to see what it adds up to over a day, a week, a month, or a year? Enter your hourly rate and your actual work schedule below, and this calculator converts it into every other pay period instantly — no assumptions about a "standard" job baked in.

<!-- more -->

## How to Use the Hourly-to-Salary Calculator

1. Select your **account currency** from the picker in the site header — this works with any currency in the world.
2. Enter your **hourly wage**.
3. Enter your actual **hours per day**, **days per week**, and **working weeks per year** — the defaults (8 hours, 5 days, 52 weeks) reflect a typical full-time schedule, but adjust them to match your real hours.
4. Optionally enter a **tax rate** and **other deductions** to see an estimated take-home figure alongside your gross salary.

Already know your annual salary and want your hourly rate instead? Use the full <a href="salary-calculator">Salary Calculator</a>, which converts in either direction.

## The Hourly-to-Salary Formula

The math is a simple chain: hourly rate × hours per day = daily pay. Daily pay × days per week = weekly pay. Weekly pay × weeks per year = annual salary. For a standard full-time schedule — 8 hours a day, 5 days a week, 52 weeks a year — that's **2,080 working hours a year**, so your annual salary is simply your hourly rate multiplied by 2,080.

A few quick reference points at that standard schedule:

- **$15/hour** → $31,200/year
- **$20/hour** → $41,600/year
- **$25/hour** → $52,000/year
- **$30/hour** → $62,400/year
- **$40/hour** → $83,200/year

These reference points assume full-time hours with no unpaid time off. If you work part-time, take unpaid leave, or work a different schedule, use the calculator above with your actual numbers rather than these standard figures.

---

## Hourly to Salary Calculator FAQ

### How do I convert an hourly wage to an annual salary?
Multiply your hourly rate by the hours you work per day, then by the days you work per week, then by the weeks you work per year. For a typical full-time schedule of 8 hours a day, 5 days a week, 52 weeks a year, that's hourly rate times 2,080.

### How much is $20 an hour annually?
At a typical full-time schedule (8 hours a day, 5 days a week, 52 weeks a year), $20 an hour works out to $41,600 a year before tax. Enter your own schedule above if it differs from full-time.

### How much is $25 an hour annually?
At a typical full-time schedule (8 hours a day, 5 days a week, 52 weeks a year), $25 an hour works out to $52,000 a year before tax. Enter your own schedule above if it differs from full-time.

### Does this account for overtime pay?
No. This calculator assumes a consistent schedule at your entered hourly rate. If you regularly work overtime at a different rate, calculate your regular and overtime pay separately and add them together.

### Is the annual salary shown my take-home pay?
Not by default — it's your gross salary. Enter your own Tax Rate and Other Deductions below to see an estimated Take-Home Pay based on your own numbers, since tax rules vary too much by country to calculate automatically.

### Does this work for any country or currency?
Yes. The math is based purely on your hourly rate and your work schedule, with no country-specific rules built in, so it works with any currency and any work pattern worldwide.

### Is my data stored?
No. Everything runs locally in your browser.

---
