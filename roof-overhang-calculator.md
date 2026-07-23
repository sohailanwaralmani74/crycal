---
layout: tool
title: Roof Overhang Calculator – Tail Length, Fascia Drop & Soffit Venting
description: Calculate rafter overhang tail length, vertical fascia board drop below top plate, recommended fascia width, and required soffit intake vent area in sq ft.
permalink: /roof-overhang-calculator
tool_id: roof-overhang-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: horizontalOverhangInches
    label: Horizontal Eave / Soffit Overhang (Inches)
    type: number
    default: 16
    step: 1
    min: 0
    placeholder: "e.g., 16"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 6
    step: 0.5
    min: 1
    max: 24
    suffix: '/12'
    placeholder: "e.g., 6"

  - id: wallHeightFeet
    label: Exterior Wall Plate Height (Feet)
    type: number
    default: 9
    step: 0.5
    min: 6
    placeholder: "e.g., 9"

  - id: atticAreaSqFt
    label: Attic Floor Area for Soffit Venting (Sq Ft)
    type: number
    default: 1200
    step: 50
    min: 100
    placeholder: "e.g., 1200"

outputs:
  - id: overhangTailLength
    label: Rafter Overhang Tail Length (Ridge Slope Inches)
  - id: fasciaBoardDrop
    label: Vertical Fascia Drop Below Wall Plate (Inches)
  - id: soffitVentAreaNeeded
    label: Soffit Intake Net Free Vent Area (Sq Ft / Sq In)
  - id: recommendedStockBoard
    label: Recommended Fascia Board Depth (1x Lumber)

charts:
  tabs:
    - id: overhangTriangle
      label: Overhang Tail vs Horizontal Width vs Plumb Drop
    - id: atticVentingSplit
      label: Soffit Intake vs Ridge Exhaust Vent Area

history_columns:
  - key: horizontalOverhangInches
    label: Overhang (in)
    source: input
  - key: roofPitch
    label: Pitch
    source: input
  - key: overhangTailLength
    label: Tail Length
    source: output
  - key: fasciaBoardDrop
    label: Fascia Drop
    source: output
  - key: soffitVentAreaNeeded
    label: Soffit NFVA
    source: output
  - key: recommendedStockBoard
    label: Fascia Lumber
    source: output

js_file: assets/js/calculators/roof-overhang-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Overhang Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate rafter overhang tail hypotenuse length, vertical fascia drop depth, fascia lumber sizing, and soffit intake ventilation area."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Trigonometric Overhang Geometry — exact slope hypotenuse length for rafter tails"
    - "Fascia Plumb Drop Math — calculates vertical drop below top plate for siding alignment"
    - "Soffit Ventilation NFVA — calculates code-compliant eave intake area based on attic sq ft"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Roof Overhang Calculator

howto:
  name: "How to Calculate Roof Overhang Dimensions"
  description: "Determine rafter tail overhang lengths, fascia drop depths, and soffit intake ventilation needs."
  step:
    - name: "Input Horizontal Overhang"
      text: "Enter horizontal distance in inches from exterior wall framing to the outer edge of the fascia board."
    - name: "Select Roof Pitch"
      text: "Input vertical rise per 12 inches of run for your roof rafter system."
    - name: "Enter Exterior Wall Height"
      text: "Specify top plate wall height in feet to contextualize total overhang clearance."
    - name: "Input Attic Floor Area"
      text: "Enter total attic floor square footage to determine intake soffit vent requirements under building code."

faq:
  - question: "What is a rafter overhang tail?"
    answer: "A rafter overhang tail is the extended end of a common rafter that protrudes beyond the exterior wall top plate to form the roof eave, protecting siding and windows from rain."
  - question: "How do you calculate rafter overhang length?"
    answer: "Rafter Overhang Tail Length = Horizontal Overhang (in) × √(1 + (Pitch / 12)²). For a 16-inch horizontal overhang on a 6/12 pitch roof, tail length = 16 × 1.118 = 17.89 inches."
  - question: "What is fascia drop below wall plate?"
    answer: "Fascia drop is the vertical distance the outer edge of the rafter tail extends below the top plate level. Formula: Vertical Drop = Horizontal Overhang (in) × (Pitch / 12)."
  - question: "How wide should a roof overhang be?"
    answer: "Standard residential roof overhangs range from 12 to 24 inches. A 16 to 18-inch overhang offers ideal solar shading, window weather protection, and architectural balance for standard 8 to 9-foot wall heights."
  - question: "How much soffit vent area is required by building code?"
    answer: "The International Residential Code (IRC R806.2) requires 1 sq ft of Net Free Vent Area (NFVA) per 300 sq ft of attic floor space when 50% to 80% is placed in the ridge exhaust. Soffit intake requires 50% of total NFVA."
  - question: "What size fascia board should I use?"
    answer: "Fascia board width depends on rafter tail plumb cut depth. 2x6 rafters typically take 1x6 fascia (5.5\" width), while 2x8 rafters or steep roof drops require 1x8 fascia (7.25\" width)."
  - question: "Is my roof overhang calculation saved on external servers?"
    answer: "No. All calculations run strictly inside your local web browser."
---

