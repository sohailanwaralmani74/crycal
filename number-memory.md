---
layout: default
title: "Number Memory Test (Digit Span) — Wanjaaro"
description: "Test your short-term digit memory capacity. Memorize an increasingly long number displayed on screen."
permalink: /number-memory
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Memory Benchmark</span>
    <h1>Number Memory Test</h1>
    <p>
      The average human memory span for numbers is 7 &plusmn; 2 digits (Miller's Law).
      Memorize the number shown on screen, then type it back accurately.
    </p>
  </div>

  <!-- Test Arena -->
  <div style="max-width: 600px; margin: 0 auto; background: #082633; border: 2px solid #07dbd7; border-radius: 14px; padding: 3rem 1.5rem; text-align: center; color: #ffffff; position: relative;">
    
    <!-- State 1: Showing Number -->
    <div id="num-display-box" style="display: none;">
      <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7ba2b2; margin-bottom: 0.5rem;" id="num-level-label">Level 1</div>
      <div id="num-value" style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; font-family: monospace; letter-spacing: 0.1em; color: #07dbd7; margin: 1.5rem 0;">123</div>
      
      <!-- Progress Bar (Time Remaining to view) -->
      <div style="width: 80%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; margin: 0 auto; overflow: hidden;">
        <div id="num-progress" style="width: 100%; height: 100%; background: #07dbd7; transition: width linear;"></div>
      </div>
    </div>

    <!-- State 2: Input Number -->
    <div id="num-input-box" style="display: none;">
      <h3 style="font-size: 1.5rem; color: #ffffff; border: none; padding: 0; margin-bottom: 1rem;">What was the number?</h3>
      <input type="text" id="num-input" placeholder="Type the number..." autocomplete="off" style="width: 80%; max-width: 320px; padding: 0.85rem 1.25rem; font-size: 1.4rem; font-family: monospace; text-align: center; border-radius: 8px; border: 2px solid #07dbd7; outline: none; margin-bottom: 1.5rem; color: #082633;">
      <br>
      <button id="num-submit-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.85rem 2.25rem; font-size: 1.1rem; font-weight: 800; border-radius: 8px; cursor: pointer;">
        Submit
      </button>
    </div>

    <!-- State 0: Start Overlay -->
    <div id="num-overlay" style="position: absolute; inset: 0; background: rgba(8, 38, 51, 0.94); border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🔢</div>
      <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; color: #ffffff; border: none; padding: 0;">Number Memory</h2>
      <p style="color: #b0c6cf; max-width: 380px; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.5;">
        A number will be displayed for a few seconds. Remember it and type it back. Each level adds an additional digit.
      </p>
      <button id="num-start-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.85rem 2.25rem; font-size: 1.1rem; font-weight: 800; border-radius: 8px; cursor: pointer;">
        Start Test
      </button>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="test-stats-bar" style="max-width: 600px; margin: 1.5rem auto 0;">
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
      <div class="test-stat-val" id="num-pb" style="color: #067c7a;">--</div>
    </div>
  </div>

  <!-- Summary Card -->
  <div id="num-summary" style="display: none; max-width: 600px; margin: 2rem auto 0; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Test Over</span>
    <h2 style="font-size: 2.3rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="num-summary-score">Level 0</h2>
    <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="num-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="num-restart-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Play Again
      </button>
      <button id="num-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Share Score 📋
      </button>
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
