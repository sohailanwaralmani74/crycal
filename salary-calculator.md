---
layout: tool
title: Salary Calculator
description: Convert your salary between hourly, daily, weekly, monthly, and annual pay — works with any currency and any work schedule, anywhere in the world.
permalink: /salary-calculator
tool_id: salary
category: tax
hide_sidebar: true

inputs:
  - id: salaryAmount
    label: Salary Amount
    type: number
    default: 60000
    step: 100
    min: 0
    prefix: $
    currency: true

  - id: payPeriod
    label: This Is My
    type: select
    default: annual
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
    label: Annual
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
    label: Amount
    source: input
  - key: payPeriod
    label: Period
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
  - key: otherDeductions
    label: Other Ded.
    source: input
  - key: annualRate
    label: Annual Gross
    source: output
  - key: takeHomePay
    label: Take-Home
    source: output

js_file: assets/js/calculators/salary-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Salary Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Convert your salary between hourly, daily, weekly, monthly, and annual pay — works with any currency and any work schedule, anywhere in the world."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"

faq:
  - question: "How do I convert an hourly wage to an annual salary?"
    answer: "Multiply your hourly rate by the number of hours you work per day, then by the number of days you work per week, then by the number of weeks you work per year. This calculator does that automatically and also works in reverse, from annual down to hourly."
  - question: "Does this work for any country or currency?"
    answer: "Yes. The math is based purely on your pay amount and your work schedule (hours per day, days per week, weeks per year), with no country-specific tax rules built in, so it works with any currency and any work pattern worldwide."
  - question: "Why is my monthly pay not exactly my annual pay divided by 12?"
    answer: "It is — monthly pay here is always annual divided by 12. What can look inconsistent is weekly or biweekly pay, since a year has slightly more than 52 weeks; use the Working Weeks Per Year field to match your actual schedule, including unpaid time off."
  - question: "How do I account for unpaid vacation or time off?"
    answer: "Lower the Working Weeks Per Year field below 52 to reflect only the weeks you're actually paid for. This adjusts every converted figure to reflect your real annual pay rather than a theoretical full-year number."
  - question: "Is this calculator showing gross or net pay?"
    answer: "Both. The hourly-through-annual figures are gross pay. If you enter your own tax rate and other deductions, the calculator also shows an estimated Take-Home Pay — but it uses the rate you provide rather than looking up any country's actual tax brackets."
  - question: "How is Take-Home Pay calculated?"
    answer: "Take-Home Pay is your annual gross salary minus your entered tax rate applied to that gross amount, minus your entered Other Deductions (annualized the same way your salary is). It reflects your own numbers, not a built-in tax table, so accuracy depends on the rate you provide."
  - question: "Is my data stored?"
    answer: "No. Everything runs locally in your browser."
---

# Salary Calculator

Convert your salary between hourly, daily, weekly, bi-weekly, monthly, and annual pay. Enter any figure you know — an hourly wage, a monthly paycheck, or an annual salary — along with your actual work schedule, and see every other pay period calculated instantly.

<!-- more -->

## How to Use This Tool

1. Select your **account currency** from the picker in the site header — this calculator works with any currency in the world.
2. Enter your **salary amount** and choose which pay period it represents (hourly, daily, weekly, bi-weekly, monthly, or annual).
3. Enter your actual **hours per day**, **days per week**, and **working weeks per year** — adjust the weeks figure downward if you take unpaid time off.
4. See every other pay period calculated instantly, along with raise scenarios and a breakdown of your work schedule.

## How Salary Conversion Works

Converting between pay periods comes down to one universal principle: any salary figure is really just a rate multiplied by a unit of time. An hourly wage becomes a daily wage when multiplied by hours per day. A daily wage becomes a weekly wage when multiplied by days per week. A weekly wage becomes an annual wage when multiplied by weeks per year. This calculator runs that chain in both directions — starting from whichever figure you actually know, and deriving every other period from it.

This is deliberately **not** a tax calculator in the traditional sense. Income tax brackets, social insurance contributions, and mandatory deductions vary enormously between countries — and even between regions within the same country — so any generic "take-home pay" figure claiming to work globally would necessarily be inaccurate for most people if it tried to guess your bracket automatically. Instead, the optional **Tax Rate** and **Other Deductions** fields let you enter numbers you already know — from a payslip, an estimate, or a separate tax calculator — so the resulting Take-Home Pay reflects your actual situation rather than a guessed jurisdiction.

The **Working Weeks Per Year** field is the most commonly overlooked input. A full year has 52 weeks (and a bit), but very few people are actually paid for all of them — unpaid leave, unpaid holidays, or seasonal work all reduce this number. Lowering it gives you a more accurate annual figure than simply assuming 52 weeks of pay.

---

## Frequently Asked Questions

### How do I convert an hourly wage to an annual salary?
Multiply your hourly rate by the number of hours you work per day, then by the number of days you work per week, then by the number of weeks you work per year. This calculator does that automatically and also works in reverse, from annual down to hourly.

### Does this work for any country or currency?
Yes. The math is based purely on your pay amount and your work schedule (hours per day, days per week, weeks per year), with no country-specific tax rules built in, so it works with any currency and any work pattern worldwide.

### Why is my monthly pay not exactly my annual pay divided by 12?
It is — monthly pay here is always annual divided by 12. What can look inconsistent is weekly or biweekly pay, since a year has slightly more than 52 weeks; use the Working Weeks Per Year field to match your actual schedule, including unpaid time off.

### How do I account for unpaid vacation or time off?
Lower the Working Weeks Per Year field below 52 to reflect only the weeks you're actually paid for. This adjusts every converted figure to reflect your real annual pay rather than a theoretical full-year number.

### Is this calculator showing gross or net pay?
Both. The hourly-through-annual figures are gross pay. If you enter your own tax rate and other deductions, the calculator also shows an estimated Take-Home Pay — but it uses the rate you provide rather than looking up any country's actual tax brackets.

### How is Take-Home Pay calculated?
Take-Home Pay is your annual gross salary minus your entered tax rate applied to that gross amount, minus your entered Other Deductions (annualized the same way your salary is). It reflects your own numbers, not a built-in tax table, so accuracy depends on the rate you provide.

### Is my data stored?
No. Everything runs locally in your browser.

---

*Last updated: July 2026*