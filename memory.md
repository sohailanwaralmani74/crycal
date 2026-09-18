---
layout: default
title: "Memory Capacity Tests — Wanjaaro"
description: "Test working memory, sequential pattern recall, spatial span, and visual retention with standardized memory benchmarks."
permalink: /memory
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge" style="background:#e0f7f6; color:#067c7a; margin-bottom: 0.5rem; display: inline-block;">Category</span>
    <h1>Memory Tests</h1>
    <p>Assess short-term memory span, spatial pattern recognition, numerical recall, and working memory load with cognitive neuroscience protocols.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 13: Sequence Memory -->
    <a href="/sequence-memory" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🧠</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Sequence Memory (Simon Pattern)</div>
        <div class="benchmark-card-desc">Watch a 3x3 grid light up in an expanding sequence accompanied by harmonic tones. Repeat the sequence correctly as it grows.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-sequence">Avg: Level 7-9</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 18: Chimp Test -->
    <a href="/chimp-test" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🐒</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Chimp Test (Ayumu Benchmark)</div>
        <div class="benchmark-card-desc">Numbers appear on tiles. When you click 1, all other numbers turn blank. Can you remember where they were and click them in order?</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-chimp">Avg: 9 Numbers</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 14: Number Memory -->
    <a href="/number-memory" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔢</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Number Memory Test</div>
        <div class="benchmark-card-desc">Remember an increasingly long number displayed on screen for just a few seconds. The average human digit span is 7 &plusmn; 2 digits.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-number">Avg: 7 Digits</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 15: Card-Matching -->
    <a href="/chimp-test?mode=cards" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🃏</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Card-Matching Concentration</div>
        <div class="benchmark-card-desc">Flip pairs of matching cards on a hidden board. Tests visual-spatial location retention and associative memory.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Moves &amp; Time</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 16: Visual Grid Memory -->
    <a href="/chimp-test?mode=visualgrid" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🔲</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Visual Grid Memory</div>
        <div class="benchmark-card-desc">A subset of squares in a grid flash white for 1 second. Once cleared, click only the squares that were illuminated.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Spatial Span</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 17: Word-List Recall -->
    <a href="/chimp-test?mode=words" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">📖</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Word-List Recall Test</div>
        <div class="benchmark-card-desc">Read a randomized list of 15 words for 30 seconds, then recall and type as many words as possible without order constraints.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Verbal Memory</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var s = localStorage.getItem('wanjaaro_pb_sequence');
  if (s) {
    var el = document.getElementById('pb-sequence');
    if (el) el.textContent = 'Your Best: Level ' + s;
  }
  var c = localStorage.getItem('wanjaaro_pb_chimp');
  if (c) {
    var el2 = document.getElementById('pb-chimp');
    if (el2) el2.textContent = 'Your Best: Level ' + c;
  }
  var n = localStorage.getItem('wanjaaro_pb_number');
  if (n) {
    var el3 = document.getElementById('pb-number');
    if (el3) el3.textContent = 'Your Best: ' + n + ' Digits';
  }
})();
</script>
