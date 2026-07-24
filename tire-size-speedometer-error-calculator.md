---
layout: tool
title: "Tire Size Speedometer Error | Interactive Online Tool"
description: "Calculate actual vehicle speed versus speedometer reading when changing tire width, aspect ratio, or wheel rim diameter."
permalink: /tire-size-speedometer-error-calculator
tool_id: tire-size-speedometer-error-calculator
category: auto-performance-specs
hide_sidebar: true

inputs:
  - id: origWidth
    label: Stock Tire Width (mm)
    type: number
    default: 225
    step: 5
    min: 135
    max: 355
    placeholder: "e.g., 225"

  - id: origAspect
    label: Stock Aspect Ratio (%)
    type: number
    default: 45
    step: 5
    min: 20
    max: 90
    placeholder: "e.g., 45"

  - id: origRim
    label: Stock Rim Diameter (Inches)
    type: number
    default: 17
    step: 1
    min: 12
    max: 26
    placeholder: "e.g., 17"

  - id: newWidth
    label: New Tire Width (mm)
    type: number
    default: 245
    step: 5
    min: 135
    max: 355
    placeholder: "e.g., 245"

  - id: newAspect
    label: New Aspect Ratio (%)
    type: number
    default: 40
    step: 5
    min: 20
    max: 90
    placeholder: "e.g., 40"

  - id: newRim
    label: New Rim Diameter (Inches)
    type: number
    default: 18
    step: 1
    min: 12
    max: 26
    placeholder: "e.g., 18"

  - id: indicatedSpeed
    label: Speedometer Reading (MPH)
    type: number
    default: 65
    step: 5
    min: 10
    max: 160
    placeholder: "e.g., 65"

outputs:
  - id: origDiameter
    label: Stock Overall Tire Diameter
  - id: newDiameter
    label: New Overall Tire Diameter
  - id: diameterDiffPercent
    label: Overall Diameter Difference (%)
  - id: actualSpeed
    label: Actual Real-World Vehicle Speed
  - id: speedErrorMph
    label: Speedometer Error (MPH Difference)
  - id: revsPerMileDiff
    label: Revolutions Per Mile Difference

charts:
  tabs:
    - id: speedComparison
      label: Indicated vs Actual Speed Comparison
    - id: diameterComparison
      label: Stock vs New Tire Overall Dimensions

history_columns:
  - origDiameter
  - newDiameter
  - diameterDiffPercent
  - actualSpeed
  - speedErrorMph

js_file: assets/js/calculators/tire-size-speedometer-error-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Tire Size Speedometer Error Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate speedometer reading error and true actual vehicle speed when upsizing or plus-sizing custom wheels and tires."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "P-metric tire diameter calculation ($2 \times \text{sidewall} + \text{rim}$)"
    - "Speedometer percent error calculation"
    - "Revolutions per mile calculation for stock vs aftermarket tires"
    - "3% diameter threshold clearance warning"
    - "100% private local execution"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Tire Size Speedometer Error Calculator

howto:
  name: "How to Calculate Tire Size Speedometer Error"
  description: "Follow these steps to check speedometer accuracy when changing tire or wheel sizes."
  step:
    - name: "Enter stock tire dimensions"
      text: "Input original tire width (mm), aspect ratio (%), and wheel diameter in inches (e.g. 225/45R17)."
    - name: "Enter new tire dimensions"
      text: "Input aftermarket tire width, aspect ratio, and rim diameter (e.g. 245/40R18)."
    - name: "Set target speedometer reading"
      text: "Provide highway speed reading in MPH (e.g. 65 mph)."
    - name: "Review actual speed and diameter error"
      text: "Instantly view actual real-world speed, speedometer error in MPH, and percent diameter change."

faq:
  - question: "How do custom tire sizes affect speedometer accuracy?"
    answer: "Vehicle speedometers calculate vehicle speed by counting wheel revolutions per minute. If you install taller tires, each revolution covers a greater distance, making your actual speed faster than the speedometer indicates."
  - question: "How do you calculate overall tire diameter from P-metric specs?"
    answer: "$\text{Diameter (inches)} = \text{Rim Diameter} + left( 2 \times \frac{\text{Width (mm)} \times (\text{Aspect Ratio} / 100)}{25.4} \right)$."
  - question: "What is the recommended maximum tire diameter change threshold?"
    answer: "Automotive engineers recommend keeping overall tire diameter changes within ±3% of original factory specifications to avoid ABS, traction control, transmission shift point, and speedo calibration errors."
  - question: "How do I calculate revolutions per mile (RPM) for a tire?"
    answer: "$\text{Revolutions per Mile} = \frac{63,360}{\\pi \times \text{Overall Diameter (inches)}}$."
  - question: "What happens if my new tires are smaller in diameter than stock?"
    answer: "Smaller tires rotate faster for any given speed, causing your speedometer to read faster than your actual ground speed, while artificially inflating recorded odometer mileage."
  - question: "Can a vehicle speedometer be recalibrated for larger tires?"
    answer: "Yes, many modern vehicles can be recalibrated via an OBD-II diagnostic tuner tool, dealership software, or speedometer recalibration module."
  - question: "Does the tire size speedometer error calculator store my data?"
    answer: "No. All calculations take place 100% locally within your browser session."

---

# Tire Size Speedometer Error Calculator

Calculate your **actual vehicle speed versus speedometer reading** and overall diameter difference when changing tire widths, aspect ratios, or wheel rim sizes.

<!-- more -->

## Why Calculate Tire Size & Speedometer Errors?

