---
layout: default
title: Investing — Position Sizing & Risk Management Tools
description: Calculate position sizes, lot sizes, risk/reward ratios, and optimal betting fractions for stocks, ETFs, crypto, options, and futures.
is_catpage: true
category: investing
permalink: /investing/
---

<section class="hero-section">
  <h1>Investing — Position Sizing &amp; Risk Management Tools</h1>
  <p>
    Make smarter investment decisions with tools that help you size positions, manage risk, 
    and optimise returns. Whether you're trading stocks, ETFs, crypto, options, or futures — 
    these calculators give you the numbers you need before you place a trade.
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
    The Investing category brings together tools that help you manage active investment 
    decisions — from sizing a single stock position to optimising your risk across multiple 
    assets. These are the calculators you reach for when you're planning a trade, rebalancing 
    a portfolio, or evaluating a new strategy.
  </p>
  <p>
    The <strong>Position Size Calculator</strong> is your starting point. It tells you exactly 
    how many shares, contracts, or lots to buy based on your account balance, risk tolerance, 
    and stop‑loss distance. It works for stocks, ETFs, crypto, options, futures, and Forex.
  </p>
  <p>
    The <strong>Lot Size Calculator</strong> is tailored for Forex and CFD traders, converting 
    your desired risk into standard, mini, or micro lots based on pip values and account 
    currency.
  </p>
  <p>
    For more advanced strategies, the <strong>Risk/Reward Ratio</strong> and 
    <strong>Kelly Criterion</strong> calculators help you evaluate whether a trade is worth 
    taking, and how much of your capital to allocate for optimal long‑term growth.
  </p>
  <p>
    Whether you're a day trader, swing trader, or long‑term investor, these tools give you 
    the mathematical edge you need to protect your capital and grow your portfolio 
    systematically.
  </p>
</section>