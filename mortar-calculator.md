---
layout: tool
title: "Mortar Calculator | Brick & CMU Block Mortar Bags"
description: "Calculate 70lb or 80lb mortar bags, total cubic feet of mortar, masonry units, and costs for brick veneer or CMU block wall construction."
permalink: /mortar-calculator
tool_id: mortar-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: unitType
    label: Masonry Unit Type & Size
    type: select
    default: "brick"
    options:
      - value: "brick"
        label: "Standard Modular Brick (3-5/8 x 2-1/4 x 7-5/8)"
      - value: "cmu8"
        label: "8 x 8 x 16 Standard Concrete Block (CMU)"
      - value: "cmu12"
        label: "12 x 8 x 16 Heavy Structural Block (CMU)"
      - value: "stone"
        label: "Manufactured Stone Veneer (Per Sq Ft)"

  - id: unitCount
    label: Total Masonry Units (Bricks / Blocks / Sq Ft)
    type: number
    default: 1000
    step: 50
    min: 10
    placeholder: "e.g., 1000"

  - id: jointThickness
    label: Mortar Joint Thickness (Inches)
    type: number
    default: 0.375
    step: 0.0625
    min: 0.25
    max: 0.75
    placeholder: "0.375 for 3/8 joint"

  - id: bagWeight
    label: Pre-Mixed Mortar Bag Size
    type: select
    default: "80"
    options:
      - value: "80"
        label: "80 lb Mortar Bag (0.67 cu ft yield)"
      - value: "70"
        label: "70 lb Mortar Bag (0.58 cu ft yield)"

  - id: wasteFactor
    label: Mortar Waste & Scraping Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 25
    placeholder: "e.g., 10"

  - id: pricePerBag
    label: Cost per Mortar Bag ($)
    type: number
    default: 9.25
    step: 0.25
    min: 0
    prefix: '$'
    placeholder: "e.g., 9.25"

outputs:
  - id: totalMortarBags
    label: Mortar Bags Required
  - id: mortarCubicFeet
    label: Total Mortar Volume (Cubic Feet)
  - id: sandWeightTons
    label: Equivalent Masonry Sand (Jobsite Mix Tons)
  - id: masonryCementBags
    label: Equivalent Masonry Cement Bags (94lb)
  - id: totalMortarCost
    label: Total Mortar Material Cost

charts:
  tabs:
    - id: mortarQuantities
      label: Mortar Volume & Bag Allowance
    - id: mixTypeComparison
      label: Pre-Mixed Bags vs Jobsite Bulk Mix Cost

history_columns:
  - key: unitType
    label: Unit Type
    source: input
  - key: unitCount
    label: Unit Count
    source: input
  - key: totalMortarBags
    label: Mortar Bags
    source: output
  - key: mortarCubicFeet
    label: Volume (cu ft)
    source: output
  - key: totalMortarCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/mortar-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Mortar Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate 70lb or 80lb pre-mixed mortar bags, total cubic feet, masonry cement, and sand for brick and CMU block laying."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates mortar volume for standard modular brick, CMU blocks, and stone veneer"
    - "Determines 80lb or 70lb pre-mixed Type N, S, or M mortar bag requirements"
    - "Computes equivalent masonry cement bags and sand tonnage for jobsite mixing"
    - "Includes customizable joint thickness and waste allowances"

breadcrumb:
  - name: Home
    url: /
  - name: Concrete & Masonry
    url: /concrete-masonry
  - name: Mortar Calculator

howto:
  name: "How to Calculate Mortar Bags and Volume for Brick and CMU Block Walls"
  description: "Accurately compute mortar bag quantities and volumetric coverage for masonry construction."
  step:
    - name: "Select masonry unit type and quantity"
      text: "Specify standard modular brick count, CMU block count, or stone veneer square footage."
    - name: "Select joint thickness and mortar type"
      text: "Standard bed and head joint thickness is 3/8 inch (0.375 in)."
    - name: "Calculate total mortar volume"
      text: "Apply empirical consumption rates (e.g. 7 bags per 1,000 bricks or 3 bags per 100 CMU blocks)."
    - name: "Include waste factor and calculate cost"
      text: "Add 10% waste for mortar droppings and multiply total bags by price per bag."

