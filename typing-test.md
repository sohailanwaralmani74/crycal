---
layout: default
title: "WPM Typing Speed Test — Wanjaaro"
description: "Test your Words Per Minute (WPM) and typing accuracy with a calibrated 60-second real-time typing speed test."
permalink: /typing-test
category: typing
sidebar: true
sidebar_title: "Typing Speed (WPM)"
sidebar_subtitle: "60-second typing velocity"
sidebar_icon: "⌨️"
---

<div class="benchmark-hero">
        <span class="benchmark-badge playable">Typing Benchmark</span>
        <h1>WPM Typing Speed Test</h1>
        <p>Type the passage below as quickly and accurately as possible. The 60-second timer begins with your first keystroke.</p>
      </div>

      <!-- Typing Arena -->
      <div class="typing-arena">
        <!-- Text Display Box -->
        <div id="typing-words" class="typing-words">
          <!-- Populated by JS -->
        </div>

        <!-- Live Input Field -->
        <div class="typing-input-row">
          <input type="text" id="typing-input" class="typing-input" placeholder="Start typing here..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          <button id="typing-reset-btn" class="btn btn-outline" style="min-height: 48px;">
            Restart ⟳
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 850px;">
        <div class="test-stat-item">
          <div class="test-stat-label">Time Remaining</div>
          <div class="test-stat-val" id="typing-time">60s</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Speed</div>
          <div class="test-stat-val" id="typing-wpm" style="color: var(--accent-text);">0 WPM</div>
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
      <div id="typing-summary" class="test-summary-card" style="display: none; max-width: 850px;">
        <span class="benchmark-badge playable">Test Complete</span>
        <h2 id="typing-summary-score">0 WPM</h2>
        <p class="test-summary-rating" id="typing-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="typing-tryagain-btn" class="btn btn-primary">
            Try Again
          </button>
          <button id="typing-copy-btn" class="btn btn-accent">
            Copy Result 📋
          </button>
        </div>
      </div>

      <!-- Mobile Placement 2: Ad after Test UI -->
      <div class="mobile-ad-post-test">
        {% include mobile-ad.html %}
      </div>

      <!-- Benchmark Info Context -->
      <div class="benchmark-info-section">
        <h3>About WPM Typing Speed &amp; Fluidity</h3>
        <p>
          Words Per Minute (WPM) is standardly computed as <code>(characters / 5) / minutes</code>. The global average typing speed is roughly <strong>40 WPM</strong>. Professional typists, coders, and writers typically reach between <strong>70 and 110+ WPM</strong> with 97%+ accuracy.
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
