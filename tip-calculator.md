---
layout: tool
title: "Tip Calculator – Free Gratuity & Bill Split Calculator"
description: "Calculate the perfect tip amount for any bill. Free tip calculator with 15%, 18%, 20% presets and split bill option. Easily figure out gratuity for restaurants, services, and hospitality."
permalink: /tip-calculator
tool_id: tip-calculator
category: budgeting
hide_sidebar: true

inputs:
  - id: billAmount
    label: Bill Amount
    type: number
    default: 50
    step: 0.50
    min: 0
    currency: true
    placeholder: "e.g., 50.00"

  - id: tipPercentage
    label: Tip Percentage
    type: select
    default: 20
    options:
      - value: 10
        label: 10% (Basic)
      - value: 12
        label: 12% (Adequate)
      - value: 15
        label: 15% (Standard)
      - value: 18
        label: 18% (Good)
      - value: 20
        label: 20% (Excellent)
      - value: 22
        label: 22% (Outstanding)
      - value: 25
        label: 25% (Exceptional)
      - value: custom
        label: Custom %

  - id: customTip
    label: Custom Tip Percentage
    type: number
    default: 18
    step: 0.5
    min: 0
    max: 100
    suffix: '%'
    placeholder: "e.g., 18"
    conditional: true
    conditional_on: tipPercentage
    conditional_value: custom

  - id: splitCount
    label: Number of People (Split Bill)
    type: number
    default: 1
    step: 1
    min: 1
    max: 20
    placeholder: "e.g., 1, 2, 4"

  - id: roundUp
    label: Round Up Total
    type: checkbox
    default: false
    label_text: "Round up to nearest dollar"

  - id: includeTax
    label: Tip on Tax
    type: checkbox
    default: false
    label_text: "Calculate tip on total (including tax)"

outputs:
  - id: tipAmount
    label: Tip Amount
  - id: totalBill
    label: Total Bill (Bill + Tip)
  - id: tipPerPerson
    label: Tip Per Person
  - id: totalPerPerson
    label: Total Per Person

charts:
  tabs:
    - id: breakdown
      label: Bill vs Tip Breakdown

js_file: assets/js/calculators/tip-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Tip Calculator – Free Gratuity & Bill Split Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the perfect tip amount for any bill. Free tip calculator with 15%, 18%, 20% presets and split bill option. Easily figure out gratuity for restaurants, services, and hospitality."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Fast Tip Percentage Calculator"
    - "15%, 18%, 20% Gratuity Presets"
    - "Custom Tip Percentage Option"
    - "Split Bill Between Multiple People"
    - "Per Person Tip & Total Display"
    - "Bill vs Tip Visual Breakdown Chart"
    - "Round Up Total Option"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Budgeting
    url: /budgeting
  - name: Tip Calculator

howto:
  name: "How to Use This Gratuity Calculator"
  description: "Follow these simple steps to calculate the perfect tip amount and split the bill."
  step:
    - name: "Enter your bill amount"
      text: "Input the total bill before tip (subtotal)."
    - name: "Choose a tip percentage"
      text: "Select from common presets (15%, 18%, 20%) or enter a custom percentage."
    - name: "Enter number of people"
      text: "How many people are splitting the bill? Enter 1 if you're paying alone."
    - name: "Review your results"
      text: "Instantly see tip amount, total bill, tip per person, and total per person."

