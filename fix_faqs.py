import re

# 1. high-yield-savings-calculator.md
f = 'd:/crycal/high-yield-savings-calculator.md'
t = open(f, encoding='utf-8').read()
t = re.sub(
    r'faq:.*?(?=\n---)',
    r'''faq:
  - question: "What is a high-yield savings account?"
    answer: "A high-yield savings account (HYSA) offers a much higher annual percentage yield (APY) than traditional savings accounts, typically paying 10 to 20 times more interest."
  - question: "How much interest will I earn in a high-yield savings account?"
    answer: "You can calculate exact high-yield savings interest by inputting your initial deposit, monthly contributions, APY, and time period into a savings calculator."
  - question: "What is the current best APY for high-yield savings accounts?"
    answer: "Top high-yield savings account (HYSA) rates typically range from 4% to 5% APY in current markets, though you must verify exact daily rates with individual banks."
  - question: "How does compounding frequency affect my savings?"
    answer: "More frequent interest compounding, such as daily versus monthly, yields slightly higher returns because the bank calculates and adds interest to your balance more often."''',
    t, flags=re.DOTALL
)
t = re.sub(
    r'## High Yield Savings Calculator Frequently Asked Questions.*',
    r'''## High Yield Savings Calculator Frequently Asked Questions

### What is a high-yield savings account?

A high-yield savings account (HYSA) offers a much higher annual percentage yield (APY) than traditional savings accounts, typically paying 10 to 20 times more interest.

### How much interest will I earn in a high-yield savings account?

You can calculate exact high-yield savings interest by inputting your initial deposit, monthly contributions, APY, and time period into a savings calculator.

### What is the current best APY for high-yield savings accounts?

Top high-yield savings account (HYSA) rates typically range from 4% to 5% APY in current markets, though you must verify exact daily rates with individual banks.

### How does compounding frequency affect my savings?

More frequent interest compounding, such as daily versus monthly, yields slightly higher returns because the bank calculates and adds interest to your balance more often.
''',
    t, flags=re.DOTALL
)
open(f, 'w', encoding='utf-8').write(t)

# 2. hot-tub-pad-size-calculator.md
f = 'd:/crycal/hot-tub-pad-size-calculator.md'
t = open(f, encoding='utf-8').read()
t = re.sub(
    r'faq:.*?(?=\n---)',
    r'''faq:
  - question: "How thick should a concrete pad be for a hot tub?"
    answer: "A concrete pad for a small 2-person hot tub should be at least 4 inches thick, while medium to large 6-8 person spas require a 6-inch thickness reinforced with #3 rebar mesh."
  - question: "How much does a filled hot tub weigh?"
    answer: "A filled 7ft x 7ft hot tub weighs over 5,100 pounds, combining an 800-pound dry weight with 400 gallons of water and six adult bathers."
  - question: "What is the recommended concrete pad size for a 7x7 hot tub?"
    answer: "A 7ft x 7ft hot tub requires a 9ft x 9ft concrete slab to provide a 12-inch overhang on all sides for entry steps, cover lifter clearance, and maintenance access."
  - question: "Can I put a hot tub on pavers instead of concrete?"
    answer: "You should not install a hot tub directly on pavers unless they sit on a 6-inch compacted crushed gravel base with polymeric sand seams, as unsupported pavers will settle unevenly and crack the tub shell."
  - question: "How much does a concrete hot tub pad cost?"
    answer: "Pouring a 9ft x 9ft by 6-inch concrete hot tub slab costs $150 to $250 for DIY materials, or $800 to $1,500 for professional contractor pouring."
  - question: "How long should concrete cure before placing a hot tub on it?"
    answer: "You must allow a concrete hot tub pad to cure for at least 7 days before placing an empty hot tub on it, and 14 to 28 days before filling it with water."''',
    t, flags=re.DOTALL
)
t = re.sub(
    r'## Hot Tub Pad Size Calculator Frequently Asked Questions.*',
    r'''## Hot Tub Pad Size Calculator Frequently Asked Questions

### How thick should a concrete pad be for a hot tub?

A concrete pad for a small 2-person hot tub should be at least 4 inches thick, while medium to large 6-8 person spas require a 6-inch thickness reinforced with #3 rebar mesh.

### How much does a filled hot tub weigh?

A filled 7ft x 7ft hot tub weighs over 5,100 pounds, combining an 800-pound dry weight with 400 gallons of water and six adult bathers.

### What is the recommended concrete pad size for a 7x7 hot tub?

A 7ft x 7ft hot tub requires a 9ft x 9ft concrete slab to provide a 12-inch overhang on all sides for entry steps, cover lifter clearance, and maintenance access.

### Can I put a hot tub on pavers instead of concrete?

You should not install a hot tub directly on pavers unless they sit on a 6-inch compacted crushed gravel base with polymeric sand seams, as unsupported pavers will settle unevenly and crack the tub shell.

### How much does a concrete hot tub pad cost?

Pouring a 9ft x 9ft by 6-inch concrete hot tub slab costs $150 to $250 for DIY materials, or $800 to $1,500 for professional contractor pouring.

### How long should concrete cure before placing a hot tub on it?

You must allow a concrete hot tub pad to cure for at least 7 days before placing an empty hot tub on it, and 14 to 28 days before filling it with water.
''',
    t, flags=re.DOTALL
)
open(f, 'w', encoding='utf-8').write(t)

