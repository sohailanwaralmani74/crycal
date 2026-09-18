---
layout: default
title: "Chimp Test (Working Memory) — Wanjaaro"
description: "Can you beat Ayumu the chimpanzee? Numbers flash on a grid; once you click 1, the rest hide. Click in sequence from memory."
permalink: /chimp-test
category: memory
sidebar: true
sidebar_title: "Chimp Test"
sidebar_subtitle: "Ayumu working memory limit"
sidebar_icon: "🐒"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
        <span class="benchmark-badge playable">Memory Benchmark</span>
        <h1>The Chimp Test (Ayumu Benchmark)</h1>
        <p>
          In 2007, researchers at Kyoto University discovered chimpanzees like <em>Ayumu</em> could memorize the positions of 9 numbers in 0.2 seconds.
          Can your human working memory keep up?
        </p>
      </div>

      <!-- Test Board Container -->
      <div class="chimp-wrap">
        <div id="chimp-board">
          <!-- Tiles populated by JS -->
        </div>

        <!-- Start Overlay -->
        <div id="chimp-overlay" class="test-modal-overlay">
          <div class="test-arena-icon">🐒</div>
          <h2>Chimp Test</h2>
          <p>
            Numbers will appear on the grid. Once you click <strong>1</strong>, all remaining numbers will hide behind blank squares. Click them in ascending order!
          </p>
          <button id="chimp-start-btn" class="btn btn-accent">
            Start Test
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar" style="max-width: 560px;">
        <div class="test-stat-item">
          <div class="test-stat-label">Numbers</div>
          <div class="test-stat-val" id="chimp-count">4</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Strikes</div>
          <div class="test-stat-val" id="chimp-strikes" style="color: var(--danger);">0 / 3</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Personal Best</div>
          <div class="test-stat-val" id="chimp-pb" style="color: var(--accent-text);">--</div>
        </div>
      </div>

      <!-- Game Over Summary -->
      <div id="chimp-summary" class="test-summary-card" style="display: none; max-width: 560px;">
        <span class="benchmark-badge playable">Test Over</span>
        <h2 id="chimp-summary-score">Level 0 (0 Numbers)</h2>
        <p class="test-summary-rating" id="chimp-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="chimp-restart-btn" class="btn btn-primary">
            Play Again
          </button>
          <button id="chimp-copy-btn" class="btn btn-accent">
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
        <h3>About the Ayumu Chimpanzee Test</h3>
        <p>
          Trained young chimpanzees can photographically capture patterns of 9 randomized digits within 60 to 200 milliseconds—faster than a human eye can make a saccadic eye movement. Humans must use working memory chunking strategies to remember sequential locations.
        </p>
      </div>

      <!-- Mobile Placement 4: Ad after Content, before Related Tools -->
      <div class="mobile-ad-post-content">
        {% include mobile-ad.html %}
      </div>
    </div>
  </div>

