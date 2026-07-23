---
layout: tool
title: Concrete Stairs Calculator – Riser, Tread & Bag Estimator
description: Calculate concrete volume in cubic yards, cubic feet, and 80lb/60lb pre-mixed bags for concrete stairs, risers, treads, and top landing platforms.
permalink: /concrete-stairs-calculator
tool_id: concrete-stairs-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: numberOfSteps
    label: Number of Steps (Risers)
    type: number
    default: 5
    step: 1
    min: 1
    placeholder: "e.g., 5"

  - id: riserHeightInches
    label: Riser Height (Inches)
    type: number
    default: 7
    step: 0.25
    min: 4
    placeholder: "e.g., 7"

  - id: treadDepthInches
    label: Tread Depth (Inches)
    type: number
    default: 11
    step: 0.5
    min: 8
    placeholder: "e.g., 11"

  - id: stairWidthFt
    label: Staircase Width (Feet)
    type: number
    default: 4
    step: 0.5
    min: 2
    placeholder: "e.g., 4"

  - id: platformDepthFt
    label: Top Landing Depth (Feet, 0 if none)
    type: number
    default: 3
    step: 0.5
    min: 0
    placeholder: "e.g., 3"

  - id: bagWeightLbs
    label: Pre-Mixed Bag Size
    type: select
    default: "80"
    options:
      - value: "80"
        label: "80 lb Bag (0.60 cu ft yield)"
      - value: "60"
        label: "60 lb Bag (0.45 cu ft yield)"
      - value: "40"
        label: "40 lb Bag (0.30 cu ft yield)"

  - id: bagCost
    label: Cost Per Bag of Concrete
    type: number
    default: 6.50
    step: 0.25
    min: 1.00
    currency: true
    placeholder: "e.g., 6.50"

outputs:
  - id: totalStairVolumeYards
    label: Total Concrete Volume (Cubic Yards)
  - id: totalStairVolumeCuFt
    label: Total Concrete Volume (Cubic Feet)
  - id: bagsNeeded
    label: Concrete Bags Needed (+10% waste)
  - id: totalMaterialCost
    label: Total Bagged Material Cost

charts:
  tabs:
    - id: volumeBreakdown
      label: Steps vs Landing Volume
    - id: bagComparison
      label: Bags Needed vs Cost

history_columns:
  - key: numberOfSteps
    label: Steps
    source: input
  - key: stairWidthFt
    label: Width (ft)
    source: input
  - key: totalStairVolumeYards
    label: Volume (cu yd)
    source: output
  - key: bagsNeeded
    label: Bags Needed
    source: output

js_file: assets/js/calculators/concrete-stairs-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Concrete Stairs Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete volume in cubic yards and pre-mixed bag quantities for solid concrete stairs and landings."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Solid concrete staircase volume calculation (step risers and treads)"
    - "Top landing / porch platform volume inclusion"
    - "80 lb, 60 lb, and 40 lb bag requirement estimator with 10% waste factor"
    - "170+ World Currencies supported"
    - "100% Private local browser calculation"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Concrete Stairs Calculator

howto:
  name: "How to Calculate Concrete Volume for Stairs"
  description: "Determine exact concrete volume in cubic yards and pre-mixed bags needed to pour solid outdoor concrete stairs."
  step:
    - name: "Count total risers"
      text: "Count total number of vertical step rises from ground to top platform level."
    - name: "Input step dimensions"
      text: "Enter riser height (standard 7 in), tread depth (standard 11 in), and staircase width in feet."
    - name: "Include landing platform"
      text: "Specify top porch or entrance landing depth if pouring as a monolithic unit."

faq:
  - question: "How much concrete do I need for a 5-step staircase?"
    answer: "A 5-step solid concrete staircase (7 in riser, 11 in tread, 4 ft wide) with a 3 ft top landing requires approximately 1.83 cubic yards (49.5 cubic feet) of concrete, or 91 bags of 80 lb concrete."
  - question: "How do you calculate concrete volume for stairs?"
    answer: "Step Volume (cu ft) = Width (ft) × [Tread (in) / 12] × [Riser (in) / 12] × [N × (N + 1) / 2], where N is the number of steps. Platform Volume = Width (ft) × Landing Depth (ft) × Total Height (ft)."
  - question: "How many 80lb bags of concrete make a cubic yard?"
    answer: "It takes 45 bags of 80 lb concrete to equal 1 cubic yard (27 cubic feet) of mixed concrete."
  - question: "Is it cheaper to use pre-mixed bags or order ready-mix concrete for stairs?"
    answer: "For small staircases under 1 cubic yard (under 45 bags), pre-mixed bags ($200–$300) are usually cheaper than paying short-load delivery fees ($150–$200 extra) for ready-mix trucks. For larger staircases over 1.5 cubic yards, ready-mix is faster and less labor intensive."
  - question: "What is standard riser height and tread depth according to building codes?"
    answer: "IRC building codes specify a maximum riser height of 7.75 inches (7 inches standard) and a minimum tread depth of 10 to 11 inches."
  - question: "Do outdoor concrete stairs require rebar?"
    answer: "Yes. Concrete stairs require #4 rebar cages pinned into foundation footings or porch walls to prevent settling, cracking, or tipping forward."
  - question: "Is my personal data saved anywhere?"
    answer: "No. All calculation logic runs strictly inside your local browser."
