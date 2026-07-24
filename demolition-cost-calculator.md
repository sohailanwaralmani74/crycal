---
layout: tool
title: "Demolition Cost | Interactive Online Tool"
description: "Calculate interior gut demolition labor costs per sq ft, debris weight tonnage, roll-off dumpster sizes (10 to 40 yard), and haul away expenses."
permalink: /demolition-cost-calculator
tool_id: demolition-cost-calculator
category: project-cost-planning
hide_sidebar: true

inputs:
  - id: demoAreaSqFt
    label: Demolition Footprint Area (Square Feet)
    type: number
    default: 1200
    step: 50
    min: 50
    placeholder: "e.g., 1200"

  - id: demoType
    label: Demolition Scope & Material Type
    type: select
    default: "interior_gut"
    options:
      - value: "interior_gut"
        label: "Full Interior Gut (Drywall, Flooring, Cabinets, Framing)"
      - value: "kitchen_bath"
        label: "Kitchen & Bathroom Demo (Tile, Cabinets, Fixtures)"
      - value: "flooring_only"
        label: "Flooring & Drywall Removal Only"
      - value: "exterior_deck"
        label: "Shed / Wood Deck Exterior Demolition"

  - id: laborCostPerSqFt
    label: Demolition Labor Cost per Sq Ft 
    type: number
    default: 3.50
    step: 0.25
    min: 1.00
    currency: true
    placeholder: "e.g., 3.50"

  - id: haulAwayRatePerTon
    label: Landfill Tipping / Disposal Fee per Ton 
    type: number
    default: 80
    step: 5
    min: 30
    currency: true
    placeholder: "e.g., 80"

  - id: dumpsterRentalCount
    label: Number of Dumpster Rentals Needed
    type: number
    default: 1
    step: 1
    min: 1
    max: 10
    placeholder: "e.g., 1"

outputs:
  - id: totalDemoLaborCost
    label: Total Demolition Labor & Prep Cost
  - id: estimatedDebrisWeightTons
    label: Estimated Debris Weight (Tons)
  - id: recommendedDumpsterYardage
    label: Recommended Roll-Off Dumpster Size
  - id: totalDisposalCost
    label: Total Haul Away & Landfill Fee
  - id: totalProjectDemoCost
    label: Total Combined Demolition Project Cost

charts:
  tabs:
    - id: demoCostSplitChart
      label: Labor vs Disposal Cost Split
    - id: debrisWeightChart
      label: Debris Tonnage vs Area

history_columns:
  - key: totalProjectDemoCost
    label: Total Demo Cost
    source: output
  - key: totalDemoLaborCost
    label: Labor Cost
    source: output
  - key: estimatedDebrisWeightTons
    label: Debris (Tons)
    source: output
  - key: recommendedDumpsterYardage
    label: Dumpster Size
    source: output

js_file: assets/js/calculators/demolition-cost-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Demolition Cost Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate interior gut demolition costs per square foot, roll-off dumpster size recommendations, debris tonnage weight, and landfill tipping fees."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Demolition Scope Sizing — handles interior gutting, kitchen/bath tear-outs, drywall/flooring removal, and exterior deck teardowns"
    - "Debris Weight Tonnage Estimator — calculates exact waste weights in tons to select optimal roll-off dumpsters"
    - "Dumpster Capacity Matching — assigns 10-yard, 20-yard, 30-yard, or 40-yard roll-off dumpsters based on payload limits"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Demolition Cost Calculator

howto:
  name: "How to Estimate Residential Demolition Costs & Debris"
  description: "Calculate interior square footage, estimate debris weight tons, choose roll-off dumpsters, and compute labor and disposal costs."
  step:
    - name: "Measure Demolition Area"
      text: "Determine square footage of room footprints or whole house interiors scheduled for demolition."
    - name: "Select Demolition Scope"
      text: "Choose between full interior gut (drywall, cabinets, flooring), bath/kitchen teardowns, or light drywall/flooring removal."
    - name: "Enter Labor & Landfill Tipping Rates"
      text: "Input regional labor rate per sq ft ($2.00 to $6.00/sq ft) and landfill tipping fee per ton ($50 to $100/ton)."
    - name: "Review Dumpster Yardage & Budget"
      text: "Verify recommended roll-off dumpster size (10yd, 20yd, 30yd, or 40yd) and total project estimate."

faq:
  - question: "How much does interior demolition cost per square foot?"
    answer: "Interior gut demolition typically costs between $2.00 and $6.00 per square foot depending on structural complexity, plaster vs drywall removal, electrical disconnects, and regional labor rates."
  - question: "What size dumpster do I need for a 1,000 sq ft house gut demolition?"
    answer: "A full interior gut of a 1,000 sq ft house generates approximately 15 to 20 tons of construction debris (heavy tile, plaster, flooring, framing), requiring two 30-yard or 40-yard roll-off dumpsters."
  - question: "How much weight can a 20-yard roll-off dumpster hold?"
    answer: "A standard 20-yard dumpster holds up to 10 cubic yards of dense material or 20 cubic yards of light material, with a weight allowance limit of 2 to 3 tons (4,000 to 6,000 lbs)."
  - question: "What are landfill tipping fees?"
    answer: "Landfill tipping fees are charges assessed by municipal solid waste facilities or recycling centers to dump commercial construction debris, averaging $50 to $90 per ton across North America."
  - question: "Does demolition cost include hazardous material removal (asbestos/lead)?"
    answer: "No. Standard demolition quotes cover non-hazardous materials. Asbestos abatement (popcorn ceilings, pipe wrap, vinyl tile) or lead paint containment adds $5.00 to $15.00 per square foot."
  - question: "What utility disconnects are required before interior demolition?"
    answer: "Main electric service must be shut off, gas lines capped by a licensed plumber, and water supplies isolated before tearing into interior walls or ceiling drywall."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculations run strictly inside your web browser."
