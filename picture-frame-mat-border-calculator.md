---
layout: tool
title: "Picture Frame Mat Border | Interactive Online Tool"
description: "Calculate picture frame exterior dimensions, custom mat board window opening cuts, mat border width, and artwork overlap allowances."
permalink: /picture-frame-mat-border-calculator
tool_id: picture-frame-mat-border-calculator
category: home-decor-interior
hide_sidebar: true

inputs:
  - id: artworkWidth
    label: Artwork / Photo Width (Inches)
    type: number
    default: 8
    step: 0.25
    min: 1
    placeholder: "e.g., 8"

  - id: artworkHeight
    label: Artwork / Photo Height (Inches)
    type: number
    default: 10
    step: 0.25
    min: 1
    placeholder: "e.g., 10"

  - id: matBorderWidth
    label: Mat Board Border Width (Inches)
    type: number
    default: 2
    step: 0.25
    min: 0.5
    placeholder: "e.g., 2"

  - id: overlapAllowance
    label: Artwork Mat Overlap Allowance per Side (Inches)
    type: number
    default: 0.25
    step: 0.125
    min: 0
    max: 1
    placeholder: "e.g., 0.25"

  - id: frameProfileWidth
    label: Picture Frame Molding Profile Width (Inches)
    type: number
    default: 1.25
    step: 0.125
    min: 0.25
    placeholder: "e.g., 1.25"

outputs:
  - id: matOpeningWidth
    label: Mat Window Cut Opening Width
  - id: matOpeningHeight
    label: Mat Window Cut Opening Height
  - id: matBoardOuterWidth
    label: Mat Board Outer / Frame Glass Width
  - id: matBoardOuterHeight
    label: Mat Board Outer / Frame Glass Height
  - id: totalFrameOuterWidth
    label: Total Picture Frame Exterior Width
  - id: totalFrameOuterHeight
    label: Total Picture Frame Exterior Height

charts:
  tabs:
    - id: dimensionComparison
      label: Size Progression Comparison
    - id: matAreaBreakdown
      label: Artwork vs Mat Board Area

history_columns:
  - key: matOpeningWidth
    label: Opening Cut
    source: output
  - key: matBoardOuterWidth
    label: Frame Glass Size
    source: output
  - key: totalFrameOuterWidth
    label: Frame Ext Width
    source: output
  - key: totalFrameOuterHeight
    label: Frame Ext Height
    source: output

js_file: assets/js/calculators/picture-frame-mat-border-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Picture Frame Mat Border Calculator"
  applicationCategory: "BusinessApplication"
  operatingSystem: "All"
  description: "Calculate custom mat board window opening cut dimensions, mat border margins, and picture frame exterior sizes."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Mat Window Cut Calculation — determines exact bevel opening width and height accounting for artwork overlap"
    - "Frame Glass & Mat Size Matching — calculates exact outer mat dimensions for frame ordering"
    - "Frame Profile Offset — incorporates wooden or aluminum frame molding width into overall wall dimensions"

breadcrumb:
  - name: Home
    url: /
  - name: Home Decor & Interior
    url: /home-decor-interior
  - name: Picture Frame Mat Border Calculator

howto:
  name: "How to Calculate Picture Frame Mat Board & Frame Sizes"
  description: "Determine exact mat opening cuts, outer mat glass dimensions, and total frame exterior footprint."
  step:
    - name: "Measure Artwork Dimensions"
      text: "Measure the visible image area of your photo or print in inches."
    - name: "Select Mat Overlap Allowance"
      text: "Standard custom framing deducts 1/4 inch (0.25\") along each edge so the artwork rests securely behind the mat window."
    - name: "Determine Desired Mat Border Width"
      text: "Choose a balanced mat border width (typically 2 to 3 inches for prints up to 11x14)."
    - name: "Add Frame Profile Width"
      text: "Factor in frame molding profile width to get total wall mounting footprint."

faq:
  - question: "Why is the mat window opening cut slightly smaller than the artwork?"
    answer: "A standard 1/4-inch (0.25\") overlap allowance per side is subtracted from the artwork size so the mat window sits over the edges of the print, preventing the image from falling through the window cut."
  - question: "What is the standard mat border width for framed art?"
    answer: "For small prints (5x7 or 8x10), a 2-inch border is standard. For medium prints (11x14 to 16x20), a 2.5 to 3-inch border is recommended. Large prints (20x30+) benefit from 3.5 to 4.5-inch borders."
  - question: "What size frame do I need for an 8x10 photo with a mat?"
    answer: "An 8x10 photo with a 2-inch mat border requires an 11x14 frame (glass size). The mat opening will be 7.5\" x 9.5\" to secure the print."
  - question: "What size frame do I need for an 11x14 photo with a mat?"
    answer: "An 11x14 photo with a 2.5-inch mat border requires a 16x20 frame glass size. The mat window cut will be 10.5\" x 13.5\"."
  - question: "What is weighted matting?"
    answer: "Bottom-weighting is a traditional framing practice where the bottom mat border is cut 0.25\" to 0.5\" wider than the top and side borders to correct the optical illusion of art slipping downward."
  - question: "Can I cut my own mat board windows at home?"
    answer: "Yes. Using a handheld 45° bevel mat cutter, a heavy metal straightedge guide, and self-healing cutting mat allows DIYers to cut custom windows in standard 4-ply mat board."
  - question: "Is my personal data saved when using this calculator?"
    answer: "No. All calculations run strictly inside your web browser."
