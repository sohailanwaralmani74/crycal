---
layout: tool
title: Roof Flashing Calculator – Drip Edge, Step Flashing & Valley Metal
description: Calculate step flashing pieces, drip edge 10-ft metal strips, W-valley metal flashing, and chimney flashing kits for complete roof re-roofing projects.
permalink: /roof-flashing-calculator
tool_id: roof-flashing-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: roofEaveRakeFeet
    label: Perimeter Drip Edge Length (Eaves + Rakes in Feet)
    type: number
    default: 180
    step: 5
    min: 10
    placeholder: "e.g., 180"

  - id: wallIntersectionFeet
    label: Sidewall Abutment Step Flashing Length (Feet)
    type: number
    default: 30
    step: 2
    min: 0
    placeholder: "e.g., 30"

  - id: valleyLengthFeet
    label: Roof Valley Metal Length (Feet)
    type: number
    default: 24
    step: 2
    min: 0
    placeholder: "e.g., 24"

  - id: chimneyWidthInches
    label: Chimney Front Width (Inches)
    type: number
    default: 32
    step: 2
    min: 0
    placeholder: "e.g., 32"

  - id: chimneyDepthInches
    label: Chimney Side Depth (Inches)
    type: number
    default: 24
    step: 2
    min: 0
    placeholder: "e.g., 24"

  - id: shingleExposureInches
    label: Shingle Exposure / Course Height (Inches)
    type: number
    default: 5
    step: 0.25
    min: 4
    max: 8
    placeholder: "e.g., 5"

