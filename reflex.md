---
layout: default
title: "Reflex & Reaction Time Tests — Wanjaaro"
description: "Benchmark your reaction speed with visual, audio, peripheral, and anticipation reaction tests. Accurate to the millisecond."
permalink: /reflex
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge" style="background:#e0f7f6; color:#067c7a; margin-bottom: 0.5rem; display: inline-block;">Category</span>
    <h1>Reflex &amp; Reaction Tests</h1>
    <p>Measure your neurological reaction speed, physical response latency, and trigger anticipation. Benchmark against global human reaction distributions.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 1: Visual Reaction Time -->
    <a href="/reaction-time" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">⚡</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Visual Reaction Time</div>
        <div class="benchmark-card-desc">Click as fast as possible when the screen turns green. Measures optical reflex latency across 5 rounds with false-start detection.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-reaction-time">Avg: ~250ms</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 2: Audio Reaction Time -->
    <a href="/reaction-time?mode=audio" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔊</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Audio Reaction Time</div>
        <div class="benchmark-card-desc">React purely to acoustic triggers. Auditory signals reach the human brain faster than visual ones (typically ~170ms).</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Avg: ~170ms</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 3: Red Light / Green Light -->
    <a href="/reaction-time?mode=redgreen" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🚦</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Red Light, Green Light</div>
        <div class="benchmark-card-desc">Sprint your clicks during green lights, but stop immediately on red. Sudden stops test impulse inhibition and brake reflexes.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Inhibition Test</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 4: Whack-a-Mole Speed -->
    <a href="/aim-trainer?mode=mole" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔨</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Whack-a-Mole Speed Challenge</div>
        <div class="benchmark-card-desc">Rapid visual pop-ups test your reaction speed combined with cursor coordination under pressure.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Spatial Reflex</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 5: False-Start / Anticipation -->
    <a href="/reaction-time?mode=strict" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">⏱️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">False-Start / Anticipation Test</div>
        <div class="benchmark-card-desc">Penalizes early clicking heavily. Trains disciplined trigger control and filters out pure guesswork.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Discipline Score</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 6: Peripheral Vision Reaction -->
    <a href="/reaction-time?mode=peripheral" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">👁️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Peripheral Vision Reaction</div>
        <div class="benchmark-card-desc">Keep your eyes fixed on the center crosshair while targets flash along the extreme perimeter of your monitor.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Field: 180°</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var rt = localStorage.getItem('wanjaaro_pb_reaction_time');
  if (rt) {
    var el = document.getElementById('pb-reaction-time');
    if (el) el.textContent = 'Your Best: ' + rt + 'ms';
  }
})();
</script>
