---
layout: tool
title: "Roof Snow Load | Interactive Online Tool"
description: "Calculate flat roof snow load (pf), sloped roof design pressure (ps) in PSF, and total roof snow weight in lbs and US tons based on ASCE 7 standards."
permalink: /roof-snow-load-calculator
tool_id: roof-snow-load-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: groundSnowLoadPsf
    label: Ground Snow Load (pg in PSF)
    type: number
    default: 40
    step: 5
    min: 0
    placeholder: "e.g., 40"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 4
    step: 0.5
    min: 0
    max: 24
    suffix: '/12'
    placeholder: "e.g., 4"

  - id: roofAreaSqFt
    label: Total Roof Surface Area (Sq Ft)
    type: number
    default: 2000
    step: 50
    min: 100
    placeholder: "e.g., 2000"

  - id: exposureFactor
    label: Exposure Factor (Ce)
    type: select
    default: "1.0"
    options:
      - value: "0.9"
        label: "0.9 – Fully Exposed (Windy mountaintop / unobstructed)"
      - value: "1.0"
        label: "1.0 – Semi-Exposed (Standard suburban neighborhood)"
      - value: "1.1"
        label: "1.1 – Sheltered (Dense trees / surrounding taller structures)"
      - value: "1.2"
        label: "1.2 – Heavily Sheltered (Deep valley / dense forest)"

  - id: thermalFactor
    label: Thermal Factor (Ct)
    type: select
    default: "1.0"
    options:
      - value: "1.0"
        label: "1.0 – Heated Structure (Standard warm home)"
      - value: "1.1"
        label: "1.1 – Unheated Attic / Ventilated Cold Roof"
      - value: "1.2"
        label: "1.2 – Unheated Structure (Detached garage / agricultural shed)"

  - id: importanceFactor
    label: Importance Factor (Is)
    type: select
    default: "1.0"
    options:
      - value: "0.8"
        label: "0.80 – Low Hazard (Agricultural storage / minor sheds)"
      - value: "1.0"
        label: "1.00 – Standard Residential & Commercial Structures"
      - value: "1.15"
        label: "1.15 – Essential / Critical Facilities (Hospitals, fire stations)"

outputs:
  - id: flatRoofSnowLoad
    label: Flat Roof Snow Load (pf in PSF)
  - id: slopedRoofDesignPressure
    label: Sloped Roof Design Pressure (ps in PSF)
  - id: totalSnowWeightLbs
    label: Total Roof Snow Load Weight (Lbs)
  - id: snowWeightTons
    label: Total Roof Snow Load Weight (US Tons)

charts:
  tabs:
    - id: loadComparison
      label: Ground vs Flat vs Sloped Snow Load (PSF)
    - id: totalWeightBreakdown
      label: Snow Weight (lbs & tons) vs Building Load

history_columns:
  - key: groundSnowLoadPsf
    label: Ground pg (PSF)
    source: input
  - key: roofPitch
    label: Pitch
    source: input
  - key: flatRoofSnowLoad
    label: Flat pf (PSF)
    source: output
  - key: slopedRoofDesignPressure
    label: Sloped ps (PSF)
    source: output
  - key: totalSnowWeightLbs
    label: Snow Weight (lbs)
    source: output
  - key: snowWeightTons
    label: Weight (Tons)
    source: output

js_file: assets/js/calculators/roof-snow-load-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Roof Snow Load Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate structural roof snow loads, flat roof snow pressure (pf), sloped roof reduction factors (Cs), design pressure (ps) in PSF, and total weight load in tons based on ASCE 7 standards."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "ASCE 7 Standard Compliance — formulas for flat and sloped roof snow pressure"
    - "Slope Shed Factor (Cs) — automatic roof pitch slope shedding reductions"
    - "Exposure & Thermal Modifiers — tailors load based on building heating and shelter"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Roof Snow Load Calculator

