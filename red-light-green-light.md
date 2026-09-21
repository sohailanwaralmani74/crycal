---
layout: default
title: "Red Light, Green Light Test — Wanjaaro"
description: "A browser-based go and no-go reaction test. Respond to green signals, withhold your response on red signals, and track your control across a short session."
permalink: /red-light-green-light
category: reflex
sidebar: true
sidebar_title: "Red Light, Green Light"
sidebar_subtitle: "Go / no-go response control"
sidebar_icon: "🚦"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Reflex Test</span>
    <h1>Red Light, Green Light Test</h1>
    <p>
      This is not simply a race to click quickly. Green means respond; red means stay still.
      The challenge is to switch between action and restraint without guessing the signal.
    </p>
  </section>

  <section class="benchmark-content-block" aria-labelledby="rlgl-start">
    <h2 id="rlgl-start">Follow the Signal</h2>
    <p>
      Start the test and watch the signal change. When it turns green, click the arena.
      When it turns red, do nothing. The timing between changes is varied so you cannot rely
      on a fixed rhythm.
    </p>
    <p>
      A click during red is recorded as a mistake. A correct green response advances the
      session. The final result shows both successful responses and response-control errors.
    </p>
  </section>

  <div class="test-arena-wrapper">
    <div id="rlgl-arena" class="test-arena" tabindex="0" role="button" aria-label="Red light green light test">
      <div id="rlgl-icon" class="test-arena-icon">🚦</div>
      <h2 id="rlgl-title">Ready?</h2>
      <p id="rlgl-subtitle">Click or press Space to begin.</p>
    </div>
  </div>

  <div class="test-stats-bar" aria-label="Red light green light results">
    <div class="test-stat-item"><div class="test-stat-label">Signals</div><div class="test-stat-val" id="rlgl-signals">0 / 12</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Correct</div><div class="test-stat-val" id="rlgl-correct">0</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Mistakes</div><div class="test-stat-val" id="rlgl-errors">0</div></div>
    <div class="test-stat-item"><div class="test-stat-label">PB Errors</div><div class="test-stat-val" id="rlgl-pb">--</div></div>
  </div>

  <div id="rlgl-summary" class="test-summary-card" style="display:none;" aria-live="polite">
    <span class="benchmark-badge playable">Session Complete</span>
    <h2 id="rlgl-score">--</h2>
    <p class="test-summary-rating">
      Your result is based on how many signals you handled correctly and how often you avoided
      responding when the signal required restraint.
    </p>
    <div class="summary-actions">
      <button id="rlgl-restart" class="btn btn-primary" type="button">Run Again</button>
      <button id="rlgl-copy" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <section class="benchmark-dashboard" aria-labelledby="rlgl-skill">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="rlgl-skill">The Skill Behind the Test</h2>
        <p>Fast responses are only half of the task.</p>
      </div>
    </div>
    <p>
      A go/no-go challenge requires you to identify the current signal, choose whether an
      action is allowed, and then execute or suppress that action. A quick response that
      happens on the wrong signal is still an error.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="rlgl-reading">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="rlgl-reading">Reading Your Session</h2>
        <p>Correct actions and unwanted actions are shown separately.</p>
      </div>
    </div>
    <p>
      Fewer mistakes means you successfully followed the red/green rule more often. Because
      this test mixes response speed with restraint, its result should not be compared directly
      with a simple reaction-time score.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="rlgl-browser">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2 id="rlgl-browser">Runs Locally in the Browser</h2>
        <p>No account or upload is needed.</p>
      </div>
      <span class="benchmark-badge playable">Free to Use</span>
    </div>
    <p>
      The signal sequence and scoring are handled by JavaScript in the page. A personal-best
      mistake count can be kept in local browser storage.
    </p>
  </section>
</div>

