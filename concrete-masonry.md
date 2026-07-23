---
layout: default
title: Concrete & Masonry Calculators – Yardage, Slab Cost, Bags & Blocks
description: Free concrete yardage, slab cost, bag, CMU block, rebar, gravel, sand, mortar, brick, stucco, footing, retaining wall, asphalt, and epoxy calculators.
is_catpage: true
category: concrete-masonry
permalink: /concrete-masonry
shortName: Concrete & Masonry
---

<section class="hero-section">
  <h1>Concrete &amp; Masonry Calculators</h1>
  <p>
    Calculate exact concrete volume in cubic yards, premixed bag counts (60lb &amp; 80lb), CMU block requirements, rebar grid lengths, gravel base tonnage, mortar bags, and total slab costs.
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
  <h2>Accurate Structural Masonry &amp; Concrete Estimating</h2>
  <p>
    Concrete and masonry projects require exact material estimating to prevent expensive shortfalls during pours or costly over-ordering fees. Whether pouring a 4-inch patio slab, setting deck footings, laying CMU block retaining walls, or calculating asphalt tonnage for a driveway, accurate volume math is critical.
  </p>
  <p>
    Our <strong>Concrete &amp; Masonry</strong> tools help builders and DIY homeowners calculate ready-mix truck yardage, 60lb/80lb bag counts, rebar grid reinforcement, mortar bags, and decorative finishes.
  </p>

  <!-- RELATED CONSTRUCTION CATEGORIES -->
  <h3>Related Construction Categories</h3>
  <div class="related-cats-grid">
    <a href="/lumber-framing" class="cat-chip">🪵 Lumber &amp; Framing</a>
    <a href="/roofing" class="cat-chip">🏠 Roofing</a>
    <a href="/flooring" class="cat-chip">📐 Flooring</a>
    <a href="/drywall-paint" class="cat-chip">🎨 Drywall &amp; Paint</a>
    <a href="/insulation-hvac" class="cat-chip">❄️ Insulation &amp; HVAC</a>
    <a href="/landscaping-outdoor" class="cat-chip">🌳 Landscaping &amp; Outdoor</a>
    <a href="/home-decor-interior" class="cat-chip">🛋️ Home Decor &amp; Interior</a>
    <a href="/project-cost-planning" class="cat-chip">📋 Project Cost &amp; Planning</a>
    <a href="/electrical" class="cat-chip">⚡ Electrical</a>
    <a href="/plumbing" class="cat-chip">🚰 Plumbing</a>
    <a href="/windows-doors" class="cat-chip">🪟 Windows &amp; Doors</a>
  </div>
</section>
