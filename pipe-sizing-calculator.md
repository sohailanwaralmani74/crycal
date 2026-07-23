---
layout: tool
title: Pipe Sizing Calculator – PEX & Copper Water Supply Diameter (WSFU & GPM)
description: Calculate required PEX, copper, or CPVC water supply pipe diameter (1/2", 3/4", 1") based on Fixture Units (WSFU), peak GPM flow, and max velocity limits.
permalink: /pipe-sizing-calculator
tool_id: pipe-sizing-calculator
category: plumbing
hide_sidebar: true

inputs:
  - id: fixtureUnits
    label: Total Water Supply Fixture Units (WSFU)
    type: number
    default: 18
    step: 1
    min: 1
    placeholder: "e.g., 18"

  - id: pipeMaterial
    label: Piping Material Type
    type: select
    default: "pex"
    options:
      - label: "PEX Tubing (ASTM F876/F877)"
        value: "pex"
      - label: "Type L Copper Pipe (ASTM B88)"
        value: "copper"
      - label: "CPVC Plastic Pipe (ASTM D2846)"
        value: "cpvc"

  - id: maxAllowedVelocity
    label: Maximum Design Water Velocity (Feet per Sec - FPS)
    type: number
    default: 8.0
    step: 0.5
    min: 4.0
    max: 10.0
    placeholder: "e.g., 8.0"

  - id: systemType
    label: Plumbing Fixture System Type
    type: select
    default: "flush_tank"
    options:
      - label: "Predominantly Flush Tanks (Standard Residential)"
        value: "flush_tank"
      - label: "Predominantly Flushometer Valves (Commercial)"
        value: "flush_valve"

outputs:
  - id: calculatedFlowGPM
    label: Estimated Peak Flow Rate (GPM)
  - id: recommendedPipeSize
    label: Recommended Nominal Pipe Size
  - id: actualVelocityFPS
    label: Actual Fluid Velocity
  - id: velocityCompliance
    label: Flow Velocity Compliance Status

charts:
  tabs:
    - id: flowVsVelocity
      label: GPM Flow vs Pipe Diameter Velocity
    - id: wsfuToGpmCurve
      label: Hunter's WSFU to GPM Curve

history_columns:
  - key: fixtureUnits
    label: WSFU
    source: input
  - key: calculatedFlowGPM
    label: Flow (GPM)
    source: output
  - key: recommendedPipeSize
    label: Pipe Size
    source: output
  - key: actualVelocityFPS
    label: Velocity (FPS)
    source: output

js_file: assets/js/calculators/pipe-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Pipe Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate recommended PEX, Copper, and CPVC water pipe diameter in inches based on WSFU fixture counts, GPM peak demand, and fluid velocity limits under UPC/IPC."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Hunter Curve WSFU Conversion — converts plumbing fixture units to peak gallons per minute (GPM)"
    - "Material Diameter Specifics — accounts for internal diameter differences between PEX, Copper L, and CPVC"
    - "Velocity Erosion Prevention — keeps flow speeds below 8 FPS (copper) or 10 FPS (PEX) to prevent pinhole leaks"
    - "Commercial vs Residential Sizing — supports flush tank and commercial flushometer valve calculations"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Pipe Sizing Calculator

howto:
  name: "How to Size Water Supply Pipes"
  description: "Determine proper PEX or copper pipe diameter for main water lines and branch supply runs."
  step:
    - name: "Count Plumbing Fixture Units (WSFU)"
      text: "Assign WSFU values to all connected sinks, toilets, showers, washing machines, and hose bibbs."
    - name: "Convert WSFU to Peak GPM"
      text: "Convert total WSFU to peak demand flow rate in Gallons Per Minute using Hunter's Curve."
    - name: "Select Pipe Material"
      text: "Choose between PEX tubing, Type L copper, or CPVC piping."
    - name: "Set Velocity Limit"
      text: "Maintain water velocity between 5 FPS and 8 FPS to prevent water hammer and copper wall erosion."
    - name: "Select Recommended Pipe Size"
      text: "Choose the smallest standard nominal pipe diameter (1/2\", 3/4\", 1\", 1-1/4\") that satisfies velocity limits."

faq:
  - question: "What is a Water Supply Fixture Unit (WSFU)?"
  - question: "Why is water velocity limited to 8 FPS in copper pipes?"
  - question: "What size water pipe is needed for a whole house?"
  - question: "How does PEX inner diameter compare to copper pipe?"
  - question: "What is Hunter's Curve in plumbing design?"
  - question: "Can I run a 1/2 inch PEX branch line to a bathroom?"
  - question: "Is my personal data saved when using this calculator?"

---

# Pipe Sizing Calculator – PEX & Copper Water Supply Diameter (WSFU & GPM)

Calculate the required **PEX, copper, or CPVC water pipe diameter** for main service lines and branch runs using our **Pipe Sizing Calculator**. Compliant with **Uniform Plumbing Code (UPC)** and **International Plumbing Code (IPC)** standards, this tool converts **Water Supply Fixture Units (WSFU)** to peak **GPM flow rates**.

<!-- more -->

## Why Use a Pipe Sizing Calculator?

Undersized water supply lines cause severe water pressure drop when multiple fixtures are used simultaneously (e.g., someone taking a shower when the dishwasher runs). 

Conversely, over-sizing pipes increases material installation costs and causes hot water run times to double. Furthermore, excessive water velocity ($V > 8\text{ FPS}$) inside copper lines causes noisy water hammer and premature pinhole pipe wall erosion.

- **UPC / IPC Code Compliance**: Converts fixture unit counts into peak flow rates using established plumbing engineering tables.
- **Material-Specific Internal Diameters**: Adjusts calculations for internal friction variations between PEX, Type L Copper, and CPVC.
- **Erosion & Water Hammer Protection**: Verifies that fluid velocity stays below recommended 8 FPS limit for cold water (5 FPS for hot water).
- **Supports Main & Branch Sizing**: Sizes main 3/4" or 1" trunk lines and individual 1/2" fixture branches.

---

## Water Pipe Sizing Formulas

### 1. Water Velocity Equation:
$$V = \frac{0.408 \times Q}{d^2}$$

### 2. Required Internal Pipe Diameter ($d$):
$$d = \sqrt{\frac{0.408 \times Q}{V_{\text{max}}}}$$

Where:
- $Q$ = Peak water flow rate in Gallons Per Minute ($\text{GPM}$).
- $V$ = Fluid velocity in Feet Per Second ($\text{FPS}$).
- $d$ = Internal pipe diameter in inches ($\text{in}$).
- $0.408$ = Dimensional unit conversion constant.

---

## Standard Plumbing Fixture Unit (WSFU) Table

| Plumbing Fixture | WSFU (Private Residential) | Min Branch Pipe Size | Standard GPM Flow |
| :--- | :--- | :--- | :--- |
| **Bathroom Sink Faucet** | 1.0 WSFU | 1/2 Inch | 1.5–2.2 GPM |
| **Showerhead (Single)** | 1.5 WSFU | 1/2 Inch | 2.0–2.5 GPM |
| **Flush Tank Toilet** | 2.5 WSFU | 1/2 Inch | 1.6–3.0 GPM |
| **Bathtub Fixture** | 2.0 WSFU | 1/2 Inch | 4.0–6.0 GPM |
| **Kitchen Sink Faucet** | 1.5 WSFU | 1/2 Inch | 1.8–2.2 GPM |
| **Clothes Washing Machine** | 1.4 WSFU | 1/2 Inch | 3.0–5.0 GPM |
| **Outdoor Hose Bibb** | 2.5 WSFU | 1/2 Inch or 3/4 Inch | 5.0–8.0 GPM |

---

## Step-by-Step Guide to Sizing Water Pipes

1. **Calculate Total WSFU**: Add up fixture unit values for all appliances fed downstream by the pipe segment.
2. **Convert to Demand GPM**: Review calculated peak flow rate derived from Hunter's demand curve.
3. **Select Pipe Material**: Choose PEX tubing, Type L copper, or schedule CPVC.
4. **Set Velocity Threshold**: Maintain $\le 8\text{ FPS}$ for cold water or $\le 5\text{ FPS}$ for circulating hot water lines.
5. **Select Nominal Diameter**: Choose 1/2", 3/4", 1", or 1-1/4" pipe that keeps velocity safely within limits.

---

## Frequently Asked Questions

### What is a Water Supply Fixture Unit (WSFU)?
A Water Supply Fixture Unit (WSFU) is a design index number assigned to plumbing fixtures that represents their relative water consumption and peak simultaneous usage probability.

### Why is water velocity limited to 8 FPS in copper pipes?
Water moving through copper pipes at velocities above 8 Feet Per Second (FPS) creates turbulent scouring action that erodes the protective internal oxide film, leading to pinhole leaks and pipe failure.

### What size water pipe is needed for a whole house?
Most modern single-family residences with 2.5 bathrooms (15 to 25 WSFU) require a **3/4-inch or 1-inch main water supply line** from the water meter, branching off into 1/2-inch lines to individual fixtures.

### How does PEX inner diameter compare to copper pipe?
PEX tubing has thicker pipe walls than Type L copper. Consequently, 3/4" PEX has an inner diameter of approx 0.671 inches compared to 0.745 inches for 3/4" copper. This means PEX has slightly higher friction loss for the same nominal trade size.

### What is Hunter's Curve in plumbing design?
Developed by Dr. Roy B. Hunter at the National Bureau of Standards, Hunter's Curve is the empirical probability curve used by US plumbing codes to convert total fixture units (WSFU) into realistic peak simultaneous GPM flow demand.

### Can I run a 1/2 inch PEX branch line to a bathroom?
A 1/2-inch PEX branch line can supply up to two fixtures (e.g., a sink and a toilet) simultaneously. However, if feeding a full bathroom (sink, toilet, and shower), a 3/4-inch trunk line feeding 1/2-inch branches is recommended to prevent pressure drops.

### Is my personal data saved when using this calculator?
No. All calculations take place strictly inside your web browser. No fixture or piping data is collected or saved.
