---
layout: tool
title: "Ice Water Shield Calculator | Roofing Material Estimating"
description: "Calculate rolls of self-adhering ice & water shield membrane needed for roof eaves (24 past interior wall code), valleys, and low-slope roof sections."
permalink: /ice-water-shield-calculator
tool_id: ice-water-shield-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: eaveLengthFeet
    label: Total Eave Perimeter Length (Feet)
    type: number
    default: 120
    step: 5
    min: 10
    placeholder: "e.g., 120"

  - id: overhangWidthInches
    label: Eave Overhang Width (Inches from wall)
    type: number
    default: 18
    step: 1
    min: 0
    placeholder: "e.g., 18"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 5
    step: 0.5
    min: 1
    max: 24
    suffix: '/12'
    placeholder: "e.g., 5"

  - id: valleyLengthFeet
    label: Roof Valley Seam Length (Feet)
    type: number
    default: 36
    step: 2
    min: 0
    placeholder: "e.g., 36"

  - id: lowSlopeAreaSqFt
    label: Low-Slope Area (< 4:12 Pitch in Sq Ft)
    type: number
    default: 0
    step: 50
    min: 0
    placeholder: "e.g., 0"

  - id: rollWidthInches
    label: Membrane Roll Width (Inches)
    type: number
    default: 36
    step: 1
    min: 30
    max: 48
    suffix: 'in'
    placeholder: "e.g., 36"

  - id: rollLengthFeet
    label: Membrane Roll Length (Feet)
    type: number
    default: 65
    step: 5
    min: 33
    max: 100
    suffix: 'ft'
    placeholder: "e.g., 65"

outputs:
  - id: eaveMembraneWidthInches
    label: Required Eave Shield Width (Slope Inches to extend 24" inside wall)
  - id: eaveCoursesNeeded
    label: Eave Membrane Courses (Passes) Needed
  - id: totalShieldSqFt
    label: Total Membrane Coverage Needed (Net & Gross Sq Ft)
  - id: rollsNeeded
    label: Ice & Water Shield Rolls to Purchase

charts:
  tabs:
    - id: membraneAllocation
      label: Eaves vs Valleys vs Low-Slope Coverage
    - id: rollCoverageRatio
      label: Net Installed Area vs Waste & Lap Overlap

history_columns:
  - key: eaveLengthFeet
    label: Eaves (ft)
    source: input
  - key: roofPitch
    label: Pitch
    source: input
  - key: eaveMembraneWidthInches
    label: Required Width
    source: output
  - key: eaveCoursesNeeded
    label: Courses
    source: output
  - key: totalShieldSqFt
    label: Total Sq Ft
    source: output
  - key: rollsNeeded
    label: Rolls
    source: output

js_file: assets/js/calculators/ice-water-shield-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Ice & Water Shield Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate self-adhered ice and water shield rolls for roof eaves, valley seams, and low-slope roofs compliant with IRC R905.1.2 ice barrier rules."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "IRC Code Compliance — enforces 24-inch interior wall line extension rule"
    - "Course Pass Multipliers — determines whether 1, 2, or 3 membrane courses are needed along eaves"
    - "Multi-Zone Coverage — integrates eaves, valleys, sidewalls, and low-slope roof areas"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Ice & Water Shield Calculator

howto:
  name: "How to Calculate Ice & Water Shield Rolls"
  description: "Determine exact roll counts of self-adhering underlayment for ice dam and water barrier protection."
  step:
    - name: "Measure Eave Perimeter"
      text: "Measure total linear feet along all eave lines subject to freezing weather."
    - name: "Input Overhang & Roof Pitch"
      text: "Specify horizontal overhang depth in inches and roof pitch to calculate sloped deck width."
    - name: "Add Roof Valleys & Low-Slope Areas"
      text: "Measure linear feet of valleys and total square feet of low-slope roof sections requiring 100% coverage."
    - name: "Select Roll Dimensions"
      text: "Choose standard commercial roll sizes (e.g., 36\" wide by 65' long = 195 sq ft)."

faq:
  - question: "What is ice & water shield?"
    answer: "Ice and water shield is a self-adhering rubberized asphalt membrane installed under shingles to seal around nails and prevent leaks caused by ice dams or wind-driven rain."
  - question: "What is the building code requirement for eave ice barrier protection?"
    answer: "The International Residential Code requires ice barrier membranes in areas with ice damming history to extend from the eave edge to a point at least 24 inches inside the exterior wall line."
  - question: "How many courses (passes) of ice and water shield do I need?"
    answer: "A roof with an 18-inch overhang and 6-inch wall requires two courses of ice and water shield along the eave to achieve the required 24 inches of interior coverage."
  - question: "How wide is a standard roll of ice and water shield?"
    answer: "Standard ice and water shield rolls measure 36 inches wide and typically come in lengths of 33, 50, or 65 feet."
  - question: "Do you put ice and water shield in roof valleys?"
    answer: "Building codes require installers to place a 36-inch wide strip of ice and water shield centered down all roof valley seams before adding metal flashing or shingles."
  - question: "Is ice & water shield required on low-slope roofs?"
    answer: "Roofs with low slopes between 2:12 and 4:12 pitch require 100% coverage of self-adhering ice and water shield across the entire surface."
---

# Ice Water Shield Calculator - Calculate Shingles, Squares & Flashing

Calculate exact **rolls of self-adhering ice & water shield membrane** required for roof eaves, valley seams, and low-slope roof sections in compliance with **IRC R905.1.2 ice barrier building codes**.

<!-- more -->

## Why Ice & Water Barrier Calculations Matter

Ice dams form when heat escaping from an attic melts snow on upper roof slopes. The meltwater flows down to cold eave overhangs, refreezes into ice, and backs up under shingles. 

Installing self-adhering polymer-modified bitumen membrane seals around shingle fastener penetrations, providing a waterproof membrane that prevents catastrophic interior ceiling damage.

---

## Ice & Water Shield Calculator Frequently Asked Questions

### What is ice & water shield?

Ice and water shield is a self-adhering rubberized asphalt membrane installed under shingles to seal around nails and prevent leaks caused by ice dams or wind-driven rain.

### What is the building code requirement for eave ice barrier protection?

The International Residential Code requires ice barrier membranes in areas with ice damming history to extend from the eave edge to a point at least 24 inches inside the exterior wall line.

### How many courses (passes) of ice and water shield do I need?

A roof with an 18-inch overhang and 6-inch wall requires two courses of ice and water shield along the eave to achieve the required 24 inches of interior coverage.

### How wide is a standard roll of ice and water shield?

Standard ice and water shield rolls measure 36 inches wide and typically come in lengths of 33, 50, or 65 feet.

### Do you put ice and water shield in roof valleys?

Building codes require installers to place a 36-inch wide strip of ice and water shield centered down all roof valley seams before adding metal flashing or shingles.

### Is ice & water shield required on low-slope roofs?

Roofs with low slopes between 2:12 and 4:12 pitch require 100% coverage of self-adhering ice and water shield across the entire surface.
