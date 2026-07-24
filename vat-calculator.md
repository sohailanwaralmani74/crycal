---
layout: tool
title: "Vat | Interactive Online Tool"
description: "Use our free VAT Calculator to calculate Value Added Tax. Enter the net price, VAT rate, or gross price to see the VAT amount and total."
permalink: /vat-calculator
tool_id: vat-calculator
category: tax
hide_sidebar: true

inputs:
  - id: calculationType
    label: Calculation Type
    type: select
    default: net-to-gross
    options:
      - net-to-gross
      - gross-to-net
      - vat-only

  - id: netAmount
    label: Net Amount (excl. VAT)
    type: number
    default: 1000
    step: 1
    min: 0
    currency: true
    placeholder: "e.g., 1000"

  - id: grossAmount
    label: Gross Amount (incl. VAT)
    type: number
    default: 1200
    step: 1
    min: 0
    currency: true
    placeholder: "e.g., 1200"

  - id: vatRate
    label: VAT Rate (%)
    type: number
    default: 20.0
    step: 0.5
    min: 0
    max: 50
    suffix: '%'
    placeholder: "e.g., 20.0"

outputs:
  - id: vatAmount
    label: VAT Amount
  - id: netAmountResult
    label: Net Amount (excl. VAT)
  - id: grossAmountResult
    label: Gross Amount (incl. VAT)
  - id: effectiveRate
    label: Effective VAT Rate

charts:
  tabs:
    - id: breakdown
      label: Price Breakdown

history_columns:
  - key: calculationType
    label: Type
    source: input
  - key: vatRate
    label: VAT Rate (%)
    source: input
  - key: vatAmount
    label: VAT Amount
    source: output
  - key: netAmountResult
    label: Net Amount
    source: output
  - key: grossAmountResult
    label: Gross Amount
    source: output

js_file: assets/js/calculators/vat-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "VAT Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate Value Added Tax (VAT) with our free VAT Calculator. Enter net price, VAT rate, or gross price to see the VAT amount and total."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Net to Gross Calculation"
    - "Gross to Net Calculation"
    - "VAT Amount Extraction"
    - "Multiple VAT Rates"
    - "Visual Price Breakdown Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Tax
    url: /tax
  - name: VAT Calculator

howto:
  name: "How to Use the VAT Calculator"
  description: "Follow these steps to calculate VAT for your products or services."
  step:
    - name: "Select the calculation type"
      text: "Choose Net to Gross, Gross to Net, or VAT Only."
    - name: "Enter the amount"
      text: "Enter the net amount, gross amount, or VAT amount depending on your selection."
    - name: "Enter the VAT rate"
      text: "Enter the applicable VAT rate for your country or region."
    - name: "View your results"
      text: "See the VAT amount, net price, gross price, and effective rate."

faq:
  - question: "What is a VAT calculator?"
    answer: "A VAT calculator is a tool that calculates Value Added Tax on goods and services. It can add VAT to a net price, remove VAT from a gross price, or reverse-calculate VAT from a total amount."
  - question: "How do I use the VAT calculator South Africa?"
    answer: "Set the VAT rate to 15% and enter your amount. Our SA VAT calculator handles both adding and removing VAT."
  - question: "How do I remove VAT from a price?"
    answer: "Use the 'Gross to Net' mode on our remove VAT calculator. Enter the gross price and VAT rate, and the calculator will show the net price excluding VAT."
  - question: "What is a reverse VAT calculator?"
    answer: "A reverse VAT calculator extracts the VAT amount from a gross price. It's useful when you know the total including VAT but need to know how much is tax."
  - question: "Is there a VAT calculator for the UAE?"
    answer: "Yes — use our VAT calculator UAE by setting the VAT rate to 5% (the standard UAE VAT rate)."
  - question: "Can I use this as a VAT calculator for Ireland?"
    answer: "Yes — our VAT calculator Ireland supports the 23% standard Irish VAT rate."
  - question: "Is there an online VAT calculator UK?"
    answer: "Yes — our online VAT calculator UK works with the 20% standard UK VAT rate."
  - question: "What is an ex VAT calculator?"
    answer: "An ex VAT calculator shows the price before VAT is added. It's useful for business pricing and invoicing."
  - question: "What is the difference between VAT and sales tax?"
    answer: "VAT is applied at each stage of production, while sales tax is applied only at the final point of sale to the consumer."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Vat Calculator

Calculate Value Added Tax with our free **VAT Calculator**. Enter the net price, VAT rate, or gross price to see the VAT amount and total — all without your data leaving your browser.

