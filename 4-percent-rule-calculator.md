---
layout: tool
title: "4% Rule FIRE Calculator | Retirement Portfolio & Withdrawals"
description: "Use the 4% Rule Calculator to estimate how much you can safely withdraw from your retirement portfolio each year without running out of money."
permalink: /4-percent-rule-calculator
tool_id: 4-percent-rule-calculator
category: retirement
hide_sidebar: true

inputs:
  - id: portfolioValue
    label: Retirement Portfolio Value
    type: number
    default: 1000000
    step: 10000
    min: 0
    currency: true
    placeholder: "e.g., 1000000"

  - id: withdrawalRate
    label: Withdrawal Rate
    type: number
    default: 4
    step: 0.1
    min: 1
    max: 10
    suffix: '%'
    placeholder: "e.g., 4"

  - id: inflationRate
    label: Expected Annual Inflation Rate
    type: number
    default: 3
    step: 0.1
    min: 0
    max: 10
    suffix: '%'
    placeholder: "e.g., 3"

  - id: expectedReturn
    label: Expected Annual Portfolio Return
    type: number
    default: 6
    step: 0.1
    min: 0
    max: 15
    suffix: '%'
    placeholder: "e.g., 6"

  - id: retirementYears
    label: Years in Retirement
    type: number
    default: 30
    step: 1
    min: 1
    max: 50
    placeholder: "e.g., 30"

outputs:
  - id: initialAnnualWithdrawal
    label: Initial Annual Withdrawal
  - id: initialMonthlyWithdrawal
    label: Initial Monthly Withdrawal
  - id: withdrawalInFinalYear
    label: Inflation-Adjusted Withdrawal in Final Year
  - id: endingBalance
    label: Projected Ending Balance

charts:
  tabs:
    - id: balance
      label: Portfolio Balance Over Time
    - id: withdrawal
      label: Annual Withdrawal Over Time

js_file: assets/js/calculators/4-percent-rule-calculator.js

structured_data:

  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: "4% Rule Calculator"
  applicationCategory: "FinancialApplication"
  operatingSystem: "All"
  description: "Use the 4% Rule Calculator to model retirement withdrawals, account for inflation, compare withdrawal rates, and project how your portfolio could change over a selected retirement period."
  offers:
    "@type": "Offer"
    price: "0"
    priceCurrency: "USD"
  featureList:
    - "Retirement Withdrawal Rate Calculation"
    - "Inflation-Adjusted Withdrawal Projection"
    - "Portfolio Balance Projection"
    - "Withdrawal Rate Comparison"
    - "Balance and Withdrawal Charts"
    - "Calculation History"
    - "CSV and Excel Export"
    - "Shareable Calculation Setups"
    - "100% Private – all calculations run locally"

breadcrumb:

  - name: Home
    url: /
  - name: Retirement
    url: /retirement
  - name: 4% Rule Calculator

howto:

  name: "How to Use the 4% Rule Calculator"
  description: "Use your portfolio value, withdrawal rate, inflation, return assumption, and retirement period to model a retirement withdrawal scenario."
  step:
    - name: "Enter your retirement portfolio"
      text: "Enter the amount you expect to have available when retirement begins."
    - name: "Choose a withdrawal rate"
      text: "Enter the percentage you want to withdraw during the first year. You can test 4% or compare it with lower or higher rates."
    - name: "Enter inflation and return assumptions"
      text: "Enter the annual inflation rate and expected portfolio return used for the projection."
    - name: "Set your retirement period"
      text: "Enter the number of years you want the portfolio to support withdrawals."
    - name: "Review and compare the results"
      text: "Review the initial withdrawal, inflation-adjusted withdrawal, projected ending balance, and charts showing how the portfolio changes over time."

