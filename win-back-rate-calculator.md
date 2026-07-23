---
layout: tool
title: Win-Back Rate Calculator
description: Calculate the percentage of churned customers that you successfully reactivate.
category: saas-churn-retention
inputs:
  - id: total_churned_pool
    label: Total Churned Customers (Target Pool)
    type: number
    default: 500
  - id: reactivated_customers
    label: Reactivated Customers
    type: number
    default: 25
outputs:
  - id: win_back_rate
    label: Win-Back Rate (%)
  - id: unrecovered_customers
    label: Unrecovered Customers
charts: true
history_columns: ["Churned Pool", "Reactivated", "Win-Back Rate %", "Unrecovered"]
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: Win-Back Rate Calculator
  applicationCategory: BusinessApplication
  operatingSystem: All
  description: Calculate the percentage of churned customers that you successfully reactivate.
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
faq:
  - question: What is a win-back rate?
    answer: It is the percentage of previously churned customers who return and become active paying customers again.
  - question: Why focus on win-backs?
    answer: Winning back an old customer is often cheaper than acquiring a completely new one.
  - question: What is a good win-back rate?
    answer: Average win-back rates hover around 1-5% depending on the strategy and industry.
  - question: How do I improve win-back rates?
    answer: Send targeted emails based on the reason they churned, and offer discounts or highlight new product features.
  - question: When should I try to win them back?
    answer: Usually 30, 90, or 180 days after they churn, giving them enough time to miss the product or experience pain without it.
  - question: Should I try to win back all churned customers?
    answer: No, skip bad fit customers or those who churned because they went out of business.
---

Calculate the percentage of churned customers that you successfully reactivate.

<!-- more -->

## Why Use This Calculator?

A churned customer isn't necessarily gone forever. Tracking your win-back rate helps evaluate the effectiveness of your reactivation campaigns. Often, returning customers have a higher lifetime value than first-time users.

## Formulas

$$ \text{Win-Back Rate} = \left( \frac{\text{Reactivated Customers}}{\text{Total Churned Pool}} \right) \times 100 $$
$$ \text{Unrecovered Customers} = \text{Total Churned Pool} - \text{Reactivated Customers} $$

## Real-World Comparison Table

| Campaign Timing | Typical Success | Offer Type |
|---|---|---|
| Immediate (Day 1) | High (if accidental) | Payment update |
| 30 Days | Moderate | Discount / Win-back offer |
| 6 Months+ | Low | Major feature release |

## Step-by-Step Guide

1. Enter the total number of churned customers you targeted in your win-back campaign.
2. Enter the number of customers from that pool who reactivated.
3. Calculate your win-back rate.
4. Adjust your strategy based on the results.

## FAQs

**What is a win-back rate?**
It is the percentage of previously churned customers who return and become active paying customers again.

**Why focus on win-backs?**
Winning back an old customer is often cheaper than acquiring a completely new one.

**What is a good win-back rate?**
Average win-back rates hover around 1-5% depending on the strategy and industry.

**How do I improve win-back rates?**
Send targeted emails based on the reason they churned, and offer discounts or highlight new product features.

**When should I try to win them back?**
Usually 30, 90, or 180 days after they churn, giving them enough time to miss the product or experience pain without it.

**Should I try to win back all churned customers?**
No, skip bad fit customers or those who churned because they went out of business.
