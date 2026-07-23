---
layout: tool
title: Masonry Grout Calculator – CMU Block Core Filling Volume & Bags
description: Calculate fine or coarse masonry grout volume in cubic yards, cubic feet, and 80lb bags needed for filling hollow CMU concrete block cores.
permalink: /masonry-grout-calculator
tool_id: masonry-grout-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: blockCount
    label: Total Hollow CMU Block Count
    type: number
    default: 500
    step: 10
    min: 1
    placeholder: "e.g., 500"

  - id: blockSize
    label: CMU Block Width / Thickness
    type: select
    default: "8inch"
    options:
      - value: "6inch"
        label: "6\" Standard CMU (0.16 cu ft grout per block)"
      - value: "8inch"
        label: "8\" Standard CMU (0.28 cu ft grout per block)"
      - value: "10inch"
        label: "10\" Standard CMU (0.38 cu ft grout per block)"
      - value: "12inch"
        label: "12\" Standard CMU (0.47 cu ft grout per block)"

  - id: groutSpacing
    label: Core Filling Spacing / Interval
    type: select
    default: "full"
    options:
      - value: "full"
        label: "100% Fully Grouted Wall (All cores filled)"
      - value: "16inch"
        label: "Solid Cores @ 16\" o.c. (50% cores filled)"
      - value: "24inch"
        label: "Solid Cores @ 24\" o.c. (33% cores filled)"
      - value: "32inch"
        label: "Solid Cores @ 32\" o.c. (25% cores filled)"
      - value: "48inch"
        label: "Solid Cores @ 48\" o.c. (17% cores filled)"

  - id: wastePct
    label: Grout Waste & Overfill Factor (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePer80lbBag
    label: Price per 80 lb Pre-Mixed Grout Bag 
    type: number
    default: 9.50
    step: 0.50
    min: 0
    prefix: '$'
    placeholder: "e.g., 9.50"

outputs:
  - id: totalCubicYards
    label: Grout Volume (Cubic Yards)
  - id: totalCubicFeet
    label: Grout Volume (Cubic Feet)
  - id: bags80lb
    label: 80 lb Pre-Mixed Grout Bags
  - id: filledCores
    label: Total Filled Cores Count
  - id: totalCost
    label: Total Grout Material Cost

charts:
  tabs:
    - id: volumeBreakdown
      label: Grout Volume vs Waste
    - id: costBreakdown
      label: Material Cost Breakdown 

history_columns:
  - key: blockCount
    label: CMU Blocks
    source: input
  - key: blockSize
    label: Block Width
    source: input
  - key: totalCubicYards
    label: Volume (cu yd)
    source: output
  - key: bags80lb
    label: 80lb Bags
    source: output
  - key: totalCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/masonry-grout-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Masonry Grout Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate fine and coarse masonry grout volume in cubic yards and 80lb bags for filling hollow concrete masonry unit (CMU) block cores."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates grout volume for 6\", 8\", 10\", and 12\" CMU blocks"
    - "Supports fully grouted and reinforced partial core spacing (16\", 24\", 32\", 48\" o.c.)"
    - "Provides 80 lb pre-mixed masonry grout bag estimates"
    - "Computes ready-mix truck yardage for large masonry wall projects"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Masonry Grout Calculator

howto:
  name: "How to Calculate Masonry Grout Volume for Concrete Block Walls"
  description: "Determine exact cubic yards or 80lb bags of grout needed to consolidate CMU block cores."
  step:
    - name: "Count total hollow CMU blocks"
      text: "Determine wall surface area and convert to total standard 8x8x16 CMU block count (1.125 blocks per sq ft)."
    - name: "Identify CMU block width"
      text: "Select block nominal thickness (6\", 8\", 10\", or 12\") to match structural drawings."
    - name: "Set core filling rebar spacing"
      text: "Check structural notes for full grouting or partial core filling (e.g., vertical rebar cores at 24\" or 48\" o.c.)."
    - name: "Calculate total grout yardage and 80lb bags"
      text: "Multiply filled core volume factors by block count, include 10% waste, and convert to cubic yards or 80lb bag counts."

faq:
  - question: "How much grout is needed to fill an 8-inch CMU block?"
    answer: "A standard 8x8x16 inch hollow CMU block has two internal cores that hold approximately 0.28 cubic feet of grout when fully poured. Filling 100 blocks requires approximately 1.04 cubic yards of grout."
  - question: "How many 80 lb bags of grout make a cubic yard?"
    answer: "It takes approximately 40 to 42 bags of 80 lb pre-mixed masonry grout to equal 1 cubic yard (27 cubic feet) of yield once mixed with water."
  - question: "What is the difference between Fine Grout and Coarse Grout?"
    answer: "Fine grout consists of Portland cement, lime, and fine sand, used when grout spaces are small (under 2 inches). Coarse grout includes pea gravel aggregate (up to 3/8\") and is used for large core cavities (2 inches or larger)."
  - question: "What core filling spacing is standard for retaining walls?"
    answer: "Structural retaining walls typically require vertical rebar cores grouted at 16\" or 24\" on center, along with continuous top bond beam grouting."
  - question: "How high can masonry grout be poured in a single lift?"
    answer: "Low-lift grouting allows pours up to 5 feet high. High-lift grouting allows pours up to 24 feet high, provided cleanout holes are installed at the base of every vertical core."
  - question: "Does mortar in horizontal bed joints reduce core grout volume?"
    answer: "Mortar protrusion into block cores slightly reduces theoretical core volume, but waste and slump consolidation absorb this difference, making a 10% waste factor ideal."
  - question: "How many CMU blocks are in a square foot of wall?"
    answer: "A standard 8x8x16 inch CMU block with 3/8\" mortar joints yields exactly 0.89 sq ft of wall surface, meaning 1.125 blocks are needed per square foot."
---

Calculate fine and coarse masonry grout volume, cubic yards, and 80 lb bag counts for grouting hollow CMU concrete block cores and bond beams.

<!-- more -->

## Why Use the Masonry Grout Calculator?

Consolidating concrete masonry unit (CMU) walls with structural grout locks vertical steel rebar into place, dramatically increasing shear and compressive strength. Under-estimating grout leads to incomplete core fills and structural failure, while over-ordering ready-mix trucks incurs heavy short-load surcharges.

This **Masonry Grout Calculator** enables engineers, masons, and general contractors to:
1. Determine exact grout volume for 6", 8", 10", and 12" block walls.
2. Model partial core filling schedules (16", 24", 32", 48" o.c.) accurately.
3. Calculate both ready-mix truck cubic yardage and 80 lb site-mix bag counts.

---

## Masonry Grout Formulas

### 1. Effective Filled Cores
$$N_{\text{filled}} = \left\lceil N_{\text{blocks}} \times F_{\text{spacing}} \right\rceil$$

Where core spacing multiplier ($F_{\text{spacing}}$) is:
* **Fully Grouted (100%):** $1.00$
* **16" on center (50%):** $0.50$
* **24" on center (33%):** $0.333$
* **32" on center (25%):** $0.25$
* **48" on center (17%):** $0.167$

### 2. Grout Volume Calculation
$$V_{\text{cu ft}} = N_{\text{filled}} \times V_{\text{core\_factor}} \times \left(1 + \frac{W}{100}\right)$$
$$V_{\text{cu yd}} = \frac{V_{\text{cu ft}}}{27}$$

Where block core volume factors ($V_{\text{core\_factor}}$) per block are:
* **6" CMU:** $0.16\text{ ft}^3/\text{block}$
* **8" CMU:** $0.28\text{ ft}^3/\text{block}$
* **10" CMU:** $0.38\text{ ft}^3/\text{block}$
* **12" CMU:** $0.47\text{ ft}^3/\text{block}$

### 3. Pre-Mixed 80 lb Bags Required
$$N_{\text{bags}} = \left\lceil V_{\text{cu ft}} \times 1.50 \right\rceil \quad (\text{since } 1\text{ cu ft} \approx 1.5\text{ bags of } 80\text{ lb grout})$$

---

## CMU Core Grout Volume Table (per 100 Blocks)

| CMU Block Size | Core Volume per Block | Fully Grouted (100 Blocks) | 16" o.c. (50% Filled) | 24" o.c. (33% Filled) | 48" o.c. (17% Filled) | 80 lb Bags (Fully Grouted) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **6" Standard CMU** | 0.16 Cu Ft | 0.59 Cu Yds | 0.30 Cu Yds | 0.20 Cu Yds | 0.10 Cu Yds | 24 Bags |
| **8" Standard CMU** | 0.28 Cu Ft | 1.04 Cu Yds | 0.52 Cu Yds | 0.34 Cu Yds | 0.18 Cu Yds | 42 Bags |
| **10" Standard CMU** | 0.38 Cu Ft | 1.41 Cu Yds | 0.70 Cu Yds | 0.47 Cu Yds | 0.24 Cu Yds | 57 Bags |
| **12" Standard CMU** | 0.47 Cu Ft | 1.74 Cu Yds | 0.87 Cu Yds | 0.57 Cu Yds | 0.30 Cu Yds | 71 Bags |

---

## Step-by-Step Masonry Grouting Guide

1. **Verify Architectural & Structural Notes:** Determine block size and specify core filling frequency (e.g., fully grouted foundation walls vs. 32" o.c. above grade).
2. **Inspect Cleanout Openings:** For high lifts over 5 feet, ensure cleanouts at the bottom of filled cells are free of mortar droppings.
3. **Select Fine vs. Coarse Grout:** Use fine grout for spaces with dense rebar clear cover under 2"; use coarse aggregate grout for standard block cores.
4. **Consolidate with Mechanical Vibrator:** Consolidate grout in 5-foot lifts with a 3/4" pencil vibrator to eliminate honeycomb voids.
5. **Re-vibrate After Slump:** Re-vibrate grout 15 to 30 minutes after placement to close settlement cracks along rebar.

---

## Frequently Asked Questions (FAQ)

### How much grout is needed to fill an 8-inch CMU block?
A standard 8x8x16 inch hollow CMU block has two internal cores that hold approximately 0.28 cubic feet of grout when fully poured. Filling 100 blocks requires approximately 1.04 cubic yards of grout.

### How many 80 lb bags of grout make a cubic yard?
It takes approximately 40 to 42 bags of 80 lb pre-mixed masonry grout to equal 1 cubic yard (27 cubic feet) of yield once mixed with water.

### What is the difference between Fine Grout and Coarse Grout?
Fine grout consists of Portland cement, lime, and fine sand, used when grout spaces are small (under 2 inches). Coarse grout includes pea gravel aggregate (up to 3/8") and is used for large core cavities (2 inches or larger).

### What core filling spacing is standard for retaining walls?
Structural retaining walls typically require vertical rebar cores grouted at 16" or 24" on center, along with continuous top bond beam grouting.

### How high can masonry grout be poured in a single lift?
Low-lift grouting allows pours up to 5 feet high. High-lift grouting allows pours up to 24 feet high, provided cleanout holes are installed at the base of every vertical core.

### Does mortar in horizontal bed joints reduce core grout volume?
Mortar protrusion into block cores slightly reduces theoretical core volume, but waste and slump consolidation absorb this difference, making a 10% waste factor ideal.

### How many CMU blocks are in a square foot of wall?
A standard 8x8x16 inch CMU block with 3/8" mortar joints yields exactly 0.89 sq ft of wall surface, meaning 1.125 blocks are needed per square foot.
