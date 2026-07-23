---
layout: tool
title: Heat Loss & Heat Gain Calculator – Building Thermal Envelope BTU Load
description: Calculate building thermal envelope BTU heat loss for heating capacity (kW/MBH) and solar/conductive heat gain for cooling load (tons).
permalink: /heat-loss-gain-calculator
tool_id: heat-loss-gain-calculator
category: insulation-hvac
hide_sidebar: true

inputs:
  - id: wallAreaSqFt
    label: Exterior Wall Net Area (Sq Ft)
    type: number
    default: 1200
    step: 50
    min: 100
    placeholder: "e.g., 1200"

  - id: wallRValue
    label: Exterior Wall Insulation Rating (R-Value)
    type: select
    default: "13"
    options:
      - value: "11"
        label: "R-11 (Standard 2x4 Wall)"
      - value: "13"
        label: "R-13 (Standard 2x4 High Density)"
      - value: "19"
        label: "R-19 (Standard 2x6 Wall)"
      - value: "21"
        label: "R-21 (2x6 High Density Fiberglass)"
      - value: "30"
        label: "R-30 (Continuous Rigid Foam Wall)"

  - id: windowAreaSqFt
    label: Window & Exterior Glass Area (Sq Ft)
    type: number
    default: 250
    step: 25
    min: 10
    placeholder: "e.g., 250"

  - id: windowUFactor
    label: Window Glazing U-Factor
    type: select
    default: "0.30"
    options:
      - value: "1.10"
        label: "U-1.10 (Single Pane Clear Glass)"
      - value: "0.50"
        label: "U-0.50 (Double Pane Clear Glass)"
      - value: "0.30"
        label: "U-0.30 (Double Pane Low-E Argon)"
      - value: "0.22"
        label: "U-0.22 (Triple Pane High Efficiency)"

  - id: ceilingAreaSqFt
    label: Ceiling / Attic Floor Area (Sq Ft)
    type: number
    default: 1500
    step: 50
    min: 100
    placeholder: "e.g., 1500"

  - id: ceilingRValue
    label: Attic Insulation Rating (R-Value)
    type: select
    default: "30"
    options:
      - value: "19"
        label: "R-19 (6 Inches Fiberglass)"
      - value: "30"
        label: "R-30 (10 Inches Fiberglass / Cellulose)"
      - value: "38"
        label: "R-38 (12 Inches Blown Insulation)"
      - value: "49"
        label: "R-49 (16 Inches High Performance Code)"
      - value: "60"
        label: "R-60 (20 Inches Super-Insulated)"

  - id: indoorTemp
    label: Indoor Design Temperature (°F)
    type: number
    default: 70
    step: 1
    min: 60
    max: 78
    placeholder: "e.g., 70"

  - id: outdoorWinterTemp
    label: Outdoor Winter Design Temp (°F)
    type: number
    default: 15
    step: 5
    min: -30
    max: 50
    placeholder: "e.g., 15"

  - id: outdoorSummerTemp
    label: Outdoor Summer Design Temp (°F)
    type: number
    default: 95
    step: 5
    min: 75
    max: 125
    placeholder: "e.g., 95"

outputs:
  - id: heatingHeatLossBtu
    label: Heating Heat Loss (BTU / hr)
  - id: coolingHeatGainBtu
    label: Cooling Heat Gain (BTU / hr)
  - id: heatingCapacityKw
    label: Required Heating Power (kW / MBH)
  - id: coolingCapacityTons
    label: Required Cooling Capacity (Tons)
  - id: dominantEnvelopeLoss
    label: Largest Thermal Loss Component

charts:
  tabs:
    - id: heatLossByEnvelope
      label: Thermal Envelope Loss Breakdown
    - id: heatingVsCoolingLoad
      label: Heating Loss vs Cooling Gain

history_columns:
  - key: wallAreaSqFt
    label: Wall Area
    source: input
  - key: outdoorWinterTemp
    label: Winter Temp
    source: input
  - key: heatingHeatLossBtu
    label: Heat Loss BTU
    source: output
  - key: coolingCapacityTons
    label: Cooling Tons
    source: output

