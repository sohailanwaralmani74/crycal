---
layout: tool
title: Gear Ratio Calculator – Highway RPM & Vehicle Speed
description: Calculate engine RPM at highway speeds based on transmission gear ratios, tire overall diameter, final drive axle ratio, and vehicle speed.
permalink: /gear-ratio-calculator
tool_id: gear-ratio-calculator
category: auto-performance-specs
hide_sidebar: true

inputs:
  - id: gearRatio
    label: Transmission Gear Ratio
    type: number
    default: 0.82
    step: 0.01
    min: 0.50
    max: 6.00
    placeholder: "e.g., 0.82"

  - id: finalDrive
    label: Final Drive / Differential Axle Ratio
    type: number
    default: 3.73
    step: 0.01
    min: 1.50
    max: 6.50
    placeholder: "e.g., 3.73"

  - id: tireDiameter
    label: Tire Overall Diameter (Inches)
    type: number
    default: 26.5
    step: 0.5
    min: 15.0
    max: 45.0
    placeholder: "e.g., 26.5"

  - id: vehicleSpeed
    label: Target Vehicle Speed (MPH)
    type: number
    default: 70
    step: 5
    min: 5
    max: 220
    placeholder: "e.g., 70"

outputs:
  - id: engineRpm
    label: Engine Cruising Speed (RPM)
  - id: overallRatio
    label: Total Overall Drive Ratio
  - id: speedAt2000Rpm
    label: Vehicle Speed at 2,000 RPM
  - id: speedAt3000Rpm
    label: Vehicle Speed at 3,000 RPM
  - id: speedAtRedline
    label: Theoretical Speed at Redline (6,500 RPM)

charts:
  tabs:
    - id: rpmVsSpeed
      label: RPM vs Cruising Speed Trajectory
    - id: gearShiftSpeed
      label: Speed Across Gears (1st through 6th)

history_columns:
  - engineRpm
  - overallRatio
  - speedAt2000Rpm
  - speedAt3000Rpm

js_file: assets/js/calculators/gear-ratio-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Gear Ratio Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate engine RPM at highway speeds based on transmission gear ratios, final drive ratios, and tire height."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Engine RPM cruising speed calculation"
    - "Total overall gear ratio multiplication"
    - "Speed at specific RPM milestones (2,000 RPM, 3,000 RPM, 6,500 RPM)"
    - "Tire height diameter conversion math"
    - "100% private local execution"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Gear Ratio Calculator

howto:
  name: "How to Calculate Engine RPM from Gear Ratios and Speed"
  description: "Follow these steps to determine highway cruising RPM and top speed per gear."
  step:
    - name: "Enter transmission gear ratio"
      text: "Input selected gear ratio (e.g. 0.82 for overdrive 5th/6th gear)."
    - name: "Provide final drive axle ratio"
      text: "Enter differential ring-and-pinion ratio (e.g. 3.73)."
    - name: "Input tire diameter"
      text: "Specify tire overall height in inches (e.g. 26.5 inches)."
    - name: "Set target vehicle speed"
      text: "Enter cruising speed in MPH (e.g. 70 mph)."
    - name: "Review calculated RPM and speeds"
      text: "Instantly view engine RPM, total drive ratio, and vehicle speed at key RPM markers."

faq:
  - question: "What is the formula for calculating engine RPM from speed and gear ratio?"
    answer: "$\text{RPM} = \frac{\text{MPH} \times \text{Transmission Ratio} \times \text{Final Drive Ratio} \times 336}{\text{Tire Diameter (inches)}}$."
  - question: "What is a final drive ratio?"
    answer: "The final drive ratio (or axle ratio) is the ring-and-pinion gear ratio in the differential that multiplies transmission output speed before rotating the drive axles."
  - question: "How does changing tire size affect engine RPM?"
    answer: "Installing taller tires increases rolling circumference, lowering engine RPM at any given speed. Installing shorter tires increases engine RPM."
  - question: "What is an overdrive gear ratio?"
    answer: "An overdrive gear has a ratio numerical value below 1.00:1 (e.g. 0.70:1). The driveshaft rotates faster than the engine crankshaft, lowering RPM for high-speed fuel economy."
  - question: "Why do shorter axle ratios (e.g. 4.10 vs 3.31) improve off-the-line acceleration?"
    answer: "Numerically higher ratios multiply engine torque more aggressively at the drive wheels, increasing initial acceleration force at the expense of higher highway cruising RPM."
  - question: "How do I find my vehicle's tire diameter in inches?"
    answer: "For a 225/45R17 tire: $\text{Diameter} = 17 + 2 \times (225 \times 0.45 / 25.4) = 24.97 \text{ inches}$."
  - question: "Does the gear ratio calculator store my data?"
    answer: "No. All calculations take place 100% locally in your browser."

---

# Gear Ratio Calculator

Calculate engine speed in **RPM at highway speeds** based on transmission gear ratios, final drive axle ratio, tire overall diameter, and target vehicle speed.

<!-- more -->

## Why Calculate Gear Ratios & Cruising RPM?

Transmission and differential gear ratios dictate how engine rotation is translated into wheel speed and torque multiplication. Selecting the right gear ratio balances low-end launch acceleration against comfortable, fuel-efficient highway cruising RPM.

