---
layout: tool
title: "Sand | Interactive Online Tool"
description: "Calculate cubic yards, tons, and 50 lb bags of sand for paver bedding, patio subbase, pool liners, sandboxes, and masonry mortar with total cost."
permalink: /sand-calculator
tool_id: sand-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: areaSquareFeet
    label: Coverage Area (Square Feet)
    type: number
    default: 300
    step: 25
    min: 1
    placeholder: "e.g., 300"

  - id: depthInches
    label: Sand Layer Depth (Inches)
    type: number
    default: 2
    step: 0.5
    min: 0.25
    placeholder: "e.g., 2"

  - id: sandType
    label: Sand Application / Type
    type: select
    default: "paver_sand"
    options:
      - value: "paver_sand"
        label: "Concrete Paver Sand (~1.35 tons/cu yd)"
      - value: "masonry_sand"
        label: "Masonry / Brick Mortar Sand (~1.30 tons/cu yd)"
      - value: "play_sand"
        label: "Play Sand / Silica Sand (~1.35 tons/cu yd)"

  - id: pricePerTon
    label: Bulk Price Per Ton
    type: number
    default: 40.00
    step: 2.50
    min: 0
    currency: true
    placeholder: "e.g., 40.00"

  - id: wastePercentage
    label: Waste & Compaction Margin (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

outputs:
  - id: totalCubicYards
    label: Required Sand Volume (Cubic Yards)
  - id: totalTons
    label: Total Sand Weight (Tons)
  - id: total50lbBags
    label: 50 lb Bags Equivalent
  - id: totalMaterialCost
    label: Total Estimated Bulk Sand Cost

charts:
  tabs:
    - id: bulkVsBagged
      label: Bulk Tons vs 50lb Bag Quantity
    - id: costComparison
      label: Bulk vs Bagged Cost Comparison

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

js_file: assets/js/calculators/sand-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Sand Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate cubic yards, tons, and 50lb bags of sand for paver bedding, masonry mortar, pool liners, and sandboxes."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Paver Bedding Estimator — precise volume calculations for 1-inch and 2-inch sand bedding layers"
    - "Bag vs Bulk Converter — converts cubic yards to 50lb bags and tons"
    - "Compaction Allowance — accounts for 5% to 30% sand screed settling"
    - "100% Client-Side — local, private calculation in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Sand Calculator

howto:
  name: "How to Calculate Sand Volume, Bags, and Tons"
  description: "Determine exact cubic yards, tons, 50lb bags, and material cost for sand bedding and bases."
  step:
    - name: "Measure surface area"
      text: "Input length × width area in square feet."
    - name: "Set sand depth"
      text: "Specify layer depth (e.g. 1 inch standard for paver bedding screed)."
    - name: "Select sand type & pricing"
      text: "Choose paver sand, masonry sand, or play sand and set local bulk price per ton."

faq:
  - question: "How many tons of sand are in a cubic yard?"
  - answer: "One cubic yard of dry sand weighs approximately 1.35 tons (2,700 lbs). Damp sand can weigh up to 1.50 tons per cubic yard."
  - question: "How thick should the sand bed be under patio pavers?"
  - answer: "Interlocking brick and concrete pavers require a uniform 1-inch (25mm) layer of coarse concrete sand screed over a compacted gravel base."
  - question: "How many 50lb bags of sand equal 1 cubic yard?"
  - answer: "It takes 54 bags of 50 lb sand to equal 1 cubic yard of sand."
  - question: "What is the difference between concrete sand and masonry sand?"
  - answer: "Concrete sand (paver sand) has coarse, angular grains ideal for paver bedding and locking joints. Masonry sand is finely washed and screened for smooth mortar mixing."
  - question: "How many square feet does 1 ton of sand cover at 1 inch depth?"
  - answer: "One ton of sand (approx. 0.74 cu yds) covers approximately 240 square feet at a depth of 1 inch."
  - question: "When is bulk sand cheaper than buying 50lb bags?"
  - answer: "For projects requiring more than 0.5 cubic yards (27 bags of 50lb sand), ordering bulk sand from a landscape supply yard is significantly cheaper."
  - question: "Is my personal data saved?"
  - answer: "No. All computations execute locally inside your web browser."
---

# Sand Calculator

Calculate total **Cubic Yards**, weight in **Tons**, **50 lb Bags**, and total material cost for paver bedding sand, masonry sand, and sandboxes.

<!-- more -->

## Why Use This Sand Calculator?

When laying patio pavers, building retaining walls, leveling above-ground pool liners, or mixing masonry mortar, sand provides the ultimate leveling course. However, ordering sand requires knowing whether to purchase bagged sand from a home improvement store or bulk sand by the ton from a quarry. This calculator converts cubic feet to cubic yards, tons, and 50 lb bag counts with compaction allowances.

---

## Sand Volume & Conversion Formulas

$$\text{Depth (ft)} = \frac{\text{Depth (in)}}{12}$$

$$\text{Net Volume (cu ft)} = \text{Area (sq ft)} \times \text{Depth (ft)}$$

$$\text{Total Volume with Waste (cu ft)} = \text{Net Volume (cu ft)} \times \left(1 + \frac{\text{Waste \%}}{100}\right)$$

$$\text{Cubic Yards} = \frac{\text{Total Volume (cu ft)}}{27}$$

$$\text{Tons} = \frac{\text{Cubic Yards} \times \text{Density (lbs/cu yd)}}{2000}$$

$$\text{50 lb Bags} = \left\lceil \frac{\text{Total Volume (cu ft)} \times \text{Density (lbs/cu ft)}}{50} \right\rceil$$

$$\text{Total Bulk Cost} = \text{Tons} \times \text{Price Per Ton}$$

---

## Sand Coverage & Bag Reference Table (Paver Sand ~1.35 Tons/yd³, $40/Ton)

| Area & Layer Depth | Volume (cu ft) | Total Volume (+10% Waste) | Weight in Tons | 50 lb Bags Needed | Bulk Cost ($40/Ton) | Bagged Cost ($4.50/Bag) |
|---|---|---|---|---|---|---|
| **100 sq ft @ 1 in depth** | 8.33 cu ft | **0.34 cu yds** | **0.46 Tons** | **18 Bags** | **$18.40** | **$81.00** |
| **300 sq ft @ 1 in depth** | 25.00 cu ft | **1.02 cu yds** | **1.38 Tons** | **55 Bags** | **$55.20** | **$247.50** |
| **500 sq ft @ 2 in depth** | 83.33 cu ft | **3.39 cu yds** | **4.58 Tons** | **183 Bags** | **$183.20** | **$823.50** |
| **1,000 sq ft @ 2 in depth** | 166.67 cu ft | **6.79 cu yds** | **9.17 Tons** | **367 Bags** | **$366.80** | **$1,651.50** |

---

## Step-by-Step Guide: How to Calculate Sand Bedding

1. **Calculate Surface Area**: Measure patio, walkway, or sandbox length and width in feet.
2. **Select Bedding Thickness**: Standard concrete paver installation requires exactly 1 inch of uncompacted sand bedding.
3. **Choose Sand Type**: Use coarse concrete sand for paver bedding screed; use masonry sand for brick mortar.
4. **Determine Delivery Method**: If needing over 15 bags of 50 lb sand, buy bulk delivery to save up to 75% on materials.

---

## Frequently Asked Questions

### How many tons of sand are in a cubic yard?
One cubic yard of dry sand weighs approximately 1.35 tons (2,700 lbs). Damp sand can weigh up to 1.50 tons per cubic yard.

### How thick should the sand bed be under patio pavers?
Interlocking brick and concrete pavers require a uniform 1-inch (25mm) layer of coarse concrete sand screed over a compacted gravel base.

### How many 50lb bags of sand equal 1 cubic yard?
It takes 54 bags of 50 lb sand to equal 1 cubic yard of sand.

### What is the difference between concrete sand and masonry sand?
Concrete sand (paver sand) has coarse, angular grains ideal for paver bedding and locking joints. Masonry sand is finely washed and screened for smooth mortar mixing.

### How many square feet does 1 ton of sand cover at 1 inch depth?
One ton of sand (approx. 0.74 cu yds) covers approximately 240 square feet at a depth of 1 inch.

### When is bulk sand cheaper than buying 50lb bags?
For projects requiring more than 0.5 cubic yards (27 bags of 50lb sand), ordering bulk sand from a landscape supply yard is significantly cheaper.

### Is my personal data saved?
No. All computations execute locally inside your web browser.
