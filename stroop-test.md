---
layout: default
title: "Stroop Effect Test (Cognitive Inhibition) — Wanjaaro"
description: "Test cognitive conflict and mental flexibility. Name the color of the ink, not the printed word, across 20 rapid-fire trials."
permalink: /stroop-test
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Cognitive Benchmark</span>
    <h1>Stroop Effect Test</h1>
    <p>
      Click the button matching the <strong>color of the ink</strong>, NOT what the word spells out!
      Measures executive function, semantic interference, and neurological impulse inhibition.
    </p>
  </div>

  <!-- Test Arena -->
  <div style="max-width: 650px; margin: 0 auto; background: #082633; border: 2px solid #07dbd7; border-radius: 14px; padding: 2.5rem 1.5rem; text-align: center; position: relative;">
    <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7ba2b2; margin-bottom: 1rem;" id="stroop-progress">
      Round 1 of 20
    </div>

    <!-- Central Word Display -->
    <div id="stroop-word" style="font-size: clamp(2.5rem, 6vw, 4.2rem); font-weight: 900; margin: 1.5rem 0 2rem; letter-spacing: 0.05em; min-height: 80px; display: flex; align-items: center; justify-content: center;">
      READY
    </div>

    <!-- Color Buttons Grid -->
    <div id="stroop-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 480px; margin: 0 auto;">
      <button class="stroop-btn" data-color="RED" style="background: #dc2626; color: #ffffff; border: none; padding: 1rem; border-radius: 8px; font-weight: 800; font-size: 1.1rem; cursor: pointer;">Red</button>
      <button class="stroop-btn" data-color="BLUE" style="background: #2563eb; color: #ffffff; border: none; padding: 1rem; border-radius: 8px; font-weight: 800; font-size: 1.1rem; cursor: pointer;">Blue</button>
      <button class="stroop-btn" data-color="GREEN" style="background: #16a34a; color: #ffffff; border: none; padding: 1rem; border-radius: 8px; font-weight: 800; font-size: 1.1rem; cursor: pointer;">Green</button>
      <button class="stroop-btn" data-color="YELLOW" style="background: #ca8a04; color: #ffffff; border: none; padding: 1rem; border-radius: 8px; font-weight: 800; font-size: 1.1rem; cursor: pointer;">Yellow</button>
    </div>

    <!-- Overlay -->
    <div id="stroop-overlay" style="position: absolute; inset: 0; background: rgba(8, 38, 51, 0.94); border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; color: #ffffff;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🧠</div>
      <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; color: #ffffff; border: none; padding: 0;">Stroop Effect</h2>
      <p style="color: #b0c6cf; max-width: 420px; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.5;">
        You will be shown 20 words. Choose the color of the text, not what the word reads. Be both fast and accurate!
      </p>
      <button id="stroop-start-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.85rem 2.25rem; font-size: 1.1rem; font-weight: 800; border-radius: 8px; cursor: pointer;">
        Start Challenge
      </button>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="test-stats-bar" style="max-width: 650px; margin: 1.5rem auto 0;">
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
      <div class="test-stat-val" id="stroop-pb" style="color: #067c7a;">-- ms</div>
    </div>
  </div>

  <!-- Summary Card -->
  <div id="stroop-summary" style="display: none; max-width: 650px; margin: 2rem auto 0; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Test Finished</span>
    <h2 style="font-size: 2.3rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="stroop-summary-score">-- ms</h2>
    <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="stroop-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="stroop-restart-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Play Again
      </button>
      <button id="stroop-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Share Score 📋
      </button>
    </div>
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
