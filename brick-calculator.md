---
layout: tool
title: "Brick Calculator | Modular & Standard Brick Count"
description: "Calculate standard modular bricks, mortar bags, wall area, waste allowances, and material cost for brick veneer walls and masonry projects."
permalink: /brick-calculator
tool_id: brick-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: wallLengthFt
    label: Wall Length (Feet)
    type: number
    default: 30
    step: 1
    min: 1
    placeholder: "e.g., 30"

  - id: wallHeightFt
    label: Wall Height (Feet)
    type: number
    default: 8
    step: 0.5
    min: 1
    placeholder: "e.g., 8"

  - id: brickSize
    label: Brick Type & Dimensions
    type: select
    default: "standard_modular"
    options:
      - value: "standard_modular"
        label: "Standard Modular (3-5/8\" x 2-1/4\" x 7-5/8\" — 6.86 / sq ft)"
      - value: "queen"
        label: "Queen Size (3\" x 2-3/4\" x 7-5/8\" — 5.76 / sq ft)"
      - value: "king"
        label: "King Size (3\" x 2-5/8\" x 9-5/8\" — 4.50 / sq ft)"
      - value: "utility"
        label: "Utility Brick (3-5/8\" x 3-5/8\" x 11-5/8\" — 3.00 / sq ft)"
      - value: "engineer"
        label: "Engineer Modular (3-5/8\" x 2-3/4\" x 7-5/8\" — 5.76 / sq ft)"

  - id: mortarJointInches
    label: Mortar Joint Thickness (Inches)
    type: number
    default: 0.375
    step: 0.125
    min: 0.25
    max: 0.75
    placeholder: "Standard: 3/8\" (0.375)"

  - id: wastePct
    label: Cutting & Loss Allowance (%)
    type: number
    default: 5
    step: 1
    min: 0
    max: 20
    suffix: '%'
    placeholder: "e.g., 5"

  - id: pricePerThousand
    label: Price per 1,000 Bricks
    type: number
    default: 750.00
    step: 25.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 750.00"

outputs:
  - id: totalWallSqFt
    label: Total Wall Surface Area (Sq Ft)
  - id: bricksPerSqFt
    label: Nominal Bricks per Sq Ft
  - id: totalBricksNeeded
    label: Total Bricks Required (with Waste)
  - id: mortarBagsNeeded
    label: Mortar Bags Required (80 lb)
  - id: totalMaterialCost
    label: Total Material Cost

charts:
  tabs:
    - id: brickCountBreakdown
      label: Net Bricks vs Waste Allowance
    - id: costBreakdown
      label: Brick & Mortar Cost Breakdown

history_columns:
  - key: wallLengthFt
    label: Dimensions (L x H)
    source: input
  - key: brickSize
    label: Brick Type
    source: input
  - key: totalWallSqFt
    label: Wall Area (sq ft)
    source: output
  - key: totalBricksNeeded
    label: Bricks Needed
    source: output
  - key: totalMaterialCost
    label: Total Cost ($)
    source: output

js_file: assets/js/calculators/brick-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Brick Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate required brick counts, mortar bags, wall square footage, and project costs for modular, queen, king, and utility bricks."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates brick quantities for Modular, Queen, King, Utility, and Engineer brick sizes"
    - "Accounts for 3/8-inch standard mortar joint spacing"
    - "Determines 80 lb mortar bag counts for Type N and Type S masonry mortars"
    - "Provides total project cost estimates based on price per 1,000 bricks"

breadcrumb:
  - name: Home
    url: /
  - name: Concrete & Masonry
    url: /concrete-masonry
  - name: Brick Calculator

howto:
  name: "How to Calculate Brick and Mortar Quantities"
  description: "Determine exact brick counts and mortar bags based on wall area and mortar joint thickness."
  step:
    - name: "Measure wall dimensions"
      text: "Multiply wall length by height in feet to calculate gross square footage, deducting window/door openings."
    - name: "Select brick size classification"
      text: "Choose standard Modular (6.86/sq ft), Queen (5.76/sq ft), King (4.50/sq ft), or Utility brick."
    - name: "Set mortar joint thickness"
      text: "Use standard 3/8-inch (0.375\") mortar joint thickness."
    - name: "Calculate total bricks and mortar bags"
      text: "Multiply net wall area by bricks per sq ft, add 5% waste allowance, and divide by 1,000 for brick order quantities."

