---
layout: tool
title: Stock Average Cost Calculator – Calculate Dollar-Cost Averaging (DCA)
description: Calculate weighted average cost per share when buying multiple stock tranches at different prices.
permalink: /stock-average-cost-calculator
tool_id: stock-average-cost-calculator
category: investing
hide_sidebar: true

inputs:
  - id: shareCount1
    label: Tranche 1 Shares Purchased
    type: number
    default: 100
    step: 10
    min: 1
    placeholder: "e.g., 100"

  - id: sharePrice1
    label: Tranche 1 Price Per Share
    type: number
    default: 150
    step: 5
    min: 0.01
    currency: true
    placeholder: "e.g., 150"

  - id: shareCount2
    label: Tranche 2 Shares Purchased
    type: number
    default: 150
    step: 10
    min: 0
    placeholder: "e.g., 150"

  - id: sharePrice2
    label: Tranche 2 Price Per Share
    type: number
    default: 120
    step: 5
    min: 0.01
    currency: true
    placeholder: "e.g., 120"

outputs:
  - id: totalSharesOwned
    label: Total Shares Owned
  - id: totalCapitalInvested
    label: Total Capital Invested
  - id: weightedAverageCostPerShare
    label: Weighted Average Cost Per Share

charts:
  tabs:
    - id: breakdown
      label: Share Tranche Breakdown
    - id: costVsAverage
      label: Purchase Price vs Average Cost

history_columns:
  - key: shareCount1
    label: Tranche 1 Shares
    source: input
  - key: sharePrice1
    label: Tranche 1 Price
    source: input
  - key: shareCount2
    label: Tranche 2 Shares
    source: input
  - key: sharePrice2
    label: Tranche 2 Price
    source: input
  - key: totalSharesOwned
    label: Total Shares
    source: output
  - key: weightedAverageCostPerShare
    label: Avg Cost/Share
    source: output

js_file: assets/js/calculators/stock-average-cost-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Stock Average Cost Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate weighted average cost per share across multiple stock purchases."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Weighted Average Cost Per Share Calculation — calculate average entry price across multiple buy orders"
    - "Dollar-Cost Averaging (DCA) Analysis — evaluate average cost reductions during market dips"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Stock Average Cost Calculator

howto:
  name: "How to Calculate Weighted Average Stock Cost"
  description: "Calculate average price per share after multiple buy orders."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input Tranche 1 & 2 shares"
      text: "Enter share counts and purchase prices for both buy orders."

faq:
  - question: "How is weighted average cost per share calculated?"
    answer: "Add the total dollars spent across all buy orders and divide by the total number of shares purchased."
  - question: "What is Dollar-Cost Averaging (DCA)?"
    answer: "Dollar-cost averaging is an investment strategy where you invest equal dollar amounts at regular intervals, buying more shares when prices are low and fewer when prices are high."
  - question: "How does averaging down help investors?"
    answer: "Buying additional shares at lower market prices reduces your overall average cost per share, lowering the break-even price required to reach profitability."
  - question: "What is the difference between simple average price and weighted average price?"
    answer: "A simple average adds prices together and divides by purchase count. A weighted average factors in share quantities, providing the exact true cost basis per share."
  - question: "Does stock cost basis affect capital gains tax when selling?"
    answer: "Yes! Your cost basis determines your taxable gain or loss upon sale. Tax accounting methods include FIFO (First In, First Out), LIFO, and Specific Identification."
  - question: "Can this calculator be used for cryptocurrency purchases?"
    answer: "Yes! The weighted average cost math applies identically to stocks, ETFs, mutual funds, and cryptocurrencies."
  - question: "Is my personal financial data saved on any server?"
    answer: "No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage."
---

# Stock Average Cost Calculator – Calculate Dollar-Cost Averaging (DCA)

Calculate your weighted average price per share across multiple stock buy orders with our free **Stock Average Cost Calculator**.

<!-- more -->

## Weighted Average Cost Formula

$$\text{Total Capital Invested} = (N_1 \times P_1) + (N_2 \times P_2)$$
$$\text{Weighted Average Cost} = \frac{\text{Total Capital Invested}}{N_1 + N_2}$$

Where $N$ represents share count and $P$ represents price per share for each purchase.

---

## Dollar-Cost Averaging Tranche Table

| Purchase Order | Shares Purchased | Price Per Share | Total Capital Outlay | Weighted Average Cost Basis |
|---|---|---|---|---|
| **Tranche 1 (Initial Buy)** | 100 Shares | $150.00 / share | $15,000.00 | $150.00 / share |
| **Tranche 2 (Averaging Down)**| 150 Shares | $120.00 / share | $18,000.00 | **$132.00 / share (Lowered by $18/sh)**|
| **COMBINED HOLDING** | **250 Shares** | — | **$33,000.00** | **$132.00 / share** |

---

## How to Use This Stock Average Cost Calculator

1. Select your preferred **account currency** from the header picker.
2. Enter **Tranche 1 share count** and **purchase price per share**.
3. Enter **Tranche 2 share count** and **purchase price per share**.
4. View total shares owned, total capital invested, and weighted average cost per share.

---

## Frequently Asked Questions

### How is weighted average cost per share calculated?
Add the total dollars spent across all buy orders and divide by the total number of shares purchased.

### What is Dollar-Cost Averaging (DCA)?
Dollar-cost averaging is an investment strategy where you invest equal dollar amounts at regular intervals, buying more shares when prices are low and fewer when prices are high.

### How does averaging down help investors?
Buying additional shares at lower market prices reduces your overall average cost per share, lowering the break-even price required to reach profitability.

### What is the difference between simple average price and weighted average price?
A simple average adds prices together and divides by purchase count. A weighted average factors in share quantities, providing the exact true cost basis per share.

### Does stock cost basis affect capital gains tax when selling?
Yes! Your cost basis determines your taxable gain or loss upon sale. Tax accounting methods include FIFO (First In, First Out), LIFO, and Specific Identification.

### Can this calculator be used for cryptocurrency purchases?
Yes! The weighted average cost math applies identically to stocks, ETFs, mutual funds, and cryptocurrencies.

### Is my personal financial data saved on any server?
No. All calculations run locally inside your web browser. History and saved presets are stored strictly in your browser's local storage.
