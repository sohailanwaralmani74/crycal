---
layout: tool
title: Gravel & Aggregate Calculator – Cubic Yards, Tons & Cost
description: Calculate cubic yards, tons of gravel, pea gravel, river rock, and crushed stone for driveways, pathways, and compaction subbase with total cost.
permalink: /gravel-aggregate-calculator
tool_id: gravel-aggregate-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: areaSquareFeet
    label: Coverage Area (Square Feet)
    type: number
    default: 500
    step: 25
    min: 1
    placeholder: "e.g., 500"

  - id: depthInches
    label: Gravel Depth (Inches)
    type: number
    default: 4
    step: 0.5
    min: 0.5
    placeholder: "e.g., 4"

  - id: gravelType
    label: Gravel / Aggregate Type
    type: select
    default: "crushed_stone"
    options:
      - value: "crushed_stone"
        label: "Crushed Stone / Angular Gravel (~1.35 tons/cu yd)"
      - value: "pea_gravel"
        label: "Pea Gravel (~1.30 tons/cu yd)"
      - value: "river_rock"
        label: "River Rock / Smooth Pebbles (~1.40 tons/cu yd)"
      - value: "decomposed_granite"
        label: "Decomposed Granite / DG Base (~1.50 tons/cu yd)"

  - id: pricePerTon
    label: Price Per Ton
    type: number
    default: 45.00
    step: 2.50
    min: 0
    currency: true
    placeholder: "e.g., 45.00"

  - id: wastePercentage
    label: Compaction & Waste Overage (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

outputs:
  - id: totalCubicYards
    label: Required Gravel Volume (Cubic Yards)
  - id: totalTons
    label: Total Gravel Weight (Tons)
  - id: totalCubicFeet
    label: Total Volume (Cubic Feet)
  - id: totalMaterialCost
    label: Estimated Gravel Material Cost

charts:
  tabs:
    - id: volumeVsTons
      label: Cubic Yards vs Weight in Tons
    - id: costBreakdown
      label: Material Cost Breakdown

history_columns:
  - key: areaSquareFeet
    label: Area (sq ft)
    source: input
  - key: depthInches
    label: Depth (in)
    source: input
  - key: totalCubicYards
    label: Cubic Yards
    source: output
  - key: totalTons
    label: Weight (Tons)
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/gravel-aggregate-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Gravel & Aggregate Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate cubic yards, tons, and cost of crushed stone, pea gravel, river rock, and decomposed granite for driveways and landscape beds."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Cubic Yard & Ton Converter — calculates exact volume and converts to weight in tons using aggregate densities"
    - "Compaction Allowance — accounts for 5% to 30% settling under plate compaction"
    - "Material Cost Estimator — calculates total delivery cost based on price per ton"
    - "100% Client-Side — private, browser-based execution"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Gravel & Aggregate Calculator

howto:
  name: "How to Calculate Gravel Volume and Tons"
  description: "Determine cubic yards, tons, and cost of gravel for landscape and construction projects."
  step:
    - name: "Enter area in square feet"
      text: "Input the surface area (length × width) of your driveway or garden bed."
    - name: "Set depth in inches"
      text: "Specify desired gravel depth (e.g. 2 inches for walkways, 4 inches for driveways)."
    - name: "Select gravel density & price"
      text: "Choose gravel type (crushed stone, pea gravel, etc.) and price per ton."

faq:
  - question: "How many tons of gravel are in a cubic yard?"
  - answer: "One cubic yard of crushed gravel weighs approximately 1.35 tons (2,700 lbs), while pea gravel weighs ~1.30 tons and decomposed granite weighs ~1.50 tons."
  - question: "How many square feet does a ton of gravel cover at 3 inches depth?"
  - answer: "One ton of crushed stone (approx. 0.74 cubic yards) covers roughly 80 square feet at a depth of 3 inches."
  - question: "How thick should a gravel driveway be?"
  - answer: "A gravel driveway should have a total depth of 4 to 6 inches, typically consisting of a 3-inch subbase of heavy crushed stone topped with 2 inches of decorative gravel."
  - question: "Why do I need to add a compaction factor to gravel calculations?"
  - answer: "When gravel is spread and compacted with a plate compactor or driven over, its volume decreases by 10% to 15% as smaller stones settle into air gaps."
  - question: "How much does a yard of gravel cost?"
  - answer: "Bulk gravel costs between $35 and $65 per cubic yard ($40 to $75 per ton), depending on material type and local quarry proximity."
  - question: "What is the difference between pea gravel and crushed stone?"
  - answer: "Pea gravel consists of naturally rounded, smooth river stones ideal for pathways, whereas crushed stone has sharp angular edges that interlock tightly for stable driveways."
  - question: "Is my personal data saved?"
  - answer: "No. All calculations run locally in your web browser."
---

# Gravel & Aggregate Calculator – Cubic Yards, Tons & Cost

Calculate total **Cubic Yards**, weight in **Tons**, and estimated material cost for gravel, crushed stone, pea gravel, river rock, and decomposed granite.

<!-- more -->

## Why Use This Gravel & Aggregate Calculator?

Whether installing a new gravel driveway, landscape drainage trench, patio base, or walkway, ordering aggregate by weight or volume can be confusing. Landscape yards quote prices either per cubic yard or per ton. Because different aggregates vary significantly in density—from lightweight pea gravel to heavy decomposed granite—this calculator accurately converts volume into tons and adds compaction overage so you never run short.

---

## Gravel & Aggregate Formulas

$$\text{Depth (ft)} = \frac{\text{Depth (in)}}{12}$$

$$\text{Net Volume (cu ft)} = \text{Area (sq ft)} \times \text{Depth (ft)}$$

$$\text{Total Volume with Waste (cu ft)} = \text{Net Volume (cu ft)} \times \left(1 + \frac{\text{Waste \%}}{100}\right)$$

$$\text{Cubic Yards} = \frac{\text{Total Volume (cu ft)}}{27}$$

$$\text{Tons} = \frac{\text{Cubic Yards} \times \text{Density (lbs/cu yd)}}{2000}$$

$$\text{Total Cost} = \text{Tons} \times \text{Price Per Ton}$$

---

## Gravel Coverage Reference Table (Crushed Stone ~1.35 Tons/yd³, $45/Ton)

| Area & Depth | Volume (cu ft) | Total Volume (+10% Waste) | Weight in Tons | Coverage per Ton | Total Cost |
|---|---|---|---|---|---|
| **100 sq ft @ 2 in depth** | 16.67 cu ft | **0.68 cu yds** | **0.92 Tons** | 109 sq ft / ton | **$41.40** |
| **300 sq ft @ 3 in depth** | 75.00 cu ft | **3.06 cu yds** | **4.13 Tons** | 73 sq ft / ton | **$185.85** |
| **500 sq ft @ 4 in depth** | 166.67 cu ft | **6.79 cu yds** | **9.17 Tons** | 55 sq ft / ton | **$412.65** |
| **1,000 sq ft @ 4 in depth** | 333.33 cu ft | **13.58 cu yds** | **18.33 Tons** | 55 sq ft / ton | **$824.85** |

---

## Step-by-Step Guide: How to Calculate Gravel Orders

1. **Calculate Area**: Multiply length by width of your excavation bed to find total square feet.
2. **Determine Layer Thickness**: Use 2 inches for flower beds, 3 inches for footpaths, and 4 to 6 inches for driveways.
3. **Select Aggregate Material**: Choose crushed stone for compaction or pea gravel for decorative footpaths.
4. **Order by Ton or Yard**: Supply your quarry or landscape supplier with total tons or cubic yards.

---

## Frequently Asked Questions

### How many tons of gravel are in a cubic yard?
One cubic yard of crushed gravel weighs approximately 1.35 tons (2,700 lbs), while pea gravel weighs ~1.30 tons and decomposed granite weighs ~1.50 tons.

### How many square feet does a ton of gravel cover at 3 inches depth?
One ton of crushed stone (approx. 0.74 cubic yards) covers roughly 80 square feet at a depth of 3 inches.

### How thick should a gravel driveway be?
A gravel driveway should have a total depth of 4 to 6 inches, typically consisting of a 3-inch subbase of heavy crushed stone topped with 2 inches of decorative gravel.

### Why do I need to add a compaction factor to gravel calculations?
When gravel is spread and compacted with a plate compactor or driven over, its volume decreases by 10% to 15% as smaller stones settle into air gaps.

### How much does a yard of gravel cost?
Bulk gravel costs between $35 and $65 per cubic yard ($40 to $75 per ton), depending on material type and local quarry proximity.

### What is the difference between pea gravel and crushed stone?
Pea gravel consists of naturally rounded, smooth river stones ideal for pathways, whereas crushed stone has sharp angular edges that interlock tightly for stable driveways.

### Is my personal data saved?
No. All calculations run locally in your web browser.
