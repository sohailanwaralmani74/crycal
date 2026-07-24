---
layout: tool
title: "Closing Costs | Interactive Online Tool"
description: "Enter loan amount, origination fees, appraisal, title insurance, and more to see your total closing costs and percentage. Estimate Closing cost."
permalink: /closing-costs-calculator
tool_id: closing-costs
category: mortgage
hide_sidebar: true

inputs:
  - id: loanAmount
    label: Loan Amount
    type: number
    default: 300000
    step: 1000
    min: 0
    currency: true
    placeholder: "Total mortgage amount"

  - id: originationFee
    label: Loan Origination Fee
    type: number
    default: 1500
    step: 100
    min: 0
    currency: true
    placeholder: "Lender origination or processing fee"

  - id: appraisalFee
    label: Appraisal Fee
    type: number
    default: 500
    step: 50
    min: 0
    currency: true
    placeholder: "Property appraisal cost"

  - id: titleInsurance
    label: Title Insurance
    type: number
    default: 2000
    step: 100
    min: 0
    currency: true
    placeholder: "Lender's title insurance policy"

  - id: escrowFees
    label: Escrow / Settlement Fees
    type: number
    default: 800
    step: 50
    min: 0
    currency: true
    placeholder: "Closing agent or attorney fees"

  - id: recordingFees
    label: Recording & Transfer Fees
    type: number
    default: 300
    step: 50
    min: 0
    currency: true
    placeholder: "County recording and transfer taxes"

  - id: inspectionFees
    label: Inspection Fees
    type: number
    default: 400
    step: 50
    min: 0
    currency: true
    placeholder: "Home inspection, pest, etc."

  - id: surveyFee
    label: Survey Fee
    type: number
    default: 250
    step: 50
    min: 0
    currency: true
    placeholder: "Property survey if required"

  - id: prepaidInterest
    label: Prepaid Interest
    type: number
    default: 500
    step: 50
    min: 0
    currency: true
    placeholder: "Interest due at closing"

  - id: homeownersInsurance
    label: Homeowner's Insurance (first year)
    type: number
    default: 1200
    step: 100
    min: 0
    currency: true
    placeholder: "First year premium"

  - id: propertyTaxEscrow
    label: Property Tax Escrow
    type: number
    default: 1500
    step: 100
    min: 0
    currency: true
    placeholder: "Initial escrow deposit"

  - id: otherClosingCosts
    label: Other Closing Costs
    type: number
    default: 0
    step: 100
    min: 0
    currency: true
    placeholder: "Any additional fees"

outputs:
  - id: totalClosingCosts
    label: Total Closing Costs
  - id: percentOfLoan
    label: Percent of Loan Amount

  - id: originationFeeDisplay
    label: Origination Fee
  - id: appraisalFeeDisplay
    label: Appraisal Fee
  - id: titleInsuranceDisplay
    label: Title Insurance
  - id: escrowFeesDisplay
    label: Escrow / Settlement Fees
  - id: recordingFeesDisplay
    label: Recording Fees
  - id: inspectionFeesDisplay
    label: Inspection Fees
  - id: surveyFeeDisplay
    label: Survey Fee
  - id: prepaidInterestDisplay
    label: Prepaid Interest
  - id: homeownersInsuranceDisplay
    label: Homeowner's Insurance
  - id: propertyTaxEscrowDisplay
    label: Property Tax Escrow
  - id: otherClosingCostsDisplay
    label: Other Costs

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: comparison
      label: Comparison

history_columns:
  - key: loanAmount
    label: Loan Amount
    source: input
  - key: totalClosingCosts
    label: Total Closing Costs
    source: output
  - key: percentOfLoan
    label: Percent of Loan
    source: output

js_file: assets/js/calculators/closing-costs.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Closing Costs Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate total closing costs for a home purchase or refinance. Enter loan amount, origination fees, appraisal, title insurance, and more."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Detailed Cost Breakdown — see every component of your closing costs"
    - "Percentage of Loan — see closing costs as a percentage of your loan"
    - "Visual Charts — see your cost breakdown"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Closing Costs Calculator

howto:
  name: "How to Use the Closing Costs Calculator"
  description: "Follow these steps to estimate your closing costs."
  step:
    - name: "Enter your loan amount"
      text: "Enter the total mortgage amount."
    - name: "Enter each closing cost component"
      text: "Enter the estimated cost for each category (origination, appraisal, title, etc.)."
    - name: "View your results"
      text: "See your total closing costs, percentage of loan, and detailed breakdown."

faq:
  - question: "What are closing costs?"
    answer: "Closing costs are fees and expenses paid at the closing of a real estate transaction. They include lender fees, third-party fees, and prepaid items like insurance and taxes."
  - question: "How much are closing costs typically?"
    answer: "Closing costs typically range from 2% to 5% of the loan amount. This calculator helps you get a more precise estimate based on your specific costs."
  - question: "Who pays closing costs?"
    answer: "Closing costs are typically paid by the buyer, though sellers may contribute to some costs. The buyer and seller can negotiate who pays which fees."
  - question: "Can I roll closing costs into my mortgage?"
    answer: "Some closing costs can be financed into the loan amount, but this increases your loan balance and total interest. Not all costs can be rolled in."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Closing Costs Calculator

Use this closing costs calculator to estimate the total fees and expenses you'll pay at closing. Enter your loan amount and the costs for origination, appraisal, title insurance, escrow, recording, inspection, survey, prepaid interest, homeowner's insurance, property tax escrow, and other fees — the tool shows your total closing costs and percentage of the loan amount. This closing cost estimator helps you budget for your home purchase or refinance.

<!-- more -->

## Why Use This Closing Costs Calculator

Closing costs can be a significant expense when buying or refinancing a home. This closing costs calculator helps you:

- **💰 Estimate Total Costs** — see the full picture of what you'll pay at closing.
- **📊 Understand the Breakdown** — see each cost component individually.
- **📈 See Percentage of Loan** — understand closing costs as a percentage of your mortgage.
- **🔁 Compare Scenarios** — adjust costs to see how they affect your total.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## How Closing Costs Are Calculated

**Total Closing Costs = Sum of All Individual Closing Cost Components**

**Percentage of Loan Amount = (Total Closing Costs ÷ Loan Amount) × 100**

---

## How to Use This Closing Cost Estimator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **loan amount**.
3.  Enter each closing cost component:
    - Loan Origination Fee
    - Appraisal Fee
    - Title Insurance
    - Escrow / Settlement Fees
    - Recording & Transfer Fees
    - Inspection Fees
    - Survey Fee
    - Prepaid Interest
    - Homeowner's Insurance (first year)
    - Property Tax Escrow
    - Other Closing Costs
4.  View your results instantly — see your total closing costs, percentage of loan, and detailed breakdown.

---

## Frequently Asked Questions

### What are closing costs?
Closing costs are fees and expenses paid at the closing of a real estate transaction. They include lender fees, third-party fees, and prepaid items like insurance and taxes.

### How much are closing costs typically?
Closing costs typically range from 2% to 5% of the loan amount. This calculator helps you get a more precise estimate based on your specific costs.

### Who pays closing costs?
Closing costs are typically paid by the buyer, though sellers may contribute to some costs. The buyer and seller can negotiate who pays which fees.

### Can I roll closing costs into my mortgage?
Some closing costs can be financed into the loan amount, but this increases your loan balance and total interest. Not all costs can be rolled in.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
