---
layout: default
title: Budgeting — Net Worth & Everyday Money Calculators
description: Calculate your 50/30/20 budget, net worth, debt-to-income ratio, and emergency fund target. Everyday money management tools.
is_catpage: true
category: budgeting
permalink: /budgeting
shortName: Budgeting
---

<section class="hero-section">
  <h1>Budgeting — Net Worth &amp; Everyday Money Calculators</h1>
  <p>
    Focused on the day-to-day fundamentals — how income should be split, where you
    stand financially right now, and how prepared you are for the unexpected. Four
    calculators for the money questions that come up constantly, not just once a
    decade.
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
    Not every financial decision is a once-a-decade event like a mortgage or a
    retirement account — most day-to-day money management comes down to simpler,
    recurring questions: how should I split my paycheck, am I actually better off
    than last year, and could I survive a surprise expense? The Budgeting category
    covers four calculators for exactly that.
  </p>
  <p>
    The 50/30/20 Budget calculator applies the widely-used rule of splitting income
    into needs, wants, and savings, giving you concrete dollar targets for each
    category based on your actual take-home pay rather than abstract percentages.
  </p>
  <p>
    The Net Worth calculator adds up assets and subtracts liabilities to give you a
    single number representing where you stand financially right now — the most
    honest scoreboard for tracking progress over time, independent of any one
    account or goal.
  </p>
  <p>
    The Debt-to-Income calculator computes the DTI ratio lenders use to assess
    borrowing capacity — the same metric that shows up when applying for a mortgage
    or major loan, useful to check before you apply rather than after a denial.
  </p>
  <p>
    Finally, the Emergency Fund calculator estimates the savings needed to cover
    three to six months of essential expenses, translating a common piece of
    financial advice into an actual dollar target based on your real monthly costs.
  </p>

  <!-- RELATED FINANCE CATEGORIES -->
  <h3>Related Finance Categories</h3>
  <div class="related-cats-grid">
    <a href="/growth" class="cat-chip">📈 Growth &amp; Savings</a>
    <a href="/retirement" class="cat-chip">🏖️ Retirement</a>
    <a href="/mortgage" class="cat-chip">🏡 Mortgage</a>
    <a href="/debt" class="cat-chip">💳 Debt</a>
    <a href="/insurance" class="cat-chip">🛡️ Insurance</a>
    <a href="/tax" class="cat-chip">📊 Tax</a>
    <a href="/investing" class="cat-chip">💵 Investing</a>
  </div>
</section>
