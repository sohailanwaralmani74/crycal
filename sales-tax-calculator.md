---
layout: tool
title: "Sales Tax | Interactive Online Tool"
description: "Calculate total retail sales tax, combined state and local tax rates, and final itemized receipt costs."
permalink: /sales-tax-calculator
tool_id: sales-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: itemPrice
    label: Before-Tax Item Price
    type: number
    default: 150
    step: 5
    min: 0
    currency: true
    placeholder: "e.g., 150"

  - id: combinedSalesTaxRate
    label: Combined Sales Tax Rate (%)
    type: number
    default: 8.25
    step: 0.125
    min: 0
    max: 20
    suffix: '%'
    placeholder: "e.g., 8.25"

outputs:
  - id: salesTaxAmount
    label: Sales Tax Amount
  - id: totalCostWithTax
    label: Total Price (Including Tax)

charts:
  tabs:
    - id: breakdown
      label: Receipt Price Breakdown
    - id: comparison
      label: Tax vs Base Price

history_columns:
  - key: itemPrice
    label: Base Price
    source: input
  - key: combinedSalesTaxRate
    label: Tax Rate %
    source: input
  - key: salesTaxAmount
    label: Tax Owed
    source: output
  - key: totalCostWithTax
    label: Total Cost
    source: output

js_file: assets/js/calculators/sales-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Sales Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate state and local retail sales tax amounts."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Combined Sales Tax Rate Modeling — calculate state, county, and municipal sales taxes"
    - "Instant Receipt Breakdown — separate base retail price from sales tax owed"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Sales Tax Calculator

howto:
  name: "How to Calculate Sales Tax"
  description: "Determine total purchase price after state and city retail sales tax."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input item price"
      text: "Enter before-tax retail sticker price."
    - name: "Set sales tax rate"
      text: "Input combined state and local sales tax percentage."
    - name: "View receipt total"
      text: "Examine sales tax owed and total final cost."

faq:
  - question: "How do you calculate sales tax on a purchase?"
    answer: "Sales tax is calculated by multiplying the before-tax purchase price by the combined state, county, and local sales tax rate percentage."
  - question: "What is a combined sales tax rate?"
    answer: "A combined sales tax rate is the total sales tax percentage levied on a purchase, combining state-level sales tax, county tax, and local city or municipal sales taxes."
  - question: "Why do sales tax rates vary by city and zip code?"
    answer: "Local jurisdictions (cities, counties, and special transit districts) add local sales tax surcharges on top of state base rates to fund local infrastructure, schools, and emergency services."
  - question: "Are groceries and clothing exempt from sales tax?"
    answer: "In many U.S. states, essential groceries and prescription medicines are exempt from retail sales tax. Some states also offer clothing tax exemptions or annual tax-free holidays."
  - question: "How do I calculate the pre-tax price from a total that includes sales tax?"
    answer: "To extract the before-tax base price from a total inclusive of tax, divide the total price by (1 + Sales Tax Rate / 100)."
  - question: "Does online shopping include sales tax?"
    answer: "Following the South Dakota v. Wayfair Supreme Court ruling, most online retailers collect state and local sales tax based on the buyer's delivery shipping address."
  - question: "Is my personal data stored anywhere?"
    answer: "No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage."
---

# Sales Tax Calculator

Calculate total retail sales tax, combined state and local tax rates, and final itemized receipt costs with our free **Sales Tax Calculator**.

<!-- more -->

## Why Use This Sales Tax Calculator?

Whether shopping for electronics, budgeting for major retail purchases, or managing small business customer billing, knowing exact tax liabilities prevents checkout surprises:

- **🛒 Instant Receipt Breakdown**: Instantly separate net item cost from sales tax owed.
- **🏷️ Combined Rate Support**: Easily handles combined state, county, and local municipal sales tax percentages.
- ** Reverse Tax Calculations**: Quickly determine how much sales tax was added to a purchase.
- **🌍 170+ World Currencies**: Formats all output values into your local currency using the header currency picker.
- **🔒 100% Private & Local**: All calculation logic executes locally in your browser.

---

## Sales Tax Formulas

$$\text{Sales Tax Amount} = \text{Item Price} \times \frac{\text{Combined Sales Tax Rate \%}}{100}$$
$$\text{Total Price} = \text{Item Price} + \text{Sales Tax Amount}$$

### Reverse Sales Tax Formula (Extracting Pre-Tax Price)
$$\text{Item Price (Pre-Tax)} = \frac{\text{Total Price}}{1 + (\text{Sales Tax Rate \%} \div 100)}$$

---

## Sales Tax Breakdown Table ($150 Retail Item)

| Combined Tax Rate (%) | Before-Tax Base Price | Sales Tax Amount Owed | Total Checkout Price |
|---|---|---|---|
| **6.00% (State Base)** | $150.00 | **$9.00** | **$159.00** |
| **7.50% (Avg Metro)** | $150.00 | **$11.25** | **$161.25** |
| **8.25% (Texas Metro)**| $150.00 | **$12.38** | **$162.38** |
| **10.25% (High Rate)**| $150.00 | **$15.38** | **$165.38** |

---

## How to Use This Sales Tax Calculator

1. Select your preferred **account currency** from the header picker.
2. Enter the **before-tax item price** (retail price tag).
3. Input the **combined sales tax rate (%)** for your location.
4. View instant outputs showing the exact **sales tax amount** and **total cost with tax**.
5. Toggle between **Receipt Breakdown** and **Tax vs Base Price** interactive charts.

---

## Frequently Asked Questions

### How do you calculate sales tax on a purchase?
Sales tax is calculated by multiplying the before-tax purchase price by the combined state, county, and local sales tax rate percentage.

### What is a combined sales tax rate?
A combined sales tax rate is the total sales tax percentage levied on a purchase, combining state-level sales tax, county tax, and local city or municipal sales taxes.

### Why do sales tax rates vary by city and zip code?
Local jurisdictions (cities, counties, and special transit districts) add local sales tax surcharges on top of state base rates to fund local infrastructure, schools, and emergency services.

### Are groceries and clothing exempt from sales tax?
In many U.S. states, essential groceries and prescription medicines are exempt from retail sales tax. Some states also offer clothing tax exemptions or annual tax-free holidays.

### How do I calculate the pre-tax price from a total that includes sales tax?
To extract the before-tax base price from a total inclusive of tax, divide the total price by (1 + Sales Tax Rate / 100).

### Does online shopping include sales tax?
Following the South Dakota v. Wayfair Supreme Court ruling, most online retailers collect state and local sales tax based on the buyer's delivery shipping address.

### Is my personal data stored anywhere?
No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage.
