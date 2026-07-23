---
layout: tool
title: Tire Revolutions Per Mile Calculator – Exact Tire Rotation & Distance
description: Calculate exact tire revolutions per mile and kilometer based on tire width, aspect ratio, rim size, and loaded tire squish deflection factor.
permalink: /tire-revolutions-per-mile-calculator
tool_id: tire-revolutions-per-mile-calculator
category: auto-tires-wheels
hide_sidebar: true

inputs:
  - id: width
    label: Tire Section Width (mm)
    type: number
    default: 225
    step: 5
    min: 135
    max: 355
    placeholder: "e.g. 225"

  - id: aspect_ratio
    label: Aspect Ratio (%)
    type: number
    default: 50
    step: 5
    min: 20
    max: 90
    placeholder: "e.g. 50"

  - id: rim_diameter
    label: Wheel Rim Diameter (inches)
    type: number
    default: 17
    step: 1
    min: 10
    max: 26
    placeholder: "e.g. 17"

  - id: load_deflection
    label: Loaded Tire Squish Deflection (%)
    type: number
    default: 3.0
    step: 0.5
    min: 0.0
    max: 8.0
    placeholder: "e.g. 3.0"

outputs:
  - id: revs_per_mile
    label: Tire Revolutions Per Mile
  - id: revs_per_km
    label: Tire Revolutions Per Kilometer
  - id: loaded_diameter
    label: Loaded Tire Diameter
  - id: loaded_circumference
    label: Loaded Rolling Circumference
  - id: distance_per_rev
    label: Distance Covered Per Revolution

charts:
  tabs:
    - id: revs_comparison
      label: Rotation Metrics & Circumference

history_columns:
  - key: revs_per_mile
    label: Revs / Mile
    source: output
  - key: revs_per_km
    label: Revs / KM
    source: output
  - key: loaded_diameter
    label: Loaded Diam
    source: output

js_file: assets/js/calculators/tire-revolutions-per-mile-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Tire Revolutions Per Mile Calculator"
  applicationCategory: "UtilityApplication"
  operatingSystem: "All"
  description: "Calculate exact tire revolutions per mile and kilometer based on tire dimensions and loaded tire rolling radius."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates tire revolutions per mile and kilometer"
    - "Accounts for loaded tire deflection squish radius"
    - "Calculates exact rolling distance per wheel rotation"
    - "100% Client-side privacy logic"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Tire Revolutions Per Mile Calculator

howto:
  name: "How to Calculate Tire Revolutions Per Mile"
  description: "Learn how to compute exact tire rotation counts per mile and kilometer."
  step:
    - name: "Enter Tire Dimensions"
      text: "Input your tire width in mm, aspect ratio percentage, and rim diameter in inches."
    - name: "Specify Load Deflection"
      text: "Enter estimated tire squish percentage (typically 3.0% under normal vehicle weight)."
    - name: "Calculate Rotations"
      text: "Review exact revolutions per mile, revolutions per kilometer, and loaded rolling circumference."

faq:
  - question: "What is tire revolutions per mile (revs/mile)?"
    answer: "Tire revolutions per mile is the exact number of times a tire completes a full 360-degree rotation while traveling a distance of one mile (63,360 inches)."
  - question: "Why is loaded tire radius smaller than static unloaded radius?"
    answer: "When a tire supports vehicle weight, the bottom section of the tire deflects (squishes), reducing the rolling radius by approximately 2% to 4% compared to an unweighted tire off the ground."
  - question: "Why is revs per mile important for speedometer calibration?"
    answer: "Engine Control Units (ECUs) and transmission controllers calibrate vehicle speed and odometer distance based on pulses per revolution. Changing revs/mile alters speedometer accuracy."
  - question: "How many inches are in one mile?"
    answer: "There are exactly 63,360 inches in one statute mile (5,280 feet × 12 inches)."
  - question: "How do you calculate revolutions per kilometer from revs per mile?"
    answer: "To convert revolutions per mile to revolutions per kilometer, divide the revs per mile by 1.609344 (since 1 mile = 1.609344 km)."
  - question: "Do worn tires increase revolutions per mile?"
    answer: "Yes. As tire tread wears down by 8/32 of an inch, overall diameter decreases by 0.5 inches, causing the tire to rotate ~2% more times per mile."
  - question: "Is my calculation saved in any online database?"
    answer: "No. All calculations run strictly inside your browser for total user privacy."

---

