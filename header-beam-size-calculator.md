---
layout: tool
title: Header Beam Size Calculator – Door & Window Opening Structural Sizing
description: Calculate structural header sizes, max clear spans, design loads, and required jack/trimmer studs for door and window wall openings.
permalink: /header-beam-size-calculator
tool_id: header-beam-size-calculator
category: lumber-framing
hide_sidebar: true

inputs:
  - id: openingWidth
    label: Rough Opening Width (Feet)
    type: number
    default: 6.0
    step: 0.5
    min: 2
    max: 20
    placeholder: "e.g., 6.0"

  - id: loadBearing
    label: Wall Load Condition
    type: select
    default: "one_floor"
    options:
      - value: "non_bearing"
        label: "Non-Load Bearing Interior Wall (Partition Wall)"
      - value: "one_floor"
        label: "Load Bearing — Single Story / Roof Only Load"
      - value: "two_floor"
        label: "Load Bearing — Two Story (1 Floor + Roof Load)"

  - id: buildingWidth
    label: Building Span / Tributary Width (Feet)
    type: number
    default: 28
    step: 2
    min: 10
    max: 60
    placeholder: "e.g., 28"

  - id: snowLoad
    label: Ground Snow / Live Load (PSF)
    type: select
    default: "30"
    options:
      - value: "20"
        label: "20 PSF (Southern Climates / Low Live Load)"
      - value: "30"
        label: "30 PSF (Standard Moderate Climate)"
      - value: "50"
        label: "50 PSF (Heavy Northern Snow Load)"

  - id: lumberType
    label: Header Material & Depth
    type: select
    default: "double_2x10"
    options:
      - value: "double_2x6"
        label: "Double 2x6 Dimensional Lumber (#2 SPF/DF)"
      - value: "double_2x8"
        label: "Double 2x8 Dimensional Lumber (#2 SPF/DF)"
      - value: "double_2x10"
        label: "Double 2x10 Dimensional Lumber (#2 SPF/DF)"
      - value: "double_2x12"
        label: "Double 2x12 Dimensional Lumber (#2 SPF/DF)"
      - value: "triple_2x10"
        label: "Triple 2x10 Dimensional Lumber"
      - value: "triple_2x12"
        label: "Triple 2x12 Dimensional Lumber"
      - value: "lami_lumber"
        label: "3.5\" x 9.25\" Engineered LVL (1.9E Laminated Veneer)"
      - value: "lami_lumber_11"
        label: "3.5\" x 11.875\" Engineered LVL (1.9E Laminated Veneer)"

outputs:
  - id: maxAllowableSpan
    label: Max Allowable Header Clear Span
  - id: structuralStatus
    label: Header Capacity Assessment
  - id: totalDesignLoad
    label: Total Uniform Load (lbs / lin ft)
  - id: jackStudRecommendation
    label: Minimum Required Jack Studs

charts:
  tabs:
    - id: spanComparison
      label: Opening Width vs Max Span Capacity
    - id: loadDistribution
      label: Design Load Breakdown (lbs/ft)

history_columns:
  - key: openingWidth
    label: Opening Width (ft)
    source: input
  - key: loadBearing
    label: Load Type
    source: input
  - key: lumberType
    label: Header Material
    source: input
  - key: maxAllowableSpan
    label: Max Span
    source: output
  - key: structuralStatus
    label: Structural Status
    source: output

js_file: assets/js/calculators/header-beam-size-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Header Beam Size Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate structural door and window header sizes, maximum allowable clear spans, uniform design loads, and trimmer stud counts."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates maximum allowable span for double/triple 2x6 to 2x12 and engineered LVL headers"
    - "Evaluates single-story, two-story, and non-load bearing wall conditions"
    - "Computes uniform lineal design loads based on tributary building width and snow loads"
    - "Determines required number of jack/trimmer studs per side per IRC code"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Header Beam Size Calculator

