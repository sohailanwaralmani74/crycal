---
layout: tool
title: "Shingle | Interactive Online Tool"
description: "Calculate exact asphalt shingle bundles, starter strip rolls, ridge cap bundles, and waste percentages for roof replacement projects."
permalink: /shingle-calculator
tool_id: shingle-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: roofAreaSqFt
    label: Total Roof Surface Area (Sq Ft)
    type: number
    default: 2200
    step: 50
    min: 100
    placeholder: "e.g., 2200"

  - id: wastePercent
    label: Waste & Cutting Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    placeholder: "e.g., 10"

  - id: eaveLengthFt
    label: Total Eave & Rake Edge Length (Feet)
    type: number
    default: 140
    step: 5
    min: 0
    placeholder: "e.g., 140"

  - id: ridgeLengthFt
    label: Total Ridge & Hip Length (Feet)
    type: number
    default: 50
    step: 5
    min: 0
    placeholder: "e.g., 50"

  - id: shingleCoverageSqFt
    label: Bundle Coverage Area (Sq Ft per Bundle)
    type: select
    default: "33.33"
    options:
      - label: "Standard Architectural / 3-Tab (33.33 sq ft - 3 bundles/sq)"
        value: "33.33"
      - label: "Heavyweight / Designer (25.0 sq ft - 4 bundles/sq)"
        value: "25.0"
      - label: "Laminated Special (32.8 sq ft)"
        value: "32.8"

outputs:
  - id: totalShingleBundles
    label: Field Shingle Bundles Needed
  - id: totalRoofSquares
    label: Total Roofing Squares (with Waste)
  - id: starterStripBundles
    label: Starter Strip Bundles Needed
  - id: ridgeCapBundles
    label: Ridge & Hip Cap Bundles Needed

charts:
  tabs:
    - id: bundleBreakdown
      label: Bundle Count Breakdown
    - id: wasteImpact
      label: Waste % Impact on Bundles

history_columns:
  - key: roofAreaSqFt
    label: Roof Area (sq ft)
    source: input
  - key: wastePercent
    label: Waste %
    source: input
  - key: totalShingleBundles
    label: Shingle Bundles
    source: output
  - key: totalRoofSquares
    label: Total Squares
    source: output

js_file: assets/js/calculators/shingle-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Shingle Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate shingle bundle counts, starter strips, ridge cap bundles, and waste allowances for roof installation."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Field Shingle Bundle Estimator — calculates exact 3-tab or architectural shingle bundle counts"
    - "Starter Strip Calculation — computes linear feet and starter bundle requirements for eaves"
    - "Ridge Cap Estimator — computes hip and ridge cap bundle needs"
    - "Waste Allowance Tuning — custom waste percentages from 5% to 25%"
    - "100% Private — client-side calculations in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Shingle Calculator

howto:
  name: "How to Calculate Shingle Bundles"
  description: "Calculate the exact number of shingle bundles, starter strips, and ridge cap shingles needed for your roof."
  step:
    - name: "Determine Total Roof Surface Area"
      text: "Input the sloped square footage of your roof (or calculate using building size and pitch)."
    - name: "Select Shingle Bundle Coverage"
      text: "Choose bundle type (33.33 sq ft for standard 3-tab/architectural shingles)."
    - name: "Measure Eaves and Ridges"
      text: "Measure total eave perimeter for starter strips and hip/ridge line lengths for ridge caps."
    - name: "Apply Waste Allowance"
      text: "Add 10% waste for gable roofs or 15% for hip roofs with valleys."

faq:
  - question: "How many bundles of shingles are in a square?"
    answer: "There are 3 bundles of standard architectural or 3-tab asphalt shingles per roofing square (1 square = 100 sq ft, 1 bundle = 33.33 sq ft)."
  - question: "How many square feet does 1 bundle of shingles cover?"
    answer: "One standard bundle of shingles covers approximately 33.33 square feet. Heavyweight designer shingles may cover 25 square feet per bundle."
  - question: "What is starter strip and why is it needed?"
    answer: "Starter strip shingles are installed along the eave and rake edges before field shingles to prevent wind uplift and water infiltration at roof borders."
  - question: "How many linear feet does a starter strip bundle cover?"
    answer: "A standard bundle of starter strip shingles covers approximately 100 to 105 linear feet of roof edge."
  - question: "How many linear feet does a bundle of ridge caps cover?"
    answer: "A standard bundle of hip and ridge cap shingles covers approximately 25 to 33 linear feet of ridge line."
  - question: "Should I cut field shingles for starter and ridge caps?"
    answer: "While 3-tab field shingles were historically cut into starter pieces and cap shingles, modern architectural shingles require dedicated manufactured starter strips and ridge cap bundles to preserve manufacturer warranties."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculations are processed locally in your browser."
