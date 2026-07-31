---
layout: tool
title: "CD Calculator – Calculate Certificate of Deposit Interest & APY"
description: "Free online CD calculator to estimate your certificate of deposit maturity value, total interest earned, and Annual Percentage Yield (APY). Compare compounding frequencies – daily, monthly, quarterly, semi-annually, or annually."
permalink: /cd-calculator
tool_id: cd-calculator
category: growth
hide_sidebar: true

inputs:
  - id: principal
    label: Initial Deposit (Principal)
    type: number
    default: 10000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 10000"

  - id: termMonths
    label: CD Term Length
    type: number
    default: 12
    step: 1
    min: 1
    max: 120
    suffix: 'months'
    placeholder: "e.g., 3, 6, 9, 12, 60"

  - id: interestRate
    label: Annual Interest Rate (APR)
    type: number
    default: 5.25
    step: 0.01
    min: 0
    max: 15
    suffix: '%'
    placeholder: "e.g., 5.25"

  - id: compoundingFrequency
    label: Compounding Frequency
    type: select
    default: monthly
    options:
      - value: daily
        label: Daily (365)
      - value: monthly
        label: Monthly (12)
      - value: quarterly
        label: Quarterly (4)
      - value: semiannually
        label: Semi-Annually (2)
      - value: annually
        label: Annually (1)

outputs:
  - id: maturityValue
    label: Maturity Value (Ending Balance)
  - id: totalInterest
    label: Total Interest Earned
  - id: apy
    label: Annual Percentage Yield (APY)

charts:
  tabs:
    - id: balance
      label: CD Balance Growth Over Term

js_file: assets/js/calculators/cd-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "CD Calculator – Certificate of Deposit Interest & APY Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Free online CD calculator to estimate your certificate of deposit maturity value, total interest earned, and Annual Percentage Yield (APY). Compare compounding frequencies – daily, monthly, quarterly, semi-annually, or annually."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "CD Maturity Value Calculation"
    - "Total Interest Earned Projection"
    - "Annual Percentage Yield (APY) Calculator"
    - "Daily, Monthly, Quarterly, Semi-Annual, or Annual Compounding"
    - "CD Balance Growth Chart"
    - "CD Ladder Planning Support"
    - "3-Month, 6-Month, 9-Month, 12-Month, and 5-Year CD Terms"
    - "Compound Interest Formula Applied"
    - "100% Private – all calculations run locally"

breadcrumb:
  - name: Home
    url: /
  - name: Savings
    url: /savings
  - name: CD Calculator

howto:
  name: "How to Use This CD Calculator"
  description: "Follow these simple steps to calculate your certificate of deposit returns and plan your savings strategy."
  step:
    - name: "Enter your deposit amount"
      text: "Input the principal you plan to invest in your CD account."
    - name: "Set the CD term in months"
      text: "Choose your term – common options include 3-month, 6-month, 9-month, 12-month, 24-month, or 60-month (5-year) CDs."
    - name: "Input the interest rate (APR)"
      text: "Enter the annual percentage rate (APR) offered by your bank or credit union."
    - name: "Select compounding frequency"
      text: "Pick how often your bank compounds interest – daily, monthly, quarterly, semi-annually, or annually."
    - name: "Review your CD projection"
      text: "Instantly see your maturity value, total interest earned, APY, and a visual balance growth chart."

