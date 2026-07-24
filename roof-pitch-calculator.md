---
layout: tool
title: "Roof Pitch | Interactive Online Tool"
description: "Calculate roof pitch ratios (X/12), pitch angles in degrees, pitch multipliers, and true sloped roof square footage from rise and run."
permalink: /roof-pitch-calculator
tool_id: roof-pitch-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: roofRiseInches
    label: Total Vertical Rise (Inches)
    type: number
    default: 72
    step: 1
    min: 1
    placeholder: "e.g., 72"

  - id: roofRunFeet
    label: Total Horizontal Run (Feet)
    type: number
    default: 12
    step: 0.5
    min: 0.5
    placeholder: "e.g., 12"

  - id: footprintAreaSqFt
    label: Flat Footprint Area (Sq Ft)
    type: number
    default: 1200
    step: 10
    min: 0
    placeholder: "e.g., 1200"

outputs:
  - id: pitchRatio
    label: Roof Pitch Ratio (X / 12)
  - id: pitchAngle
    label: Roof Slope Angle (Degrees)
  - id: multiplierFactor
    label: Slope Multiplier Factor
  - id: slopedRoofArea
    label: Total Sloped Roof Area

charts:
  tabs:
    - id: pitchComparison
      label: Rise vs Run vs Diagonal Slope
    - id: areaMultiplier
      label: Flat Footprint vs Sloped Roof Area

history_columns:
  - key: roofRiseInches
    label: Rise (in)
    source: input
  - key: roofRunFeet
    label: Run (ft)
    source: input
  - key: pitchRatio
    label: Pitch Ratio
    source: output
  - key: pitchAngle
    label: Angle (deg)
    source: output
  - key: multiplierFactor
    label: Multiplier
    source: output
  - key: slopedRoofArea
    label: Sloped Area
    source: output

js_file: assets/js/calculators/roof-pitch-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Pitch Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate roof pitch ratio (X/12), slope angle in degrees, pitch factor multiplier, and sloped roofing area."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Pitch Ratio Math — converts rise in inches and run in feet into standard X/12 pitch"
    - "Degree Converter — converts pitch slope ratios directly to degrees (°)"
    - "Area Multiplier Factor — calculates true roofing square footage for shingle ordering"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Roof Pitch Calculator

howto:
  name: "How to Calculate Roof Pitch"
  description: "Determine roof slope pitch ratio, pitch multiplier, and sloped surface area."
  step:
    - name: "Measure vertical roof rise"
      text: "Input total vertical rise in inches from top of wall plate to roof peak."
    - name: "Measure horizontal roof run"
      text: "Input total horizontal run in feet."
    - name: "Input building footprint area"
      text: "Enter flat building footprint square footage to calculate true sloped roof area."
    - name: "Review pitch ratio and multiplier"
      text: "Check X/12 pitch, slope angle, and pitch multiplier for shingle and sheathing ordering."

faq:
  - question: "What is roof pitch?"
    answer: "Roof pitch is the measure of the steepness of a roof slope, expressed as inches of vertical rise per 12 inches (1 foot) of horizontal run (e.g., a 6/12 pitch rises 6 inches for every 12 inches of run)."
  - question: "How do you calculate roof pitch ratio?"
    answer: "Pitch Ratio = Total Rise (in inches) / Total Run (in feet). For example, 72 inches of rise over 12 feet of run = 72 / 12 = 6/12 pitch."
  - question: "How do you convert roof pitch to degrees?"
    answer: "Pitch angle in degrees = arctan(Pitch / 12) × (180 / π). For example, a 7/12 pitch equals arctan(7/12) = 30.26 degrees."
  - question: "What is a roof pitch multiplier factor?"
    answer: "The pitch multiplier is the ratio of sloped roof length to flat horizontal run: Multiplier = √(1 + (Pitch/12)²). Multiplying flat attic footprint area by this factor gives true sloped roof surface square footage."
  - question: "What is considered a low slope vs steep slope roof?"
    answer: "Flat roofs are 0/12 to 2/12 pitch. Low-slope roofs are 2/12 to 4/12. Standard residential roofs are 4/12 to 9/12. Steep-slope roofs are 10/12 to 18/12 pitch."
  - question: "Why is roof pitch important for shingle installation?"
    answer: "Standard asphalt shingles require a minimum 4/12 pitch for proper water drainage without special underlayment. Pitch also determines snow load shed and wind resistance ratings."
  - question: "Is my roof pitch calculation saved on external servers?"
    answer: "No. All calculation logic executes locally in your browser."
