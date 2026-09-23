---
layout: default
title: "Odd-One-Out Speed Test — Wanjaaro"
description: "Find the one different tile in a fast visual search game and see how quickly you can spot each odd tile."
permalink: /odd-one-out
category: cognitive
sidebar: true
sidebar_title: "Odd-One-Out"
sidebar_subtitle: "Fast visual search challenge"
sidebar_icon: "🔍"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Cognitive Game</span>
    <h1>Odd-One-Out</h1>
    <p>One tile is different. Find it as quickly as possible across 12 rounds while the grid becomes harder to scan.</p>
  </div>

  <div class="tool-panel" style="max-width:680px;margin:0 auto;">
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Round</div><div class="test-stat-val" id="odd-round">0 / 12</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Correct</div><div class="test-stat-val" id="odd-correct">0</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Avg Time</div><div class="test-stat-val" id="odd-avg">—</div></div>
    </div>
    <div id="odd-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:430px;margin:24px auto;"></div>
    <div style="text-align:center;"><button id="odd-start" class="btn btn-primary">Start Challenge</button></div>
    <div id="odd-summary" class="test-summary-card" style="display:none;">
      <span class="benchmark-badge playable">Finished</span>
      <h2 id="odd-score">—</h2>
      <p id="odd-summary-text"></p>
      <button id="odd-restart" class="btn btn-primary">Play Again</button>
    </div>
  </div>

  <div class="benchmark-info-section">
    <h3>Find the Different Tile</h3>
    <p>Each round creates a grid of matching symbols with one visual variation. The target moves to a new position every round, and later rounds use larger grids.</p>
    <h3>What Your Result Shows</h3>
    <p>Your result is based on correct rounds and response time. Display size, brightness, browser zoom, and pointer movement can all affect a visual search game.</p>
  </div>
</div>

<script>
(function(){
  var grid=document.getElementById('odd-grid'), start=document.getElementById('odd-start'), restart=document.getElementById('odd-restart');
  var roundEl=document.getElementById('odd-round'), correctEl=document.getElementById('odd-correct'), avgEl=document.getElementById('odd-avg');
  var summary=document.getElementById('odd-summary'), score=document.getElementById('odd-score'), text=document.getElementById('odd-summary-text');
  var round=0,correct=0,times=[],target=0,started=0,active=false;
  function draw(){
    var size=round<4?4:round<8?5:6; grid.style.gridTemplateColumns='repeat('+size+',1fr)';grid.innerHTML='';
    var total=size*size; target=Math.floor(Math.random()*total);
    for(var i=0;i<total;i++){
      var b=document.createElement('button');b.type='button';b.dataset.i=i;b.textContent='◆';
      b.style.cssText='aspect-ratio:1;border:0;border-radius:10px;background:var(--surface-alt-color,#202633);color:#58d6d2;font-size:clamp(1.2rem,4vw,2rem);cursor:pointer;';
      if(i===target)b.innerHTML='<span style="display:inline-block;transform:scale(.72) rotate(45deg);">◆</span>';
      b.addEventListener('click',pick);grid.appendChild(b);
    }
    started=performance.now();roundEl.textContent=round+' / 12';
  }
  function pick(e){
    if(!active)return;
    var idx=Number(e.currentTarget.dataset.i);
    if(idx!==target)return;
    times.push(performance.now()-started);correct++;correctEl.textContent=correct;
    avgEl.textContent=Math.round(times.reduce(function(a,b){return a+b},0)/times.length)+' ms';
    round++;
    if(round>=12)finish();else draw();
  }
  function finish(){
    active=false;grid.innerHTML='';start.style.display='none';
    var avg=times.length?Math.round(times.reduce(function(a,b){return a+b},0)/times.length):0;
    score.textContent=correct+' / 12 correct';
    text.textContent='Average response time on correct rounds: '+avg+' ms.';
    summary.style.display='block';
  }
  function begin(){round=0;correct=0;times=[];active=true;start.style.display='none';summary.style.display='none';correctEl.textContent='0';avgEl.textContent='—';draw();}
  start.addEventListener('click',begin);restart.addEventListener('click',begin);
})();
</script>