faq:
  - question: "How many standard modular bricks are in 1 square foot of wall?"
    answer: "A single wythe brick wall constructed with Standard Modular bricks (3-5/8\" x 2-1/4\" x 7-5/8\") and standard 3/8-inch mortar joints requires 6.86 bricks per square foot."
  - question: "How many bricks are in a cube (pallet) of bricks?"
    answer: "A standard cube (pallet) of modular face bricks typically contains 500 to 525 bricks, weighing approximately 2,000 to 2,400 lbs."
  - question: "How many 80 lb bags of mortar are needed per 100 bricks?"
    answer: "Laying 1,000 standard modular bricks requires approximately 7 to 8 bags (80 lb each) of Type N masonry mortar mix—or roughly 1 bag per 125 to 140 bricks."
  - question: "What is the difference between modular, queen, and king size bricks?"
    answer: "Modular bricks (6.86/sq ft) are smaller and laid on 4-inch module grids. Queen bricks (5.76/sq ft) and King bricks (4.50/sq ft) are larger, requiring fewer bricks and less mortar per square foot."
  - question: "How do you account for windows and doors in brick wall calculations?"
    answer: "Calculate total gross wall square footage (Length x Height), measure each door and window opening (Width x Height), subtract opening areas from gross wall area, and apply your 5% waste factor."
  - question: "What waste percentage should be added for brick masonry?"
    answer: "Add 5% waste for simple straight wall runs. Add 8% to 10% waste for walls with arches, soldier courses, angled corners, or custom cuts."
  - question: "How much does 1,000 face bricks cost?"
    answer: "Standard red clay face bricks cost between $600 and $1,000 per 1,000 bricks ($0.60 to $1.00 per brick) for materials, while architectural or antique glazed bricks can exceed $1,500 per 1,000."
---

# Brick Calculator

Determine brick counts, mortar bag requirements, wall square footage, waste allowances, and material budgets for modular, queen, king, and utility brick masonry.

This 100% private, client-side calculator executes all masonry formulas directly inside your web browser with zero server data storage.

<!-- more -->

## Why Use the Brick Calculator?

Constructing exterior brick veneer walls, retaining walls, fireplaces, or brick paver patios requires accurate material takeoffs. Face bricks are ordered in increments of 1,000 units (or full cubes/pallets of 500 bricks). Under-estimating leads to delayed projects and potential color batch mismatches, while over-estimating results in hefty freight restock fees.

Using this **Brick Calculator** enables masons, home builders, and DIYers to:

