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
      Put your attention on the sound rather than the screen. A short tone will appear after an
      unpredictable pause, and the test records how quickly you react to hearing it.
    </p>
  </section>

  <section aria-labelledby="audio-instructions">
    <div class="benchmark-content-block">
      <h2 id="audio-instructions">Play the Sound Challenge</h2>
      <p>
        Begin a round and wait through the silent part. There is no visual countdown telling
        you when the tone will arrive. Once you hear it, click the arena or press Space.
        A response made during the silent period is flagged as an early response, so the
        round can be attempted again without adding a misleading time.
      </p>
      <p>
        Before starting, make sure you can clearly hear the test tone. Earbuds, headphones,
        laptop speakers, and external speakers can all be used; keep the listening setup
        reasonably consistent between attempts.
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
      Five completed sound responses are combined into this average. Repeating the challenge
      with the same listening setup makes the result more useful for personal comparison.
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
    <h2 id="audio-measures">Where the Number Comes From</h2>
    <p>
      Wanjaaro starts its response timer when the tone is triggered and stops it when your
      click or Space-key response is received. The displayed value is a browser timing
      result for this particular setup, not a measurement of hearing ability or a medical
      assessment.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-result">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-result">Read the Five-Round Average</h2>
        <p>The average combines the five completed sound responses.</p>
      </div>
    </div>
    <p>
      The average is useful when you want to compare one session with another under similar
      conditions. It should not be treated as a fixed measure of how quickly you respond in
      every situation, because the listening environment and device can change the result.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-factors">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-factors">Check Your Listening Setup</h2>
        <p>Small differences in the audio path can change the measured interval.</p>
      </div>
    </div>
    <p>
      Bluetooth and wired devices can introduce different playback delays. Volume, background
      noise, other system activity, attention, fatigue, and familiarity with the challenge
      can also affect an attempt. If you are tracking improvement, use the same audio device
      and a similar environment rather than comparing unrelated setups.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="audio-browser">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="audio-browser">Sound Is Generated in Your Browser</h2>
        <p>The page does not need an uploaded audio file.</p>
      </div>
      <span class="benchmark-badge playable">Free to Use</span>
    </div>
    <p>
      The test creates its tone locally with the Web Audio API, so there is no audio file to
      download before a round can begin. Your personal-best average is kept in this browser's
      local storage. If you hear nothing, interact with the test area first and check whether
      the browser or operating system has muted the site.
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
    subtitle.textContent = 'The completed sound trials are summarized below.';

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
