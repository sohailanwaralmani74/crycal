---
layout: default
title: Blog — Articles on Calculator Math & Logic
description: Deep dives into the formulas, code, and logic behind our calculators. Written by a software developer with 10+ years in financial systems.
is_homepage: true
category: blog
permalink: /blog
shortName: Blog
---

<section class="hero-section">
  <h1>Blog — Articles &amp; Deep Dives</h1>
  <p>
    Not generic financial advice — just the math, the code, and the logic
    behind each calculator. From compound interest formulas to tax bracket
    data structures, this is where I document how the tools actually work.
  </p>
</section>

<!-- ============================================================ -->
<!-- POST GRID                                                     -->
<!-- ============================================================ -->

<div class="tool-list">
  {% assign posts = site.posts | sort: "date" | reverse %}
  {% for post in posts %}
    <a href="{{ post.url }}" class="tool-card">
      <span class="tool-card-title">{{ post.title }}</span>
      <span class="tool-card-arrow">→</span>
    </a>
  {% endfor %}
</div>

<!-- ============================================================ -->
<!-- DETAILED CONTENT                                              -->
<!-- ============================================================ -->

<section class="content-section">
  <p>
    Every calculator on this site is built 100% client-side — your numbers
    never leave your browser. This blog exists to show the exact formulas,
    data sources, and JavaScript logic behind each tool, so you can verify
    the numbers yourself rather than trusting a black box.
  </p>
  <p>
    Posts cover the mathematical derivation of compound interest, how the
    Kelly Criterion is implemented, the IRS tax tables we hardcode each year,
    and the sorting algorithms behind debt snowball vs. avalanche. No
    fluff — just the mechanics.
  </p>
  <p>
    If you're a developer or a numbers-minded user, you'll find the exact
    code patterns and assumptions documented here. If you're looking for
    personalised financial advice, this isn't the place — but you'll
    understand exactly what the calculators are doing with your inputs.
  </p>
</section>