---
layout: tool
title: "Generator Sizing | Interactive Online Tool"
description: "Calculate required home standby or portable generator wattage capacity in running watts and starting surge watts for essential household circuits."
permalink: /generator-sizing-calculator
tool_id: generator-sizing-calculator
category: electrical
hide_sidebar: true

inputs:
  - id: refrigeratorCount
    label: Refrigerators & Stand-up Freezers (Count)
    type: number
    default: 1
    step: 1
    min: 0
    placeholder: "e.g., 1"

  - id: sumpPumpHorsepower
    label: Sump Pump Motor Rating
    type: select
    default: "0.5"
    options:
      - label: "None (0 HP)"
        value: "0"
      - label: "1/3 HP Sump Pump (800W run / 1600W surge)"
        value: "0.33"
      - label: "1/2 HP Sump Pump (1050W run / 2150W surge)"
        value: "0.5"
      - label: "1 HP Heavy Duty Pump (1500W run / 3000W surge)"
        value: "1.0"

  - id: wellPumpHorsepower
    label: Submersible Well Water Pump
    type: select
    default: "0"
    options:
      - label: "None / City Water (0 HP)"
        value: "0"
      - label: "1/2 HP Well Pump (1000W run / 2100W surge)"
        value: "0.5"
      - label: "1 HP Well Pump (1500W run / 3000W surge)"
        value: "1.0"
      - label: "1.5 HP High Capacity Well Pump (2100W run / 4000W surge)"
        value: "1.5"

  - id: centralAirTons
    label: Central Air Conditioning Unit Size
    type: select
    default: "0"
    options:
      - label: "None / Window AC Units (0 Tons)"
        value: "0"
      - label: "2.5 Ton AC Unit (3500W run / 9500W surge)"
        value: "2.5"
      - label: "3.5 Ton AC Unit (5000W run / 13500W surge)"
        value: "3.5"
      - label: "5.0 Ton AC Unit (7000W run / 18000W surge)"
        value: "5.0"

  - id: heatingAppliance
    label: Primary Heating System
    type: select
    default: "gas_furnace"
    options:
      - label: "Gas Furnace Blower Fan (800W run / 2000W surge)"
        value: "gas_furnace"
      - label: "Electric Heat Strip 5kW (5000W run / 5000W surge)"
        value: "electric_5k"
      - label: "Electric Heat Strip 10kW (10000W run / 10000W surge)"
        value: "electric_10k"
      - label: "None / Wood Stove"
        value: "none"

  - id: lightingElectronicsWatts
    label: Lighting, TV, Microwave, Routers & Laptops (Watts)
    type: number
    default: 2000
    step: 250
    min: 250
    placeholder: "e.g., 2000"

  - id: waterHeaterWatts
    label: Electric Water Heater (Watts)
    type: number
    default: 0
    step: 500
    min: 0
    placeholder: "e.g., 0"

  - id: safetyMarginPercent
    label: Safety Capacity Buffer Margin (%)
    type: number
    default: 20
    step: 5
    min: 10
    max: 30
    placeholder: "e.g., 20"

outputs:
  - id: totalRunningWatts
    label: Total Running Wattage Demand
  - id: totalSurgeWatts
    label: Peak Starting Surge Wattage
  - id: recommendedGenSizeKW
    label: Recommended Generator Size (kW)
  - id: recommendedTransferSwitchAmps
    label: Recommended Transfer Switch Amps

charts:
  tabs:
    - id: applianceWattageBreakdown
      label: Appliance Running vs Surge Watts
    - id: generatorCapacityBuffer
      label: Continuous Load vs Generator Capacity

history_columns:
  - key: totalRunningWatts
    label: Running (W)
    source: output
  - key: totalSurgeWatts
    label: Surge (W)
    source: output
  - key: recommendedGenSizeKW
    label: Rec. Generator
    source: output
  - key: recommendedTransferSwitchAmps
    label: Transfer Switch
    source: output

js_file: assets/js/calculators/generator-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Generator Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate home portable and standby generator sizing requirements in running and starting surge watts for emergency backup power."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Running vs Starting Surge Wattage Calculation — accounts for motor inrush currents from pumps and AC units"
    - "Whole House & Essential Circuit Backup — sizes portable (5kW–12kW) and standby generators (18kW–26kW)"
    - "Safety Headroom Buffer — includes configurable 20% safety margin to prevent generator stalling"
    - "Transfer Switch Amperage Sizing — calculates 30A, 50A, 100A, or 200A automatic transfer switch requirements"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Generator Sizing Calculator

howto:
  name: "How to Size a Home Generator"
  description: "Determine exact wattage requirements for portable generators and whole-home standby backup units."
  step:
    - name: "List Essential Backup Appliances"
      text: "Select critical equipment including refrigerators, sump pumps, well pumps, heating, and lighting."
    - name: "Differentiate Running vs Starting Watts"
      text: "Identify continuous running power requirements and peak motor starting inrush wattage."
    - name: "Calculate Peak Surge Load"
      text: "Add total running wattage to the largest single motor starting surge wattage differential."
    - name: "Apply Safety Buffer"
      text: "Add a 20% safety reserve margin to ensure the generator engine operates below maximum capacity."
    - name: "Select Generator & Transfer Switch"
      text: "Choose a rated portable or standby generator kW size and compatible manual or automatic transfer switch."

faq:
  - question: "What is the difference between running watts and starting surge watts?"
  - question: "Why do electric motors require starting surge wattage?"
  - question: "What size generator is needed to run a 3.5 ton central air conditioner?"
  - question: "Can a 7,500 watt portable generator power a whole house?"
  - question: "When should I choose a standby generator over a portable generator?"
  - question: "What size transfer switch do I need for my generator?"
  - question: "Is my personal data saved when using this calculator?"