faq:
  - question: "What is a CD calculator?"
    answer: "A CD calculator (certificate of deposit calculator) estimates the maturity value and total interest earned on a bank certificate of deposit based on your principal, term length, interest rate, and compounding frequency. It helps you figure interest on your CD before you open an account."
  - question: "What is the formula for a certificate of deposit?"
    answer: "The certificate of deposit formula is: A = P × (1 + r/n)^(n×t), where A is the maturity value, P is the principal (initial deposit), r is the annual interest rate (APR), n is the number of compounding periods per year, and t is the term in years. This is the standard CD formula used by all financial institutions."
  - question: "How do I calculate APY for a CD?"
    answer: "APY (Annual Percentage Yield) is calculated using: APY = (1 + r/n)^n – 1. This shows your true annual return including compounding. Our CD APY calculator automatically computes this for you, making it easy to compare CD rates across different banks."
  - question: "What is a CD ladder calculator and how does it work?"
    answer: "A CD ladder calculator helps you plan staggered CD maturities (e.g., 3-month, 6-month, 9-month, 12-month CDs) to maintain liquidity while earning higher yields. While this tool calculates a single CD, you can run it multiple times – once for each rung of your ladder – to build your ideal certificate of deposit ladder strategy."
  - question: "Does this calculator support 6-month, 9-month, 12-month, and 5-year CDs?"
    answer: "Yes. Simply enter any term length in months – 3 for a 3-month CD, 6 for a 6-month CD, 9 for a 9-month CD, 12 for a 12-month CD, or 60 for a 5-year CD. The CD term calculator works for any period from 1 month to 120 months (10 years)."
  - question: "What is the difference between CD APR and APY?"
    answer: "APR (Annual Percentage Rate) is the stated interest rate without considering compounding. APY (Annual Percentage Yield) includes the effects of compounding and represents your actual annual return. Our CD interest rate calculator displays both, so you know your true earnings."
  - question: "How does compounding frequency affect my CD returns?"
    answer: "More frequent compounding generates higher returns. For example, a CD calculator compounded daily will show a higher maturity value than the same rate compounded monthly or annually. Our CD compound interest calculator lets you compare all five frequencies side-by-side."
  - question: "Can I use this for high-yield CDs?"
    answer: "Absolutely. This high-yield CD calculator works for any rate – simply enter the APR offered for your high-yield certificate of deposit to see your projected earnings and APY."
  - question: "What is a normal CD calculator?"
    answer: "A normal CD calculator is the standard certificate of deposit calculator that computes maturity value, total interest, and APY based on principal, term, rate, and compounding. This tool is a full-featured, free online CD calculator that provides all these projections instantly."
  - question: "How do I calculate CD returns with monthly deposits?"
    answer: "Our CD calculator with monthly deposits allows you to calculate returns when you add money regularly. Enter your principal, then use the monthly deposit feature to see how additional contributions affect your maturity value and total interest earned."
---

# CD Calculator – Calculate Your Certificate of Deposit Interest & APY

Use this **free CD calculator** to estimate your certificate of deposit maturity value, total interest earned, and Annual Percentage Yield (APY). Whether you're planning a short-term 6-month CD or a long-term 5-year CD, this online CD calculator gives you instant, accurate projections.

<!-- more -->

## How This CD Interest Calculator Works

A **certificate of deposit (CD)** is a low-risk savings product offered by banks and credit unions. You lock your money for a fixed term, and the bank pays you a guaranteed interest rate. This **CD interest calculator** does all the math for you:

- **Maturity Value** – your final balance when the CD matures.
- **Total Interest Earned** – how much your money grows over the term.
- **Annual Percentage Yield (APY)** – the effective annual return including compounding.
- **Balance Growth Chart** – a visual month-by-month projection of your CD's growth.

It works for **any CD account** – whether you're calculating a **3-month CD**, **6-month CD**, **9-month CD**, **12-month CD**, or a **5-year CD**.

---

## Certificate of Deposit Formula (CD Formula)

Every bank uses the same compound interest formula behind the scenes. This is the **certificate of deposit formula** used by our calculator:

> **A = P × (1 + r/n)^(n×t)**

Where:
- **A** = Maturity Value (your final balance)
- **P** = Principal (your initial deposit)
- **r** = Annual interest rate (APR) as a decimal
- **n** = Number of compounding periods per year
- **t** = Term length in years

**APY Formula:**
> **APY = (1 + r/n)^n – 1**

This is why a **5% APR compounded daily** gives a higher APY than **5% compounded annually**. Our **CD APY calculator** reveals this difference instantly.

---

## How to Use This Online CD Calculator

This **bank CD calculator** is designed to be simple and intuitive. Follow these steps:

### Step 1: Enter Your Initial Deposit
Input the principal amount you plan to invest. This is your starting balance – the CD deposit amount you're putting into the account.

