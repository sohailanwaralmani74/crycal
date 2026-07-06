---
layout: default
title: Mortgage — Home Buying & Homeowner Calculators
description: Calculate mortgage payments, rent vs buy comparisons, refinance savings, home affordability, and mortgage payoff timelines.
is_catpage: true
category: mortgage
permalink: /mortgage
shortName: Mortgage
---

<section class="hero-section">
  <h1>Mortgage — Home Buying &amp; Homeowner Calculators</h1>
  <p>
    Focused on the biggest purchase most people make — monthly payments,
    affordability, refinancing, and payoff strategy. Five calculators covering
    every stage from shopping for a home to owning it outright.
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
    A mortgage is the largest, longest financial commitment most people take on,
    and the math behind it — amortization, escrow, points, refinancing — is rarely
    intuitive. The Mortgage category covers five calculators spanning the full
    homeownership timeline, from deciding whether to buy at all to paying the loan
    off early.
  </p>
  <p>
    The core Mortgage Calculator computes your monthly payment, total interest, and
    a full amortization schedule based on loan amount, rate, and term — the starting
    point for evaluating any home purchase. Before you get that far, though, the
    Rent vs Buy calculator compares the long-term cost of renting against buying in
    your specific market, accounting for opportunity cost, appreciation assumptions,
    and closing costs on both sides.
  </p>
  <p>
    The Home Affordability calculator works backward from your income and existing
    debt to estimate a realistic price range, using standard debt-to-income
    thresholds lenders actually apply — useful for narrowing a search before you
    fall in love with a home outside your budget.
  </p>
  <p>
    Once you own a home, two calculators help you optimize the loan itself. Refinance
    estimates your savings and break-even point from refinancing an existing
    mortgage at a new rate, factoring in closing costs so you can see whether it's
    actually worth it given how long you plan to stay. Mortgage Payoff shows the
    time and interest saved from making extra principal payments — even a modest
    additional monthly payment can cut years off a 30-year loan.
  </p>
</section>
