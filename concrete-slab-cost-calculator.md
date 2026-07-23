---
layout: tool
title: Concrete Slab Cost Calculator – Material & Labor Cost Estimator
description: Calculate total cost, cost per square foot, material cost, and contractor labor for concrete slabs, patios, driveways, and foundations.
permalink: /concrete-slab-cost-calculator
tool_id: concrete-slab-cost-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: slabAreaSqFt
    label: Total Slab Area (Square Feet)
    type: number
    default: 400
    step: 25
    min: 10
    placeholder: "e.g., 400"

  - id: slabThicknessInches
    label: Slab Thickness (Inches)
    type: number
    default: 4
    step: 0.5
    min: 2
    placeholder: "e.g., 4"

  - id: concreteCostPerYard
    label: Concrete Cost Per Cubic Yard
    type: number
    default: 135
    step: 5
    min: 50
    currency: true
    placeholder: "e.g., 135"

  - id: laborCostPerSqFt
    label: Contractor Labor & Finishing Cost Per Sq Ft
    type: number
    default: 5.50
    step: 0.50
    min: 0
    currency: true
    placeholder: "e.g., 5.50"

outputs:
  - id: totalSlabProjectCost
    label: Total Installed Slab Cost
  - id: totalCostPerSqFt
    label: Total Cost Per Square Foot
  - id: totalMaterialCost
    label: Concrete Material Cost
  - id: totalLaborCost
    label: Total Contractor Labor Cost

charts:
  tabs:
    - id: costBreakdown
      label: Material vs Labor Cost
    - id: volumeCost
      label: Concrete Volume & Price

history_columns:
  - key: slabAreaSqFt
    label: Area (sq ft)
    source: input
  - key: slabThicknessInches
    label: Thickness
    source: input
  - key: totalSlabProjectCost
    label: Total Cost
    source: output
  - key: totalCostPerSqFt
    label: Cost / Sq Ft
    source: output

js_file: assets/js/calculators/concrete-slab-cost-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Concrete Slab Cost Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate concrete slab costs including material per yard and contractor finishing labor per square foot."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Total Project Cost Estimation — combines ready-mix concrete material and labor finishing rates"
    - "Square Foot Rate Breakdown — calculate exact total cost per installed sq ft"
    - "170+ World Currencies — auto-format material and labor costs globally"
    - "100% Private — all calculations execute locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Concrete Slab Cost Calculator

howto:
  name: "How to Calculate Concrete Slab Cost"
  description: "Estimate total material and labor expense for poured concrete slabs."
  step:
    - name: "Enter square footage"
      text: "Input total length × width area of your slab."
    - name: "Set thickness & yard price"
      text: "Specify slab thickness (e.g. 4 inches) and ready-mix concrete price per cubic yard."
    - name: "Include labor rate"
      text: "Input local contractor labor rate per square foot."

faq:
  - question: "How much does a 20x20 concrete slab cost?"
    answer: "A 20x20 concrete slab (400 sq ft, 4 inches thick) typically costs between $2,400 and $4,400 installed ($6 to $11 per sq ft), depending on labor and site preparation."
  - question: "What is the average cost per square foot for puring a concrete slab?"
    answer: "The national average cost for an installed concrete slab ranges from $6.00 to $12.00 per square foot, including site excavation, rebar mesh, forms, concrete, and finishing labor."
  - question: "How many cubic yards of concrete are needed for a 400 sq ft slab?"
    answer: "A 400 sq ft slab at 4 inches thickness requires approximately 4.94 cubic yards of concrete (including a 10% waste factor)."
  - question: "What factors increase concrete slab installation costs?"
    answer: "Costs increase with thicker slabs (6 inches vs 4 inches), stamped/colored finishes, site grading, pump truck rental, and heavy rebar reinforcement."
  - question: "How does slab thickness affect total cost?"
    answer: "Increasing slab thickness from 4 inches to 6 inches increases concrete volume (and material cost) by 50%."
  - question: "Is DIY pouring cheaper than hiring a contractor?"
    answer: "DIY saves labor ($3 to $7/sq ft), but requires building forms, ordering ready-mix or mixing 50+ heavy bags, leveling, screeding, and floating before concrete sets."
  - question: "Is my personal data stored anywhere?"
    answer: "No. All calculations run locally in your web browser."
