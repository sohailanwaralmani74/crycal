---
layout: tool
title: "Runway | Interactive Online Tool"
description: "Calculate your startups cash runway survival months based on cash balance, monthly revenue, expenses, and projected growth rate."
permalink: /runway-calculator
tool_id: runway-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: cashBalance
    label: Current Cash Balance
    type: number
    default: 1500000
    step: 25000
    min: 0
    currency: true
    placeholder: "e.g., 1500000"

  - id: monthlyRevenue
    label: Monthly Revenue
    type: number
    default: 80000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 80000"

  - id: monthlyExpenses
    label: Monthly Operating Expenses
    type: number
    default: 180000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 180000"

  - id: expectedRevenueGrowth
    label: Expected Monthly Revenue Growth (%)
    type: number
    default: 5.0
    step: 0.5
    min: 0
    max: 50
    suffix: "%"
    placeholder: "e.g., 5.0"

outputs:
  - id: runwayMonths
    label: Cash Runway
  - id: netMonthlyBurn
    label: Net Monthly Burn
  - id: zeroCashMonth
    label: Zero Cash Month
  - id: grossMonthlyBurn
    label: Gross Monthly Burn
  - id: runwayStatus
    label: Runway Health Status

charts:
  tabs:
    - id: cashTrajectory
      label: Cash Trajectory
    - id: burnVsRev
      label: Burn vs Revenue

history_columns:
  - key: cashBalance
    label: Cash Balance ($)
    source: input
  - key: netMonthlyBurn
    label: Net Monthly Burn ($)
    source: output
  - key: runwayMonths
    label: Runway (Mo)
    source: output
  - key: runwayStatus
    label: Health Status
    source: output

js_file: assets/js/calculators/runway-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Runway Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate startup cash runway in months based on cash balance, net burn rate, and monthly revenue growth."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Cash Runway Month Projection"
    - "Dynamic Revenue Growth Burn Simulation"
    - "Zero Cash Date Estimation"
    - "Runway Health Status Indicator"
    - "Interactive Cash Balance Chart"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Runway Calculator

howto:
  name: "How to Calculate Startup Cash Runway"
  description: "Follow these steps to calculate your cash runway and survival duration in months."
  step:
    - name: "Enter Current Cash Balance"
      text: "Input total bank cash available for operations."
    - name: "Provide Monthly Revenue and Expenses"
      text: "Enter gross cash receipts and total operating expenses."
    - name: "Set Expected Revenue Growth"
      text: "Specify expected monthly revenue growth rate."
    - name: "Analyze Runway Months"
      text: "Review total months remaining before cash depletion."

faq:
  - question: "What is cash runway in a startup?"
    answer: "Cash runway is the total number of months a company can continue operating before running out of cash, calculated by dividing cash balance by net monthly cash burn rate."
  - question: "How is static runway vs dynamic runway calculated?"
    answer: "Static runway assumes constant net monthly burn (Cash / Net Burn). Dynamic runway models month-by-month cash balances incorporating revenue growth and variable cost changes."
  - question: "What is a healthy runway for a SaaS startup?"
    answer: "Venture capitalists generally recommend maintaining 18 to 24 months of cash runway prior to raising a new venture capital funding round."
  - question: "What is the difference between gross burn and net burn?"
    answer: "Gross burn is total operating expenditure per month, while net burn is gross expenses minus cash revenue collected (Gross Expenses − Revenue = Net Burn)."
  - question: "When should a startup start raising funds based on runway?"
    answer: "Founders should begin fundraising when they have 6 to 12 months of runway remaining, as institutional fundraising rounds typically require 3 to 6 months to close."
  - question: "Is my financial data stored anywhere?"
    answer: "No. All calculations run strictly inside your web browser for complete confidentiality."

---

# Runway Calculator

Calculate your startup's cash runway survival months with our free **Runway Calculator**. Project how many months your company can operate based on current cash balance, monthly revenue, gross expenses, and revenue growth.

<!-- more -->

## Why Is Runway Calculation Critical for SaaS Startups?

Cash runway is the single most vital operational metric for startup founders. Out-of-cash risk is the leading cause of early-stage company failure. Understanding your exact runway enables proactive hiring decisions, budget adjustments, and timely fundraising timing.

Key metrics evaluated:
- **Cash Balance**: Liquid bank balance available for operations.
- **Net Monthly Burn**: The cash deficit lost each month ($\text{Expenses} - \text{Revenue}$).
- **Revenue Growth Rate**: Compounding growth that gradually reduces net burn over time.

---

## Cash Runway Formula

### Static Cash Runway Formula
Without revenue growth, cash runway ($R_{static}$) in months is:

$$R_{static} = \frac{\text{Cash Balance}}{\text{Monthly Expenses} - \text{Monthly Revenue}} = \frac{C}{\text{Net Burn}}$$

### Dynamic Cash Runway Simulation
With compounding revenue growth rate ($g$), cash balance at month $t$ is calculated iteratively:

$$\text{Revenue}_t = \text{Revenue}_0 \times (1 + g)^t$$

$$\text{Cash}_t = \text{Cash}_{t-1} - (\text{Expenses} - \text{Revenue}_t)$$

The dynamic runway is the month $t$ where $\text{Cash}_t \le 0$.

---

## Startup Runway Benchmark Guidelines

| Runway Duration | Health Status | Strategic Action |
| :--- | :--- | :--- |
| **24+ Months** | 🟢 **Safe** | Aggressive growth, hiring, product expansion. |
| **12 – 18 Months** | 🟡 **Warning** | Prepare pitch deck, initiate investor conversations. |
| **<9 Months** | 🔴 **Critical** | Freeze non-essential spending, execute fundraising immediately. |

---

## Step-by-Step Guide to Using the Runway Calculator

1. **Input Cash Balance**: Enter current liquid bank balance.
2. **Input Monthly Revenue**: Enter total monthly cash collections from customers.
3. **Input Monthly Operating Expenses**: Include payroll, hosting, marketing, and office costs.
4. **Set Revenue Growth Rate**: Input expected monthly percentage increase in revenue.
5. **Review Zero Cash Date**: Observe the exact month cash will reach zero under current trends.

---

## Frequently Asked Questions

### What is cash runway in a startup?
Cash runway is the total number of months a company can continue operating before running out of cash, calculated by dividing cash balance by net monthly cash burn rate.

### How is static runway vs dynamic runway calculated?
Static runway assumes constant net monthly burn (Cash / Net Burn). Dynamic runway models month-by-month cash balances incorporating revenue growth and variable cost changes.

### What is a healthy runway for a SaaS startup?
Venture capitalists generally recommend maintaining 18 to 24 months of cash runway prior to raising a new venture capital funding round.

### What is the difference between gross burn and net burn?
Gross burn is total operating expenditure per month, while net burn is gross expenses minus cash revenue collected (Gross Expenses − Revenue = Net Burn).

### When should a startup start raising funds based on runway?
Founders should begin fundraising when they have 6 to 12 months of runway remaining, as institutional fundraising rounds typically require 3 to 6 months to close.

### Is my financial data stored anywhere?
No. All calculations run strictly inside your web browser for complete confidentiality.
