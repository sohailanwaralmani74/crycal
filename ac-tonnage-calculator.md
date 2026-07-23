---
layout: tool
title: AC Tonnage Calculator – Central Air Conditioning Sizing (BTU & Tons)
description: Calculate required central AC tonnage (1.5 to 5.0 tons) and BTU cooling load based on home square footage, ceiling height, climate zone, and insulation.
permalink: /ac-tonnage-calculator
tool_id: ac-tonnage-calculator
category: insulation-hvac
hide_sidebar: true

inputs:
  - id: homeSqFt
    label: Conditioned Living Area (Sq Ft)
    type: number
    default: 1800
    step: 50
    min: 200
    placeholder: "e.g., 1800"

  - id: ceilingHeight
    label: Average Ceiling Height (Feet)
    type: select
    default: "8"
    options:
      - value: "8"
        label: "8 Feet (Standard Residential Ceiling)"
      - value: "9"
        label: "9 Feet (Modern Residential)"
      - value: "10"
        label: "10 Feet (High Ceilings)"
      - value: "12"
        label: "12 Feet (Vaulted / Open Concept)"

  - id: climateZone
    label: Regional Climate Zone
    type: select
    default: "2_warm"
    options:
      - value: "1_hot"
        label: "Zone 1: Deep South / Sunbelt (25 BTU/sq ft)"
      - value: "2_warm"
        label: "Zone 2: Southern US / Coastal (22 BTU/sq ft)"
      - value: "3_moderate"
        label: "Zone 3: Central US / Midwest (20 BTU/sq ft)"
      - value: "4_cool"
        label: "Zone 4: Northern US / Mountain (18 BTU/sq ft)"

  - id: sunExposure
    label: Sun Exposure Level
    type: select
    default: "average"
    options:
      - value: "shaded"
        label: "Heavily Shaded / North Facing (-10% Load)"
      - value: "average"
        label: "Average Sun Exposure (Standard Load)"
      - value: "high_sun"
        label: "Full Sun / Unshaded West Windows (+10% Load)"

  - id: insulationQuality
    label: Building Insulation Quality
    type: select
    default: "average"
    options:
      - value: "poor"
        label: "Poor / Older Home (Single Pane Windows, Uninsulated Attic)"
      - value: "average"
        label: "Average / Standard Construction (Double Pane, R-30 Attic)"
      - value: "high_efficient"
        label: "High Efficiency / Modern Energy Star (Low-E, R-49 Attic)"

  - id: occupantCount
    label: Regular Home Occupants
    type: number
    default: 4
    step: 1
    min: 1
    placeholder: "e.g., 4"

outputs:
  - id: coolingLoadBtu
    label: Total Cooling Load (BTU / hr)
  - id: requiredTonnage
    label: Required AC Capacity (Tons)
  - id: recommendedUnit
    label: Recommended AC Unit Size
  - id: airflowCfm
    label: Required Blower Airflow (CFM)
  - id: estSeasonalKwh
    label: Est. Summer Cooling Energy (kWh)

charts:
  tabs:
    - id: loadFactorBreakdown
      label: Heat Gain Components
    - id: tonnageByZone
      label: Tonnage by Climate Zone

history_columns:
  - key: homeSqFt
    label: Living Area
    source: input
  - key: climateZone
    label: Zone
    source: input
  - key: coolingLoadBtu
    label: Cooling BTU
    source: output
  - key: requiredTonnage
    label: AC Tonnage
    source: output

js_file: assets/js/calculators/ac-tonnage-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "AC Tonnage Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate central air conditioner tonnage (1.5 to 5 tons), BTU heat gain loads, blower CFM, and energy requirements."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Climate Zone Heat Gain Modeling — adjusts BTU needs for US climate zones"
    - "Ceiling Height & Occupant Sensible Heat — incorporates air volume and body heat BTUs"
    - "Commercial Tonnage Rounding — maps precise BTU totals to standard 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, and 5.0 ton condensing units"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: AC Tonnage Calculator

howto:
  name: "How to Calculate Central AC Tonnage"
  description: "Determine the correct air conditioner tonnage and BTU cooling load for your home."
  step:
    - name: "Measure conditioned living area"
      text: "Input total square footage of heated and cooled indoor floor area."
    - name: "Select ceiling height"
      text: "Choose average ceiling height (8ft, 9ft, 10ft, or 12ft)."
    - name: "Select climate zone"
      text: "Pick your geographic location to apply accurate BTU/sq ft cooling multipliers."
    - name: "Adjust insulation & sun exposure"
      text: "Specify building insulation quality and shading levels."
    - name: "Review recommended AC tonnage"
      text: "Get your exact BTU load, recommended AC unit size in tons, and blower CFM."

faq:
  - question: "What is a ton of air conditioning?"
    answer: "One ton of air conditioning equals 12,000 BTUs (British Thermal Units) of cooling capacity per hour. It is derived from the amount of heat required to melt one short ton (2,000 lbs) of ice in 24 hours."
  - question: "How many square feet does a 3-ton AC unit cool?"
    answer: "A 3-ton central AC unit (36,000 BTUs) typically cools 1,500 to 1,800 square feet in warm climates, and up to 2,100 square feet in well-insulated homes in cooler climates."
  - question: "What happens if an AC unit is oversized?"
    answer: "An oversized AC unit 'short cycles' — turning on and off rapidly without running long enough to dehumidify the air. This results in clammy indoor air, high electric bills, uneven temperatures, and premature compressor failure."
  - question: "What happens if an AC unit is undersized?"
    answer: "An undersized AC unit runs continuously during peak summer heat without reaching the set thermostat temperature, causing excessive power bills and component wear."
  - question: "What sizes do residential central AC units come in?"
    answer: "Residential central air conditioners come in half-ton increments ranging from 1.5 tons (18,000 BTUs) up to 5.0 tons (60,000 BTUs). Homes needing over 5 tons require multiple AC units or zoning systems."
  - question: "How much airflow CFM is needed per ton of AC?"
    answer: "Standard central air systems require approximately 400 CFM (Cubic Feet per Minute) of blower airflow per ton of cooling. A 3-ton system requires 1,200 CFM airflow."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation formulas run locally in your browser."
