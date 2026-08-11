---
layout: default
title: Sitemap — All Wanjaaro Financial Calculators
description: Complete sitemap of all 170+ Wanjaaro financial calculators across Growth, Retirement, Mortgage, Debt, Insurance, Tax, Budgeting, and Investing.
permalink: /sitemap
is_homepage: true
---

# Sitemap – All Wanjaaro Financial Calculators

This page lists every financial calculator on Wanjaaro. Use these links to navigate the full suite of financial tools.

---

## Category Pages

- <a href="growth">Growth &amp; Savings</a> — Savings and investment growth calculators including Compound Interest, Rule of 72, and Dollar Cost Averaging.
- <a href="retirement">Retirement Planning</a> — Long-term planning tools for 401(k), IRA, Roth IRA, withdrawal rates, and FIRE.
- <a href="mortgage">Mortgage &amp; Real Estate</a> — Home-buying and homeowner calculators for payments, affordability, refinancing, and payoff.
- <a href="debt">Debt &amp; Loans</a> — Payoff strategy calculators including snowball, avalanche, and amortization.
- <a href="insurance">Insurance &amp; Protection</a> — Coverage-planning tools for life, disability, flood, and umbrella insurance.
- <a href="tax">Tax Calculators</a> — Income calculators covering tax brackets, take-home pay, capital gains, and 1099 tax.
- <a href="budgeting">Budgeting &amp; Income</a> — Everyday money management tools including budgeting, net worth, and emergency fund calculators.
- <a href="investing">Investing &amp; Trading</a> — Risk management tools for position sizing, options profit, futures, and crypto.

---

{% assign categories = "growth,retirement,mortgage,debt,insurance,tax,budgeting,investing" | split: "," %}

{% for cat_id in categories %}
  {% assign cat_tools = site.data.tools | where: "category", cat_id %}
  {% if cat_id == "growth" %}{% assign cat_title = "Growth & Savings" %}
  {% elsif cat_id == "retirement" %}{% assign cat_title = "Retirement Planning" %}
  {% elsif cat_id == "mortgage" %}{% assign cat_title = "Mortgage & Real Estate" %}
  {% elsif cat_id == "debt" %}{% assign cat_title = "Debt & Loans" %}
  {% elsif cat_id == "insurance" %}{% assign cat_title = "Insurance & Protection" %}
  {% elsif cat_id == "tax" %}{% assign cat_title = "Tax Calculators" %}
  {% elsif cat_id == "budgeting" %}{% assign cat_title = "Budgeting & Income" %}
  {% elsif cat_id == "investing" %}{% assign cat_title = "Investing & Trading" %}
  {% endif %}

  ## {{ cat_title }}

  {% for tool in cat_tools %}
  - <a href="{{ tool.url }}">{{ tool.title }}</a>{% if tool.description %} — {{ tool.description }}{% endif %}
  {% endfor %}

  ---
{% endfor %}

## Company & Legal

- <a href="about-us">About Us</a>
- <a href="contact-us">Contact Us</a>
- <a href="privacy-policy">Privacy Policy</a>
- <a href="terms-of-service">Terms of Service</a>
- <a href="blog">Blog</a>
