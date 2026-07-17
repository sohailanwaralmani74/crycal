---
layout: tool
title: IHT Calculator – UK Inheritance Tax Estimator
description: Estimate UK Inheritance Tax (IHT) on your estate with nil-rate bands, residence relief, gifts, and charity reduction. Plan your estate tax efficiently.
permalink: /iht-calculator
tool_id: iht-calculator
category: tax
hide_sidebar: true

inputs:
  - id: totalEstate
    label: Total Estate Value
    type: number
    default: 500000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 500000"

  - id: mainResidence
    label: Main Residence Value
    type: number
    default: 300000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 300000"

  - id: residenceToDescendants
    label: Residence Left to Direct Descendants?
    type: select
    default: yes
    options:
      - yes
      - no

  - id: spouseTransfer
    label: Transferable Spouse NRB/RNRB Available?
    type: select
    default: no
    options:
      - yes
      - no

  - id: giftsLast7Years
    label: Gifts Made in Last 7 Years
    type: number
    default: 0
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 50000"

  - id: charityPercentage
    label: Percentage Left to Charity (%)
    type: number
    default: 0
    step: 1
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 10"

  - id: trustsAndOthers
    label: Assets in Trust / Other Deductions
    type: number
    default: 0
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 20000"

outputs:
  - id: totalTaxDue
    label: Total Inheritance Tax Due
  - id: effectiveRate
    label: Effective Tax Rate
  - id: taxableEstate
    label: Taxable Estate After Allowances
  - id: nilRateBand
    label: Nil-Rate Band Used
  - id: residenceBand
    label: Residence Nil-Rate Band Used
  - id: charityTaxReduction
    label: Charity Tax Reduction
  - id: giftsTax
    label: Tax on Gifts (7-Year Rule)
  - id: taxBreakdown
    label: Tax Breakdown

charts:
  tabs:
    - id: breakdown
      label: Tax Breakdown
    - id: comparison
      label: Estate vs Tax

history_columns:
  - key: totalEstate
    label: Total Estate
    source: input
  - key: totalTaxDue
    label: Tax Due
    source: output
  - key: effectiveRate
    label: Effective Rate
    source: output

js_file: assets/js/calculators/iht-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "IHT Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Estimate UK Inheritance Tax (IHT) on your estate with nil-rate bands, residence relief, gifts, and charity reduction."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Nil-Rate Band Calculation"
    - "Residence Nil-Rate Band"
    - "7-Year Gift Rule"
    - "Charity Tax Reduction"
    - "Spouse Transfer Allowance"
    - "Visual Tax Breakdown"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: IHT Calculator

howto:
  name: "How to Use the IHT Calculator"
  description: "Follow these steps to estimate your UK Inheritance Tax liability."
  step:
    - name: "Enter your total estate value"
      text: "Enter the total value of your estate including property, savings, and investments."
    - name: "Enter your main residence value"
      text: "Enter the value of your main home (if applicable)."
    - name: "Select residence beneficiary"
      text: "Indicate if your main residence is left to direct descendants."
    - name: "Enter gifts and charity percentage"
      text: "Enter any gifts made in the last 7 years and the percentage of estate left to charity."
    - name: "View your results"
      text: "See your total IHT liability, effective rate, and tax breakdown."

faq:
  - question: "What is Inheritance Tax (IHT) in the UK?"
    answer: "Inheritance Tax (IHT) is a tax on the estate of someone who has died. In the UK, it is typically charged at 40% on the portion of the estate above the nil-rate band (£325,000 in 2025/26)."
  - question: "What is the nil-rate band?"
    answer: "The nil-rate band (NRB) is the threshold below which no Inheritance Tax is payable. For the 2025/26 tax year, the standard NRB is £325,000 per person."
  - question: "What is the residence nil-rate band?"
    answer: "The residence nil-rate band (RNRB) is an additional allowance of up to £175,000 (2025/26) if you leave your main residence to direct descendants."
  - question: "Can I transfer unused nil-rate band to my spouse?"
    answer: "Yes — any unused NRB or RNRB can be transferred to a surviving spouse or civil partner, potentially doubling the available allowances."
  - question: "How do gifts affect Inheritance Tax?"
    answer: "Gifts made within 7 years of death are added back to the estate. They are taxed at 40% if above the nil-rate band, with taper relief reducing the tax if gifted 3-7 years before death."
  - question: "Does leaving money to charity reduce Inheritance Tax?"
    answer: "Yes — if you leave at least 10% of your estate to charity, the IHT rate reduces from 40% to 36% on the taxable portion."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# IHT Calculator – UK Inheritance Tax Estimator

