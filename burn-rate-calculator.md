---
layout: tool
title: "Burn Rate | Interactive Online Tool"
description: "Calculate your startups gross monthly spend, net monthly cash burn, annualized burn rate, and capital efficiency ratio."
permalink: /burn-rate-calculator
tool_id: burn-rate-calculator
category: saas-fundraising-valuation
hide_sidebar: true

inputs:
  - id: payroll
    label: Monthly Payroll & Benefits
    type: number
    default: 120000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 120000"

  - id: hostingCloud
    label: Software, Hosting & Cloud Infra
    type: number
    default: 15000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 15000"

  - id: marketingAds
    label: Sales & Marketing Spend
    type: number
    default: 25000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 25000"

  - id: officeOther
    label: Office, Legal & Admin
    type: number
    default: 10000
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: monthlyCashIn
    label: Total Monthly Cash Receipts / Revenue
    type: number
    default: 70000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 70000"

outputs:
  - id: grossBurn
    label: Gross Monthly Burn Rate
  - id: netBurn
    label: Net Monthly Burn Rate
  - id: annualizedGrossBurn
    label: Annualized Gross Spend
  - id: annualizedNetBurn
    label: Annualized Net Burn
  - id: burnEfficiency
    label: Net Burn Ratio

charts:
  tabs:
    - id: spendBreakdown
      label: Spend Breakdown
    - id: grossVsNet
      label: Gross vs Net Burn

history_columns:
  - key: grossBurn
    label: Gross Burn ($)
    source: output
  - key: netBurn
    label: Net Burn ($)
    source: output
  - key: monthlyCashIn
    label: Cash In ($)
    source: input
  - key: annualizedNetBurn
    label: Annualized Net ($)
    source: output

js_file: assets/js/calculators/burn-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Burn Rate Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate gross monthly spend and net monthly cash burn rate for SaaS companies and startups."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Gross Monthly Burn Breakdown"
    - "Net Monthly Cash Burn Calculation"
    - "Annualized Spend & Net Cash Drain"
    - "Spend Category Distribution Chart"
    - "Net Burn Efficiency Analysis"

breadcrumb:
  - name: Home
    url: /
  - name: Fundraising & Valuation
    url: /saas-fundraising-valuation
  - name: Burn Rate Calculator

howto:
  name: "How to Calculate Startup Burn Rate"
  description: "Follow these steps to analyze your monthly gross and net cash burn rate."
  step:
    - name: "Enter Payroll Expenses"
      text: "Input total monthly salaries, taxes, and employee benefits."
    - name: "Input Software & Infrastructure Costs"
      text: "Enter AWS, SaaS tools, and cloud infrastructure expenses."
    - name: "Add Marketing & Operational Costs"
      text: "Enter ad spend, agency fees, legal, and rent costs."
    - name: "Input Cash Collections"
      text: "Enter customer payments and cash receipts collected."

faq:
  - question: "What is gross burn rate vs net burn rate?"
    answer: "Gross burn rate is total operating expenditure in a given month. Net burn rate is gross expenses minus cash incoming from customer revenue (Gross Expenses − Revenue = Net Burn)."
  - question: "How do you calculate monthly burn rate?"
    answer: "Gross Burn = Payroll + Infrastructure + Marketing + Admin. Net Burn = Gross Burn − Monthly Cash Receipts."
  - question: "What is a good Burn Multiple for a SaaS startup?"
    answer: "Burn Multiple = Net Burn / Net New ARR generated. A Burn Multiple under 1.0x is considered incredible, 1.0x–1.5x is good, and above 2.5x indicates capital inefficiency."
  - question: "Why do investors care about burn rate?"
    answer: "Burn rate determines how fast a company consumes investor capital. Uncontrolled burn shortens runway and forces diluted emergency fundraising rounds."
  - question: "How can a startup reduce net burn rate?"
    answer: "Startups reduce net burn by increasing monthly cash collections, pausing non-performing ad channels, negotiating vendor software discounts, and freezing non-critical headcount."
  - question: "Is my data stored or tracked?"
    answer: "No. All calculation models execute locally inside your client web browser."

---

# Burn Rate Calculator

Calculate your startup's gross monthly expenses and net cash burn with our free **Burn Rate Calculator**. Analyze expense allocations across payroll, hosting, marketing, and admin while tracking annualized burn metrics.

<!-- more -->

## Understanding Gross vs Net Burn Rate

In venture capital and tech startups, managing **burn rate** is fundamental to company survival. Burn rate measures the rate at which a company consumes its cash reserves.

- **Gross Monthly Burn**: Total operating cash outlays required to run the business.
- **Net Monthly Burn**: The actual monthly net cash loss after subtracting cash collections ($\text{Gross Burn} - \text{Cash Receipts}$).
- **Net Burn Ratio**: The percentage of gross expenses not covered by revenue ($\frac{\text{Net Burn}}{\text{Gross Burn}}$).

---

## Burn Rate Mathematical Model

$$\text{Gross Burn} = \text{Payroll} + \text{Cloud/Infra} + \text{Marketing} + \text{Admin/Other}$$

$$\text{Net Burn} = \text{Gross Burn} - \text{Monthly Cash Receipts}$$

$$\text{Annualized Net Burn} = \text{Net Burn} \times 12$$

$$\text{Net Burn Ratio (\%)} = \left( \frac{\text{Net Burn}}{\text{Gross Burn}} \right) \times 100$$

---

## SaaS Burn Multiple Benchmarks

| Burn Multiple ($\frac{\text{Net Burn}}{\text{Net New ARR}}$) | Capital Efficiency Rating |
| :--- | :--- |
| **< 1.0x** | 🌟 **Best-in-Class / Amazing** |
| **1.0x – 1.5x** | 🟢 **Good / Efficient** |
| **1.5x – 2.0x** | 🟡 **Moderate / Susceptible** |
| **> 2.5x** | 🔴 **Inefficient / High Risk** |

---

## Step-by-Step Guide to Calculating Burn Rate

1. **Enter Payroll & Contractors**: Input total monthly payroll, benefits, and contract labor.
2. **Add Infrastructure & SaaS**: Input monthly cloud costs (AWS/GCP), API subscriptions, and tool software.
3. **Input Sales & Marketing**: Include ad spend, events, and agency retainer costs.
4. **Enter Cash Receipts**: Input total actual cash collected from subscriptions and invoice payments.
5. **Analyze Results**: Review gross vs net burn and net burn ratio percentage.

---

## Frequently Asked Questions

### What is gross burn rate vs net burn rate?
Gross burn rate is total operating expenditure in a given month. Net burn rate is gross expenses minus cash incoming from customer revenue (Gross Expenses − Revenue = Net Burn).

### How do you calculate monthly burn rate?
Gross Burn = Payroll + Infrastructure + Marketing + Admin. Net Burn = Gross Burn − Monthly Cash Receipts.

### What is a good Burn Multiple for a SaaS startup?
Burn Multiple = Net Burn / Net New ARR generated. A Burn Multiple under 1.0x is considered incredible, 1.0x–1.5x is good, and above 2.5x indicates capital inefficiency.

### Why do investors care about burn rate?
Burn rate determines how fast a company consumes investor capital. Uncontrolled burn shortens runway and forces diluted emergency fundraising rounds.

### How can a startup reduce net burn rate?
Startups reduce net burn by increasing monthly cash collections, pausing non-performing ad channels, negotiating vendor software discounts, and freezing non-critical headcount.

### Is my data stored or tracked?
No. All calculation models execute locally inside your client web browser.
