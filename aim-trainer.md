---
layout: default
title: "Flick-Shot Aim Trainer — Wanjaaro"
description: "Practice your mouse flicks, click precision, and target acquisition speed with 30 procedural canvas targets."
permalink: /aim-trainer
category: aim
sidebar: true
sidebar_title: "Aim Trainer"
sidebar_subtitle: "Flick precision & target speed"
sidebar_icon: "🎯"
---

<div class="benchmark-hero">
        <span class="benchmark-badge playable">Aim Benchmark</span>
        <h1>Flick-Shot Aim Trainer</h1>
        <p>Click 30 targets as quickly and accurately as possible. Test your mouse precision, reaction speed, and flick consistency.</p>
      </div>

      <!-- Interactive Canvas Arena -->
      <div class="aim-arena-wrap">
        <canvas id="aim-canvas" width="860" height="500"></canvas>
        
        <!-- Overlay for Start / Finish -->
        <div id="aim-overlay" class="aim-overlay">
          <div class="test-arena-icon">🎯</div>
          <h2 id="aim-overlay-title">Click to Start</h2>
          <p id="aim-overlay-desc">
            Click the button below to start. 30 targets will appear one by one across the arena. Click each one as fast as you can.
          </p>
          <button id="aim-start-btn" class="btn btn-accent">
            Start Aim Trainer
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="test-stats-bar">
        <div class="test-stat-item">
          <div class="test-stat-label">Remaining</div>
          <div class="test-stat-val" id="aim-remaining">30</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Accuracy</div>
          <div class="test-stat-val" id="aim-accuracy">100%</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Avg Time / Target</div>
          <div class="test-stat-val" id="aim-avg-time">-- ms</div>
        </div>
        <div class="test-stat-item">
          <div class="test-stat-label">Personal Best</div>
          <div class="test-stat-val" id="aim-pb" style="color: var(--accent-text);">-- ms</div>
        </div>
      </div>

      <!-- Result Summary Box -->
      <div id="aim-summary" class="test-summary-card" style="display: none;">
        <span class="benchmark-badge playable">Session Completed</span>
        <h2 id="aim-summary-score">-- ms / target</h2>
        <p class="test-summary-rating" id="aim-summary-desc">--</p>
        
        <div class="summary-actions">
          <button id="aim-restart-btn" class="btn btn-primary">
            Play Again
          </button>
          <button id="aim-copy-btn" class="btn btn-accent">
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
        <h3>About Mouse Aim &amp; Target Acquisition</h3>
        <p>
          Target acquisition speed measures the combined latency of visual search, ballistic arm/wrist motion (the flick), and micro-adjustments onto the target boundary. Competitive first-person shooter players typically achieve target acquisition under <strong>250ms with &gt;95% accuracy</strong>.
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
  var canvas = document.getElementById('aim-canvas');
  var ctx = canvas.getContext('2d');
  var overlay = document.getElementById('aim-overlay');
  var overlayTitle = document.getElementById('aim-overlay-title');
  var overlayDesc = document.getElementById('aim-overlay-desc');
  var startBtn = document.getElementById('aim-start-btn');
  var remainingEl = document.getElementById('aim-remaining');
  var accuracyEl = document.getElementById('aim-accuracy');
  var avgTimeEl = document.getElementById('aim-avg-time');
  var pbEl = document.getElementById('aim-pb');
  var summary = document.getElementById('aim-summary');
  var summaryScore = document.getElementById('aim-summary-score');
  var summaryDesc = document.getElementById('aim-summary-desc');
  var restartBtn = document.getElementById('aim-restart-btn');
  var copyBtn = document.getElementById('aim-copy-btn');

  var totalTargets = 30;
  var currentTargetIndex = 0;
  var hits = 0;
  var totalClicks = 0;
  var startTime = 0;
  var targetSpawnTime = 0;
  var targetTimes = [];
  var active = false;

  var currentTarget = null;
  var targetRadius = 32;

  // Stored PB
  var pb = localStorage.getItem('wanjaaro_pb_aim');
  if (pb) pbEl.textContent = pb + ' ms';

  var audioCtx = null;
  function playBeep(freq, dur) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch(e) {}
  }

  function spawnTarget() {
    var margin = 60;
    var x = margin + Math.random() * (canvas.width - margin * 2);
    var y = margin + Math.random() * (canvas.height - margin * 2);
    currentTarget = { x: x, y: y, r: targetRadius };
    targetSpawnTime = performance.now();
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Arena subtle grid lines
    ctx.strokeStyle = 'rgba(7, 219, 215, 0.08)';
    ctx.lineWidth = 1;
    for (var i = 40; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (var j = 40; j < canvas.height; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    if (!active || !currentTarget) return;

    // Draw bullseye target
    // Outer ring
    ctx.beginPath();
    ctx.arc(currentTarget.x, currentTarget.y, currentTarget.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#07dbd7';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Middle ring
    ctx.beginPath();
    ctx.arc(currentTarget.x, currentTarget.y, currentTarget.r * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = '#082633';
    ctx.fill();

    // Inner bullseye
    ctx.beginPath();
    ctx.arc(currentTarget.x, currentTarget.y, currentTarget.r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#07dbd7';
    ctx.fill();
  }

  function start() {
    overlay.style.display = 'none';
    summary.style.display = 'none';
    currentTargetIndex = 0;
    hits = 0;
    totalClicks = 0;
    targetTimes = [];
    active = true;
    remainingEl.textContent = totalTargets;
    accuracyEl.textContent = '100%';
    avgTimeEl.textContent = '-- ms';
    startTime = performance.now();
    spawnTarget();
  }

  function finish() {
    active = false;
    currentTarget = null;
    draw();

    var totalDuration = performance.now() - startTime;
    var avgTime = Math.round(targetTimes.reduce(function(a, b) { return a + b; }, 0) / targetTimes.length);
    var acc = Math.round((hits / totalClicks) * 100);

    // Save PB
    var currentPb = localStorage.getItem('wanjaaro_pb_aim');
    if (!currentPb || avgTime < parseInt(currentPb, 10)) {
      localStorage.setItem('wanjaaro_pb_aim', avgTime);
      pbEl.textContent = avgTime + ' ms (New PB!)';
    }

    summaryScore.textContent = avgTime + ' ms per target (' + acc + '% accuracy)';
    summaryDesc.textContent = 'Completed ' + totalTargets + ' targets in ' + (totalDuration / 1000).toFixed(2) + ' seconds with ' + hits + ' hits and ' + (totalClicks - hits) + ' missed clicks.';
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth' });
  }

  function handleCanvasClick(e) {
    if (!active || !currentTarget) return;
    totalClicks++;

    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;

    var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    var clickX = (clientX - rect.left) * scaleX;
    var clickY = (clientY - rect.top) * scaleY;

    var dist = Math.hypot(clickX - currentTarget.x, clickY - currentTarget.y);

    if (dist <= currentTarget.r) {
      // Hit!
      hits++;
      var t = Math.round(performance.now() - targetSpawnTime);
      targetTimes.push(t);
      playBeep(980, 0.05);

      currentTargetIndex++;
      remainingEl.textContent = (totalTargets - currentTargetIndex);
      var currentAvg = Math.round(targetTimes.reduce(function(a, b) { return a + b; }, 0) / targetTimes.length);
      avgTimeEl.textContent = currentAvg + ' ms';
      accuracyEl.textContent = Math.round((hits / totalClicks) * 100) + '%';

      if (currentTargetIndex >= totalTargets) {
        finish();
      } else {
        spawnTarget();
      }
    } else {
      // Miss
      playBeep(180, 0.1);
      accuracyEl.textContent = Math.round((hits / totalClicks) * 100) + '%';
    }
  }

  canvas.addEventListener('mousedown', handleCanvasClick);
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    handleCanvasClick(e);
  });

  startBtn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);

  copyBtn.addEventListener('click', function() {
    var text = '🎯 Wanjaaro Aim Trainer: ' + summaryScore.textContent + '\nTest your aim at https://wanjaaro.com/aim-trainer';
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(function() { copyBtn.textContent = 'Share Score 📋'; }, 2000);
    });
  });

  draw();
})();
</script>
