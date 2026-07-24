---
layout: tool
title: "Vapor Barrier | Interactive Online Tool"
description: "Calculate 6mil, 10mil, and 20mil polyethylene vapor barrier rolls, seam tape, and material costs for crawlspace encapsulation and wall stud installation."
permalink: /vapor-barrier-calculator
tool_id: vapor-barrier-calculator
category: insulation-hvac
hide_sidebar: true

inputs:
  - id: projectType
    label: Vapor Barrier Project Type
    type: select
    default: "crawlspace"
    options:
      - value: "crawlspace"
        label: "Crawlspace Encapsulation (Ground + Perimeter Foundation Walls)"
      - value: "wall_studs"
        label: "Exterior Wall Studs / Ceiling (Framing Only)"

  - id: spaceLength
    label: Space Floor Length (Feet)
    type: number
    default: 40
    step: 2
    min: 5
    placeholder: "e.g., 40"

  - id: spaceWidth
    label: Space Floor Width (Feet)
    type: number
    default: 30
    step: 2
    min: 5
    placeholder: "e.g., 30"

  - id: crawlspaceWallHeight
    label: Crawlspace Foundation Wall Height (Feet)
    type: number
    default: 4
    step: 0.5
    min: 0
    max: 10
    placeholder: "e.g., 4"

  - id: overlapPercentage
    label: Seam Overlap & Waste Allowance (%)
    type: select
    default: "15"
    options:
      - value: "10"
        label: "10% Overlap (6 Inch Seam Overlap)"
      - value: "15"
        label: "15% Overlap (12 Inch Seam Overlap Standard)"
      - value: "20"
        label: "20% Overlap (Deep Posts / Irregular Piers)"

  - id: polyThickness
    label: Polyethylene Plastic Membrane Thickness
    type: select
    default: "10mil"
    options:
      - value: "6mil"
        label: "6 Mil Clear/Black (Standard Building Code Minimum)"
      - value: "10mil"
        label: "10 Mil Virgin Poly (Heavy Duty Crawlspace)"
      - value: "12mil"
        label: "12 Mil Cord-Reinforced (Tear Resistant)"
      - value: "20mil"
        label: "20 Mil Heavy Duty Commercial Encapsulation"

  - id: rollWidthFeet
    label: Plastic Roll Width (Feet)
    type: select
    default: "12"
    options:
      - value: "10"
        label: "10 Feet Wide Roll"
      - value: "12"
        label: "12 Feet Wide Roll"
      - value: "20"
        label: "20 Feet Wide Roll"

  - id: rollLengthFeet
    label: Plastic Roll Length (Feet)
    type: select
    default: "100"
    options:
      - value: "50"
        label: "50 Feet Roll Length (500-1,000 sq ft)"
      - value: "100"
        label: "100 Feet Roll Length (1,000-2,000 sq ft)"

  - id: rollPrice
    label: Price Per Plastic Vapor Barrier Roll
    type: number
    default: 165.00
    step: 5.00
    min: 0
    currency: true
    placeholder: "e.g., 165.00"

  - id: tapePrice
    label: Price Per Seam Tape Roll (180 ft Roll)
    type: number
    default: 28.00
    step: 1.00
    min: 0
    currency: true
    placeholder: "e.g., 28.00"

outputs:
  - id: netAreaSqFt
    label: Net Surface Area (Sq Ft)
  - id: grossAreaSqFt
    label: Gross Area with Seam Overlap (Sq Ft)
  - id: polyRollsNeeded
    label: Poly Vapor Barrier Rolls Needed
  - id: seamTapeRollsNeeded
    label: Heavy Duty Seam Tape Rolls Needed
  - id: totalMaterialCost
    label: Total Poly Plastic & Tape Cost

charts:
  tabs:
    - id: areaBreakdownNetVsOverlap
      label: Net Area vs Seam Overlap
    - id: polyRollUsageByThickness
      label: Roll Count & Material Cost

history_columns:
  - key: netAreaSqFt
    label: Net Area
    source: output
  - key: polyThickness
    label: Thickness
    source: input
  - key: polyRollsNeeded
    label: Poly Rolls
    source: output
  - key: totalMaterialCost
    label: Total Cost
    source: output

