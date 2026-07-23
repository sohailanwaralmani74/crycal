---
layout: default
title: SaaS Unit Economics Calculators – CAC, LTV, Payback & Rule of 40
description: Free unit economics calculators for Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV:CAC ratio, CAC payback months, Gross Margin, Rule of 40, Magic Number, and ARPU/ARPA.
is_catpage: true
category: saas-unit-economics
permalink: /saas-unit-economics
shortName: Unit Economics
---

<section class="hero-section">
  <h1>Unit Economics Calculators</h1>
  <p>
    Calculate the foundational unit economics of your subscription business—Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV:CAC ratio, CAC payback period in months, gross margin %, Rule of 40, magic number, and ARPU/ARPA.
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
  <h2>Mastering SaaS Unit Economics</h2>
  <p>
    Unit economics determine whether a SaaS company can scale profitably. If acquiring a customer costs more than the cumulative net margin they generate over their lifespan, increased sales volume only accelerates cash burn.
  </p>
  <p>
    Our <strong>Unit Economics</strong> calculators reveal the true return on acquisition spend. Measure average customer acquisition cost with the <em>CAC Calculator</em>, project multi-year revenue with the <em>LTV Calculator</em>, benchmark health against venture standards (3:1+ LTV:CAC) with the <em>LTV:CAC Ratio Calculator</em>, measure sales efficiency with the <em>Magic Number Calculator</em>, or verify growth vs profitability health using the <em>Rule of 40 Calculator</em>.
  </p>

  <!-- RELATED SAAS CATEGORIES -->
  <h3>Related SaaS Categories</h3>
  <div class="related-cats-grid">
    <a href="/saas-pricing-packaging" class="cat-chip">🏷️ Pricing &amp; Packaging</a>
    <a href="/saas-revenue-growth-metrics" class="cat-chip">📈 Revenue &amp; Growth Metrics</a>
    <a href="/saas-churn-retention" class="cat-chip">🔄 Churn &amp; Retention</a>
    <a href="/saas-sales-funnel" class="cat-chip">🎯 Sales &amp; Funnel</a>
    <a href="/saas-fundraising-valuation" class="cat-chip">🚀 Fundraising &amp; Valuation</a>
    <a href="/saas-marketing-ads" class="cat-chip">📣 Marketing &amp; Ads</a>
    <a href="/saas-team-operations" class="cat-chip">👥 Team &amp; Operations</a>
  </div>
</section>
