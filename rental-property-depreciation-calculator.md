---
layout: tool
title: "Rental Property Depreciation | Interactive Tool"
description: "Calculate IRS residential rental property depreciation deductions over 27.5 years using straight-line MACRS. 100% free and private browser execution."
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
  - question: "Can land value be depreciated for tax purposes?"
    answer: "No, IRS rules state land does not wear out or decay over time, so land value cannot be depreciated and must be separated from total property cost basis."
  - question: "What is depreciation recapture when selling a rental property?"
    answer: "When selling a property, the IRS taxes total accumulated depreciation claimed (or claimable) at a maximum rate of 25% under Section 1250 depreciation recapture rules."
  - question: "How do capital improvements affect property depreciation schedules?"
    answer: "Major capital improvements (such as roof replacement or HVAC units) are added to building cost basis and depreciated over separate MACRS recovery periods."
  - question: "What happens if I forget to claim depreciation on my tax return?"
    answer: "The IRS calculates depreciation recapture based on allowed or allowable depreciation, meaning you owe recapture tax even if write-offs were never claimed on tax returns."
  - question: "What recovery period applies to commercial rental properties?"
    answer: "Commercial rental properties follow a 39-year MACRS straight-line depreciation schedule, compared to 27.5 years for residential rental properties."
  - question: "Is client financial data stored or transmitted to external servers?"
    answer: "No, all computations execute 100% locally inside your web browser. No personal data, property figures, or tax details are saved or transmitted."
---

# Rental Property Depreciation Calculator

Calculate annual real estate tax depreciation deductions using the **IRS 27.5-Year Straight-Line MACRS Schedule**. Model non-cash paper losses to offset rental income, reduce tax liability, and analyze land value allocations with 100% private browser execution.

<!-- more -->

## Why Use the Rental Property Depreciation Calculator?

Residential rental real estate offers a key tax advantage: tax depreciation write-offs under the Modified Accelerated Cost Recovery System (MACRS). The IRS allows residential property owners to deduct the cost basis of a building over 27.5 years. Because real estate often appreciates, depreciation functions as a non-cash paper expense that shelters rental cash flow from immediate income taxes.

Understanding your annual depreciation write-off is critical for tax planning and budgeting net rental income. Property values are divided between land and building structure. Land is non-depreciable because it does not wear out. Accurately establishing your land-to-building ratio is essential for optimizing tax deductions without triggering IRS audit risks. This calculator models your annual and monthly depreciation allowances while accounting for land allocations securely and privately.

## Mathematical Formulas & Mechanics

Under IRS Code Section 168, residential rental properties placed in service after 1986 follow the 27.5-year straight-line MACRS schedule.

### 1. Land & Building Basis Allocation
The depreciable building basis ($B_{dep}$) is determined by subtracting land value ($L_{amount}$) from total purchase price ($P_{total}$):

$$L_{amount} = P_{total} \times \left(\frac{L_{\%}}{100}\right)$$

$$B_{dep} = P_{total} - L_{amount} = P_{total} \times \left(1 - \frac{L_{\%}}{100}\right)$$

### 2. Annual & Monthly Depreciation Write-Offs
Using straight-line depreciation over 27.5 years, annual ($D_{annual}$) and monthly ($D_{monthly}$) deductions are:

$$D_{annual} = \frac{B_{dep}}{27.5}$$

$$D_{monthly} = \frac{D_{annual}}{12}$$

Where $P_{total}$ represents total acquisition cost, $L_{\%}$ represents estimated land percentage, and $B_{dep}$ represents total depreciable cost basis.

## Real-World Comparison & Benchmark Table

| Property Acquisition Cost | Land Allocation % | Depreciable Building Basis | Annual Tax Deduction (27.5 Yrs) | Monthly Paper Tax Write-Off | 10-Year Cumulative Write-Off |
|---|---|---|---|---|---|
| **$250,000** | 15% ($37,500) | $212,500 | $7,727.27 | $643.94 | $77,272.70 |
| **$400,000** | 20% ($80,000) | $320,000 | $11,636.36 | $969.70 | $116,363.60 |
| **$650,000** | 25% ($162,500) | $487,500 | $17,727.27 | $1,477.27 | $177,272.70 |
| **$1,000,000** | 20% ($200,000) | $800,000 | $29,090.91 | $2,424.24 | $290,909.10 |
| **$1,500,000** | 30% ($450,000) | $1,050,000 | $38,181.82 | $3,181.82 | $381,818.20 |

## Step-by-Step How-To Guide

1. **Enter Total Property Purchase Price**: Input total property acquisition cost including purchase price and closing fees.
2. **Specify Estimated Land Value Percentage**: Select estimated land percentage (typically 15%–30%).
3. **Review Depreciable Building Basis**: Examine calculated depreciable cost basis excluding non-depreciable land allocation.
4. **Analyze Annual & Monthly Write-Offs**: Evaluate annual and monthly paper depreciation expenses available to offset taxable rental profits.
5. **Incorporate Depreciation into Tax Returns**: Use output numbers when filing IRS Schedule E (Form 1040) to minimize tax liability.

## Frequently Asked Questions

### How does IRS rental property depreciation work?
The IRS allows residential real estate investors to write off the building value (excluding land) evenly over 27.5 years as a non-cash paper expense, reducing taxable rental income.

### Can land value be depreciated for tax purposes?
No, IRS rules state land does not wear out or decay over time, so land value cannot be depreciated and must be separated from total property cost basis.

### What is depreciation recapture when selling a rental property?
When selling a property, the IRS taxes total accumulated depreciation claimed (or claimable) at a maximum rate of 25% under Section 1250 depreciation recapture rules.

### How do capital improvements affect property depreciation schedules?
Major capital improvements (such as roof replacement or HVAC units) are added to building cost basis and depreciated over separate MACRS recovery periods.

### What happens if I forget to claim depreciation on my tax return?
The IRS calculates depreciation recapture based on allowed or allowable depreciation, meaning you owe recapture tax even if write-offs were never claimed on tax returns.

### What recovery period applies to commercial rental properties?
Commercial rental properties follow a 39-year MACRS straight-line depreciation schedule, compared to 27.5 years for residential rental properties.

### Is client financial data stored or transmitted to external servers?
No, all computations execute 100% locally inside your web browser. No personal data, property figures, or tax details are saved or transmitted.
