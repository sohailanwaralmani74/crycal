---
layout: tool
title: "Sales Win Rate Calculator | Won Deals & Opportunity"
description: "Calculate SaaS sales win rate percentage, win-to-loss ratio, and pipeline deal conversion with instant browser-based math and charts."
permalink: /win-rate-calculator
tool_id: win-rate-calculator
category: saas-sales-funnel
hide_sidebar: true

inputs:
  - id: wonDeals
    label: Number of Won Deals (Closed Won)
    type: number
    default: 25
    step: 1
    min: 0
    placeholder: "e.g., 25"

  - id: totalOpportunities
    label: Total Opportunities Analyzed (Won + Lost)
    type: number
    default: 100
    step: 1
    min: 1
    placeholder: "e.g., 100"

  - id: averageDealSize
    label: Average Deal Size / ACV ($)
    type: number
    default: 12000
    step: 500
    min: 0
    prefix: '$'
    placeholder: "e.g., 12000"

  - id: salesCycleDays
    label: Average Sales Cycle (Days)
    type: number
    default: 45
    step: 5
    min: 1
    placeholder: "e.g., 45"

outputs:
  - id: winRate
    label: Sales Win Rate (%)
  - id: lossRate
    label: Deal Loss Rate (%)
  - id: wonRevenue
    label: Total Closed Won Revenue ($)
  - id: pipelineValue
    label: Total Pipeline Value Analyzed ($)
  - id: winToLossRatio
    label: Win-to-Loss Ratio

charts:
  tabs:
    - id: dealBreakdown
      label: Deal Outcome Distribution
    - id: revenueImpact
      label: Won Revenue vs Lost Value

history_columns:
  - key: wonDeals
    label: Won Deals
    source: input
  - key: totalOpportunities
    label: Opportunities
    source: input
  - key: winRate
    label: Win Rate (%)
    source: output
  - key: wonRevenue
    label: Won Revenue
    source: output
  - key: winToLossRatio
    label: Win/Loss Ratio
    source: output

js_file: assets/js/calculators/win-rate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Sales Win Rate Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate sales win rate percentage, win-to-loss ratios, won revenue, and lost opportunity pipeline value."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates sales opportunity win rate percentage and loss rate percentage"
    - "Computes win-to-loss ratios for sales forecasting"
    - "Determines closed-won revenue vs total pipeline value analyzed"
    - "Analyzes pipeline deal velocity and sales rep execution efficiency"

breadcrumb:
  - name: Home
    url: /
  - name: SaaS Sales Funnel
    url: /saas-sales-funnel
  - name: Sales Win Rate Calculator

howto:
  name: "How to Calculate SaaS Sales Win Rate and Close Rates"
  description: "Compute sales pipeline win rates to optimize sales rep quotas and revenue forecasting."
  step:
    - name: "Define total sales opportunities"
      text: "Count all qualified opportunities that reached a decision stage (Closed Won + Closed Lost) within a period."
    - name: "Count closed won deals"
      text: "Sum all deals that successfully converted into paying customers."
    - name: "Calculate win rate percentage"
      text: "Divide won deals by total opportunities and multiply by 100."
    - name: "Analyze win-to-loss ratio"
      text: "Divide won deals by lost deals to evaluate sales execution efficiency."

faq:
  - question: "What is a good sales win rate for B2B SaaS?"
    answer: "The average B2B SaaS win rate ranges between 20% and 30% for qualified opportunities. High-performing enterprise sales teams achieve win rates between 30% and 40%."
  - question: "How is sales win rate calculated?"
    answer: "Sales Win Rate is calculated as (Closed-Won Opportunities / Total Qualified Opportunities) * 100. Total opportunities must include both won and lost deals."
  - question: "What is the difference between win rate and conversion rate?"
    answer: "Win rate measures deals closed-won out of qualified sales opportunities. Lead conversion rate measures top-of-funnel leads that convert into opportunities."
  - question: "Should disqualified leads be included in win rate calculations?"
    answer: "No. Unqualified leads or early-stage prospects should be excluded. Win rate should strictly measure qualified opportunities that entered the active sales pipeline."
  - question: "How does sales cycle length impact win rate?"
    answer: "Generally, shorter sales cycles yield higher win rates because deal momentum remains strong and prospect buying intent stays high."
  - question: "What is a win-to-loss ratio?"
    answer: "The win-to-loss ratio compares won deals directly to lost deals (Won Deals / Lost Deals). A 1:2 ratio means 1 win for every 2 losses (33.3% win rate)."
  - question: "How can sales teams improve their win rate?"
    answer: "Improving discovery qualification, enforcing strict ICP fit criteria, improving sales enablement collateral, and conducting loss reviews boost win rates."
