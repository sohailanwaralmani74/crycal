---
layout: tool
title: Rain Barrel Sizing Calculator – Roof Runoff & Cistern Capacity
description: Calculate roof stormwater catchment runoff gallons per 1" rainfall, rain barrel storage capacity, cistern tank count, and garden irrigation days.
permalink: /rain-barrel-sizing-calculator
tool_id: rain-barrel-sizing-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: roofFootprintSqFt
    label: Roof Catchment Area Draining to Downspout (Sq Ft)
    type: number
    default: 800
    step: 50
    min: 50
    placeholder: "e.g., 800"

  - id: roofPitchEfficiency
    label: Roof Surface Runoff Efficiency
    type: select
    default: "0.95"
    options:
      - value: "0.95"
        label: "95% Efficiency (Asphalt Shingle / Standing Seam Metal)"
      - value: "0.90"
        label: "90% Efficiency (Concrete / Clay Tile Roof)"
      - value: "0.85"
        label: "85% Efficiency (Wood Shake / Composite Shingle)"
      - value: "0.75"
        label: "75% Efficiency (Flat Tar & Gravel / Green Roof)"

  - id: designRainfallInches
    label: Design Storm Rainfall Depth (Inches)
    type: select
    default: "1.0"
    options:
      - value: "0.25"
        label: "0.25 Inch (Light Drizzle Event)"
      - value: "0.50"
        label: "0.50 Inch (Moderate Rain Shower)"
      - value: "1.00"
        label: "1.00 Inch (Standard Storm Catchment Event)"
      - value: "2.00"
        label: "2.00 Inches (Heavy Downpour Storm)"

  - id: barrelUnitCapacity
    label: Storage Container Unit Size
    type: select
    default: "55"
    options:
      - value: "50"
        label: "50 Gallon Rain Barrel"
      - value: "55"
        label: "55 Gallon Standard Drum"
      - value: "100"
        label: "100 Gallon Dual Tank System"
      - value: "250"
        label: "250 Gallon Small Cistern"
      - value: "500"
        label: "500 Gallon Large Rain Cistern"

  - id: barrelPrice
    label: Price Per Rain Barrel / Cistern Unit
    type: number
    default: 85.00
    step: 5.00
    min: 0
    currency: true
    placeholder: "e.g., 85.00"

  - id: avgDailyIrrigationGal
    label: Estimated Daily Garden Watering Usage (Gallons)
    type: number
    default: 15
    step: 5
    min: 1
    placeholder: "e.g., 15"

outputs:
  - id: totalStormRunoffGallons
    label: Total Stormwater Runoff Generated (Gallons)
  - id: effectiveHarvestGallons
    label: Harvestable Water Collected (Gallons)
  - id: barrelsNeeded
    label: Rain Barrels / Cisterns Required
  - id: irrigationDaysProvided
    label: Days of Outdoor Garden Watering Provided
  - id: totalSystemCost
    label: Total Rain Barrel System Cost

charts:
  tabs:
    - id: stormwaterHarvestVsOverflow
      label: Harvested Water vs Overflow
    - id: runoffByRainfallInches
      label: Storm Runoff by Rainfall Depth

history_columns:
  - key: roofFootprintSqFt
    label: Catchment Sq Ft
    source: input
  - key: designRainfallInches
    label: Rainfall (in)
    source: input
  - key: effectiveHarvestGallons
    label: Harvested Gal
    source: output
  - key: barrelsNeeded
    label: Barrels Needed
    source: output

js_file: assets/js/calculators/rain-barrel-sizing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Rain Barrel Sizing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate roof catchment stormwater runoff (0.623 gallons/sq ft/inch), rain barrel storage capacity, cistern counts, and garden watering days."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Stormwater Catchment Formula — computes 0.623 gal/sq ft/inch rainfall runoff constant"
    - "Runoff Coefficient & First-Flush Waste — incorporates roof material loss and diverter waste"
    - "Storage Tank & Cistern Sizing — scales from 50-gallon barrels up to 500-gallon cisterns"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Rain Barrel Sizing Calculator

howto:
  name: "How to Calculate Rain Barrel Sizing & Roof Runoff"
  description: "Determine stormwater runoff gallons from roof downspouts and required rain barrels or cisterns."
  step:
    - name: "Measure roof catchment area"
      text: "Input the square footage of roof area draining into the specific downspout."
    - name: "Select roof material efficiency"
      text: "Choose asphalt shingle (95%), tile (90%), or flat gravel (75%) runoff efficiency."
    - name: "Select design rainfall event"
      text: "Choose 0.5 inch, 1.0 inch, or 2.0 inches storm rainfall depth."
    - name: "Pick rain barrel container size"
      text: "Select 50 gal, 55 gal, 100 gal, or 500 gal cistern capacities."
    - name: "Review harvest volume & days of irrigation"
      text: "Get total stormwater runoff gallons, recommended barrel count, and outdoor irrigation days provided."

