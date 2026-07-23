---
layout: tool
title: Demo to Close Conversion Calculator
description: Calculate your conversion rate from demos booked to closed-won deals.
category: saas-sales-funnel
inputs:
  - id: demos_held
    label: Demos Held
    type: number
    default: 100
  - id: deals_closed
    label: Deals Closed
    type: number
    default: 20
  - id: avg_deal_size
    label: Average Deal Size ($)
    type: number
    default: 10000
outputs:
  - id: conversion_rate
    label: Demo to Close Rate (%)
  - id: pipeline_value
    label: Generated Revenue
charts:
  - id: convChart
    tabs:
      - id: breakdown
        label: Breakdown
      - id: comparison
        label: Comparison
history_columns:
  - label: Demos
    key: demos_held
  - label: Closed
    key: deals_closed
  - label: Rate
    key: conversion_rate
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "name": "Demo to Close Conversion Calculator"
  "applicationCategory": "BusinessApplication"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "USD"
faq:
  - question: What is a good demo-to-close rate?
    answer: Typically 20% to 30% for B2B SaaS.
  - question: How to improve this rate?
    answer: Better qualification before the demo, and improved demo execution.
  - question: Does this include no-shows?
    answer: No, you should only count demos that were actually held.
  - question: Why measure this specific metric?
    answer: It's the most critical conversion point for Account Executives.
  - question: Should discovery calls be counted?
    answer: If your process combines discovery and demo, yes. Otherwise, track separately.
  - question: How does deal size affect this?
    answer: Larger deals typically have lower demo-to-close rates due to complexity.
---

# Demo to Close Conversion Calculator

<!-- more -->

## Why Use This Calculator?
To evaluate the effectiveness of your Account Executives and the quality of pipeline generated.

## Formulas
$$ \text{Conversion Rate} = (\text{Deals Closed} / \text{Demos Held}) \times 100 $$

## Comparison Table
| Segment | Good Rate | Excellent Rate |
|---|---|---|
| SMB | 25% | 35%+ |
| Enterprise | 15% | 25%+ |

## Step-by-Step Guide
1. Enter the number of demos held in a period.
2. Enter the number of deals closed from those demos.
3. Review the Conversion Rate and Revenue.

## FAQs

### What is a good demo-to-close rate?
Typically 20% to 30% for B2B SaaS.

### How to improve this rate?
Better qualification before the demo, and improved demo execution.

### Does this include no-shows?
No, you should only count demos that were actually held.

### Why measure this specific metric?
It's the most critical conversion point for Account Executives.

### Should discovery calls be counted?
If your process combines discovery and demo, yes. Otherwise, track separately.

### How does deal size affect this?
Larger deals typically have lower demo-to-close rates due to complexity.
