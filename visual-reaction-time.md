---
layout: default
title: "Visual Reaction Time Test — Wanjaaro"
description: "Free browser-based visual reaction time test. Complete five rounds, see your response time in milliseconds, and keep a personal best in your browser."
permalink: /visual-reaction-time
category: reflex
sidebar: true
sidebar_title: "Visual Reaction Time"
sidebar_subtitle: "Five-round visual response test"
sidebar_icon: "⚡"
---

<div class="benchmark-container">

  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Reflex Test</span>
    <h1>Visual Reaction Time Test</h1>
    <p>
      Wait for the red test area to turn <strong style="color: var(--success-text);">green</strong>,
      then click or tap as quickly as you can. The test uses five rounds and reports your
      response time in milliseconds.
    </p>
  </section>

  <section aria-labelledby="test-instructions">
    <div class="benchmark-content-block">
      <h2 id="test-instructions">How the Test Works</h2>
      <p>
        Click the test area to begin a round. It will turn red while you wait for the signal.
        When it changes to green, respond immediately. Clicking before the green signal counts
        as an early response and lets you retry that round.
      </p>
    </div>
  </section>

  <div class="test-arena-wrapper">
    <div id="rt-arena" class="test-arena">
      <div id="rt-icon" class="test-arena-icon">⚡</div>
      <h2 id="rt-title">Click to Start</h2>
      <p id="rt-subtitle">Click anywhere in this box to begin round 1 of 5.</p>
    </div>
  </div>

  <div class="test-stats-bar" aria-label="Reaction time results">
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

  <div id="rt-summary" class="test-summary-card" style="display: none;" aria-live="polite">
    <span class="benchmark-badge playable">Test Complete</span>
    <h2 id="rt-summary-score">-- ms</h2>
    <p class="test-summary-rating" id="rt-summary-rating">
      Your five-round average is shown above. Use repeated attempts under similar conditions
      when comparing your own results.
    </p>

    <div class="summary-actions">
      <button id="rt-restart-btn" class="btn btn-primary" type="button">Try Again</button>
      <button id="rt-copy-btn" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <div class="mobile-ad-post-test">
    {% include mobile-ad.html %}
  </div>

  <section class="benchmark-info-section" aria-labelledby="what-it-measures">
    <h2 id="what-it-measures">What This Test Measures</h2>
    <p>
      This is a simple visual response test. It measures the time between the test signal
      becoming available and your click or tap being recorded by the browser. Your result
      therefore reflects both your response and the conditions under which the test is run.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="understanding-result">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="understanding-result">Understanding Your Result</h2>
        <p>Your five-round average is the main result shown by the test.</p>
      </div>
    </div>
    <p>
      A lower time means a shorter measured response interval for this test. There is no single
      result that represents everyone's reaction ability, so Wanjaaro does not assign a universal
      ranking to your score. If you want to track your own performance, compare attempts made
      with the same device, browser, display, and input method.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="factors">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="factors">What Can Affect the Result?</h2>
        <p>The number on screen is influenced by the testing setup as well as your response.</p>
      </div>
    </div>
    <p>
      Attention, fatigue, familiarity with the test, mouse or touchscreen behavior, display
      characteristics, browser timing, system activity, and anticipation can all affect an
      individual attempt. For a useful personal comparison, keep the testing conditions as
      consistent as possible.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="browser-testing">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="browser-testing">Browser-Based Testing</h2>
        <p>No account is required.</p>
      </div>
      <span class="benchmark-badge playable">Free to Use</span>
    </div>
    <p>
      The test runs directly in your browser. Your personal-best value is stored locally in
      your browser so it can be displayed on later visits from the same browser storage.
      The test is intended for personal benchmarking and quick reaction challenges, not for
      clinical assessment.
    </p>
  </section>

  <div class="mobile-ad-post-content">
    {% include mobile-ad.html %}
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
  var restartBtn = document.getElementById('rt-restart-btn');
  var copyBtn = document.getElementById('rt-copy-btn');

  var audioCtx = null;

  function playTone(freq, duration) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
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
    } catch (e) {}
  }

  var state = 'idle';
  var round = 0;
  var maxRounds = 5;
  var scores = [];
  var timeoutId = null;
  var startTime = 0;

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

    var currentAvg = Math.round(
      scores.reduce(function(a, b) { return a + b; }, 0) / scores.length
    );
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
    icon.textContent = '🏁';
    title.textContent = 'Test Complete: ' + avg + ' ms';
    subtitle.textContent = 'Your five-round average is shown below.';

    var currentPb = localStorage.getItem('wanjaaro_pb_reaction_time');

    if (!currentPb || avg < parseInt(currentPb, 10)) {
      localStorage.setItem('wanjaaro_pb_reaction_time', avg);
      pbEl.textContent = avg + ' ms (New PB!)';
    }

    summaryScore.textContent = avg + ' ms Average';
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
  }, { passive: false });

  function resetTest() {
    clearTimeout(timeoutId);
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
    var text = '⚡ Wanjaaro Visual Reaction Time: ' + avg +
      ' (5-round average)\nTest: https://wanjaaro.com/visual-reaction-time';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        copyBtn.textContent = 'Copied to Clipboard! ✓';
        setTimeout(function() {
          copyBtn.textContent = 'Copy Result 📋';
        }, 2000);
      }).catch(function() {});
    }
  });
})();
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://wanjaaro.com/visual-reaction-time#webpage",
      "url": "https://wanjaaro.com/visual-reaction-time",
      "name": "Visual Reaction Time Test — Wanjaaro",
      "description": "Free browser-based visual reaction time test. Complete five rounds, see your response time in milliseconds, and keep a personal best in your browser.",
      "isPartOf": {
        "@id": "https://wanjaaro.com/#website"
      },
      "mainEntity": {
        "@id": "https://wanjaaro.com/visual-reaction-time#application"
      },
      "breadcrumb": {
        "@id": "https://wanjaaro.com/visual-reaction-time#breadcrumb"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://wanjaaro.com/visual-reaction-time#application",
      "name": "Wanjaaro Visual Reaction Time Test",
      "url": "https://wanjaaro.com/visual-reaction-time",
      "description": "A five-round browser-based test that measures the recorded response time after a visual signal appears.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "browserRequirements": "JavaScript enabled",
      "isPartOf": {
        "@id": "https://wanjaaro.com/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wanjaaro.com/visual-reaction-time#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Wanjaaro",
          "item": "https://wanjaaro.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Reflex & Reaction Tests",
          "item": "https://wanjaaro.com/reflex"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Visual Reaction Time Test",
          "item": "https://wanjaaro.com/visual-reaction-time"
        }
      ]
    }
  ]
}
</script>
