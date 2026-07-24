---
layout: tool
title: "Safe Conversion | Interactive Online Tool"
description: "Calculate SAFE note conversion share price, equity ownership, and share issuance at a valuation cap or discount rate during a priced funding round."
permalink: /safe-conversion-calculator
tool_id: safe-conversion-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: safeAmount
    label: Total SAFE Investment
    type: number
    default: 500000
    step: 25000
    min: 0
    currency: true
    placeholder: "e.g., 500000"

  - id: valuationCap
    label: SAFE Valuation Cap
    type: number
    default: 5000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 5000000"

  - id: discountRate
    label: SAFE Discount Rate (%)
    type: number
    default: 20.0
    step: 1
    min: 0
    max: 50
    suffix: "%"
    placeholder: "e.g., 20.0"

  - id: seriesAPreMoney
    label: Series A Pre-Money Valuation
    type: number
    default: 12000000
    step: 500000
    min: 0
    currency: true
    placeholder: "e.g., 12000000"

  - id: seriesAPricePerShare
    label: Series A Uncapped Share Price
    type: number
    default: 10.00
    step: 0.25
    min: 0.01
    currency: true
    placeholder: "e.g., 10.00"

outputs:
  - id: effectiveSharePrice
    label: Effective SAFE Share Price
  - id: conversionTrigger
    label: Winning Mechanism
  - id: safeShares
    label: SAFE Shares Issued
  - id: safeEquityPercent
    label: SAFE Equity Ownership
  - id: effectiveDiscount
    label: Effective Discount Received

charts:
  tabs:
    - id: priceComparison
      label: Share Price Comparison
    - id: equitySplit
      label: Implied Cap Table Split

history_columns:
  - key: safeAmount
    label: SAFE Amount ($)
    source: input
  - key: valuationCap
    label: Cap ($)
    source: input
  - key: discountRate
    label: Discount (%)
    source: input
  - key: effectiveSharePrice
    label: Effective Price ($)
    source: output
  - key: safeEquityPercent
    label: SAFE Equity (%)
    source: output

js_file: assets/js/calculators/safe-conversion-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "SAFE Conversion Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate SAFE note conversion share price, equity ownership percentage, and share issuance at valuation cap or discount rate."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Valuation Cap vs Discount Rate Conversion Modeling"
    - "Effective Share Price & Share Issuance Calculation"
    - "Implied Equity Ownership Percentage Analysis"
    - "Interactive Share Price Comparison Chart"
    - "100% Private Browser Calculation"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: SAFE Conversion Calculator

howto:
  name: "How to Calculate SAFE Note Equity Conversion"
  description: "Follow these steps to calculate SAFE note conversion price and share ownership."
  step:
    - name: "Enter SAFE Principal Amount"
      text: "Input total dollar amount invested under the SAFE."
    - name: "Set Valuation Cap and Discount Rate"
      text: "Enter agreed valuation cap and discount percentage."
    - name: "Provide Series A Round Terms"
      text: "Input pre-money valuation and uncapped share price for the priced round."
    - name: "Review Effective Conversion Price"
      text: "Analyze whether the valuation cap or discount rate delivered a lower share price."

faq:
  - question: "What is a SAFE note in startup fundraising?"
    answer: "A SAFE (Simple Agreement for Future Equity) is a financial contract created by Y Combinator that grants investors rights to future equity upon a qualifying priced financing round."
  - question: "How does a SAFE valuation cap work?"
    answer: "A valuation cap sets a maximum effective valuation at which the SAFE converts into equity. If the priced round valuation exceeds the cap, SAFE holders convert at the lower cap price."
  - question: "How does a SAFE discount rate work?"
    answer: "A discount rate allows SAFE holders to purchase shares at a percentage discount (e.g., 20%) off the priced round share price."
  - question: "Does the SAFE convert using the Valuation Cap or Discount Rate?"
    answer: "SAFE holders always receive whichever mechanism produces the lowest share price (i.e. the maximum number of shares)."
  - question: "What is the difference between Pre-Money SAFE and Post-Money SAFE?"
    answer: "A Post-Money SAFE fixes the investor's ownership percentage regardless of other SAFEs issued, whereas a Pre-Money SAFE ownership dilutes alongside all pre-money instruments."
  - question: "Is my SAFE note data private?"
    answer: "Yes. All computations execute locally in your client web browser."

