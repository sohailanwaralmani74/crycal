---
layout: tool
title: "Tire Size Comparison | Interactive Online Tool"
description: "Free online Tire Size Comparison. Calculate car payments, TCO, fuel MPG, and EV charging with instant client-side browser math and charts."
permalink: /tire-size-comparison-calculator
tool_id: tire-size-comparison-calculator
category: auto-tires-wheels
hide_sidebar: true

inputs:
  - id: size1_width
    label: Tire 1 Width (mm)
    type: number
    default: 225
    step: 5
    min: 135
    max: 355
    placeholder: "e.g. 225"

  - id: size1_ratio
    label: Tire 1 Aspect Ratio (%)
    type: number
    default: 45
    step: 5
    min: 20
    max: 90
    placeholder: "e.g. 45"

  - id: size1_rim
    label: Tire 1 Rim Diameter (inches)
    type: number
    default: 17
    step: 1
    min: 10
    max: 26
    placeholder: "e.g. 17"

  - id: size2_width
    label: Tire 2 Width (mm)
    type: number
    default: 245
    step: 5
    min: 135
    max: 355
    placeholder: "e.g. 245"

  - id: size2_ratio
    label: Tire 2 Aspect Ratio (%)
    type: number
    default: 40
    step: 5
    min: 20
    max: 90
    placeholder: "e.g. 40"

  - id: size2_rim
    label: Tire 2 Rim Diameter (inches)
    type: number
    default: 18
    step: 1
    min: 10
    max: 26
    placeholder: "e.g. 18"

  - id: target_speed
    label: Speedometer Check Speed (mph)
    type: number
    default: 60
    step: 5
    min: 10
    max: 120
    placeholder: "e.g. 60"

outputs:
  - id: tire1_diameter
    label: Tire 1 Overall Diameter
  - id: tire2_diameter
    label: Tire 2 Overall Diameter
  - id: diameter_diff_pct
    label: Diameter Difference (%)
  - id: tire1_sidewall
    label: Tire 1 Sidewall Height
  - id: tire2_sidewall
    label: Tire 2 Sidewall Height
  - id: tire1_revs_mile
    label: Tire 1 Revs / Mile
  - id: tire2_revs_mile
    label: Tire 2 Revs / Mile
  - id: speedo_error
    label: Actual Speed at 60 mph

charts:
  tabs:
    - id: comparison
      label: Dimensional Comparison

history_columns:
  - key: tire1_diameter
    label: Tire 1 Diam
    source: output
  - key: tire2_diameter
    label: Tire 2 Diam
    source: output
  - key: diameter_diff_pct
    label: Diam Diff %
    source: output

js_file: assets/js/calculators/tire-size-comparison-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Tire Size Comparison Calculator"
  applicationCategory: "UtilityApplication"
  operatingSystem: "All"
  description: "Compare two tire sizes side-by-side. Calculate differences in diameter, sidewall height, section width, revolutions per mile, and speedometer error percentage instantly."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Side-by-side tire size comparison"
    - "Sidewall height, width, and diameter calculation"
    - "Revolutions per mile calculation"
    - "Speedometer error variance calculation"
    - "100% Private local browser calculation"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Tire Size Comparison Calculator

howto:
  name: "How to Compare Two Tire Sizes"
  description: "Follow these steps to compare tire dimensions and speedometer variances between two tire specifications."
  step:
    - name: "Enter Tire 1 Specification"
      text: "Input the section width (mm), aspect ratio (%), and wheel rim diameter (inches) for your baseline or OEM tire."
    - name: "Enter Tire 2 Specification"
      text: "Input the section width, aspect ratio, and rim diameter for the new or target tire size."
    - name: "Set Target Check Speed"
      text: "Enter your benchmark driving speed (e.g., 60 mph) to evaluate speedometer readout discrepancies."
    - name: "Review Comparative Results"
      text: "Analyze differences in overall diameter, sidewall height, revolutions per mile, and actual vehicle speed."

faq:
  - question: "How do you calculate tire overall diameter from standard tire sizing metrics?"
    answer: "Tire diameter is calculated by converting section width to inches, multiplying by the aspect ratio percentage to find sidewall height, multiplying sidewall height by 2, and adding the wheel rim diameter."
  - question: "What is an acceptable tire diameter difference percentage when changing wheels?"
    answer: "Automotive engineers recommend keeping new tire diameters within ±3% of the original equipment (OEM) tire size to avoid ABS, traction control, and transmission calibration errors."
  - question: "Why does speedometer accuracy change when changing tire size?"
    answer: "Speedometers measure wheel rotation speed. If a new tire has a larger circumference, the car travels further per rotation, making the actual speed higher than shown on the speedometer."
  - question: "What is tire aspect ratio?"
    answer: "Aspect ratio is the height of the tire sidewall expressed as a percentage of the section width. For example, a 225/45 tire has a sidewall height equal to 45% of 225 mm."
  - question: "How does tire size affect revolutions per mile?"
    answer: "Larger diameter tires have a larger rolling circumference, taking fewer revolutions to cover one mile compared to smaller tires."
  - question: "Can I put wider tires on my existing factory rims?"
    answer: "Yes, provided the tire section width falls within the rim's approved width range (typically ±10-20mm from OEM) without causing suspension or fender rubbing."
  - question: "Is my comparison data kept private?"
    answer: "Yes. All computations are calculated locally in JavaScript within your browser. No input data is sent to external servers."

