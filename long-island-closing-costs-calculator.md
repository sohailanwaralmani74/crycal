---
layout: tool
title: "Long Island Closing Costs | Interactive Online Tool"
description: "Calculate buyer and seller closing costs for Long Island (Nassau & Suffolk County). Includes mortgage recording tax, title insurance, escrow, and more."
permalink: /long-island-closing-costs-calculator
tool_id: long-island-closing-costs
category: mortgage
hide_sidebar: true

inputs:
  - id: purchasePrice
    label: Purchase Price
    type: number
    default: 685000
    step: 1000
    min: 0
    currency: true

  - id: loanAmount
    label: Loan Amount (if known)
    type: number
    default: 548000
    step: 1000
    min: 0
    currency: true
    placeholder: "Estimate based on down payment"

  - id: downPaymentPercent
    label: Down Payment (%)
    type: number
    default: 20
    step: 1
    min: 0
    max: 100
    suffix: '%'

  - id: annualPropertyTax
    label: Annual Property Tax
    type: number
    default: 12000
    step: 100
    min: 0
    currency: true

  - id: escrowMonths
    label: Escrow Months Collected at Closing
    type: number
    default: 6
    step: 1
    min: 0
    max: 12
    placeholder: "Typically 4-6 months"

  - id: titleInsurance
    label: Title Insurance (estimated)
    type: number
    default: 3500
    step: 100
    min: 0
    currency: true
    placeholder: "Varies by insurer and price"

  - id: attorneyFees
    label: Attorney Fees
    type: number
    default: 2500
    step: 100
    min: 0
    currency: true
    placeholder: "Typical NY range: $1,500–$3,500"

  - id: bankFees
    label: Bank / Lender Fees
    type: number
    default: 1500
    step: 100
    min: 0
    currency: true
    placeholder: "Origination, processing, etc."

  - id: sellerAgentCommission
    label: Seller Agent Commission (%)
    type: number
    default: 3.0
    step: 0.1
    min: 0
    max: 6
    suffix: '%'

  - id: buyerAgentCommission
    label: Buyer Agent Commission (%)
    type: number
    default: 3.0
    step: 0.1
    min: 0
    max: 6
    suffix: '%'

  - id: homeInspection
    label: Home Inspection
    type: number
    default: 600
    step: 50
    min: 0
    currency: true

  - id: appraisal
    label: Appraisal Fee
    type: number
    default: 550
    step: 50
    min: 0
    currency: true

  - id: survey
    label: Survey (if required)
    type: number
    default: 500
    step: 50
    min: 0
    currency: true
    placeholder: "Optional"

  - id: miscFees
    label: Miscellaneous Fees
    type: number
    default: 500
    step: 50
    min: 0
    currency: true
    placeholder: "Courier, notary, recording, etc."

outputs:
  - id: buyerTotal
    label: Total Buyer Closing Costs
  - id: sellerTotal
    label: Total Seller Closing Costs
  - id: mortgageRecordingTax
    label: Mortgage Recording Tax (1.05%)
  - id: nysTransferTax
    label: NYS Transfer Tax (0.4%)
  - id: mansionTax
    label: Mansion Tax (if applicable)
  - id: escrowAmount
    label: Property Tax Escrow
  - id: totalCommission
    label: Total Agent Commission
  - id: cashToClose
    label: Estimated Cash to Close (Buyer)
  - id: netProceeds
    label: Estimated Net Proceeds (Seller)

charts:
  tabs:
    - id: buyerBreakdown
      label: Buyer Costs
    - id: sellerBreakdown
      label: Seller Costs
    - id: comparison
      label: Buyer vs Seller

history_columns:
  - key: purchasePrice
    label: Purchase Price
    source: input
  - key: downPaymentPercent
    label: Down Payment (%)
    source: input
  - key: annualPropertyTax
    label: Annual Tax
    source: input
  - key: buyerTotal
    label: Buyer Closing Costs
    source: output
  - key: sellerTotal
    label: Seller Closing Costs
    source: output
  - key: cashToClose
    label: Cash to Close
    source: output

js_file: assets/js/calculators/long-island-closing-costs.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Long Island Closing Costs Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate buyer and seller closing costs for Nassau and Suffolk County homes including mortgage recording tax, title insurance, escrow, and commissions."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Buyer & Seller Cost Breakdown"
    - "Nassau & Suffolk County Specific Rates"
    - "Mortgage Recording Tax (1.05%)"
    - "Mansion Tax (1% over $1M)"
    - "Property Tax Escrow Calculation"
    - "Visual Cost Comparison Charts"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Long Island Closing Costs Calculator

howto:
  name: "How to Use the Long Island Closing Costs Calculator"
  description: "Follow these steps to estimate your closing costs for a Long Island home purchase."
  step:
    - name: "Enter the purchase price"
      text: "Enter the home price you're considering."
    - name: "Enter your loan amount or down payment"
      text: "Enter the loan amount if known, or your down payment percentage."
    - name: "Enter your annual property tax"
      text: "Check the property's current tax bill or estimate based on the tax rate."
    - name: "Set escrow months"
      text: "Enter how many months of property tax the lender will collect at closing (typically 4-6 months)."
    - name: "Enter remaining fees"
      text: "Add estimated costs for title insurance, attorney, bank fees, inspection, and appraisal."
    - name: "Adjust commissions"
      text: "Set the agent commission percentages (typically 3% each for buyer and seller agent)."
    - name: "View results"
      text: "See your total buyer and seller closing costs, cash to close, and net proceeds."

