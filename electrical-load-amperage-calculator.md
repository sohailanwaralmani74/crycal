---
layout: tool
title: "Electrical Load Amperage | Interactive Online Tool"
description: "Calculate total residential electrical service load in amperes and determine if a 100A, 200A, or 400A panel is required per NEC 220 demand factors."
permalink: /electrical-load-amperage-calculator
tool_id: electrical-load-amperage-calculator
category: electrical
hide_sidebar: true

inputs:
  - id: homeSqFt
    label: Living Area Square Footage (sq ft)
    type: number
    default: 2000
    step: 100
    min: 500
    placeholder: "e.g., 2000"

  - id: smallApplianceCircuits
    label: Kitchen Small Appliance Circuits (20A / 1500 VA each)
    type: number
    default: 2
    step: 1
    min: 2
    placeholder: "e.g., 2"

  - id: laundryCircuits
    label: Dedicated Laundry Circuits (20A / 1500 VA each)
    type: number
    default: 1
    step: 1
    min: 1
    placeholder: "e.g., 1"

  - id: electricRangeWatts
    label: Electric Oven / Cooktop Range (Watts)
    type: number
    default: 8000
    step: 500
    min: 0
    placeholder: "e.g., 8000"

  - id: electricDryerWatts
    label: Electric Clothes Dryer (Watts)
    type: number
    default: 5000
    step: 500
    min: 0
    placeholder: "e.g., 5000"

  - id: waterHeaterWatts
    label: Electric Water Heater (Watts)
    type: number
    default: 4500
    step: 500
    min: 0
    placeholder: "e.g., 4500"

  - id: hvacHeatPumpWatts
    label: HVAC Air Conditioning / Heat Pump (Watts)
    type: number
    default: 7200
    step: 500
    min: 0
    placeholder: "e.g., 7200"

  - id: evChargerWatts
    label: EV Level 2 Car Charger (Watts)
    type: number
    default: 7680
    step: 500
    min: 0
    placeholder: "e.g., 7680"

  - id: otherFastLoadsWatts
    label: Other Fixed Major Appliances (Dishwasher, Disposal, etc.)
    type: number
    default: 2000
    step: 500
    min: 0
    placeholder: "e.g., 2000"

outputs:
  - id: totalDemandVA
    label: Total Demanded Load
  - id: serviceAmperage
    label: Total Service Amperage Required (@ 240V)
  - id: recommendedPanelSize
    label: Recommended Panel Size
  - id: generalLightingDemandVA
    label: Demanded General Lighting Load

charts:
  tabs:
    - id: loadBreakdown
      label: Electrical Load Breakdown (VA)
    - id: panelCapacityMargin
      label: Service Panel Capacity Usage

history_columns:
  - key: homeSqFt
    label: Sq Ft
    source: input
  - key: totalDemandVA
    label: Demanded Load (VA)
    source: output
  - key: serviceAmperage
    label: Amps (@ 240V)
    source: output
  - key: recommendedPanelSize
    label: Rec. Panel
    source: output

js_file: assets/js/calculators/electrical-load-amperage-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Electrical Load Amperage Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate total home electrical load amperage and minimum main panel size (100A, 200A, 400A) per NEC Article 220."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "NEC Article 220 Standard Calculation — computes general lighting demand at 3 VA per sq ft"
    - "Demand Factor Application — applies 100% first 3,000 VA and 35% remaining general load rule"
    - "Major Appliance Integration — includes electric range, clothes dryer, water heater, EV charger, and HVAC"
    - "Main Panel Sizing Guidance — calculates minimum amperage and recommends 100A, 200A, 300A, or 400A panels"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Electrical Load Amperage Calculator

howto:
  name: "How to Calculate Total Home Electrical Load"
  description: "Determine total electrical service amperage for panel upgrades and EV charger installations using NEC rules."
  step:
    - name: "Input Square Footage"
      text: "Enter total heated living space in square feet (excluding unheated attic/basement)."
    - name: "Specify Kitchen & Laundry Circuits"
      text: "Enter small appliance circuits (minimum 2 required) and laundry circuits (minimum 1 required)."
    - name: "Add Major Electric Appliances"
      text: "Enter wattage for electric range, water heater, dryer, EV charger, and HVAC systems."
    - name: "Review Demanded Load"
      text: "Check total calculated Volt-Amperes (VA) after applying NEC demand reduction factors."
    - name: "Select Panel Size"
      text: "Choose standard breaker panel size (100A, 200A, or 400A) that exceeds required amperage."

faq:
  - question: "Why is a load calculation required before adding an EV charger or heat pump?"
  - question: "What is the NEC general lighting load per square foot?"
  - question: "How does the NEC demand factor work for general loads?"
  - question: "Is a 100 amp panel enough for a modern home?"
  - question: "When do I need to upgrade to a 200 amp or 400 amp panel?"
  - question: "How does an EV charger affect total home electrical load?"
  - question: "Is my personal data saved when using this calculator?"

---

# Electrical Load Amperage Calculator

Calculate your home's **total electrical service load in amperes** using our **Electrical Load Amperage Calculator**. Based on **National Electrical Code (NEC) Article 220**, this tool determines whether your home requires a 100-amp, 200-amp, or 400-amp main breaker panel.

