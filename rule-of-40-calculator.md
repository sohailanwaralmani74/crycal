---
layout: "tool"
title: "Rule of 40 Calculator"
description: "Calculate combined YoY revenue growth % + FCF margin % benchmark score for SaaS companies."
permalink: "/rule-of-40-calculator"
tool_id: "rule-of-40-calculator"
category: "saas-unit-economics"
hide_sidebar: true
inputs:
  - id: "arrGrowthRate"
    label: "YoY ARR / Revenue Growth Rate (%)"
    type: "number"
    default: 35
    step: 1
    suffix: "%"
    placeholder: "e.g., 35"
  - id: "fcfMargin"
    label: "Free Cash Flow (FCF) Margin (%)"
    type: "number"
    default: 10
    step: 1
    suffix: "%"
    placeholder: "e.g., 10"
outputs:
  - id: "ruleOf40Score"
    label: "Rule of 40 Score (%)"
  - id: "growthContribution"
    label: "Revenue Growth Contribution"
  - id: "marginContribution"
    label: "Profitability Contribution"
  - id: "status"
    label: "Performance Benchmark Rating"
  - id: "recommendation"
    label: "Strategic Growth-Profit Tradeoff"
charts:
  tabs:
    - id: "scoreBreakdown"
      label: "Score Contribution"
    - id: "benchmarkComparison"
      label: "Benchmark Comparison"
history_columns:
  - key: "arrGrowthRate"
    label: "Growth (%)"
    source: "input"
  - key: "fcfMargin"
    label: "FCF Margin (%)"
    source: "input"
  - key: "ruleOf40Score"
    label: "Score (%)"
    source: "output"
  - key: "status"
    label: "Status"
    source: "output"
js_file: "assets/js/calculators/rule-of-40-calculator.js"
structured_data:
  "@context" : "https://schema.org"
  "@type" : "SoftwareApplication"
  name: "Rule of 40 Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate combined YoY revenue growth % + FCF margin % benchmark score for SaaS companies."
  offers:
    "@type" : "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Rule of 40 Calculator calculation engine"
    - "Interactive Chart.js visual breakdown"
    - "100% private in-browser client execution"
    - "Calculation history logging"
breadcrumb:
  - name: "Home"
    url: "/"
  - name: "SaaS Unit Economics"
    url: "/saas-unit-economics"
  - name: "Rule of 40 Calculator"
howto:
  name: "How to Use the Rule of 40 Calculator"
  description: "Follow these simple steps to calculate Rule of 40 Calculator metrics."
  step:
    - name: "Enter Core Operational Inputs"
      text: "Input your current monthly financial and subscriber metrics into the interactive form."
    - name: "Configure Cost & Volume Tiers"
      text: "Adjust software, team salaries, channel CAC, or plan pricing parameters."
    - name: "Evaluate Benchmark Ratings"
      text: "Review your output scores against SaaS industry standards."
    - name: "Inspect Interactive Charts"
      text: "Switch visual chart tabs to analyze detailed breakdowns and curves."
faq:
  - q: "What is the Rule of 40 in SaaS?"
    a: "The Rule of 40 states that a healthy SaaS company's combined annual revenue growth rate percentage and profit margin percentage should equal or exceed 40%."
  - q: "What profit metric should be used in the Rule of 40?"
    a: "Free Cash Flow (FCF) margin is preferred by venture capital investors, though EBITDA margin is frequently used for mature public SaaS companies."
  - q: "Can a company satisfy the Rule of 40 while burning cash?"
    a: "Yes. A startup growing at 60% YoY with a -15% FCF margin scores 45%, successfully satisfying the Rule of 40."
  - q: "Why is the Rule of 40 crucial for valuation multiples?"
    a: "SaaS companies exceeding the 40% benchmark command significantly higher revenue valuation multiples (e.g. 10x-20x ARR) in fundraising and public markets."
  - q: "At what scale does the Rule of 40 become relevant?"
    a: "It becomes meaningful once a SaaS company reaches $1M+ in ARR, where unit economics stabilize."
  - q: "How can low-scoring companies reach 40%?"
    a: "Companies can increase price/ARPU to boost ARR growth or trim non-essential sales & marketing spend to increase cash margins."
  - q: "Is my corporate data stored?"
    a: "No. All calculations run strictly inside your browser."
---

# Rule of 40 Calculator

Calculate combined YoY revenue growth % + FCF margin % benchmark score for SaaS companies. Use our free **Rule of 40 Calculator** to evaluate your SaaS business performance and make data-driven growth decisions — without any data leaving your browser.

<!-- more -->

## Why Use the Rule of 40 Calculator?

The Rule of 40 is the premier venture capital benchmark for software companies. It balances hyper-growth against profitability, demonstrating that a company can either grow rapidly with moderate burn or grow moderately with strong cash flow.

Having accurate, real-time insights into this metric helps SaaS founders, CFOs, and growth teams optimize capital allocation, protect operating runway, and achieve top-tier venture scalability.

## Mathematical Formula & Derivation

The mathematical derivation for this financial metric is expressed as:

$$\text{Rule of 40 Score} = \text{YoY Revenue Growth Rate \%} + \text{Free Cash Flow Margin \%}$$

Where all input values are evaluated over a standardized monthly or annual accounting period.

## Real-World SaaS Benchmark Comparison

| Score Range | Venture Performance Tier | Valuation Premium |
| --- | --- | --- |
| >= 40% | Outperformer / Elite Tier | Premium Valuation Multiples (10x-15x+ ARR) |
| 30% - 39% | Healthy Growth Engine | Standard Market Valuation Multiples (6x-10x ARR) |
| 15% - 29% | Underperforming | Discounted Valuation Multiples (4x-6x ARR) |
| < 15% | Struggling SaaS | Distressed Valuation Multiples (< 3x ARR) |

## Step-by-Step Calculation Guide

1. **Enter Core Financial Inputs:** Supply your monthly sales spend, user counts, ARPU, or recurring revenue figures.
2. **Review Intermediate Outputs:** Examine calculated gross profit, churn, payback, or unit contribution scores.
3. **Assess Benchmark Ratings:** Compare your results against SaaS industry standards to identify growth bottlenecks.
4. **Analyze Visual Charts:** Use the visual chart tabs below to inspect metric breakdowns over time.

---

## Frequently Asked Questions

### What is the Rule of 40 in SaaS?
The Rule of 40 states that a healthy SaaS company's combined annual revenue growth rate percentage and profit margin percentage should equal or exceed 40%.

### What profit metric should be used in the Rule of 40?
Free Cash Flow (FCF) margin is preferred by venture capital investors, though EBITDA margin is frequently used for mature public SaaS companies.

### Can a company satisfy the Rule of 40 while burning cash?
Yes. A startup growing at 60% YoY with a -15% FCF margin scores 45%, successfully satisfying the Rule of 40.

### Why is the Rule of 40 crucial for valuation multiples?
SaaS companies exceeding the 40% benchmark command significantly higher revenue valuation multiples (e.g. 10x-20x ARR) in fundraising and public markets.

### At what scale does the Rule of 40 become relevant?
It becomes meaningful once a SaaS company reaches $1M+ in ARR, where unit economics stabilize.

### How can low-scoring companies reach 40%?
Companies can increase price/ARPU to boost ARR growth or trim non-essential sales & marketing spend to increase cash margins.

### Is my corporate data stored?
No. All calculations run strictly inside your browser.
