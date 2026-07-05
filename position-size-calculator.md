---
layout: tool
title: Position Size Calculator
description: Calculate the optimal position size for any trade. Enter your account balance, risk percentage, stop-loss distance, and per-unit value — works for any asset class.
permalink: /position-size-calculator
tool_id: position-size
category: trading
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

  - id: stopLoss
    label: Stop-Loss Distance
    type: number
    default: 50
    step: 1
    min: 0.01
    placeholder: "e.g., 50 pips, 5 points, $2.50"

  - id: unitValue
    label: Per-Unit Value (Pip / Point / Tick value)
    type: number
    default: 10
    step: 0.01
    min: 0.01
    placeholder: "Monetary value of one unit of movement"
    currency: true

  - id: unitType
    label: Unit Type
    type: select
    default: pips
    options:
      - pips
      - points
      - ticks
      - dollars

  - id: positionUnit
    label: Position Unit (Lots / Shares / Contracts)
    type: text
    default: lots
    placeholder: "e.g., lots, shares, contracts"

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
  - id: positionSize
    label: Position Size
  - id: riskAmount
    label: Risk Amount
  - id: totalExposure
    label: Total Exposure (if applicable)

charts:
  tabs:
    - id: breakdown
      label: Breakdown

history_columns:
  - key: accountBalance
    label: Balance
    source: input
  - key: riskPercent
    label: Risk %
    source: input
  - key: stopLoss
    label: Stop
    source: input
  - key: unitValue
    label: Unit Value
    source: input
  - key: positionSize
    label: Position Size
    source: output
  - key: riskAmount
    label: Risk Amount
    source: output

js_file: /assets/js/calculators/position-size.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Position Size Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the optimal position size for any trade. Enter your account balance, risk percentage, stop-loss distance, and per-unit value — works for any asset class."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Universal Formula — works for any asset"
    - "Customizable Units — define your own position units"
    - "Risk Management — see exactly how much you're risking"
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
  - name: Position Size Calculator

howto:
  name: "How to Use the Position Size Calculator"
  description: "Follow these steps to calculate your position size."
  step:
    - name: "Enter your account balance"
      text: "Enter your total trading capital in your account currency."
    - name: "Set your risk percentage"
      text: "Enter the percentage of your account you're willing to risk on this trade."
    - name: "Enter your stop-loss distance"
      text: "Enter the distance from entry to your stop-loss in pips, points, ticks, or dollars."
    - name: "Enter the per-unit value"
      text: "Enter the monetary value of one unit of movement (e.g., $10 per pip for a standard lot)."
    - name: "Choose your position unit"
      text: "Enter the unit you want to size in (e.g., lots, shares, contracts)."
    - name: "View your results"
      text: "See your recommended position size, risk amount, and total exposure."

faq:
  - question: "What is position size?"
    answer: "Position size is the number of units (lots, shares, contracts) you should trade to keep your risk within your defined limit. It's calculated as (Account Balance × Risk%) ÷ (Stop Loss × Per-Unit Value)."
  - question: "What is the per-unit value?"
    answer: "The per-unit value is the monetary worth of one pip, point, tick, or dollar move. For Forex, a standard lot's pip value is typically $10 for USD-based pairs. For stocks, it's $1 per share."
  - question: "How is risk amount calculated?"
    answer: "Risk Amount = Account Balance × (Risk% / 100). This is the maximum amount you're willing to lose on this trade."
  - question: "Can I use this calculator for any asset?"
    answer: "Yes — it works for Forex, stocks, crypto, futures, commodities, and any other asset class. Just set the appropriate stop-loss distance and per-unit value."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Position Size Calculator – Size Your Trades with Precision

Use this position size calculator to determine the optimal number of units (lots, shares, contracts) for any trade. Enter your account balance, risk percentage, stop-loss distance, and per-unit value — the tool works for any asset class. This risk management calculator helps you protect your capital and trade with discipline.

<!-- more -->

## Why Use This Position Sizing Tool

Position sizing is the cornerstone of risk management. This pure position size calculator helps you:

- **💰 Calculate Your Position Size** — know exactly how many units to trade.
- **📊 Understand Your Risk** — see exactly how much you're risking.
- **🌍 Works for Any Asset** — Forex, stocks, crypto, futures, and more.
- **📈 Visualize Your Risk** — see the breakdown of your trade.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## Position Size Formula Used by This Tool

**Risk Amount = Account Balance × (Risk% / 100)**

**Position Size = Risk Amount ÷ (Stop Loss × Per‑Unit Value)**

**Total Exposure = Position Size × Stop Loss × Per‑Unit Value** (optional)

---

## How to Use This Position Size Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **account balance**.
3.  Set your **risk per trade** percentage.
4.  Enter your **stop-loss distance** (in pips, points, ticks, or dollars).
5.  Enter the **per-unit value** (monetary value of one unit of movement).
6.  Choose your **position unit** (e.g., lots, shares, contracts).
7.  View your results instantly — see your position size, risk amount, and exposure.

---

## Frequently Asked Questions

### What is position size?
Position size is the number of units (lots, shares, contracts) you should trade to keep your risk within your defined limit. It's calculated as (Account Balance × Risk%) ÷ (Stop Loss × Per-Unit Value).

### What is the per-unit value?
The per-unit value is the monetary worth of one pip, point, tick, or dollar move. For Forex, a standard lot's pip value is typically $10 for USD-based pairs. For stocks, it's $1 per share.

### How is risk amount calculated?
Risk Amount = Account Balance × (Risk% / 100). This is the maximum amount you're willing to lose on this trade.

### Can I use this calculator for any asset?
Yes — it works for Forex, stocks, crypto, futures, commodities, and any other asset class. Just set the appropriate stop-loss distance and per-unit value.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---

