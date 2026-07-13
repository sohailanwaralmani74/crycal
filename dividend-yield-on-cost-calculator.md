---
layout: tool
title: Dividend Yield on Cost Calculator – Calculate Your YOC
description: Use our free Dividend Yield on Cost Calculator to determine your yield on cost (YOC). Enter your purchase price, current dividend, and shares to see your effective yield based on your original investment.
permalink: /dividend-yield-on-cost-calculator
tool_id: dividend-yield-on-cost-calculator
category: growth
hide_sidebar: true

inputs:
  - id: purchasePrice
    label: Purchase Price Per Share
    type: number
    default: 50.00
    step: 0.01
    min: 0
    currency: true
    placeholder: "e.g., 50.00"

  - id: sharesHeld
    label: Shares Held
    type: number
    default: 100
    step: 1
    min: 0
    placeholder: "e.g., 100"

  - id: annualDividendPerShare
    label: Annual Dividend Per Share
    type: number
    default: 2.00
    step: 0.01
    min: 0
    currency: true
    placeholder: "e.g., 2.00"

  - id: dividendGrowthRate
    label: Expected Annual Dividend Growth Rate (%)
    type: number
    default: 5.0
    step: 0.1
    min: -10
    max: 50
    suffix: '%'
    placeholder: "e.g., 5.0"

outputs:
  - id: totalInvestment
    label: Total Investment
  - id: annualDividendIncome
    label: Annual Dividend Income
  - id: dividendYieldOnCost
    label: Dividend Yield on Cost (YOC)
  - id: currentYield
    label: Current Yield
  - id: yieldDifference
    label: Yield Difference (YOC - Current Yield)
  - id: projectedIncome
    label: Projected Annual Income (Year 10)

charts:
  tabs:
    - id: growth
      label: Dividend Income Growth
    - id: comparison
      label: YOC vs Current Yield
    - id: breakdown
      label: Investment Breakdown

history_columns:
  - key: purchasePrice
    label: Purchase Price
    source: input
  - key: sharesHeld
    label: Shares
    source: input
  - key: annualDividendPerShare
    label: Annual Dividend
    source: input
  - key: dividendYieldOnCost
    label: YOC (%)
    source: output
  - key: annualDividendIncome
    label: Annual Income
    source: output

js_file: assets/js/calculators/dividend-yield-on-cost-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Dividend Yield on Cost Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your dividend yield on cost (YOC) based on your original purchase price and current dividend. See your effective yield and projected income growth."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Yield on Cost (YOC) Calculation"
    - "Current Yield Comparison"
    - "Dividend Income Projection"
    - "Growth Chart Visualization"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: Dividend Yield on Cost Calculator

howto:
  name: "How to Use the Dividend Yield on Cost Calculator"
  description: "Follow these steps to calculate your dividend yield on cost and projected income growth."
  step:
    - name: "Enter your purchase price per share"
      text: "Enter the price you originally paid per share."
    - name: "Enter the number of shares held"
      text: "Enter how many shares you currently hold."
    - name: "Enter the annual dividend per share"
      text: "Enter the current annual dividend paid per share."
    - name: "Enter the expected dividend growth rate"
      text: "Enter the annual growth rate you expect for future dividends (optional)."
    - name: "View your results"
      text: "See your yield on cost, current yield, and projected income growth."

faq:
  - question: "What is dividend yield on cost (YOC)?"
    answer: "Dividend Yield on Cost (YOC) is the annual dividend income divided by your original purchase price. It shows the effective yield you're earning based on what you originally paid for the stock, not the current market price."
  - question: "How is yield on cost calculated?"
    answer: "Yield on Cost = (Annual Dividend Per Share ÷ Purchase Price Per Share) × 100. For example, if you paid $50 per share and receive $2.00 in annual dividends, your YOC is 4%."
  - question: "What is the difference between yield on cost and current yield?"
    answer: "Yield on Cost is based on your original purchase price. Current Yield is based on the current market price. YOC grows over time as dividends increase, while current yield fluctuates with the stock price."
  - question: "Why is yield on cost important?"
    answer: "Yield on Cost shows the true return on your original investment. For long-term investors, YOC can grow significantly as companies increase dividends, often reaching 10% or more after many years."
  - question: "How does dividend growth affect yield on cost?"
    answer: "As companies raise their dividends, your annual dividend income increases. Since your original cost basis stays the same, your yield on cost grows over time."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Dividend Yield on Cost Calculator – Calculate Your YOC

