---
layout: tool
title: Rental Property Depreciation Calculator – IRS 27.5-Year MACRS Schedule
description: Calculate annual real estate tax depreciation deductions using the IRS 27.5-year straight-line MACRS depreciation schedule.
permalink: /rental-property-depreciation-calculator
tool_id: rental-property-depreciation-calculator
category: tax
hide_sidebar: true

inputs:
  - id: totalPropertyPurchasePrice
    label: Total Property Purchase Price
    type: number
    default: 400000
    step: 10000
    min: 10000
    currency: true
    placeholder: "e.g., 400000"

  - id: landValuePercent
    label: Estimated Land Value (%) (Land Cannot Be Depreciated)
    type: number
    default: 20
    step: 5
    min: 5
    max: 50
    suffix: '%'
    placeholder: "e.g., 20"

outputs:
  - id: landValueAmount
    label: Non-Depreciable Land Value
  - id: depreciableBuildingBasis
    label: Depreciable Building Cost Basis
  - id: annualDepreciationDeduction
    label: Annual IRS Tax Depreciation Write-Off (27.5 Yrs)
  - id: monthlyDepreciationDeduction
    label: Monthly Tax Depreciation Write-Off

charts:
  tabs:
    - id: breakdown
      label: Asset Value Allocation
    - id: cumulative
      label: Cumulative Depreciation Write-Off

history_columns:
  - key: totalPropertyPurchasePrice
    label: Purchase Price
    source: input
  - key: landValuePercent
    label: Land %
    source: input
  - key: depreciableBuildingBasis
    label: Building Basis
    source: output
  - key: annualDepreciationDeduction
    label: Annual Write-Off
    source: output

js_file: assets/js/calculators/rental-property-depreciation-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rental Property Depreciation Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate IRS 27.5-year MACRS straight-line depreciation tax write-offs for residential rental property."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRS 27.5-Year Residential MACRS Schedule — calculate annual paper tax write-offs"
    - "Land Value Separation — separate non-depreciable land value from depreciable structure value"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Rental Property Depreciation Calculator

howto:
  name: "How to Calculate Rental Property Depreciation"
  description: "Calculate annual IRS tax depreciation write-offs for residential rental real estate."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input purchase price & land %"
      text: "Enter total property purchase price and land percentage."

faq:
  - question: "How does IRS rental property depreciation work?"
    answer: "The IRS allows residential real estate investors to write off the building value (excluding land) evenly over 27.5 years as a non-cash paper expense, reducing taxable rental income."
---

# Rental Property Depreciation Calculator – IRS 27.5-Year MACRS Schedule

Calculate annual real estate tax depreciation write-offs using the **IRS 27.5-Year Straight-Line MACRS Schedule**.

<!-- more -->

## Depreciation Schedule Table ($400,000 Residential Purchase)

| Asset Component | Value Allocation | Depreciable? | Annual IRS Write-Off | 27.5-Yr Cumulative Tax Deductions |
|---|---|---|---|---|
| **Land Value (20%)** | $80,000 | ❌ No | $0.00 | $0.00 |
| **Building Structure Basis (80%)** | **$320,000** | ✅ Yes | **$11,636.36 / year** | **$320,000.00** |

---

## Frequently Asked Questions

### How does IRS rental property depreciation work?
The IRS allows residential real estate investors to write off the building value (excluding land) evenly over 27.5 years as a non-cash paper expense, reducing taxable rental income.