Key drivetrain variables:
- **Transmission Gear Ratio ($G_t$)**: Gear ratio selected inside the transmission box.
- **Final Drive Ratio ($G_f$)**: Ring and pinion differential gear reduction.
- **Tire Overall Diameter ($D_{\text{tire}}$)**: Height of the loaded tire in inches.

---

## Gear Ratio Calculation Flow

<div class="flow-chart">
  <div class="flow-title">Drivetrain RPM & Speed Flow</div>
  <div class="flow-section">
    <div class="flow-section-title">📥 Inputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Gear Ratio</div>
      <div class="flow-input">Final Drive Ratio</div>
      <div class="flow-input">Tire Diameter (inches)</div>
      <div class="flow-input">Vehicle Speed (MPH)</div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 1</div>
    <div class="flow-box">
      <div class="flow-box-title">Total Drive Multiplication</div>
      <div class="flow-box-content">
        \[ G_{\text{total}} = G_{\text{gear}} \times G_{\text{final}} \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-step">Step 2</div>
    <div class="flow-box">
      <div class="flow-box-title">Calculate Cruising Engine RPM</div>
      <div class="flow-box-content">
        \[ \text{RPM} = \frac{v_{\text{mph}} \times G_{\text{total}} \times 336}{D_{\text{tire}}} \]
      </div>
    </div>
  </div>
  <div class="flow-arrow">↓</div>
  <div class="flow-section">
    <div class="flow-section-title">📊 Outputs</div>
    <div class="flow-inputs">
      <div class="flow-input">Engine Cruising Speed (RPM)</div>
      <div class="flow-input">Overall Gear Ratio</div>
      <div class="flow-input">Speed at 2,000 / 3,000 / Redline RPM</div>
    </div>
  </div>
</div>

---

## Mathematical Formulas

### 1. Overall Drive Ratio ($G_{\text{total}}$)
\[
G_{\text{total}} = G_{\text{gear}} \times G_{\text{final}}
\]

### 2. Engine Speed in RPM ($\text{RPM}$)
\[
\text{RPM} = \frac{v_{\text{mph}} \times G_{\text{total}} \times 336.135}{D_{\text{tire}}}
\]

### 3. Vehicle Speed at Target RPM ($v_{\text{mph}}$)
\[
v_{\text{mph}} = \frac{\text{RPM} \times D_{\text{tire}}}{G_{\text{total}} \times 336.135}
\]

---

## Real-World Cruising RPM Benchmark Table (70 MPH Target / 26.5" Tire)

| Gear Description | Transmission Ratio | Final Drive | Overall Ratio | Engine Speed @ 70 MPH | Speed @ 2,000 RPM |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1st Gear (Launch)** | 3.82 | 3.73 | 14.25:1 | **12,680 RPM (Over-rev)** | 11.0 MPH |
| **3rd Gear (Direct Drive)** | 1.34 | 3.73 | 5.00:1 | **4,449 RPM** | 31.5 MPH |
| **5th Gear (Overdrive 1)** | 0.82 | 3.73 | 3.06:1 | **2,723 RPM** | 51.4 MPH |
| **6th Gear (Tall Highway)** | 0.64 | 3.73 | 2.39:1 | **2,125 RPM** | 65.9 MPH |
| **6th Gear (Towing Axle)** | 0.64 | 4.10 | 2.62:1 | **2,335 RPM** | 60.0 MPH |

---

## Step-by-Step Usage Guide

1. **Enter Gear Ratio**: Input selected transmission gear ratio (e.g. 0.82 for 5th gear).
2. **Provide Final Drive**: Input differential axle ratio (e.g. 3.73).
3. **Set Tire Diameter**: Provide total tire height in inches (e.g. 26.5 inches).
4. **Select Vehicle Speed**: Enter target cruising speed in MPH (e.g. 70 mph).
5. **Analyze Cruising Metrics**: Review calculated engine RPM and theoretical speeds per gear.

---

## Frequently Asked Questions

### What is the formula for calculating engine RPM from speed and gear ratio?
$\text{RPM} = \frac{\text{MPH} \times \text{Transmission Ratio} \times \text{Final Drive Ratio} \times 336}{\text{Tire Diameter (inches)}}$.

### What is a final drive ratio?
The final drive ratio (or axle ratio) is the ring-and-pinion gear ratio in the differential that multiplies transmission output speed before rotating the drive axles.

### How does changing tire size affect engine RPM?
Installing taller tires increases rolling circumference, lowering engine RPM at any given speed. Installing shorter tires increases engine RPM.

### What is an overdrive gear ratio?
An overdrive gear has a ratio numerical value below 1.00:1 (e.g. 0.70:1). The driveshaft rotates faster than the engine crankshaft, lowering RPM for high-speed fuel economy.

### Why do shorter axle ratios (e.g. 4.10 vs 3.31) improve off-the-line acceleration?
Numerically higher ratios multiply engine torque more aggressively at the drive wheels, increasing initial acceleration force at the expense of higher highway cruising RPM.

### How do I find my vehicle's tire diameter in inches?
For a 225/45R17 tire: $\text{Diameter} = 17 + 2 \times (225 \times 0.45 / 25.4) = 24.97 \text{ inches}$.

### Does the gear ratio calculator store my data?
No. All calculations take place 100% locally in your browser.