---

# Demolition Cost Calculator

Planning a major home renovation starts with tearing out old drywall, cabinets, flooring, and non-load-bearing framing. Use our **Demolition Cost Calculator** to estimate total labor costs per square foot, total construction debris weight in tons, roll-off dumpster size requirements (10 to 40 yard), and landfill tipping fees.

<!-- more -->

## Why Use a Demolition Cost Calculator?

Demolition waste is heavy and voluminous. Miscalculating debris tonnage leads to overloaded dumpsters, municipal overweight fines, and unexpected landfill fees:

- **Accurate Debris Weight Estimation**: Convert floor square footage into construction waste weight in tons based on material type (dense tile/plaster vs light sheetrock).
- **Match Dumpster Payload Limits**: Identify whether your job requires a 10-yard, 20-yard, 30-yard, or 40-yard roll-off dumpster.
- **Separate Labor & Disposal Fees**: Clearly separate crew labor tear-out costs from landfill tipping charges and dumpster rental fees.
- **Budget Scope Variations**: Compare full interior gutting costs against selective kitchen/bathroom or flooring-only removals.

---

## Demolition Cost & Debris Formulas

$$\text{Labor Demo Cost} = \text{Area (sq ft)} \times \text{Labor Rate per Sq Ft}$$

$$\text{Estimated Debris Weight (Tons)} = \text{Area (sq ft)} \times \text{Scope Weight Multiplier}$$

$$\text{Tipping Fee} = \text{Estimated Debris Weight (Tons)} \times \text{Landfill Rate per Ton}$$

$$\text{Total Disposal Cost} = (\text{Dumpster Rental Count} \times \$450) + \text{Tipping Fee}$$

$$\text{Total Demolition Project Cost} = \text{Labor Demo Cost} + \text{Total Disposal Cost}$$

*Scope Weight Multipliers (tons/sq ft): Interior Gut = 0.020; Kitchen/Bath = 0.015; Flooring Only = 0.008; Exterior Deck = 0.012.*

---

## Real-World Demolition Cost & Dumpster Size Reference Table

The table below presents labor cost, debris weight, recommended roll-off dumpster sizing, and total project expenses for common renovation projects.

| Renovation Project Scope | Demo Footprint | Labor Rate ($/sq ft) | Debris Weight (Tons) | Recommended Dumpster | Total Disposal Cost | Total Demolition Cost |
|---|---|---|---|---|---|---|
| **Small Bath Teardown** | 100 sq ft | $4.00 / sq ft | 1.5 Tons | **10-Yard Dumpster** | $570.00 | **$970.00** |
| **Kitchen & Pantry Gut** | 300 sq ft | $4.00 / sq ft | 4.5 Tons | **20-Yard Dumpster** | $810.00 | **$2,010.00** |
| **Basement Gut Demolition**| 800 sq ft | $3.50 / sq ft | 16.0 Tons | **30-Yard Dumpster** | $1,730.00 | **$4,530.00** |
| **Whole House Interior Gut**| 1,500 sq ft | $3.50 / sq ft | 30.0 Tons | **40-Yard Dumpster (2 trips)**| $3,300.00 | **$8,550.00** |
| **Large Estate Interior** | 3,000 sq ft | $3.00 / sq ft | 60.0 Tons | **40-Yard Dumpster (4 trips)**| $6,600.00 | **$15,600.00** |

---

## Step-by-Step Guide: How to Prepare for Home Demolition

1. **Conduct Environmental Inspection**: Test older homes (pre-1978) for asbestos insulation, vinyl tile backing, or lead paint before starting demo.
2. **Cap Utilities**: Disconnect electrical circuits, cap plumbing supply lines, and shut off gas service.
3. **Order Roll-Off Dumpster**: Reserve a 20-yard or 30-yard roll-off dumpster and obtain a street placement permit if parking on public property.
4. **Protect Unmodified Zones**: Hang heavy plastic dust barriers (ZipWall) and lay floor protection along haul routes.
5. **Load Heavy Debris First**: Place dense concrete, tile, and plaster at the bottom of the dumpster before loading bulky drywall and lumber.

---

## Frequently Asked Questions

### How much does interior demolition cost per square foot?
Interior gut demolition typically costs between $2.00 and $6.00 per square foot depending on structural complexity, plaster vs drywall removal, electrical disconnects, and regional labor rates.

### What size dumpster do I need for a 1,000 sq ft house gut demolition?
A full interior gut of a 1,000 sq ft house generates approximately 15 to 20 tons of construction debris (heavy tile, plaster, flooring, framing), requiring two 30-yard or 40-yard roll-off dumpsters.

### How much weight can a 20-yard roll-off dumpster hold?
A standard 20-yard dumpster holds up to 10 cubic yards of dense material or 20 cubic yards of light material, with a weight allowance limit of 2 to 3 tons (4,000 to 6,000 lbs).

### What are landfill tipping fees?
Landfill tipping fees are charges assessed by municipal solid waste facilities or recycling centers to dump commercial construction debris, averaging $50 to $90 per ton across North America.

### Does demolition cost include hazardous material removal (asbestos/lead)?
No. Standard demolition quotes cover non-hazardous materials. Asbestos abatement (popcorn ceilings, pipe wrap, vinyl tile) or lead paint containment adds $5.00 to $15.00 per square foot.

### What utility disconnects are required before interior demolition?
Main electric service must be shut off, gas lines capped by a licensed plumber, and water supplies isolated before tearing into interior walls or ceiling drywall.

### Is my personal data saved when using this calculator?
No. All calculations run strictly inside your web browser.
