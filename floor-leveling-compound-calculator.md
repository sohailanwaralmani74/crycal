---
layout: tool
title: "Floor Leveling Compound | Interactive Online Tool"
description: "Calculate 50lb bags of self-leveling underlayment (SLU), pour volume, dry powder weight, and acrylic subfloor primer gallons for pour depths 1/8 to 1."
permalink: /floor-leveling-compound-calculator
tool_id: floor-leveling-compound-calculator
category: flooring
hide_sidebar: true

inputs:
  - id: floorLengthFeet
    label: Room Length (Feet)
    type: number
    default: 20
    step: 0.5
    min: 1
    placeholder: "e.g., 20"

  - id: floorWidthFeet
    label: Room Width (Feet)
    type: number
    default: 15
    step: 0.5
    min: 1
    placeholder: "e.g., 15"

  - id: averagePourDepthInches
    label: Average Pour Thickness / Depth (Inches)
    type: select
    default: "0.25"
    options:
      - value: "0.125"
        label: "1/8 Inch (0.125\") – Feather / Skim Coat"
      - value: "0.25"
        label: "1/4 Inch (0.250\") – Standard Leveling"
      - value: "0.375"
        label: "3/8 Inch (0.375\") – Moderate Dip Correction"
      - value: "0.5"
        label: "1/2 Inch (0.500\") – Deep Subfloor Dip"
      - value: "0.75"
        label: "3/4 Inch (0.750\") – Heavy Slab Restoration"
      - value: "1.0"
        label: "1 Inch (1.000\") – Deep Encapsulation / Radiance"

  - id: bagWeightLbs
    label: Bag Weight (Lbs)
    type: number
    default: 50
    step: 5
    min: 25
    max: 60
    suffix: 'lbs'
    placeholder: "e.g., 50"

  - id: bagYieldSqFtPer18Inch
    label: Bag Yield at 1/8" Depth (Sq Ft)
    type: number
    default: 40
    step: 5
    min: 20
    max: 60
    suffix: 'sq ft'
    placeholder: "e.g., 40"

  - id: primerCoverageSqFt
    label: Acrylic Subfloor Primer Coverage (Sq Ft per Gallon)
    type: number
    default: 300
    step: 25
    min: 100
    max: 500
    suffix: 'sq ft/gal'
    placeholder: "e.g., 300"

outputs:
  - id: totalFloorSqFt
    label: Total Floor Surface Area (Sq Ft)
  - id: volumeCubicFeet
    label: Total SLU Pour Volume (Cubic Feet)
  - id: sluBagsNeeded
    label: 50lb SLU Bags to Purchase (incl. 10% Waste)
  - id: primerGallonsNeeded
    label: Acrylic Primer Gallons Needed

charts:
  tabs:
    - id: bagsByDepth
      label: Bags Needed for 1/8", 1/4", 1/2" & 1" Depths
    - id: materialWeight
      label: Dry Powder Weight vs Water Weight

history_columns:
  - key: floorLengthFeet
    label: Length (ft)
    source: input
  - key: floorWidthFeet
    label: Width (ft)
    source: input
  - key: averagePourDepthInches
    label: Depth (in)
    source: input
  - key: totalFloorSqFt
    label: Floor Area
    source: output
  - key: sluBagsNeeded
    label: SLU Bags
    source: output
  - key: primerGallonsNeeded
    label: Primer (gal)
    source: output

js_file: assets/js/calculators/floor-leveling-compound-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Floor Leveling Compound Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate bags of self-leveling underlayment (SLU), pour volume, dry powder weight, and subfloor primer for 1/8\" to 1\" pour depths."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Precise Depth Yield Scaling — calculates bag coverage from 1/8\" feather coats up to 1\" deep pours"
    - "10% Waste & Mixing Allowance — ensures adequate material for bucket residue and perimeter sealing"
    - "Acrylic Subfloor Primer Calculator — sizes substrate primer required to prevent pinholes"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Floor Leveling Compound Calculator

