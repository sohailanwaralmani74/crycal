---
layout: tool
title: Crypto Position Size Calculator
description: Calculate position sizes for crypto perpetual futures. Supports both linear (USDT-margined) and inverse (Coin-margined) contracts. Works for all cryptocurrencies.
permalink: /crypto-position-size-calculator
tool_id: crypto-position-size
category: investing
hide_sidebar: true

inputs:
  - id: accountBalance
    label: Account Balance
    type: number
    default: 10000
    step: 100
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

  - id: entryPrice
    label: Entry Price
    type: number
    default: 60000
    step: 100
    min: 0.01
    currency: true
    placeholder: "e.g., 60000 for BTC"

  - id: stopLossPrice
    label: Stop-Loss Price
    type: number
    default: 58200
    step: 100
    min: 0.01
    currency: true
    placeholder: "e.g., 58200 for BTC"

  - id: currentPrice
    label: Current Price
    type: number
    default: 60000
    step: 100
    min: 0.01
    currency: true
    placeholder: "Used for exposure calculation"

  - id: contractType
    label: Contract Type
    type: select
    default: linear
    options:
      - linear
      - inverse

  - id: contractSize
    label: Contract Size (per contract)
    type: number
    default: 1
    step: 0.1
    min: 0.01
    currency: true
    placeholder: "1 contract = $1 (linear) or user-defined"

  - id: leverage
    label: Leverage
    type: number
    default: 1
    step: 0.5
    min: 1
    max: 100

outputs:
  - id: positionSizeContracts
    label: Position Size (Contracts)
  - id: positionSizeUnits
    label: Position Size (Units)
  - id: riskAmount
    label: Risk Amount
  - id: totalExposure
    label: Total Exposure
  - id: requiredMargin
    label: Required Margin
  - id: priceDistance
    label: Price Distance
    unit: '$'

charts:
  tabs:
    - id: comparison
      label: Comparison

history_columns:
  - key: accountBalance
    label: Balance
    source: input
  - key: riskPercent
    label: Risk %
    source: input
  - key: entryPrice
    label: Entry Price
    source: input
  - key: stopLossPrice
    label: Stop Price
    source: input
  - key: contractType
    label: Contract Type
    source: input
  - key: positionSizeContracts
    label: Contracts
    source: output
  - key: riskAmount
    label: Risk Amount
    source: output

js_file: /assets/js/calculators/crypto-position-size.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Crypto Position Size Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate position sizes for crypto perpetual futures. Supports both linear (USDT-margined) and inverse (Coin-margined) contracts. Works for all cryptocurrencies."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Linear & Inverse Contracts — supports both USDT-margined and Coin-margined futures"
    - "Leverage Support — see your required margin"
    - "Risk Management — see exactly how much you're risking"
    - "Visual Comparison — see your risk allocation"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Trading
    url: /trading
  - name: Crypto Position Size Calculator

howto:
  name: "How to Use the Crypto Position Size Calculator"
  description: "Follow these steps to calculate your crypto position size."
  step:
    - name: "Enter your account balance"
      text: "Enter your total trading capital in your account currency."
    - name: "Set your risk percentage"
      text: "Enter the percentage of your account you're willing to risk."
    - name: "Enter your entry price"
      text: "Enter the price you plan to enter at."
    - name: "Enter your stop-loss price"
      text: "Enter the price where you'll cut losses."
    - name: "Select contract type"
      text: "Choose linear (USDT-margined) or inverse (Coin-margined)."
    - name: "Enter leverage"
      text: "Enter the leverage you're using (default: 1x)."
    - name: "View your results"
      text: "See your position size in contracts, risk amount, required margin, and total exposure."

faq:
  - question: "What is the difference between linear and inverse contracts?"
    answer: "Linear contracts (USDT-margined) use USDT as collateral and have linear PnL. Inverse contracts (Coin-margined) use the cryptocurrency itself as collateral and have inverse PnL."
  - question: "How is position size calculated for linear contracts?"
    answer: "Position Size = Risk Amount ÷ (Entry Price − Stop-Loss Price). Each contract is worth $1 (or your contract size)."
  - question: "How is position size calculated for inverse contracts?"
    answer: "Position Size = Risk Amount × Entry Price ÷ (Entry Price − Stop-Loss Price). This accounts for the inverse PnL formula."
  - question: "What is required margin?"
    answer: "Required Margin = Total Exposure ÷ Leverage. This is the minimum amount of collateral required to open the position."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Crypto Position Size Calculator – Size Your Crypto Trades

Use this crypto position size calculator to determine the optimal position size for crypto perpetual futures. Enter your account balance, risk percentage, entry price, stop-loss price, and contract type — the tool works for both linear (USDT-margined) and inverse (Coin-margined) contracts. This crypto risk calculator helps you size your trades with precision.

<!-- more -->

## Why Use This Crypto Position Size Calculator

Proper position sizing is essential for managing risk in crypto trading. This crypto position size calculator helps you:

- **💰 Calculate Your Contract Size** — know exactly how many contracts to trade.
- **📊 Support Both Contract Types** — linear and inverse contracts.
- **📉 Understand Your Risk** — see exactly how much you're risking.
- **⚡ Leverage Support** — see your required margin.
- **📈 Visualize Your Risk** — see the breakdown of your trade.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## Crypto Position Size Formula Used by This Tool

### Linear Contracts (USDT-Margined)

**Price Distance = Entry Price − Stop-Loss Price**

**Position Size (contracts) = Risk Amount ÷ Price Distance**

### Inverse Contracts (Coin-Margined)

**Price Distance = Entry Price − Stop-Loss Price**

**Position Size (contracts) = (Risk Amount × Entry Price) ÷ Price Distance**

**Risk Amount = Account Balance × (Risk% / 100)**

**Total Exposure = Position Size × Entry Price**

**Required Margin = Total Exposure ÷ Leverage**

---

## How to Use This Crypto Position Size Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **account balance**.
3.  Set your **risk per trade** percentage.
4.  Enter your **entry price** (the price you plan to enter at).
5.  Enter your **stop-loss price** (where you'll cut losses).
6.  Select **contract type** (linear or inverse).
7.  Enter your **leverage** (default: 1x).
8.  View your results instantly — see your position size in contracts, risk amount, required margin, and total exposure.

---

## Frequently Asked Questions

### What is the difference between linear and inverse contracts?
Linear contracts (USDT-margined) use USDT as collateral and have linear PnL. Inverse contracts (Coin-margined) use the cryptocurrency itself as collateral and have inverse PnL.

### How is position size calculated for linear contracts?
Position Size = Risk Amount ÷ (Entry Price − Stop-Loss Price). Each contract is worth $1 (or your contract size).

### How is position size calculated for inverse contracts?
Position Size = Risk Amount × Entry Price ÷ (Entry Price − Stop-Loss Price). This accounts for the inverse PnL formula.

### What is required margin?
Required Margin = Total Exposure ÷ Leverage. This is the minimum amount of collateral required to open the position.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