### Step 2: Set the CD Term Length
Choose how long you want to lock your money. Enter the term in months. Common options include:
- **3-month CD** – for short-term savings
- **6-month CD** – for emergency fund laddering
- **9-month CD** – for specific savings goals
- **12-month CD** – the most popular term
- **5-year CD** (60 months) – for long-term fixed-income investing

### Step 3: Enter the Interest Rate (APR)
Input the annual interest rate offered by your bank. This is the stated APR – our calculator will automatically compute the APY for you.

### Step 4: Choose Compounding Frequency
Select how often your bank compounds interest:
- **Daily** – most common for online banks
- **Monthly** – standard for many credit unions
- **Quarterly** – used by many traditional banks
- **Semi-Annually** – less common but available
- **Annually** – simplest compounding method

### Step 5: Review Your CD Projection
Instantly see:
- **Maturity Value** – your ending balance
- **Total Interest Earned** – your earnings
- **APY** – your true annual return
- **Growth Chart** – visual balance progression

---

## CD Ladder Calculator – Build Your Staggered Strategy

A **CD ladder** is a strategy where you divide your savings across multiple CDs with different maturity dates. For example:

| Rung | Term | Purpose |
|------|------|---------|
| Rung 1 | 3-month CD | Quick access to funds |
| Rung 2 | 6-month CD | Moderate liquidity |
| Rung 3 | 9-month CD | Medium-term savings |
| Rung 4 | 12-month CD | Higher yield, annual renewal |

**How this tool helps:** While this is a **single-CD calculator**, you can run it multiple times – once for each rung of your ladder. Use the results to design your ideal **certificate of deposit ladder**, ensuring you have liquidity at regular intervals while capturing higher yields on longer-term CDs.

This **CD ladder calculator** approach is a popular strategy for retirees and savers who want to balance yield and access.

---

## CD Calculator Examples

### Example 1: 6-Month CD (Short-Term)

| Variable | Value |
|----------|-------|
| Principal | $10,000 |
| Term | 6 months |
| APR | 5.25% |
| Compounding | Monthly |
| **Maturity Value** | **$10,265.26** |
| **Total Interest Earned** | **$265.26** |
| **APY** | **5.38%** |

### Example 2: 12-Month CD (Standard)

| Variable | Value |
|----------|-------|
| Principal | $25,000 |
| Term | 12 months |
| APR | 5.00% |
| Compounding | Daily |
| **Maturity Value** | **$25,511.62** |
| **Total Interest Earned** | **$511.62** |
| **APY** | **5.13%** |

### Example 3: 5-Year CD (Long-Term)

| Variable | Value |
|----------|-------|
| Principal | $50,000 |
| Term | 60 months |
| APR | 4.50% |
| Compounding | Quarterly |
| **Maturity Value** | **$62,458.12** |
| **Total Interest Earned** | **$12,458.12** |
| **APY** | **4.58%** |

### Example 4: 3-Month CD (Ladder Rung)

| Variable | Value |
|----------|-------|
| Principal | $5,000 |
| Term | 3 months |
| APR | 5.00% |
| Compounding | Daily |
| **Maturity Value** | **$5,062.87** |
| **Total Interest Earned** | **$62.87** |
| **APY** | **5.13%** |

---

## Who Benefits from This CD Calculator?

- **Savers** comparing CD rates and compounding options
- **Pre-retirees** looking for safe, fixed-income returns
- **Investors** building a CD ladder strategy
- **Anyone** wanting to calculate CD returns before opening an account
- **Budgeters** planning savings goals with fixed maturity dates

---

## CD Calculator Features (Keyword-Rich Summary)

