---
layout: tool
title: SaaS Pricing Calculator – Cost-Plus vs. Value-Based Pricing
description: Compare cost-plus and value-based pricing models for your SaaS product. Calculate optimal target tier prices, gross margins, and value capture.
permalink: /saas-pricing-calculator
tool_id: saas-pricing-calculator
category: saas-pricing-packaging
hide_sidebar: true

inputs:
  - id: hostingCostPerUser
    label: Hosting & Infrastructure Cost ($ / user / mo)
    type: number
    default: 5
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 5"

  - id: supportCostPerUser
    label: Customer Support Cost ($ / user / mo)
    type: number
    default: 10
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 10"

  - id: cogsOther
    label: Other Direct COGS ($ / user / mo)
    type: number
    default: 5
    step: 0.5
    min: 0
    currency: true
    placeholder: "e.g., 5"

  - id: targetGrossMargin
    label: Target Gross Margin (%)
    type: number
    default: 80
    step: 1
    min: 1
    max: 99
    suffix: '%'
    placeholder: "e.g., 80"

  - id: customerMonthlyHoursSaved
    label: Customer Monthly Hours Saved
    type: number
    default: 20
    step: 1
    min: 0
    placeholder: "e.g., 20"

  - id: customerHourlyValue
    label: Customer Hourly Value ($ / hr)
    type: number
    default: 50
    step: 5
    min: 0
    currency: true
    placeholder: "e.g., 50"

  - id: valueCapturePercent
    label: Value Capture Share (%)
    type: number
    default: 20
    step: 1
    min: 1
    max: 50
    suffix: '%'
    placeholder: "e.g., 20"

outputs:
  - id: costPlusPrice
    label: Cost-Plus Price ($ / user / mo)
  - id: valueBasedPrice
    label: Value-Based Price ($ / user / mo)
  - id: monthlyValueCreated
    label: Monthly Value Created ($ / user)
  - id: optimalTargetPrice
    label: Recommended Hybrid Target Price
  - id: grossMarginAtTarget
    label: Gross Margin at Target Price

charts:
  tabs:
    - id: breakdown
      label: Model Comparison
    - id: margin
      label: Gross Margin %

history_columns:
  - key: costPlusPrice
    label: Cost-Plus Price
    source: output
  - key: valueBasedPrice
    label: Value-Based Price
    source: output
  - key: optimalTargetPrice
    label: Target Price
    source: output
  - key: grossMarginAtTarget
    label: Margin %
    source: output

js_file: assets/js/calculators/saas-pricing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "SaaS Pricing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Compare cost-plus and value-based SaaS pricing models to determine optimal subscription tier pricing."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Cost-Plus Price Modeling"
    - "Value-Based ROI Pricing Ceiling"
    - "Hybrid Recommended Pricing Target"
    - "Gross Margin Analysis"
    - "Interactive Comparison Charts"

breadcrumb:
  - name: Home
    url: /
  - name: Pricing & Packaging
    url: /saas-pricing-packaging
  - name: SaaS Pricing Calculator

howto:
  name: "How to Calculate SaaS Plan Pricing"
  description: "Evaluate cost-plus floor price and value-based ceiling price to set an optimal SaaS price."
  step:
    - name: "Enter Direct COGS"
      text: "Input hosting, customer support, and direct license costs per customer per month."
    - name: "Set Target Gross Margin"
      text: "Specify your desired SaaS gross margin percentage (typically 75% to 85%)."
    - name: "Quantify Customer Value"
      text: "Enter estimated monthly hours saved per customer and the hourly dollar value of that saved labor."
    - name: "Set Value Share Percentage"
      text: "Enter the percentage of created ROI value you want to capture in subscription pricing."
    - name: "Analyze Output"
      text: "Review the cost-plus floor, value-based ceiling, and optimal hybrid target price."

faq:
  - question: "What is the difference between cost-plus and value-based pricing in SaaS?"
    answer: "Cost-plus pricing calculates price by adding a target gross margin percentage to direct COGS. Value-based pricing bases price on the economic value, ROI, and time saved for the customer."
  - question: "Why is cost-plus pricing considered a floor for SaaS?"
    answer: "Cost-plus ensures you cover unit costs and maintain gross margins, but it ignores customer willingness to pay and often leaves significant revenue on the table."
  - question: "What is an acceptable value capture percentage for B2B SaaS?"
    answer: "Most B2B SaaS platforms capture between 10% and 30% of the total ROI created for customers, leaving 70% to 90% of economic surplus to the customer."
  - question: "What is a good SaaS gross margin percentage?"
    answer: "Healthy B2B SaaS software businesses typically target gross margins between 75% and 85%. Margins below 70% indicate high infrastructure or human support overhead."
  - question: "How does the hybrid target price work?"
    answer: "The hybrid price blends cost-plus floor security with value-based upside, weighting 70% toward value-based pricing while guaranteeing target gross margins."
  - question: "Can I use this calculator for tiered pricing tiers?"
    answer: "Yes, you can run calculations for Starter, Pro, and Enterprise tiers by adjusting user usage assumptions and value metrics per tier."

