---
layout: tool
title: "Estate Tax Calculator | Federal Exemption Tool"
description: "Calculate federal estate taxes, lifetime exemption thresholds, and net wealth transfers for high-net-worth estates. 100% private browser tool."
permalink: /estate-tax-calculator
tool_id: estate-tax-calculator
category: tax
hide_sidebar: true

inputs:
  - id: grossEstateValue
    label: Total Gross Estate Value (Assets + Life Insurance)
    type: number
    default: 16000000
    step: 500000
    min: 10000
    currency: true
    placeholder: "e.g., 16000000"

  - id: estateDebtsLiabilities
    label: Estate Debts, Mortgages & Expenses
    type: number
    default: 1000000
    step: 100000
    min: 0
    currency: true
    placeholder: "e.g., 1000000"

  - id: lifetimeExemptionLimit
    label: Federal Lifetime Estate Exemption
    type: number
    default: 13610000
    step: 100000
    min: 5000000
    currency: true
    placeholder: "e.g., 13610000"

  - id: estateTaxRatePercent
    label: Top Federal Estate Tax Rate (%)
    type: number
    default: 40.0
    step: 1.0
    min: 10
    max: 50
    suffix: '%'
    placeholder: "e.g., 40.0"

outputs:
  - id: netTaxableEstate
    label: Net Estate Value
  - id: taxableEstateAboveExemption
    label: Taxable Estate Amount Above Exemption
  - id: estimatedEstateTaxOwed
    label: Estimated Federal Estate Tax Liability

charts:
  tabs:
    - id: breakdown
      label: Estate Value vs Exemption
    - id: taxOwed
      label: Federal Estate Tax Liability

history_columns:
  - key: grossEstateValue
    label: Gross Estate
    source: input
  - key: estateDebtsLiabilities
    label: Debts
    source: input
  - key: netTaxableEstate
    label: Net Estate
    source: output
  - key: taxableEstateAboveExemption
    label: Taxable Above Cap
    source: output
  - key: estimatedEstateTaxOwed
    label: Estate Tax
    source: output

js_file: assets/js/calculators/estate-tax-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Estate Tax Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate federal estate tax liabilities and lifetime exemption thresholds."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Federal Exemption Modeling — calculate estate tax liabilities above the federal exemption ($13.61M+)"
    - "Net Estate Calculation — subtract mortgages, debts, and administrative costs"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: Estate Tax Calculator

howto:
  name: "How to Calculate Federal Estate Tax"
  description: "Estimate estate tax liability for high-net-worth individuals."
  step:
    - name: "Select currency"
      text: "Choose your currency from the header picker."
    - name: "Input gross estate assets"
      text: "Enter total estate value including real estate, investments, and life insurance payouts."

faq:
  - question: "What is the federal estate tax exemption?"
    answer: "The federal estate tax exemption is the dollar threshold below which an estate pays zero federal estate tax ($13.61 Million per individual in 2024, or $27.22 Million for married couples)."
  - question: "What assets are included in a decedent's gross estate?"
    answer: "Gross estate includes real estate, stocks, bonds, business interests, bank accounts, retirement plans, personal property, and life insurance policy death benefits owned by the decedent."
  - question: "How does the marital deduction affect federal estate taxes?"
    answer: "The unlimited marital deduction allows individuals to transfer unlimited asset amounts to a surviving U.S. citizen spouse completely free of federal estate taxes."
  - question: "What is estate tax portability for married couples?"
    answer: "Portability allows a surviving spouse to elect to transfer any unused portion of their deceased spouse's federal lifetime estate tax exemption (DSUE) to their own exemption."
  - question: "What is the federal estate tax rate on taxable assets?"
    answer: "Assets in net taxable estates exceeding the federal lifetime exemption limit are taxed at a top progressive federal estate tax rate of 40%."
  - question: "How do state estate taxes differ from federal estate taxes?"
    answer: "Several states impose separate state-level estate or inheritance taxes with significantly lower exemption thresholds (ranging from $1 Million to $6 Million)."
  - question: "Is confidential estate and asset data kept private?"
    answer: "Yes, all estate tax calculations run 100% locally inside your web browser. No asset valuations, debt figures, or estate details are stored or transmitted."
---

# Estate Tax Calculator

Calculate potential federal estate taxes, net wealth transfers, and lifetime exemption threshold usage for high-net-worth estates with 100% private browser execution.

<!-- more -->

## Why Use the Estate Tax Calculator?