js_file: assets/js/calculators/heat-loss-gain-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Heat Loss & Heat Gain Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate thermal envelope conductive heat loss (BTU/hr) and heat gain for HVAC furnace sizing, heat pump capacity, and AC tonnage."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Conductive Thermal Calculation — computes Q = U * A * Delta T for walls, windows, and ceilings"
    - "Conversion to R-Value & U-Factor — seamlessly integrates insulation R-values and window U-factors"
    - "Dual Winter & Summer Load Modeling — calculates heating kW/MBH and cooling tons simultaneously"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Heat Loss & Heat Gain Calculator

howto:
  name: "How to Calculate Building Heat Loss and Heat Gain"
  description: "Accurately calculate building thermal envelope heat transfer for HVAC equipment sizing."
  step:
    - name: "Measure envelope component surface areas"
      text: "Input net exterior wall area, window glass area, and ceiling attic area."
    - name: "Select component insulation values"
      text: "Choose wall R-value, window U-factor, and attic ceiling R-value."
    - name: "Specify design temperatures"
      text: "Enter desired indoor temperature and local extreme winter and summer design outdoor temperatures."
    - name: "Review heating and cooling BTU loads"
      text: "View total winter BTU heat loss, required furnace kW/MBH, and summer AC tons."

faq:
  - question: "What is the difference between heat loss and heat gain?"
    answer: "Heat loss measures thermal energy escaping outward through walls, windows, and ceilings during cold winter weather. Heat gain measures external heat entering the building through conduction and solar radiation during summer."
  - question: "How do you convert R-value to U-factor?"
    answer: "U-factor is the reciprocal of R-value: U = 1 / R. For example, a wall with R-13 insulation has a U-factor of 1 / 13 = 0.0769 BTU/hr·ft²·°F."
  - question: "What is the fundamental formula for conductive heat loss?"
    answer: "Conductive heat transfer is calculated using Fourier's Law: Q = U × A × ΔT, where Q is heat loss in BTU/hr, U is thermal transmittance (1/R), A is surface area in sq ft, and ΔT is temperature difference between indoors and outdoors."
  - question: "Why do windows lose so much more heat than insulated walls?"
    answer: "Standard double-pane windows have a U-factor of 0.30 (equivalent to R-3.3), whereas an R-13 wall plus drywall and siding provides an effective assembly rating of R-15 (U-factor 0.066). Windows leak heat nearly 5 times faster per square foot."
  - question: "What is MBH in heating capacity?"
    answer: "MBH represents 1,000 BTUs per hour (M = Roman numeral 1,000). A furnace rated at 60 MBH produces 60,000 BTUs of heat per hour."
  - question: "How does air infiltration affect heat loss calculations?"
    answer: "Infiltration (drafts through cracks and door gaps) accounts for 20% to 40% of total building heat loss. Standard Manual J calculations add air exchange infiltration BTUs to basic conductive envelope losses."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation logic runs locally in your browser."
---

# Heat Loss & Heat Gain Calculator – Building Thermal Envelope BTU Load

Calculate building envelope heat loss in BTU/hr, furnace kW/MBH output requirements, and summer heat gain cooling tons with our free **Heat Loss & Heat Gain Calculator**.

<!-- more -->

## Why Calculate Thermal Envelope Heat Loss & Gain?

Sizing HVAC heating and cooling equipment based on actual building envelope thermal performance guarantees year-round comfort:
- **Prevent Furnace Over-Sizing**: Oversized gas furnaces blast superheated air in short bursts, creating cold drafts and excessive duct noise.
- **Identify Thermal Bridges**: Comparing walls, windows, and ceilings highlights whether upgrading windows or adding attic insulation yields the highest energy savings.
- **Support Heat Pump Sizing**: Modern cold-climate heat pumps require exact peak winter heat loss math to size backup auxiliary electric heat strips.

---

## Thermal Envelope Governing Formulas

$$\text{Temperature Difference (Winter)} \quad \Delta T_{\text{winter}} = T_{\text{indoor}} - T_{\text{outdoor, winter}}$$

$$\text{Temperature Difference (Summer)} \quad \Delta T_{\text{summer}} = T_{\text{outdoor, summer}} - T_{\text{indoor}}$$