---

# Roof Pitch Calculator

Calculate **roof pitch ratio (X/12)**, slope angle in degrees, **pitch multiplier factor**, and true sloped roof square footage from rise and run measurements.

<!-- more -->

## Roof Pitch Formulas

$$\text{Pitch Ratio } (X) = \frac{\text{Vertical Rise (in)}}{\text{Horizontal Run (ft)}}$$
$$\text{Slope Angle } (\theta) = \arctan\left(\frac{X}{12}\right) \times \frac{180}{\pi}$$
$$\text{Pitch Multiplier Factor } (M) = \sqrt{1 + \left(\frac{X}{12}\right)^2}$$
$$\text{Diagonal Slope Length (ft)} = \text{Run (ft)} \times M$$
$$\text{Sloped Roof Area (sq ft)} = \text{Flat Footprint Area (sq ft)} \times M$$

---

## Standard Roof Pitch Multiplier & Angle Reference Table

| Roof Pitch | Angle (Degrees) | Pitch Multiplier Factor | Flat Area (1,000 sq ft) | Sloped Roof Area | Shingle Bundles Needed (3 bndl/sq) |
|---|---|---|---|---|---|
| **3/12 Pitch** | 14.04° | **1.031** | 1,000 sq ft | **1,031 sq ft** | 31 Bundles |
| **4/12 Pitch** | 18.43° | **1.054** | 1,000 sq ft | **1,054 sq ft** | 32 Bundles |
| **5/12 Pitch** | 22.62° | **1.083** | 1,000 sq ft | **1,083 sq ft** | 33 Bundles |
| **6/12 Pitch** | 26.57° | **1.118** | 1,000 sq ft | **1,118 sq ft** | 34 Bundles |
| **7/12 Pitch** | 30.26° | **1.158** | 1,000 sq ft | **1,158 sq ft** | 35 Bundles |
| **8/12 Pitch** | 33.69° | **1.202** | 1,000 sq ft | **1,202 sq ft** | 37 Bundles |
| **9/12 Pitch** | 36.87° | **1.250** | 1,000 sq ft | **1,250 sq ft** | 38 Bundles |
| **10/12 Pitch** | 39.81° | **1.302** | 1,000 sq ft | **1,302 sq ft** | 40 Bundles |
| **12/12 Pitch** | 45.00° | **1.414** | 1,000 sq ft | **1,414 sq ft** | 43 Bundles |

---

## How to Use This Roof Pitch Calculator

1. Enter total **Vertical Rise in inches** (height from top plate level to ridge peak).
2. Enter total **Horizontal Run in feet** (distance from wall plate to ridge peak).
3. Specify flat **Building Footprint Area in square feet**.
4. Review the calculated X/12 pitch ratio, slope angle in degrees, pitch multiplier factor, and sloped roofing square footage.

---

## Frequently Asked Questions

### What is roof pitch?
Roof pitch is the measure of the steepness of a roof slope, expressed as inches of vertical rise per 12 inches (1 foot) of horizontal run (e.g., a 6/12 pitch rises 6 inches for every 12 inches of run).

### How do you calculate roof pitch ratio?
Pitch Ratio = Total Rise (in inches) / Total Run (in feet). For example, 72 inches of rise over 12 feet of run = 72 / 12 = 6/12 pitch.

### How do you convert roof pitch to degrees?
Pitch angle in degrees = arctan(Pitch / 12) × (180 / π). For example, a 7/12 pitch equals arctan(7/12) = 30.26 degrees.

### What is a roof pitch multiplier factor?
The pitch multiplier is the ratio of sloped roof length to flat horizontal run: Multiplier = √(1 + (Pitch/12)²). Multiplying flat attic footprint area by this factor gives true sloped roof surface square footage.

### What is considered a low slope vs steep slope roof?
Flat roofs are 0/12 to 2/12 pitch. Low-slope roofs are 2/12 to 4/12. Standard residential roofs are 4/12 to 9/12. Steep-slope roofs are 10/12 to 18/12 pitch.

### Why is roof pitch important for shingle installation?
Standard asphalt shingles require a minimum 4/12 pitch for proper water drainage without special underlayment. Pitch also determines snow load shed and wind resistance ratings.

### Is my roof pitch calculation saved on external servers?
No. All calculation logic executes locally in your browser.