howto:
  name: "How to Calculate Roof Snow Load"
  description: "Determine ASCE 7 structural design snow pressure and total snow weight on roof framing."
  step:
    - name: "Find Ground Snow Load (pg)"
      text: "Look up local municipal ground snow load value in pounds per square foot (PSF) from building code maps."
    - name: "Select Roof Pitch"
      text: "Input roof pitch (rise over 12\" run) to calculate slope reduction factors."
    - name: "Specify Roof Surface Area"
      text: "Enter total sloped roof area in square feet."
    - name: "Choose Exposure & Thermal Factors"
      text: "Select building shelter condition and thermal heating type according to ASCE 7 definitions."

faq:
  - question: "What is roof snow load?"
    answer: "Roof snow load is the downward structural force imposed on a roof structure by accumulated snow and ice, measured in pounds per square foot (PSF) or total weight in pounds."
  - question: "What is the ASCE 7 formula for flat roof snow load?"
    answer: "Flat roof snow load is calculated as p_f = 0.7 × C_e × C_t × I_s × p_g, where C_e is exposure, C_t is thermal factor, I_s is importance factor, and p_g is ground snow load."
  - question: "How does roof pitch reduce snow load?"
    answer: "Steeper roofs shed snow naturally. Under ASCE 7 rules, roofs with slope angles above 30 degrees receive a slope factor reduction (C_s). At slopes above 70 degrees, design snow load drops to zero for unobstructed warm roofs."
  - question: "How much does accumulated snow weigh?"
    answer: "Fresh dry snow weighs 3 to 5 lbs per cubic foot. Settled or wet packed snow weighs 12 to 20 lbs/ft³, while ice weighs approximately 57 lbs per cubic foot."
  - question: "When is roof snow load dangerous for home structures?"
    answer: "Most residential roofs built to code can support 20 to 40 PSF. If accumulated snow and ice exceeds 20 to 25 PSF (or approximately 2 feet of packed snow), structural evaluation or safe snow removal is recommended."
  - question: "What is the difference between ground snow load and roof snow load?"
    answer: "Ground snow load (p_g) is measured flat on unheated ground. Roof snow load (p_s) is typically lower than ground snow load due to thermal heat loss, wind blowing snow away, and sloped gravity shedding."
  - question: "Is my snow load calculation saved on external servers?"
    answer: "No. All calculations run strictly inside your local web browser."
---

# Roof Snow Load Calculator

Calculate structural **flat roof snow load ($p_f$)**, **sloped roof design pressure ($p_s$)** in PSF, and total **accumulated snow weight** in pounds and US tons using official **ASCE 7 structural engineering standards**.

<!-- more -->

## Why Calculate Roof Snow Load?

Excessive snow accumulation poses severe risks to structural framing, rafter joists, roof trusses, and foundation supports. Regional building codes enforce strict minimum snow design pressures based on historic climate data.

Calculating accurate roof snow loads helps:
- Structural engineers size rafter framing and truss spans correctly.
- Homeowners evaluate whether severe winter snowpack requires physical rafter shoveling or melting systems.
- Contractors verify code compliance for new additions and pole barns.

---

## ASCE 7 Roof Snow Load Mathematical Formulas

$$\text{Pitch Angle } (\theta) = \arctan\left(\frac{\text{Pitch}}{12}\right) \times \frac{180}{\pi}$$
$$\text{Flat Roof Snow Load } (p_f) = 0.7 \times C_e \times C_t \times I_s \times p_g$$

$$\text{Slope Factor } (C_s) = \begin{cases} 
1.0 & \text{if } \theta \le 30^\circ \\
1.0 - \left(\frac{\theta - 30^\circ}{40^\circ}\right) & \text{if } 30^\circ < \theta < 70^\circ \\
0 & \text{if } \theta \ge 70^\circ
\end{cases}$$

$$\text{Sloped Roof Design Pressure } (p_s) = C_s \times p_f$$
$$\text{Total Snow Load Weight (lbs)} = p_s \times \text{Roof Area (sq ft)}$$
$$\text{Total Weight (US Tons)} = \frac{\text{Total Snow Weight (lbs)}}{2000}$$