Estimate UK Inheritance Tax (IHT) on your estate with our free **IHT Calculator**. Enter your estate value, main residence, gifts, and charity percentage to see your total tax liability and effective rate — all without your data leaving your browser.

<!-- more -->

## How Does the IHT Calculator Work?

The **IHT calculator** applies current UK Inheritance Tax rules to estimate how much tax may be owed on an estate. It calculates the **nil-rate band (£325,000)**, **residence nil-rate band (up to £175,000)**, and applies the **40% standard rate** (or **36% reduced rate** if at least 10% is left to charity).

**Key features:**

- ✅ **Nil-rate band (NRB)** — £325,000 per person
- ✅ **Residence nil-rate band (RNRB)** — up to £175,000
- ✅ **Spouse transfer** — combine unused allowances
- ✅ **7-year gift rule** — add gifts back to the estate
- ✅ **Charity reduction** — 40% → 36% if 10%+ left to charity

All calculations follow HM Revenue & Customs (HMRC) guidelines for the 2025/26 tax year.

## What Is the 7-Year Gift Rule?

Gifts made within 7 years of death are added back into the estate for Inheritance Tax purposes. If the total estate (including gifts) exceeds the nil-rate band, tax is charged at 40% on the excess.

Taper relief reduces the tax on gifts if the donor survived at least 3 years after making the gift:

| Years Between Gift and Death | Tax Reduction |
|------------------------------|---------------|
| 0 – 3 years | 0% |
| 3 – 4 years | 20% |
| 4 – 5 years | 40% |
| 5 – 6 years | 60% |
| 6 – 7 years | 80% |
| 7+ years | 100% (exempt) |

The calculator applies taper relief automatically based on the gift amount entered.

## Who Benefits from the IHT Calculator?

This **IHT tax estimator** is designed for:

- **UK residents** planning their estate and inheritance tax liability
- **Families** with property and savings needing to understand IHT exposure
- **Executors** estimating tax during probate
- **Advisors** running client scenarios for estate planning
- **Anyone** wanting to understand how charity gifts or spouse transfers affect IHT

The tool handles **RNRB**, **spouse transfer**, **7-year gifts**, **charity reduction**, and more — all in one place.

---

## Frequently Asked Questions

### What is Inheritance Tax (IHT) in the UK?
Inheritance Tax is a tax on the estate of someone who has died. In the UK, it is charged at 40% on the portion above the nil-rate band (£325,000 in 2025/26).

### What is the nil-rate band?
The nil-rate band (NRB) is the threshold below which no IHT is payable. For 2025/26, the standard NRB is £325,000 per person.

### What is the residence nil-rate band?
The RNRB is an additional allowance of up to £175,000 (2025/26) if you leave your main residence to direct descendants.

### Can I transfer unused nil-rate band to my spouse?
Yes — unused NRB and RNRB can be transferred to a surviving spouse or civil partner, potentially doubling the allowances.

### How do gifts affect Inheritance Tax?
Gifts made within 7 years of death are added back to the estate. They are taxed at 40% above the NRB, with taper relief reducing tax if gifted 3-7 years before death.

### Does leaving money to charity reduce IHT?
Yes — leaving at least 10% of your estate to charity reduces the IHT rate from 40% to 36% on the taxable portion.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.