| Feature | Description |
|---------|-------------|
| **CD calculator** | Full certificate of deposit projection tool |
| **CD deposit calculator** | Figures your investment growth |
| **Bank certificate calculator** | Works with any bank or credit union |
| **CD term calculator** | Supports 3, 6, 9, 12, 24, 36, 48, 60 months |
| **CD rate calculator** | Compares APR and APY |
| **CD interest calculator** | Shows total interest earned |
| **CD return calculator** | Displays maturity value |
| **CD account calculator** | Projects balance growth |
| **CD payout calculator** | Shows final payout amount |
| **Certificate of deposit interest calculator** | Full formula implementation |
| **Online CD calculator** | Free, instant, private |
| **CD APY calculator** | Computes Annual Percentage Yield |
| **CD compound interest calculator** | Daily, monthly, quarterly, semi-annual, annual |
| **CD ladder calculator** | Supports laddering strategy planning |
| **CD maturity calculator** | Shows ending balance |
| **High-yield CD calculator** | Works with any elevated rate |
| **CD earnings calculator** | Projects total profit |
| **CD growth calculator** | Visual chart of balance over time |
| **CD estimator** | Quick projection tool |
| **CD value calculator** | Maturity value projection |

---

## Frequently Asked Questions (FAQ)

### What is a CD calculator?
A CD calculator (certificate of deposit calculator) estimates the maturity value and total interest earned on a bank certificate of deposit based on your principal, term length, interest rate, and compounding frequency. It helps you figure interest on your CD before you open an account.

### What is the formula for a certificate of deposit?
The certificate of deposit formula is: A = P × (1 + r/n)^(n×t), where A is the maturity value, P is the principal (initial deposit), r is the annual interest rate (APR), n is the number of compounding periods per year, and t is the term in years. This is the standard CD formula used by all financial institutions.

### How do I calculate APY for a CD?
APY (Annual Percentage Yield) is calculated using: APY = (1 + r/n)^n – 1. This shows your true annual return including compounding. Our CD APY calculator automatically computes this for you, making it easy to compare CD rates across different banks.

### What is a CD ladder calculator and how does it work?
A CD ladder calculator helps you plan staggered CD maturities (e.g., 3-month, 6-month, 9-month, 12-month CDs) to maintain liquidity while earning higher yields. While this tool calculates a single CD, you can run it multiple times – once for each rung of your ladder – to build your ideal certificate of deposit ladder strategy.

### Does this calculator support 6-month, 9-month, 12-month, and 5-year CDs?
Yes. Simply enter any term length in months – 3 for a 3-month CD, 6 for a 6-month CD, 9 for a 9-month CD, 12 for a 12-month CD, or 60 for a 5-year CD. The CD term calculator works for any period from 1 month to 120 months (10 years).

### What is the difference between CD APR and APY?
APR (Annual Percentage Rate) is the stated interest rate without considering compounding. APY (Annual Percentage Yield) includes the effects of compounding and represents your actual annual return. Our CD interest rate calculator displays both, so you know your true earnings.

### How does compounding frequency affect my CD returns?
More frequent compounding generates higher returns. For example, a CD calculator compounded daily will show a higher maturity value than the same rate compounded monthly or annually. Our CD compound interest calculator lets you compare all five frequencies side-by-side.

### Can I use this for high-yield CDs?
Absolutely. This high-yield CD calculator works for any rate – simply enter the APR offered for your high-yield certificate of deposit to see your projected earnings and APY.

### What is a normal CD calculator?
A normal CD calculator is the standard certificate of deposit calculator that computes maturity value, total interest, and APY based on principal, term, rate, and compounding. This tool is a full-featured, free online CD calculator that provides all these projections instantly.

### How do I calculate CD returns with monthly deposits?
Our CD calculator with monthly deposits allows you to calculate returns when you add money regularly. Enter your principal, then use the monthly deposit feature to see how additional contributions affect your maturity value and total interest earned.

### Is this CD calculator free to use?
Yes, this is a completely free online CD calculator with no registration or hidden fees. All calculations run locally in your browser – your data stays private.

### How do I calculate the APR for a CD?
To calculate APR for a CD, divide the total interest earned by the principal and term length. However, our CD rate calculator does this automatically, so you can focus on comparing returns.

### What is a certificate of deposit return calculator?
A certificate of deposit return calculator projects your total return (maturity value minus principal) over the CD term. This tool provides that projection instantly, along with a visual growth chart.

---

## Start Calculating Your CD Returns Today

Whether you're saving for a specific goal, building a CD ladder, or simply comparing options, this **CD deposit calculator** gives you the clarity you need. Enter your numbers above and see your certificate of deposit projections instantly – no downloads, no registration, 100% private.