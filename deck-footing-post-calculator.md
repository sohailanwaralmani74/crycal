---
layout: tool
title: "Deck Footing Post | Interactive Online Tool"
description: "Calculate the number of concrete footings, 80lb concrete bags, Sonotube volumes, 4x4 or 6x6 post quantities, total post height, and material..."
permalink: /deck-footing-post-calculator
tool_id: deck-footing-post-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: deckLengthFt
    label: Deck Length (Feet)
    type: number
    default: 20
    step: 1
    min: 4
    placeholder: "e.g., 20"

  - id: deckWidthFt
    label: Deck Width (Feet)
    type: number
    default: 15
    step: 1
    min: 4
    placeholder: "e.g., 15"

  - id: postSpacingFt
    label: Maximum Post Spacing (Feet)
    type: number
    default: 8
    step: 1
    min: 4
    max: 12
    placeholder: "e.g., 8"

  - id: footingDiameterIn
    label: Footing Hole / Sonotube Diameter (Inches)
    type: number
    default: 12
    step: 2
    min: 8
    max: 24
    placeholder: "e.g., 12"

  - id: footingDepthIn
    label: Footing Hole Depth / Frost Depth (Inches)
    type: number
    default: 36
    step: 6
    min: 12
    max: 72
    placeholder: "e.g., 36"

  - id: postHeightFt
    label: Average Post Height (Feet)
    type: number
    default: 6
    step: 0.5
    min: 1
    placeholder: "e.g., 6"

  - id: costPerBag
    label: 80 lb Concrete Bag Price 
    type: number
    default: 6.50
    step: 0.50
    min: 0
    currency: true
    placeholder: "e.g., 6.50"

  - id: costPerPost
    label: Price Per Support Post 
    type: number
    default: 28.00
    step: 1.00
    min: 0
    currency: true
    placeholder: "e.g., 28.00"

outputs:
  - id: totalFootingsCount
    label: Total Concrete Footings & Posts Needed
  - id: totalConcreteBags
    label: Total 80 lb Concrete Bags (with 10% waste)
  - id: totalConcreteYards
    label: Total Concrete Volume (Cubic Yards)
  - id: totalPostLinearFeet
    label: Total Post Linear Feet Required
  - id: totalFootingPostCost
    label: Total Material Cost

charts:
  tabs:
    - id: costBreakdown
      label: Concrete vs Timber Posts Cost
    - id: volumeBagTab
      label: Material Quantities Breakdown

history_columns:
  - key: deckLengthFt
    label: Length (ft)
    source: input
  - key: deckWidthFt
    label: Width (ft)
    source: input
  - key: totalFootingsCount
    label: Total Posts
    source: output
  - key: totalConcreteBags
    label: 80lb Bags
    source: output
  - key: totalFootingPostCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/deck-footing-post-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Deck Footing & Post Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete footing volumes, Sonotubes, 80lb bag counts, support post lumber, and total material cost for deck construction."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Grid Post Calculation — computes total support posts needed based on deck length, width, and beam span rules"
    - "Concrete Hole Volume — calculates exact cylindrical hole cubic volume with frost depth considerations"
    - "Bag & Cubic Yard Converter — estimates 80lb ready-mix concrete bags with a built-in 10% safety overage factor"
    - "Lumber & Cost Estimator — aggregates post linear footage and total project material expenses"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Deck Footing & Post Calculator

howto:
  name: "How to Calculate Deck Footings and Support Posts"
  description: "Accurately size deck concrete piers, footing holes, and post lumber."
  step:
    - name: "Input Deck Dimensions"
      text: "Enter your deck's overall length and width in feet."
    - name: "Set Post Spacing & Footing Specs"
      text: "Specify maximum beam post spacing (typically 6 to 8 feet) and your regional frost line depth with footing hole diameter."
    - name: "Enter Support Post & Unit Costs"
      text: "Input post height and local material prices for 80lb concrete bags and 4x4 or 6x6 pressure-treated posts."
    - name: "Review Quantities & Order Materials"
      text: "Get exact counts for concrete footings, total 80 lb bags, linear footage of posts, and total material cost."

faq:
  - question: "How deep must deck footings be dug?"
    answer: "Deck footings must extend below the local frost depth line to prevent frost heave. This typically ranges from 12 inches in warm climates to 36–48+ inches in cold northern regions."
  - question: "How many 80 lb bags of concrete are needed for a 12x36 inch footing?"
    answer: "A cylindrical footing hole measuring 12 inches in diameter and 36 inches deep has a volume of approx 2.36 cubic feet, which requires 4 bags of 80 lb ready-mix concrete (each bag yields 0.60 cu ft)."
  - question: "Should I use 4x4 or 6x6 posts for my deck?"
    answer: "Modern IRC building codes strongly recommend or mandate 6x6 posts for decks over 6 feet tall or supporting heavy loads, as 4x4 posts are prone to twisting and limited in structural load capacity."
  - question: "What is the maximum post spacing for a deck?"
    answer: "Standard post spacing is typically 6 feet to 8 feet along support beams, depending on joist span, beam size (e.g., double 2x8 or double 2x10), and deck design loads."
  - question: "How far apart should deck footings be placed?"
    answer: "Footing spacing depends on beam sizing. For standard residential decks, placing footings 6 to 8 feet apart on-center provides optimal structural rigidity without sagging."
  - question: "Does this calculator include concrete waste?"
    answer: "Yes, the concrete bag and cubic yardage outputs automatically include a 10% safety margin for ground spillage and irregular hole digging."
  - question: "Is my personal data stored anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Deck Footing Post Calculator

