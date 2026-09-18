---
layout: default
title: "Visual Reaction Time Test — Wanjaaro"
description: "Test your reaction time in milliseconds with this calibrated visual benchmark. Average human reaction time is ~250ms."
permalink: /reaction-time
category: reflex
sidebar: true
sidebar_title: "Visual Reaction Time"
sidebar_subtitle: "Calibrated reflex speed (ms)"
sidebar_icon: "⚡"
---

<div class="benchmark-hero">
      <span class="benchmark-badge playable">Reflex Benchmark</span>
      <h1>Visual Reaction Time Test</h1>
      <p>When the red box turns <strong style="color: var(--success-text);">green</strong>, click or tap anywhere as quickly as you can. Avoid clicking too early!</p>
    </div>

    <!-- Interactive Test Arena -->
    <div class="test-arena-wrapper">
      <div id="rt-arena" class="test-arena">
        <div id="rt-icon" class="test-arena-icon">⚡</div>
        <h2 id="rt-title">Click to Start</h2>
        <p id="rt-subtitle">Click anywhere in this box to begin the 5-round reaction test.</p>
      </div>
    </div>

    <!-- Stats and History Bar -->
    <div class="test-stats-bar">
      <div class="test-stat-item">
        <div class="test-stat-label">Round</div>
        <div class="test-stat-val" id="rt-round">0 / 5</div>
      </div>
      <div class="test-stat-item">
        <div class="test-stat-label">Current Round</div>
        <div class="test-stat-val" id="rt-current">-- ms</div>
      </div>
      <div class="test-stat-item">
        <div class="test-stat-label">Average Time</div>
        <div class="test-stat-val" id="rt-average">-- ms</div>
      </div>
      <div class="test-stat-item">
        <div class="test-stat-label">Personal Best</div>
        <div class="test-stat-val" id="rt-pb" style="color: var(--accent-text);">-- ms</div>
      </div>
    </div>

    <!-- Summary Card (Hidden until finished) -->
    <div id="rt-summary" class="test-summary-card" style="display: none;">
      <span class="benchmark-badge playable">Test Complete</span>
      <h2 id="rt-summary-score">-- ms</h2>
      <p class="test-summary-rating" id="rt-summary-rating">Calculating your ranking...</p>
      
      <div class="summary-actions">
        <button id="rt-restart-btn" class="btn btn-primary">
          Try Again
        </button>
        <button id="rt-copy-btn" class="btn btn-accent">
          Copy Result 📋
        </button>
      </div>
    </div>

    <!-- Mobile Placement 2: Ad after Test UI -->
    <div class="mobile-ad-post-test">
      {% include mobile-ad.html %}
    </div>

    <!-- Explanatory Context / Content Block -->
    <div class="benchmark-info-section">
      <h3>About Visual Reaction Time</h3>
      <p>
        The average human visual reaction time is between <strong>200ms and 275ms</strong>. Signals travel from your retina via the optic nerve through the visual cortex and motor cortex to send an action signal to your hand muscles.
      </p>
      <div class="distribution-grid">
        <div class="distribution-card">
          <div class="distribution-score" style="color: var(--accent-text);">&lt; 180 ms</div>
          <div class="distribution-label">Esports / Top 1%</div>
        </div>
        <div class="distribution-card">
          <div class="distribution-score" style="color: var(--ink-900);">200 – 240 ms</div>
          <div class="distribution-label">Above Average</div>
        </div>
        <div class="distribution-card">
          <div class="distribution-score" style="color: var(--text-muted);">240 – 280 ms</div>
          <div class="distribution-label">Average Human</div>
        </div>
        <div class="distribution-card">
          <div class="distribution-score" style="color: var(--danger);">&gt; 300 ms</div>
          <div class="distribution-label">Below Average</div>
        </div>
      </div>
    </div>

    <!-- Mobile Placement 4: Ad after Content, before Related Tools -->
    <div class="mobile-ad-post-content">
      {% include mobile-ad.html %}
    </div>
  </div>

  <!-- Sidebar Column: 25% Desktop / 5th Item (Related Tools) on Mobile -->
  {% include sidebar-tools.html %}
</div>
</div>

