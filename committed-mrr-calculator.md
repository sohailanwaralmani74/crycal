---
layout: tool
title: Committed MRR (CMRR) Calculator – SaaS Future Revenue
description: Calculate Committed Monthly Recurring Revenue (CMRR). Include signed contracts with future start dates minus known pending cancellations.
permalink: /committed-mrr-calculator
tool_id: committed-mrr-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: currentMrr
    label: Active Current MRR ($)
    type: number
    default: 100000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 100000"

  - id: signedFutureMrr
    label: Signed Contracts Starting in Future ($)
    type: number
    default: 15000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 15000"

  - id: pendingExpansionMrr
    label: Signed Expansion Starting in Future ($)
    type: number
    default: 5000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 5000"

  - id: knownChurnMrr
    label: Known Pending Cancellations ($)
    type: number
    default: 3000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 3000"

  - id: knownContractionMrr
    label: Known Pending Downgrades ($)
    type: number
    default: 2000
    step: 200
    min: 0
    currency: true
    placeholder: "e.g., 2000"

outputs:
  - id: committedMrr
    label: Committed MRR (CMRR)
  - id: committedArr
    label: Committed ARR (CARR)
  - id: netCommittedDelta
    label: Net Pending Revenue Pipeline ($)
  - id: cmrrGrowthPct
    label: Committed Revenue Growth (%)

charts:
  tabs:
    - id: breakdown
      label: CMRR Component Waterfall

history_columns:
  - key: currentMrr
    label: Current MRR
    source: input
  - key: signedFutureMrr
    label: Signed Future MRR
    source: input
  - key: knownChurnMrr
    label: Known Pending Churn
    source: input
  - key: committedMrr
    label: CMRR
    source: output
  - key: committedArr
    label: CARR
    source: output

js_file: /assets/js/calculators/committed-mrr-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Committed MRR (CMRR) Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Committed Monthly Recurring Revenue (CMRR). Include signed contracts with future start dates minus known pending cancellations."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Committed MRR (CMRR) Calculation"
    - "Committed ARR (CARR) Annualization"
    - "Future Contract Pipeline Waterfall"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: Committed MRR Calculator

howto:
  name: "How to Calculate Committed MRR (CMRR)"
  description: "Follow these steps to compute your Committed MRR and CARR."
  step:
    - name: "Enter Current Active MRR"
      text: "Input active MRR currently live and billing today."
    - name: "Enter Signed Future Contracts"
      text: "Input revenue from signed contracts that have not yet gone live."
    - name: "Enter Known Pending Churn"
      text: "Input cancellation notices for contracts set to terminate."
    - name: "Review CMRR & CARR"
      text: "Analyze your Committed MRR and Committed ARR projections."

faq:
  - question: "What is Committed MRR (CMRR)?"
    answer: "Committed Monthly Recurring Revenue (CMRR) is a forward-looking SaaS metric that measures guaranteed monthly revenue by adding signed contracts starting in the future and subtracting known impending cancellations or downgrades from current active MRR."
  - question: "What is Committed ARR (CARR)?"
    answer: "Committed Annual Recurring Revenue (CARR) is simply Committed MRR multiplied by 12 (CMRR × 12)."
  - question: "Why is CMRR more predictive than current MRR for Enterprise B2B SaaS?"
    answer: "Enterprise software sales often involve 30-to-90 day implementation delays between contract signing and go-live billing. CMRR gives executives a true picture of locked-in future revenue."
  - question: "What is the formula for CMRR?"
    answer: "CMRR = Current Active MRR + Signed Future New MRR + Signed Future Expansion MRR − Known Pending Churn MRR − Known Pending Contraction MRR."
  - question: "Does CMRR include sales pipeline opportunities that haven't been signed?"
    answer: "No. CMRR strictly includes executed, legally binding contracts. Unsigned sales pipeline leads or verbal promises must be excluded."
  - question: "How do venture capital investors view CMRR during fundraising?"
    answer: "VC investors evaluate CMRR to gauge true growth velocity, especially when large enterprise deals are signed near quarter-end but await technical implementation."
  - question: "How does CMRR differ from ARR?"
    answer: "ARR measures current live annualized billing, while CARR incorporates signed future contracts and scheduled cancellations before they hit the billing system."

