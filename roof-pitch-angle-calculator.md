---
layout: tool
title: "Roof Pitch Angle & Slope Calculator"
description: "Convert roof rise and run into pitch ratio, degrees, percentage slope, and rafter multiplier instantly with 100% private browser math."
permalink: /roof-pitch-angle-calculator
tool_id: roof-pitch-angle-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: roofRise
    label: Vertical Roof Rise (Inches)
    type: number
    default: 6
    step: 0.5
    min: 0.5
    placeholder: "e.g., 6"

  - id: roofRun
    label: Horizontal Roof Run (Inches)
    type: number
    default: 12
    step: 1
    min: 1
    placeholder: "e.g., 12"

  - id: roofAreaFlat
    label: Flat Roof Footprint Area (Sq Ft)
    type: number
    default: 1500
    step: 50
    min: 10
    placeholder: "e.g., 1500"

outputs:
  - id: pitchRatio
    label: Roof Pitch Ratio (X:12)
  - id: pitchAngleDegrees
    label: Roof Pitch Angle (Degrees)
  - id: slopePercentage
    label: Slope Percentage (%)
  - id: rafterMultiplier
    label: Slope Pitch Factor / Rafter Multiplier
  - id: actualSlopedArea
    label: Actual Sloped Roof Surface Area (Sq Ft)

charts:
  tabs:
    - id: pitchAngleComparison
      label: Pitch Angle vs Rise-in-12 Ratio
    - id: surfaceAreaMultiplier
      label: Flat Footprint vs Sloped Surface Area

history_columns:
  - key: roofRise
    label: Rise (in)
    source: input
  - key: pitchRatio
    label: Pitch Ratio
    source: output
  - key: pitchAngleDegrees
    label: Angle (deg)
    source: output
  - key: rafterMultiplier
    label: Multiplier
    source: output
  - key: actualSlopedArea
    label: Sloped Area (sq ft)
    source: output

js_file: assets/js/calculators/roof-pitch-angle-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Pitch Angle & Slope Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate roof pitch ratio (rise over run), slope angle in degrees, slope percentage, rafter length multiplier, and actual sloped roof area."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Converts vertical rise and horizontal run into standard X:12 pitch ratios"
    - "Calculates exact roof pitch angle in degrees using inverse tangent trig functions"
    - "Determines slope factor / rafter multiplier for true roof surface area calculation"
    - "Computes sloped square footage from flat building footprints"

breadcrumb:
  - name: Home
    url: /
  - name: Roofing
    url: /roofing
  - name: Roof Pitch Angle Calculator

howto:
  name: "How to Measure and Calculate Roof Pitch and Angle"
  description: "Convert rise over run measurements into roof pitch ratios, angles, and surface area multipliers."
  step:
    - name: "Measure vertical roof rise"
      text: "Measure vertical distance in inches from horizontal level line to roof rafter surface."
    - name: "Measure horizontal run"
      text: "Measure horizontal distance in inches (standard run baseline is 12 inches)."
    - name: "Calculate pitch ratio"
      text: "Divide rise by run to derive pitch fraction expressed over 12 (e.g., 6/12 or 6:12 pitch)."
    - name: "Determine rafter length multiplier"
      text: "Calculate slope factor using the Pythagorean formula to compute actual sloped roof square footage."

faq:
  - question: "What is a 6/12 roof pitch in degrees?"
    answer: "A 6/12 roof pitch (6 inches of rise per 12 inches of run) equals an angle of 26.57 degrees with a slope of 50% and a rafter multiplier of 1.118."
  - question: "How do you calculate roof pitch angle in degrees?"
    answer: "The formula is: Pitch Angle (Degrees) = arctan(Rise / Run) * (180 / π). For a 6/12 pitch: arctan(6/12) = 26.57°."
  - question: "What is the rafter multiplier for a 8/12 roof pitch?"
    answer: "The rafter multiplier (pitch factor) for an 8/12 pitch is 1.202. Multiply your flat footprint area by 1.202 to get the actual sloped roof surface area."
  - question: "What is considered a low-slope vs steep-slope roof?"
    answer: "Low-slope roofs have a pitch less than 4/12 (under 18.43°). Steep-slope roofs have a pitch of 4/12 or greater, requiring shingles or metal panels."
  - question: "How do you measure roof pitch from inside the attic?"
    answer: "Place a 12-inch level horizontally against the underside of an exposed roof rafter. Measure vertically from the 12-inch mark on the level up to the bottom edge of the rafter."
  - question: "What is a 12/12 roof pitch?"
    answer: "A 12/12 pitch has 12 inches of vertical rise for every 12 inches of horizontal run, resulting in a 45-degree angle and a rafter multiplier of 1.414."
  - question: "Why is the rafter multiplier important for shingle estimates?"
    answer: "Ground footprint measurements undercount roof surface area on sloped roofs. Multiplying footprint square footage by the rafter multiplier ensures accurate shingle bundle ordering."
---

# Roof Pitch, Slope & Angle Converter

Convert vertical rise and horizontal run measurements into standard roof pitch ratios ($X:12$), slope angles in degrees, slope percentages, and rafter surface multipliers.
All calculations execute 100% privately inside your web browser with instant client-side math and zero data tracking.

<!-- more -->

## Why Use the Roof Pitch Angle Calculator?

