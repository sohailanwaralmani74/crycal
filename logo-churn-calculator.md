---
layout: tool
title: "Logo Churn | Interactive Online Tool"
description: "Calculate your Logo Churn Rate (%) and customer retention rate. Measure the percentage of total account logos lost over a period."
permalink: /logo-churn-calculator
tool_id: logo-churn-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: startingCustomers
    label: Starting Customers (Logos)
    type: number
    default: 500
    step: 10
    min: 1
    placeholder: "e.g., 500"

  - id: lostCustomers
    label: Lost Customers (Cancelled Logos)
    type: number
    default: 15
    step: 1
    min: 0
    placeholder: "e.g., 15"

  - id: newCustomers
    label: New Customers Added
    type: number
    default: 30
    step: 1
    min: 0
    placeholder: "e.g., 30"

outputs:
  - id: logoChurnRate
    label: Monthly Logo Churn Rate (%)
  - id: logoRetentionRate
    label: Monthly Logo Retention Rate (%)
  - id: annualizedLogoChurn
    label: Annualized Logo Churn Rate (%)
  - id: endingCustomers
    label: Ending Customer Count

charts:
  tabs:
    - id: breakdown
      label: Customer Logo Movement

history_columns:
  - key: startingCustomers
    label: Starting Logos
    source: input
  - key: lostCustomers
    label: Lost Logos
    source: input
  - key: logoChurnRate
    label: Logo Churn (%)
    source: output
  - key: logoRetentionRate
    label: Retention (%)
    source: output
  - key: endingCustomers
    label: Ending Logos
    source: output

js_file: /assets/js/calculators/logo-churn-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Logo Churn Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your Logo Churn Rate (%) and customer retention rate. Measure the percentage of total account logos lost over a period."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Monthly Logo Churn % Calculation"
    - "Logo Retention Rate % Calculation"
    - "Annualized Churn Projections"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Logo Churn Calculator

howto:
  name: "How to Calculate Logo Churn"
  description: "Follow these steps to calculate your SaaS Logo Churn percentage and customer retention rate."
  step:
    - name: "Enter Starting Customers"
      text: "Input total customer accounts (logos) at the start of the period."
    - name: "Enter Lost Customers"
      text: "Input customer accounts that cancelled during the period."
    - name: "Enter New Customers"
      text: "Input new customer accounts acquired during the period."
    - name: "Review Logo Churn %"
      text: "Analyze your logo churn percentage and ending customer count."

faq:
  - question: "What is Logo Churn in SaaS?"
    answer: "Logo churn (or customer account churn) measures the percentage of total customer accounts or business entities that cancel their subscriptions during a specific time period."
  - question: "What is the difference between Logo Churn and Revenue Churn?"
    answer: "Logo Churn tracks the count of lost customer accounts regardless of contract size. Revenue Churn tracks the total subscription dollars lost from cancellations and downgrades."
  - question: "What is the formula for Logo Churn Rate %?"
    answer: "Logo Churn Rate % = (Lost Customers / Starting Customers) × 100."
  - question: "How do you calculate Annualized Logo Churn from a monthly rate?"
    answer: "Annualized Logo Churn % = [1 − (1 − Monthly Churn Rate)^12] × 100."
  - question: "What is a good monthly Logo Churn rate for B2B SaaS?"
    answer: "For Enterprise B2B SaaS, monthly logo churn should be under 0.5%–1.0% (5%–10% annually). For SMB SaaS, 1.5%–3.0% per month is typical."
  - question: "Why is high Logo Churn dangerous even if Revenue Churn is low?"
    answer: "High logo churn depletes your total addressable market (TAM), reduces referral network effects, and indicates poor product usability or weak onboarding."
  - question: "Does Logo Churn include customer upgrades or downgrades?"
    answer: "No. Account tier upgrades or downgrades affect revenue churn, but do not change logo churn unless the customer completely cancels."

---

# Logo Churn Calculator

Calculate your monthly Logo Churn Rate (%), Logo Retention Rate (%), and Annualized Logo Churn to evaluate total customer account attrition.

<!-- more -->

## Why Use This Logo Churn Calculator

While revenue churn tracks dollar volume, logo churn tracks account volume. This Logo Churn calculator allows you to:

- **👥 Measure Account Attrition** — calculate the exact percentage of customer logos lost each month.
- **🔄 Compare Logo vs. Revenue Churn** — identify whether lost accounts are small self-serve users or enterprise accounts.
- **📅 Project Annualized Customer Loss** — understand compound annual account erosion.
- **📈 Track Net Customer Movement** — monitor total account growth after factoring in new additions.

---

## Logo Churn Formulas

$$\text{Monthly Logo Churn (\%)} = \frac{\text{Lost Customers}}{\text{Starting Customers}} \times 100$$

$$\text{Logo Retention Rate (\%)} = 100 - \text{Monthly Logo Churn (\%)}$$

$$\text{Annualized Logo Churn (\%)} = \left[ 1 - \left(1 - \frac{\text{Monthly Logo Churn}}{100}\right)^{12} \right] \times 100$$

$$\text{Ending Customers} = \text{Starting Customers} - \text{Lost Customers} + \text{New Customers}$$

---

## B2B SaaS Logo Churn Benchmarks

| Market Segment | Target Monthly Logo Churn | Target Annual Logo Churn | Customer Profile |
| :--- | :--- | :--- | :--- |
| **Enterprise SaaS** | < 0.5% / month | < 5% – 6% / year | High ARPU, multi-year contracts, dedicated CSMs |
| **Mid-Market SaaS** | 0.5% – 1.2% / month | 6% – 13% / year | Moderate ARPU, annual contracts, light touch CS |
| **SMB & Micro-SaaS** | 2.0% – 4.0% / month | 21% – 38% / year | Low ARPU, month-to-month credit card payments |

---

## How to Use This Logo Churn Calculator

1. Input **Starting Customers (Logos)** at the start of the period.
2. Input **Lost Customers (Cancelled Logos)** during the period.
3. Input **New Customers Added** during the period.
4. Review your **Monthly Logo Churn Rate (%)**, **Logo Retention Rate (%)**, and **Ending Customer Count**.

---

## Frequently Asked Questions

### What is Logo Churn in SaaS?
Logo churn (or customer account churn) measures the percentage of total customer accounts or business entities that cancel their subscriptions during a specific time period.

### What is the difference between Logo Churn and Revenue Churn?
Logo Churn tracks the count of lost customer accounts regardless of contract size. Revenue Churn tracks the total subscription dollars lost from cancellations and downgrades.

### What is the formula for Logo Churn Rate %?
Logo Churn Rate % = (Lost Customers / Starting Customers) × 100.

### How do you calculate Annualized Logo Churn from a monthly rate?
Annualized Logo Churn % = [1 − (1 − Monthly Churn Rate)^12] × 100.

### What is a good monthly Logo Churn rate for B2B SaaS?
For Enterprise B2B SaaS, monthly logo churn should be under 0.5%–1.0% (5%–10% annually). For SMB SaaS, 1.5%–3.0% per month is typical.

### Why is high Logo Churn dangerous even if Revenue Churn is low?
High logo churn depletes your total addressable market (TAM), reduces referral network effects, and indicates poor product usability or weak onboarding.

### Does Logo Churn include customer upgrades or downgrades?
No. Account tier upgrades or downgrades affect revenue churn, but do not change logo churn unless the customer completely cancels.