Calculate the required number of concrete piers, **80 lb ready-mix concrete bags**, Sonotube cylinder volumes, **4x4 or 6x6 timber support posts**, total post height footage, and estimated project cost with our free **Deck Footing & Post Calculator**.

<!-- more -->

## Why Use a Deck Footing & Post Calculator?

Building a deck structural foundation requires precise calculation of post placement and concrete pier volume. Digging undersized footings or underestimating concrete bag counts leads to costly delays or dangerous structural settling.

- **Comply with Frost Line Requirements**: Ensure footings reach below local frost lines (36" to 48") to eliminate frost heave risks.
- **Accurate Pre-Mix Concrete Estimates**: Convert pier volume directly into 80 lb bag counts without buying excess materials.
- **Span-Compliant Post Layout**: Calculate required support columns based on 6 ft to 8 ft beam spacing rules.
- **Budget Material Costs**: Plan expenditures for timber support posts, concrete, and Sonotube cardboard forms ahead of construction.

---

## Deck Footing & Post Formulas

$$\text{Posts Across Length } (N_L) = \left\lceil \frac{\text{Length}}{\text{Post Spacing}} \right\rceil + 1$$

$$\text{Posts Across Width } (N_W) = \left\lceil \frac{\text{Width}}{\text{Post Spacing}} \right\rceil + 1$$

$$\text{Total Footings Count} = N_L \times N_W$$

$$\text{Single Pier Volume (cu ft)} = \pi \times \left( \frac{\text{Diameter}}{24} \right)^2 \times \left( \frac{\text{Depth}}{12} \right)$$

$$\text{Total Concrete (cu yd)} = \frac{\text{Single Volume} \times \text{Total Footings} \times 1.10}{27}$$

$$\text{Total 80 lb Bags Needed} = \left\lceil \frac{\text{Total Volume (cu ft)} \times 1.10}{0.60} \right\rceil$$

---

## Deck Footing & Post Quantities Table

The table below shows concrete footing volumes, bag requirements (80 lb bags yield 0.60 cu ft), post linear feet, and total material cost assuming 36-inch deep, 12-inch diameter footings, 6 ft post height, $6.50/bag concrete, and $28.00 per post.

| Deck Dimensions | Post Spacing | Total Footings | Total 80lb Bags | Concrete Volume | Post Linear Ft | Total Material Cost |
|---|---|---|---|---|---|---|
| **10 ft × 10 ft** | 8 ft | **4 Posts** | **16 Bags** | 0.38 cu yds | 24 ft | **$216.00** |
| **12 ft × 16 ft** | 8 ft | **9 Posts** | **36 Bags** | 0.86 cu yds | 54 ft | **$486.00** |
| **15 ft × 20 ft** | 8 ft | **12 Posts** | **48 Bags** | 1.15 cu yds | 72 ft | **$648.00** |
| **20 ft × 24 ft** | 8 ft | **16 Posts** | **63 Bags** | 1.54 cu yds | 96 ft | **$857.50** |
| **24 ft × 30 ft** | 8 ft | **20 Posts** | **79 Bags** | 1.92 cu yds | 120 ft | **$1,073.50** |

---

## Step-by-Step Guide: How to Dig & Pour Deck Footings

1. **Mark Post Locations**: Lay out batter boards and mason line to pinpoint exact pier centers using 3-4-5 right triangle geometry.
2. **Determine Frost Depth**: Check local building codes for required footing depths (commonly 36 to 48 inches).
3. **Dig Footing Holes**: Use a post hole digger or mechanical auger. Ensure hole bottoms expand slightly into a flared bell shape for extra load bearing.
4. **Insert Sonotube Forms**: Place cardboard Sonotubes into the holes, leveling them 2 to 4 inches above final grade.
5. **Mix & Pour Concrete**: Pour pre-mix concrete or order ready-mix. Consolidate with a rod to remove air pockets.
6. **Set Post Anchor Brackets**: Embed adjustable post anchors into wet concrete or set J-bolts flush for post base brackets.

---

## Frequently Asked Questions

### How deep must deck footings be dug?
Deck footings must extend below the local frost depth line to prevent frost heave. This typically ranges from 12 inches in warm climates to 36–48+ inches in cold northern regions.

### How many 80 lb bags of concrete are needed for a 12x36 inch footing?
A cylindrical footing hole measuring 12 inches in diameter and 36 inches deep has a volume of approx 2.36 cubic feet, which requires 4 bags of 80 lb ready-mix concrete (each bag yields 0.60 cu ft).

### Should I use 4x4 or 6x6 posts for my deck?
Modern IRC building codes strongly recommend or mandate 6x6 posts for decks over 6 feet tall or supporting heavy loads, as 4x4 posts are prone to twisting and limited in structural load capacity.

### What is the maximum post spacing for a deck?
Standard post spacing is typically 6 feet to 8 feet along support beams, depending on joist span, beam size (e.g., double 2x8 or double 2x10), and deck design loads.

### How far apart should deck footings be placed?
Footing spacing depends on beam sizing. For standard residential decks, placing footings 6 to 8 feet apart on-center provides optimal structural rigidity without sagging.

### Does this calculator include concrete waste?
Yes, the concrete bag and cubic yardage outputs automatically include a 10% safety margin for ground spillage and irregular hole digging.

### Is my personal data stored anywhere?
No. All calculations run locally in your web browser.
