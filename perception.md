---
layout: default
title: "Perception & Senses Tests — Wanjaaro"
description: "Browser-based perception tests for color, optical illusions, pitch matching, symmetry, and contrast."
permalink: /perception
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Perception &amp; Senses</h1>
    <p>Short browser tests for visual and auditory perception. Try each challenge and compare your own results under similar screen, audio, and viewing conditions.</p>
  </div>

  <div class="benchmark-card-grid">
    <a href="/color-perception" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🎨</span>
          <span class="benchmark-badge playable">Color</span>
        </div>
        <div class="benchmark-card-title">Color Perception</div>
        <div class="benchmark-card-desc">Find the color tile that differs from the others. The visual difference becomes smaller as the challenge progresses.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Color Difference</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <a href="/optical-illusion" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🌀</span>
          <span class="benchmark-badge playable">Visual</span>
        </div>
        <div class="benchmark-card-title">Optical Illusion Gallery</div>
        <div class="benchmark-card-desc">Explore interactive visual illusions and make simple judgments about lines, shapes, spacing, and apparent size.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Visual Perception</span>
        <span class="benchmark-btn">Explore &rarr;</span>
      </div>
    </a>

    <a href="/pitch-tone-matching" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🎵</span>
          <span class="benchmark-badge playable">Audio</span>
        </div>
        <div class="benchmark-card-title">Pitch / Tone Matching</div>
        <div class="benchmark-card-desc">Listen to tones and adjust or identify pitch differences using audio generated directly in your browser.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Pitch Difference</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <a href="/symmetry-spotting" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🦋</span>
          <span class="benchmark-badge playable">Visual</span>
        </div>
        <div class="benchmark-card-title">Symmetry Spotting</div>
        <div class="benchmark-card-desc">Inspect geometric patterns and decide whether they contain the requested type of symmetry.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Accuracy &amp; Time</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <a href="/contrast-test" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">◐</span>
          <span class="benchmark-badge playable">Visual</span>
        </div>
        <div class="benchmark-card-title">Contrast Test</div>
        <div class="benchmark-card-desc">Work through visual patterns with decreasing contrast and see how your results change with the display and viewing conditions.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Contrast Level</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>

  <section class="benchmark-content">
    <h2>What Perception Tests Measure</h2>
    <p>These tests focus on specific visual or auditory tasks rather than trying to produce one overall measure of perception. Color tasks use differences between displayed colors, symmetry tasks use visual structure, pitch tasks use browser-generated tones, and contrast tasks depend on how clearly a pattern can be seen on the current display.</p>

    <h2>Keep Your Setup Consistent</h2>
    <p>Screen brightness, display settings, room lighting, viewing distance, headphones or speakers, and browser audio volume can affect perception tasks. When comparing your own runs, keeping those conditions similar makes the comparison more useful.</p>

    <h2>Browser-Based Results</h2>
    <p>Wanjaaro runs these challenges in the browser. Results describe performance during the test and should not be treated as a clinical vision or hearing assessment.</p>
  </section>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Perception & Senses Tests",
  "url": "{{ site.url }}/perception",
  "description": "Browser-based perception tests for color, optical illusions, pitch matching, symmetry, and contrast.",
  "hasPart": [
    {"@type":"WebPage","name":"Color Perception","url":"{{ site.url }}/color-perception"},
    {"@type":"WebPage","name":"Optical Illusion Gallery","url":"{{ site.url }}/optical-illusion"},
    {"@type":"WebPage","name":"Pitch / Tone Matching","url":"{{ site.url }}/pitch-tone-matching"},
    {"@type":"WebPage","name":"Symmetry Spotting","url":"{{ site.url }}/symmetry-spotting"},
    {"@type":"WebPage","name":"Contrast Test","url":"{{ site.url }}/contrast-test"}
  ]
}
</script>
