---
layout: default
title: "Stroop Effect Test (Cognitive Inhibition) — Wanjaaro"
description: "Test cognitive conflict and mental flexibility. Name the color of the ink, not the printed word, across 20 rapid-fire trials."
permalink: /stroop-test
---

<div class="benchmark-container">
  <div class="benchmark-layout-split">
    <!-- Main Column: 75% Desktop / Primary Flow on Mobile -->
    <div class="benchmark-main-column">
      <div class="benchmark-hero">
        <span class="benchmark-badge playable">Cognitive Benchmark</span>
        <h1>Stroop Effect Test</h1>
        <p>
          Click the button matching the <strong>color of the ink</strong>, NOT what the word spells out!
          Measures executive function, semantic interference, and neurological impulse inhibition.
        </p>
      </div>

      <!-- Test Arena -->
      <div class="stroop-arena">
        <div class="stroop-progress" id="stroop-progress">
          Round 1 of 20
        </div>

        <!-- Central Word Display -->
        <div id="stroop-word" class="stroop-word">
          READY
        </div>

        <!-- Color Buttons Grid -->
        <div id="stroop-buttons" class="stroop-buttons-grid">
          <button class="stroop-btn btn-color-red" data-color="RED">Red</button>
          <button class="stroop-btn btn-color-blue" data-color="BLUE">Blue</button>
          <button class="stroop-btn btn-color-green" data-color="GREEN">Green</button>
          <button class="stroop-btn btn-color-yellow" data-color="YELLOW">Yellow</button>
        </div>

        <!-- Overlay -->
        <div id="stroop-overlay" class="test-modal-overlay">
          <div class="test-arena-icon">🧠</div>
          <h2>Stroop Effect</h2>
          <p>
            You will be shown 20 words. Choose the color of the text, not what the word reads. Be both fast and accurate!
          </p>
          <button id="stroop-start-btn" class="btn btn-accent">
            Start Challenge
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 650px;">
        <div class="test-stat-item">
          <div class="test-stat-label">Accuracy</div>
          <div class="test-stat-val" id="stroop-acc">100%</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Avg Decision Time</div>
          <div class="test-stat-val" id="stroop-avg-time">-- ms</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Personal Best</div>
          <div class="test-stat-val" id="stroop-pb" style="color: var(--accent-text);">-- ms</div>
        </div>
      </div>

      <!-- Summary Card -->
      <div id="stroop-summary" class="test-summary-card" style="display: none; max-width: 650px;">
        <span class="benchmark-badge playable">Test Finished</span>
        <h2 id="stroop-summary-score">-- ms</h2>
        <p class="test-summary-rating" id="stroop-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="stroop-restart-btn" class="btn btn-primary">
            Play Again
          </button>
          <button id="stroop-copy-btn" class="btn btn-accent">
            Share Score 📋
          </button>
        </div>
      </div>

      <!-- Mobile Placement 2: Ad after Test UI -->
      <div class="mobile-ad-post-test">
        {% include mobile-ad.html %}
      </div>

      <!-- Benchmark Info Context -->
      <div class="benchmark-info-section">
        <h3>About the Stroop Effect &amp; Interference</h3>
        <p>
          Discovered by John Ridley Stroop in 1935, this effect illustrates automatic cognitive processing. Reading words is an involuntary automatic habit for literate humans, requiring conscious executive inhibition from the prefrontal cortex to name the incongruent ink color instead.
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
  var overlay = document.getElementById('stroop-overlay');
  var startBtn = document.getElementById('stroop-start-btn');
  var wordEl = document.getElementById('stroop-word');
  var progressEl = document.getElementById('stroop-progress');
  var accEl = document.getElementById('stroop-acc');
  var avgTimeEl = document.getElementById('stroop-avg-time');
  var pbEl = document.getElementById('stroop-pb');
  var summary = document.getElementById('stroop-summary');
  var summaryScore = document.getElementById('stroop-summary-score');
  var summaryDesc = document.getElementById('stroop-summary-desc');
  var restartBtn = document.getElementById('stroop-restart-btn');
  var copyBtn = document.getElementById('stroop-copy-btn');
  var buttons = document.querySelectorAll('.stroop-btn');

  var colors = [
    { name: 'RED', hex: '#ef4444' },
    { name: 'BLUE', hex: '#3b82f6' },
    { name: 'GREEN', hex: '#22c55e' },
    { name: 'YELLOW', hex: '#eab308' }
  ];

  var totalRounds = 20;
  var currentRound = 0;
  var correctCount = 0;
  var responseTimes = [];
  var roundStartTime = 0;
  var currentInkColor = '';
  var active = false;

  // Stored PB
  var pb = localStorage.getItem('wanjaaro_pb_stroop');
  if (pb) pbEl.textContent = pb + ' ms';

  var audioCtx = null;
  function tone(f, dur) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch(e) {}
  }

  function nextTrial() {
    currentRound++;
    if (currentRound > totalRounds) {
      finishTest();
      return;
    }

    progressEl.textContent = 'Round ' + currentRound + ' of ' + totalRounds;

    // Pick random text and random ink color (mismatched ~80% of the time)
    var textIndex = Math.floor(Math.random() * colors.length);
    var colorIndex = Math.floor(Math.random() * colors.length);
    // Ensure good conflict
    if (Math.random() > 0.25 && colorIndex === textIndex) {
      colorIndex = (colorIndex + 1) % colors.length;
    }

    wordEl.textContent = colors[textIndex].name;
    wordEl.style.color = colors[colorIndex].hex;
    currentInkColor = colors[colorIndex].name;

    roundStartTime = performance.now();
  }

  function handleColorSelect(selected) {
    if (!active) return;
    var latency = Math.round(performance.now() - roundStartTime);
    responseTimes.push(latency);

    if (selected === currentInkColor) {
      correctCount++;
      tone(700, 0.08);
    } else {
      tone(200, 0.15);
    }

    var currentAvg = Math.round(responseTimes.reduce(function(a, b) { return a + b; }, 0) / responseTimes.length);
    avgTimeEl.textContent = currentAvg + ' ms';
    accEl.textContent = Math.round((correctCount / currentRound) * 100) + '%';

    nextTrial();
  }

  function finishTest() {
    active = false;
    wordEl.textContent = 'COMPLETE';
    wordEl.style.color = '#07dbd7';

    var avg = Math.round(responseTimes.reduce(function(a, b) { return a + b; }, 0) / responseTimes.length);
    var acc = Math.round((correctCount / totalRounds) * 100);

    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_stroop') || '9999', 10);
    if (acc >= 90 && avg < currentPb) {
      localStorage.setItem('wanjaaro_pb_stroop', avg);
      pbEl.textContent = avg + ' ms (New PB!)';
    }

    summaryScore.textContent = avg + ' ms (' + acc + '% Accuracy)';
    summaryDesc.textContent = 'Completed 20 Stroop interference rounds with ' + correctCount + ' correct answers. Average reaction latency was ' + avg + 'ms.';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  buttons.forEach(function(b) {
    b.addEventListener('click', function() {
      handleColorSelect(b.dataset.color);
    });
  });

  function start() {
    overlay.style.display = 'none';
    summary.style.display = 'none';
    currentRound = 0;
    correctCount = 0;
    responseTimes = [];
    active = true;
    nextTrial();
  }

  startBtn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);

  copyBtn.addEventListener('click', function() {
    var text = '🧠 Wanjaaro Stroop Test: ' + summaryScore.textContent + '\nTest your cognitive control at https://wanjaaro.com/stroop-test';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Score 📋'; }, 2000);
    });
  });
})();
</script>
