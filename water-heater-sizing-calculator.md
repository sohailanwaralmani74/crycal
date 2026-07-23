---
layout: tool
title: Water Heater Sizing Calculator – Tank Gallons & Tankless GPM Flow Rate
description: Calculate required tank water heater capacity (FHR gallons) or tankless water heater GPM flow rate and BTU input based on peak hour hot water demand.
permalink: /water-heater-sizing-calculator
tool_id: water-heater-sizing-calculator
category: plumbing
hide_sidebar: true

inputs:
  - id: heaterType
    label: Water Heater Technology Type
    type: select
    default: "tankless"
    options:
      - label: "Tankless On-Demand Water Heater (GPM Sizing)"
        value: "tankless"
      - label: "Storage Tank Water Heater (Gallons & FHR Sizing)"
        value: "tank"

  - id: occupantsCount
    label: Household Occupants Count
    type: number
    default: 4
    step: 1
    min: 1
    placeholder: "e.g., 4"

  - id: peakHourShowers
    label: Simultaneous / Peak Hour Showers
    type: number
    default: 2
    step: 1
    min: 1
    placeholder: "e.g., 2"

  - id: incomingWaterTemp
    label: Incoming Groundwater Temperature (°F)
    type: number
    default: 50
    step: 5
    min: 35
    max: 75
    placeholder: "e.g., 50"

  - id: targetWaterTemp
    label: Target Hot Water Outlet Temp (°F)
    type: number
    default: 120
    step: 5
    min: 105
    max: 140
    placeholder: "e.g., 120"

  - id: fuelType
    label: Fuel / Energy Source
    type: select
    default: "gas"
    options:
      - label: "Natural Gas / Propane"
        value: "gas"
      - label: "Electricity (Electric Resistance / Heat Pump)"
        value: "electric"

outputs:
  - id: peakHourGallonsFHR
    label: Peak Hour Demand / First Hour Rating (FHR)
  - id: recommendedTankGallons
    label: Recommended Tank Capacity / Unit Rating
  - id: peakTanklessFlowGPM
    label: Required Peak Tankless Flow Rate (GPM)
  - id: temperatureRiseDeltaT
    label: Required Temperature Rise (ΔT)

charts:
  tabs:
    - id: flowVsDeltaT
      label: GPM Flow vs Groundwater Delta T
    - id: hotWaterUsageBreakdown
      label: Peak Hour Hot Water Consumption

history_columns:
  - key: occupantsCount
    label: Occupants
    source: input
  - key: peakHourGallonsFHR
    label: FHR (Gal)
    source: output
  - key: peakTanklessFlowGPM
    label: Flow (GPM)
    source: output
  - key: temperatureRiseDeltaT
    label: ΔT (°F)
    source: output

js_file: assets/js/calculators/water-heater-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Water Heater Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate storage tank water heater size in gallons (First Hour Rating FHR) or tankless water heater GPM flow rate and BTU requirements."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "First Hour Rating (FHR) Calculation — sizes 40, 50, and 75-gallon tank water heaters"
    - "Tankless GPM Flow Sizing — calculates simultaneous fixture GPM and required temperature rise (ΔT)"
    - "Groundwater Temperature Impact — accounts for cold northern groundwater vs warm southern groundwater"
    - "BTU & kW Energy Requirement Sizing — determines exact thermal heat input needed for gas or electric units"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Water Heater Sizing Calculator

howto:
  name: "How to Size a Water Heater"
  description: "Determine whether to install a 40/50 gallon tank or tankless unit based on peak hour water demand."
  step:
    - name: "Count Household Members"
      text: "Input total number of residents living in the home."
    - name: "Identify Peak Hour Fixtures"
      text: "Determine maximum simultaneous showers, laundry loads, and dishwashers running during peak morning/evening hours."
    - name: "Enter Groundwater Temperature"
      text: "Input local incoming tap water temperature (approx 40°F–50°F in northern states, 60°F–70°F in southern states)."
    - name: "Set Target Temperature"
      text: "Select desired hot water delivery temperature (standard setting is 120°F)."
    - name: "Review FHR or GPM Output"
      text: "Select a storage tank with matching First Hour Rating (FHR) or a tankless heater with sufficient GPM at your target ΔT."

faq:
  - question: "What is First Hour Rating (FHR) for tank water heaters?"
  - question: "How do I size a tankless water heater?"
  - question: "What is temperature rise (Delta T) in water heater sizing?"
  - question: "What size water heater do I need for a family of 4?"
  - question: "Why does incoming groundwater temperature affect tankless water heater capacity?"
  - question: "Is a gas tankless water heater better than an electric tankless?"
  - question: "Is my personal data saved when using this calculator?"

---

# Water Heater Sizing Calculator – Tank Gallons & Tankless GPM Flow Rate

Determine the exact water heater capacity for your home using our **Water Heater Sizing Calculator**. Calculate **First Hour Rating (FHR) in gallons** for storage tank units or **peak flow rate (GPM)** and **temperature rise ($\Delta T$)** for on-demand tankless water heaters.

<!-- more -->

## Why Use a Water Heater Sizing Calculator?

Installing an undersized water heater leaves your family taking cold showers every morning. Conversely, over-sizing a storage tank water heater leads to continuous standby heat loss and inflated monthly utility bills.