Calculate your dividend yield on cost (YOC) with our free **Dividend Yield on Cost Calculator**. Enter your purchase price, shares held, and annual dividend to see your effective yield based on your original investment — all without your data leaving your browser.

<!-- more -->

## Why Use This Dividend Yield on Cost Calculator

Yield on Cost (YOC) is one of the most important metrics for long-term dividend investors. Our **Dividend Yield on Cost Calculator** helps you:

- 💰 **Calculate YOC** — see your effective yield based on your original purchase price.
- 📈 **Compare YOC vs Current Yield** — understand the true return on your investment.
- 📊 **Project Dividend Growth** — see how dividend increases boost your income over time.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is Dividend Yield on Cost (YOC)?

**Yield on Cost (YOC)** is the annual dividend income you receive divided by your original purchase price. It shows the effective yield you're earning based on what you originally paid for the stock.

**The Formula:**

**Yield on Cost = (Annual Dividend Per Share ÷ Purchase Price Per Share) × 100**

**Example:**

| Variable | Value |
|----------|-------|
| Purchase Price Per Share | $50.00 |
| Annual Dividend Per Share | $2.00 |
| **Yield on Cost** | **($2.00 ÷ $50.00) × 100 = 4.00%** |

---

## YOC vs Current Yield

| Metric | Formula | What It Shows |
|--------|---------|---------------|
| **Yield on Cost (YOC)** | Dividend ÷ Purchase Price | Return on your original investment |
| **Current Yield** | Dividend ÷ Current Price | Return based on current market price |

**Example (Stock Price Rises to $60):**

| Metric | Value |
|--------|-------|
| Purchase Price | $50.00 |
| Current Price | $60.00 |
| Annual Dividend | $2.00 |
| **Yield on Cost** | **4.00%** |
| **Current Yield** | **3.33%** |

Your YOC remains 4% (based on what you paid), while current yield drops to 3.33% (based on the higher price).

---

## How Dividend Growth Boosts YOC

| Year | Dividend | YOC (Based on $50 Purchase) |
|------|----------|-----------------------------|
| Year 1 | $2.00 | 4.00% |
| Year 5 | $2.55 | 5.10% |
| Year 10 | $3.26 | 6.52% |
| Year 15 | $4.16 | 8.32% |
| Year 20 | $5.31 | 10.62% |

As companies raise their dividends, your YOC grows — even though you originally paid the same price.

---

## How to Use This Dividend Yield on Cost Calculator

1. **Enter your purchase price per share** — the price you originally paid.
2. **Enter your shares held** — how many shares you own.
3. **Enter the annual dividend per share** — current annual dividend.
4. **Enter the expected dividend growth rate** — how much you expect dividends to grow annually (optional).
5. **View your results** — see your YOC, current yield, and projected income.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## Example: Long-Term Dividend Investing

**Scenario:** You bought 100 shares of a dividend stock at $50 per share ($5,000 total investment). The stock now pays $2.00 per share annually and has a 5% dividend growth rate.

| Metric | Value |
|--------|-------|
| Total Investment | $5,000 |
| Annual Dividend Income | $200 |
| **Yield on Cost** | **4.00%** |
| Projected Income (Year 10) | $326 |
| YOC After 10 Years | 6.52% |

After 10 years of 5% dividend growth, your YOC has grown from 4% to 6.52% — all based on your original investment.

---

## Frequently Asked Questions

### What is dividend yield on cost (YOC)?
Dividend Yield on Cost (YOC) is the annual dividend income divided by your original purchase price. It shows the effective yield you're earning based on what you originally paid for the stock.

### How is yield on cost calculated?
Yield on Cost = (Annual Dividend Per Share ÷ Purchase Price Per Share) × 100.

### What is the difference between yield on cost and current yield?
Yield on Cost is based on your original purchase price. Current Yield is based on the current market price. YOC grows over time as dividends increase.

### Why is yield on cost important?
Yield on Cost shows the true return on your original investment. For long-term investors, YOC can grow significantly as companies increase dividends, often reaching 10% or more after many years.

### How does dividend growth affect yield on cost?
As companies raise their dividends, your annual dividend income increases. Since your original cost basis stays the same, your yield on cost grows over time.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.