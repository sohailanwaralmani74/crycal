---
layout: tool
title: "1031 Exchange | Interactive Online Tool"
description: "Calculate capital gains tax deferrals, boot liability, and replacement property cost requirements under IRS Section 1031 exchanges."
permalink: /1031-exchange-calculator
tool_id: 1031-exchange-calculator
category: investing
hide_sidebar: true

inputs:
  - id: relinquishedPropertySalePrice
    label: Relinquished Property Sale Price
    type: number
    default: 850000
    step: 25000
    min: 10000
    currency: true
    placeholder: "e.g., 850000"

  - id: originalCostBasis
    label: Adjusted Cost Basis (Purchase Price - Depreciation + Improvements)
    type: number
    default: 350000
    step: 25000
    min: 10000
    currency: true
    placeholder: "e.g., 350000"

  - id: replacementPropertyPurchasePrice
    label: Target Replacement Property Purchase Price
    type: number
    default: 950000
    step: 25000
    min: 10000
    currency: true
    placeholder: "e.g., 950000"

  - id: capitalGainsTaxRate
    label: Combined Federal & State Capital Gains Tax Rate (%)
    type: number
    default: 25.0
    step: 1.0
    min: 0
    max: 45
    suffix: '%'
    placeholder: "e.g., 25.0"

outputs:
  - id: totalRealizedCapitalGain
    label: Total Realized Capital Gain
  - id: deferredCapitalGainsTax
    label: Total Capital Gains Tax Deferred
  - id: bootTaxLiability
    label: Taxable Boot (Cash or Debt Relief)

charts:
  tabs:
    - id: breakdown
      label: Tax Deferred vs Paid
    - id: comparison
      label: Property Value Trade Comparison

history_columns:
  - key: relinquishedPropertySalePrice
    label: Relinquished Price
    source: input
  - key: replacementPropertyPurchasePrice
    label: Replacement Price
    source: input
  - key: totalRealizedCapitalGain
    label: Realized Gain
    source: output
  - key: deferredCapitalGainsTax
    label: Tax Deferred
    source: output
  - key: bootTaxLiability
    label: Boot Tax
    source: output

js_file: assets/js/calculators/1031-exchange-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "1031 Exchange Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Section 1031 like-kind exchange capital gains tax deferrals and taxable boot."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRS Section 1031 Tax Deferral Modeling — calculate capital gains and depreciation recapture tax savings"
    - "Taxable Boot Calculation — detect cash boot and mortgage debt relief tax liabilities"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: 1031 Exchange Calculator

howto:
  name: "How to Calculate 1031 Exchange Tax Deferrals"
  description: "Calculate capital gains tax deferred through a like-kind exchange."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input sale & replacement prices"
      text: "Enter relinquished property price, adjusted basis, and replacement property cost."

faq:
  - question: "What is an IRS Section 1031 Like-Kind Exchange?"
    answer: "Section 1031 allows real estate investors to defer paying capital gains and depreciation recapture taxes upon selling an investment property by reinvesting the proceeds into a replacement like-kind property."
  - question: "What are the key timelines for a 1031 exchange?"
    answer: "Investors have 45 calendar days from sale closing to formally identify replacement properties, and must close on the replacement property within 180 calendar days."
  - question: "What is 'boot' in a 1031 exchange?"
    answer: "Boot is any non-like-kind property received in an exchange, such as cash kept or debt reduction. Boot is fully taxable up to the total realized capital gain."
  - question: "Can a primary residence qualify for a 1031 exchange?"
    answer: "No. Section 1031 applies exclusively to real estate held for investment or productive use in a trade or business. Primary residences do not qualify."
  - question: "Who holds the funds during a 1031 exchange?"
    answer: "A Qualified Intermediary (QI) must hold all sale proceeds. If the seller touches or receives the cash directly, the 1031 exchange is disqualified and taxes become immediately due."
  - question: "What qualifies as 'like-kind' real estate?"
    answer: "Nearly all real property within the U.S. is like-kind to other U.S. real property (e.g., selling a single-family rental to buy an apartment building or commercial retail space)."
  - question: "Is my personal financial data saved on any server?"
    answer: "No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage."
---

# 1031 Exchange Calculator

Calculate capital gains tax deferrals, boot liability, and replacement property cost requirements under **IRS Section 1031** like-kind exchanges with our free calculator.

<!-- more -->

## Key 1031 Exchange Rules

- **Equal or Greater Value Rule**: To defer 100% of taxes, the replacement property purchase price must be equal to or greater than the net sale price of the relinquished property.
- **45-Day Identification Period**: Investors have 45 calendar days from sale closing to identify replacement properties.
- **180-Day Exchange Period**: Replacement property acquisition must close within 180 calendar days of selling the original property.

---

## 1031 Exchange Scenario Table ($850,000 Relinquished Sale / $350,000 Basis)

| Replacement Property Purchase Price | Realized Capital Gain | Taxable Boot (Cash Keep) | Capital Gains Tax Deferred | Taxable Boot Owed (25%) |
|---|---|---|---|---|
| **$950,000 (Greater Value)** | $500,000 | $0.00 | **$125,000 (100% Deferred)**| **$0.00** |
| **$850,000 (Equal Value)** | $500,000 | $0.00 | **$125,000 (100% Deferred)**| **$0.00** |
| **$750,000 ($100k Less)** | $500,000 | $100,000 | **$100,000 Deferred** | **$25,000 Tax Owed (Boot)** |

---

## How to Use This 1031 Exchange Calculator

1. Select your preferred **account currency** from the header picker.
2. Enter **relinquished property sale price** (e.g., $850,000).
3. Input **adjusted cost basis** (purchase price - depreciation + improvements).
4. Enter target **replacement property purchase price** (e.g., $950,000).
5. Set combined **capital gains tax rate (%)**.
6. View total realized capital gain, tax deferred amount, and taxable boot liability.

---

## Frequently Asked Questions

### What is an IRS Section 1031 Like-Kind Exchange?
Section 1031 allows real estate investors to defer paying capital gains and depreciation recapture taxes upon selling an investment property by reinvesting the proceeds into a replacement like-kind property.

### What are the key timelines for a 1031 exchange?
Investors have 45 calendar days from sale closing to formally identify replacement properties, and must close on the replacement property within 180 calendar days.

### What is 'boot' in a 1031 exchange?
Boot is any non-like-kind property received in an exchange, such as cash kept or debt reduction. Boot is fully taxable up to the total realized capital gain.

### Can a primary residence qualify for a 1031 exchange?
No. Section 1031 applies exclusively to real estate held for investment or productive use in a trade or business. Primary residences do not qualify.

### Who holds the funds during a 1031 exchange?
A Qualified Intermediary (QI) must hold all sale proceeds. If the seller touches or receives the cash directly, the 1031 exchange is disqualified and taxes become immediately due.

### What qualifies as 'like-kind' real estate?
Nearly all real property within the U.S. is like-kind to other U.S. real property (e.g., selling a single-family rental to buy an apartment building or commercial retail space).

### Is my personal financial data saved on any server?
No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage.