js_file: assets/js/calculators/vapor-barrier-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Vapor Barrier Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate 6mil, 10mil, and 20mil polyethylene vapor barrier rolls, seam tape, and costs for crawlspaces and wall studs."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Crawlspace Geometry Modeling — calculates floor area, perimeter walls, and support piers"
    - "Seam Overlap Adjuster — includes 6 to 12 inch overlapping seams and wall terminations"
    - "Foundation Tape & Sealant Estimator — measures linear feet of seam tape and butyl mastic"
    - "100% Client-Side Privacy — runs locally in web browser"

breadcrumb:
  - name: Home
    url: /
  - name: Construction
    url: /construction
  - name: Vapor Barrier Calculator

howto:
  name: "How to Calculate Vapor Barrier Roll Quantities"
  description: "Determine polyethylene plastic vapor barrier rolls and seam tape needed for crawlspaces and wall studs."
  step:
    - name: "Select project type"
      text: "Choose between crawlspace encapsulation (floor + walls) or exterior wall stud installation."
    - name: "Enter space dimensions"
      text: "Input floor length and width in feet, and crawlspace foundation wall height."
    - name: "Select plastic thickness & roll size"
      text: "Choose 6mil, 10mil, 12mil, or 20mil poly and select roll width (10ft, 12ft, or 20ft)."
    - name: "Set seam overlap percentage"
      text: "Select 15% overlap for standard 12-inch taped seams."
    - name: "Review roll counts & costs"
      text: "Get required poly roll counts, seam tape roll counts, and total material cost."

faq:
  - question: "What thickness vapor barrier should I use in a crawlspace?"
    answer: "Building code requires a minimum of 6 mil polyethylene sheeting for dirt crawlspace floors. However, 10 mil to 20 mil reinforced vapor retarders are strongly recommended for crawlspace encapsulation to withstand foot traffic and puncture from rocks."
  - question: "How much overlap is required for vapor barrier seams?"
    answer: "Seams should overlap by at least 6 to 12 inches and be continuously sealed with waterproof crawlspace seam tape (vapor retarder tape). Overlapping without tape allows ground moisture vapor to escape into the crawlspace."
  - question: "How do I calculate poly rolls for crawlspace encapsulation?"
    answer: "Add the floor square footage (length × width) to the perimeter wall square footage (perimeter feet × wall height). Multiply by 1.15 for seam overlap, then divide by the square footage of one plastic roll."
  - question: "What is the difference between 6 mil, 10 mil, and 20 mil plastic sheeting?"
    answer: "6 mil (0.006 inches) is lightweight plastic standard for wall studs. 10 mil (0.010 inches) is heavy-duty puncture-resistant poly for crawlspaces. 20 mil (0.020 inches) is thick commercial-grade reinforced membrane designed for high-traffic storage crawlspaces."
  - question: "Do I put a vapor barrier on wall studs inside or outside?"
    answer: "In cold climates (US Climate Zones 5-8), the vapor retarder is installed on the interior warm side of the wall framing (under drywall). In hot humid climates, vapor barriers belong on the exterior side of the wall assembly."
  - question: "How much does a roll of 10 mil vapor barrier cost?"
    answer: "A 10 ft × 100 ft (1,000 sq ft) roll of 6 mil clear poly costs $60 to $90. A 10 mil virgin poly roll of the same size costs $150 to $220. Heavy 20 mil reinforced membrane costs $300 to $450 per roll."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculation logic operates locally in your web browser."
---

# Vapor Barrier Calculator

Determine polyethylene plastic vapor barrier rolls, waterproof seam tape, and total material cost for crawlspace encapsulation and wall stud installation with our free **Vapor Barrier Calculator**.

<!-- more -->

## Why Calculate Vapor Barrier Materials Accurately?

Uncontrolled ground moisture in crawlspaces and damp walls causes high indoor humidity, wood rot joist failure, toxic mold growth, and radon gas diffusion:
- **Prevent Moisture Bypass**: Shorting roll counts forces skimping on seam overlaps, allowing soil dampness to bypass plastic sheeting.
- **Choose Puncture-Resistant Thickness**: Standard 6 mil poly easily tears on sharp rocks during maintenance crawl, whereas 10 mil to 20 mil poly creates a durable walk surface.
- **Include Seam Tape & Termination Bar**: Sealed encapsulation requires specialized double-sided butyl tape, seam tape, and masonry fasteners at wall top edges.

---

## Vapor Barrier Calculation Formulas

$$\text{Floor Area} = \text{Length} \times \text{Width}$$

$$\text{Wall Area (Crawlspace)} = 2 \times (\text{Length} + \text{Width}) \times \text{Wall Height}$$

