---
layout: tool
title: "Paver | Interactive Online Tool"
description: "Calculate patio and walkway paver counts (4x8, 6x6, 6x9, 12x12), 10% cutting waste, bedding sand yards, gravel base stone tons, and total cost."
permalink: /paver-calculator
tool_id: paver-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: patioLengthFt
    label: Patio / Walkway Length (Feet)
    type: number
    default: 20
    step: 1
    min: 2
    placeholder: "e.g., 20"

  - id: patioWidthFt
    label: Patio / Walkway Width (Feet)
    type: number
    default: 15
    step: 1
    min: 2
    placeholder: "e.g., 15"

  - id: paverSize
    label: Paver Unit Dimensions
    type: select
    default: "6x9"
    options:
      - value: "4x8"
        label: '4" × 8" Brick Paver (0.222 sq ft)'
      - value: "6x6"
        label: '6" × 6" Square Paver (0.25 sq ft)'
      - value: "6x9"
        label: '6" × 9" Rectangle Paver (0.375 sq ft)'
      - value: "12x12"
        label: '12" × 12" Large Format (1.0 sq ft)'
      - value: "16x16"
        label: '16" × 16" Architectural Slab (1.778 sq ft)'

  - id: wasteFactorPct
    label: Cutting & Corner Waste (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 25
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePerPaver
    label: Price Per Paver Unit 
    type: number
    default: 1.85
    step: 0.05
    min: 0
    currency: true
    placeholder: "e.g., 1.85"

  - id: baseDepthInches
    label: Crushed Stone Base Depth (Inches)
    type: number
    default: 4
    step: 1
    min: 2
    max: 12
    placeholder: "e.g., 4"

  - id: sandDepthInches
    label: Bedding Sand Layer Depth (Inches)
    type: number
    default: 1
    step: 0.25
    min: 0.5
    max: 2
    placeholder: "e.g., 1"

outputs:
  - id: totalPaversNeeded
    label: Total Pavers Needed (with waste)
  - id: patioAreaSqFt
    label: Net Patio Surface Area
  - id: baseStoneTons
    label: Crushed Stone Base Needed (Tons)
  - id: beddingSandYards
    label: Bedding Sand Needed (Cubic Yards)
  - id: totalMaterialCost
    label: Total Material Budget

charts:
  tabs:
    - id: costDistribution
      label: Expense Distribution (Pavers, Base, Sand)
    - id: materialWeights
      label: Sub-Base Quantities & Weights

history_columns:
  - key: patioLengthFt
    label: Length (ft)
    source: input
  - key: patioWidthFt
    label: Width (ft)
    source: input
  - key: totalPaversNeeded
    label: Pavers Needed
    source: output
  - key: baseStoneTons
    label: Base Stone (tons)
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/paver-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Paver Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete and brick patio paver counts, 10% cutting waste, gravel sub-base stone tons, bedding sand cubic yards, and material costs."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Multi-Size Paver Calculator — supports 4x8 brick, 6x6, 6x9, 12x12, and 16x16 pavers"
    - "Sub-Base Stone Estimator — calculates compacted crushed stone base tonnage"
    - "Bedding Sand Volume — calculates 1-inch masonry sand bed in cubic yards"
    - "Cutting Waste Factor — adds 10% allowance for perimeter edge stone cuts"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Paver Calculator

howto:
  name: "How to Calculate Patio Pavers, Sand, and Gravel Base"
  description: "Determine exact paver counts, sand cubic yards, and gravel sub-base tons for hardscape patios and walkways."
  step:
    - name: "Measure Patio Dimensions"
      text: "Input total length and width of the patio or walkway area in feet."
    - name: "Select Paver Size"
      text: "Choose paver dimensions (4x8 brick, 6x6, 6x9, 12x12, or 16x16)."
    - name: "Set Base & Sand Depths"
      text: "Specify crushed gravel base depth (4 inches for patios; 8–12 inches for driveways) and 1 inch of bedding sand."
    - name: "Calculate Materials & Budget"
      text: "Get total paver count, base stone tons, bedding sand volume, and itemized project cost."

faq:
  - question: "How many 6x9 pavers do I need for a 300 square foot patio?"
    answer: "Each 6x9 paver covers 0.375 square feet. For a 300 sq ft patio, you need 800 net pavers. Including 10% for edge cutting waste, you will need 880 pavers."
  - question: "How many 4x8 brick pavers are in 1 square foot?"
    answer: "A standard 4\" × 8\" brick paver covers 0.222 square feet ($4 \times 8 / 144 = 0.2222$). Exactly 4.5 brick pavers cover 1 square foot."
  - question: "How deep should the gravel base be under a concrete block paver patio?"
    answer: "Pedestrian patios and walkways require a minimum 4-inch deep compacted gravel base (Crusher Run / dense grade). Residential driveways require 8 to 12 inches of compacted base stone."
  - question: "How much bedding sand is needed under pavers?"
    answer: "Paver installations require a uniform 1-inch thick bedding layer of coarse concrete sand (washed concrete sand, ASTM C33). For 300 sq ft, 1 inch of sand equals approx. 0.93 cubic yards."
  - question: "What is polymeric sand and why is it used for paver joints?"
    answer: "Polymeric sand is a blend of graded sand and polymer binders swept into paver joints. When activated with water, it hardens to prevent weed growth, ant hills, and sand washout."
  - question: "How much does a paver patio cost per square foot?"
    answer: "DIY paver patio materials (pavers, gravel, sand) cost $4 to $8 per square foot. Professional contractor installation ranges from $15 to $30 per square foot."
  - question: "Is my personal data saved anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Paver Calculator

Calculate exact material requirements for building a durable hardscape patio, walkway, or driveway using our **Paver Calculator**. Determine **paver unit counts**, **bedding sand cubic yards**, **gravel base stone tons**, and total material expenditure.

<!-- more -->

## Why Use a Paver Calculator?

Hardscape paving projects require three layered structural materials: excavated compacted crushed stone base, a smooth 1-inch bedding sand layer, and interlocking surface pavers. Miscalculating sub-base stone or sand leads to uneven settling, pooling water, and premature patio failure.

- **5 Popular Paver Sizes**: Supports 4x8 brick pavers (0.222 sq ft), 6x6 squares (0.25 sq ft), 6x9 rectangles (0.375 sq ft), 12x12 patio slabs (1.0 sq ft), and 16x16 pavers (1.778 sq ft).
- **Sub-Base Tonnage Calculation**: Converts base stone excavation depth to metric/US tons based on a compacted density of 1.45 tons per cubic yard.
- **Bedding Sand Volume**: Computes exact cubic yards of ASTM C33 coarse masonry sand needed for a 1-inch leveling bed.
- **Edge Cut Waste Multiplier**: Includes 10% to 15% extra pavers for curve cutting and border borders.

---

## Paver Calculation Formulas

$$\text{Patio Area (sq ft)} = \text{Length (ft)} \times \text{Width (ft)}$$

$$\text{Net Pavers Needed} = \frac{\text{Patio Area (sq ft)}}{\text{Paver Unit Area (sq ft)}}$$

$$\text{Total Pavers Needed (with Waste)} = \left\lceil \text{Net Pavers Needed} \times \left(1 + \frac{\text{Waste \%}}{100}\right) \right\rceil$$

$$\text{Base Stone Volume (cu yd)} = \frac{\text{Patio Area (sq ft)} \times (\text{Base Depth (in)} / 12)}{27}$$

$$\text{Base Stone Weight (Tons)} = \text{Base Stone Volume (cu yd)} \times 1.45 \text{ tons/yd}$$

$$\text{Bedding Sand Volume (cu yd)} = \frac{\text{Patio Area (sq ft)} \times (\text{Sand Depth (in)} / 12)}{27}$$

$$\text{Total Cost} = (\text{Pavers} \times \text{Price/Paver}) + (\text{Base Tons} \times \$35) + (\text{Sand Yds} \times \$45)$$

---

## Paver Material Estimation Reference Table (6x9 Pavers, 4" Base, 1" Sand)

The table below illustrates material requirements across standard patio project sizes:

| Patio Size (Length × Width) | Net Area | 6x9 Pavers (+10% Waste) | Crushed Stone Base (4") | Bedding Sand (1") | Estimated Material Cost | Material Cost / Sq Ft |
|---|---|---|---|---|---|---|
| **10' × 10' (Small Bistro)** | 100 sq ft | **294 Pavers** | 1.79 Tons (1.23 cu yds) | 0.31 cu yds | **$620.00** | **$6.20 / sq ft** |
| **12' × 15' (Dining Patio)** | 180 sq ft | **528 Pavers** | 3.22 Tons (2.22 cu yds) | 0.56 cu yds | **$1,114.00** | **$6.19 / sq ft** |
| **15' × 20' (Standard Patio)**| 300 sq ft | **880 Pavers** | 5.37 Tons (3.70 cu yds) | 0.93 cu yds | **$1,858.00** | **$6.19 / sq ft** |
| **20' × 20' (Large Outdoor)**| 400 sq ft | **1,174 Pavers** | 7.16 Tons (4.94 cu yds) | 1.23 cu yds | **$2,478.00** | **$6.19 / sq ft** |
| **20' × 30' (Pool Deck)** | 600 sq ft | **1,760 Pavers** | 10.74 Tons (7.41 cu yds) | 1.85 cu yds | **$3,716.00** | **$6.19 / sq ft** |

---

## Step-by-Step Guide: How to Lay a Concrete Paver Patio

1. **Excavate Patio Soil**: Dig out soil 7 to 8 inches deep (4 inches base stone + 1 inch bedding sand + 2.375 inch paver thickness).
2. **Install & Compact Gravel Base**: Lay 4 inches of crushed stone base (Crusher Run) in 2-inch lifts. Compact thoroughly with a plate compactor.
3. **Screed Bedding Sand**: Set 1-inch PVC pipes as screed rails and spread coarse washed sand across the base. Pull a straight 2x4 board across pipes to create a perfectly flat bed.
4. **Lay Pavers**: Lay pavers starting from a 90-degree corner working outward in a running bond or herringbone pattern. Maintain 1/16-inch joints between stones.
5. **Install Edge Restraints & Compact**: Secure plastic paver edge restraints with 10-inch spikes around the perimeter. Sweep polymeric sand into joints and run plate compactor over set pavers.

---

## Frequently Asked Questions

### How many 6x9 pavers do I need for a 300 square foot patio?
Each 6x9 paver covers 0.375 square feet. For a 300 sq ft patio, you need 800 net pavers. Including 10% for edge cutting waste, you will need 880 pavers.

### How many 4x8 brick pavers are in 1 square foot?
A standard 4" × 8" brick paver covers 0.222 square feet ($4 \times 8 / 144 = 0.2222$). Exactly 4.5 brick pavers cover 1 square foot.

### How deep should the gravel base be under a concrete block paver patio?
Pedestrian patios and walkways require a minimum 4-inch deep compacted gravel base (Crusher Run / dense grade). Residential driveways require 8 to 12 inches of compacted base stone.

### How much bedding sand is needed under pavers?
Paver installations require a uniform 1-inch thick bedding layer of coarse concrete sand (washed concrete sand, ASTM C33). For 300 sq ft, 1 inch of sand equals approx. 0.93 cubic yards.

### What is polymeric sand and why is it used for paver joints?
Polymeric sand is a blend of graded sand and polymer binders swept into paver joints. When activated with water, it hardens to prevent weed growth, ant hills, and sand washout.

### How much does a paver patio cost per square foot?
DIY paver patio materials (pavers, gravel, sand) cost $4 to $8 per square foot. Professional contractor installation ranges from $15 to $30 per square foot.

### Is my personal data saved anywhere?
No. All calculations run locally in your web browser.
