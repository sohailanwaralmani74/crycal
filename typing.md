---
layout: default
title: "Typing Speed & Accuracy Tests — Wanjaaro"
description: "Benchmark your Words Per Minute (WPM), typing accuracy percentage, keyboard rollover, and coding typing speed."
permalink: /typing
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Typing Speed &amp; Accuracy</h1>
    <p>Test raw input velocity, stroke accuracy, code syntax typing fluency, and keyboard hardware matrix rollover.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 19: WPM Typing Speed -->
    <a href="/typing-test" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">⌨️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">WPM Typing Speed Test</div>
        <div class="benchmark-card-desc">60-second standardized prose typing test with real-time word highlighting, net WPM, gross WPM, and error tracking.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-typing">Avg: ~45 WPM</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 20: Typing Accuracy Test -->
    <a href="/typing-test?mode=accuracy" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🎯</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Typing Accuracy Test</div>
        <div class="benchmark-card-desc">Strict mode: a single typo stops progress until corrected with backspace. Measures error-free sustained typing discipline.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Accuracy %</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 21: Keyboard Rollover / Ghosting Tester -->
    <a href="/typing-test?mode=rollover" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🕹️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Keyboard Rollover &amp; Ghosting Tester</div>
        <div class="benchmark-card-desc">Press multiple keys simultaneously (e.g. WASD + Shift + Space) to test if your keyboard supports N-Key Rollover (NKRO) without blocking.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">NKRO Checker</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 22: Code-Snippet Typing Test -->
    <a href="/typing-test?mode=code" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">💻</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Code-Snippet Typing Test</div>
        <div class="benchmark-card-desc">Type real JavaScript, Python, and CSS code featuring curly brackets, semicolons, arrows, and indentation syntax.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Programmer WPM</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 23: Typing Rhythm & Consistency -->
    <a href="/typing-test?mode=rhythm" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">📊</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Typing Rhythm / Consistency Scorer</div>
        <div class="benchmark-card-desc">Measures the millisecond variance between successive keystrokes (standard deviation of inter-key latency) to score metronomic consistency.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Rhythm Score</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var wpm = localStorage.getItem('wanjaaro_pb_wpm');
  if (wpm) {
    var el = document.getElementById('pb-typing');
    if (el) el.textContent = 'Your Best: ' + wpm + ' WPM';
  }
})();
</script>
