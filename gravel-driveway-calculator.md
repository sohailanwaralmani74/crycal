---
layout: tool
title: Gravel Driveway Calculator – Volume (Cu Yds), Tons & Material Cost
description: Calculate gravel driveway volume in cubic yards, weight in tons (1.4 tons/yd), depth in inches, and total delivered gravel material cost.
permalink: /gravel-driveway-calculator
tool_id: gravel-driveway-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: drivewayLengthFt
    label: Driveway Length (Feet)
    type: number
    default: 50
    step: 5
    min: 5
    placeholder: "e.g., 50"

  - id: drivewayWidthFt
    label: Driveway Width (Feet)
    type: number
    default: 12
    step: 1
    min: 4
    placeholder: "e.g., 12"

  - id: gravelDepthInches
    label: Gravel Depth (Inches)
    type: number
    default: 4
    step: 0.5
    min: 1
    max: 12
    placeholder: "e.g., 4"

  - id: gravelType
    label: Gravel Material & Density
    type: select
    default: "crushed_stone"
    options:
      - value: "crushed_stone"
        label: "Crushed Stone / Crusher Run (1.40 tons / cu yd)"
      - value: "pea_gravel"
        label: "Pea Gravel / River Rock (1.35 tons / cu yd)"
      - value: "bank_run"
        label: "Bank Run Gravel / Fill (1.25 tons / cu yd)"
      - value: "dense_base"
        label: "Dense Base / Recycled Concrete (1.50 tons / cu yd)"

  - id: costPerTon
    label: Gravel Price Per Ton 
    type: number
    default: 38.00
    step: 1.00
    min: 0
    currency: true
    placeholder: "e.g., 38.00"

outputs:
  - id: volumeCubicYards
    label: Gravel Volume (Cubic Yards)
  - id: volumeCubicFeet
    label: Gravel Volume (Cubic Feet)
  - id: weightTons
    label: Total Gravel Weight (Tons)
  - id: surfaceAreaSqFt
    label: Driveway Surface Area (Sq Ft)
  - id: totalGravelCost
    label: Total Gravel Material Cost

charts:
  tabs:
    - id: volumeVsWeight
      label: Volume (Cu Yds) vs Weight (Tons)
    - id: costByDepth
      label: Depth vs Cost Comparison

history_columns:
  - key: drivewayLengthFt
    label: Length (ft)
    source: input
  - key: drivewayWidthFt
    label: Width (ft)
    source: input
  - key: volumeCubicYards
    label: Cu Yds
    source: output
  - key: weightTons
    label: Weight (tons)
    source: output
  - key: totalGravelCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/gravel-driveway-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Gravel Driveway Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate gravel driveway cubic yards, weight in tons (1.4 tons/yd density factor), depth in inches, and material costs."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Cubic Yard & Feet Calculator — converts length, width, and depth dimensions into exact aggregate volumes"
    - "Density Conversion Engine — calculates exact weight in tons for crushed stone, pea gravel, bank run, and dense base"
    - "Coverage Estimator — computes total driveway surface area"
    - "Delivered Material Budgeting — provides cost calculation based on local price per ton"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Gravel Driveway Calculator

howto:
  name: "How to Calculate Gravel Driveway Yards, Tons, and Cost"
  description: "Determine exact gravel volume in cubic yards and weight in tons for a new driveway or resurfacing project."
  step:
    - name: "Measure Driveway Dimensions"
      text: "Input total length and average width of the driveway in feet."
    - name: "Select Gravel Depth"
      text: "Specify gravel layer depth (2 to 3 inches for resurfacing; 4 to 6 inches for new driveways)."
    - name: "Choose Gravel Aggregate Type"
      text: "Select gravel material (Crusher Run, Pea Gravel, Bank Run, or Recycled Concrete Base)."
    - name: "Review Weight & Budget"
      text: "Get exact volume in cubic yards, total weight in tons, and delivered aggregate expenditure."

faq:
  - question: "How many tons of gravel do I need for a 50 ft by 12 ft driveway at 4 inches deep?"
    answer: "A 50 ft × 12 ft driveway (600 sq ft) at 4 inches deep requires 7.41 cubic yards of gravel. At a standard crushed stone density of 1.40 tons per yard, you will need 10.37 tons."
  - question: "How many cubic yards of gravel are in 1 ton?"
    answer: "One ton of crushed stone gravel equals approximately 0.71 cubic yards ($1 / 1.40 = 0.714$). Conversely, 1 cubic yard of crushed gravel weighs approximately 1.40 tons (2,800 lbs)."
  - question: "What depth of gravel is recommended for a residential driveway?"
    answer: "New gravel driveways require a total depth of 4 to 6 inches composed of 2 to 3 layered lifts (e.g., 4 inches of dense coarse base topped with 2 inches of fine crushed stone). Top-up resurfacing requires 2 inches."
  - question: "What is Crusher Run / #411 gravel and why is it used for driveways?"
    answer: "Crusher Run (also known as #411 or Dense Grade Aggregate) is a mix of 3/4-inch crushed stone down to fine rock dust. The stone dust fills voids between angular rocks, compacting into a dense, solid driveway surface."
  - question: "How wide should a single-car vs double-car gravel driveway be?"
    answer: "A standard single-car driveway should be 10 to 12 feet wide. A double-car driveway should be 20 to 24 feet wide."
  - question: "How much does a ton of driveway gravel cost delivered?"
    answer: "Driveway gravel costs $25 to $50 per ton depending on aggregate type, quarry distance, and delivery fees. Total installed cost ranges from $1.50 to $3.00 per square foot."
  - question: "Is my personal data saved anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Gravel Driveway Calculator – Volume (Cu Yds), Tons & Material Cost

