---
layout: default
title: Insulation & HVAC Calculators – R-Value, BTU Sizing & Duct Diameter
description: Free fiberglass batt insulation, spray foam, thermal R-value, BTU HVAC heating/cooling load, duct sizing, attic ventilation, AC tonnage, and heat loss calculators.
is_catpage: true
category: insulation-hvac
permalink: /insulation-hvac
shortName: Insulation & HVAC
---

<section class="hero-section">
  <h1>Insulation &amp; HVAC Calculators</h1>
  <p>
    Calculate fiberglass batt rolls, open/closed cell spray foam board feet, thermal R-values, heating &amp; cooling BTU capacity, AC tonnage, round duct diameters, and attic ventilation.
  </p>
</section>

<!-- TOOL GRID -->
<div class="tool-list">
  {% assign tools = site.data.tools | where: "category", page.category | where: "type", "tool" %}
  {% for tool in tools %}
    <a href="{{ tool.url }}" class="tool-card">
      <span class="tool-card-title">{{ tool.title }}</span>
      <span class="tool-card-arrow">&rarr;</span>
    </a>
  {% endfor %}
</div>

<section class="content-section">
  <h2>Thermal Comfort &amp; Energy Efficiency Math</h2>
  <p>
    Sizing HVAC equipment and thermal insulation prevents uncomfortable rooms and high utility bills. Calculate required heating/cooling BTUs, AC tonnage, R-13 to R-38 insulation batts, spray foam board feet, and duct CFM airflow.
  </p>

  <!-- RELATED CONSTRUCTION CATEGORIES -->
  <h3>Related Construction Categories</h3>
  <div class="related-cats-grid">
    <a href="/concrete-masonry" class="cat-chip">🧱 Concrete &amp; Masonry</a>
    <a href="/lumber-framing" class="cat-chip">🪵 Lumber &amp; Framing</a>
    <a href="/roofing" class="cat-chip">🏠 Roofing</a>
    <a href="/flooring" class="cat-chip">📐 Flooring</a>
    <a href="/drywall-paint" class="cat-chip">🎨 Drywall &amp; Paint</a>
    <a href="/landscaping-outdoor" class="cat-chip">🌳 Landscaping &amp; Outdoor</a>
    <a href="/home-decor-interior" class="cat-chip">🛋️ Home Decor &amp; Interior</a>
    <a href="/project-cost-planning" class="cat-chip">📋 Project Cost &amp; Planning</a>
    <a href="/electrical" class="cat-chip">⚡ Electrical</a>
    <a href="/plumbing" class="cat-chip">🚰 Plumbing</a>
    <a href="/windows-doors" class="cat-chip">🪟 Windows &amp; Doors</a>
  </div>
</section>