---

# Generator Sizing Calculator

Determine the **exact generator size (kW)** required to power your home during power outages with our **Generator Sizing Calculator**. Calculate continuous **running watts** and peak **starting surge watts** for essential household appliances, HVAC units, and water pumps.

<!-- more -->

## Why Use a Generator Sizing Calculator?

Under-sizing a backup generator causes engine stalling, tripped generator circuit breakers, and dangerous voltage sags that burn out sensitive electronics and AC compressor motors. 

Electric motors in refrigerators, sump pumps, well pumps, and air conditioners require **2 to 4 times more wattage to start** than to remain running. A generator must handle peak starting surge spikes without collapsing system voltage.

- **Motor Inrush Surge Protection**: Calculates heavy inductive motor startup spikes separately from continuous running loads.
- **Standby vs Portable Generator Sizing**: Recommends appropriate size ranges for portable inverter units (3.5kW–12kW) or whole-house standby units (18kW–26kW).
- **Prevents Engine Stalling**: Applies an industry-standard 20% safety reserve buffer to prevent generator overload.
- **Transfer Switch Guidance**: Matches generator output amperage to 30A, 50A, 100A, or 200A transfer switches.

---

## Generator Sizing Formulas

### 1. Total Running Wattage:
$$W_{\text{running}} = \sum (\text{Appliance Continuous Running Watts})$$

### 2. Peak Starting Surge Wattage:
$$W_{\text{surge}} = W_{\text{running}} + \max\left( W_{\text{start, i}} - W_{\text{run, i}} \right)$$

### 3. Recommended Generator Capacity (with Buffer):
$$W_{\text{generator}} = W_{\text{surge}} \times \left(1 + \frac{\text{Safety Margin \%}}{100}\right)$$

$$\text{Generator Capacity (kW)} = \frac{W_{\text{generator}}}{1,000}$$

Where:
- $W_{\text{running}}$ = Total continuous electric power demand in Watts.
- $W_{\text{surge}}$ = Peak surge power required when the largest electric motor starts up.
- $\text{Safety Margin}$ = Configurable buffer reserve (typically 20%).

---

## Appliance Wattage Reference Guide

| Appliance / Motor Load | Typical Running Watts | Starting Surge Watts | Recommended Circuit |
| :--- | :--- | :--- | :--- |
| **Refrigerator / Freezer** | 700 W | 2,200 W | 120V / 15A |
| **1/2 HP Sump Pump** | 1,050 W | 2,150 W | 120V / 15A |
| **1 HP Well Water Pump** | 1,500 W | 3,000 W | 240V / 20A |
| **Gas Furnace Blower Fan** | 800 W | 2,000 W | 120V / 15A |
| **3.5 Ton Central AC Unit** | 5,000 W | 13,500 W | 240V / 40A |
| **Electric Water Heater** | 4,500 W | 4,500 W (Resistive) | 240V / 30A |
| **Microwave Oven** | 1,200 W | 1,200 W | 120V / 20A |
| **LED Lights & TV/Internet** | 500 W | 500 W | 120V / 15A |

---

## Step-by-Step Guide: Sizing Emergency Backup Generators

1. **Select Refrigerator & Freezer Count**: Enter number of refrigeration units requiring continuous cooling during blackouts.
2. **Select Water & Sump Pumps**: Pick motor horsepower rating for well water pumps and basement sump pumps.
3. **Select HVAC Air Conditioning**: Choose your central AC unit size in tons (e.g., 3.5 Tons).
4. **Enter General Convenience Power**: Include wattage for lighting, Wi-Fi routers, televisions, and laptop chargers.
5. **Review Generator kW Rating**: Select a portable (e.g., 7.5kW / 9.5kW surge) or home standby (18kW–24kW) generator rating.

---

## Frequently Asked Questions

### What is the difference between running watts and starting surge watts?
Running (continuous) watts is the electrical power required to keep an appliance operating. Starting (surge) watts is the brief 2 to 3 second power spike required by electric motor rotors to break static friction and get spinning.

### Why do electric motors require starting surge wattage?
When an electric motor stops, its magnetic rotor field collapses. Upon starting, the stationary motor acts almost as a direct short circuit for a fraction of a second, drawing up to 300% to 500% of its normal operating current (inrush current).

### What size generator is needed to run a 3.5 ton central air conditioner?
A 3.5 ton central AC requires approx 5,000 running watts and up to 13,500 starting surge watts. Combined with household refrigerators and lights, you need a minimum **14kW to 18kW standby generator** (or install a Soft Start kit on the compressor to reduce surge by 60–70%).

### Can a 7,500 watt portable generator power a whole house?
A 7,500W running / 9,500W surge portable generator can easily run essential household circuits (refrigerator, sump pump, gas furnace, lights, TV, and microwave), but cannot run large electric water heaters or 4-ton central AC systems simultaneously.

### When should I choose a standby generator over a portable generator?
Choose a standby generator (Generac, Kohler, Briggs & Stratton 14kW–26kW) if you want automatic hands-free startup within 10 seconds of a blackout, direct utility gas hookup (no gasoline refueling), and full whole-house AC cooling.

### What size transfer switch do I need for my generator?
For portable generators (5kW–12kW), a 30A or 50A manual transfer switch with a 4-prong NEMA L14-30 or CS6365 inlet box is standard. Whole-house standby generators utilize a 100A or 200A automatic transfer switch (ATS).

### Is my personal data saved when using this calculator?
No. All calculations take place entirely within your local browser session. No appliance data is transmitted or saved.
