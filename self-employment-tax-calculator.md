---
layout: tool
title: Self-Employment Tax Calculator
description: Calculate your self-employment tax, income tax, and net earnings. Enter your net profit, tax rates, and deductions — works for any country.
permalink: /self-employment-tax-calculator
tool_id: self-employment-tax
category: tax
hide_sidebar: true

inputs:
  - id: netProfit
    label: Net Self-Employment Income
    type: number
    default: 80000
    step: 500
    min: 0
    currency: true
    placeholder: "Your net profit from self-employment"

  - id: payFrequency
    label: Pay Frequency
    type: select
    default: yearly
    options:
      - yearly
      - monthly
      - bi-weekly
      - weekly

  - id: incomeTaxRate
    label: Income Tax Rate (%)
    type: number
    default: 22.0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Your effective income tax rate"

  - id: socialSecurityRate
    label: Social Security / National Insurance Rate (%)
    type: number
    default: 12.4
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Self-employed contribution rate (e.g., US 12.4%, UK Class 4)"

  - id: socialSecurityCap
    label: Social Security / National Insurance Cap
    type: number
    default: 0
    step: 1000
    min: 0
    currency: true
    placeholder: "Income cap (0 if no cap)"

  - id: medicareRate
    label: Medicare / Health Insurance Rate (%)
    type: number
    default: 2.9
    step: 0.05
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., US 2.9%, UK Class 2"

  - id: pensionRate
    label: Pension / Retirement Contribution (%)
    type: number
    default: 0
    step: 0.1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "Voluntary or mandatory retirement savings"

  - id: otherDeductions
    label: Other Deductions
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Business expenses, insurance, etc."

  - id: expenseDeduction
    label: Business Expense Deduction
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Deductible business expenses"

outputs:
  - id: netIncomeAfterExpenses
    label: Net Income After Expenses
  - id: totalTax
    label: Total Tax (Income + Self-Employment)
  - id: selfEmploymentTax
    label: Self-Employment Tax
  - id: incomeTax
    label: Income Tax
  - id: netEarnings
    label: Net Earnings After All Taxes
  - id: effectiveRate
    label: Effective Tax Rate

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: comparison
      label: Comparison
    - id: distribution
      label: Distribution

history_columns:
  - key: netProfit
    label: Net Profit
    source: input
  - key: payFrequency
    label: Frequency
    source: input
  - key: totalTax
    label: Total Tax
    source: output
  - key: netEarnings
    label: Net Earnings
    source: output

js_file: /assets/js/calculators/self-employment-tax.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Self-Employment Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your self-employment tax, income tax, and net earnings. Enter your net profit, tax rates, and deductions — works for any country."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Custom Tax Rates — income tax, social security, medicare, pension"
    - "Social Security Cap — set your country's contribution cap"
    - "Business Expenses — deduct expenses from your profit"
    - "Multiple Pay Frequencies — yearly, monthly, bi-weekly, weekly"
    - "Visual Charts — see your tax breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Self-Employment Tax Calculator

howto:
  name: "How to Use the Self-Employment Tax Calculator"
  description: "Follow these steps to calculate your self-employment tax."
  step:
    - name: "Enter your net profit"
      text: "Enter your net self-employment income after business expenses."
    - name: "Enter your income tax rate"
      text: "Enter your effective income tax rate."
    - name: "Enter social security rate"
      text: "Enter your country's self-employed social security / national insurance rate."
    - name: "Set a social security cap"
      text: "Enter the income cap for social security (0 if none)."
    - name: "Enter medicare rate"
      text: "Enter your medicare or health insurance rate."
    - name: "Add pension contributions"
      text: "Enter any retirement contribution percentage."
    - name: "Add other deductions"
      text: "Enter any fixed deductions or business expenses."
    - name: "View your results"
      text: "See your total tax, net earnings, and detailed breakdown."

faq:
  - question: "What is self-employment tax?"
    answer: "Self-employment tax is the tax that self-employed individuals pay to fund social security, Medicare, and other state programs. It typically includes both the employee and employer portions of these contributions."
  - question: "How is self-employment tax calculated?"
    answer: "Self-employment tax is calculated on your net profit from self-employment. In many countries, it includes social security and Medicare contributions at rates that may be higher than employee rates because you pay both shares."
  - question: "Can I deduct business expenses?"
    answer: "Yes — you can enter deductible business expenses, which reduce your net income subject to tax."
  - question: "Does this calculator work for any country?"
    answer: "Yes — you enter your own tax rates, social security rates, and caps. The tool works for any country's self-employment tax system."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Self-Employment Tax Calculator – Calculate Your Freelance Tax

Use this self-employment tax calculator to estimate your tax liability as a freelancer, contractor, or small business owner. Enter your net profit, income tax rate, social security rate, medicare rate, and deductions — the tool works for any country. This self-employed tax calculator gives you an accurate breakdown of your tax obligations and net earnings.

<!-- more -->

## Why Use This Self-Employment Tax Calculator

Running your own business means managing your own taxes. This self-employed tax calculator helps you:

- **💰 Calculate Your Total Tax** — see income tax + self-employment tax.
- **📊 Understand Your Deductions** — see the breakdown of all taxes.
- **🌍 Works for Any Country** — enter your own rates and caps.
- **📈 Visualize Your Tax** — see breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Self-Employment Tax Is Calculated

**Net Income After Expenses = Net Profit − Business Expenses**

**Social Security Tax = (Net Income After Expenses capped at Social Security Cap) × Social Security Rate**

**Medicare Tax = Net Income After Expenses × Medicare Rate**

**Pension Contribution = Net Income After Expenses × Pension Rate**

**Income Tax = Net Income After Expenses × Income Tax Rate**

**Total Tax = Income Tax + Social Security Tax + Medicare Tax + Pension Contribution**

**Net Earnings = Net Income After Expenses − Total Tax**

---

## How to Use This Self-Employment Tax Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **net profit** from self-employment.
3.  Select your **pay frequency**.
4.  Enter your **income tax rate**.
5.  Enter your **social security rate**.
6.  Enter your **social security cap** (if applicable).
7.  Enter your **medicare rate**.
8.  Enter your **pension contribution rate** (optional).
9.  Enter any **business expense deductions**.
10. Enter any **other deductions**.
11. View your results instantly — see your total tax, net earnings, and breakdown.

---

## Frequently Asked Questions

### What is self-employment tax?
Self-employment tax is the tax that self-employed individuals pay to fund social security, Medicare, and other state programs. It typically includes both the employee and employer portions of these contributions.

### How is self-employment tax calculated?
Self-employment tax is calculated on your net profit from self-employment. In many countries, it includes social security and Medicare contributions at rates that may be higher than employee rates because you pay both shares.

### Can I deduct business expenses?
Yes — you can enter deductible business expenses, which reduce your net income subject to tax.

### Does this calculator work for any country?
Yes — you enter your own tax rates, social security rates, and caps. The tool works for any country's self-employment tax system.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