---

# Shingle Calculator

Calculate exact **Shingle Bundles** ($3\text{ bundles} = 1\text{ roofing square}$), starter strip rolls, hip/ridge cap bundles, and material waste percentages with our free **Shingle Calculator**.

<!-- more -->

## Why Use the Shingle Calculator?

Ordering shingles requires precise counts of three separate roof material components: **Field Shingles**, **Starter Strips**, and **Ridge Cap Shingles**. 

Relying solely on total roof square footage often leads to shortage of ridge caps or starter strips, while over-ordering field shingles wastes money. This calculator breaks down each component individually based on roof geometry and edge measurements.

---

## Shingle Calculation Formulas

$$\text{Roof Area with Waste} = \text{Roof Area (sq ft)} \times \left(1 + \frac{\text{Waste } \%}{100}\right)$$
$$\text{Total Roofing Squares} = \frac{\text{Roof Area with Waste}}{100}$$
$$\text{Field Shingle Bundles} = \left\lceil \frac{\text{Roof Area with Waste}}{\text{Coverage per Bundle (sq ft)}} \right\rceil$$
$$\text{Starter Strip Bundles} = \left\lceil \frac{\text{Total Eave \& Rake Length (ft)}}{105\text{ ft/bundle}} \right\rceil$$
$$\text{Ridge Cap Bundles} = \left\lceil \frac{\text{Total Ridge \& Hip Length (ft)}}{33\text{ ft/bundle}} \right\rceil$$

---

## Shingle Coverage & Bundle Reference Table

| Material Component | Standard Bundle Coverage | Unit Conversion | Typical Packaging |
|---|---|---|---|
| **3-Tab Asphalt Field Shingles** | 33.33 sq ft | 3 bundles = 1 square (100 sq ft) | 26 to 29 shingles per bundle |
| **Architectural Shingles** | 32.8 to 33.33 sq ft | 3 bundles = 1 square | 20 to 22 shingles per bundle |
| **Heavyweight Designer Shingles** | 25.0 sq ft | 4 bundles = 1 square | 16 to 18 shingles per bundle |
| **Starter Strip Shingles** | 100 to 105 lin ft | Covers perimeter edges | 18 to 22 long perforated strips |
| **Hip & Ridge Cap Shingles** | 25 to 33 lin ft | Covers roof peaks & hips | 24 to 30 cap shingles per bundle |

---

## Step-by-Step Guide to Ordering Shingles

1. **Calculate Net Surface Area**: Measure your roof slope area or convert footprint size using pitch multipliers.
2. **Calculate Field Bundles**: Divide sloped square footage (plus 10% waste) by 33.33 to determine field bundles needed.
3. **Measure Perimeter Edges**: Add all bottom eaves and rake edges to estimate starter strip bundles (divide by 105 ft).
4. **Measure Ridge and Hip Lines**: Measure top ridges and diagonal hips to calculate ridge cap bundles (divide by 33 ft).
5. **Round Up**: Always round up partial bundle counts to the next full bundle for jobsite coverage.

---

## Frequently Asked Questions

### How many bundles of shingles are in a square?
There are 3 bundles of standard architectural or 3-tab asphalt shingles per roofing square (1 square = 100 sq ft, 1 bundle = 33.33 sq ft).

### How many square feet does 1 bundle of shingles cover?
One standard bundle of shingles covers approximately 33.33 square feet. Heavyweight designer shingles may cover 25 square feet per bundle.

### What is starter strip and why is it needed?
Starter strip shingles are installed along the eave and rake edges before field shingles to prevent wind uplift and water infiltration at roof borders.

### How many linear feet does a starter strip bundle cover?
A standard bundle of starter strip shingles covers approximately 100 to 105 linear feet of roof edge.

### How many linear feet does a bundle of ridge caps cover?
A standard bundle of hip and ridge cap shingles covers approximately 25 to 33 linear feet of ridge line.

### Should I cut field shingles for starter and ridge caps?
While 3-tab field shingles were historically cut into starter pieces and cap shingles, modern architectural shingles require dedicated manufactured starter strips and ridge cap bundles to preserve manufacturer warranties.

### Is my personal data saved when using this calculator?
No. All calculations are processed locally in your browser.
