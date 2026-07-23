---
layout: tool
title: Channel Partner Sales Split Calculator
description: Calculate revenue splits and margins for channel partner sales.
category: saas-sales-funnel
inputs:
  - id: total_deal_size
    label: Total Deal Size ($)
    type: number
    default: 50000
  - id: partner_margin
    label: Partner Margin (%)
    type: number
    default: 20
  - id: internal_cost
    label: Internal Cost of Sales ($)
    type: number
    default: 5000
outputs:
  - id: partner_payout
    label: Partner Payout
  - id: net_revenue
    label: Net Revenue to Vendor
charts:
  - id: splitChart
    tabs:
      - id: breakdown
        label: Breakdown
      - id: comparison
        label: Comparison
history_columns:
  - label: Deal Size
    key: total_deal_size
  - label: Partner Margin
    key: partner_margin
  - label: Net Rev
    key: net_revenue
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "name": "Channel Partner Sales Split Calculator"
  "applicationCategory": "BusinessApplication"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "USD"
faq:
  - question: What is a channel partner split?
    answer: The percentage of the deal size paid to a third-party reseller or referral partner.
  - question: What is a typical partner margin?
    answer: It ranges from 10% for referrals to 30%+ for full-service resellers.
  - question: How does this affect internal sales costs?
    answer: Partner sales should theoretically have lower internal sales costs.
  - question: Is partner margin paid on gross or net?
    answer: Usually on gross ARR, but depends on the partner agreement.
  - question: Why use channel partners?
    answer: To reach new markets and scale sales without hiring more direct reps.
  - question: What is net revenue?
    answer: The amount the vendor keeps after paying the partner and internal costs.
---

# Channel Partner Sales Split Calculator

<!-- more -->

## Why Use This Calculator?
To evaluate the profitability of channel partnerships versus direct sales.

## Formulas
$$ \text{Partner Payout} = \text{Total Deal Size} \times (\text{Partner Margin} / 100) $$
$$ \text{Net Revenue} = \text{Total Deal Size} - \text{Partner Payout} - \text{Internal Cost} $$

## Comparison Table
| Type | Margin Range | Rep Cost |
|---|---|---|
| Referral | 10-15% | High |
| Reseller | 20-30% | Low |

## Step-by-Step Guide
1. Enter the total deal size.
2. Enter the partner margin percentage.
3. Enter your internal sales costs.
4. Review the net revenue to your business.

## FAQs

### What is a channel partner split?
The percentage of the deal size paid to a third-party reseller or referral partner.

### What is a typical partner margin?
It ranges from 10% for referrals to 30%+ for full-service resellers.

### How does this affect internal sales costs?
Partner sales should theoretically have lower internal sales costs.

### Is partner margin paid on gross or net?
Usually on gross ARR, but depends on the partner agreement.

### Why use channel partners?
To reach new markets and scale sales without hiring more direct reps.

### What is net revenue?
The amount the vendor keeps after paying the partner and internal costs.
