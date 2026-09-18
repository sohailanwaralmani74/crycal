---
layout: default
title: "WPM Typing Speed Test — Wanjaaro"
description: "Test your Words Per Minute (WPM) and typing accuracy with a calibrated 60-second real-time typing speed test."
permalink: /typing-test
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Typing Benchmark</span>
    <h1>WPM Typing Speed Test</h1>
    <p>Type the passage below as quickly and accurately as possible. The 60-second timer begins with your first keystroke.</p>
  </div>

  <!-- Typing Arena -->
  <div style="max-width: 850px; margin: 0 auto; background: #ffffff; border: 2px solid var(--border-default); border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
    <!-- Text Display Box -->
    <div id="typing-words" style="font-size: 1.35rem; line-height: 1.8; color: var(--text-light); user-select: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; max-height: 190px; overflow: hidden; margin-bottom: 1.5rem; border-bottom: 1px solid #eef1f2; padding-bottom: 1.25rem;">
      <!-- Populated by JS -->
    </div>

    <!-- Live Input Field -->
    <div style="display: flex; gap: 1rem; align-items: center;">
      <input type="text" id="typing-input" placeholder="Start typing here..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="flex: 1; padding: 0.85rem 1.25rem; font-size: 1.2rem; border-radius: 8px; border: 2px solid #07dbd7; outline: none; font-family: inherit; color: var(--ink);">
      <button id="typing-reset-btn" style="background: var(--surface); color: var(--ink); border: 1px solid var(--border-default); padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; white-space: nowrap;">
        Restart ⟳
      </button>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="test-stats-bar" style="max-width: 850px; margin: 1.5rem auto 0;">
    <div class="test-stat-item">
      <div class="test-stat-label">Time Remaining</div>
      <div class="test-stat-val" id="typing-time">60s</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Speed</div>
      <div class="test-stat-val" id="typing-wpm" style="color: #067c7a;">0 WPM</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Accuracy</div>
      <div class="test-stat-val" id="typing-acc">100%</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Personal Best</div>
      <div class="test-stat-val" id="typing-pb">-- WPM</div>
    </div>
  </div>

  <!-- Summary Card -->
  <div id="typing-summary" style="display: none; max-width: 850px; margin: 2rem auto 0; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Test Complete</span>
    <h2 style="font-size: 2.5rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="typing-summary-score">0 WPM</h2>
    <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="typing-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="typing-tryagain-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Try Again
      </button>
      <button id="typing-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Copy Result 📋
      </button>
    </div>
  </div>
</div>

