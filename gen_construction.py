import os
import re
from generate_all_35 import get_related_grid, base_dir

construction_pages = [
    {
        "filename": "concrete-masonry.md",
        "category": "concrete-masonry",
        "shortName": "Concrete & Masonry",
        "title": "Concrete & Masonry Calculators: Volume & Materials",
        "description": "Estimate concrete yardage, bag counts, CMU blocks, rebar grids, mortar bags, gravel base, footings, and retaining wall materials.",
        "h1": "Concrete &amp; Masonry Estimating Calculators",
        "hero_p": "Calculate exact concrete volume in cubic yards, premixed 60lb/80lb bag counts, CMU block requirements, rebar grid reinforcement, gravel base tonnage, and total slab costs. Explore our specialized calculators built for structural concrete work.",
        "overview_h2": "Accurate Structural Masonry & Concrete Estimating",
        "overview_text": """
<p>
  Concrete and masonry projects require precise material estimating to prevent expensive site delays, cold-joint pour failures, or costly over-ordering fees. Whether pouring a 4-inch patio slab, setting deck footings, laying CMU block retaining walls, or calculating asphalt tonnage for a driveway, accurate volume and mix math is essential for job site profitability.
</p>
<p>
  Our <strong>Concrete Yardage Calculator</strong> converts slab dimensions into exact cubic yards and ready-mix truckloads, accounting for standard 5% to 10% waste factors. For smaller DIY pours, the <strong>Concrete Bag Calculator</strong> determines exact quantities of 60lb and 80lb premixed bags along with water requirements.
</p>
<p>
  For masonry construction, the <strong>Concrete Block (CMU) Calculator</strong> estimates standard 8x8x16 block counts and mortar bag requirements. Additionally, tools like the <strong>Rebar Grid Calculator</strong> and <strong>Gravel Base Calculator</strong> ensure structural foundation integrity from ground prep to final pour.
</p>""",
        "benchmarks_h2": "Concrete & Masonry Key Construction Standards",
        "benchmarks_text": """
<p>
  Reference these standard structural engineering benchmarks when estimating concrete and masonry work:
</p>
<ul>
  <li><strong>Cubic Yard Coverage Standard:</strong> One cubic yard of concrete (27 cu ft) covers 81 sq ft at 4 inches thick, or 108 sq ft at 3 inches thick.</li>
  <li><strong>Premixed Bag Conversion:</strong> It takes 45 bags of 80lb concrete (or 60 bags of 60lb concrete) to equal 1 cubic yard (27 cu ft) of poured concrete.</li>
  <li><strong>CMU Wall Density:</strong> Standard 8x8x16 concrete masonry units (CMU) require 1.125 blocks per square foot of wall surface area.</li>
  <li><strong>Rebar Overlap Requirement:</strong> Structural rebar splices require a minimum lap splice length of 36 times the bar diameter (typically 18 to 24 inches for #4 rebar).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Concrete Pour Estimating Guide",
        "guide_text": """
<p>
  Follow this systematic field checklist to calculate materials for any concrete or masonry project:
</p>
<ol>
  <li><strong>Measure Form Dimensions Accurately:</strong> Measure length, width, and depth in feet and inches. Convert all thickness measurements to decimal feet (e.g., 4 inches = 0.33 ft).</li>
  <li><strong>Calculate Raw Cubic Volume:</strong> Multiply length × width × depth to get cubic feet, then divide by 27 to convert to raw cubic yards.</li>
  <li><strong>Add Material Waste Percentage:</strong> Add 5% waste for structured formwork or 10% waste for uneven ground prep and footings.</li>
  <li><strong>Determine Sub-base Tonnage:</strong> Calculate crushed stone base requirements at 2 inches to 4 inches depth (1.5 tons of aggregate per cubic yard).</li>
  <li><strong>Calculate Reinforcement &amp; Accessories:</strong> Estimate rebar grid spacing (typically 18 to 24 inches on center) and expansion joint strip lengths for slabs over 10 feet.</li>
</ol>""",
        "faqs": [
            ("How many 80lb bags of concrete do I need for a cubic yard?",
             "You need 45 bags of 80lb premixed concrete to yield 1 cubic yard (27 cubic feet) of concrete. For 60lb bags, you need 60 bags per cubic yard."),
            ("How thick should a residential concrete driveway or patio slab be?",
             "Standard residential patios and walkways should be 4 inches thick poured over a 4-inch gravel base. Driveways accommodating heavy vehicles or RVs should be 5 to 6 inches thick reinforced with rebar."),
            ("How much waste should I add to concrete calculations?",
             "Add 5% waste for clean, rigid wooden formwork on level ground. Add 8% to 10% waste for unformed footings, uneven soil, post holes, or complex curved slabs.")
        ]
    },
    {
        "filename": "lumber-framing.md",
        "category": "lumber-framing",
        "shortName": "Lumber & Framing",
        "title": "Lumber & Framing Calculators: Studs, Beams & Decking",
        "description": "Calculate board feet, stud spacing, rafter lengths, joist spans, OSB sheathing sheets, header sizes, and deck framing materials.",
        "h1": "Lumber &amp; Structural Framing Calculators",
        "hero_p": "Calculate wall stud counts, roof rafter lengths, floor joist spans, board feet lumber volume, OSB sheathing sheets, structural header sizes, and deck framing. Explore our specialized calculators engineered for carpenters and builders.",
        "overview_h2": "Precision Structural Framing & Lumber Estimating",
        "overview_text": """
<p>
  Structural framing is the skeleton of any residential build or renovation. Accurate framing takeoff ensures structural compliance with building codes while eliminating wasted lumber costs and unnecessary job site returns. Carpenter framing requires converting lineal feet into piece counts, board feet, and sheathing sheets.
</p>
<p>
  Our <strong>Board Feet Calculator</strong> provides instant volume conversions for hardwoods and dimensional lumber orders. For wall construction, the <strong>Stud Framing Calculator</strong> computes top and bottom plates, king studs, trimmer studs, corner assemblies, and waste factors for 16-inch or 24-inch on-center layout spacing.
</p>
<p>
  For roof and floor structure, the <strong>Rafter Length Calculator</strong> and <strong>Joist Span Calculator</strong> deliver precise dimensional layout math for pitch slopes, overhangs, and load-bearing capacities. Additionally, our <strong>OSB &amp; Plywood Sheathing Calculator</strong> estimates sheet counts for subflooring, exterior walls, and roof decking.
</p>""",
        "benchmarks_h2": "Framing & Lumber Industry Benchmarks",
        "benchmarks_text": """
<p>
  Incorporate these standard carpentry benchmarks and building code rules into your framing estimates:
</p>
<ul>
  <li><strong>Board Foot Formula:</strong> One board foot equals a piece of lumber 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches). Formula: (T\" × W\" × L') ÷ 12.</li>
  <li><strong>Stud Rule of Thumb:</strong> Estimate 1 wall stud per lineal foot of wall for 16\" on-center framing to account for top/bottom plates, corners, and window/door openings.</li>
  <li><strong>Sheathing Sheet Coverage:</strong> Standard 4x8 ft plywood/OSB sheets cover 32 square feet. Divide total wall/roof area by 32 and add 8% to 10% waste for cutoffs.</li>
  <li><strong>Deck Joist Spanning Limit:</strong> Standard 2x8 Southern Yellow Pine joists spaced 16\" on-center can span up to 12 feet 10 inches under standard residential live loads (40 psf).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Lumber Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step methodology to perform structural lumber material takeoffs:
</p>
<ol>
  <li><strong>Measure Total Wall Lineal Feet:</strong> Measure all exterior and interior load-bearing walls to determine wall length runs.</li>
  <li><strong>Calculate Wall Framing Component Quantities:</strong> Multiply lineal wall feet by 1 stud per foot. Add 3 studs per window/door opening for headers, trimmers, and king studs.</li>
  <li><strong>Estimate Plate Stock Material:</strong> Multiply wall lineal footage by 3 to account for double top plates and single bottom sole plate.</li>
  <li><strong>Calculate Floor/Ceiling Framing Layout:</strong> Divide floor width by layout spacing (1.33 ft for 16\" O.C.) and add 1 rim joist per side.</li>
  <li><strong>Add Sheathing Cut Waste:</strong> Calculate square footage of walls, floors, or roof areas, divide by 32 sq ft per sheet, and add 10% for diagonal cuts and openings.</li>
</ol>""",
        "faqs": [
            ("How do I calculate board feet for dimensional lumber?",
             "Multiply thickness in inches by width in inches by length in feet, then divide by 12. For example, a 2x6 board that is 10 feet long equals (2 × 6 × 10) ÷ 12 = 10 board feet."),
            ("How many studs do I need for a 50-foot wall framed 16 inches on center?",
             "As a rule of thumb, budget 1 stud per lineal foot (50 studs) plus extra studs for corners and partitions. The baseline math requires (50 ÷ 1.333) + 1 = 39 studs, plus top/bottom plates."),
            ("What size OSB sheathing is standard for exterior walls and roofs?",
             "Standard 7/16-inch OSB or 1/2-inch CDX plywood sheets (4x8 feet) are standard for exterior wall sheathing and roof decking with 24-inch rafter spacing.")
        ]
    },
    {
        "filename": "roofing.md",
        "category": "roofing",
        "shortName": "Roofing",
        "title": "Roofing Calculators: Pitch, Shingles & Materials",
        "description": "Calculate roofing squares, shingle bundles, roof pitch angles, metal roofing sheets, ridge vent lengths, flashing, and ice barriers.",
        "h1": "Roofing &amp; Attic Estimating Calculators",
        "hero_p": "Calculate roof area in squares, asphalt shingle bundles, roof pitch angles, metal roofing panels, ridge vent lengths, ice &amp; water shield rolls, and valley flashing. Explore our specialized calculators built for roofing contractors and homeowners.",
        "overview_h2": "Precision Roof Estimating & Material Calculations",
        "overview_text": """
<p>
  Roofing projects demand rigorous surface area estimating because roof slopes and complex geometries increase square footage significantly over building footprint dimensions. Calculating exact roofing squares, underlayment rolls, starter strips, ridge caps, and valley flashing ensures accurate contractor quotes and prevents mid-project material shortages.
</p>
<p>
  Our <strong>Roofing Square Calculator</strong> converts flat ground footprint dimensions and pitch multipliers into total roofing squares (100 sq ft units). For asphalt shingle applications, the <strong>Shingle Bundle Calculator</strong> calculates exact bundle counts (3 bundles per square) plus starter strip quantities.
</p>
<p>
  For slope measurement, the <strong>Roof Pitch Calculator</strong> determines pitch ratios (rise over run) and roof pitch angles in degrees. Additionally, specialized tools like the <strong>Metal Roofing Calculator</strong>, <strong>Ridge Vent Calculator</strong>, and <strong>Ice &amp; Water Shield Calculator</strong> optimize complete roofing system protection.
</p>""",
        "benchmarks_h2": "Roofing & Attic Key Industry Benchmarks",
        "benchmarks_text": """
<p>
  Apply these standard roofing industry benchmarks and trade rules when estimating projects:
</p>
<ul>
  <li><strong>Roofing Square Definition:</strong> One roofing square equals 100 square feet of roof surface area.</li>
  <li><strong>Shingle Bundle Ratio:</strong> Standard architectural asphalt shingles require 3 bundles per roofing square (33.3 sq ft coverage per bundle).</li>
  <li><strong>Roof Pitch Multipliers:</strong> Common pitch multipliers: 4/12 pitch = 1.054; 6/12 pitch = 1.118; 8/12 pitch = 1.202; 12/12 pitch = 1.414 times ground footprint.</li>
  <li><strong>Attic Ventilation Rule (1:300):</strong> Building code requires 1 square foot of net free vent area for every 300 square feet of attic floor space (split 50/50 soffit/ridge).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Roof Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step guide to measure roof surface area and estimate material bundles:
</p>
<ol>
  <li><strong>Determine Base Footprint Area:</strong> Calculate ground-level building exterior area (length × width) including eave overhang distances (typically 1 to 2 feet).</li>
  <li><strong>Determine Roof Pitch Ratio:</strong> Measure roof rise over 12 inches of run to identify pitch (e.g., 6/12 pitch).</li>
  <li><strong>Apply Pitch Multiplier:</strong> Multiply ground footprint square footage by the specific pitch slope multiplier to obtain true sloped roof surface area.</li>
  <li><strong>Convert to Roofing Squares:</strong> Divide total sloped roof square footage by 100 to calculate total roofing squares.</li>
  <li><strong>Add Material Cut Waste:</strong> Add 10% waste for simple gable roofs, or 15% to 20% waste for complex hip roofs with valleys, dormers, and skylights.</li>
</ol>""",
        "faqs": [
            ("What is a roofing square and how many bundles of shingles are in a square?",
             "A roofing square is an industry measurement equal to 100 square feet of roof surface area. Standard 3-tab and architectural asphalt shingles require 3 bundles per square."),
            ("How does roof pitch affect total roof square footage?",
             "As roof pitch increases, sloped roof surface area expands relative to building ground footprint. For example, a steep 12/12 pitch roof has 41.4% more surface area than a flat roof covering the same footprint."),
            ("How many rolls of synthetic underlayment do I need per roof square?",
             "Standard synthetic roof underlayment rolls cover 10 squares (1,000 sq ft). Divide your total roof square count by 10 and add 10% for overlapping seams.")
        ]
    },
    {
        "filename": "flooring.md",
        "category": "flooring",
        "shortName": "Flooring",
        "title": "Flooring Calculators: Tile, Hardwood & Laminate",
        "description": "Calculate floor square footage, tile layout counts, hardwood planks, vinyl plank coverage, underlayment rolls, and leveler compounds.",
        "h1": "Flooring &amp; Tiling Material Calculators",
        "hero_p": "Calculate room floor square footage, tile layout counts, tile grout bags, solid hardwood flooring, luxury vinyl plank (LVP) boxes, underlayment rolls, and self-leveling compound. Explore our specialized calculators built for flooring installers.",
        "overview_h2": "Precision Flooring & Tiling Material Estimating",
        "overview_text": """
<p>
  Flooring installation requires exact square footage calculations and layout planning to avoid mid-job material shortages or excessive over-ordering. Different flooring materials — ceramic tile, hardwood, luxury vinyl plank (LVP), carpet, and laminate — feature unique cut-waste requirements, box coverage specs, and subfloor prep demands.
</p>
<p>
  Our <strong>Flooring Square Footage Calculator</strong> computes total room area for simple rectangular rooms or multi-room layouts. For tile projects, the <strong>Tile Calculator</strong> and <strong>Tile Grout Calculator</strong> determine tile piece counts, grout bag quantities, and mortar requirements based on tile size and joint width.
</p>
<p>
  For wood and resilient floors, the <strong>Hardwood Flooring Calculator</strong> and <strong>Vinyl Plank (LVP) Calculator</strong> convert net square footage into carton box counts. Additionally, tools like the <strong>Floor Leveling Compound Calculator</strong> and <strong>Underlayment Calculator</strong> ensure perfect subfloor prep.
</p>""",
        "benchmarks_h2": "Flooring Industry Benchmarks & Standards",
        "benchmarks_text": """
<p>
  Reference these trade standard waste factors and coverage benchmarks for flooring installations:
</p>
<ul>
  <li><strong>Standard Flooring Waste Factors:</strong> Add 10% waste for straight plank/tile layouts, 15% for diagonal/herringbone patterns, and 5% for large room broadloom carpet.</li>
  <li><strong>LVP Carton Coverage:</strong> Luxury Vinyl Plank (LVP) boxes typically contain 18 to 24 square feet of plank coverage per carton.</li>
  <li><strong>Tile Grout Coverage:</strong> A 10lb bag of sanded tile grout covers ~100 sq ft for 12x12 tile with 1/8\" grout joints, but only ~50 sq ft for 4x4 tile with 1/4\" joints.</li>
  <li><strong>Self-Leveler Yield:</strong> A 50lb bag of self-leveling underlayment compound covers ~24 sq ft at 1/4-inch thickness.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Flooring Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step layout guide to measure rooms and order correct flooring quantities:
</p>
<ol>
  <li><strong>Measure Room Dimensions:</strong> Measure maximum length and width of each room. Break complex or L-shaped rooms into smaller rectangular sections.</li>
  <li><strong>Sum Total Net Square Footage:</strong> Multiply length × width for each section and sum them to obtain total room net square footage.</li>
  <li><strong>Apply Pattern Waste Percentage:</strong> Add 10% for standard straight installations or 15% for diagonal, herringbone, or intricate cut rooms.</li>
  <li><strong>Calculate Product Carton Counts:</strong> Divide gross square footage by square feet per box specified on product packaging and round up to the next full box.</li>
  <li><strong>Calculate Subfloor Prep Materials:</strong> Measure subfloor imperfections to estimate underlayment roll coverage and self-leveling compound bag requirements.</li>
</ol>""",
        "faqs": [
            ("How much extra flooring should I order for waste?",
             "Order 10% extra for standard straight plank or tile layouts. Order 15% extra for diagonal patterns, herringbone designs, or rooms with many alcoves and cuts."),
            ("How do I calculate how many boxes of vinyl plank (LVP) flooring I need?",
             "Multiply room length by width to get square footage, add 10% for waste, then divide by the square feet listed on the LVP box (usually 18 to 24 sq ft). Always round up to the next full box."),
            ("What grout joint width should I use for porcelain or ceramic tile?",
             "Use 1/16-inch to 1/8-inch grout joints for rectified precision porcelain tiles. Use 3/16-inch to 1/4-inch grout joints for non-rectified ceramic tiles or outdoor pavers.")
        ]
    },
    {
        "filename": "drywall-paint.md",
        "category": "drywall-paint",
        "shortName": "Drywall & Paint",
        "title": "Drywall & Paint Calculators: Sheet & Gallon Estimator",
        "description": "Calculate drywall sheet counts, joint compound buckets, wall paint gallon requirements, primer coverage, and ceiling texture quantities.",
        "h1": "Drywall &amp; Painting Material Calculators",
        "hero_p": "Calculate wall and ceiling drywall sheet counts, joint compound mud buckets, interior wall paint gallons, primer coverage, ceiling texture bags, and wall spackle requirements. Explore our specialized calculators built for drywallers and painters.",
        "overview_h2": "Precision Drywall & Paint Material Estimating",
        "overview_text": """
<p>
  Drywall installation and interior painting represent core interior finishing phases for residential and commercial spaces. Accurate surface area takeoff prevents buying excess drywall sheets that damage easily in storage or underestimating paint gallons that leads to color-batch mismatches mid-project.
</p>
<p>
  Our <strong>Drywall Sheet Calculator</strong> converts room wall and ceiling dimensions into exact 4x8 ft or 4x12 ft drywall sheet counts, accounting for window and door cutouts. The <strong>Drywall Joint Compound (Mud) Calculator</strong> estimates 5-gallon bucket requirements for taping, topping, and skim coating seams.
</p>
<p>
  For painting contractors and DIYers, the <strong>Paint Calculator</strong> and <strong>Primer Coverage Calculator</strong> compute exact gallon requirements based on wall square footage, coat counts, and surface porosity. Additionally, tools like the <strong>Ceiling Texture Calculator</strong> ensure complete ceiling finishing prep.
</p>""",
        "benchmarks_h2": "Drywall & Painting Industry Benchmarks",
        "benchmarks_text": """
<p>
  Incorporate these trade standards and material coverage benchmarks into your finishing estimates:
</p>
<ul>
  <li><strong>Drywall Sheet Rule of Thumb:</strong> Multiply total floor square footage by 3.5 to get approximate combined wall and ceiling drywall surface area.</li>
  <li><strong>Paint Gallon Coverage Standard:</strong> One gallon of interior wall paint covers 350 to 400 square feet per coat on smooth primed surfaces (250–300 sq ft on unprimed drywall).</li>
  <li><strong>Joint Compound Mud Ratio:</strong> Budget approximately 135 lbs (or ~9 gallons) of joint compound mud per 1,000 square feet of installed drywall.</li>
  <li><strong>Drywall Tape Ratio:</strong> One 500-foot roll of paper drywall tape covers approximately 1,000 square feet of installed drywall surface area.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Drywall & Paint Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to measure walls and calculate finishing supplies:
</p>
<ol>
  <li><strong>Calculate Total Wall Surface Area:</strong> Measure perimeter wall feet and multiply by ceiling height. Add ceiling square footage (length × width).</li>
  <li><strong>Deduct Door &amp; Window Openings:</strong> Subtract 15 sq ft per standard window and 20 sq ft per standard door opening.</li>
  <li><strong>Calculate Drywall Sheet Count:</strong> Divide net square footage by 32 (for 4x8 ft sheets) or 48 (for 4x12 ft sheets) and add 10% waste for cutoffs.</li>
  <li><strong>Calculate Primer and Paint Gallons:</strong> Divide net wall surface area by 350 sq ft per gallon. Multiply by 2 for standard two-coat coverage applications.</li>
  <li><strong>Estimate Taping &amp; Joint Mud Needs:</strong> Calculate joint compound buckets (1 pail per 500 sq ft) and paper tape rolls based on total drywall board feet.</li>
</ol>""",
        "faqs": [
            ("How many 4x8 sheets of drywall do I need for a 12x15 foot room?",
             "A 12x15 ft room with 8 ft ceilings has 432 sq ft of wall area and 180 sq ft of ceiling area (612 sq ft total). Dividing 612 by 32 sq ft per sheet yields ~20 sheets of 4x8 drywall including waste."),
            ("How many square feet does one gallon of paint cover?",
             "One gallon of paint covers 350 to 400 square feet per coat on smooth, primed walls. On porous unprimed drywall or heavily textured surfaces, coverage drops to 250–300 sq ft per gallon."),
            ("Should I use 4x8 or 4x12 drywall sheets?",
             "Use 4x12 sheets for walls or ceilings over 12 feet long to minimize vertical seams. Seams take significant time to tape and mud, so larger sheets yield a smoother finish with less labor.")
        ]
    },
    {
        "filename": "insulation-hvac.md",
        "category": "insulation-hvac",
        "shortName": "Insulation & HVAC",
        "title": "Insulation & HVAC Calculators: BTU & R-Value",
        "description": "Calculate HVAC BTU requirements, R-value insulation needs, AC tonnage, duct sizing, heat loss, and spray foam volume.",
        "h1": "Insulation &amp; HVAC Sizing Calculators",
        "hero_p": "Calculate heating &amp; cooling BTU capacity, AC tonnage, insulation thermal R-value, duct airflow sizing, building heat loss/gain, and spray foam insulation volume. Explore our specialized calculators engineered for HVAC technicians and builders.",
        "overview_h2": "Precision HVAC Sizing & Thermal Insulation Math",
        "overview_text": """
<p>
  Heating, ventilation, air conditioning (HVAC), and thermal insulation systems dictate indoor thermal comfort, energy efficiency, and monthly utility overhead. Sizing HVAC equipment incorrectly leads to severe performance problems — undersized systems fail to maintain set temperatures, while oversized units short-cycle, causing high humidity and premature compressor failure.
</p>
<p>
  Our <strong>BTU HVAC Sizing Calculator</strong> estimates precise heating and cooling load requirements based on room square footage, climate zone, ceiling height, and window exposure. The <strong>AC Tonnage Calculator</strong> converts cooling BTU capacity into standard air conditioner tonnage (12,000 BTU/hr per ton).
</p>
<p>
  For building envelope design, the <strong>R-Value Insulation Calculator</strong> and <strong>Spray Foam Insulation Calculator</strong> determine board feet, thermal resistance layers, and code compliance. Additionally, specialized tools like the <strong>Duct Sizing Calculator</strong> ensure proper system CFM airflow velocity.
</p>""",
        "benchmarks_h2": "HVAC & Insulation Building Code Standards",
        "benchmarks_text": """
<p>
  Apply these standard thermal design benchmarks and IECC energy code guidelines:
</p>
<ul>
  <li><strong>Cooling Tonnage Conversion:</strong> 1 Ton of air conditioning capacity equals 12,000 BTU per hour of cooling output.</li>
  <li><strong>General Cooling Rule of Thumb:</strong> Budget approximately 20 BTU per square foot of living space for standard residential ceiling heights in moderate climates.</li>
  <li><strong>Attic R-Value Code Standard:</strong> Modern US energy codes (IECC) recommend R-38 to R-60 attic insulation depending on climate zone.</li>
  <li><strong>Exterior Wall R-Value Standard:</strong> 2x4 wall framing requires R-13 to R-15 insulation; 2x6 wall framing accommodates R-19 to R-21 fiberglass batts or dense-pack cellulose.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical HVAC Load Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step procedure to estimate thermal load and size equipment accurately:
</p>
<ol>
  <li><strong>Calculate Total Conditioned Volume:</strong> Measure room length × width × ceiling height to obtain interior room cubic footage.</li>
  <li><strong>Determine Climate Zone BTU Multiplier:</strong> Select climate zone factor (20 BTU/sq ft for mild climates up to 35–40 BTU/sq ft for extreme hot/cold zones).</li>
  <li><strong>Adjust for Window and Sun Exposure:</strong> Add 10% to 15% capacity for south/west facing glass windows, high occupant loads, or commercial kitchens.</li>
  <li><strong>Convert Total Cooling BTU to AC Tonnage:</strong> Divide total calculated cooling BTU capacity by 12,000 to determine equipment tonnage.</li>
  <li><strong>Determine Insulation Depth for Target R-Value:</strong> Divide target R-value by R-value per inch of insulation material (e.g., fiberglass = R-3.2/inch, spray foam = R-6.5/inch).</li>
</ol>""",
        "faqs": [
            ("How many BTUs per square foot do I need for air conditioning?",
             "As a rule of thumb, you need 20 BTUs per square foot of living space. A 1,000 sq ft home in a moderate climate requires approximately 20,000 BTUs (or a 2-ton AC unit)."),
            ("What size AC unit do I need for a 2,000 square foot house?",
             "A 2,000 sq ft house typically requires a 3.5-ton to 4-ton central air conditioning system (42,000 to 48,000 BTUs) depending on climate zone, insulation quality, and window exposure."),
            ("What is the difference between open-cell and closed-cell spray foam insulation?",
             "Open-cell spray foam provides R-3.5 to R-3.8 per inch and acts as an air barrier. Closed-cell spray foam provides R-6.5 to R-7.0 per inch, acts as a vapor barrier, and adds structural wall strength.")
        ]
    },
    {
        "filename": "landscaping-outdoor.md",
        "category": "landscaping-outdoor",
        "shortName": "Landscaping & Outdoor",
        "title": "Landscaping Calculators: Mulch, Sod & Pavers",
        "description": "Estimate mulch cubic yards, sod rolls, paver quantities, topsoil volume, gravel driveway base, fence pickets, and retaining walls.",
        "h1": "Landscaping &amp; Outdoor Living Calculators",
        "hero_p": "Calculate bulk mulch cubic yards, sod grass pallets, patio paver counts, topsoil cubic yards, aggregate gravel tonnage, fence post/picket quantities, and retaining wall blocks. Explore our specialized calculators built for landscapers and hardscapers.",
        "overview_h2": "Precision Outdoor Living & Landscape Material Math",
        "overview_text": """
<p>
  Landscaping and hardscaping projects involve bulk materials — earth, stone, gravel, wood, and turf — sold in cubic yards, tons, pallets, or individual unit counts. Accurate material volume math prevents overpaying for bulk truck delivery fees or running short of base aggregate mid-installation.
</p>
<p>
  Our <strong>Mulch Calculator</strong> computes bulk cubic yards and 2-cu-ft bag counts required for flower beds at 2-inch to 4-inch coverage depths. For lawn installs, the <strong>Sod Grass Calculator</strong> converts yard square footage into square feet, sod rolls, and full 450-sq-ft pallets.
</p>
<p>
  For hardscaping, the <strong>Paver Calculator</strong> and <strong>Retaining Wall Block Calculator</strong> calculate unit counts, sand bed depth, and crushed stone base tonnage. Additionally, tools like the <strong>Fence Post &amp; Picket Calculator</strong> optimize wooden or vinyl fence material orders.
</p>""",
        "benchmarks_h2": "Landscaping & Hardscaping Key Benchmarks",
        "benchmarks_text": """
<p>
  Incorporate these practical bulk material coverage rules and trade benchmarks:
</p>
<ul>
  <li><strong>Cubic Yard Coverage Standard:</strong> One cubic yard of material (27 cu ft) covers 324 sq ft at 1 inch deep, 162 sq ft at 2 inches deep, or 108 sq ft at 3 inches deep.</li>
  <li><strong>Sod Pallet Size Standard:</strong> A standard pallet of sod contains 450 to 500 square feet of grass (50 rolls or 100 mini-slabs).</li>
  <li><strong>Bulk Material Weight Conversion:</strong> One cubic yard of gravel/aggregate weighs ~1.4 to 1.5 tons (2,800–3,000 lbs); topsoil weighs ~1.1 to 1.3 tons.</li>
  <li><strong>Retaining Wall Base Requirement:</strong> Retaining walls require a minimum 6-inch compacted crushed stone base and 1 inch of buried block depth per foot of wall height.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Landscape Material Ordering Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to measure outdoor spaces and calculate bulk supplies:
</p>
<ol>
  <li><strong>Measure Garden &amp; Patio Areas:</strong> Measure garden bed or patio length and width. Break curved landscape beds into simple geometric shapes (rectangles and circles).</li>
  <li><strong>Determine Material Depth in Feet:</strong> Convert desired depth in inches to decimal feet (e.g., 3 inches depth = 3 ÷ 12 = 0.25 ft).</li>
  <li><strong>Calculate Cubic Yard Volume:</strong> Multiply area in sq ft by depth in ft to get cubic feet, then divide by 27 to obtain bulk cubic yards.</li>
  <li><strong>Convert Bulk Volume to Tonnage (For Aggregate/Soil):</strong> Multiply cubic yards by 1.4 for gravel aggregate or 1.2 for topsoil to calculate delivery truck tonnage.</li>
  <li><strong>Calculate Hardscape Unit Counts &amp; Waste:</strong> Divide patio area by individual paver square footage and add 10% waste for border edge cuts.</li>
</ol>""",
        "faqs": [
            ("How many cubic yards of mulch do I need for 500 square feet?",
             "At a standard 3-inch depth, 500 square feet requires ~4.6 cubic yards of bulk mulch (or ~63 bags of 2-cubic-foot bagged mulch)."),
            ("How many square feet of grass are on a pallet of sod?",
             "A standard pallet of sod covers 450 to 500 square feet. This typically consists of 50 individual rolls (3x1.5 ft) or 100 pallets/mini-slabs (2x2.5 ft)."),
            ("How deep should the gravel base be under a paver patio?",
             "A residential walkway or patio requires a 4 to 6 inch compacted crushed stone base (3/4-minus aggregate) topped with a 1-inch bedding layer of concrete sand.")
        ]
    },
    {
        "filename": "home-decor-interior.md",
        "category": "home-decor-interior",
        "shortName": "Home Decor & Interior",
        "title": "Interior Decor Calculators: Wallpaper & Crown Molding",
        "description": "Calculate wallpaper rolls, crown molding linear feet, curtain fabric lengths, rug sizing, gallery wall spacing, and baseboard trim.",
        "h1": "Interior Decor &amp; Finishing Calculators",
        "hero_p": "Calculate wallpaper roll counts with pattern repeats, crown molding linear feet, curtain &amp; drape fabric yardage, room rug sizing, gallery wall art spacing, and baseboard trim. Explore our specialized calculators built for interior designers and decorators.",
        "overview_h2": "Precision Interior Finishing & Decor Estimating",
        "overview_text": """
<p>
  Interior decorating and finish carpentry transform architectural structures into polished living environments. Precision measurements are essential when purchasing high-end wallpaper, custom drapery fabric, architectural trim molding, or gallery wall art to ensure flawless aesthetic alignment and eliminate material waste.
</p>
<p>
  Our <strong>Wallpaper Calculator</strong> estimates double roll counts for accent walls or full room installs, accounting for pattern repeat waste. The <strong>Crown Molding Calculator</strong> and <strong>Baseboard Trim Calculator</strong> determine total linear feet required plus 15% corner miter cut waste.
</p>
<p>
  For window treatments and layout design, the <strong>Curtain &amp; Drape Fabric Calculator</strong> computes fabric yardage based on fullness ratios. Additionally, tools like the <strong>Gallery Wall Spacing Calculator</strong> and <strong>Rug Size Calculator</strong> optimize room proportions.
</p>""",
        "benchmarks_h2": "Interior Decor & Trim Design Rules",
        "benchmarks_text": """
<p>
  Apply these standard interior design guidelines and architectural proportions:
</p>
<ul>
  <li><strong>Single vs. Double Wallpaper Roll Standard:</strong> Standard US single rolls cover ~28 sq ft; double rolls cover ~56 sq ft (usable coverage ~40–45 sq ft after pattern match).</li>
  <li><strong>Trim Cut Waste Factor:</strong> Add 15% waste to linear trim measurements to account for 45-degree miter cuts and scarf joint waste.</li>
  <li><strong>Drapery Fullness Multiplier:</strong> Custom drapes require 2x to 2.5x the window width in total fabric width to achieve proper elegant folds when closed.</li>
  <li><strong>Gallery Wall Artwork Hanging Height:</strong> Center artwork horizontally at 57 to 60 inches from the floor (eye level standard in art galleries).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Interior Decor Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to measure walls and order interior decor materials:
</p>
<ol>
  <li><strong>Measure Wall Dimensions:</strong> Measure wall width and ceiling height in inches. Calculate total gross wall surface area.</li>
  <li><strong>Subtract Large Openings:</strong> Deduct doors and large windows only if they exceed 30 square feet; small windows should remain in gross area for wallpaper pattern matching.</li>
  <li><strong>Adjust for Pattern Repeat Waste:</strong> For wallpaper with pattern repeats over 12 inches, add 15% to 20% extra roll allowance.</li>
  <li><strong>Calculate Linear Trim Footage:</strong> Sum room perimeter wall lengths in feet, subtract door openings, and add 15% for miter cuts.</li>
  <li><strong>Determine Drapery Fabric Yardage:</strong> Multiply window width by 2.25 for fullness, add header/hem seam allowances (16 inches), and convert total inches to yards (÷ 36).</li>
</ol>""",
        "faqs": [
            ("How do I calculate how many rolls of wallpaper I need?",
             "Multiply wall width by height to get square footage. Divide by usable coverage per double roll (typically 45 sq ft accounting for pattern match waste) and round up."),
            ("How much extra crown molding or baseboard trim should I buy for cut waste?",
             "Buy 15% extra linear feet of trim stock to account for 45-degree miter corner cuts, scarf joints, and removing damaged wood ends."),
            ("What size area rug should I buy for my living room?",
             "An area rug should be large enough to anchor the room. In living rooms, aim for a rug where at least the front two legs of all major seating furniture rest on the rug (typically 8x10 or 9x12 ft).")
        ]
    },
    {
        "filename": "project-cost-planning.md",
        "category": "project-cost-planning",
        "shortName": "Project Cost & Planning",
        "title": "Remodeling Cost Calculators: Planning & Margins",
        "description": "Estimate home renovation budgets, kitchen/bathroom remodeling costs, contractor markups, labor billing rates, and project timelines.",
        "h1": "Project Cost &amp; Remodeling Planning Calculators",
        "hero_p": "Estimate home renovation budgets, kitchen &amp; bathroom remodeling costs, contractor markup percentages, labor billing rates, contractor vs. employee overhead, and project completion timelines. Explore our specialized calculators built for general contractors and homeowners.",
        "overview_h2": "Comprehensive Construction Financial Planning",
        "overview_text": """
<p>
  Construction project cost planning and contractor financial management determine whether a renovation delivers high ROI or leads to severe budget overruns. Managing construction projects requires accurate estimation of direct materials, trade labor rates, subcontractor quotes, general conditions overhead, and contractor profit markups.
</p>
<p>
  Our <strong>Kitchen Remodel Cost Calculator</strong> and <strong>Bathroom Remodel Cost Calculator</strong> provide comprehensive room-by-room budget breakdowns based on scope tiers. For general contractors, the <strong>Contractor Markup Calculator</strong> and <strong>Contractor Labor Cost Calculator</strong> compute fully burdened hourly billing rates to ensure target gross margins.
</p>
<p>
  To estimate project duration, the <strong>Project Timeline Estimator</strong> maps critical path schedules. Additionally, tools like the <strong>Building Permit Cost Estimator</strong> and <strong>Renovation ROI Calculator</strong> help evaluate project feasibility.
</p>""",
        "benchmarks_h2": "Construction Financial & Margin Benchmarks",
        "benchmarks_text": """
<p>
  Track these industry margin benchmarks and financial standards for construction management:
</p>
<ul>
  <li><strong>Contractor Gross Margin Benchmark:</strong> General remodeling contractors target 30% to 40% gross profit margin (which requires a 42% to 67% markup on direct costs).</li>
  <li><strong>Contingency Reserve Standard:</strong> Include a 10% to 15% financial contingency budget for minor remodel projects, and 20% for historic home gut renovations.</li>
  <li><strong>Fully Burdened Labor Multiplier:</strong> Labor burden (payroll taxes, workers comp, benefits, insurance) adds 25% to 40% to base hourly employee wages.</li>
  <li><strong>Home Renovation Value Rule:</strong> Spending more than 15% of total home value on a single kitchen remodel or 10% on a bathroom rarely yields a 100% dollar-for-dollar resale ROI.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Construction Budgeting Guide",
        "guide_text": """
<p>
  Follow this step-by-step financial framework to estimate construction projects:
</p>
<ol>
  <li><strong>Define Detailed Scope of Work (SOW):</strong> Itemize every task by CSI division (demolition, framing, plumbing, electrical, finishes).</li>
  <li><strong>Perform Direct Material Takeoffs:</strong> Calculate raw material costs including waste allowances for all trades.</li>
  <li><strong>Estimate Direct Trade Labor Hours:</strong> Calculate trade crew labor hours and apply fully burdened hourly rates (base wage + taxes + insurance).</li>
  <li><strong>Apply General Overhead &amp; Profit Markup:</strong> Multiply total direct costs (materials + labor + subs) by contractor markup percentage (e.g., 1.35 for 26% gross margin).</li>
  <li><strong>Add Dedicated Contingency Budget:</strong> Reserve an unallocated 15% contingency cash buffer to absorb unexpected hidden field conditions.</li>
</ol>""",
        "faqs": [
            ("What is the difference between contractor markup and margin?",
             "Markup is the percentage added to direct costs to set a selling price (e.g., $100 cost × 1.35 = $135 price). Margin is the profit percentage of the total selling price ($35 profit ÷ $135 price = 26% margin)."),
            ("How much contingency buffer should I add to a renovation budget?",
             "Add a 10% to 15% contingency budget for standard interior remodels. For older historic homes or major structural alterations, increase the contingency buffer to 20%."),
            ("What is the average cost per square foot for a home addition?",
             "Residential home additions generally cost $150 to $300+ per square foot depending on structural complexity, plumbing fixtures, regional labor rates, and finish quality.")
        ]
    },
    {
        "filename": "electrical.md",
        "category": "electrical",
        "shortName": "Electrical",
        "title": "Electrical Calculators: Amperage, Wire & Breakers",
        "description": "Calculate electrical load amperage, wire gauge AWG sizes, circuit breaker sizing, outlet spacing, lighting layout, and generator capacity.",
        "h1": "Electrical &amp; Wiring Sizing Calculators",
        "hero_p": "Calculate total electrical panel load amperage, wire gauge AWG sizes for voltage drop, circuit breaker sizing, NEC outlet receptacle spacing, lighting fixture layouts, and emergency generator capacity. Explore our specialized calculators built for electricians and engineers.",
        "overview_h2": "Precision Electrical Load & Wiring Sizing",
        "overview_text": """
<p>
  Electrical design and branch circuit wiring must adhere strictly to National Electrical Code (NEC) safety standards to prevent electrical fires, equipment damage, and dangerous voltage drops. Calculating panel load amperage, wire gauge AWG sizes, circuit breaker protection, and conductor ampacity is essential for safe installations.
</p>
<p>
  Our <strong>Electrical Load &amp; Amperage Calculator</strong> computes total residential service panel demand loads in amps based on square footage and appliance wattage. The <strong>Wire Gauge (AWG) Calculator</strong> determines proper copper/aluminum wire sizes based on circuit current and distance voltage drop.
</p>
<p>
  For circuit protection, the <strong>Circuit Breaker Sizing Calculator</strong> applies NEC 80% continuous load safety factors. Additionally, tools like the <strong>Outlet Spacing Calculator</strong> and <strong>Generator Sizing Calculator</strong> ensure code compliance and emergency backup reliability.
</p>""",
        "benchmarks_h2": "Electrical Code (NEC) Key Standards",
        "benchmarks_text": """
<p>
  Incorporate these National Electrical Code (NEC) standards into electrical calculations:
</p>
<ul>
  <li><strong>NEC 80% Continuous Load Rule:</strong> Branch circuit breakers must not exceed 80% of their rated capacity for continuous loads running 3+ hours (e.g., 16A max on a 20A breaker).</li>
  <li><strong>Maximum Voltage Drop Standard:</strong> NEC recommends keeping total voltage drop under 3% for branch circuits and under 5% combined for feeder and branch circuits.</li>
  <li><strong>Standard Receptacle Wire Sizes:</strong> 15-Amp circuits require 14 AWG copper wire; 20-Amp circuits require 12 AWG copper wire; 30-Amp circuits require 10 AWG copper wire.</li>
  <li><strong>NEC Outlet Spacing Rule (12-Foot Rule):</strong> Receptacles must be placed so that no point along a wall line is more than 6 feet horizontally from an outlet (max 12 ft between outlets).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Electrical Calculation Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to size branch circuits and select wire gauges safely:
</p>
<ol>
  <li><strong>Calculate Connected Load Wattage:</strong> Sum the operating wattage of all connected lights, appliances, and equipment on the target circuit.</li>
  <li><strong>Apply Continuous Load Safety Factor:</strong> Multiply continuous load wattage by 1.25 (125%) to satisfy NEC 80% breaker safety rules.</li>
  <li><strong>Calculate Circuit Amperage Demand:</strong> Divide total safety-adjusted watts by circuit voltage (120V or 240V) to find required breaker amperage rating (Amps = Watts ÷ Volts).</li>
  <li><strong>Select Conductor AWG Wire Gauge:</strong> Match required breaker amperage to standard copper conductor ampacity tables (14 AWG for 15A, 12 AWG for 20A, 10 AWG for 30A).</li>
  <li><strong>Adjust Wire Gauge for Long Distance Voltage Drop:</strong> If wire length exceeds 100 feet, upscale wire gauge by one size to keep voltage drop below 3%.</li>
</ol>""",
        "faqs": [
            ("What wire gauge do I need for a 20-amp circuit breaker?",
             "A 20-amp circuit breaker requires a minimum of 12 AWG copper wire. Never use 14 AWG wire on a 20-amp breaker as it poses a serious fire hazard."),
            ("What is the NEC 80% rule for circuit breakers?",
             "The NEC 80% rule states that a circuit breaker should not carry a continuous load (running 3 hours or more) exceeding 80% of its rated capacity (e.g., 16 amps max continuous on a 20A breaker)."),
            ("How do I calculate generator size for whole-house backup power?",
             "Sum the running wattage of essential appliances (refrigerator, lights, HVAC, well pump) and add the single highest starting (surge) wattage. A typical home requires an 8,000W to 12,000W generator.")
        ]
    },
    {
        "filename": "plumbing.md",
        "category": "plumbing",
        "shortName": "Plumbing",
        "title": "Plumbing Calculators: Pipe Sizing & Water Heaters",
        "description": "Calculate supply pipe diameter, water pressure drop, water heater tank sizing, septic tank capacity, and French drain gravel fill.",
        "h1": "Plumbing &amp; Water System Calculators",
        "hero_p": "Calculate water supply pipe diameter sizing, pipe friction pressure loss, tankless &amp; storage water heater sizing, septic tank capacity, and French drain gravel volume. Explore our specialized calculators engineered for plumbers and system designers.",
        "overview_h2": "Precision Plumbing & Water System Sizing",
        "overview_text": """
<p>
  Plumbing system design demands accurate hydraulic calculations to ensure proper water volume flow, adequate fixture pressure, efficient drainage, and reliable water heating. Sizing supply lines or drainage pipes incorrectly causes weak shower pressure, noisy water hammer, or dangerous sewage backups.
</p>
<p>
  Our <strong>Pipe Sizing Calculator</strong> calculates optimal supply line diameters based on Fixture Units (WSFU) and allowable flow velocity. The <strong>Water Pressure Loss Calculator</strong> computes friction head loss across long pipe runs using the Hazen-Williams hydraulic formula.
</p>
<p>
  For hot water systems, the <strong>Water Heater Sizing Calculator</strong> determines tank capacity or tankless GPM flow rate requirements. Additionally, tools like the <strong>Septic Tank Sizing Calculator</strong> and <strong>French Drain Calculator</strong> optimize drainage and waste management.
</p>""",
        "benchmarks_h2": "Plumbing Code (UPC/IPC) Key Benchmarks",
        "benchmarks_text": """
<p>
  Reference these standard Uniform Plumbing Code (UPC) and International Plumbing Code (IPC) guidelines:
</p>
<ul>
  <li><strong>Residential Water Pressure Target:</strong> Ideal household water pressure ranges between 45 PSI and 60 PSI (pressure above 80 PSI requires a Pressure Reducing Valve).</li>
  <li><strong>Maximum Flow Velocity Limit:</strong> Water velocity in copper supply lines should not exceed 8 feet per second for cold water or 5 feet per second for hot water to prevent erosion.</li>
  <li><strong>Water Heater First Hour Rating (FHR):</strong> Storage water heater sizing depends on Peak Hour Demand (FHR), requiring ~40–50 gallons for a 3-to-4 person household.</li>
  <li><strong>Tankless GPM Temperature Rise:</strong> Tankless water heaters must deliver sufficient GPM flow at local groundwater delta temperatures (e.g., 3.5 GPM at a 50°F temp rise).</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Plumbing Sizing Guide",
        "guide_text": """
<p>
  Follow this step-by-step hydraulic procedure to size water supply lines and heaters:
</p>
<ol>
  <li><strong>Audit Total Fixture Units (WSFU):</strong> Assign Water Supply Fixture Units to all planned appliances and fixtures (e.g., toilet = 2.5 WSFU, shower = 2.0 WSFU).</li>
  <li><strong>Sum Total System Demand GPM:</strong> Convert total WSFU count to peak gallons per minute (GPM) demand using standard IPC conversion curves.</li>
  <li><strong>Determine Main Supply Line Diameter:</strong> Select main supply line size (typically 3/4-inch or 1-inch) to maintain flow velocity under 8 feet per second.</li>
  <li><strong>Calculate Pipe Friction Pressure Drop:</strong> Calculate friction pressure loss over total pipe distance and fittings to ensure at least 30 PSI arrives at top-floor fixtures.</li>
  <li><strong>Calculate Water Heater Peak GPM:</strong> Sum GPM of fixtures expected to run simultaneously to size tankless heaters or evaluate storage FHR ratings.</li>
</ol>""",
        "faqs": [
            ("What size main water supply line is needed for a residential home?",
             "A standard residential home requires a minimum 3/4-inch main water supply line. Larger homes with 3+ bathrooms or irrigation systems should use a 1-inch main supply line."),
            ("How do I size a tankless water heater?",
             "Size a tankless water heater by adding the simultaneous GPM flow rates of all hot water fixtures you plan to run at once, then matching that GPM to your local incoming groundwater temperature rise."),
            ("What size septic tank is required for a 4-bedroom house?",
             "Building codes typically require a minimum 1,200 to 1,500 gallon septic tank for a 4-bedroom single-family home.")
        ]
    },
    {
        "filename": "windows-doors.md",
        "category": "windows-doors",
        "shortName": "Windows & Doors",
        "title": "Window & Door Calculators: U-Value & Framing",
        "description": "Calculate window U-value energy loss, door frame framing materials, window casing linear footage, skylight dimensions, and blinds.",
        "h1": "Windows &amp; Doors Sizing Calculators",
        "hero_p": "Calculate window thermal energy loss (U-value &amp; SHGC), rough opening framing materials, window casing trim linear footage, skylight sizing, and window treatment blinds. Explore our specialized calculators built for carpenters and glazing contractors.",
        "overview_h2": "Precision Window & Door Thermal & Framing Math",
        "overview_text": """
<p>
  Windows and exterior doors dictate both the architectural character and thermal energy performance of a building. Windows and glazed doors account for up to 30% of residential heating and cooling energy loss, making precise U-value thermal analysis, Solar Heat Gain Coefficient (SHGC) selection, and rough opening framing critical.
</p>
<p>
  Our <strong>Window U-Value Energy Loss Calculator</strong> computes heat loss in BTUs and annual heating bill impacts across single, double, and triple-pane windows. The <strong>Door Frame Material Calculator</strong> determines rough opening framing lumber, king studs, jack trimmers, and header dimensions.
</p>
<p>
  For interior finishing, the <strong>Window Trim &amp; Casing Calculator</strong> estimates linear feet of casing trim stock required. Additionally, specialized tools like the <strong>Skylight Sizing Calculator</strong> and <strong>Window Blinds Calculator</strong> optimize daylighting and window treatments.
</p>""",
        "benchmarks_h2": "Window & Door Energy (ENERGY STAR) Benchmarks",
        "benchmarks_text": """
<p>
  Incorporate these ENERGY STAR performance specifications and framing rules into your calculations:
</p>
<ul>
  <li><strong>Window U-Factor Benchmark:</strong> Lower U-factor means better insulation. Northern climate ENERGY STAR windows require U-factor ≤ 0.27; Southern climates target U-factor ≤ 0.32.</li>
  <li><strong>Solar Heat Gain Coefficient (SHGC):</strong> Measures blocked solar heat (0 to 1 scale). Southern climates target low SHGC ≤ 0.23 to reduce cooling costs; Northern climates benefit from higher SHGC ~0.40.</li>
  <li><strong>Rough Opening (RO) Rule of Thumb:</strong> Rough framing openings for windows and doors should be 1/2 inch wider and 1/2 inch taller than actual window unit frame dimensions.</li>
  <li><strong>Skylight Daylighting Standard:</strong> Skylight glass area should not exceed 5% of floor room area in rooms with multiple windows, or 10% in rooms without windows.</li>
</ul>""",
        "guide_h2": "Step-by-Step Practical Window & Door Takeoff Guide",
        "guide_text": """
<p>
  Follow this step-by-step checklist to measure windows, calculate rough openings, and estimate trim:
</p>
<ol>
  <li><strong>Measure Window Unit Frame Dimensions:</strong> Measure exact window frame width and height at three points (top, middle, bottom) and record the smallest measurement.</li>
  <li><strong>Calculate Rough Opening (RO) Dimensions:</strong> Add 1/2 inch to measured frame width and 1/2 inch to height to allow for leveling shims and expanding foam insulation.</li>
  <li><strong>Evaluate Thermal Energy Loss (U-Value):</strong> Multiply window total area by U-factor and local heating degree days (HDD) to calculate annual heat loss in BTUs.</li>
  <li><strong>Calculate Window Trim &amp; Casing Footage:</strong> Calculate perimeter distance around window frame [(2 × height) + (2 × width)], add 10% for miter cuts, and convert to linear feet.</li>
  <li><strong>Verify Structural Header Sizing:</strong> Ensure structural headers over wide window openings (over 4 ft) are properly sized (e.g., double 2x8 or double 2x10) to support roof loads.</li>
</ol>""",
        "faqs": [
            ("What is the difference between U-value and R-value for windows?",
             "U-value measures the rate of heat transfer through a window (lower is better). R-value measures thermal resistance (higher is better). U-value is the mathematical inverse of R-value (R = 1 ÷ U)."),
            ("How do I calculate rough opening size for a window?",
             "Add 1/2 inch to the exact width and 1/2 inch to the exact height of the window unit frame. This provides a 1/4-inch perimeter gap for shims, squaring, and insulation foam."),
            ("What is Solar Heat Gain Coefficient (SHGC) and why does it matter?",
             "SHGC measures the fraction of solar radiation admitted through a window. In hot sunny climates, a low SHGC (under 0.25) blocks solar heat and drastically lowers summer AC bills.")
        ]
    }
]

def build_construction():
    for p in construction_pages:
        rel_grid = get_related_grid("construction", p["category"])
        
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
    build_construction()
