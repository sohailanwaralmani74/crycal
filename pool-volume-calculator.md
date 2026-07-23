---
layout: tool
title: Pool Volume Calculator – Swimming Pool Water Volume in Gallons & Liters
description: Calculate swimming pool water volume in US gallons and liters for rectangular, round, or oval pools based on dimensions and shallow/deep end depths.
permalink: /pool-volume-calculator
tool_id: pool-volume-calculator
category: landscaping-outdoor
hide_sidebar: true

inputs:
  - id: poolShape
    label: Pool Shape
    type: select
    default: rectangular
    options:
      - value: rectangular
        label: Rectangular Pool
      - value: round
        label: Round / Circular Pool
      - value: oval
        label: Oval Pool

  - id: lengthFt
    label: Length (ft) / Diameter (ft)
    type: number
    default: 32
    step: 1
    min: 1
    placeholder: "e.g., 32"

  - id: widthFt
    label: Width (ft) (N/A for Round)
    type: number
    default: 16
    step: 1
    min: 0
    placeholder: "e.g., 16"

  - id: shallowDepthFt
    label: Shallow End Depth (ft)
    type: number
    default: 3
    step: 0.5
    min: 0.5
    placeholder: "e.g., 3"

  - id: deepDepthFt
    label: Deep End Depth (ft)
    type: number
    default: 8
    step: 0.5
    min: 0.5
    placeholder: "e.g., 8"

outputs:
  - id: volumeGallons
    label: Pool Volume (US Gallons)
  - id: volumeLiters
    label: Pool Volume (Liters)
  - id: avgDepthFt
    label: Average Depth (Feet)
  - id: waterWeightLbs
    label: Total Water Weight (Lbs)

charts:
  tabs:
    - id: volumeUnits
      label: Gallons vs Liters
    - id: depthProfile
      label: Depth Profile (ft)

history_columns:
  - key: poolShape
    label: Shape
    source: input
  - key: lengthFt
    label: Length/Dia
    source: input
  - key: volumeGallons
    label: Volume (Gal)
    source: output
  - key: volumeLiters
    label: Volume (L)
    source: output

js_file: assets/js/calculators/pool-volume-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Pool Volume Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate swimming pool water capacity in gallons and liters for rectangular, round, and oval pools."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Multi-Shape Pool Geometry — supports Rectangular, Round, and Oval swimming pools"
    - "Variable Depth Calculation — computes exact average depth across shallow and deep ends"
    - "Dual Unit Output — provides instant conversion between US Gallons and Liters"
    - "Water Weight Estimation — computes total water mass in pounds for structural planning"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Pool Volume Calculator

howto:
  name: "How to Calculate Swimming Pool Water Volume"
  description: "Estimate pool water volume in gallons and liters for accurate chemical dosing and pool maintenance."
  step:
    - name: "Select pool shape"
      text: "Choose whether your swimming pool is Rectangular, Round (circular), or Oval."
    - name: "Enter dimensions"
      text: "Specify pool length and width in feet (or diameter for round pools)."
    - name: "Input shallow & deep depths"
      text: "Enter water depth at the shallowest point and deepest point in feet."

faq:
  - question: "How do I calculate pool volume in gallons?"
    answer: "For rectangular pools, multiply Length × Width × Average Depth × 7.48. For round pools, multiply 3.14159 × Radius² × Average Depth × 7.48. For oval pools, multiply 3.14159 × Half Length × Half Width × Average Depth × 7.48."
  - question: "How is average pool depth calculated?"
    answer: "Average depth is calculated by adding the shallow end depth and deep end depth together, then dividing by 2: (Shallow Depth + Deep Depth) / 2."
  - question: "Why is knowing pool water volume important?"
    answer: "Knowing exact pool volume is critical for applying correct pool chemicals (chlorine shock, algaecides, pH balancers), sizing pool pumps and filters, and estimating pool heating costs."
  - question: "How many gallons of water are in a 16x32 pool?"
    answer: "A standard 16x32 foot rectangular pool with a shallow depth of 3 feet and deep end of 8 feet (5.5 ft avg depth) holds approximately 21,050 US gallons (79,700 liters)."
  - question: "How much does pool water weigh?"
    answer: "One US gallon of fresh water weighs approximately 8.34 pounds (1.0 kg per liter). A 20,000 gallon swimming pool contains over 166,800 pounds (83.4 tons) of water."
  - question: "What is the turnover rate for a swimming pool?"
    answer: "Turnover rate is the time required for a pool pump to circulate the total pool water volume through the filter system, typically recommended as 8 hours for residential pools."
  - question: "Is my personal data saved on this site?"
    answer: "No. All pool volume calculations are computed locally inside your web browser. No data is sent or stored externally."
---

# Pool Volume Calculator – Swimming Pool Water Volume in Gallons & Liters

Calculate exact pool water capacity in **US Gallons** and **Liters** for rectangular, round, and oval pools with our free **Pool Volume Calculator**.

<!-- more -->

## Why Calculate Swimming Pool Water Volume?

