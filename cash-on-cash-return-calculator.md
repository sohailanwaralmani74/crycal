---
layout: tool
title: "Cash on Cash Return Calculator | Real Estate Yield"
description: "Calculate leveraged cash-on-cash return rates and annual pre-tax cash flow for real estate investments. 100% free and private browser execution."
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
  description: "Calculate leveraged cash-on-cash returns and net pre-tax cash flow for rental property and real estate investments."
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
  description: "Calculate annual cash flow return on out-of-pocket capital invested in rental real estate."
  step:
    - name: "Select currency"
      text: "Choose your preferred currency from the top header selector."
    - name: "Input total out-of-pocket cash"
      text: "Enter initial cash invested (down payment + closing costs + upfront rehab expenses)."
    - name: "Input Net Operating Income (NOI)"
      text: "Enter annual gross rental revenue minus operating expenses (property taxes, insurance, repairs, vacancy)."
    - name: "Input annual debt service"
      text: "Enter annual mortgage payments (principal and interest)."
    - name: "Review cash-on-cash yield"
      text: "View net annual pre-tax cash flow and cash-on-cash return percentage yield."

faq:
  - question: "What is Cash-on-Cash Return in real estate?"
    answer: "Cash-on-Cash return measures the annual pre-tax cash flow earned on a rental property relative to the total out-of-pocket cash invested."
  - question: "How does Cash-on-Cash return differ from Cap Rate?"
    answer: "Cap rate evaluates property performance assuming an all-cash purchase without debt, whereas Cash-on-Cash return measures actual cash yield after mortgage payments."
  - question: "What is considered a good Cash-on-Cash return?"
    answer: "Real estate investors generally target a Cash-on-Cash return between 8% and 12%, depending on property location, asset class, and market interest rates."
  - question: "What costs should be included in total initial cash invested?"
    answer: "Initial cash invested must include down payment, lender origination fees, closing costs, title insurance, and initial renovation or rehab costs."
  - question: "How does leverage affect Cash-on-Cash return?"
    answer: "Mortgage leverage amplifies Cash-on-Cash return when property NOI yields exceed interest rates, allowing investors to achieve higher yields on smaller cash outlays."
  - question: "Does Cash-on-Cash return include property appreciation or tax benefits?"
    answer: "No. Cash-on-Cash return strictly isolates immediate cash flow yield, excluding principal reduction, property appreciation, or tax depreciation benefits."
  - question: "Is my property investment data private?"
    answer: "Yes, 100%. All calculation algorithms execute locally inside your web browser. No property address, purchase price, or cash flow figures are transmitted or stored."
---

# Cash on Cash Return Calculator

Calculate annual pre-tax cash flow and cash-on-cash yield percentages for leveraged real estate investments with precision.
Featuring multi-currency support, debt service deductions, and 100% private browser execution so your investment portfolio data remains confidential.

<!-- more -->

## Why Use the Cash on Cash Return Calculator?

Evaluating rental real estate performance requires metrics that accurately reflect your cash flow efficiency. While metrics like Cap Rate provide an unleveraged view of property profitability, **Cash-on-Cash (CoC) Return** is the single most practical metric for real estate investors using mortgage financing. It measures the exact annual cash dividend earned on the actual out-of-pocket cash dollars deployed.

Our **Cash on Cash Return Calculator** allows real estate investors, landlords, and syndicators to evaluate deal cash flow yields instantly. By factoring in total out-of-pocket capital (down payment, closing costs, and upfront renovation capital) alongside Net Operating Income (NOI) and annual mortgage debt service, this tool computes net pre-tax cash flow and percentage yield.

Analyzing Cash-on-Cash returns is essential when comparing competing investment opportunities. A property priced at $500,000 might generate strong top-line rent, but if heavy debt service absorbs all cash flow, your cash-on-cash return may drop to 2%. Conversely, a smaller $250,000 property with favorable financing terms might deliver a 12% cash-on-cash yield. Using this calculator ensures you deploy investment capital into high-yielding opportunities.

---

## Mathematical Formulas & Mechanics

The Net Pre-Tax Annual Cash Flow ($CF_{\text{annual}}$) is calculated by subtracting annual mortgage debt service ($DS$) from Net Operating Income ($\text{NOI}$):

$$CF_{\text{annual}} = \text{NOI} - DS$$