<script>
(function() {
  var board = document.getElementById('chimp-board');
  var overlay = document.getElementById('chimp-overlay');
  var startBtn = document.getElementById('chimp-start-btn');
  var countEl = document.getElementById('chimp-count');
  var strikesEl = document.getElementById('chimp-strikes');
  var pbEl = document.getElementById('chimp-pb');
  var summary = document.getElementById('chimp-summary');
  var summaryScore = document.getElementById('chimp-summary-score');
  var summaryDesc = document.getElementById('chimp-summary-desc');
  var restartBtn = document.getElementById('chimp-restart-btn');
  var copyBtn = document.getElementById('chimp-copy-btn');

  var currentNumberCount = 4;
  var strikes = 0;
  var maxStrikes = 3;
  var expectedNext = 1;
  var hidden = false;
  var tiles = []; // 25 slots

  // Load PB
  var pb = localStorage.getItem('wanjaaro_pb_chimp');
  if (pb) pbEl.textContent = pb + ' Numbers';

  var audioCtx = null;
  function playNote(freq) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  function setupGrid() {
    board.innerHTML = '';
    tiles = [];
    for (var i = 0; i < 25; i++) {
      var cell = document.createElement('div');
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.borderRadius = '8px';
      cell.style.fontSize = 'clamp(1.2rem, 3vw, 1.8rem)';
      cell.style.fontWeight = '800';
      cell.style.cursor = 'default';
      board.appendChild(cell);
      tiles.push(cell);
    }
  }

  function startRound() {
    expectedNext = 1;
    hidden = false;
    countEl.textContent = currentNumberCount;
    strikesEl.textContent = strikes + ' / ' + maxStrikes;

    // Reset cells
    for (var i = 0; i < 25; i++) {
      tiles[i].textContent = '';
      tiles[i].style.background = 'transparent';
      tiles[i].style.border = 'none';
      tiles[i].style.cursor = 'default';
      tiles[i].dataset.number = '';
      tiles[i].onclick = null;
    }

    // Pick random slots
    var indices = [];
    while (indices.length < currentNumberCount) {
      var r = Math.floor(Math.random() * 25);
      if (indices.indexOf(r) === -1) indices.push(r);
    }

    indices.forEach(function(slot, idx) {
      var num = idx + 1;
      var cell = tiles[slot];
      cell.dataset.number = num;
      cell.textContent = num;
      cell.style.background = '#ffffff';
      cell.style.color = '#082633';
      cell.style.border = '2px solid #07dbd7';
      cell.style.cursor = 'pointer';
      cell.onclick = function() { handleTileClick(cell, num); };
    });
  }

  function handleTileClick(cell, num) {
    if (num === expectedNext) {
      playNote(400 + num * 60);
      cell.style.visibility = 'hidden';
      cell.onclick = null;
      expectedNext++;

      // Hide others once first tile is clicked
      if (!hidden) {
        hidden = true;
        tiles.forEach(function(c) {
          if (c.dataset.number && c.style.visibility !== 'hidden') {
            c.textContent = '';
            c.style.background = '#e3edf1';
          }
        });
      }

      // Check if round won
      if (expectedNext > currentNumberCount) {
        currentNumberCount++;
        setTimeout(startRound, 400);
      }
    } else {
      // Strike!
      playNote(150);
      strikes++;
      strikesEl.textContent = strikes + ' / ' + maxStrikes;
      
      // Reveal numbers briefly
      tiles.forEach(function(c) {
        if (c.dataset.number) {
          c.textContent = c.dataset.number;
          c.style.visibility = 'visible';
          c.style.background = '#b23a3a';
          c.style.color = '#ffffff';
        }
      });

      if (strikes >= maxStrikes) {
        setTimeout(gameOver, 900);
      } else {
        setTimeout(startRound, 900);
      }
    }
  }

  function gameOver() {
    var maxNumbers = currentNumberCount - 1;
    
    // Save PB
    var currentPb = parseInt(localStorage.getItem('wanjaaro_pb_chimp') || '0', 10);
    if (maxNumbers > currentPb) {
      localStorage.setItem('wanjaaro_pb_chimp', maxNumbers);
      pbEl.textContent = maxNumbers + ' Numbers (New PB!)';
    }

    var comment = '';
    if (maxNumbers >= 10) comment = 'Incredible! You matched or surpassed chimpanzee-level working memory!';
    else if (maxNumbers >= 7) comment = 'Strong human benchmark! Standard adult working memory is around 7 items.';
    else comment = 'Good practice session. Try chunking numbers visually across the 5x5 grid.';

    summaryScore.textContent = maxNumbers + ' Numbers Memorized';
    summaryDesc.textContent = comment;
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  function startGame() {
    overlay.style.display = 'none';
    summary.style.display = 'none';
    currentNumberCount = 4;
    strikes = 0;
    startRound();
  }

  setupGrid();
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  copyBtn.addEventListener('click', function() {
    var text = '🐒 Wanjaaro Chimp Test: ' + summaryScore.textContent + '\nTest your working memory at https://wanjaaro.com/chimp-test';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Score 📋'; }, 2000);
    });
  });
})();
</script>
