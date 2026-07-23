---
layout: tool
title: Concrete Yardage Calculator – Calculate Cubic Yards & Bag Count
description: Calculate cubic yards, cubic feet, and 60lb / 80lb bag counts for concrete slabs, footings, and walls with custom waste overage.
permalink: /concrete-yardage-calculator
tool_id: concrete-yardage-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: slabLengthFeet
    label: Slab Length (Feet)
    type: number
    default: 20
    step: 0.5
    min: 0.1
    placeholder: "e.g., 20"

  - id: slabWidthFeet
    label: Slab Width (Feet)
    type: number
    default: 10
    step: 0.5
    min: 0.1
    placeholder: "e.g., 10"

  - id: slabThicknessInches
    label: Slab Thickness (Inches)
    type: number
    default: 4
    step: 0.5
    min: 1
    placeholder: "e.g., 4"

  - id: wastePercentage
    label: Waste & Overage Factor (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

outputs:
  - id: totalCubicYards
    label: Total Concrete Required (Cubic Yards)
  - id: totalCubicFeet
    label: Total Volume (Cubic Feet)
  - id: bags80lbCount
    label: 80 lb Pre-Mix Concrete Bags Needed
  - id: bags60lbCount
    label: 60 lb Pre-Mix Concrete Bags Needed

charts:
  tabs:
    - id: volumeBreakdown
      label: Net Volume vs Waste Overage
    - id: bagComparison
      label: 80lb vs 60lb Bag Count

history_columns:
  - key: slabLengthFeet
    label: Length (ft)
    source: input
  - key: slabWidthFeet
    label: Width (ft)
    source: input
  - key: slabThicknessInches
    label: Thickness (in)
    source: input
  - key: totalCubicYards
    label: Cubic Yards
    source: output
  - key: bags80lbCount
    label: 80lb Bags
    source: output

js_file: assets/js/calculators/concrete-yardage-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Concrete Yardage Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete cubic yards, cubic feet, and 60lb/80lb bag counts for construction slabs."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Cubic Yardage Calculation — precise volume math for concrete pouring"
    - "Bag Count Estimator — convert cubic yards to 60 lb and 80 lb ready-mix bags"
    - "Waste Factor Multiplier — include 5% to 30% overage safety margin"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Concrete Yardage Calculator

howto:
  name: "How to Calculate Concrete Yardage"
  description: "Determine cubic yards of concrete and bag counts for slabs."
  step:
    - name: "Enter slab length & width"
      text: "Input dimensions in feet."
    - name: "Set thickness in inches"
      text: "Specify slab thickness (e.g., 4 inches for patio/walkway, 6 inches for driveway)."
    - name: "Include waste percentage"
      text: "Add 10% overage for uneven subgrades and spillage."

faq:
  - question: "How do you calculate cubic yards of concrete?"
    answer: "Multiply Length (ft) × Width (ft) × Thickness (ft) and divide by 27. (Thickness in feet = Inches / 12)."
  - question: "How many 80lb bags of concrete make a cubic yard?"
    answer: "It takes 45 bags of 80 lb pre-mix concrete to equal 1 cubic yard (27 cubic feet)."
  - question: "How many 60lb bags of concrete make a cubic yard?"
    answer: "It takes 60 bags of 60 lb pre-mix concrete to equal 1 cubic yard (27 cubic feet)."
  - question: "Why should you add a waste factor to concrete calculations?"
    answer: "Subgrades are rarely perfectly level, and forms flex under pressure. Adding a 5% to 10% waste factor prevents running short during a pour."
  - question: "What thickness is recommended for concrete slabs?"
    answer: "Standard walkways and patios require 4 inches. Residential driveways require 5 to 6 inches, while heavy equipment pads require 6+ inches with rebar reinforcement."
  - question: "When is ready-mix truck delivery cheaper than buying bags?"
    answer: "For projects requiring more than 1 cubic yard (approx. 45 bags of 80lb concrete), ready-mix truck delivery saves significant labor and often costs less overall."
  - question: "Is my project data saved on external servers?"
    answer: "No. All calculation logic executes locally in your browser."
---

# Concrete Yardage Calculator – Calculate Cubic Yards & Bag Count

Calculate total **Cubic Yards**, **Cubic Feet**, and **60 lb / 80 lb Pre-Mix Concrete Bags** needed for slabs, footings, and patio pads with our free calculator.

<!-- more -->

## Concrete Volume Formulas

$$\text{Thickness (ft)} = \frac{\text{Thickness (in)}}{12}$$
$$\text{Net Volume (cu ft)} = \text{Length (ft)} \times \text{Width (ft)} \times \text{Thickness (ft)}$$
$$\text{Total Volume (cu yd)} = \frac{\text{Net Volume (cu ft)} \times (1 + \frac{\text{Waste \%}}{100})}{27}$$

$$\text{80 lb Bags} = \lceil \text{Total cu ft} \times 0.6 \rceil \quad | \quad \text{60 lb Bags} = \lceil \text{Total cu ft} \times 0.45 \rceil$$

---

## Concrete Volume & Bag Count Reference Table (4-Inch Slab Thickness)

| Slab Dimensions (Length × Width) | Net Volume (cu ft) | Total Volume (+10% Waste) | 80 lb Bags Needed | 60 lb Bags Needed | Recommended Delivery |
|---|---|---|---|---|---|
| **10 ft × 10 ft (100 sq ft)** | 33.33 cu ft | **1.36 cu yds** | **61 Bags** | **82 Bags** | Ready-Mix / Bags |
| **12 ft × 20 ft (240 sq ft)** | 80.00 cu ft | **3.26 cu yds** | **147 Bags** | **196 Bags** | Ready-Mix Truck |
| **20 ft × 20 ft (400 sq ft)** | 133.33 cu ft | **5.43 cu yds** | **245 Bags** | **326 Bags** | Ready-Mix Truck |

---

## How to Use This Concrete Yardage Calculator

1. Enter **slab length** and **slab width** in feet.
2. Specify **slab thickness in inches** (standard patio = 4 in, driveway = 6 in).
3. Set **waste & overage factor** (10% recommended).
4. View cubic yards required, cubic feet volume, and exact 80lb/60lb pre-mix bag counts.

---

## Frequently Asked Questions

### How do you calculate cubic yards of concrete?
Multiply Length (ft) × Width (ft) × Thickness (ft) and divide by 27. (Thickness in feet = Inches / 12).

### How many 80lb bags of concrete make a cubic yard?
It takes 45 bags of 80 lb pre-mix concrete to equal 1 cubic yard (27 cubic feet).

### How many 60lb bags of concrete make a cubic yard?
It takes 60 bags of 60 lb pre-mix concrete to equal 1 cubic yard (27 cubic feet).

### Why should you add a waste factor to concrete calculations?
Subgrades are rarely perfectly level, and forms flex under pressure. Adding a 5% to 10% waste factor prevents running short during a pour.

### What thickness is recommended for concrete slabs?
Standard walkways and patios require 4 inches. Residential driveways require 5 to 6 inches, while heavy equipment pads require 6+ inches with rebar reinforcement.

### When is ready-mix truck delivery cheaper than buying bags?
For projects requiring more than 1 cubic yard (approx. 45 bags of 80lb concrete), ready-mix truck delivery saves significant labor and often costs less overall.

### Is my project data saved on external servers?
No. All calculation logic executes locally in your browser.