---

# Tire Size Comparison Calculator

Use our free **Tire Size Comparison Calculator** to compare two tire specifications side-by-side. Calculate exact overall diameter, sidewall profile height, section width, revolutions per mile, and speedometer calibration variances in real-time.

<!-- more -->

## Why Use a Tire Size Comparison Calculator?

Upgrading your wheels, fitting aftermarket rims, or switching to wider performance tires requires accurate calculations to ensure proper fitment. Selecting an incorrect tire size can lead to fender clearance issues, speedometer inaccuracy, altered gearing ratios, and potential interference with Anti-lock Braking Systems (ABS).

This calculator allows you to test different combinations—such as moving from a factory `225/45R17` to a `245/40R18`—to verify that overall tire height remains within safe engineering thresholds.

---

## Calculation Flow & Mathematical Formulas

The engine uses standard metric-to-imperial conversions to calculate physical tire dimensions:

### Inputs & Parameters

| Parameter | Unit | Description |
| :--- | :--- | :--- |
| **Section Width (\(W\))** | millimeters (mm) | Total width of tire from sidewall to sidewall |
| **Aspect Ratio (\(AR\))** | percentage (%) | Sidewall height as a percent of section width |
| **Rim Diameter (\(R\))** | inches (in) | Diameter of the wheel rim |
| **Check Speed (\(S_{target}\))** | miles per hour (mph) | Benchmark speed for speedometer error check |

---

### Step-by-Step Formulas

#### 1. Sidewall Height (\(H_{sidewall}\))
\[
H_{sidewall} = \frac{W \times \frac{AR}{100}}{25.4} \quad \text{(in inches)}
\]

#### 2. Overall Diameter (\(D_{overall}\))
\[
D_{overall} = R + \left(2 \times H_{sidewall}\right) \quad \text{(in inches)}
\]

#### 3. Tire Circumference (\(C\)) & Revolutions Per Mile (\(N_{revs}\))
\[
C = \pi \times D_{overall}
\]
\[
N_{revs} = \frac{63,360}{C}
\]

#### 4. Speedometer Variance (\(S_{actual}\))
\[
S_{actual} = S_{target} \times \left(\frac{D_{new}}{D_{oem}}\right)
\]

---

## Real-World Tire Size Comparison Matrix

| OEM Spec | Target Spec | OEM Diam | Target Diam | Diam Diff (%) | Speedo at 60 mph | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **205/55R16** | **225/45R17** | 24.88" | 24.97" | +0.36% | 60.2 mph | Perfect Match (< 1%) |
| **225/45R17** | **245/40R18** | 24.97" | 25.72" | +3.00% | 61.8 mph | Upper Limit (3.0%) |
| **215/60R16** | **235/50R18** | 26.16" | 27.25" | +4.17% | 62.5 mph | Out of Spec (> 3%) |

---

## Step-by-Step How-To Guide

1. **Locate OEM Specs**: Read your current tire size off the driver's door jamb placard or current tire sidewall (e.g., `225/45R17`).
2. **Input Baseline (Tire 1)**: Enter width (`225`), aspect ratio (`45`), and rim diameter (`17`) into the Tire 1 column.
3. **Input Comparison (Tire 2)**: Enter your prospective tire size specifications into the Tire 2 column.
4. **Evaluate Variance**: Ensure the overall diameter difference is within **±3%** to avoid vehicle speedometer and safety system issues.

---

## Frequently Asked Questions

### How do you calculate tire overall diameter from standard tire sizing metrics?
Tire diameter is calculated by converting section width to inches, multiplying by the aspect ratio percentage to find sidewall height, multiplying sidewall height by 2, and adding the wheel rim diameter.

### What is an acceptable tire diameter difference percentage when changing wheels?
Automotive engineers recommend keeping new tire diameters within **±3%** of the original equipment (OEM) tire size to avoid ABS, traction control, and transmission calibration errors.

### Why does speedometer accuracy change when changing tire size?
Speedometers measure wheel rotation speed. If a new tire has a larger circumference, the car travels further per rotation, making the actual speed higher than shown on the speedometer.

### What is tire aspect ratio?
Aspect ratio is the height of the tire sidewall expressed as a percentage of the section width. For example, a 225/45 tire has a sidewall height equal to 45% of 225 mm.

### How does tire size affect revolutions per mile?
Larger diameter tires have a larger rolling circumference, taking fewer revolutions to cover one mile compared to smaller tires.

### Can I put wider tires on my existing factory rims?
Yes, provided the tire section width falls within the rim's approved width range (typically ±10-20mm from OEM) without causing suspension or fender rubbing.

### Is my comparison data kept private?
Yes. All computations are calculated locally in JavaScript within your browser. No input data is sent to external servers.