$$\text{Wall Conductive Loss} \quad Q_{\text{wall}} = \left(\frac{1}{R_{\text{wall}}}\right) \times A_{\text{wall}} \times \Delta T$$

$$\text{Window Conductive Loss} \quad Q_{\text{window}} = U_{\text{window}} \times A_{\text{window}} \times \Delta T$$

$$\text{Ceiling Conductive Loss} \quad Q_{\text{ceiling}} = \left(\frac{1}{R_{\text{ceiling}}}\right) \times A_{\text{ceiling}} \times \Delta T$$

$$\text{Total Envelope Heat Loss (BTU/hr)} = (Q_{\text{wall}} + Q_{\text{window}} + Q_{\text{ceiling}}) \times 1.25 \quad \text{(25\% air infiltration factor)}$$

---

## Heat Loss Breakdown Table (Winter Design ΔT = 55°F: Indoor 70°F / Outdoor 15°F)

| Building Element | Area (sq ft) | Thermal Rating | Thermal Transmittance (U) | Winter BTU Loss | Loss % |
|---|---|---|---|---|---|
| **Exterior Walls** | 1,200 sq ft | R-13 Insulation | U-0.077 | **5,280 BTU/hr** | 35.1% |
| **Windows & Glass** | 250 sq ft | U-0.30 (Double Low-E) | U-0.300 | **4,125 BTU/hr** | 27.4% |
| **Attic Ceiling** | 1,500 sq ft | R-30 Insulation | U-0.033 | **2,723 BTU/hr** | 18.1% |
| **Air Infiltration (Drafts)** | Whole House | 0.5 Air Changes / Hr | N/A | **2,932 BTU/hr** | 19.4% |
| **Total Envelope Load** | **3,000 sq ft Surface** | **Mixed Envelope** | **Mixed** | **15,060 BTU/hr** | **100%** |

---

## Step-by-Step Envelope Calculation Guide

1. **Measure Exterior Surfaces**: Input net wall surface area (excluding window openings), total window glass area, and ceiling footprint area.
2. **Select Wall & Ceiling R-Values**: Select insulation ratings (R-11 to R-30 for walls, R-19 to R-60 for attic).
3. **Choose Window U-Factor**: Pick window glazing type (U-1.10 single pane vs U-0.30 Low-E argon).
4. **Input Design Temperatures**: Enter local winter extreme outdoor temperature and target indoor comfort temperature (e.g. 70°F).
5. **Review Capacity Results**: View total peak winter BTU heat loss, required furnace capacity in kW and MBH, and summer cooling tonnage.

---

## Frequently Asked Questions

### What is the difference between heat loss and heat gain?
Heat loss measures thermal energy escaping outward through walls, windows, and ceilings during cold winter weather. Heat gain measures external heat entering the building through conduction and solar radiation during summer.

### How do you convert R-value to U-factor?
U-factor is the reciprocal of R-value: U = 1 / R. For example, a wall with R-13 insulation has a U-factor of 1 / 13 = 0.0769 BTU/hr·ft²·°F.

### What is the fundamental formula for conductive heat loss?
Conductive heat transfer is calculated using Fourier's Law: Q = U × A × ΔT, where Q is heat loss in BTU/hr, U is thermal transmittance (1/R), A is surface area in sq ft, and ΔT is temperature difference between indoors and outdoors.

### Why do windows lose so much more heat than insulated walls?
Standard double-pane windows have a U-factor of 0.30 (equivalent to R-3.3), whereas an R-13 wall plus drywall and siding provides an effective assembly rating of R-15 (U-factor 0.066). Windows leak heat nearly 5 times faster per square foot.

### What is MBH in heating capacity?
MBH represents 1,000 BTUs per hour (M = Roman numeral 1,000). A furnace rated at 60 MBH produces 60,000 BTUs of heat per hour.

### How does air infiltration affect heat loss calculations?
Infiltration (drafts through cracks and door gaps) accounts for 20% to 40% of total building heat loss. Standard Manual J calculations add air exchange infiltration BTUs to basic conductive envelope losses.

### Is my personal data saved when using this calculator?
No. All calculation logic runs locally in your browser.
