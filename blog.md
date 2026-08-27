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
  <h1>Blog — How the Numbers Actually Work</h1>
  <p>
    This isn't generic financial advice. It's the math, the code, and the logic behind every calculator on Wanjaaro. From compound interest formulas to tax bracket data structures, I document exactly how each tool works — so you can see the numbers for yourself.
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
    Every calculator on this site is built 100% client-side — your numbers never leave your browser. This blog exists to show you the exact formulas, data sources, and JavaScript logic behind each tool. No black boxes. Just transparent, verifiable numbers.
  </p>
  <p>
    You'll find deep dives into the mathematical derivation of compound interest, how the Kelly Criterion is implemented, the IRS tax tables we hardcode each year, and the sorting logic behind debt snowball versus avalanche. If you're a developer or a numbers-minded user, you'll recognize familiar patterns. If you're just curious about how a calculation works, you'll get a clear breakdown.
  </p>
  <p>
    This is where I document the engineering behind the site — not as a financial advisor, but as someone who's spent years building enterprise-grade fintech systems. If you're looking for personalized financial advice, this isn't the place. But if you want to understand exactly what the calculators are doing with your inputs, you've come to the right spot.
  </p>
  <p>
    Got questions about a formula? Spot something that could be better? <a href="/contact-us">Drop me a line</a> — I'm always refining these tools and love hearing from people who dig into the details.
  </p>
</section>