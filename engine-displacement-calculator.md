---
layout: tool
title: Engine Displacement Calculator – Liters, CC & Cubic Inches (CID)
description: Calculate total engine displacement in Liters, Cubic Centimeters (CC), and Cubic Inches (CID) from cylinder bore, stroke length, and cylinder count.
permalink: /engine-displacement-calculator
tool_id: engine-displacement-calculator
category: auto-performance-specs
hide_sidebar: true

inputs:
  - id: bore
    label: Cylinder Bore Diameter
    type: number
    default: 4.00
    step: 0.01
    min: 1.00
    max: 150.00
    placeholder: "e.g., 4.00"

  - id: stroke
    label: Piston Stroke Length
    type: number
    default: 3.48
    step: 0.01
    min: 1.00
    max: 150.00
    placeholder: "e.g., 3.48"

  - id: cylinders
    label: Number of Cylinders
    type: number
    default: 8
    step: 1
    min: 1
    max: 16
    placeholder: "e.g., 8"

  - id: unitSystem
    label: Input Measurement Units
    type: select
    default: inches
    options:
      - inches
      - mm

outputs:
  - id: displacementCubicInches
    label: Total Displacement (Cubic Inches / CID)
  - id: displacementCc
    label: Total Displacement (Cubic Centimeters / CC)
  - id: displacementLiters
    label: Total Displacement (Liters / L)
  - id: singleCylinderCc
    label: Per-Cylinder Volume (CC)
  - id: boreToStrokeRatio
    label: Bore-to-Stroke Ratio

charts:
  tabs:
    - id: displacementUnits
      label: Displacement Unit Equivalents (L vs CC vs CID)
    - id: boreStrokeProfile
      label: Engine Design Characterization (Overbore vs Undersquare)

history_columns:
  - displacementCubicInches
  - displacementCc
  - displacementLiters
  - boreToStrokeRatio

js_file: assets/js/calculators/engine-displacement-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Engine Displacement Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate total engine displacement volume in liters, CC, and CID from bore, stroke, and cylinder count."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Geometric cylinder volume calculation ($V = pi r^2 h \times N$)"
    - "Cubic Inches (CID) to Liters and CC conversion"
    - "Bore-to-stroke ratio characterization (Oversquare vs Undersquare)"
    - "Per-cylinder displacement breakdown"
    - "100% private local execution"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Engine Displacement Calculator

howto:
  name: "How to Calculate Engine Displacement Volume"
  description: "Follow these steps to calculate engine displacement in liters, CC, and cubic inches."
  step:
    - name: "Select measurement units"
      text: "Choose Inches or Millimeters for bore and stroke inputs."
    - name: "Enter cylinder bore diameter"
      text: "Input cylinder bore width (e.g. 4.00 inches or 101.6 mm)."
    - name: "Enter piston stroke length"
      text: "Input piston stroke travel length (e.g. 3.48 inches or 88.39 mm)."
    - name: "Set cylinder count"
      text: "Select number of cylinders (e.g. 4, 6, 8, 10, 12)."
    - name: "Review calculated volume"
      text: "Instantly view total displacement in Liters, CC, CID, and bore-to-stroke ratio."

faq:
  - question: "What is engine displacement?"
    answer: "Engine displacement is the total swept volume of air/fuel mixture displaced by all pistons moving from Bottom Dead Center (BDC) to Top Dead Center (TDC) inside the cylinders."
  - question: "What is the formula for calculating engine displacement?"
    answer: "$\text{Displacement} = \\pi \times \\left( \frac{\text{Bore}}{2} \right)^2 \times \text{Stroke} \times \text{Number of Cylinders}$."
  - question: "What is an oversquare (short-stroke) vs undersquare (long-stroke) engine?"
    answer: "An oversquare engine has a bore larger than its stroke (ratio > 1.0), favoring high RPM power. An undersquare engine has a stroke larger than its bore (ratio < 1.0), favoring low-end torque."
  - question: "How many cubic inches are in 1 Liter of engine displacement?"
    answer: "1 Liter equals approximately 61.0237 cubic inches (CID)."
  - question: "Why is a 350 Chevy engine referred to as a 5.7L?"
    answer: "350 cubic inches multiplied by 0.016387 equates to 5.735 Liters, rounded conventionally to 5.7L."
  - question: "How does boring out an engine cylinder increase displacement?"
    answer: "Machining the cylinder walls to a wider diameter increases cylinder cross-sectional area, allowing more air-fuel charge per stroke."
  - question: "Does the engine displacement calculator store my data?"
    answer: "No. All calculations take place 100% locally in your web browser."

---

# Engine Displacement Calculator

Calculate total **engine displacement** in **Liters (L)**, **Cubic Centimeters (CC)**, and **Cubic Inches (CID)** from cylinder bore diameter, piston stroke length, and cylinder count.

<!-- more -->

## Why Calculate Engine Displacement?

Engine displacement measures total volumetric capacity across all combustion cylinders. Displacement dictates air-fuel throughput capacity, low-end torque generation potential, and classification rules in motor racing sanctioning bodies.

