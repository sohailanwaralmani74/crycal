---
layout: tool
title: Stair Stringer Calculator – Riser Height, Tread Run & Board Length
description: Calculate exact stair riser count, exact riser height, tread run depth, total stair run length, 2x12 stringer hypotenuse length, and lumber cost.
permalink: /stair-stringer-calculator
tool_id: stair-stringer-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: totalRiseInches
    label: Total Floor-to-Floor Rise (Inches)
    type: number
    default: 108
    step: 0.5
    min: 12
    max: 240
    placeholder: "e.g., 108 (9 ft)"

  - id: targetRiserHeightIn
    label: Target Riser Height (Inches)
    type: number
    default: 7.5
    step: 0.125
    min: 5
    max: 8.5
    placeholder: "IRC target ~7.5 in"

  - id: treadDepthIn
    label: Tread Run Depth (Inches)
    type: number
    default: 10.5
    step: 0.25
    min: 9
    max: 14
    placeholder: "IRC min 10 in"

  - id: numStringers
    label: Number of Stringers
    type: number
    default: 3
    step: 1
    min: 2
    max: 6
    placeholder: "3 for 36 in width, 4 for 48 in width"

  - id: lumberLengthFt
    label: 2x12 Board Stock Length (Feet)
    type: number
    default: 12
    step: 2
    min: 8
    max: 20
    placeholder: "e.g., 12"

  - id: pricePerStringerBoard
    label: Price Per 2x12 Board 
    type: number
    default: 34.00
    step: 1.00
    min: 0
    currency: true
    placeholder: "e.g., 34.00"

outputs:
  - id: totalRisersCount
    label: Total Number of Risers
  - id: exactRiserHeightIn
    label: Exact Individual Riser Height
  - id: totalTreadsCount
    label: Total Number of Treads
  - id: totalStairRunFtIn
    label: Total Horizontal Stair Run
  - id: minStringerLengthFt
    label: Minimum Stringer Length Needed
  - id: totalStringerLumberCost
    label: Total Stringer Lumber Cost

charts:
  tabs:
    - id: geometryTab
      label: Stair Dimensions (Rise vs Run vs Stringer)
    - id: costTab
      label: Stringer Board Cost Breakdown

history_columns:
  - key: totalRiseInches
    label: Total Rise (in)
    source: input
  - key: totalRisersCount
    label: Risers
    source: output
  - key: exactRiserHeightIn
    label: Riser Height
    source: output
  - key: totalStairRunFtIn
    label: Total Run
    source: output
  - key: totalStringerLumberCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/stair-stringer-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Stair Stringer Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate stair riser height, tread count, horizontal run length, 2x12 stringer board hypotenuse, IRC building code compliance, and lumber expenses."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Exact Riser Height Engine — calculates uniform riser heights down to 1/16th inch to ensure IRC code compliance"
    - "Horizontal Run Length — computes total stair projection length based on step tread depth"
    - "Stringer Hypotenuse Math — determines minimum 2x12 board length required for cutting notch stringers"
    - "Stringer Spacing & Costing — calculates total 2x12 framing lumber requirements based on stair width"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Stair Stringer Calculator

howto:
  name: "How to Calculate Stair Stringers & Risers"
  description: "Accurately lay out stair risers, treads, horizontal run, and 2x12 stringer boards."
  step:
    - name: "Measure Total Vertical Rise"
      text: "Measure exact distance from finished lower floor to finished upper deck/floor level in inches."
    - name: "Set Target Riser & Tread Dimensions"
      text: "Input target riser height (ideal is 7 to 7.5 inches) and tread depth (minimum 10 inches)."
    - name: "Specify Stair Width & Stringers"
      text: "Choose number of stringers (3 for standard 36-inch wide stairs, 4 for 48-inch wide stairs)."
    - name: "Review Layout & Cut Stringers"
      text: "Check exact riser height, total horizontal run, diagonal board length, and buy 2x12 lumber stock."

faq:
  - question: "What is the maximum allowed stair riser height according to building code (IRC)?"
    answer: "The International Residential Code (IRC) specifies a maximum riser height of 7.75 inches (7-3/4 in) and a minimum tread depth of 10 inches."
  - question: "What is the ideal riser height and tread depth for comfortable stairs?"
    answer: "The golden rule of stair design states that $\text{Riser Height} + \text{Tread Depth} = 17 \text{ to } 18 \text{ inches}$. Ideal residential stairs feature a 7.5-inch riser and a 10.5-inch tread."
  - question: "Why is there one fewer tread than risers?"
    answer: "The upper floor landing acts as the top step. Therefore, the number of horizontal treads is always equal to $\text{Number of Risers} - 1$."
  - question: "How many stringers do I need for a deck staircase?"
    answer: "Standard wood deck stairs spaced up to 36 inches wide require 3 stringers ( spaced 16 inches on-center). Stairs from 36 to 48 inches wide require 4 stringers."
  - question: "What size lumber board should be used for stair stringers?"
    answer: "Stair stringers must be cut from 2x12 structural lumber boards. Never use 2x10s for cut stringers, as notch cutouts leave insufficient throat strength."
  - question: "How do I adjust the bottom and top of a cut stringer?"
    answer: "You must deduct the thickness of one tread board (e.g. 1.0 or 1.5 inches) from the bottom of the stringer so the first step matches all upper risers."
  - question: "Is my personal data stored anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Stair Stringer Calculator – Riser Height, Tread Run & Board Length

