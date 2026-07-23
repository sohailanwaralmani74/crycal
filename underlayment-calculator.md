---
layout: tool
title: Underlayment Calculator – Synthetic & #30 Felt Roofing Rolls
description: Calculate total rolls of synthetic or #30 felt roof underlayment needed for any roof square footage, factoring in 4" lap overlaps, roof pitch, and roll prices.
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
    label: Total Underlayment Rolls Required (with Waste)
  - id: totalRoofSquares
    label: Total Roof Squares (100 Sq Ft = 1 Square)
  - id: coveragePerRoll
    label: Effective Coverage Area per Roll (Sq Ft)
  - id: totalMaterialCost
    label: Total Underlayment Material Cost

charts:
  tabs:
    - id: rollBreakdown
      label: Net Rolls Required vs Waste Allowance Rolls
    - id: costComparison
      label: Material Cost Comparison (Synthetic vs #30 Felt vs Ice Shield)

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
  - key: coveragePerRoll
    label: Roll Coverage
    source: output
  - key: totalMaterialCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/underlayment-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Underlayment Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate synthetic underlayment, #30 felt, #15 felt, and self-adhering ice & water shield roll quantities with lap seam overlaps and low-slope double coverage options."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates roll counts for synthetic, #30 felt, #15 felt, and peel & stick underlayments"
    - "Accounts for 4\" horizontal side lap and 6\" vertical end lap seam overlaps"
    - "Supports low-slope (2/12 to 4/12) double-coverage application code mandates"
    - "Calculates total roof squares and material costs"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Underlayment Calculator

howto:
  name: "How to Calculate Roof Underlayment Rolls"
  description: "Determine exact roll counts of synthetic or felt underlayment required for steep and low-slope roof replacement."
  step:
    - name: "Determine total sloped roof surface area"
      text: "Calculate actual pitched roof square footage (or multiply flat footprint by slope multiplier)."
    - name: "Select underlayment material type"
      text: "Choose synthetic underlayment (10-square rolls), #30 heavy felt, #15 felt, or peel & stick ice guard."
    - name: "Identify roof slope coverage rules"
      text: "Select standard slope (single layer with 4\" lap) or low-slope 2/12-4/12 (double layer with 19\" lap)."
    - name: "Add waste factor and estimate budget"
      text: "Include 10% waste for hip, valley, and ridge cuts to calculate total roll order."

faq:
  - question: "How many square feet does a roll of synthetic roof underlayment cover?"
    answer: "A standard 10-square roll of synthetic underlayment measures 4 feet wide by 250 feet long (1,000 gross sq ft). Factoring in 4-inch horizontal laps and end laps, one synthetic roll provides approximately 900 sq ft of net coverage."
  - question: "How many rolls of #30 felt are needed for a 2,000 sq ft roof?"
    answer: "A roll of #30 felt covers 200 gross sq ft (approx 190 net sq ft). For a 2,000 sq ft roof, you need 11 rolls net, or 12 rolls including a 10% waste factor."
  - question: "What is the difference between synthetic underlayment and #30 felt?"
    answer: "Synthetic underlayment is made from woven polypropylene, making it 5x lighter, 10x stronger, tear-resistant, UV resistant for up to 180 days, and providing 900 sq ft of net coverage per roll compared to 190 sq ft per roll for heavy organic #30 felt."
  - question: "What underlayment lap overlap is required by building code?"
    answer: "IRC code requires a minimum 2-inch horizontal lap overlap and 4-inch end lap overlap for standard slopes (4/12 and steeper). Manufacturers strongly recommend 4-inch horizontal laps for enhanced water resistance."
  - question: "How many layers of underlayment are required for low-slope roofs (2/12 to 4/12)?"
    answer: "Building code mandates double-coverage underlayment on low slopes between 2/12 and 4/12. Each horizontal course must overlap the lower course by 19 inches (half the width of a 36-inch felt roll), requiring double the roll count."
  - question: "Where should self-adhering Ice & Water Shield be installed?"
    answer: "Ice & water shield membrane should be installed along roof eaves (extending 24 inches inside the interior warm wall line), inside roof valleys, around chimneys, and along low-slope dead valleys."
  - question: "What is a roof 'Square'?"
    answer: "In roofing terminology, one 'Square' equals exactly 100 square feet of roof surface area."
---

Calculate synthetic underlayment, #30 felt, #15 felt, and ice & water shield roll quantities, effective net coverage, and material costs for roof replacements.

<!-- more -->

## Why Use the Underlayment Calculator?

Roof underlayment serves as the critical secondary water barrier beneath shingles, tile, or metal roofing. Purchasing insufficient underlayment leaves roof sheathing exposed to rain storms during tear-off, while over-purchasing wastes roofing budget.

This **Underlayment Calculator** accounts for gross roll dimensions, effective net coverage after horizontal lap seams ($4"$), end lap waste ($6"$), low-slope double-coverage code mandates ($2/12$ to $4/12$), and overall waste allowances.

### Key Benefits
* **Net vs Gross Coverage Accuracy:** Automatically deducts lap seam waste from gross roll square footage.
* **Low-Slope Double Coverage:** Integrates IRC mandates requiring 19" overlap ($2\times$ material) for roofs between 2/12 and 4/12 pitch.
* **Material Comparison:** Evaluates synthetic (10-square rolls), #30 felt, #15 felt, and peel & stick membranes.
* **Roof Square Conversion:** Instantly converts total square footage into roofing squares ($100\text{ sq ft} = 1\text{ Square}$).

---

## Underlayment Formulas & Lap Geometry

### 1. Effective Net Roll Coverage
Gross roll area ($A_{\text{gross}}$) is reduced by horizontal lap factor ($L_{\text{lap}}$):

$$A_{\text{net\_roll}} = A_{\text{gross}} \times (1 - L_{\text{lap\_factor}})$$

* **Synthetic (1,000 sq ft):** Net coverage $\approx 900\text{ sq ft}$ ($10\%$ lap reduction)
* **#30 Felt (216 sq ft):** Net coverage $\approx 190\text{ sq ft}$ ($12\%$ lap reduction)
* **#15 Felt (432 sq ft):** Net coverage $\approx 380\text{ sq ft}$ ($12\%$ lap reduction)
* **Peel & Stick (200 sq ft):** Net coverage $\approx 180\text{ sq ft}$ ($10\%$ lap reduction)

### 2. Low-Slope Double-Coverage Multiplier
For low slopes ($2/12 \le \text{Pitch} < 4/12$), double coverage increases material requirements:

$$M_{\text{slope\_coverage}} = \begin{cases} 1.0 & \text{for Standard Slope } (\ge 4/12) \\ 1.90 & \text{for Low Slope } (2/12 \text{ to } 4/12) \end{cases}$$

### 3. Total Order Roll Count Formula
Total rolls required ($N_{\text{rolls}}$) with waste ($W$):

$$N_{\text{rolls}} = \left\lceil \frac{A_{\text{roof}} \times M_{\text{slope\_coverage}}}{A_{\text{net\_roll}}} \times \left(1 + \frac{W}{100}\right) \right\rceil$$

---

## Roof Underlayment Material Comparison Table

The reference table below compares roll coverage and costs per 2,000 sq ft roof (standard slope, 10% waste):

| Underlayment Type | Gross Roll Area | Net Coverage / Roll | Rolls Needed (2,000 Sq Ft Roof) | Average Price / Roll | Total Material Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Synthetic (10-Square)** | 1,000 Sq Ft | 900 Sq Ft | 3 Rolls | $85.00 | $255.00 |
| **#30 Heavy Organic Felt** | 216 Sq Ft | 190 Sq Ft | 12 Rolls | $28.00 | $336.00 |
| **#15 Standard Organic Felt** | 432 Sq Ft | 380 Sq Ft | 6 Rolls | $26.00 | $156.00 |
| **Peel & Stick Ice Shield** | 200 Sq Ft | 180 Sq Ft | 13 Rolls | $95.00 | $1,235.00 |

---

## Step-by-Step Installation Guide

1. **Calculate Roof Surface Area:** Multiply roof footprint area by the pitch slope multiplier factor (e.g., $1.118$ for 6/12 pitch).
2. **Select Underlayment Specification:** Use synthetic underlayment for modern shingle installations due to superior tear strength and slip resistance.
3. **Install Eave Ice & Water Shield First:** Apply self-adhering membrane along lower roof eaves before rolling out synthetic underlayment.
4. **Roll Out Horizontally from Eave to Ridge:** Unroll underlayment parallel to eaves, overlapping lower courses by at least 4 inches.
5. **Fasten with Plastic Cap Nails:** Secure underlayment using pneumatic plastic cap nails spaced 12 inches along edges and 24 inches down the center grid.

---

## Frequently Asked Questions (FAQ)

### How many square feet does a roll of synthetic roof underlayment cover?
A standard 10-square roll of synthetic underlayment measures 4 feet wide by 250 feet long (1,000 gross sq ft). Factoring in 4-inch horizontal laps and end laps, one synthetic roll provides approximately 900 sq ft of net coverage.

### How many rolls of #30 felt are needed for a 2,000 sq ft roof?
A roll of #30 felt covers 200 gross sq ft (approx 190 net sq ft). For a 2,000 sq ft roof, you need 11 rolls net, or 12 rolls including a 10% waste factor.

### What is the difference between synthetic underlayment and #30 felt?
Synthetic underlayment is made from woven polypropylene, making it 5x lighter, 10x stronger, tear-resistant, UV resistant for up to 180 days, and providing 900 sq ft of net coverage per roll compared to 190 sq ft per roll for heavy organic #30 felt.

### What underlayment lap overlap is required by building code?
IRC code requires a minimum 2-inch horizontal lap overlap and 4-inch end lap overlap for standard slopes (4/12 and steeper). Manufacturers strongly recommend 4-inch horizontal laps for enhanced water resistance.

### How many layers of underlayment are required for low-slope roofs (2/12 to 4/12)?
Building code mandates double-coverage underlayment on low slopes between 2/12 and 4/12. Each horizontal course must overlap the lower course by 19 inches (half the width of a 36-inch felt roll), requiring double the roll count.

### Where should self-adhering Ice & Water Shield be installed?
Ice & water shield membrane should be installed along roof eaves (extending 24 inches inside the interior warm wall line), inside roof valleys, around chimneys, and along low-slope dead valleys.

### What is a roof 'Square'?
In roofing terminology, one 'Square' equals exactly 100 square feet of roof surface area.
