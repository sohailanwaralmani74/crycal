---
layout: tool
title: "Cash on Cash Return Calculator | Investment & Portfolio Return"
description: "Calculate leveraged cash-on-cash return rates and annual pre-tax cash flow for real estate investments. 100% free and private browser execution."
permalink: /cash-on-cash-return-calculator
tool_id: cash-on-cash-return-calculator
category: investing
hide_sidebar: true

inputs:
  - id: totalInitialCashInvested
    label: Total Cash Out of Pocket (Down Pmt + Closing + Rehab)
    type: number
    default: 95000
    step: 5000
    min: 1000
    currency: true
    placeholder: "e.g., 95000"

  - id: annualNoi
    label: Net Operating Income (NOI)
    type: number
    default: 31500
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 31500"

  - id: annualDebtService
    label: Annual Mortgage Payment (P&I)
    type: number
    default: 21600
    step: 1000
    min: 0
    currency: true
    placeholder: "e.g., 21600"

outputs:
  - id: netAnnualCashFlow
    label: Net Pre-Tax Annual Cash Flow
  - id: cashOnCashReturnPercent
    label: Cash-on-Cash Return Rate (%)

charts:
  tabs:
    - id: breakdown
      label: Annual Cash Flow Distribution
    - id: return
      label: Cash-on-Cash Return Yield

history_columns:
  - key: totalInitialCashInvested
    label: Cash Invested
    source: input
  - key: annualNoi
    label: Annual NOI
    source: input
  - key: annualDebtService
    label: Debt Service
    source: input
  - key: netAnnualCashFlow
    label: Net Cash Flow
    source: output
  - key: cashOnCashReturnPercent
    label: CoC Return %
    source: output

js_file: assets/js/calculators/cash-on-cash-return-calculator.js

structured_data:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "Cash-on-Cash Return Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Calculate leveraged cash-on-cash returns and net pre-tax cash flow for rental property and real estate investments."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Leveraged Real Estate Yield Modeling — calculate annual pre-tax cash return on out-of-pocket capital"
    - "Mortgage Debt Service Impact — deduct annual mortgage principal and interest payments"
    - "170+ World Currencies — auto-format values globally"
    - "100% Private — all calculations run locally in your browser"

breadcrumb:
  - name: Home
    url: /
  - name: Investing
    url: /investing
  - name: Cash-on-Cash Return Calculator

howto:
  name: "How to Calculate Cash-on-Cash Return"
  description: "Calculate annual cash flow return on out-of-pocket capital invested in rental real estate."
  step:
    - name: "Select currency"
      text: "Choose your preferred currency from the top header selector."
    - name: "Input total out-of-pocket cash"
      text: "Enter initial cash invested (down payment + closing costs + upfront rehab expenses)."
    - name: "Input Net Operating Income (NOI)"
      text: "Enter annual gross rental revenue minus operating expenses (property taxes, insurance, repairs, vacancy)."
    - name: "Input annual debt service"
      text: "Enter annual mortgage payments (principal and interest)."
    - name: "Review cash-on-cash yield"
      text: "View net annual pre-tax cash flow and cash-on-cash return percentage yield."

faq:
  - question: "What is Cash-on-Cash Return in real estate?"
    answer: "Cash-on-Cash Return in real estate measures the annual pre-tax cash flow earned on a rental property relative to the total out-of-pocket cash invested."
  - question: "How does Cash-on-Cash return differ from Cap Rate?"
    answer: "Cash-on-Cash return measures actual cash yield after mortgage payments, whereas Cap Rate evaluates property performance assuming an all-cash purchase without debt."
  - question: "What is considered a good Cash-on-Cash return?"
    answer: "Real estate investors generally consider a good Cash-on-Cash return to be between 8% and 12%, depending on property location, asset class, and market interest rates."
  - question: "What costs should be included in total initial cash invested?"
    answer: "Total initial cash invested must include the down payment, lender origination fees, closing costs, title insurance, and initial renovation or rehab costs."
  - question: "How does leverage affect Cash-on-Cash return?"
    answer: "Mortgage leverage amplifies Cash-on-Cash return when property net operating income yields exceed interest rates, allowing investors to achieve higher yields on smaller cash outlays."
  - question: "Does Cash-on-Cash return include property appreciation or tax benefits?"
    answer: "Cash-on-Cash return does not include property appreciation or tax benefits; it strictly isolates immediate cash flow yield, excluding principal reduction and tax depreciation benefits."
  - question: "Is my property investment data private?"
    answer: "Your property investment data is 100% private because all calculation algorithms execute locally inside your web browser. No property address, purchase price, or cash flow figures are transmitted or stored."
---

# Cash on Cash Return Calculator – See Your Real Estate Investment's True Cash Yield

Thinking about buying a rental property? The price tag doesn't tell the whole story. Our **Cash on Cash Return Calculator** helps you figure out what really matters: how much actual cash you'll earn each year on the money you actually invest. No fluff, just the numbers you need to make smart real estate decisions.