---

# SaaS Sales Win Rate & Close Rate Calculator

Calculate sales win rate percentage, win-to-loss ratio, closed-won revenue, and lost opportunity pipeline value. All calculations execute 100% privately in your web browser.

<!-- more -->

## Why Use the Win Rate Calculator?

Sales win rate is a primary efficiency metric for B2B revenue teams. Overestimating win rates distorts sales forecasting, causes under-resourcing, and leads to missed ARR targets.

Tracking win rates across sales reps, market segments, and deal sizes identifies pipeline friction. This **Sales Win Rate Calculator** computes precise win percentages, loss rates, win-to-loss ratios, and total closed-won revenue.

---

## Mathematical Formulas & Mechanics

### 1. Win Rate Percentage ($WR$)
For closed-won deals $N_{	ext{won}}$ and total opportunities $N_{	ext{opp}}$ ($N_{	ext{opp}} = N_{	ext{won}} + N_{	ext{lost}}$):

$$WR = \left(rac{N_{	ext{won}}}{N_{	ext{opp}}}
ight) 	imes 100$$

### 2. Loss Rate Percentage ($LR$)
$$LR = 100 - WR = \left(rac{N_{	ext{lost}}}{N_{	ext{opp}}}
ight) 	imes 100$$

### 3. Win-to-Loss Ratio ($WLR$)
$$WLR = rac{N_{	ext{won}}}{N_{	ext{lost}}}$$

### 4. Won Revenue & Pipeline Value ($R_{	ext{won}}, V_{	ext{pipe}}$)
For average annual contract value $ACV$:

$$R_{	ext{won}} = N_{	ext{won}} 	imes ACV$$

$$V_{	ext{pipe}} = N_{	ext{opp}} 	imes ACV$$

---

## Real-World Comparison & Benchmark Table

| SaaS Segment | Average ACV ($) | Benchmark Win Rate (%) | Win-to-Loss Ratio | Average Sales Cycle (Days) |
| :--- | :--- | :--- | :--- | :--- |
| **Self-Serve / PLG** | $1,200 - $3,600 | 5% - 15% | 0.05 : 1 | 1 - 7 Days |
| **SMB SaaS** | $5,000 - $15,000 | 25% - 35% | 0.33 : 1 | 14 - 30 Days |
| **Mid-Market SaaS** | $25,000 - $75,000 | 20% - 30% | 0.28 : 1 | 30 - 90 Days |
| **Enterprise SaaS** | $100,000+ | 15% - 25% | 0.22 : 1 | 90 - 180+ Days |

---

## Step-by-Step How-To Guide

1. **Input Closed-Won Deals:** Enter total deals won within your target period (quarter or year).
2. **Input Total Opportunities:** Enter total qualified opportunities closed (Won + Lost).
3. **Specify Average Deal Size (ACV):** Enter average annual contract value in dollars.
4. **Analyze Win Rate & WLR:** Review your calculated win rate percentage and win-to-loss ratio.
5. **Adjust Pipeline Requirements:** Use your win rate to calculate how many new opportunities are required to hit future revenue targets.

---

## Frequently Asked Questions

### What is a good sales win rate for B2B SaaS?
The average B2B SaaS win rate ranges between 20% and 30% for qualified opportunities. High-performing enterprise sales teams achieve win rates between 30% and 40%.

### How is sales win rate calculated?
Sales Win Rate is calculated as (Closed-Won Opportunities / Total Qualified Opportunities) * 100. Total opportunities must include both won and lost deals.

### What is the difference between win rate and conversion rate?
Win rate measures deals closed-won out of qualified sales opportunities. Lead conversion rate measures top-of-funnel leads that convert into opportunities.

### Should disqualified leads be included in win rate calculations?
No. Unqualified leads or early-stage prospects should be excluded. Win rate should strictly measure qualified opportunities that entered the active sales pipeline.

### How does sales cycle length impact win rate?
Generally, shorter sales cycles yield higher win rates because deal momentum remains strong and prospect buying intent stays high.

### What is a win-to-loss ratio?
The win-to-loss ratio compares won deals directly to lost deals (Won Deals / Lost Deals). A 1:2 ratio means 1 win for every 2 losses (33.3% win rate).

### How can sales teams improve their win rate?
Improving discovery qualification, enforcing strict ICP fit criteria, improving sales enablement collateral, and conducting loss reviews boost win rates.
