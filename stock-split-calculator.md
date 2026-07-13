---
layout: tool
title: Stock Split Calculator – Share Count & Cost Basis After Split
description: Use our free Stock Split Calculator to calculate your new share count and adjusted cost basis after a forward or reverse stock split. Enter your shares, cost basis, and split ratio.
permalink: /stock-split-calculator
tool_id: stock-split-calculator
category: growth
hide_sidebar: true

inputs:
  - id: sharesHeld
    label: Current Shares Held
    type: number
    default: 100
    step: 1
    min: 0
    placeholder: "e.g., 100"

  - id: costBasis
    label: Total Cost Basis
    type: number
    default: 5000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 5000"

  - id: splitRatio
    label: Split Ratio
    type: number
    default: 2
    step: 0.5
    min: 0.1
    placeholder: "e.g., 2 (2:1 forward split), 0.5 (1:2 reverse split)"

outputs:
  - id: newShares
    label: New Shares Held
  - id: newCostPerShare
    label: Adjusted Cost Per Share
  - id: totalCostBasis
    label: Total Cost Basis (Unchanged)
  - id: splitType
    label: Split Type
  - id: shareChange
    label: Share Count Change

charts:
  tabs:
    - id: breakdown
      label: Share Breakdown
    - id: comparison
      label: Before vs After

history_columns:
  - key: sharesHeld
    label: Shares Held
    source: input
  - key: costBasis
    label: Cost Basis
    source: input
  - key: splitRatio
    label: Split Ratio
    source: input
  - key: newShares
    label: New Shares
    source: output
  - key: newCostPerShare
    label: New Cost/Share
    source: output

js_file: assets/js/calculators/stock-split-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Stock Split Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your new share count and adjusted cost basis after a forward or reverse stock split. Enter your shares, cost basis, and split ratio."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "New Share Count Calculation"
    - "Adjusted Cost Per Share"
    - "Forward & Reverse Split Support"
    - "Visual Comparison Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Stock Split Calculator

howto:
  name: "How to Use the Stock Split Calculator"
  description: "Follow these steps to calculate your new share count and adjusted cost basis after a stock split."
  step:
    - name: "Enter your current shares held"
      text: "Enter the number of shares you currently hold."
    - name: "Enter your total cost basis"
      text: "Enter your total cost basis (the original total amount invested)."
    - name: "Enter the split ratio"
      text: "Enter the split ratio. For a 2:1 forward split, enter 2. For a 1:2 reverse split, enter 0.5."
    - name: "View your results"
      text: "See your new share count, adjusted cost per share, and split type."

faq:
  - question: "What is a stock split?"
    answer: "A stock split is when a company divides its existing shares into multiple shares to increase liquidity. The total value of your investment stays the same, but the number of shares increases and the price per share decreases proportionally."
  - question: "What is a reverse stock split?"
    answer: "A reverse stock split is when a company combines multiple shares into one share. The total value of your investment stays the same, but the number of shares decreases and the price per share increases proportionally."
  - question: "How is the new share count calculated?"
    answer: "New Shares = Current Shares × Split Ratio. For a 2:1 forward split with 100 shares, new shares = 200. For a 1:2 reverse split with 100 shares, new shares = 50."
  - question: "How is the adjusted cost per share calculated?"
    answer: "Adjusted Cost Per Share = Total Cost Basis ÷ New Shares. The total cost basis remains unchanged in a stock split."
  - question: "Does a stock split affect my total cost basis?"
    answer: "No. The total cost basis remains unchanged. Only the number of shares and the cost per share are adjusted."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Stock Split Calculator – Share Count & Cost Basis After Split

Calculate your new share count and adjusted cost basis after a stock split with our free **Stock Split Calculator**. Enter your current shares, total cost basis, and split ratio to see your adjusted holdings — all without your data leaving your browser.

<!-- more -->

## Why Use This Stock Split Calculator

Stock splits can be confusing. Our **Stock Split Calculator** helps you:

- 📊 **Calculate New Share Count** — know exactly how many shares you'll hold after a split.
- 💰 **Adjust Cost Basis** — see your new cost per share after the split.
- 🔄 **Forward & Reverse Splits** — handles both types of splits.
- 📈 **Visual Comparison** — see before and after side by side.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is a Stock Split?

A **stock split** is when a company divides its existing shares into multiple shares to increase liquidity and make shares more affordable. The total value of your investment stays the same.

| Split Type | Example | Shares Before | Shares After | Price Before | Price After |
|------------|---------|---------------|--------------|--------------|-------------|
| **Forward Split** | 2:1 | 100 | 200 | $50 | $25 |
| **Reverse Split** | 1:2 | 100 | 50 | $50 | $100 |

---

## The Stock Split Formula

**New Shares = Current Shares × Split Ratio**

**Adjusted Cost Per Share = Total Cost Basis ÷ New Shares**

**Example (2:1 Forward Split):**

| Variable | Value |
|----------|-------|
| Current Shares | 100 |
| Split Ratio | 2 |
| Total Cost Basis | $5,000 |
| **New Shares** | **100 × 2 = 200** |
| **Adjusted Cost Per Share** | **$5,000 ÷ 200 = $25** |

**Example (1:2 Reverse Split):**

| Variable | Value |
|----------|-------|
| Current Shares | 100 |
| Split Ratio | 0.5 |
| Total Cost Basis | $5,000 |
| **New Shares** | **100 × 0.5 = 50** |
| **Adjusted Cost Per Share** | **$5,000 ÷ 50 = $100** |

---

## How to Use This Stock Split Calculator

1. **Enter your current shares held** — how many shares you own today.
2. **Enter your total cost basis** — your original total investment amount.
3. **Enter the split ratio** — 2 for a 2:1 forward split, 0.5 for a 1:2 reverse split.
4. **View your results** — see your new shares, adjusted cost per share, and split type.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## Stock Split Examples

| Scenario | Shares | Cost Basis | Ratio | New Shares | New Cost/Share |
|----------|--------|------------|-------|------------|----------------|
| 2:1 Split | 100 | $5,000 | 2 | 200 | $25.00 |
| 3:1 Split | 100 | $5,000 | 3 | 300 | $16.67 |
| 1:2 Reverse | 100 | $5,000 | 0.5 | 50 | $100.00 |
| 1:5 Reverse | 100 | $5,000 | 0.2 | 20 | $250.00 |

---

## Frequently Asked Questions

### What is a stock split?
A stock split is when a company divides its existing shares into multiple shares to increase liquidity. The total value of your investment stays the same, but the number of shares increases and the price per share decreases proportionally.

### What is a reverse stock split?
A reverse stock split is when a company combines multiple shares into one share. The total value of your investment stays the same, but the number of shares decreases and the price per share increases proportionally.

### How is the new share count calculated?
New Shares = Current Shares × Split Ratio. For a 2:1 forward split with 100 shares, new shares = 200. For a 1:2 reverse split with 100 shares, new shares = 50.

### How is the adjusted cost per share calculated?
Adjusted Cost Per Share = Total Cost Basis ÷ New Shares. The total cost basis remains unchanged in a stock split.

### Does a stock split affect my total cost basis?
No. The total cost basis remains unchanged. Only the number of shares and the cost per share are adjusted.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.