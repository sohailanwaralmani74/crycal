---
layout: tool
title: "Concrete Mix Ratio | Cement, Sand & Gravel Estimator"
description: "Calculate exact cement bags, sand tons, gravel tons, and water gallons by weight or volume for 3000 PSI to 5000 PSI concrete mix designs."
permalink: /concrete-mix-ratio-calculator
tool_id: concrete-mix-ratio-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: concreteVolume
    label: Required Concrete Volume (Cubic Yards)
    type: number
    default: 2.0
    step: 0.25
    min: 0.1
    placeholder: "e.g., 2.0"

  - id: mixRatio
    label: Standard Mix Ratio
    type: select
    default: "1:2:3"
    options:
      - value: "1:2:3"
        label: "1 : 2 : 3 Mix (3000 PSI Standard Footings & Slabs)"
      - value: "1:1.5:3"
        label: "1 : 1.5 : 3 Mix (3500 PSI Driveways & Walkways)"
      - value: "1:1.5:2"
        label: "1 : 1.5 : 2 Mix (4000 PSI Structural Columns & Beams)"
      - value: "1:1:2"
        label: "1 : 1 : 2 Mix (5000 PSI High-Strength Precast)"

  - id: bagSize
    label: Portland Cement Bag Size
    type: select
    default: "94"
    options:
      - value: "94"
        label: "94 lb Bag (1 Standard Cubic Foot Portland Cement)"
      - value: "80"
        label: "80 lb Bag (0.85 Cubic Feet)"
      - value: "60"
        label: "60 lb Bag (0.64 Cubic Feet)"

  - id: wasteFactor
    label: Waste & Spillage Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 25
    placeholder: "e.g., 10"

  - id: pricePerCementBag
    label: Cost per Cement Bag
    type: number
    default: 16.50
    step: 0.50
    min: 0
    prefix: '$'
    placeholder: "e.g., 16.50"

  - id: pricePerSandTon
    label: Cost per Ton of Sand
    type: number
    default: 35.00
    step: 1.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 35.00"

  - id: pricePerGravelTon
    label: Cost per Ton of Gravel
    type: number
    default: 42.00
    step: 1.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 42.00"

outputs:
  - id: totalCementBags
    label: Portland Cement Bags
  - id: sandTons
    label: Masonry Sand (Tons)
  - id: gravelTons
    label: Coarse Gravel (Tons)
  - id: waterGallons
    label: Water Required (Gallons)
  - id: totalMaterialCost
    label: Total Component Material Cost

charts:
  tabs:
    - id: materialWeights
      label: Material Weight Breakdown (lbs)
    - id: costDistribution
      label: Cost Breakdown

history_columns:
  - key: concreteVolume
    label: Volume (cu yd)
    source: input
  - key: mixRatio
    label: Mix Ratio
    source: input
  - key: totalCementBags
    label: Cement Bags
    source: output
  - key: sandTons
    label: Sand (Tons)
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/concrete-mix-ratio-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Concrete Mix Ratio Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate Portland cement bags, sand tons, gravel tons, and water gallons for 3000 PSI to 5000 PSI concrete mixes."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates exact Portland cement, sand, gravel, and water proportions"
    - "Supports 1:2:3, 1:1.5:3, 1:1.5:2, and 1:1:2 volumetric mix designs"
    - "Computes component weights in pounds and tons with waste factors"
    - "Provides comprehensive material cost estimation"

breadcrumb:
  - name: Home
    url: /
  - name: Concrete & Masonry
    url: /concrete-masonry
  - name: Concrete Mix Ratio Calculator

howto:
  name: "How to Batch Concrete Mix Proportions by Volume and Weight"
  description: "Accurately compute aggregate, cement, and water quantities for jobsite concrete mixing."
  step:
    - name: "Determine target concrete volume"
      text: "Calculate required wet concrete volume in cubic yards including forms and footings."
    - name: "Select concrete strength mix ratio"
      text: "Choose 1:2:3 for standard 3000 PSI slabs or 1:1.5:3 for 3500 PSI driveways."
    - name: "Calculate dry constituent volume"
      text: "Apply dry volume reduction factor (1.54) to convert wet placed volume into required dry ingredients."
    - name: "Convert to bags and aggregate weight"
      text: "Convert cement cubic feet to 94lb bags and aggregate volume to tons based on bulk density."