For **tankless water heaters**, sizing depends heavily on **incoming groundwater temperature**. In northern winter climates, cold $40^\circ\text{F}$ water requires a massive $80^\circ\text{F}$ temperature rise to reach $120^\circ\text{F}$, cutting a tankless unit's maximum GPM delivery rate in half compared to warm southern climates.

- **Storage Tank FHR Sizing**: Calculates peak hour hot water demand in gallons for 30, 40, 50, and 80-gallon tanks.
- **Tankless GPM Flow Sizing**: Computes simultaneous fixture flow rates (showers, sinks, washing machines).
- **Groundwater Temperature ($\Delta T$) Correction**: Adjusts thermal BTU output for regional groundwater sags.
- **Gas vs Electric Energy Matching**: Computes required BTU/hr input for gas or kW rating for electric heaters.

---

## Water Heater Sizing Formulas

### 1. Temperature Rise ($\Delta T$):
$$\Delta T = T_{\text{target}} - T_{\text{incoming}}$$

### 2. Tank First Hour Rating (FHR Demand):
$$\text{FHR (Gallons)} = (\text{Showers} \times 16) + (\text{Occupants} \times 3) + 15\ (\text{Laundry}) + 6\ (\text{Dishwasher})$$

### 3. Tankless BTU Heating Requirement:
$$\text{BTU/hr} = \frac{\text{GPM} \times \Delta T \times 8.33 \times 60}{\text{Thermal Efficiency}}$$

$$\text{Gas BTU/hr} \approx \text{GPM} \times \Delta T \times 500$$
$$\text{Electric kW} \approx \frac{\text{GPM} \times \Delta T}{6.83}$$

Where:
- $\text{GPM}$ = Simultaneous hot water flow rate in Gallons Per Minute.
- $\Delta T$ = Temperature rise in degrees Fahrenheit ($^\circ\text{F}$).
- $8.33$ = Weight of 1 gallon of water in pounds.
- $6.83$ = Conversion constant for kilowatts ($1\ \text{kW} = 3,412\ \text{BTU/hr}$).

---

## Hot Water Demand Reference Guide

| Appliance / Activity | Average Hot Water Flow Rate | Average Volume per Use |
| :--- | :--- | :--- |
| **Standard Showerhead** | 2.0 GPM | 16 Gallons (8-minute shower) |
| **Low-Flow Showerhead** | 1.5 GPM | 12 Gallons (8-minute shower) |
| **Bathroom Sink Faucet** | 1.0 GPM | 1.5 Gallons |
| **Kitchen Sink Faucet** | 1.5 GPM | 3 Gallons |
| **Clothes Washing Machine** | 2.0 GPM | 15 Gallons per load |
| **Automatic Dishwasher** | 1.5 GPM | 6 Gallons per load |

---

## Step-by-Step Guide: Sizing Water Heaters

1. **Choose System Type**: Select storage tank or on-demand tankless water heating technology.
2. **Enter Household Occupants**: Input the number of people living in the home.
3. **Set Peak Shower Count**: Specify how many showers run simultaneously during morning peak hours.
4. **Input Water Temperatures**: Enter local groundwater temperature (default $50^\circ\text{F}$) and desired output ($120^\circ\text{F}$).
5. **Review Output Capacity**: Select a tank water heater with an equivalent FHR rating or a tankless unit capable of delivering required GPM at target $\Delta T$.

---

## Frequently Asked Questions

### What is First Hour Rating (FHR) for tank water heaters?
First Hour Rating (FHR) is the standardized Yellow EnergyGuide metric representing the total number of gallons of hot water a storage tank heater can supply in one hour starting with a full tank of hot water.

### How do I size a tankless water heater?
Add up the flow rates (GPM) of all fixtures you plan to run at the exact same time, then calculate the temperature rise ($\Delta T = T_{\text{output}} - T_{\text{incoming}}$). Select a unit rated for that GPM flow at your calculated $\Delta T$.

### What is temperature rise (Delta T) in water heater sizing?
Temperature rise ($\Delta T$) is the temperature difference between incoming cold groundwater and desired hot tap water ($120^\circ\text{F}$). The larger the $\Delta T$, the more energy required, reducing the max GPM a tankless unit can produce.

### What size water heater do I need for a family of 4?
A typical family of 4 requires a **50-gallon gas tank** (FHR 65–75 gallons), a **66–80 gallon electric/heat pump tank** (FHR 60–70 gallons), or a **7.5 to 9.5 GPM gas tankless unit**.

### Why does incoming groundwater temperature affect tankless water heater capacity?
Tankless units heat water instantly as it passes through the heat exchanger. Heating $40^\circ\text{F}$ winter groundwater to $120^\circ\text{F}$ ($\Delta T = 80^\circ\text{F}$) takes double the heating energy of warming $60^\circ\text{F}$ groundwater ($\Delta T = 60^\circ\text{F}$).

### Is a gas tankless water heater better than an electric tankless?
Gas tankless units output 160,000 to 199,000 BTU/hr, easily supplying 7 to 10 GPM for whole homes. Electric tankless units require massive electrical panel upgrades (120A to 150A dedicated circuits) and are generally limited to warm climates or single-point-of-use fixtures.

### Is my personal data saved when using this calculator?
No. All calculations run strictly in your web browser. No usage or fixture data is saved.
