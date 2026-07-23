---
layout: tool
title: Brick Calculator – Estimate Bricks, Mortar Bags & Masonry Material Costs
description: Calculate standard modular, closure, utility, and queen brick quantities for wall areas, incorporating 10% waste, mortar bag counts, and project costs.
permalink: /brick-calculator
tool_id: brick-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: wallLength
    label: Wall Length (Feet)
    type: number
    default: 30
    step: 1
    min: 1
    placeholder: "e.g., 30"

  - id: wallHeight
    label: Wall Height (Feet)
    type: number
    default: 8
    step: 1
    min: 1
    placeholder: "e.g., 8"

  - id: openingArea
    label: Door & Window Openings (Sq Ft)
    type: number
    default: 21
    step: 1
    min: 0
    placeholder: "e.g., 21"

  - id: brickType
    label: Brick Type & Size
    type: select
    default: "modular"
    options:
      - value: "modular"
        label: "Standard Modular (2-1/4\" x 3-5/8\" x 7-5/8\" — 6.55/sq ft)"
      - value: "closure"
        label: "Closure / Engineer (3-5/8\" x 3-5/8\" x 7-5/8\" — 4.5/sq ft)"
      - value: "utility"
        label: "Utility Brick (3-5/8\" x 3-5/8\" x 11-5/8\" — 3.0/sq ft)"
      - value: "queen"
        label: "Queen Size (2-3/4\" x 3\" x 7-5/8\" — 5.8/sq ft)"

  - id: wasteFactor
    label: Waste & Cut Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePerBrick
    label: Price per Brick 
    type: number
    default: 0.85
    step: 0.05
    min: 0
    prefix: '$'
    placeholder: "e.g., 0.85"

  - id: pricePerMortarBag
    label: Price per 80lb Mortar Bag 
    type: number
    default: 12.50
    step: 0.50
    min: 0
    prefix: '$'
    placeholder: "e.g., 12.50"

outputs:
  - id: totalBricks
    label: Total Bricks Needed (with Waste)
  - id: netWallArea
    label: Net Wall Area (Sq Ft)
  - id: mortarBags
    label: 80lb Mortar Bags Required
  - id: totalCost
    label: Total Material Cost

charts:
  tabs:
    - id: brickVsMortar
      label: Brick Count vs Mortar Bags
    - id: costSplit
      label: Bricks Cost vs Mortar Cost

history_columns:
  - key: wallLength
    label: Wall Length (ft)
    source: input
  - key: brickType
    label: Brick Type
    source: input
  - key: totalBricks
    label: Bricks Needed
    source: output
  - key: mortarBags
    label: Mortar Bags
    source: output
  - key: totalCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/brick-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Brick Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate standard modular bricks, closure bricks, utility bricks, and mortar bag requirements for any masonry wall area."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates exact brick count for modular, closure, utility, and queen sizes"
    - "Deducts door and window opening square footage"
    - "Includes mortar bag estimation (80lb pre-mixed bags)"
    - "Adds customizable waste factor (5% to 20%)"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Brick Calculator

howto:
  name: "How to Calculate Bricks and Mortar for Wall Construction"
  description: "Accurately estimate face brick counts, window/door deductions, and mortar requirements."
  step:
    - name: "Measure gross wall dimensions"
      text: "Multiply total wall length by wall height to obtain gross surface area."
    - name: "Deduct openings"
      text: "Subtract total square footage of all windows, doors, and architectural openings."
    - name: "Choose brick size"
      text: "Select your brick type (standard modular face brick requires 6.55 bricks per sq ft with 3/8\" joints)."
    - name: "Add waste factor and calculate total material budget"
      text: "Include 10% for cuts and breakage, then calculate mortar bags and total cost."

faq:
  - question: "How many standard modular bricks are in a square foot of wall?"
    answer: "A standard single-wythe wall built with modular face bricks (2-1/4\" x 3-5/8\" x 7-5/8\") and standard 3/8\" mortar joints requires approximately 6.55 bricks per square foot."
  - question: "How many bricks are in a thousand (1,000) modular brick order?"
    answer: "A cube of standard modular bricks typically contains 525 bricks. Ordering 1,000 bricks will cover roughly 152 square feet of single-wythe wall area before waste."
  - question: "How many bags of mortar do I need per 1,000 bricks?"
    answer: "For every 1,000 standard modular bricks laid with 3/8\" mortar joints, you will need approximately 7 bags of 80 lb pre-mixed masonry mortar mix."
  - question: "What is the standard waste factor for brick laying?"
    answer: "A standard waste factor of 10% is recommended for straight rectangular walls. Increase this to 15% for complex designs with gables, arches, or frequent window cuts."
  - question: "What is the difference between single-wythe and double-wythe brick walls?"
    answer: "A single-wythe wall is a single layer of brick attached as a veneer to framing. A double-wythe wall consists of two parallel layers of brick tied together for structural support, requiring double the brick count."
  - question: "Can I use this calculator for brick pavers?"
    answer: "While brick pavers have similar surface areas (typically 4.5 to 5 pavers/sq ft for standard 4x8 pavers), paver patios use sand bedding instead of mortar bags."
  - question: "Does brick size significantly impact overall project labor?"
    answer: "Yes. Larger units like Utility bricks (3.0 bricks/sq ft) install much faster per square foot than modular bricks (6.55 bricks/sq ft), reducing total mason labor hours."
