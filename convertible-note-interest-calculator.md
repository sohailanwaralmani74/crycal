---
layout: tool
title: "Convertible Note Interest | Interactive Online Tool"
description: "Calculate accrued simple interest or compound interest on convertible debt prior to conversion into equity during a priced funding round."
permalink: /convertible-note-interest-calculator
tool_id: convertible-note-interest-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: principalAmount
    label: Convertible Note Principal
    type: number
    default: 250000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 250000"

  - id: interestRate
    label: Annual Interest Rate (%)
    type: number
    default: 6.0
    step: 0.5
    min: 0
    max: 25
    suffix: "%"
    placeholder: "e.g., 6.0"

  - id: durationMonths
    label: Duration / Time to Round (Months)
    type: number
    default: 18
    step: 1
    min: 1
    max: 120
    suffix: "mo"
    placeholder: "e.g., 18"

  - id: compoundingFrequency
    label: Interest Calculation Method
    type: select
    options:
      - Simple Interest
      - Annual Compounding
    default: Simple Interest

  - id: qualifiedRoundPrice
    label: Qualified Round Share Price
    type: number
    default: 5.00
    step: 0.25
    min: 0.01
    currency: true
    placeholder: "e.g., 5.00"

outputs:
  - id: accruedInterest
    label: Total Accrued Interest
  - id: totalConversionValue
    label: Total Debt & Interest Converting
  - id: totalShares
    label: Shares Issued on Conversion
  - id: monthlyInterest
    label: Average Monthly Accrual
  - id: effectiveInterestPercent
    label: Cumulative Yield on Principal

charts:
  tabs:
    - id: principalVsInterest
      label: Principal vs Interest
    - id: accrualTrajectory
      label: Accrual Trajectory

history_columns:
  - key: principalAmount
    label: Principal ($)
    source: input
  - key: interestRate
    label: Rate (%)
    source: input
  - key: durationMonths
    label: Duration (Mo)
    source: input
  - key: accruedInterest
    label: Accrued Interest ($)
    source: output
  - key: totalConversionValue
    label: Total Converting ($)
    source: output

js_file: assets/js/calculators/convertible-note-interest-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Convertible Note Interest Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate accrued simple or compound interest on convertible notes and convertible debt prior to qualified financing round conversion."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Simple and Compounding Convertible Debt Interest Modeling"
    - "Total Converting Value & Share Issuance Calculation"
    - "Monthly Interest Accrual Analysis"
    - "Interactive Accrual Trajectory Chart"
    - "100% Private Browser Calculation"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Convertible Note Interest Calculator

howto:
  name: "How to Calculate Convertible Note Interest"
  description: "Follow these steps to compute accrued interest and share conversion for convertible debt."
  step:
    - name: "Enter Note Principal Amount"
      text: "Input total cash principal invested under the convertible note."
    - name: "Set Interest Rate and Duration"
      text: "Input annual interest percentage and duration in months until conversion."
    - name: "Select Interest Calculation Method"
      text: "Choose Simple Interest or Annual Compounding."
    - name: "Enter Series A Share Price"
      text: "Input target share price for conversion to view total shares issued."

faq:
  - question: "What is a convertible note in startup fundraising?"
    answer: "A convertible note is a short-term debt instrument that converts into equity during a future priced financing round rather than being repaid in cash."
  - question: "How does interest accrue on a convertible note?"
    answer: "Interest accrues continuously over the life of the note. Most convertible notes specify Simple Interest calculated annually (Principal × Rate × Years)."
  - question: "Does interest on a convertible note get paid in cash?"
    answer: "Rarely. In startup convertible notes, accrued interest is added to the principal balance and converts into preferred stock alongside the principal."
  - question: "What is the typical interest rate on convertible notes?"
    answer: "Standard convertible note interest rates range between 5% and 8% per annum in venture capital markets."
  - question: "What happens to accrued interest if the note reaches maturity without a funding round?"
    answer: "Upon maturity, noteholders can either extend the maturity date, demand cash repayment (if company cash permits), or convert at an agreed maturity cap price."
  - question: "Is my convertible note data private?"
    answer: "Yes. All computations execute locally in your client web browser."

---

# Convertible Note Interest Calculator

Calculate accrued interest and total equity conversion value for convertible debt with our free **Convertible Note Interest Calculator**. Model simple vs compounding interest over time and project shares issued upon round conversion.

<!-- more -->

## How Convertible Note Interest Operates

A **convertible note** is structured as bridge debt that accrues annual interest until a qualified priced equity financing round occurs. Upon conversion, the **total converting value** equals the original principal plus all accrued interest.

Key metrics:
- **Simple Interest Formula**: $I = P \times r \times \left(\frac{m}{12}\right)$
- **Annual Compounding Formula**: $A = P \times (1 + r)^{\frac{m}{12}}$
- **Total Converting Value**: $V_{convert} = P + I$
- **Shares Issued**: $S_{issued} = \frac{V_{convert}}{\text{Effective Share Price}}$

---

## Convertible Debt Mathematical Formulas

### Simple Interest Model
$$I_{simple} = P \times \left( \frac{\text{Rate}}{100} \right) \times \left( \frac{\text{Months}}{12} \right)$$

### Annual Compounding Model
$$V_{compound} = P \times \left( 1 + \frac{\text{Rate}}{100} \right)^{\frac{\text{Months}}{12}}$$

$$I_{compound} = V_{compound} - P$$

$$\text{Total Shares Issued } (S) = \frac{P + I}{P_{share}}$$

---

## Convertible Interest Accrual Example ($250k Note, 6% Rate, $5 Share Price)

| Duration | Simple Interest Accrued | Total Converting Value | Shares Issued ($5.00/sh) |
| :--- | :--- | :--- | :--- |
| **6 Months** | $7,500 | $257,500 | 51,500 shares |
| **12 Months** | $15,000 | $265,000 | 53,000 shares |
| **18 Months** | **$22,500** | **$272,500** | **54,500 shares** |
| **24 Months** | $30,000 | $280,000 | 56,000 shares |

---

## Step-by-Step Guide to Calculating Convertible Note Interest

1. **Enter Note Principal**: Input total cash capital raised via the note.
2. **Enter Annual Interest Rate**: Input annual interest percentage stated in the note agreement.
3. **Set Duration (Months)**: Input months elapsed between note issuance and priced round close.
4. **Choose Calculation Method**: Select Simple Interest or Annual Compounding.
5. **Review Total Converting Value**: View total principal plus accrued interest converting into shares.

---

## Frequently Asked Questions

### What is a convertible note in startup fundraising?
A convertible note is a short-term debt instrument that converts into equity during a future priced financing round rather than being repaid in cash.

### How does interest accrue on a convertible note?
Interest accrues continuously over the life of the note. Most convertible notes specify Simple Interest calculated annually (Principal × Rate × Years).

### Does interest on a convertible note get paid in cash?
Rarely. In startup convertible notes, accrued interest is added to the principal balance and converts into preferred stock alongside the principal.

### What is the typical interest rate on convertible notes?
Standard convertible note interest rates range between 5% and 8% per annum in venture capital markets.

### What happens to accrued interest if the note reaches maturity without a funding round?
Upon maturity, noteholders can either extend the maturity date, demand cash repayment (if company cash permits), or convert at an agreed maturity cap price.

### Is my convertible note data private?
Yes. All computations execute locally in your client web browser.