faq:
  - question: "What is the standard concrete mix ratio for general construction?"
    answer: "The standard mix ratio for general structural concrete (3000 PSI) is 1 part Portland cement, 2 parts clean sand, and 3 parts coarse gravel aggregate by volume."
  - question: "Why do dry concrete ingredients take up more volume than wet concrete?"
    answer: "When water is added to dry cement, sand, and gravel, water fills the microscopic air voids between aggregate particles. It requires approximately 1.54 cubic feet of dry ingredients to yield 1.0 cubic foot of wet mixed concrete."
  - question: "How many 94lb bags of cement are in a cubic yard of concrete?"
    answer: "A standard 3000 PSI (1:2:3) mix requires approximately 5.5 to 6.0 bags of 94lb Portland cement per cubic yard of wet concrete."
  - question: "How much water is needed per bag of Portland cement?"
    answer: "For optimal 3000-4000 PSI compressive strength, use a water-cement ratio of 0.45 to 0.50, which equates to roughly 5 to 6 gallons of clean water per 94lb bag of Portland cement."
  - question: "What is the weight of one cubic yard of concrete?"
    answer: "Standard wet concrete weighs approximately 4,050 lbs (2.025 tons) per cubic yard, or roughly 150 lbs per cubic foot."
  - question: "What mix ratio should I use for a high-strength driveway slab?"
    answer: "For driveways exposed to heavy vehicle traffic and freeze-thaw cycles, a 1:1.5:3 or 1:1.5:2 mix ratio yielding 3,500 to 4,000 PSI is recommended."
  - question: "How much aggregate waste should I allow for jobsite concrete mixing?"
    answer: "Adding a 10% waste and spillage allowance accounts for ground loss, shovel residue, uneven subgrade, and mixing equipment retention."
---

# Concrete Mix Ratio & Materials Estimator

Calculate exact Portland cement bags, masonry sand tons, gravel aggregate tons, and mixing water gallons for any concrete volume. All calculations run 100% privately in your browser.

<!-- more -->

## Why Use the Concrete Mix Ratio Calculator?

Batching concrete on site requires precise proportioning of Portland cement, fine aggregate (sand), coarse aggregate (gravel), and water. Incorrect volumetric ratios lead to structural weakness, severe cracking, improper curing, or excessive material costs.

Because dry constituents contract when mixed with water as water occupies void space between aggregate particles, simply adding up nominal volumes yields insufficient concrete. This **Concrete Mix Ratio Calculator** applies the absolute volume method and empirical dry-to-wet conversion factors ($1.54	imes$ multiplier) to ensure your jobsite mix delivers exact yield and target compressive strength (3000 PSI to 5000 PSI).

---

## Concrete Mix Ratio & Materials Estimator Formulas

### 1. Dry Constituent Volume ($V_{	ext{dry}}$)
To account for void filling during hydration, wet placed volume $V_{	ext{wet}}$ (in cu ft) is multiplied by the dry volumetric shrinkage factor ($1.54$):

$$V_{	ext{dry}} = V_{	ext{wet}} 	imes 1.54 	imes \left(1 + rac{	ext{Waste } \%}{100}
ight)$$

### 2. Proportional Volume Distribution
For a mix ratio of $C : S : G$ (e.g., $1 : 2 : 3$, total parts $T = C + S + G = 6$):

$$V_{	ext{cement}} = V_{	ext{dry}} 	imes rac{C}{T}$$

$$V_{	ext{sand}} = V_{	ext{dry}} 	imes rac{S}{T}$$

$$V_{	ext{gravel}} = V_{	ext{dry}} 	imes rac{G}{T}$$

### 3. Cement Bag Count ($N_{	ext{cement}}$)
Standard 94 lb Portland cement bag has a loose volume of $1.0	ext{ cu ft}$:

$$N_{	ext{cement}} = \left\lceil rac{V_{	ext{cement}}}{V_{	ext{bag\_volume}}} 
ight
ceil$$

