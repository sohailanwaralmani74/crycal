---
layout: tool
title: SaaS Revenue Forecasting & Projection Calculator
description: Project 1 to 3 year ARR growth based on net new MRR acquisition, expansion rates, and monthly churn assumptions.
permalink: /saas-forecasting-projection-calculator
tool_id: saas-forecasting-projection-calculator
category: saas-revenue-growth-metrics
hide_sidebar: true

inputs:
  - id: currentMrr
    label: Current Starting MRR ($)
    type: number
    default: 50000
    step: 5000
    min: 0
    currency: true
    placeholder: "e.g., 50000"

  - id: newMrrPerMonth
    label: New Logo MRR Added per Month ($)
    type: number
    default: 8000
    step: 500
    min: 0
    currency: true
    placeholder: "e.g., 8000"

  - id: monthlyExpansionRatePct
    label: Monthly Expansion Rate (%)
    type: number
    default: 2
    step: 0.2
    min: 0
    max: 20
    placeholder: "e.g., 2"

  - id: monthlyChurnRatePct
    label: Monthly Revenue Churn Rate (%)
    type: number
    default: 1.5
    step: 0.1
    min: 0
    max: 20
    placeholder: "e.g., 1.5"

  - id: forecastYears
    label: Forecast Time Horizon (Years)
    type: number
    default: 3
    step: 1
    min: 1
    max: 5
    placeholder: "e.g., 3"

outputs:
  - id: yr1EndArr
    label: Year 1 Exit ARR
  - id: yr2EndArr
    label: Year 2 Exit ARR
  - id: yr3EndArr
    label: Year 3 Exit ARR
  - id: cumulativeRevenueEarned
    label: Total Cumulative Revenue Earned

charts:
  tabs:
    - id: forecast
      label: Multi-Year ARR Growth Projection

history_columns:
  - key: currentMrr
    label: Starting MRR
    source: input
  - key: newMrrPerMonth
    label: New MRR/mo
    source: input
  - key: monthlyChurnRatePct
    label: Churn (%)
    source: input
  - key: yr1EndArr
    label: Yr 1 Exit ARR
    source: output
  - key: yr3EndArr
    label: Yr 3 Exit ARR
    source: output

js_file: /assets/js/calculators/saas-forecasting-projection-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "SaaS Revenue Forecasting & Projection Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Project 1 to 3 year ARR growth based on net new MRR acquisition, expansion rates, and monthly churn assumptions."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "1-to-3 Year ARR Forecast Modeling"
    - "Net New MRR, Expansion & Churn Sensitivity"
    - "Cumulative Earned Revenue Cash Projections"
    - "100% Private Local Browser Calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Revenue & Growth Metrics
    url: /saas-revenue-growth-metrics
  - name: SaaS Forecasting & Projection Calculator

howto:
  name: "How to Forecast SaaS Revenue Growth"
  description: "Follow these steps to build multi-year SaaS ARR projections."
  step:
    - name: "Enter Current Starting MRR"
      text: "Input your active MRR at Month 0."
    - name: "Input Monthly New Logo Additions"
      text: "Enter expected dollar value of brand new MRR added each month."
    - name: "Input Expansion & Churn Rates"
      text: "Enter monthly expansion rate % and monthly revenue churn rate %."
    - name: "Review Forecast Trajectory"
      text: "Analyze Year 1, Year 2, and Year 3 Exit ARR and cumulative revenue earned."

faq:
  - question: "How does a SaaS revenue forecasting model work?"
    answer: "The model calculates monthly compounding MRR using the formula: Month_n MRR = Month_(n-1) MRR + New Logo MRR + (Month_(n-1) MRR × Expansion %) − (Month_(n-1) MRR × Churn %). Exit ARR is calculated as Month 12, 24, or 36 MRR × 12."
  - question: "Why is net negative churn essential for long-term SaaS scale?"
    answer: "When monthly expansion rate % exceeds monthly churn rate %, existing cohorts grow over time, allowing new logo MRR to accelerate overall business compounding."
  - question: "What is Exit ARR?"
    answer: "Exit ARR is the annualized recurring revenue run rate at the final month of a fiscal year (Month 12, 24, or 36)."
  - question: "How do changes in monthly churn impact 3-year ARR projections?"
    answer: "Even a 1% reduction in monthly churn can increase 3-year exit ARR by 30% to 50%+ due to compounding retention benefits."
  - question: "What assumptions should early-stage SaaS companies use for new logo MRR growth?"
    answer: "Early-stage founders should model conservative linear new logo additions unless backed by historical customer acquisition channel data."
  - question: "Should one-off setup fees be included in MRR projections?"
    answer: "No. Professional service setup fees are non-recurring and must be tracked separately from subscription MRR forecasts."
  - question: "How often should financial models update their revenue forecasts?"
    answer: "Most SaaS companies re-forecast quarterly to adjust for actual new logo sales velocity and empirical churn trends."