faq:

  - question: "What is the 4% rule?"
    answer: "The 4% rule is a historical retirement withdrawal guideline associated with William Bengen's 1994 research. The traditional approach starts with a withdrawal equal to 4% of the initial portfolio and increases the dollar amount for inflation in subsequent years. It was based on historical U.S. market data and a 30-year retirement period, so it should not be treated as a guarantee."
  - question: "Is 4% still a safe withdrawal rate?"
    answer: "There is no withdrawal rate that is guaranteed to be safe. More recent research uses forward-looking assumptions and produces different results depending on the retirement period, portfolio allocation, and desired probability of success. Morningstar's latest research uses 3.9% as its base-case starting rate for a 30-year retirement with a 90% probability of success under its stated assumptions."
  - question: "Does the 4% rule mean I can withdraw 4% of my balance every year?"
    answer: "Not in the traditional version of the rule. The first withdrawal is 4% of the starting portfolio, and later withdrawals increase by inflation. It is different from withdrawing 4% of the portfolio's current balance every year."
  - question: "Does the 4% rule work for a 40- or 50-year retirement?"
    answer: "The classic research is generally discussed around a 30-year retirement period. A longer retirement gives the portfolio more years of withdrawals and market exposure, so you should test a longer period rather than assuming that the same rate will work indefinitely."
  - question: "Does this calculator include taxes?"
    answer: "No. The calculator projects portfolio withdrawals based on the assumptions you enter. Taxes can reduce the amount available for spending and depend on your account type, income, location, and individual circumstances."
  - question: "Why can two retirement calculators give different results?"
    answer: "Retirement calculators can use different return assumptions, inflation rates, portfolio allocations, retirement periods, withdrawal methods, fees, taxes, and probability models. A simple fixed-return projection like this calculator is not the same as a historical or Monte Carlo simulation."
  - question: "What happens if the market falls early in retirement?"
    answer: "A fixed withdrawal that continues to rise with inflation can put more pressure on a portfolio after an early market decline. This is known as sequence-of-returns risk. The calculator shows the effect of your selected return assumption, but it does not simulate individual historical market sequences."
  - question: "Can I use this calculator outside the United States?"
    answer: "Yes, the withdrawal mathematics can be used with your own assumptions. However, the historical research behind the traditional 4% rule is based primarily on U.S. market data, so local investment returns, inflation, taxes, account rules, and currency should also be considered."

---

# 4% Rule Calculator – Retirement Withdrawal & Portfolio Projection

How much could your retirement portfolio support each year?

The **4% Rule Calculator** lets you test that question with your own numbers. Enter your portfolio value, withdrawal rate, inflation rate, expected return, and retirement period, then see the initial withdrawal, future inflation-adjusted withdrawals, and projected portfolio balance.

The important part is that you can change the assumptions. A 4% withdrawal over 30 years is not the same scenario as 4% over 40 or 50 years, and a fixed 6% return assumption is not the same as experiencing actual market returns year by year.

<!-- more -->


## What This Calculator Does

The calculator starts with five inputs:

- **Retirement Portfolio Value** — the amount available when retirement begins
- **Withdrawal Rate** — the percentage used to calculate the first year's withdrawal
- **Expected Annual Inflation Rate** — the rate used to increase future withdrawals
- **Expected Annual Portfolio Return** — the annual return assumption used in the projection
- **Years in Retirement** — how long the projection should run

The results show:

- **Initial Annual Withdrawal** — your first year's withdrawal based on the selected rate
- **Initial Monthly Withdrawal** — the annual amount divided into monthly amounts
- **Inflation-Adjusted Withdrawal in Final Year** — the projected withdrawal after applying the inflation assumption
- **Projected Ending Balance** — the estimated portfolio value at the end of the selected period
- **Portfolio Balance Over Time** — a chart showing the projected portfolio balance
- **Annual Withdrawal Over Time** — a chart showing how the withdrawal grows with inflation

You can also save calculation setups, give them names, compare scenarios, share a calculation, and export the calculation history to CSV or Excel.

## The 4% Rule in Plain English

The traditional 4% rule starts with **4% of the portfolio in the first year of retirement**.

If you retire with $1,000,000:

`$1,000,000 × 4% = $40,000`

The next year's withdrawal is not calculated as 4% of whatever remains in the account.

Instead, the traditional approach increases the previous year's dollar withdrawal by inflation.

With 3% inflation:

`$40,000 × 1.03 = $41,200`

The year after that:

`$41,200 × 1.03 = $42,436`

That distinction is one of the reasons people can get very different answers when comparing retirement calculators.

## The Math Behind It (Made Simple)

**First-year withdrawal**

`Starting portfolio × withdrawal rate`

**Inflation-adjusted withdrawal**

`Previous withdrawal × (1 + inflation rate)`

