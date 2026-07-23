---
layout: tool
title: Rebar Calculator – Slab Grid, Linear Feet, Weight & Cost
description: Calculate linear feet of #3, #4, and #5 rebar for slab reinforcement grids, grid spacing, lap splice overlaps, total 20ft sticks, weight, and cost.
permalink: /rebar-calculator
tool_id: rebar-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: slabLengthFeet
    label: Slab Length (Feet)
    type: number
    default: 30
    step: 0.5
    min: 1
    placeholder: "e.g., 30"

  - id: slabWidthFeet
    label: Slab Width (Feet)
    type: number
    default: 20
    step: 0.5
    min: 1
    placeholder: "e.g., 20"

  - id: rebarSize
    label: Rebar Size / Gauge
    type: select
    default: "#4"
    options:
      - value: "#3"
        label: "#3 Bar (3/8\" Diameter - Light Slab/Patio)"
      - value: "#4"
        label: "#4 Bar (1/2\" Diameter - Standard Slab/Driveway)"
      - value: "#5"
        label: "#5 Bar (5/8\" Diameter - Heavy Footing/Structural)"

  - id: gridSpacingInches
    label: Grid Spacing Center-to-Center (Inches)
    type: number
    default: 18
    step: 2
    min: 6
    max: 36
    placeholder: "e.g., 18"

  - id: overlapInches
    label: Lap Splice Overlap (Inches)
    type: number
    default: 12
    step: 2
    min: 6
    max: 36
    placeholder: "e.g., 12"

  - id: clearanceMarginInches
    label: Edge Clearance Margin (Inches)
    type: number
    default: 3
    step: 1
    min: 1
    max: 12
    placeholder: "e.g., 3"

  - id: pricePerFoot
    label: Price Per Linear Foot
    type: number
    default: 0.85
    step: 0.05
    min: 0
    currency: true
    placeholder: "e.g., 0.85"

outputs:
  - id: totalLinearFeet
    label: Total Linear Feet Needed (with Splices & Waste)
  - id: totalRebarSticks
    label: Total 20 ft Rebar Sticks Needed
  - id: totalRebarWeightLbs
    label: Total Steel Weight (lbs)
  - id: totalRebarCost
    label: Total Rebar Material Cost

charts:
  tabs:
    - id: rebarDirection
      label: Length vs Width Rebar Footage
    - id: costWeight
      label: Rebar Footage vs Steel Weight

history_columns:
  - key: slabLengthFeet
    label: Length (ft)
    source: input
  - key: slabWidthFeet
    label: Width (ft)
    source: input
  - key: totalLinearFeet
    label: Linear Feet
    source: output
  - key: totalRebarCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/rebar-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rebar Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate linear feet of #3, #4, and #5 rebar for concrete slab grids, grid spacing, lap splice overlap, weight in lbs, and total steel cost."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Grid Layout Calculations — exact counts for longitudinal and transverse rebar lines"
    - "Lap Splice Allowance — calculates required overlap length per 20ft stock bar"
    - "Steel Weight Estimator — calculates exact weight in lbs based on bar gauge"
    - "100% Client-Side — private, browser-based execution"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Rebar Calculator

howto:
  name: "How to Calculate Rebar for Concrete Slabs"
  description: "Determine total linear feet, 20ft sticks, steel weight, and cost for rebar reinforcement grids."
  step:
    - name: "Input slab dimensions"
      text: "Enter slab length and width in feet."
    - name: "Select rebar size & grid spacing"
      text: "Choose bar size (#3, #4, or #5) and center-to-center grid spacing (e.g. 18 inches)."
    - name: "Set overlap & edge clearance"
      text: "Specify lap splice overlap (e.g. 12 inches) and edge concrete clearance margin."

faq:
  - question: "How far apart should rebar be spaced in a concrete slab?"
  - answer: "Standard residential slab rebar spacing ranges from 12 to 18 inches center-to-center in a crisscross grid pattern."
  - question: "What size rebar is best for driveways and patios?"
  - answer: "#4 rebar (1/2-inch diameter) is the standard recommendation for residential concrete driveways, patios, and garage slabs."
  - question: "How much lap splice overlap is required for rebar?"
  - answer: "Code generally requires a lap splice overlap equal to 30 to 40 times the bar diameter, which is approximately 12 to 18 inches for #4 rebar."
  - question: "How heavy is #4 rebar per foot?"
  - answer: "#4 rebar weighs 0.668 lbs per linear foot. A standard 20-foot stick weighs approximately 13.36 lbs."
  - question: "Why is edge clearance required for rebar?"
  - answer: "Maintaining 2 to 3 inches of concrete coverage around rebar prevents moisture penetration, rust corrosion, and concrete spalling."
  - question: "What length do rebar sticks come in?"
  - answer: "Standard rebar is sold in 20-foot long sticks at building supply yards."
  - question: "Is my data stored on external servers?"
  - answer: "No. All calculation logic runs locally inside your browser."
