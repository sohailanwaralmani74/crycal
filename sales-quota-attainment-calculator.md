---
layout: tool
title: "Sales Quota Attainment & OTE Calculator"
description: "Calculate sales rep quota attainment percentage, commission payouts, tier accelerators, and OTE earnings with instant, private browser execution."
permalink: /sales-quota-attainment-calculator
tool_id: sales-quota-attainment-calculator
category: saas-sales-funnel
hide_sidebar: true

inputs:
  - id: targetQuota
    label: Quarterly / Annual Quota Target ($)
    type: number
    default: 250000
    step: 5000
    min: 10000
    prefix: '$'
    placeholder: "e.g., 250000"

  - id: closedRevenue
    label: Total Closed-Won Revenue ($)
    type: number
    default: 275000
    step: 5000
    min: 0
    prefix: '$'
    placeholder: "e.g., 275000"

  - id: baseSalary
    label: Rep Base Salary ($)
    type: number
    default: 50000
    step: 1000
    min: 0
    prefix: '$'
    placeholder: "e.g., 50000"

  - id: targetCommission
    label: Target Variable Commission / OTE ($)
    type: number
    default: 50000
    step: 1000
    min: 0
    prefix: '$'
    placeholder: "e.g., 50000"

  - id: acceleratorRate
    label: Tier Accelerator Rate (%)
    type: number
    default: 150
    step: 5
    min: 100
    max: 300
    suffix: '%'
    placeholder: "e.g., 150"

outputs:
  - id: attainmentPercentage
    label: Quota Attainment Percentage (%)
  - id: commissionEarned
    label: Earned Variable Commission ($)
  - id: totalPayout
    label: Total On-Target Compensation Paid ($)
  - id: overperformanceBonus
    label: Accelerated Bonus Earnings ($)

charts:
  tabs:
    - id: attainmentVsQuota
      label: Closed Revenue vs Target Quota
    - id: earningsBreakdown
      label: Base Salary vs Commission vs Accelerator

history_columns:
  - key: targetQuota
    label: Target Quota ($)
    source: input
  - key: closedRevenue
    label: Closed Rev ($)
    source: input
  - key: attainmentPercentage
    label: Attainment (%)
    source: output
  - key: totalPayout
    label: Total Payout ($)
    source: output

js_file: assets/js/calculators/sales-quota-attainment-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Sales Quota Attainment & OTE Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate sales representative quota attainment percentage, base salary, variable commission, tier accelerators, and total OTE earnings."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates quota attainment percentages for AE and SDR sales teams"
    - "Models variable commission rates and over-performance tier accelerators"
    - "Calculates total On-Target Earnings (OTE) payouts"
    - "Supports quarterly and annual compensation plan modeling"

breadcrumb:
  - name: Home
    url: /
  - name: SaaS Sales Funnel
    url: /saas-sales-funnel
  - name: Sales Quota Attainment Calculator

howto:
  name: "How to Calculate Sales Quota Attainment and Commission"
  description: "Calculate sales rep quota attainment rates, commission payouts, and accelerator bonuses."
  step:
    - name: "Enter sales quota target"
      text: "Input target revenue quota assigned for the period (e.g., $250,000 per quarter)."
    - name: "Enter actual closed-won revenue"
      text: "Input total closed-won ARR or ACV booked during the performance period."
    - name: "Set base salary and variable commission"
      text: "Specify base salary and target variable commission split (e.g., 50/50 OTE)."
    - name: "Apply commission accelerator rate"
      text: "Set tier accelerator multiplier percentage applied to revenue booked beyond 100% quota."

faq:
  - question: "How do you calculate sales quota attainment percentage?"
    answer: "Quota Attainment Percentage = (Closed-Won Revenue / Target Revenue Quota) * 100. For example, $275,000 closed on a $250,000 quota equals 110% attainment."
  - question: "What is On-Target Earnings (OTE) in sales compensation?"
    answer: "OTE (On-Target Earnings) is the total expected annual compensation for a sales rep who hits exactly 100% of their assigned quota, typically split 50% base salary and 50% variable commission."
  - question: "What is a commission accelerator in sales compensation plans?"
    answer: "A commission accelerator is a multiplier (e.g., 1.5x or 2.0x standard commission rate) applied to all revenue closed after a rep crosses 100% quota attainment."
  - question: "What is an acceptable average quota attainment rate for SaaS sales teams?"
    answer: "In healthy SaaS companies, average team quota attainment ranges from 60% to 70% of reps hitting 100% quota. If fewer than 50% hit quota, targets are likely unachievable."
  - question: "What is the typical Quota-to-OTE ratio in SaaS?"
    answer: "Standard SaaS Quota-to-OTE ratio is 4x to 6x. For example, an AE with a $150,000 OTE ($75k base / $75k variable) typically carries a $600,000 to $900,000 annual ARR quota."
  - question: "What is a commission cliff or threshold?"
    answer: "A commission cliff requires reps to achieve a minimum attainment threshold (e.g., 50% or 70% of quota) before earning any variable commission payouts."
  - question: "How do clawbacks work in sales commission plans?"
    answer: "A clawback clause allows companies to reclaim paid commission if a customer churns or cancels within a specified window (e.g., 60 to 90 days after signing)."
---

# Sales Quota Attainment & Commission Estimator

Calculate sales representative quota attainment percentages, base commission payouts, overperformance tier accelerators, and total On-Target Earnings (OTE).
All calculations execute 100% privately inside your web browser with client-side processing, instant results, and total financial privacy.

