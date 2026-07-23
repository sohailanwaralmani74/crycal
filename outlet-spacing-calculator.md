---
layout: tool
title: Outlet Spacing Calculator – NEC 12-Foot Rule Receptacle Count
description: Calculate the minimum required electrical wall outlet receptacles and box counts for room perimeters under NEC 210.52 12-foot and 6-foot rules.
permalink: /outlet-spacing-calculator
tool_id: outlet-spacing-calculator
category: electrical
hide_sidebar: true

inputs:
  - id: roomLengthFt
    label: Room Length (Feet)
    type: number
    default: 16
    step: 1
    min: 4
    placeholder: "e.g., 16"

  - id: roomWidthFt
    label: Room Width (Feet)
    type: number
    default: 12
    step: 1
    min: 4
    placeholder: "e.g., 12"

  - id: doorwayOpeningsWidthFt
    label: Total Width of Doorways & Openings (Feet)
    type: number
    default: 6
    step: 1
    min: 0
    placeholder: "e.g., 6"

  - id: doorwayCount
    label: Number of Doorways / Wall Segment Breaks
    type: number
    default: 2
    step: 1
    min: 1
    placeholder: "e.g., 2"

  - id: applicationType
    label: NEC Room Application Type
    type: select
    default: "general"
    options:
      - label: "General Living Space / Bedroom (NEC 12-ft Rule)"
        value: "general"
      - label: "Kitchen Countertop (NEC 4-ft Rule)"
        value: "kitchen"

  - id: extraOutlets
    label: Additional Preferred Convenience Outlets
    type: number
    default: 0
    step: 1
    min: 0
    placeholder: "e.g., 0"

outputs:
  - id: grossPerimeterFeet
    label: Total Gross Room Perimeter
  - id: netUsableWallFeet
    label: Net Usable Wall Length
  - id: requiredOutletsCount
    label: Minimum Code Required Receptacles
  - id: recommendedCableFeet
    label: Estimated 12/2 or 14/2 NM-B Wire Needed

charts:
  tabs:
    - id: outletDistribution
      label: Wall Segment vs Outlet Count
    - id: perimeterBreakdown
      label: Perimeter Space vs Openings

history_columns:
  - key: roomLengthFt
    label: Length (ft)
    source: input
  - key: roomWidthFt
    label: Width (ft)
    source: input
  - key: requiredOutletsCount
    label: Required Outlets
    source: output
  - key: recommendedCableFeet
    label: Wire Needed (ft)
    source: output

js_file: assets/js/calculators/outlet-spacing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Outlet Spacing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate required electrical receptacle outlet placement and counts based on room wall perimeter under NEC 210.52."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "NEC 210.52 12-Foot Rule — ensures no point along floor wall line is more than 6 feet from an outlet"
    - "Kitchen Countertop 4-Foot Rule — applies 2-foot reach rule for kitchen counter spaces"
    - "Wall Space Segment Analysis — evaluates individual unbroken wall sections >= 2 feet wide"
    - "Rough-In Material Estimator — computes recommended electrical boxes, devices, and Romex wire footage"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Outlet Spacing Calculator

howto:
  name: "How to Calculate Electrical Outlet Spacing"
  description: "Determine exact receptacle outlet counts and placement rules for residential rooms per NEC codes."
  step:
    - name: "Measure Room Dimensions"
      text: "Measure total length and width of the room in feet to calculate gross perimeter."
    - name: "Deduct Openings and Doorways"
      text: "Subtract total combined width of floor-to-ceiling doors, sliding glass doors, and open archways."
    - name: "Identify Unbroken Wall Segments"
      text: "Count individual wall segments divided by doors, fireplaces, or full-length windows."
    - name: "Apply NEC Spacing Limit"
      text: "Place outlets so no point on any wall segment is more than 6 feet from a receptacle (max 12 feet apart)."
    - name: "Calculate Wire & Box Counts"
      text: "Review total required duplex receptacles and estimated 12/2 or 14/2 Romex cable length."

faq:
  - question: "What is the NEC 12-foot rule for wall outlets?"
  - question: "What is the minimum wall length that requires an electrical outlet?"
  - question: "How far apart should outlets be spaced in a kitchen?"
  - question: "Do doorways and floor-to-ceiling windows count as wall space?"
  - question: "What height should wall receptacle outlets be installed?"
  - question: "How much wire cable is needed per outlet receptacle?"
  - question: "Is my personal data saved when using this calculator?"

---

# Outlet Spacing Calculator – NEC 12-Foot Rule Receptacle Count

Calculate the **minimum required electrical wall outlet receptacles** for any room using our **Outlet Spacing Calculator**. Fully compliant with **NEC Article 210.52**, this tool helps homeowners and electricians plan electrical rough-ins according to **12-foot living room** and **4-foot kitchen countertop** spacing rules.

<!-- more -->

## Why Use an Outlet Spacing Calculator?

The **National Electrical Code (NEC)** mandates strict receptacle outlet spacing rules in living rooms, bedrooms, hallways, and kitchens. The goal of NEC 210.52 is to ensure that standard 6-foot appliance cords can reach a wall outlet without using dangerous extension cords.

