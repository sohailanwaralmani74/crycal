---
layout: tool
title: Liquidation Preference Calculator – Exit Waterfall Payouts
description: Calculate preferred investor waterfall payouts and common founder returns under 1x Non-Participating versus Participating Preferred stock terms.
permalink: /liquidation-preference-calculator
tool_id: liquidation-preference-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: investedCapital
    label: Preferred Investor Capital Invested
    type: number
    default: 5000000
    step: 250000
    min: 0
    currency: true
    placeholder: "e.g., 5000000"

  - id: liquidationMultiple
    label: Liquidation Preference Multiple (x)
    type: number
    default: 1.0
    step: 0.25
    min: 1
    max: 5
    suffix: "x"
    placeholder: "e.g., 1.0"

  - id: investorOwnership
    label: Investor Equity Ownership (%)
    type: number
    default: 25.0
    step: 1
    min: 1
    max: 100
    suffix: "%"
    placeholder: "e.g., 25.0"

  - id: participationCap
    label: Participation Cap Multiple (0 for Uncapped)
    type: number
    default: 0.0
    step: 0.5
    min: 0
    max: 10
    suffix: "x"
    placeholder: "e.g., 2.0 (or 0 for uncapped)"

  - id: exitValuation
    label: Exit / Sale Proceeds Valuation
    type: number
    default: 12000000
    step: 500000
    min: 0
    currency: true
    placeholder: "e.g., 12000000"

outputs:
  - id: nonParticipatingInvestorPayout
    label: Investor Payout (Non-Participating)
  - id: nonParticipatingFounderPayout
    label: Founder / Common Payout (Non-Participating)
  - id: participatingInvestorPayout
    label: Investor Payout (Participating)
  - id: participatingFounderPayout
    label: Founder / Common Payout (Participating)
  - id: participatingDifference
    label: Extra Investor Gain under Participating Terms

charts:
  tabs:
    - id: payoutComparison
      label: Non-Participating vs Participating
    - id: waterfallAtExit
      label: Exit Proceeds Waterfall Breakdown

history_columns:
  - key: investedCapital
    label: Invested ($)
    source: input
  - key: exitValuation
    label: Exit Valuation ($)
    source: input
  - key: nonParticipatingInvestorPayout
    label: Non-Part Investor ($)
    source: output
  - key: participatingInvestorPayout
    label: Part Investor ($)
    source: output
  - key: nonParticipatingFounderPayout
    label: Non-Part Founder ($)
    source: output

js_file: assets/js/calculators/liquidation-preference-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Liquidation Preference Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate investor liquidation preference payouts and founder proceeds under Non-Participating vs Participating Preferred terms."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "1x Non-Participating vs Participating Preferred Modeling"
    - "Participation Cap Calculations"
    - "Exit Proceeds Waterfall Breakdown"
    - "Founder vs Investor Payout Comparison Chart"
    - "100% Private Client Browser Computation"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Liquidation Preference Calculator

howto:
  name: "How to Calculate Liquidation Preference Exit Waterfalls"
  description: "Follow these steps to model exit payouts for investors and common founders."
  step:
    - name: "Enter Investor Capital Invested"
      text: "Input total dollar capital invested by preferred shareholders."
    - name: "Set Liquidation Multiple & Ownership %"
      text: "Input preference multiple (e.g. 1x) and investor equity ownership percentage."
    - name: "Specify Participation Cap"
      text: "Enter participation cap multiple (or enter 0 for uncapped participating preferred)."
    - name: "Input Exit Valuation"
      text: "Enter total exit or M&A sale proceeds."

faq:
  - question: "What is a liquidation preference in venture capital?"
    answer: "A liquidation preference dictates the order and amount of cash payout investors receive before common stock founders during a company sale, merger, or liquidation."
  - question: "What is the difference between Non-Participating and Participating Preferred stock?"
    answer: "Non-Participating Preferred allows investors to choose either their liquidation preference OR their pro-rata common equity share. Participating Preferred allows investors to take their preference FIRST and THEN participate pro-rata in remaining proceeds ('double-dipping')."
  - question: "What is a standard liquidation preference multiple?"
    answer: "A 1.0x Non-Participating Preferred liquidation preference is standard in founder-friendly venture capital term sheets."
  - question: "What is a participation cap?"
    answer: "A participation cap limits the total payout a participating preferred investor can receive (e.g., 2.0x or 3.0x total invested capital), protecting common founders in high-value exits."
  - question: "Why are participating preferred terms considered aggressive?"
    answer: "Participating preferred terms reduce founder exit payouts significantly in modest exits by allowing investors to double-dip on preference and common distributions."
  - question: "Is my exit scenario calculation stored anywhere?"
    answer: "No. All calculation models run strictly inside your web browser."