faq:
  - question: "What is a tip calculator?"
    answer: "A tip calculator is a free online tool that helps you quickly calculate the gratuity amount for a restaurant bill or service. Simply enter your bill amount, choose a tip percentage (like 15%, 18%, or 20%), and the tool instantly computes the tip and total payment."
  - question: "How do I calculate a tip?"
    answer: "To calculate a tip, multiply your bill total by the tip percentage as a decimal. For example: $50 bill × 20% (0.20) = $10 tip. Our tip calculator does this automatically for you with no math required."
  - question: "What is a standard tip percentage?"
    answer: "In the United States, the standard tip percentage for restaurant service is 15% to 20% of the pre-tax bill amount. 15% is considered adequate, 18% is good, and 20% is excellent service."
  - question: "How do I calculate gratuity with a custom tip?"
    answer: "To calculate a custom tip, simply enter your desired percentage. For example: $75 bill × 17% (0.17) = $12.75 tip. This tip calculator includes a custom percentage option for any amount between 0% and 100%."
  - question: "What is the best tip calculator app?"
    answer: "This free online tip calculator is one of the easiest to use – it requires no download, works on any device, includes common tip presets, and even splits bills between multiple people."
  - question: "How do I split a tip between multiple people?"
    answer: "To split a tip, divide the total tip amount by the number of people. For example: $20 tip ÷ 4 people = $5 per person. Enter the number of people in this calculator and it will automatically compute the per-person amounts."
  - question: "What is a good restaurant tip calculator?"
    answer: "A good restaurant tip calculator should offer common percentages (15%, 18%, 20%), custom tip options, bill splitting, and clear results. This tool includes all these features plus a visual breakdown chart."
  - question: "Should I tip on the subtotal or total?"
    answer: "Traditionally, tip is calculated on the pre-tax subtotal. However, some people prefer to tip on the total amount including tax for simplicity. This calculator offers both options so you can choose what works best for you."
  - question: "What is the tip amount for $100 at 20%?"
    answer: "A 20% tip on a $100 bill is $20. Your total payment would be $120. If splitting between 4 people, each person pays $30 total ($25 bill + $5 tip)."
  - question: "Is there a free tip calculator I can use?"
    answer: "Yes, this is a completely free online tip calculator with no registration, no downloads, and no hidden fees. All calculations are done instantly in your browser."
---

# Tip Calculator – Fast, Free Gratuity & Bill Split Calculator

Use this **free tip calculator** to quickly calculate the perfect gratuity amount for any restaurant bill, service, or hospitality transaction. With preset percentages (15%, 18%, 20%) and the ability to split bills between multiple people, this **gratuity calculator** makes tipping simple and stress-free.

<!-- more -->

## How This Tip Percentage Calculator Works

This **restaurant tip calculator** handles all the math for you in seconds. Just enter your bill, choose a percentage, and get instant results:

- **Tip Amount** – the exact gratuity to leave
- **Total Bill** – bill plus tip combined
- **Tip Per Person** – individual share when splitting
- **Total Per Person** – each person's full cost
- **Bill vs Tip Chart** – visual breakdown of your total

Whether you're dining out with friends, ordering takeout, or using a service, this **online tip calculator** takes the guesswork out of tipping.

---

## Tip Formula (How Tips Are Calculated)

The formula for calculating a tip is simple:

> **Tip Amount = Bill Total × (Tip Percentage ÷ 100)**

> **Total Payment = Bill Total + Tip Amount**

For splitting between people:

> **Tip Per Person = Tip Amount ÷ Number of People**

> **Total Per Person = Total Payment ÷ Number of People**

---

## Standard Tip Percentages by Service Level

| Service Quality | Tip Percentage | Tip on $50 | Total Paid |
|-----------------|----------------|------------|------------|
| Basic / Adequate | 10-12% | $5.00 - $6.00 | $55.00 - $56.00 |
| Standard Service | 15% | $7.50 | $57.50 |
| Good Service | 18% | $9.00 | $59.00 |
| Excellent Service | 20% | $10.00 | $60.00 |
| Outstanding Service | 22% | $11.00 | $61.00 |
| Exceptional Service | 25% | $12.50 | $62.50 |

---

## Quick Tip Calculation Examples

### Example 1: Standard 20% Tip (One Person)

| Variable | Value |
|----------|-------|
| Bill Amount | $50.00 |
| Tip Percentage | 20% |
| Number of People | 1 |
| **Tip Amount** | **$10.00** |
| **Total Bill** | **$60.00** |
| **Per Person** | **$60.00** |

### Example 2: 18% Tip Split Between 4 People

| Variable | Value |
|----------|-------|
| Bill Amount | $120.00 |
| Tip Percentage | 18% |
| Number of People | 4 |
| **Tip Amount** | **$21.60** |
| **Total Bill** | **$141.60** |
| **Tip Per Person** | **$5.40** |
| **Total Per Person** | **$35.40** |

### Example 3: 15% Tip on $75 Bill

| Variable | Value |
|----------|-------|
| Bill Amount | $75.00 |
| Tip Percentage | 15% |
| Number of People | 2 |
| **Tip Amount** | **$11.25** |
| **Total Bill** | **$86.25** |
| **Tip Per Person** | **$5.63** |
| **Total Per Person** | **$43.13** |

### Example 4: Custom 17% Tip

