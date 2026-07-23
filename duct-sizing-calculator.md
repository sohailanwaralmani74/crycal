---
layout: tool
title: Duct Sizing Calculator – Round Flex Duct Diameter (CFM & FPM)
description: Calculate required round flex duct diameter in inches based on HVAC airflow (CFM), recommended air velocity (FPM), and pressure drop loss.
permalink: /duct-sizing-calculator
tool_id: duct-sizing-calculator
category: insulation-hvac
hide_sidebar: true

inputs:
  - id: airflowCFM
    label: Target Airflow Volume (CFM - Cubic Feet per Min)
    type: number
    default: 400
    step: 25
    min: 50
    placeholder: "e.g., 400"

  - id: airVelocityFPM
    label: Recommended Air Velocity (FPM - Feet per Min)
    type: number
    default: 700
    step: 50
    min: 300
    max: 2000
    placeholder: "e.g., 700"

  - id: ductFrictionLoss
    label: Friction Loss Factor (Inches w.g. / 100 ft)
    type: number
    default: 0.10
    step: 0.01
    min: 0.05
    max: 0.30
    placeholder: "e.g., 0.10"

  - id: ductLengthFt
    label: Total Run Length of Flex Duct (Feet)
    type: number
    default: 25
    step: 5
    min: 5
    placeholder: "e.g., 25"

outputs:
  - id: exactDuctDiameterInches
    label: Calculated Exact Duct Diameter
  - id: recommendedDuctDiameterInches
    label: Standard Recommended Round Duct Size
  - id: ductCrossSectionAreaSqFt
    label: Duct Cross-Sectional Area
  - id: totalPressureDropInches
    label: Estimated Friction Pressure Drop

charts:
  tabs:
    - id: airflowVsVelocity
      label: CFM vs Air Velocity Proportion
    - id: ductSizeComparison
      label: Exact vs Recommended Duct Size

history_columns:
  - key: airflowCFM
    label: Airflow (CFM)
    source: input
  - key: airVelocityFPM
    label: Velocity (FPM)
    source: input
  - key: exactDuctDiameterInches
    label: Exact Size (in)
    source: output
  - key: recommendedDuctDiameterInches
    label: Rec. Size (in)
    source: output
  - key: totalPressureDropInches
    label: Pressure Drop
    source: output

js_file: assets/js/calculators/duct-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Duct Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate round HVAC duct diameter in inches based on airflow CFM, velocity FPM, and static friction pressure loss."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Duct Cross-Sectional Area Calculation — converts cubic feet per minute to required duct area"
    - "Round Duct Diameter Sizing — calculates exact internal diameter using fluid dynamics equations"
    - "Standard Commercial Size Rounding — rounds up to nearest standard trade duct size (6, 8, 10, 12, 14, 16 in)"
    - "Static Pressure Loss Estimator — calculates friction loss per 100 feet of duct run"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Duct Sizing Calculator

howto:
  name: "How to Size Round Flex & Rigid HVAC Ducts"
  description: "Determine exact round duct diameter in inches for supply and return air runs based on CFM requirements."
  step:
    - name: "Determine Required Airflow (CFM)"
      text: "Calculate required airflow for the room or zone (approx. 400 CFM per 1 ton of cooling)."
    - name: "Set Target Air Velocity (FPM)"
      text: "Choose velocity limit (600–700 FPM for branch flex ducts; 700–900 FPM for main supply trunks)."
    - name: "Enter Friction Rate & Length"
      text: "Specify friction loss (standard is 0.10 in w.g. per 100 ft) and total duct run length."
    - name: "Get Duct Size"
      text: "Review exact calculated diameter and select recommended standard round duct trade size."

faq:
  - question: "How do I calculate required duct size for a given CFM?"
    answer: "Divide CFM by air velocity in FPM to get duct area in square feet ($A = \text{CFM} / \text{FPM}$). Convert to square inches by multiplying by 144, then solve for round diameter $d = sqrt{(4 \times A) / pi}$."
  - question: "What size duct is needed for 400 CFM airflow?"
    answer: "At a standard residential branch duct velocity of 700 FPM, 400 CFM requires an exact diameter of 10.2 inches, which rounds up to a standard 10-inch or 12-inch round flex duct."
  - question: "What is recommended air velocity (FPM) in residential ductwork?"
    answer: "Branch ducts and flex runs should maintain 600 to 700 FPM to prevent noise. Main supply trunk ducts operate at 700 to 900 FPM. Main return trunks run at 600 to 800 FPM."
  - question: "What CFM is required per ton of air conditioning?"
    answer: "A standard central HVAC cooling system requires approximately 400 CFM of airflow per 1 ton (12,000 BTU) of cooling capacity (e.g., a 3-ton unit needs 1,200 CFM)."
  - question: "Why does flexible ducting have higher pressure loss than rigid sheet metal?"
    answer: "Flex duct has inner corrugated wire ribbing and sag that creates friction resistance, increasing static pressure drop by 20% to 50% compared to smooth galvanized sheet metal."
  - question: "What happens if an HVAC duct is undersized?"
    answer: "Undersized ducts create high static pressure, noisy air registers, restricted airflow, uneven room cooling/heating, and premature blower motor failure."
  - question: "Is my personal data saved anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Duct Sizing Calculator – Round Flex Duct Diameter (CFM & FPM)

