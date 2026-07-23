---
layout: tool
title: Mortar Calculator – Estimate Mortar Bags & Cubic Feet for Brick & CMU Walls
description: Calculate the number of 70lb or 80lb mortar bags, total cubic feet of mortar, masonry units, and costs for brick veneer or CMU block wall construction.
permalink: /mortar-calculator
tool_id: mortar-calculator
category: concrete-masonry
hide_sidebar: true

inputs:
  - id: wallArea
    label: Wall Area (Sq Ft)
    type: number
    default: 250
    step: 10
    min: 1
    placeholder: "e.g., 250"

  - id: unitType
    label: Masonry Unit Type
    type: select
    default: "brick"
    options:
      - value: "brick"
        label: "Standard Modular Brick (700 bricks / 100 sq ft)"
      - value: "cmu8"
        label: "8-Inch CMU Concrete Block (112 blocks / 100 sq ft)"
      - value: "cmu12"
        label: "12-Inch CMU Concrete Block (112 blocks / 100 sq ft)"

  - id: bagSize
    label: Mortar Mix Bag Weight
    type: select
    default: "80"
    options:
      - value: "80"
        label: "80 lb Bag (~0.67 cu ft yield)"
      - value: "70"
        label: "70 lb Bag (~0.58 cu ft yield)"

  - id: wasteFactor
    label: Waste & Spillage Allowance (%)
    type: number
    default: 10
    step: 1
    min: 0
    max: 30
    suffix: '%'
    placeholder: "e.g., 10"

  - id: pricePerBag
    label: Price per Bag 
    type: number
    default: 12.50
    step: 0.50
    min: 0
    prefix: '$'
    placeholder: "e.g., 12.50"

outputs:
  - id: totalBags
    label: Mortar Bags Needed (with Waste)
  - id: cubicFeet
    label: Total Cubic Feet of Mortar
  - id: totalUnits
    label: Masonry Units Required (Bricks/Blocks)
  - id: totalCost
    label: Total Mortar Cost

charts:
  tabs:
    - id: bagBreakdown
      label: Net Mortar vs Waste Allowance
    - id: costBreakdown
      label: Mortar Cost vs Waste Cost

history_columns:
  - key: wallArea
    label: Wall Area (sq ft)
    source: input
  - key: unitType
    label: Unit Type
    source: input
  - key: totalBags
    label: Bags Needed
    source: output
  - key: cubicFeet
    label: Mortar (cu ft)
    source: output
  - key: totalCost
    label: Total Cost 
    source: output

js_file: assets/js/calculators/mortar-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Mortar Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate pre-mixed mortar bag quantities (70lb/80lb), cubic feet of mortar yield, masonry unit counts, and material costs for brick and CMU walls."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Calculates mortar bags for modular brick, 8\" CMU, and 12\" CMU block construction"
    - "Supports standard 70 lb and 80 lb pre-mixed mortar bag sizes"
    - "Includes custom waste factor calculations to prevent job-site material shortages"
    - "100% free and runs instantly in your web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Mortar Calculator

howto:
  name: "How to Calculate Mortar Bags for Brick or Block Walls"
  description: "Accurately estimate pre-bagged mortar requirements and cubic foot volumes for masonry wall construction."
  step:
    - name: "Measure the total net wall area"
      text: "Calculate gross wall length multiplied by height in feet, subtracting any doors or window openings."
    - name: "Select the masonry unit type"
      text: "Choose between standard modular brick, 8-inch concrete block (CMU), or 12-inch CMU."
    - name: "Choose mortar bag weight"
      text: "Select either standard 80 lb pre-blended Type S/N mortar bags or 70 lb bags."
    - name: "Add waste factor and review costs"
      text: "Include 10% to 15% allowance for mortar board droppings, head joint buttering, and waste."