Vehicle speedometers and odometers measure wheel shaft rotation frequency based on factory tire outer diameter. Changing tire sidewall height or wheel diameter alters tire rolling circumference, introducing speedometer calibration errors and affecting transmission shift points.

Key tire fitment parameters:
- **Section Width**: Width of the tire tread in millimeters (e.g. 225 mm).
- **Aspect Ratio**: Sidewall height expressed as a percentage of width (e.g. 45%).
- **Rim Diameter**: Wheel diameter in inches (e.g. 17 inches).

---

## Tire Sizing Calculation Flow

<div class="flow-chart">
  <div class="flow-title">Tire Diameter & Speedometer Error Flow</div>
  <div class="flow-section">
    <div class="flow-section-title">📥 Inputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Stock Specs (Width / Aspect / Rim)</div>
      <div class="flow-input">New Specs (Width / Aspect / Rim)</div>
      <div class="flow-input">Indicated Speed (MPH)</div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 1</div>
    <div class="flow-box">
      <div class="flow-box-title">Calculate Diameters & Circumferences</div>
      <div class="flow-box-content">
        \[ D_{\text{orig}} = R_{\text{orig}} + \left(2 \times \frac{W_{\text{orig}} \times A_{\text{orig}} / 100}{25.4}\right) \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 2</div>
    <div class="flow-box">
      <div class="flow-box-title">Calculate Actual Ground Speed</div>
      <div class="flow-box-content">
        \[ v_{\text{actual}} = v_{\text{indicated}} \times \left( \frac{D_{\text{new}}}{D_{\text{orig}}} \right) \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-section-title">📊 Outputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Actual Speed (MPH)</div>
      <div class="flow-input">Speedometer Error (MPH)</div>
      <div class="flow-input">Diameter Diff (%)</div>
    </div>
  </div>
</div>

---

## Mathematical Formulas

### 1. Overall Tire Diameter ($D_{\text{inches}}$)
\[
D_{\text{inches}} = D_{\text{rim}} + \left( \frac{2 \times W_{\text{mm}} \times (A_{\%}/100)}{25.4} \right)
\]

### 2. Diameter Difference Percentage ($\Delta_{\%}$)
\[
\Delta_{\%} = \left( \frac{D_{\text{new}} - D_{\text{orig}}}{D_{\text{orig}}} \right) \times 100
\]

### 3. Actual Vehicle Speed ($v_{\text{actual}}$)
\[
v_{\text{actual}} = v_{\text{indicated}} \times \left( \frac{D_{\text{new}}}{D_{\text{orig}}} \right)
\]

### 4. Tire Revolutions Per Mile ($\text{RPM}_{\text{mile}}$)
\[
\text{RPM}_{\text{mile}} = \frac{63,360}{\pi \times D_{\text{inches}}}
\]

---

## Real-World Tire Size Comparison Matrix

| Stock Size | New Plus Size | Stock Diameter | New Diameter | Diameter Diff % | Speedo Reading @ 65 MPH | Actual Speed |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **225/45R17** | **245/40R18** | 24.97 in | **25.72 in** | **+2.99%** | 65.0 MPH | **66.9 MPH** |
| **205/55R16** | **225/45R17** | 24.88 in | **24.97 in** | **+0.37%** | 65.0 MPH | **65.2 MPH** |
| **265/70R17** | **285/70R17** | 31.61 in | **32.71 in** | **+3.48%** | 65.0 MPH | **67.3 MPH** |
| **235/40R19** | **255/35R20** | 26.40 in | **27.03 in** | **+2.38%** | 65.0 MPH | **66.5 MPH** |

---

## Step-by-Step Usage Guide

1. **Enter Factory Tire Size**: Input stock width (e.g. 225 mm), aspect ratio (45), and rim size (17 inches).
2. **Enter Aftermarket Tire Size**: Input new width (e.g. 245 mm), aspect ratio (40), and rim size (18 inches).
3. **Set Speedometer Reading**: Enter cruising speed shown on your instrument cluster (e.g. 65 mph).
4. **Review Speed & Diameter Error**: Verify whether overall diameter change is within safe ±3% limits.

---

## Frequently Asked Questions

### How do custom tire sizes affect speedometer accuracy?
Vehicle speedometers calculate vehicle speed by counting wheel revolutions per minute. If you install taller tires, each revolution covers a greater distance, making your actual speed faster than the speedometer indicates.

### How do you calculate overall tire diameter from P-metric specs?
$\text{Diameter (inches)} = \text{Rim Diameter} + \left( 2 \times \frac{\text{Width (mm)} \times (\text{Aspect Ratio} / 100)}{25.4} \right)$.

### What is the recommended maximum tire diameter change threshold?
Automotive engineers recommend keeping overall tire diameter changes within ±3% of original factory specifications to avoid ABS, traction control, transmission shift point, and speedo calibration errors.

### How do I calculate revolutions per mile (RPM) for a tire?
$\text{Revolutions per Mile} = \frac{63,360}{\pi \times \text{Overall Diameter (inches)}}$.

### What happens if my new tires are smaller in diameter than stock?
Smaller tires rotate faster for any given speed, causing your speedometer to read faster than your actual ground speed, while artificially inflating recorded odometer mileage.

### Can a vehicle speedometer be recalibrated for larger tires?
Yes, many modern vehicles can be recalibrated via an OBD-II diagnostic tuner tool, dealership software, or speedometer recalibration module.

### Does the tire size speedometer error calculator store my data?
No. All calculations take place 100% locally within your browser session.
