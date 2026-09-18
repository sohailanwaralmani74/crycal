---
layout: default
title: "Stop the Clock (Timing Precision) — Wanjaaro"
description: "Stop the high-speed millisecond timer as close to 5.000 seconds as possible. Test your internal rhythm and temporal calibration."
permalink: /stop-the-clock
---

<div class="benchmark-container">
  <div class="benchmark-layout-split">
    <!-- Main Column: 75% Desktop / Primary Flow on Mobile -->
    <div class="benchmark-main-column">
      <div class="benchmark-hero">
        <span class="benchmark-badge playable">Timing Benchmark</span>
        <h1>Stop the Clock Precision Test</h1>
        <p>Press Start, then press Stop when you believe the clock has reached exactly <strong>5.000 seconds</strong>. The digital display vanishes after 2.5 seconds!</p>
      </div>

      <!-- Stopwatch Display Arena -->
      <div class="clock-arena">
        <div class="clock-target-hint">Target: 5.000s</div>
        <div id="clock-display" class="clock-display">
          0.000
        </div>

        <button id="clock-action-btn" class="btn btn-accent" style="padding: 1rem 3rem; font-size: 1.25rem;">
          Start Timer
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 600px;">
        <div class="test-stat-item">
          <div class="test-stat-label">Offset Delta</div>
          <div class="test-stat-val" id="clock-delta">±0 ms</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Rating</div>
          <div class="test-stat-val" id="clock-grade" style="color: var(--accent-text);">--</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Personal Best</div>
          <div class="test-stat-val" id="clock-pb">-- ms</div>
        </div>
      </div>

      <!-- Summary Card -->
      <div id="clock-summary" class="test-summary-card" style="display: none; max-width: 600px;">
        <span class="benchmark-badge playable">Result</span>
        <h2 id="clock-summary-score">0.000s</h2>
        <p class="test-summary-rating" id="clock-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="clock-restart-btn" class="btn btn-primary">
            Try Again
          </button>
          <button id="clock-copy-btn" class="btn btn-accent">
            Share Result 📋
          </button>
        </div>
      </div>

      <!-- Mobile Placement 2: Ad after Test UI -->
      <div class="mobile-ad-post-test">
        {% include mobile-ad.html %}
      </div>

      <!-- Benchmark Info Context -->
      <div class="benchmark-info-section">
        <h3>About Internal Time Estimation</h3>
        <p>
          Humans track time intervals via neural pacemakers in the basal ganglia and cerebellum. When visual feedback is removed halfway through the timer, your brain relies entirely on internal subjective cadence. Precision within ±50ms indicates elite internal rhythm calibration.
        </p>
      </div>

      <!-- Mobile Placement 4: Ad after Content, before Related Tools -->
      <div class="mobile-ad-post-content">
        {% include mobile-ad.html %}
      </div>
    </div>

    <!-- Sidebar Column: 25% Desktop / 5th Item on Mobile -->
    {% include sidebar-tools.html %}
  </div>
</div>

<script>
(function() {
  var display = document.getElementById('clock-display');
  var actionBtn = document.getElementById('clock-action-btn');
  var deltaEl = document.getElementById('clock-delta');
  var gradeEl = document.getElementById('clock-grade');
  var pbEl = document.getElementById('clock-pb');
  var summary = document.getElementById('clock-summary');
  var summaryScore = document.getElementById('clock-summary-score');
  var summaryDesc = document.getElementById('clock-summary-desc');
  var restartBtn = document.getElementById('clock-restart-btn');
  var copyBtn = document.getElementById('clock-copy-btn');

  var state = 'idle'; // idle, running, stopped
  var startTime = 0;
  var animFrame = null;
  var targetMs = 5000;

  // Stored PB
  var pb = localStorage.getItem('wanjaaro_pb_stopclock');
  if (pb) pbEl.textContent = '±' + pb + ' ms';

  var audioCtx = null;
  function beep(freq) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.1, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  function updateClock() {
    if (state !== 'running') return;
    var elapsed = performance.now() - startTime;
    
    // Hide clock after 2.5s (2500ms)
    if (elapsed >= 2500) {
      display.textContent = '??.???';
      display.style.color = '#7ba2b2';
    } else {
      display.textContent = (elapsed / 1000).toFixed(3);
      display.style.color = '#07dbd7';
    }

    animFrame = requestAnimationFrame(updateClock);
  }

  function start() {
    state = 'running';
    summary.style.display = 'none';
    startTime = performance.now();
    actionBtn.textContent = 'STOP!';
    actionBtn.style.background = '#c82333';
    actionBtn.style.color = '#ffffff';
    beep(440);
    animFrame = requestAnimationFrame(updateClock);
  }

  function stop() {
    cancelAnimationFrame(animFrame);
    state = 'stopped';
    var elapsed = performance.now() - startTime;
    var finalTimeSec = (elapsed / 1000).toFixed(3);
    display.textContent = finalTimeSec;
    display.style.color = '#ffffff';

    var diffMs = Math.round(Math.abs(elapsed - targetMs));
    deltaEl.textContent = (elapsed >= targetMs ? '+' : '-') + diffMs + ' ms';

    // Rating
    var rating = '';
    var comment = '';
    if (diffMs <= 25) {
      rating = 'Atomic Clock ⏱️';
      comment = 'Phenomenal internal tempo! You stopped within 25 milliseconds of 5.000s.';
      beep(880);
    } else if (diffMs <= 75) {
      rating = 'Master Rhythm 🎯';
      comment = 'Superb internal timing calibration!';
      beep(660);
    } else if (diffMs <= 200) {
      rating = 'Good Tempo';
      comment = 'Decent time estimation. Keep practicing without peeking.';
      beep(550);
    } else {
      rating = 'Drifted';
      comment = 'Your internal tempo drifted. Remember: 5 seconds is slightly longer than it feels.';
      beep(300);
    }

    gradeEl.textContent = rating;

    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_stopclock') || '9999', 10);
    if (diffMs < currentPb) {
      localStorage.setItem('wanjaaro_pb_stopclock', diffMs);
      pbEl.textContent = '±' + diffMs + ' ms (New PB!)';
    }

    actionBtn.textContent = 'Reset';
    actionBtn.style.background = '#07dbd7';
    actionBtn.style.color = '#082633';

    summaryScore.textContent = finalTimeSec + 's (±' + diffMs + ' ms)';
    summaryDesc.textContent = comment;
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  actionBtn.addEventListener('click', function() {
    if (state === 'idle') {
      start();
    } else if (state === 'running') {
      stop();
    } else {
      state = 'idle';
      display.textContent = '0.000';
      display.style.color = '#07dbd7';
      actionBtn.textContent = 'Start Timer';
      summary.style.display = 'none';
    }
  });

  restartBtn.addEventListener('click', function() {
    state = 'idle';
    display.textContent = '0.000';
    display.style.color = '#07dbd7';
    actionBtn.textContent = 'Start Timer';
    summary.style.display = 'none';
    start();
  });

  copyBtn.addEventListener('click', function() {
    var text = '⏱️ Wanjaaro Stop the Clock: ' + summaryScore.textContent + '\nTest your internal clock at https://wanjaaro.com/stop-the-clock';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Result 📋'; }, 2000);
    });
  });
})();
</script>