<!-- more -->

## Why This Metric Matters for Real Estate Investors

If you're buying property with a mortgage—and most investors do—**Cash-on-Cash Return** is your most practical metric. It measures the annual cash dividend you earn on the actual cash you've pulled out of your pocket. Not the property's value, not the purchase price—just the real money you've put in.

Here's why real estate investors love this metric:

- **It's real-world** — it accounts for your mortgage payments, not just the property's theoretical return
- **It compares deals apples-to-apples** — even when properties have different prices and financing
- **It's honest** — it tells you exactly how your cash is performing

Our **Cash on Cash Return Calculator** factors in your down payment, closing costs, renovation budget, Net Operating Income (NOI), and mortgage payments—giving you a clear picture of your investment's real yield.

---

## The Math Behind It (Made Simple)

**Net Annual Cash Flow =** Net Operating Income − Annual Mortgage Payments

**Total Cash Invested =** Down Payment + Closing Costs + Renovation Costs

**Cash-on-Cash Return =** (Net Annual Cash Flow ÷ Total Cash Invested) × 100

**Payback Period =** Total Cash Invested ÷ Net Annual Cash Flow

---

## Real-World Scenario: See How Financing Changes Everything

Let's look at a **$300,000 rental property** generating **$31,500 in annual Net Operating Income**. Here's how different financing strategies affect your actual cash yield:

| Strategy | Cash You Invest | Annual Mortgage Payment | Net Annual Cash Flow | Cash-on-Cash Return | Payback Period |
|---|---|---|---|---|---|
| **All-Cash Purchase** | $300,000 | $0 | $31,500 | **10.50%** | 9.5 Years |
| **25% Down** | $95,000 | $19,500 | $12,000 | **12.63%** | 7.9 Years |
| **15% Down** | $65,000 | $22,100 | $9,400 | **14.46%** | 6.9 Years |
| **10% Down (BRRRR Strategy)** | $40,000 | $23,400 | $8,100 | **20.25%** | 4.9 Years |
| **Negative Cash Flow** | $95,000 | $33,000 | -$1,500 | **-1.58%** | N/A |

*The takeaway? Using leverage (a mortgage) can turn a 10.5% return into a 20%+ return while preserving your capital for other deals. But be careful—too much debt can flip you into negative cash flow territory.*

---

## How to Use This Calculator

Getting your cash-on-cash analysis is quick and straightforward:

1. **Pick your currency** from the selector in the site header.
2. **Enter your total cash invested** — down payment + closing costs + rehab costs.
3. **Enter your annual Net Operating Income (NOI)** — your rental income minus operating expenses (taxes, insurance, repairs, property management).
4. **Enter your annual mortgage payment** — principal and interest only (not taxes or insurance, since those are already in NOI).
5. **View your results instantly** — net annual cash flow, Cash-on-Cash return percentage, and payback period.

---

## Who Benefits From This Calculator?

This real estate investment tool is perfect for:

- **First-time landlords** — figuring out if a deal actually makes sense
- **Experienced investors** — comparing multiple deals and financing options
- **Real estate agents** — helping clients understand investment potential
- **Anyone** — considering buying a rental property and wanting to run the numbers before committing

---

## Common Questions About Cash-on-Cash Return

### What is Cash-on-Cash Return in real estate?

It's the annual cash income you earn on a rental property, expressed as a percentage of the cash you actually invested. It's your real, after-mortgage return on the money you've put in.

### How is Cash-on-Cash Return different from Cap Rate?

- **Cap Rate** — assumes you bought the property with all cash, no mortgage. It's a theoretical return.
- **Cash-on-Cash Return** — accounts for your actual mortgage payments. It's your real, practical return.

Cash-on-Cash Return is what actually matters for leveraged investors.

### What's considered a good Cash-on-Cash return?

Most real estate investors aim for **8% to 12%**, though this varies by location, property type, and market conditions. In high-cost cities, 6% might be solid. In lower-cost areas, 15%+ is possible.

### What costs should I include in my "cash invested"?

- **Down payment** — your initial equity
- **Closing costs** — lender fees, title insurance, inspection, legal fees
- **Renovation costs** — any repairs or improvements before renting

Don't forget these—they're real cash out of your pocket.

### How does leverage (a mortgage) affect my return?

When you use a mortgage, you're amplifying your return. If your property's income exceeds your interest costs, leverage boosts your Cash-on-Cash Return. If income falls short, leverage can magnify losses. That's why this calculator is so valuable—it shows you the real impact.

### Does Cash-on-Cash Return include property appreciation?

**No.** Cash-on-Cash Return strictly measures annual cash flow—rental income minus expenses and mortgage payments. It doesn't include property appreciation or tax benefits. That means it's a conservative, "what's in my pocket today" metric, which is exactly why investors love it.

### Is my investment data private?

**Absolutely.** All calculations run entirely in your browser. No property addresses, financial figures, or personal details are ever stored or transmitted. Your deal analysis stays between you and your screen.