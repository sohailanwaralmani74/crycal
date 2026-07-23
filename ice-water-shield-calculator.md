---
layout: tool
title: Ice & Water Shield Calculator – Eaves, Valleys & Roll Coverage
description: Calculate rolls of self-adhering ice & water shield membrane needed for roof eaves (24" past interior wall code), valleys, and low-slope roof sections.
permalink: /ice-water-shield-calculator
tool_id: ice-water-shield-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: eaveLengthFeet
    label: Total Eave Perimeter Length (Feet)
    type: number
    default: 120
    step: 5
    min: 10
    placeholder: "e.g., 120"

  - id: overhangWidthInches
    label: Eave Overhang Width (Inches from wall)
    type: number
    default: 18
    step: 1
    min: 0
    placeholder: "e.g., 18"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 5
    step: 0.5
    min: 1
    max: 24
    suffix: '/12'
    placeholder: "e.g., 5"

  - id: valleyLengthFeet
    label: Roof Valley Seam Length (Feet)
    type: number
    default: 36
    step: 2
    min: 0
    placeholder: "e.g., 36"

  - id: lowSlopeAreaSqFt
    label: Low-Slope Area (< 4:12 Pitch in Sq Ft)
    type: number
    default: 0
    step: 50
    min: 0
    placeholder: "e.g., 0"

  - id: rollWidthInches
    label: Membrane Roll Width (Inches)
    type: number
    default: 36
    step: 1
    min: 30
    max: 48
    suffix: 'in'
    placeholder: "e.g., 36"

  - id: rollLengthFeet
    label: Membrane Roll Length (Feet)
    type: number
    default: 65
    step: 5
    min: 33
    max: 100
    suffix: 'ft'
    placeholder: "e.g., 65"

outputs:
  - id: eaveMembraneWidthInches
    label: Required Eave Shield Width (Slope Inches to extend 24" inside wall)
  - id: eaveCoursesNeeded
    label: Eave Membrane Courses (Passes) Needed
  - id: totalShieldSqFt
    label: Total Membrane Coverage Needed (Net & Gross Sq Ft)
  - id: rollsNeeded
    label: Ice & Water Shield Rolls to Purchase

charts:
  tabs:
    - id: membraneAllocation
      label: Eaves vs Valleys vs Low-Slope Coverage
    - id: rollCoverageRatio
      label: Net Installed Area vs Waste & Lap Overlap

history_columns:
  - key: eaveLengthFeet
    label: Eaves (ft)
    source: input
  - key: roofPitch
    label: Pitch
    source: input
  - key: eaveMembraneWidthInches
    label: Required Width
    source: output
  - key: eaveCoursesNeeded
    label: Courses
    source: output
  - key: totalShieldSqFt
    label: Total Sq Ft
    source: output
  - key: rollsNeeded
    label: Rolls
    source: output

js_file: assets/js/calculators/ice-water-shield-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Ice & Water Shield Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate self-adhered ice and water shield rolls for roof eaves, valley seams, and low-slope roofs compliant with IRC R905.1.2 ice barrier rules."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRC Code Compliance — enforces 24-inch interior wall line extension rule"
    - "Course Pass Multipliers — determines whether 1, 2, or 3 membrane courses are needed along eaves"
    - "Multi-Zone Coverage — integrates eaves, valleys, sidewalls, and low-slope roof areas"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Ice & Water Shield Calculator

howto:
  name: "How to Calculate Ice & Water Shield Rolls"
  description: "Determine exact roll counts of self-adhering underlayment for ice dam and water barrier protection."
  step:
    - name: "Measure Eave Perimeter"
      text: "Measure total linear feet along all eave lines subject to freezing weather."
    - name: "Input Overhang & Roof Pitch"
      text: "Specify horizontal overhang depth in inches and roof pitch to calculate sloped deck width."
    - name: "Add Roof Valleys & Low-Slope Areas"
      text: "Measure linear feet of valleys and total square feet of low-slope roof sections requiring 100% coverage."
    - name: "Select Roll Dimensions"
      text: "Choose standard commercial roll sizes (e.g., 36\" wide by 65' long = 195 sq ft)."

faq:
  - question: "What is ice & water shield?"
    answer: "Ice & water shield is a self-adhering rubberized asphalt membrane installed under shingles along eaves, valleys, roof penetrations, and low-slope areas to seal around nails and prevent leaks caused by ice dams or wind-driven rain."
  - question: "What is the building code requirement for eave ice barrier protection?"
    answer: "Under International Residential Code (IRC R905.1.2), in areas with a history of ice damming, ice barrier membrane must extend from the eave edge to a point at least 24 inches inside the exterior wall line."
  - question: "How many courses (passes) of ice and water shield do I need?"
    answer: "If horizontal overhang is 18 inches and wall thickness is 6 inches, total depth to reach 24\" inside is 48 inches along the slope. Since standard rolls are 36\" wide (with a 3\" lap overlap = 33\" net), 2 courses are required along the eave."
  - question: "How wide is a standard roll of ice and water shield?"
    answer: "Standard rolls are 36 inches (3 feet) wide and typically come in lengths of 33 feet (100 sq ft roll), 50 feet (150 sq ft roll), or 65 feet (195 sq ft roll)."
  - question: "Do you put ice and water shield in roof valleys?"
    answer: "Yes. Building codes and shingle manufacturers require a 36-inch wide strip of ice and water shield centered down all roof valley seams prior to metal flashing or shingle installation."
  - question: "Is ice & water shield required on low-slope roofs?"
    answer: "Yes. Roofs with slopes between 2:12 and 4:12 pitch require either two layers of felt underlayment or 100% coverage of self-adhering ice & water shield across the entire roof surface."
  - question: "Is my ice & water shield calculation saved on external servers?"
    answer: "No. All calculations execute locally in your web browser."
---

# Ice & Water Shield Calculator – Eaves, Valleys & Roll Coverage

Calculate exact **rolls of self-adhering ice & water shield membrane** required for roof eaves, valley seams, and low-slope roof sections in compliance with **IRC R905.1.2 ice barrier building codes**.

<!-- more -->

## Why Ice & Water Barrier Calculations Matter

Ice dams form when heat escaping from an attic melts snow on upper roof slopes. The meltwater flows down to cold eave overhangs, refreezes into ice, and backs up under shingles. 

Installing self-adhering polymer-modified bitumen membrane seals around shingle fastener penetrations, providing a waterproof membrane that prevents catastrophic interior ceiling damage.

---

## Ice & Water Shield Mathematical Formulas

$$\text{Pitch Factor } (M_p) = \sqrt{1 + \left(\frac{\text{Pitch}}{12}\right)^2}$$
$$\text{Overhang Slope Depth (in)} = \text{Overhang (in)} \times M_p$$
$$\text{Interior Wall Extension Slope Depth (in)} = 24 \text{ in} \times M_p$$
$$\text{Required Eave Membrane Width (in)} = \text{Overhang Slope Depth} + \text{Interior Wall Extension Slope Depth}$$
$$\text{Net Roll Width (in)} = \text{Roll Width (in)} - 3 \text{ in (Lap Overlap)}$$
$$\text{Eave Courses Needed} = \left\lceil \frac{\text{Required Eave Width (in)}}{\text{Net Roll Width (in)}} \right\rceil$$
$$\text{Eave Area (sq ft)} = \text{Eave Feet} \times \left(\frac{\text{Eave Courses} \times \text{Roll Width (in)}}{12}\right)$$
$$\text{Valley Area (sq ft)} = \text{Valley Feet} \times \left(\frac{\text{Roll Width (in)}}{12}\right)$$
$$\text{Total Gross Sq Ft} = (\text{Eave Sq Ft} + \text{Valley Sq Ft} + \text{Low-Slope Sq Ft}) \times 1.10$$
$$\text{Rolls Needed} = \left\lceil \frac{\text{Total Gross Sq Ft}}{\text{Roll Sq Ft}} \right\rceil$$

---

## Eave Membrane Course Requirements Reference (36" Wide Roll, 3" Overlap = 33" Net Coverage)

| Horizontal Eave Overhang | Roof Pitch | Slope Factor ($M_p$) | Total Slope Width to 24" Past Wall | Required Eave Courses | Eave Area per 100 ft Eave |
|---|---|---|---|---|---|
| **12 inches** | 4/12 Pitch | 1.054 | **37.9 inches** | **2 Courses** | 600 sq ft |
| **16 inches** | 5/12 Pitch | 1.083 | **43.3 inches** | **2 Courses** | 600 sq ft |
| **18 inches** | 6/12 Pitch | 1.118 | **47.0 inches** | **2 Courses** | 600 sq ft |
| **24 inches** | 8/12 Pitch | 1.202 | **57.7 inches** | **2 Courses** | 600 sq ft |
| **30 inches** | 10/12 Pitch | 1.302 | **70.3 inches** | **3 Courses** | 900 sq ft |
| **36 inches** | 12/12 Pitch | 1.414 | **84.8 inches** | **3 Courses** | 900 sq ft |

---

## Step-by-Step Installation Guidelines

1. **Clean Deck Surface**: Ensure plywood deck sheathing is dry, clean, and free of protruding nails or debris.
2. **Apply Eave Courses**: Peel split-back release film and roll membrane parallel to eaves, extending 0.25" past drip edge metal.
3. **Overlap End & Side Laps**: Overlap side courses by at least 3 inches and end laps by 6 inches.
4. **Center Valley Strips**: Lay continuous 36-inch wide membrane centered down the valley seam before installing metal W-flashing.
5. **Roll Surface**: Firmly press membrane with a hand roller to activate rubberized asphalt adhesion.

---

## Frequently Asked Questions

### What is ice & water shield?
Ice & water shield is a self-adhering rubberized asphalt membrane installed under shingles along eaves, valleys, roof penetrations, and low-slope areas to seal around nails and prevent leaks caused by ice dams or wind-driven rain.

### What is the building code requirement for eave ice barrier protection?
Under International Residential Code (IRC R905.1.2), in areas with a history of ice damming, ice barrier membrane must extend from the eave edge to a point at least 24 inches inside the exterior wall line.

### How many courses (passes) of ice and water shield do I need?
If horizontal overhang is 18 inches and wall thickness is 6 inches, total depth to reach 24" inside is 48 inches along the slope. Since standard rolls are 36" wide (with a 3" lap overlap = 33" net), 2 courses are required along the eave.

### How wide is a standard roll of ice and water shield?
Standard rolls are 36 inches (3 feet) wide and typically come in lengths of 33 feet (100 sq ft roll), 50 feet (150 sq ft roll), or 65 feet (195 sq ft roll).

### Do you put ice and water shield in roof valleys?
Yes. Building codes and shingle manufacturers require a 36-inch wide strip of ice and water shield centered down all roof valley seams prior to metal flashing or shingle installation.

### Is ice & water shield required on low-slope roofs?
Yes. Roofs with slopes between 2:12 and 4:12 pitch require either two layers of felt underlayment or 100% coverage of self-adhering ice & water shield across the entire roof surface.

### Is my ice & water shield calculation saved on external servers?
No. All calculations execute locally in your web browser.
