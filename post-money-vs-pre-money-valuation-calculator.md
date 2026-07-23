---
layout: tool
title: Post-Money vs. Pre-Money Valuation Calculator – Round Ownership
description: Calculate post-money valuation, investor ownership percentage, share price, and share dilution from pre-money valuation and investment amount.
permalink: /post-money-vs-pre-money-valuation-calculator
tool_id: post-money-vs-pre-money-valuation-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: preMoneyValuation
    label: Pre-Money Valuation
    type: number
    default: 8000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 8000000"

  - id: investmentAmount
    label: Investment Amount
    type: number
    default: 2000000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 2000000"

  - id: existingShares
    label: Pre-Round Total Shares
    type: number
    default: 8000000
    step: 500000
    min: 1
    placeholder: "e.g., 8000000"

outputs:
  - id: postMoneyValuation
    label: Post-Money Valuation
  - id: investorOwnership
    label: Investor Ownership
  - id: pricePerShare
    label: Price Per Share
  - id: newSharesIssued
    label: New Shares Issued
  - id: effectiveDilution
    label: Existing Shareholder Dilution

charts:
  tabs:
    - id: valuationBreakdown
      label: Valuation Stack
    - id: shareDistribution
      label: Post-Round Share Distribution

history_columns:
  - key: preMoneyValuation
    label: Pre-Money ($)
    source: input
  - key: investmentAmount
    label: Investment ($)
    source: input
  - key: postMoneyValuation
    label: Post-Money ($)
    source: output
  - key: investorOwnership
    label: Investor Ownership (%)
    source: output
  - key: pricePerShare
    label: Share Price ($)
    source: output

js_file: assets/js/calculators/post-money-vs-pre-money-valuation-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Post-Money vs. Pre-Money Valuation Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate post-money valuation, share pricing, investor ownership, and share issuance for venture capital funding rounds."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Post-Money Valuation Modeling (Pre-Money + Investment)"
    - "Price Per Share & Share Issuance Calculation"
    - "Investor Ownership Percentage Breakdown"
    - "Pre vs Post Valuation Stack Chart"
    - "100% Private Client Browser Computations"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Post-Money vs. Pre-Money Valuation Calculator

howto:
  name: "How to Calculate Post-Money Valuation from Pre-Money Valuation"
  description: "Follow these steps to compute post-money valuation, share prices, and investor ownership."
  step:
    - name: "Enter Pre-Money Valuation"
      text: "Input company value before investment."
    - name: "Enter Investment Amount"
      text: "Input total capital raised in the round."
    - name: "Input Existing Shares Outstanding"
      text: "Input pre-round total company share count."
    - name: "Review Post-Money Results"
      text: "Analyze post-money valuation, price per share, and new shares issued."

faq:
  - question: "What is the difference between pre-money and post-money valuation?"
    answer: "Pre-money valuation is the agreed value of the startup before adding new investment capital. Post-money valuation is the company value immediately after receiving the investment: Post-Money = Pre-Money + Investment."
  - question: "How do you calculate investor equity ownership percentage?"
    answer: "Investor Ownership % = (Investment Amount ÷ Post-Money Valuation) × 100."
  - question: "How is share price determined in a priced round?"
    answer: "Share Price = Pre-Money Valuation ÷ Existing Pre-Round Fully Diluted Shares."
  - question: "How many new shares are issued in a funding round?"
    answer: "New Shares Issued = Investment Amount ÷ Share Price."
  - question: "Why is agreeing on pre-money valuation critical for founders?"
    answer: "A higher pre-money valuation directly increases share price, minimizing the number of new shares issued and reducing founder equity dilution."
  - question: "Is my valuation data stored anywhere?"
    answer: "No. All calculations run strictly inside your web browser."

---

# Post-Money vs. Pre-Money Valuation Calculator – Round Ownership

Calculate post-money valuation, share pricing, investor ownership percentage, and dilution with our free **Post-Money vs. Pre-Money Valuation Calculator**.

<!-- more -->

## Pre-Money vs Post-Money Valuation Explained

In venture financing, valuation is expressed as either **Pre-Money** or **Post-Money**. The core equation connecting them is straightforward:

$$\text{Post-Money Valuation} = \text{Pre-Money Valuation} + \text{Investment Amount}$$

Why the distinction matters:
- **Pre-Money Valuation**: Measures the worth of existing company assets and IP before fresh capital.
- **Investor Ownership %**: Calculated using **Post-Money Valuation**, not Pre-Money ($\frac{\text{Investment}}{\text{Post-Money}}$).
- **Share Price**: Calculated using **Pre-Money Valuation** divided by existing shares.

---

## Core Venture Capital Equations

$$\text{Post-Money Valuation } (V_{post}) = V_{pre} + I$$

$$\text{Share Price } (P) = \frac{V_{pre}}{S_{existing}}$$

$$\text{New Shares Issued } (S_{new}) = \frac{I}{P}$$

$$\text{Investor Ownership (\%)} = \left( \frac{I}{V_{post}} \right) \times 100$$

$$\text{Existing Founder Ownership (\%)} = \left( \frac{V_{pre}}{V_{post}} \right) \times 100$$

---

## Example Round Calculation Table ($8M Pre + $2M Raised)

| Component | Valuation / Capital | Share Count | Ownership % |
| :--- | :--- | :--- | :--- |
| **Pre-Money Valuation** | $8,000,000 | 8,000,000 shares | **80.0%** (Pre-Round) |
| **New Investment Raised** | $2,000,000 | 2,000,000 new shares | **20.0%** (Investor) |
| **Post-Money Valuation** | **$10,000,000** | **10,000,000 total shares** | **100.0%** |
| **Share Price** | **$1.00 / share** | — | — |

---

## Step-by-Step Guide to Calculating Post-Money Valuation

1. **Enter Agreed Pre-Money Valuation**: Input the company valuation before investment.
2. **Enter Investment Amount**: Input fresh capital raised.
3. **Input Existing Shares**: Input total shares outstanding before the round.
4. **View Share Price & Share Issuance**: Observe exact price per share and new shares issued to investors.

---

## Frequently Asked Questions

### What is the difference between pre-money and post-money valuation?
Pre-money valuation is the agreed value of the startup before adding new investment capital. Post-money valuation is the company value immediately after receiving the investment: Post-Money = Pre-Money + Investment.

### How do you calculate investor equity ownership percentage?
Investor Ownership % = (Investment Amount ÷ Post-Money Valuation) × 100.

### How is share price determined in a priced round?
Share Price = Pre-Money Valuation ÷ Existing Pre-Round Fully Diluted Shares.

### How many new shares are issued in a funding round?
New Shares Issued = Investment Amount ÷ Share Price.

### Why is agreeing on pre-money valuation critical for founders?
A higher pre-money valuation directly increases share price, minimizing the number of new shares issued and reducing founder equity dilution.

### Is my valuation data stored anywhere?
No. All calculations run strictly inside your web browser.