| Variable | Value |
|----------|-------|
| Bill Amount | $95.50 |
| Tip Percentage | 17% |
| Number of People | 3 |
| **Tip Amount** | **$16.24** |
| **Total Bill** | **$111.74** |
| **Tip Per Person** | **$5.41** |
| **Total Per Person** | **$37.25** |

---

## Mental Math Trick: Quick 20% Tip

Here's an easy mental math trick for a 20% tip:

1. **Calculate 10%** – Move the decimal point one place left.
   - $47.50 → 10% = $4.75
2. **Double it** – 20% is twice 10%.
   - $4.75 × 2 = **$9.50** (tip)
3. **Add to bill** – $47.50 + $9.50 = **$57.00** (total)

---

## Who Benefits From This Tip Calculator?

- **Restaurant diners** – quickly figure out gratuity after a meal
- **Large groups** – split the bill and tip evenly between friends
- **Business travelers** – calculate appropriate service tips
- **Delivery customers** – determine food delivery gratuity
- **Service users** – tipping hairdressers, ride-share drivers, hotel staff

---

## Common Tipping Scenarios

### Restaurant Dining
- **Standard:** 15-20% of pre-tax subtotal
- **Buffet:** 10-15% of the bill
- **Fine Dining:** 18-25% depending on service

### Food Delivery
- **Standard:** 10-15% of order total
- **Minimum:** At least $3-5 per delivery
- **Large orders:** 15-20%

### Other Services
- **Ride-share (Uber/Lyft):** 10-20% of fare
- **Hair Salon:** 15-20% of service cost
- **Hotel Staff:** $2-5 per bag, $5-20 per stay for housekeeping

---

## Tipping Around the World

| Country | Typical Tip |
|---------|-------------|
| USA | 15-20% expected |
| Canada | 15-20% standard |
| UK | 10-12.5% (service often included) |
| Europe | 5-10% (service often included) |
| Australia | Not expected (except exceptional service) |
| Japan | Not expected (can be considered rude) |

---

## Tip Calculator FAQ

### What is a tip calculator?
A tip calculator is a free online tool that helps you quickly calculate the gratuity amount for a restaurant bill or service. Simply enter your bill amount, choose a tip percentage (like 15%, 18%, or 20%), and the tool instantly computes the tip and total payment.

### How do I calculate a tip?
To calculate a tip, multiply your bill total by the tip percentage as a decimal. For example: $50 bill × 20% (0.20) = $10 tip. Our tip calculator does this automatically for you with no math required.

### What is a standard tip percentage?
In the United States, the standard tip percentage for restaurant service is 15% to 20% of the pre-tax bill amount. 15% is considered adequate, 18% is good, and 20% is excellent service.

### How do I calculate gratuity with a custom tip?
To calculate a custom tip, simply enter your desired percentage. For example: $75 bill × 17% (0.17) = $12.75 tip. This tip calculator includes a custom percentage option for any amount between 0% and 100%.

### What is the best tip calculator app?
This free online tip calculator is one of the easiest to use – it requires no download, works on any device, includes common tip presets, and even splits bills between multiple people.

### How do I split a tip between multiple people?
To split a tip, divide the total tip amount by the number of people. For example: $20 tip ÷ 4 people = $5 per person. Enter the number of people in this calculator and it will automatically compute the per-person amounts.

### What is a good restaurant tip calculator?
A good restaurant tip calculator should offer common percentages (15%, 18%, 20%), custom tip options, bill splitting, and clear results. This tool includes all these features plus a visual breakdown chart.

### Should I tip on the subtotal or total?
Traditionally, tip is calculated on the pre-tax subtotal. However, some people prefer to tip on the total amount including tax for simplicity. This calculator offers both options so you can choose what works best for you.

### What is the tip amount for $100 at 20%?
A 20% tip on a $100 bill is $20. Your total payment would be $120. If splitting between 4 people, each person pays $30 total ($25 bill + $5 tip).

### Is there a free tip calculator I can use?
Yes, this is a completely free online tip calculator with no registration, no downloads, and no hidden fees. All calculations are done instantly in your browser.

### Do I tip before or after tax?
The standard practice is to tip on the pre-tax subtotal. However, many people tip on the total including tax for convenience. Both options are supported in this calculator.

### How much should I tip for takeout?
For takeout orders, tipping is optional but appreciated. Common practice is 0-10% for counter service, 10-15% for large catering orders, or a flat $2-5 for regular pickups.