import os
import sys

scratch_path = r"C:\Users\Sohail Anwar\.gemini\antigravity\brain\fd1bd5f2-6c19-4f5b-a952-1c2fae29231a\scratch"
if scratch_path not in sys.path:
    sys.path.insert(0, scratch_path)

base_dir = r"d:\crycal"
js_dir = os.path.join(base_dir, "assets", "js", "calculators")
os.makedirs(js_dir, exist_ok=True)

def make_yaml(data, indent=0):
    lines = []
    ind = "  " * indent
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, (dict, list)):
                lines.append(f"{ind}{k}:")
                lines.append(make_yaml(v, indent + 1))
            elif isinstance(v, bool):
                lines.append(f"{ind}{k}: {'true' if v else 'false'}")
            elif isinstance(v, (int, float)):
                lines.append(f"{ind}{k}: {v}")
            else:
                lines.append(f'{ind}{k}: "{v}"')
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                first = True
                for k, v in item.items():
                    prefix = f"{ind}- " if first else f"{ind}  "
                    first = False
                    if isinstance(v, (dict, list)):
                        lines.append(f"{prefix}{k}:")
                        lines.append(make_yaml(v, indent + 2))
                    elif isinstance(v, bool):
                        lines.append(f"{prefix}{k}: {'true' if v else 'false'}")
                    elif isinstance(v, (int, float)):
                        lines.append(f"{prefix}{k}: {v}")
                    else:
                        lines.append(f'{prefix}{k}: "{v}"')
            else:
                lines.append(f'{ind}- "{item}"')
    return "\n".join(lines)

def build_tool(t):
    tool_id = t["id"]
    category = t["category"]
    cat_name = "SaaS Unit Economics" if category == "saas-unit-economics" else "SaaS Revenue Growth Metrics"

    fm = {
        "layout": "tool",
        "title": t["title"],
        "description": t["description"],
        "permalink": t["permalink"],
        "tool_id": tool_id,
        "category": category,
        "hide_sidebar": True,
        "inputs": t["inputs"],
        "outputs": t["outputs"],
        "charts": {"tabs": t["chart_tabs"]},
        "history_columns": t["history_columns"],
        "js_file": f"assets/js/calculators/{tool_id}.js",
        "structured_data": {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": t["title"],
            "applicationCategory": "FinancialApplication",
            "operatingSystem": "All",
            "description": t["description"],
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "featureList": [
                f"{t['title']} calculation engine",
                "Interactive Chart.js visual breakdown",
                "100% private in-browser client execution",
                "Calculation history logging"
            ]
        },
        "breadcrumb": [
            {"name": "Home", "url": "/"},
            {"name": cat_name, "url": f"/{category}"},
            {"name": t["title"]}
        ],
        "howto": {
            "name": f"How to Use the {t['title']}",
            "description": f"Follow these simple steps to calculate {t['title']} metrics.",
            "step": [
                {"name": "Enter Core Operational Inputs", "text": "Input your current monthly financial and subscriber metrics into the interactive form."},
                {"name": "Configure Cost & Volume Tiers", "text": "Adjust software, team salaries, channel CAC, or plan pricing parameters."},
                {"name": "Evaluate Benchmark Ratings", "text": "Review your output scores against SaaS industry standards."},
                {"name": "Inspect Interactive Charts", "text": "Switch visual chart tabs to analyze detailed breakdowns and curves."}
            ]
        },
        "faq": t["faqs"]
    }

    yaml_str = make_yaml(fm)
    comp_headers = t["comp_table"][0]
    comp_rows = t["comp_table"][1:]
    table_header = "| " + " | ".join(comp_headers) + " |\n| " + " | ".join(["---"] * len(comp_headers)) + " |"
    table_body = "\n".join(["| " + " | ".join(row) + " |" for row in comp_rows])
    faq_body_str = "\n\n".join([f"### {item['q']}\n{item['a']}" for item in t["faqs"]])

    md_content = f"""---
{yaml_str}
---

# {t['title']}

{t['description']} Use our free **{t['title']}** to evaluate your SaaS business performance and make data-driven growth decisions — without any data leaving your browser.

<!-- more -->

## Why Use the {t['title']}?

{t['why_text']}

Having accurate, real-time insights into this metric helps SaaS founders, CFOs, and growth teams optimize capital allocation, protect operating runway, and achieve top-tier venture scalability.

## Mathematical Formula & Derivation

The mathematical derivation for this financial metric is expressed as:

{t['formula_latex']}

Where all input values are evaluated over a standardized monthly or annual accounting period.

## Real-World SaaS Benchmark Comparison

{table_header}
{table_body}

## Step-by-Step Calculation Guide

1. **Enter Core Financial Inputs:** Supply your monthly sales spend, user counts, ARPU, or recurring revenue figures.
2. **Review Intermediate Outputs:** Examine calculated gross profit, churn, payback, or unit contribution scores.
3. **Assess Benchmark Ratings:** Compare your results against SaaS industry standards to identify growth bottlenecks.
4. **Analyze Visual Charts:** Use the visual chart tabs below to inspect metric breakdowns over time.

---

## Frequently Asked Questions

{faq_body_str}
"""

    md_path = os.path.join(base_dir, f"{tool_id}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    js_content = f"""(function() {{

  var chartInstance = null;
  var currentTab = '{t.get("default_tab", t["chart_tabs"][0]["id"])}';
  var lastChartData = null;

  function formatCurrency(amount) {{
    try {{
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {{
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }}).format(amount);
    }} catch (e) {{
      return '$' + amount.toFixed(0);
    }}
  }}

  function formatPercent(value) {{
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }}

  function setOutputText(id, text) {{
    var el = document.getElementById(id);
    if (el) {{
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }}
  }}

  function updateTool() {{
{t['js_calc_body']}
  }}

  function updateCharts(data) {{
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {{
      chartInstance.destroy();
      chartInstance = null;
    }}
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }}

  function generateChartData(tab, data) {{
{t['js_chart_gen']}
  }}

  function switchChartTab(tabId) {{
    currentTab = tabId;
    if (lastChartData) {{
      updateCharts(lastChartData);
    }} else {{
      updateTool();
    }}
  }}

  function resetTool() {{
{t['js_reset_body']}
  }}

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {{
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {{
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    }});

    setTimeout(function() {{
      if (typeof window.updateTool === 'function') window.updateTool();
    }}, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {{
      picker.addEventListener('change', function() {{
        if (typeof window.updateTool === 'function') window.updateTool();
      }});
    }}
  }});

}})();
"""
    js_path = os.path.join(js_dir, f"{tool_id}.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Generated: {tool_id}.md & {tool_id}.js")

from generate_tools_part1 import tools as t1
from generate_tools_part2 import tools as t2
from generate_tools_part3 import tools as t3
from generate_tools_part4 import tools as t4
from generate_tools_part5 import tools as t5

all_tools = t1 + t2 + t3 + t4 + t5
print(f"Total tools to generate: {len(all_tools)}")

for t in all_tools:
    build_tool(t)

print("All 20 tools successfully generated!")
