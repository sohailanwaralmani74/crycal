---
layout: tool
title: ROI Calculator – Calculate Return on Investment
description: Calculate your return on investment (ROI) with our free ROI calculator. Enter initial investment, final value, and holding period to see total ROI.
permalink: /roi-calculator
tool_id: roi-calculator
category: investing
hide_sidebar: true

inputs:
  - id: initialInvestment
    label: Initial Investment
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: finalValue
    label: Final Value
    type: number
    default: 15000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 15000"

  - id: holdingPeriod
    label: Holding Period (years)
    type: number
    default: 5
    step: 0.5
    min: 0.01
    placeholder: "e.g., 5"

outputs:
  - id: totalROI
    label: Total ROI

  - id: annualizedROI
    label: Annualized ROI (CAGR)

  - id: netProfit
    label: Net Profit
  - id: totalInvested
    label: Total Invested
  - id: finalValueDisplay
    label: Final Value

charts:
  tabs:
    - id: growth
      label: Growth

history_columns:
  - key: initialInvestment
    label: Initial Investment
    source: input
  - key: finalValue
    label: Final Value
    source: input
  - key: holdingPeriod
    label: Years
    source: input
  - key: totalROI
    label: Total ROI (%)
    source: output
  - key: annualizedROI
    label: Annualized ROI (%)
    source: output

js_file: /assets/js/calculators/roi-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "ROI Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your return on investment (ROI) with our ROI calculator. Enter initial investment, final value, and holding period to see total ROI, annualized ROI, and net profit."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Total ROI Calculation"
    - "Annualized ROI (CAGR)"
    - "Net Profit"
    - "Growth Chart"
    - "170+ World Currencies"
    - "100% Private"
    - "Shareable Links"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: ROI Calculator

howto:
  name: "How to Use the ROI Calculator"
  description: "Follow these steps to calculate your return on investment."
  step:
    - name: "Enter your initial investment"
      text: "Enter the amount you originally invested."
    - name: "Enter the final value"
      text: "Enter the current or ending value of your investment."
    - name: "Enter the holding period"
      text: "Enter the number of years you held the investment."
    - name: "View your results"
      text: "See your total ROI, annualized ROI, and net profit."

faq:
  - question: "What is ROI?"
    answer: "Return on Investment (ROI) is a widely used metric that measures the profitability of an investment relative to its cost. It provides a quick, simple way to evaluate the potential return of anything from stocks and real estate to business ventures."
  - question: "What is the ROI formula?"
    answer: "The basic ROI formula is: ROI = (Gain from Investment − Cost of Investment) ÷ Cost of Investment × 100. For example, if you invest $50,000 and earn $70,000 in profits, your ROI is 40%."
  - question: "What is the difference between ROI and annualized ROI?"
    answer: "ROI does not account for time. Two investments with the same ROI can have vastly different holding periods. Annualized ROI (CAGR) adjusts for time, showing the average yearly return and enabling fair comparisons between different investment durations."
  - question: "Why is ROI sometimes difficult to use?"
    answer: "The challenge lies in defining 'cost' and 'gain'. Different investors include different factors such as taxes, insurance, capital expenditures, or operating costs. This variability makes ROI a useful starting point, but it should be supplemented with other metrics."
  - question: "Can I use this calculator for any investment?"
    answer: "Yes — use it for stocks, mutual funds, real estate, crypto, or any investment where you have start and end values."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# ROI Calculator – Measure Your Investment Returns

Return on Investment (ROI) is one of the most common and widely used metrics for evaluating the profitability of an investment. Before committing capital to any opportunity — whether stocks, real estate, business ventures, or even a sheep farm — ROI provides a solid foundation for decision-making. While more intricate formulas exist, ROI remains popular for its simplicity and versatility.

This ROI calculator helps you measure your investment returns quickly and accurately. Enter your initial investment, final value, and holding period to see your total ROI, annualized ROI (CAGR), and net profit. Whether you're comparing opportunities or evaluating past performance, this return on investment calculator gives you the numbers you need.

<!-- more -->

## Why Use This ROI Calculator

ROI is a powerful metric, but it has limitations — particularly the lack of a timeframe. This calculator addresses that by providing both total ROI and annualized ROI, enabling fair comparisons between investments of different durations.

- **💰 Total ROI** — see your overall percentage gain from the investment.
- **📊 Annualized ROI (CAGR)** — understand your average yearly return, adjusted for time.
- **📈 Visual Growth Chart** — track your investment's growth over the holding period.
- **🔁 Compare Investments** — use annualized ROI to compare opportunities with different timeframes.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally in your browser.

---

## ROI Formula Used by This Tool

**Total ROI = (Net Profit ÷ Total Invested) × 100**

**Annualized ROI (CAGR) = (Final Value ÷ Initial Investment)^(1 ÷ Years) − 1**

**Net Profit = Final Value − Initial Investment**

Where:

- **Initial Investment** = The amount you originally invested.
- **Final Value** = The current or ending value of your investment.
- **Holding Period** = The time in years you held the investment.

**Example:** Bob invested $50,000 in a sheep farming operation. His total profits to date are $70,000. His ROI is:
($70,000 − $50,000) ÷ $50,000 × 100 = **40%**

If Bob held the investment for 5 years, his annualized ROI (CAGR) would be:
(70,000 ÷ 50,000)^(1/5) − 1 = **6.96%** per year.

---

## How to Use This Return on Investment Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **initial investment** — the amount you originally invested.
3.  Enter the **final value** — the current or ending value of your investment.
4.  Enter the **holding period** — how many years you held the investment.
5.  View your results instantly — see your total ROI, annualized ROI, and net profit.

---

## Frequently Asked Questions

### What is ROI?
Return on Investment (ROI) is a widely used metric that measures the profitability of an investment relative to its cost. It provides a quick, simple way to evaluate the potential return of anything from stocks and real estate to business ventures.

### What is the ROI formula?
The basic ROI formula is: ROI = (Gain from Investment − Cost of Investment) ÷ Cost of Investment × 100. For example, if you invest $50,000 and earn $70,000 in profits, your ROI is 40%.

### What is the difference between ROI and annualized ROI?
ROI does not account for time. Two investments with the same ROI can have vastly different holding periods. Annualized ROI (CAGR) adjusts for time, showing the average yearly return and enabling fair comparisons between different investment durations.

### Why is ROI sometimes difficult to use?
The challenge lies in defining 'cost' and 'gain'. Different investors include different factors such as taxes, insurance, capital expenditures, or operating costs. This variability makes ROI a useful starting point, but it should be supplemented with other metrics.

### Can I use this calculator for any investment?
Yes — use it for stocks, mutual funds, real estate, crypto, or any investment where you have start and end values.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