---

# Concrete Stairs Calculator – Riser, Tread & Bag Estimator

Determine exact concrete volume in **cubic yards**, **cubic feet**, and **pre-mixed bag counts** (80 lb, 60 lb, 40 lb) for outdoor concrete steps, entrance stoops, and top landing platforms.

<!-- more -->

## Concrete Stairs Volume Formulas

$$\text{Tread (ft)} = \frac{\text{Tread (in)}}{12}, \quad \text{Riser (ft)} = \frac{\text{Riser (in)}}{12}$$

$$\text{Steps Volume (cu ft)} = \text{Width (ft)} \times \text{Tread (ft)} \times \text{Riser (ft)} \times \frac{N(N+1)}{2}$$

$$\text{Landing Height (ft)} = N \times \text{Riser (ft)}$$

$$\text{Landing Volume (cu ft)} = \text{Width (ft)} \times \text{Landing Depth (ft)} \times \text{Landing Height (ft)}$$

$$\text{Total Volume (cu yd)} = \frac{\text{Steps Vol (cu ft)} + \text{Landing Vol (cu ft)}}{27} \times 1.10$$

$$\text{80 lb Bags Needed} = \left\lceil \frac{\text{Total Cu Ft} \times 1.10}{0.60} \right\rceil$$

---

## Solid Concrete Stairs Material Reference Table (7" Riser, 11" Tread, 80lb Bags)

| Number of Steps | Staircase Width | Top Landing Depth | Total Height | Concrete Volume (+10%) | 80 lb Bags Needed | Bagged Material Cost ($6.50/bag) | Ready-Mix Equiv. Cost ($140/yd) |
|---|---|---|---|---|---|---|---|
| **3 Steps** | 3 feet wide | 2 feet landing | 21 inches | 0.61 cu yds | 31 bags | **$201.50** | **$85.40** |
| **4 Steps** | 4 feet wide | 3 feet landing | 28 inches | 1.25 cu yds | 62 bags | **$403.00** | **$175.00** |
| **5 Steps** | 4 feet wide | 3 feet landing | 35 inches | 1.83 cu yds | 91 bags | **$591.50** | **$256.20** |
| **6 Steps** | 5 feet wide | 4 feet landing | 42 inches | 3.32 cu yds | 165 bags | **$1,072.50** | **$464.80** |

---

## Step-by-Step Guide: How to Calculate Concrete for Steps

1. **Count Number of Risers**: Count total vertical steps required to reach porch or entrance threshold.
2. **Determine Tread & Riser Dimensions**:
   - Standard comfortable steps use **7 inch risers** and **11 inch treads**.
3. **Include Top Entrance Platform**: If pouring a porch slab monolithically with the steps, enter the landing depth in feet.
4. **Choose Mixing Method**:
   - **Under 1.5 cu yds**: Mix 80 lb bags on-site using a portable drum mixer.
   - **Over 1.5 cu yds**: Order ready-mix concrete truck delivery to eliminate hand mixing dozens of heavy bags.

---

## Frequently Asked Questions

### How much concrete do I need for a 5-step staircase?
A 5-step solid concrete staircase (7 in riser, 11 in tread, 4 ft wide) with a 3 ft top landing requires approximately 1.83 cubic yards (49.5 cubic feet) of concrete, or 91 bags of 80 lb concrete.

### How do you calculate concrete volume for stairs?
Step Volume (cu ft) = Width (ft) × [Tread (in) / 12] × [Riser (in) / 12] × [N × (N + 1) / 2], where N is the number of steps. Platform Volume = Width (ft) × Landing Depth (ft) × Total Height (ft).

### How many 80lb bags of concrete make a cubic yard?
It takes 45 bags of 80 lb concrete to equal 1 cubic yard (27 cubic feet) of mixed concrete.

### Is it cheaper to use pre-mixed bags or order ready-mix concrete for stairs?
For small staircases under 1 cubic yard (under 45 bags), pre-mixed bags ($200–$300) are usually cheaper than paying short-load delivery fees ($150–$200 extra) for ready-mix trucks. For larger staircases over 1.5 cubic yards, ready-mix is faster and less labor intensive.

### What is standard riser height and tread depth according to building codes?
IRC building codes specify a maximum riser height of 7.75 inches (7 inches standard) and a minimum tread depth of 10 to 11 inches.

### Do outdoor concrete stairs require rebar?
Yes. Concrete stairs require #4 rebar cages pinned into foundation footings or porch walls to prevent settling, cracking, or tipping forward.

### Is my personal data saved anywhere?
No. All calculation logic runs strictly inside your local browser.
