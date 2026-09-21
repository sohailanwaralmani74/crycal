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
    <div class="test-stats-bar">
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
  var best=Number(localStorage.getItem('wanjaaro_pb_grid_memory')||0),level=0,target=[],selected=[],accepting=false;
  bestEl.textContent=best||'--';

  function build(){
    grid.innerHTML='';
    for(var i=0;i<25;i++){
      var cell=document.createElement('button');cell.type='button';cell.className='visual-memory-cell';cell.dataset.index=i;
      cell.onclick=function(){
        if(!accepting)return;
        var index=Number(this.dataset.index);
        if(selected.indexOf(index)>=0)return;
        selected.push(index);this.classList.add('picked');
        if(target.indexOf(index)<0){end();return;}
        if(selected.length===target.length){accepting=false;setTimeout(nextRound,350);}
      };
      grid.appendChild(cell);
    }
  }

  function randomCells(count){
    var result=[];
    while(result.length<count){var n=Math.floor(Math.random()*25);if(result.indexOf(n)<0)result.push(n);}
    return result;
  }

  function nextRound(){
    selected=[];level++;levelEl.textContent=level;
    var count=Math.min(2+level,12);cellsEl.textContent=count;target=randomCells(count);
    accepting=false;status.textContent='Memorize the highlighted cells.';
    target.forEach(function(i){grid.children[i].classList.add('shown');});
    setTimeout(function(){
      target.forEach(function(i){grid.children[i].classList.remove('shown');});
      Array.from(grid.children).forEach(function(c){c.classList.remove('picked');});
      accepting=true;status.textContent='Select the cells you remember.';
    },1000);
  }

  function end(){
    accepting=false;
    var result=Math.max(0,level-1);
    if(result>best){best=result;localStorage.setItem('wanjaaro_pb_grid_memory',best);bestEl.textContent=best;}
    status.textContent='Round missed. You completed level '+result+'.';
    start.hidden=false;start.textContent='Try Again';
  }

  start.onclick=function(){level=0;levelEl.textContent='0';start.hidden=true;build();nextRound();};
  build();
})();
</script>

<style>
.visual-memory-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:400px;margin:20px auto}
.visual-memory-cell{aspect-ratio:1;border:0;border-radius:7px;cursor:pointer}
.visual-memory-cell.shown{filter:brightness(1.35)}
.visual-memory-cell.picked{outline:2px solid currentColor}
</style>
