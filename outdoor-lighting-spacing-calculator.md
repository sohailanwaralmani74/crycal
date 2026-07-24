---
layout: tool
title: "Outdoor Lighting Spacing | Interactive Online Tool"
description: "Calculate landscape path light fixture counts, spotlight accent counts, low-voltage wire run gauge (14/2 vs 12/2), and transformer wattage capacity."
permalink: /outdoor-lighting-spacing-calculator
tool_id: outdoor-lighting-spacing-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: walkwayLength
    label: Path / Garden Border Length (Feet)
    type: number
    default: 60
    step: 5
    min: 10
    placeholder: "e.g., 60"

  - id: pathLightSpacing
    label: Path Light Fixture Spacing (Feet)
    type: select
    default: "8"
    options:
      - value: "6"
        label: "6 Feet (Intense Overlapping Pools of Light)"
      - value: "8"
        label: "8 Feet (Standard Residential Balance)"
      - value: "10"
        label: "10 Feet (Subtle Ambient Lighting)"
      - value: "12"
        label: "12 Feet (Wide Spaced Pathway Guidance)"

  - id: pathLightWattage
    label: Path Light LED Bulb Wattage
    type: select
    default: "3"
    options:
      - value: "2"
        label: "2 Watts LED (Soft Accent)"
      - value: "3"
        label: "3 Watts LED (Standard Path Light)"
      - value: "5"
        label: "5 Watts LED (Bright Pathway)"

  - id: spotlightCount
    label: Accent Spotlights & Up-Lights Count
    type: number
    default: 4
    step: 1
    min: 0
    placeholder: "e.g., 4"

  - id: spotlightWattage
    label: Spotlight LED Bulb Wattage
    type: select
    default: "7"
    options:
      - value: "5"
        label: "5 Watts LED (Small Shrub / Post Accent)"
      - value: "7"
        label: "7 Watts LED (Medium Tree / Facade Up-Light)"
      - value: "12"
        label: "12 Watts LED (Tall Canopy / Architectural Spotlight)"

  - id: totalWireRunFeet
    label: Total Low-Voltage Cable Run Length (Feet)
    type: number
    default: 100
    step: 10
    min: 10
    placeholder: "e.g., 100"

  - id: fixturePrice
    label: Average Price Per Light Fixture
    type: number
    default: 28.00
    step: 1.00
    min: 0
    currency: true
    placeholder: "e.g., 28.00"

outputs:
  - id: pathLightCount
    label: Path Light Fixtures Needed
  - id: totalFixtureCount
    label: Total System Light Fixtures
  - id: totalSystemWattage
    label: Total Fixture Power Draw (Watts)
  - id: recommendedTransformer
    label: Recommended Transformer Size (Watts)
  - id: recommendedWireGauge
    label: Recommended Wire Cable Gauge (AWG)
  - id: totalEquipmentCost
    label: Total Fixture & System Cost

charts:
  tabs:
    - id: powerConsumptionBreakdown
      label: Wattage Load Breakdown
    - id: transformerCapacityLoad
      label: System Load vs Transformer Capacity

history_columns:
  - key: walkwayLength
    label: Path Length
    source: input
  - key: pathLightSpacing
    label: Spacing
    source: input
  - key: totalSystemWattage
    label: Total Watts
    source: output
  - key: totalEquipmentCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/outdoor-lighting-spacing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Outdoor Lighting Spacing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate landscape path light spacing, spotlight counts, low-voltage wire gauge (16/2, 14/2, 12/2 AWG), and transformer wattage."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Pathway Fixture Spacing Model — calculates staggered vs opposite path light arrangements"
    - "Transformer 1.25 Safety Sizing — enforces 80% maximum transformer continuous load rule"
    - "Voltage Drop & Wire Gauge Matrix — recommends 16/2, 14/2, or 12/2 direct burial cable"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Outdoor Lighting Spacing Calculator

