import os
import re
from generate_all_35 import get_related_grid, base_dir

automotive_pages = [
    {
        "filename": "auto-loan-financing.md",
        "category": "auto-loan-financing",
        "shortName": "Loan & Financing",
        "title": "Auto Financing Calculators: Loans, Leases & Refi",
        "description": "Calculate auto loan payments, lease vs buy comparisons, refinance savings, down payment impacts, negative equity, and loan payoff times.",
        "h1": "Auto Loan &amp; Financing Calculators",
        "hero_p": "Calculate monthly car loan payments, lease vs. buy options, interest savings from refinancing, down payment trade-in impacts, negative equity rollover, and early payoff schedules. Explore our five specialized calculators designed for car buyers.",
        "overview_h2": "Navigating Vehicle Loans & Automotive Financing",
        "overview_text": """
<p>
  Auto financing represents one of the largest ongoing financial commitments for modern households. Evaluating vehicle purchases requires analyzing far more than sticker price — interest rates, loan terms (36 to 84 months), sales tax, dealer doc fees, and trade-in equity heavily dictate true monthly payments and cumulative borrowing costs.
</p>
<p>
  Our <strong>Car Loan Payment Calculator</strong> provides complete visibility into monthly principal, interest, sales tax, and loan amortization. To weigh flexible ownership against long-term equity, the <strong>Auto Loan vs. Lease Calculator</strong> compares leasing payments and mileage limits against financing to own.
</p>
<p>
  For existing vehicle owners, the <strong>Auto Refinance Savings Calculator</strong> computes break-even interest savings, while the <strong>Negative Equity Car Loan Calculator</strong> models rolling upside-down loan balances into new vehicle financing.
</p>""",
        "benchmarks_h2": "Auto Financing Industry Benchmarks",
        "benchmarks_text": """
<p>
  Reference these established auto lending guidelines and financial benchmarks:
</p>
<ul>
  <li><strong>20/4/10 Rule for Car Buying:</strong> Put down at least 20%, finance for no more than 4 years (48 months), and ensure total monthly auto expenses stay under 10% of gross income.</li>
  <li><strong>Optimal Loan Term:</strong> Standard recommended loan terms are 48 to 60 months; terms extending to 72 or 84 months significantly increase total interest paid and cause underwater loans.</li>
  <li><strong>Refinance Interest Gap:</strong> Refinancing an auto loan is financially advantageous if you can reduce your interest rate by at least 1.5% to 2.0% with no pre-payment penalties.</li>
  <li><strong>Negative Equity Limit:</strong> Avoid rolling over negative equity (“underwater” loan balance) into a new auto loan, as it inflates loan-to-value (LTV) ratios above 120%.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Auto Loan Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist before securing financing at a dealership or lender:
</p>
<ol>
  <li><strong>Establish True Vehicle Purchase Price:</strong> Negotiate vehicle sale price before discussing monthly payments or trade-in allowances.</li>
  <li><strong>Calculate State Sales Tax &amp; Dealer Fees:</strong> Add localized sales tax (e.g., 6% to 8%), title fees, registration, and dealer documentation fees to the sale price.</li>
  <li><strong>Subtract Down Payment &amp; Trade-In Equity:</strong> Deduct cash down payment and positive trade-in equity (trade-in value minus remaining loan balance).</li>
  <li><strong>Model Monthly Principal &amp; Interest Payments:</strong> Compare 48-month vs. 60-month terms to evaluate monthly payment comfort against total interest paid.</li>
  <li><strong>Check Early Payoff &amp; Refinance Opportunities:</strong> Calculate interest savings from making bi-weekly payments or refinancing if credit scores improve post-purchase.</li>
</ol>""",
        "faqs": [
            ("What is the 20/4/10 rule for auto financing?",
             "The 20/4/10 rule suggests putting down 20% cash, financing the vehicle for a maximum of 4 years (48 months), and keeping total monthly transportation costs (loan + insurance) under 10% of gross income."),
            ("Is it better to lease or buy a car?",
             "Leasing offers lower monthly payments and a new car every 3 years, but leaves you with zero equity and potential mileage penalties. Buying requires higher payments, but builds equity and eliminates payments once paid off."),
            ("How does negative equity (being underwater) affect a new car loan?",
             "Negative equity occurs when you owe more on a car than it is worth. Rolling that balance into a new loan increases your new loan balance, monthly payment, and interest charges, compounding debt.")
        ]
    },
    {
        "filename": "auto-cost-ownership.md",
        "category": "auto-cost-ownership",
        "shortName": "Cost of Ownership",
        "title": "Car Ownership Cost Calculators: Depreciation & Total",
        "description": "Estimate total cost of ownership (TCO), vehicle depreciation rates, insurance estimates, parking expenses, and transit cost comparisons.",
        "h1": "Vehicle Cost of Ownership Calculators",
        "hero_p": "Calculate 5-year total cost of ownership (TCO), annual vehicle depreciation rates, auto insurance cost estimates, parking expenses, and car vs. public transit financial comparisons. Explore our specialized calculators built for smart vehicle shoppers.",
        "overview_h2": "Understanding Total Cost of Vehicle Ownership (TCO)",
        "overview_text": """
<p>
  The true cost of owning a vehicle extends far beyond the initial purchase price or monthly loan payment. Depreciation, auto insurance premiums, fuel consumption, routine maintenance, state vehicle registration tags, parking fees, and financing interest combine to form a vehicle's True Cost of Ownership (TCO).
</p>
<p>
  Our <strong>Car True Cost of Ownership Calculator</strong> aggregates all fixed and variable vehicle operating expenses across a 5-year timeline. The <strong>Car Depreciation Calculator</strong> models residual value loss year by year, showing why new vehicles lose significant value early.
</p>
<p>
  For urban commuters, the <strong>Car vs. Public Transit Cost Calculator</strong> compares owning a personal vehicle against public transportation or ridesharing. Additionally, tools like the <strong>Car Registration &amp; Tag Fee Calculator</strong> help estimate annual vehicle overhead.
</p>""",
        "benchmarks_h2": "Vehicle Operating Cost & Depreciation Benchmarks",
        "benchmarks_text": """
<p>
  Keep these standard AAA automotive industry benchmarks in mind when evaluating ownership costs:
</p>
<ul>
  <li><strong>Average Cost Per Mile:</strong> The average cost to own and operate a new vehicle is approximately $0.72 per mile (or ~$12,000 annually for 15,000 miles driven).</li>
  <li><strong>Vehicle Depreciation Schedule:</strong> New cars lose approximately 20% of value in year one and 15% per year in years two through five (~60% total value loss over 5 years).</li>
  <li><strong>Annual Transportation Budget Limit:</strong> Total household transportation expenses (financing, gas, maintenance, insurance) should not exceed 15% of net income.</li>
  <li><strong>Maintenance &amp; Repair Cost Growth:</strong> Maintenance costs average ~$0.09/mile for the first 25,000 miles, but increase to ~$0.18+/mile after 75,000 miles.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical TCO Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step framework to calculate true vehicle ownership expenses:
</p>
<ol>
  <li><strong>Calculate 5-Year Depreciation Loss:</strong> Estimate vehicle resale value after 5 years and subtract from original purchase price to find total depreciation expense.</li>
  <li><strong>Aggregate Annual Fuel Expenditures:</strong> Multiply annual miles driven by local fuel prices and divide by vehicle rated MPG economy.</li>
  <li><strong>Obtain Actual Insurance Quotes:</strong> Gather localized annual auto insurance quotes specific to the make, model, driver age, and zip code.</li>
  <li><strong>Estimate Maintenance and Repairs:</strong> Budget routine oil changes, tire replacements, brakes, and unexpected repairs based on vehicle age.</li>
  <li><strong>Sum Taxes, Tags, and Operating Fees:</strong> Add annual state property taxes, registration renewal fees, parking, and toll expenses to compute final 5-year TCO.</li>
</ol>""",
        "faqs": [
            ("What is the biggest hidden cost of owning a new car?",
             "Depreciation is the single largest expense of owning a new car, typically accounting for 40% to 50% of total 5-year ownership costs, far exceeding fuel or maintenance expenses."),
            ("How much does a new car depreciate in the first 3 years?",
             "A typical new vehicle depreciates approximately 20% in the first year and about 15% per year thereafter, losing roughly 40% to 45% of its original value over 3 years."),
            ("How do I calculate cost per mile for my personal car?",
             "Sum all annual car expenses (loan interest, depreciation, insurance, fuel, maintenance, registration, parking) and divide by total miles driven in that year.")
        ]
    },
    {
        "filename": "auto-fuel-efficiency.md",
        "category": "auto-fuel-efficiency",
        "shortName": "Fuel & Efficiency",
        "title": "Fuel Economy Calculators: MPG & Gas Savings",
        "description": "Calculate vehicle MPG fuel efficiency, trip gas costs, fuel savings from vehicle upgrades, engine idle waste, and CO2 emissions.",
        "h1": "Fuel &amp; Efficiency Calculators",
        "hero_p": "Calculate actual vehicle MPG fuel economy, road trip fuel costs, financial savings from upgrading to a higher-MPG car, engine idle fuel waste, and vehicle CO2 carbon emissions. Explore our specialized calculators built for eco-conscious drivers.",
        "overview_h2": "Precision Fuel Consumption & Efficiency Estimating",
        "overview_text": """
<p>
  Fuel expenditures constitute one of the largest variable operating costs of vehicle ownership. Measuring actual Miles Per Gallon (MPG) fuel economy, calculating trip gas expenses, and evaluating the financial savings of replacing a gas-guzzler with an efficient hybrid or electric vehicle empowers smart vehicle selection.
</p>
<p>
  Our <strong>MPG Calculator</strong> computes real-world fuel economy based on odometer mileage and pump gallons. The <strong>Car Fuel Cost Calculator</strong> forecasts annual or monthly gas spending based on daily commute distance and gas prices.
</p>
<p>
  For vehicle buyers, the <strong>Fuel Savings MPG Upgrade Calculator</strong> determines exact annual cash savings and break-even payback periods when switching to a higher-MPG vehicle. Additionally, tools like the <strong>Engine Idle Fuel Waste Calculator</strong> help optimize fleet driving habits.
</p>""",
        "benchmarks_h2": "Fuel Economy & Emissions Benchmarks",
        "benchmarks_text": """
<p>
  Reference these EPA vehicle fuel economy standards and carbon emission benchmarks:
</p>
<ul>
  <li><strong>US Fleet Fuel Economy Average:</strong> The average EPA combined fuel economy for new light-duty vehicles is approximately 26.0 MPG.</li>
  <li><strong>Gasoline CO2 Emission Constant:</strong> Burning 1 gallon of regular unleaded gasoline produces 8.887 kilograms (19.6 pounds) of CO2 emissions.</li>
  <li><strong>Engine Idling Fuel Waste:</strong> Idling an engine consumes approximately 0.2 to 0.5 gallons of fuel per hour without covering any distance.</li>
  <li><strong>MPG Savings Non-Linearity:</strong> Upgrading from 10 to 20 MPG saves far more gas (50 gallons per 1,000 miles) than upgrading from 30 to 40 MPG (8.3 gallons per 1,000 miles).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Fuel Economy Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step method to calculate exact vehicle MPG and annual fuel spending:
</p>
<ol>
  <li><strong>Fill Tank and Reset Trip Odometer:</strong> Fill gas tank completely until the pump clicks off, and reset your trip odometer to zero.</li>
  <li><strong>Drive Normally Until Refueling:</strong> Drive vehicle under normal commuting conditions until tank is at least half empty.</li>
  <li><strong>Record Trip Miles &amp; Refill Gallons:</strong> Note exact miles on trip odometer and exact gallons required to fill tank again.</li>
  <li><strong>Calculate Actual MPG:</strong> Divide trip miles by refill gallons (e.g., 350 miles ÷ 10.5 gallons = 33.3 MPG).</li>
  <li><strong>Forecast Annual Fuel Spending:</strong> Multiply (Annual Miles Driven ÷ MPG) by local price per gallon to calculate total annual fuel budget.</li>
</ol>""",
        "faqs": [
            ("Why is upgrading from 15 to 25 MPG more beneficial than from 35 to 45 MPG?",
             "Fuel consumption is non-linear relative to MPG. Upgrading from 15 to 25 MPG saves 26.7 gallons per 1,000 miles, whereas upgrading from 35 to 45 MPG saves only 6.3 gallons per 1,000 miles."),
            ("How much fuel does an idling car engine waste per hour?",
             "An idling engine consumes between 0.2 and 0.5 gallons of gasoline per hour depending on engine size and AC load, wasting money and generating unnecessary emissions."),
            ("How do I calculate annual fuel cost for a vehicle?",
             "Divide your total annual miles driven by the vehicle's combined MPG rating, then multiply by the average price per gallon of gas (e.g., [15,000 miles ÷ 30 MPG] × $3.50 = $1,750 per year).")
        ]
    },
    {
        "filename": "electric-vehicle-ev.md",
        "category": "electric-vehicle-ev",
        "shortName": "Electric Vehicle (EV)",
        "title": "EV Calculators: Charging Time, Range & Savings",
        "description": "Calculate EV charging times, charging station costs, battery degradation rates, driving range, home charger payback, and tax credits.",
        "h1": "Electric Vehicle (EV) Calculators",
        "hero_p": "Calculate EV battery charging times (Level 1, 2 &amp; DC Fast), home vs. public charging costs, electric driving range, battery degradation rates, home charger installation payback, and federal EV tax credits. Explore our specialized calculators built for EV owners.",
        "overview_h2": "Comprehensive Electric Vehicle Financial & Technical Math",
        "overview_text": """
<p>
  Transitioning from internal combustion engine (ICE) vehicles to Electric Vehicles (EVs) requires evaluating new energy metrics — kilowatt-hours (kWh), miles per kWh efficiency, charging speeds (kW), battery degradation rates, and electricity utility tariffs (cents per kWh).
</p>
<p>
  Our <strong>EV Charging Time Calculator</strong> computes exact charging duration across Level 1 (120V), Level 2 (240V), and DC Fast Charging stations based on battery capacity. The <strong>EV Charging Cost Calculator</strong> compares home residential electricity rates against commercial public charging network costs.
</p>
<p>
  For prospective EV buyers, the <strong>Gas vs. EV Total Cost Comparison Calculator</strong> determines annual fuel &amp; maintenance savings, while the <strong>EV Range Estimator</strong> adjusts range for ambient temperature and highway speeds. Additionally, tools like the <strong>EV Tax Credit Estimator</strong> help evaluate federal and state purchase incentives.
</p>""",
        "benchmarks_h2": "EV Performance & Charging Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard EV efficiency metrics and charging technical benchmarks:
</p>
<ul>
  <li><strong>EV Efficiency Benchmark:</strong> Average EV efficiency ranges from 3.0 to 4.0 miles per kWh (equivalent to ~100 to 130 MPGe).</li>
  <li><strong>Level 2 Home Charging Speed:</strong> A standard 48-Amp Level 2 home charger (11.5 kW output) adds approximately 30 to 40 miles of driving range per hour of charging.</li>
  <li><strong>DC Fast Charging Speed (Level 3):</strong> DC Fast Chargers (150kW to 350kW) charge an EV battery from 10% to 80% state of charge in 18 to 30 minutes.</li>
  <li><strong>EV Battery Degradation Rate:</strong> Modern liquid-cooled EV batteries experience an average capacity degradation of 1% to 2% per year under normal driving conditions.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical EV Financial Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to calculate EV operating savings and charging costs:
</p>
<ol>
  <li><strong>Determine Battery Size &amp; Efficiency Rating:</strong> Identify EV usable battery capacity in kWh (e.g., 75 kWh) and rated efficiency (e.g., 3.3 miles/kWh).</li>
  <li><strong>Calculate Home Electricity Charging Cost:</strong> Multiply annual miles driven by your electric rate ($/kWh) and divide by vehicle efficiency (miles/kWh).</li>
  <li><strong>Compare Against Equivalent Gas Vehicle Spending:</strong> Calculate gas cost for an equivalent ICE vehicle and subtract EV electricity cost to find annual fuel savings.</li>
  <li><strong>Factor In Home Charger Installation Costs:</strong> Add Level 2 charger hardware ($400–$800) and electrician installation fees ($500–$1,500).</li>
  <li><strong>Calculate Payback Period:</strong> Divide total home charger installation cost by annual fuel and maintenance savings to calculate net payback time in months.</li>
</ol>""",
        "faqs": [
            ("How long does it take to charge an electric car at home?",
             "Using a standard 120V wall outlet (Level 1), charging takes 24 to 40 hours. Installing a 240V Level 2 charger fully charges an EV overnight in 6 to 9 hours."),
            ("How much cheaper is it to drive an electric car compared to gas?",
             "Driving an EV costs about $0.04 to $0.05 per mile using home charging ($0.15/kWh electricity), compared to $0.12 to $0.15 per mile for a gas vehicle ($3.50/gal gas at 25 MPG), yielding 60%+ fuel savings."),
            ("How fast do electric car batteries degrade over time?",
             "Modern liquid-cooled EV batteries lose approximately 1% to 2% of total range capacity per year. Most EV manufacturers back batteries with an 8-year / 100,000-mile warranty against capacity loss over 30%.")
        ]
    },
    {
        "filename": "auto-performance-specs.md",
        "category": "auto-performance-specs",
        "shortName": "Performance & Specs",
        "title": "Car Performance Calculators: HP, 0-60 & Gears",
        "description": "Estimate horsepower-to-weight ratio, 0-60 mph times, 1/4 mile ET, gear ratios, engine displacement, and compression ratios.",
        "h1": "Performance &amp; Engine Spec Calculators",
        "hero_p": "Calculate horsepower-to-weight ratios, 0-60 mph acceleration times, quarter-mile elapsed times (ET) &amp; trap speeds, transmission gear ratios, engine displacement (CID/Liters), and compression ratios. Explore our specialized calculators built for automotive enthusiasts and tuners.",
        "overview_h2": "Precision Vehicle Performance & Engine Dynamics",
        "overview_text": """
<p>
  Automotive engineering and performance tuning rely on exact physics formulas governing power-to-weight dynamics, engine displacement geometry, gear reduction ratios, and acceleration vector calculations. Whether building a track car, tuning an engine build, or analyzing drag strip performance, computing exact specifications ensures optimal vehicle setup.
</p>
<p>
  Our <strong>Horsepower-to-Weight Ratio Calculator</strong> computes vehicle power density in lbs per HP and HP per ton. The <strong>0-60 mph &amp; 1/4-Mile Time Estimator</strong> uses vehicle curb weight and flywheel/wheel horsepower to project acceleration dynamics.
</p>
<p>
  For drivetrain tuning, the <strong>Gear Ratio Calculator</strong> computes engine RPM at specific highway cruising speeds across individual gear ratios. Additionally, tools like the <strong>Engine Displacement Calculator</strong> and <strong>Compression Ratio Calculator</strong> optimize engine rebuild specs.
</p>""",
        "benchmarks_h2": "Automotive Performance Physics Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard performance engineering benchmarks and physics formulas:
</p>
<ul>
  <li><strong>Horsepower-to-Weight Benchmark:</strong> A high-performance sports car targets under 8 lbs per HP (or 250+ HP per ton); supercars achieve under 5 lbs per HP.</li>
  <li><strong>Quarter-Mile ET Formula (Hale's Formula):</strong> Quarter-mile ET ≈ 5.825 × (Curb Weight ÷ Horsepower)^(1/3).</li>
  <li><strong>Trap Speed Formula:</strong> Trap Speed (MPH) ≈ 234 × (Horsepower ÷ Curb Weight)^(1/3).</li>
  <li><strong>Cubic Inches to Liters Conversion:</strong> Engine displacement formula: 1 Liter = 61.0237 Cubic Inches (CID). Example: 350 CID ÷ 61.02 = 5.7 Liters.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Performance Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to compute performance specs and gear ratios:
</p>
<ol>
  <li><strong>Determine Accurate Vehicle Curb Weight:</strong> Obtain total vehicle weight including driver, fuel, and track prep weight in pounds.</li>
  <li><strong>Determine Wheel or Crank Horsepower:</strong> Input dyno-proven wheel horsepower (WHP) or manufacturer flywheel horsepower (BHP).</li>
  <li><strong>Calculate Power-to-Weight Ratio:</strong> Divide total vehicle weight in lbs by total horsepower to obtain pounds per horsepower.</li>
  <li><strong>Calculate Quarter-Mile ET &amp; Trap Speed:</strong> Apply power-to-weight formulas to estimate quarter-mile elapsed time and top trap speed.</li>
  <li><strong>Calculate Transmission Gear RPM:</strong> Input tire overall diameter, final drive axle ratio, and transmission top gear ratio to compute engine RPM at 70 MPH cruising speed.</li>
</ol>""",
        "faqs": [
            ("How does vehicle weight affect 0-60 mph acceleration times?",
             "Reducing vehicle weight by 100 lbs improves acceleration times by approximately 0.1 seconds in the quarter-mile, as power-to-weight ratio directly dictates acceleration rate."),
            ("What is the difference between wheel horsepower (WHP) and flywheel horsepower (BHP)?",
             "Flywheel horsepower (BHP) is measured directly at the engine crank. Wheel horsepower (WHP) is measured at the tires on a chassis dyno and is 12% to 18% lower due to drivetrain friction losses."),
            ("How do I convert engine displacement from cubic inches (CID) to liters?",
             "Divide the engine displacement in cubic inches by 61.0237. For example, a classic 302 cubic inch Ford V8 equals 302 ÷ 61.0237 = 4.95 (rounded to 5.0 Liters).")
        ]
    },
    {
        "filename": "auto-tires-wheels.md",
        "category": "auto-tires-wheels",
        "shortName": "Tires & Wheels",
        "title": "Tire & Wheel Calculators: Size, Speedo & Offset",
        "description": "Compare tire sizes, calculate speedometer error, wheel offset backspacing, tire revolutions per mile, pressure, and tread wear life.",
        "h1": "Tire &amp; Wheel Specification Calculators",
        "hero_p": "Compare tire sidewall sizes, calculate speedometer error percentage, wheel offset &amp; backspacing, tire revolutions per mile, tire inflation pressure adjustments, and tread wear life expectancy. Explore our specialized calculators built for tire fitment.",
        "overview_h2": "Precision Tire Sizing & Wheel Fitment Math",
        "overview_text": """
<p>
  Upgrading tires or fitting custom aftermarket wheels requires precise geometry math to ensure proper fender clearance, correct speedometer readings, and safe suspension clearance. Changing tire diameter or wheel offset alters overall tire rolling circumference, scrub radius, and speedometer calibration.
</p>
<p>
  Our <strong>Tire Size Comparison Calculator</strong> analyzes overall diameter, sidewall height, section width, and rolling circumference differences between original equipment (OE) and new tires. The <strong>Speedometer Error Calculator</strong> determines exact speedometer speed discrepancies caused by larger or smaller tire diameters.
</p>
<p>
  For custom wheel fitment, the <strong>Wheel Offset &amp; Backspacing Calculator</strong> measures inner suspension clearance and outer fender extension. Additionally, tools like the <strong>Tire Revolutions Per Mile Calculator</strong> and <strong>Tire Wear Life Estimator</strong> optimize tire maintenance.
</p>""",
        "benchmarks_h2": "Tire Sizing & Speedometer Benchmarks",
        "benchmarks_text": """
<p>
  Apply these standard automotive tire fitment rules and speedometer tolerances:
</p>
<ul>
  <li><strong>Maximum Tire Diameter Variance Rule:</strong> Keep new tire overall diameter within ±3% of the original factory tire diameter to prevent ABS, traction control, and transmission shift errors.</li>
  <li><strong>Speedometer Variance Calculation:</strong> A 3% increase in tire diameter causes your speedometer to read 3% slower than true ground speed (reading 60 MPH when actually traveling 61.8 MPH).</li>
  <li><strong>Wheel Offset Definition:</strong> Offset (mm) is the distance from the wheel mounting hub surface to the true centerline of the wheel (positive offset tucks wheels inward; negative pushes wheels out).</li>
  <li><strong>Backspacing to Offset Conversion:</strong> Backspacing (inches) = (Wheel Width in inches + 1 inch lip) ÷ 2 + (Offset in mm ÷ 25.4).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Tire & Wheel Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step procedure to calculate tire dimensions and verify wheel fitment:
</p>
<ol>
  <li><strong>Decode Metric Tire Size Specs:</strong> Read tire sidewall format (e.g., 225/45R17) where 225 is section width in mm, 45 is aspect ratio %, and 17 is wheel rim diameter in inches.</li>
  <li><strong>Calculate Overall Tire Diameter:</strong> Overall Diameter (inches) = [(Width mm × Aspect Ratio %) × 2 ÷ 25.4] + Rim Diameter in inches.</li>
  <li><strong>Calculate Rolling Circumference:</strong> Multiply overall tire diameter by Pi (π = 3.14159) to find rolling circumference in inches.</li>
  <li><strong>Calculate Speedometer Error Percentage:</strong> Compare new tire circumference against OE tire circumference: Error % = [(New Circumference ÷ OE Circumference) - 1] × 100.</li>
  <li><strong>Verify Inner &amp; Outer Wheel Clearance:</strong> Calculate wheel offset changes to ensure new rims do not rub against inner struts or outer fender lips.</li>
</ol>""",
        "faqs": [
            ("What happens to my speedometer if I install larger tires?",
             "Larger diameter tires travel further with each revolution. This causes your speedometer to read slower than your actual vehicle speed (e.g., showing 65 MPH when you are actually traveling 68 MPH)."),
            ("What is the difference between wheel offset and backspacing?",
             "Wheel offset is the distance from the wheel centerline to the hub mounting face, measured in millimeters. Backspacing is the distance from the inner wheel lip to the mounting face, measured in inches."),
            ("How do I calculate overall tire diameter from a metric tire size like 245/40R18?",
             "Convert sidewall height to inches: (245 mm × 0.40) × 2 ÷ 25.4 = 7.72 inches. Add wheel diameter: 7.72 + 18 = 25.72 inches total overall diameter.")
        ]
    },
    {
        "filename": "auto-driving-trip-planning.md",
        "category": "auto-driving-trip-planning",
        "shortName": "Driving & Trip Planning",
        "title": "Road Trip Calculators: Fuel, Tolls & Time",
        "description": "Calculate road trip fuel expenses, driving time & distance, toll costs, carpool bill splits, and trucking cost per mile.",
        "h1": "Driving &amp; Road Trip Calculators",
        "hero_p": "Calculate road trip fuel costs, driving travel time &amp; rest stop schedules, toll road expenses, carpool gas bill splits, and commercial trucking operating costs per mile. Explore our specialized calculators built for road trippers and commuters.",
        "overview_h2": "Comprehensive Road Trip & Travel Cost Planning",
        "overview_text": """
<p>
  Planning long-distance road trips, daily highway commutes, or commercial freight routes requires calculating fuel budgets, driving time, highway toll fees, and passenger cost splits. Precise trip math prevents surprise gas expenditures and keeps travel schedules on track.
</p>
<p>
  Our <strong>Road Trip Fuel Cost Calculator</strong> computes total round-trip gas expenses based on route distance, vehicle MPG economy, and current gas prices. The <strong>Driving Time &amp; Distance Calculator</strong> estimates true travel duration including mandatory rest stops and traffic delays.
</p>
<p>
  For shared travel, the <strong>Carpool Cost Split Calculator</strong> divides fuel and toll costs fairly among passengers. Commercial drivers and fleet managers can utilize the <strong>Trucking Cost Per Mile Calculator</strong> to track fixed and variable operating costs.
</p>""",
        "benchmarks_h2": "Road Travel & Driving Industry Benchmarks",
        "benchmarks_text": """
<p>
  Incorporate these practical travel benchmarks and driving fatigue rules into your trip planning:
</p>
<ul>
  <li><strong>Average Highway Driving Speed Benchmark:</strong> Assume an overall average travel speed of 55 to 60 MPH (including short fuel and bathroom stops) when estimating long-distance driving time.</li>
  <li><strong>Driver Fatigue Rest Stop Standard:</strong> Take a 15-to-20 minute rest break every 2 hours or 100 to 120 miles of continuous driving to maintain alertness.</li>
  <li><strong>Maximum Daily Driving Limit:</strong> Non-commercial drivers should cap daily driving at 8 to 10 hours (approx 500–600 miles) to prevent extreme exhaustion.</li>
  <li><strong>Commercial Trucking Cost Per Mile:</strong> Commercial motor carrier operating costs average $1.80 to $2.20 per mile (fuel, driver pay, maintenance, insurance).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Road Trip Cost Planning Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to budget fuel, tolls, and time for any road trip:
</p>
<ol>
  <li><strong>Determine Total Route Mileage:</strong> Calculate total round-trip driving distance using map navigation, including local driving around your destination.</li>
  <li><strong>Calculate Required Fuel Gallons:</strong> Divide total route mileage by your vehicle highway MPG rating (e.g., 1,200 miles ÷ 30 MPG = 40 gallons of gas).</li>
  <li><strong>Calculate Fuel Expense Budget:</strong> Multiply required gallons by anticipated average gas price along your travel corridor (e.g., 40 gallons × $3.60 = $144).</li>
  <li><strong>Estimate Highway Tolls &amp; Parking Fees:</strong> Research toll road corridors along your route and add destination overnight parking fees.</li>
  <li><strong>Split Costs Fairly Among Passengers:</strong> Divide total travel expenses (fuel + tolls + parking) by the number of carpool passengers.</li>
</ol>""",
        "faqs": [
            ("How do I calculate gas cost for a long road trip?",
             "Divide total trip distance (round-trip) by your car's highway MPG rating to get total gallons needed, then multiply by average price per gallon of gas."),
            ("How many miles can you comfortably drive in one day?",
             "A comfortable driving limit for a single driver is 500 to 600 miles per day (about 8 to 10 hours of driving time including rest stops)."),
            ("How does a carpool cost split calculator work?",
             "It sums total fuel costs, highway tolls, and parking fees for a trip, then divides the total equally by the number of passengers, allowing fair expense sharing.")
        ]
    },
    {
        "filename": "auto-maintenance-repair.md",
        "category": "auto-maintenance-repair",
        "shortName": "Maintenance & Repair",
        "title": "Auto Maintenance Calculators: DIY vs Mechanic Cost",
        "description": "Estimate DIY vs mechanic repair costs, brake pad life expectancy, car battery longevity, oil change intervals, and timing belt schedules.",
        "h1": "Vehicle Maintenance &amp; Repair Calculators",
        "hero_p": "Calculate DIY vs. professional mechanic repair cost differences, brake pad life expectancy, car battery lifespan &amp; replacement costs, oil change intervals, and timing belt replacement schedules. Explore our specialized calculators built for vehicle owners.",
        "overview_h2": "Precision Vehicle Maintenance & Repair Estimating",
        "overview_text": """
<p>
  Routine automotive maintenance and timely mechanical repairs are essential to prevent catastrophic engine failures, prolong vehicle operating life, and preserve resale value. Deciding whether to perform repairs as a DIY project or hire a professional mechanic requires comparing parts costs against mechanic labor rates.
</p>
<p>
  Our <strong>DIY vs. Mechanic Repair Cost Calculator</strong> compares parts-only costs against professional shop labor quotes. The <strong>Brake Pad Life Estimator</strong> projects remaining brake pad mileage based on driving habits and pad thickness measurements.
</p>
<p>
  For electrical and engine care, the <strong>Car Battery Life &amp; Cost Estimator</strong> forecasts battery replacement timing, while the <strong>Oil Change Interval Calculator</strong> and <strong>Timing Belt Replacement Calculator</strong> ensure critical engine maintenance is performed on schedule.
</p>""",
        "benchmarks_h2": "Automotive Maintenance Service Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard manufacturer maintenance intervals and repair benchmarks:
</p>
<ul>
  <li><strong>Oil Change Interval Standards:</strong> Conventional oil: 3,000 to 5,000 miles; Synthetic blend: 5,000 to 7,500 miles; Full synthetic oil: 7,500 to 10,000+ miles.</li>
  <li><strong>Brake Pad Lifespan Range:</strong> Front brake pads typically last 30,000 to 70,000 miles depending on driving style (city vs highway) and friction material (ceramic vs metallic).</li>
  <li><strong>Car Battery Lifespan Benchmark:</strong> Standard 12V lead-acid car batteries last 3 to 5 years (hot climates accelerate battery degradation down to 3 years).</li>
  <li><strong>Timing Belt Replacement Interval:</strong> Interference engine timing belts must be replaced every 60,000 to 100,000 miles to prevent catastrophic valve-to-piston collisions.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Vehicle Maintenance Planning Guide",
        "guide_text": """
<p>
  Follow this step-by-step maintenance checklist to keep your vehicle running reliably:
</p>
<ol>
  <li><strong>Review Manufacturer Service Schedule:</strong> Consult owner's manual for specific mileage intervals for oil, transmission fluid, spark plugs, and timing belts.</li>
  <li><strong>Measure Wear Component Thickness:</strong> Measure brake pad friction material thickness (minimum 3mm threshold) and tire tread depth (minimum 2/32\" threshold).</li>
  <li><strong>Test 12V Battery Health Annually:</strong> Test 12V car battery resting voltage (12.6V = full charge) and cranking amp capacity after 3 years of service.</li>
  <li><strong>Compare DIY vs. Professional Repair Quotes:</strong> Estimate DIY parts costs plus special tool purchases against mechanic quotes (labor rates ~$100–$180/hr).</li>
  <li><strong>Log Complete Service Records:</strong> Maintain detailed maintenance records and receipts to maximize vehicle resale value and prove warranty compliance.</li>
</ol>""",
        "faqs": [
            ("How often should I really change my synthetic engine oil?",
             "Full synthetic oil should be changed every 7,500 to 10,000 miles (or once a year, whichever comes first) under normal driving conditions."),
            ("How long do brake pads usually last?",
             "Brake pads last between 30,000 and 70,000 miles. City driving with frequent stopping wears pads faster than long-distance highway cruising."),
            ("What happens if a timing belt breaks while driving?",
             "On an interference engine, a broken timing belt causes the pistons to strike open valves, causing catastrophic engine damage that requires thousands in repairs or full engine replacement.")
        ]
    }
]

def build_automotive():
    for p in automotive_pages:
        rel_grid = get_related_grid("automotive", p["category"])
        
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
    build_automotive()