Calculate required **round HVAC duct diameters in inches**, cross-sectional airflow area, and estimated **friction pressure drop** using our **Duct Sizing Calculator**.

<!-- more -->

## Why Use a Duct Sizing Calculator?

Properly sized HVAC ductwork ensures efficient heating and air conditioning distribution without noisy air registers or high static head pressure on blower fans. Sizing ducts based on target airflow (CFM) and velocity limits (FPM) prevents under-cooling rooms or straining HVAC compressors.

- **Airflow-Velocity Fluid Math**: Uses standard continuity equation $Q = A \times V$ to derive exact duct cross-sections.
- **Trade Standard Rounding**: Automatically rounds calculated exact diameters up to standard commercial duct diameters (4", 6", 8", 10", 12", 14", 16", 18", 20").
- **Friction Loss Pressure Drop**: Estimates total static pressure loss across flexible duct runs based on total run length.
- **Noise & Velocity Protection**: Keeps airflow velocities under 700 FPM to ensure quiet residential operation.

---

## HVAC Duct Sizing Formulas

$$\text{Duct Area (sq ft)} = \frac{\text{Airflow (CFM)}}{\text{Air Velocity (FPM)}}$$

$$\text{Duct Area (sq in)} = \text{Duct Area (sq ft)} \times 144 = \frac{\text{CFM} \times 144}{\text{FPM}}$$

$$\text{Exact Diameter (in)} = \sqrt{\frac{4 \times \text{Duct Area (sq in)}}{\pi}} = \sqrt{\frac{576 \times \text{CFM}}{\pi \times \text{FPM}}}$$

$$\text{Recommended Size (in)} = \text{Next Even Standard Round Size } \ge \text{Exact Diameter}$$

$$\text{Friction Loss (in w.g.)} = \text{Friction Factor} \times \left(\frac{\text{Run Length (ft)}}{100}\right)$$

---

## Round Duct Airflow Reference Table (at 700 FPM Velocity, 0.10" w.g. friction)

The table below outlines airflow capacities across standard residential round duct sizes:

| Standard Duct Size | Cross-Section Area | Airflow Capacity (at 600 FPM) | Airflow Capacity (at 700 FPM) | Airflow Capacity (at 900 FPM) | Typical Application |
|---|---|---|---|---|---|
| **6-Inch Round** | 0.196 sq ft | 118 CFM | **137 CFM** | 176 CFM | Small Bedroom Branch |
| **8-Inch Round** | 0.349 sq ft | 209 CFM | **244 CFM** | 314 CFM | Master Bedroom / Living Room |
| **10-Inch Round** | 0.545 sq ft | 327 CFM | **382 CFM** | 491 CFM | Large Zone Branch Run |
| **12-Inch Round** | 0.785 sq ft | 471 CFM | **550 CFM** | 707 CFM | 1.5-Ton Sub-Trunk Line |
| **14-Inch Round** | 1.069 sq ft | 641 CFM | **748 CFM** | 962 CFM | 2.0-Ton Main Supply Trunk |
| **16-Inch Round** | 1.396 sq ft | 838 CFM | **977 CFM** | 1,256 CFM | 3.0-Ton Main Return Trunk |

---

## Step-by-Step Guide: How to Size HVAC Branch Ducts

1. **Calculate Heat Load CFM**: Determine required CFM for each room (Room Sq Ft × CFM factor, typically 0.8 to 1.2 CFM/sq ft depending on climate).
2. **Select Velocity Level**: Choose 600 FPM for bedroom supply branches, 700 FPM for main living rooms, or 800 FPM for return trunks.
3. **Calculate Duct Area**: Divide CFM requirement by target velocity in FPM to get duct area in square feet.
4. **Determine Round Diameter**: Use the diameter equation or standard duct chart to find exact diameter in inches.
5. **Select Flex Duct Size**: Choose the next standard even size (e.g., 7.2" exact diameter requires an 8" flex duct). Pull flex duct taut during installation to avoid airflow friction sags.

---

## Frequently Asked Questions

### How do I calculate required duct size for a given CFM?
Divide CFM by air velocity in FPM to get duct area in square feet ($A = \text{CFM} / \text{FPM}$). Convert to square inches by multiplying by 144, then solve for round diameter $d = \sqrt{(4 \times A) / \pi}$.

### What size duct is needed for 400 CFM airflow?
At a standard residential branch duct velocity of 700 FPM, 400 CFM requires an exact diameter of 10.2 inches, which rounds up to a standard 10-inch or 12-inch round flex duct.

### What is recommended air velocity (FPM) in residential ductwork?
Branch ducts and flex runs should maintain 600 to 700 FPM to prevent noise. Main supply trunk ducts operate at 700 to 900 FPM. Main return trunks run at 600 to 800 FPM.

### What CFM is required per ton of air conditioning?
A standard central HVAC cooling system requires approximately 400 CFM of airflow per 1 ton (12,000 BTU) of cooling capacity (e.g., a 3-ton unit needs 1,200 CFM).

### Why does flexible ducting have higher pressure loss than rigid sheet metal?
Flex duct has inner corrugated wire ribbing and sag that creates friction resistance, increasing static pressure drop by 20% to 50% compared to smooth galvanized sheet metal.

### What happens if an HVAC duct is undersized?
Undersized ducts create high static pressure, noisy air registers, restricted airflow, uneven room cooling/heating, and premature blower motor failure.

### Is my personal data saved anywhere?
No. All calculations run locally in your web browser.