Federal estate taxes apply to the transfer of property at death for high-net-worth individuals whose total asset holdings exceed statutory federal lifetime exemption limits. Establishing a clear projection of potential estate tax liabilities is essential for wealth preservation, business succession, estate planning, and structuring trusts. Because the top federal estate tax rate reaches 40%, unmanaged tax liabilities can force liquidity crises, compelling heirs to liquidate real estate, family businesses, or investment holdings under unfavorable market conditions.

Gross estate calculations encompass all real property, corporate shares, personal property, cash reserves, and life insurance policy death proceeds over which the decedent retained incidents of ownership. Subtracting mortgages, outstanding liabilities, administrative expenses, and charitable bequests yields the net taxable estate. By testing different asset values, exemption limits, and liability scenarios in this calculator, individuals and families can proactively evaluate trust structures, gifting strategies, and insurance liquidity plans.

## Mathematical Formulas & Mechanics

The federal estate tax liability calculation determines the net estate value, compares it against applicable lifetime exemption allowances, and applies statutory federal tax rates.

### 1. Net Estate Value
Gross estate assets ($A_{gross}$) are reduced by total estate debts, mortgages, funeral fees, and administrative expenses ($D_{estate}$):

$$E_{net} = A_{gross} - D_{estate}$$

### 2. Taxable Estate & Federal Estate Tax
The taxable estate portion ($E_{taxable}$) above the federal lifetime exemption threshold ($X_{lifetime}$) is determined by:

$$E_{taxable} = \max\left(0, E_{net} - X_{lifetime}\right)$$

Estimated federal estate tax ($T_{estate}$) is calculated by multiplying taxable excess by the marginal federal estate tax rate ($r_{estate} = 40\%$):

$$T_{estate} = E_{taxable} \times r_{estate}$$

Where $A_{gross}$ includes all taxable assets, $D_{estate}$ includes liabilities and expenses, $X_{lifetime}$ represents the individual's remaining federal gift and estate exemption, and $r_{estate}$ represents top federal estate tax rates.

## Real-World Comparison & Benchmark Table

| Gross Estate Assets | Debts & Expenses | Net Estate Value | Lifetime Exemption Limit | Taxable Excess Above Cap | Federal Estate Tax (40%) |
|---|---|---|---|---|---|
| **$12,000,000** | $500,000 | $11,500,000 | $13,610,000 | $0 | **$0** |
| **$16,000,000** | $1,000,000 | $15,000,000 | $13,610,000 | $1,390,000 | **$556,000** |
| **$20,000,000** | $1,500,000 | $18,500,000 | $13,610,000 | $4,890,000 | **$1,956,000** |
| **$27,220,000 (Married)** | $1,220,000 | $26,000,000 | $27,220,000 | $0 | **$0** |
| **$35,000,000 (Married)** | $2,000,000 | $33,000,000 | $27,220,000 | $5,780,000 | **$2,312,000** |

## Step-by-Step How-To Guide

1. **Enter Gross Estate Value**: Input total gross estate asset value, including real estate, investments, business holdings, and life insurance.
2. **Input Estate Debts & Liabilities**: Enter mortgages, loan balances, unpaid debts, executor fees, and legal administrative costs.
3. **Set Lifetime Federal Exemption Limit**: Input applicable federal exemption amount ($13.61M individual or $27.22M for combined married portability).
4. **Specify Top Estate Tax Rate**: Set marginal tax percentage (standard federal top rate is 40%).
5. **Review Taxable Excess & Liability**: Analyze net estate value, excess above exemption, and projected federal estate tax owed.

## Frequently Asked Questions

### What is the federal estate tax exemption?
The federal estate tax exemption is the dollar threshold below which an estate pays zero federal estate tax ($13.61 Million per individual in 2024, or $27.22 Million for married couples).

### What assets are included in a decedent's gross estate?
Gross estate includes real estate, stocks, bonds, business interests, bank accounts, retirement plans, personal property, and life insurance policy death benefits owned by the decedent.

### How does the marital deduction affect federal estate taxes?
The unlimited marital deduction allows individuals to transfer unlimited asset amounts to a surviving U.S. citizen spouse completely free of federal estate taxes.

### What is estate tax portability for married couples?
Portability allows a surviving spouse to elect to transfer any unused portion of their deceased spouse's federal lifetime estate tax exemption (DSUE) to their own exemption.

### What is the federal estate tax rate on taxable assets?
Assets in net taxable estates exceeding the federal lifetime exemption limit are taxed at a top progressive federal estate tax rate of 40%.

### How do state estate taxes differ from federal estate taxes?
Several states impose separate state-level estate or inheritance taxes with significantly lower exemption thresholds (ranging from $1 Million to $6 Million).

### Is confidential estate and asset data kept private?
Yes, all estate tax calculations run 100% locally inside your web browser. No asset valuations, debt figures, or estate details are stored or transmitted.