---

# Rebar Calculator – Slab Grid, Linear Feet, Weight & Cost

Calculate total **Linear Feet**, **20 ft Sticks**, steel weight in **lbs**, and material cost for rebar reinforcement grids in concrete slabs and footings.

<!-- more -->

## Why Use This Rebar Calculator?

Reinforcing concrete slabs with steel rebar dramatically increases tensile strength and prevents heavy cracking under load. However, determining how much rebar to buy requires accounting for two-way grid spacing, perimeter edge clearance, lap splice overlaps when joining 20 ft bars, and cutting waste. This calculator automates all layout math and gives exact stick counts and weight.

---

## Rebar Grid & Steel Formulas

$$\text{Active Length} = \text{Length (ft)} - \left(2 \times \frac{\text{Clearance (in)}}{12}\right)$$
$$\text{Active Width} = \text{Width (ft)} - \left(2 \times \frac{\text{Clearance (in)}}{12}\right)$$

$$\text{Longitudinal Bars} = \left\lfloor \frac{\text{Active Width} \times 12}{\text{Spacing (in)}} \right\rfloor + 1$$
$$\text{Transverse Bars} = \left\lfloor \frac{\text{Active Length} \times 12}{\text{Spacing (in)}} \right\rfloor + 1$$

$$\text{Net Linear Feet} = (\text{Longitudinal Bars} \times \text{Active Length}) + (\text{Transverse Bars} \times \text{Active Width})$$

$$\text{Splice Feet} = \text{Splices Count} \times \frac{\text{Overlap (in)}}{12}$$
$$\text{Total Linear Feet} = (\text{Net Linear Feet} + \text{Splice Feet}) \times 1.10 \quad \text{(with 10\% waste)}$$

$$\text{Total 20 ft Sticks} = \left\lceil \frac{\text{Total Linear Feet}}{20} \right\rceil$$

$$\text{Weight (lbs)} = \text{Total Linear Feet} \times \text{Unit Weight (lbs/ft)}$$

---

## Rebar Reference Grid Table (18-Inch Grid Spacing, #4 Rebar, $0.85/ft)

| Slab Size (L × W) | Active Grid Area | Net Linear Feet | Total Linear Feet (+Splices & Waste) | 20 ft Sticks Needed | Weight (lbs) | Total Cost |
|---|---|---|---|---|---|---|
| **10 ft × 10 ft** | 9.5 ft × 9.5 ft | 133 ft | **150 ft** | **8 Sticks** | **100 lbs** | **$127.50** |
| **20 ft × 20 ft** | 19.5 ft × 19.5 ft | 546 ft | **630 ft** | **32 Sticks** | **421 lbs** | **$535.50** |
| **30 ft × 20 ft** | 29.5 ft × 19.5 ft | 841 ft | **980 ft** | **49 Sticks** | **655 lbs** | **$833.00** |
| **40 ft × 30 ft** | 39.5 ft × 29.5 ft | 1,740 ft | **2,050 ft** | **103 Sticks** | **1,369 lbs** | **$1,742.50** |

---

## Step-by-Step Guide: How to Layout and Calculate Rebar Grids

1. **Measure Slab Footprint**: Determine total exterior length and width of the concrete formwork.
2. **Select Grid Spacing**: Standard residential patio slabs use 18-inch spacing; driveways use 12-inch or 15-inch spacing.
3. **Account for Overlaps**: When connecting rebar sticks end-to-end, overlap ends by at least 12 inches and tie with rebar wire.
4. **Elevate on Rebar Chairs**: Support the grid on 2-inch plastic or concrete chairs so steel rests in the middle third of the slab.

---

## Frequently Asked Questions

### How far apart should rebar be spaced in a concrete slab?
Standard residential slab rebar spacing ranges from 12 to 18 inches center-to-center in a crisscross grid pattern.

### What size rebar is best for driveways and patios?
#4 rebar (1/2-inch diameter) is the standard recommendation for residential concrete driveways, patios, and garage slabs.

### How much lap splice overlap is required for rebar?
Code generally requires a lap splice overlap equal to 30 to 40 times the bar diameter, which is approximately 12 to 18 inches for #4 rebar.

### How heavy is #4 rebar per foot?
#4 rebar weighs 0.668 lbs per linear foot. A standard 20-foot stick weighs approximately 13.36 lbs.

### Why is edge clearance required for rebar?
Maintaining 2 to 3 inches of concrete coverage around rebar prevents moisture penetration, rust corrosion, and concrete spalling.

### What length do rebar sticks come in?
Standard rebar is sold in 20-foot long sticks at building supply yards.

### Is my data stored on external servers?
No. All calculation logic runs locally inside your browser.