# 3. ice-water-shield-calculator.md
f = 'd:/crycal/ice-water-shield-calculator.md'
t = open(f, encoding='utf-8').read()
t = re.sub(
    r'faq:.*?(?=\n---)',
    r'''faq:
  - question: "What is ice & water shield?"
    answer: "Ice and water shield is a self-adhering rubberized asphalt membrane installed under shingles to seal around nails and prevent leaks caused by ice dams or wind-driven rain."
  - question: "What is the building code requirement for eave ice barrier protection?"
    answer: "The International Residential Code requires ice barrier membranes in areas with ice damming history to extend from the eave edge to a point at least 24 inches inside the exterior wall line."
  - question: "How many courses (passes) of ice and water shield do I need?"
    answer: "A roof with an 18-inch overhang and 6-inch wall requires two courses of ice and water shield along the eave to achieve the required 24 inches of interior coverage."
  - question: "How wide is a standard roll of ice and water shield?"
    answer: "Standard ice and water shield rolls measure 36 inches wide and typically come in lengths of 33, 50, or 65 feet."
  - question: "Do you put ice and water shield in roof valleys?"
    answer: "Building codes require installers to place a 36-inch wide strip of ice and water shield centered down all roof valley seams before adding metal flashing or shingles."
  - question: "Is ice & water shield required on low-slope roofs?"
    answer: "Roofs with low slopes between 2:12 and 4:12 pitch require 100% coverage of self-adhering ice and water shield across the entire surface."''',
    t, flags=re.DOTALL
)
t = re.sub(
    r'## Ice.*Water Shield Calculator Frequently Asked Questions.*',
    r'''## Ice & Water Shield Calculator Frequently Asked Questions

### What is ice & water shield?

Ice and water shield is a self-adhering rubberized asphalt membrane installed under shingles to seal around nails and prevent leaks caused by ice dams or wind-driven rain.

### What is the building code requirement for eave ice barrier protection?

The International Residential Code requires ice barrier membranes in areas with ice damming history to extend from the eave edge to a point at least 24 inches inside the exterior wall line.

### How many courses (passes) of ice and water shield do I need?

A roof with an 18-inch overhang and 6-inch wall requires two courses of ice and water shield along the eave to achieve the required 24 inches of interior coverage.

### How wide is a standard roll of ice and water shield?

Standard ice and water shield rolls measure 36 inches wide and typically come in lengths of 33, 50, or 65 feet.

### Do you put ice and water shield in roof valleys?

Building codes require installers to place a 36-inch wide strip of ice and water shield centered down all roof valley seams before adding metal flashing or shingles.

### Is ice & water shield required on low-slope roofs?

Roofs with low slopes between 2:12 and 4:12 pitch require 100% coverage of self-adhering ice and water shield across the entire surface.
''',
    t, flags=re.DOTALL
)
open(f, 'w', encoding='utf-8').write(t)

# 4. irrigation-sprinkler-coverage-calculator.md
f = 'd:/crycal/irrigation-sprinkler-coverage-calculator.md'
t = open(f, encoding='utf-8').read()
t = re.sub(
    r'faq:.*?(?=\n---)',
    r'''faq:
  - question: "What is head-to-head coverage in irrigation design?"
    answer: "Head-to-head coverage means every irrigation sprinkler throws water all the way to adjacent sprinkler heads, ensuring uniform turf moisture without dry spots."
  - question: "How do I calculate my outdoor faucet flow rate in GPM?"
    answer: "To calculate your outdoor faucet flow rate in GPM, time how many seconds it takes to fill a 5-gallon bucket and divide 300 by that number."
  - question: "Why do I need to divide my sprinkler system into multiple zones?"
    answer: "Dividing a sprinkler system into multiple valve zones ensures each head receives adequate water pressure, since residential supply lines rarely provide enough flow to run all heads simultaneously."
  - question: "Can I mix rotors and fixed spray heads on the same valve zone?"
    answer: "You must never mix rotors and fixed spray heads on the same irrigation zone because spray heads apply water at over twice the rate of rotors, which causes severe dry patches and overwatering."
  - question: "What water pressure (PSI) is needed for residential sprinklers?"
    answer: "Standard residential spray heads perform best at 30 PSI, rotary nozzles operate optimally at 40 PSI, and gear-driven rotors require 45 to 50 PSI."
  - question: "How long should I run each sprinkler zone?"
    answer: "You should run spray head zones for 15 to 20 minutes and rotor zones for 40 to 50 minutes to deliver a half-inch of water per watering session."''',
    t, flags=re.DOTALL
)
t = re.sub(
    r'## Irrigation Sprinkler Coverage Calculator Frequently Asked Questions.*',
    r'''## Irrigation Sprinkler Coverage Calculator Frequently Asked Questions

### What is head-to-head coverage in irrigation design?

Head-to-head coverage means every irrigation sprinkler throws water all the way to adjacent sprinkler heads, ensuring uniform turf moisture without dry spots.

### How do I calculate my outdoor faucet flow rate in GPM?

To calculate your outdoor faucet flow rate in GPM, time how many seconds it takes to fill a 5-gallon bucket and divide 300 by that number.

### Why do I need to divide my sprinkler system into multiple zones?

Dividing a sprinkler system into multiple valve zones ensures each head receives adequate water pressure, since residential supply lines rarely provide enough flow to run all heads simultaneously.

### Can I mix rotors and fixed spray heads on the same valve zone?

You must never mix rotors and fixed spray heads on the same irrigation zone because spray heads apply water at over twice the rate of rotors, which causes severe dry patches and overwatering.

### What water pressure (PSI) is needed for residential sprinklers?

Standard residential spray heads perform best at 30 PSI, rotary nozzles operate optimally at 40 PSI, and gear-driven rotors require 45 to 50 PSI.

### How long should I run each sprinkler zone?

You should run spray head zones for 15 to 20 minutes and rotor zones for 40 to 50 minutes to deliver a half-inch of water per watering session.
''',
    t, flags=re.DOTALL
)
open(f, 'w', encoding='utf-8').write(t)

print("Done replacing.")