---

# Picture Frame Mat Border Calculator

Framing artwork, photography, or diplomas requires exact measurements to achieve a gallery-worthy display. Use our **Picture Frame Mat Border Calculator** to calculate exact mat window opening cut dimensions, outer mat board sizes, glass order dimensions, and overall frame exterior footprint.

<!-- more -->

## Why Use a Picture Frame Mat Border Calculator?

Custom matting elevates framed artwork by providing breathing room around the print and protecting paper from resting directly against the frame glass. Calculating exact dimensions eliminates costly cutting mistakes:

- **Exact Mat Window Cuts**: Deduct proper 1/4" overlap allowances so prints stay securely secured behind the mat window.
- **Glass & Frame Size Matching**: Determine the exact glass cut size needed when buying standard or custom frames.
- **Factor Molding Profile Width**: Calculate overall wall mounting footprint by factoring in wooden or metal frame molding thickness.
- **Balanced Visual Aesthetics**: Plan uniform borders or test custom border widths before cutting expensive 4-ply or 8-ply acid-free mat board.

---

## Picture Frame Mat Calculation Formulas

$$\text{Mat Opening Width} = \text{Artwork Width} - (2 \times \text{Overlap Allowance})$$

$$\text{Mat Opening Height} = \text{Artwork Height} - (2 \times \text{Overlap Allowance})$$

$$\text{Mat Board Outer Width} = \text{Mat Opening Width} + (2 \times \text{Mat Border Width})$$

$$\text{Mat Board Outer Height} = \text{Mat Opening Height} + (2 \times \text{Mat Border Width})$$

$$\text{Total Frame Exterior Width} = \text{Mat Board Outer Width} + (2 \times \text{Frame Profile Width})$$

$$\text{Total Frame Exterior Height} = \text{Mat Board Outer Height} + (2 \times \text{Frame Profile Width})$$

---

## Real-World Picture Frame & Mat Size Reference Table

The table below shows popular print sizes, standard mat border widths, resulting mat opening cuts, glass sizes, and exterior frame dimensions ($1.25"$ profile width).

| Photo / Art Size | Mat Border Width | Mat Window Opening Cut | Frame Glass Size (Mat Outer) | Total Frame Exterior Footprint |
|---|---|---|---|---|
| **5" × 7" Photo** | 2.0 inches | 4.50" × 6.50" | **8.5" × 10.5"** | **11.0" × 13.0"** |
| **8" × 10" Print** | 2.0 inches | 7.50" × 9.50" | **11.5" × 13.5" (or 11"×14")** | **14.0" × 16.0"** |
| **11" × 14" Poster** | 2.5 inches | 10.50" × 13.50" | **15.5" × 18.5" (or 16"×20")** | **18.0" × 21.0"** |
| **16" × 20" Fine Art**| 3.0 inches | 15.50" × 19.50" | **21.5" × 25.5"** | **24.0" × 28.0"** |
| **20" × 24" Canvas** | 3.5 inches | 19.50" × 23.50" | **26.5" × 30.5"** | **29.0" × 33.0"** |

---

## Step-by-Step Guide: How to Measure & Cut Mat Boards

1. **Measure Artwork Image Area**: Measure the width and height of the image area you wish to show through the mat opening.
2. **Determine Overlap**: Apply a standard 1/4" overlap on each edge (subtracting 0.5" total from width and height) so the mat covers the print edge.
3. **Select Mat Margin Width**: Choose border width (e.g., 2.0" or 2.5" uniform margin).
4. **Mark Mat Backing**: Draw cut lines on the back of the mat board using a fine pencil and t-square ruler.
5. **Bevel Cut Mat Window**: Cut along pencil lines at a 45° bevel angle using a sharp mat cutter blade.

---

## Frequently Asked Questions

### Why is the mat window opening cut slightly smaller than the artwork?
A standard 1/4-inch (0.25") overlap allowance per side is subtracted from the artwork size so the mat window sits over the edges of the print, preventing the image from falling through the window cut.

### What is the standard mat border width for framed art?
For small prints (5x7 or 8x10), a 2-inch border is standard. For medium prints (11x14 to 16x20), a 2.5 to 3-inch border is recommended. Large prints (20x30+) benefit from 3.5 to 4.5-inch borders.

### What size frame do I need for an 8x10 photo with a mat?
An 8x10 photo with a 2-inch mat border requires an 11x14 frame (glass size). The mat opening will be 7.5" x 9.5" to secure the print.

### What size frame do I need for an 11x14 photo with a mat?
An 11x14 photo with a 2.5-inch mat border requires a 16x20 frame glass size. The mat window cut will be 10.5" x 13.5".

### What is weighted matting?
Bottom-weighting is a traditional framing practice where the bottom mat border is cut 0.25" to 0.5" wider than the top and side borders to correct the optical illusion of art slipping downward.

### Can I cut my own mat board windows at home?
Yes. Using a handheld 45° bevel mat cutter, a heavy metal straightedge guide, and self-healing cutting mat allows DIYers to cut custom windows in standard 4-ply mat board.

### Is my personal data saved when using this calculator?
No. All calculations run strictly inside your web browser.
