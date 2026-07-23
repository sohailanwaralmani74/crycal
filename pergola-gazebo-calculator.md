---
layout: tool
title: Pergola & Gazebo Calculator – Lumber, Posts, Beams & Hardware
description: Calculate support posts, double carrying beams, roof rafters, shade slats, post concrete bags, and material cost for custom pergolas and gazebos.
permalink: /pergola-gazebo-calculator
tool_id: pergola-gazebo-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: structureLength
    label: Pergola Length / Beam Span (Feet)
    type: number
    default: 12
    step: 1
    min: 6
    max: 30
    placeholder: "e.g., 12"

  - id: structureWidth
    label: Pergola Width / Rafter Projection (Feet)
    type: number
    default: 12
    step: 1
    min: 6
    max: 30
    placeholder: "e.g., 12"

  - id: postSize
    label: Support Post Dimension
    type: select
    default: "6x6"
    options:
      - value: "4x4"
        label: "4x4 Pressure Treated / Cedar (Up to 10x10 pergolas)"
      - value: "6x6"
        label: "6x6 Heavy Beam Posts (Recommended for structural stability)"

  - id: beamSize
    label: Main Carrying Beam Specification
    type: select
    default: "double_2x10"
    options:
      - value: "double_2x8"
        label: "Double 2x8 Beams"
      - value: "double_2x10"
        label: "Double 2x10 Beams (Standard 12ft-16ft spans)"
      - value: "double_2x12"
        label: "Double 2x12 Heavy Timber Beams"

  - id: rafterSpacing
    label: Roof Rafter Spacing (On Center)
    type: select
    default: "16"
    options:
      - value: "12"
        label: "12\" o.c. (Dense Rafter Grid)"
      - value: "16"
        label: "16\" o.c. (Standard Code Spacing)"
      - value: "24"
        label: "24\" o.c. (Wide Rafter Spacing)"

  - id: slatSpacing
    label: Top Shade Slat / Purlin Spacing (On Center)
    type: select
    default: "6"
    options:
      - value: "4"
        label: "4\" o.c. (75% Sun Shade Coverage)"
      - value: "6"
        label: "6\" o.c. (50% Sun Shade Coverage)"
      - value: "12"
        label: "12\" o.c. (Light Filter Shade)"

  - id: pricePerPost
    label: Cost per Post 
    type: number
    default: 45.00
    step: 5.00
    min: 0
    prefix: '$'
    placeholder: "e.g., 45.00"

  - id: pricePerBoardFt
    label: Average Board Cost per Linear Foot 
    type: number
    default: 3.50
    step: 0.25
    min: 0
    prefix: '$'
    placeholder: "e.g., 3.50"

outputs:
  - id: totalPosts
    label: Support Posts Needed
  - id: mainBeams
    label: Main Carrying Beams (Count & Length)
  - id: raftersNeeded
    label: Roof Rafter Joists Needed
  - id: shadeSlats
    label: Top Shade Slats / Purlins
  - id: postConcreteBags
    label: 80 lb Concrete Bags for Footings
  - id: totalCost
    label: Estimated Material Cost

charts:
  tabs:
    - id: lumberBreakdown
      label: Structural Lumber Count
    - id: costDistribution
      label: Material Cost Breakdown 

history_columns:
  - key: structureLength
    label: Dimensions (L x W)
    source: input
  - key: postSize
    label: Post Size
    source: input
  - key: totalPosts
    label: Posts
    source: output
  - key: raftersNeeded
    label: Rafters
    source: output
  - key: totalCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/pergola-gazebo-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Pergola Gazebo Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate support posts, main carrying beams, roof rafters, shade purlins, post footing concrete, and total lumber costs for pergolas."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates 4x4 or 6x6 support post counts including corner and intermediate posts"
    - "Determines double carrying beam counts and rafter joists based on 12\", 16\", or 24\" spacing"
    - "Calculates top shade slats / purlins for custom sun filtering percentages"
    - "Estimates 80 lb concrete bags per post footing hole"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Pergola Gazebo Calculator

