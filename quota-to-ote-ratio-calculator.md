---
layout: tool
title: Quota to OTE Ratio Calculator
description: Calculate your Quota to On-Target Earnings (OTE) Ratio to evaluate sales compensation plans.
category: saas-sales-funnel
inputs:
  - id: annual_quota
    label: Annual Quota ($)
    type: number
    default: 1000000
  - id: annual_ote
    label: Annual OTE ($)
    type: number
    default: 200000
outputs:
  - id: quota_ote_ratio
    label: Quota to OTE Ratio
  - id: commission_rate
    label: Implied Commission Rate (%)
charts:
  - id: ratioChart
    tabs:
      - id: breakdown
        label: Breakdown
      - id: comparison
        label: Comparison
history_columns:
  - label: Quota
    key: annual_quota
  - label: OTE
    key: annual_ote
  - label: Ratio
    key: quota_ote_ratio
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "name": "Quota to OTE Ratio Calculator"
  "applicationCategory": "BusinessApplication"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "USD"
faq:
  - question: What is a good Quota to OTE ratio?
    answer: A standard SaaS rule of thumb is a 5:1 ratio (e.g., $1M quota on $200k OTE).
  - question: Why does the ratio matter?
    answer: It ensures the business is profitable while providing realistic earning potential.
  - question: Can it be 3:1?
    answer: Yes, often in early-stage startups or highly technical sales.
  - question: What is implied commission?
    answer: The base commission rate needed to reach OTE.
  - question: How to improve the ratio?
    answer: Increase deal sizes, improve close rates, or adjust base salary.
  - question: Does OTE include base?
    answer: Yes, OTE is base salary plus expected variable commission.
---

# Quota to OTE Ratio Calculator

<!-- more -->

## Why Use This Calculator?
Understanding your Quota to OTE ratio is critical for designing fair, motivating, and profitable sales compensation plans.

## Formulas
The ratio is calculated as:
$$ \text{Ratio} = \frac{\text{Annual Quota}}{\text{Annual OTE}} $$
$$ \text{Commission Rate} = \frac{\text{Variable Comp}}{\text{Annual Quota}} $$

## Comparison Table
| Metric | Startup | Enterprise SaaS |
|---|---|---|
| Ratio | 3:1 to 4:1 | 5:1 to 6:1 |

## Step-by-Step Guide
1. Enter your Annual Quota.
2. Enter your Annual OTE.
3. Review the Ratio and Implied Commission Rate.

## FAQs

### What is a good Quota to OTE ratio?
A standard SaaS rule of thumb is a 5:1 ratio (e.g., $1M quota on $200k OTE).

### Why does the ratio matter?
It ensures the business is profitable while providing realistic earning potential.

### Can it be 3:1?
Yes, often in early-stage startups or highly technical sales.

### What is implied commission?
The base commission rate needed to reach OTE.

### How to improve the ratio?
Increase deal sizes, improve close rates, or adjust base salary.

### Does OTE include base?
Yes, OTE is base salary plus expected variable commission.