howto:
  name: "How to Size Door and Window Headers per IRC Framing Codes"
  description: "Determine proper header depth, lumber type, and jack stud supports for structural wall openings."
  step:
    - name: "Measure rough opening width"
      text: "Measure distance between king studs (door or window rough opening plus frame clearance)."
    - name: "Determine wall load type"
      text: "Check blueprints to verify if the wall carries roof loads, floor loads from upper levels, or is non-bearing."
    - name: "Calculate tributary building span"
      text: "Determine building width perpendicular to the load-bearing wall to establish total roof/floor tributary area."
    - name: "Select header material and size jack studs"
      text: "Choose dimensional lumber (double 2x8, 2x10, 2x12) or engineered LVL and verify required trimmer/jack stud counts."

faq:
  - question: "What size header do I need for a 6 ft sliding patio door?"
    answer: "For a standard 6 ft opening in a single-story 28 ft wide house, IRC Table R602.7 requires a minimum double 2x10 header (#2 Southern Pine / Douglas Fir) supported by 2 jack studs at each end."
  - question: "What is the difference between a king stud and a jack (trimmer) stud?"
    answer: "A king stud runs continuously from sole plate to top plate alongside the opening. A jack stud (or trimmer) is nailed directly inside the king stud to physically support the weight of the header beam."
  - question: "When are two jack studs required at each end of a header?"
    answer: "Per International Residential Code (IRC), headers spanning over 6 feet in load-bearing walls, or headers carrying heavy two-story roof/floor loads, require a minimum of 2 jack studs at each supporting jamb."
  - question: "What is the maximum span for a double 2x6 header?"
    answer: "In a load-bearing exterior wall carrying a single-story roof load, a double 2x6 header has a maximum clear span of approximately 3 ft 11 in (or up to 6 ft in non-load bearing interior partition walls)."
  - question: "When should engineered LVL headers be used instead of dimensional lumber?"
    answer: "Engineered Laminated Veneer Lumber (LVL) beams are recommended for large openings exceeding 8 to 10 feet, garage doors (16 ft spans), or heavy multi-story load points where dimensional lumber would deflect excessively."
  - question: "Can a header be built with a 1/2-inch plywood spacer sandwich?"
    answer: "Yes. In standard 2x4 wall framing (3.5 inches thick), double 2x lumber (1.5 + 1.5 = 3.0 inches) is combined with a 1/2-inch OSB or plywood spacer to match the 3.5-inch wall depth flush with studs."
  - question: "How does roof snow load impact header sizing?"
    answer: "Higher ground snow loads (such as 50 PSF vs 20 PSF) increase the total uniform lineal load ($w$) transferred down from roof rafters, requiring deeper header lumber or shorter maximum spans."
---

Determine structural header sizes, clear spans, total lineal design loads, and jack stud requirements for exterior and interior door/window wall openings.

<!-- more -->

## Why Use the Header Beam Size Calculator?

Over-framing wall headers wastes expensive lumber and reduces insulation space (creating thermal bridges), while under-sizing headers causes sagging window frames, jammed doors, and roof structural failure. Standard IRC framing tables require precise adjustments for load-bearing conditions, building tributary width, and local snow loads.

This **Header Beam Size Calculator** enables builders, architects, and DIY framers to:
1. Instantly verify if a proposed header size meets structural clear span requirements.
2. Determine required jack/trimmer stud support counts per jamb.
3. Compare dimensional lumber headers against engineered Laminated Veneer Lumber (LVL).

---

## Structural Header Sizing Formulas

### 1. Uniform Lineal Load ($w$)
$$w = L_{\text{trib}} \times (\text{Dead Load} + \text{Live/Snow Load})$$

Where tributary span ($L_{\text{trib}}$) is half the building width ($\frac{W_{\text{bldg}}}{2}$).

### 2. Maximum Bending Moment ($M_{\max}$)
$$M_{\max} = \frac{w \times S^2}{8}$$

Where $S$ is the rough opening span in feet.

### 3. Maximum Allowable Span ($S_{\text{max}}$) per Lumber Section
$$S_{\text{max}} = S_{\text{base}} \times K_{\text{load}} \times K_{\text{snow}}$$

Where base spans ($S_{\text{base}}$) for double 2x lumber in 28 ft building width single-story load bearing are:
* **Double 2x6:** $3.9\text{ ft}$
* **Double 2x8:** $5.2\text{ ft}$
* **Double 2x10:** $6.4\text{ ft}$
* **Double 2x12:** $7.6\text{ ft}$
* **3.5" x 9.25" LVL:** $9.8\text{ ft}$
* **3.5" x 11.875" LVL:** $12.5\text{ ft}$

