---
layout: tool
title: Circuit Breaker Sizing Calculator – Continuous vs Non-Continuous Load (NEC 80% Rule)
description: Calculate required circuit breaker amp rating (15A, 20A, 30A, 50A, etc.) and wire gauge based on continuous and non-continuous electrical loads.
permalink: /circuit-breaker-sizing-calculator
tool_id: circuit-breaker-sizing-calculator
category: electrical
hide_sidebar: true

inputs:
  - id: continuousLoadAmps
    label: Continuous Load Current (Amps - runs 3+ hours)
    type: number
    default: 12
    step: 0.5
    min: 0
    placeholder: "e.g., 12"

  - id: nonContinuousLoadAmps
    label: Non-Continuous Load Current (Amps - short duration)
    type: number
    default: 4
    step: 0.5
    min: 0
    placeholder: "e.g., 4"

  - id: circuitVoltage
    label: System AC Voltage (Volts)
    type: select
    default: "120"
    options:
      - label: "120V Single-Phase"
        value: "120"
      - label: "208V Commercial Single/3-Phase"
        value: "208"
      - label: "240V Heavy Appliance / EV"
        value: "240"
      - label: "277V Commercial Lighting"
        value: "277"
      - label: "480V Industrial"
        value: "480"

  - id: breakerSafetyRating
    label: Breaker Assembly Rating
    type: select
    default: "standard"
    options:
      - label: "Standard Thermal-Magnetic Breaker (80% Rated)"
        value: "standard"
      - label: "Special 100%-Rated Breaker Assembly"
        value: "hundred_percent"

outputs:
  - id: minCircuitAmpacity
    label: Minimum Circuit Ampacity (MCA)
  - id: recommendedBreakerSize
    label: Standard Recommended Breaker Size
  - id: maxContinuousLoadAllowed
    label: Maximum Safe Continuous Load Allowed
  - id: minimumWireGauge
    label: Required Minimum Copper Wire Size (AWG)

charts:
  tabs:
    - id: loadVsCapacity
      label: Circuit Load vs Breaker Rating
    - id: continuousRule
      label: Continuous 80% Rule Breakdown

history_columns:
  - key: continuousLoadAmps
    label: Cont. Amps
    source: input
  - key: minCircuitAmpacity
    label: MCA (A)
    source: output
  - key: recommendedBreakerSize
    label: Breaker Size
    source: output
  - key: minimumWireGauge
    label: Min Wire (AWG)
    source: output

js_file: assets/js/calculators/circuit-breaker-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Circuit Breaker Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate standard circuit breaker size in amps and AWG wire size for continuous and non-continuous electrical loads under NEC 210.20."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "NEC 80% Continuous Rule — applies 125% multiplier to continuous loads running 3 hours or longer"
    - "Minimum Circuit Ampacity (MCA) Calculation — computes exact minimum safety ampacity"
    - "Standard Commercial Breaker Selection — sizes 15A, 20A, 30A, 40A, 50A, 60A, and up to 200A breakers"
    - "Conductor Ampacity Matching — provides recommended copper wire gauge (AWG) for selected breaker size"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Circuit Breaker Sizing Calculator

howto:
  name: "How to Size a Circuit Breaker"
  description: "Determine the proper circuit breaker rating to prevent nuisance tripping and electrical fires."
  step:
    - name: "Identify Continuous Loads"
      text: "Determine load amperage for devices running 3 hours or longer (e.g., lighting, EV chargers, space heaters)."
    - name: "Identify Non-Continuous Loads"
      text: "Determine load amperage for short-duration loads (e.g., garbage disposals, microwaves)."
    - name: "Calculate Minimum Circuit Ampacity (MCA)"
      text: "Multiply continuous load by 1.25 and add 1.0 times non-continuous load."
    - name: "Select Standard Breaker Size"
      text: "Pick the next standard breaker size equal to or exceeding the calculated MCA."
    - name: "Match Conductor Wire Gauge"
      text: "Ensure wire ampacity equals or exceeds the selected breaker amp rating."

faq:
  - question: "What is the NEC 80% continuous load rule?"
  - question: "How do I calculate Minimum Circuit Ampacity (MCA)?"
  - question: "What size breaker do I need for a 12A continuous load?"
  - question: "What size breaker is needed for a Level 2 EV charger?"
  - question: "Can a circuit breaker be smaller than the wire gauge capacity?"
  - question: "What is the difference between a standard breaker and a 100%-rated breaker?"
  - question: "Is my personal data saved when using this calculator?"

---

# Circuit Breaker Sizing Calculator – Continuous vs Non-Continuous Load (NEC 80%)

Determine the correct **circuit breaker rating (Amps)** and **copper wire size (AWG)** for electrical circuits using our **Circuit Breaker Sizing Calculator**. Compliant with **NEC Article 210.20**, this tool applies the mandatory **125% multiplier for continuous loads**.

<!-- more -->

## Why Use a Circuit Breaker Sizing Calculator?

Standard thermal-magnetic circuit breakers are designed to operate at **80% of their maximum rated capacity** when supplying continuous loads (loads operating continuously for 3 hours or more). 

Plugging a 16-amp continuous load into a 15-amp or 20-amp circuit breaker without applying the **125% NEC rule** leads to nuisance breaker tripping, insulation melting, and elevated fire risks inside electrical distribution panels.

