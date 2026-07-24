---
layout: tool
title: "Cash Out Refinance | Equity Payout Calculator"
description: "Calculate maximum home equity cash-out proceeds, new loan balances, and updated monthly mortgage payments. 100% private browser tool."
permalink: /cash-out-refinance-calculator
tool_id: cash-out-refinance-calculator
category: mortgage
hide_sidebar: true

inputs:
  - id: homeValue
    label: Current Home Value
    type: number
    default: 450000
    step: 5000
    min: 50000
    currency: true
    placeholder: "e.g., 450000"

  - id: currentBalance
    label: Existing Mortgage Balance
    type: number
    default: 250000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 250000"

  - id: maxLtvPercent
    label: Maximum Allowed LTV (%) (Standard 80%)
    type: number
    default: 80
    step: 5
    min: 50
    max: 95
    suffix: '%'
    placeholder: "e.g., 80"

  - id: newInterestRate
    label: New Interest Rate (%)
    type: number
    default: 6.50
    step: 0.125
    min: 0.1
    max: 20
    suffix: '%'
    placeholder: "e.g., 6.50"

  - id: newLoanTermYears
    label: New Loan Term (Years)
    type: number
    default: 30
    step: 5
    min: 10
    max: 30
    placeholder: "e.g., 30"

outputs:
  - id: maxLoanAmount
    label: Maximum Refinance Loan Amount
  - id: maxCashOutPayout
    label: Maximum Available Cash-Out
  - id: newMonthlyPayment
    label: New Monthly Mortgage Payment (P&I)

charts:
  tabs:
    - id: breakdown
      label: Cash-Out Summary
    - id: equity
      label: Retained Equity vs Cash-Out

history_columns:
  - key: homeValue
    label: Home Value
    source: input
  - key: currentBalance
    label: Existing Balance
    source: input
  - key: maxLtvPercent
    label: Max LTV %
    source: input
  - key: maxCashOutPayout
    label: Cash Payout
    source: output
  - key: newMonthlyPayment
    label: New Pmt
    source: output

js_file: assets/js/calculators/cash-out-refinance-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Cash-Out Refinance Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate maximum cash-out proceeds and new monthly mortgage payments."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "LTV Borrowing Limit Calculation — calculate max cash payout up to 80% or 85% LTV"
    - "New Monthly Payment Estimation — project updated P&I mortgage payments"
    - "Equity Retention Modeling — track remaining unborrowed equity in your home"
    - "170+ World Currencies — auto-format values globally"

breadcrumb:
  - name: Home
    url: /
  - name: Mortgage
    url: /mortgage
  - name: Cash-Out Refinance Calculator

howto:
  name: "How to Calculate Cash-Out Refinance Limits"
  description: "Determine your maximum allowable cash-out amount based on home equity."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input property value & debt"
      text: "Enter current appraised home value and existing mortgage balance."
    - name: "Set LTV & new terms"
      text: "Specify maximum LTV limit (e.g. 80%), new interest rate, and term."

faq:
  - question: "What is a cash-out refinance?"
    answer: "A cash-out refinance replaces your existing mortgage with a new, larger home loan, paying off your old loan balance and providing the remaining difference to you in cash at closing."
  - question: "What is the maximum Loan-to-Value (LTV) ratio allowed for a cash-out refinance?"
    answer: "Conventional mortgage guidelines typically limit cash-out refinancing to a maximum of 80% LTV, meaning you must retain at least 20% equity in your home post-refinance."
  - question: "How are cash-out refinance proceeds taxed?"
    answer: "Cash-out refinance proceeds are non-taxable because the funds represent borrowed debt principal rather than earned taxable income."
  - question: "What is the difference between a cash-out refinance and a HELOC?"
    answer: "A cash-out refinance replaces your primary first mortgage with a single new loan, whereas a HELOC (Home Equity Line of Credit) adds a second revolving mortgage alongside your existing first mortgage."
  - question: "What closing costs are associated with a cash-out refinance?"
    answer: "Cash-out refinancing incurs standard mortgage closing costs (typically 2% to 5% of the new loan balance), including appraisal, origination, title insurance, and escrow fees."
  - question: "Can cash-out refinance interest be deducted on federal tax returns?"
    answer: "Mortgage interest on cash-out funds is tax-deductible only if the proceeds are used specifically to buy, build, or substantially improve the primary home securing the loan."
  - question: "Is home valuation and mortgage data kept private in this tool?"
    answer: "Yes, all cash-out refinance calculations execute 100% locally inside your web browser. No property values, loan balances, or cash-out amounts leave your device."
---

# Cash-Out Refinance Calculator

Calculate maximum home equity cash-out proceeds, new total loan balances, and updated monthly mortgage payments with 100% private browser execution.

<!-- more -->

## Why Use the Cash-Out Refinance Calculator?

As home values appreciate, home equity accumulates. A cash-out refinance replaces your existing primary mortgage with a new, larger mortgage. The new loan pays off the remaining balance on the original mortgage, and cash proceeds are disbursed to the homeowner at closing. Homeowners use cash-out refinance capital for debt consolidation, home renovations, or investment opportunities.