---

Estimate total brick counts, 80lb mortar bags, and material expenses for single-wythe brick walls across modular, engineer, utility, and queen brick dimensions.

<!-- more -->

## Why Use the Brick Calculator?

Brick masonry estimation requires precise calculations that factor in brick dimensions, joint thickness (standard 3/8"), opening deductions, and mortar requirements. Purchasing insufficient brick leads to batch color variation (dye-lot mismatch), while over-purchasing wastes construction budget.

This **Brick Calculator** enables homeowners, contractors, and masons to quickly determine:
1. Exact brick requirements based on real net wall area.
2. Necessary mortar mix bags (80 lb standard).
3. Total material expenses including customizable waste factors.

---

## Brick Calculation Formulas

### 1. Net Wall Area Calculation
Gross wall area is calculated and window/door openings are subtracted:

$$A_{\text{net}} = (L_{\text{wall}} \times H_{\text{wall}}) - A_{\text{openings}}$$

### 2. Brick Quantity Formula
Total brick count incorporating unit coverage factor ($C_{\text{brick}}$) and waste allowance ($W$):

$$N_{\text{bricks}} = \left\lceil A_{\text{net}} \times C_{\text{brick}} \times \left(1 + \frac{W}{100}\right) \right\rceil$$

Where standard coverage values ($C_{\text{brick}}$) with 3/8" joints are:
* **Standard Modular:** $6.55\text{ bricks/ft}^2$
* **Closure / Engineer:** $4.50\text{ bricks/ft}^2$
* **Utility Brick:** $3.00\text{ bricks/ft}^2$
* **Queen Size:** $5.80\text{ bricks/ft}^2$

### 3. Mortar Bag Calculation
Mortar requirements are estimated based on total brick count:

$$N_{\text{mortar\_bags}} = \left\lceil \frac{N_{\text{bricks}}}{143} \right\rceil$$

*(Since 1,000 bricks require ~7 bags of 80lb mortar, $\frac{1000}{7} \approx 143$ bricks per bag).*

---

## Standard Brick Sizes & Coverage Comparison

| Brick Type | Nominal Dimensions (D x H x L) | Bricks per Sq Ft | Bricks per 100 Sq Ft | Mortar Bags per 100 Sq Ft |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Modular** | 3-5/8" x 2-1/4" x 7-5/8" | 6.55 | 655 Bricks | 4.6 Bags |
| **Queen Size** | 3" x 2-3/4" x 7-5/8" | 5.80 | 580 Bricks | 4.1 Bags |
| **Closure / Engineer** | 3-5/8" x 3-5/8" x 7-5/8" | 4.50 | 450 Bricks | 3.2 Bags |
| **Utility Brick** | 3-5/8" x 3-5/8" x 11-5/8" | 3.00 | 300 Bricks | 2.1 Bags |

---

## Step-by-Step Masonry Estimation Guide

1. **Measure Exterior Walls:** Measure the linear length and height of each wall section in feet.
2. **Subtract Doors & Windows:** Calculate total square footage for doors (approx. 21 sq ft for standard 3x7 door) and windows (approx. 12-15 sq ft per window).
3. **Select Brick Specification:** Check architectural blueprints for specified brick type (modular is standard for residential veneer).
4. **Account for Waste & Color Matching:** Always order an additional 10% for cuts and future repairs to ensure all bricks come from the same manufacturing kiln run.
5. **Estimate Mortar & Supplies:** Calculate 80 lb mortar mix bags and wall ties (space wall ties 16" vertically and 24" horizontally).

---

## Frequently Asked Questions (FAQ)

### How many standard modular bricks are in a square foot of wall?
A standard single-wythe wall built with modular face bricks (2-1/4" x 3-5/8" x 7-5/8") and standard 3/8" mortar joints requires approximately 6.55 bricks per square foot.

### How many bricks are in a thousand (1,000) modular brick order?
A cube of standard modular bricks typically contains 525 bricks. Ordering 1,000 bricks will cover roughly 152 square feet of single-wythe wall area before waste.

### How many bags of mortar do I need per 1,000 bricks?
For every 1,000 standard modular bricks laid with 3/8" mortar joints, you will need approximately 7 bags of 80 lb pre-mixed masonry mortar mix.

### What is the standard waste factor for brick laying?
A standard waste factor of 10% is recommended for straight rectangular walls. Increase this to 15% for complex designs with gables, arches, or frequent window cuts.

### What is the difference between single-wythe and double-wythe brick walls?
A single-wythe wall is a single layer of brick attached as a veneer to framing. A double-wythe wall consists of two parallel layers of brick tied together for structural support, requiring double the brick count.

### Can I use this calculator for brick pavers?
While brick pavers have similar surface areas (typically 4.5 to 5 pavers/sq ft for standard 4x8 pavers), paver patios use sand bedding instead of mortar bags.

### Does brick size significantly impact overall project labor?
Yes. Larger units like Utility bricks (3.0 bricks/sq ft) install much faster per square foot than modular bricks (6.55 bricks/sq ft), reducing total mason labor hours.