---

# Concrete Slab Cost Calculator – Material & Labor Cost Estimator

Calculate total installed project cost, **Cost Per Square Foot**, concrete material expenses, and contractor labor fees with our free **Concrete Slab Cost Calculator**.

<!-- more -->

## Concrete Slab Cost Formulas

$$\text{Thickness (ft)} = \frac{\text{Thickness (in)}}{12}$$
$$\text{Volume (cu yd)} = \frac{\text{Area (sq ft)} \times \text{Thickness (ft)}}{27} \times 1.10 \quad \text{(with 10\% waste)}$$
$$\text{Material Cost} = \text{Volume (cu yd)} \times \text{Cost Per Yard}$$
$$\text{Labor Cost} = \text{Area (sq ft)} \times \text{Labor Rate Per Sq Ft}$$
$$\text{Total Project Cost} = \text{Material Cost} + \text{Labor Cost}$$

---

## Installed Concrete Slab Cost Table ($135/yd Concrete, $5.50/sq ft Labor)

| Slab Size & Area | Slab Thickness | Concrete Volume (+10%) | Material Cost | Labor Cost | Total Installed Cost | Installed Cost / Sq Ft |
|---|---|---|---|---|---|---|
| **10 ft × 10 ft (100 sq ft)** | 4 inches | 1.36 cu yds | $183.60 | $550.00 | **$733.60** | **$7.34 / sq ft** |
| **12 ft × 20 ft (240 sq ft)** | 4 inches | 3.26 cu yds | $440.10 | $1,320.00 | **$1,760.10** | **$7.33 / sq ft** |
| **20 ft × 20 ft (400 sq ft)** | 4 inches | 5.43 cu yds | $733.05 | $2,200.00 | **$2,933.05** | **$7.33 / sq ft** |
| **24 ft × 24 ft (576 sq ft)** | 6 inches (Driveway) | 11.73 cu yds | $1,583.55 | $3,168.00 | **$4,751.55** | **$8.25 / sq ft** |

---

## How to Use This Concrete Slab Cost Calculator

1. Select your preferred **account currency** from the header picker.
2. Enter total **slab area in square feet** (e.g., 400 sq ft).
3. Input **slab thickness in inches** (4 in for patio, 6 in for driveway).
4. Enter **concrete cost per cubic yard** (national avg ~$135/yd).
5. Specify **contractor labor rate per square foot** (avg ~$5.50/sq ft).
6. View total installed project cost, cost per sq ft, and material vs labor breakdown.

---

## Frequently Asked Questions

### How much does a 20x20 concrete slab cost?
A 20x20 concrete slab (400 sq ft, 4 inches thick) typically costs between $2,400 and $4,400 installed ($6 to $11 per sq ft), depending on labor and site preparation.

### What is the average cost per square foot for pouring a concrete slab?
The national average cost for an installed concrete slab ranges from $6.00 to $12.00 per square foot, including site excavation, rebar mesh, forms, concrete, and finishing labor.

### How many cubic yards of concrete are needed for a 400 sq ft slab?
A 400 sq ft slab at 4 inches thickness requires approximately 4.94 cubic yards of concrete (including a 10% waste factor).

### What factors increase concrete slab installation costs?
Costs increase with thicker slabs (6 inches vs 4 inches), stamped/colored finishes, site grading, pump truck rental, and heavy rebar reinforcement.

### How does slab thickness affect total cost?
Increasing slab thickness from 4 inches to 6 inches increases concrete volume (and material cost) by 50%.

### Is DIY pouring cheaper than hiring a contractor?
DIY saves labor ($3 to $7/sq ft), but requires building forms, ordering ready-mix or mixing 50+ heavy bags, leveling, screeding, and floating before concrete sets.

### Is my personal data stored anywhere?
No. All calculations run locally in your web browser.