faq:
  - question: "How many 80lb bags of mortar do I need for 100 sq ft of brick wall?"
    answer: "A standard 100 sq ft modular brick wall (requiring ~700 bricks) uses approximately 5.5 to 6 bags of 80 lb mortar mix, or about 6 to 7 bags when including a standard 10% waste factor."
  - question: "How many 80lb mortar bags are needed per 100 CMU concrete blocks?"
    answer: "For standard 8\"x8\"x16\" CMU concrete blocks, you need approximately 3 bags of 80 lb mortar mix per 100 blocks. For 12\" CMU blocks, plan for approximately 4.2 bags per 100 blocks."
  - question: "What is the yield in cubic feet for an 80lb mortar bag?"
    answer: "One 80 lb bag of pre-mixed masonry mortar yields approximately 0.67 cubic feet of wet, workable mortar when properly mixed with water."
  - question: "What is the difference between Type N and Type S mortar?"
    answer: "Type N mortar has moderate compressive strength (~750 PSI) and is ideal for exterior non-loadbearing walls and interior brick veneer. Type S mortar has higher strength (~1,800 PSI) and is specified for below-grade foundations, structural CMU walls, and retaining walls."
  - question: "Should I add sand to pre-mixed packaged mortar bags?"
    answer: "No. Pre-blended commercial mortar bags (like Quikrete or Sakrete Mortar Mix) already contain sand and cementitious materials in precise ratios. You only need to add clean water."
  - question: "Why is a waste factor necessary when calculating mortar?"
    answer: "Mortar is subject to loss from board droppings, joint strike-off cleanup, uneven masonry unit dimensions, and stiffening (pot life expiration) during hot or windy weather."
  - question: "Can I use this mortar calculator for stone veneer?"
    answer: "Yes, standard manufactured stone veneer typically uses mortar quantities similar to 8-inch CMU block walls due to heavy scratch coat scratch backing and thick bed joints."
---

Calculate exact mortar bag quantities, cubic volume, and material expenses for brick veneer, 8-inch CMU block, and 12-inch CMU structural masonry walls.

<!-- more -->

## Why Use the Mortar Calculator?

Accurately calculating mortar volume is critical for masonry project management. Ordering too few bags halts construction mid-build, while over-ordering leads to spoiled cement bags hardening from moisture exposure. This **Mortar Calculator** streamlines estimation for both brickwork and concrete masonry unit (CMU) construction by factoring in unit coverage, bag yields (70lb vs 80lb), and jobsite waste allowances.

### Key Benefits
* **Multi-Unit Versatility:** Supports standard modular face brick, 8" CMU block, and heavy 12" structural CMU block walls.
* **Bag Yield Precision:** Adjusts calculations for both 80 lb (~0.67 cu ft yield) and 70 lb (~0.58 cu ft yield) pre-mixed bags.
* **Waste Management:** Prevents material shortfalls by incorporating a customizable 10% to 20% waste margin for joint strike-offs and board droppings.
* **Cost Control:** Instantly converts unit requirements into total project material budgets.

---

## Mortar Calculation Formulas

Mortar calculations rely on unit coverage factors combined with wet mix volume yields.