Mortgage underwriting standards cap maximum borrowing limits relative to your home's appraised fair market value. For conventional mortgages, lenders enforce a maximum 80% Loan-to-Value (LTV) limit, requiring borrowers to maintain at least 20% equity after refinancing. Evaluating how much cash you can extract, how your new balance impacts monthly payments, and total closing costs is essential before refinancing. This calculator projects your maximum cash payout, updated monthly mortgage installments, and retained home equity securely and privately.

## Mathematical Formulas & Mechanics

The calculation determines maximum borrowing capacity under LTV guidelines, net cash payout, and new monthly mortgage installments.

### 1. Maximum Loan Amount & Cash-Out Payout
Given appraised home value ($V_{home}$), maximum allowed LTV percentage ($LTV_{\%}$), and existing balance ($B_{exist}$):

$$\text{Maximum Allowed Loan } L_{max} = V_{home} \times \left(\frac{LTV_{\%}}{100}\right)$$

$$\text{Maximum Cash-Out Payout } C_{payout} = \max\left(0, L_{max} - B_{exist}\right)$$

$$\text{Retained Equity } E_{retained} = V_{home} - L_{max}$$

### 2. New Monthly Mortgage Payment
The updated monthly principal and interest payment ($M_{new}$) on loan ($L_{max}$) at monthly rate $r = \frac{r_{new}}{1200}$ for $N_{months} = 12 \times Y_{term}$:

$$M_{new} = L_{max} \times \left[ \frac{r(1 + r)^{N_{months}}}{(1 + r)^{N_{months}} - 1} \right]$$

Where $V_{home}$ is home appraisal value, $B_{exist}$ is current mortgage balance, $C_{payout}$ is cash received, and $M_{new}$ is updated monthly installment.

## Real-World Comparison & Benchmark Table

| Appraised Home Value | Existing Mortgage Balance | Max LTV Limit % | Max Refinance Loan Amount | Max Cash-Out Payout | New Rate & Term | Updated Monthly Payment | Retained Home Equity |
|---|---|---|---|---|---|---|---|
| **$350,000** | $180,000 | 80% | $280,000 | **$100,000** | 6.50% (30 Yr) | **$1,770.00** | $70,000 |
| **$450,000** | $250,000 | 80% | $360,000 | **$110,000** | 6.50% (30 Yr) | **$2,275.45** | $90,000 |
| **$450,000** | $250,000 | 85% (VA Loan) | $382,500 | **$132,500** | 6.50% (30 Yr) | **$2,417.67** | $67,500 |
| **$650,000** | $320,000 | 80% | $520,000 | **$200,000** | 6.75% (30 Yr) | **$3,372.60** | $130,000 |
| **$900,000** | $450,000 | 80% | $720,000 | **$270,000** | 6.25% (15 Yr) | **$6,177.30** | $180,000 |

## Step-by-Step How-To Guide

1. **Enter Appraised Home Value**: Input current estimated fair market value of your residential property.
2. **Input Existing Mortgage Balance**: Enter total principal balance currently owed on your primary mortgage.
3. **Select Maximum Allowed LTV %**: Choose maximum loan-to-value limit (typically 80% for conventional loans or 85% for VA loans).
4. **Specify New Mortgage Rate & Term**: Input expected interest rate percentage and new loan term in years (15 or 30 years).
5. **Review Cash Payout & New Payments**: Analyze maximum cash payout available, updated monthly payment, and retained home equity.

## Frequently Asked Questions

### What is a cash-out refinance?
A cash-out refinance replaces your existing mortgage with a new, larger home loan, paying off your old loan balance and providing the remaining difference to you in cash at closing.

### What is the maximum Loan-to-Value (LTV) ratio allowed for a cash-out refinance?
Conventional mortgage guidelines typically limit cash-out refinancing to a maximum of 80% LTV, meaning you must retain at least 20% equity in your home post-refinance.

### How are cash-out refinance proceeds taxed?
Cash-out refinance proceeds are non-taxable because the funds represent borrowed debt principal rather than earned taxable income.

### What is the difference between a cash-out refinance and a HELOC?
A cash-out refinance replaces your primary first mortgage with a single new loan, whereas a HELOC (Home Equity Line of Credit) adds a second revolving mortgage alongside your existing first mortgage.

### What closing costs are associated with a cash-out refinance?
Cash-out refinancing incurs standard mortgage closing costs (typically 2% to 5% of the new loan balance), including appraisal, origination, title insurance, and escrow fees.

### Can cash-out refinance interest be deducted on federal tax returns?
Mortgage interest on cash-out funds is tax-deductible only if the proceeds are used specifically to buy, build, or substantially improve the primary home securing the loan.

### Is home valuation and mortgage data kept private in this tool?
Yes, all cash-out refinance calculations execute 100% locally inside your web browser. No property values, loan balances, or cash-out amounts leave your device.
