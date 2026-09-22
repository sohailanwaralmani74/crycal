---
layout: default
title: "Visual Grid Memory Test — Wanjaaro"
description: "Free browser-based visual grid memory test. Memorize highlighted cells and reproduce their locations as the pattern grows."
permalink: /visual-grid-memory
category: memory
sidebar: true
sidebar_title: "Visual Grid Memory"
sidebar_subtitle: "Remember highlighted cells"
sidebar_icon: "🔲"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Memory Test</span>
    <h1>Visual Grid Memory Test</h1>
    <p>A group of cells flashes briefly. When the grid clears, select the same locations. Each successful round adds another highlighted cell.</p>
  </div>

  <div class="benchmark-card">
    <div id="grid" class="visual-memory-grid"></div>
    <button class="btn btn-accent" id="start">Start Test</button>
    <div class="test-stats-bar" style="display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;gap:12px;">
      <div class="test-stat-item"><div class="test-stat-label">Level</div><div class="test-stat-val" id="level">0</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Cells</div><div class="test-stat-val" id="cells">--</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Best</div><div class="test-stat-val" id="best">--</div></div>
    </div>
    <p id="status"></p>
  </div>

  <div class="benchmark-info-section">
    <h3>This Is a Location Task</h3>
    <p>The pattern has no required order. You need to remember which positions were highlighted and reproduce that spatial arrangement after the flash.</p>
    <h3>Growing Spatial Load</h3>
    <p>The number of highlighted cells increases after each successful round. Your level records how many rounds you completed before a mistake.</p>
    <h3>Keep Your Viewing Conditions Consistent</h3>
    <p>Screen size, viewing distance, distractions, and attention during the brief display can change how difficult a round feels.</p>
  </div>
</div>

<script>
(function(){
  var grid=document.getElementById('grid'),start=document.getElementById('start'),levelEl=document.getElementById('level'),cellsEl=document.getElementById('cells'),bestEl=document.getElementById('best'),status=document.getElementById('status');
  var best=Number(localStorage.getItem('wanjaaro_pb_grid_memory')||0),level=0,target=[],selected=[],accepting=false,locked=false;

  bestEl.textContent=best?best:'--';

  function build(){
    grid.innerHTML='';
    for(var i=0;i<25;i++){
      var cell=document.createElement('button');
      cell.type='button';
      cell.className='visual-memory-cell';
      cell.dataset.index=i;
      cell.setAttribute('aria-label','Grid cell '+(i+1));
      cell.onclick=function(){
        if(!accepting||locked)return;
        var index=Number(this.dataset.index);
        if(selected.indexOf(index)>=0)return;

        selected.push(index);
        this.classList.add('picked');

        if(target.indexOf(index)<0){
          this.classList.add('wrong');
          locked=true;
          setTimeout(end,450);
          return;
        }

        if(selected.length===target.length){
          accepting=false;
          locked=true;
          target.forEach(function(i){grid.children[i].classList.add('correct');});
          status.textContent='Correct. Loading the next level...';
          setTimeout(nextRound,700);
        }
      };
      grid.appendChild(cell);
    }
  }

  function randomCells(count){
    var result=[];
    while(result.length<count){
      var n=Math.floor(Math.random()*25);
      if(result.indexOf(n)<0)result.push(n);
    }
    return result;
  }

  function clearStates(){
    Array.from(grid.children).forEach(function(c){
      c.classList.remove('shown','picked','correct','wrong');
    });
  }

  function nextRound(){
    clearStates();
    selected=[];
    locked=false;
    level++;
    levelEl.textContent=level;

    var count=Math.min(2+level,12);
    cellsEl.textContent=count;
    target=randomCells(count);
    accepting=false;

    status.textContent='Memorize the highlighted pattern.';
    target.forEach(function(i){grid.children[i].classList.add('shown');});

    var displayTime=Math.max(900,1500-level*45);
    setTimeout(function(){
      target.forEach(function(i){grid.children[i].classList.remove('shown');});
      accepting=true;
      status.textContent='Now reproduce the pattern.';
    },displayTime);
  }

  function end(){
    accepting=false;
    var result=Math.max(0,level-1);
    if(result>best){
      best=result;
      localStorage.setItem('wanjaaro_pb_grid_memory',String(best));
      bestEl.textContent=best+' levels';
    }
    status.textContent='Incorrect pattern. You reached level '+result+'.';
    start.hidden=false;
    start.textContent='Try Again';
  }

  start.onclick=function(){
    level=0;
    levelEl.textContent='0';
    cellsEl.textContent='--';
    status.textContent='Preparing...';
    start.hidden=true;
    build();
    setTimeout(nextRound,350);
  };

  build();
})();
</script>

<style>
.visual-memory-grid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:8px;
  max-width:400px;
  margin:20px auto;
}
.visual-memory-cell{
  aspect-ratio:1;
  min-height:48px;
  border:2px solid #cfd5dc;
  border-radius:8px;
  background:#f4f6f8;
  cursor:pointer;
  transition:transform .12s ease,background .12s ease,border-color .12s ease;
}
.visual-memory-cell:hover{transform:scale(1.03)}
.visual-memory-cell.shown{
  background:#4f7cff;
  border-color:#315edc;
  box-shadow:0 0 0 3px rgba(79,124,255,.18);
}
.visual-memory-cell.picked{
  background:#e7edf5;
  border-color:#66727e;
  box-shadow:inset 0 0 0 3px rgba(0,0,0,.08);
}
.visual-memory-cell.correct{
  background:#4caf78;
  border-color:#32865b;
}
.visual-memory-cell.wrong{
  background:#d95c5c;
  border-color:#b83e3e;
}
.visual-memory-cell:disabled{cursor:default}
</style>