### 4. Aggregate Tonnage ($W_{	ext{sand}}, W_{	ext{gravel}}$)
Assuming bulk densities of $100	ext{ lb/cu ft}$ for damp sand and $105	ext{ lb/cu ft}$ for gravel:

$$	ext{Sand (Tons)} = rac{V_{	ext{sand}} 	imes 100}{2000}$$

$$	ext{Gravel (Tons)} = rac{V_{	ext{gravel}} 	imes 105}{2000}$$

### 5. Water Volume ($W_{	ext{gal}}$)
Using a standard water-cement ratio of $w/c = 0.50$ by weight ($8.34	ext{ lb/gal}$ water):

$$W_{	ext{gal}} = rac{N_{	ext{cement}} 	imes W_{	ext{bag\_weight}} 	imes 0.50}{8.34}$$

---

## Real-World Comparison & Benchmark Table

| Mix Design | Target Strength (PSI) | Volumetric Ratio (C : S : G) | Cement Bags (94lb / cu yd) | Sand Required (Tons / cu yd) | Gravel Required (Tons / cu yd) | Primary Applications |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Slab** | 3,000 PSI | 1 : 2 : 3 | 5.8 Bags | 0.54 Tons | 0.85 Tons | House footings, residential patio slabs |
| **Heavy Traffic** | 3,500 PSI | 1 : 1.5 : 3 | 6.4 Bags | 0.45 Tons | 0.94 Tons | Driveways, garage floors, sidewalks |
| **Structural** | 4,000 PSI | 1 : 1.5 : 2 | 7.2 Bags | 0.50 Tons | 0.71 Tons | Retaining walls, reinforced beams, columns |
| **High Strength** | 5,000 PSI | 1 : 1 : 2 | 8.6 Bags | 0.40 Tons | 0.85 Tons | Precast posts, heavy machinery pads |

---

## Step-by-Step How-To Guide

1. **Calculate Required Volume:** Measure total formwork length, width, and depth to get wet cubic yards needed.
2. **Select Target PSI Ratio:** Choose 1:2:3 for general slabs or 1:1.5:3 for high-load driveways.
3. **Set Bag Weight & Waste:** Select your cement bag size (94 lb standard) and include 10% for spillage and form over-fill.
4. **Mix Dry Ingredients First:** Thoroughly blend Portland cement, sand, and gravel in a mechanical mixer before adding water.
5. **Add Water Gradually:** Add calculated water in small increments until achieving a workable 3-inch to 4-inch slump test.

---

## Frequently Asked Questions

### What is the standard concrete mix ratio for general construction?
The standard mix ratio for general structural concrete (3000 PSI) is 1 part Portland cement, 2 parts clean sand, and 3 parts coarse gravel aggregate by volume.

### Why do dry concrete ingredients take up more volume than wet concrete?
When water is added to dry cement, sand, and gravel, water fills the microscopic air voids between aggregate particles. It requires approximately 1.54 cubic feet of dry ingredients to yield 1.0 cubic foot of wet mixed concrete.

### How many 94lb bags of cement are in a cubic yard of concrete?
A standard 3000 PSI (1:2:3) mix requires approximately 5.5 to 6.0 bags of 94lb Portland cement per cubic yard of wet concrete.

### How much water is needed per bag of Portland cement?
For optimal 3000-4000 PSI compressive strength, use a water-cement ratio of 0.45 to 0.50, which equates to roughly 5 to 6 gallons of clean water per 94lb bag of Portland cement.

### What is the weight of one cubic yard of concrete?
Standard wet concrete weighs approximately 4,050 lbs (2.025 tons) per cubic yard, or roughly 150 lbs per cubic foot.

### What mix ratio should I use for a high-strength driveway slab?
For driveways exposed to heavy vehicle traffic and freeze-thaw cycles, a 1:1.5:3 or 1:1.5:2 mix ratio yielding 3,500 to 4,000 PSI is recommended.

### How much aggregate waste should I allow for jobsite concrete mixing?
Adding a 10% waste and spillage allowance accounts for ground loss, shovel residue, uneven subgrade, and mixing equipment retention.