howto:
  name: "How to Calculate Lumber and Framing Materials for a Pergola or Gazebo"
  description: "Determine structural lumber lists, post footing concrete, rafters, and shade slats for outdoor pergolas."
  step:
    - name: "Determine overall pergola dimensions"
      text: "Establish length (beam span) and width (rafter projection) in feet."
    - name: "Select structural post sizing"
      text: "Choose 6x6 posts for spans over 10 feet to prevent sagging and ensure structural wind resistance."
    - name: "Calculate carrying beams and rafters"
      text: "Double carrying beams run parallel along the length; rafters run perpendicular across the width at 16\" o.c."
    - name: "Estimate shade purlins and concrete footings"
      text: "Calculate top 2x2 or 1x3 shade slats for desired sun blocking and allow 2 to 3 bags of 80 lb concrete per post hole."

faq:
  - question: "Should I use 4x4 or 6x6 posts for a pergola?"
    answer: "6x6 posts are strongly recommended for all pergolas larger than 10x10 feet. They prevent unsightly warping, accommodate notch connections for double 2x10 beams, and increase wind resistance."
  - question: "How deep should pergola post footings be poured?"
    answer: "Pergola post footings must extend below the local frost line (typically 36 to 48 inches deep in cold climates) and measure at least 12 inches in diameter filled with 3 bags of 80 lb concrete per hole."
  - question: "How many rafters are needed for a 12 ft wide pergola?"
    answer: "With standard 16-inch on center rafter spacing, a 12 ft (144 inch) pergola length requires 10 rafter joists (plus rafter overhangs)."
  - question: "How far should pergola rafters overhang the carrying beams?"
    answer: "A standard architectural rafter overhang is 12 to 16 inches past the carrying beams on both ends, often trimmed with decorative end-cut profiles."
  - question: "What size lumber is best for pergola carrying beams?"
    answer: "Double 2x10 or double 2x12 pressure-treated or Western Red Cedar lumber is standard for spans up to 14 feet. For spans over 16 feet, use engineered glulam or steel-flanged beams."
  - question: "How much sun shade does a pergola provide?"
    answer: "Shade depends on purlin spacing: 4-inch spacing provides ~75% sun shade, 6-inch spacing provides ~50% shade, and 12-inch spacing provides ~25% light filtering shade."
  - question: "Is a building permit required for an outdoor pergola?"
    answer: "Most municipalities require a building permit for freestanding or house-attached pergolas exceeding 120 square feet or attached directly to a residential structure."
---

Calculate support post counts, carrying beams, roof rafters, shade purlins, footing concrete bags, and material cost for custom pergolas and gazebos.

<!-- more -->

## Why Use the Pergola & Gazebo Calculator?

Designing an outdoor pergola requires coordinating structural post load capacities, rafter overhangs, and top shade purlins. Purchasing incorrect lumber lengths leads to expensive cut-off waste or inadequate structural support during high wind loads.

This **Pergola Gazebo Calculator** provides:
1. Complete structural bill of materials (posts, carrying beams, rafters, purlins).
2. Footing concrete bag estimations (80 lb pre-mixed bags).
3. Itemized material cost breakdowns for pressure-treated, cedar, or redwood framing.

---

## Pergola Material Formulas

### 1. Support Posts ($N_{\text{posts}}$)
For structures up to 16 ft length, 4 corner posts are standard. Over 16 ft span, intermediate posts are added:
$$N_{\text{posts}} = \begin{cases} 4 & \text{if } L \le 16\text{ ft and } W \le 16\text{ ft} \\ 6 & \text{if } L > 16\text{ ft or } W > 16\text{ ft} \\ 8 & \text{if } L > 24\text{ ft and } W > 24\text{ ft} \end{cases}$$

### 2. Main Carrying Beams ($N_{\text{beams}}$)
Beams sandwich the posts along the structure length:
$$N_{\text{beams}} = 2 \times \left\lceil \frac{W_{\text{ft}}}{16} \right\rceil$$

Beam length includes a 1-foot overhang on both ends:
$$L_{\text{beam\_ft}} = L_{\text{ft}} + 2$$

### 3. Roof Rafter Joists ($N_{\text{rafters}}$)
Rafters run perpendicular to beams across the width:
$$N_{\text{rafters}} = \left\lceil \frac{L_{\text{ft}} \times 12}{S_{\text{rafter}}} \right\rceil + 1$$

