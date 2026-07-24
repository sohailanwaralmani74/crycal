---
layout: tool
title: "Wire Gauge | Interactive Online Tool"
description: "Calculate the required AWG copper or aluminum wire size based on circuit amperage, AC voltage, run distance, phase, and maximum 3% voltage drop."
permalink: /wire-gauge-calculator
tool_id: wire-gauge-calculator
category: electrical
hide_sidebar: true

inputs:
  - id: circuitAmps
    label: Circuit Current / Ampacity (Amps)
    type: number
    default: 20
    step: 1
    min: 1
    placeholder: "e.g., 20"

  - id: voltage
    label: System AC Voltage (Volts)
    type: select
    default: "120"
    options:
      - label: "120V (Standard Branch Circuit)"
        value: "120"
      - label: "208V (Commercial Single/3-Phase)"
        value: "208"
      - label: "240V (Residential Heavy Appliance / EV)"
        value: "240"
      - label: "277V (Commercial Lighting)"
        value: "277"
      - label: "480V (Industrial 3-Phase)"
        value: "480"

  - id: runDistanceFeet
    label: One-Way Circuit Run Distance (Feet)
    type: number
    default: 100
    step: 5
    min: 5
    placeholder: "e.g., 100"

  - id: conductorMaterial
    label: Conductor Material
    type: select
    default: "copper"
    options:
      - label: "Copper (Cu)"
        value: "copper"
      - label: "Aluminum (Al)"
        value: "aluminum"

  - id: maxVoltageDrop
    label: Maximum Allowed Voltage Drop (%)
    type: number
    default: 3.0
    step: 0.5
    min: 1.0
    max: 10.0
    placeholder: "e.g., 3.0"

  - id: phaseType
    label: Circuit Phase Type
    type: select
    default: "1phase"
    options:
      - label: "Single-Phase (2-Wire AC)"
        value: "1phase"
      - label: "Three-Phase (3-Wire AC)"
        value: "3phase"

outputs:
  - id: recommendedAWG
    label: Recommended Minimum AWG / Kcmil Wire Size
  - id: voltageDropVolts
    label: Calculated Voltage Drop
  - id: voltageDropPercent
    label: Actual Voltage Drop Percentage
  - id: voltageAtLoad
    label: Estimated Terminal Voltage at Load

charts:
  tabs:
    - id: voltageDropVsDistance
      label: Voltage Drop vs Distance
    - id: wireResistanceComparison
      label: Wire Area (Circular Mils)

history_columns:
  - key: circuitAmps
    label: Amps (A)
    source: input
  - key: runDistanceFeet
    label: Distance (ft)
    source: input
  - key: recommendedAWG
    label: Wire Size
    source: output
  - key: voltageDropPercent
    label: Drop (%)
    source: output
  - key: voltageAtLoad
    label: Load Voltage
    source: output

js_file: assets/js/calculators/wire-gauge-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Wire Gauge Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate recommended AWG copper or aluminum wire size, circular mils, and voltage drop for single-phase and 3-phase AC circuits."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "AWG Conductor Sizing — calculates exact wire size for 120V, 208V, 240V, 277V, and 480V circuits"
    - "Voltage Drop Percentage Calculation — ensures compliance with NEC 3% branch / 5% total guidelines"
    - "Copper and Aluminum Support — accounts for K-factor resistivity differences (12.9 vs 21.2)"
    - "Single and Three Phase Formulas — uses exact formulas for 2-wire and 3-wire system dynamics"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Wire Gauge Calculator

howto:
  name: "How to Calculate Wire Gauge and Voltage Drop"
  description: "Select the correct AWG wire size to prevent excess voltage drop and dangerous overheating."
  step:
    - name: "Identify Circuit Amperage and Voltage"
      text: "Determine circuit load current in Amps (e.g., 20A) and nominal AC system voltage (e.g., 120V or 240V)."
    - name: "Measure One-Way Run Length"
      text: "Measure total one-way distance from the breaker panel to the electrical load or outlet box."
    - name: "Select Conductor Material"
      text: "Choose copper for standard residential wiring or aluminum for main feeders and large service runs."
    - name: "Set Voltage Drop Threshold"
      text: "Use 3% for branch circuits or 5% for total combined feeder and branch circuit runs per NEC guidelines."
    - name: "Review Calculated AWG Size"
      text: "Select the calculated recommended AWG size or higher to ensure safe operation."

