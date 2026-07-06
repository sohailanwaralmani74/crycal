---
layout: tool
title: Stock Position Size Calculator
description: Calculate the optimal number of shares to trade for stocks and ETFs. Enter your account balance, risk percentage, and stop-loss distance per share.
permalink: /stock-position-size-calculator
tool_id: stock-position-size
category: investing
hide_sidebar: true

inputs:
  - id: accountBalance
    label: Account Balance
    type: number
    default: 50000
    step: 500
    min: 0
    currency: true

  - id: riskPercent
    label: Risk Per Trade (%)
    type: number
    default: 1.0
    step: 0.1
    min: 0.1
    max: 100
    suffix: '%'

  - id: stopLossAmount
    label: Stop-Loss (per share)
    type: number
    default: 2.50
    step: 0.05
    min: 0.01
    currency: true
    placeholder: "Dollar amount per share"

  - id: stockPrice
    label: Stock Price (optional)
    type: number
    default: 50.00
    step: 0.50
    min: 0
    currency: true
    placeholder: "Current share price"

  - id: stockSymbol
    label: Stock Symbol (optional)
    type: text
    default: ""
    placeholder: "e.g., AAPL, TSLA"

  - id: includeCommission
    label: Include Commission?
    type: select
    default: false
    options:
      - true
      - false

  - id: commissionAmount
    label: Commission per Trade
    type: number
    default: 0
    step: 0.50
    min: 0
    currency: true
    placeholder: "e.g., $0.50 per trade"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: monthly
    options:
      - annually
      - semi-annually
      - quarterly
      - monthly
      - daily

outputs:
  - id: numberOfShares
    label: Number of Shares
  - id: riskAmount
    label: Risk Amount
  - id: totalCost
    label: Total Cost
  - id: positionSizeValue
    label: Position Size (Value)
  - id: riskPerShare
    label: Risk Per Share
  - id: commissionOutput
    label: Commission

charts:
  tabs:
    - id: breakdown
      label: Breakdown
    - id: comparison
      label: Comparison

history_columns:
  - key: accountBalance
    label: Balance
    source: input
  - key: riskPercent
    label: Risk %
    source: input
  - key: stopLossAmount
    label: Stop (per share)
    source: input
  - key: stockPrice
    label: Stock Price
    source: input
  - key: numberOfShares
    label: Shares
    source: output
  - key: riskAmount
    label: Risk Amount
    source: output

js_file: /assets/js/calculators/stock-position-size.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Stock Position Size Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the optimal number of shares to trade for stocks and ETFs. Enter your account balance, risk percentage, and stop-loss distance per share."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Share-Based Sizing — calculate exact number of shares"
    - "Risk Management — see exactly how much you're risking"
    - "Stock Symbol Lookup — optional symbol field"
    - "Commission Support — account for trading fees"
    - "Visual Breakdown — see your risk allocation"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Trading
    url: /trading
  - name: Stock Position Size Calculator

howto:
  name: "How to Use the Stock Position Size Calculator"
  description: "Follow these steps to calculate your stock position size."
  step:
    - name: "Enter your account balance"
      text: "Enter your total trading capital in your account currency."
    - name: "Set your risk percentage"
      text: "Enter the percentage of your account you're willing to risk on this trade."
    - name: "Enter your stop-loss per share"
      text: "Enter the dollar amount you're willing to lose per share."
    - name: "Enter the stock price (optional)"
      text: "Enter the current share price to see the total cost of your position."
    - name: "Enter a stock symbol (optional)"
      text: "Enter the stock symbol for reference."
    - name: "View your results"
      text: "See the number of shares to buy and your risk amount."

faq:
  - question: "How is stock position size calculated?"
    answer: "Position size (shares) = Risk Amount ÷ Stop-Loss per Share. Risk Amount = Account Balance × (Risk% / 100)."
  - question: "What is the stop-loss per share?"
    answer: "The stop-loss per share is the dollar amount you're willing to lose per share. If you buy at $50 and set a stop at $47.50, your stop-loss per share is $2.50."
  - question: "Why is stock price optional?"
    answer: "The stock price is optional because the core calculation only needs the stop-loss per share and risk amount. The price is used to show the total cost and position value."
  - question: "What is a good risk percentage for stocks?"
    answer: "Most traders risk 1-2% of their account balance per trade. This helps protect your capital during drawdowns."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Stock Position Size Calculator – Size Your Trades with Confidence

Use this stock position size calculator to determine the optimal number of shares to trade for stocks and ETFs. Enter your account balance, risk percentage, and stop-loss per share — the tool shows the exact number of shares to buy, your risk amount, and total cost. This stock risk management calculator helps you protect your capital and trade with discipline.

<!-- more -->

## Why Use This Stock Position Size Calculator

Proper position sizing is essential for risk management in stock trading. This stock position size calculator helps you:

- **💰 Calculate Your Share Count** — know exactly how many shares to buy.
- **📊 Understand Your Risk** — see exactly how much you're risking.
- **📉 Set Smart Stop-Losses** — calculate position size based on your stop-loss.
- **💵 Account for Commissions** — include trading fees in your calculation.
- **📈 Visualize Your Risk** — see the breakdown of your trade.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## Stock Position Size Formula Used by This Tool

**Risk Amount = Account Balance × (Risk% / 100)**

**Number of Shares = Risk Amount ÷ Stop-Loss Amount (per share)**

**Total Cost = Number of Shares × Stock Price**

**Position Value = Number of Shares × Stock Price**

---

## How to Use This Stock Position Size Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **account balance**.
3.  Set your **risk per trade** percentage.
4.  Enter your **stop-loss** in dollars per share.
5.  Enter the **stock price** (optional — to see total cost).
6.  Enter the **stock symbol** (optional — for reference).
7.  Toggle **commission** on/off and enter the commission amount.
8.  View your results instantly — see the number of shares to buy and your risk amount.

---

## Frequently Asked Questions

### How is stock position size calculated?
Position size (shares) = Risk Amount ÷ Stop-Loss per Share. Risk Amount = Account Balance × (Risk% / 100).

### What is the stop-loss per share?
The stop-loss per share is the dollar amount you're willing to lose per share. If you buy at $50 and set a stop at $47.50, your stop-loss per share is $2.50.

### Why is stock price optional?
The stock price is optional because the core calculation only needs the stop-loss per share and risk amount. The price is used to show the total cost and position value.

### What is a good risk percentage for stocks?
Most traders risk 1-2% of their account balance per trade. This helps protect your capital during drawdowns.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

