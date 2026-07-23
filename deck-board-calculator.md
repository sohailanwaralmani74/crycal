---
layout: tool
title: Deck Board Calculator – Decking Boards, Linear Feet & Material Cost
description: Calculate total deck boards (5/4x6 or 2x6), total linear feet, 10% waste allowance, stock board counts, and material costs for any deck size.
permalink: /deck-board-calculator
tool_id: deck-board-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: deckLength
    label: Deck Length (Feet — Parallel to Boards)
    type: number
    default: 20
    step: 1
    min: 1
    placeholder: "e.g., 20"

  - id: deckWidth
    label: Deck Width (Feet — Across Board Runs)
    type: number
    default: 12
    step: 1
    min: 1
    placeholder: "e.g., 12"

  - id: boardType
    label: Decking Board Profile & Dimension
    type: select
    default: "54x6"
    options:
      - value: "54x6"
        label: "5/4\" x 6\" Premium Decking (Actual 5.5\" Width)"
      - value: "2x6"
        label: "2\" x 6\" Dimensional Decking (Actual 5.5\" Width)"
      - value: "2x4"
        label: "2\" x 4\" Narrow Decking (Actual 3.5\" Width)"

  - id: boardLength
    label: Commercial Stock Board Length
    type: select
    default: "16"
    options:
      - value: "8"
        label: "8 Foot Stock Board"
      - value: "12"
        label: "12 Foot Stock Board"
      - value: "16"
        label: "16 Foot Stock Board (Standard)"
      - value: "20"
        label: "20 Foot Stock Board"

  - id: gapSize
    label: Expansion Gap Between Boards (Inches)
    type: number
    default: 0.125
    step: 0.0625
    min: 0
    max: 0.375
    suffix: 'in'
    placeholder: "e.g., 0.125 (1/8\")"

  - id: wasteFactor
    label: Waste & Cutoff Margin (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePerBoard
    label: Price per Stock Board 
    type: number
    default: 18.50
    step: 0.50
    min: 0
    prefix: '$'
    placeholder: "e.g., 18.50"

outputs:
  - id: totalBoards
    label: Total Stock Deck Boards Needed (with Waste)
  - id: linearFeet
    label: Total Linear Feet of Decking
  - id: deckArea
    label: Total Deck Surface Area (Sq Ft)
  - id: totalCost
    label: Total Decking Lumber Cost

charts:
  tabs:
    - id: boardBreakdown
      label: Net Stock Boards vs Waste Boards
    - id: costByStockLength
      label: Cost Comparison by Stock Board Length (12', 16', 20')

history_columns:
  - key: deckLength
    label: Deck Size
    source: input
  - key: boardType
    label: Board Type
    source: input
  - key: totalBoards
    label: Stock Boards Needed
    source: output
  - key: linearFeet
    label: Total Linear Ft
    source: output
  - key: totalCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/deck-board-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Deck Board Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate decking board counts, total linear feet, waste margins, and lumber costs for wood and composite decking projects."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates board counts for 5/4x6, 2x6, and 2x4 decking profiles"
    - "Includes 8', 12', 16', and 20' stock lumber lengths"
    - "Factors in board gap spacing (1/8\" standard for wood/composite expansion)"
    - "Provides total linear feet and full material budget breakdown"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Deck Board Calculator

howto:
  name: "How to Calculate Decking Boards and Linear Feet"
  description: "Determine exact deck board quantities and material costs for residential deck builds."
  step:
    - name: "Measure deck dimensions"
      text: "Determine length (direction deck boards run) and width in feet."
    - name: "Select board thickness and width"
      text: "Choose 5/4x6 radius-edge decking or 2x6 structural boards."
    - name: "Select stock lumber length"
      text: "Pick stock board length (e.g. 16ft) that minimizes joist splices and butt joints."
    - name: "Include expansion gap and waste factor"
      text: "Account for 1/8\" gap between boards and add 10% for end trimming."

faq:
  - question: "How many 5/4x6 deck boards do I need for a 12x16 deck?"
    answer: "For a 12' x 16' deck with boards running parallel to the 16ft side, you need 27 board runs across the 12ft width. Using 16ft stock boards, you need 27 boards net, or 30 boards including a 10% waste factor (total 480 linear feet)."
  - question: "What is the actual width of a 5/4x6 and 2x6 deck board?"
    answer: "Both nominal 5/4x6 radius-edge decking and standard 2x6 dimensional lumber have an actual physical width of 5.5 inches (139 mm)."
  - question: "How wide should the expansion gap be between deck boards?"
    answer: "Wood decking should be spaced with a 1/8-inch (0.125\") to 3/16-inch gap to allow drainage and wood swelling. Wet pressure-treated lumber will shrink as it dries, while composite decking requires precise thermal expansion gapping."
  - question: "How do you calculate total linear feet of decking?"
    answer: "Total Linear Feet = Number of Board Runs x Length per Run. Alternatively, divide total square feet by effective board coverage width in feet (e.g., (5.5\" + 0.125\") / 12 = 0.46875 ft)."
  - question: "Should deck boards run parallel to the house or perpendicular?"
    answer: "Deck boards typically run parallel to the house exterior wall. This allows underlying floor joists to run perpendicular to the house wall out toward support beams."
  - question: "What is the standard joist spacing for 5/4x6 vs 2x6 decking?"
    answer: "5/4x6 decking requires maximum 16-inch on-center joist spacing (or 12-inch OC for diagonal decking). 2x6 decking can span up to 24 inches on-center."
  - question: "How many fasteners or deck screws do I need per board?"
    answer: "Plan for 2 deck screws per joist intersection. For 16\" OC framing, a 16-foot board spans 13 joists, requiring 26 screws per board."
---

Calculate total decking board quantities, linear footage, commercial stock board counts, and material costs for pressure-treated, cedar, or composite decks.

<!-- more -->

## Why Use the Deck Board Calculator?

Building or resurfacing an outdoor deck requires ordering the correct combination of decking board lengths to minimize butt-joint splices and material scrap. Ordering short boards increases labor and visible joints, while purchasing excess long stock inflates material costs.

This **Deck Board Calculator** factors in nominal-to-actual board widths, expansion gaps ($1/8"$), commercial stock lengths ($8\text{ft}$ to $20\text{ft}$), and cutoff waste margins to provide exact order requirements.

### Key Benefits
* **Actual Width Accuracy:** Correctly uses actual board dimensions ($5.5"$ for $6"$ boards; $3.5"$ for $4"$ boards).
* **Gap Expansion Allowance:** Integrates mandatory drainage and expansion gaps ($1/8"$ default).
* **Stock Optimization:** Compares total board counts when choosing between 12ft, 16ft, and 20ft stock lumber.
* **Linear Foot Breakdown:** Provides total linear footage for composite or wood decking pricing.

---

## Decking Calculation Formulas

### 1. Effective Board Width
Effective coverage width ($W_{\text{eff}}$) equals actual physical board width ($W_{\text{actual}}$) plus expansion gap ($G$):

$$W_{\text{eff}} = \frac{W_{\text{actual}} + G}{12} \quad (\text{in feet})$$

*For $5.5"$ board with $0.125"$ gap: $W_{\text{eff}} = \frac{5.5 + 0.125}{12} = 0.46875\text{ ft}$.*

### 2. Number of Board Runs Across Deck Width
Number of continuous parallel runs ($N_{\text{runs}}$) needed across deck width ($W_{\text{deck}}$):

$$N_{\text{runs}} = \left\lceil \frac{W_{\text{deck}}}{W_{\text{eff}}} \right\rceil$$

### 3. Total Linear Feet & Stock Boards
Total linear feet of decking ($LF_{\text{total}}$) and stock board count ($N_{\text{stock}}$) with waste ($W$):

$$LF_{\text{net}} = N_{\text{runs}} \times L_{\text{deck}}$$

$$N_{\text{boards}} = \left\lceil \frac{LF_{\text{net}}}{L_{\text{stock}}} \times \left(1 + \frac{W}{100}\right) \right\rceil$$

---

## Decking Material Quick Reference Table

The table below summarizes board requirements and linear feet for standard rectangular decks using **5/4x6 decking** ($1/8"$ gap, $10\%$ waste):

| Deck Size (Length x Width) | Total Surface Area | Board Runs Needed | Total Linear Feet | 16ft Stock Boards Needed | Estimated Material Cost ($18.50/board) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10' x 10'** | 100 Sq Ft | 22 Runs | 242 LF | 16 Boards | $296.00 |
| **12' x 16'** | 192 Sq Ft | 26 Runs | 338 LF | 29 Boards | $536.50 |
| **14' x 20'** | 280 Sq Ft | 30 Runs | 660 LF | 42 Boards | $777.00 |
| **16' x 24'** | 384 Sq Ft | 35 Runs | 924 LF | 58 Boards | $1,073.00 |
| **20' x 30'** | 600 Sq Ft | 43 Runs | 1,419 LF | 89 Boards | $1,646.50 |

---

## Step-by-Step Deck Ordering Guide

1. **Determine Board Direction:** Decide whether deck boards run parallel to the house wall (most common) or perpendicular.
2. **Select Stock Board Length:** Choose stock length equal to or longer than deck run length to eliminate middle butt joints (e.g. use 16ft stock for a 15ft deck).
3. **Set Expansion Gap:** Use 16d nails or 1/8" spacing tools during installation for wet pressure-treated lumber.
4. **Calculate Fastener Requirement:** Multiply total joist intersection points by 2 for face-screwing or use 1 hidden fastener clip per joist per board.
5. **Add Waste & Picture-Framing:** Add an extra 10% to 15% if adding perimeter picture-frame border boards or fascia trim boards.

---

## Frequently Asked Questions (FAQ)

### How many 5/4x6 deck boards do I need for a 12x16 deck?
For a 12' x 16' deck with boards running parallel to the 16ft side, you need 27 board runs across the 12ft width. Using 16ft stock boards, you need 27 boards net, or 30 boards including a 10% waste factor (total 480 linear feet).

### What is the actual width of a 5/4x6 and 2x6 deck board?
Both nominal 5/4x6 radius-edge decking and standard 2x6 dimensional lumber have an actual physical width of 5.5 inches (139 mm).

### How wide should the expansion gap be between deck boards?
Wood decking should be spaced with a 1/8-inch (0.125") to 3/16-inch gap to allow drainage and wood swelling. Wet pressure-treated lumber will shrink as it dries, while composite decking requires precise thermal expansion gapping.

### How do you calculate total linear feet of decking?
Total Linear Feet = Number of Board Runs x Length per Run. Alternatively, divide total square feet by effective board coverage width in feet (e.g., (5.5" + 0.125") / 12 = 0.46875 ft).

### Should deck boards run parallel to the house or perpendicular?
Deck boards typically run parallel to the house exterior wall. This allows underlying floor joists to run perpendicular to the house wall out toward support beams.

### What is the standard joist spacing for 5/4x6 vs 2x6 decking?
5/4x6 decking requires maximum 16-inch on-center joist spacing (or 12-inch OC for diagonal decking). 2x6 decking can span up to 24 inches on-center.

### How many fasteners or deck screws do I need per board?
Plan for 2 deck screws per joist intersection. For 16" OC framing, a 16-foot board spans 13 joists, requiring 26 screws per board.
