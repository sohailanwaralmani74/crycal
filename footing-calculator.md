---
layout: tool
title: "Footing | Interactive Online Tool"
description: "Calculate continuous foundation footing concrete volume in cubic yards, rebar linear feet, and total material cost."
permalink: /footing-calculator
tool_id: footing-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: footingLengthFt
    label: Total Footing Length (Feet)
    type: number
    default: 150
    step: 5
    min: 10
    placeholder: "e.g., 150"

  - id: footingWidthInches
    label: Footing Width (Inches)
    type: number
    default: 20
    step: 2
    min: 6
    placeholder: "e.g., 20"

  - id: footingDepthInches
    label: Footing Depth / Thickness (Inches)
    type: number
    default: 12
    step: 1
    min: 6
    placeholder: "e.g., 12"

  - id: rebarRuns
    label: Continuous Rebar Runs
    type: number
    default: 2
    step: 1
    min: 0
    placeholder: "e.g., 2"

  - id: concretePricePerYard
    label: Ready-Mix Concrete Cost Per Cu Yd
    type: number
    default: 140
    step: 5
    min: 50
    currency: true
    placeholder: "e.g., 140"

  - id: rebarPricePerFoot
    label: Rebar Cost Per Linear Foot (#4 / 1/2 in)
    type: number
    default: 0.85
    step: 0.05
    min: 0.10
    currency: true
    placeholder: "e.g., 0.85"

outputs:
  - id: totalFootingCost
    label: Total Footing Material Cost
  - id: concreteVolumeYards
    label: Concrete Volume (Cubic Yards)
  - id: rebarLengthFeet
    label: Total Rebar Needed (Linear Feet)
  - id: concreteCostTotal
    label: Concrete Material Cost

charts:
  tabs:
    - id: costBreakdown
      label: Concrete vs Rebar Cost
    - id: volumeVsLength
      label: Volume & Rebar Quantities

history_columns:
  - key: footingLengthFt
    label: Length (ft)
    source: input
  - key: footingWidthInches
    label: Width (in)
    source: input
  - key: concreteVolumeYards
    label: Volume (cu yd)
    source: output
  - key: totalFootingCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/footing-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Footing Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete volume in cubic yards, rebar length, and total costs for continuous concrete foundation footings."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Continuous concrete trench footing yardage calculation"
    - "Parallel rebar runs and overlap length estimation (15% lap factor)"
    - "Ready-mix concrete volume with 10% waste inclusion"
    - "170+ World Currencies supported"
    - "100% Private local browser execution"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Footing Calculator

howto:
  name: "How to Calculate Concrete Footing Volume and Rebar"
  description: "Determine exact ready-mix concrete yardage and steel rebar requirements for foundation trenches."
  step:
    - name: "Measure total footing trench length"
      text: "Sum the perimeter feet of all outer exterior walls and interior bearing wall footings."
    - name: "Enter width and depth in inches"
      text: "Input width (typically 16-24 inches) and depth (typically 10-12 inches) as specified by structural engineering plans."
    - name: "Specify rebar runs and material prices"
      text: "Select number of continuous rebar strands (usually 2 to 4) and local ready-mix price per cubic yard."

faq:
  - question: "How much concrete do I need for a 150 ft footing?"
    answer: "A 150 ft long footing that is 20 inches wide and 12 inches deep requires approximately 10.19 cubic yards of concrete (including a 10% waste factor)."
  - question: "How is continuous footing volume calculated?"
    answer: "Volume (cu yd) = [Length (ft) × (Width (in) / 12) × (Depth (in) / 12) / 27] × 1.10 (waste factor)."
  - question: "How much rebar overlap should be added for footings?"
    answer: "Building codes generally require a minimum 30-diameter or 12 to 15 inch rebar lap splice. Adding 15% extra to total linear length accounts for laps, corner bends, and cutting waste."
  - question: "What size rebar is standard for residential footings?"
    answer: "Standard residential footings use #4 rebar (1/2 inch diameter) or #5 rebar (5/8 inch diameter) laid continuously on rebar chairs."
  - question: "How deep should house foundation footings be poured?"
    answer: "Footings must extend below your local frost depth line (typically 12 inches in warm climates up to 48+ inches in freezing northern regions)."
  - question: "How wide should a concrete footing be relative to the wall?"
    answer: "As a rule of thumb, foundation footings are twice as wide as the foundation wall they support (e.g., a 20-inch wide footing for a 10-inch stem wall)."
  - question: "Is my personal calculation data stored or tracked?"
    answer: "No. All calculation operations run privately inside your local browser."
---

# Footing Calculator

Calculate exact ready-mix concrete **cubic yardage**, **rebar linear footage**, and total material cost for continuous residential and commercial foundation footings.

<!-- more -->

## Foundation Footing Formulas

$$\text{Width (ft)} = \frac{\text{Width (in)}}{12}, \quad \text{Depth (ft)} = \frac{\text{Depth (in)}}{12}$$

$$\text{Net Volume (cu ft)} = \text{Length (ft)} \times \text{Width (ft)} \times \text{Depth (ft)}$$

$$\text{Concrete Volume (cu yd)} = \frac{\text{Net Volume (cu ft)}}{27} \times 1.10 \quad \text{(with 10\% waste)}$$

$$\text{Total Rebar (ft)} = \text{Length (ft)} \times \text{Rebar Runs} \times 1.15 \quad \text{(with 15\% lap factor)}$$

$$\text{Total Footing Cost} = (\text{Concrete Vol} \times \text{Price/yd}) + (\text{Rebar Feet} \times \text{Rebar Price/ft})$$

---

## Foundation Footing Material Reference Table ($140/yd Concrete, $0.85/ft Rebar)

| Trench Length (Ft) | Footing Size (W × D) | Concrete Volume (+10%) | Rebar Runs | Total Rebar Feet (+15%) | Concrete Cost | Rebar Cost | Total Material Cost |
|---|---|---|---|---|---|---|---|
| **100 ft** | 16 in × 10 in | 4.53 cu yds | 2 runs | 230 linear ft | $634.20 | $195.50 | **$829.70** |
| **150 ft** | 20 in × 12 in | 10.19 cu yds | 2 runs | 345 linear ft | $1,426.60 | $293.25 | **$1,719.85** |
| **200 ft** | 24 in × 12 in | 16.30 cu yds | 3 runs | 690 linear ft | $2,282.00 | $586.50 | **$2,868.50** |
| **250 ft** | 24 in × 16 in | 27.16 cu yds | 4 runs | 1,150 linear ft | $3,802.40 | $977.50 | **$4,779.90** |

---

## Step-by-Step Guide: How to Calculate Foundation Footings

1. **Calculate Total Perimeter**: Measure the complete linear distance along foundation trench lines, including interior load-bearing footings.
2. **Specify Footing Dimensions**: Input structural footing width and depth specified by local building code or structural blueprints.
3. **Select Rebar Configuration**: Determine how many continuous strands of rebar (typically 2 to 4 bars) will be placed inside the footing.
4. **Order Ready-Mix Concrete**: Use the calculated cubic yardage (which includes 10% extra for trench unevenness) when placing your ready-mix order.

---

## Frequently Asked Questions

### How much concrete do I need for a 150 ft footing?
A 150 ft long footing that is 20 inches wide and 12 inches deep requires approximately 10.19 cubic yards of concrete (including a 10% waste factor).

### How is continuous footing volume calculated?
Volume (cu yd) = [Length (ft) × (Width (in) / 12) × (Depth (in) / 12) / 27] × 1.10 (waste factor).

### How much rebar overlap should be added for footings?
Building codes generally require a minimum 30-diameter or 12 to 15 inch rebar lap splice. Adding 15% extra to total linear length accounts for laps, corner bends, and cutting waste.

### What size rebar is standard for residential footings?
Standard residential footings use #4 rebar (1/2 inch diameter) or #5 rebar (5/8 inch diameter) laid continuously on rebar chairs.

### How deep should house foundation footings be poured?
Footings must extend below your local frost depth line (typically 12 inches in warm climates up to 48+ inches in freezing northern regions).

### How wide should a concrete footing be relative to the wall?
As a rule of thumb, foundation footings are twice as wide as the foundation wall they support (e.g., a 20-inch wide footing for a 10-inch stem wall).

### Is my personal calculation data stored or tracked?
No. All calculation operations run privately inside your local browser.
