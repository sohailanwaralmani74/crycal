---
layout: tool
title: Sales Cycle Cost Calculator
description: Calculate the total cost of your sales cycle based on AE and SDR compensation.
category: saas-sales-funnel
inputs:
  - id: cycle_length
    label: Sales Cycle Length (Days)
    type: number
    default: 90
  - id: ae_cost
    label: AE Daily Cost ($)
    type: number
    default: 500
  - id: sdr_cost
    label: SDR Daily Cost ($)
    type: number
    default: 200
outputs:
  - id: total_cost
    label: Total Sales Cycle Cost
  - id: monthly_run_rate
    label: Monthly Run Rate
charts:
  - id: costChart
    tabs:
      - id: breakdown
        label: Breakdown
      - id: comparison
        label: Comparison
history_columns:
  - label: Length
    key: cycle_length
  - label: AE Cost
    key: ae_cost
  - label: Total
    key: total_cost
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "name": "Sales Cycle Cost Calculator"
  "applicationCategory": "BusinessApplication"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "USD"
faq:
  - question: What is a sales cycle?
    answer: The time it takes from initial contact to a closed-won deal.
  - question: Why measure the cost?
    answer: To ensure your Customer Acquisition Cost (CAC) is sustainable.
  - question: How to calculate daily AE cost?
    answer: Divide the AE's annual OTE by working days (approx 260).
  - question: Does this include marketing costs?
    answer: No, this specifically measures sales personnel costs over the cycle duration.
  - question: How to reduce sales cycle cost?
    answer: Shorten the sales cycle or improve closing rates.
  - question: Should management costs be included?
    answer: They can be, depending on how granular you want your CAC model to be.
---

# Sales Cycle Cost Calculator

<!-- more -->

## Why Use This Calculator?
It helps determine how much you are spending on sales resources to close a single deal over a given timeframe.

## Formulas
$$ \text{Total Cost} = \text{Cycle Length} \times (\text{AE Daily Cost} + \text{SDR Daily Cost}) $$

## Comparison Table
| Metric | SMB | Enterprise |
|---|---|---|
| Cycle Length | 30 Days | 120-180 Days |

## Step-by-Step Guide
1. Enter your average sales cycle length in days.
2. Enter your AE's daily cost.
3. Enter your SDR's daily cost.
4. Review the Total Sales Cycle Cost.

## FAQs

### What is a sales cycle?
The time it takes from initial contact to a closed-won deal.

### Why measure the cost?
To ensure your Customer Acquisition Cost (CAC) is sustainable.

### How to calculate daily AE cost?
Divide the AE's annual OTE by working days (approx 260).

### Does this include marketing costs?
No, this specifically measures sales personnel costs over the cycle duration.

### How to reduce sales cycle cost?
Shorten the sales cycle or improve closing rates.

### Should management costs be included?
They can be, depending on how granular you want your CAC model to be.
