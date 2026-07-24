---
layout: tool
title: "Rafter Length | Interactive Online Tool"
description: "Calculate common rafter length, ridge beam deductions, overhang tails, roof pitch angles, and stock lumber board sizes using our rafter calculator."
permalink: /rafter-length-calculator
tool_id: rafter-length-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: roofRunFeet
    label: Roof Run (Feet)
    type: number
    default: 12
    step: 0.25
    min: 0.5
    placeholder: "e.g., 12"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 6
    step: 0.5
    min: 1
    max: 24
    suffix: '/12'
    placeholder: "e.g., 6"

  - id: ridgeThicknessInches
    label: Ridge Beam Thickness (Inches)
    type: number
    default: 1.5
    step: 0.25
    min: 0
    placeholder: "e.g., 1.5"

  - id: overhangInches
    label: Eave Overhang Run (Inches)
    type: number
    default: 12
    step: 1
    min: 0
    placeholder: "e.g., 12"

outputs:
  - id: commonRafterLength
    label: Common Rafter Length (Ridge to Wall)
  - id: totalRafterLength
    label: Total Rafter Length (incl. Overhang)
  - id: pitchAngleDegrees
    label: Roof Slope Angle (Degrees)
  - id: recommendedLumberLength
    label: Recommended Stock Board Length

charts:
  tabs:
    - id: lengthComponents
      label: Common Rafter vs Overhang Tail
    - id: triangleDimensions
      label: Run vs Rise vs Diagonal Rafter

history_columns:
  - key: roofRunFeet
    label: Run (ft)
    source: input
  - key: roofPitch
    label: Pitch
    source: input
  - key: commonRafterLength
    label: Common Rafter
    source: output
  - key: totalRafterLength
    label: Total Rafter
    source: output
  - key: pitchAngleDegrees
    label: Angle (deg)
    source: output
  - key: recommendedLumberLength
    label: Stock Board
    source: output

js_file: assets/js/calculators/rafter-length-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rafter Length Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate common rafter length, ridge beam setback, overhang tails, pitch slope angle, and framing lumber sizes."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Pythagorean Rafter Math — calculates precise hypotenuse lengths for any pitch"
    - "Ridge Beam Setback — deducts half of ridge beam thickness (1.5\" for 2x lumber)"
    - "Eave Overhang Inclusion — calculates overhang rafter tails"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Rafter Length Calculator

howto:
  name: "How to Calculate Rafter Length"
  description: "Determine exact common rafter framing length for gable and shed roofs."
  step:
    - name: "Measure total roof run"
      text: "Input total horizontal run in feet (half of total building span for a gable roof)."
    - name: "Select roof pitch ratio"
      text: "Input rise per 12 inches of run (e.g., 6/12 pitch = 6 inches of rise per 12 inches of run)."
    - name: "Subtract ridge board thickness"
      text: "Input ridge beam thickness (typically 1.5 inches for a 2x ridge board)."
    - name: "Add eave overhang tail"
      text: "Specify horizontal overhang distance in inches (e.g., 12\" or 24\" soffit)."

faq:
  - question: "What is the formula for calculating rafter length?"
    answer: "Rafter length is calculated using the Pythagorean theorem: Rafter Length = √(Adjusted Run² + Total Rise²), where Adjusted Run = Roof Run - (Half Ridge Thickness / 12) and Total Rise = Adjusted Run × (Pitch / 12)."
  - question: "What is roof run?"
    answer: "Roof run is the horizontal distance from the outer edge of the wall plate to the center of the roof ridge beam. For a symmetrical gable roof, run equals half the total building width."
  - question: "Why must you deduct ridge board thickness from rafter length?"
    answer: "Rafters meet at the center of the roof against a ridge beam. Deducting half the thickness of the ridge beam (0.75\" for a 1.5\" 2x board) ensures the rafter plumb cut fits tight against the ridge."
  - question: "How do you calculate rafter overhang?"
    answer: "Overhang length equals (Horizontal Overhang in feet) × √(1 + (Pitch / 12)²). For a 12-inch overhang on a 6/12 pitch roof, the rafter tail length is 1.118 feet (13.4 inches)."
  - question: "What size lumber should I purchase for rafters?"
    answer: "Always round up to the next standard commercial board length (e.g., 8', 10', 12', 14', 16', 18', 20') to allow for bird's mouth plumb cuts and fascia trimming."
  - question: "How do you convert pitch to degrees?"
    answer: "Pitch angle in degrees = arctan(Pitch / 12) × (180 / π). For example, a 6/12 pitch equals arctan(0.5) = 26.57 degrees."
  - question: "Is my rafter framing calculation saved on external servers?"
    answer: "No. All calculation logic executes locally in your browser."
