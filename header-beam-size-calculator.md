---
layout: tool
title: "Header & Beam Sizing Calculator | Wood Framing Tool"
description: "Calculate required header beam size, ply count, and span limits for load-bearing door and window wall openings based on building loads."
permalink: /header-beam-size-calculator
tool_id: header-beam-size-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: openingWidthFt
    label: Rough Opening Width (Feet)
    type: number
    default: 6
    step: 0.5
    min: 2
    max: 20
    placeholder: "e.g., 6"

  - id: buildingWidthFt
    label: Building Width / Tributary Width (Feet)
    type: number
    default: 28
    step: 2
    min: 12
    max: 60
    placeholder: "e.g., 28"

  - id: storiesSupported
    label: Supported Loading Condition
    type: select
    default: "roof_one_floor"
    options:
      - value: "roof_only"
        label: "Roof & Ceiling Only (Single Story Roof Load)"
      - value: "roof_one_floor"
        label: "Roof + 1 Clear-Span Floor (2-Story Wall)"
      - value: "roof_two_floors"
        label: "Roof + 2 Clear-Span Floors (3-Story Wall)"

  - id: lumberSpecies
    label: Framing Lumber Species & Grade
    type: select
    default: "spf_2"
    options:
      - value: "spf_2"
        label: "Spruce-Pine-Fir (SPF) #2"
      - value: "syp_2"
        label: "Southern Yellow Pine (SYP) #2"
      - value: "df_2"
        label: "Douglas Fir-Larch (DF-L) #2"
      - value: "lvl_20e"
        label: "Engineered LVL (2.0E Laminated Veneer)"

  - id: snowLoadPsf
    label: Ground / Roof Snow Load (PSF)
    type: number
    default: 30
    step: 5
    min: 0
    max: 100
    suffix: 'psf'
    placeholder: "e.g., 30"

outputs:
  - id: recommendedHeader
    label: Recommended Header Beam Size
  - id: maxSpanFt
    label: Maximum Allowable Span (Feet)
  - id: totalLoadPli
    label: Total Uniform Linear Load (Lbs/Ft)
  - id: jackStudsNeeded
    label: Required Jack / Trimmer Studs per Side

charts:
  tabs:
    - id: loadVsCapacity
      label: Bending Capacity vs Applied Load
    - id: spanComparison
      label: Max Allowable Span by Wood Species

history_columns:
  - key: openingWidthFt
    label: Opening Width (ft)
    source: input
  - key: storiesSupported
    label: Loading Condition
    source: input
  - key: recommendedHeader
    label: Header Recommendation
    source: output
  - key: jackStudsNeeded
    label: Jack Studs / Side
    source: output

js_file: assets/js/calculators/header-beam-size-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Header Beam Size Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Determine header beam depth, ply thickness, maximum span limits, and trimmer stud counts for load-bearing wall openings."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates header sizes for doors, windows, and garage openings"
    - "Supports dimensional lumber (#2 SPF, SYP, DF-L) and 2.0E LVL beams"
    - "Computes tributary loading based on building width and roof snow loads"
    - "Determines required jack / trimmer studs for bearing support"

breadcrumb:
  - name: Home
    url: /
  - name: Lumber & Framing
    url: /lumber-framing
  - name: Header Beam Size Calculator

howto:
  name: "How to Size a Load-Bearing Wall Header Beam"
  description: "Calculate required header depth, number of plies, and trimmer studs for structural wall openings."
  step:
    - name: "Measure rough opening width"
      text: "Determine clear span distance of window, door, or patio opening in feet."
    - name: "Determine tributary building load"
      text: "Measure total building width (rafter/joist span) to calculate tributary floor and roof loads."
    - name: "Select lumber species & grade"
      text: "Choose dimensional framing lumber (#2 SPF, SYP, DF-L) or engineered LVL headers."
    - name: "Verify deflection and bearing limits"
      text: "Calculate bending moments and shear to determine required header plies and jack stud bearing counts."