Accurately knowing your pool's water capacity is essential for maintaining proper water clarity, structural safety, and equipment performance:

- **Chemical Dosing Accuracy**: Chlorination, pH stabilization, cyanuric acid balance, and shock treatments rely on exact gallon volume to prevent over-chemicalization or algae blooms.
- **Filter & Pump Sizing**: Pool turnover rate requirements dictate pump flow rate (GPM) based on total gallon capacity divided by desired turnover hours.
- **Water Fill & Utility Costs**: Helps homeowners estimate municipal water utility rates or water delivery truck costs when filling or topping off a pool.
- **Pool Heater Sizing**: Gas heaters and heat pumps are sized by BTU output required to raise total water mass by specified degrees Fahrenheit.

---

## Pool Volume Calculation Formulas

$$\text{Average Depth } (D) = \frac{\text{Shallow Depth (ft)} + \text{Deep Depth (ft)}}{2}$$

$$\text{Rectangular Volume (cu ft)} = \text{Length} \times \text{Width} \times D$$

$$\text{Round Volume (cu ft)} = \pi \times \left(\frac{\text{Diameter}}{2}\right)^2 \times D$$

$$\text{Oval Volume (cu ft)} = \pi \times \frac{\text{Length}}{2} \times \frac{\text{Width}}{2} \times D$$

$$\text{Volume (US Gallons)} = \text{Volume (cu ft)} \times 7.48052$$

$$\text{Volume (Liters)} = \text{Volume (US Gallons)} \times 3.78541$$

$$\text{Water Mass (Lbs)} = \text{Volume (US Gallons)} \times 8.34$$

---

## Standard Swimming Pool Water Capacity Reference Table

| Pool Shape & Dimensions | Shallow / Deep Depth | Avg Depth | Volume (US Gallons) | Volume (Liters) | Water Weight (Lbs) |
|---|---|---|---|---|---|
| **Rectangular 12 ft × 24 ft** | 3 ft / 6 ft | 4.5 ft | **9,695 Gal** | **36,698 L** | **80,854 lbs** |
| **Rectangular 16 ft × 32 ft** | 3 ft / 8 ft | 5.5 ft | **21,050 Gal** | **79,683 L** | **175,557 lbs** |
| **Rectangular 20 ft × 40 ft** | 3.5 ft / 8.5 ft | 6.0 ft | **35,907 Gal** | **135,920 L** | **299,460 lbs** |
| **Round 18 ft Diameter** | 4 ft Flat | 4.0 ft | **7,614 Gal** | **28,822 L** | **63,501 lbs** |
| **Round 24 ft Diameter** | 4 ft Flat | 4.0 ft | **13,536 Gal** | **51,240 L** | **112,890 lbs** |
| **Round 30 ft Diameter** | 4.5 ft Flat | 4.5 ft | **23,792 Gal** | **90,063 L** | **198,425 lbs** |
| **Oval 15 ft × 30 ft** | 3 ft / 6 ft | 4.5 ft | **11,421 Gal** | **43,233 L** | **95,251 lbs** |
| **Oval 18 ft × 33 ft** | 3.5 ft / 7.5 ft | 5.5 ft | **18,348 Gal** | **69,455 L** | **153,022 lbs** |

---

## How to Use the Pool Volume Calculator

1. Select your pool design from the **Pool Shape** menu (Rectangular, Round, or Oval).
2. Enter the **Length (or Diameter)** and **Width** in feet.
3. Input the **Shallow End Depth** and **Deep End Depth** in feet.
4. Review total water volume in **US Gallons**, **Liters**, average depth, and total water mass in pounds.
5. Use the chart tab toggles to analyze volume unit conversions and depth profile ratios.

---

## Frequently Asked Questions

### How do I calculate pool volume in gallons?
For rectangular pools, multiply Length × Width × Average Depth × 7.48. For round pools, multiply 3.14159 × Radius² × Average Depth × 7.48. For oval pools, multiply 3.14159 × Half Length × Half Width × Average Depth × 7.48.

### How is average pool depth calculated?
Average depth is calculated by adding the shallow end depth and deep end depth together, then dividing by 2: `(Shallow Depth + Deep Depth) / 2`.

### Why is knowing pool water volume important?
Knowing exact pool volume is critical for applying correct pool chemicals (chlorine shock, algaecides, pH balancers), sizing pool pumps and filters, and estimating pool heating costs.

### How many gallons of water are in a 16x32 pool?
A standard 16x32 foot rectangular pool with a shallow depth of 3 feet and deep end of 8 feet (5.5 ft avg depth) holds approximately 21,050 US gallons (79,700 liters).

### How much does pool water weigh?
One US gallon of fresh water weighs approximately 8.34 pounds (1.0 kg per liter). A 20,000 gallon swimming pool contains over 166,800 pounds (83.4 tons) of water.

### What is the turnover rate for a swimming pool?
Turnover rate is the time required for a pool pump to circulate the total pool water volume through the filter system, typically recommended as 8 hours for residential pools.

### Is my personal data saved on this site?
No. All pool volume calculations are computed locally inside your web browser. No data is sent or stored externally.