**Projected portfolio balance**

`(Previous balance − withdrawal) × (1 + expected return)`

For example, a $1,000,000 portfolio with a 4% withdrawal rate, 3% inflation, and 6% expected return starts with a $40,000 withdrawal.

The calculator then applies your inflation and return assumptions year after year.

This is a projection, not a prediction of actual market performance.

## Why the 4% Rule Is Not a Guarantee

The 4% rule came from historical analysis rather than a promise about future markets.

William Bengen's original 1994 research tested historical retirement periods using market returns and inflation. His later explanation of the research notes that a 4.15% initial withdrawal rate had not failed over the historical 30-year periods he examined from 1926 onward. [1]

That does not mean every retiree can withdraw 4% indefinitely.

The result depends on the period being tested, portfolio allocation, inflation, market returns, and how withdrawals are handled.

More recent research takes a different approach. Morningstar's latest research uses forward-looking return and inflation assumptions and estimates a 3.9% starting withdrawal rate for a 30-year retirement with a 90% probability of success under its stated base-case assumptions. [2]

So 4% should be treated as a useful historical reference point, not as a permanent safe-income guarantee.

## 30 Years Is Not Forever

One of the most common misunderstandings about the 4% rule is treating it as a perpetual withdrawal strategy.

The classic research is associated with a **30-year retirement period**.

That matters if you are retiring early.

Someone retiring at 35 may need the portfolio to support withdrawals for 50 or 60 years. Someone retiring at 70 may have a much shorter planning horizon.

Recent Morningstar research also shows why the time horizon matters: its modeled starting rate for a 25-year horizon is higher than the 30-year rate, while a 10-year horizon supports a substantially higher rate under the same research framework. [3]

Use the **Years in Retirement** field to test your actual planning horizon instead of automatically entering 30 years.

## Sequence of Returns Can Change the Outcome

Average returns can hide an important retirement risk.

Consider two retirees who both experience the same average investment return over 20 years. If one experiences several poor years immediately after retirement while the other experiences those poor years much later, their portfolio outcomes can be very different.

This is known as **sequence-of-returns risk**.

Morningstar's retirement research specifically found that retirees experiencing poor returns during the first five years were more likely to exhaust their savings when they did not reduce spending. High inflation early in retirement can create a similar problem. [2]

This calculator does not recreate those historical return sequences. It applies the annual return assumption you enter.

That limitation is important.

If you enter a 6% return, the calculator models 6% as the annual return assumption. It does not randomly generate years such as +18%, -12%, +4%, -8%, and +15%.

## What Happens When You Change the Withdrawal Rate?

The withdrawal rate has a direct effect on the amount you take out during the first year.

| Portfolio | Withdrawal Rate | First-Year Withdrawal |
|---|---:|---:|
| $500,000 | 3% | $15,000 |
| $500,000 | 4% | $20,000 |
| $500,000 | 5% | $25,000 |
| $1,000,000 | 3% | $30,000 |
| $1,000,000 | 4% | $40,000 |
| $1,000,000 | 5% | $50,000 |

A higher rate gives you more income at the beginning, but it also requires the portfolio to support larger withdrawals.

That trade-off is more useful to examine than simply asking whether "4%" is safe.

## Inflation Changes the Dollar Amount

A $40,000 withdrawal today will not have the same purchasing power several decades from now.

If the first withdrawal is $40,000 and inflation is 3%, the simplified inflation-adjusted withdrawals would look like this:

| Year | Withdrawal |
|---:|---:|
| 1 | $40,000 |
| 5 | $45,020 |
| 10 | $52,195 |
| 20 | $69,071 |
| 30 | $94,013 |

These figures illustrate the effect of compounding inflation. They are not forecasts of actual future inflation.

The calculator uses the inflation rate you enter, so changing the assumption can materially change the final withdrawal.

## Why Different Calculators Give Different Answers

It is common to enter the same portfolio into several retirement calculators and get different results.

That is not necessarily an error.

For example, one calculator may use a fixed annual return. Another may run thousands of simulated market paths. Another may test historical market periods. Another may include Social Security, taxes, fees, or changing spending.

A Reddit discussion about retirement calculators showed exactly this problem: users reported materially different success probabilities from different tools because the underlying models and assumptions were different. [4]