---

# Safe Conversion Calculator

Calculate SAFE note equity conversion price and share ownership with our free **SAFE Conversion Calculator**. Compare Valuation Cap vs Discount Rate mechanisms to determine effective share prices and equity percentages during priced funding rounds.

<!-- more -->

## How SAFE Note Conversion Works

A **Simple Agreement for Future Equity (SAFE)** converts into equity during a company's next priced financing round (e.g., Series A). When both a **Valuation Cap** and a **Discount Rate** are present in the SAFE agreement, the investor receives the pricing mechanism that produces the lower share price (maximum shares).

Key pricing components:
- **Cap Share Price**: $P_{cap} = P_{round} \times \left( \frac{\text{Valuation Cap}}{\text{Series A Pre-Money}} \right)$
- **Discount Share Price**: $P_{discount} = P_{round} \times (1 - \text{Discount Rate})$
- **Effective Conversion Share Price**: $P_{eff} = \min(P_{cap}, P_{discount}, P_{round})$

---

## SAFE Conversion Mathematical Formulas

$$P_{cap} = P_{\text{Series A}} \times \left( \frac{\text{Cap}}{\text{Pre-Money}_{\text{Series A}}} \right)$$

$$P_{discount} = P_{\text{Series A}} \times (1 - D)$$

$$P_{eff} = \min(P_{cap}, P_{discount})$$

$$\text{SAFE Shares Issued} = \frac{\text{SAFE Principal Amount}}{P_{eff}}$$

$$\text{Effective Discount (\%)} = \left( 1 - \frac{P_{eff}}{P_{\text{Series A}}} \right) \times 100$$

---

## SAFE Conversion Comparison Example

| Metric | Series A Uncapped | Discount Rate (20%) | Valuation Cap ($5M) | Winning Terms |
| :--- | :--- | :--- | :--- | :--- |
| **Share Price** | $10.00 | $8.00 | **$4.17** | **Valuation Cap** |
| **Shares Issued ($500k)** | 50,000 | 62,500 | **120,000** | **+140% Shares** |
| **Effective Discount** | 0.0% | 20.0% | **58.3%** | **58.3% Discount** |

---

## Step-by-Step Guide to Calculating SAFE Conversion

1. **Enter SAFE Amount**: Input total cash invested into the SAFE.
2. **Enter Valuation Cap & Discount**: Input agreed valuation cap and discount percentage (e.g., $5M cap, 20% discount).
3. **Input Series A Valuation**: Enter pre-money valuation of the priced round.
4. **Input Series A Share Price**: Enter standard uncapped share price for Series A investors.
5. **View Winning Conversion Trigger**: See whether Valuation Cap or Discount Rate gave the investor a better price.

---

## Frequently Asked Questions

### What is a SAFE note in startup fundraising?
A SAFE (Simple Agreement for Future Equity) is a financial contract created by Y Combinator that grants investors rights to future equity upon a qualifying priced financing round.

### How does a SAFE valuation cap work?
A valuation cap sets a maximum effective valuation at which the SAFE converts into equity. If the priced round valuation exceeds the cap, SAFE holders convert at the lower cap price.

### How does a SAFE discount rate work?
A discount rate allows SAFE holders to purchase shares at a percentage discount (e.g., 20%) off the priced round share price.

### Does the SAFE convert using the Valuation Cap or Discount Rate?
SAFE holders always receive whichever mechanism produces the lowest share price (i.e. the maximum number of shares).

### What is the difference between Pre-Money SAFE and Post-Money SAFE?
A Post-Money SAFE fixes the investor's ownership percentage regardless of other SAFEs issued, whereas a Pre-Money SAFE ownership dilutes alongside all pre-money instruments.

### Is my SAFE note data private?
Yes. All computations execute locally in your web browser.
