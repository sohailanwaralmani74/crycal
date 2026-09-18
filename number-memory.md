---
layout: default
title: "Number Memory Test (Digit Span) — Wanjaaro"
description: "Test your short-term digit memory capacity. Memorize an increasingly long number displayed on screen."
permalink: /number-memory
category: memory
sidebar: true
sidebar_title: "Number Memory"
sidebar_subtitle: "Digit span memory test"
sidebar_icon: "🔢"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
        <span class="benchmark-badge playable">Memory Benchmark</span>
        <h1>Number Memory Test</h1>
        <p>
          The average human memory span for numbers is 7 &plusmn; 2 digits (Miller's Law).
          Memorize the number shown on screen, then type it back accurately.
        </p>
      </div>

      <!-- Test Arena -->
      <div class="number-memory-arena">
        <!-- State 1: Showing Number -->
        <div id="num-display-box" style="display: none;">
          <div class="number-level-label" id="num-level-label">Level 1</div>
          <div id="num-value" class="number-display-val">123</div>
          
          <!-- Progress Bar (Time Remaining to view) -->
          <div class="number-progress-track">
            <div id="num-progress" class="number-progress-bar"></div>
          </div>
        </div>

        <!-- State 2: Input Number -->
        <div id="num-input-box" style="display: none;">
          <h3 style="font-size: 1.5rem; color: #ffffff; border: none; padding: 0; margin-bottom: 1rem;">What was the number?</h3>
          <input type="text" id="num-input" class="number-input-field" placeholder="Type the number..." autocomplete="off">
          <br>
          <button id="num-submit-btn" class="btn btn-accent" style="margin-top: 1.25rem;">
            Submit
          </button>
        </div>

        <!-- State 0: Start Overlay -->
        <div id="num-overlay" class="test-modal-overlay">
          <div class="test-arena-icon">🔢</div>
          <h2>Number Memory</h2>
          <p>
            A number will be displayed for a few seconds. Remember it and type it back. Each level adds an additional digit.
          </p>
          <button id="num-start-btn" class="btn btn-accent">
            Start Test
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 600px;">
        <div class="test-stat-item">
          <div class="test-stat-label">Level</div>
          <div class="test-stat-val" id="num-stat-level">1</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Digits</div>
          <div class="test-stat-val" id="num-stat-digits">1</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Personal Best</div>
          <div class="test-stat-val" id="num-pb" style="color: var(--accent-text);">--</div>
        </div>
      </div>

      <!-- Summary Card -->
      <div id="num-summary" class="test-summary-card" style="display: none; max-width: 600px;">
        <span class="benchmark-badge playable">Test Over</span>
        <h2 id="num-summary-score">Level 0</h2>
        <p class="test-summary-rating" id="num-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="num-restart-btn" class="btn btn-primary">
            Play Again
          </button>
          <button id="num-copy-btn" class="btn btn-accent">
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
        <h3>About Digit Span Memory</h3>
        <p>
          Digit span testing evaluates the phonological loop of working memory. In 1956, George Miller established the magical number 7 &plusmn; 2 as the limit of human short-term storage. Using mnemonic grouping (chunking) can significantly increase retention.
        </p>
      </div>

      <!-- Mobile Placement 4: Ad after Content, before Related Tools -->
      <div class="mobile-ad-post-content">
        {% include mobile-ad.html %}
      </div>
    </div>
  </div>

<script>
(function() {
  var overlay = document.getElementById('num-overlay');
  var startBtn = document.getElementById('num-start-btn');
  var displayBox = document.getElementById('num-display-box');
  var inputBox = document.getElementById('num-input-box');
  var levelLabel = document.getElementById('num-level-label');
  var numValue = document.getElementById('num-value');
  var progressBar = document.getElementById('num-progress');
  var input = document.getElementById('num-input');
  var submitBtn = document.getElementById('num-submit-btn');
  var statLevel = document.getElementById('num-stat-level');
  var statDigits = document.getElementById('num-stat-digits');
  var pbEl = document.getElementById('num-pb');
  var summary = document.getElementById('num-summary');
  var summaryScore = document.getElementById('num-summary-score');
  var summaryDesc = document.getElementById('num-summary-desc');
  var restartBtn = document.getElementById('num-restart-btn');
  var copyBtn = document.getElementById('num-copy-btn');

  var level = 1;
  var currentNumberStr = '';
  var showTimeout = null;

  // Stored PB
  var pb = localStorage.getItem('wanjaaro_pb_number');
  if (pb) pbEl.textContent = pb + ' Digits';

  var audioCtx = null;
  function beep(f, dur) {
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

  function generateNumber(digits) {
    var str = '';
    for (var i = 0; i < digits; i++) {
      if (i === 0) {
        str += Math.floor(1 + Math.random() * 9);
      } else {
        str += Math.floor(Math.random() * 10);
      }
    }
    return str;
  }

  function startRound() {
    statLevel.textContent = level;
    statDigits.textContent = level;
    levelLabel.textContent = 'Level ' + level + ' (' + level + ' Digits)';
    currentNumberStr = generateNumber(level);
    numValue.textContent = currentNumberStr;

    inputBox.style.display = 'none';
    displayBox.style.display = 'block';

    // Duration: 1500ms + 700ms per digit
    var duration = 1500 + level * 700;
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';
    
    setTimeout(function() {
      progressBar.style.transition = 'width ' + duration + 'ms linear';
      progressBar.style.width = '0%';
    }, 50);

    showTimeout = setTimeout(function() {
      displayBox.style.display = 'none';
      inputBox.style.display = 'block';
      input.value = '';
      input.focus();
    }, duration);
  }

  function handleSubmit() {
    var userVal = input.value.trim();
    if (userVal === currentNumberStr) {
      beep(750, 0.1);
      level++;
      startRound();
    } else {
      beep(200, 0.2);
      gameOver(userVal);
    }
  }

  function gameOver(wrongVal) {
    var maxDigits = level - 1;

    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_number') || '0', 10);
    if (maxDigits > currentPb) {
      localStorage.setItem('wanjaaro_pb_number', maxDigits);
      pbEl.textContent = maxDigits + ' Digits (New PB!)';
    }

    displayBox.style.display = 'none';
    inputBox.style.display = 'none';

    summaryScore.textContent = maxDigits + ' Digits';
    summaryDesc.textContent = 'Number was ' + currentNumberStr + ', you entered ' + (wrongVal || '(blank)') + '. Standard human digit capacity is 7 ± 2 digits.';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  submitBtn.addEventListener('click', handleSubmit);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSubmit();
  });

  function start() {
    overlay.style.display = 'none';
    summary.style.display = 'none';
    level = 1;
    startRound();
  }

  startBtn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);

  copyBtn.addEventListener('click', function() {
    var text = '🔢 Wanjaaro Number Memory: ' + summaryScore.textContent + '\nTest your digit span at https://wanjaaro.com/number-memory';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Score 📋'; }, 2000);
    });
  });
})();
</script>
