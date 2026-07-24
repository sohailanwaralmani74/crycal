---
layout: tool
title: "Stucco | Interactive Online Tool"
description: "Calculate scratch coat, brown coat, finish coat bag quantities, ready-mix stucco volume, and total installation cost per square foot."
permalink: /stucco-calculator
tool_id: stucco-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: wallAreaSqFt
    label: Total Wall Area (Square Feet)
    type: number
    default: 1000
    step: 50
    min: 50
    placeholder: "e.g., 1000"

  - id: stuccoSystem
    label: Stucco System Type
    type: select
    default: three_coat
    options:
      - value: three_coat
        label: "3-Coat Stucco (Scratch, Brown & Finish - 7/8 in)"
      - value: two_coat
        label: "2-Coat Stucco over Masonry/CMU (Base & Finish - 1/2 in)"
      - value: one_coat
        label: "1-Coat / EIFS System (Base & Finish - 3/8 in)"

  - id: bagCost
    label: Cost Per 80 lb Base Coat Bag
    type: number
    default: 14.50
    step: 0.50
    min: 5.00
    currency: true
    placeholder: "e.g., 14.50"

  - id: finishBagCost
    label: Cost Per 80 lb Finish Coat Bag
    type: number
    default: 19.00
    step: 0.50
    min: 5.00
    currency: true
    placeholder: "e.g., 19.00"

  - id: laborCostPerSqFt
    label: Contractor Labor Rate Per Sq Ft
    type: number
    default: 6.50
    step: 0.50
    min: 0
    currency: true
    placeholder: "e.g., 6.50"

outputs:
  - id: totalStuccoCost
    label: Total Installed Stucco Cost
  - id: totalBaseBags
    label: Base Coat Bags (Scratch + Brown)
  - id: totalFinishBags
    label: Finish Coat Bags
  - id: costPerSqFt
    label: Total Installed Cost Per Sq Ft

charts:
  tabs:
    - id: costBreakdown
      label: Material vs Labor Cost
    - id: bagBreakdown
      label: Base vs Finish Coat Bags

history_columns:
  - key: wallAreaSqFt
    label: Wall Area (sq ft)
    source: input
  - key: stuccoSystem
    label: System Type
    source: input
  - key: totalBaseBags
    label: Base Bags
    source: output
  - key: totalStuccoCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/stucco-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Stucco Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate stucco scratch coat, brown coat, and finish coat bag counts and total installation costs."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "3-Coat, 2-Coat, and 1-Coat Stucco System material calculations"
    - "Scratch, Brown, and Finish bag estimator with 10% waste factor"
    - "Material and labor cost breakdown per square foot"
    - "170+ World Currencies support"
    - "100% Private local browser processing"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Stucco Calculator

howto:
  name: "How to Calculate Stucco Materials and Installation Cost"
  description: "Estimate base coat and finish coat bags plus total contractor cost for exterior stucco walls."
  step:
    - name: "Measure net wall area"
      text: "Calculate total exterior wall area in square feet, subtracting doors and windows."
    - name: "Select stucco application system"
      text: "Choose 3-coat traditional (7/8 in), 2-coat masonry (1/2 in), or 1-coat EIFS base (3/8 in)."
    - name: "Input bag prices and labor rate"
      text: "Enter local prices for 80 lb base coat bags, finish coat bags, and contractor labor per sq ft."

faq:
  - question: "How many bags of stucco base coat do I need for 1,000 sq ft?"
    answer: "For a traditional 3-coat stucco system (7/8 inch total thickness), 1,000 sq ft requires approximately 100 bags of 80 lb base coat (50 bags for scratch coat and 50 bags for brown coat, including 10% waste) plus 14 bags of finish coat."
  - question: "What is the coverage of an 80 lb bag of stucco?"
    answer: "An 80 lb bag of pre-blended stucco base coat covers approximately 20 to 22 sq ft at 3/8 inch thickness. Finish coat bags cover approximately 75 to 80 sq ft per 80 lb bag at 1/8 inch thickness."
  - question: "How much does exterior stucco installation cost per square foot?"
    answer: "Exterior stucco costs between $8.00 and $15.00 per square foot installed for 3-coat traditional stucco, including materials, lath wire, scratch, brown, finish coats, and labor."
  - question: "What is the difference between 3-coat, 2-coat, and 1-coat stucco?"
    answer: "3-coat stucco is traditional 7/8 in plaster over wood framing and wire lath. 2-coat is 1/2 in applied directly over masonry or CMU block. 1-coat is a modern 3/8 in fiber-reinforced polymer mix over rigid foam insulation."
  - question: "Does this calculator include waste factors?"
    answer: "Yes, the calculator automatically adds a 10% material waste factor to account for wall texture, board scrap, and mixer residual."
  - question: "How much lath wire and building paper are needed for stucco?"
    answer: "For wood-framed walls, you will need 1 roll of grade D building paper per 500 sq ft and expanded metal lath sheets equaling your total net wall square footage plus 10% for lap joints."
  - question: "Is my personal data saved on your server?"
    answer: "No. All computations execute locally inside your browser, ensuring complete privacy."
