---
layout: default
title: "Sequence Memory Test — Wanjaaro"
description: "Remember an expanding pattern of lighted squares in a 3x3 grid. Test your sequential visual-spatial memory span."
permalink: /sequence-memory
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Memory Benchmark</span>
    <h1>Sequence Memory Test</h1>
    <p>Memorize the sequence of flashing tiles on the 3x3 grid. The pattern grows by one tile every round. How long of a sequence can you repeat?</p>
  </div>

  <!-- 3x3 Arena Grid -->
  <div style="max-width: 440px; margin: 0 auto; position: relative;">
    <div id="simon-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; aspect-ratio: 1; background: #082633; padding: 14px; border-radius: 14px; border: 2px solid #07dbd7;">
      <!-- 9 tiles -->
      <div class="simon-tile" data-id="0" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="1" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="2" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="3" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="4" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="5" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="6" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="7" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
      <div class="simon-tile" data-id="8" style="background: #143e52; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s;"></div>
    </div>

    <!-- Start Overlay -->
    <div id="simon-overlay" style="position: absolute; inset: 0; background: rgba(8, 38, 51, 0.92); border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; color: #ffffff;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🧠</div>
      <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; color: #ffffff; border: none; padding: 0;">Sequence Memory</h2>
      <p style="color: #b0c6cf; max-width: 320px; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.5;">
        Watch the sequence of flashing tiles, then repeat it back in exact order.
      </p>
      <button id="simon-start-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.85rem 2.25rem; font-size: 1.1rem; font-weight: 800; border-radius: 8px; cursor: pointer;">
        Start Benchmark
      </button>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="test-stats-bar" style="max-width: 440px; margin: 1.5rem auto 0;">
    <div class="test-stat-item">
      <div class="test-stat-label">Level</div>
      <div class="test-stat-val" id="simon-level">1</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Sequence Length</div>
      <div class="test-stat-val" id="simon-len">1</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Personal Best</div>
      <div class="test-stat-val" id="simon-pb" style="color: #067c7a;">--</div>
    </div>
  </div>

  <!-- Game Over Summary -->
  <div id="simon-summary" style="display: none; max-width: 440px; margin: 2rem auto 0; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Test Finished</span>
    <h2 style="font-size: 2.3rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="simon-summary-score">Level 0</h2>
    <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="simon-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="simon-restart-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Play Again
      </button>
      <button id="simon-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Share Score 📋
      </button>
    </div>
  </div>
</div>

<script>
(function() {
  var overlay = document.getElementById('simon-overlay');
  var startBtn = document.getElementById('simon-start-btn');
  var levelEl = document.getElementById('simon-level');
  var lenEl = document.getElementById('simon-len');
  var pbEl = document.getElementById('simon-pb');
  var summary = document.getElementById('simon-summary');
  var summaryScore = document.getElementById('simon-summary-score');
  var summaryDesc = document.getElementById('simon-summary-desc');
  var restartBtn = document.getElementById('simon-restart-btn');
  var copyBtn = document.getElementById('simon-copy-btn');
  var tiles = document.querySelectorAll('.simon-tile');

  var sequence = [];
  var playerStep = 0;
  var level = 1;
  var isComputerTurn = false;

  // Stored PB
  var pb = localStorage.getItem('wanjaaro_pb_sequence');
  if (pb) pbEl.textContent = 'Level ' + pb;

  // Harmonic chord frequencies for 9 tiles
  var freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];
  var audioCtx = null;
  function chime(tileIndex) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.frequency.value = freqs[tileIndex % freqs.length];
      o.type = 'sine';
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 0.25);
    } catch(e) {}
  }

  function flashTile(index, cb) {
    var t = tiles[index];
    t.style.background = '#07dbd7';
    t.style.transform = 'scale(0.96)';
    chime(index);
    setTimeout(function() {
      t.style.background = '#143e52';
      t.style.transform = 'scale(1)';
      if (cb) setTimeout(cb, 120);
    }, 280);
  }

  function playSequence() {
    isComputerTurn = true;
    playerStep = 0;
    var i = 0;
    function next() {
      if (i < sequence.length) {
        flashTile(sequence[i], function() {
          i++;
          next();
        });
      } else {
        isComputerTurn = false;
      }
    }
    setTimeout(next, 500);
  }

  function nextLevel() {
    levelEl.textContent = level;
    lenEl.textContent = sequence.length + 1;
    var nextTile = Math.floor(Math.random() * 9);
    sequence.push(nextTile);
    playSequence();
  }

  function handleTileClick(index) {
    if (isComputerTurn) return;

    flashTile(index);

    if (index === sequence[playerStep]) {
      playerStep++;
      if (playerStep === sequence.length) {
        level++;
        setTimeout(nextLevel, 600);
      }
    } else {
      // Game Over!
      gameOver();
    }
  }

  function gameOver() {
    isComputerTurn = true;
    var reachedLevel = level;

    // Flash all tiles red
    tiles.forEach(function(t) {
      t.style.background = '#b23a3a';
    });
    setTimeout(function() {
      tiles.forEach(function(t) {
        t.style.background = '#143e52';
      });
    }, 400);

    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_sequence') || '0', 10);
    if (reachedLevel > currentPb) {
      localStorage.setItem('wanjaaro_pb_sequence', reachedLevel);
      pbEl.textContent = 'Level ' + reachedLevel + ' (New PB!)';
    }

    summaryScore.textContent = 'Level ' + reachedLevel;
    summaryDesc.textContent = 'You remembered a sequence of ' + (reachedLevel > 1 ? reachedLevel - 1 : 0) + ' steps. Average human visual working memory tops out at 7-9 items.';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  tiles.forEach(function(t, idx) {
    t.addEventListener('click', function() {
      handleTileClick(idx);
    });
  });

  function start() {
    overlay.style.display = 'none';
    summary.style.display = 'none';
    sequence = [];
    level = 1;
    nextLevel();
  }

  startBtn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);

  copyBtn.addEventListener('click', function() {
    var text = '🧠 Wanjaaro Sequence Memory: ' + summaryScore.textContent + '\nTest your sequential memory at https://wanjaaro.com/sequence-memory';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Score 📋'; }, 2000);
    });
  });
})();
</script>
