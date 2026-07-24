---
layout: default
title: "SaaS Unit Economics Calculators: LTV, CAC & Margin"
description: "Calculate LTV/CAC ratio, CAC payback period, customer lifetime value, unit contribution margin, ARPU, ARPA, and cost of service."
is_catpage: true
category: saas-unit-economics
permalink: /saas-unit-economics
shortName: "Unit Economics"
---

<section class="hero-section">
  <h1>SaaS Unit Economics Calculators</h1>
  <p>
    Calculate Customer Lifetime Value (LTV), Customer Acquisition Cost (CAC), LTV/CAC ratio, CAC payback period in months, Average Revenue Per User (ARPU/ARPA), unit contribution margin, and Cost of Service. Explore our specialized calculators built for SaaS CFOs and founders.
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
  <h2>Mastering SaaS Unit Economics & Efficiency</h2>
  <p>
    Unit economics form the fundamental financial health test of any software subscription business. Analyzing the relationship between the cost to acquire a customer (CAC) and the net profit generated over that customer's lifetime (LTV) determines whether scaling marketing and sales spend creates long-term enterprise value or burns capital inefficiently.
  </p>
  <p>
    Our <strong>LTV/CAC Ratio Calculator</strong> measures capital efficiency across acquisition channels. The <strong>CAC Payback Period Calculator</strong> computes the exact number of months required for gross profit from a customer to fully recoup sales and marketing acquisition costs.
  </p>
  <p>
    To analyze account expansion, the <strong>ARPU/ARPA Calculator</strong> and <strong>Customer Lifetime Value (LTV) Calculator</strong> evaluate average revenue metrics and churn-adjusted lifetime gross margin. Additionally, tools like the <strong>Cost of Service (COGS) Calculator</strong> ensure healthy Gross Margins.
  </p>

  <h2>SaaS Unit Economics Industry Benchmarks</h2>
  <p>
    Benchmark your subscription unit economics against venture-backed SaaS industry standards:
  </p>
  <ul>
    <li><strong>LTV/CAC Ratio Benchmark:</strong> A healthy LTV/CAC ratio is 3.0x or higher; ratios above 5.0x suggest under-investing in acquisition, while under 2.0x indicates unsustainable CAC.</li>
    <li><strong>CAC Payback Period Target:</strong> Target CAC payback period is under 12 months for SMB SaaS, 12 to 18 months for Mid-Market, and 18 to 24 months for Enterprise.</li>
    <li><strong>SaaS Gross Margin Benchmark:</strong> Subscription gross margins should be 75% to 85%+ (COGS includes hosting, customer support, and third-party API costs).</li>
    <li><strong>Magic Number Benchmark:</strong> A Sales Magic Number above 0.75x indicates efficient sales growth ready for aggressive capital scaling.</li>
  </ul>

  <h2>Step-by-Step Practical Unit Economics Calculation Guide</h2>
  <p>
    Follow this step-by-step financial framework to calculate unit economics metrics:
  </p>
  <ol>
    <li><strong>Calculate Fully Burdened CAC:</strong> Divide total sales &amp; marketing spend (salaries, ads, tools, commissions) by total new customers acquired in the period.</li>
    <li><strong>Determine ARPU and Gross Margin %:</strong> Calculate Average Revenue Per User (ARPU) and subtract direct Cost of Goods Sold (COGS) to find Gross Margin %.</li>
    <li><strong>Calculate Customer Lifetime (Months):</strong> Divide 1 by your monthly customer logo churn rate (e.g., 1 ÷ 0.02 monthly churn = 50 months lifetime).</li>
    <li><strong>Calculate LTV (Customer Lifetime Value):</strong> Multiply ARPU × Gross Margin % × Customer Lifetime in months (LTV = ARPU × GM% ÷ Churn).</li>
    <li><strong>Calculate CAC Payback Period:</strong> Divide fully burdened CAC by (ARPU × Gross Margin %) to determine payback period in months.</li>
  </ol>

  <h2>Frequently Asked Questions</h2>
  <h3>What is a good LTV to CAC ratio for a SaaS startup?</h3>
  <p>
    A healthy LTV/CAC ratio is 3:1 or higher. A 3:1 ratio means a customer generates three times more gross profit over their lifetime than it cost to acquire them.
  </p>
  <h3>How do you calculate CAC payback period?</h3>
  <p>
    Divide fully burdened Customer Acquisition Cost (CAC) by monthly gross profit per customer (Monthly ARPU × Gross Margin %). The target is under 12 months for SMBs.
  </p>
  <h3>What expenses are included in SaaS Cost of Goods Sold (COGS)?</h3>
  <p>
    SaaS COGS includes hosting/cloud infrastructure costs (AWS/GCP), customer support team salaries, customer onboarding costs, and third-party software APIs embedded in the product.
  </p>

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
