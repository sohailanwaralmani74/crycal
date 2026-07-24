---
layout: tool
title: "Skylight Sizing | Interactive Online Tool"
description: "Calculate skylight glass area sizing (5%–10% room floor ratio), recommended skylight dimensions, shaft flare angles, and daylighting lumen output."
permalink: /skylight-sizing-calculator
tool_id: skylight-sizing-calculator
category: roofing
hide_sidebar: true

inputs:
  - id: roomLengthFeet
    label: Room Length (Feet)
    type: number
    default: 16
    step: 0.5
    min: 4
    placeholder: "e.g., 16"

  - id: roomWidthFeet
    label: Room Width (Feet)
    type: number
    default: 14
    step: 0.5
    min: 4
    placeholder: "e.g., 14"

  - id: windowExposure
    label: Daylight Exposure Target (% of Floor Sq Ft)
    type: select
    default: "8"
    options:
      - value: "5"
        label: "5% – Room with multiple large vertical windows"
      - value: "8"
        label: "8% – Average room with standard window illumination"
      - value: "10"
        label: "10% – Internal or windowless room (Hallway / Dark Kitchen / Bath)"
      - value: "12"
        label: "12% – Maximum daylight studio / Sunroom application"

  - id: roofPitch
    label: Roof Pitch (Rise per 12" Run)
    type: number
    default: 6
    step: 0.5
    min: 1
    max: 24
    suffix: '/12'
    placeholder: "e.g., 6"

  - id: ceilingHeightFeet
    label: Room Ceiling Height (Feet)
    type: number
    default: 9
    step: 0.5
    min: 7
    placeholder: "e.g., 9"

outputs:
  - id: recommendedSkylightSqFt
    label: Recommended Total Skylight Glass Area (Sq Ft)
  - id: skylightQuantitySize
    label: Suggested Unit Dimensions & Quantity
  - id: shaftFlareAngle
    label: Recommended Light Shaft Flare Angle (Degrees)
  - id: estimatedDaylightLumens
    label: Natural Daylight Output (Lumens on Clear Day)

charts:
  tabs:
    - id: skylightToFloorRatio
      label: Skylight Glass Area vs Room Floor Area
    - id: lumensComparison
      label: Natural Skylight Lumens vs Standard LED Bulb Count

history_columns:
  - key: roomLengthFeet
    label: Room Length (ft)
    source: input
  - key: roomWidthFeet
    label: Room Width (ft)
    source: input
  - key: windowExposure
    label: Target %
    source: input
  - key: recommendedSkylightSqFt
    label: Glass Area (sq ft)
    source: output
  - key: skylightQuantitySize
    label: Unit Config
    source: output
  - key: estimatedDaylightLumens
    label: Lumens
    source: output

js_file: assets/js/calculators/skylight-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Skylight Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate recommended skylight glass surface area based on floor square footage rules (5%–10%), light shaft flare angles, and daylight lumens."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Architectural Sizing Ratios — applies industry 5% to 10% floor area daylight rule"
    - "Standard Unit Matching — converts target area into standard Velux/commercial unit sizes (22x22, 22x46, 30x46)"
    - "Light Shaft Geometry — determines flare angles for attic light shaft wells"
    - "100% Private — calculation runs locally in browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Skylight Sizing Calculator

howto:
  name: "How to Size a Skylight Correctly"
  description: "Determine optimal skylight glass square footage, unit counts, and shaft design for residential rooms."
  step:
    - name: "Measure Room Dimensions"
      text: "Input interior room length and width in feet to calculate total floor square footage."
    - name: "Select Daylight Target"
      text: "Choose 5% for rooms with vertical windows, 8% for standard rooms, or 10% for windowless spaces."
    - name: "Specify Roof Slope & Ceiling Height"
      text: "Input roof pitch and ceiling height to determine light shaft well depth."
    - name: "Review Unit Recommendations"
      text: "Select single large or multiple smaller standard skylights to match target glass area."

faq:
  - question: "How big should a skylight be for a room?"
    answer: "Architectural guidelines state that skylight glass area should equal 5% to 10% of room floor area. A 150 sq ft room with standard windows requires 7.5 to 12 sq ft of skylight area (e.g., one 30\"x46\" unit)."
  - question: "What are standard skylight sizes?"
    answer: "Standard rough opening sizes include 22.5\"x22.5\" (3.36 sq ft glass), 22.5\"x46.5\" (7.03 sq ft), 30.5\"x46.5\" (9.58 sq ft), and 46.5\"x46.5\" (14.69 sq ft)."
  - question: "Why is light shaft flaring important?"
    answer: "Flaring light shaft walls outward (perpendicular to roof slope on top, vertical on bottom) spreads natural light broader into the room and increases perceived illumination by up to 30%."
  - question: "How many lumens does a skylight provide?"
    answer: "On a clear sunny day, a clean skylight delivers approximately 500 to 600 lumens per square foot of glass area. A 7 sq ft skylight yields ~4,000 lumens—equivalent to four 60-watt incandescent bulbs."
  - question: "Should skylights face North, South, East, or West?"
    answer: "North-facing skylights provide steady, cool diffuse daylight without solar heat gain. South-facing skylights provide intense warmth and light. East yields morning sun, and West provides late afternoon illumination."
  - question: "Can a skylight be too big for a room?"
    answer: "Yes. Oversized skylights exceeding 12% of floor area can cause severe summer overheating and excessive winter thermal heat loss unless equipped with Low-E coatings or blinds."
  - question: "Is my skylight sizing calculation saved on external servers?"
    answer: "No. All calculations run strictly inside your local browser."
---

# Skylight Sizing Calculator

Calculate optimal **skylight glass surface area** based on room floor square footage (5%–10% rule), recommended **standard unit dimensions**, **light shaft flare angles**, and natural **daylight lumen output**.

<!-- more -->

## Why Use the Skylight Sizing Calculator?

Properly sized skylights transform dark living spaces into vibrant, naturally illuminated rooms while reducing reliance on artificial electric lighting. However, installing an improperly sized skylight can lead to glare or summer heat overload.

Using the architectural **5% to 10% floor area ratio rule** ensures your skylight provides balanced ambient illumination without thermal inefficiency.

---

## Skylight Sizing Mathematical Formulas

$$\text{Room Floor Area (sq ft)} = \text{Length (ft)} \times \text{Width (ft)}$$
$$\text{Recommended Glass Area (sq ft)} = \text{Room Floor Area} \times \left(\frac{\text{Exposure \%}}{100}\right)$$
$$\text{Estimated Daylight Lumens} = \text{Glass Area (sq ft)} \times 600 \text{ Lumens/sq ft}$$
$$\text{LED Bulb Equivalent Count} = \left\lceil \frac{\text{Daylight Lumens}}{800 \text{ Lumens (60W equiv)}} \right\rceil$$

---

## Skylight Sizing Quick Reference Table

| Room Dimensions | Floor Area | 5% Ratio (Multi-Window) | 8% Ratio (Standard Room) | 10% Ratio (Windowless Bath/Hall) | Recommended Unit Configuration | Clear Daylight Output |
|---|---|---|---|---|---|---|
| **10' x 10'** | 100 sq ft | 5.0 sq ft | **8.0 sq ft** | 10.0 sq ft | **One 22" x 46" Unit** | ~4,800 Lumens |
| **12' x 14'** | 168 sq ft | 8.4 sq ft | **13.4 sq ft** | 16.8 sq ft | **Two 22" x 46" Units** | ~8,040 Lumens |
| **14' x 16'** | 224 sq ft | 11.2 sq ft | **17.9 sq ft** | 22.4 sq ft | **Two 30" x 46" Units** | ~10,740 Lumens |
| **16' x 20'** | 320 sq ft | 16.0 sq ft | **25.6 sq ft** | 32.0 sq ft | **Two 46" x 46" Units** | ~15,360 Lumens |
| **20' x 24'** | 480 sq ft | 24.0 sq ft | **38.4 sq ft** | 48.0 sq ft | **Three 30" x 46" Units** | ~23,040 Lumens |

---

## Light Shaft Design Rules

1. **Flat Ceiling Light Wells**: When ceilings are flat below a sloped roof, construct a framed light shaft tunnel through the attic space.
2. **Top Wall (Head)**: Slope top shaft wall perpendicular ($90^\circ$) to the roof deck to maximize sky visibility.
3. **Bottom Wall (Sill)**: Flare bottom shaft wall straight vertically downward ($90^\circ$ to ceiling plate) to reflect light deep into the room interior.
4. **Side Walls**: Angle side shaft walls flared outward at $45^\circ$ angles for maximum lateral illumination spread.

---

## Frequently Asked Questions

### How big should a skylight be for a room?
Architectural guidelines state that skylight glass area should equal 5% to 10% of room floor area. A 150 sq ft room with standard windows requires 7.5 to 12 sq ft of skylight area (e.g., one 30"x46" unit).

### What are standard skylight sizes?
Standard rough opening sizes include 22.5"x22.5" (3.36 sq ft glass), 22.5"x46.5" (7.03 sq ft), 30.5"x46.5" (9.58 sq ft), and 46.5"x46.5" (14.69 sq ft).

### Why is light shaft flaring important?
Flaring light shaft walls outward (perpendicular to roof slope on top, vertical on bottom) spreads natural light broader into the room and increases perceived illumination by up to 30%.

### How many lumens does a skylight provide?
On a clear sunny day, a clean skylight delivers approximately 500 to 600 lumens per square foot of glass area. A 7 sq ft skylight yields ~4,000 lumens—equivalent to four 60-watt incandescent bulbs.

### Should skylights face North, South, East, or West?
North-facing skylights provide steady, cool diffuse daylight without solar heat gain. South-facing skylights provide intense warmth and light. East yields morning sun, and West provides late afternoon illumination.

### Can a skylight be too big for a room?
Yes. Oversized skylights exceeding 12% of floor area can cause severe summer overheating and excessive winter thermal heat loss unless equipped with Low-E coatings or blinds.

### Is my skylight sizing calculation saved on external servers?
No. All calculations run strictly inside your local browser.