howto:
  name: "How to Calculate Landscape Lighting Spacing & Transformer Size"
  description: "Determine path light fixture counts, spotlight wattage, wire run length, and low-voltage transformer capacity."
  step:
    - name: "Measure walkway or garden length"
      text: "Input total linear length of path or garden border to be illuminated."
    - name: "Select path light spacing & wattage"
      text: "Choose 6ft to 12ft spacing and select 2W, 3W, or 5W LED bulb wattage."
    - name: "Add accent spotlights"
      text: "Enter count and wattage for architectural tree up-lights and wall wash spotlights."
    - name: "Input cable run length"
      text: "Enter total distance from transformer to farthest light fixture."
    - name: "Review transformer size & wire gauge"
      text: "Get recommended transformer wattage (e.g. 75W, 150W, or 300W) and direct-burial wire gauge."

faq:
  - question: "How far apart should landscape path lights be spaced?"
    answer: "Path lights should be spaced 6 to 10 feet apart on center, alternating (staggered) on opposite sides of the walkway. This creates pools of overlapping light without harsh glaring hotspots."
  - question: "How do I size a low-voltage landscape lighting transformer?"
    answer: "Add up the wattage of all path lights and spotlights on the circuit, then multiply by 1.25 (an 80% maximum continuous load rule). For example, a 60-watt fixture load requires at least a 75-watt transformer."
  - question: "What wire gauge should I use for 12V landscape lighting?"
    answer: "Use 16/2 AWG for runs under 50 ft (loads under 100W), 14/2 AWG for runs up to 100 ft (loads up to 150W), and 12/2 AWG for long runs up to 150 ft (loads up to 200W) to prevent voltage drop."
  - question: "Why do low-voltage 12V LED lights flicker at the end of a long wire run?"
    answer: "Voltage drop occurs when electrical resistance in thin wire reduces voltage below 10.5V at the end of a long cable run. Upgrading from 14/2 to 12/2 wire or using a multi-tap transformer (13V-15V terminals) solves voltage drop flickering."
  - question: "What is the difference between LED and halogen landscape lights?"
    answer: "LED fixtures consume 80% less power than older halogen lights (a 3W LED equals a 20W halogen) and last up to 50,000 hours compared to 2,000 hours for halogen bulbs."
  - question: "How deep should low-voltage landscape wire be buried?"
    answer: "NEC code requires 12-volt low-voltage landscape wire to be buried at least 6 inches deep in soil or garden beds."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation formulas run locally in your web browser."
---

# Outdoor Lighting Spacing Calculator

Determine path light fixture counts, spotlight wattage, wire run gauge (14/2 vs 12/2), and low-voltage transformer capacity with our free **Outdoor Lighting Spacing Calculator**.

<!-- more -->

## Why Calculate Landscape Lighting & Wire Gauge Accurately?

Designing a low-voltage 12V landscape lighting system requires balancing light fixture spacing, total wattage draw, and electrical voltage drop:
- **Avoid 'Airport Runway' Over-Illumination**: Placing path lights too close together creates harsh blinding glare instead of warm ambient safety lighting.
- **Prevent Transformer Burnout**: Running transformers at 100% capacity continuously causes thermal shutoff and premature coil failure.
- **Eliminate Voltage Drop Dimness**: Thin wire on long 100-foot runs causes lights at the end of the line to appear dim and yellow.

---

## Landscape Lighting Governing Formulas

$$\text{Path Light Fixtures} = \left\lfloor \frac{\text{Walkway Length}}{\text{Spacing}} \right\rfloor + 1$$

$$\text{Path Light Watts} = \text{Path Light Count} \times \text{Path Light LED Watts}$$

$$\text{Spotlight Watts} = \text{Spotlight Count} \times \text{Spotlight LED Watts}$$

$$\text{Total System Load (Watts)} = \text{Path Light Watts} + \text{Spotlight Watts}$$