<!-- more -->

## Why Calculate Home Electrical Load Amperage?

Adding high-draw modern electrical loads—such as Level 2 electric vehicle (EV) chargers, heat pump HVAC systems, electric tankless water heaters, or hot tubs—can overload older 100A main electrical panels. 

Before upgrading your electrical service or adding heavy appliances, building inspectors and electricians require an official **NEC Article 220 load calculation** to ensure your main panel and service entrance wires won't overheat.

- **NEC Article 220 Compliance**: Applies official demand factors for residential occupancy.
- **Prevents Main Breaker Tripping**: Evaluates true simultaneous demand load rather than simple additive wattage.
- **EV Charger & HVAC Planning**: Assesses headroom for 40A–50A Level 2 chargers and high-output heat pumps.
- **Panel Upgrade Guidance**: Helps homeowners decide between 150A, 200A, or 400A (200A double) main panel installations.

---

## NEC Load Calculation Formulas

Residential load sizing follows the NEC 220 standard calculation method:

### 1. General Lighting & Receptacle Load:
$$\text{General Load (VA)} = (\text{Sq Ft} \times 3\ \text{VA/sq ft}) + (\text{Small Appliance Circuits} \times 1,500\ \text{VA}) + (\text{Laundry Circuits} \times 1,500\ \text{VA})$$

### 2. General Load Demand Factor:
$$\text{Demanded General VA} = 3,000\ \text{VA} + \left[ (\text{General Load} - 3,000\ \text{VA}) \times 0.35 \right]$$

### 3. Major Appliance & HVAC Load:
$$\text{Total Demanded Load (VA)} = \text{Demanded General VA} + \text{Range VA} + \text{Dryer VA} + \text{Water Heater VA} + \text{HVAC VA} + \text{EV Charger VA}$$

### 4. Service Panel Amperage (@ 240V):
$$\text{Service Amperage (A)} = \frac{\text{Total Demanded Load (VA)}}{240\ \text{V}}$$

---

## Residential Panel Size Selection Table

| Service Panel Rating | Max Demanded Capacity (@ 240V) | Typical Home Size & Profile |
| :--- | :--- | :--- |
| **100 Amp Panel** | Up to 24,000 VA (24 kW) | Small homes/condos (<1,500 sq ft) with gas heating and water heater. |
| **150 Amp Panel** | Up to 36,000 VA (36 kW) | Mid-size homes (1,500–2,200 sq ft) with mixed electric/gas appliances. |
| **200 Amp Panel** | Up to 48,000 VA (48 kW) | Standard modern single-family home with EV charger, central AC, and electric range. |
| **300 Amp Panel** | Up to 72,000 VA (72 kW) | Large custom homes (3,500–5,000 sq ft) with multiple AC units & EV chargers. |
| **400 Amp Panel** | Up to 96,000 VA (96 kW) | Luxury estates (>5,000 sq ft), dual EV chargers, electric pool heaters, all-electric. |

---

## Step-by-Step Guide to Calculating Panel Load

1. **Enter Square Footage**: Input living floor area (excluding unconditioned garages or open porches).
2. **Include Mandatory Circuits**: Keep small appliance (2) and laundry (1) circuit counts active per NEC rules.
3. **Enter Appliance Wattages**: Input nameplate wattage for electric stove/range, dryer, water heater, and HVAC.
4. **Add High-Current Extras**: Enter EV charger rating (e.g., 7,680W for a 32A charger on a 40A circuit).
5. **Check Total Service Amps**: Compare calculated minimum amperage against standard panel sizes (100A, 200A, 400A).

---

## Frequently Asked Questions

### Why is a load calculation required before adding an EV charger or heat pump?
Adding a 48A Level 2 EV charger adds 11.5 kW of continuous load. If your home's existing load calculation is already at 85A on a 100A panel, adding the charger would cause main breaker tripping or wall fire risks.

### What is the NEC general lighting load per square foot?
The NEC assigns a base unit load of 3 Volt-Amperes (VA) per square foot of living space for general lighting and general-purpose wall receptacles.

### How does the NEC demand factor work for general loads?
Since not all lights and outlets are used simultaneously, NEC 220 allows taking the first 3,000 VA at 100%, and applying a 35% demand factor to any remaining general load between 3,001 and 120,000 VA.

### Is a 100 amp panel enough for a modern home?
100-amp panels are usually adequate for homes under 1,500 sq ft using natural gas for heating, hot water, and cooking. However, 100A panels rarely have sufficient headroom for Level 2 EV chargers or heat pumps.

### When do I need to upgrade to a 200 amp or 400 amp panel?
If your total calculated demand amperage exceeds 80A (80% of 100A), or if you lack physical breaker space for new double-pole breakers, upgrading to a 200-amp panel is strongly recommended.

### How does an EV charger affect total home electrical load?
Continuous loads like EV chargers must be calculated at 100% of their nameplate rating (or 125% for branch circuit sizing). A 40A charger adds 32A of continuous demand @ 240V (7.68 kW).

### Is my personal data saved when using this calculator?
No. All calculations run strictly in your web browser. No inputs are stored or transmitted.
