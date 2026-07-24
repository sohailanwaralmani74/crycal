import os
import re
from generate_all_35 import get_related_grid, base_dir

finance_pages = [
    {
        "filename": "growth.md",
        "category": "growth",
        "shortName": "Growth",
        "title": "Growth & Savings Calculators: Interest & Wealth",
        "description": "Calculate compound interest, savings goals, dollar-cost averaging, APY vs APR, and dividend reinvestment to project wealth growth.",
        "h1": "Growth — Savings &amp; Investment Growth Calculators",
        "hero_p": "Focused on how money grows over time — compounding, contribution frequency, dividend reinvestment, and dollar-cost averaging. Explore eight powerful calculators designed to project savings milestones, compare APY returns, and model long-term investment acceleration.",
        "overview_h2": "Understanding Long-Term Wealth Accumulation",
        "overview_text": """
<p>
  Compounding is the fundamental engine of personal wealth creation, yet its exponential nature is notoriously difficult to calculate intuitively. Small adjustments in interest rates, contribution frequency, or time horizons compound into massive differences in final portfolio values over multi-decade periods. The Growth category equips investors, savers, and financial planners with precision modeling tools to demystify compound accumulation and strategic asset building.
</p>
<p>
  Our suite addresses both forward-looking projections and target-driven goal setting. The <strong>Compound Interest Calculator</strong> allows you to model daily, monthly, or annual compounding alongside flexible deposit schedules. Conversely, the <strong>Savings Goal Calculator</strong> works backward from a desired lump-sum target to specify exact monthly contribution thresholds required over your chosen timeframe.
</p>
<p>
  Additionally, specialized growth tools address specific strategic allocation scenarios. The <strong>Dividend Reinvestment (DRIP) Calculator</strong> quantifies how compounding cash payouts accelerates share accumulation, while the <strong>Dollar-Cost Averaging Calculator</strong> demonstrates the volatility-smoothing benefits of periodic investing compared to lump-sum market timing.
</p>""",
        "benchmarks_h2": "Growth & Savings Key Industry Benchmarks",
        "benchmarks_text": """
<p>
  Evaluating savings performance requires comparing your growth rate against historical benchmark returns and economic baseline figures:
</p>
<ul>
  <li><strong>Historical Stock Market Returns:</strong> The S&amp;P 500 has historically delivered an average annualized return of approximately 10% before adjusting for inflation, or ~7% real return.</li>
  <li><strong>High-Yield Savings Accounts (HYSA):</strong> Competitive HYSA interest rates typically yield 4.0% to 5.25% APY, compared to national traditional bank averages of 0.45%.</li>
  <li><strong>The Rule of 72 Benchmark:</strong> A classic mental math formula where dividing 72 by your annual interest rate yields the exact number of years required to double your principal investment.</li>
  <li><strong>Dollar-Cost Averaging Efficiency:</strong> Historical market data demonstrates that dollar-cost averaging outperforms cash holding in 90%+ of rolling 5-year market windows.</li>
</ul>""",
        "guide_h2": "Practical Step-by-Step Guide to Growth Modeling",
        "guide_text": """
<p>
  Follow this systematic framework to model and optimize your wealth accumulation strategy:
</p>
<ol>
  <li><strong>Define Your Target Horizon:</strong> Establish clear timelines for your financial goals, distinguishing short-term savings (1–3 years) from long-term compounding (10+ years).</li>
  <li><strong>Input Baseline Principal and Contributions:</strong> Enter your starting capital and determine a sustainable monthly or annual savings rate that fits your cash flow.</li>
  <li><strong>Select Realistic Interest &amp; Return Assumptions:</strong> Use conservative rate estimates based on historical asset class benchmarks rather than peak market cycles.</li>
  <li><strong>Factor in Inflation &amp; Taxes:</strong> Adjust expected gross returns for purchasing power erosion (typically 2.5%–3.0% annual inflation) and tax-advantaged account structures.</li>
  <li><strong>Automate Reinvestment Schedules:</strong> Enable automatic dividend reinvestment (DRIP) and recurring bank transfers to eliminate behavioral friction.</li>
</ol>""",
        "faqs": [
            ("What is the difference between APY and APR in growth calculations?",
             "APR (Annual Percentage Rate) reflects simple interest without accounting for compounding within the year. APY (Annual Percentage Yield) includes the effect of interest compounding over monthly, daily, or quarterly periods, reflecting your true annual return."),
            ("How does contribution frequency impact total compound growth?",
             "Higher contribution frequency (e.g., bi-weekly or monthly vs. annual deposits) puts capital to work sooner. This extra time allows compound interest to generate returns on reinvested funds earlier, producing higher overall wealth."),
            ("Why is dollar-cost averaging preferred over lump-sum investing for risk management?",
             "Dollar-cost averaging spreads purchases across regular intervals, ensuring you buy more shares when prices drop and fewer when prices rise. This reduces portfolio volatility and eliminates the psychological risk of bad market timing.")
        ]
    },
    {
        "filename": "mortgage.md",
        "category": "mortgage",
        "shortName": "Mortgage",
        "title": "Mortgage Calculators: Payments, Rates & Payoff",
        "description": "Calculate monthly mortgage payments, home affordability, rent vs buy comparisons, cash-out refinancing, and extra principal payoff schedules.",
        "h1": "Mortgage — Home Buying &amp; Homeowner Calculators",
        "hero_p": "Focused on the largest financial commitment most households undertake — monthly principal, interest, taxes, insurance (PITI), refinancing break-even points, and early loan payoff strategies. Explore five essential calculators covering every stage of homeownership.",
        "overview_h2": "Mastering Real Estate & Mortgage Financial Planning",
        "overview_text": """
<p>
  A home purchase represents a multi-decade financial trajectory where small changes in interest rates, down payments, or loan terms translate to tens of thousands of dollars in long-term borrowing costs. Navigating mortgage financing requires clear visibility into full monthly PITI obligations, amortization schedules, equity building, and refinancing thresholds.
</p>
<p>
  Our <strong>Mortgage Calculator</strong> forms the cornerstone of real estate planning, providing detailed monthly breakdowns of principal, interest, property taxes, home insurance, and private mortgage insurance (PMI). To evaluate entry into the housing market, the <strong>Rent vs. Buy Calculator</strong> compares long-term wealth outcomes by factoring in home appreciation, maintenance costs, closing fees, and alternative investment returns.
</p>
<p>
  For active buyers, the <strong>Home Affordability Calculator</strong> applies front-end and back-end debt-to-income (DTI) ratios used by underwriters to establish maximum safe borrowing limits. Existing homeowners can utilize the <strong>Refinance Calculator</strong> and <strong>Mortgage Payoff Calculator</strong> to calculate exact break-even periods and evaluate the interest savings of extra monthly principal payments.
</p>""",
        "benchmarks_h2": "Mortgage & Housing Industry Benchmarks",
        "benchmarks_text": """
<p>
  Underwriting standards and housing financial benchmarks establish essential guardrails for buyers and homeowners:
</p>
<ul>
  <li><strong>28/36 Rule for Debt Ratios:</strong> Standard lender guidelines mandate spending no more than 28% of gross monthly income on housing costs (front-end DTI) and 36% on total debt obligations (back-end DTI).</li>
  <li><strong>PMI Removal Threshold:</strong> Private Mortgage Insurance (PMI) is required on conventional loans with down payments under 20% and can be removed once loan-to-value (LTV) reaches 80%.</li>
  <li><strong>Refinance Break-Even Window:</strong> Refinancing closing costs typically equal 2% to 5% of the loan amount; a successful refinance should recoup these fees within 24 to 36 months via lower monthly payments.</li>
  <li><strong>Amortization Front-Loading:</strong> On a standard 30-year fixed mortgage, over 65% of monthly payments go toward interest rather than principal during the first seven years.</li>
</ul>""",
        "guide_h2": "Practical Guide to Optimizing Your Mortgage Strategy",
        "guide_text": """
<p>
  Follow these structured steps to evaluate housing affordability and structure optimal home financing:
</p>
<ol>
  <li><strong>Audit Income and Existing Debt:</strong> Calculate your exact gross monthly income and monthly recurring debt obligations to establish baseline qualifying ratios.</li>
  <li><strong>Determine Down Payment &amp; Cash Reserves:</strong> Calculate available down payment funds while preserving a 3-to-6-month emergency cash reserve separate from closing costs.</li>
  <li><strong>Model Comprehensive PITI Payments:</strong> Estimate localized property tax rates, homeowner insurance quotes, and HOA fees to determine true total housing costs.</li>
  <li><strong>Compare Loan Terms (15-Yr vs 30-Yr):</strong> Weigh the lower interest rates and rapid equity of a 15-year loan against the cash-flow flexibility of a 30-year term.</li>
  <li><strong>Evaluate Extra Principal Acceleration:</strong> Calculate how making one extra payment per year or rounding up monthly payments drastically shortens the loan term.</li>
</ol>""",
        "faqs": [
            ("How do extra principal payments affect my mortgage amortization schedule?",
             "Extra principal payments directly reduce the remaining loan balance without changing monthly due amounts. Because interest is calculated on the principal, reducing the balance shrinks overall interest charges and cuts years off your loan term."),
            ("What is the difference between an ARM and a Fixed-Rate Mortgage?",
             "A fixed-rate mortgage maintains the exact same interest rate and payment for the entire loan life. An adjustable-rate mortgage (ARM) offers a fixed lower rate for an initial period (e.g., 5 or 7 years), after which the rate adjusts periodically based on market indexes."),
            ("When does refinancing a mortgage make financial sense?",
             "Refinancing makes sense if you can secure an interest rate at least 0.75% to 1% lower than your current rate, shorten your term, or remove PMI, provided you plan to stay in the home long enough to pass the cost break-even point.")
        ]
    },
    {
        "filename": "debt.md",
        "category": "debt",
        "shortName": "Debt",
        "title": "Debt & Loan Calculators: Payoff & Consolidation",
        "description": "Eliminate debt with avalanche and snowball calculators, credit card payoff schedules, loan consolidation, and DTI ratio estimators.",
        "h1": "Debt — Loan Elimination &amp; Consolidation Calculators",
        "hero_p": "Focused on accelerating debt freedom — comparing high-interest avalanche payoff against psychological snowball momentum, credit card consolidation, amortization schedules, and debt-to-income optimization. Utilize our five specialized calculators to take control of liabilities.",
        "overview_h2": "Strategic Debt Reduction & Loan Optimization",
        "overview_text": """
<p>
  Managing and eliminating consumer debt is one of the most high-return financial moves a household can make. High-interest credit cards, personal loans, and auto debt consume disposable cash flow and drag down overall net worth accumulation. Designing an aggressive debt elimination strategy requires clear visual modeling of interest accumulation, payment ordering, and consolidation potential.
</p>
<p>
  Our <strong>Debt Avalanche &amp; Debt Snowball Calculators</strong> compare the two primary debt payoff methodologies side by side. The Debt Avalanche method prioritizes balances with the highest interest rates to mathematically minimize total interest paid, while the Debt Snowball method targets the smallest balance first to build immediate behavioral momentum.
</p>
<p>
  For credit card balances, the <strong>Credit Card Payoff Calculator</strong> demonstrates the compounding cost of making only minimum payments compared to fixed monthly payoff targets. Additionally, the <strong>Debt Consolidation Calculator</strong> evaluates whether grouping multiple high-rate loans into a single lower-rate instrument actually saves money after accounting for balance transfer and origination fees.
</p>""",
        "benchmarks_h2": "Debt & Credit Health Benchmarks",
        "benchmarks_text": """
<p>
  Monitor these key credit metrics and financial benchmarks to maintain healthy debt ratios:
</p>
<ul>
  <li><strong>Debt-to-Income (DTI) Benchmark:</strong> A healthy DTI ratio is 20% or lower; lenders consider DTI above 36% risky, and 43% is typically the maximum limit for qualified mortgages.</li>
  <li><strong>Credit Utilization Rate:</strong> Keeping revolving credit balances under 30% of total limits (ideally below 10%) protects your credit score from utilization penalties.</li>
  <li><strong>Minimum Payment Trap:</strong> Paying only credit card minimum payments (typically 1% to 2% of balance plus interest) can extend a $5,000 debt payoff term beyond 20 years.</li>
  <li><strong>Consolidation Interest Threshold:</strong> Consolidation loans are effective primarily when the new APR is at least 3% to 5% lower than the weighted average interest rate of original debts.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Framework for Eliminating Debt",
        "guide_text": """
<p>
  Follow this structured step-by-step roadmap to eliminate debt efficiently and permanently:
</p>
<ol>
  <li><strong>Compile Complete Debt Inventory:</strong> List all outstanding balances, minimum monthly payments, and current interest rates (APRs) across all accounts.</li>
  <li><strong>Establish Emergency Starter Buffer:</strong> Secure a small cash buffer ($1,000 to $2,000) before initiating aggressive debt payoff to prevent turning to credit cards for unexpected costs.</li>
  <li><strong>Choose Your Strategy (Avalanche vs. Snowball):</strong> Select the mathematical efficiency of the Avalanche method or the psychological wins of the Snowball method based on your personal discipline.</li>
  <li><strong>Redirect Excess Cash Flow:</strong> Allocate all surplus monthly funds toward your top-priority debt while continuing minimum payments on all other accounts.</li>
  <li><strong>Automate Payoff Rollovers:</strong> As each balance reaches zero, immediately roll its entire payment amount into the next target debt to maintain payoff velocity.</li>
</ol>""",
        "faqs": [
            ("Which is mathematically better: Debt Avalanche or Debt Snowball?",
             "The Debt Avalanche method is mathematically optimal because targeting the highest APR debts first minimizes total interest paid over time. However, the Debt Snowball method provides quick emotional victories that help many individuals stick to their plan."),
            ("How does debt consolidation affect my credit score?",
             "Initially, opening a consolidation loan may cause a minor temporary credit dip due to a hard inquiry and a new account. However, paying off credit cards lowers your credit utilization ratio, which rapidly boosts credit scores."),
            ("What is the difference between debt consolidation and debt settlement?",
             "Debt consolidation pays off existing accounts in full using a new single low-rate loan, preserving credit standing. Debt settlement involves negotiating with creditors to settle debts for less than owed, which severely damages credit scores.")
        ]
    },
    {
        "filename": "tax.md",
        "category": "tax",
        "shortName": "Tax",
        "title": "Tax Calculators: Income, Brackets & Payroll",
        "description": "Estimate federal tax brackets, self-employment tax, 1099 liabilities, capital gains, take-home pay, state comparisons, and estate taxes.",
        "h1": "Tax — Federal, State &amp; Income Tax Calculators",
        "hero_p": "Focused on tax planning, withholding accuracy, self-employment liabilities, and capital gains optimization. Utilize our five specialized tax calculators to forecast federal tax brackets, estimate 1099 quarterly taxes, analyze payroll take-home pay, and model tax strategy.",
        "overview_h2": "Comprehensive Income & Capital Gains Tax Planning",
        "overview_text": """
<p>
  Tax planning is an essential component of financial management, influencing everything from monthly take-home pay to net investment yields and business profitability. Understanding progressive tax brackets, standard versus itemized deductions, self-employment tax obligations, and short- vs long-term capital gains rates allows individuals and business owners to minimize tax drag legally and accurately.
</p>
<p>
  Our <strong>Federal Income Tax Bracket Calculator</strong> breaks down tax rates across income tiers, calculating effective tax rates vs marginal tax rates. For W-2 employees, the <strong>Take-Home Pay Calculator</strong> models paycheck deductions for federal, state, FICA (Social Security &amp; Medicare), and pre-tax benefit contributions.
</p>
<p>
  Independent contractors, freelancers, and small business owners can utilize the <strong>1099 Self-Employment Tax Calculator</strong> to compute SE tax (15.3%) and forecast quarterly estimated tax payments. Investors can leverage the <strong>Capital Gains Tax Calculator</strong> to plan asset sales and take advantage of preferential long-term capital gains tax rates.
</p>""",
        "benchmarks_h2": "Key Tax Rates & Baseline Benchmarks",
        "benchmarks_text": """
<p>
  Keep these fundamental tax metrics and statutory benchmarks in mind during tax modeling:
</p>
<ul>
  <li><strong>Marginal vs. Effective Tax Rate:</strong> Your marginal tax rate is the rate paid on your top dollar of income; effective tax rate is the total tax divided by total taxable income.</li>
  <li><strong>FICA &amp; Self-Employment Tax Rate:</strong> FICA tax totals 15.3% (12.4% Social Security up to the wage base cap plus 2.9% Medicare). Employees split this 50/50 with employers, while 1099 contractors pay the full 15.3%.</li>
  <li><strong>Long-Term Capital Gains Tiers:</strong> Capital gains on assets held over 1 year qualify for preferential tax tiers of 0%, 15%, or 20% depending on taxable income thresholds.</li>
  <li><strong>Safe Harbor Rule for Estimated Taxes:</strong> Avoid quarterly penalty fees by paying at least 90% of current year tax liability or 100% (110% for higher earners) of prior year tax liability.</li>
</ul>""",
        "guide_h2": "Practical Guide to Tax Planning and Withholding",
        "guide_text": """
<p>
  Follow this step-by-step strategy to optimize your tax position and avoid unexpected tax bills:
</p>
<ol>
  <li><strong>Calculate Gross Taxable Income:</strong> Aggregate all income streams including W-2 wages, 1099 freelance earnings, dividends, capital gains, and interest.</li>
  <li><strong>Maximize Pre-Tax Contributions:</strong> Reduce adjusted gross income (AGI) by maximizing 401(k), Traditional IRA, HSA, and pre-tax healthcare options.</li>
  <li><strong>Evaluate Standard vs. Itemized Deductions:</strong> Compare the statutory standard deduction against itemized deductions (mortgage interest, state taxes up to SALT caps, charitable gifts).</li>
  <li><strong>Forecast Quarterly Payments (For 1099/Self-Employed):</strong> Calculate estimated quarterly taxes using 15.3% self-employment tax plus federal and state income tax projections.</li>
  <li><strong>Review W-4 Allowances Annually:</strong> Adjust W-4 withholding allowances following major life events (marriage, children, new job) to prevent underwithholding or massive overpayment.</li>
</ol>""",
        "faqs": [
            ("What is the difference between marginal tax rate and effective tax rate?",
             "Your marginal tax rate is the highest tax bracket applied to your top dollar of income. Your effective tax rate is the actual percentage of total income paid in taxes after accounting for lower tax brackets, deductions, and credits."),
            ("How does self-employment tax work for 1099 contractors?",
             "Self-employed individuals pay Self-Employment (SE) tax of 15.3% to cover Social Security and Medicare. However, they can deduct half of their SE tax (7.65%) from their gross income on federal tax returns."),
            ("How are short-term capital gains taxed compared to long-term capital gains?",
             "Short-term capital gains (assets held 1 year or less) are taxed at ordinary income rates (up to 37%). Long-term capital gains (held longer than 1 year) receive lower rates of 0%, 15%, or 20%.")
        ]
    },
    {
        "filename": "budgeting.md",
        "category": "budgeting",
        "shortName": "Budgeting",
        "title": "Budgeting Calculators: Cash Flow & Net Worth",
        "description": "Manage household cash flow with 50/30/20 budgeting, net worth tracking, emergency fund sizing, hourly-to-salary, and expense splits.",
        "h1": "Budgeting — Household Cash Flow &amp; Expense Calculators",
        "hero_p": "Focused on mastering personal cash flow, emergency financial reserves, household expense sharing, and net worth growth. Utilize our five specialized budgeting calculators to create structured monthly spending plans and build financial stability.",
        "overview_h2": "Structured Household Budgeting & Wealth Tracking",
        "overview_text": """
<p>
  Budgeting provides the structural foundation for all personal financial success. Without clear tracking of monthly gross income, fixed overhead, variable discretionary spending, and net savings rates, it is impossible to optimize long-term wealth building or debt elimination. A proactive budget converts income into intentional financial progress.
</p>
<p>
  Our <strong>50/30/20 Budget Calculator</strong> implements the popular allocation framework, dividing net income into 50% Needs (housing, utilities, food), 30% Wants (entertainment, hobbies), and 20% Financial Goals (savings, debt payoff, investments). For wage earners, the <strong>Hourly to Salary Calculator</strong> converts hourly rates, overtime hours, and pay periods into clear gross and net annualized compensation.
</p>
<p>
  To protect against economic uncertainty, the <strong>Emergency Fund Calculator</strong> computes ideal 3-to-6-month cash reserve targets based on essential monthly expenses. Additionally, our <strong>Net Worth Calculator</strong> aggregates total personal assets against liabilities to track overall financial health over time.
</p>""",
        "benchmarks_h2": "Essential Budgeting Benchmarks & Metrics",
        "benchmarks_text": """
<p>
  Track these widely accepted financial planning benchmarks to gauge cash flow health:
</p>
<ul>
  <li><strong>50/30/20 Rule Guideline:</strong> Allocate up to 50% of take-home pay for essential needs, 30% for discretionary wants, and a minimum of 20% toward savings and debt elimination.</li>
  <li><strong>Emergency Reserve Benchmark:</strong> Maintain 3 months of essential living expenses for dual-income households, and 6 months of expenses for single-income or variable 1099 earners.</li>
  <li><strong>Savings Rate Benchmark:</strong> A baseline healthy personal savings rate is 15% to 20% of gross annual income; early retirement (FIRE) plans target 50%+ savings rates.</li>
  <li><strong>Housing Expense Ceiling:</strong> Keep total housing expenses (rent or mortgage, utilities, insurance) under 30% of gross monthly income to avoid being house poor.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Guide to Building a Budget",
        "guide_text": """
<p>
  Follow these five practical steps to establish an intentional spending and savings routine:
</p>
<ol>
  <li><strong>Calculate Net Monthly Take-Home Pay:</strong> Determine total net monthly income after taxes, healthcare deductions, and mandatory retirement contributions.</li>
  <li><strong>Audit Fixed Monthly Overhead:</strong> Categorize non-negotiable living costs including rent/mortgage, utilities, insurance, minimum debt payments, and basic groceries.</li>
  <li><strong>Set Target Savings &amp; Investment Contributions:</strong> Automate transfers of at least 20% of net income to savings goals and investment accounts before spending.</li>
  <li><strong>Allocate Discretionary Wants Pool:</strong> Establish clear monthly spending caps for dining out, subscriptions, recreation, and personal shopping.</li>
  <li><strong>Track Net Worth Quarterly:</strong> Update total assets (bank balances, investments, property equity) minus liabilities (loans, credit card debt) every 90 days.</li>
</ol>""",
        "faqs": [
            ("What is the 50/30/20 budget rule and how does it work?",
             "The 50/30/20 rule is a simple budgeting framework that splits take-home income into three categories: 50% for essential needs (housing, groceries, utilities), 30% for lifestyle wants (dining out, entertainment), and 20% for financial goals (savings, debt payoff)."),
            ("How many months of living expenses should be in an emergency fund?",
             "Financial experts generally recommend saving 3 to 6 months of essential living expenses. Dual-income families with stable jobs can aim for 3 months, while freelancers, single earners, or those with high commission income should maintain 6 months or more."),
            ("How do I convert an hourly wage into an annual salary?",
             "Multiply your hourly rate by the number of hours worked per week (typically 40), then multiply by 52 weeks per year. For example, $25 per hour × 40 hours × 52 weeks equals an annual gross salary of $52,000.")
        ]
    },
    {
        "filename": "insurance.md",
        "category": "insurance",
        "shortName": "Insurance",
        "title": "Insurance Calculators: Coverage & Premium Estimators",
        "description": "Calculate term life insurance needs, disability coverage, homeowners insurance, auto premiums, umbrella protection, and deductibles.",
        "h1": "Insurance — Policy Coverage &amp; Premium Calculators",
        "hero_p": "Focused on protecting assets, managing catastrophic risks, and structuring policy coverage — term life income replacement, disability income protection, homeowners insurance, and umbrella liability limits. Utilize our five specialized calculators to evaluate insurance policies.",
        "overview_h2": "Risk Management & Insurance Coverage Planning",
        "overview_text": """
<p>
  Insurance is a fundamental pillar of personal financial security, acting as a defensive barrier that prevents unexpected health crises, property loss, or liability lawsuits from derailing your long-term wealth building. Choosing optimal coverage levels requires balancing premium affordability against financial exposure to ensure comprehensive risk protection.
</p>
<p>
  Our <strong>Life Insurance Needs Calculator</strong> uses the DIME method (Debt, Income replacement, Mortgage payoff, Education expenses) to determine exact term life policy face values required to protect your family. The <strong>Disability Insurance Calculator</strong> estimates income replacement coverage needed to protect your earning capacity during extended illness or injury.
</p>
<p>
  For property and asset protection, the <strong>Homeowners &amp; Renters Insurance Calculator</strong> evaluates dwelling replacement costs and personal property limits. Additionally, our <strong>Insurance Deductible Break-Even Calculator</strong> helps policyholders determine whether raising deductibles to lower annual premiums yields net financial savings.
</p>""",
        "benchmarks_h2": "Insurance Coverage Industry Benchmarks",
        "benchmarks_text": """
<p>
  Use these established industry benchmarks to evaluate your current insurance coverage:
</p>
<ul>
  <li><strong>Life Insurance Multiple Benchmark:</strong> Maintain term life coverage equal to 10 to 12 times gross annual income, plus outstanding mortgage balances and college savings goals.</li>
  <li><strong>Disability Income Target:</strong> Secure long-term disability coverage that replaces 60% to 70% of gross income (which is typically tax-free if paid with post-tax dollars).</li>
  <li><strong>Umbrella Liability Benchmark:</strong> Obtain an umbrella liability policy equal to your total liquid net worth plus 5 years of future income (typically starting at $1 million).</li>
  <li><strong>Deductible Break-Even Window:</strong> Raising a deductible should yield premium savings that cover the higher out-of-pocket risk within 3 to 4 years of clean claims history.</li>
</ul>""",
        "guide_h2": "Practical Step-by-Step Guide to Policy Audit",
        "guide_text": """
<p>
  Follow this step-by-step risk management checklist to audit and optimize your insurance portfolio:
</p>
<ol>
  <li><strong>Calculate Life Insurance Exposure:</strong> Sum outstanding debt, remaining mortgage balance, projected college costs, and 10 years of income replacement.</li>
  <li><strong>Verify Income Protection Coverage:</strong> Audit employer-provided group short-term and long-term disability policies to identify potential income gaps.</li>
  <li><strong>Audit Home Dwelling Replacement Cost:</strong> Ensure homeowners policies reflect current local construction square-foot replacement costs rather than real estate market value.</li>
  <li><strong>Evaluate Umbrella Liability Needs:</strong> Assess personal asset liability exposure and add low-cost excess liability umbrella coverage if net worth exceeds base policy caps.</li>
  <li><strong>Optimize Premium Deductibles:</strong> Calculate break-even periods for higher deductibles across auto and home policies while maintaining dedicated cash emergency reserves.</li>
</ol>""",
        "faqs": [
            ("How much life insurance coverage do I actually need?",
             "A common benchmark is 10 to 12 times your gross annual income. A more precise calculation uses the DIME formula: sum your total Debt, Income replacement needs, outstanding Mortgage, and future Education costs for dependents."),
            ("What is the main difference between Term Life and Whole Life insurance?",
             "Term Life provides pure death benefit protection for a fixed period (e.g., 10, 20, or 30 years) at low cost. Whole Life is permanent insurance with a cash value savings component, but features significantly higher premiums for equivalent coverage."),
            ("Why is an umbrella insurance policy recommended for high net worth households?",
             "Umbrella insurance provides excess liability coverage above standard auto and home policy limits. It protects assets and future earnings against catastrophic lawsuits or severe auto accident liability claims.")
        ]
    },
    {
        "filename": "investing.md",
        "category": "investing",
        "shortName": "Investing",
        "title": "Investing Calculators: Risk, Returns & Portfolio",
        "description": "Evaluate risk-reward ratios, stock position sizing, Kelly criterion, options profit, crypto leverage, margin requirements, and YTM.",
        "h1": "Investing — Portfolio &amp; Trading Risk Calculators",
        "hero_p": "Focused on intelligent risk management, trade execution, portfolio asset allocation, options profit modeling, and fixed-income yields. Utilize our five specialized investing calculators to optimize risk-reward ratios, calculate position sizing, and manage market exposure.",
        "overview_h2": "Portfolio Strategy & Investment Risk Management",
        "overview_text": """
<p>
  Successful long-term investing depends far more on disciplined risk management, position sizing, and strategic asset allocation than on speculative stock picking. Whether managing a long-term retirement index portfolio, trading options strategies, or evaluating bond yield-to-maturity, calculating exact risk parameters before entering positions is essential to protect capital.
</p>
<p>
  Our <strong>Stock Position Size &amp; Risk Calculator</strong> helps investors determine exact share counts to buy based on portfolio account size, entry price, and stop-loss levels, ensuring no single trade risks more than a predetermined percentage of capital (e.g., 1% or 2%). The <strong>Risk/Reward Ratio Calculator</strong> evaluates trade asymmetry before execution to ensure upside targets outweigh downside risk.
</p>
<p>
  For advanced traders, the <strong>Kelly Criterion Calculator</strong> computes mathematically optimal allocation percentages based on historical win rates and win/loss ratios. Furthermore, specialized tools like the <strong>Options Profit Calculator</strong> and <strong>Bond Yield-to-Maturity (YTM) Calculator</strong> deliver precision analysis across equity derivatives and fixed-income assets.
</p>""",
        "benchmarks_h2": "Core Investment Benchmarks & Risk Metrics",
        "benchmarks_text": """
<p>
  Monitor these standard portfolio risk metrics and institutional trading benchmarks:
</p>
<ul>
  <li><strong>1% Risk Rule per Trade:</strong> Institutional risk managers limit capital loss exposure on any single trade to no more than 1% of total portfolio value.</li>
  <li><strong>Minimum Risk-to-Reward Ratio:</strong> Target trade setups with a minimum 1:2 or 1:3 risk-to-reward ratio, ensuring profitability even with a 40% win rate.</li>
  <li><strong>Fractional Kelly Allocation:</strong> Experienced investors apply half-Kelly (50%) or quarter-Kelly (25%) sizing to prevent extreme volatility and drawdown risk.</li>
  <li><strong>Portfolio Rebalancing Trigger:</strong> Rebalance asset allocation back to target weights whenever asset classes drift more than 5% from target thresholds.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Investing Execution Guide",
        "guide_text": """
<p>
  Follow this structured step-by-step risk protocol before entering any investment position:
</p>
<ol>
  <li><strong>Define Maximum Account Risk:</strong> Decide on a strict account risk percentage per trade (e.g., 1% of total portfolio capital).</li>
  <li><strong>Identify Technical Entry and Stop-Loss Levels:</strong> Determine exact entry price points and logical stop-loss exit levels based on market structure or valuation.</li>
  <li><strong>Calculate Exact Position Size:</strong> Divide your dollar risk limit by the price distance between entry and stop-loss to calculate exact share or contract quantities.</li>
  <li><strong>Verify Upside Risk/Reward Asymmetry:</strong> Ensure your target exit price offers at least twice the potential gain relative to the stop-loss distance.</li>
  <li><strong>Conduct Periodic Portfolio Rebalancing:</strong> Review overall portfolio asset class weighting semi-annually and trim overperforming assets to buy underperforming sectors.</li>
</ol>""",
        "faqs": [
            ("How do I calculate position size based on account risk?",
             "Position size is calculated by dividing your total maximum dollar risk (e.g., 1% of portfolio) by the risk per share (entry price minus stop-loss price). For example, risking $500 with a $5 per share stop-loss distance yields a position size of 100 shares."),
            ("What is a good risk-to-reward ratio for trading?",
             "A standard recommendation is a minimum risk-to-reward ratio of 1:2. This means for every $1 you risk on a trade, you stand to make $2 in potential profit, allowing you to remain profitable overall even with a win rate below 50%."),
            ("What is the Kelly Criterion and why is fractional Kelly used?",
             "The Kelly Criterion is a mathematical formula that calculates optimal position size based on win probability and payout ratio. Investors use fractional Kelly (e.g., half-Kelly) because full Kelly sizing produces extreme equity swings during drawdowns.")
        ]
    }
]

def build_finance():
    for p in finance_pages:
        rel_grid = get_related_grid("finance", p["category"])
        
        faqs_html = []
        for q, a in p["faqs"]:
            faqs_html.append(f'  <h3>{q}</h3>\n  <p>\n    {a}\n  </p>')
        faqs_str = "\n".join(faqs_html)
        
        content = f"""---
layout: default
title: "{p['title']}"
description: "{p['description']}"
is_catpage: true
category: {p['category']}
permalink: /{p['category']}
shortName: "{p['shortName']}"
---

<section class="hero-section">
  <h1>{p['h1']}</h1>
  <p>
    {p['hero_p']}
  </p>
</section>

<!-- ============================================================ -->
<!-- TOOL GRID                                                     -->
<!-- ============================================================ -->

<div class="tool-list">
  {{% assign tools = site.data.tools | where: "category", page.category | where: "type", "tool" %}}
  {{% for tool in tools %}}
    <a href="{{{{ tool.url }}}}" class="tool-card">
      <span class="tool-card-title">{{{{ tool.title }}}}</span>
      <span class="tool-card-arrow">→</span>
    </a>
  {{% endfor %}}
</div>

<!-- ============================================================ -->
<!-- DETAILED CONTENT                                              -->
<!-- ============================================================ -->

<section class="content-section">
  <h2>{p['overview_h2']}</h2>
  {p['overview_text']}

  <h2>{p['benchmarks_h2']}</h2>
  {p['benchmarks_text']}

  <h2>{p['guide_h2']}</h2>
  {p['guide_text']}

  <h2>Frequently Asked Questions</h2>
{faqs_str}

{rel_grid}
</section>
"""
        filepath = os.path.join(base_dir, p["filename"])
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Wrote {p['filename']}")

if __name__ == "__main__":
    build_finance()