- **Prevents Nuisance Tripping**: Accounts for internal thermal heating during long operating cycles.
- **NEC 210.20 Standard Compliance**: Automatically applies the $125\% \text{ Continuous} + 100\% \text{ Non-Continuous}$ equation.
- **Matches Wire Gauge to Breaker**: Ensures conductor ampacity is equal to or greater than the overcurrent protection device (OCPD).
- **Supports Heavy 240V Loads**: Sizes breakers for water heaters (30A), EV chargers (40A/50A), electric furnaces, and motors.

---

## Circuit Breaker Sizing Formulas

Under **NEC Section 210.20(A)**, overcurrent protection devices (circuit breakers and fuses) must be sized according to the following formulas:

### Standard Breaker (80% Rated):
$$\text{MCA (Amps)} = (1.25 \times I_{\text{continuous}}) + (1.00 \times I_{\text{non-continuous}})$$

### 100%-Rated Breaker Assembly:
$$\text{MCA (Amps)} = I_{\text{continuous}} + I_{\text{non-continuous}}$$

Where:
- $I_{\text{continuous}}$ = Amperage of loads operating continuously for 3 hours or more.
- $I_{\text{non-continuous}}$ = Amperage of loads operating intermittently (less than 3 hours).
- $\text{MCA}$ = Minimum Circuit Ampacity required for breaker selection.

---

## Standard Breaker & Wire Gauge Lookup Table

| Circuit Breaker Amperage | Max Continuous Load (80% Rule) | Min Copper Wire Gauge (AWG 75°C) | Common Appliance Uses |
| :--- | :--- | :--- | :--- |
| **15 Amp** | 12.0 Amps | **14 AWG** | General Bedroom Outlets & Lighting |
| **20 Amp** | 16.0 Amps | **12 AWG** | Kitchen Countertops, Bathroom Receptacles |
| **25 Amp** | 20.0 Amps | **10 AWG** | Commercial Dishwashers, Heat Pumps |
| **30 Amp** | 24.0 Amps | **10 AWG** | Electric Water Heaters, Clothes Dryers |
| **40 Amp** | 32.0 Amps | **8 AWG** | Electric Cooktops, 32A EV Chargers |
| **50 Amp** | 40.0 Amps | **6 AWG** | Electric Ranges, 40A EV Chargers, Hot Tubs |
| **60 Amp** | 48.0 Amps | **6 AWG (THHN)** / **4 AWG** | 48A EV Chargers, Subpanel Feeders |
| **80 Amp** | 64.0 Amps | **3 AWG** | Large Tankless Water Heaters |
| **100 Amp** | 80.0 Amps | **1 AWG** / **2 AWG** | Residential Subpanel Main Feeders |

---

## Step-by-Step Guide to Sizing Breakers

1. **Categorize Electrical Loads**: Identify whether connected loads will run continuously for 3+ hours (e.g., lighting, EV charging, pool pumps) or non-continuously (e.g., disposals, hair dryers).
2. **Input Current Draw**: Enter total continuous and non-continuous amperage in the input fields.
3. **Select Breaker Type**: Keep as "Standard (80% Rated)" unless utilizing expensive listed 100%-rated commercial switchgear.
4. **Review Recommended Breaker**: Select the calculated standard breaker size from your panel manufacturer (e.g., Square D, Eaton, Siemens).
5. **Install Matching Wire**: Ensure copper wire gauge matches the breaker amp rating (e.g., 12 AWG copper for a 20A breaker).

---

## Frequently Asked Questions

### What is the NEC 80% continuous load rule?
The NEC requires standard thermal-magnetic breakers to carry no more than 80% of their amp rating when powering continuous loads (running 3 hours or longer). Conversely, continuous loads must be multiplied by 1.25 when sizing breakers.

### How do I calculate Minimum Circuit Ampacity (MCA)?
Multiply continuous load amps by 1.25, then add non-continuous load amps: $\text{MCA} = (1.25 \times \text{Cont. Amps}) + \text{Non-Cont. Amps}$. Select the next standard breaker size equal to or higher than MCA.

### What size breaker do I need for a 12A continuous load?
$12\text{A} \times 1.25 = 15\text{A}$. You need a minimum **15-amp circuit breaker** wired with 14 AWG copper conductor wire.

### What size breaker is needed for a Level 2 EV charger?
A 32A Level 2 EV charger is a continuous load ($32\text{A} \times 1.25 = 40\text{A}$ breaker with 8 AWG wire). A 48A EV charger requires $48\text{A} \times 1.25 = 60\text{A}$ breaker wired with 6 AWG THHN copper wire.

### Can a circuit breaker be smaller than the wire gauge capacity?
Yes. It is safe and legal under NEC codes to use larger wire (upsizing wire to limit voltage drop) on a smaller breaker (e.g., 10 AWG wire on a 20A breaker). However, wire gauge must **never** be smaller than the breaker rating.

### What is the difference between a standard breaker and a 100%-rated breaker?
Standard breakers trip thermally under prolonged 100% rated current. Special 100%-rated breakers feature electronic trip units and special enclosures rated to carry 100% full nameplate load continuously without a 125% multiplier.

### Is my personal data saved when using this calculator?
No. All calculations run strictly in your web browser. No data is stored or collected.
