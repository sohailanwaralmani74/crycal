---
layout: tool
title: Compound Annual Growth Rate Calculator – Calculate CAGR Online
description: Calculate the compound annual growth rate (CAGR) of your investments. Enter initial value, final value, and time period to see your annualized return.
permalink: /compound-annual-growth-rate-calculator
tool_id: cagr-calculator
category: growth
hide_sidebar: true

inputs:
  - id: initialValue
    label: Initial Value
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: finalValue
    label: Final Value
    type: number
    default: 18000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 18000"

  - id: years
    label: Time Period (years)
    type: number
    default: 5
    step: 0.5
    min: 0.01
    placeholder: "e.g., 5"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: annually
    options:
      - annually
      - semi-annually
      - quarterly
      - monthly
      - daily

outputs:
  - id: cagr
    label: CAGR
  - id: totalReturn
    label: Total Return
  - id: totalGain
    label: Total Gain
  - id: finalValueDisplay
    label: Final Value

charts:
  tabs:
    - id: growth
      label: Growth

history_columns:
  - key: initialValue
    label: Initial Value
    source: input
  - key: finalValue
    label: Final Value
    source: input
  - key: years
    label: Years
    source: input
  - key: cagr
    label: CAGR (%)
    source: output
  - key: totalReturn
    label: Total Return (%)
    source: output

js_file: /assets/js/calculators/cagr-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Compound Annual Growth Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the compound annual growth rate (CAGR) of your investments. Enter initial value, final value, and time period to see your annualized return."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Instant CAGR Calculation — see your annualized return instantly"
    - "Total Return — see your overall percentage gain"
    - "Visual Growth Chart — see your investment growth over time"
    - "170+ World Currencies — auto-formatted results"
    - "100% Private — all calculations run locally"
    - "Shareable Calculation Links — one click to save and share"
    - "Calculation History — save, review, and export past results to CSV or Excel"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Compound Annual Growth Rate Calculator

howto:
  name: "How to Use the CAGR Calculator"
  description: "Follow these steps to calculate your compound annual growth rate."
  step:
    - name: "Enter your initial value"
      text: "Enter the starting value of your investment."
    - name: "Enter your final value"
      text: "Enter the ending value of your investment."
    - name: "Enter the time period"
      text: "Enter the number of years."
    - name: "View your results"
      text: "See your CAGR, total return, and total gain."

faq:
  - question: "What is CAGR?"
    answer: "CAGR stands for Compound Annual Growth Rate. It's the annualized rate of return that would be required for an investment to grow from its initial value to its final value over a specific time period."
  - question: "What is the CAGR formula?"
    answer: "CAGR = (Final Value / Initial Value)^(1 / Years) − 1. This gives you the average annual growth rate over the time period."
  - question: "What is the difference between CAGR and average return?"
    answer: "Average return is the arithmetic mean of annual returns. CAGR is the geometric mean, which accounts for compounding and gives a more accurate picture of investment growth over time."
  - question: "Can I use this calculator for any investment?"
    answer: "Yes — use it for stocks, mutual funds, crypto, real estate, or any investment where you have start and end values."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server."

---

# Compound Annual Growth Rate Calculator – Calculate Your Investment Return

Use this compound annual growth rate calculator to calculate the annualized return of your investments. Enter your initial value, final value, and time period — the tool shows your CAGR, total return, and total gain. This CAGR growth rate calculator helps you evaluate investment performance over time.

<!-- more -->

## Why Use This CAGR Calculator

Understanding your investment return is essential for evaluating performance. This CAGR calculator helps you:

- **💰 Calculate Annualized Return** — see your average annual growth rate.
- **📊 Understand Total Return** — see your overall percentage gain.
- **📈 Visualize Your Growth** — see your investment growth over time.
- **🔁 Compare Investments** — use CAGR to compare different investments.
- **📜 Track Your History** — save, review, and export past calculations.
- **🔒 100% Private** — all calculations run locally.

---

## CAGR Formula Used by This Tool

**CAGR = (Final Value / Initial Value)^(1 / Years) − 1**

**Total Return = (Final Value − Initial Value) / Initial Value × 100**

**Total Gain = Final Value − Initial Value**

Where:

- **Initial Value** = Starting amount
- **Final Value** = Ending amount
- **Years** = Time period in years
- **Compounding Frequency** = How often returns are compounded (annual, semi‑annual, quarterly, monthly, daily)

---

## How to Use This CAGR Growth Rate Calculator

1.  Select your **account currency** from the picker in the site header.
2.  Enter your **initial value** (starting amount).
3.  Enter your **final value** (ending amount).
4.  Enter the **time period** in years.
5.  Select your **compounding frequency**.
6.  View your results instantly — see your CAGR, total return, and total gain.

---

## Frequently Asked Questions

### What is CAGR?
CAGR stands for Compound Annual Growth Rate. It's the annualized rate of return that would be required for an investment to grow from its initial value to its final value over a specific time period.

### What is the CAGR formula?
CAGR = (Final Value / Initial Value)^(1 / Years) − 1. This gives you the average annual growth rate over the time period.

### What is the difference between CAGR and average return?
Average return is the arithmetic mean of annual returns. CAGR is the geometric mean, which accounts for compounding and gives a more accurate picture of investment growth over time.

### Can I use this calculator for any investment?
Yes — use it for stocks, mutual funds, crypto, real estate, or any investment where you have start and end values.

### Is my data stored anywhere?
No. All calculations run locally in your browser. History and presets are saved in your browser's localStorage — nothing is sent to a server.

---
