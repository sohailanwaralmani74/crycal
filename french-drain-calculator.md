---
layout: tool
title: French Drain Calculator – Perforated Pipe, Washed Gravel & Filter Fabric
description: Calculate perforated drain pipe linear feet, washed gravel backfill (cu yds & tons), geotextile filter fabric rolls, and material costs for french drain trenches.
permalink: /french-drain-calculator
tool_id: french-drain-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: trenchLengthFeet
    label: French Drain Trench Length (Feet)
    type: number
    default: 50
    step: 5
    min: 5
    placeholder: "e.g., 50"

  - id: trenchWidthInches
    label: Trench Width (Inches)
    type: select
    default: "12"
    options:
      - value: "12"
        label: "12 Inches (Standard 4-Inch Pipe Drain)"
      - value: "15"
        label: "15 Inches (Heavy Water Flow Drain)"
      - value: "18"
        label: "18 Inches (Commercial / Double Pipe)"
      - value: "24"
        label: "24 Inches (Extra Wide Groundwater Channel)"

  - id: trenchDepthInches
    label: Trench Depth (Inches)
    type: select
    default: "24"
    options:
      - value: "18"
        label: "18 Inches (Shallow Lawn Sub-Drain)"
      - value: "24"
        label: "24 Inches (Standard Yard & Footing Drain)"
      - value: "30"
        label: "30 Inches (Deep Basement Water Table)"
      - value: "36"
        label: "36 Inches (Deep Foundation Cut-Off Drain)"

  - id: pipeDiameterInches
    label: Perforated Drain Pipe Diameter
    type: select
    default: "4"
    options:
      - value: "4"
        label: "4 Inches (Standard Smooth-Wall / Corrugated Perforated)"
      - value: "6"
        label: "6 Inches (High Capacity Main Collector Pipe)"

  - id: gravelPricePerCuYd
    label: Price Per Cubic Yard Washed Gravel (#57 Stone)
    type: number
    default: 48.00
    step: 2.00
    min: 0
    currency: true
    placeholder: "e.g., 48.00"

  - id: fabricPricePerRoll
    label: Price Per Geotextile Filter Fabric Roll (300 Sq Ft)
    type: number
    default: 45.00
    step: 2.00
    min: 0
    currency: true
    placeholder: "e.g., 45.00"

  - id: pipePricePerFoot
    label: Perforated Drain Pipe Price Per Foot
    type: number
    default: 1.85
    step: 0.10
    min: 0
    currency: true
    placeholder: "e.g., 1.85"

outputs:
  - id: drainPipeFeet
    label: Perforated Drain Pipe Length (Linear Feet)
  - id: gravelVolumeCuYds
    label: Washed Gravel #57 Volume (Cu Yds & Tons)
  - id: filterFabricSqFt
    label: Non-Woven Geotextile Filter Fabric (Sq Ft & Rolls)
  - id: totalExcavationVolume
    label: Total Trench Excavation Volume (Cu Yds)
  - id: totalMaterialCost
    label: Total French Drain Material Cost

charts:
  tabs:
    - id: materialCostBreakdown
      label: Material Cost Breakdown
    - id: backfillVolumeByTrenchDepth
      label: Gravel Volume by Trench Depth

history_columns:
  - key: trenchLengthFeet
    label: Trench Length
    source: input
  - key: trenchDepthInches
    label: Depth
    source: input
  - key: gravelVolumeCuYds
    label: Gravel Volume
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/french-drain-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "French Drain Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate perforated drain pipe linear feet, washed gravel backfill (#57 stone tons/cu yds), geotextile filter fabric, and excavation volume."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Trench Volume & Pipe Displacement — calculates net gravel volume subtracting internal pipe displacement"
    - "Geotextile Fabric Wrap Estimator — calculates fabric perimeter overlap to prevent soil clogging"
    - "Gravel Weight Conversion — converts cubic yards of #57 stone to aggregate tons (1.35 tons/cu yd)"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: French Drain Calculator

howto:
  name: "How to Calculate French Drain Materials & Trench Gravel"
  description: "Accurately estimate perforated pipe, washed gravel, filter fabric rolls, and dirt excavation."
  step:
    - name: "Measure trench length"
      text: "Measure the total linear length of the proposed drainage trench from inlet to pop-up emitter or discharge point."
    - name: "Select trench width and depth"
      text: "Choose 12 inches width by 24 inches depth for standard residential yard drains."
    - name: "Select perforated pipe size"
      text: "Choose 4-inch smooth-wall SDR-35 or corrugated perforated pipe."
    - name: "Enter material unit prices"
      text: "Input local prices for #57 crushed washed gravel per cubic yard, filter fabric rolls, and pipe per foot."
    - name: "Review total drainage material list"
      text: "Get required pipe linear feet, washed gravel tons, filter fabric roll counts, and material cost."

faq:
  - question: "What is the best gravel size for a french drain?"
    answer: "Clean washed #57 stone (3/4-inch to 1-inch crushed aggregate) is the industry standard for french drains. It leaves 45% open void space for rapid groundwater flow while supporting heavy soil loads."
  - question: "Why is geotextile filter fabric required in a french drain?"
    answer: "Non-woven geotextile filter fabric wraps the entire gravel trench, acting as a sieve that lets groundwater enter while permanently blocking dirt silt, clay particles, and sand from clogging the gravel voids and pipe holes."
  - question: "How much slope is needed for a french drain?"
    answer: "A french drain requires a minimum downward slope of 1 inch for every 10 feet of trench length (a 1% slope gradient) toward the gravity outlet."
  - question: "Should perforated pipe holes face up or down in a french drain?"
    answer: "Perforated pipe holes must ALWAYS face DOWN toward the bottom of the trench. Water rises from the water table into the bottom of the gravel bed and flows into the pipe holes from underneath."
  - question: "How many tons of gravel are in a cubic yard?"
    answer: "One cubic yard of clean washed #57 drainage gravel weighs approximately 1.35 tons (2,700 lbs)."
  - question: "How much does it cost to install a french drain per foot?"
    answer: "DIY materials cost $8 to $14 per linear foot for gravel, pipe, and fabric. Professional contractor installation costs $30 to $65 per linear foot depending on trench depth and hand vs machine digging."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation logic operates locally in your web browser."
---

# French Drain Calculator – Perforated Pipe, Washed Gravel & Filter Fabric

Determine perforated drain pipe linear feet, washed gravel backfill (#57 stone tons & cubic yards), non-woven geotextile filter fabric rolls, and total excavation volume with our free **French Drain Calculator**.

<!-- more -->

## Why Calculate French Drain Materials Accurately?

French drains channel standing groundwater away from basement foundations, crawlspaces, low lawn spots, and retaining walls:
- **Prevent Soil Silt Clogging**: Wrapping the trench in non-woven geotextile fabric keeps mud out of gravel voids, ensuring a 30+ year lifespan.
- **Deduct Pipe Displacement**: Subtracting 4-inch pipe volume prevents over-ordering expensive washed gravel tons.
- **Ensure Proper Discharge**: Calculating trench volume ensures sufficient gravel depth below and above the perforated pipe.

---

## French Drain Governing Formulas

$$\text{Gross Trench Volume (cu ft)} = \text{Length (ft)} \times \left(\frac{\text{Width (in)}}{12}\right) \times \left(\frac{\text{Depth (in)}}{12}\right)$$

$$\text{Pipe Displacement (cu ft)} = \pi \times \left(\frac{\text{Pipe Diameter (in)}}{2 \times 12}\right)^2 \times \text{Length (ft)}$$

$$\text{Net Gravel Volume (cu yds)} = \frac{(\text{Gross Trench Volume} - \text{Pipe Displacement})}{27} \times 1.10 \quad \text{(10\% compaction allowance)}$$

$$\text{Gravel Weight (Tons)} = \text{Net Gravel Volume (cu yds)} \times 1.35 \text{ tons/cu yd}$$

$$\text{Filter Fabric Perimeter (ft)} = 2 \times \left(\frac{\text{Width (in)}}{12}\right) + 2 \times \left(\frac{\text{Depth (in)}}{12}\right) + 1.0 \text{ ft (Overlap)}$$

$$\text{Filter Fabric Area (sq ft)} = \text{Fabric Perimeter (ft)} \times \text{Length (ft)}$$

---

## Drainage Material Requirements Table (12" Wide Trench, 4" Pipe)

| Trench Length | Trench Depth | Perforated Pipe | Washed Gravel (Cu Yds) | Gravel Weight (Tons) | Filter Fabric (Sq Ft) | Est. Material Cost |
|---|---|---|---|---|---|---|
| **30 ft Trench** | 24 in | **32 ft** | **2.01 cu yds** | **2.71 tons** | **210 sq ft (1 roll)** | $271.00 |
| **50 ft Trench** | 24 in | **53 ft** | **3.35 cu yds** | **4.52 tons** | **350 sq ft (2 rolls)** | $452.00 |
| **80 ft Trench** | 24 in | **84 ft** | **5.36 cu yds** | **7.24 tons** | **560 sq ft (2 rolls)** | $723.00 |
| **100 ft Trench** | 30 in | **105 ft** | **8.52 cu yds** | **11.50 tons** | **800 sq ft (3 rolls)** | $1,114.00 |

---

## Step-by-Step French Drain Installation Guide

1. **Measure Drainage Trench Run**: Input total linear feet of trench from high collection area to low gravity discharge point.
2. **Select Trench Dimensions**: Choose 12" width and 24" depth for standard yard water control.
3. **Select Pipe Size**: Choose 4-inch smooth-wall perforated pipe for optimal flow speed.
4. **Input Local Unit Prices**: Enter cost per cubic yard of #57 stone, 300 sq ft fabric rolls, and pipe per foot.
5. **Review Drainage List**: Order required perforated pipe, crushed gravel tons, and geotextile filter fabric rolls.

---

## Frequently Asked Questions

### What is the best gravel size for a french drain?
Clean washed #57 stone (3/4-inch to 1-inch crushed aggregate) is the industry standard for french drains. It leaves 45% open void space for rapid groundwater flow while supporting heavy soil loads.

### Why is geotextile filter fabric required in a french drain?
Non-woven geotextile filter fabric wraps the entire gravel trench, acting as a sieve that lets groundwater enter while permanently blocking dirt silt, clay particles, and sand from clogging the gravel voids and pipe holes.

### How much slope is needed for a french drain?
A french drain requires a minimum downward slope of 1 inch for every 10 feet of trench length (a 1% slope gradient) toward the gravity outlet.

### Should perforated pipe holes face up or down in a french drain?
Perforated pipe holes must ALWAYS face DOWN toward the bottom of the trench. Water rises from the water table into the bottom of the gravel bed and flows into the pipe holes from underneath.

### How many tons of gravel are in a cubic yard?
One cubic yard of clean washed #57 drainage gravel weighs approximately 1.35 tons (2,700 lbs).

### How much does it cost to install a french drain per foot?
DIY materials cost $8 to $14 per linear foot for gravel, pipe, and fabric. Professional contractor installation costs $30 to $65 per linear foot depending on trench depth and hand vs machine digging.

### Is my personal data saved when using this calculator?
No. All calculation logic operates locally in your web browser.