---

# Liquidation Preference Calculator – Exit Waterfall Payouts

Calculate investor exit payouts and founder common stock proceeds with our free **Liquidation Preference Calculator**. Compare **1x Non-Participating Preferred** vs **Participating Preferred** terms across custom exit sale valuations.

<!-- more -->

## How Liquidation Preferences Work in M&A Exits

In venture financing, preferred stock holds priority over common stock upon a company exit. Liquidation preference clauses dictate how exit proceeds are distributed through the waterfall:

1. **Non-Participating Preferred**: Investor gets the **MAXIMUM** of:
   - Liquidation Preference ($M \times \text{Invested Capital}$)
   - Common Equity Share ($\text{Exit Valuation} \times \text{Investor \%}$)
2. **Participating Preferred ("Double-Dipping")**: Investor gets:
   - Preference payout FIRST ($M \times \text{Invested Capital}$)
   - PLUS pro-rata equity percentage of remaining proceeds ($(\text{Exit} - \text{Pref}) \times \text{Investor \%}$)

---

## Waterfall Mathematical Model

### Non-Participating Preferred Formula
$$\text{Investor Payout}_{NonPart} = \min\left(\text{Exit}, \max\left(M \times I, \text{Exit} \times \frac{\text{Inv \%}}{100}\right)\right)$$

$$\text{Founder Payout}_{NonPart} = \text{Exit} - \text{Investor Payout}_{NonPart}$$

### Participating Preferred Formula
$$\text{Pref Payout} = \min(\text{Exit}, M \times I)$$

$$\text{Remaining Proceeds} = \text{Exit} - \text{Pref Payout}$$

$$\text{Total Part Payout} = \text{Pref Payout} + \left( \text{Remaining Proceeds} \times \frac{\text{Inv \%}}{100} \right)$$

$$\text{Investor Payout}_{Part} = \begin{cases} \min(\text{Cap} \times I, \text{Total Part Payout}) & \text{if Cap } > 0 \\ \text{Total Part Payout} & \text{if Cap } = 0 \end{cases}$$

---

## Exit Waterfall Comparison Table ($5M Invested at 25% Ownership, $12M Exit)

| Structure | Investor Payout | Founder Payout | Investor Return Multiple |
| :--- | :--- | :--- | :--- |
| **1x Non-Participating Preferred** | **$5,000,000** (Pref > 25% Common) | **$7,000,000** | **1.0x** |
| **1x Participating Preferred** | **$6,750,000** ($5M + 25% of $7M) | **$5,250,000** | **1.35x** |
| **Difference (Founder Loss)** | **+$1,750,000 to Investor** | **-$1,750,000 to Founder** | — |

---

## Step-by-Step Guide to Calculating Exit Waterfalls

1. **Enter Invested Capital**: Input total dollar capital raised from preferred investors.
2. **Set Liquidation Multiple**: Input preference multiple (e.g. 1.0x).
3. **Set Investor Equity %**: Input total investor equity stake percentage.
4. **Set Participation Cap**: Enter participation cap multiplier (or enter 0 if uncapped).
5. **Enter Total Exit Valuation**: Input sale or M&A exit proceeds.

---

## Frequently Asked Questions

### What is a liquidation preference in venture capital?
A liquidation preference dictates the order and amount of cash payout investors receive before common stock founders during a company sale, merger, or liquidation.

### What is the difference between Non-Participating and Participating Preferred stock?
Non-Participating Preferred allows investors to choose either their liquidation preference OR their pro-rata common equity share. Participating Preferred allows investors to take their preference FIRST and THEN participate pro-rata in remaining proceeds ('double-dipping').

### What is a standard liquidation preference multiple?
A 1.0x Non-Participating Preferred liquidation preference is standard in founder-friendly venture capital term sheets.

### What is a participation cap?
A participation cap limits the total payout a participating preferred investor can receive (e.g., 2.0x or 3.0x total invested capital), protecting common founders in high-value exits.

### Why are participating preferred terms considered aggressive?
Participating preferred terms reduce founder exit payouts significantly in modest exits by allowing investors to double-dip on preference and common distributions.

### Is my exit scenario calculation stored anywhere?
No. All calculation models run strictly inside your web browser.