outputs:
  - id: stepFlashingPieces
    label: Step Flashing Pieces (4"x4"x7") Needed (incl. 10% Waste)
  - id: dripEdgeSticks
    label: 10-ft Drip Edge Metal Strips Needed
  - id: valleyMetalSticks
    label: 10-ft W-Valley Metal Strips Needed
  - id: chimneyFlashingKit
    label: Chimney Flashing Materials Kit Summary

charts:
  tabs:
    - id: flashingComponentBreakdown
      label: Drip Edge vs Step Flashing vs Valley Linear Footage
    - id: flashingWasteAllowance
      label: Net Material Length vs 10% Overlap Allowance

history_columns:
  - key: roofEaveRakeFeet
    label: Drip Edge (ft)
    source: input
  - key: wallIntersectionFeet
    label: Sidewall (ft)
    source: input
  - key: stepFlashingPieces
    label: Step Flashing (pcs)
    source: output
  - key: dripEdgeSticks
    label: Drip Edge (sticks)
    source: output
  - key: valleyMetalSticks
    label: Valley Metal (sticks)
    source: output
  - key: chimneyFlashingKit
    label: Chimney Flashing
    source: output

js_file: assets/js/calculators/roof-flashing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Flashing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate step flashing piece counts, 10-ft drip edge metal strips, W-valley flashing rolls, and chimney apron/cricket flashing kits."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Drip Edge & Valley Strips — converts total linear feet into standard 10-ft metal stick counts"
    - "Step Flashing Piece Math — computes exact piece count based on shingle course exposure"
    - "Chimney Flashing Kit Generator — calculates apron, step, and head cricket flashing components"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Roof Flashing Calculator

howto:
  name: "How to Calculate Roof Flashing Requirements"
  description: "Determine metal flashing material quantities for roof eaves, sidewalls, valleys, and chimneys."
  step:
    - name: "Measure Perimeter Edge"
      text: "Measure total linear feet along eaves (bottom roof edge) and rakes (gable slopes) for drip edge metal."
    - name: "Measure Sidewall Intersections"
      text: "Measure vertical wall-to-roof abutment lengths in feet where step flashing cards are installed under siding."
    - name: "Measure Valley Lengths"
      text: "Total all valley seam lengths in feet for W-profile metal flashing strips."
    - name: "Input Chimney Dimensions"
      text: "Measure chimney width across roof slope and side depth along roof slope."

faq:
  - question: "What is roof flashing?"
    answer: "Roof flashing consists of thin sheet metal strips (aluminum, galvanized steel, or copper) installed at roof joints, valleys, walls, and chimneys to prevent water penetration."
  - question: "How do you calculate step flashing pieces?"
    answer: "Step Flashing Pieces = (Total Sidewall Length in Inches / Shingle Exposure in Inches) + 1 piece per wall run. At 5-inch exposure, each foot of wall requires 2.4 step flashing cards (4\"x4\"x7\")."
  - question: "How many drip edge sticks do I need?"
    answer: "Add total eave feet plus rake slope feet, multiply by 1.10 (10% for lap overlaps and corner cuts), and divide by 10 feet (standard commercial metal stick length)."
  - question: "What components are in a chimney flashing kit?"
    answer: "A complete chimney flashing kit includes a base apron (front), step flashing cards (sides), counter-flashing embedded in masonry mortar joints, and a back head apron or cricket (saddle)."
  - question: "What size drip edge should be used?"
    answer: "Standard aluminum drip edge has a 1.5\" to 2\" roof flange deck overlap and a 1.5\" vertical drop leg to direct water cleanly into gutters without touching fascia boards."
  - question: "Why is 10% waste added to flashing calculations?"
    answer: "10% waste accounts for 2-inch to 4-inch lap joint overlaps, corner miters, rake edge overhang tabs, and trimming offcuts."
  - question: "Is my flashing calculation saved on external servers?"
    answer: "No. All calculations run strictly inside your local browser."
---

# Roof Flashing Calculator – Drip Edge, Step Flashing & Valley Metal

Calculate required **step flashing pieces**, **10-ft drip edge metal strips**, **W-valley metal flashing**, and complete **chimney flashing kit materials** for residential roof replacements.

<!-- more -->

## Why Metal Roof Flashing is Critical

Metal flashing forms the secondary line of defense against roof leaks. Over 80% of roof leaks occur at roof transitions, sidewall intersections, dormers, and chimney penetrations where shingles alone cannot seal out water.

Using accurate material estimations ensures continuous lap overlaps (2" minimum for drip edge, 3" for step flashing, 6" for valley metal) without mid-project store trips.

---

## Roof Flashing Mathematical Formulas

$$\text{Drip Edge 10-ft Sticks} = \left\lceil \frac{\text{Perimeter Feet} \times 1.10}{10} \right\rceil$$
$$\text{Valley Metal 10-ft Sticks} = \left\lceil \frac{\text{Valley Feet} \times 1.10}{10} \right\rceil$$
$$\text{Step Flashing Pieces Net} = \left\lceil \frac{\text{Sidewall Feet} \times 12}{\text{Shingle Exposure (in)}} \right\rceil$$
$$\text{Step Flashing Pieces Gross} = \left\lceil \text{Step Flashing Net} \times 1.10 \right\rceil$$

---

## Flashing Material Estimation Quick Reference

| Roof Perimeter / Walls | 10-ft Drip Edge (incl 10%) | Sidewall Length | Step Flashing Pieces (5" Exposure) | Valley Length | 10-ft Valley Metal (incl 10%) |
|---|---|---|---|---|---|
| **120 ft Perimeter** | **14 Sticks** | 15 ft Sidewall | **39 Pieces** | 12 ft Valley | **2 Sticks** |
| **150 ft Perimeter** | **17 Sticks** | 20 ft Sidewall | **53 Pieces** | 18 ft Valley | **2 Sticks** |
| **180 ft Perimeter** | **20 Sticks** | 30 ft Sidewall | **79 Pieces** | 24 ft Valley | **3 Sticks** |
| **220 ft Perimeter** | **25 Sticks** | 40 ft Sidewall | **106 Pieces** | 30 ft Valley | **4 Sticks** |
| **260 ft Perimeter** | **29 Sticks** | 50 ft Sidewall | **132 Pieces** | 36 ft Valley | **4 Sticks** |
| **300 ft Perimeter** | **33 Sticks** | 60 ft Sidewall | **159 Pieces** | 48 ft Valley | **6 Sticks** |

---

## Step-by-Step Installation Order

1. **Eave Drip Edge**: Install metal drip edge directly onto roof sheathing deck along lower eaves *before* underlayment felt.
2. **Underlayment & Valley Metal**: Install ice & water shield in valleys, followed by continuous W-valley metal flashing strips.
3. **Rake Drip Edge**: Install drip edge along rake slopes *over* the underlayment.
4. **Sidewall Step Flashing**: Weave 4"x4"x7" step flashing bent cards with each shingle course up sidewalls (one step card per shingle course).
5. **Chimney Flashing**: Install front apron, side step cards, rear head cricket, and top counter-flashing set into masonry mortar joints.

---

## Frequently Asked Questions

### What is roof flashing?
Roof flashing consists of thin sheet metal strips (aluminum, galvanized steel, or copper) installed at roof joints, valleys, walls, and chimneys to prevent water penetration.

### How do you calculate step flashing pieces?
Step Flashing Pieces = (Total Sidewall Length in Inches / Shingle Exposure in Inches) + 1 piece per wall run. At 5-inch exposure, each foot of wall requires 2.4 step flashing cards (4"x4"x7").

### How many drip edge sticks do I need?
Add total eave feet plus rake slope feet, multiply by 1.10 (10% for lap overlaps and corner cuts), and divide by 10 feet (standard commercial metal stick length).

### What components are in a chimney flashing kit?
A complete chimney flashing kit includes a base apron (front), step flashing cards (sides), counter-flashing embedded in masonry mortar joints, and a back head apron or cricket (saddle).

### What size drip edge should be used?
Standard aluminum drip edge has a 1.5" to 2" roof flange deck overlap and a 1.5" vertical drop leg to direct water cleanly into gutters without touching fascia boards.

### Why is 10% waste added to flashing calculations?
10% waste accounts for 2-inch to 4-inch lap joint overlaps, corner miters, rake edge overhang tabs, and trimming offcuts.

### Is my flashing calculation saved on external servers?
No. All calculations run strictly inside your local browser.
