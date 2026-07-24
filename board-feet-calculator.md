---
layout: tool
title: "Board Feet | Interactive Online Tool"
description: "Calculate board feet (BF), total lumber volume, piece counts, and hardwood lumber costs with our free board foot calculator."
permalink: /board-feet-calculator
tool_id: board-feet-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: thicknessInches
    label: Board Thickness (Inches)
    type: number
    default: 2
    step: 0.25
    min: 0.25
    placeholder: "e.g., 2"

  - id: widthInches
    label: Board Width (Inches)
    type: number
    default: 6
    step: 0.25
    min: 0.25
    placeholder: "e.g., 6"

  - id: lengthFeet
    label: Board Length (Feet)
    type: number
    default: 8
    step: 0.5
    min: 0.1
    placeholder: "e.g., 8"

  - id: pieceCount
    label: Number of Boards (Quantity)
    type: number
    default: 10
    step: 1
    min: 1
    placeholder: "e.g., 10"

  - id: pricePerBoardFoot
    label: Price per Board Foot ($/BF)
    type: number
    default: 4.50
    step: 0.10
    min: 0
    prefix: '$'
    placeholder: "e.g., 4.50"

outputs:
  - id: singleBoardFeet
    label: Board Feet per Piece
  - id: totalBoardFeet
    label: Total Board Feet (Order)
  - id: costPerPiece
    label: Estimated Cost per Board
  - id: totalOrderCost
    label: Total Lumber Order Cost

charts:
  tabs:
    - id: bfBreakdown
      label: Single Board vs Total BF Volume
    - id: costBreakdown
      label: Material Cost Breakdown

history_columns:
  - key: thicknessInches
    label: Thickness (in)
    source: input
  - key: widthInches
    label: Width (in)
    source: input
  - key: lengthFeet
    label: Length (ft)
    source: input
  - key: pieceCount
    label: Pieces
    source: input
  - key: totalBoardFeet
    label: Total (BF)
    source: output
  - key: totalOrderCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/board-feet-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Board Feet Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate board feet, total lumber volume, piece costs, and order totals for hardwood and softwood lumber."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Precise Board Foot Formula — calculates T × W × L / 12 for accurate lumber measurement"
    - "Quantity & Price Estimation — instantly calculates cost per piece and order totals"
    - "Hardwood & Softwood Support — handles rough-sawn and dressed lumber dimensions"
    - "100% Private — executes calculations entirely inside your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Board Feet Calculator

howto:
  name: "How to Calculate Board Feet"
  description: "Measure rough and surfaced lumber in board feet for woodworking and construction."
  step:
    - name: "Measure board thickness"
      text: "Measure thickness in inches (use nominal thickness for rough-sawn lumber)."
    - name: "Measure board width"
      text: "Measure width across the grain in inches."
    - name: "Measure board length"
      text: "Measure board length in feet."
    - name: "Calculate board feet and total cost"
      text: "Multiply T × W × L and divide by 12. Multiply by quantity and unit price per board foot."

faq:
  - question: "What is a board foot?"
    answer: "A board foot (BF) is a unit of volume for measuring lumber in North America. One board foot represents a piece of wood 1 inch thick, 12 inches wide, and 1 foot (12 inches) long, equaling 144 cubic inches of wood volume."
  - question: "What is the formula for board feet?"
    answer: "The formula for board feet when length is in feet is: Board Feet = (Thickness in inches × Width in inches × Length in feet) / 12. If length is measured in inches, divide by 144: Board Feet = (Thickness in inches × Width in inches × Length in inches) / 144."
  - question: "How do you calculate board feet for rough vs dressed lumber?"
    answer: "Rough-sawn hardwood is sold by nominal thickness quarters (e.g., 4/4 = 1\", 5/4 = 1.25\", 8/4 = 2\"). Board feet is calculated based on nominal un-surfaced dimensions prior to planing, even though surfaced boards are slightly thinner."
  - question: "How many board feet are in a 2x4 8 feet long?"
    answer: "A 2x4-8' board contains 5.33 board feet. Nominal calculation: (2 inches × 4 inches × 8 feet) / 12 = 5.333 BF."
  - question: "What is the difference between linear feet and board feet?"
    answer: "Linear feet measures only the overall length of a board regardless of width or thickness. Board feet measures 3D volume (length × width × thickness)."
  - question: "How much waste should I add when ordering hardwood lumber?"
    answer: "Woodworkers generally add 15% to 20% waste for rough hardwood lumber to account for defects, knots, wane, and machining loss."
  - question: "Is my lumber calculation data saved on external servers?"
    answer: "No. All calculation logic executes locally in your web browser."