howto:
  name: "How to Calculate Self-Leveling Underlayment (SLU)"
  description: "Determine 50lb bag counts and primer requirements for pourable floor leveler."
  step:
    - name: "Measure Room Dimensions"
      text: "Input room length and width in feet to determine total floor surface square footage."
    - name: "Determine Average Pour Depth"
      text: "Use a laser level or straightedge to estimate average pour thickness in inches across low spots."
    - name: "Check Bag Yield Specs"
      text: "Verify bag weight and manufacturer coverage rating (typically 40 sq ft at 1/8\" thickness per 50lb bag)."
    - name: "Calculate Primer Requirements"
      text: "Factor in substrate primer coverage to prep concrete or wood subfloors."

faq:
  - question: "What is self-leveling underlayment (SLU)?"
    answer: "Self-leveling underlayment (SLU) is a cementitious pourable compound that flows easily across uneven concrete or wood subfloors to create a flat, smooth, level base for luxury vinyl plank, tile, or hardwood flooring."
  - question: "How many square feet does a 50lb bag of self-leveler cover?"
    answer: "A standard 50lb bag of self-leveling compound covers approximately 40 sq ft at 1/8\" depth, 20 sq ft at 1/4\" depth, 10 sq ft at 1/2\" depth, and 5 sq ft at 1\" depth."
  - question: "Formula for self-leveling compound bags?"
    answer: "Bags Needed = (Floor Area in sq ft × Pour Depth in inches) / (0.125 × Bag Yield at 1/8\" in sq ft). Add 10% for mixing loss and edge expansion foam borders."
  - question: "Why is subfloor primer required before pouring SLU?"
    answer: "Primer seals porous concrete or wood subfloors, preventing the substrate from rapidly absorbing water from the SLU mix. This prevents pinholes, air bubbles, and weak bonding."
  - question: "How thick can you pour self-leveling underlayment?"
    answer: "Most standard self-levelers can be poured from 1/8\" up to 1\" thick in a single lift. For deeper pours up to 2\" or 3\", aggregate extension (pea gravel) must be added per manufacturer instructions."
  - question: "How long does self-leveling compound take to dry?"
    answer: "SLU is walkable in 2 to 4 hours. You can install ceramic tile in 4 to 12 hours, while moisture-sensitive floors like luxury vinyl or hardwood require 16 to 24 hours of drying."
  - question: "Is my floor leveler calculation saved on external servers?"
    answer: "No. All calculation logic runs locally inside your browser."
---

# Floor Leveling Compound Calculator

Calculate exact **50lb bags of self-leveling underlayment (SLU)**, total **pour volume in cubic feet**, dry powder weight, and **subfloor acrylic primer gallons** for pour depths from 1/8" to 1".

<!-- more -->

## Why Self-Leveling Underlayment (SLU) Math Matters

Large-format tile, rigid core luxury vinyl plank (LVP), and hardwood flooring require subfloors to be flat within 3/16" over 10 feet. Self-leveling underlayment creates a glass-smooth hydraulic surface.

Because SLU sets rapidly (15 to 20 minute working time), running short of bags mid-pour results in cold joints, uneven ridging, and ruined floors. Calculating accurate bag counts guarantees a continuous, seamless pour.

---

## Floor Leveling Mathematical Formulas