Total initial out-of-pocket cash invested ($C_{\text{total}}$) combines down payment ($D$), closing costs ($C_{\text{closing}}$), and initial renovation/rehab expenses ($C_{\text{rehab}}$):

$$C_{\text{total}} = D + C_{\text{closing}} + C_{\text{rehab}}$$

The Cash-on-Cash Return Percentage ($\text{CoC \%}$) is calculated as:

$$\text{CoC \%} = \left( \frac{CF_{\text{annual}}}{C_{\text{total}}} \right) \times 100 = \left( \frac{\text{NOI} - DS}{D + C_{\text{closing}} + C_{\text{rehab}}} \right) \times 100$$

To calculate payback period in years ($T_{\text{payback}}$) required to fully recover initial cash invested:

$$T_{\text{payback}} = \frac{C_{\text{total}}}{CF_{\text{annual}}} = \frac{100}{\text{CoC \%}}$$

---

## Real-World Comparison & Benchmark Table

The benchmark table below compares Cash-on-Cash yields and net cash flow across different real estate financing structures for a **$300,000 Rental Property** with $31,500 annual NOI:

| Acquisition Strategy | Total Out-of-Pocket Cash | Annual Debt Service (P&I) | Annual Net Cash Flow | Cash-on-Cash Return % | Payback Period | Yield Rating |
|---|---|---|---|---|---|---|
| **All-Cash Purchase** | $300,000 | $0 | **$31,500** | **10.50%** | 9.5 Years | Moderate Unleveraged |
| **25% Down (Conservative)**| $95,000 ($75k + $10k + $10k)| $19,500 | **$12,000** | **12.63%** | 7.9 Years | Strong Benchmark |
| **15% Down (High Leverage)**| $65,000 ($45k + $10k + $10k)| $22,100 | **$9,400** | **14.46%** | 6.9 Years | High Cash Yield |
| **10% Down (BRRRR Refi)** | $40,000 ($30k + $5k + $5k) | $23,400 | **$8,100** | **20.25%** | 4.9 Years | Exceptional Leverage |
| **Negative Cash Flow** | $95,000 | $33,000 | **-$1,500** | **-1.58%** | N/A | Cash Bleed Warning |

*Investment Insight*: Utilizing 25% down mortgage leverage increases Cash-on-Cash return from 10.50% up to **12.63%**, while preserving $205,000 in liquid capital to acquire additional cash-flowing properties.

---

## Step-by-Step How-To Guide

1. **Select Currency**: Choose your preferred currency ($ USD, € EUR, £ GBP) from the site header.
2. **Enter Out-of-Pocket Cash**: Input total initial cash deployed (down payment + closing costs + rehab costs).
3. **Enter Net Operating Income (NOI)**: Input annual rental income remaining after deducting property taxes, insurance, repairs, and property management fees.
4. **Enter Annual Debt Service**: Input total annual principal and interest mortgage payments.
5. **Review Yield Metrics**: View net pre-tax annual cash flow and calculated Cash-on-Cash return percentage.
6. **Compare Deal Scenarios**: Adjust loan down payments or interest rates to optimize cash-on-cash returns.

---

## Frequently Asked Questions

### What is Cash-on-Cash Return in real estate?
Cash-on-Cash return measures the annual pre-tax cash flow earned on a rental property relative to the total out-of-pocket cash invested.

### How does Cash-on-Cash return differ from Cap Rate?
Cap rate evaluates property performance assuming an all-cash purchase without debt, whereas Cash-on-Cash return measures actual cash yield after mortgage payments.

### What is considered a good Cash-on-Cash return?
Real estate investors generally target a Cash-on-Cash return between 8% and 12%, depending on property location, asset class, and market interest rates.

### What costs should be included in total initial cash invested?
Initial cash invested must include down payment, lender origination fees, closing costs, title insurance, and initial renovation or rehab costs.

### How does leverage affect Cash-on-Cash return?
Mortgage leverage amplifies Cash-on-Cash return when property NOI yields exceed interest rates, allowing investors to achieve higher yields on smaller cash outlays.

### Does Cash-on-Cash return include property appreciation or tax benefits?
No. Cash-on-Cash return strictly isolates immediate cash flow yield, excluding principal reduction, property appreciation, or tax depreciation benefits.

### Is my property investment data private?
Yes, 100%. All calculation algorithms execute locally inside your web browser. No property address, purchase price, or cash flow figures are transmitted or stored.
