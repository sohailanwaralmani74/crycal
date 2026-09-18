---
layout: default
title: "Flick-Shot Aim Trainer — Wanjaaro"
description: "Practice your mouse flicks, click precision, and target acquisition speed with 30 procedural canvas targets."
permalink: /aim-trainer
---

<div class="benchmark-container">
  <div class="benchmark-hero" style="margin-bottom: 1.5rem;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Aim Benchmark</span>
    <h1>Flick-Shot Aim Trainer</h1>
    <p>Click 30 targets as quickly and accurately as possible. Test your mouse precision, reaction speed, and flick consistency.</p>
  </div>

  <!-- Interactive Canvas Arena -->
  <div style="position: relative; width: 100%; max-width: 900px; margin: 0 auto;">
    <canvas id="aim-canvas" width="860" height="500" style="display: block; width: 100%; height: auto; background: #082633; border-radius: 12px; border: 2px solid #07dbd7; cursor: crosshair; touch-action: none;"></canvas>
    
    <!-- Overlay for Start / Finish -->
    <div id="aim-overlay" style="position: absolute; inset: 0; background: rgba(8, 38, 51, 0.88); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; color: #ffffff;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎯</div>
      <h2 id="aim-overlay-title" style="font-size: 2.2rem; margin-bottom: 0.5rem; color: #ffffff; border: none; padding: 0;">Click to Start</h2>
      <p id="aim-overlay-desc" style="color: #b0c6cf; max-width: 500px; margin-bottom: 1.5rem; font-size: 1.05rem;">
        Click the button below to start. 30 targets will appear one by one across the arena. Click each one as fast as you can.
      </p>
      <button id="aim-start-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.85rem 2.25rem; font-size: 1.1rem; font-weight: 800; border-radius: 8px; cursor: pointer; transition: transform 0.15s;">
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
      <div class="test-stat-val" id="aim-pb" style="color: #067c7a;">-- ms</div>
    </div>
  </div>

  <!-- Result Summary Box -->
  <div id="aim-summary" style="display: none; background: #ffffff; border: 2px solid #07dbd7; border-radius: 14px; padding: 2rem; margin-top: 2rem; text-align: center;">
    <span class="benchmark-badge playable" style="margin-bottom: 0.5rem; display: inline-block;">Session Completed</span>
    <h2 style="font-size: 2.3rem; color: var(--ink); margin: 0.5rem 0; border: none; padding: 0;" id="aim-summary-score">-- ms / target</h2>
    <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem;" id="aim-summary-desc">--</p>
    
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button id="aim-restart-btn" style="background: #082633; color: #ffffff; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Play Again
      </button>
      <button id="aim-copy-btn" style="background: #07dbd7; color: #082633; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">
        Share Score 📋
      </button>
    </div>
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
