---
layout: tool
title: US Inflation Calculator – Calculate Dollar Value Over Time
description: Use free US Inflation Calculator to see how the value of the dollar has changed over time. Select a start year and end year for inflation-adjusted value.
permalink: /us-inflation-calculator
tool_id: us-inflation-calculator
category: growth
hide_sidebar: true

inputs:
  - id: amount
    label: Amount (USD)
    type: number
    default: 100
    step: 1
    min: 0
    currency: true
    placeholder: "e.g., 100"

  - id: startYear
    label: Start Year
    type: select
    default: "2000"
    options:
      - "1913"
      - "1914"
      - "1915"
      - "1916"
      - "1917"
      - "1918"
      - "1919"
      - "1920"
      - "1921"
      - "1922"
      - "1923"
      - "1924"
      - "1925"
      - "1926"
      - "1927"
      - "1928"
      - "1929"
      - "1930"
      - "1931"
      - "1932"
      - "1933"
      - "1934"
      - "1935"
      - "1936"
      - "1937"
      - "1938"
      - "1939"
      - "1940"
      - "1941"
      - "1942"
      - "1943"
      - "1944"
      - "1945"
      - "1946"
      - "1947"
      - "1948"
      - "1949"
      - "1950"
      - "1951"
      - "1952"
      - "1953"
      - "1954"
      - "1955"
      - "1956"
      - "1957"
      - "1958"
      - "1959"
      - "1960"
      - "1961"
      - "1962"
      - "1963"
      - "1964"
      - "1965"
      - "1966"
      - "1967"
      - "1968"
      - "1969"
      - "1970"
      - "1971"
      - "1972"
      - "1973"
      - "1974"
      - "1975"
      - "1976"
      - "1977"
      - "1978"
      - "1979"
      - "1980"
      - "1981"
      - "1982"
      - "1983"
      - "1984"
      - "1985"
      - "1986"
      - "1987"
      - "1988"
      - "1989"
      - "1990"
      - "1991"
      - "1992"
      - "1993"
      - "1994"
      - "1995"
      - "1996"
      - "1997"
      - "1998"
      - "1999"
      - "2000"
      - "2001"
      - "2002"
      - "2003"
      - "2004"
      - "2005"
      - "2006"
      - "2007"
      - "2008"
      - "2009"
      - "2010"
      - "2011"
      - "2012"
      - "2013"
      - "2014"
      - "2015"
      - "2016"
      - "2017"
      - "2018"
      - "2019"
      - "2020"
      - "2021"
      - "2022"
      - "2023"
      - "2024"
      - "2025"

  - id: endYear
    label: End Year
    type: select
    default: "2024"
    options:
      - "1914"
      - "1915"
      - "1916"
      - "1917"
      - "1918"
      - "1919"
      - "1920"
      - "1921"
      - "1922"
      - "1923"
      - "1924"
      - "1925"
      - "1926"
      - "1927"
      - "1928"
      - "1929"
      - "1930"
      - "1931"
      - "1932"
      - "1933"
      - "1934"
      - "1935"
      - "1936"
      - "1937"
      - "1938"
      - "1939"
      - "1940"
      - "1941"
      - "1942"
      - "1943"
      - "1944"
      - "1945"
      - "1946"
      - "1947"
      - "1948"
      - "1949"
      - "1950"
      - "1951"
      - "1952"
      - "1953"
      - "1954"
      - "1955"
      - "1956"
      - "1957"
      - "1958"
      - "1959"
      - "1960"
      - "1961"
      - "1962"
      - "1963"
      - "1964"
      - "1965"
      - "1966"
      - "1967"
      - "1968"
      - "1969"
      - "1970"
      - "1971"
      - "1972"
      - "1973"
      - "1974"
      - "1975"
      - "1976"
      - "1977"
      - "1978"
      - "1979"
      - "1980"
      - "1981"
      - "1982"
      - "1983"
      - "1984"
      - "1985"
      - "1986"
      - "1987"
      - "1988"
      - "1989"
      - "1990"
      - "1991"
      - "1992"
      - "1993"
      - "1994"
      - "1995"
      - "1996"
      - "1997"
      - "1998"
      - "1999"
      - "2000"
      - "2001"
      - "2002"
      - "2003"
      - "2004"
      - "2005"
      - "2006"
      - "2007"
      - "2008"
      - "2009"
      - "2010"
      - "2011"
      - "2012"
      - "2013"
      - "2014"
      - "2015"
      - "2016"
      - "2017"
      - "2018"
      - "2019"
      - "2020"
      - "2021"
      - "2022"
      - "2023"
      - "2024"
      - "2025"
      - "2026"

  - id: customRate
    label: Custom Inflation Rate (optional)
    type: number
    default: 0
    step: 0.1
    min: 0
    max: 20
    suffix: '%'
    placeholder: "Leave blank for historical CPI data"

