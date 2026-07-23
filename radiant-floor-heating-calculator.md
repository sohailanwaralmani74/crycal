---
layout: tool
title: Radiant Floor Heating Calculator – Cable Feet, Mat Sq Ft & Electrical Load
description: Calculate electric radiant floor heating cable linear feet, mat square footage, total thermostat wattage load, and circuit amperage draw at 120V or 240V.
permalink: /radiant-floor-heating-calculator
tool_id: radiant-floor-heating-calculator
category: flooring
hide_sidebar: true

inputs:
  - id: roomLengthFeet
    label: Room Length (Feet)
    type: number
    default: 14
    step: 0.5
    min: 2
    placeholder: "e.g., 14"

  - id: roomWidthFeet
    label: Room Width (Feet)
    type: number
    default: 12
    step: 0.5
    min: 2
    placeholder: "e.g., 12"

  - id: unheatedFixturesSqFt
    label: Unheated Fixtures Area (Vanity, Tub, Cabinets in Sq Ft)
    type: number
    default: 28
    step: 5
    min: 0
    placeholder: "e.g., 28"

  - id: heatingType
    label: Heating System Format
    type: select
    default: "mat"
    options:
      - value: "mat"
        label: "Electric Mesh Heating Mat (12 W/sq ft – Pre-spaced 3\" mesh)"
      - value: "cable"
        label: "Loose Electric Heating Cable (Uncoupling membrane @ 3\" spacing)"
      - value: "hydronic"
        label: "Hydronic Water PEX Tubing (In-slab / Joist bay manifold system)"

  - id: voltage
    label: Circuit Voltage
    type: select
    default: "120"
    options:
      - value: "120"
        label: "120 Volts AC (Standard dedicated bathroom circuit < 150 sq ft)"
      - value: "240"
        label: "240 Volts AC (Large room / Whole home radiant system > 150 sq ft)"

  - id: wattageDensity
    label: Target Power Density (Watts per Sq Ft)
    type: number
    default: 12
    step: 1
    min: 8
    max: 15
    suffix: 'W/sq ft'
    placeholder: "e.g., 12"

outputs:
  - id: heatedAreaSqFt
    label: Net Heated Floor Area (Sq Ft)
  - id: cableOrMatQuantity
    label: Heating System Material Quantity (Mat Sq Ft / Cable Feet / PEX Feet)
  - id: thermostatWattageLoad
    label: Total Power Load (Watts)
  - id: electricalAmperage
    label: Total Electrical Current Draw (Amps @ Voltage)

charts:
  tabs:
    - id: floorAreaDivision
      label: Net Heated Area vs Unheated Perimeter & Fixtures Area
    - id: powerLoadByVoltage
      label: Amperage Draw at 120V vs 240V Circuit Load

history_columns:
  - key: roomLengthFeet
    label: Length (ft)
    source: input
  - key: roomWidthFeet
    label: Width (ft)
    source: input
  - key: heatedAreaSqFt
    label: Heated Area
    source: output
  - key: cableOrMatQuantity
    label: Material Qty
    source: output
  - key: thermostatWattageLoad
    label: Power (Watts)
    source: output
  - key: electricalAmperage
    label: Amps
    source: output

js_file: assets/js/calculators/radiant-floor-heating-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Radiant Floor Heating Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate electric radiant floor heating mesh mat square footage, loose cable linear feet, hydronic PEX tubing, total wattage load, and 120V/240V breaker amperage."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Net Area Deduction Math — subtracts unheated vanity, bathtub, toilet, and perimeter clearance buffers"
    - "Electric Mat vs Cable vs Hydronic — solves material needs for mesh mats, loose wire, or PEX loops"
    - "Electrical Load Analysis — calculates total wattage and dedicated breaker amperage at 120V or 240V"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Radiant Floor Heating Calculator

howto:
  name: "How to Calculate Radiant Floor Heating Systems"
  description: "Determine heating mat square footage, cable linear feet, wattage load, and amperage for floor warming."
  step:
    - name: "Measure Total Room Dimensions"
      text: "Input overall room length and width in feet."
    - name: "Subtract Unheated Fixtures"
      text: "Enter total square feet occupied by unheated permanent fixtures (cabinets, vanities, bathtubs, showers)."
    - name: "Choose System Format"
      text: "Select pre-spaced fiberglass mesh mats, loose cable in membrane, or hydronic water PEX tubing."
    - name: "Select Circuit Voltage"
      text: "Choose 120V for small bathrooms (< 150 sq ft) or 240V for larger living areas."

faq:
  - question: "How do you calculate net heated floor area for radiant heat?"
    answer: "Net Heated Area = (Total Room Area - Unheated Fixture Area) × 0.90. A 4-inch perimeter buffer is subtracted around all exterior walls to avoid wasting heat under baseboards."
  - question: "How many watts per square foot does radiant floor heat use?"
    answer: "Standard electric radiant floor heating systems consume 12 watts per square foot under tile, stone, or luxury vinyl plank, providing fast warmup times to 80°F–85°F."
  - question: "How much cable do I need per square foot of heated floor?"
    answer: "At standard 3-inch cable spacing, loose heating wire requires 4 linear feet of cable per square foot of net heated floor area. At 4-inch spacing, it requires 3 linear feet per sq ft."
  - question: "Can electric heating cable be cut to length?"
    answer: "NEVER cut electric resistance heating cable wire! Cutting resistance wire alters electrical ohms, causing extreme overheating and dangerous fire hazards. Always size heating mats/cables slightly smaller than net area."
  - question: "When should I use 120V vs 240V radiant heat?"
    answer: "Use 120V for small heated areas up to 150 sq ft (max 15 Amps / 1,800 Watts). Use 240V for larger spaces over 150 sq ft (up to 300 sq ft on a single thermostat)."
  - question: "How deep under tile should radiant heating cable be embedded?"
    answer: "Heating cables should be fully encapsulated in self-leveling underlayment (SLU) or thin-set mortar with a minimum 1/4\" mortar coverage above the wire."
  - question: "Is my floor heating calculation saved on external servers?"
    answer: "No. All calculation logic runs locally inside your browser."
