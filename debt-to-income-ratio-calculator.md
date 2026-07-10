---
layout: tool
title: Debt to Income Ratio Calculator – Calculate Your DTI
description: Use our free Debt to Income Ratio Calculator to determine your DTI. Enter your monthly debt payments and income to see your debt-to-income ratio and loan eligibility.
permalink: /debt-to-income-ratio-calculator
tool_id: debt-to-income-ratio
category: debt
hide_sidebar: true

inputs:
  - id: monthlyDebt
    label: Total Monthly Debt Payments
    type: number
    default: 2000
    step: 50
    min: 0
    currency: true
    placeholder: "e.g., 2000"

  - id: grossIncome
    label: Gross Monthly Income
    type: number
    default: 6000
    step: 100
    min: 0
    currency: true
    placeholder: "e.g., 6000"

outputs:
  - id: dtiRatio
    label: Debt-to-Income Ratio (DTI)
  - id: dtiAssessment
    label: Assessment
  - id: maxLoanPayment
    label: Max Monthly Loan Payment (28% DTI)
  - id: maxTotalDebt
    label: Max Total Debt Payment (36% DTI)
  - id: dtiCategory
    label: DTI Category

charts:
  tabs:
    - id: breakdown
      label: DTI Breakdown

history_columns:
  - key: monthlyDebt
    label: Monthly Debt
    source: input
  - key: grossIncome
    label: Monthly Income
    source: input
  - key: dtiRatio
    label: DTI Ratio
    source: output
  - key: dtiAssessment
    label: Assessment
    source: output

js_file: assets/js/calculators/debt-to-income-ratio.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Debt to Income Ratio Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate your debt-to-income ratio (DTI) instantly. Enter your monthly debt payments and gross income to see your DTI and loan eligibility."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Instant DTI Calculation"
    - "Loan Eligibility Assessment"
    - "Visual DTI Breakdown Chart"
    - "Mortgage Qualification Check (28/36 Rule)"
    - "100% Private – no data sent to servers"
    - "Calculation History"

breadcrumb:
  - name: Home
    url: /
  - name: Debt
    url: /debt
  - name: Debt to Income Ratio Calculator

howto:
  name: "How to Use the Debt to Income Ratio Calculator"
  description: "Follow these steps to calculate your debt-to-income ratio and understand your loan eligibility."
  step:
    - name: "Enter your total monthly debt payments"
      text: "Add up all your monthly debt obligations including mortgage/rent, car loans, credit card payments, student loans, and personal loans."
    - name: "Enter your gross monthly income"
      text: "Enter your total monthly income before taxes and deductions. Include salary, bonuses, alimony, and any other regular income."
    - name: "View your DTI ratio"
      text: "The tool calculates your debt-to-income ratio and shows you where you fall on the lender scale."
    - name: "Check loan eligibility"
      text: "See if you qualify for a mortgage (28/36 rule) and what your maximum monthly payment could be."

faq:
  - question: "What is debt-to-income ratio (DTI)?"
    answer: "Your debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward paying your monthly debts. It's a key metric lenders use to evaluate your ability to manage monthly payments and repay loans."
  - question: "How is DTI calculated?"
    answer: "DTI is calculated by dividing your total monthly debt payments by your gross monthly income, then multiplying by 100. The formula is: DTI = (Total Monthly Debt ÷ Gross Monthly Income) × 100."
  - question: "What is a good DTI ratio?"
    answer: "A DTI of 36% or less is generally considered good. 37-42% is acceptable but may require additional scrutiny. 43-49% is high and may limit loan options. 50% or above is very high and indicates significant financial strain."
  - question: "What is the 28/36 rule for mortgages?"
    answer: "Lenders use the 28/36 rule to qualify borrowers: your housing expenses (mortgage payment, taxes, insurance) should not exceed 28% of your gross income, and your total debt payments should not exceed 36% of your gross income."
  - question: "What debts are included in DTI calculation?"
    answer: "Include mortgage or rent, car loans, credit card minimum payments, student loans, personal loans, alimony, and child support. Exclude utilities, groceries, insurance premiums, and other living expenses."
  - question: "Can I lower my DTI ratio?"
    answer: "Yes — you can lower your DTI by paying down existing debts, increasing your income, or both. Even a small reduction can improve your loan eligibility."
  - question: "Is my data stored anywhere?"
    answer: "No. All calculations run locally in your browser. No data is sent to any server."