Calculate exact **stair riser counts**, individual **riser heights**, **tread depth run length**, 2x12 stringer diagonal hypotenuse, and total lumber expenses with our free **Stair Stringer Calculator**.

<!-- more -->

## Why Use a Stair Stringer Calculator?

Laying out stairs is one of the most mathematically demanding framing tasks in residential carpentry. Even a 1/4-inch error in riser height causes trip hazards, code violations, or failed building inspections.

- **IRC Code Compliance**: Calculate exact riser heights that fall strictly within IRC maximum limits (7.75 inches).
- **Eliminate Uneven Steps**: Calculate uniform step height down to the exact fraction of an inch across all risers.
- **Accurate Horizontal Run**: Determine the exact footprint length stairs will extend from a deck or upper landing.
- **Size 2x12 Stringer Lumber**: Calculate diagonal hypotenuse length to select the correct 10 ft, 12 ft, or 16 ft board stock.

---

## Stair Stringer Formulas

$$\text{Risers Count } (N_R) = \text{Round}\left(\frac{\text{Total Rise (in)}}{\text{Target Riser Height (in)}}\right)$$

$$\text{Exact Riser Height (in)} = \frac{\text{Total Rise (in)}}{N_R}$$

$$\text{Treads Count } (N_T) = N_R - 1$$

$$\text{Total Horizontal Run (in)} = N_T \times \text{Tread Depth (in)}$$

$$\text{Stringer Length (ft)} = \frac{\sqrt{\text{Total Rise}^2 + \text{Total Run}^2}}{12}$$

$$\text{Total Stringer Cost} = \text{Number of Stringers} \times \text{2x12 Board Price}$$

---

## Stair Layout Reference Table

The table below shows stair geometry calculations across common total rise heights (7.5" target riser, 10.5" tread depth, 3 stringers @ $34.00/board):

| Total Vertical Rise | Total Risers | Exact Riser Height | Total Treads | Total Horizontal Run | Min 2x12 Board | Total Lumber Cost |
|---|---|---|---|---|---|---|
| **36 inches (3 ft)** | 5 Risers | **7.20 inches** | 4 Treads | **42.0 in (3 ft 6 in)** | 8 ft Board | **$102.00** |
| **72 inches (6 ft)** | 10 Risers | **7.20 inches** | 9 Treads | **94.5 in (7 ft 10.5 in)** | 10 ft Board | **$102.00** |
| **96 inches (8 ft)** | 13 Risers | **7.38 inches** | 12 Treads | **126.0 in (10 ft 6 in)** | 12 ft Board | **$102.00** |
| **108 inches (9 ft)** | 14 Risers | **7.71 inches** | 13 Treads | **136.5 in (11 ft 4.5 in)** | 16 ft Board | **$102.00** |
| **120 inches (10 ft)** | 16 Risers | **7.50 inches** | 15 Treads | **157.5 in (13 ft 1.5 in)** | 16 ft Board | **$102.00** |

---

## Step-by-Step Guide: How to Cut Stair Stringers

1. **Determine Total Vertical Rise**: Measure exact height from upper deck surface down to the lower concrete pad or ground level.
2. **Mark Framing Square**: Attach stair gauges to a framing square at the exact riser height (e.g. 7-1/2 in) on the tongue and tread depth (e.g. 10-1/2 in) on the blade.
3. **Step Out Notch Cuts**: Align the square along the edge of a 2x12 board and trace riser/tread lines for all steps.
4. **Bottom Tread Deduction**: Deduct 1 to 1-1/2 inches (exact tread material thickness) from the bottom riser cutout so all steps maintain equal height after tread installation.
5. **Cut and Install**: Use a circular saw to cut straight lines, stopping at corners, and finish notch cuts with a handsaw to avoid overcutting stringer throat strength.

---

## Frequently Asked Questions

### What is the maximum allowed stair riser height according to building code (IRC)?
The International Residential Code (IRC) specifies a maximum riser height of 7.75 inches (7-3/4 in) and a minimum tread depth of 10 inches.

### What is the ideal riser height and tread depth for comfortable stairs?
The golden rule of stair design states that $\text{Riser Height} + \text{Tread Depth} = 17 \text{ to } 18 \text{ inches}$. Ideal residential stairs feature a 7.5-inch riser and a 10.5-inch tread.

### Why is there one fewer tread than risers?
The upper floor landing acts as the top step. Therefore, the number of horizontal treads is always equal to $\text{Number of Risers} - 1$.

### How many stringers do I need for a deck staircase?
Standard wood deck stairs spaced up to 36 inches wide require 3 stringers (spaced 16 inches on-center). Stairs from 36 to 48 inches wide require 4 stringers.

### What size lumber board should be used for stair stringers?
Stair stringers must be cut from 2x12 structural lumber boards. Never use 2x10s for cut stringers, as notch cutouts leave insufficient throat strength.

### How do I adjust the bottom and top of a cut stringer?
You must deduct the thickness of one tread board (e.g. 1.0 or 1.5 inches) from the bottom of the stringer so the first step matches all upper risers.

### Is my personal data stored anywhere?
No. All calculations run locally in your web browser.