faq:
  - question: "Rule of thumb for door and window header sizing?"
    answer: "A common traditional rule of thumb is header depth in inches equals opening width in feet plus 2 inches (e.g., 4-ft opening = double 2x6; 6-ft opening = double 2x8; 8-ft opening = double 2x10). However, heavy snow or multi-story loads require calculated engineering."
  - question: "How many jack studs (trimmers) are required per side for a header?"
    answer: "Openings up to 6 feet wide supporting a single story typically require 1 jack stud per side. Openings from 6 to 10 feet wide require 2 jack studs per side. Spans over 10 feet or heavy multi-story loads require 3 jack studs or steel bearing plates."
  - question: "When should engineered LVL headers be used instead of dimensional lumber?"
    answer: "Engineered LVL headers (Laminated Veneer Lumber) should be used for spans exceeding 8 to 10 feet, wide garage door openings (16 ft), or heavily loaded exterior walls where dimensional lumber exceeds maximum depth limits."
  - question: "What is tributary width in header load calculations?"
    answer: "Tributary width is half the span of joists or rafters supported by the wall containing the header. For a 28-foot wide building where rafters span center-to-ridge, the tributary roof width supported by an exterior wall is 14 feet."
  - question: "What deflection limits apply to window and door headers?"
    answer: "Building codes (IRC) mandate a maximum deflection limit of L/240 for total load and L/360 for live load on standard exterior walls. Openings with sensitive glass or sliding doors often require L/480 to prevent binding."
  - question: "Can non-bearing interior wall headers be smaller?"
    answer: "Yes, non-load-bearing interior partition wall headers do not support floor or roof loads. Double 2x4 headers are structurally sufficient for non-bearing spans up to 8 feet wide."
  - question: "How is a double 2x header insulated in exterior framing?"
    answer: "Standard 2x dimensional lumber headers are 3.5 inches thick in a 2x6 wall (5.5 inches deep), leaving a 2-inch interior gap that should be filled with rigid foam insulation (R-10 to R-13) to prevent thermal bridging."
---

# Header Beam Size Calculator

Determine structural header beam depth, ply count, maximum span allowances, and bearing jack stud requirements for door and window wall openings.

This 100% private, client-side calculator processes structural load math directly inside your browser without external server transmission.

<!-- more -->

## Why Use the Header Beam Size Calculator?

Framing open spans in load-bearing exterior and interior walls requires careful structural calculations to prevent ceiling sag, binding doors, cracked drywall, and structural framing failure. A header acts as a short horizontal beam transferring roof, floor, and wall loads around wall openings down to the foundation.

Using this **Header Beam Size Calculator** allows builders, framers, and engineers to:

1. **Calculate Precise Header Depths:** Size double 2x6, 2x8, 2x10, 2x12, or engineered LVL beams based on exact building span loads.
2. **Determine Jack Stud Bearing Counts:** Ensure adequate end-bearing support by identifying when 1, 2, or 3 trimmer studs are required per side.
3. **Account for Snow & Live Loads:** Incorporate local ground snow loads ($0 - 100\text{ psf}$) and multi-story floor live loads into span limits.
4. **Comply with Building Codes:** Verify structural compliance under International Residential Code (IRC Table R602.7) span standards.

---

## Mathematical Formulas & Mechanics

### 1. Tributary Load Calculation
$$\text{Tributary Width } W_{\text{trib}} = \frac{\text{Building Width}}{2}$$
$$w_{\text{total}} = W_{\text{trib}} \times \left( q_{\text{roof\_dead}} + q_{\text{roof\_snow}} + q_{\text{floor\_live}} \right) + q_{\text{wall}}$$

Where typical design loads are:
- Roof Dead Load: $15\text{ psf}$
- Floor Live Load (if applicable): $40\text{ psf}$
- Floor Dead Load: $10\text{ psf}$

### 2. Bending Moment & Shear Equations
$$M_{\text{max}} = \frac{w_{\text{total}} \times L^2}{8}$$
$$V_{\text{max}} = \frac{w_{\text{total}} \times L}{2}$$

### 3. Deflection Limitation (L/240 Total Load)
$$\Delta_{\text{actual}} = \frac{5 \cdot w_{\text{total}} \cdot L^4}{384 \cdot E \cdot I} \le \Delta_{\text{allowable}} = \frac{L \cdot 12}{240}$$

