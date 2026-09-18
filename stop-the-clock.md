---
layout: default
title: "Stop the Clock (Timing Precision) — Wanjaaro"
description: "Stop the high-speed millisecond timer as close to 5.000 seconds as possible. Test your internal rhythm and temporal calibration."
permalink: /stop-the-clock
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Timing Benchmark</span>
    <h1>Stop the Clock Precision Test</h1>
    <p>Press Start, then press Stop when you believe the clock has reached exactly <strong>5.000 seconds</strong>. The digital display vanishes after 2.5 seconds!</p>
  </div>

  <!-- Stopwatch Display Arena -->
  <div style="max-width: 600px; margin: 0 auto; background: #082633; border: 2px solid #07dbd7; border-radius: 14px; padding: 3rem 1.5rem; text-align: center; color: #ffffff;">
    <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7ba2b2; margin-bottom: 0.5rem;">Target: 5.000s</div>
    <div id="clock-display" style="font-size: clamp(3rem, 7vw, 4.8rem); font-weight: 800; font-family: monospace; letter-spacing: 0.05em; margin: 1rem 0 2rem; color: #07dbd7;">
      0.000
    </div>

    <button id="clock-action-btn" style="background: #07dbd7; color: #082633; border: none; padding: 1rem 3rem; font-size: 1.25rem; font-weight: 800; border-radius: 10px; cursor: pointer; transition: transform 0.1s;">
      Start Timer
    </button>
  </div>

  <!-- Stats Bar -->
  <div class="test-stats-bar" style="max-width: 600px; margin: 1.5rem auto 0;">
    <div class="test-stat-item">
      <div class="test-stat-label">Offset Delta</div>
      <div class="test-stat-val" id="clock-delta">±0 ms</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Rating</div>
      <div class="test-stat-val" id="clock-grade" style="color: #067c7a;">--</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Personal Best</div>
      <div class="test-stat-val" id="clock-pb">-- ms</div>
    </div>
  </div>

  <!-- Summary Card -->
  <div id="clock-summary" style="display: none; max-width: 600px; margin: 2rem auto 0; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Result</span>
    <h2 style="font-size: 2.5rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="clock-summary-score">0.000s</h2>
    <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="clock-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="clock-restart-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Try Again
      </button>
      <button id="clock-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Share Result 📋
      </button>
    </div>
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
