---
layout: tool
title: "Roof Underlayment Calculator | Synthetic & Felt Rolls"
description: "Calculate required rolls of synthetic, #30 felt, or peel-and-stick roof underlayment, accounting for pitch, overlaps, and waste margins."
permalink: /underlayment-calculator
tool_id: underlayment-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: roofAreaSqFt
    label: Total Sloped Roof Area (Sq Ft)
    type: number
    default: 2400
    step: 50
    min: 100
    placeholder: "e.g., 2400"

  - id: underlaymentType
    label: Underlayment Material & Roll Size
    type: select
    default: "synthetic"
    options:
      - value: "synthetic"
        label: "Synthetic Underlayment (1,000 Sq Ft / Roll — 10 Squares)"
      - value: "felt30"
        label: "#30 Heavy Organic Felt (216 Sq Ft / Roll — 2 Squares)"
      - value: "felt15"
        label: "#15 Organic Felt (432 Sq Ft / Roll — 4 Squares)"
      - value: "peel_stick"
        label: "Ice & Water Shield / Peel & Stick (200 Sq Ft / Roll)"

  - id: roofPitch
    label: Roof Pitch Slope Classification
    type: select
    default: "standard"
    options:
      - value: "standard"
        label: "Standard Slope (4/12 and Higher — Single Layer / 4\" Overlap)"
      - value: "low_slope"
        label: "Low Slope (2/12 to 4/12 — Double Layer / 19\" Overlap)"

  - id: wasteFactor
    label: Waste & Cut Margin (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePerRoll
    label: Price per Roll
    type: number
    default: 85.00
    step: 5.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 85.00"

outputs:
  - id: totalRolls
    label: Total Underlayment Rolls Required
  - id: totalRoofSquares
    label: Total Roof Squares (100 Sq Ft)
  - id: coveragePerRoll
    label: Effective Coverage Area per Roll
  - id: totalMaterialCost
    label: Total Underlayment Material Cost

charts:
  tabs:
    - id: rollBreakdown
      label: Net Rolls vs Waste Allowance Rolls
    - id: costComparison
      label: Material Cost Comparison

history_columns:
  - key: roofAreaSqFt
    label: Roof Area (sq ft)
    source: input
  - key: underlaymentType
    label: Material
    source: input
  - key: totalRolls
    label: Rolls Needed
    source: output
  - key: totalMaterialCost
    label: Total Cost ($)
    source: output

js_file: assets/js/calculators/underlayment-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Underlayment Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate total rolls of synthetic, #15, #30 felt, or peel-and-stick roof underlayment needed for any roof square footage."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Supports synthetic, #15 felt, #30 felt, and self-adhering ice & water membranes"
    - "Accounts for 4-inch side overlaps and 6-inch end laps"
    - "Handles double-layer underlayment for low-slope roof pitches (2/12 to 4/12)"
    - "Calculates exact material costs and roll waste allowances"

breadcrumb:
  - name: Home
    url: /
  - name: Roofing
    url: /roofing
  - name: Underlayment Calculator

howto:
  name: "How to Calculate Roof Underlayment Rolls"
  description: "Determine roll counts for synthetic underlayment or asphalt felt based on roof area, pitch, and lap overlaps."
  step:
    - name: "Determine total sloped roof area"
      text: "Input total sloped roof square footage, or calculate ground footprint multiplied by pitch slope factor."
    - name: "Select underlayment material type"
      text: "Choose synthetic underlayment, #30 heavy felt, #15 organic felt, or self-adhering ice & water membrane."
    - name: "Specify roof slope classification"
      text: "Select standard slope (single layer with 4-inch overlap) or low slope (double-layer coverage with 19-inch overlap)."
    - name: "Add waste factor and roll pricing"
      text: "Set 10% to 15% cut/ridge waste margin and enter material cost per roll to view total project estimates."

faq:
  - question: "How many square feet are in a roll of synthetic roof underlayment?"
    answer: "A standard roll of synthetic roof underlayment measures 4 feet wide by 250 feet long, containing 1,000 square feet (10 roofing squares) nominal gross area."
  - question: "How much actual roof coverage does a roll of synthetic underlayment provide?"
    answer: "After accounting for standard 4-inch horizontal laps and 6-inch end overlaps, a 1,000 sq ft synthetic roll covers approximately 880 to 900 square feet of actual roof surface."
  - question: "What underlayment is required for low-slope roofs (2/12 to 4/12 pitch)?"
    answer: "Building codes (IRC/IBC) require a double-layer underlayment application on low-slope roofs (2/12 to 4/12 pitch), achieved by overlapping courses by 19 inches (half-lap), effectively doubling roll requirements."
  - question: "Is synthetic underlayment better than #30 felt paper?"
    answer: "Synthetic underlayment is lighter, stronger, tear-resistant, covers up to 5x more area per roll than #30 felt, and offers superior UV exposure limits during installation."
  - question: "How many rolls of #30 felt do I need for a 2,000 sq ft roof?"
    answer: "A roll of #30 felt covers 216 sq ft gross (approx 190 sq ft net). For a 2,000 sq ft roof with 10% waste, you need approximately 12 rolls of #30 felt."
  - question: "What is the recommended overlap for roof underlayment seams?"
    answer: "Standard slope roofs require a minimum 4-inch horizontal side lap and 6-inch vertical end lap. Eaves and valleys in cold climates require self-adhering ice & water shield."
  - question: "How much waste allowance should be added for roof hips and valleys?"
    answer: "Simple gable roofs require 5% to 10% waste, while complex roofs with hips, valleys, dormers, and skylights require 12% to 15% waste."
---

# Underlayment Calculator

Determine roll quantities, net coverage areas, and material costs for synthetic, #30 felt, #15 felt, and peel-and-stick ice & water membrane installations.

This 100% private, client-side calculator computes roof underlayment needs directly in your web browser without storing or transmitting data.

<!-- more -->

## Why Use the Underlayment Calculator?

Roof underlayment serves as the critical secondary water barrier protecting wooden decking from moisture intrusion, ice dams, and wind-driven rain. Ordering underlayment based on gross roll square footage without factoring in lap seams, slope requirements, and cut waste leads to running out of material mid-job.

Utilizing this **Underlayment Calculator** helps roofing contractors and DIY homeowners:

1. **Account for Overlaps accurately:** Factor in standard 4-inch side laps and 6-inch end laps that reduce nominal roll coverage by 10% to 12%.
2. **Handle Low-Slope Double Layering:** Automatically double roll estimates when roof pitches fall between 2/12 and 4/12 as mandated by building codes.
3. **Compare Synthetic vs. Organic Felt Costs:** Evaluate project cost differences between high-coverage synthetic rolls (10 squares) and traditional #30 felt rolls (2 squares).
4. **Prevent Jobsite Downtime:** Ensure sufficient materials arrive on-site for hips, valleys, and ridge caps.

---

## Mathematical Formulas & Mechanics

### 1. Roof Squares & Waste Area Formula
$$\text{Roof Squares} = \frac{A_{\text{roof}}}{100}$$
$$A_{\text{gross}} = A_{\text{roof}} \times \left(1 + \frac{W}{100}\right)$$

### 2. Effective Net Roll Coverage Area
$$\text{Net Roll Coverage} = A_{\text{roll}} \times \left(1 - \frac{\text{Lap Overhead (\%)}}{100}\right)$$

Where nominal roll areas ($A_{\text{roll}}$) are:
- **Synthetic Underlayment:** $1,000\text{ sq ft}$ (Net $\approx 885\text{ sq ft}$)
- **#30 Heavy Felt:** $216\text{ sq ft}$ (Net $\approx 190\text{ sq ft}$)
- **#15 Organic Felt:** $432\text{ sq ft}$ (Net $\approx 380\text{ sq ft}$)
- **Peel & Stick Ice Shield:** $200\text{ sq ft}$ (Net $\approx 180\text{ sq ft}$)

### 3. Total Required Rolls & Material Cost
$$\text{Total Rolls (Standard Slope)} = \left\lceil \frac{A_{\text{gross}}}{\text{Net Roll Coverage}} \right\rceil$$
$$\text{Total Rolls (Low Slope 2/12 - 4/12)} = 2 \times \left\lceil \frac{A_{\text{gross}}}{\text{Net Roll Coverage}} \right\rceil$$
$$\text{Total Material Cost} = \text{Total Rolls} \times \text{Price per Roll}$$

---

## Real-World Comparison & Benchmark Table

Material comparison and roll requirements for a standard $2,500\text{ sq ft}$ roof surface:

| Underlayment Type | Nominal Roll Size | Net Coverage / Roll | Rolls Needed (25 Squares + 10% Waste) | Weight per Roll | Exposure Limit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Synthetic Membrane** | $1,000\text{ sq ft}$ ($4' \times 250'$) | $\approx 885\text{ sq ft}$ | **4 Rolls** | $23 - 30\text{ lbs}$ | Up to 180 Days |
| **#30 Heavy Organic Felt** | $216\text{ sq ft}$ ($3' \times 72'$) | $\approx 190\text{ sq ft}$ | **15 Rolls** | $45 - 50\text{ lbs}$ | $24 - 48\text{ Hours}$ |
| **#15 Organic Felt** | $432\text{ sq ft}$ ($3' \times 144'$) | $\approx 380\text{ sq ft}$ | **8 Rolls** | $45 - 50\text{ lbs}$ | Immediate Coverage |
| **Peel & Stick Ice Shield** | $200\text{ sq ft}$ ($3' \times 66.7'$) | $\approx 180\text{ sq ft}$ | **16 Rolls** | $50 - 60\text{ lbs}$ | $30 - 90\text{ Days}$ |

---

## Step-by-Step How-To Guide

1. **Measure Sloped Roof Area:** Determine total sloped square footage or calculate ground footprint multiplied by pitch slope multiplier.
2. **Select Material Type:** Choose synthetic underlayment, #30 felt, #15 felt, or self-adhered peel-and-stick ice & water shield.
3. **Select Pitch Slope Classification:** Choose standard slope ($\ge 4/12$) or low slope ($2/12$ to $4/12$ requiring double-layer application).
4. **Input Cut & Waste Percentage:** Set waste factor (typically 10% for gable roofs; 12-15% for hip/dormer roofs).
5. **Set Material Price per Roll:** Input your local supplier pricing per roll to calculate full material expenditure.

---

## Frequently Asked Questions

### How many square feet are in a roll of synthetic roof underlayment?
A standard roll of synthetic roof underlayment measures 4 feet wide by 250 feet long, containing 1,000 square feet (10 roofing squares) nominal gross area.

### How much actual roof coverage does a roll of synthetic underlayment provide?
After accounting for standard 4-inch horizontal laps and 6-inch end overlaps, a 1,000 sq ft synthetic roll covers approximately 880 to 900 square feet of actual roof surface.

### What underlayment is required for low-slope roofs (2/12 to 4/12 pitch)?
Building codes (IRC/IBC) require a double-layer underlayment application on low-slope roofs (2/12 to 4/12 pitch), achieved by overlapping courses by 19 inches (half-lap), effectively doubling roll requirements.

### Is synthetic underlayment better than #30 felt paper?
Synthetic underlayment is lighter, stronger, tear-resistant, covers up to 5x more area per roll than #30 felt, and offers superior UV exposure limits during installation.

### How many rolls of #30 felt do I need for a 2,000 sq ft roof?
A roll of #30 felt covers 216 sq ft gross (approx 190 sq ft net). For a 2,000 sq ft roof with 10% waste, you need approximately 12 rolls of #30 felt.

### What is the recommended overlap for roof underlayment seams?
Standard slope roofs require a minimum 4-inch horizontal side lap and 6-inch vertical end lap. Eaves and valleys in cold climates require self-adhering ice & water shield.

### How much waste allowance should be added for roof hips and valleys?
Simple gable roofs require 5% to 10% waste, while complex roofs with hips, valleys, dormers, and skylights require 12% to 15% waste.