---

# Committed MRR (CMRR) Calculator

Calculate your Committed Monthly Recurring Revenue (CMRR) and Committed Annual Recurring Revenue (CARR) to project locked-in future revenue from signed enterprise contracts.

<!-- more -->

## Why Use This Committed MRR Calculator

In enterprise B2B SaaS, a contract signed today may take weeks or months to go live and begin billing. Current MRR misses this momentum. This CMRR calculator enables you to:

- **🔮 Predict Future Billing Revenue** — account for signed deals before implementation completes.
- **🛡️ Factor In Pending Cancellations** — subtract non-renewals and cancellation notices ahead of term expiration.
- **📈 Measure True Sales Velocity** — evaluate total locked-in revenue momentum for board & investor reporting.
- **🎯 Annualize Committed ARR (CARR)** — project full-year committed contract run rates.

---

## Committed MRR (CMRR) Formula

$$\text{CMRR} = \text{Current MRR} + \text{Signed Future New MRR} + \text{Signed Future Expansion} - \text{Known Pending Churn} - \text{Known Pending Contraction}$$

$$\text{Committed ARR (CARR)} = \text{CMRR} \times 12$$

---

## Comparison of MRR vs. CMRR vs. ARR

| Metric | Includes Future Signed Contracts? | Includes Pending Cancellations? | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Active MRR** | No (Only live billing) | No (Only active status) | Operational billing & cash flow |
| **Committed MRR (CMRR)** | **Yes (Legally binding)** | **Yes (Notices received)** | **Sales trajectory & executive planning** |
| **Active ARR** | No (Live MRR × 12) | No | Standard ARR reporting |
| **Committed ARR (CARR)** | **Yes (CMRR × 12)** | **Yes** | **VC fundraising & valuation** |

---

## How to Use This Committed MRR Calculator

1. Enter **Active Current MRR** live today.
2. Enter **Signed Contracts Starting in Future** (New & Expansion).
3. Enter **Known Pending Cancellations & Downgrades**.
4. Instantly review **Committed MRR (CMRR)**, **Committed ARR (CARR)**, and **Net Pending Pipeline ($)**.

---

## Frequently Asked Questions

### What is Committed MRR (CMRR)?
Committed Monthly Recurring Revenue (CMRR) is a forward-looking SaaS metric that measures guaranteed monthly revenue by adding signed contracts starting in the future and subtracting known impending cancellations or downgrades from current active MRR.

### What is Committed ARR (CARR)?
Committed Annual Recurring Revenue (CARR) is simply Committed MRR multiplied by 12 (CMRR × 12).

### Why is CMRR more predictive than current MRR for Enterprise B2B SaaS?
Enterprise software sales often involve 30-to-90 day implementation delays between contract signing and go-live billing. CMRR gives executives a true picture of locked-in future revenue.

### What is the formula for CMRR?
CMRR = Current Active MRR + Signed Future New MRR + Signed Future Expansion MRR − Known Pending Churn MRR − Known Pending Contraction MRR.

### Does CMRR include sales pipeline opportunities that haven't been signed?
No. CMRR strictly includes executed, legally binding contracts. Unsigned sales pipeline leads or verbal promises must be excluded.

### How do venture capital investors view CMRR during fundraising?
VC investors evaluate CMRR to gauge true growth velocity, especially when large enterprise deals are signed near quarter-end but await technical implementation.

### How does CMRR differ from ARR?
ARR measures current live annualized billing, while CARR incorporates signed future contracts and scheduled cancellations before they hit the billing system.