1. **Calculate Exact Unit Counts:** Compute exact brick quantities across Modular, Queen, King, Utility, and Engineer brick size standards.
2. **Factor in Mortar Joint Dimensions:** Automatically adjust coverage area per unit based on standard $3/8\text{-inch}$ ($0.375\text{"}$) mortar joints.
3. **Determine Mortar Bag Volumes:** Calculate $80\text{ lb}$ bags of Type N or Type S premixed masonry mortar required per 1,000 bricks.
4. **Project Complete Material Costs:** Compute combined brick and mortar material costs before placing supplier orders.

---

## Mathematical Formulas & Mechanics

### 1. Wall Surface Area & Net Opening Deductions
$$\text{Area}_{\text{gross}} = L_{\text{wall}} \times H_{\text{wall}}$$
$$\text{Area}_{\text{net}} = \text{Area}_{\text{gross}} - \sum \left( W_{\text{opening}} \times H_{\text{opening}} \right)$$

### 2. Nominal Brick Face Dimensions (With Mortar Joint)
$$H_{\text{nominal}} = H_{\text{brick}} + T_{\text{mortar}}$$
$$L_{\text{nominal}} = L_{\text{brick}} + T_{\text{mortar}}$$
$$\text{Bricks per Sq Ft} = \frac{144}{H_{\text{nominal}} \times L_{\text{nominal}}}$$

Where nominal coverage constants for standard $3/8\text{"}$ mortar joints are:
- **Standard Modular ($3\frac{5}{8}" \times 2\frac{1}{4}" \times 7\frac{5}{8}"$):** $6.86\text{ bricks / sq ft}$
- **Queen Size ($3" \times 2\frac{3}{4}" \times 7\frac{5}{8}"$):** $5.76\text{ bricks / sq ft}$
- **King Size ($3" \times 2\frac{5}{8}" \times 9\frac{5}{8}"$):** $4.50\text{ bricks / sq ft}$
- **Utility Brick ($3\frac{5}{8}" \times 3\frac{5}{8}" \times 11\frac{5}{8}"$):** $3.00\text{ bricks / sq ft}$

### 3. Total Bricks & Mortar Bags Calculation
$$\text{Total Bricks} = \left\lceil \text{Area}_{\text{net}} \times \text{Bricks per Sq Ft} \times \left(1 + \frac{W}{100}\right) \right\rceil$$
$$\text{Mortar Bags (80 lb)} = \left\lceil \frac{\text{Total Bricks}}{130} \right\rceil$$
$$\text{Total Material Cost} = \left(\frac{\text{Total Bricks}}{1000} \times P_{\text{1k bricks}}\right) + (\text{Mortar Bags} \times P_{\text{bag}})$$

---

## Real-World Comparison & Benchmark Table

Coverage comparison and mortar usage across standard residential brick classifications:

| Brick Classification | Individual Dimensions ($W \times H \times L$) | Bricks / Sq Ft ($3/8\text{"}$ Joint) | Bricks per 1,000 Sq Ft | Mortar Bags (80 lb) / 1k Bricks | Material Cost / 1k Units |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Modular** | $3\frac{5}{8}" \times 2\frac{1}{4}" \times 7\frac{5}{8}"$ | **6.86** | 6,860 Bricks | 7.5 Bags | $\$650 - \$900$ |
| **Engineer Modular** | $3\frac{5}{8}" \times 2\frac{3}{4}" \times 7\frac{5}{8}"$ | **5.76** | 5,760 Bricks | 7.0 Bags | $\$700 - \$950$ |
| **Queen Size** | $3" \times 2\frac{3}{4}" \times 7\frac{5}{8}"$ | **5.76** | 5,760 Bricks | 6.8 Bags | $\$600 - \$850$ |
| **King Size** | $3" \times 2\frac{5}{8}" \times 9\frac{5}{8}"$ | **4.50** | 4,500 Bricks | 6.0 Bags | $\$750 - \$1,050$ |
| **Utility Brick** | $3\frac{5}{8}" \times 3\frac{5}{8}" \times 11\frac{5}{8}"$ | **3.00** | 3,000 Bricks | 5.5 Bags | $\$900 - \$1,250$ |

---

## Step-by-Step How-To Guide

1. **Measure Wall Dimensions:** Measure length and height of wall in feet to calculate gross wall square footage.
2. **Select Brick Size & Type:** Choose standard Modular (6.86/sq ft), Queen, King, Utility, or Engineer brick formats.
3. **Specify Mortar Joint Thickness:** Keep standard 3/8-inch joint thickness or adjust for custom architectural joints.
4. **Input Cutting Waste Factor:** Add 5% waste allowance for standard straight runs or 10% for intricate designs.
5. **Review Brick & Mortar Orders:** Order calculated bricks (rounded up to full cubes of 500) and premixed mortar bags.

---

## Frequently Asked Questions

### How many standard modular bricks are in 1 square foot of wall?
A single wythe brick wall constructed with Standard Modular bricks (3-5/8" x 2-1/4" x 7-5/8") and standard 3/8-inch mortar joints requires 6.86 bricks per square foot.

### How many bricks are in a cube (pallet) of bricks?
A standard cube (pallet) of modular face bricks typically contains 500 to 525 bricks, weighing approximately 2,000 to 2,400 lbs.

### How many 80 lb bags of mortar are needed per 100 bricks?
Laying 1,000 standard modular bricks requires approximately 7 to 8 bags (80 lb each) of Type N masonry mortar mix—or roughly 1 bag per 125 to 140 bricks.

### What is the difference between modular, queen, and king size bricks?
Modular bricks (6.86/sq ft) are smaller and laid on 4-inch module grids. Queen bricks (5.76/sq ft) and King bricks (4.50/sq ft) are larger, requiring fewer bricks and less mortar per square foot.

### How do you account for windows and doors in brick wall calculations?
Calculate total gross wall square footage (Length x Height), measure each door and window opening (Width x Height), subtract opening areas from gross wall area, and apply your 5% waste factor.

### What waste percentage should be added for brick masonry?
Add 5% waste for simple straight wall runs. Add 8% to 10% waste for walls with arches, soldier courses, angled corners, or custom cuts.

### How much does 1,000 face bricks cost?
Standard red clay face bricks cost between $600 and $1,000 per 1,000 bricks ($0.60 to $1.00 per brick) for materials, while architectural or antique glazed bricks can exceed $1,500 per 1,000.
