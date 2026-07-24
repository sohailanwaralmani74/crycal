---
layout: tool
title: "Plus Size Wheel Fitment | Interactive Online Tool"
description: "Calculate Plus 1, Plus 2, and Plus 3 wheel sizing setups. Verify overall tire diameter stays within the safe 3% threshold when increasing rim diameter."
permalink: /plus-size-wheel-fitment-calculator
tool_id: plus-size-wheel-fitment-calculator
category: auto-tires-wheels
hide_sidebar: true

inputs:
  - id: oem_width
    label: OEM Tire Width (mm)
    type: number
    default: 205
    step: 5
    min: 135
    max: 355
    placeholder: "e.g. 205"

  - id: oem_aspect
    label: OEM Aspect Ratio (%)
    type: number
    default: 55
    step: 5
    min: 20
    max: 90
    placeholder: "e.g. 55"

  - id: oem_rim
    label: OEM Rim Diameter (inches)
    type: number
    default: 16
    step: 1
    min: 10
    max: 24
    placeholder: "e.g. 16"

  - id: target_upsize
    label: Upsizing Concept Tier
    type: select
    default: "1"
    options:
      - value: "1"
        label: "Plus 1 (+1 inch rim size)"
      - value: "2"
        label: "Plus 2 (+2 inches rim size)"
      - value: "3"
        label: "Plus 3 (+3 inches rim size)"

  - id: new_width
    label: Proposed New Tire Width (mm)
    type: number
    default: 225
    step: 5
    min: 135
    max: 355
    placeholder: "e.g. 225"

  - id: new_aspect
    label: Proposed New Aspect Ratio (%)
    type: number
    default: 45
    step: 5
    min: 20
    max: 90
    placeholder: "e.g. 45"

outputs:
  - id: oem_diameter
    label: OEM Overall Diameter
  - id: new_diameter
    label: Plus-Sized Overall Diameter
  - id: diameter_pct_diff
    label: Diameter Difference (%)
  - id: fitment_status
    label: Compliance Fitment Status
  - id: speedo_reading_60
    label: Actual Speed at 60 mph

charts:
  tabs:
    - id: diameter_comparison
      label: Diameter Compliance & Plus Sizing

history_columns:
  - key: oem_diameter
    label: OEM Diam
    source: output
  - key: new_diameter
    label: Plus Diam
    source: output
  - key: fitment_status
    label: Fitment Status
    source: output

js_file: assets/js/calculators/plus-size-wheel-fitment-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Plus-Size Wheel Fitment Calculator"
  applicationCategory: "UtilityApplication"
  operatingSystem: "All"
  description: "Calculate Plus 1, Plus 2, and Plus 3 wheel upsizing options while keeping overall tire diameter within 3% tolerance."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Plus 1, Plus 2, and Plus 3 wheel sizing validation"
    - "Overall tire height comparison within 3% margin"
    - "Speedometer variance output"
    - "100% Private local browser script"

breadcrumb:
  - name: Home
    url: /
  - name: Automotive
    url: /automotive
  - name: Plus-Size Wheel Fitment Calculator

howto:
  name: "How to Calculate Plus-Size Wheel Fitment"
  description: "Follow these steps to upsize your wheels using Plus 1 or Plus 2 sizing rules."
  step:
    - name: "Enter Stock Factory Sizing"
      text: "Input your factory OEM tire width, aspect ratio, and rim diameter."
    - name: "Select Plus Tier"
      text: "Choose whether you are moving up 1 inch (Plus 1), 2 inches (Plus 2), or 3 inches (Plus 3) in wheel diameter."
    - name: "Input Proposed Plus Tire Specs"
      text: "Enter your target wider tire width and lower aspect ratio."
    - name: "Verify 3% Threshold"
      text: "Ensure the percentage change in overall tire height remains between -3% and +3%."

faq:
  - question: "What is Plus 1 wheel upsizing?"
    answer: "Plus 1 sizing increases wheel rim diameter by 1 inch while reducing sidewall aspect ratio (and usually increasing section width) to keep total outer tire height virtually identical to stock."
  - question: "What is Plus 2 wheel upsizing?"
    answer: "Plus 2 sizing increases wheel rim diameter by 2 inches (e.g. from 16\" to 18\") while using a lower-profile tire to maintain OEM overall diameter within ±3%."
  - question: "Why is it important to keep overall tire diameter within 3%?"
    answer: "Keeping overall tire height within 3% preserves original gearing ratios, maintains ABS and traction control sensor calibration, and prevents speedometer inaccuracies."
  - question: "What are the performance benefits of Plus sizing?"
    answer: "Plus sizing increases tire contact patch width and shortens sidewall height, reducing sidewall flex during hard cornering for sharper steering response and improved dry handling."
  - question: "Does Plus sizing make the ride harsher?"
    answer: "Yes. Shorter sidewalls provide less rubber cushioning, resulting in a firmer, stiffer ride over bumps and potholes."
  - question: "Can Plus sizing cause rim damage from potholes?"
    answer: "Low profile tires used in Plus 2 and Plus 3 fitments have less sidewall cushion, increasing the likelihood of rim damage if hitting severe potholes at speed."
  - question: "Are my wheel sizing choices stored online?"
    answer: "No. All calculations run strictly inside your web browser."

