---
layout: default
title: "Sequence Memory Test — Wanjaaro"
description: "Remember an expanding pattern of lighted squares in a 3x3 grid. Test your sequential visual-spatial memory span."
permalink: /sequence-memory
---

<div class="benchmark-container">
  <div class="benchmark-layout-split">
    <!-- Main Column: 75% Desktop / Primary Flow on Mobile -->
    <div class="benchmark-main-column">
      <div class="benchmark-hero">
        <span class="benchmark-badge playable">Memory Benchmark</span>
        <h1>Sequence Memory Test</h1>
        <p>Memorize the sequence of flashing tiles on the 3x3 grid. The pattern grows by one tile every round. How long of a sequence can you repeat?</p>
      </div>

      <!-- 3x3 Arena Grid -->
      <div class="simon-wrap">
        <div id="simon-grid">
          <!-- 9 tiles -->
          <div class="simon-tile" data-id="0"></div>
          <div class="simon-tile" data-id="1"></div>
          <div class="simon-tile" data-id="2"></div>
          <div class="simon-tile" data-id="3"></div>
          <div class="simon-tile" data-id="4"></div>
          <div class="simon-tile" data-id="5"></div>
          <div class="simon-tile" data-id="6"></div>
          <div class="simon-tile" data-id="7"></div>
          <div class="simon-tile" data-id="8"></div>
        </div>

        <!-- Start Overlay -->
        <div id="simon-overlay" class="test-modal-overlay">
          <div class="test-arena-icon">🧠</div>
          <h2>Sequence Memory</h2>
          <p>
            Watch the sequence of flashing tiles, then repeat it back in exact order.
          </p>
          <button id="simon-start-btn" class="btn btn-accent">
            Start Benchmark
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 440px;">
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
          <div class="test-stat-val" id="simon-pb" style="color: var(--accent-text);">--</div>
        </div>
      </div>

      <!-- Game Over Summary -->
      <div id="simon-summary" class="test-summary-card" style="display: none; max-width: 440px;">
        <span class="benchmark-badge playable">Test Finished</span>
        <h2 id="simon-summary-score">Level 0</h2>
        <p class="test-summary-rating" id="simon-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="simon-restart-btn" class="btn btn-primary">
            Play Again
          </button>
          <button id="simon-copy-btn" class="btn btn-accent">
            Share Score 📋
          </button>
        </div>
      </div>

      <!-- Mobile Placement 2: Ad after Test UI -->
      <div class="mobile-ad-post-test">
        {% include mobile-ad.html %}
      </div>

      <!-- Benchmark Info Context -->
      <div class="benchmark-info-section">
        <h3>About Sequential Working Memory</h3>
        <p>
          Spatial sequence memory relies on the visuospatial sketchpad of your working memory system. Most healthy adults can comfortably remember patterns of 7 to 9 steps before cognitive interference occurs.
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