outputs:
  - id: adjustedValue
    label: Inflation-Adjusted Value
  - id: totalChange
    label: Total Change in Value
  - id: annualRate
    label: Average Annual Inflation Rate
  - id: inflationImpact
    label: Overall Inflation Impact
  - id: purchasingPower
    label: Purchasing Power of $1

charts:
  tabs:
    - id: growth
      label: Value Over Time
    - id: breakdown
      label: Inflation Impact

history_columns:
  - key: amount
    label: Amount
    source: input
  - key: startYear
    label: Start Year
    source: input
  - key: endYear
    label: End Year
    source: input
  - key: adjustedValue
    label: Adjusted Value
    source: output
  - key: annualRate
    label: Annual Rate
    source: output

js_file: assets/js/calculators/us-inflation-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "US Inflation Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate the inflation-adjusted value of the US dollar over time. Enter an amount, start year, and end year to see the dollar's purchasing power."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Historical CPI Data (1913-Present)"
    - "Dollar Value Over Time"
    - "Purchasing Power Comparison"
    - "Average Annual Inflation Rate"
    - "Custom Inflation Rate Option"
    - "Visual Growth Chart"
    - "100% Private – all calculations run locally"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Growth
    url: /growth
  - name: US Inflation Calculator

howto:
  name: "How to Use the US Inflation Calculator"
  description: "Follow these steps to calculate the inflation-adjusted value of the US dollar."
  step:
    - name: "Enter an amount"
      text: "Enter the dollar amount you want to adjust for inflation."
    - name: "Enter the start year"
      text: "Enter the year the amount is from (1913 to present)."
    - name: "Enter the end year"
      text: "Enter the year you want to convert the value to."
    - name: "Add a custom rate (optional)"
      text: "Enter a custom inflation rate if you want to use a specific rate instead of historical CPI data."
    - name: "View your results"
      text: "See the inflation-adjusted value, purchasing power change, and average annual inflation rate."

faq:
  - question: "What is a US Inflation Calculator?"
    answer: "A US Inflation Calculator shows how the purchasing power of the dollar has changed over time due to inflation. It uses historical Consumer Price Index (CPI) data to adjust dollar amounts from one year to another."
  - question: "How does the inflation calculator work?"
    answer: "The calculator uses historical CPI data from the Bureau of Labor Statistics. It compares the CPI from the start year to the end year to calculate the inflation-adjusted value of your dollar amount."
  - question: "What is the Consumer Price Index (CPI)?"
    answer: "The CPI is a measure of the average change in prices paid by consumers for goods and services. It's the most commonly used measure of inflation in the United States."
  - question: "What years does the calculator cover?"
    answer: "The calculator covers 1913 to the present year. This is based on historical CPI data from the Bureau of Labor Statistics."
  - question: "What is the average inflation rate in the US?"
    answer: "The average annual inflation rate in the US has been about 3.2% over the past 100 years. However, this varies significantly by decade."
  - question: "How do I calculate the inflation-adjusted value of the dollar?"
    answer: "Enter the amount, start year, and end year. The calculator will show you how much that amount is worth in the end year's dollars."
  - question: "What is purchasing power?"
    answer: "Purchasing power is the value of a currency expressed in terms of the amount of goods or services that one unit of money can buy. Inflation reduces purchasing power over time."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# US Inflation Calculator – Calculate Dollar Value Over Time

Use our free **US Inflation Calculator** to see how the value of the dollar has changed over time. Enter an amount, start year, and end year to see the inflation-adjusted value — all without your data leaving your browser.