<script>
(function() {
  var arena = document.getElementById('rlgl-arena');
  var icon = document.getElementById('rlgl-icon');
  var title = document.getElementById('rlgl-title');
  var subtitle = document.getElementById('rlgl-subtitle');
  var signalsEl = document.getElementById('rlgl-signals');
  var correctEl = document.getElementById('rlgl-correct');
  var errorsEl = document.getElementById('rlgl-errors');
  var pbEl = document.getElementById('rlgl-pb');
  var summary = document.getElementById('rlgl-summary');
  var score = document.getElementById('rlgl-score');
  var restart = document.getElementById('rlgl-restart');
  var copy = document.getElementById('rlgl-copy');

  var maxSignals = 12;
  var signal = 0;
  var correct = 0;
  var errors = 0;
  var state = 'idle';
  var signalTimeoutId = null;
  var nextTimeoutId = null;
  var current = null;
  var pbKey = 'wanjaaro_pb_red_green_errors';

  var oldPb = localStorage.getItem(pbKey);
  if (oldPb !== null) pbEl.textContent = oldPb;

  function clearTimers() {
    clearTimeout(signalTimeoutId);
    clearTimeout(nextTimeoutId);
    signalTimeoutId = null;
    nextTimeoutId = null;
  }

  function show(color) {
    current = color;
    state = 'active';

    arena.style.background = color === 'green' ? '#168a58' : '#a83232';
    icon.textContent = color === 'green' ? '🟢' : '🔴';
    title.textContent = color === 'green' ? 'GO' : 'STOP';
    subtitle.textContent = color === 'green' ? 'Respond now.' : 'Do not click.';

    // Each signal remains visible for a random 5–10 seconds.
    signalTimeoutId = setTimeout(function() {
      if (state !== 'active' || current !== color) return;

      if (color === 'red') {
        state = 'handled';
        title.textContent = 'Good — You Waited';
        subtitle.textContent = 'Next signal coming...';
      } else {
        state = 'handled';
        title.textContent = 'No Response';
        subtitle.textContent = 'Green signal missed.';
      }

      nextTimeoutId = setTimeout(next, 500);
    }, 5000 + Math.random() * 5000);
  }

  function next() {
    clearTimers();

    if (signal >= maxSignals) return finish();

    signal++;
    signalsEl.textContent = signal + ' / ' + maxSignals;

    var color = Math.random() < 0.5 ? 'green' : 'red';
    show(color);
  }

  function start() {
    clearTimers();

    signal = 0;
    correct = 0;
    errors = 0;
    current = null;

    correctEl.textContent = '0';
    errorsEl.textContent = '0';
    signalsEl.textContent = '0 / ' + maxSignals;
    summary.style.display = 'none';

    state = 'running';
    icon.textContent = '👀';
    title.textContent = 'Watch the Signal';
    subtitle.textContent = 'The first signal is coming.';

    nextTimeoutId = setTimeout(next, 500);
  }

  function respond() {
    if (state === 'idle' || state === 'finished') return start();
    if (state !== 'active') return;

    clearTimeout(signalTimeoutId);
    signalTimeoutId = null;

    if (current === 'green') {
      correct++;
      correctEl.textContent = correct;
      title.textContent = 'Correct';
      subtitle.textContent = 'Wait for the next signal.';
    } else {
      errors++;
      errorsEl.textContent = errors;
      title.textContent = 'Red Signal';
      subtitle.textContent = 'That click counts as a mistake.';
    }

    state = 'handled';
    nextTimeoutId = setTimeout(next, 500);
  }

  arena.addEventListener('click', function(e) {
    e.preventDefault();
    respond();
  });

  arena.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      respond();
    }
  });

  function finish() {
    clearTimers();
    state = 'finished';

    arena.style.background = '#26343b';
    icon.textContent = '🏁';
    title.textContent = 'Session Complete';
    subtitle.textContent = 'Correct: ' + correct + ' · Mistakes: ' + errors;

    if (oldPb === null || errors < parseInt(oldPb, 10)) {
      localStorage.setItem(pbKey, errors);
      pbEl.textContent = errors + ' (New PB!)';
      oldPb = String(errors);
    }

    score.textContent = correct + ' correct / ' + errors + ' mistakes';
    summary.style.display = 'block';
    summary.scrollIntoView({behavior:'smooth'});
  }

  restart.addEventListener('click', start);

  copy.addEventListener('click', function() {
    var text = '🚦 Wanjaaro Red Light, Green Light: ' + correct + ' correct, ' + errors + ' mistakes\nTest: https://wanjaaro.com/red-light-green-light';

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        copy.textContent = 'Copied to Clipboard! ✓';
        setTimeout(function() {
          copy.textContent = 'Copy Result 📋';
        }, 2000);
      });
    }
  });
})();
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":"WebPage","@id":"https://wanjaaro.com/red-light-green-light#webpage","url":"https://wanjaaro.com/red-light-green-light","name":"Red Light, Green Light Test — Wanjaaro","description":"A browser-based go and no-go reaction test.","isPartOf":{"@id":"https://wanjaaro.com/#website"}},
    {"@type":"WebApplication","@id":"https://wanjaaro.com/red-light-green-light#application","name":"Wanjaaro Red Light, Green Light Test","url":"https://wanjaaro.com/red-light-green-light","applicationCategory":"EducationalApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled"},
    {"@type":"BreadcrumbList","@id":"https://wanjaaro.com/red-light-green-light#breadcrumb","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},
      {"@type":"ListItem","position":2,"name":"Reflex & Reaction Tests","item":"https://wanjaaro.com/reflex"},
      {"@type":"ListItem","position":3,"name":"Red Light, Green Light","item":"https://wanjaaro.com/red-light-green-light"}
    ]}
  ]
}
</script>
