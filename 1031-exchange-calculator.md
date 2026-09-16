---
layout: tool
title: "1031 Exchange Calculator | Capital Gains Tax Deferral"
description: "Calculate capital gains tax deferrals, boot liability, and replacement property cost requirements under IRS Section 1031 exchanges."
permalink: /1031-exchange-calculator/
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
    answer: "A primary residence cannot qualify for a 1031 exchange, because Section 1031 applies exclusively to real estate held for investment or productive business use."
  - question: "Who holds the funds during a 1031 exchange?"
    answer: "A Qualified Intermediary (QI) must hold all sale proceeds. If the seller touches or receives the cash directly, the 1031 exchange is disqualified and taxes become immediately due."
  - question: "What qualifies as 'like-kind' real estate?"
    answer: "Nearly all real property within the U.S. is like-kind to other U.S. real property (e.g., selling a single-family rental to buy an apartment building or commercial retail space)."
---

# 1031 Exchange Calculator – Defer Your Capital Gains Taxes Smartly

Selling an investment property and worried about the tax hit? Our **1031 Exchange Calculator** helps you estimate exactly how much tax you can defer under IRS Section 1031—so you can keep more of your money working for you.

<!-- more -->

## Key Rules You Should Know

Before diving in, here are the three critical timelines and rules that govern a 1031 exchange:

- **Equal or Greater Value Rule** — To defer 100% of your taxes, your replacement property must cost at least as much as your relinquished property sold for.
- **45-Day Identification Period** — You have 45 calendar days from the sale closing to identify potential replacement properties in writing.
- **180-Day Exchange Period** — You must close on your replacement property within 180 calendar days of selling your original property.

---

## Real-World Scenario: See How It Works

*Let's say you sell a property for $850,000, and your adjusted cost basis is $350,000. Here's how different replacement property prices affect your tax deferral:*

| Replacement Property Price | Realized Capital Gain | Taxable Boot (Cash Kept) | Capital Gains Tax Deferred | Tax Owed on Boot (25%) |
|---|---|---|---|---|
| **$950,000 (Greater Value)** | $500,000 | $0.00 | **$125,000 (100% Deferred)** | **$0.00** |
| **$850,000 (Equal Value)** | $500,000 | $0.00 | **$125,000 (100% Deferred)** | **$0.00** |
| **$750,000 ($100k Less)** | $500,000 | $100,000 | **$100,000 Deferred** | **$25,000 Tax Owed** |

*The takeaway? If you keep any cash (boot), you'll owe taxes on that amount—so reinvesting all proceeds into a like-kind property maximizes your deferral.*

---

## The Math Behind the Tool (Made Simple)

Your realized capital gain is calculated as:

**Capital Gain = Sale Price of Relinquished Property − Adjusted Cost Basis**

Your **adjusted cost basis** is what you originally paid, plus improvements, minus any depreciation taken over the years.

If your replacement property costs less than your sale price, the difference becomes **boot**—cash you keep—which is taxable.

**Tax Deferred** = Total Capital Gain − Taxable Boot

---

## How to Use This Calculator

Getting your tax deferral estimate is quick and straightforward:

1. **Pick your currency** from the selector in the site header.
2. **Enter your relinquished property sale price** (e.g., $850,000).
3. **Input your adjusted cost basis** — your purchase price, plus improvements, minus depreciation.
4. **Set your target replacement property price** (e.g., $950,000).
5. **Enter your combined capital gains tax rate** (federal + state).
6. View your results instantly — total capital gain, tax deferred, and any taxable boot liability.

---

## Who Benefits from the 1031 Exchange Calculator?

This tool is designed for:

- **Real estate investors** — planning their next 1031 exchange
- **Property flippers** — understanding tax implications before selling
- **Financial advisors** — modeling client investment property transitions
- **Anyone** — considering a like-kind exchange and wanting to see the numbers

---

## Common Questions About 1031 Exchanges

### What is a 1031 like-kind exchange?

It's a tax-deferral strategy under IRS Section 1031 that allows real estate investors to sell an investment property and reinvest the proceeds into a "like-kind" property—without paying capital gains taxes on the sale, as long as certain rules are followed.

### What are the critical timelines?

You have **45 days** to identify replacement properties after closing, and **180 days** total to complete the purchase. Miss these deadlines, and your exchange fails.

### What exactly is 'boot'?

Boot is any cash or non-real estate value you receive or keep from the exchange—like leftover sale proceeds or debt reduction. Boot is taxable up to the amount of your realized capital gain.

### Can I use a 1031 exchange for my primary residence?

No—Section 1031 applies only to property held for investment or business use, not your personal home.

### Who handles the money during the exchange?

A **Qualified Intermediary (QI)** must hold all sale proceeds. If you take possession of the cash directly, the exchange is disqualified and taxes become due immediately.

### What counts as 'like-kind' property?

Nearly all U.S. real estate qualifies as like-kind to other U.S. real estate. You can sell a single-family rental and buy an apartment building, commercial space, or even vacant land—as long as it's held for investment or business use.