Roof pitch directly dictates material selection, structural load limits, water drainage speed, and safety harness requirements. Estimating roofing materials based on flat ground blueprints underestimates actual sloped roof area by up to 40% on steep roofs.

This **Roof Pitch Angle & Slope Calculator** converts simple level-and-tape measurements into exact pitch fractions ($6:12$), slope degrees ($26.57^\circ$), and rafter multipliers ($1.118$).

### Key Benefits
* **Complete Slope Trigonometry:** Calculates pitch ratio, angle degrees, percentage slope, and rafter multiplier.
* **Sloped Surface Area Multiplier:** Converts flat floor plans into true 3D sloped roof surface area.
* **Safety & Code Compliance:** Identifies steep-slope thresholds ($>4:12$) mandating harness ties and scaffolding.
* **100% Private Browser Math:** Client-side trigonometry processes privately in your browser.

---

## Mathematical Formulas & Mechanics

### 1. Roof Pitch Angle in Degrees
Pitch angle ($\theta$ in degrees) calculated from vertical rise ($R_{\text{rise}}$) and horizontal run ($R_{\text{run}}$):

$$\theta = \arctan\left(\frac{R_{\text{rise}}}{R_{\text{run}}}\right) \times \left(\frac{180}{\pi}\right)$$

### 2. Slope Percentage
Percentage slope ($S_{\text{pct}}$):

$$S_{\text{pct}} = \left(\frac{R_{\text{rise}}}{R_{\text{run}}}\right) \times 100$$

### 3. Slope Factor / Rafter Multiplier
The rafter length multiplier ($M_{\text{rafter}}$) based on the Pythagorean theorem:

$$M_{\text{rafter}} = \frac{\sqrt{R_{\text{rise}}^2 + R_{\text{run}}^2}}{R_{\text{run}}}$$

### 4. Actual Sloped Roof Surface Area
Actual surface area ($A_{\text{sloped}}$) from flat ground footprint ($A_{\text{flat}}$):

$$A_{\text{sloped}} = A_{\text{flat}} \times M_{\text{rafter}}$$

---

## Real-World Comparison & Benchmark Table

The slope reference table below shows pitch conversions, slope angles, rafter multipliers, and actual surface areas for a **1,500 Sq Ft flat footprint**:

| Roof Pitch Ratio (X:12) | Pitch Angle (Degrees) | Slope Percentage (%) | Rafter Multiplier | Actual Sloped Area (1,500 sq ft flat) | Roof Type Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2/12 Pitch** | 9.46° | 16.67% | 1.014 | 1,521 Sq Ft | Low Slope (Membrane/TPO) |
| **4/12 Pitch** | 18.43° | 33.33% | 1.054 | 1,581 Sq Ft | Standard Conventional |
| **6/12 Pitch** | 26.57° | 50.00% | 1.118 | 1,677 Sq Ft | Moderate Residential |
| **8/12 Pitch** | 33.69° | 66.67% | 1.202 | 1,803 Sq Ft | Steep Residential |
| **10/12 Pitch** | 39.81° | 83.33% | 1.302 | 1,953 Sq Ft | Steep Architectural |
| **12/12 Pitch** | 45.00° | 100.00% | 1.414 | 2,121 Sq Ft | 45° Alpine / Tudor Pitch |

---

## Step-by-Step How-To Guide

1. **Grab a 12-Inch Carpenter Level:** Place a standard 12-inch level horizontally against the roof rafter or surface.
2. **Measure Vertical Rise:** Use a tape measure to measure the vertical distance from the 12-inch end of the level up to the bottom of the rafter.
3. **Calculate Pitch Fraction:** If the vertical distance is 6 inches, your pitch ratio is $6/12$ (or 6:12).
4. **Determine Rafter Multiplier:** Look up or compute your slope multiplier (e.g., $6/12 \rightarrow 1.118$).
5. **Compute Sloped Square Footage:** Multiply flat footprint area by the rafter multiplier to order correct shingle bundles or underlayment rolls.

---

## Frequently Asked Questions

### What is a 6/12 roof pitch in degrees?
A 6/12 roof pitch (6 inches of rise per 12 inches of run) equals an angle of 26.57 degrees with a slope of 50% and a rafter multiplier of 1.118.

### How do you calculate roof pitch angle in degrees?
The formula is: Pitch Angle (Degrees) = arctan(Rise / Run) * (180 / π). For a 6/12 pitch: arctan(6/12) = 26.57°.

### What is the rafter multiplier for a 8/12 roof pitch?
The rafter multiplier (pitch factor) for an 8/12 pitch is 1.202. Multiply your flat footprint area by 1.202 to get the actual sloped roof surface area.

### What is considered a low-slope vs steep-slope roof?
Low-slope roofs have a pitch less than 4/12 (under 18.43°). Steep-slope roofs have a pitch of 4/12 or greater, requiring shingles or metal panels.

### How do you measure roof pitch from inside the attic?
Place a 12-inch level horizontally against the underside of an exposed roof rafter. Measure vertically from the 12-inch mark on the level up to the bottom edge of the rafter.

### What is a 12/12 roof pitch?
A 12/12 pitch has 12 inches of vertical rise for every 12 inches of horizontal run, resulting in a 45-degree angle and a rafter multiplier of 1.414.

### Why is the rafter multiplier important for shingle estimates?
Ground footprint measurements undercount roof surface area on sloped roofs. Multiplying footprint square footage by the rafter multiplier ensures accurate shingle bundle ordering.
