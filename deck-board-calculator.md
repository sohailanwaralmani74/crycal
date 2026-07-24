---
layout: tool
title: "Deck Board Calculator | Decking Boards & Cost"
description: "Calculate total deck boards (5/4x6 or 2x6), total linear feet, 10% waste allowance, stock board counts, and material costs for any deck size."
permalink: /deck-board-calculator
tool_id: deck-board-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: deckLength
    label: Deck Length / Parallel to Boards (Feet)
    type: number
    default: 20
    step: 1
    min: 1
    placeholder: "e.g., 20"

  - id: deckWidth
    label: Deck Width / Perpendicular to Boards (Feet)
    type: number
    default: 16
    step: 1
    min: 1
    placeholder: "e.g., 16"

  - id: boardType
    label: Deck Board Nominal Width
    type: select
    default: "5.5"
    options:
      - value: "5.5"
        label: "5.5 Inches (Standard 5/4x6 or 2x6 Wood / Composite)"
      - value: "3.5"
        label: "3.5 Inches (Standard 2x4 Lumber)"
      - value: "7.25"
        label: "7.25 Inches (Wide 2x8 Board)"

  - id: boardGap
    label: Gap Between Deck Boards (Inches)
    type: number
    default: 0.125
    step: 0.0625
    min: 0
    max: 0.5
    placeholder: "0.125 for 1/8 gap"

  - id: boardStockLength
    label: Stock Board Purchase Length
    type: select
    default: "16"
    options:
      - value: "12"
        label: "12 Feet Stock Board"
      - value: "16"
        label: "16 Feet Stock Board"
      - value: "20"
        label: "20 Feet Stock Board"
      - value: "8"
        label: "8 Feet Stock Board"

  - id: wasteFactor
    label: Waste & End-Trim Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 25
    placeholder: "e.g., 10"

  - id: pricePerLinFt
    label: Deck Board Cost per Linear Foot
    type: number
    default: 2.25
    step: 0.25
    min: 0
    prefix: '$'
    placeholder: "e.g., 2.25"

outputs:
  - id: totalDeckBoards
    label: Stock Deck Boards Required
  - id: totalLinearFeet
    label: Total Decking Linear Feet
  - id: squareFootage
    label: Total Deck Surface Area (Sq Ft)
  - id: boardRows
    label: Total Parallel Board Rows
  - id: totalMaterialCost
    label: Total Deck Board Material Cost

charts:
  tabs:
    - id: boardQuantities
      label: Board Count & Waste Allowance
    - id: costBreakdown
      label: Material & Waste Cost Breakdown

history_columns:
  - key: deckLength
    label: Deck Length (ft)
    source: input
  - key: deckWidth
    label: Deck Width (ft)
    source: input
  - key: totalDeckBoards
    label: Stock Boards
    source: output
  - key: totalLinearFeet
    label: Linear Feet
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/deck-board-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Deck Board Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate total deck boards, linear footage, waste allowance, stock board counts, and material costs for wood or composite decking."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates deck surface square footage and total linear feet of decking"
    - "Determines parallel board rows based on actual board width and gapping"
    - "Computes stock board counts for 8ft, 12ft, 16ft, and 20ft board lengths"
    - "Includes customizable end-trim waste allowances and material cost totals"

breadcrumb:
  - name: Home
    url: /
  - name: Lumber & Framing
    url: /lumber-framing
  - name: Deck Board Calculator

howto:
  name: "How to Calculate Deck Board Quantities and Linear Footage"
  description: "Accurately compute total deck boards and material linear footage for wood or composite deck construction."
  step:
    - name: "Measure deck surface length and width"
      text: "Determine length parallel to board run and width perpendicular to board run."
    - name: "Select board width and gap spacing"
      text: "Standard 5/4x6 or 2x6 decking measures 5.5 inches wide with a 1/8 inch gap."
    - name: "Calculate total parallel board rows"
      text: "Divide total deck width in inches by effective board width (actual width + gap)."
    - name: "Determine stock board count and cost"
      text: "Multiply total rows by length, add 10% waste, and divide by stock board purchase length."

faq:
  - question: "What is the actual width of a standard 5/4x6 or 2x6 deck board?"
    answer: "A standard 5/4x6 or 2x6 deck board has an actual face width of 5.5 inches (140 mm)."
  - question: "How wide should the gap be between deck boards?"
    answer: "Pressure-treated wood boards should be installed tightly or with a small 1/16 to 1/8 gap as they shrink as they dry. Composite decking requires a uniform 1/8 to 3/16 gap for expansion."
  - question: "How many linear feet of deck boards do I need per square foot?"
    answer: "For standard 5.5-inch wide boards with a 1/8-inch gap, you need approximately 2.13 linear feet of decking per square foot of deck surface."
  - question: "What stock board length should I buy to minimize waste?"
    answer: "Choose stock board lengths (12ft, 16ft, 20ft) that are exact multiples of your deck section length or allow full end-to-end runs without random mid-span butt joints."
  - question: "How much waste allowance should I add for deck board installation?"
    answer: "A 10% waste factor is recommended for straight deck patterns. For diagonal 45-degree decking patterns, add a 15% to 20% waste allowance."
  - question: "How many deck boards do I need for a 16x20 deck?"
    answer: "A 16x20 deck (320 sq ft) using 5.5 boards laid parallel to the 20ft side requires 35 rows of boards, totaling 700 linear feet (or roughly 49 16ft stock boards with waste)."
  - question: "Does composite decking require different board spacing than wood?"
    answer: "Yes. Composite boards expand length-wise and width-wise with temperature shifts, requiring specific gapping (typically 3/16) specified by manufacturers like Trex or TimberTech."