faq:
  - question: "What is the mortgage recording tax on Long Island?"
    answer: "The mortgage recording tax is 1.05% of the loan amount in Nassau and Suffolk counties. This includes 0.80% to the county and 0.25% to New York State."
  - question: "What is the mansion tax?"
    answer: "The mansion tax is a 1% tax on purchases of $1,000,000 or more in New York State. It's paid by the buyer at closing."
  - question: "How much are closing costs for a buyer on Long Island?"
    answer: "Buyers typically pay 2% to 6% of the purchase price. On a $685,000 home, this ranges from $17,125 to $34,250."
  - question: "What closing costs does the seller pay on Long Island?"
    answer: "Sellers typically pay 8% to 10% of the sale price, including agent commissions (5-6%), NYS transfer tax (0.4%), and additional county taxes."
  - question: "What is included in the escrow at closing?"
    answer: "Lenders collect property tax escrow at closing to build a cushion for future tax payments. Typical escrow is 4-6 months of annual property taxes."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Long Island Closing Costs Calculator

Use this **Long Island closing costs calculator** to estimate buyer and seller closing costs for homes in Nassau and Suffolk counties. Includes mortgage recording tax (1.05%), mansion tax, title insurance, property tax escrow, and agent commissions — all with a detailed cost breakdown.

<!-- more -->

## Why Use This Long Island Closing Costs Calculator

Closing costs on Long Island are among the highest in the country due to unique state and county taxes. This tool helps you:

- 🏠 **Estimate Buyer Costs** — from mortgage recording tax to attorney fees.
- 📊 **Calculate Seller Costs** — commissions, transfer tax, and more.
- 💰 **Plan Your Cash to Close** — know exactly what you need at the table.
- 📈 **Visual Cost Breakdown** — see where your money goes.
- 🔒 **100% Private** — everything runs locally in your browser.

---

## Long Island Closing Costs Explained

### Buyer Closing Costs
| Cost | Rate / Estimate |
|------|-----------------|
| **Mortgage Recording Tax** | **1.05%** of loan amount (0.80% county + 0.25% state) |
| **Mansion Tax** | **1%** on purchases ≥ $1,000,000 |
| **Title Insurance** | ~$3,500 (varies by insurer) |
| **Attorney Fees** | $1,500 – $3,500 |
| **Bank / Lender Fees** | $1,000 – $2,500 |
| **Property Tax Escrow** | 4-6 months of annual taxes |
| **Home Inspection** | ~$600 |
| **Appraisal Fee** | ~$550 |

### Seller Closing Costs
| Cost | Rate / Estimate |
|------|-----------------|
| **Agent Commission** | 5-6% total (split between buyer/seller agents) |
| **NYS Transfer Tax** | **0.4%** of sale price |
| **County Transfer Tax** | Varies by county (~0.20% in Nassau/Suffolk) |
| **Attorney Fees** | $1,500 – $3,500 |
| **Title Insurance (Owner's)** | Typically paid by seller |

---

## How Closing Costs Are Calculated

**Buyer Costs** = Mortgage Recording Tax + Mansion Tax (if ≥$1M) + Title Insurance + Attorney + Bank Fees + Escrow + Inspection + Appraisal + Survey + Miscellaneous

**Seller Costs** = Agent Commission + NYS Transfer Tax + County Transfer Tax + Attorney + Title Insurance + Miscellaneous

**Cash to Close (Buyer)** = Down Payment + Buyer Closing Costs – Seller Credits (if any)

**Net Proceeds (Seller)** = Sale Price – Seller Closing Costs – Mortgage Payoff

---

## How to Use This Calculator

1. Enter the **purchase price**.
2. Enter your **loan amount** or **down payment percentage**.
3. Enter the **annual property tax** for the home.
4. Set **escrow months** collected at closing (typically 4-6).
5. Adjust estimated fees for title insurance, attorney, and bank.
6. Set agent commission percentages (defaults: 3% each).
7. View your detailed breakdown and charts.

---

## Frequently Asked Questions

### What is the mortgage recording tax on Long Island?
The mortgage recording tax is 1.05% of the loan amount in Nassau and Suffolk counties — one of the highest rates in the country.

### What is the mansion tax?
It's a 1% tax on purchases of $1,000,000 or more in New York State, paid by the buyer.

### How much are closing costs for a buyer on Long Island?
Buyers typically pay 2% to 6% of the purchase price. On a $685,000 home, expect $17,125–$34,250.

### What closing costs does the seller pay?
Sellers pay agent commissions (5-6%), NYS transfer tax (0.4%), and county transfer taxes — typically 8-10% of the sale price.

### How does property tax escrow work?
Lenders collect 4-6 months of property taxes at closing to build a cushion for future tax payments. This amount is held in your escrow account.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent anywhere.

---