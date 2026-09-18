---
layout: default
title: "Timing & Rhythm Tests — Wanjaaro"
description: "Test internal tempo, millisecond stopwatch precision, rhythm tapping accuracy, and metronome synchronization."
permalink: /timing
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Timing &amp; Rhythm Tests</h1>
    <p>Calibrate your internal temporal clock, rhythm tap accuracy, audio synchronization, and millisecond time estimation.</p>
  </div>

  <div class="benchmark-card-grid">
    <!-- Test 29: Stop the Clock -->
    <a href="/stop-the-clock" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">⏱️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Stop the Clock</div>
        <div class="benchmark-card-desc">Try to stop a high-speed stopwatch at exactly 5.000 seconds. After 2.5 seconds, the display is hidden — rely purely on internal rhythm!</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb" id="pb-timing-clock">Target: 5.000s</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 30: Rhythm Tap Game -->
    <a href="/stop-the-clock?mode=rhythm" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🥁</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Rhythm Tap Game</div>
        <div class="benchmark-card-desc">Tap your spacebar or screen to a repeating musical tempo. Scored on timing offset in milliseconds (Early / Perfect / Late).</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">BPM Sync</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 31: Internal Clock Test -->
    <a href="/stop-the-clock?mode=internal10" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🕰️</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Internal Clock (10 Seconds)</div>
        <div class="benchmark-card-desc">Press Start, count silently in your head, and press Stop when you believe exactly 10 seconds have elapsed. No clocks allowed!</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Target: 10.00s</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>

    <!-- Test 32: Metronome Sync Challenge -->
    <a href="/stop-the-clock?mode=metronome" class="benchmark-card">
      <div>
        <div class="benchmark-card-header">
          <span class="benchmark-card-icon">🎼</span>
          <span class="benchmark-badge playable">Playable Now</span>
        </div>
        <div class="benchmark-card-title">Metronome Sync Challenge</div>
        <div class="benchmark-card-desc">Synchronize taps to a synthesized audio click. The click fades out for 8 beats while you must keep the exact tempo until it returns.</div>
      </div>
      <div class="benchmark-card-footer">
        <span class="benchmark-pb">Drift Offset</span>
        <span class="benchmark-btn">Start Test &rarr;</span>
      </div>
    </a>
  </div>
</div>
<script>
(function() {
  var d = localStorage.getItem('wanjaaro_pb_stopclock');
  if (d) {
    var el = document.getElementById('pb-timing-clock');
    if (el) el.textContent = 'Your Best: ±' + d + 'ms';
  }
})();
</script>