Key geometric parameters:
- **Bore ($B$)**: Internal diameter of the cylinder bore.
- **Stroke ($S$)**: Total linear distance the piston travels from Bottom Dead Center (BDC) to Top Dead Center (TDC).
- **Bore-to-Stroke Ratio**: Describes engine high-RPM breathability vs low-RPM torque characteristics.

---

## Displacement Geometry Flow

<div class="flow-chart">
  <div class="flow-title">Engine Displacement Volumetric Flow</div>
  <div class="flow-section">
    <div class="flow-section-title">📥 Inputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Cylinder Bore</div>
      <div class="flow-input">Piston Stroke</div>
      <div class="flow-input">Number of Cylinders</div>
      <div class="flow-input">Units (Inches / mm)</div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 1</div>
    <div class="flow-box">
      <div class="flow-box-title">Single Cylinder Swept Volume</div>
      <div class="flow-box-content">
        \[ V_{\text{cyl}} = \pi \times \left(\frac{\text{Bore}}{2}\right)^2 \times \text{Stroke} \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 2</div>
    <div class="flow-box">
      <div class="flow-box-title">Multiply by Cylinder Count & Convert Units</div>
      <div class="flow-box-content">
        \[ V_{\text{total}} = V_{\text{cyl}} \times N_{\text{cylinders}} \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-section-title">📊 Outputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Displacement (Liters & CC)</div>
      <div class="flow-input">Displacement (Cubic Inches / CID)</div>
      <div class="flow-input">Bore-to-Stroke Ratio</div>
    </div>
  </div>
</div>

---

## Mathematical Formulas

### 1. Single Cylinder Volume in Cubic Inches ($V_{\text{cyl, in3}}$)
\[
V_{\text{cyl, in3}} = \pi \times \left( \frac{\text{Bore}_{\text{in}}}{2} \right)^2 \times \text{Stroke}_{\text{in}} = 0.785398 \times \text{Bore}^2 \times \text{Stroke}
\]

### 2. Total Displacement Calculations
\[
\text{CID} = V_{\text{cyl, in3}} \times N_{\text{cylinders}}
\]
\[
\text{CC} = \text{CID} \times 16.387064
\]
\[
\text{Liters} = \frac{\text{CC}}{1000}
\]

### 3. Bore-to-Stroke Ratio ($R_{B/S}$)
\[
R_{B/S} = \frac{\text{Bore}}{\text{Stroke}}
\]

---

## Classic Engine Displacement Benchmarks

| Engine Name | Bore × Stroke | Cylinders | Cubic Inches (CID) | Cubic Centimeters (CC) | Liters (L) | Bore-to-Stroke Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Chevy 350 Small Block** | 4.00" × 3.48" | 8 | **349.8 CID** | **5,733 CC** | **5.7L** | 1.15 (Oversquare) |
| **Ford 302 (5.0L)** | 4.00" × 3.00" | 8 | **301.6 CID** | **4,942 CC** | **4.9L / 5.0L** | 1.33 (Oversquare) |
| **LS3 6.2L V8** | 4.065" × 3.622" | 8 | **376.0 CID** | **6,162 CC** | **6.2L** | 1.12 (Oversquare) |
| **Honda K20 2.0L 4-Cyl** | 86mm × 86mm | 4 | **121.9 CID** | **1,998 CC** | **2.0L** | 1.00 (Square) |
| **Cummins 6.7L Turbo Diesel**| 107mm × 124mm | 6 | **408.2 CID** | **6,690 CC** | **6.7L** | 0.86 (Undersquare) |

---

## Step-by-Step Usage Guide

1. **Select Input Units**: Choose Inches or Millimeters.
2. **Input Cylinder Bore**: Enter cylinder diameter (e.g. 4.00 inches).
3. **Input Piston Stroke**: Enter piston stroke length (e.g. 3.48 inches).
4. **Select Cylinder Count**: Choose cylinder quantity (e.g. 8 cylinders).
5. **Review Displacement Values**: View exact displacement in Liters, CC, CID, and bore/stroke characterization.

---

## Frequently Asked Questions

### What is engine displacement?
Engine displacement is the total swept volume of air/fuel mixture displaced by all pistons moving from Bottom Dead Center (BDC) to Top Dead Center (TDC) inside the cylinders.

### What is the formula for calculating engine displacement?
$\text{Displacement} = \pi \times \left( \frac{\text{Bore}}{2} \right)^2 \times \text{Stroke} \times \text{Number of Cylinders}$.

### What is an oversquare (short-stroke) vs undersquare (long-stroke) engine?
An oversquare engine has a bore larger than its stroke (ratio > 1.0), favoring high RPM power. An undersquare engine has a stroke larger than its bore (ratio < 1.0), favoring low-end torque.

### How many cubic inches are in 1 Liter of engine displacement?
1 Liter equals approximately 61.0237 cubic inches (CID).

### Why is a 350 Chevy engine referred to as a 5.7L?
350 cubic inches multiplied by 0.016387 equates to 5.735 Liters, rounded conventionally to 5.7L.

### How does boring out an engine cylinder increase displacement?
Machining the cylinder walls to a wider diameter increases cylinder cross-sectional area, allowing more air-fuel charge per stroke.

### Does the engine displacement calculator store my data?
No. All calculations take place 100% locally in your web browser.