# Tire Revolutions Per Mile Calculator – Exact Tire Rotation & Distance

Calculate exact tire revolutions per mile, revolutions per kilometer, and loaded rolling radius with our free **Tire Revolutions Per Mile Calculator**.

<!-- more -->

## Why Calculate Tire Revolutions Per Mile?

Engine control modules, speedometer clusters, anti-lock brake systems, and transmission shift mapping rely on accurate tire revolution data. Changing tire sizes changes the rolling circumference, causing speedometer error and improper transmission shift points if ECU values are not recalibrated.

This calculator computes exact rotation counts, incorporating real-world loaded tire squish deflection under vehicle weight.

---

## Calculation Flow & Mathematical Formulas

The formula computes unloaded sidewall height, applies loaded deflection radius, and calculates rolling circumference:

### Inputs & Parameters

| Parameter | Unit | Description |
| :--- | :--- | :--- |
| **Section Width (\(W\))** | mm | Tire section width |
| **Aspect Ratio (\(AR\))** | % | Sidewall profile ratio |
| **Rim Diameter (\(R\))** | inches | Wheel rim diameter |
| **Load Deflection (\(\delta\))** | % | Tire squish percentage under load (default 3.0%) |

---

### Step-by-Step Formulas

#### 1. Unloaded Sidewall & Diameter
\[
H_{sidewall} = \frac{W \times \frac{AR}{100}}{25.4} \quad \text{(in inches)}
\]
\[
D_{unloaded} = R + (2 \times H_{sidewall})
\]

#### 2. Loaded Diameter (\(D_{loaded}\))
\[
D_{loaded} = R + \left(2 \times H_{sidewall} \times \left(1 - \frac{\delta}{100}\right)\right)
\]

#### 3. Loaded Circumference (\(C_{loaded}\))
\[
C_{loaded} = \pi \times D_{loaded} \quad \text{(in inches)}
\]

#### 4. Revolutions Per Mile (\(N_{mile}\)) & Kilometer (\(N_{km}\))
\[
N_{mile} = \frac{63,360}{C_{loaded}}
\]
\[
N_{km} = \frac{N_{mile}}{1.609344}
\]

---

## Tire Size vs Revolutions Per Mile Table

| Tire Size | Unloaded Diam | Loaded Diam | Loaded Circumference | Revs / Mile | Revs / KM |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **205/55R16** | 24.88" | 24.41" | 76.69" | **826 revs** | **513 revs** |
| **225/45R17** | 24.97" | 24.50" | 76.97" | **823 revs** | **511 revs** |
| **245/40R18** | 25.72" | 25.23" | 79.26" | **799 revs** | **497 revs** |
| **275/40R20** | 28.66" | 28.11" | 88.31" | **717 revs** | **446 revs** |

---

## Step-by-Step How-To Guide

1. **Locate Tire Size**: Read tire size code off tire sidewall (e.g., `225/50R17`).
2. **Enter Metrics**: Input width (`225`), aspect ratio (`50`), and rim size (`17`).
3. **Set Deflection**: Keep 3.0% for standard passenger cars or set 4.0% for heavy loaded trucks.
4. **View Calibration Data**: Use the calculated Revs/Mile for ECU re-flashing or speedometer tuning.

---

## Frequently Asked Questions

### What is tire revolutions per mile (revs/mile)?
Tire revolutions per mile is the exact number of times a tire completes a full 360-degree rotation while traveling a distance of one mile (63,360 inches).

### Why is loaded tire radius smaller than static unloaded radius?
When a tire supports vehicle weight, the bottom section of the tire deflects (squishes), reducing the rolling radius by approximately 2% to 4% compared to an unweighted tire off the ground.

### Why is revs per mile important for speedometer calibration?
Engine Control Units (ECUs) and transmission controllers calibrate vehicle speed and odometer distance based on pulses per revolution. Changing revs/mile alters speedometer accuracy.

### How many inches are in one mile?
There are exactly **63,360 inches** in one statute mile (5,280 feet × 12 inches).

### How do you calculate revolutions per kilometer from revs per mile?
To convert revolutions per mile to revolutions per kilometer, divide the revs per mile by **1.609344** (since 1 mile = 1.609344 km).

### Do worn tires increase revolutions per mile?
Yes. As tire tread wears down by 8/32 of an inch, overall diameter decreases by 0.5 inches, causing the tire to rotate ~2% more times per mile.

### Is my calculation saved in any online database?
No. All calculations run strictly inside your browser for total user privacy.