---

# Radiant Floor Heating Calculator – Cable Feet, Mat Sq Ft & Electrical Load

Calculate exact **net heated floor square footage**, **electric heating mat area**, **loose cable linear feet**, total **thermostat wattage load**, and **circuit breaker amperage** at 120V or 240V.

<!-- more -->

## Why Radiant Floor Heating Sizing Matters

Electric and hydronic radiant floor heating provides luxurious, dust-free radiant warmth under tile, stone, laminate, and luxury vinyl floors.

Because electric heating resistance cables **cannot be cut or shortened**, ordering the wrong size mat or cable kit can completely ruin an installation. Sizing net heated area accurately—subtracting vanities, tubs, and perimeter gaps—is vital for safe, code-compliant performance.

---

## Radiant Floor Heating Mathematical Formulas

$$\text{Total Room Area (sq ft)} = \text{Length (ft)} \times \text{Width (ft)}$$
$$\text{Net Heated Area (sq ft)} = (\text{Total Area} - \text{Unheated Fixtures}) \times 0.90 \text{ (10\% perimeter gap)}$$
$$\text{Heating Cable Linear Feet (3" Spacing)} = \text{Net Heated Area (sq ft)} \times 4.0$$
$$\text{Hydronic PEX Tubing Feet (8" Loop)} = \text{Net Heated Area (sq ft)} \times 1.35$$
$$\text{Thermostat Wattage Load (W)} = \text{Net Heated Area (sq ft)} \times \text{Wattage Density (W/sq ft)}$$
$$\text{Circuit Amperage Draw (Amps)} = \frac{\text{Thermostat Wattage Load (W)}}{\text{Circuit Voltage (V)}}$$

---

## Electric Radiant Heating Sizing Table (12 W/sq ft @ 120V & 240V)

| Total Room Area | Unheated Fixtures | Net Heated Floor Area | Mat / Membrane Coverage | Loose Cable Length (3" spacing) | Total Power Load (Watts) | Amperage @ 120V | Amperage @ 240V |
|---|---|---|---|---|---|---|---|
| **50 sq ft (Bath)** | 15 sq ft | **31.5 sq ft** | 30 sq ft Mat | 126 linear ft | **378 Watts** | 3.15 Amps | 1.58 Amps |
| **80 sq ft (Bath)** | 25 sq ft | **49.5 sq ft** | 48 sq ft Mat | 198 linear ft | **594 Watts** | 4.95 Amps | 2.48 Amps |
| **120 sq ft (Bath/Kit)**| 30 sq ft | **81.0 sq ft** | 80 sq ft Mat | 324 linear ft | **972 Watts** | 8.10 Amps | 4.05 Amps |
| **168 sq ft (Master)** | 38 sq ft | **117.0 sq ft** | 115 sq ft Mat | 468 linear ft | **1,404 Watts** | 11.70 Amps | 5.85 Amps |
| **240 sq ft (Living)** | 20 sq ft | **198.0 sq ft** | 195 sq ft Mat | 792 linear ft | **2,376 Watts** | 19.80 Amps | **9.90 Amps** |

---

## Step-by-Step Radiant Floor Installation

1. **Draw Floor Plan**: Map out exact locations of permanent cabinets, toilets, bathtubs, and vanity bases (heating wire must not run under permanent fixtures).
2. **Calculate Net Heated Space**: Deduct fixtures and a 4-inch perimeter buffer along all walls.
3. **Subfloor Prep & Uncoupling**: Install uncoupling membrane or cement backerboard over subfloor.
4. **Lay Wire / Mesh Mat**: Lay out mesh mat or weave loose cable into membrane studs at 3-inch spacing.
5. **Install Floor Sensor**: Weave GFCI thermostat floor temperature sensor tube halfway between two heating cables.
6. **Encapsulate in Mortar / SLU**: Pour self-leveling compound or trowel modified thin-set mortar over wire prior to tile placement.

---

## Frequently Asked Questions

### How do you calculate net heated floor area for radiant heat?
Net Heated Area = (Total Room Area - Unheated Fixture Area) × 0.90. A 4-inch perimeter buffer is subtracted around all exterior walls to avoid wasting heat under baseboards.

### How many watts per square foot does radiant floor heat use?
Standard electric radiant floor heating systems consume 12 watts per square foot under tile, stone, or luxury vinyl plank, providing fast warmup times to 80°F–85°F.

### How much cable do I need per square foot of heated floor?
At standard 3-inch cable spacing, loose heating wire requires 4 linear feet of cable per square foot of net heated floor area. At 4-inch spacing, it requires 3 linear feet per sq ft.

### Can electric heating cable be cut to length?
NEVER cut electric resistance heating cable wire! Cutting resistance wire alters electrical ohms, causing extreme overheating and dangerous fire hazards. Always size heating mats/cables slightly smaller than net area.

### When should I use 120V vs 240V radiant heat?
Use 120V for small heated areas up to 150 sq ft (max 15 Amps / 1,800 Watts). Use 240V for larger spaces over 150 sq ft (up to 300 sq ft on a single thermostat).

### How deep under tile should radiant heating cable be embedded?
Heating cables should be fully encapsulated in self-leveling underlayment (SLU) or thin-set mortar with a minimum 1/4" mortar coverage above the wire.

### Is my floor heating calculation saved on external servers?
No. All calculation logic runs locally inside your browser.
