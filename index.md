---
layout: default
title: "Wanjaaro — Human Benchmark, Reflex & Brain Games"
description: "Benchmark your reaction time, mouse aim precision, memory capacity, typing speed, and cognitive reflexes. Free, pure client-side, zero accounts required."
is_homepage: true
permalink: /
---

<div class="benchmark-container">
  <!-- Hero Section -->
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Human Benchmark &amp; Skill Testing</span>
    <h1>Calibrate Your Brain &amp; Reflexes</h1>
    <p>
      Precise, browser-based benchmarks for visual reaction speed, mouse aim, working memory, typing velocity, and cognitive control. 100% client-side with millisecond accuracy.
    </p>
    
    <div class="hero-actions">
      <a href="/reaction-time" class="btn btn-primary">
        ⚡ Test Reaction Time
      </a>
      <a href="/aim-trainer" class="btn btn-accent">
        🎯 Start Aim Trainer
      </a>
      <a href="/daily" class="btn btn-outline">
        🗓️ Daily Challenge
      </a>
    </div>
  </section>

  <!-- Personal Benchmark Dashboard -->
  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Your Personal Benchmarks</h2>
        <p>Scores saved locally in your browser</p>
      </div>
      <span class="benchmark-badge playable" id="dashboard-status">All Systems Calibrated</span>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Reaction Time</div>
        <div class="dashboard-stat-value" id="dash-rt">--</div>
      </div>
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Aim Trainer</div>
        <div class="dashboard-stat-value" id="dash-aim">--</div>
      </div>
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Chimp Test</div>
        <div class="dashboard-stat-value" id="dash-chimp">--</div>
      </div>
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Sequence Memory</div>
        <div class="dashboard-stat-value" id="dash-seq">--</div>
      </div>
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Typing Speed</div>
        <div class="dashboard-stat-value" id="dash-wpm">--</div>
      </div>
      <div class="dashboard-stat-tile">
        <div class="dashboard-stat-label">Clock Precision</div>
        <div class="dashboard-stat-value" id="dash-clock">--</div>
      </div>
    </div>
  </section>

  <!-- Core Category Navigation Grid -->
  <section>
    <div class="category-section-header">
      <div>
        <h2>Benchmark Categories</h2>
        <p>Explore standardized tests across neurological and motor disciplines</p>
      </div>
    </div>

    <div class="benchmark-card-grid">
      <!-- 1. Reflex & Reaction -->
      <a href="/reflex" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">⚡</span>
            <span class="benchmark-badge playable">6 Tests</span>
          </div>
          <div class="benchmark-card-title">Reflex &amp; Reaction</div>
          <div class="benchmark-card-desc">Visual reaction time, audio latency, red-light/green-light inhibition, whack-a-mole, and anticipation tests.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Neurological Speed</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 2. Aim & Precision -->
      <a href="/aim" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">🎯</span>
            <span class="benchmark-badge playable">6 Tests</span>
          </div>
          <div class="benchmark-card-title">Aim &amp; Precision</div>
          <div class="benchmark-card-desc">Canvas flick-shot aim trainer, click accuracy bullseye, moving target tracking, and hand steadiness tests.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Motor Calibration</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 3. Memory -->
      <a href="/memory" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">🧠</span>
            <span class="benchmark-badge playable">6 Tests</span>
          </div>
          <div class="benchmark-card-title">Memory Tests</div>
          <div class="benchmark-card-desc">Simon sequence memory, Chimp test (Ayumu benchmark), number memory digit span, and visual grid pattern retention.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Working Memory</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 4. Typing -->
      <a href="/typing" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">⌨️</span>
            <span class="benchmark-badge playable">5 Tests</span>
          </div>
          <div class="benchmark-card-title">Typing Speed &amp; Accuracy</div>
          <div class="benchmark-card-desc">60-second WPM speed test, typing error penalties, keyboard rollover (NKRO) matrix tester, and code snippet typing.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Keystroke Fluency</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 5. Perception & Senses -->
      <a href="/perception" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">👁️</span>
            <span class="benchmark-badge playable">5 Tests</span>
          </div>
          <div class="benchmark-card-title">Perception &amp; Senses</div>
          <div class="benchmark-card-desc">Subtle color difference discrimination, interactive optical illusions, tone pitch matching, and symmetry spotting.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Sensory Acuity</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 6. Timing & Rhythm -->
      <a href="/timing" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">⏱️</span>
            <span class="benchmark-badge playable">4 Tests</span>
          </div>
          <div class="benchmark-card-title">Timing &amp; Rhythm</div>
          <div class="benchmark-card-desc">Stop the clock at 5.000s, rhythm tap beat synchronization, 10-second internal clock test, and metronome tempo keeping.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Internal Clock</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 7. Cognitive Games -->
      <a href="/cognitive" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">🧩</span>
            <span class="benchmark-badge playable">5 Games</span>
          </div>
          <div class="benchmark-card-title">Quick-Fire Cognitive</div>
          <div class="benchmark-card-desc">Stroop effect color conflict, mental math speed sprint, odd-one-out visual search, and divided attention dual-tasking.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Executive Function</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 8. Logic Puzzles -->
      <a href="/puzzles" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">🔢</span>
            <span class="benchmark-badge playable">5 Puzzles</span>
          </div>
          <div class="benchmark-card-title">Logic Puzzles</div>
          <div class="benchmark-card-desc">15-puzzle sliding tiles, word scramble anagrams, classic Minesweeper speed clears, and 2048 number merge.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb">Problem Solving</span>
          <span class="benchmark-btn">Explore Category &rarr;</span>
        </div>
      </a>

      <!-- 9. Daily Challenge -->
      <a href="/daily" class="benchmark-card">
        <div>
          <div class="benchmark-card-header">
            <span class="benchmark-card-icon">🗓️</span>
            <span class="benchmark-badge daily">Daily Synchronized</span>
          </div>
          <div class="benchmark-card-title">Daily Challenge Hub</div>
          <div class="benchmark-card-desc">A synchronized daily test that resets at midnight UTC. Track your daily completion streak and share results.</div>
        </div>
        <div class="benchmark-card-footer">
          <span class="benchmark-pb" id="dash-streak">0 Day Streak</span>
          <span class="benchmark-btn">Today's Seed &rarr;</span>
        </div>
      </a>
    </div>
  </section>

  <!-- Interactive Mini-Utility: Coin Flip & Dice Roller -->
  <section class="benchmark-dashboard" style="margin-top: 3.5rem;">
    <div class="dashboard-header">
      <div>
        <span class="benchmark-badge playable">Site Utility</span>
        <h3 style="margin-top: 0.35rem;">Quick Decision: Dice Roller &amp; Coin Flip</h3>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button id="util-coin-btn" class="btn btn-primary" style="padding: 0.5rem 1rem; min-height: 38px;">
          🪙 Flip Coin
        </button>
        <button id="util-dice-btn" class="btn btn-accent" style="padding: 0.5rem 1rem; min-height: 38px;">
          🎲 Roll D6
        </button>
      </div>
    </div>
    <div id="util-output" style="font-size: 1.35rem; font-weight: 800; color: var(--ink-900); min-height: 40px; display: flex; align-items: center;">
      Ready — click a tool above
    </div>
  </section>
