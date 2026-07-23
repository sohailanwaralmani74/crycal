---
layout: tool
title: Churn by Cohort Calculator
description: Calculate the churn rate for a specific cohort of users over a time period.
category: saas-churn-retention
inputs:
  - id: starting_users
    label: Users at Start of Period (Cohort Size)
    type: number
    default: 500
  - id: active_users
    label: Active Users at End of Period
    type: number
    default: 400
outputs:
  - id: churned_users
    label: Churned Users
  - id: cohort_churn_rate
    label: Cohort Churn Rate (%)
  - id: retention_rate
    label: Cohort Retention Rate (%)
charts: true
history_columns: ["Start Users", "End Users", "Churned", "Churn Rate %", "Retention %"]
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: Churn by Cohort Calculator
  applicationCategory: BusinessApplication
  operatingSystem: All
  description: Calculate the churn rate for a specific cohort of users over a time period.
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
faq:
  - question: What is cohort churn?
    answer: Cohort churn looks at the churn rate of a specific group of users who signed up around the same time.
  - question: Why is cohort analysis important?
    answer: It helps you understand if newer cohorts are churning faster or slower than older ones, indicating if product changes are improving retention.
  - question: What is a cohort?
    answer: A group of users who share a common characteristic, usually their sign-up date.
  - question: How to improve cohort retention?
    answer: Improve the onboarding experience for new cohorts and address early drop-off points.
  - question: What is a good cohort retention rate?
    answer: It varies, but consistently improving retention rates for newer cohorts is the goal.
  - question: Should I track monthly or weekly cohorts?
    answer: It depends on your product cycle. B2C often tracks weekly or daily, while B2B SaaS tracks monthly or quarterly.
---

Calculate the churn rate for a specific cohort of users over a time period.

<!-- more -->

## Why Use This Calculator?

Cohort analysis is the most accurate way to understand user retention. Instead of mixing new and old users, it tracks a specific group over time, revealing true retention patterns and the impact of product updates.

## Formulas

$$ \text{Churned Users} = \text{Starting Users} - \text{Active Users} $$
$$ \text{Cohort Churn Rate} = \left( \frac{\text{Churned Users}}{\text{Starting Users}} \right) \times 100 $$
$$ \text{Retention Rate} = 100 - \text{Cohort Churn Rate} $$

## Real-World Comparison Table

| Metric | Calculation | Meaning |
|---|---|---|
| Churn Rate | (Churned / Starting) * 100 | Percentage of users lost |
| Retention Rate | (Active / Starting) * 100 | Percentage of users kept |

## Step-by-Step Guide

1. Enter the number of users who started in the cohort.
2. Enter the number of those users who are still active at the end of the period.
3. Click "Calculate" to see the cohort churn and retention rates.
4. Review the charts to see the breakdown.

## FAQs

**What is cohort churn?**
Cohort churn looks at the churn rate of a specific group of users who signed up around the same time.

**Why is cohort analysis important?**
It helps you understand if newer cohorts are churning faster or slower than older ones, indicating if product changes are improving retention.

**What is a cohort?**
A group of users who share a common characteristic, usually their sign-up date.

**How to improve cohort retention?**
Improve the onboarding experience for new cohorts and address early drop-off points.

**What is a good cohort retention rate?**
It varies, but consistently improving retention rates for newer cohorts is the goal.

**Should I track monthly or weekly cohorts?**
It depends on your product cycle. B2C often tracks weekly or daily, while B2B SaaS tracks monthly or quarterly.