<!-- more -->

## Why Use the Sales Quota Attainment Calculator?

Designing effective sales compensation plans requires balancing rep motivation with company gross margin rules. Miscalculating commission tiers or accelerator triggers leads to payroll errors, demotivated Account Executives (AEs), or unbudgeted commission overruns.

This **Sales Quota Attainment Calculator** models base variable commission, attainment percentages, and tier accelerators for sales leaders and reps alike.

### Key Benefits
* **Exact Attainment Tracking:** Calculates precise quota attainment percentages across any target period.
* **Tier Accelerator Modeling:** Simulates multiplier bonuses ($150\% \text{ to } 200\%$) for revenue booked past 100% quota.
* **OTE Payout Breakdown:** Separates base salary, standard variable commission, and accelerated bonus payouts.
* **100% Private Browser Math:** Client-side calculations keep sales quota plans strictly confidential.

---

## Mathematical Formulas & Mechanics

### 1. Quota Attainment Percentage
Attainment percentage ($A_{\text{pct}}$) from closed revenue ($R_{\text{closed}}$) and target quota ($Q_{\text{target}}$):

$$A_{\text{pct}} = \left(\frac{R_{\text{closed}}}{Q_{\text{target}}}\right) \times 100$$

### 2. Base Variable Commission Rate
Base variable commission rate ($C_{\text{rate}}$) from target variable commission ($V_{\text{target}}$):

$$C_{\text{rate}} = \frac{V_{\text{target}}}{Q_{\text{target}}}$$

### 3. Accelerated Commission & Total Payout
If $R_{\text{closed}} \le Q_{\text{target}}$:

$$\text{Commission} = R_{\text{closed}} \times C_{\text{rate}}$$

If $R_{\text{closed}} > Q_{\text{target}}$:

$$\text{Base Comm} = Q_{\text{target}} \times C_{\text{rate}}$$

$$\text{Accelerated Comm} = (R_{\text{closed}} - Q_{\text{target}}) \times \left(C_{\text{rate}} \times \frac{\text{Accel}_{\text{rate}}}{100}\right)$$

$$\text{Total Payout} = \text{Base Salary} + \text{Base Comm} + \text{Accelerated Comm}$$

---

## Real-World Comparison & Benchmark Table

The benchmark compensation table below displays quota attainment earnings for an AE with a **$100,000 OTE ($50k Base / $50k Variable)** on a **$500,000 Annual Quota** with a **150% Accelerator (>100% Attainment)**:

| Closed Revenue | Attainment (%) | Base Salary | Standard Variable Comm | Accelerated Bonus | Total OTE Payout | Effective Pay Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **$250,000** | 50.0% Attainment | $50,000 | $25,000 | $0 | $75,000 | 30.0% of Revenue |
| **$400,000** | 80.0% Attainment | $50,000 | $40,000 | $0 | $90,000 | 22.5% of Revenue |
| **$500,000** | 100.0% Attainment | $50,000 | $50,000 | $0 | $100,000 (100% OTE) | 20.0% of Revenue |
| **$600,000** | 120.0% Attainment | $50,000 | $50,000 | $15,000 (150% Accel) | $115,000 | 19.2% of Revenue |
| **$750,000** | 150.0% Attainment | $50,000 | $50,000 | $37,500 (150% Accel) | $137,500 | 18.3% of Revenue |

---

## Step-by-Step How-To Guide

1. **Define Performance Period:** Establish whether quota targets and commissions are calculated monthly, quarterly, or annually.
2. **Input Assigned Quota Target:** Enter total revenue target assigned to the account executive or sales representative.
3. **Verify Closed-Won Bookings:** Enter verified closed-won ARR or ACV contracts booked within the active compensation period.
4. **Configure Compensation Split:** Input base salary and target variable commission split (e.g., 50/50 OTE split).
5. **Set Tier Accelerators:** Apply accelerator multipliers (e.g., 150% or 200%) for deals closed above 100% quota attainment.

---

## Frequently Asked Questions

### How do you calculate sales quota attainment percentage?
Quota Attainment Percentage = (Closed-Won Revenue / Target Revenue Quota) * 100. For example, $275,000 closed on a $250,000 quota equals 110% attainment.

### What is On-Target Earnings (OTE) in sales compensation?
OTE (On-Target Earnings) is the total expected annual compensation for a sales rep who hits exactly 100% of their assigned quota, typically split 50% base salary and 50% variable commission.

### What is a commission accelerator in sales compensation plans?
A commission accelerator is a multiplier (e.g., 1.5x or 2.0x standard commission rate) applied to all revenue closed after a rep crosses 100% quota attainment.

### What is an acceptable average quota attainment rate for SaaS sales teams?
In healthy SaaS companies, average team quota attainment ranges from 60% to 70% of reps hitting 100% quota. If fewer than 50% hit quota, targets are likely unachievable.

### What is the typical Quota-to-OTE ratio in SaaS?
Standard SaaS Quota-to-OTE ratio is 4x to 6x. For example, an AE with a $150,000 OTE ($75k base / $75k variable) typically carries a $600,000 to $900,000 annual ARR quota.

### What is a commission cliff or threshold?
A commission cliff requires reps to achieve a minimum attainment threshold (e.g., 50% or 70% of quota) before earning any variable commission payouts.

### How do clawbacks work in sales commission plans?
A clawback clause allows companies to reclaim paid commission if a customer churns or cancels within a specified window (e.g., 60 to 90 days after signing).