$$\text{Minimum Transformer Capacity (Watts)} = \text{Total System Load} \times 1.25 \quad \text{(80\% continuous load rule)}$$

$$\text{Recommended Wire Gauge} = \begin{cases} \text{16/2 AWG} & \text{if Load } \le 75\text{W and Run } \le 50\text{ ft} \\ \text{14/2 AWG} & \text{if Load } \le 150\text{W and Run } \le 100\text{ ft} \\ \text{12/2 AWG} & \text{if Load } > 150\text{W or Run } > 100\text{ ft} \end{cases}$$

---

## Landscape Lighting System Matrix (LED Fixtures)

| Path Length | Spacing | Path Lights (3W) | Spotlights (7W) | Total Load (Watts) | Transformer Size | Wire Gauge | Est. Cost |
|---|---|---|---|---|---|---|---|
| **40 ft Path** | 8 ft Spacing | **6 lights (18W)** | **2 spots (14W)** | **32 Watts** | **75W Transformer** | 16/2 AWG | $294.00 |
| **60 ft Path** | 8 ft Spacing | **8 lights (24W)** | **4 spots (28W)** | **52 Watts** | **75W Transformer** | 14/2 AWG | $416.00 |
| **100 ft Path** | 10 ft Spacing | **11 lights (33W)** | **6 spots (42W)** | **75 Watts** | **150W Transformer** | 14/2 AWG | $586.00 |
| **150 ft Path** | 10 ft Spacing | **16 lights (48W)** | **10 spots (70W)** | **118 Watts** | **150W Transformer** | 12/2 AWG | $878.00 |

---

## Step-by-Step Landscape Lighting Installation Guide

1. **Measure Walkway & Garden Borders**: Input total linear feet of paths, driveways, or garden perimeters needing light.
2. **Select Fixture Spacing**: Choose 8ft spacing for standard residential pathways or 10ft for subtle moonlit accents.
3. **Add Tree & Facade Spotlights**: Enter the number of up-lights illuminating trees, statues, or home facade walls.
4. **Input Cable Distance**: Measure distance from your outdoor GFCI outlet transformer to the farthest light fixture.
5. **Review Transformer & Wire Specs**: Purchase recommended transformer capacity (e.g. 75W, 150W, or 300W) and direct-burial cable.

---

## Frequently Asked Questions

### How far apart should landscape path lights be spaced?
Path lights should be spaced 6 to 10 feet apart on center, alternating (staggered) on opposite sides of the walkway. This creates pools of overlapping light without harsh glaring hotspots.

### How do I size a low-voltage landscape lighting transformer?
Add up the wattage of all path lights and spotlights on the circuit, then multiply by 1.25 (an 80% maximum continuous load rule). For example, a 60-watt fixture load requires at least a 75-watt transformer.

### What wire gauge should I use for 12V landscape lighting?
Use 16/2 AWG for runs under 50 ft (loads under 100W), 14/2 AWG for runs up to 100 ft (loads up to 150W), and 12/2 AWG for long runs up to 150 ft (loads up to 200W) to prevent voltage drop.

### Why do low-voltage 12V LED lights flicker at the end of a long wire run?
Voltage drop occurs when electrical resistance in thin wire reduces voltage below 10.5V at the end of a long cable run. Upgrading from 14/2 to 12/2 wire or using a multi-tap transformer (13V-15V terminals) solves voltage drop flickering.

### What is the difference between LED and halogen landscape lights?
LED fixtures consume 80% less power than older halogen lights (a 3W LED equals a 20W halogen) and last up to 50,000 hours compared to 2,000 hours for halogen bulbs.

### How deep should low-voltage landscape wire be buried?
NEC code requires 12-volt low-voltage landscape wire to be buried at least 6 inches deep in soil or garden beds.

### Is my personal data saved when using this calculator?
No. All calculation formulas run locally in your web browser.
