---
layout: tool
title: Estate Tax Calculator – Federal Estate & Exemption Thresholds
description: Calculate potential federal estate taxes and lifetime exemption threshold usage for high-net-worth estates.
permalink: /estate-tax-calculator
tool_id: estate-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: grossEstateValue
    label: Total Gross Estate Value (Assets + Life Insurance)
    type: number
    default: 160000
    step: 5000
    min: 10000
    currency: true
    placeholder: "e.g., 16000000"

  - id: estateDebtsLiabilities
    label: Estate Debts, Mortgages & Expenses
    type: number
    default: 1000000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 1000000"

  - id: lifetimeExemptionLimit
    label: Federal Lifetime Estate Exemption
    type: number
    default: 13610000
    step: 100000
    min: 5000000
    currency: true
    placeholder: "e.g., 13610000"

  - id: estateTaxRatePercent
    label: Top Federal Estate Tax Rate (%)
    type: number
    default: 40.0
    step: 1.0
    min: 10
    max: 50
    suffix: '%'
    placeholder: "e.g., 40.0"

outputs:
  - id: netTaxableEstate
    label: Net Estate Value
  - id: taxableEstateAboveExemption
    label: Taxable Estate Amount Above Exemption
  - id: estimatedEstateTaxOwed
    label: Estimated Federal Estate Tax Liability

charts:
  tabs:
    - id: breakdown
      label: Estate Value vs Exemption
    - id: taxOwed
      label: Federal Estate Tax Liability

history_columns:
  - key: grossEstateValue
    label: Gross Estate
    source: input
  - key: estateDebtsLiabilities
    label: Debts
    source: input
  - key: netTaxableEstate
    label: Net Estate
    source: output
  - key: taxableEstateAboveExemption
    label: Taxable Above Cap
    source: output
  - key: estimatedEstateTaxOwed
    label: Estate Tax
    source: output

js_file: assets/js/calculators/estate-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Estate Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate federal estate tax liabilities and lifetime exemption thresholds."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Federal Exemption Modeling — calculate estate tax liabilities above the federal exemption ($13.61M+)"
    - "Net Estate Calculation — subtract mortgages, debts, and administrative costs"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Estate Tax Calculator

howto:
  name: "How to Calculate Federal Estate Tax"
  description: "Estimate estate tax liability for high-net-worth individuals."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input gross estate assets"
      text: "Enter total estate value including real estate, investments, and life insurance payouts."

faq:
  - question: "What is the federal estate tax exemption?"
    answer: "The federal estate tax exemption is the dollar threshold below which an estate pays zero federal estate tax ($13.61 Million per individual in 2024, or $27.22 Million for married couples)."
---

# Estate Tax Calculator – Federal Estate & Exemption Thresholds

Calculate potential federal estate tax liabilities and exemption limits for high-net-worth estates.

<!-- more -->

## Federal Estate Tax Scenario Table ($16,000,000 Gross Estate)

| Step / Metric | Single Individual | Married Couple (Portability Used) |
|---|---|---|
| **Gross Estate Value** | $16,000,000 | $16,000,000 |
| **Debts & Liabilities** | -$1,000,000 | -$1,000,000 |
| **Net Estate Value** | **$15,000,000** | **$15,000,000** |
| **Lifetime Exemption Limit** | -$13,610,000 | -$27,220,000 ($13.61M × 2) |
| **Taxable Estate Above Cap** | **$1,390,000** | **$0.00** |
| **Estimated Tax Owed (40%)** | **$556,000** | **$0.00 TAX OWE** |

---

## Frequently Asked Questions

### What is the federal estate tax exemption?
The federal estate tax exemption is the dollar threshold below which an estate pays zero federal estate tax ($13.61 Million per individual in 2024, or $27.22 Million for married couples).
