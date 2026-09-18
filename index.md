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
    <span class="benchmark-badge" style="background:#e0f7f6; color:#067c7a; margin-bottom: 0.75rem; display: inline-block;">Human Benchmark &amp; Skill Testing</span>
    <h1 style="font-size: clamp(2.2rem, 4.5vw, 3.2rem); margin-bottom: 0.75rem;">Calibrate Your Brain &amp; Reflexes</h1>
    <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 760px; margin: 0 auto 2rem; line-height: 1.6;">
      Precise, browser-based benchmarks for visual reaction speed, mouse aim, working memory, typing velocity, and cognitive control. 100% client-side with millisecond accuracy.
    </p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
      <a href="/reaction-time" class="btn-primary" style="background: #082633; color: #ffffff; padding: 0.85rem 1.85rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 1.05rem;">
        ⚡ Test Reaction Time
      </a>
      <a href="/aim-trainer" class="btn-primary" style="background: #07dbd7; color: #082633; padding: 0.85rem 1.85rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 1.05rem;">
        🎯 Start Aim Trainer
      </a>
      <a href="/daily" style="background: #ffffff; color: var(--ink); border: 1px solid var(--border-default); padding: 0.85rem 1.85rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 1.05rem;">
        🗓️ Daily Challenge
      </a>
    </div>
  </section>

  <!-- Personal Benchmark Dashboard -->
  <section style="background: #ffffff; border: 1px solid var(--border-default); border-radius: 14px; padding: 1.75rem; margin-bottom: 3.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <h2 style="font-size: 1.3rem; margin: 0; padding: 0; border: none; color: var(--ink);">Your Personal Benchmarks</h2>
        <span style="font-size: 0.85rem; color: var(--text-muted);">Scores saved locally in your browser</span>
      </div>
      <span class="benchmark-badge playable" id="dashboard-status">All Systems Calibrated</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; text-align: center;">
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Reaction Time</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-rt">--</div>
      </div>
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Aim Trainer</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-aim">--</div>
      </div>
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Chimp Test</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-chimp">--</div>
      </div>
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Sequence Memory</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-seq">--</div>
      </div>
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Typing Speed</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-wpm">--</div>
      </div>
      <div style="background: var(--surface); padding: 1rem 0.5rem; border-radius: 10px; border: 1px solid var(--border-default);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Clock Precision</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #083848; margin-top: 0.25rem;" id="dash-clock">--</div>
      </div>
    </div>
  </section>

  <!-- Core Category Navigation Grid -->
  <section>
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
      <div>
        <h2 style="font-size: 1.8rem; color: var(--ink); margin: 0; padding: 0; border: none;">Benchmark Categories</h2>
        <p style="color: var(--text-muted); margin: 0.25rem 0 0;">Explore standardized tests across neurological and motor disciplines</p>
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
      <a href="/daily" class="benchmark-card" style="border-color: #07dbd7;">
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
  <section style="margin-top: 4rem; background: var(--surface); border-radius: 14px; border: 1px solid var(--border-default); padding: 2rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
      <div>
        <span class="benchmark-badge playable" style="margin-bottom: 0.35rem; display: inline-block;">Site Utility</span>
        <h3 style="margin: 0; padding: 0; border: none; font-size: 1.3rem; color: var(--ink);">Quick Decision: Dice Roller &amp; Coin Flip</h3>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button id="util-coin-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
          🪙 Flip Coin
        </button>
        <button id="util-dice-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 700; cursor: pointer;">
          🎲 Roll D6
        </button>
      </div>
    </div>
    <div id="util-output" style="font-size: 1.5rem; font-weight: 800; color: #083848; min-height: 40px; display: flex; align-items: center;">
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
