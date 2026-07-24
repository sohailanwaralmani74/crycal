---
layout: default
title: "SaaS Growth Calculators: ARR, MRR & Rule of 40"
description: "Track SaaS revenue performance with ARR, MRR growth rate, CMGR, Net Revenue Retention (NRR), Gross Retention (GRR), and Rule of 40."
is_catpage: true
category: saas-revenue-growth-metrics
permalink: /saas-revenue-growth-metrics
shortName: "Revenue & Growth Metrics"
---

<section class="hero-section">
  <h1>SaaS Revenue &amp; Growth Metrics Calculators</h1>
  <p>
    Calculate Annual Recurring Revenue (ARR), Monthly Recurring Revenue (MRR) growth rates, Compound Monthly Growth Rate (CMGR), Net Revenue Retention (NRR), Gross Revenue Retention (GRR), and the Rule of 40. Explore our specialized calculators built for SaaS finance teams.
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
  <h2>Comprehensive SaaS Recurring Revenue & Retention Metrics</h2>
  <p>
    Recurring revenue models require specialized accounting metrics to track business momentum, expansion velocity, and compounding financial health. Standard GAAP revenue lags behind operational reality, making Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Net Revenue Retention (NRR), and Gross Revenue Retention (GRR) the primary metrics evaluated by operators and investors.
  </p>
  <p>
    Our <strong>MRR &amp; ARR Calculator</strong> tracks new, expansion, contraction, and churned MRR components. The <strong>Net Revenue Retention (NRR) Calculator</strong> and <strong>Gross Revenue Retention (GRR) Calculator</strong> measure revenue expansion and churn from existing customer cohorts.
  </p>
  <p>
    To measure overall efficiency, the <strong>Rule of 40 Calculator</strong> balances revenue growth rate against operating profit margin. Additionally, tools like the <strong>CMGR Calculator</strong> model month-over-month growth compounding.
  </p>

  <h2>SaaS Revenue & Retention Industry Benchmarks</h2>
  <p>
    Benchmark your recurring revenue growth metrics against top-quartile B2B SaaS benchmarks:
  </p>
  <ul>
    <li><strong>Net Revenue Retention (NRR) Benchmark:</strong> Enterprise SaaS targets 120%+ NRR; Mid-Market targets 110% to 120% NRR; SMB SaaS targets 100%+ NRR.</li>
    <li><strong>Gross Revenue Retention (GRR) Ceiling:</strong> Top-tier SaaS companies achieve 90% to 95%+ GRR (which excludes expansion revenue and caps maximum churn).</li>
    <li><strong>The Rule of 40 Benchmark:</strong> Sum of Year-over-Year Revenue Growth Rate % + Free Cash Flow Margin % should equal or exceed 40% (e.g., 30% growth + 10% FCF margin = 40%).</li>
    <li><strong>CMGR Growth Target:</strong> Early-stage seed to Series A startups target 5% to 7%+ Compound Monthly Growth Rate (CMGR) in MRR.</li>
  </ul>

  <h2>Step-by-Step Practical SaaS Revenue Metrics Guide</h2>
  <p>
    Follow this step-by-step accounting framework to track recurring revenue metrics:
  </p>
  <ol>
    <li><strong>Segment Monthly Recurring Revenue (MRR):</strong> Break ending MRR into 4 core buckets: New MRR + Expansion MRR - Contraction MRR - Churned MRR.</li>
    <li><strong>Calculate Annual Recurring Revenue (ARR):</strong> Multiply normalized ending monthly recurring revenue by 12 (ARR = MRR × 12).</li>
    <li><strong>Calculate Net Revenue Retention (NRR):</strong> Formula: [(Starting MRR + Expansion - Contraction - Churn) ÷ Starting MRR] × 100 over a 12-month cohort.</li>
    <li><strong>Calculate Gross Revenue Retention (GRR):</strong> Formula: [(Starting MRR - Contraction - Churn) ÷ Starting MRR] × 100 (GRR cannot exceed 100%).</li>
    <li><strong>Calculate Rule of 40 Score:</strong> Add annual YoY ARR growth percentage to annual EBITDA or Free Cash Flow margin percentage.</li>
  </ol>

  <h2>Frequently Asked Questions</h2>
  <h3>What is the difference between Net Revenue Retention (NRR) and Gross Revenue Retention (GRR)?</h3>
  <p>
    NRR includes expansion revenue (upsells, cross-sells) from existing customers, allowing it to exceed 100%. GRR excludes expansion revenue, measuring pure revenue retention (max 100%).
  </p>
  <h3>What is a good Rule of 40 score for a SaaS company?</h3>
  <p>
    A Rule of 40 score of 40% or higher indicates strong balance between revenue growth and profitability. Top-tier IPO-bound SaaS companies achieve 50% to 60%+.
  </p>
  <h3>How do I calculate Compound Monthly Growth Rate (CMGR)?</h3>
  <p>
    CMGR = (Ending MRR ÷ Starting MRR)^(1 ÷ Number of Months) - 1. It measures the steady compound monthly growth rate required to grow from starting to ending MRR.
  </p>

  <h3>Related SaaS Categories</h3>
  <div class="related-cats-grid">
    <a href="/saas-pricing-packaging" class="cat-chip">🏷️ Pricing &amp; Packaging</a>
    <a href="/saas-unit-economics" class="cat-chip">📐 Unit Economics</a>
    <a href="/saas-churn-retention" class="cat-chip">🔄 Churn &amp; Retention</a>
    <a href="/saas-sales-funnel" class="cat-chip">🎯 Sales &amp; Funnel</a>
    <a href="/saas-fundraising-valuation" class="cat-chip">🚀 Fundraising &amp; Valuation</a>
    <a href="/saas-marketing-ads" class="cat-chip">📣 Marketing &amp; Ads</a>
    <a href="/saas-team-operations" class="cat-chip">👥 Team &amp; Operations</a>
  </div>
</section>
