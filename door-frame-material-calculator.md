---
layout: tool
title: "Door Frame Material | Interactive Online Tool"
description: "Calculate pre-hung door jamb width, framing rough opening dimensions (RO), casing trim linear feet, and door threshold materials."
permalink: /door-frame-material-calculator
tool_id: door-frame-material-calculator
category: windows-doors
hide_sidebar: true

inputs:
  - id: doorWidthInches
    label: Standard Nominal Door Slab Width (Inches)
    type: select
    default: "36"
    options:
      - label: '24 Inches (2-0 Door / Closet)'
        value: "24"
      - label: '28 Inches (2-4 Door / Half Bath)'
        value: "28"
      - label: '30 Inches (2-6 Door / Bedroom)'
        value: "30"
      - label: '32 Inches (2-8 Door / Bedroom & Passage)'
        value: "32"
      - label: '36 Inches (3-0 Door / Standard Entry & ADA)'
        value: "36"

  - id: doorHeightInches
    label: Door Slab Height (Inches)
    type: select
    default: "80"
    options:
      - label: '80 Inches (6-8 Standard Height)'
        value: "80"
      - label: '84 Inches (7-0 Commercial / Modern)'
        value: "84"
      - label: '96 Inches (8-0 Tall Custom Door)'
        value: "96"

  - id: wallStudDepth
    label: Wall Framing Stud Depth
    type: select
    default: "2x4"
    options:
      - label: '2x4 Wall Studs (3.5" wood + 1.0" drywall = 4-9/16" Jamb)'
        value: "2x4"
      - label: '2x6 Wall Studs (5.5" wood + 1.0" drywall = 6-9/16" Jamb)'
        value: "2x6"

  - id: sheathingThicknessInches
    label: Combined Wallboard / Drywall Thickness (Inches)
    type: number
    default: 1.0
    step: 0.125
    min: 0.5
    max: 2.0
    placeholder: "e.g., 1.0"

  - id: casingProfileWidthInches
    label: Interior Casing Trim Width (Inches)
    type: number
    default: 2.5
    step: 0.25
    min: 1.5
    max: 4.5
    placeholder: "e.g., 2.5"

  - id: doorCount
    label: Total Number of Doors
    type: number
    default: 1
    step: 1
    min: 1
    placeholder: "e.g., 1"

  - id: includeExteriorThreshold
    label: Include Exterior Aluminum Threshold
    type: select
    default: "no"
    options:
      - label: "No (Interior Passageway Door)"
        value: "no"
      - label: "Yes (Exterior Entry Door)"
        value: "yes"

outputs:
  - id: recommendedJambWidth
    label: Recommended Pre-Hung Door Jamb Width
  - id: roughOpeningDimensions
    label: Framing Rough Opening (Width x Height)
  - id: totalCasingLinearFeet
    label: Total Door Casing Trim Linear Feet
  - id: thresholdMaterialFeet
    label: Threshold & Stop Material Linear Feet

charts:
  tabs:
    - id: jambWidthComparison
      label: Wall Assembly vs Jamb Depth
    - id: casingLinearFootage
      label: Door Trim Material Breakdown

history_columns:
  - key: doorWidthInches
    label: Width (in)
    source: input
  - key: doorHeightInches
    label: Height (in)
    source: input
  - key: recommendedJambWidth
    label: Jamb Width
    source: output
  - key: roughOpeningDimensions
    label: Rough Opening
    source: output

