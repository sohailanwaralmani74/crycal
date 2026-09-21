---
layout: default
title: "Audio Reaction Time Test — Wanjaaro"
description: "Free browser-based audio reaction time test. Listen for a tone, respond as quickly as you can, and compare your five-round average with your own previous results."
permalink: /audio-reaction-time
category: reflex
sidebar: true
sidebar_title: "Audio Reaction Time"
sidebar_subtitle: "Five-round sound response test"
sidebar_icon: "🔊"
---

<div class="benchmark-container">

  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Reflex Test</span>
    <h1>Audio Reaction Time Test</h1>
    <p>
      Listen for a short tone and respond as soon as you hear it. This five-round test
      measures the time between the audio signal and your recorded response.
    </p>
  </section>

  <section aria-labelledby="audio-instructions">
    <div class="benchmark-content-block">
      <h2 id="audio-instructions">How the Test Works</h2>
      <p>
        Start a round, then wait without watching the test area for the signal. After a
        random delay, Wanjaaro plays a short tone. Press the button or the Space key as
        quickly as you can after hearing it. Responding before the tone is treated as an
        early response and does not count as a completed round.
      </p>
      <p>
        Your browser must allow audio playback. Headphones or speakers can be used, but keep
        the volume comfortable and use the same setup when comparing your own results.
      </p>
    </div>
  </section>

  <div class="test-arena-wrapper">
    <div id="art-arena" class="test-arena" tabindex="0" role="button" aria-label="Audio reaction test area">
      <div id="art-icon" class="test-arena-icon">🔊</div>
      <h2 id="art-title">Click to Start</h2>
      <p id="art-subtitle">Click here or press Space to begin round 1 of 5.</p>
    </div>
  </div>

  <div class="test-stats-bar" aria-label="Audio reaction time results">
    <div class="test-stat-item">
      <div class="test-stat-label">Round</div>
      <div class="test-stat-val" id="art-round">0 / 5</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Current Round</div>
      <div class="test-stat-val" id="art-current">-- ms</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Average Time</div>
      <div class="test-stat-val" id="art-average">-- ms</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Personal Best</div>
      <div class="test-stat-val" id="art-pb" style="color: var(--accent-text);">-- ms</div>
    </div>
  </div>

  <div id="art-summary" class="test-summary-card" style="display: none;" aria-live="polite">
    <span class="benchmark-badge playable">Test Complete</span>
    <h2 id="art-summary-score">-- ms</h2>
    <p class="test-summary-rating">
      This is your five-round average. Repeat the test under similar audio and device
      conditions if you want to compare your own performance over time.
    </p>
    <div class="summary-actions">
      <button id="art-restart-btn" class="btn btn-primary" type="button">Try Again</button>
      <button id="art-copy-btn" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <div class="mobile-ad-post-test">
    {% include mobile-ad.html %}
  </div>

  <section class="benchmark-info-section" aria-labelledby="audio-measures">
    <h2 id="audio-measures">What This Test Measures</h2>
    <p>
      The test records the interval between the scheduled audio signal and your response.
      It is a browser-based reaction challenge rather than a clinical or laboratory
      measurement. Audio output, input hardware, browser timing, and system activity can
      all be part of the measured result.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-result">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-result">Understanding Your Result</h2>
        <p>The five-round average is the main result shown by this test.</p>
      </div>
    </div>
    <p>
      A lower value means the recorded response interval was shorter in these rounds.
      Rather than assigning a universal ability label, Wanjaaro keeps the result focused
      on the actual measurements from your attempt.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-factors">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-factors">What Can Affect the Result?</h2>
        <p>Audio reaction results depend on more than the response itself.</p>
      </div>
    </div>
    <p>
      Speaker or headphone latency, volume, background noise, browser and system activity,
      attention, fatigue, and familiarity with the test can change an attempt. For a
      meaningful personal comparison, keep your audio device, browser, and general setup
      consistent.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-browser">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-browser">Browser-Based Audio Test</h2>
        <p>No account or upload is required.</p>
      </div>
      <span class="benchmark-badge playable">Free to Use</span>
    </div>
    <p>
      The tone is generated in your browser with the Web Audio API. Your personal-best
      average is stored in local browser storage so it can be shown on later visits from
      the same browser. If sound is blocked, interact with the test area first and check
      your browser's audio or site permissions.
    </p>
  </section>

  <div class="mobile-ad-post-content">
    {% include mobile-ad.html %}
  </div>

</div>