# Roof Overhang Calculator – Tail Length, Fascia Drop & Soffit Venting

Calculate exact **rafter overhang tail lengths**, vertical fascia board drop below wall plates, recommended stock fascia lumber depth, and code-compliant **soffit intake vent area**.

<!-- more -->

## Why Roof Overhang Geometry Matters

Roof overhangs serve three primary structural and environmental functions:
1. **Weather Protection**: Shielding exterior cladding, window frames, and doors from wind-driven rain.
2. **Solar Control**: Blocking high summer solar radiation while admitting lower winter sunlight for energy efficiency.
3. **Attic Ventilation**: Providing continuous eave intake ventilation to keep attics cool and prevent winter ice dams.

Using trigonometric rafter tail calculations ensures precise cuts before framing, avoiding costly jobsite trimming or misalignment with fascia boards.

---

## Roof Overhang Mathematical Formulas

$$\text{Pitch Factor } (M_p) = \sqrt{1 + \left(\frac{\text{Pitch}}{12}\right)^2}$$
$$\text{Rafter Tail Length (in)} = \text{Horizontal Overhang (in)} \times M_p$$
$$\text{Fascia Plumb Drop (in)} = \text{Horizontal Overhang (in)} \times \left(\frac{\text{Pitch}}{12}\right)$$
$$\text{Total Intake NFVA (sq ft)} = \frac{\text{Attic Floor Area (sq ft)}}{600}$$
$$\text{Total Intake NFVA (sq in)} = \text{Total Intake NFVA (sq ft)} \times 144$$

---

## Overhang Dimensions Reference Table (16-Inch Horizontal Overhang)

| Roof Pitch | Pitch Factor ($M_p$) | Rafter Tail Length (16" Overhang) | Vertical Fascia Drop | Recommended Fascia Board | Minimum Soffit NFVA (1,200 sq ft Attic) |
|---|---|---|---|---|---|
| **3/12 Pitch** | 1.031 | **16.49 in** | **4.00 in** | **1x6 Board (5.5")** | 1.00 sq ft (144 sq in) |
| **4/12 Pitch** | 1.054 | **16.86 in** | **5.33 in** | **1x6 Board (5.5")** | 1.00 sq ft (144 sq in) |
| **5/12 Pitch** | 1.083 | **17.33 in** | **6.67 in** | **1x8 Board (7.25")** | 1.00 sq ft (144 sq in) |
| **6/12 Pitch** | 1.118 | **17.89 in** | **8.00 in** | **1x8 Board (7.25")** | 1.00 sq ft (144 sq in) |
| **8/12 Pitch** | 1.202 | **19.23 in** | **10.67 in** | **1x10 Board (9.25")** | 1.00 sq ft (144 sq in) |
| **10/12 Pitch** | 1.302 | **20.83 in** | **13.33 in** | **1x12 Board (11.25")** | 1.00 sq ft (144 sq in) |
| **12/12 Pitch** | 1.414 | **22.63 in** | **16.00 in** | **1x12 Board (11.25")** | 1.00 sq ft (144 sq in) |

---

## Step-by-Step Framing & Venting Setup

1. **Determine Horizontal Overhang**: Measure horizontal distance in inches from exterior sheathing line to outer fascia rim.
2. **Calculate Rafter Tail**: Multiply horizontal width by the slope pitch factor to mark the top edge cut length on the rafter.
3. **Plumb Cut Rafter End**: Mark fascia plumb cut perpendicular to level top plate reference line.
4. **Select Fascia Lumber**: Ensure fascia width comfortably covers the plumb tail cut and hides sub-fascia framing.
5. **Install Soffit Vents**: Install continuous strip vents or perforated soffit panels matching the required Net Free Vent Area.

---

## Frequently Asked Questions

### What is a rafter overhang tail?
A rafter overhang tail is the extended end of a common rafter that protrudes beyond the exterior wall top plate to form the roof eave, protecting siding and windows from rain.

### How do you calculate rafter overhang length?
Rafter Overhang Tail Length = Horizontal Overhang (in) × √(1 + (Pitch / 12)²). For a 16-inch horizontal overhang on a 6/12 pitch roof, tail length = 16 × 1.118 = 17.89 inches.

### What is fascia drop below wall plate?
Fascia drop is the vertical distance the outer edge of the rafter tail extends below the top plate level. Formula: Vertical Drop = Horizontal Overhang (in) × (Pitch / 12).

### How wide should a roof overhang be?
Standard residential roof overhangs range from 12 to 24 inches. A 16 to 18-inch overhang offers ideal solar shading, window weather protection, and architectural balance for standard 8 to 9-foot wall heights.

### How much soffit vent area is required by building code?
The International Residential Code (IRC R806.2) requires 1 sq ft of Net Free Vent Area (NFVA) per 300 sq ft of attic floor space when 50% to 80% is placed in the ridge exhaust. Soffit intake requires 50% of total NFVA.

### What size fascia board should I use?
Fascia board width depends on rafter tail plumb cut depth. 2x6 rafters typically take 1x6 fascia (5.5" width), while 2x8 rafters or steep roof drops require 1x8 fascia (7.25" width).

### Is my roof overhang calculation saved on external servers?
No. All calculations run strictly inside your local web browser.
