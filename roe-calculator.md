---
layout: tool
title: "ROE Calculator | Return on Equity & DuPont Analysis"
description: "Calculate Return on Equity (ROE) and DuPont financial analysis metrics to evaluate corporate capital efficiency. 100% free and private browser execution."
permalink: /roe-calculator
tool_id: roe-calculator
category: growth
hide_sidebar: true

inputs:
  - id: netIncome
    label: Net Income
    type: number
    default: 500000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 500000"

  - id: shareholdersEquity
    label: Shareholders' Equity
    type: number
    default: 2500000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 2500000"

  - id: averageEquity
    label: Average Shareholders' Equity (optional)
    type: number
    default: 0
    step: 10000
    min: 0
    currency: true
    placeholder: "Leave 0 to use end-of-period equity"

outputs:
  - id: roe
    label: Return on Equity (ROE)
  - id: roeBreakdown
    label: ROE Breakdown
  - id: performance
    label: Performance Assessment
  - id: netProfitMargin
    label: Net Profit Margin (if calculable)
  - id: assetTurnover
    label: Asset Turnover (if calculable)
  - id: equityMultiplier
    label: Equity Multiplier (if calculable)
  - id: recommendation
    label: Recommendation

charts:
  tabs:
    - id: breakdown
      label: ROE Breakdown
    - id: comparison
      label: DuPont Analysis

history_columns:
  - key: netIncome
    label: Net Income
    source: input
  - key: shareholdersEquity
    label: Shareholders' Equity
    source: input
  - key: roe
    label: ROE (%)
    source: output
  - key: performance
    label: Performance
    source: output

js_file: assets/js/calculators/roe-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "ROE Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Return on Equity (ROE) and perform DuPont financial analysis to evaluate corporate profitability and capital efficiency."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Return on Equity (ROE) Calculation — measure net income generated per dollar of shareholder equity"
    - "DuPont Financial Analysis — decompose ROE into Profit Margin, Asset Turnover, and Financial Leverage"
    - "Average Equity Modeling — calculate precise ROE across multi-period balance sheets"
    - "100% Client-Side Privacy — execute calculations locally inside your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: ROE Calculator

howto:
  name: "How to Calculate Return on Equity (ROE)"
  description: "Calculate ROE percentages and analyze corporate profitability efficiency."
  step:
    - name: "Select currency"
      text: "Choose your currency from the top header panel."
    - name: "Input net income"
      text: "Enter net annual profit after tax and preferred dividends."
    - name: "Input shareholders' equity"
      text: "Enter total shareholders' equity balance from the balance sheet."
    - name: "Input average equity (optional)"
      text: "Enter average shareholders' equity over the fiscal period if available."
    - name: "Analyze ROE performance"
      text: "Review ROE percentage, performance assessment rating, and DuPont breakdown."

faq:
  - question: "What is Return on Equity (ROE)?"
    answer: "Return on Equity (ROE) is a financial profitability metric that measures how effectively a company generates net income relative to total shareholders' equity."
  - question: "What is considered a good ROE percentage?"
    answer: "An ROE of 15% to 20% is generally considered good to excellent across most industries. Comparing ROE against industry peers is necessary for meaningful analysis."
  - question: "What is the 3-Step DuPont Analysis?"
    answer: "DuPont analysis breaks down ROE into three core components: Net Profit Margin (Profitability), Asset Turnover (Efficiency), and Equity Multiplier (Financial Leverage)."
  - question: "Can a high ROE be misleading?"
    answer: "Yes. A company can achieve an artificially high ROE by taking on excessive debt, which reduces shareholders' equity (the denominator) while increasing financial risk."
  - question: "What causes negative ROE?"
    answer: "A negative ROE occurs when a business operates at a net loss (negative net income) or has negative net shareholders' equity due to accumulated losses."
  - question: "Why use Average Shareholders' Equity instead of Ending Equity?"
    answer: "Using average equity ($\text{Beginning Equity} + \text{Ending Equity} / 2$) accounts for equity fluctuations, stock buybacks, or new share issuances during the fiscal year."
  - question: "Is my corporate financial data private?"
    answer: "Yes, 100%. All calculation algorithms execute locally inside your web browser. No corporate income, balance sheet, or equity metrics are uploaded or logged."
---

# ROE Calculator

Calculate Return on Equity (ROE) and evaluate corporate capital allocation efficiency with our free financial analysis tool.
Featuring multi-currency support, DuPont identity breakdown, and 100% private browser execution so your corporate financial data remains strictly confidential.

<!-- more -->

## Why Use the ROE Calculator?

Return on Equity (ROE) is one of the most widely respected financial metrics used by investors, financial analysts, and corporate leadership. It measures how effectively management deploys capital provided by equity shareholders to generate net profit. In simple terms, ROE demonstrates how many cents of profit a business earns for every dollar of shareholder equity invested.

Our **ROE Calculator** provides business owners, equity researchers, and executive management with instant diagnostic insights into financial health. By entering net annual income and total shareholders' equity (or average equity across the fiscal year), this tool calculates exact ROE percentage and provides a structured performance assessment.