</div>

<script>
(function() {
  // Populate Dashboard Stats from localStorage
  var rt = localStorage.getItem('wanjaaro_pb_reaction_time');
  if (rt) document.getElementById('dash-rt').textContent = rt + ' ms';

  var aim = localStorage.getItem('wanjaaro_pb_aim');
  if (aim) document.getElementById('dash-aim').textContent = aim + ' ms';

  var chimp = localStorage.getItem('wanjaaro_pb_chimp');
  if (chimp) document.getElementById('dash-chimp').textContent = chimp + ' Numbers';

  var seq = localStorage.getItem('wanjaaro_pb_sequence');
  if (seq) document.getElementById('dash-seq').textContent = 'Lvl ' + seq;

  var wpm = localStorage.getItem('wanjaaro_pb_wpm');
  if (wpm) document.getElementById('dash-wpm').textContent = wpm + ' WPM';

  var clock = localStorage.getItem('wanjaaro_pb_stopclock');
  if (clock) document.getElementById('dash-clock').textContent = '±' + clock + ' ms';

  var streak = localStorage.getItem('wanjaaro_daily_streak') || '0';
  document.getElementById('dash-streak').textContent = streak + (streak === '1' ? ' Day Streak' : ' Days Streak');

  // Coin Flip & Dice Roller
  var out = document.getElementById('util-output');
  document.getElementById('util-coin-btn').addEventListener('click', function() {
    out.textContent = 'Flipping...';
    setTimeout(function() {
      var isHeads = Math.random() > 0.5;
      out.textContent = isHeads ? '🪙 Heads!' : '🪙 Tails!';
    }, 200);
  });

  document.getElementById('util-dice-btn').addEventListener('click', function() {
    out.textContent = 'Rolling...';
    setTimeout(function() {
      var roll = Math.floor(1 + Math.random() * 6);
      var diceIcons = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      out.textContent = diceIcons[roll - 1] + ' Rolled a ' + roll + '!';
    }, 200);
  });
})();
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Wanjaaro",
  "url": "https://wanjaaro.com/",
  "description": "Benchmark your reflexes, aim precision, memory capacity, and typing speed with millisecond precision."
}
</script>
