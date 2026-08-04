---
layout: tool
title: "AP Human Geography Score Calculator | Estimate AP Grade"
description: "Project your AP Human Geography exam score (1–5) using MCQ correct answers and 3 FRQ question points."
permalink: /ap-human-geography-score-calculator
tool_id: ap-human-geography-score-calculator
category: ap-scores
hide_sidebar: true

inputs:
  - id: mcq
    label: "Multiple Choice Correct (out of 60)"
    type: number
    default: 44
    min: 0
    max: 60
    step: 1
    placeholder: "e.g., 44"
  - id: frq
    label: "Free Response Points (out of 21)"
    type: number
    default: 14
    min: 0
    max: 21
    step: 1
    placeholder: "e.g., 14"

outputs:
  - id: estimatedScore
    label: "Estimated AP Score (1 - 5)"
  - id: compositeScore
    label: "Total Composite Points (out of 120)"
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
  - key: frq
    label: "FRQ Points"
    source: input
  - key: compositeScore
    label: "Composite Score"
    source: output
  - key: estimatedScore
    label: "AP Grade (1-5)"
    source: output

js_file: assets/js/calculators/ap-human-geography-score-calculator.js

breadcrumb:
  - name: Home
    url: /
  - name: Education
    url: /education
  - name: "AP Human Geography Calculator"

howto:
  name: "How to Calculate Your AP Human Geography AP Score"
  description: "Use your section scores to estimate your official 1-5 AP score for AP Human Geography."
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
  - question: "How is the AP Human Geography AP score calculated?"
    answer: "The AP Human Geography AP score combines your weighted Section 1 (Multiple-Choice) and Section 2 (Free-Response) points into a composite score out of 120. This composite score is mapped to a 1–5 AP grade based on College Board scoring curves."
  - question: "What AP score is required for college credit?"
    answer: "Most colleges and universities award college credit or advanced placement for AP scores of 3, 4, or 5. Highly selective institutions may require a 4 or 5."
  - question: "Is there a penalty for wrong answers on AP exams?"
    answer: "No! AP exams do not penalize for incorrect multiple-choice answers. Your score is based solely on the number of questions answered correctly, so you should answer every question."
---

# AP Human Geography Score Calculator | Estimate AP Grade

Project your AP Human Geography exam score (1–5) using MCQ correct answers and 3 FRQ question points. Calculate your composite score and see if you are on track for a 3, 4, or 5 — 100% free and private in your browser.

<!-- more -->

## How AP Human Geography Exam Scoring Works

The **AP Human Geography** exam consists of multiple sections that are weighted to produce a composite score out of **120**. College Board converts this composite score into a scaled AP score from **1 to 5**:

- **5 (Extremely Well Qualified)**: Composite score of 88+
- **4 (Well Qualified)**: Composite score of 73 – 87
- **3 (Qualified)**: Composite score of 58 – 72
- **2 (Possibly Qualified)**: Composite score of 43 – 57
- **1 (No Recommendation)**: Composite score of 0 – 42

## Section Weighting Breakdown

| Section | Format | Max Raw Points | Weight % | Max Composite Points |
|---|---|---|---|---|
| Section I | Multiple Choice (60 Questions) | 60 | 50% | 60 |
| Section II | Free Response (3 Questions) | 21 | 50% | 60 |

## Step-by-Step Score Calculation Guide

1. **Enter Multiple-Choice Correct Count:** Input the total number of correct answers on Section 1.
2. **Enter Free-Response Points:** Input your earned points on Section 2 free-response questions/essays.
3. **Evaluate Estimated AP Grade:** Review your composite score and 1–5 AP grade prediction.
4. **Inspect Curve Cutoffs:** View the visual chart tab to see how close you are to the next grade cutoff boundary.

---

## Frequently Asked Questions

### How is the AP Human Geography AP score calculated?
The AP Human Geography AP exam score combines your weighted Multiple-Choice and Free-Response section points into a total composite score out of 120, which maps to a 1–5 AP grade based on College Board scoring curves.

### What AP score do I need for college credit?
A score of **3 or higher** is passing and earns college credit at most institutions. Top tier universities often require a **4 or 5**.

### Are incorrect multiple-choice answers penalized?
No. There is no guessing penalty on AP exams. Unanswered questions and incorrect answers count the same (0 points), so always make an educated guess!