js_file: assets/js/calculators/door-frame-material-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Door Frame Material Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate pre-hung door jamb width (4-9/16\" vs 6-9/16\"), framing rough opening dimensions (RO), casing trim linear feet, and threshold material requirements."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Standard Jamb Depth Selection — computes exact 4-9/16\" or 6-9/16\" jamb width for 2x4 and 2x6 walls"
    - "Framing Rough Opening Calculator — adds standard +2\" width and +2.5\" height framing allowances"
    - "2-Sided Casing Trim Estimator — calculates interior door trim linear footage for both wall faces"
    - "Threshold & Weatherstrip Sizing — calculates exterior sill threshold lengths"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Door Frame Material Calculator

howto:
  name: "How to Size Door Frame Jambs and Rough Openings"
  description: "Determine exact wall stud jamb depth and framing rough opening dimensions before ordering pre-hung doors."
  step:
    - name: "Select Nominal Door Size"
      text: "Choose door slab width (e.g., 36\" for entry, 30\"/32\" for interior) and standard height (80\")."
    - name: "Measure Wall Stud Depth"
      text: "Identify whether wall framing uses 2x4 studs (3.5\" actual) or 2x6 studs (5.5\" actual)."
    - name: "Include Drywall Thickness"
      text: "Add interior drywall thickness (1/2\" drywall on each side = 1.0\" total drywall)."
    - name: "Calculate Rough Opening (RO)"
      text: "Add 2.0 inches to door width and 2.5 inches to door height for framing shims and floor clearance."
    - name: "Review Casing & Threshold Output"
      text: "Purchase recommended 4-9/16\" or 6-9/16\" pre-hung jamb assembly and casing trim packs."

faq:
  - question: "What is the standard jamb width for a 2x4 wall?"
  - question: "What is the standard jamb width for a 2x6 wall?"
  - question: "How do I calculate the rough opening (RO) for a pre-hung door?"
  - question: "What is the difference between a pre-hung door and a slab door?"
  - question: "Why is a 36-inch door required for exterior entryways?"
  - question: "How many linear feet of casing trim are needed for one door?"
  - question: "Is my personal data saved when using this calculator?"

---

# Door Frame Material Calculator

Calculate exact **pre-hung door jamb widths**, **framing rough opening dimensions (RO)**, and **casing trim linear feet** using our **Door Frame Material Calculator**. Eliminate sizing errors when ordering pre-hung doors for **2x4 framing (4-9/16" jambs)** or **2x6 exterior walls (6-9/16" jambs)**.

<!-- more -->

## Why Use a Door Frame Material Calculator?

Ordering the wrong pre-hung door jamb width causes severe trim installation problems. If you install a standard **4-9/16" jamb** on a **2x6 exterior wall** or a wall with double-layer drywall, the casing trim will not lie flat against the wall, requiring tedious custom jamb extension rips.

Framers also require exact **Rough Opening (RO)** dimensions before building wall header frames to allow $1/2\text{-inch}$ shim clearance on both sides for plumb leveling.

- **Jamb Depth Accuracy**: Automatically sizes 4-9/16" vs 6-9/16" jamb depth based on stud depth and drywall thickness.
- **Framing Rough Opening Rules**: Applies standard $+2\text{ in}$ width and $+2.5\text{ in}$ height rules.
- **Dual-Sided Casing Estimator**: Computes linear footage for both front and back interior door trim sides.
- **Batch Door Materializing**: Summarizes total door trim and threshold materials for multi-door projects.

---

## Door Framing Formulas

### 1. Wall Jamb Depth ($D_{\text{jamb}}$):
$$D_{\text{jamb}} = W_{\text{stud}} + T_{\text{sheathing\_left}} + T_{\text{sheathing\_right}}$$

- **2x4 Wall Stud (3.5") + 1.0" Drywall**: $4.50\text{ in} \rightarrow \text{Standard } 4\text{-}9/16\text{" (4.5625") Jamb}$
- **2x6 Wall Stud (5.5") + 1.0" Drywall**: $6.50\text{ in} \rightarrow \text{Standard } 6\text{-}9/16\text{" (6.5625") Jamb}$

### 2. Framing Rough Opening (RO):
$$\text{RO}_{\text{width}} = W_{\text{door}} + 2.0\text{ inches}$$

$$\text{RO}_{\text{height}} = H_{\text{door}} + 2.5\text{ inches}$$

### 3. Casing Trim Linear Feet (2 Sides):
$$\text{Trim per Door (ft)} = 2 \times \left[ \frac{(2 \times (H_{\text{door}} + W_{\text{casing}})) + (W_{\text{door}} + (2 \times W_{\text{casing}}))}{12} \right]$$

$$\text{Total Casing Linear Feet} = \text{Trim per Door} \times N_{\text{doors}} \times 1.10\ \text{(Waste Factor)}$$

---

## Standard Pre-Hung Door & Rough Opening Reference

| Nominal Door Size | Door Slab (W x H) | Framing Rough Opening (RO) | Recommended Application | Standard Jamb Depth |
| :--- | :--- | :--- | :--- | :--- |
| **2-0 (24 Inch)** | 24" x 80" | **26" x 82-1/2"** | Small Closet / Pantry | 4-9/16" (2x4 Wall) |
| **2-6 (30 Inch)** | 30" x 80" | **32" x 82-1/2"** | Bedroom / Interior Office | 4-9/16" (2x4 Wall) |
| **2-8 (32 Inch)** | 32" x 80" | **34" x 82-1/2"** | Bathroom / Main Hallway | 4-9/16" (2x4 Wall) |
| **3-0 (36 Inch)** | 36" x 80" | **38" x 82-1/2"** | Main Front Entry / ADA | 6-9/16" (2x6 Wall) |
| **3-0 x 8-0 (36x96)** | 36" x 96" | **38" x 98-1/2"** | Custom High-Ceiling Entry | 6-9/16" (2x6 Wall) |

---

## Step-by-Step Guide: Ordering Door Frames

1. **Select Nominal Door Size**: Choose standard door width (e.g., 30" for interior, 36" for main entry).
2. **Specify Wall Framing Stud**: Select 2x4 (3.5" stud) for standard interior walls or 2x6 (5.5" stud) for exterior insulated walls.
3. **Verify Drywall Thickness**: Keep default 1.0 inch (1/2" sheetrock on both sides of wall).
4. **Check Rough Opening Output**: Give RO dimensions ($W+2"$, $H+2.5"$) to your framing contractor.
5. **Purchase Casing & Thresholds**: Buy matching trim sticks and exterior thresholds.

---

## Frequently Asked Questions

### What is the standard jamb width for a 2x4 wall?
The standard pre-hung door jamb width for a 2x4 wall (3.5" stud + two 1/2" drywall sheets) is **4-9/16 inches (4.5625 in)**.

### What is the standard jamb width for a 2x6 wall?
The standard pre-hung door jamb width for a 2x6 wall (5.5" stud + two 1/2" drywall sheets or exterior sheathing) is **6-9/16 inches (6.5625 in)**.

### How do I calculate the rough opening (RO) for a pre-hung door?
To calculate the rough opening width, add **2 inches** to the door slab width. To calculate rough opening height, add **2-1/2 inches** to the door slab height (e.g., a 36" x 80" door requires a 38" x 82-1/2" rough opening).

### What is the difference between a pre-hung door and a slab door?
A **slab door** is simply the un-bored door panel without hinges or frame. A **pre-hung door** comes fully assembled with the door slab pre-hinged inside a matching wood jamb frame, threshold, and latch bore.

### Why is a 36-inch door required for exterior entryways?
International Residential Code (IRC) requires at least one exterior egress door in every home to have a clear width of at least 32 inches, which requires a **36-inch (3-0) nominal door slab**. 36-inch doors also comply with ADA accessibility.

### How many linear feet of casing trim are needed for one door?
A standard 30" x 80" interior door requires approximately **15 linear feet per side**, or **30 to 33 linear feet** of casing trim to frame both sides of the door opening (including 10% miter waste).

### Is my personal data saved when using this calculator?
No. All calculations run locally in your web browser. No door dimensions are stored.