---

# AC Tonnage Calculator – Central Air Conditioning Sizing (BTU & Tons)

Estimate required central AC tonnage (1.5 to 5.0 tons), total BTU cooling load, blower airflow CFM, and summer energy usage with our free **AC Tonnage Calculator**.

<!-- more -->

## Why Calculate AC Tonnage Accurately?

Selecting the correct central air conditioner capacity is critical for indoor comfort and energy efficiency:
- **Avoid Short-Cycling**: An oversized unit cools air quickly but leaves excessive humidity, making the home feel cold and clammy.
- **Prevent Inadequate Cooling**: An undersized unit runs 24/7 on 95°F summer days without reaching thermostat setpoints.
- **Match Ductwork Airflow**: Central AC units require 400 CFM per ton; choosing the right tonnage prevents noisy high-pressure duct restriction.

---

## AC Cooling Load & Tonnage Formulas

$$\text{Base BTU Load} = \text{Conditioned Area (sq ft)} \times \text{Zone BTU Multiplier}$$

$$\text{Ceiling Factor} = \frac{\text{Ceiling Height (ft)}}{8.0}$$

$$\text{Occupant Heat} = \text{Occupants} \times 600 \text{ BTU/person}$$

$$\text{Total BTU Load} = \left( \text{Base BTU} \times \text{Ceiling Factor} \times \text{Sun Factor} \times \text{Insulation Factor} \right) + \text{Occupant Heat}$$

$$\text{Calculated Tons} = \frac{\text{Total BTU Load}}{12,000 \text{ BTU/ton}}$$

$$\text{Blower Airflow (CFM)} = \text{Calculated Tons} \times 400 \text{ CFM/ton}$$

---

## Residential AC Sizing Matrix by Home Size

| Home Living Area | Climate Zone | Total BTU Load | Exact Tons | Recommended Unit | Blower Airflow (CFM) |
|---|---|---|---|---|---|
| **1,000 sq ft (Apartment/Condo)** | Zone 2 (Warm) | 24,200 BTU | 2.02 Tons | **2.0 Ton (24,000 BTU)** | 800 CFM |
| **1,500 sq ft (Small Ranch)** | Zone 2 (Warm) | 35,400 BTU | 2.95 Tons | **3.0 Ton (36,000 BTU)** | 1,200 CFM |
| **2,000 sq ft (Medium 2-Story)** | Zone 2 (Warm) | 46,600 BTU | 3.88 Tons | **4.0 Ton (48,000 BTU)** | 1,600 CFM |
| **2,800 sq ft (Large Home)** | Zone 2 (Warm) | 64,200 BTU | 5.35 Tons | **5.0 Ton + Zoning** | 2,000 CFM |

---

## Step-by-Step AC Sizing Process

1. **Measure Conditioned Area**: Input total indoor living square footage excluding unheated garages or basements.
2. **Select Ceiling Height**: Adjust for 9ft, 10ft, or vaulted 12ft ceilings that increase room air volume.
3. **Choose Climate Zone**: Pick your location (Zone 1 Sunbelt vs Zone 4 Cool North).
4. **Set Sun & Insulation Rating**: Factor in unshaded west-facing windows and insulation thermal resistance.
5. **Review Recommended Tonnage**: Select standard 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, or 5.0 ton condensing units.

---

## Frequently Asked Questions

### What is a ton of air conditioning?
One ton of air conditioning equals 12,000 BTUs (British Thermal Units) of cooling capacity per hour. It is derived from the amount of heat required to melt one short ton (2,000 lbs) of ice in 24 hours.

### How many square feet does a 3-ton AC unit cool?
A 3-ton central AC unit (36,000 BTUs) typically cools 1,500 to 1,800 square feet in warm climates, and up to 2,100 square feet in well-insulated homes in cooler climates.

### What happens if an AC unit is oversized?
An oversized AC unit "short cycles" — turning on and off rapidly without running long enough to dehumidify the air. This results in clammy indoor air, high electric bills, uneven temperatures, and premature compressor failure.

### What happens if an AC unit is undersized?
An undersized AC unit runs continuously during peak summer heat without reaching the set thermostat temperature, causing excessive power bills and component wear.

### What sizes do residential central AC units come in?
Residential central air conditioners come in half-ton increments ranging from 1.5 tons (18,000 BTUs) up to 5.0 tons (60,000 BTUs). Homes needing over 5 tons require multiple AC units or zoning systems.

### How much airflow CFM is needed per ton of AC?
Standard central air systems require approximately 400 CFM (Cubic Feet per Minute) of blower airflow per ton of cooling. A 3-ton system requires 1,200 CFM airflow.

### Is my personal data saved when using this calculator?
No. All calculation formulas run locally in your browser.