faq:
  - question: "How many 80lb bags of mortar do I need for 1,000 bricks?"
    answer: "Laying 1,000 standard modular bricks with 3/8-inch mortar joints requires approximately 7.0 to 7.5 bags of 80lb pre-mixed masonry mortar (or about 5.0 cubic feet of wet mortar)."
  - question: "How many 80lb bags of mortar do I need for 100 CMU blocks?"
    answer: "Laying 100 standard 8x8x16 concrete masonry blocks requires approximately 3.0 to 3.5 bags of 80lb pre-mixed mortar (or about 2.2 cubic feet of wet mortar)."
  - question: "What is the difference between Type N, Type S, and Type M mortar?"
    answer: "Type N (750 PSI) is general-purpose mortar for exterior above-grade brick walls. Type S (1,800 PSI) is high-strength mortar for structural load-bearing walls and below-grade foundations. Type M (2,500 PSI) is heavy structural mortar."
  - question: "How much mortar volume does an 80lb pre-mixed bag yield?"
    answer: "One 80lb bag of pre-mixed masonry mortar yields approximately 0.67 cubic feet of wet mixed mortar."
  - question: "What is the standard mortar joint thickness for brick and block?"
    answer: "The standard joint thickness for both modular brick and CMU concrete block laying is 3/8 inch (0.375 in)."
  - question: "Should I buy pre-mixed mortar bags or mix cement and sand on site?"
    answer: "For projects under 500 bricks or 100 blocks, pre-mixed 80lb bags save significant setup time. For large commercial projects, jobsite mixing (1 bag masonry cement to 3 parts damp sand) is more cost-effective."
  - question: "How much mortar waste should be added for masonry work?"
    answer: "A 10% waste factor is recommended to account for joint strike scraping, board drying, and mortar board droppings."
---

# Masonry Mortar Bag & Volume Calculator

Calculate 70lb or 80lb pre-mixed mortar bags, total cubic feet of wet mortar, jobsite cement and sand quantities, and material costs for brick and CMU block laying. All calculations execute 100% privately in your browser.

<!-- more -->

## Why Use the Mortar Calculator?

Laying masonry units (brick veneer, concrete block, or stone) requires continuous mortar joints. Under-estimating mortar halts masonry crews mid-wall, while over-buying pre-mixed bags creates heavy surplus waste that hardens from atmospheric moisture.

