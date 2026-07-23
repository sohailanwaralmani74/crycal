---
layout: tool
title: GST Calculator – Add or Remove Goods & Services Tax
description: Calculate Goods and Services Tax (GST) additions or reverse calculations to extract net price and tax amounts.
permalink: /gst-calculator
tool_id: gst-calculator
category: tax
hide_sidebar: true

inputs:
  - id: amount
    label: Base Amount / Price
    type: number
    default: 500
    step: 10
    min: 0
    currency: true
    placeholder: "e.g., 500"

  - id: gstRate
    label: GST Rate (%)
    type: number
    default: 18.0
    step: 0.5
    min: 0
    max: 50
    suffix: '%'
    placeholder: "e.g., 18.0"

  - id: calculationType
    label: Calculation Mode
    type: select
    default: Add GST (Net to Gross)
    options:
      - Add GST (Net to Gross)
      - Remove GST (Gross to Net)

outputs:
  - id: netAmount
    label: Net Amount (Exclusive of GST)
  - id: gstAmount
    label: Calculated GST Tax Amount
  - id: grossAmount
    label: Gross Amount (Inclusive of GST)

charts:
  tabs:
    - id: breakdown
      label: GST Amount Breakdown
    - id: comparison
      label: Net vs Gross Price

history_columns:
  - key: amount
    label: Base Amount
    source: input
  - key: gstRate
    label: GST Rate %
    source: input
  - key: calculationType
    label: Mode
    source: input
  - key: netAmount
    label: Net Price
    source: output
  - key: gstAmount
    label: GST Tax
    source: output
  - key: grossAmount
    label: Gross Price
    source: output

js_file: assets/js/calculators/gst-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "GST Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Goods and Services Tax (GST) additions or removals globally."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Forward & Reverse GST Calculation — add GST to net prices or extract tax from gross inclusive amounts"
    - "Custom Tax Rate Support — support 5%, 12%, 18%, 28% or custom international GST rates"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: GST Calculator

howto:
  name: "How to Calculate GST"
  description: "Add or remove GST from product prices."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input price & GST rate"
      text: "Enter base price amount and applicable GST percentage."
    - name: "Select mode"
      text: "Choose 'Add GST' or 'Remove GST'."

faq:
  - question: "How do you calculate GST?"
    answer: "To add GST: Net Amount × (GST Rate / 100). To remove GST: Gross Amount - (Gross Amount / (1 + GST Rate / 100))."
---

# GST Calculator – Add or Remove Goods & Services Tax

Calculate Goods and Services Tax (**GST**) additions or reverse calculations to extract net price and tax amounts with our free **GST Calculator**.

<!-- more -->

## GST Calculation Formulas

### 1. Add GST (Exclusive to Inclusive)
$$\text{GST Tax} = \text{Net Price} \times \frac{\text{GST \%}}{100}$$
$$\text{Gross Price} = \text{Net Price} + \text{GST Tax}$$

### 2. Remove GST (Inclusive to Exclusive)
$$\text{Net Price} = \frac{\text{Gross Price}}{1 + (\text{GST \%} \div 100)}$$
$$\text{GST Tax} = \text{Gross Price} - \text{Net Price}$$

---

## GST Scenario Table ($500 Base Amount @ 18% GST)

| Mode | Base Input Amount | Net Price (Excl) | GST Tax Amount (18%) | Gross Total (Incl) |
|---|---|---|---|---|
| **Add GST** | $500.00 (Net) | **$500.00** | **$90.00** | **$590.00** |
| **Remove GST** | $500.00 (Gross) | **$423.73** | **$76.27** | **$500.00** |

---

## Frequently Asked Questions

### How do you calculate GST?
To add GST: Net Amount × (GST Rate / 100). To remove GST: Gross Amount - (Gross Amount / (1 + GST Rate / 100)).