---

# Rafter Length Calculator

Calculate exact **common rafter lengths**, ridge setback deductions, overhang tails, roof slope degrees, and recommended stock board sizes for roof framing.

<!-- more -->

## Rafter Geometry Formulas

$$\text{Adjusted Run (ft)} = \text{Roof Run (ft)} - \left(\frac{\text{Ridge Thickness (in)} / 2}{12}\right)$$
$$\text{Roof Rise (ft)} = \text{Adjusted Run (ft)} \times \left(\frac{\text{Pitch}}{12}\right)$$
$$\text{Common Rafter Length (ft)} = \sqrt{\text{Adjusted Run}^2 + \text{Roof Rise}^2}$$
$$\text{Pitch Factor} = \sqrt{1 + \left(\frac{\text{Pitch}}{12}\right)^2}$$
$$\text{Overhang Length (ft)} = \left(\frac{\text{Overhang Run (in)}}{12}\right) \times \text{Pitch Factor}$$
$$\text{Total Rafter Length (ft)} = \text{Common Rafter Length} + \text{Overhang Length}$$
$$\text{Pitch Angle } (\theta) = \arctan\left(\frac{\text{Pitch}}{12}\right) \times \frac{180}{\pi}$$

---

## Rafter Length Reference Table (12 ft Building Span / 6 ft Run)

| Roof Pitch | Roof Angle (°) | Pitch Multiplier | Common Rafter Length (6' Run) | 12" Overhang Tail | Total Rafter Length | Stock Board Size |
|---|---|---|---|---|---|---|
| **4/12 Pitch** | 18.43° | **1.054** | 6.27 ft (75.3") | 1.05 ft | **7.32 ft** | **8 Foot Board** |
| **6/12 Pitch** | 26.57° | **1.118** | 6.66 ft (79.9") | 1.12 ft | **7.78 ft** | **8 Foot Board** |
| **8/12 Pitch** | 33.69° | **1.202** | 7.15 ft (85.8") | 1.20 ft | **8.35 ft** | **10 Foot Board** |
| **10/12 Pitch** | 39.81° | **1.302** | 7.75 ft (93.0") | 1.30 ft | **9.05 ft** | **10 Foot Board** |
| **12/12 Pitch** | 45.00° | **1.414** | 8.42 ft (101.0") | 1.41 ft | **9.83 ft** | **10 Foot Board** |

---

## How to Use This Rafter Length Calculator

1. Input total horizontal **Roof Run in feet** (half the building span for gable roofs).
2. Enter **Roof Pitch** (inches of rise per 12 inches of horizontal run).
3. Specify **Ridge Beam Thickness** (1.5" standard for 2x dimensional ridge board).
4. Enter horizontal **Overhang Run in inches** (e.g., 12" soffit).
5. Review exact common rafter length, overhang tail length, total rafter length, slope angle, and stock lumber purchasing size.

---

## Frequently Asked Questions

### What is the formula for calculating rafter length?
Rafter length is calculated using the Pythagorean theorem: Rafter Length = √(Adjusted Run² + Total Rise²), where Adjusted Run = Roof Run - (Half Ridge Thickness / 12) and Total Rise = Adjusted Run × (Pitch / 12).

### What is roof run?
Roof run is the horizontal distance from the outer edge of the wall plate to the center of the roof ridge beam. For a symmetrical gable roof, run equals half the total building width.

### Why must you deduct ridge board thickness from rafter length?
Rafters meet at the center of the roof against a ridge beam. Deducting half the thickness of the ridge beam (0.75" for a 1.5" 2x board) ensures the rafter plumb cut fits tight against the ridge.

### How do you calculate rafter overhang?
Overhang length equals (Horizontal Overhang in feet) × √(1 + (Pitch / 12)²). For a 12-inch overhang on a 6/12 pitch roof, the rafter tail length is 1.118 feet (13.4 inches).

### What size lumber should I purchase for rafters?
Always round up to the next standard commercial board length (e.g., 8', 10', 12', 14', 16', 18', 20') to allow for bird's mouth plumb cuts and fascia trimming.

### How do you convert pitch to degrees?
Pitch angle in degrees = arctan(Pitch / 12) × (180 / π). For example, a 6/12 pitch equals arctan(0.5) = 26.57 degrees.

### Is my rafter framing calculation saved on external servers?
No. All calculation logic executes locally in your browser.
