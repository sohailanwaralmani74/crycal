---
layout: tool
title: Seat-Based Churn Calculator
description: Calculate churn based on the number of seats or licenses rather than accounts.
category: saas-churn-retention
inputs:
  - id: start_seats
    label: Seats at Start of Period
    type: number
    default: 1000
  - id: added_seats
    label: Seats Added
    type: number
    default: 150
  - id: end_seats
    label: Seats at End of Period
    type: number
    default: 1050
outputs:
  - id: churned_seats
    label: Churned Seats
  - id: seat_churn_rate
    label: Seat Churn Rate (%)
  - id: net_seat_growth
    label: Net Seat Growth
charts: true
history_columns: ["Start Seats", "Added Seats", "End Seats", "Churned Seats", "Seat Churn %"]
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: Seat-Based Churn Calculator
  applicationCategory: BusinessApplication
  operatingSystem: All
  description: Calculate churn based on the number of seats or licenses rather than accounts.
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
faq:
  - question: What is seat-based churn?
    answer: Seat-based churn measures the loss of individual licenses or user seats within active or canceled accounts.
  - question: Why use seat-based churn instead of account churn?
    answer: For per-seat pricing models, losing seats impacts revenue even if the account doesn't churn completely.
  - question: Can seat churn happen without account churn?
    answer: Yes, this is known as contraction. An account might reduce its seats from 50 to 40, resulting in 10 churned seats.
  - question: What is net seat growth?
    answer: It's the difference between seats added and seats churned.
  - question: How to reduce seat churn?
    answer: Ensure all users are engaged and finding value. Identify inactive seats before the customer realizes they are paying for unused licenses.
  - question: Is this the same as revenue churn?
    answer: Close, but not exactly. It represents the underlying volume of licenses that drives revenue.
---

Calculate churn based on the number of seats or licenses rather than accounts.

<!-- more -->

## Why Use This Calculator?

In per-seat pricing SaaS models, account-level churn doesn't tell the whole story. A large enterprise might downsize their team, causing massive contraction without the account churning. Tracking seat churn gives you a precise look at usage and revenue impact.

## Formulas

$$ \text{Churned Seats} = (\text{Start Seats} + \text{Added Seats}) - \text{End Seats} $$
$$ \text{Seat Churn Rate} = \left( \frac{\text{Churned Seats}}{\text{Start Seats}} \right) \times 100 $$
$$ \text{Net Seat Growth} = \text{Added Seats} - \text{Churned Seats} $$

## Real-World Comparison Table

| Metric | Focus | Application |
|---|---|---|
| Account Churn | Number of logos lost | Flat-rate SaaS |
| Seat Churn | Number of licenses lost | Per-seat SaaS |

## Step-by-Step Guide

1. Enter the total number of seats at the beginning of the period.
2. Enter any new seats added (expansion + new sales) during the period.
3. Enter the total number of seats at the end.
4. Calculate to find out how many seats were churned.

## FAQs

**What is seat-based churn?**
Seat-based churn measures the loss of individual licenses or user seats within active or canceled accounts.

**Why use seat-based churn instead of account churn?**
For per-seat pricing models, losing seats impacts revenue even if the account doesn't churn completely.

**Can seat churn happen without account churn?**
Yes, this is known as contraction. An account might reduce its seats from 50 to 40, resulting in 10 churned seats.

**What is net seat growth?**
It's the difference between seats added and seats churned.

**How to reduce seat churn?**
Ensure all users are engaged and finding value. Identify inactive seats before the customer realizes they are paying for unused licenses.

**Is this the same as revenue churn?**
Close, but not exactly. It represents the underlying volume of licenses that drives revenue.