Rafter length includes 1-foot overhangs on both ends:
$$L_{\text{rafter\_ft}} = W_{\text{ft}} + 2$$

### 4. Top Shade Slats / Purlins ($N_{\text{slats}}$)
$$N_{\text{slats}} = \left\lceil \frac{W_{\text{ft}} \times 12}{S_{\text{slat}}} \right\rceil + 1$$

### 5. Footing Concrete (80 lb Bags)
$$N_{\text{concrete\_bags}} = N_{\text{posts}} \times 3 \quad (\text{3 bags of } 80\text{ lb concrete per post})$$

---

## Pergola Structural Framing Table

| Pergola Dimensions (L x W) | Posts (6x6) | Double Carrying Beams | Rafters (16" o.c.) | Shade Slats (6" o.c.) | 80 lb Concrete Bags |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10 ft x 10 ft** | 4 Posts | 2 Beams (12 ft long) | 9 Rafters (12 ft long) | 21 Slats (12 ft long) | 12 Bags |
| **12 ft x 12 ft** | 4 Posts | 2 Beams (14 ft long) | 10 Rafters (14 ft long) | 25 Slats (14 ft long) | 12 Bags |
| **14 ft x 14 ft** | 4 Posts | 2 Beams (16 ft long) | 12 Rafters (16 ft long) | 29 Slats (16 ft long) | 12 Bags |
| **16 ft x 16 ft** | 4 Posts | 2 Beams (18 ft long) | 13 Rafters (18 ft long) | 33 Slats (18 ft long) | 12 Bags |
| **20 ft x 16 ft** | 6 Posts | 4 Beams (22 ft long) | 16 Rafters (18 ft long) | 33 Slats (22 ft long) | 18 Bags |

---

## Step-by-Step Construction Guide

1. **Layout & Dig Footings:** Layout post centers with batter boards, dig 12" diameter holes 36" to 48" deep below frost line, and pour 6" gravel base.
2. **Set Support Posts:** Plumb 6x6 posts with temporary 2x4 diagonal braces, fill holes with wet 80 lb concrete mix, and allow 48 hours to cure.
3. **Notch & Mount Beams:** Cut 1.5" notches into opposite sides of post tops, clamp double carrying beams level, and secure with 1/2" stainless steel carriage bolts.
4. **Install Rafters:** Notch decorative tail profiles into 2x8 or 2x10 rafters and fasten to main beams using hurricane structural ties.
5. **Attach Top Shade Slats:** Space 2x2 or 1x3 shade purlins uniformly at 6" o.c. across top rafters and fasten with exterior deck screws.

---

## Frequently Asked Questions (FAQ)

### Should I use 4x4 or 6x6 posts for a pergola?
6x6 posts are strongly recommended for all pergolas larger than 10x10 feet. They prevent unsightly warping, accommodate notch connections for double 2x10 beams, and increase wind resistance.

### How deep should pergola post footings be poured?
Pergola post footings must extend below the local frost line (typically 36 to 48 inches deep in cold climates) and measure at least 12 inches in diameter filled with 3 bags of 80 lb concrete per hole.

### How many rafters are needed for a 12 ft wide pergola?
With standard 16-inch on center rafter spacing, a 12 ft (144 inch) pergola length requires 10 rafter joists (plus rafter overhangs).

### How far should pergola rafters overhang the carrying beams?
A standard architectural rafter overhang is 12 to 16 inches past the carrying beams on both ends, often trimmed with decorative end-cut profiles.

### What size lumber is best for pergola carrying beams?
Double 2x10 or double 2x12 pressure-treated or Western Red Cedar lumber is standard for spans up to 14 feet. For spans over 16 feet, use engineered glulam or steel-flanged beams.

### How much sun shade does a pergola provide?
Shade depends on purlin spacing: 4-inch spacing provides ~75% sun shade, 6-inch spacing provides ~50% shade, and 12-inch spacing provides ~25% light filtering shade.

### Is a building permit required for an outdoor pergola?
Most municipalities require a building permit for freestanding or house-attached pergolas exceeding 120 square feet or attached directly to a residential structure.