Mortar consumption varies based on unit dimensions, joint thickness (standard 3/8"), unit hollow cores, and board droppings. This **Mortar Calculator** computes precise pre-mixed bag counts, cubic footage, bulk jobsite sand tonnage, and material costs.

---

## Mathematical Formulas & Mechanics

### 1. Base Mortar Volume ($V_{	ext{mortar\_cuft}}$)
Empirical consumption factors per unit (for 3/8" joints):
- Standard Modular Brick: $0.0050	ext{ cu ft}$ per brick (7.5 80lb bags per 1,000 bricks)
- 8" x 8" x 16" CMU Block: $0.0220	ext{ cu ft}$ per block (3.3 80lb bags per 100 blocks)
- 12" x 8" x 16" CMU Block: $0.0300	ext{ cu ft}$ per block (4.5 80lb bags per 100 blocks)
- Manufactured Stone Veneer: $0.0450	ext{ cu ft}$ per sq ft (6.7 80lb bags per 100 sq ft)

Including waste allowance ($	ext{Waste } \%$):

$$V_{	ext{total\_cuft}} = N_{	ext{units}} 	imes V_{	ext{unit\_factor}} 	imes \left(1 + rac{	ext{Waste } \%}{100}
ight)$$

### 2. Pre-Mixed Mortar Bag Count ($N_{	ext{bags}}$)
For 80 lb bag yield ($0.67	ext{ cu ft}$) or 70 lb bag yield ($0.58	ext{ cu ft}$):

$$N_{	ext{bags}} = \left\lceil rac{V_{	ext{total\_cuft}}}{V_{	ext{bag\_yield}}} 
ight
ceil$$

### 3. Equivalent Jobsite Bulk Mix (Masonry Cement & Sand)
For a 1:3 jobsite proportion (1 bag 94lb Masonry Cement to $3	ext{ cu ft}$ damp masonry sand):

$$N_{	ext{cement\_94lb}} = \left\lceil rac{V_{	ext{total\_cuft}}}{3.0} 
ight
ceil$$

$$	ext{Sand (Tons)} = rac{V_{	ext{total\_cuft}} 	imes 100}{2000}$$

---

## Real-World Comparison & Benchmark Table

| Masonry Unit Type | Quantity | 80lb Pre-Mixed Mortar Bags (10% Waste) | Total Wet Mortar Volume (Cu Ft) | Jobsite Masonry Cement (94lb Bags) | Jobsite Masonry Sand (Tons) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Modular Brick** | 500 Bricks | 4 Bags | 2.75 Cu Ft | 1 Bag | 0.14 Tons |
| **Standard Modular Brick** | 1,000 Bricks | 8 Bags | 5.50 Cu Ft | 2 Bags | 0.28 Tons |
| **8" CMU Block Wall** | 100 Blocks | 4 Bags | 2.42 Cu Ft | 1 Bag | 0.12 Tons |
| **8" CMU Block Wall** | 500 Blocks | 18 Bags | 12.10 Cu Ft | 4 Bags | 0.61 Tons |
| **Manufactured Stone** | 200 Sq Ft | 15 Bags | 9.90 Cu Ft | 4 Bags | 0.50 Tons |

---

## Step-by-Step How-To Guide

1. **Select Masonry Unit:** Choose standard modular brick, 8" CMU block, 12" CMU block, or stone veneer.
2. **Input Unit Quantity:** Enter total bricks, blocks, or wall surface square footage.
3. **Set Joint Thickness:** Keep standard 3/8" (0.375 in) joint thickness.
4. **Choose Pre-Mixed Bag Weight:** Select 80lb bags (most common) or 70lb bags.
5. **Review Order Quantities:** Use total calculated bag counts or bulk sand/cement quantities for jobsite mixing.

---

## Frequently Asked Questions

### How many 80lb bags of mortar do I need for 1,000 bricks?
Laying 1,000 standard modular bricks with 3/8-inch mortar joints requires approximately 7.0 to 7.5 bags of 80lb pre-mixed masonry mortar (or about 5.0 cubic feet of wet mortar).

### How many 80lb bags of mortar do I need for 100 CMU blocks?
Laying 100 standard 8x8x16 concrete masonry blocks requires approximately 3.0 to 3.5 bags of 80lb pre-mixed mortar (or about 2.2 cubic feet of wet mortar).

### What is the difference between Type N, Type S, and Type M mortar?
Type N (750 PSI) is general-purpose mortar for exterior above-grade brick walls. Type S (1,800 PSI) is high-strength mortar for structural load-bearing walls and below-grade foundations. Type M (2,500 PSI) is heavy structural mortar.

### How much mortar volume does an 80lb pre-mixed bag yield?
One 80lb bag of pre-mixed masonry mortar yields approximately 0.67 cubic feet of wet mixed mortar.

### What is the standard mortar joint thickness for brick and block?
The standard joint thickness for both modular brick and CMU concrete block laying is 3/8 inch (0.375 in).

### Should I buy pre-mixed mortar bags or mix cement and sand on site?
For projects under 500 bricks or 100 blocks, pre-mixed 80lb bags save significant setup time. For large commercial projects, jobsite mixing (1 bag masonry cement to 3 parts damp sand) is more cost-effective.

### How much mortar waste should be added for masonry work?
A 10% waste factor is recommended to account for joint strike scraping, board drying, and mortar board droppings.
