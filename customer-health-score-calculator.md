---
layout: tool
title: Customer Health Score Calculator
category: saas-churn-retention
inputs:
  - id: product_usage
    label: Product Usage Score (0-100)
  - id: support_tickets
    label: Support Tickets Score (0-100)
  - id: customer_feedback
    label: Customer Feedback Score (0-100)
outputs:
  - id: health_score
    label: Health Score
charts: true
history_columns:
  - Product Usage
  - Support Tickets
  - Feedback
  - Health Score
structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "name": "Customer Health Score Calculator"
faqs:
  - question: What is Customer Health Score?
    answer: It's a metric to evaluate how healthy a customer relationship is.
  - question: How to calculate?
    answer: Weighted average of various metrics.
  - question: Why is it important?
    answer: Helps prevent churn.
  - question: What is a good score?
    answer: Generally 80+ out of 100.
  - question: How often to update?
    answer: Daily or weekly.
  - question: What tools track this?
    answer: Customer Success software.
  - question: Can it improve retention?
    answer: Yes, by predicting churn.
---
Calculates customer health score.
<!-- more -->
### Why Use
To predict churn.

### Formula
$$Health = (Usage + Support + Feedback) / 3$$

### Comparison
| Usage | Score |
|---|---|
| High | 90 |

### How-To Guide
1. Enter usage score
2. Enter support score
3. Enter feedback score

### FAQs
1. What is it? A metric.
2. How to use? Enter values.
3. Why use? For retention.
4. Good score? > 80.
5. Frequency? Regular.
6. Automation? Yes.
7. Churn? Lowers it.
