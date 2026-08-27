---
layout: tool
title: "CAGR (Compound Annual Growth Rate) Calculator | Compound"
description: "Calculate the compound annual growth rate (CAGR) of your investments. Enter initial value, final value, and time period to see your annualized return."
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

---

# CAGR Calculator – Find Your Investment's True Annualized Return

You know your investment grew from $10,000 to $18,000 over five years. But what's that actually mean on a yearly basis? That's where **CAGR** comes in. Our **CAGR Calculator** tells you the annualized return of any investment—so you can evaluate performance, compare opportunities, and make smarter decisions.

<!-- more -->

## Why This Calculator Is Essential for Investors

When you're looking at investment performance, the headline number—total gain—only tells part of the story. **CAGR (Compound Annual Growth Rate)** tells you the *average annual growth* your investment delivered, smoothed out over the entire period.

Our **CAGR calculator** helps you:

- **💰 See Your Annualized Return** — know your average yearly growth rate
- **📊 Understand Total Return** — see your overall percentage gain at a glance
- **📈 Visualize Your Growth** — watch your investment's journey over time
- **🔁 Compare Investments** — CAGR lets you compare stocks, funds, real estate, and crypto apples-to-apples
- **📜 Save Your Calculations** — export to CSV or Excel for your records
- **🔒 100% Private** — everything runs locally, nothing is stored

---

## The Simple Math Behind CAGR

**CAGR =** (Final Value ÷ Initial Value)^(1 ÷ Years) − 1

**Total Return =** (Final Value − Initial Value) ÷ Initial Value × 100

**Total Gain =** Final Value − Initial Value

---

## Real-World Example: See It in Action

**Scenario:** You invested $10,000 in a mutual fund. Five years later, it's worth $18,000.

| Input | Value |
|-------|-------|
| Initial Value | $10,000 |
| Final Value | $18,000 |
| Time Period | 5 years |
| Compounding Frequency | Annual |
| **CAGR** | **12.47%** |
| **Total Return** | **80.00%** |
| **Total Gain** | **$8,000** |

*Your investment grew by 80% over 5 years—that's a 12.47% average annual return. Now you can confidently compare this to other investments.*

---

## Why CAGR Is Better Than Average Return

Let's say an investment had these yearly returns:
- Year 1: +50%
- Year 2: -20%
- Year 3: +30%

The **average return** (arithmetic mean) is: (50% − 20% + 30%) ÷ 3 = 20%

But if you actually invested $100, here's what happened:
- Year 1: $100 → $150
- Year 2: $150 → $120
- Year 3: $120 → $156

Your **CAGR** is: ($156 ÷ $100)^(1/3) − 1 = **15.9%**

*The average return (20%) overstates your real growth. CAGR (15.9%) gives you the true, compounded annual return. That's why investors rely on CAGR.*

---

## How to Use This Calculator

Getting your CAGR is quick and straightforward:

1. **Pick your currency** from the selector in the site header.
2. **Enter your initial value** — what you started with.
3. **Enter your final value** — what you have now.
4. **Enter the time period** in years — how long the investment was held.
5. **Select your compounding frequency** — annual, semi-annual, quarterly, monthly, or daily.
6. **View your results instantly** — CAGR, total return, and total gain.

---

## Who Benefits From This Calculator?

- **Investors** — evaluating performance of stocks, funds, crypto, or real estate
- **Financial planners** — comparing different investment strategies for clients
- **Anyone** — wanting to understand how their money is actually performing
- **Students** — learning about investment metrics
- **Savers** — tracking progress toward long-term goals

---

## Common Questions About CAGR

### What is CAGR in plain English?

It's the average annual growth rate of an investment over a specific period. Think of it as "what steady yearly return would have produced the same final result?" It smooths out ups and downs to give you a clear picture of performance.

### What's the CAGR formula?

**CAGR =** (Final Value ÷ Initial Value)^(1 ÷ Years) − 1

### What's the difference between CAGR and average return?

- **Average return** — the arithmetic mean of yearly returns (can overstate performance)
- **CAGR** — the geometric mean, which accounts for compounding and gives you the actual annualized growth

CAGR is the more accurate metric for investment performance.

### Can I use this calculator for any investment?

**Yes.** Use it for stocks, mutual funds, ETFs, crypto, real estate, or any investment where you have a starting value, ending value, and time period.

### What's a good CAGR?

It depends on your investment type and timeline:
- **Stock market (long-term):** 7-10% historically
- **Real estate:** 8-12% depending on appreciation and leverage
- **Savings accounts/CDs:** 3-5% (low risk, low return)
- **Higher risk investments:** May target 15%+

The key is comparing your CAGR to relevant benchmarks (like the S&P 500 for stocks).

### Does compounding frequency affect CAGR?

Not the final CAGR number itself—but it can affect the growth path. Our calculator lets you see the impact of different compounding frequencies on your investment's journey.

---

> **📈 Quick Tip:** Use CAGR to compare different investments side-by-side. A fund with higher total return over a shorter period might have a higher CAGR than one with a longer, slower growth path. CAGR is the great equalizer for performance comparison.