### 4. Jack Stud Rule per End
$$\text{Jack Studs} = \begin{cases} 1 & \text{if } S \le 6.0\text{ ft (or Non-Bearing)} \\ 2 & \text{if } S > 6.0\text{ ft (or 2-Story Load)} \end{cases}$$

---

## IRC Header Span Capacity Table (28 ft House Span)

| Header Lumber Specification | Non-Bearing Interior Wall Span | 1-Story + Roof Load Span (30 PSF) | 2-Story Load Span | Minimum Jack Studs per Jamb |
| :--- | :--- | :--- | :--- | :--- |
| **Double 2x6 (#2 SPF)** | 6 ft 0 in | 3 ft 11 in | 2 ft 8 in | 1 Jack Stud |
| **Double 2x8 (#2 SPF)** | 8 ft 0 in | 5 ft 3 in | 3 ft 7 in | 1 Jack Stud (2 if >6 ft) |
| **Double 2x10 (#2 SPF)** | 10 ft 0 in | 6 ft 5 in | 4 ft 7 in | 2 Jack Studs |
| **Double 2x12 (#2 SPF)** | 12 ft 0 in | 7 ft 8 in | 5 ft 5 in | 2 Jack Studs |
| **Triple 2x10 Lumber** | 12 ft 0 in | 8 ft 2 in | 6 ft 0 in | 2 Jack Studs |
| **3.5" x 9.25" LVL Beam** | 16 ft 0 in | 9 ft 10 in | 7 ft 3 in | 2 Jack Studs |
| **3.5" x 11.875" LVL Beam**| 20 ft 0 in | 12 ft 6 in | 9 ft 4 in | 3 Jack Studs |

---

## Step-by-Step Framing Guide

1. **Establish Rough Opening (R.O.):** Measure door or window frame width and add manufacturer rough opening margins (typically +3/4" to +1" width and height).
2. **Verify Load Path:** Identify if wall plates support roof trusses/rafters or upper floor joists.
3. **Assemble Sandwich Header:** Nail two 2x header members together with a 1/2" OSB sandwich plate using 3" framing nails @ 16" o.c. staggered.
4. **Install King and Jack Studs:** Fasten continuous king stud to bottom/top plates, then cut jack stud to fit snugly beneath the header beam.
5. **Install Cripple Studs:** Space cripple studs above the header at 16" o.c. to support the top wall plate continuous load path.

---

## Frequently Asked Questions (FAQ)

### What size header do I need for a 6 ft sliding patio door?
For a standard 6 ft opening in a single-story 28 ft wide house, IRC Table R602.7 requires a minimum double 2x10 header (#2 Southern Pine / Douglas Fir) supported by 2 jack studs at each end.

### What is the difference between a king stud and a jack (trimmer) stud?
A king stud runs continuously from sole plate to top plate alongside the opening. A jack stud (or trimmer) is nailed directly inside the king stud to physically support the weight of the header beam.

### When are two jack studs required at each end of a header?
Per International Residential Code (IRC), headers spanning over 6 feet in load-bearing walls, or headers carrying heavy two-story roof/floor loads, require a minimum of 2 jack studs at each supporting jamb.

### What is the maximum span for a double 2x6 header?
In a load-bearing exterior wall carrying a single-story roof load, a double 2x6 header has a maximum clear span of approximately 3 ft 11 in (or up to 6 ft in non-load bearing interior partition walls).

### When should engineered LVL headers be used instead of dimensional lumber?
Engineered Laminated Veneer Lumber (LVL) beams are recommended for large openings exceeding 8 to 10 feet, garage doors (16 ft spans), or heavy multi-story load points where dimensional lumber would deflect excessively.

### Can a header be built with a 1/2-inch plywood spacer sandwich?
Yes. In standard 2x4 wall framing (3.5 inches thick), double 2x lumber (1.5 + 1.5 = 3.0 inches) is combined with a 1/2-inch OSB or plywood spacer to match the 3.5-inch wall depth flush with studs.

### How does roof snow load impact header sizing?
Higher ground snow loads (such as 50 PSF vs 20 PSF) increase the total uniform lineal load ($w$) transferred down from roof rafters, requiring deeper header lumber or shorter maximum spans.
