---
layout: tool
title: "Net Worth | Interactive Online Tool"
description: "Calculate your net worth by entering your assets and liabilities. Track your financial health and progress over time."
permalink: /net-worth-calculator
tool_id: net-worth
category: budgeting
hide_sidebar: true

inputs:
  - id: cash
    label: Cash & Savings
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "Checking, savings, cash"

  - id: investments
    label: Investments
    type: number
    default: 25000
    step: 100
    min: 0
    currency: true
    placeholder: "Stocks, bonds, mutual funds"

  - id: retirement
    label: Retirement Accounts
    type: number
    default: 30000
    step: 100
    min: 0
    currency: true
    placeholder: "401k, IRA, Pension"

  - id: realEstate
    label: Real Estate Value
    type: number
    default: 250000
    step: 1000
    min: 0
    currency: true
    placeholder: "Home, rental properties"

  - id: vehicles
    label: Vehicle Value
    type: number
    default: 15000
    step: 1000
    min: 0
    currency: true
    placeholder: "Car, boat, RV"

  - id: otherAssets
    label: Other Assets
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Jewelry, collectibles, business"

  - id: mortgageBalance
    label: Mortgage Balance
    type: number
    default: 200000
    step: 1000
    min: 0
    currency: true
    placeholder: "Remaining mortgage"

  - id: creditCardDebt
    label: Credit Card Debt
    type: number
    default: 5000
    step: 100
    min: 0
    currency: true
    placeholder: "Total credit card balances"

  - id: autoLoans
    label: Auto Loans
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "Remaining auto loans"

  - id: studentLoans
    label: Student Loans
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Remaining student loans"

  - id: personalLoans
    label: Personal Loans
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Other personal loans"

  - id: otherLiabilities
    label: Other Liabilities
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Taxes owed, medical bills"

outputs:
  - id: totalAssets
    label: Total Assets
  - id: totalLiabilities
    label: Total Liabilities
  - id: netWorth
    label: Net Worth
  - id: debtToAssetRatio
    label: Debt-to-Asset Ratio
  - id: netWorthCategory
    label: Net Worth Category

charts:
  tabs:
    - id: assets
      label: Assets
    - id: liabilities
      label: Liabilities
    - id: comparison
      label: Comparison

history_columns:
  - key: totalAssets
    label: Total Assets
    source: output
  - key: totalLiabilities
    label: Total Liabilities
    source: output
  - key: netWorth
    label: Net Worth
    source: output

js_file: assets/js/calculators/net-worth.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Net Worth Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your net worth by entering your assets and liabilities. Track your financial health and progress over time."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Asset & Liability Tracking — see your full financial picture"
    - "Net Worth Category — understand your financial health at a glance"
    - "Debt-to-Asset Ratio — see how much of your assets are financed"
    - "Visual Charts — see your assets and liabilities breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Budgeting
    url: /budgeting
  - name: Net Worth Calculator

howto:
  name: "How to Use the Net Worth Calculator"
  description: "Follow these steps to calculate your net worth."
  step:
    - name: "Enter your assets"
      text: "Enter the value of your cash, investments, retirement accounts, real estate, vehicles, and other assets."
    - name: "Enter your liabilities"
      text: "Enter your mortgage balance, credit card debt, auto loans, student loans, and other liabilities."
    - name: "View your results"
      text: "See your total assets, total liabilities, net worth, and net worth category."

faq:
  - question: "What is net worth?"
    answer: "Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It's a measure of your overall financial health."
  - question: "How is net worth calculated?"
    answer: "Net Worth = Total Assets − Total Liabilities. A positive net worth means you own more than you owe. A negative net worth means you owe more than you own."
  - question: "What counts as an asset?"
    answer: "Assets include cash, savings, investments, retirement accounts, real estate, vehicles, and anything else of value that you own."
  - question: "What counts as a liability?"
    answer: "Liabilities include mortgages, credit card debt, auto loans, student loans, personal loans, and any other debts you owe."
  - question: "What is a good net worth?"
    answer: "A good net worth depends on your age, income, and financial goals. Generally, a positive and growing net worth is a sign of good financial health."

---

# Net Worth Calculator

Use this net worth calculator to calculate your net worth by entering your assets and liabilities. See your total assets, total liabilities, net worth, and net worth category. This net worth tracker helps you understand your financial health at a glance.

<!-- more -->

## Why Use This Net Worth Calculator

Tracking your net worth is one of the best ways to measure your financial progress. This net worth tracker helps you:

- **💰 Calculate Your Net Worth** — see your total assets and liabilities.
- **📊 Understand Your Financial Health** — see your net worth category.
- **📈 Track Progress Over Time** — use history to monitor changes.
- **📉 See Your Debt-to-Asset Ratio** — understand your leverage.
- **📊 Visualize Your Finances** — see asset and liability breakdown charts.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Net Worth Is Calculated

**Net Worth = Total Assets − Total Liabilities**

Where:
- **Assets** = Cash + Investments + Retirement + Real Estate + Vehicles + Other Assets
- **Liabilities** = Mortgage + Credit Card Debt + Auto Loans + Student Loans + Personal Loans + Other Liabilities

**Debt-to-Asset Ratio = (Total Liabilities ÷ Total Assets) × 100**

---

## How to Use This Net Worth Tracker

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **assets**:
    - Cash & Savings
    - Investments
    - Retirement Accounts
    - Real Estate Value
    - Vehicle Value
    - Other Assets
3.  Enter your **liabilities**:
    - Mortgage Balance
    - Credit Card Debt
    - Auto Loans
    - Student Loans
    - Personal Loans
    - Other Liabilities
4.  View your results instantly — see your total assets, total liabilities, net worth, and net worth category.

---

## Frequently Asked Questions

### What is net worth?
Net worth is the total value of everything you own (assets) minus everything you owe (liabilities). It's a measure of your overall financial health.

### How is net worth calculated?
Net Worth = Total Assets − Total Liabilities. A positive net worth means you own more than you owe. A negative net worth means you owe more than you own.

### What counts as an asset?
Assets include cash, savings, investments, retirement accounts, real estate, vehicles, and anything else of value that you own.

### What counts as a liability?
Liabilities include mortgages, credit card debt, auto loans, student loans, personal loans, and any other debts you owe.

### What is a good net worth?
A good net worth depends on your age, income, and financial goals. Generally, a positive and growing net worth is a sign of good financial health.

---