Where $E$ is Modulus of Elasticity ($1.4 \times 10^6\text{ psi}$ for SPF #2; $2.0 \times 10^6\text{ psi}$ for LVL) and $I = \frac{b h^3}{12}$ is Moment of Inertia.

---

## Real-World Comparison & Benchmark Table

Maximum allowable clear spans for double $2\times$ headers supporting roof + 1 clear-span floor ($28\text{ ft}$ building width, $30\text{ psf}$ snow load):

| Header Size | SPF #2 Max Span | SYP #2 Max Span | 2.0E LVL (Double 1-3/4") | Req. Jack Studs ($\le 6\text{ ft}$) | Req. Jack Studs ($> 6\text{ ft}$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Double 2x6** | $3\text{ ft } 2\text{ in}$ | $3\text{ ft } 8\text{ in}$ | $4\text{ ft } 6\text{ in}$ | 1 Jack Stud | N/A |
| **Double 2x8** | $4\text{ ft } 1\text{ in}$ | $4\text{ ft } 9\text{ in}$ | $5\text{ ft } 10\text{ in}$ | 1 Jack Stud | 2 Jack Studs |
| **Double 2x10** | $4\text{ ft } 11\text{ in}$ | $5\text{ ft } 9\text{ in}$ | $7\text{ ft } 2\text{ in}$ | 1 Jack Stud | 2 Jack Studs |
| **Double 2x12** | $5\text{ ft } 9\text{ in}$ | $6\text{ ft } 9\text{ in}$ | $8\text{ ft } 5\text{ in}$ | 1 Jack Stud | 2 Jack Studs |
| **Double 11-7/8" LVL** | $7\text{ ft } 4\text{ in}$ | $8\text{ ft } 2\text{ in}$ | $10\text{ ft } 8\text{ in}$ | 2 Jack Studs | 2 Jack Studs |
| **Triple 11-7/8" LVL** | $9\text{ ft } 6\text{ in}$ | $10\text{ ft } 8\text{ in}$ | $14\text{ ft } 2\text{ in}$ | 2 Jack Studs | 3 Jack Studs |

---

## Step-by-Step How-To Guide

1. **Measure Opening Clear Span:** Measure exact rough opening width in feet for door, window, or garage framed opening.
2. **Determine Tributary Building Span:** Input building width to determine weight transferred from ceiling joists and roof rafters.
3. **Select Loading Condition:** Choose single story (roof load only), 2-story (roof + 1 floor), or 3-story (roof + 2 floors).
4. **Choose Wood Species & Grade:** Select dimensional framing lumber (#2 SPF, SYP, DF-L) or engineered LVL.
5. **Review Header Size & Jack Stud Requirement:** Inspect calculated header depth, required plies, and trimmer stud counts per side.

---

## Frequently Asked Questions

### Rule of thumb for door and window header sizing?
A common traditional rule of thumb is header depth in inches equals opening width in feet plus 2 inches (e.g., 4-ft opening = double 2x6; 6-ft opening = double 2x8; 8-ft opening = double 2x10). However, heavy snow or multi-story loads require calculated engineering.

### How many jack studs (trimmers) are required per side for a header?
Openings up to 6 feet wide supporting a single story typically require 1 jack stud per side. Openings from 6 to 10 feet wide require 2 jack studs per side. Spans over 10 feet or heavy multi-story loads require 3 jack studs or steel bearing plates.

### When should engineered LVL headers be used instead of dimensional lumber?
Engineered LVL headers (Laminated Veneer Lumber) should be used for spans exceeding 8 to 10 feet, wide garage door openings (16 ft), or heavily loaded exterior walls where dimensional lumber exceeds maximum depth limits.

### What is tributary width in header load calculations?
Tributary width is half the span of joists or rafters supported by the wall containing the header. For a 28-foot wide building where rafters span center-to-ridge, the tributary roof width supported by an exterior wall is 14 feet.

### What deflection limits apply to window and door headers?
Building codes (IRC) mandate a maximum deflection limit of L/240 for total load and L/360 for live load on standard exterior walls. Openings with sensitive glass or sliding doors often require L/480 to prevent binding.

### Can non-bearing interior wall headers be smaller?
Yes, non-load-bearing interior partition wall headers do not support floor or roof loads. Double 2x4 headers are structurally sufficient for non-bearing spans up to 8 feet wide.

### How is a double 2x header insulated in exterior framing?
Standard 2x dimensional lumber headers are 3.5 inches thick in a 2x6 wall (5.5 inches deep), leaving a 2-inch interior gap that should be filled with rigid foam insulation (R-10 to R-13) to prevent thermal bridging.
