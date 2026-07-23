---
layout: tool
title: Gift Tax Calculator – Annual Exclusion & Lifetime Exemption
description: Calculate IRS gift tax reporting requirements, annual exclusion limits, and lifetime estate tax exemption usage.
permalink: /gift-tax-calculator
tool_id: gift-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: giftAmount
    label: Total Financial Gift Amount
    type: number
    default: 45000
    step: 5000
    min: 1000
    currency: true
    placeholder: "e.g., 45000"

  - id: annualExclusionLimit
    label: Annual Gift Exclusion Limit Per Recipient
    type: number
    default: 18000
    step: 1000
    min: 10000
    max: 25000
    currency: true
    placeholder: "e.g., 18000"

  - id: recipientCount
    label: Number of Gift Recipients
    type: number
    default: 1
    step: 1
    min: 1
    max: 20
    placeholder: "e.g., 1"

outputs:
  - id: totalExemptGiftAmount
    label: Total Annual Tax-Exempt Gift Amount
  - id: reportableTaxableGift
    label: Reportable Gift (IRS Form 709 Requirement)
  - id: immediateTaxOwed
    label: Immediate Tax Owed (Offset by Lifetime Exemption)

charts:
  tabs:
    - id: breakdown
      label: Gift Tax Allocation
    - id: exemption
      label: Lifetime Exemption Impact

history_columns:
  - key: giftAmount
    label: Gift Amount
    source: input
  - key: annualExclusionLimit
    label: Exclusion Limit
    source: input
  - key: recipientCount
    label: Recipients
    source: input
  - key: totalExemptGiftAmount
    label: Exempt Amount
    source: output
  - key: reportableTaxableGift
    label: Form 709 Reportable
    source: output

js_file: assets/js/calculators/gift-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Gift Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate IRS gift tax reporting requirements and annual exclusion limits."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Annual Exclusion Limit Modeling — apply per-recipient annual gift limits ($18,000 in 2024)"
    - "Form 709 Filing Indicator — identify reportable gifts reducing lifetime estate exemptions"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Gift Tax Calculator

howto:
  name: "How to Calculate Gift Taxes"
  description: "Determine whether financial gifts require IRS Form 709 reporting."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input gift amount & recipients"
      text: "Enter total financial gift amount and recipient count."

faq:
  - question: "Who pays the gift tax—the giver or the receiver?"
    answer: "The giver (donor) is responsible for filing gift tax returns and paying any applicable taxes. The recipient receives gifts tax-free."
---

# Gift Tax Calculator – Annual Exclusion & Lifetime Exemption

Calculate annual IRS exclusion limits, Form 709 reporting thresholds, and lifetime estate exemption usage with our free **Gift Tax Calculator**.

<!-- more -->

## Annual Gift Exclusion Overview ($18,000 / Recipient)

- **Annual Per-Recipient Exclusion**: You can give up to **$18,000 per year per recipient** (or $36,000 for married couples splitting gifts) without needing to file a gift tax return.
- **Form 709 Filing**: Gifts exceeding $18,000 per recipient must be reported on IRS Form 709, but no out-of-pocket tax is owed until your total lifetime gifts exceed the lifetime estate exemption ($13.61 Million+).

---

## Gift Tax Reporting Table ($45,000 Total Gift)

| Number of Recipients | Total Gift Amount | Total Annual Exclusion | Reportable Gift (Form 709) | Out-of-Pocket Tax Owed |
|---|---|---|---|---|
| **1 Recipient** | $45,000 | $18,000 | **$27,000 (Reported)** | **$0.00 (Reduced Lifetime Cap)** |
| **2 Recipients ($22.5k ea)**| $45,000 | $36,000 ($18k × 2) | **$9,000 (Reported)** | **$0.00** |
| **3 Recipients ($15k ea)** | $45,000 | $54,000 ($18k × 3) | **$0.00 (No Filing Needed)**| **$0.00** |

---

## Frequently Asked Questions

### Who pays the gift tax—the giver or the receiver?
The giver (donor) is responsible for filing gift tax returns and paying any applicable taxes. The recipient receives gifts tax-free.
