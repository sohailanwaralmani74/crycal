---
layout: tool
title: "Closing Costs Calculator | Mortgage Payment & Interest"
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

---

# Closing Costs Calculator – Know What You'll Pay Before You Sign

Buying or refinancing a home is exciting—but the closing table can bring some unwelcome surprises if you're not prepared. Our **Closing Costs Calculator** helps you estimate all those fees and expenses upfront, so you can budget with confidence and walk into closing with your eyes wide open.

<!-- more -->

## Why This Calculator Is Your Closing Day Ally

Closing costs can add thousands to your home purchase or refinance. Our **closing costs calculator** helps you:

- **💰 See the Full Picture** — get a complete estimate of everything you'll pay at closing
- **📊 Understand the Breakdown** — see each cost component individually, so nothing is overlooked
- **📈 Know Your Percentage** — see closing costs as a percentage of your loan amount
- **🔁 Compare Scenarios** — adjust costs to see how they affect your total
- **📜 Save Your Calculations** — export to CSV or Excel for your records
- **🔒 100% Private** — everything runs locally, nothing is stored

---

## What Goes Into Closing Costs?

**Total Closing Costs =** The sum of all individual fees and expenses you'll pay at closing.

**Percentage of Loan =** (Total Closing Costs ÷ Loan Amount) × 100

Here's what's typically included:

- **Loan Origination Fee** — what the lender charges to process your loan
- **Appraisal Fee** — the cost to have your home valued
- **Title Insurance** — protects against title disputes
- **Escrow / Settlement Fees** — for managing the closing process
- **Recording & Transfer Fees** — government fees to record the transaction
- **Inspection Fees** — home inspection, pest inspection, etc.
- **Survey Fee** — if a property survey is required
- **Prepaid Interest** — interest that accrues between closing and your first payment
- **Homeowner's Insurance** — your first year's premium
- **Property Tax Escrow** — prepaid property taxes
- **Other Closing Costs** — any additional fees specific to your situation

---

## Real-World Example: See the Numbers

**Scenario:** You're buying a home with a **$300,000 mortgage**. Here's what your closing costs might look like:

| Cost Component | Estimated Amount |
|----------------|------------------|
| Loan Origination Fee | $3,000 |
| Appraisal Fee | $500 |
| Title Insurance | $1,200 |
| Escrow / Settlement Fees | $800 |
| Recording & Transfer Fees | $400 |
| Inspection Fees | $400 |
| Survey Fee | $300 |
| Prepaid Interest | $600 |
| Homeowner's Insurance (1st year) | $1,200 |
| Property Tax Escrow | $2,500 |
| Other Costs | $500 |
| **Total Closing Costs** | **$11,400** |
| **Percentage of Loan** | **3.8%** |

*Now you know exactly what to expect—no surprises at the closing table.*

---

## How to Use This Calculator

Getting your closing cost estimate is quick and straightforward:

1. **Pick your currency** from the selector in the site header.
2. **Enter your loan amount** — the total mortgage you're taking out.
3. **Enter each closing cost component** — add amounts for origination, appraisal, title insurance, escrow, recording fees, inspections, survey, prepaid interest, insurance, tax escrow, and any other costs.
4. **View your results instantly** — see your total closing costs, percentage of loan, and a detailed breakdown.

---

## Who Benefits From This Calculator?

- **Homebuyers** — planning their purchase budget
- **Refinancers** — estimating costs before committing
- **Anyone** — wondering "how much will closing costs actually be?"
- **Sellers** — understanding what they might contribute to buyer closing costs

---

## Common Questions About Closing Costs

### What are closing costs in plain English?

They're all the fees and expenses you pay to finalize a real estate transaction—everything from lender fees and appraisals to title insurance and prepaid taxes. They're paid at the "closing" table when you sign your final paperwork.

### How much are closing costs typically?

Most buyers pay **2% to 5% of the loan amount** in closing costs. For a $300,000 mortgage, that's $6,000 to $15,000—a significant amount to budget for.

### Who pays closing costs?

The **buyer** typically pays most closing costs, but it's negotiable. In some transactions, the seller agrees to cover a portion of the buyer's costs as part of the deal. This is more common in a buyer's market or with motivated sellers.

### Can I roll closing costs into my mortgage?

Yes—you can often finance some or all of your closing costs into the loan amount. But this increases your loan balance, which means more interest over time and potentially a higher monthly payment. Not all costs can be rolled in.

### What if my closing costs are higher than I expected?

That's exactly why this calculator is so useful. By estimating costs upfront, you can:
- **Shop around** for better rates on specific fees (like title insurance or inspections)
- **Negotiate** with the seller to cover some costs
- **Adjust your budget** before you're at the closing table

---

> **🏠 Quick Tip:** Ask your lender for a Loan Estimate when you apply for a mortgage. It's a standard form that itemizes your estimated closing costs—and it's a great starting point for using this calculator. Always compare estimates from at least 2-3 lenders.
---