<script>
(function() {
  var wordsContainer = document.getElementById('typing-words');
  var input = document.getElementById('typing-input');
  var timeEl = document.getElementById('typing-time');
  var wpmEl = document.getElementById('typing-wpm');
  var accEl = document.getElementById('typing-acc');
  var pbEl = document.getElementById('typing-pb');
  var summary = document.getElementById('typing-summary');
  var summaryScore = document.getElementById('typing-summary-score');
  var summaryDesc = document.getElementById('typing-summary-desc');
  var resetBtn = document.getElementById('typing-reset-btn');
  var tryAgainBtn = document.getElementById('typing-tryagain-btn');
  var copyBtn = document.getElementById('typing-copy-btn');

  var passage = "Technology develops at an extraordinary pace transforming the way humans communicate think and interact across the globe. Mastery of the keyboard remains one of the fundamental skills for modern knowledge workers and software creators. Speed alone is not enough; true fluency requires unwavering rhythm, mental clarity, and zero hesitation. Every millisecond saved across thousands of sentences compounds into hundreds of hours of preserved human focus and creative output.";
  var words = passage.split(' ');

  var wordIndex = 0;
  var correctChars = 0;
  var totalTypedChars = 0;
  var timeLeft = 60;
  var timer = null;
  var testActive = false;
  var testStarted = false;

  // Load PB
  var pb = localStorage.getItem('wanjaaro_pb_wpm');
  if (pb) pbEl.textContent = pb + ' WPM';

  function renderWords() {
    wordsContainer.innerHTML = '';
    words.forEach(function(word, idx) {
      var span = document.createElement('span');
      span.textContent = word + ' ';
      span.id = 'word-' + idx;
      if (idx === 0) {
        span.style.color = '#082633';
        span.style.textDecoration = 'underline';
        span.style.fontWeight = '700';
      }
      wordsContainer.appendChild(span);
    });
  }

  function startTimer() {
    testStarted = true;
    testActive = true;
    timer = setInterval(function() {
      timeLeft--;
      timeEl.textContent = timeLeft + 's';
      
      // Update real-time WPM: (correctChars / 5) / (elapsedMinutes)
      var elapsedMins = (60 - timeLeft) / 60;
      if (elapsedMins > 0) {
        var currentWpm = Math.round((correctChars / 5) / elapsedMins);
        wpmEl.textContent = currentWpm + ' WPM';
      }

      if (timeLeft <= 0) {
        finishTest();
      }
    }, 1000);
  }

  function finishTest() {
    clearInterval(timer);
    testActive = false;
    input.disabled = true;

    var finalWpm = Math.round(correctChars / 5);
    var acc = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;

    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_wpm') || '0', 10);
    if (finalWpm > currentPb) {
      localStorage.setItem('wanjaaro_pb_wpm', finalWpm);
      pbEl.textContent = finalWpm + ' WPM (New PB!)';
    }

    summaryScore.textContent = finalWpm + ' WPM (' + acc + '% accuracy)';
    summaryDesc.textContent = 'You typed ' + correctChars + ' correct characters in 60 seconds with ' + (totalTypedChars - correctChars) + ' typos.';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  input.addEventListener('input', function(e) {
    if (!testStarted && input.value.trim().length > 0) {
      startTimer();
    }
    if (!testActive && testStarted) return;

    var val = input.value;
    var targetWord = words[wordIndex];

    if (val.endsWith(' ')) {
      // Word completed
      var typedWord = val.trim();
      var currentSpan = document.getElementById('word-' + wordIndex);
      totalTypedChars += (typedWord.length + 1);

      if (typedWord === targetWord) {
        correctChars += (targetWord.length + 1);
        if (currentSpan) {
          currentSpan.style.color = '#02a874';
          currentSpan.style.textDecoration = 'none';
        }
      } else {
        if (currentSpan) {
          currentSpan.style.color = '#b23a3a';
          currentSpan.style.textDecoration = 'line-through';
        }
      }

      var acc = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;
      accEl.textContent = acc + '%';

      input.value = '';
      wordIndex++;

      if (wordIndex < words.length) {
        var nextSpan = document.getElementById('word-' + wordIndex);
        if (nextSpan) {
          nextSpan.style.color = '#082633';
          nextSpan.style.textDecoration = 'underline';
          nextSpan.style.fontWeight = '700';
          // Auto scroll if line wraps
          if (nextSpan.offsetTop > wordsContainer.scrollTop + 100) {
            wordsContainer.scrollTop = nextSpan.offsetTop - 40;
          }
        }
      } else {
        finishTest();
      }
    } else {
      // Check live characters
      var currentSpan = document.getElementById('word-' + wordIndex);
      if (currentSpan) {
        if (targetWord.startsWith(val)) {
          currentSpan.style.color = '#082633';
        } else {
          currentSpan.style.color = '#b23a3a';
        }
      }
    }
  });

  function resetTest() {
    clearInterval(timer);
    timeLeft = 60;
    wordIndex = 0;
    correctChars = 0;
    totalTypedChars = 0;
    testActive = false;
    testStarted = false;
    input.value = '';
    input.disabled = false;
    timeEl.textContent = '60s';
    wpmEl.textContent = '0 WPM';
    accEl.textContent = '100%';
    summary.style.display = 'none';
    renderWords();
    input.focus();
  }

  resetBtn.addEventListener('click', resetTest);
  tryAgainBtn.addEventListener('click', resetTest);

  copyBtn.addEventListener('click', function() {
    var text = '⌨️ Wanjaaro Typing Test: ' + summaryScore.textContent + '\nTest your typing speed at https://wanjaaro.com/typing-test';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Copy Result 📋'; }, 2000);
    });
  });

  renderWords();
})();
</script>
