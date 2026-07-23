---
layout: default
title: Plumbing Calculators – Pipe Sizing, Water Heater & Pressure Loss
description: Free PEX/copper pipe sizing calculators by GPM flow rate, tank & tankless water heater sizing, septic tank capacity, and friction PSI pressure loss calculators.
is_catpage: true
category: plumbing
permalink: /plumbing
shortName: Plumbing
---

<section class="hero-section">
  <h1>Plumbing Calculators</h1>
  <p>
    Calculate PEX &amp; copper supply pipe diameters by GPM flow rate, first-hour rating water heater sizing, household septic tank gallon capacity, and elevation PSI pressure loss.
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
  <h2>Plumbing Hydraulics &amp; Fixture Sizing</h2>
  <p>
    Proper pipe sizing ensures adequate water pressure and flow rate to fixtures without cause noisy water hammer or excessive friction head loss. Calculate supply pipe diameters, water heater GPM demand, septic tank size by bedroom count, and PSI drop.
  </p>

  <!-- RELATED CONSTRUCTION CATEGORIES -->
  <h3>Related Construction Categories</h3>
  <div class="related-cats-grid">
    <a href="/concrete-masonry" class="cat-chip">🧱 Concrete &amp; Masonry</a>
    <a href="/lumber-framing" class="cat-chip">🪵 Lumber &amp; Framing</a>
    <a href="/roofing" class="cat-chip">🏠 Roofing</a>
    <a href="/flooring" class="cat-chip">📐 Flooring</a>
    <a href="/drywall-paint" class="cat-chip">🎨 Drywall &amp; Paint</a>
    <a href="/insulation-hvac" class="cat-chip">❄️ Insulation &amp; HVAC</a>
    <a href="/landscaping-outdoor" class="cat-chip">🌳 Landscaping &amp; Outdoor</a>
    <a href="/home-decor-interior" class="cat-chip">🛋️ Home Decor &amp; Interior</a>
    <a href="/project-cost-planning" class="cat-chip">📋 Project Cost &amp; Planning</a>
    <a href="/electrical" class="cat-chip">⚡ Electrical</a>
    <a href="/windows-doors" class="cat-chip">🪟 Windows &amp; Doors</a>
  </div>
</section>