- **Eliminates Extension Cord Hazards**: Ensures lamps, TVs, and appliances plug directly into permanent wall outlets.
- **Passes Rough-In Electrical Inspections**: Verifies compliance with 6-foot reach and 12-foot maximum spacing rules.
- **Handles Broken Wall Segments**: Correctly calculates outlets for walls divided by doorways, archways, and fireplaces.
- **Kitchen Countertop Mode**: Calculates 24-inch (2-foot) reach rules required for kitchen backsplash areas.

---

## NEC 210.52 Receptacle Spacing Formulas

### 1. Gross Room Perimeter:
$$\text{Perimeter}_{\text{gross}} = 2 \times (\text{Length} + \text{Width})$$

### 2. Net Usable Wall Space:
$$\text{Perimeter}_{\text{net}} = \text{Perimeter}_{\text{gross}} - \text{Width}_{\text{openings}}$$

### 3. General Room 12-Foot Rule (NEC 210.52(A)):
- No point along a wall floor line can be more than **6 feet ($1.8\text{ m}$)** horizontally from a receptacle outlet.
- Maximum distance between two adjacent outlets along an unbroken wall is **12 feet ($3.6\text{ m}$)**.
- Any unbroken wall space **2 feet ($600\text{ mm}$)** or wider requires an outlet.

$$\text{Outlets per Segment} = \max\left(1, \left\lceil \frac{\text{Segment Length (ft)}}{12} \right\rceil \right) \quad (\text{if Segment Length} \ge 2\text{ ft})$$

### 4. Kitchen Countertop 4-Foot Rule (NEC 210.52(C)):
- No point on a countertop space can be more than **24 inches ($2\text{ ft}$)** horizontally from an outlet.
- Maximum spacing between outlets along countertops is **4 feet ($48\text{ inches}$)**.
- Any countertop wall space **12 inches ($300\text{ mm}$)** or wider requires an outlet.

$$\text{Kitchen Outlets per Segment} = \max\left(1, \left\lceil \frac{\text{Counter Length (ft)}}{4} \right\rceil \right) \quad (\text{if Counter Length} \ge 1\text{ ft})$$

---

## NEC Receptacle Requirements Quick Reference

| Room Area | Max Distance to Outlet | Max Outlet-to-Outlet Spacing | Min Wall Width Requiring Outlet |
| :--- | :--- | :--- | :--- |
| **Living Room / Bedroom** | 6 Feet (72 in) | 12 Feet (144 in) | 2 Feet (24 in) |
| **Kitchen Countertop** | 2 Feet (24 in) | 4 Feet (48 in) | 1 Foot (12 in) |
| **Hallways (>= 10 ft long)** | 10 Feet (120 in) | 20 Feet (240 in) | 10 Feet (120 in) |
| **Bathroom Basin Counter** | 3 Feet (36 in) | Within 3 ft of basin edge | Dedicated GFCI circuit |
| **Outdoor Deck / Patio** | N/A | Front & Back of home | Accessible from grade |

---

## Step-by-Step Guide: Planning Wall Outlets

1. **Measure Room Perimeter**: Enter room length and width to determine overall bounding wall feet.
2. **Deduct Door Openings**: Subtract width of closet doors, entryways, and floor-to-ceiling windows.
3. **Select Room Type**: Choose between standard living area (12-ft rule) or kitchen countertop (4-ft rule).
4. **View Required Receptacles**: Check total duplex outlet boxes needed to pass electrical rough-in inspection.
5. **Estimate Cable & Material**: Allow approximately 15 to 20 feet of 12/2 or 14/2 NM-B Romex cable per outlet run.

---

## Frequently Asked Questions

### What is the NEC 12-foot rule for wall outlets?
The NEC 12-foot rule requires that no point along any unbroken wall space be more than 6 feet from an electrical outlet. This means outlets along a continuous wall must be placed no more than 12 feet apart.

### What is the minimum wall length that requires an electrical outlet?
In living rooms and bedrooms, any separate unbroken wall section that is 2 feet (24 inches) wide or greater requires at least one receptacle outlet.

### How far apart should outlets be spaced in a kitchen?
On kitchen countertops, outlets must be placed so that no point on the counter is more than 24 inches from an outlet. Consequently, maximum spacing between countertop outlets is 4 feet (48 inches).

### Do doorways and floor-to-ceiling windows count as wall space?
No. Doorways, archways, fireplaces, and floor-to-ceiling glass windows that break floor line continuity divide wall space into separate independent wall segments.

### What height should wall receptacle outlets be installed?
Standard wall outlets are typically installed 12 to 18 inches above the finished floor (measured to the bottom of the electrical box). Kitchen countertop outlets are typically set 40 to 44 inches above finished floor (4 to 8 inches above counter surface).

### How much wire cable is needed per outlet receptacle?
On average, expect to use 15 to 25 linear feet of 12/2 or 14/2 NM-B Non-Metallic Sheathed Cable (Romex) per outlet location, including box entry loops and vertical wall drops.

### Is my personal data saved when using this calculator?
No. All calculations are computed locally inside your web browser. No data is stored or logged.