---

# SaaS Pricing Calculator – Cost-Plus vs. Value-Based Pricing

Calculate and optimize your SaaS subscription tier pricing by comparing **Cost-Plus** pricing floors against **Value-Based** pricing ceilings.

<!-- more -->

## Why Use the SaaS Pricing Calculator?

Pricing is the single most powerful lever for SaaS profitability. Setting prices too low based strictly on hosting costs leads to under-monetization, while pricing above customer ROI leads to high churn. 

This calculator bridges both models:
1. **Cost-Plus Model**: Establishes your absolute pricing floor to guarantee your target gross margin.
2. **Value-Based Model**: Establishes your pricing ceiling based on quantified customer ROI and labor savings.
3. **Hybrid Target Price**: Computes an optimal market price that maximizes revenue while ensuring high customer retention.

---

## Key Mathematical Formulas

### 1. Cost-Plus Pricing Formula

$$ \text{Total COGS} = \text{Hosting Cost} + \text{Support Cost} + \text{Other COGS} $$

$$ \text{Cost-Plus Price} = \frac{\text{Total COGS}}{1 - \text{Target Gross Margin \%}} $$

### 2. Value-Based Pricing Formula

$$ \text{Monthly Value Created} = \text{Hours Saved} \times \text{Hourly Value} $$

$$ \text{Value-Based Price} = \text{Monthly Value Created} \times \text{Value Capture \%} $$

### 3. Recommended Hybrid Price

$$ \text{Hybrid Target Price} = \max\left( \text{Cost-Plus Price}, (0.30 \times \text{Cost-Plus}) + (0.70 \times \text{Value-Based}) \right) $$

---

## Real-World SaaS Pricing Comparison Table

| Metric / Dimension | Cost-Plus Model | Value-Based Model | Recommended Hybrid |
| :--- | :--- | :--- | :--- |
| **Primary Basis** | Infrastructure & Support COGS | Customer ROI & Labor Savings | Balanced Value & Margin |
| **Pricing Floor Security** | High (guarantees margin) | Low (ignores COGS) | High |
| **Monetization Upside** | Low (leaves money on table) | Very High | High |
| **Customer Friction** | Low | Moderate | Low to Moderate |
| **Target B2B Gross Margin** | 75% – 85% | 85% – 95% | 80% – 90% |

---

## Step-by-Step Guide to Pricing Your SaaS

1. **Calculate Direct Unit COGS**: Tally server infrastructure, API costs, customer support agent time, and third-party software licenses required to service a single account.
2. **Determine Target Gross Margin**: Set a minimum target gross margin (e.g. 80%).
3. **Quantify Customer ROI**: Estimate the exact hours saved by using your software, multiplied by employee hourly compensation.
4. **Select Value Capture Rate**: Capture 15% to 25% of the total monthly value created.
5. **Set Tier Price Points**: Establish starter tiers near the cost-plus floor and premium/enterprise tiers near the value-based ceiling.

---

## Frequently Asked Questions

### What is the difference between cost-plus and value-based pricing in SaaS?
Cost-plus pricing calculates price by adding a target gross margin percentage to direct COGS. Value-based pricing bases price on the economic value, ROI, and time saved for the customer.

### Why is cost-plus pricing considered a floor for SaaS?
Cost-plus ensures you cover unit costs and maintain gross margins, but it ignores customer willingness to pay and often leaves significant revenue on the table.

### What is an acceptable value capture percentage for B2B SaaS?
Most B2B SaaS platforms capture between 10% and 30% of the total ROI created for customers, leaving 70% to 90% of economic surplus to the customer.

### What is a good SaaS gross margin percentage?
Healthy B2B SaaS software businesses typically target gross margins between 75% and 85%. Margins below 70% indicate high infrastructure or human support overhead.

### How does the hybrid target price work?
The hybrid price blends cost-plus floor security with value-based upside, weighting 70% toward value-based pricing while guaranteeing target gross margins.

### Can I use this calculator for tiered pricing tiers?
Yes, you can run calculations for Starter, Pro, and Enterprise tiers by adjusting user usage assumptions and value metrics per tier.