---

## Snow Load Reference Table ($p_g = 40$ PSF Ground Snow, 2,000 sq ft Roof)

| Roof Pitch | Slope Angle ($\theta$) | Slope Factor ($C_s$) | Flat Roof Load ($p_f$) | Sloped Design Pressure ($p_s$) | Total Snow Load (lbs) | Snow Weight (US Tons) |
|---|---|---|---|---|---|---|
| **0/12 (Flat)** | 0.00° | 1.000 | **28.0 PSF** | **28.0 PSF** | **56,000 lbs** | **28.0 Tons** |
| **4/12 Pitch** | 18.43° | 1.000 | **28.0 PSF** | **28.0 PSF** | **56,000 lbs** | **28.0 Tons** |
| **6/12 Pitch** | 26.57° | 1.000 | **28.0 PSF** | **28.0 PSF** | **56,000 lbs** | **28.0 Tons** |
| **8/12 Pitch** | 33.69° | 0.908 | **28.0 PSF** | **25.4 PSF** | **50,836 lbs** | **25.4 Tons** |
| **10/12 Pitch** | 39.81° | 0.755 | **28.0 PSF** | **21.1 PSF** | **42,260 lbs** | **21.1 Tons** |
| **12/12 Pitch** | 45.00° | 0.625 | **28.0 PSF** | **17.5 PSF** | **35,000 lbs** | **17.5 Tons** |
| **16/12 Pitch** | 53.13° | 0.422 | **28.0 PSF** | **11.8 PSF** | **23,616 lbs** | **11.8 Tons** |

---

## Step-by-Step Load Evaluation Guide

1. **Obtain Local Ground Snow Load ($p_g$)**: Consult municipal building department maps for your county ground snow load in PSF.
2. **Determine Roof Pitch & Area**: Input total surface area in sq ft and pitch rise per 12 inches.
3. **Select Exposure Condition ($C_e$)**: Choose unobstructed windy exposure vs sheltered forest cover.
4. **Identify Thermal Category ($C_t$)**: Standard heated homes lose heat upward, promoting melting, whereas unheated cold roofs retain snowpack longer.
5. **Review Design Pressure**: Ensure rafter joist span tables meet or exceed calculated $p_s$ design pressure in PSF.

---

## Frequently Asked Questions

### What is roof snow load?
Roof snow load is the downward structural force imposed on a roof structure by accumulated snow and ice, measured in pounds per square foot (PSF) or total weight in pounds.

### What is the ASCE 7 formula for flat roof snow load?
Flat roof snow load is calculated as p_f = 0.7 × C_e × C_t × I_s × p_g, where C_e is exposure, C_t is thermal factor, I_s is importance factor, and p_g is ground snow load.

### How does roof pitch reduce snow load?
Steeper roofs shed snow naturally. Under ASCE 7 rules, roofs with slope angles above 30 degrees receive a slope factor reduction (C_s). At slopes above 70 degrees, design snow load drops to zero for unobstructed warm roofs.

### How much does accumulated snow weigh?
Fresh dry snow weighs 3 to 5 lbs per cubic foot. Settled or wet packed snow weighs 12 to 20 lbs/ft³, while ice weighs approximately 57 lbs per cubic foot.

### When is roof snow load dangerous for home structures?
Most residential roofs built to code can support 20 to 40 PSF. If accumulated snow and ice exceeds 20 to 25 PSF (or approximately 2 feet of packed snow), structural evaluation or safe snow removal is recommended.

### What is the difference between ground snow load and roof snow load?
Ground snow load (p_g) is measured flat on unheated ground. Roof snow load (p_s) is typically lower than ground snow load due to thermal heat loss, wind blowing snow away, and sloped gravity shedding.

### Is my snow load calculation saved on external servers?
No. All calculations run strictly inside your local web browser.