---

# SaaS Revenue Forecasting & Projection Calculator

Project **1 to 3 Year Annual Recurring Revenue (ARR)** trajectories based on new logo MRR acquisition velocity, account expansion rates, and monthly revenue churn assumptions.

<!-- more -->

## Why Use This SaaS Forecasting Calculator

Accurate revenue forecasting is critical for budgeting, headcount hiring, and capital planning. This calculator helps you:

- **🔮 Model Multi-Year ARR Growth** — project Year 1, Year 2, and Year 3 Exit ARR.
- **⚖️ Test Expansion vs. Churn Sensitivity** — evaluate how net negative churn accelerates long-term compounding.
- **💵 Plan Hiring & Runway** — calculate total cumulative revenue earned to align operational expenditure.
- **📊 Investor Pitch & Financial Planning** — present realistic multi-year SaaS financial models to stakeholders.

---

## SaaS Revenue Projection Formula

$$\text{Month}_n \text{ MRR} = \text{Month}_{n-1} \text{ MRR} + \text{New MRR} + (\text{Month}_{n-1} \text{ MRR} \times \text{Expansion \%}) - (\text{Month}_{n-1} \text{ MRR} \times \text{Churn \%})$$

$$\text{Exit ARR (Year } k\text{)} = \text{Month}_{12 \times k} \text{ MRR} \times 12$$

$$\text{Cumulative Earned Revenue} = \sum_{m=1}^{12 \times k} \text{Month}_m \text{ MRR}$$

---

## Sample 3-Year Forecast Output Matrix

| Forecast Year | Month | Monthly MRR | Exit ARR | Cumulative Revenue |
| :--- | :--- | :--- | :--- | :--- |
| **Start (Month 0)** | 0 | $50,000 | $600,000 | $0 |
| **Year 1 Exit** | 12 | $145,000 | $1,740,000 | $1,150,000 |
| **Year 2 Exit** | 24 | $265,000 | $3,180,000 | $3,600,000 |
| **Year 3 Exit** | 36 | $415,000 | $4,980,000 | $7,700,000 |

---

## How to Use This SaaS Forecasting Calculator

1. Enter **Current Starting MRR ($)**.
2. Enter **New Logo MRR Added per Month ($)**.
3. Enter expected **Monthly Expansion Rate (%)** and **Monthly Churn Rate (%)**.
4. Select **Forecast Time Horizon (Years)**.
5. Review **Year 1, 2, 3 Exit ARR** and **Cumulative Revenue Earned**.

---

## Frequently Asked Questions

### How does a SaaS revenue forecasting model work?
The model calculates monthly compounding MRR using the formula: Month_n MRR = Month_(n-1) MRR + New Logo MRR + (Month_(n-1) MRR × Expansion %) − (Month_(n-1) MRR × Churn %). Exit ARR is calculated as Month 12, 24, or 36 MRR × 12.

### Why is net negative churn essential for long-term SaaS scale?
When monthly expansion rate % exceeds monthly churn rate %, existing cohorts grow over time, allowing new logo MRR to accelerate overall business compounding.

### What is Exit ARR?
Exit ARR is the annualized recurring revenue run rate at the final month of a fiscal year (Month 12, 24, or 36).

### How do changes in monthly churn impact 3-year ARR projections?
Even a 1% reduction in monthly churn can increase 3-year exit ARR by 30% to 50%+ due to compounding retention benefits.

### What assumptions should early-stage SaaS companies use for new logo MRR growth?
Early-stage founders should model conservative linear new logo additions unless backed by historical customer acquisition channel data.

### Should one-off setup fees be included in MRR projections?
No. Professional service setup fees are non-recurring and must be tracked separately from subscription MRR forecasts.

### How often should financial models update their revenue forecasts?
Most SaaS companies re-forecast quarterly to adjust for actual new logo sales velocity and empirical churn trends.