### 1. Brick Wall Mortar Requirement
Standard modular bricks require approximately $0.055$ bags of 80 lb mortar per square foot of wall area (or ~7 bags per 1,000 bricks with 3/8" bed joints):

$$N_{\text{brick\_bags}} = A_{\text{wall}} \times 0.055 \times \left(1 + \frac{W}{100}\right)$$

Where:
* $A_{\text{wall}}$ = Net wall surface area ($\text{ft}^2$)
* $W$ = Waste percentage (%)

### 2. CMU Block Wall Mortar Requirement
For 8-inch concrete masonry units (112 blocks per $100\text{ ft}^2$), mortar usage is calculated as:

$$N_{\text{cmu8\_bags}} = A_{\text{wall}} \times 0.0336 \times \left(1 + \frac{W}{100}\right)$$

For 12-inch concrete block, usage increases to $0.0470$ bags per square foot.

### 3. Bag Weight & Cubic Feet Conversion
When using 70 lb bags instead of standard 80 lb bags, a scaling factor of $\frac{80}{70} \approx 1.143$ is applied. Total mortar volume in cubic feet ($V_{\text{cuft}}$) is:

$$V_{\text{cuft}} = N_{\text{net\_80lb\_bags}} \times 0.67$$

---

## Real-World Masonry Mortar Comparison Table

The following reference table outlines typical material usage per 100 square feet of finished wall area across common masonry types (assuming standard 3/8" mortar joints and 80 lb bags):

| Masonry Unit Type | Units per 100 Sq Ft | Net 80lb Bags Needed | Net Cubic Feet | Estimated Material Cost ($12.50/bag) |
| :--- | :--- | :--- | :--- | :--- |
| **Modular Face Brick** | 700 Bricks | 5.5 Bags | 3.69 cu ft | $68.75 |
| **8" CMU Concrete Block** | 112 Blocks | 3.4 Bags | 2.28 cu ft | $42.50 |
| **12" CMU Structural Block** | 112 Blocks | 4.7 Bags | 3.15 cu ft | $58.75 |
| **Manufactured Stone Veneer** | 100 Sq Ft | 6.0 Bags | 4.02 cu ft | $75.00 |

---

## Step-by-Step Guide: How to Estimate Mortar Requirements

1. **Calculate Net Wall Area:** Multiply total wall length by wall height. Subtract window and door openings ($A_{\text{net}} = L \times H - A_{\text{openings}}$).
2. **Determine Masonry Unit:** Identify whether you are laying standard face brick (700 units per $100\text{ ft}^2$) or CMU concrete blocks (112 units per $100\text{ ft}^2$).
3. **Select Mortar Bag Size:** Verify bag weight on your material supply list. Standard pre-blended commercial bags come in 80 lb or 70 lb options.
4. **Apply Waste Allowance:** Include a 10% waste factor for standard flat walls, or 15% for intricate walls with numerous piers, corners, or decorative soldier courses.
5. **Compute Total Order:** Multiply total bag count by supplier unit cost to calculate your total masonry mortar budget.

---

## Frequently Asked Questions (FAQ)

### How many 80lb bags of mortar do I need for 100 sq ft of brick wall?
A standard 100 sq ft modular brick wall (requiring ~700 bricks) uses approximately 5.5 to 6 bags of 80 lb mortar mix, or about 6 to 7 bags when including a standard 10% waste factor.

### How many 80lb mortar bags are needed per 100 CMU concrete blocks?
For standard 8"x8"x16" CMU concrete blocks, you need approximately 3 bags of 80 lb mortar mix per 100 blocks. For 12" CMU blocks, plan for approximately 4.2 bags per 100 blocks.

### What is the yield in cubic feet for an 80lb mortar bag?
One 80 lb bag of pre-mixed masonry mortar yields approximately 0.67 cubic feet of wet, workable mortar when properly mixed with water.

### What is the difference between Type N and Type S mortar?
Type N mortar has moderate compressive strength (~750 PSI) and is ideal for exterior non-loadbearing walls and interior brick veneer. Type S mortar has higher strength (~1,800 PSI) and is specified for below-grade foundations, structural CMU walls, and retaining walls.

### Should I add sand to pre-mixed packaged mortar bags?
No. Pre-blended commercial mortar bags (like Quikrete or Sakrete Mortar Mix) already contain sand and cementitious materials in precise ratios. You only need to add clean water.

### Why is a waste factor necessary when calculating mortar?
Mortar is subject to loss from board droppings, joint strike-off cleanup, uneven masonry unit dimensions, and stiffening (pot life expiration) during hot or windy weather.

### Can I use this mortar calculator for stone veneer?
Yes, standard manufactured stone veneer typically uses mortar quantities similar to 8-inch CMU block walls due to heavy scratch coat scratch backing and thick bed joints.