The useful question is therefore not simply **"Which calculator is right?"**

Ask:

**"What assumptions and model does each calculator use?"**

This calculator is intentionally transparent about its core model: portfolio value, withdrawal rate, inflation, expected return, and retirement period.

## Fixed Returns vs. Real Market Returns

This calculator is useful for understanding the mechanics of a withdrawal strategy, but it is not a historical backtest or Monte Carlo simulator.

If you enter:

- Portfolio: $1,000,000
- Withdrawal rate: 4%
- Inflation: 3%
- Expected return: 6%
- Retirement period: 30 years

the calculator uses those assumptions throughout the projection.

Real markets do not behave that smoothly.

You can have several strong years followed by a major decline, or several weak years followed by strong returns. The order matters when withdrawals are being taken from the portfolio.

This is why a projected ending balance should not be interpreted as the amount you will actually have at the end of retirement.

## Taxes Are Not Included in the Withdrawal Amount

A portfolio withdrawal and retirement spending are not always the same thing.

For example, withdrawing $50,000 from a tax-deferred retirement account does not necessarily leave you with $50,000 available to spend.

Your actual tax treatment can depend on:

- Account type
- Country
- State or province
- Other income
- Tax filing status
- Capital gains
- Required distributions
- Local tax rules

The calculator focuses on the portfolio withdrawal itself.

If you need an after-tax retirement-income estimate, combine the result with the appropriate tax calculations for your situation.

## The 4% Rule Outside the United States

The historical 4% research is primarily based on U.S. market data.

That does not make the underlying withdrawal mathematics useless elsewhere, but it does mean you should be careful about treating the historical result as a universal international rule.

A retiree in Canada, the UK, Australia, India, Pakistan, Singapore, or another country may face different:

- Inflation
- Investment returns
- Tax rates
- Retirement accounts
- Social benefits
- Currency movements
- Investment products

The calculator can still help you model the mathematics using your own assumptions, but the historical U.S. evidence should be viewed in context.

## Real-Life Examples

### Example 1: Traditional 4% Scenario

| Input | Value |
|---|---:|
| Portfolio Value | $1,000,000 |
| Withdrawal Rate | 4% |
| Inflation Rate | 3% |
| Expected Return | 6% |
| Retirement Period | 30 years |
| First-Year Withdrawal | $40,000 |

This represents the classic type of scenario people usually have in mind when they talk about the 4% rule.

It does not mean that $40,000 is guaranteed for 30 years.

### Example 2: Longer FIRE Retirement

| Input | Value |
|---|---:|
| Portfolio Value | $1,000,000 |
| Withdrawal Rate | 4% |
| Inflation Rate | 3% |
| Expected Return | 6% |
| Retirement Period | 50 years |
| First-Year Withdrawal | $40,000 |

The first-year withdrawal is unchanged because the portfolio and withdrawal rate are unchanged.

What changes is the length of time the portfolio must support withdrawals.

This is particularly relevant to FIRE planning, where retirement can begin decades earlier than traditional retirement.

### Example 3: Lower Withdrawal Rate

| Input | Value |
|---|---:|
| Portfolio Value | $750,000 |
| Withdrawal Rate | 3.5% |
| Inflation Rate | 2.5% |
| Expected Return | 6% |
| Retirement Period | 35 years |
| First-Year Withdrawal | $26,250 |

A lower withdrawal rate means less initial income, but it also changes the amount being removed from the portfolio.

The calculator lets you compare these scenarios rather than assuming that one percentage works for everyone.

## How to Use the Calculator for Scenario Testing

Instead of running the calculator once and treating the result as your retirement number, save several scenarios.

For example:

**Scenario 1:** 4% withdrawal, 30 years

**Scenario 2:** 3.5% withdrawal, 40 years

**Scenario 3:** 3% withdrawal, 50 years

Then compare the projected ending balances and withdrawal amounts.

You can name calculation setups, use the comparison inputs, and keep your calculation history for later review.

The charts also make it easier to see whether the projected portfolio is gradually declining, remaining relatively stable, or ending with a larger balance under a particular set of assumptions.

## Who Is This Calculator For?

This calculator can be useful if you are:

