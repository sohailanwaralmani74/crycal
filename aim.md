---
layout: default
title: "Aim & Precision Tests — Wanjaaro"
description: "Benchmark your mouse accuracy, flick-shot speed, cursor tracking, and micro-adjustments with HTML5 canvas aim trainers."
permalink: /aim
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Aim &amp; Precision Tests</h1>
    <p>Calibrate mouse precision, target acquisition speed, motor steadiness, and cursor muscle memory. Built for esports players and precision computer users.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 7: Click Accuracy / Bullseye -->
    <a href="/click-accuracy" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🎯</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Click Accuracy / Bullseye</div>
        <div class="benchmark-card-desc">Targets with concentric rings reward clicking dead center. Tests pixel-level micro-adjustments rather than sheer speed.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Accuracy %</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 8: Flick-Shot Aim Trainer -->
    <a href="/flick-shot-aim-trainer" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔫</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Flick-Shot Aim Trainer</div>
        <div class="benchmark-card-desc">30 randomly appearing targets. Hit them as quickly as possible. Evaluates target acquisition speed and mouse flick consistency.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-aim-trainer">30 Targets</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 9: Moving-Target Tracking -->
    <a href="/moving-target-tracking" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔄</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Moving-Target Tracking</div>
        <div class="benchmark-card-desc">Smooth pursuit test: keep your cursor glued to an erratic moving target to measure tracking smoothness and latency.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Smooth Pursuit</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 10: Grid Shot -->
    <a href="/grid-shot" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔢</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Grid Shot (Sequential)</div>
        <div class="benchmark-card-desc">Numbered targets appear in a grid. Click in sequential order (1 to 20) in the fastest time with zero miss-clicks.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Speed Run</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 11: Double-Click Speed -->
    <a href="/double-click-speed" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🖱️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Double-Click Speed Test</div>
        <div class="benchmark-card-desc">Measures the inter-click interval (ICI) of your index finger in milliseconds. Evaluates rapid micro-muscle contractions.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Clicks / Sec</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 12: Steady-Hand Tracing -->
    <a href="/steady-hand-tracing" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">〰️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Steady-Hand Tracing Test</div>
        <div class="benchmark-card-desc">Navigate a narrow wire maze from start to finish without touching the electrified borders. Tests motor tremor stability.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Tremor Score</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var pb = localStorage.getItem('wanjaaro_pb_aim');
  if (pb) {
    var el = document.getElementById('pb-aim-trainer');
    if (el) el.textContent = 'Your Best: ' + pb + 'ms/target';
  }
})();
</script>