---

# Board Feet Calculator

Determine exact **board feet (BF)**, individual piece volumes, total order quantities, and material costs for hardwood and softwood lumber orders.

<!-- more -->

## Board Feet Formula

A **board foot** is standard unit of volume equal to a 1-inch thick, 12-inch wide, 1-foot long board ($144 \text{ inches}^3$).

$$\text{Board Feet (single)} = \frac{\text{Thickness (in)} \times \text{Width (in)} \times \text{Length (ft)}}{12}$$

When board length is measured in inches:

$$\text{Board Feet (single)} = \frac{\text{Thickness (in)} \times \text{Width (in)} \times \text{Length (in)}}{144}$$

$$\text{Total Board Feet} = \text{Board Feet (single)} \times \text{Piece Count}$$
$$\text{Total Cost (\$)} = \text{Total Board Feet} \times \text{Price per Board Foot (\$/BF)}$$

---

## Standard Dimensional Lumber Board Feet Table

| Nominal Lumber Size | Length (ft) | Board Feet per Piece (BF) | Pieces per 100 BF | Cost per Board at $5.00/BF |
|---|---|---|---|---|
| **1x6 (0.75" × 5.5")** | 8 ft | **4.00 BF** | 25 Pieces | $20.00 |
| **2x4 (1.5" × 3.5")** | 8 ft | **5.33 BF** | 19 Pieces | $26.67 |
| **2x6 (1.5" × 5.5")** | 8 ft | **8.00 BF** | 13 Pieces | $40.00 |
| **2x8 (1.5" × 7.25")** | 10 ft | **13.33 BF** | 8 Pieces | $66.67 |
| **2x10 (1.5" × 9.25")** | 12 ft | **20.00 BF** | 5 Pieces | $100.00 |
| **4x4 (3.5" × 3.5")** | 8 ft | **10.67 BF** | 10 Pieces | $53.33 |

---

## How to Use This Board Feet Calculator

1. Enter **Thickness in inches** (use nominal fraction like 4/4 = 1", 8/4 = 2").
2. Enter **Width in inches** and **Length in feet**.
3. Specify **Number of boards** needed for your project.
4. Input **Price per Board Foot ($/BF)** supplied by your lumber yard.
5. View single piece board feet, total order board feet, piece unit cost, and overall order total.

---

## Frequently Asked Questions

### What is a board foot?
A board foot (BF) is a unit of volume for measuring lumber in North America. One board foot represents a piece of wood 1 inch thick, 12 inches wide, and 1 foot (12 inches) long, equaling 144 cubic inches of wood volume.

### What is the formula for board feet?
The formula for board feet when length is in feet is: Board Feet = (Thickness in inches × Width in inches × Length in feet) / 12. If length is measured in inches, divide by 144: Board Feet = (Thickness in inches × Width in inches × Length in inches) / 144.

### How do you calculate board feet for rough vs dressed lumber?
Rough-sawn hardwood is sold by nominal thickness quarters (e.g., 4/4 = 1", 5/4 = 1.25", 8/4 = 2"). Board feet is calculated based on nominal un-surfaced dimensions prior to planing, even though surfaced boards are slightly thinner.

### How many board feet are in a 2x4 8 feet long?
A 2x4-8' board contains 5.33 board feet. Nominal calculation: (2 inches × 4 inches × 8 feet) / 12 = 5.333 BF.

### What is the difference between linear feet and board feet?
Linear feet measures only the overall length of a board regardless of width or thickness. Board feet measures 3D volume (length × width × thickness).

### How much waste should I add when ordering hardwood lumber?
Woodworkers generally add 15% to 20% waste for rough hardwood lumber to account for defects, knots, wane, and machining loss.

### Is my lumber calculation data saved on external servers?
No. All calculation logic executes locally in your web browser.