- Planning for traditional retirement
- Working toward FIRE
- Considering an early retirement
- Checking how long a portfolio might support withdrawals
- Comparing 3%, 3.5%, 4%, or 5% starting rates
- Testing different inflation assumptions
- Testing different expected returns
- Comparing 30-, 40-, and 50-year retirement periods
- Trying to understand why different retirement calculators produce different answers
- Reviewing an existing withdrawal strategy

It is most useful as a **scenario-planning tool**.

It should not be treated as a guarantee that a portfolio will last for a specific number of years.

## Common Questions About the 4% Rule

### What exactly is the 4% rule?

The traditional approach starts with 4% of the initial retirement portfolio and then increases the dollar withdrawal for inflation each year.

It is associated with William Bengen's historical research and is generally discussed around a 30-year retirement period. [1]

### Does 4% mean I can withdraw 4% of my balance every year?

No.

The traditional approach does not recalculate 4% from the current portfolio balance every year. It starts with 4% of the original portfolio and then adjusts the dollar withdrawal for inflation.

### Is 4% still safe in 2026?

There is no universally safe rate.

Morningstar's latest research estimates 3.9% as its base-case starting rate for a 30-year retirement with a 90% probability of success under its stated assumptions. That is a research estimate, not a universal rule for every retiree. [2]

### Does the 4% rule work for 50 years?

The classic research was based around 30-year periods. A 50-year retirement is a substantially longer planning horizon and should be modeled separately.

### What if I retire at 35?

A 35-year-old retiree may need the portfolio to support withdrawals for much longer than 30 years.

That makes the retirement-period input particularly important. Do not assume that a traditional 30-year result automatically applies to a FIRE retirement lasting 50 or 60 years.

### What happens during a market crash?

The traditional inflation-adjusted withdrawal does not automatically fall when the portfolio falls.

That can make early market losses especially important because withdrawals continue while the portfolio is smaller.

### Does this calculator perform Monte Carlo simulations?

No.

It uses the return, inflation, withdrawal rate, and retirement period that you enter to produce a deterministic projection. It does not generate thousands of random market-return sequences.

### Why doesn't the calculator tell me my probability of success?

A probability of success requires a different type of model, such as historical sequence testing or Monte Carlo simulation.

This calculator instead shows what happens under the specific assumptions you enter.

### Does it include Social Security or pension income?

No. The core calculation projects withdrawals from the portfolio.

If you receive Social Security, a pension, rental income, or another reliable income source, you can account for that separately when determining how much of your spending must come from investments.

### Does it include taxes?

No. The displayed withdrawal is a portfolio withdrawal, not an after-tax spending amount.

### Can I export my calculations?

Yes. The calculator includes calculation history with CSV and Excel export options.

### Can I compare different retirement scenarios?

Yes. You can save and name calculation setups and change the major assumptions to compare different scenarios.

### Is the ending balance guaranteed?

No.

The ending balance is the result of the assumptions entered into the calculator. Actual investment returns and inflation will vary, and the sequence of those returns can materially affect retirement outcomes.

## Research & References

[1] William Bengen, "Determining Withdrawal Rates Using Historical Data," 1994. Bengen's research is the historical foundation commonly associated with the 4% rule and examined historical U.S. market and inflation data over retirement periods. 

[2] Morningstar, "Morningstar's Retirement-Income Research: Finding Your Safe Withdrawal Rate," February 18, 2026. Morningstar's latest research estimates a 3.9% starting withdrawal rate under its stated assumptions for a 30-year retirement and 90% probability of success. 

[3] Morningstar, "What's a Safe Withdrawal Rate After You've Already Retired?", 2026. The research demonstrates that the modeled starting rate changes as the retirement horizon becomes shorter or longer. 

[4] Retirement calculator discussions and user reports comparing different tools show that calculators can produce different results because they use different assumptions, horizons, and simulation methods.

[5] Morningstar's retirement-income research also highlights sequence-of-returns risk, particularly the effect of poor returns during the first five years of retirement.

## Important Limitation

This calculator is designed to help you understand retirement withdrawal scenarios.

It does not predict future investment returns, guarantee portfolio longevity, simulate every possible market sequence, calculate personal taxes, or determine the withdrawal rate that is appropriate for your individual circumstances.
Use the assumptions as scenarios to compare, not as promises about what will happen.

---