faq:
  - question: "Why is wire gauge calculation important?"
    answer: "Choosing undersized wire causes resistance heating, voltage drops, dimming lights, motor overheating, and severe fire hazards inside wall cavities."
  - question: "What is the NEC maximum allowed voltage drop?"
    answer: "The National Electrical Code (NEC Informational Note 210.19) recommends limiting voltage drop to 3% for branch circuits and 5% for overall system runs (feeders + branch circuits)."
  - question: "How does distance affect required wire size?"
    answer: "As wire run length increases, total electrical resistance increases linearly. To keep voltage drop below 3%, you must increase wire cross-sectional diameter (upsize AWG gauge)."
  - question: "Can I use aluminum wire instead of copper?"
    answer: "Yes, aluminum is widely used for main service entrance lines and large subpanel feeders due to lower cost. However, aluminum has higher electrical resistance (K=21.2) than copper (K=12.9), requiring 1 to 2 gauge sizes larger."
  - question: "What wire gauge is needed for a 20 amp 120V circuit at 100 feet?"
    answer: "At 100 feet under a 20A load at 120V, a standard 12 AWG copper wire produces a 3.3% voltage drop (3.96V drop). To remain under 3.0% voltage drop, you should upsize to 10 AWG copper wire."
  - question: "What is the difference between single-phase and three-phase voltage drop formulas?"
    answer: "Single-phase circuits require current to travel out and back on two conductors (2 x L). Three-phase balanced circuits share current across three phase legs, using a multiplier of sqrt(3) ≈ 1.732 instead of 2."
  - question: "Is my personal data stored when using this calculator?"
    answer: "No. All calculations run strictly in your local web browser. No data is sent to external servers."

---

# Wire Gauge Calculator

Determine the correct **American Wire Gauge (AWG)** conductor size for copper or aluminum electrical runs using our **Wire Gauge Calculator**. Prevent excessive voltage drop, dangerous circuit overheating, and equipment malfunction on long wire runs.

<!-- more -->

## Why Use a Wire Gauge Calculator?

Running electrical wire over long distances creates electrical resistance ($R$). Under heavy current loads, resistance reduces terminal voltage at appliances and creates heat inside conduit. The National Electrical Code (NEC) recommends limiting voltage drop to **3% on branch circuits** and **5% total** across feeder and branch circuits.

- **Conductor Ampacity Safety**: Ensures wire diameter can safely carry maximum continuous current without insulation degradation.
- **Voltage Drop Minimization**: Upsizes wire gauge automatically when distance causes terminal voltage drop to exceed target limits.
- **Copper vs Aluminum K-Factor**: Accounts for material resistivity ($K \approx 12.9$ for copper, $K \approx 21.2$ for aluminum).
- **Single Phase vs 3-Phase Equations**: Uses correct multiplier constants ($2 \times$ for single-phase, $\sqrt{3} \approx 1.732$ for three-phase).

---

## Wire Sizing & Voltage Drop Formulas

The circular mil ($CM$) area required to limit voltage drop is calculated using the standard National Electrical Code resistance equations:

### Single-Phase 2-Wire Circuits:
$$CM = \frac{2 \times K \times I \times L}{V_{drop}}$$

### Three-Phase 3-Wire Circuits:
$$CM = \frac{\sqrt{3} \times K \times I \times L}{V_{drop}}$$