---

# Decking Board Quantity & Layout Calculator

Calculate total deck boards, exact linear footage, parallel board rows, stock board counts, and material costs for wood or composite decking. All calculations run 100% privately in your web browser.

<!-- more -->

## Why Use the Deck Board Calculator?

Ordering decking materials without accounting for actual board width (5.5 inches for nominal 6-inch boards), board expansion gaps, and end-trim waste leads to costly delays or expensive leftover lumber. 

Laying out deck boards requires calculating exact parallel rows across the deck joists. This **Deck Board Calculator** computes total surface square footage, required linear feet, stock board counts (12ft, 16ft, 20ft), and material costs while factoring in customizable gap spacing and waste allowances.

---

## Mathematical Formulas & Mechanics

### 1. Deck Surface Area ($A_{	ext{deck}}$)
$$A_{	ext{deck}} = L_{	ext{deck}} 	imes W_{	ext{deck}}$$

### 2. Effective Board Coverage Width ($W_{	ext{eff}}$)
For actual board width $W_{	ext{board}}$ (5.5 inches for 5/4x6) and gap width $G_{	ext{board}}$ (0.125 inches):

$$W_{	ext{eff}} = rac{W_{	ext{board}} + G_{	ext{board}}}{12} \quad (	ext{Feet})$$

### 3. Total Parallel Board Rows ($N_{	ext{rows}}$)
For deck width $W_{	ext{deck}}$ perpendicular to board orientation:

$$N_{	ext{rows}} = \left\lceil rac{W_{	ext{deck}}}{W_{	ext{eff}}} 
ight
ceil$$

### 4. Total Decking Linear Feet ($L_{	ext{total\_lin}}$)
Including waste factor percentage ($	ext{Waste } \%$):

$$L_{	ext{raw\_lin}} = N_{	ext{rows}} 	imes L_{	ext{deck}}$$

$$L_{	ext{total\_lin}} = L_{	ext{raw\_lin}} 	imes \left(1 + rac{	ext{Waste } \%}{100}
ight)$$

### 5. Stock Board Count ($N_{	ext{stock\_boards}}$)
For chosen stock board purchase length $L_{	ext{stock}}$ (e.g., 16 feet):

$$N_{	ext{stock\_boards}} = \left\lceil rac{L_{	ext{total\_lin}}}{L_{	ext{stock}}} 
ight
ceil$$

---

## Real-World Comparison & Benchmark Table

| Deck Dimensions | Area (Sq Ft) | 5.5" Boards (1/8" Gap) Linear Feet | 16ft Stock Boards Required (10% Waste) | Pressure-Treated Wood Cost ($) | Composite Decking Cost ($) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10 ft x 12 ft** | 120 Sq Ft | 256 Linear Ft | 18 Boards (16ft) | $350 - $550 | $900 - $1,500 |
| **12 ft x 16 ft** | 192 Sq Ft | 410 Linear Ft | 29 Boards (16ft) | $550 - $900 | $1,500 - $2,500 |
| **16 ft x 20 ft** | 320 Sq Ft | 683 Linear Ft | 47 Boards (16ft) | $950 - $1,500 | $2,500 - $4,200 |
| **20 ft x 24 ft** | 480 Sq Ft | 1,024 Linear Ft | 71 Boards (16ft) | $1,400 - $2,200 | $3,800 - $6,400 |
| **20 ft x 30 ft** | 600 Sq Ft | 1,280 Linear Ft | 88 Boards (16ft) | $1,800 - $2,800 | $4,800 - $8,000 |

---

## Step-by-Step How-To Guide

1. **Determine Board Orientation:** Decide whether deck boards will run parallel to the house wall or perpendicular.
2. **Measure Surface Dimensions:** Enter deck length (parallel to board direction) and width (perpendicular to board direction).
3. **Select Board Material:** Choose 5.5" actual width for standard 5/4x6 or 2x6 boards and set desired gap spacing (1/8").
4. **Choose Stock Purchase Length:** Select 16ft or 20ft stock boards to match deck spans and minimize mid-span butt joints.
5. **Review Linear Feet & Board Count:** Use total stock board counts when placing your lumberyard order.

---

## Frequently Asked Questions

### What is the actual width of a standard 5/4x6 or 2x6 deck board?
A standard 5/4x6 or 2x6 deck board has an actual face width of 5.5 inches (140 mm).

### How wide should the gap be between deck boards?
Pressure-treated wood boards should be installed tightly or with a small 1/16" to 1/8" gap as they shrink as they dry. Composite decking requires a uniform 1/8" to 3/16" gap for expansion.

### How many linear feet of deck boards do I need per square foot?
For standard 5.5-inch wide boards with a 1/8-inch gap, you need approximately 2.13 linear feet of decking per square foot of deck surface.

### What stock board length should I buy to minimize waste?
Choose stock board lengths (12ft, 16ft, 20ft) that are exact multiples of your deck section length or allow full end-to-end runs without random mid-span butt joints.

### How much waste allowance should I add for deck board installation?
A 10% waste factor is recommended for straight deck patterns. For diagonal 45-degree decking patterns, add a 15% to 20% waste allowance.

### How many deck boards do I need for a 16x20 deck?
A 16x20 deck (320 sq ft) using 5.5" boards laid parallel to the 20ft side requires 35 rows of boards, totaling 700 linear feet (or roughly 49 16ft stock boards with waste).

### Does composite decking require different board spacing than wood?
Yes. Composite boards expand length-wise and width-wise with temperature shifts, requiring specific gapping (typically 3/16") specified by manufacturers like Trex or TimberTech.
