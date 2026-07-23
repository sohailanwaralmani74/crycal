---
layout: tool
title: Cash-on-Cash Return Calculator – Leveraged Real Estate Yield
description: Calculate cash-on-cash return percentage on real estate investments after debt service mortgage payments.
permalink: /cash-on-cash-return-calculator
tool_id: cash-on-cash-return-calculator
category: investing
hide_sidebar: true

inputs:
  - id: totalInitialCashInvested
    label: Total Cash Out of Pocket (Down Pmt + Closing + Rehab)
    type: number
    default: 95000
    step: 5000
    min: 1000
    currency: true
    placeholder: "e.g., 95000"

  - id: annualNoi
    label: Net Operating Income (NOI)
    type: number
    default: 31500
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 31500"

  - id: annualDebtService
    label: Annual Mortgage Payment (P&I)
    type: number
    default: 21600
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 21600"

outputs:
  - id: netAnnualCashFlow
    label: Net Pre-Tax Annual Cash Flow
  - id: cashOnCashReturnPercent
    label: Cash-on-Cash Return Rate (%)

charts:
  tabs:
    - id: breakdown
      label: Annual Cash Flow Distribution
    - id: return
      label: Cash-on-Cash Return Yield

history_columns:
  - key: totalInitialCashInvested
    label: Cash Invested
    source: input
  - key: annualNoi
    label: Annual NOI
    source: input
  - key: annualDebtService
    label: Debt Service
    source: input
  - key: netAnnualCashFlow
    label: Net Cash Flow
    source: output
  - key: cashOnCashReturnPercent
    label: CoC Return %
    source: output

js_file: assets/js/calculators/cash-on-cash-return-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Cash-on-Cash Return Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate leveraged cash-on-cash returns for real estate investors."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Leveraged Real Estate Yield Modeling — calculate annual pre-tax cash return on out-of-pocket capital"
    - "Mortgage Debt Service Impact — deduct annual mortgage principal and interest payments"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Cash-on-Cash Return Calculator

howto:
  name: "How to Calculate Cash-on-Cash Return"
  description: "Calculate annual cash flow return on out-of-pocket capital."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input out-of-pocket cash"
      text: "Enter down payment, closing costs, and rehab expenditure."
    - name: "Input NOI & debt service"
      text: "Enter annual NOI and annual mortgage payments."

faq:
  - question: "What is Cash-on-Cash Return in real estate?"
    answer: "Cash-on-cash return measures the annual pre-tax cash flow received divided by the total cash invested out of pocket, evaluating leveraged performance."
  - question: "What is a good Cash-on-Cash return percentage?"
    answer: "Most real estate investors target a Cash-on-Cash return of 8% to 12%+, which significantly outperforms typical stock dividend yields."
  - question: "What items count toward total out-of-pocket cash invested?"
    answer: "Total cash invested includes down payment, closing costs, upfront rehabilitation/renovation costs, and loan origination fees."
  - question: "How does leverage increase Cash-on-Cash return?"
    answer: "Using mortgage debt reduces the initial cash required out of pocket. If property income is strong, leverage amplifies the percentage return earned on your cash."
  - question: "Can Cash-on-Cash return be negative?"
    answer: "Yes! If annual mortgage debt service exceeds Net Operating Income (NOI), net cash flow becomes negative, requiring cash infusions to cover monthly shortfalls."
  - question: "What is the difference between ROI and Cash-on-Cash return?"
    answer: "Total ROI includes property equity appreciation, loan principal reduction, and tax benefits. Cash-on-Cash return strictly measures spendable liquid cash flow."
  - question: "Is my personal financial data saved on any server?"
    answer: "No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage."
---

# Cash-on-Cash Return Calculator – Leveraged Real Estate Yield

Calculate cash-on-cash return percentages on real estate investments after debt service mortgage payments with our free calculator.

<!-- more -->

## Cash-on-Cash Return Formula

$$\text{Net Annual Cash Flow} = \text{Annual NOI} - \text{Annual Debt Service}$$
$$\text{Cash-on-Cash Return \%} = \frac{\text{Net Annual Cash Flow}}{\text{Total Initial Cash Invested}} \times 100$$

---

## Leveraged Cash-on-Cash Return Table ($95,000 Out-of-Pocket Cash Invested)

| Annual NOI | Annual Mortgage Debt Service | Net Annual Pre-Tax Cash Flow | Cash-on-Cash Return % |
|---|---|---|---|
| $28,000 | $21,600 | **$6,400.00** | **6.74% CoC Return** |
| $31,500 | $21,600 | **$9,900.00** | **10.42% CoC Return** |
| $35,000 | $21,600 | **$13,400.00** | **14.11% CoC Return** |

---

## How to Use This Cash-on-Cash Return Calculator

1. Select your preferred **account currency** from the header picker.
2. Enter total **out-of-pocket cash invested** (down payment + closing costs + rehab).
3. Input **annual Net Operating Income (NOI)**.
4. Enter **annual mortgage payment (P&I debt service)**.
5. View net annual pre-tax cash flow and Cash-on-Cash Return %.

---

## Frequently Asked Questions

### What is Cash-on-Cash Return in real estate?
Cash-on-cash return measures the annual pre-tax cash flow received divided by the total cash invested out of pocket, evaluating leveraged performance.

### What is a good Cash-on-Cash return percentage?
Most real estate investors target a Cash-on-Cash return of 8% to 12%+, which significantly outperforms typical stock dividend yields.

### What items count toward total out-of-pocket cash invested?
Total cash invested includes down payment, closing costs, upfront rehabilitation/renovation costs, and loan origination fees.

### How does leverage increase Cash-on-Cash return?
Using mortgage debt reduces the initial cash required out of pocket. If property income is strong, leverage amplifies the percentage return earned on your cash.

### Can Cash-on-Cash return be negative?
Yes! If annual mortgage debt service exceeds Net Operating Income (NOI), net cash flow becomes negative, requiring cash infusions to cover monthly shortfalls.

### What is the difference between ROI and Cash-on-Cash return?
Total ROI includes property equity appreciation, loan principal reduction, and tax benefits. Cash-on-Cash return strictly measures spendable liquid cash flow.

### Is my personal financial data saved on any server?
No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage.
