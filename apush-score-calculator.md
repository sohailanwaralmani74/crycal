---
layout: tool
title: "APUSH Score Calculator | AP US History Score Estimator"
description: "Estimate your AP US History (APUSH) exam score (1–5) based on multiple-choice, SAQ, DBQ, and LEQ section points and official College Board scoring curves."
permalink: /apush-score-calculator
tool_id: apush-score-calculator
category: ap-scores
hide_sidebar: true

inputs:
  - id: mcq
    label: "Multiple Choice Correct (out of 55)"
    type: number
    default: 40
    min: 0
    max: 55
    step: 1
    placeholder: "e.g., 40"
  - id: saq
    label: "Short Answer Questions (out of 9)"
    type: number
    default: 6
    min: 0
    max: 9
    step: 1
    placeholder: "e.g., 6"
  - id: dbq
    label: "DBQ Essay Points (out of 7)"
    type: number
    default: 5
    min: 0
    max: 7
    step: 1
    placeholder: "e.g., 5"
  - id: leq
    label: "Long Essay Points (out of 6)"
    type: number
    default: 4
    min: 0
    max: 6
    step: 1
    placeholder: "e.g., 4"

outputs:
  - id: estimatedScore
    label: "Estimated AP Score (1 - 5)"
  - id: compositeScore
    label: "Total Composite Points (out of 100)"
  - id: scoreStatus
    label: "College Board Credit Qualification"

charts:
  tabs:
    - id: scoreDistribution
      label: Score Curve & Grade Cutoffs

history_columns:
  - key: mcq
    label: "MCQ Correct"
    source: input
  - key: compositeScore
    label: "Composite Score"
    source: output
  - key: estimatedScore
    label: "AP Grade (1-5)"
    source: output

js_file: assets/js/calculators/apush-score-calculator.js

breadcrumb:
  - name: Home
    url: /
  - name: Education
    url: /education
  - name: "APUSH Score Calculator"

howto:
  name: "How to Calculate Your AP US History AP Score"
  description: "Use your section scores to estimate your official 1-5 AP score for AP US History."
  step:
    - name: "Input Multiple Choice Correct"
      text: "Enter the number of correct answers on Section 1 multiple-choice questions."
    - name: "Input Free Response Points"
      text: "Enter your earned points on Section 2 free-response questions / essays."
    - name: "Evaluate Estimated AP Grade"
      text: "Review your composite score and corresponding 1-5 College Board grade prediction."
    - name: "Inspect Curve Cutoffs"
      text: "Check the score curve visual breakdown to see how close you are to the next grade boundary."

faq:
  - question: "How is the AP US History AP score calculated?"
    answer: "The AP US History AP score combines your weighted Section 1 (Multiple-Choice) and Section 2 (Free-Response) points into a composite score out of 100. This composite score is mapped to a 1–5 AP grade based on College Board scoring curves."
  - question: "What AP score is required for college credit?"
    answer: "Most colleges and universities award college credit or advanced placement for AP scores of 3, 4, or 5. Highly selective institutions may require a 4 or 5."
  - question: "Is there a penalty for wrong answers on AP exams?"
    answer: "No! AP exams do not penalize for incorrect multiple-choice answers. Your score is based solely on the number of questions answered correctly, so you should answer every question."
---

# APUSH Score Calculator | AP US History Score Estimator

Estimate your AP US History (APUSH) exam score (1–5) based on multiple-choice, SAQ, DBQ, and LEQ section points and official College Board scoring curves. Calculate your composite score and see if you are on track for a 3, 4, or 5 — 100% free and private in your browser.

<!-- more -->

## How AP US History Exam Scoring Works

The **AP US History** exam consists of multiple sections that are weighted to produce a composite score out of **100**. College Board converts this composite score into a scaled AP score from **1 to 5**:

- **5 (Extremely Well Qualified)**: Composite score of 71+
- **4 (Well Qualified)**: Composite score of 59 – 70
- **3 (Qualified)**: Composite score of 47 – 58
- **2 (Possibly Qualified)**: Composite score of 36 – 46
- **1 (No Recommendation)**: Composite score of 0 – 35

## Section Weighting Breakdown

| Section | Format | Max Raw Points | Weight % | Max Composite Points |
|---|---|---|---|---|
| Section I, Part A | Multiple Choice (MCQ) | 55 | 40% | 40 |
| Section I, Part B | Short Answer (SAQ) | 9 | 20% | 20 |
| Section II, Part A | Document-Based Question (DBQ) | 7 | 25% | 25 |
| Section II, Part B | Long Essay Question (LEQ) | 6 | 15% | 15 |

## Step-by-Step Score Calculation Guide

1. **Enter Multiple-Choice Correct Count:** Input the total number of correct answers on Section 1.
2. **Enter Free-Response Points:** Input your earned points on Section 2 free-response questions/essays.
3. **Evaluate Estimated AP Grade:** Review your composite score and 1–5 AP grade prediction.
4. **Inspect Curve Cutoffs:** View the visual chart tab to see how close you are to the next grade cutoff boundary.

---

## Frequently Asked Questions

### How is the AP US History AP score calculated?
The AP US History AP exam score combines your weighted Multiple-Choice and Free-Response section points into a total composite score out of 100, which maps to a 1–5 AP grade based on College Board scoring curves.

### What AP score do I need for college credit?
A score of **3 or higher** is passing and earns college credit at most institutions. Top tier universities often require a **4 or 5**.

### Are incorrect multiple-choice answers penalized?
No. There is no guessing penalty on AP exams. Unanswered questions and incorrect answers count the same (0 points), so always make an educated guess!