---

# Stucco Calculator

Estimate exact bag quantities for **scratch coat**, **brown coat**, and **acrylic finish coat**, as well as total material and contractor labor expenses for your exterior stucco siding project.

<!-- more -->

## Stucco Material & Cost Formulas

$$\text{Scratch Bags} = \left\lceil \frac{\text{Wall Area (sq ft)}}{22} \times 1.10 \right\rceil$$

$$\text{Brown Bags} = \left\lceil \frac{\text{Wall Area (sq ft)}}{22} \times 1.10 \right\rceil \quad \text{(for 3-Coat Systems)}$$

$$\text{Finish Bags} = \left\lceil \frac{\text{Wall Area (sq ft)}}{80} \times 1.10 \right\rceil$$

$$\text{Material Cost} = (\text{Base Bags} \times \text{Base Bag Price}) + (\text{Finish Bags} \times \text{Finish Bag Price})$$

$$\text{Total Project Cost} = \text{Material Cost} + (\text{Wall Area} \times \text{Labor Rate Per Sq Ft})$$

---

## Stucco System Comparison & Material Benchmark Table

| Wall Area (Sq Ft) | Stucco System | Base Coat Bags (80 lb) | Finish Bags (80 lb) | Material Cost ($14.50/$19.00) | Labor Cost ($6.50/sq ft) | Total Installed Cost |
|---|---|---|---|---|---|---|
| **500 sq ft** | 3-Coat Traditional (7/8 in) | 50 bags | 7 bags | $858.00 | $3,250.00 | **$4,108.00** |
| **1,000 sq ft** | 3-Coat Traditional (7/8 in) | 100 bags | 14 bags | $1,716.00 | $6,500.00 | **$8,216.00** |
| **1,500 sq ft** | 3-Coat Traditional (7/8 in) | 150 bags | 21 bags | $2,574.00 | $9,750.00 | **$12,324.00** |
| **1,000 sq ft** | 2-Coat over Masonry (1/2 in) | 50 bags | 14 bags | $991.00 | $5,500.00 | **$6,491.00** |
| **1,000 sq ft** | 1-Coat / EIFS (3/8 in) | 44 bags | 13 bags | $885.00 | $7,000.00 | **$7,885.00** |

---

## Step-by-Step Guide: How to Calculate Stucco Materials

1. **Calculate Net Wall Area**: Multiply total length by height of exterior walls. Subtract openings for windows and doors exceeding 20 sq ft.
2. **Determine Application System**:
   - **3-Coat (7/8")**: Required for framed wood walls; uses metal lath, scratch coat (3/8"), brown coat (3/8"), and finish coat (1/8").
   - **2-Coat (1/2")**: Used over concrete block (CMU) or poured concrete; omits scratch coat and metal lath.
   - **1-Coat / EIFS (3/8")**: Synthetic polymer stucco applied over insulation board.
3. **Calculate Bag Requirements**: Divide wall area by coverage rates (22 sq ft/bag for base, 80 sq ft/bag for finish) and add 10% for waste.
4. **Factor in Contractor Finishing Labor**: Average lathing and plastering labor ranges from $5.50 to $9.00 per sq ft depending on scaffolding and texture complexity.

---

## Frequently Asked Questions

### How many bags of stucco base coat do I need for 1,000 sq ft?
For a traditional 3-coat stucco system (7/8 inch total thickness), 1,000 sq ft requires approximately 100 bags of 80 lb base coat (50 bags for scratch coat and 50 bags for brown coat, including 10% waste) plus 14 bags of finish coat.

### What is the coverage of an 80 lb bag of stucco?
An 80 lb bag of pre-blended stucco base coat covers approximately 20 to 22 sq ft at 3/8 inch thickness. Finish coat bags cover approximately 75 to 80 sq ft per 80 lb bag at 1/8 inch thickness.

### How much does exterior stucco installation cost per square foot?
Exterior stucco costs between $8.00 and $15.00 per square foot installed for 3-coat traditional stucco, including materials, lath wire, scratch, brown, finish coats, and labor.

### What is the difference between 3-coat, 2-coat, and 1-coat stucco?
3-coat stucco is traditional 7/8 in plaster over wood framing and wire lath. 2-coat is 1/2 in applied directly over masonry or CMU block. 1-coat is a modern 3/8 in fiber-reinforced polymer mix over rigid foam insulation.

### Does this calculator include waste factors?
Yes, the calculator automatically adds a 10% material waste factor to account for wall texture, board scrap, and mixer residual.

### How much lath wire and building paper are needed for stucco?
For wood-framed walls, you will need 1 roll of grade D building paper per 500 sq ft and expanded metal lath sheets equaling your total net wall square footage plus 10% for lap joints.

### Is my personal data saved on your server?
No. All computations execute locally inside your browser, ensuring complete privacy.
