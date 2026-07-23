---
layout: default
title: Tax — Income & Capital Gains Calculators
description: Calculate your tax bracket, take-home pay, capital gains tax, and self-employment tax obligations. It also include take-home pay and self employement tax.
is_catpage: true
category: tax
permalink: /tax
shortName: Tax
---

<section class="hero-section">
  <h1>Tax — Income &amp; Capital Gains Calculators</h1>
  <p>
    Focused on what you actually keep — marginal rates, paycheck deductions,
    investment gains, and self-employment obligations. Four calculators for
    employees, investors, and freelancers alike.
  </p>
</section>

<!-- ============================================================ -->
<!-- TOOL GRID                                                     -->
<!-- ============================================================ -->

<div class="tool-list">
  {% assign tools = site.data.tools | where: "category", page.category | where: "type", "tool" %}
  {% for tool in tools %}
    <a href="{{ tool.url }}" class="tool-card">
      <span class="tool-card-title">{{ tool.title }}</span>
      <span class="tool-card-arrow">→</span>
    </a>
  {% endfor %}
</div>

<!-- ============================================================ -->
<!-- DETAILED CONTENT                                              -->
<!-- ============================================================ -->

<section class="content-section">
  <p>
    Taxes touch nearly every other financial decision on this site — what you take
    home affects what you can save, what you owe on gains affects when you sell,
    and self-employment tax changes what a freelancer actually needs to charge. The
    Tax category covers four calculators addressing the most common tax questions
    outside of full return preparation.
  </p>
  <p>
    The Tax Bracket calculator shows both your marginal rate (the rate on your
    next dollar earned) and your effective rate (what you actually pay as a
    percentage of total income) based on income and filing status — a distinction
    that's frequently misunderstood and leads to bad decisions around raises or
    bonuses. The Take-Home Pay calculator translates gross salary into an estimated
    net paycheck after taxes and standard deductions, useful for comparing job
    offers or budgeting against real take-home numbers rather than gross salary.
  </p>
  <p>
    The Capital Gains calculator calculates tax owed on investment profits,
    distinguishing between short-term and long-term holding periods — a difference
    that can significantly change the tax bill on the same gain depending on how
    long the asset was held.
  </p>
  <p>
    For freelancers and independent contractors, the Self-Employment Tax calculator
    estimates quarterly tax obligations, accounting for the additional
    self-employment tax that traditional employees don't pay directly — a
    frequent surprise for anyone newly self-employed.
  </p>

  <!-- RELATED FINANCE CATEGORIES -->
  <h3>Related Finance Categories</h3>
  <div class="related-cats-grid">
    <a href="/growth" class="cat-chip">📈 Growth &amp; Savings</a>
    <a href="/retirement" class="cat-chip">🏖️ Retirement</a>
    <a href="/mortgage" class="cat-chip">🏡 Mortgage</a>
    <a href="/debt" class="cat-chip">💳 Debt</a>
    <a href="/insurance" class="cat-chip">🛡️ Insurance</a>
    <a href="/budgeting" class="cat-chip">📝 Budgeting</a>
    <a href="/investing" class="cat-chip">💵 Investing</a>
  </div>
</section>