<!-- more -->

## Why Use This VAT Calculator

VAT calculations can be confusing, especially when dealing with different rates and calculation types. Our **VAT calculator** helps you:

- 💰 **Calculate VAT amount** — see the exact VAT on any product or service.
- 🔄 **Add or remove VAT** — convert between net and gross prices.
- 📊 **Visual breakdown** — see the price breakdown in a chart.
- 🌍 **Works for any country** — just change the VAT rate.
- 🔒 **100% private** — all calculations run locally in your browser.

---

## What Is Value Added Tax (VAT)?

**Value Added Tax (VAT)** is a consumption tax applied to goods and services at each stage of production and distribution. It is ultimately borne by the final consumer.

**How it works:**

1. A business sells a product for $100 net.
2. VAT is added at 20% → $20 VAT.
3. The customer pays $120 gross.
4. The business remits the $20 VAT to the government.

---

## VAT Formulas

| Calculation | Formula |
|-------------|---------|
| **VAT Amount** | Net Price × (VAT Rate ÷ 100) |
| **Gross Price (Net → Gross)** | Net Price + VAT Amount |
| **Net Price (Gross → Net)** | Gross Price ÷ (1 + VAT Rate ÷ 100) |
| **VAT Amount (Gross → Net)** | Gross Price - Net Price |

---

## How to Use This VAT Calculator

1. **Select the calculation type** — choose from:
   - **Net to Gross** — add VAT to a net price.
   - **Gross to Net** — remove VAT from a gross price (also works as a reverse VAT calculator).
   - **VAT Only** — calculate VAT amount only.
2. **Enter the amount** — net, gross, or VAT amount depending on your selection.
3. **Set the VAT rate** — enter the rate for your country (e.g., 20% for the UK, 15% for South Africa, 23% for Ireland, 5% for UAE, 18% for Malta, 12% for Philippines).
4. **View your results** — see the VAT amount, net price, gross price, and effective rate.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## VAT Calculator Examples

### Example 1: Adding VAT to a Price

| Variable | Value |
|----------|-------|
| Net Price | $100.00 |
| VAT Rate | 20% |
| **VAT Amount** | **$20.00** |
| **Gross Price** | **$120.00** |

### Example 2: Removing VAT from a Price

| Variable | Value |
|----------|-------|
| Gross Price | $120.00 |
| VAT Rate | 20% |
| **Net Price (ex VAT)** | **$100.00** |
| **VAT Amount** | **$20.00** |

### Example 3: South Africa VAT Calculator

| Variable | Value |
|----------|-------|
| Net Price | R1,000 |
| VAT Rate | 15% |
| **VAT Amount** | **R150** |
| **Gross Price** | **R1,150** |

### Example 4: UAE VAT Calculator

| Variable | Value |
|----------|-------|
| Net Price | AED 1,000 |
| VAT Rate | 5% |
| **VAT Amount** | **AED 50** |
| **Gross Price** | **AED 1,050** |

---

## Common VAT Rates by Country

| Country | Standard VAT Rate |
|---------|-------------------|
| United Kingdom | 20% |
| South Africa | 15% |
| Ireland | 23% |
| UAE | 5% |
| Malta | 18% |
| Philippines | 12% |

---

## Frequently Asked Questions

### What is a VAT calculator?
A VAT calculator is a tool that calculates Value Added Tax on goods and services. It can add VAT to a net price, remove VAT from a gross price, or calculate VAT from a total amount.

### How do I add VAT to a price?
Use the "Net to Gross" mode. Enter the net price and VAT rate, and the calculator will show the gross price including VAT.

### How do I remove VAT from a price?
Use the "Gross to Net" mode. Enter the gross price and VAT rate, and the calculator will show the net price excluding VAT.

### How do I reverse calculate VAT?
Use the "Gross to Net" mode. Enter the gross price and VAT rate, and the calculator will show the VAT amount extracted from the gross price.

### What is the VAT rate in the UK?
The standard UK VAT rate is 20%.

### What is the VAT rate in South Africa?
The standard South Africa VAT rate is 15%.

### What is the VAT rate in the UAE?
The standard UAE VAT rate is 5%.

### What is the VAT rate in Ireland?
The standard Ireland VAT rate is 23%.

### What is the VAT rate in Malta?
The standard Malta VAT rate is 18%.

### What is the VAT rate in the Philippines?
The standard Philippines VAT rate is 12%.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.