Furthermore, analyzing ROE is vital when evaluating corporate management quality and capital allocation. A consistently high ROE indicates that a company possesses a strong competitive moat, pricing power, and efficient asset utilization. Using DuPont analysis to decompose ROE reveals whether profitability is driven by strong operating margins, high asset turnover, or financial leverage.

---

## Mathematical Formulas & Mechanics

The basic formula for Return on Equity ($\text{ROE}$) is calculated as:

$$\text{ROE (\%)} = \left( \frac{\text{Net Income}}{\text{Shareholders' Equity}} \right) \times 100$$

When using Average Shareholders' Equity ($\text{Equity}_{\text{avg}}$) across the fiscal period:

$$\text{Equity}_{\text{avg}} = \frac{\text{Equity}_{\text{beginning}} + \text{Equity}_{\text{ending}}}{2}$$

$$\text{ROE (\%)} = \left( \frac{\text{Net Income}}{\text{Equity}_{\text{avg}}} \right) \times 100$$

Under the 3-Step DuPont Financial Framework, ROE is decomposed into three distinct operational drivers:

$$\text{ROE} = \underbrace{\left(\frac{\text{Net Income}}{\text{Revenue}}\right)}_{\text{Net Profit Margin}} \times \underbrace{\left(\frac{\text{Revenue}}{\text{Total Assets}}\right)}_{\text{Asset Turnover}} \times \underbrace{\left(\frac{\text{Total Assets}}{\text{Shareholders' Equity}}\right)}_{\text{Equity Multiplier (Leverage)}}$$

---

## Real-World Comparison & Benchmark Table

The benchmark table below outlines ROE metrics and performance assessments across various business profiles and leverage structures for a company with **$500,000 Net Income**:

| Corporate Profile | Shareholders' Equity | Financial Leverage | ROE % | Net Profit Margin | Asset Turnover | Equity Multiplier | Performance Assessment |
|---|---|---|---|---|---|---|---|
| **Early Venture Tech** | $5,000,000 | Unleveraged | **10.00%** | 20.0% | 0.50x | 1.00x | Below Average |
| **Mature Software** | $2,500,000 | Low Debt | **20.00%** | 25.0% | 0.67x | 1.20x | **Strong Benchmark** |
| **High Efficiency** | $1,666,667 | Moderate Debt | **30.00%** | 15.0% | 1.25x | 1.60x | Elite Performance |
| **Heavy Leverage** | $1,000,000 | High Debt | **50.00%** | 8.0% | 1.25x | 5.00x | High Risk Leverage |
| **Unprofitable Startup**| $2,000,000 | Unleveraged (-$200k Net) | **-10.00%** | -15.0% | 0.40x | 1.00x | Operating Loss |

*DuPont Analysis Note*: Two companies can both report a 30% ROE, but one may achieve it through 25% net profit margins (high moat), while the other relies on a 5.0x equity multiplier (high financial risk).

---

## Step-by-Step How-To Guide

1. **Select Currency**: Choose your preferred currency ($ USD, € EUR, £ GBP) from the site header.
2. **Input Net Income**: Enter annual net profit after tax and preferred dividends from the income statement.
3. **Input Shareholders' Equity**: Enter total shareholders' equity (total assets minus total liabilities) from the balance sheet.
4. **Input Average Equity (Optional)**: Input average shareholders' equity if tracking multi-year performance.
5. **Review Financial Metrics**: Evaluate calculated ROE percentage, performance rating, and DuPont efficiency components.
6. **Benchmark Performance**: Compare ROE against industry competitors to evaluate corporate management quality.

---

## Frequently Asked Questions

### What is Return on Equity (ROE)?
Return on Equity (ROE) is a financial profitability metric that measures how effectively a company generates net income relative to total shareholders' equity.

### What is considered a good ROE percentage?
An ROE of 15% to 20% is generally considered good to excellent across most industries. Comparing ROE against industry peers is necessary for meaningful analysis.

### What is the 3-Step DuPont Analysis?
DuPont analysis breaks down ROE into three core components: Net Profit Margin (Profitability), Asset Turnover (Efficiency), and Equity Multiplier (Financial Leverage).

### Can a high ROE be misleading?
Yes. A company can achieve an artificially high ROE by taking on excessive debt, which reduces shareholders' equity (the denominator) while increasing financial risk.

### What causes negative ROE?
A negative ROE occurs when a business operates at a net loss (negative net income) or has negative net shareholders' equity due to accumulated losses.

### Why use Average Shareholders' Equity instead of Ending Equity?
Using average equity ($\text{Beginning Equity} + \text{Ending Equity} / 2$) accounts for equity fluctuations, stock buybacks, or new share issuances during the fiscal year.

### Is my corporate financial data private?
Yes, 100%. All calculation algorithms execute locally inside your web browser. No corporate income, balance sheet, or equity metrics are uploaded or logged.