$$\text{Floor Area (sq ft)} = \text{Length (ft)} \times \text{Width (ft)}$$
$$\text{Pour Volume (cu ft)} = \text{Floor Area (sq ft)} \times \left(\frac{\text{Pour Depth (in)}}{12}\right)$$
$$\text{Coverage at Depth } D = \text{Yield at 1/8"} \times \left(\frac{0.125}{D}\right)$$
$$\text{SLU Bags Net} = \frac{\text{Floor Area}}{\text{Coverage at Depth } D}$$
$$\text{SLU Bags to Order} = \left\lceil \text{SLU Bags Net} \times 1.10 \right\rceil$$
$$\text{Primer Gallons} = \left\lceil \frac{\text{Floor Area}}{\text{Primer Coverage (sq ft/gal)}} \right\rceil$$

---

## SLU Bag Yield Reference Table (100 Sq Ft Floor, 50lb Bag @ 40 sq ft / 1/8" Yield)

| Pour Depth (Inches) | Single Bag Coverage | Net Bags Needed | Gross Bags (10% Waste) | Total Powder Weight | Mixed Water Volume (5 qts/bag) |
|---|---|---|---|---|---|
| **1/8" (0.125")** | **40.0 sq ft** | 2.50 Bags | **3 Bags** | 150 lbs | 3.75 Gallons |
| **1/4" (0.250")** | **20.0 sq ft** | 5.00 Bags | **6 Bags** | 300 lbs | 7.50 Gallons |
| **3/8" (0.375")** | **13.3 sq ft** | 7.50 Bags | **9 Bags** | 450 lbs | 11.25 Gallons |
| **1/2" (0.500")** | **10.0 sq ft** | 10.00 Bags | **11 Bags** | 550 lbs | 13.75 Gallons |
| **3/4" (0.750")** | **6.7 sq ft** | 15.00 Bags | **17 Bags** | 850 lbs | 21.25 Gallons |
| **1" (1.000")** | **5.0 sq ft** | 20.00 Bags | **22 Bags** | 1,100 lbs | 27.50 Gallons |

---

## Step-by-Step Subfloor Leveling Workflow

1. **Subfloor Preparation**: Sweep, vacuum, and seal all cracks/holes in wood or concrete subfloor using expandable foam or caulking.
2. **Apply Foam Edge Strips**: Install compressible foam isolation tape along room perimeter walls to prevent liquid SLU from escaping into wall cavities.
3. **Apply Acrylic Primer**: Roll acrylic primer evenly over substrate and allow to dry (typically 1 to 3 hours) until sticky and clear.
4. **Mix Batches**: Mix 50lb bags with exact clean cold water volume (typically 5 quarts per bag) using a high-speed drill and mixing paddle for 2 minutes.
5. **Pour & Gauge Spread**: Pour liquid compound continuously into low spots and gently guide with a spiked roller or gauge rake.

---

## Frequently Asked Questions

### What is self-leveling underlayment (SLU)?
Self-leveling underlayment (SLU) is a cementitious pourable compound that flows easily across uneven concrete or wood subfloors to create a flat, smooth, level base for luxury vinyl plank, tile, or hardwood flooring.

### How many square feet does a 50lb bag of self-leveler cover?
A standard 50lb bag of self-leveling compound covers approximately 40 sq ft at 1/8" depth, 20 sq ft at 1/4" depth, 10 sq ft at 1/2" depth, and 5 sq ft at 1" depth.

### Formula for self-leveling compound bags?
Bags Needed = (Floor Area in sq ft × Pour Depth in inches) / (0.125 × Bag Yield at 1/8" in sq ft). Add 10% for mixing loss and edge expansion foam borders.

### Why is subfloor primer required before pouring SLU?
Primer seals porous concrete or wood subfloors, preventing the substrate from rapidly absorbing water from the SLU mix. This prevents pinholes, air bubbles, and weak bonding.

### How thick can you pour self-leveling underlayment?
Most standard self-levelers can be poured from 1/8" up to 1" thick in a single lift. For deeper pours up to 2" or 3", aggregate extension (pea gravel) must be added per manufacturer instructions.

### How long does self-leveling compound take to dry?
SLU is walkable in 2 to 4 hours. You can install ceramic tile in 4 to 12 hours, while moisture-sensitive floors like luxury vinyl or hardwood require 16 to 24 hours of drying.

### Is my floor leveler calculation saved on external servers?
No. All calculation logic runs locally inside your browser.