Determine exact aggregate quantities for installing or resurfacing a residential driveway using our **Gravel Driveway Calculator**. Calculate **cubic yards**, **weight in tons** (1.4 tons/yd density), **gravel depth**, and total delivered cost.

<!-- more -->

## Why Use a Gravel Driveway Calculator?

Gravel quarry suppliers sell aggregate by weight in tons or volume in cubic yards. Ordering too little gravel leaves thin bare spots that quickly turn to mud during rainstorms, while overordering incurs extra truck delivery charges.

- **Dimensional Volume Engine**: Converts driveway length, width, and depth into cubic feet and cubic yards.
- **Specific Density Conversion**: Multiplies aggregate volume by exact density multipliers (1.40 tons/yd for crushed stone, 1.35 for pea gravel, 1.50 for dense base).
- **Resurfacing vs New Driveway Depth**: Supports 2-inch top-ups, standard 4-inch installations, or 6 to 8-inch heavy equipment bases.
- **Delivery Budgeting**: Calculates total material cost based on quarry price per ton.

---

## Gravel Driveway Formulas

$$\text{Surface Area (sq ft)} = \text{Length (ft)} \times \text{Width (ft)}$$

$$\text{Volume (cu ft)} = \text{Surface Area (sq ft)} \times \left(\frac{\text{Depth (in)}}{12}\right)$$

$$\text{Volume (cu yd)} = \frac{\text{Volume (cu ft)}}{27}$$

$$\text{Total Weight (Tons)} = \text{Volume (cu yd)} \times \text{Density (tons/cu yd)}$$

$$\text{Total Material Cost} = \text{Total Weight (Tons)} \times \text{Price Per Ton}$$

---

## Driveway Gravel Reference Table (4" Depth, Crushed Stone @ 1.40 tons/yd, $38.00/ton)

The table below outlines aggregate requirements across common driveway sizes:

| Driveway Dimensions (Length × Width) | Surface Area | Volume (Cu Yds) | Total Weight (Tons) | Total Material Cost | Cost / Sq Ft |
|---|---|---|---|---|---|
| **30' × 10' (Short Single)** | 300 sq ft | 3.70 cu yds | **5.19 Tons** | **$197.22** | **$0.66 / sq ft** |
| **50' × 12' (Standard Single)** | 600 sq ft | 7.41 cu yds | **10.37 Tons** | **$394.06** | **$0.66 / sq ft** |
| **50' × 20' (Standard Double)** | 1,000 sq ft | 12.35 cu yds | **17.29 Tons** | **$657.02** | **$0.66 / sq ft** |
| **100' × 12' (Long Country Lane)**| 1,200 sq ft | 14.81 cu yds | **20.73 Tons** | **$787.74** | **$0.66 / sq ft** |
| **150' × 14' (Rural Property)** | 2,100 sq ft | 25.93 cu yds | **36.30 Tons** | **$1,379.40** | **$0.66 / sq ft** |

---

## Step-by-Step Guide: How to Build a Durable Gravel Driveway

1. **Mark & Excavate Driveway**: Stake out boundaries with string lines and excavate topsoil 4 to 6 inches deep, creating a slight center crown for water runoff.
2. **Lay Heavy-Duty Geotextile Fabric**: Roll non-woven driveway fabric across exposed subgrade soil to prevent gravel from sinking into subsoil clay over time.
3. **Install Base Layer**: Spread 3 to 4 inches of coarse #3 or #4 crushed stone (1 to 2-inch rock) and compact thoroughly.
4. **Apply Surface Layer**: Lay 2 to 3 inches of #411 Crusher Run or pea gravel as the smooth top driving surface.
5. **Crown and Compact**: Shape the driveway center 1/2 inch higher than edges to direct rainwater into side drainage ditches, then roll with a heavy lawn roller or compactor.

---

## Frequently Asked Questions

### How many tons of gravel do I need for a 50 ft by 12 ft driveway at 4 inches deep?
A 50 ft × 12 ft driveway (600 sq ft) at 4 inches deep requires 7.41 cubic yards of gravel. At a standard crushed stone density of 1.40 tons per yard, you will need 10.37 tons.

### How many cubic yards of gravel are in 1 ton?
One ton of crushed stone gravel equals approximately 0.71 cubic yards ($1 / 1.40 = 0.714$). Conversely, 1 cubic yard of crushed gravel weighs approximately 1.40 tons (2,800 lbs).

### What depth of gravel is recommended for a residential driveway?
New gravel driveways require a total depth of 4 to 6 inches composed of 2 to 3 layered lifts (e.g., 4 inches of dense coarse base topped with 2 inches of fine crushed stone). Top-up resurfacing requires 2 inches.

### What is Crusher Run / #411 gravel and why is it used for driveways?
Crusher Run (also known as #411 or Dense Grade Aggregate) is a mix of 3/4-inch crushed stone down to fine rock dust. The stone dust fills voids between angular rocks, compacting into a dense, solid driveway surface.

### How wide should a single-car vs double-car gravel driveway be?
A standard single-car driveway should be 10 to 12 feet wide. A double-car driveway should be 20 to 24 feet wide.

### How much does a ton of driveway gravel cost delivered?
Driveway gravel costs $25 to $50 per ton depending on aggregate type, quarry distance, and delivery fees. Total installed cost ranges from $1.50 to $3.00 per square foot.

### Is my personal data saved anywhere?
No. All calculations run locally in your web browser.