---

# Plus Size Wheel Fitment Calculator

Calculate Plus 1, Plus 2, and Plus 3 wheel sizing configurations with our free **Plus-Size Wheel Fitment Calculator**. Ensure target tire height remains within **±3% of stock specs** for safe handling and accurate speedometer calibration.

<!-- more -->

## Why Use a Plus-Size Wheel Fitment Calculator?

Plus sizing is the industry-standard method for upgrading to larger, sportier alloy wheels while retaining original vehicle suspension geometry and rolling radius.

If you mount larger wheels without decreasing tire sidewall height proportionally, the overall tire diameter grows too large—causing speedometer errors, rubbing against fenders, and sluggish acceleration.

---

## Calculation Flow & Mathematical Formulas

Plus sizing follows standard rim diameter additions paired with lower aspect ratios:

### Inputs & Parameters

| Parameter | Unit | Description |
| :--- | :--- | :--- |
| **OEM Width (\(W_{oem}\))** | mm | Factory tire section width |
| **OEM Aspect (\(AR_{oem}\))** | % | Factory aspect ratio |
| **OEM Rim (\(R_{oem}\))** | inches | Factory wheel diameter |
| **Plus Tier (\(K\))** | inches | Plus 1 (+1"), Plus 2 (+2"), Plus 3 (+3") |

---

### Step-by-Step Formulas

#### 1. OEM Overall Diameter (\(D_{oem}\))
\[
H_{oem\_sw} = \frac{W_{oem} \times \frac{AR_{oem}}{100}}{25.4}
\]
\[
D_{oem} = R_{oem} + (2 \times H_{oem\_sw}) \quad \text{(in inches)}
\]

#### 2. Plus-Sized Rim & Overall Diameter (\(D_{plus}\))
\[
R_{plus} = R_{oem} + K
\]
\[
H_{plus\_sw} = \frac{W_{new} \times \frac{AR_{new}}{100}}{25.4}
\]
\[
D_{plus} = R_{plus} + (2 \times H_{plus\_sw}) \quad \text{(in inches)}
\]

#### 3. Compliance Percentage Variance (\(\Delta D_{\%}\))
\[
\Delta D_{\%} = \left(\frac{D_{plus} - D_{oem}}{D_{oem}}\right) \times 100
\]

---

## Plus-Sizing Matrix Example

| Upgrade Tier | OEM Spec | Proposed Plus Spec | OEM Diam | Plus Diam | Diam Diff (%) | Fitment Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OEM Baseline** | 205/55R16 | — | 24.88" | — | 0.00% | Stock |
| **Plus 1 (+1")** | 205/55R16 | **225/45R17** | 24.88" | 24.97" | +0.36% | **Optimal Fit** |
| **Plus 2 (+2")** | 205/55R16 | **225/40R18** | 24.88" | 25.09" | +0.84% | **Optimal Fit** |
| **Plus 3 (+3")** | 205/55R16 | **235/35R19** | 24.88" | 25.48" | +2.41% | **Acceptable (< 3%)** |

---

## Step-by-Step How-To Guide

1. **Enter OEM Specs**: Read stock tire dimensions off door pillar (e.g. `205/55R16`).
2. **Select Plus Upgrade**: Choose Plus 1 (+1" wheel), Plus 2 (+2" wheel), or Plus 3 (+3" wheel).
3. **Select New Width & Profile**: Test wider widths (e.g. `225`) paired with lower aspect ratios (e.g. `45` or `40`).
4. **Check Compliance**: Verify green "Optimal Fit" or "Acceptable" status under 3% difference.

---

## Frequently Asked Questions

### What is Plus 1 wheel upsizing?
Plus 1 sizing increases wheel rim diameter by 1 inch while reducing sidewall aspect ratio (and usually increasing section width) to keep total outer tire height virtually identical to stock.

### What is Plus 2 wheel upsizing?
Plus 2 sizing increases wheel rim diameter by 2 inches (e.g. from 16" to 18") while using a lower-profile tire to maintain OEM overall diameter within ±3%.

### Why is it important to keep overall tire diameter within 3%?
Keeping overall tire height within 3% preserves original gearing ratios, maintains ABS and traction control sensor calibration, and prevents speedometer inaccuracies.

### What are the performance benefits of Plus sizing?
Plus sizing increases tire contact patch width and shortens sidewall height, reducing sidewall flex during hard cornering for sharper steering response and improved dry handling.

### Does Plus sizing make the ride harsher?
Yes. Shorter sidewalls provide less rubber cushioning, resulting in a firmer, stiffer ride over bumps and potholes.

### Can Plus sizing cause rim damage from potholes?
Low profile tires used in Plus 2 and Plus 3 fitments have less sidewall cushion, increasing the likelihood of rim damage if hitting severe potholes at speed.

### Are my wheel sizing choices stored online?
No. All calculations run strictly inside your web browser.