<script>
(function() {
  var arena = document.getElementById('art-arena');
  var title = document.getElementById('art-title');
  var subtitle = document.getElementById('art-subtitle');
  var icon = document.getElementById('art-icon');
  var roundEl = document.getElementById('art-round');
  var currentEl = document.getElementById('art-current');
  var avgEl = document.getElementById('art-average');
  var pbEl = document.getElementById('art-pb');
  var summary = document.getElementById('art-summary');
  var summaryScore = document.getElementById('art-summary-score');
  var restartBtn = document.getElementById('art-restart-btn');
  var copyBtn = document.getElementById('art-copy-btn');

  var audioCtx = null;
  var state = 'idle';
  var round = 0;
  var maxRounds = 5;
  var scores = [];
  var timeoutId = null;
  var startTime = 0;
  var pbKey = 'wanjaaro_pb_audio_reaction_time';

  var storedPb = localStorage.getItem(pbKey);
  if (storedPb) {
    pbEl.textContent = storedPb + ' ms';
  }

  function ensureAudio() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return false;
      }
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return true;
  }

  function playTone() {
    if (!ensureAudio()) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  }

  function setIdle() {
    state = 'idle';
    arena.style.background = '#2b3940';
    icon.textContent = '🔊';
    title.textContent = 'Click to Start';
    subtitle.textContent = 'Click here or press Space to begin round ' + (round + 1) + ' of ' + maxRounds + '.';
  }

  function startWaiting() {
    if (!ensureAudio()) {
      title.textContent = 'Audio Not Available';
      subtitle.textContent = 'This browser does not provide the Web Audio API.';
      return;
    }

    state = 'waiting';
    arena.style.background = '#3b4650';
    icon.textContent = '👂';
    title.textContent = 'Listen...';
    subtitle.textContent = 'Wait for the tone. Do not respond yet.';

    var delay = 1800 + Math.random() * 3000;

    timeoutId = setTimeout(function() {
      state = 'ready';
      arena.style.background = '#02a874';
      icon.textContent = '🔔';
      title.textContent = 'RESPOND NOW';
      subtitle.textContent = 'Press Space or click the test area.';
      playTone();
      startTime = performance.now();
    }, delay);
  }

  function triggerEarly() {
    clearTimeout(timeoutId);
    state = 'early';
    arena.style.background = '#d97706';
    icon.textContent = '⚠️';
    title.textContent = 'Too Soon';
    subtitle.textContent = 'Wait until you hear the tone, then respond. Click or press Space to retry.';
  }

  function recordSuccess() {
    var reactionTime = Math.round(performance.now() - startTime);
    scores.push(reactionTime);
    round++;

    currentEl.textContent = reactionTime + ' ms';
    roundEl.textContent = round + ' / ' + maxRounds;

    var average = Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length);
    avgEl.textContent = average + ' ms';

    if (round >= maxRounds) {
      finishTest(average);
    } else {
      state = 'result';
      arena.style.background = '#0a58ca';
      icon.textContent = '⏱️';
      title.textContent = reactionTime + ' ms';
      subtitle.textContent = 'Click or press Space to continue to round ' + (round + 1) + '.';
    }
  }

  function finishTest(average) {
    state = 'finished';
    arena.style.background = '#082633';
    icon.textContent = '🏁';
    title.textContent = 'Test Complete: ' + average + ' ms';
    subtitle.textContent = 'Your five-round average is shown below.';

    var oldPb = localStorage.getItem(pbKey);
    if (!oldPb || average < parseInt(oldPb, 10)) {
      localStorage.setItem(pbKey, average);
      pbEl.textContent = average + ' ms (New PB!)';
    }

    summaryScore.textContent = average + ' ms Average';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  function handleResponse() {
    if (state === 'idle' || state === 'early' || state === 'result') {
      startWaiting();
    } else if (state === 'waiting') {
      triggerEarly();
    } else if (state === 'ready') {
      recordSuccess();
    } else if (state === 'finished') {
      resetTest();
    }
  }

  arena.addEventListener('click', function(e) {
    e.preventDefault();
    handleResponse();
  });

  arena.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      handleResponse();
    }
  });

  function resetTest() {
    clearTimeout(timeoutId);
    round = 0;
    scores = [];
    roundEl.textContent = '0 / ' + maxRounds;
    currentEl.textContent = '-- ms';
    avgEl.textContent = '-- ms';
    summary.style.display = 'none';
    setIdle();
    arena.focus();
  }

  restartBtn.addEventListener('click', resetTest);

  copyBtn.addEventListener('click', function() {
    var text = '🔊 Wanjaaro Audio Reaction Time: ' + avgEl.textContent +
      ' (5-round average)\nTest: https://wanjaaro.com/audio-reaction-time';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        copyBtn.textContent = 'Copied to Clipboard! ✓';
        setTimeout(function() {
          copyBtn.textContent = 'Copy Result 📋';
        }, 2000);
      }).catch(function() {});
    }
  });

  setIdle();
})();
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://wanjaaro.com/audio-reaction-time#webpage",
      "url": "https://wanjaaro.com/audio-reaction-time",
      "name": "Audio Reaction Time Test — Wanjaaro",
      "description": "Free browser-based audio reaction time test. Listen for a tone, respond as quickly as you can, and compare your five-round average with your own previous results.",
      "isPartOf": {
        "@id": "https://wanjaaro.com/#website"
      },
      "mainEntity": {
        "@id": "https://wanjaaro.com/audio-reaction-time#application"
      },
      "breadcrumb": {
        "@id": "https://wanjaaro.com/audio-reaction-time#breadcrumb"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://wanjaaro.com/audio-reaction-time#application",
      "name": "Wanjaaro Audio Reaction Time Test",
      "url": "https://wanjaaro.com/audio-reaction-time",
      "description": "A five-round browser-based test that records response time after an audio tone is played.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "browserRequirements": "JavaScript enabled and browser audio support",
      "isPartOf": {
        "@id": "https://wanjaaro.com/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wanjaaro.com/audio-reaction-time#breadcrumb",
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
          "name": "Audio Reaction Time Test",
          "item": "https://wanjaaro.com/audio-reaction-time"
        }
      ]
    }
  ]
}
</script>
