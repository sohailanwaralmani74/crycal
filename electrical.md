---
layout: default
title: Electrical Calculators – Wire Gauge (AWG), Amperage & Breakers
description: Free wire gauge (AWG) voltage drop calculators, household amperage load, circuit breaker sizing, NEC outlet spacing, generator wattage, and lighting layout calculators.
is_catpage: true
category: electrical
permalink: /electrical
shortName: Electrical
---

<section class="hero-section">
  <h1>Electrical Calculators</h1>
  <p>
    Calculate AWG wire gauge size by voltage drop &amp; distance, main service panel amperage load, circuit breaker sizes, NEC receptacle outlet spacing, and generator surge wattage.
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
  <h2>Electrical Sizing &amp; NEC Code Compliance</h2>
  <p>
    Electrical wiring calculations prevent voltage drop, overheating, tripped breakers, and fire hazards. Calculate wire gauge (AWG) over long distance runs, panel amperage loads, continuous circuit breaker sizing (80% rule), and NEC outlet spacing code rules.
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
    <a href="/plumbing" class="cat-chip">🚰 Plumbing</a>
    <a href="/windows-doors" class="cat-chip">🪟 Windows &amp; Doors</a>
  </div>
</section>