<script>
(function() {
  var arena = document.getElementById('rt-arena');
  var title = document.getElementById('rt-title');
  var subtitle = document.getElementById('rt-subtitle');
  var icon = document.getElementById('rt-icon');
  var roundEl = document.getElementById('rt-round');
  var currentEl = document.getElementById('rt-current');
  var avgEl = document.getElementById('rt-average');
  var pbEl = document.getElementById('rt-pb');
  var summary = document.getElementById('rt-summary');
  var summaryScore = document.getElementById('rt-summary-score');
  var summaryRating = document.getElementById('rt-summary-rating');
  var restartBtn = document.getElementById('rt-restart-btn');
  var copyBtn = document.getElementById('rt-copy-btn');

  // Web Audio Context for feedback sound
  var audioCtx = null;
  function playTone(freq, duration) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
  }

  var state = 'idle'; // idle, waiting, ready, result, finished
  var round = 0;
  var maxRounds = 5;
  var scores = [];
  var timeoutId = null;
  var startTime = 0;

  // Load Personal Best
  var storedPb = localStorage.getItem('wanjaaro_pb_reaction_time');
  if (storedPb) {
    pbEl.textContent = storedPb + ' ms';
  }

  function setIdle() {
    state = 'idle';
    arena.style.background = '#2b3940';
    icon.textContent = '⚡';
    title.textContent = 'Click to Start';
    subtitle.textContent = 'Click anywhere in this box to begin round ' + (round + 1) + ' of ' + maxRounds + '.';
  }

  function startWaiting() {
    state = 'waiting';
    arena.style.background = '#c82333';
    icon.textContent = '⏳';
    title.textContent = 'Wait for Green...';
    subtitle.textContent = 'Do not click yet!';
    
    // Random delay between 1.8s and 4.8s
    var delay = 1800 + Math.random() * 3000;
    timeoutId = setTimeout(function() {
      state = 'ready';
      arena.style.background = '#02a874';
      icon.textContent = '🟢';
      title.textContent = 'CLICK NOW!';
      subtitle.textContent = 'Click as fast as you can!';
      startTime = performance.now();
      playTone(880, 0.1);
    }, delay);
  }

  function triggerEarlyClick() {
    clearTimeout(timeoutId);
    state = 'early';
    arena.style.background = '#d97706';
    icon.textContent = '⚠️';
    title.textContent = 'Too Soon!';
    subtitle.textContent = 'You clicked before the screen turned green. Click here to retry this round.';
    playTone(220, 0.2);
  }

  function recordSuccess() {
    var reactionTime = Math.round(performance.now() - startTime);
    scores.push(reactionTime);
    round++;
    
    playTone(587, 0.1);
    currentEl.textContent = reactionTime + ' ms';
    roundEl.textContent = round + ' / ' + maxRounds;
    
    var currentAvg = Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length);
    avgEl.textContent = currentAvg + ' ms';

    if (round >= maxRounds) {
      finishTest(currentAvg);
    } else {
      state = 'result';
      arena.style.background = '#0a58ca';
      icon.textContent = '⏱️';
      title.textContent = reactionTime + ' ms';
      subtitle.textContent = 'Click to proceed to round ' + (round + 1) + ' of ' + maxRounds + '.';
    }
  }

  function finishTest(avg) {
    state = 'finished';
    arena.style.background = '#082633';
    icon.textContent = '🏆';
    title.textContent = 'Test Complete: ' + avg + ' ms';
    subtitle.textContent = 'View your performance breakdown and percentile rating below.';
    
    // Update Personal Best
    var currentPb = localStorage.getItem('wanjaaro_pb_reaction_time');
    if (!currentPb || avg < parseInt(currentPb, 10)) {
      localStorage.setItem('wanjaaro_pb_reaction_time', avg);
      pbEl.textContent = avg + ' ms (New PB!)';
    }

    // Daily streak check
    if (window.location.search.indexOf('daily=true') !== -1) {
      var today = new Date().toISOString().split('T')[0];
      var last = localStorage.getItem('wanjaaro_daily_last_played');
      var streak = parseInt(localStorage.getItem('wanjaaro_daily_streak') || '0', 10);
      if (last !== today) {
        streak++;
        localStorage.setItem('wanjaaro_daily_streak', streak);
        localStorage.setItem('wanjaaro_daily_last_played', today);
      }
    }

    // Rating
    var rating = '';
    if (avg < 190) rating = 'Godlike reflex tier! You are in the top 1% of human reaction speed.';
    else if (avg < 230) rating = 'Exceptional reflexes! Faster than 85% of participants.';
    else if (avg < 270) rating = 'Solid reaction speed! Right in the healthy average human window.';
    else rating = 'A bit on the slower side. Warm up your fingers or try reducing display latency!';

    summaryScore.textContent = avg + ' ms Average';
    summaryRating.textContent = rating;
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  arena.addEventListener('mousedown', function(e) {
    e.preventDefault();
    if (state === 'idle' || state === 'early' || state === 'result') {
      startWaiting();
    } else if (state === 'waiting') {
      triggerEarlyClick();
    } else if (state === 'ready') {
      recordSuccess();
    } else if (state === 'finished') {
      resetTest();
    }
  });

  arena.addEventListener('touchstart', function(e) {
    e.preventDefault();
    arena.dispatchEvent(new MouseEvent('mousedown'));
  });

  function resetTest() {
    round = 0;
    scores = [];
    roundEl.textContent = '0 / ' + maxRounds;
    currentEl.textContent = '-- ms';
    avgEl.textContent = '-- ms';
    summary.style.display = 'none';
    setIdle();
  }

  restartBtn.addEventListener('click', resetTest);

  copyBtn.addEventListener('click', function() {
    var avg = avgEl.textContent;
    var text = '⚡ Wanjaaro Reaction Time: ' + avg + ' (5-round avg)\nBenchmark your reflexes at https://wanjaaro.com/reaction-time';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Copy Result 📋'; }, 2000);
    });
  });
})();
</script>