Where:
- $K$ = Specific conductor resistivity ($12.9\ \Omega\cdot\text{cmil/ft}$ for copper; $21.2\ \Omega\cdot\text{cmil/ft}$ for aluminum).
- $I$ = Load current in Amperes ($\text{A}$).
- $L$ = One-way circuit length in feet ($\text{ft}$).
- $V_{drop}$ = Maximum allowable voltage drop in Volts ($V_{system} \times \frac{\%drop}{100}$).
- $CM$ = Required cross-sectional conductor area in Circular Mils.

---

## Standard AWG Wire Size Reference Table

| AWG / Kcmil Size | Circular Mils (CM) | Max Ampacity (Copper 75°C) | Max Ampacity (Aluminum 75°C) | Typical Application |
| :--- | :--- | :--- | :--- | :--- |
| **14 AWG** | 4,110 CM | 15 A | N/A | 15A Residential Lighting & Receptacles |
| **12 AWG** | 6,530 CM | 20 A | 15 A | 20A Kitchen & Bathroom Outlets |
| **10 AWG** | 10,380 CM | 30 A | 25 A | Water Heaters, Clothes Dryers, AC Units |
| **8 AWG** | 16,510 CM | 50 A | 40 A | Electric Ranges, Subpanels |
| **6 AWG** | 26,240 CM | 65 A | 50 A | Heavy RV Outlets, 50A Subpanels |
| **4 AWG** | 41,740 CM | 85 A | 65 A | 100A Feeder Circuits |
| **2 AWG** | 66,360 CM | 115 A | 90 A | 100A Service Entrances |
| **1/0 AWG** | 105,600 CM | 150 A | 120 A | 125A–150A Main Feeders |
| **2/0 AWG** | 133,100 CM | 175 A | 135 A | 150A–175A Main Feeders |
| **4/0 AWG** | 211,600 CM | 230 A | 180 A | 200A Residential Main Service |

---

## Step-by-Step Guide: Sizing Electrical Wire

1. **Find Current Load ($I$)**: Locate the nameplate amperage of your appliance or continuous branch circuit amp rating (e.g., 20 Amps).
2. **Determine AC System Voltage ($V$)**: Select 120V for standard wall outlets or 240V for heavy duty double-pole equipment.
3. **Measure Wire Length ($L$)**: Measure total single-direction length of conduit or NM-B cable from breaker to load.
4. **Choose Material & Drop Limit**: Select copper or aluminum. Set target voltage drop percentage (default 3%).
5. **Check Recommended AWG Output**: Verify calculated wire size matches or exceeds standard breaker ampacity requirements.

---

## Frequently Asked Questions

### Why is wire gauge calculation important?
Choosing undersized wire causes resistance heating, voltage drops, dimming lights, motor overheating, and severe fire hazards inside wall cavities.

### What is the NEC maximum allowed voltage drop?
The National Electrical Code (NEC Informational Note 210.19) recommends limiting voltage drop to 3% for branch circuits and 5% for overall system runs (feeders + branch circuits).

### How does distance affect required wire size?
As wire run length increases, total electrical resistance increases linearly. To keep voltage drop below 3%, you must increase wire cross-sectional diameter (upsize AWG gauge).

### Can I use aluminum wire instead of copper?
Yes, aluminum is widely used for main service entrance lines and large subpanel feeders due to lower cost. However, aluminum has higher electrical resistance ($K=21.2$) than copper ($K=12.9$), requiring 1 to 2 gauge sizes larger.

### What wire gauge is needed for a 20 amp 120V circuit at 100 feet?
At 100 feet under a 20A load at 120V, a standard 12 AWG copper wire produces a 3.3% voltage drop (3.96V drop). To remain under 3.0% voltage drop, you should upsize to 10 AWG copper wire.

### What is the difference between single-phase and three-phase voltage drop formulas?
Single-phase circuits require current to travel out and back on two conductors ($2 \times L$). Three-phase balanced circuits share current across three phase legs, using a multiplier of $\sqrt{3} \approx 1.732$ instead of 2.

### Is my personal data stored when using this calculator?
No. All calculations run strictly in your local web browser. No data is sent to external servers.
