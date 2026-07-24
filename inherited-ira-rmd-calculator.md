---
layout: tool
title: "Inherited Ira Rmd | Interactive Online Tool"
description: "Use the Inherited IRA RMD Calculator to estimate your required minimum distribution as a beneficiary, based on the applicable IRS distribution..."
permalink: /inherited-ira-rmd-calculator
tool_id: inherited-ira-rmd-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: inheritedBalance
    label: Inherited IRA Balance (as of Dec 31 Last Year)
    type: number
    default: 200000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 200000"

  - id: beneficiaryType
    label: Beneficiary Type
    type: select
    default: eligible_designated
    options:
      - spouse
      - eligible_designated
      - non_eligible_10yr
      - non_designated_5yr

  - id: beneficiaryAge
    label: Your Current Age
    type: number
    default: 55
    step: 1
    min: 0
    max: 110
    placeholder: "e.g., 55"

  - id: yearsSinceInheritance
    label: Years Since Inheriting (0 = First Distribution Year)
    type: number
    default: 0
    step: 1
    min: 0
    max: 40
    placeholder: "e.g., 0"

outputs:
  - id: lifeExpectancyFactor
    label: Applicable Life Expectancy Factor
  - id: currentYearRmd
    label: Estimated Current Year RMD
  - id: rmdAsPercent
    label: RMD as % of Balance
  - id: distributionDeadline
    label: Full Distribution Deadline

js_file: assets/js/calculators/inherited-ira-rmd-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Inherited IRA RMD Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the Inherited IRA RMD Calculator to estimate your required minimum distribution as a beneficiary, based on the applicable IRS distribution rule and your life expectancy."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Life Expectancy Method RMD Calculation"
    - "10-Year Rule Support"
    - "5-Year Rule Support"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: Inherited IRA RMD Calculator

howto:
  name: "How to Use the Inherited IRA RMD Calculator"
  description: "Follow these steps to estimate your inherited IRA RMD."
  step:
    - name: "Enter the inherited IRA balance"
      text: "Enter the account balance as of December 31 of the prior year."
    - name: "Select your beneficiary type"
      text: "Choose the category that applies to you: spouse, eligible designated beneficiary, non-eligible designated beneficiary (10-year rule), or non-designated beneficiary (5-year rule)."
    - name: "Enter your current age"
      text: "Enter your age in the applicable distribution year, used to determine your life expectancy factor."
    - name: "Enter years since inheriting"
      text: "Enter how many years have passed since you inherited the account (0 for your first distribution year)."
    - name: "View your results"
      text: "See your applicable life expectancy factor, estimated RMD, and full distribution deadline."

faq:
  - question: "What is an inherited IRA RMD?"
    answer: "An inherited IRA RMD (Required Minimum Distribution) is the minimum amount a beneficiary must withdraw each year from an inherited retirement account, with the calculation method depending on the beneficiary's relationship to the original owner and other factors."
  - question: "What is the 10-year rule for inherited IRAs?"
    answer: "Under the SECURE Act, most non-spouse beneficiaries who are not 'eligible designated beneficiaries' must fully distribute the inherited IRA within 10 years of the original owner's death, and may also owe annual RMDs during that period if the original owner had already started taking RMDs."
  - question: "Who qualifies as an eligible designated beneficiary?"
    answer: "Eligible designated beneficiaries include surviving spouses, minor children of the account owner (until they reach the age of majority), disabled or chronically ill individuals, and beneficiaries not more than 10 years younger than the account owner. They can generally use the life expectancy method instead of the 10-year rule."
  - question: "What happens if I don't take my RMD?"
    answer: "Failing to take a required RMD can result in an IRS excise tax penalty on the amount not withdrawn, though this penalty has been reduced under SECURE 2.0 if corrected in a timely manner."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."
---

# Inherited Ira Rmd Calculator

Use the **Inherited IRA RMD Calculator** to estimate your required minimum distribution as a beneficiary, based on the applicable IRS distribution rule and your life expectancy.

<!-- more -->

## How the Inherited IRA RMD Calculator Works

Inherited IRA distribution rules depend heavily on your relationship to the original account owner. This calculator estimates your RMD under the **life expectancy method**, the **10-year rule**, or the **5-year rule**, depending on your beneficiary type.

This **inherited IRA RMD calculator** computes:

- **Applicable Life Expectancy Factor** — from the IRS Single Life Expectancy Table (approximate)
- **Estimated Current Year RMD** — your required withdrawal this year
- **RMD as % of Balance** — the proportion of the account required to be withdrawn
- **Full Distribution Deadline** — when the entire account must be depleted

---

## Inherited IRA RMD Formula

### Life Expectancy Method (Spouse & Eligible Designated Beneficiaries)

**RMD = Account Balance ÷ Life Expectancy Factor**

For non-spouse eligible designated beneficiaries, the factor is set in the first distribution year and reduced by 1 for each subsequent year (not re-looked-up from the table).

### 10-Year Rule / 5-Year Rule

These rules generally require the **entire account to be emptied by the end of the applicable year**, with annual RMDs potentially required during the 10-year window if the original owner had already begun taking RMDs.

---

## Inherited IRA RMD Examples

### Example 1: Eligible Designated Beneficiary, First Year

| Variable | Value |
|----------|-------|
| Inherited Balance | $200,000 |
| Beneficiary Type | Eligible Designated Beneficiary |
| Age | 55 |
| **Life Expectancy Factor** | **~29.6** |
| **Estimated RMD** | **~$6,757** |

### Example 2: Non-Eligible Designated Beneficiary (10-Year Rule)

| Variable | Value |
|----------|-------|
| Inherited Balance | $200,000 |
| Beneficiary Type | Non-Eligible Designated Beneficiary |
| **Distribution Deadline** | **End of Year 10** |

---

## Who Benefits from the Inherited IRA RMD Calculator?

This **inherited IRA calculator** is designed for:

- **Beneficiaries** who recently inherited an IRA or 401(k)
- **Surviving spouses** deciding on a distribution strategy
- **Non-spouse beneficiaries** navigating the 10-year rule
- **Financial planners** helping clients meet inherited IRA distribution deadlines

---

## Frequently Asked Questions

### What is an inherited IRA RMD?
An inherited IRA RMD (Required Minimum Distribution) is the minimum amount a beneficiary must withdraw each year from an inherited retirement account, with the calculation method depending on the beneficiary's relationship to the original owner and other factors.

### What is the 10-year rule for inherited IRAs?
Under the SECURE Act, most non-spouse beneficiaries who are not "eligible designated beneficiaries" must fully distribute the inherited IRA within 10 years of the original owner's death, and may also owe annual RMDs during that period if the original owner had already started taking RMDs.

### Who qualifies as an eligible designated beneficiary?
Eligible designated beneficiaries include surviving spouses, minor children of the account owner (until they reach the age of majority), disabled or chronically ill individuals, and beneficiaries not more than 10 years younger than the account owner. They can generally use the life expectancy method instead of the 10-year rule.

### What happens if I don't take my RMD?
Failing to take a required RMD can result in an IRS excise tax penalty on the amount not withdrawn, though this penalty has been reduced under SECURE 2.0 if corrected in a timely manner.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.

<p class="tool-disclaimer">Inherited IRA distribution rules are complex and depend on factors specific to your situation, including the original owner's age at death and applicable law changes. This calculator uses approximate life expectancy factors. Consult a tax advisor or the IRS Single Life Expectancy Table for precise figures.</p>