faq:
  - question: "How many gallons of water does 1 inch of rain generate from a roof?"
    answer: "One inch of rain falling on a 1,000 square foot roof generates approximately 623 gallons of stormwater runoff."
  - question: "How many rain barrels do I need for an 800 sq ft roof section?"
    answer: "For an 800 sq ft roof draining to one downspout during a 1-inch rainfall, approximately 473 gallons of water are harvested. This requires nine 55-gallon rain barrels or one 500-gallon cistern tank."
  - question: "What is the universal roof runoff formula?"
    answer: "The formula is: Harvested Gallons = Roof Footprint (sq ft) × Rainfall Depth (inches) × 0.623 (conversion constant) × Runoff Efficiency Rate."
  - question: "What is a first-flush diverter and why is it needed?"
    answer: "A first-flush diverter routes the initial 10 to 20 gallons of rain (which carries bird droppings, dust, and roof pollen) away from the rain barrel, ensuring clean water enters your storage tanks."
  - question: "Can I connect multiple rain barrels together in series?"
    answer: "Yes. Connecting rain barrels in series using 3/4-inch overflow hoses at the top of each barrel allows water to automatically fill the first barrel and cascade down to subsequent barrels."
  - question: "How much does a 55-gallon rain barrel cost?"
    answer: "A standard 55-gallon food-grade plastic rain barrel with brass spigot and overflow valve costs between $75 and $120."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation formulas run locally in your web browser."
---

# Rain Barrel Sizing Calculator – Roof Runoff & Cistern Capacity

Determine stormwater catchment runoff gallons, rain barrel storage capacity (50 gal to 500 gal cisterns), container counts, and garden irrigation days with our free **Rain Barrel Sizing Calculator**.

<!-- more -->

## Why Calculate Rain Barrel & Cistern Sizing Accurately?

Harvesting rainwater from roof downspouts conserves municipal tap water, reduces storm sewer overflow, and supplies chlorine-free water to gardens:
- **Prevent Overflow Waste**: A single 1-inch summer thunderstorm fills a standard 55-gallon rain barrel in less than 10 minutes from a small 200 sq ft roof section.
- **Size Storage to Garden Demand**: Knowing your average daily garden watering needs helps determine whether a 55-gallon barrel or a 250-500 gallon cistern tank is required.
- **Incorporate First-Flush Diverters**: Diverting dirty initial roof runoff prevents mud and organic decay in storage tanks.

---

## Rainwater Harvesting Governing Formulas

$$\text{Gross Stormwater Runoff (gal)} = \text{Roof Area (sq ft)} \times \text{Rainfall (in)} \times 0.6233 \text{ gal/sq ft/in}$$

$$\text{Effective Harvest (gal)} = \text{Gross Runoff (gal)} \times \text{Runoff Efficiency Rate}$$

$$\text{Barrels Needed} = \left\lceil \frac{\text{Effective Harvest (gal)}}{\text{Barrel Capacity (gal)}} \right\rceil$$

$$\text{Days of Garden Irrigation} = \frac{\text{Effective Harvest (gal)}}{\text{Daily Watering Usage (gal/day)}}$$

---

## Roof Rainwater Catchment Matrix (1.0 Inch Rainfall Event, 55 Gal Barrels)

| Roof Catchment Area | Gross Runoff (gal) | Effective Harvest (95%) | 55 Gal Barrels Needed | Days of Irrigation (15 gal/day) | Est. System Cost |
|---|---|---|---|---|---|
| **200 sq ft (Porch / Shed)** | 125 gal | **118 gal** | **3 barrels** | **7.9 days** | $255.00 |
| **500 sq ft (Garage Roof)** | 312 gal | **296 gal** | **6 barrels** | **19.7 days** | $510.00 |
| **800 sq ft (1/2 Main House)**| 499 gal | **474 gal** | **9 barrels** | **31.6 days** | $765.00 |
| **1,500 sq ft (Whole House)** | 935 gal | **888 gal** | **17 barrels (or 2x 500 gal Cistern)** | **59.2 days** | $1,445.00 |

---

## Step-by-Step Rainwater Harvesting Setup Guide

1. **Measure Roof Catchment Footprint**: Input square feet of roof area draining into your specific downspout.
2. **Select Roof Material**: Choose asphalt shingle (95%), tile (90%), or flat tar/gravel (75%) runoff coefficient.
3. **Select Design Storm Rainfall**: Choose 0.5", 1.0", or 2.0" rainfall event.
4. **Choose Storage Unit Size**: Select 50 gal, 55 gal, 100 gal, 250 gal, or 500 gal cistern tanks.
5. **Review System Requirements**: Order recommended rain barrels, check garden watering days provided, and calculate total system cost.

---

## Frequently Asked Questions

### How many gallons of water does 1 inch of rain generate from a roof?
One inch of rain falling on a 1,000 square foot roof generates approximately 623 gallons of stormwater runoff.

### How many rain barrels do I need for an 800 sq ft roof section?
For an 800 sq ft roof draining to one downspout during a 1-inch rainfall, approximately 473 gallons of water are harvested. This requires nine 55-gallon rain barrels or one 500-gallon cistern tank.

### What is the universal roof runoff formula?
The formula is: Harvested Gallons = Roof Footprint (sq ft) × Rainfall Depth (inches) × 0.623 (conversion constant) × Runoff Efficiency Rate.

### What is a first-flush diverter and why is it needed?
A first-flush diverter routes the initial 10 to 20 gallons of rain (which carries bird droppings, dust, and roof pollen) away from the rain barrel, ensuring clean water enters your storage tanks.

### Can I connect multiple rain barrels together in series?
Yes. Connecting rain barrels in series using 3/4-inch overflow hoses at the top of each barrel allows water to automatically fill the first barrel and cascade down to subsequent barrels.

### How much does a 55-gallon rain barrel cost?
A standard 55-gallon food-grade plastic rain barrel with brass spigot and overflow valve costs between $75 and $120.

### Is my personal data saved when using this calculator?
No. All calculation formulas run locally in your web browser.
