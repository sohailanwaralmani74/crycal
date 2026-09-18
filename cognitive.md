---
layout: default
title: "Quick-Fire Cognitive Games — Wanjaaro"
description: "Benchmark your cognitive control, mental math speed, Stroop effect resistance, and dual-task executive processing."
permalink: /cognitive
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Quick-Fire Cognitive Games</h1>
    <p>Test executive function, inhibitory control, working memory processing speed, and mental agility under rapid time pressure.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 33: Stroop Effect Test -->
    <a href="/stroop-test" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🧠</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Stroop Effect Test</div>
        <div class="benchmark-card-desc">Identify the color of the ink, not the written word (e.g. the word "RED" written in Blue ink). Measures cognitive interference and inhibition.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-stroop">Avg: ~650ms</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 34: Mental Math Sprint -->
    <a href="/stroop-test?mode=math" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">➕</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Mental Math Sprint</div>
        <div class="benchmark-card-desc">Solve as many rapid-fire arithmetic problems (addition, multiplication, subtraction) as you can in 60 seconds.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Problems / Min</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 35: Odd-One-Out Speed Round -->
    <a href="/stroop-test?mode=oddone" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔍</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Odd-One-Out Speed Round</div>
        <div class="benchmark-card-desc">Scan a matrix of similar geometric symbols or rotated characters to isolate the single anomaly before the timer expires.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Visual Search</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 36: Spot-the-Difference -->
    <a href="/stroop-test?mode=difference" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔎</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Spot-the-Difference Timed Challenge</div>
        <div class="benchmark-card-desc">Side-by-side procedural vector scenes contain 3 subtle differences. Click to spot them before the 30-second clock runs out.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Detection Time</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 37: Dual-Task Test -->
    <a href="/stroop-test?mode=dualtask" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔀</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Dual-Task Cognitive Test</div>
        <div class="benchmark-card-desc">Track a moving ball with the mouse while simultaneously answering audio or visual math prompts. Measures divided attention capacity.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Multitask %</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var s = localStorage.getItem('wanjaaro_pb_stroop');
  if (s) {
    var el = document.getElementById('pb-stroop');
    if (el) el.textContent = 'Your Best: ' + s + 'ms';
  }
})();
</script>
