---
layout: tool
title: Cost-Plus Pricing Calculator – Target Margin Cost Pricing
description: Calculate subscription plan pricing based on hosting, support, and licensing COGS plus target gross margin percentage.
permalink: /cost-plus-pricing-calculator
tool_id: cost-plus-pricing-calculator
category: saas-pricing-packaging
hide_sidebar: true

inputs:
  - id: hostingStorageCost
    label: Hosting & Cloud Storage ($ / user / mo)
    type: number
    default: 8
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 8"

  - id: customerSupportCost
    label: Customer Support Overhead ($ / user / mo)
    type: number
    default: 12
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 12"

  - id: thirdPartyLicensingCost
    label: Third-Party API & Software Licenses ($ / mo)
    type: number
    default: 5
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 5"

  - id: paymentProcessingRate
    label: Payment Gateway Fee (%)
    type: number
    default: 2.9
    step: 0.1
    min: 0
    max: 10
    suffix: '%'
    placeholder: "e.g., 2.9"

  - id: targetGrossMargin
    label: Target Gross Margin (%)
    type: number
    default: 75
    step: 1
    min: 1
    max: 95
    suffix: '%'
    placeholder: "e.g., 75"

  - id: expectedCustomers
    label: Expected Customer Base Count
    type: number
    default: 300
    step: 10
    min: 1
    placeholder: "e.g., 300"

outputs:
  - id: totalCOGSPerCustomer
    label: Total Monthly COGS per Customer
  - id: requiredPriceMonthly
    label: Calculated Minimum Monthly Price
  - id: grossProfitPerCustomer
    label: Monthly Gross Profit per Customer
  - id: totalMonthlyGrossProfit
    label: Total Monthly Gross Profit
  - id: annualRevenuePotential
    label: Total Annual Gross Revenue

charts:
  tabs:
    - id: costBreakdown
      label: COGS vs Gross Profit
    - id: marginSensitivity
      label: Price by Target Margin %

history_columns:
  - key: totalCOGSPerCustomer
    label: Unit COGS
    source: output
  - key: requiredPriceMonthly
    label: Required Price
    source: output
  - key: grossProfitPerCustomer
    label: Gross Profit
    source: output
  - key: annualRevenuePotential
    label: Annual Revenue
    source: output

js_file: assets/js/calculators/cost-plus-pricing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Cost-Plus Pricing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate SaaS subscription plan prices required to achieve target gross margin percentages given direct COGS."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Direct COGS Unit Economics Modeling"
    - "Target Gross Margin Price Calculation"
    - "Payment Processing Fee Integration"
    - "Gross Profit & Revenue Potential Estimator"
    - "Interactive Margin Sensitivity Visualizations"

breadcrumb:
  - name: Home
    url: /
  - name: Pricing & Packaging
    url: /saas-pricing-packaging
  - name: Cost-Plus Pricing Calculator

howto:
  name: "How to Calculate Cost-Plus Plan Pricing"
  description: "Determine the exact subscription price needed to achieve your target SaaS gross margin percentage."
  step:
    - name: "Input Direct Infrastructure COGS"
      text: "Enter hosting, database, and cloud storage costs per user."
    - name: "Input Customer Support & API Costs"
      text: "Specify support team overhead per customer and third-party software licensing fees."
    - name: "Set Payment Gateway Rate"
      text: "Enter payment processor transaction fee percentage (e.g. 2.9%)."
    - name: "Set Target Gross Margin"
      text: "Input desired gross profit margin percentage (typically 75% to 85%)."
    - name: "Analyze Required Price Point"
      text: "Review the required monthly price needed to protect profitability."

faq:
  - question: "What is Cost-Plus pricing in B2B SaaS?"
    answer: "Cost-Plus pricing sets a product price by adding a fixed markup or target gross margin percentage onto direct Cost of Goods Sold (COGS)."
  - question: "What expenses are included in SaaS COGS?"
    answer: "SaaS COGS includes hosting infrastructure (AWS/GCP), database storage, customer support salaries, third-party API fees (Stripe/Twilio/OpenAI), and merchant processing fees."
  - question: "What expenses are excluded from SaaS COGS?"
    answer: "Sales commissions, marketing ad spend, software R&D engineering salaries, administrative overhead, and legal fees are Operating Expenses (OpEx), not COGS."
  - question: "Why is 75% to 85% considered the standard B2B SaaS gross margin?"
    answer: "A high gross margin (75%+) ensures sufficient gross profit dollars to reinvest in sales, marketing, and R&D engineering required for rapid software growth."
  - question: "How does payment processing fee affect cost-plus calculations?"
    answer: "Because payment fees (e.g. 2.9% + $0.30) are charged on top of total gross revenue, they must be incorporated into the margin divisor formula."
  - question: "What are the limitations of cost-plus pricing?"
    answer: "Cost-plus pricing ignores customer willingness to pay, competitor price points, and perceived software value, often underpricing highly valuable software."