<!-- more -->

## Why Use This Inflation Calculator

Understanding how inflation affects the dollar is essential for financial planning, investing, and historical comparison. Our **inflation calculator USD** helps you:

- 💰 **Calculate Inflation-Adjusted Value** — see what a dollar from the past is worth today.
- 📈 **Track Purchasing Power** — understand how inflation erodes the value of money.
- 📊 **Visualize Changes** — see the value of your money over time.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is Inflation?

**Inflation** is the rate at which the general level of prices for goods and services rises, eroding the purchasing power of currency. The **US dollar inflation calculator** uses the Consumer Price Index (CPI) to measure this change over time.

**How it works:**

1. You enter a dollar amount from a specific year.
2. The calculator compares the CPI from that year to the CPI from the end year.
3. It calculates what that amount would be worth in today's dollars.

---

## The Inflation Formula

**Inflation-Adjusted Value = Amount × (CPI End Year ÷ CPI Start Year)**

**Example:**

| Variable | Value |
|----------|-------|
| Amount | $100 |
| Start Year | 2000 (CPI: 172.2) |
| End Year | 2024 (CPI: 313.5) |
| **Adjusted Value** | **$100 × (313.5 ÷ 172.2) = $182.06** |

$100 in 2000 had the same purchasing power as about $182 in 2024.

---

## US Inflation Rates by Decade

| Decade | Average Annual Inflation Rate |
|--------|-------------------------------|
| 1910s | 7.3% |
| 1920s | 0.1% |
| 1930s | -1.5% (deflation) |
| 1940s | 5.5% |
| 1950s | 2.1% |
| 1960s | 2.5% |
| 1970s | 7.1% |
| 1980s | 5.5% |
| 1990s | 3.0% |
| 2000s | 2.5% |
| 2010s | 1.8% |
| 2020s | 4.5% |

---

## How to Use This US Inflation Calculator

1. **Enter an amount** — the dollar amount you want to adjust for inflation.
2. **Enter the start year** — the year the amount is from (1913-2025).
3. **Enter the end year** — the year you want to convert the value to.
4. **Add a custom inflation rate (optional)** — enter a specific rate if you want to override historical CPI data.
5. **View your results** — see the inflation-adjusted value, total change, annual rate, and purchasing power change.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## US Inflation Calculator Examples

### Example 1: Inflation Calculator USD

| Variable | Value |
|----------|-------|
| Amount | $100 |
| Start Year | 2000 |
| End Year | 2024 |
| **Adjusted Value** | **$182.06** |
| **Annual Inflation Rate** | **2.7%** |
| **Purchasing Power Change** | **-45.1%** |

### Example 2: Dollar Inflation Calculator

| Variable | Value |
|----------|-------|
| Amount | $50 |
| Start Year | 1980 |
| End Year | 2024 |
| **Adjusted Value** | **$189.77** |
| **Annual Inflation Rate** | **3.1%** |
| **Purchasing Power Change** | **-73.7%** |

### Example 3: US Dollar Inflation Calculator

| Variable | Value |
|----------|-------|
| Amount | $1,000 |
| Start Year | 1960 |
| End Year | 2024 |
| **Adjusted Value** | **$10,567** |
| **Annual Inflation Rate** | **3.8%** |

---

## Frequently Asked Questions

### What is a US Inflation Calculator?
A US Inflation Calculator shows how the purchasing power of the dollar has changed over time due to inflation using historical CPI data.

### How does the inflation calculator work?
It uses historical CPI data from the Bureau of Labor Statistics to compare prices from the start year to the end year.

### What is the Consumer Price Index (CPI)?
The CPI is a measure of the average change in prices paid by consumers for goods and services.

### What years does the calculator cover?
The calculator covers 1913 to the present year.

### What is the average inflation rate in the US?
The average annual inflation rate has been about 3.2% over the past 100 years.

### How do I calculate the inflation-adjusted value of the dollar?
Enter the amount, start year, and end year — the calculator shows the adjusted value.

### What is purchasing power?
Purchasing power is the value of a currency expressed in terms of the amount of goods or services that one unit of money can buy.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.