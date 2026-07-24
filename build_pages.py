import os
import re

base_dir = r"d:\crycal"

# Master Hub categories mapping
HUB_SUBCATS = {
    "finance": [
        ("growth", "Growth & Savings", "/growth", "📈"),
        ("retirement", "Retirement Planning", "/retirement", "🏖️"),
        ("mortgage", "Mortgage & Real Estate", "/mortgage", "🏡"),
        ("debt", "Debt & Loans", "/debt", "💳"),
        ("insurance", "Insurance & Protection", "/insurance", "🛡️"),
        ("tax", "Tax Calculators", "/tax", "📊"),
        ("budgeting", "Budgeting & Income", "/budgeting", "📝"),
        ("investing", "Investing & Trading", "/investing", "💵")
    ],
    "construction": [
        ("concrete-masonry", "Concrete & Masonry", "/concrete-masonry", "🧱"),
        ("lumber-framing", "Lumber & Framing", "/lumber-framing", "🪵"),
        ("roofing", "Roofing", "/roofing", "🏠"),
        ("flooring", "Flooring", "/flooring", "📐"),
        ("drywall-paint", "Drywall & Paint", "/drywall-paint", "🎨"),
        ("insulation-hvac", "Insulation & HVAC", "/insulation-hvac", "❄️"),
        ("landscaping-outdoor", "Landscaping & Outdoor", "/landscaping-outdoor", "🌳"),
        ("home-decor-interior", "Home Decor & Interior", "/home-decor-interior", "🛋️"),
        ("project-cost-planning", "Project Cost & Planning", "/project-cost-planning", "📋"),
        ("electrical", "Electrical", "/electrical", "⚡"),
        ("plumbing", "Plumbing", "/plumbing", "🚰"),
        ("windows-doors", "Windows & Doors", "/windows-doors", "🪟")
    ],
    "automotive": [
        ("auto-loan-financing", "Loan & Financing", "/auto-loan-financing", "💳"),
        ("auto-cost-ownership", "Cost of Ownership", "/auto-cost-ownership", "🚘"),
        ("auto-fuel-efficiency", "Fuel & Efficiency", "/auto-fuel-efficiency", "⛽"),
        ("electric-vehicle-ev", "Electric Vehicle (EV)", "/electric-vehicle-ev", "⚡"),
        ("auto-performance-specs", "Performance & Specs", "/auto-performance-specs", "🏎️"),
        ("auto-tires-wheels", "Tires & Wheels", "/auto-tires-wheels", "🛞"),
        ("auto-driving-trip-planning", "Driving & Trip Planning", "/auto-driving-trip-planning", "🗺️"),
        ("auto-maintenance-repair", "Maintenance & Repair", "/auto-maintenance-repair", "🛠️")
    ],
    "saas": [
        ("saas-pricing-packaging", "Pricing & Packaging", "/saas-pricing-packaging", "🏷️"),
        ("saas-unit-economics", "Unit Economics", "/saas-unit-economics", "📐"),
        ("saas-revenue-growth-metrics", "Revenue & Growth Metrics", "/saas-revenue-growth-metrics", "📈"),
        ("saas-churn-retention", "Churn & Retention", "/saas-churn-retention", "🔄"),
        ("saas-sales-funnel", "Sales & Funnel", "/saas-sales-funnel", "🎯"),
        ("saas-fundraising-valuation", "Fundraising & Valuation", "/saas-fundraising-valuation", "🚀"),
        ("saas-marketing-ads", "Marketing & Ads", "/saas-marketing-ads", "📣"),
        ("saas-team-operations", "Team & Operations", "/saas-team-operations", "👥")
    ]
}

def get_related_grid(hub_key, current_cat):
    subcats = HUB_SUBCATS[hub_key]
    hub_names = {
        "finance": "Finance",
        "construction": "Construction",
        "automotive": "Automotive",
        "saas": "SaaS"
    }
    hub_name = hub_names[hub_key]
    
    html = [f'  <h3>Related {hub_name} Categories</h3>']
    html.append('  <div class="related-cats-grid">')
    for cat_id, cat_name, cat_url, icon in subcats:
        if cat_id != current_cat:
            html.append(f'    <a href="{cat_url}" class="cat-chip">{icon} {cat_name}</a>')
    html.append('  </div>')
    return "\n".join(html)

print("Helper script loaded.")