$$\text{Net Surface Area} = \begin{cases} \text{Floor Area} + \text{Wall Area} & \text{if Crawlspace} \\ \text{Floor Area (as wall equivalent)} & \text{if Wall Studs} \end{cases}$$

$$\text{Gross Area with Overlap} = \text{Net Surface Area} \times \left(1 + \frac{\text{Overlap \%}}{100}\right)$$

$$\text{Roll Area (sq ft)} = \text{Roll Width (ft)} \times \text{Roll Length (ft)}$$

$$\text{Poly Rolls Needed} = \left\lceil \frac{\text{Gross Area (sq ft)}}{\text{Roll Area (sq ft)}} \right\rceil$$

$$\text{Seam Tape Feet} = (\text{Net Area} \times 0.25) + (2 \times (\text{Length} + \text{Width}))$$

$$\text{Seam Tape Rolls} = \left\lceil \frac{\text{Seam Tape Feet}}{180 \text{ ft/roll}} \right\rceil$$

---

## Crawlspace Encapsulation Material Table (15% Overlap, 1,000 sq ft Roll)

| Crawlspace Size | Wall Height | Net Surface Area | Gross Sq Ft | 10 Mil Poly Rolls | Seam Tape Rolls | Est. Material Cost |
|---|---|---|---|---|---|---|
| **20 ft × 30 ft (600 sq ft)** | 3 ft | 900 sq ft | 1,035 sq ft | **2 rolls** | **2 rolls** | $386.00 |
| **30 ft × 40 ft (1,200 sq ft)** | 4 ft | 1,760 sq ft | 2,024 sq ft | **3 rolls** | **3 rolls** | $579.00 |
| **35 ft × 50 ft (1,750 sq ft)** | 4 ft | 2,430 sq ft | 2,795 sq ft | **3 rolls** | **4 rolls** | $607.00 |
| **40 ft × 60 ft (2,400 sq ft)** | 5 ft | 3,400 sq ft | 3,910 sq ft | **4 rolls** | **5 rolls** | $800.00 |

---

## Step-by-Step Crawlspace Encapsulation Guide

1. **Select Project Scope**: Choose crawlspace encapsulation (floor ground + concrete walls) or interior stud walls.
2. **Enter Dimensions**: Input length, width, and foundation wall height in feet.
3. **Select Plastic Thickness**: Choose 6 mil for walls, 10 mil for standard crawlspaces, or 20 mil for heavy storage spaces.
4. **Choose Roll Dimensions**: Select 10ft, 12ft, or 20ft wide rolls. Wider rolls reduce total seam taping by 40%.
5. **Review Roll & Tape Quantities**: Buy full plastic rolls and specialized 180-foot acrylic/butyl seam tape rolls.

---

## Frequently Asked Questions

### What thickness vapor barrier should I use in a crawlspace?
Building code requires a minimum of 6 mil polyethylene sheeting for dirt crawlspace floors. However, 10 mil to 20 mil reinforced vapor retarders are strongly recommended for crawlspace encapsulation to withstand foot traffic and puncture from rocks.

### How much overlap is required for vapor barrier seams?
Seams should overlap by at least 6 to 12 inches and be continuously sealed with waterproof crawlspace seam tape (vapor retarder tape). Overlapping without tape allows ground moisture vapor to escape into the crawlspace.

### How do I calculate poly rolls for crawlspace encapsulation?
Add the floor square footage (length × width) to the perimeter wall square footage (perimeter feet × wall height). Multiply by 1.15 for seam overlap, then divide by the square footage of one plastic roll.

### What is the difference between 6 mil, 10 mil, and 20 mil plastic sheeting?
6 mil (0.006 inches) is lightweight plastic standard for wall studs. 10 mil (0.010 inches) is heavy-duty puncture-resistant poly for crawlspaces. 20 mil (0.020 inches) is thick commercial-grade reinforced membrane designed for high-traffic storage crawlspaces.

### Do I put a vapor barrier on wall studs inside or outside?
In cold climates (US Climate Zones 5-8), the vapor retarder is installed on the interior warm side of the wall framing (under drywall). In hot humid climates, vapor barriers belong on the exterior side of the wall assembly.

### How much does a roll of 10 mil vapor barrier cost?
A 10 ft × 100 ft (1,000 sq ft) roll of 6 mil clear poly costs $60 to $90. A 10 mil virgin poly roll of the same size costs $150 to $220. Heavy 20 mil reinforced membrane costs $300 to $450 per roll.

### Is my personal data saved when using this calculator?
No. All calculation logic operates locally in your web browser.
