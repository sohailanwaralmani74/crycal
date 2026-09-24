---
layout: default
title: "Internal Clock Test — Wanjaaro"
description: "Estimate ten seconds without watching a clock and compare your timing to the real elapsed interval."
permalink: /internal-clock
category: timing
sidebar: true
sidebar_title: "Internal Clock"
sidebar_subtitle: "Estimate 10 seconds"
sidebar_icon: "🕰️"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Timing Benchmark</span>
    <h1>Internal Clock Test</h1>
    <p>Start the timer, count silently, and stop when you think exactly 10 seconds have passed. The clock stays hidden while you estimate.</p>
  </div>

  <div class="benchmark-card" style="text-align:center;">
    <div id="clock-state" class="benchmark-card-desc">No running timer is visible during the test.</div>
    <div id="clock-mark" style="font-size:3rem;font-weight:800;margin:1.5rem 0;">10.00s</div>
    <button id="clock-start" class="btn btn-primary">Start</button>
    <button id="clock-stop" class="btn btn-accent" style="display:none;min-width:180px;">Stop at 10 Seconds</button>
  </div>

  <div class="test-stats-bar" style="max-width:650px;">
    <div class="test-stat-item"><div class="test-stat-label">Your Time</div><div class="test-stat-val" id="clock-time">—</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Offset</div><div class="test-stat-val" id="clock-offset">—</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Best</div><div class="test-stat-val" id="clock-best">—</div></div>
  </div>

  <div id="clock-result" class="test-summary-card" style="display:none;max-width:650px;">
    <span class="benchmark-badge playable">Result</span>
    <h2 id="clock-score">—</h2>
    <p id="clock-summary">—</p>
    <div class="summary-actions"><button id="clock-again" class="btn btn-primary">Try Again</button><button id="clock-copy" class="btn btn-accent">Share Result 📋</button></div>
  </div>

  <div class="benchmark-info-section">
    <h3>What this test measures</h3>
    <p>This is a simple time-estimation challenge. It measures how close your internal estimate is to a fixed 10-second interval; it is not a clinical assessment of time perception.</p>
  </div>
</div>

<script>
(function(){
  var start=document.getElementById('clock-start'), stop=document.getElementById('clock-stop'), state=document.getElementById('clock-state');
  var timeEl=document.getElementById('clock-time'), offEl=document.getElementById('clock-offset'), bestEl=document.getElementById('clock-best');
  var result=document.getElementById('clock-result'), score=document.getElementById('clock-score'), summary=document.getElementById('clock-summary'), again=document.getElementById('clock-again'), copy=document.getElementById('clock-copy');
  var started=0, running=false, target=10000, key='wanjaaro_pb_internal_clock';
  var saved=localStorage.getItem(key); if(saved) bestEl.textContent='±'+saved+' ms';
  function begin(){started=performance.now();running=true;result.style.display='none';start.style.display='none';stop.style.display='inline-block';state.textContent='Timer running. The elapsed time is hidden.';timeEl.textContent='—';offEl.textContent='—';}
  function end(){if(!running)return;running=false;var elapsed=performance.now()-started;var diff=Math.round(Math.abs(elapsed-target));var sec=(elapsed/1000).toFixed(3);timeEl.textContent=sec+'s';offEl.textContent='±'+diff+' ms';var old=parseInt(localStorage.getItem(key)||'999999',10);if(diff<old){localStorage.setItem(key,String(diff));bestEl.textContent='±'+diff+' ms';}score.textContent=sec+'s';summary.textContent='You were ±'+diff+' ms from the 10.000-second target.';result.style.display='block';start.style.display='inline-block';start.textContent='Try Again';stop.style.display='none';state.textContent='Round complete.';}
  start.addEventListener('click',begin); again.addEventListener('click',begin); stop.addEventListener('click',end);
  copy.addEventListener('click',function(){navigator.clipboard.writeText('🕰️ Wanjaaro Internal Clock: '+score.textContent+' (target 10.000s)\nhttps://wanjaaro.com/internal-clock').then(function(){copy.textContent='Copied ✓';setTimeout(function(){copy.textContent='Share Result 📋';},1500);});});
})();
</script>