---

# Cost-Plus Pricing Calculator – Target Margin Cost Pricing

Calculate the minimum **subscription price** required to hit your target **gross margin percentage** based on direct infrastructure, support, and licensing costs.

<!-- more -->

## Why Use the Cost-Plus Pricing Calculator?

Before setting consumer-facing prices, every SaaS company must know its **financial floor**. Selling subscriptions below your COGS floor guarantees negative unit economics and cash burn as customer account count grows.

This calculator tallies your direct variable costs — hosting, customer support, third-party APIs, and payment processing fees — to determine your exact required subscription price point.

---

## Key Mathematical Formulas

### 1. Direct COGS per Customer

$$ \text{Direct COGS} = \text{Hosting Cost} + \text{Support Cost} + \text{Licensing Cost} $$

### 2. Required Monthly Price (incorporating Payment Gateway Fees)

$$ \text{Net Target Margin Factor} = 1 - \text{Target Gross Margin \%} - \text{Payment Fee \%} $$

$$ \text{Required Price} = \frac{\text{Direct COGS}}{\text{Net Target Margin Factor}} $$

### 3. Monthly Gross Profit

$$ \text{Gross Profit per Customer} = \text{Required Price} \times (1 - \text{Payment Fee \%}) - \text{Direct COGS} $$

$$ \text{Total Monthly Gross Profit} = \text{Gross Profit per Customer} \times \text{Expected Customers} $$

---

## Real-World SaaS Gross Margin Standards

| Gross Margin Tier | Gross Margin % | Business Health / Evaluation |
| :--- | :--- | :--- |
| **Poor / High COGS** | Below 60% | Heavy human support or high AI API infrastructure cost |
| **Acceptable** | 60% – 74% | Standard hybrid SaaS / managed services |
| **Healthy B2B SaaS** | 75% – 84% | Benchmark standard for scalable software platforms |
| **Best-in-Class** | 85%+ | Pure software automation with minimal support overhead |

---

## Step-by-Step Guide to Calculating Cost-Plus Prices

1. **Audit Monthly AWS / GCP Bills**: Divide total monthly infrastructure spending by active account count.
2. **Calculate Support Cost per Ticket**: Estimate support agent time spent per customer ticket multiplied by hourly rate.
3. **Add Third-Party API Metering**: Include per-user API costs for Twilio, OpenAI, SendGrid, or infrastructure integrations.
4. **Set Required Target Margin**: Plug in your target gross margin percentage (e.g. 75% or 80%) to generate the required price point.

---

## Frequently Asked Questions

### What is Cost-Plus pricing in B2B SaaS?
Cost-Plus pricing sets a product price by adding a fixed markup or target gross margin percentage onto direct Cost of Goods Sold (COGS).

### What expenses are included in SaaS COGS?
SaaS COGS includes hosting infrastructure (AWS/GCP), database storage, customer support salaries, third-party API fees (Stripe/Twilio/OpenAI), and merchant processing fees.

### What expenses are excluded from SaaS COGS?
Sales commissions, marketing ad spend, software R&D engineering salaries, administrative overhead, and legal fees are Operating Expenses (OpEx), not COGS.

### Why is 75% to 85% considered the standard B2B SaaS gross margin?
A high gross margin (75%+) ensures sufficient gross profit dollars to reinvest in sales, marketing, and R&D engineering required for rapid software growth.

### How does payment processing fee affect cost-plus calculations?
Because payment fees (e.g. 2.9% + $0.30) are charged on top of total gross revenue, they must be incorporated into the margin divisor formula.

### What are the limitations of cost-plus pricing?
Cost-plus pricing ignores customer willingness to pay, competitor price points, and perceived software value, often underpricing highly valuable software.
