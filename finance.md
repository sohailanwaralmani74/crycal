---
layout: default
title: Finance Calculators – Master Financial Tools Directory
description: Explore our comprehensive directory of 160+ financial calculators across Growth, Retirement, Mortgage, Debt, Insurance, Tax, Budgeting, and Investing categories.
permalink: /finance
is_homepage: true
---

<div class="finance-hub-container">
  
  <section class="hero-section">
    <h1>Finance Calculators &amp; Planning Directory</h1>
    <p>
      Welcome to the Finance Hub. Explore our comprehensive collection of 160+ browser-based financial calculators.
      Calculate compound interest, mortgage payments, tax liabilities, retirement trajectories, 
      and debt elimination schedules—all 100% private, browser-local, and instant.
    </p>
    
    <!-- Stats Summary Cards -->
    <div class="finance-stats-grid">
      <div class="stat-card">
        <span class="stat-number">169</span>
        <span class="stat-label">Finance Calculators</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">8</span>
        <span class="stat-label">Subcategories</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">170+</span>
        <span class="stat-label">World Currencies</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">100%</span>
        <span class="stat-label">Private &amp; Local</span>
      </div>
    </div>
  </section>

  <!-- Categories Grid Section -->
  <div class="finance-categories-list">
    
    <!-- 1. Growth & Savings -->
    {% assign growth_tools = site.data.tools | where: "category", "growth" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">📈</span>
          <h2>Growth &amp; Savings</h2>
          <span class="tool-count-badge">{{ growth_tools | size }} Calculators</span>
        </div>
        <a href="/growth" class="cat-view-link">View All Growth Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Calculate compound interest, annual growth rates (CAGR), savings goals, T-Bill yields, fixed deposits, CD penalties, and inflation impact over time.
      </p>
      <div class="cat-tool-grid">
        {% for tool in growth_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/growth" class="cat-view-all-btn">View All {{ growth_tools | size }} Growth Tools &rarr;</a>
      </div>
    </div>

    <!-- 2. Retirement -->
    {% assign retirement_tools = site.data.tools | where: "category", "retirement" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">🏖️</span>
          <h2>Retirement Planning</h2>
          <span class="tool-count-badge">{{ retirement_tools | size }} Calculators</span>
        </div>
        <a href="/retirement" class="cat-view-link">View All Retirement Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Plan your retirement horizon with 401(k), IRA, Roth IRA, RMD, FIRE, Social Security spousal benefits, and annuity payout calculators.
      </p>
      <div class="cat-tool-grid">
        {% for tool in retirement_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/retirement" class="cat-view-all-btn">View All {{ retirement_tools | size }} Retirement Tools &rarr;</a>
      </div>
    </div>

    <!-- 3. Mortgage & Real Estate -->
    {% assign mortgage_tools = site.data.tools | where: "category", "mortgage" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">🏡</span>
          <h2>Mortgage &amp; Real Estate</h2>
          <span class="tool-count-badge">{{ mortgage_tools | size }} Calculators</span>
        </div>
        <a href="/mortgage" class="cat-view-link">View All Mortgage Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Estimate monthly home payments, ARM vs Fixed rates, VA, FHA, USDA, HELOCs, cash-out refinancing, and home equity loans.
      </p>
      <div class="cat-tool-grid">
        {% for tool in mortgage_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/mortgage" class="cat-view-all-btn">View All {{ mortgage_tools | size }} Mortgage Tools &rarr;</a>
      </div>
    </div>

    <!-- 4. Debt & Loans -->
    {% assign debt_tools = site.data.tools | where: "category", "debt" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">💳</span>
          <h2>Debt &amp; Loans</h2>
          <span class="tool-count-badge">{{ debt_tools | size }} Calculators</span>
        </div>
        <a href="/debt" class="cat-view-link">View All Debt Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Eliminate debt faster with Debt Snowball, Debt Avalanche, Credit Card Payoff, Amortization schedules, and Loan Payoff calculators.
      </p>
      <div class="cat-tool-grid">
        {% for tool in debt_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/debt" class="cat-view-all-btn">View All {{ debt_tools | size }} Debt Tools &rarr;</a>
      </div>
    </div>

    <!-- 5. Insurance -->
    {% assign insurance_tools = site.data.tools | where: "category", "insurance" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">🛡️</span>
          <h2>Insurance &amp; Protection</h2>
          <span class="tool-count-badge">{{ insurance_tools | size }} Calculators</span>
        </div>
        <a href="/insurance" class="cat-view-link">View All Insurance Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Protect your family and assets with Life Insurance, Disability, Term vs Whole Life, Pet Insurance, and Flood Insurance cost estimators.
      </p>
      <div class="cat-tool-grid">
        {% for tool in insurance_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/insurance" class="cat-view-all-btn">View All {{ insurance_tools | size }} Insurance Tools &rarr;</a>
      </div>
    </div>

    <!-- 6. Tax -->
    {% assign tax_tools = site.data.tools | where: "category", "tax" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">📊</span>
          <h2>Tax Calculators</h2>
          <span class="tool-count-badge">{{ tax_tools | size }} Calculators</span>
        </div>
        <a href="/tax" class="cat-view-link">View All Tax Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Plan tax liabilities with Federal Brackets, Take-Home Pay, Capital Gains, Self-Employment Tax, 1099, Crypto Tax, and Estate Tax calculators.
      </p>
      <div class="cat-tool-grid">
        {% for tool in tax_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/tax" class="cat-view-all-btn">View All {{ tax_tools | size }} Tax Tools &rarr;</a>
      </div>
    </div>

    <!-- 7. Budgeting -->
    {% assign budgeting_tools = site.data.tools | where: "category", "budgeting" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">📝</span>
          <h2>Budgeting &amp; Income</h2>
          <span class="tool-count-badge">{{ budgeting_tools | size }} Calculators</span>
        </div>
        <a href="/budgeting" class="cat-view-link">View All Budgeting Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Manage cash flow with 50/30/20 Budgeting, Net Worth tracking, Emergency Funds, DTI ratios, Hourly-to-Salary conversions, and Roommate Bill Splitting.
      </p>
      <div class="cat-tool-grid">
        {% for tool in budgeting_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/budgeting" class="cat-view-all-btn">View All {{ budgeting_tools | size }} Budgeting Tools &rarr;</a>
      </div>
    </div>

    <!-- 8. Investing -->
    {% assign investing_tools = site.data.tools | where: "category", "investing" %}
    <div class="cat-section-card">
      <div class="cat-header">
        <div class="cat-header-title">
          <span class="cat-icon">💵</span>
          <h2>Investing &amp; Trading</h2>
          <span class="tool-count-badge">{{ investing_tools | size }} Calculators</span>
        </div>
        <a href="/investing" class="cat-view-link">View All Investing Tools &rarr;</a>
      </div>
      <p class="cat-description">
        Trade smarter with Position Size, Risk/Reward Ratio, Kelly Criterion, Options Profit, Crypto Position Size, Futures, and Margin calculators.
      </p>
      <div class="cat-tool-grid">
        {% for tool in investing_tools limit: 6 %}
          <a href="{{ tool.url }}" class="cat-tool-item">
            <span class="tool-name">{{ tool.title }}</span>
            <span class="tool-arrow">&rarr;</span>
          </a>
        {% endfor %}
      </div>
      <div class="cat-card-footer">
        <a href="/investing" class="cat-view-all-btn">View All {{ investing_tools | size }} Investing Tools &rarr;</a>
      </div>
    </div>

  </div>
</div>