---

# Debt to Income Ratio Calculator – Calculate Your DTI Instantly

Calculate your debt-to-income ratio (DTI) with our free **debt to income ratio calculator**. Enter your total monthly debt payments and gross monthly income to see your DTI percentage, loan eligibility, and where you stand in the lender's eyes — all without your data leaving your browser.

<!-- more -->

## Why Use This DTI Calculator

Your debt-to-income ratio is one of the most important numbers in your financial life. Lenders use it to determine if you qualify for mortgages, car loans, personal loans, and credit cards. Our **debt to income calculator** helps you:

- 💰 **Calculate Your DTI** — instantly see your debt-to-income ratio as a percentage.
- 🏠 **Check Loan Eligibility** — see if you qualify for a mortgage (28/36 rule).
- 📊 **Visual Breakdown** — understand exactly where your money goes.
- 📈 **Track Changes** — see how paying down debt or increasing income affects your DTI.
- 🔒 **100% Private** — all calculations run locally in your browser.

---

## What Is Debt-to-Income Ratio (DTI)?

Your debt-to-income ratio is the percentage of your gross monthly income that goes toward paying your monthly debts. It's one of the most important metrics lenders use to evaluate your financial health.

**The Formula:**

**DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100**

For example, if you have $2,000 in monthly debt payments and earn $6,000 in gross monthly income, your DTI is:

**DTI = ($2,000 ÷ $6,000) × 100 = 33.3%**

---

## DTI Categories & What They Mean

| DTI Range | Category | What It Means |
|-----------|----------|---------------|
| **0 – 20%** | Excellent | You have very manageable debt. Lenders will view you favorably. |
| **21 – 36%** | Good | You're managing debt well. Most lenders will approve you. |
| **37 – 42%** | Acceptable | You may qualify for loans but could face higher rates. |
| **43 – 49%** | High | Loan approval may be difficult. Consider reducing debt. |
| **50%+** | Very High | You're carrying a heavy debt load. Seek debt counseling. |

---

## The 28/36 Rule for Mortgage Qualification

Lenders use the **28/36 rule** to qualify borrowers for mortgages:

| Rule | Description |
|------|-------------|
| **28% Rule** | Your housing expenses (mortgage payment, taxes, insurance) should not exceed **28%** of your gross monthly income. |
| **36% Rule** | Your total debt payments (housing + all other debts) should not exceed **36%** of your gross monthly income. |

This calculator shows you both benchmarks so you know exactly where you stand.

---

## How to Use This DTI Calculator

1. **Enter your total monthly debt payments** — include mortgage/rent, car loans, credit card payments, student loans, personal loans, alimony, and child support.
2. **Enter your gross monthly income** — your total income before taxes and deductions.
3. **View your results** — see your DTI ratio, assessment, and loan eligibility.
4. **Check the 28/36 rule** — see your max housing payment and max total debt payment.

The tool updates instantly as you adjust any input — no "Calculate" button required.

---

## Frequently Asked Questions

### What is debt-to-income ratio (DTI)?
Your debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward paying your monthly debts. It's a key metric lenders use to evaluate your ability to manage monthly payments and repay loans.

### How is DTI calculated?
DTI is calculated by dividing your total monthly debt payments by your gross monthly income, then multiplying by 100. The formula is: DTI = (Total Monthly Debt ÷ Gross Monthly Income) × 100.

### What is a good DTI ratio?
A DTI of 36% or less is generally considered good. 37-42% is acceptable but may require additional scrutiny. 43-49% is high and may limit loan options. 50% or above is very high and indicates significant financial strain.

### What is the 28/36 rule for mortgages?
Lenders use the 28/36 rule to qualify borrowers: your housing expenses (mortgage payment, taxes, insurance) should not exceed 28% of your gross income, and your total debt payments should not exceed 36% of your gross income.

### What debts are included in DTI calculation?
Include mortgage or rent, car loans, credit card minimum payments, student loans, personal loans, alimony, and child support. Exclude utilities, groceries, insurance premiums, and other living expenses.

### Can I lower my DTI ratio?
Yes — you can lower your DTI by paying down existing debts, increasing your income, or both. Even a small reduction can improve your loan eligibility.

### Is my data stored anywhere?
No. All calculations run locally in your browser. No data is sent to any server.

---