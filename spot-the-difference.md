---
layout: default
title: "Spot the Difference Game — Wanjaaro"
description: "Find hidden differences between two generated grids in a timed visual attention game."
permalink: /spot-the-difference
category: cognitive
sidebar: true
sidebar_title: "Spot the Difference"
sidebar_subtitle: "Timed visual comparison game"
sidebar_icon: "🔎"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Cognitive Game</span>
    <h1>Spot the Difference</h1>
    <p>Compare two boards and click the changed tiles on the right. Find all three differences before the 30-second timer ends.</p>
  </div>

  <div class="tool-panel" style="max-width:820px;margin:0 auto;">
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="diff-time">30</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Found</div><div class="test-stat-val" id="diff-found">0 / 3</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Rounds</div><div class="test-stat-val" id="diff-round">1 / 3</div></div>
    </div>
    <div id="diff-boards" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px auto;max-width:700px;"></div>
    <div style="text-align:center;"><button id="diff-start" class="btn btn-primary">Start Game</button></div>
    <div id="diff-summary" class="test-summary-card" style="display:none;">
      <span class="benchmark-badge playable">Finished</span>
      <h2 id="diff-score">—</h2>
      <p id="diff-summary-text"></p>
      <button id="diff-restart" class="btn btn-primary">Play Again</button>
    </div>
  </div>

  <div class="benchmark-info-section">
    <h3>How to Play</h3>
    <p>Each round shows two matching tile boards. Three tiles on the right contain small changes in symbol or position. Click the changed tiles on the right board; incorrect clicks do not end the round.</p>
    <p>This is a visual comparison game. Screen size, zoom, and display quality can change how easy the differences are to see.</p>
  </div>
</div>

<script>
(function(){
  var boards=document.getElementById('diff-boards'),start=document.getElementById('diff-start'),restart=document.getElementById('diff-restart');
  var timeEl=document.getElementById('diff-time'),foundEl=document.getElementById('diff-found'),roundEl=document.getElementById('diff-round'),summary=document.getElementById('diff-summary'),score=document.getElementById('diff-score'),sumText=document.getElementById('diff-summary-text');
  var round=0,found=0,totalFound=0,targets=[],timer=0,endAt=0,active=false;
  var symbols=['●','◆','■','▲','★','✚'];var fills=['#59d8d2','#f0c75e','#f27b72','#8ea8ff','#c18cff'];
  function makeRound(){
    boards.innerHTML='';targets=[];found=0;foundEl.textContent='0 / 3';roundEl.textContent=(round+1)+' / 3';
    var size=5,total=size*size, cells=[];
    for(var i=0;i<total;i++)cells.push({s:symbols[Math.floor(Math.random()*symbols.length)],c:fills[Math.floor(Math.random()*fills.length)]});
    var changed=[];
    while(changed.length<3){var x=Math.floor(Math.random()*total);if(changed.indexOf(x)<0)changed.push(x);}
    targets=changed.slice();
    var left=document.createElement('div'),right=document.createElement('div');
    [left,right].forEach(function(board,side){
      board.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:5px;';
      cells.forEach(function(cell,i){
        var b=document.createElement('button');b.type='button';b.textContent=cell.s;b.dataset.i=i;
        b.style.cssText='aspect-ratio:1;border:1px solid var(--border-color);border-radius:7px;background:var(--surface-alt-color,#202633);color:'+cell.c+';font-size:clamp(.9rem,3vw,1.5rem);cursor:pointer;';
        if(side===1&&targets.indexOf(i)>=0){var other=symbols[(symbols.indexOf(cell.s)+1)%symbols.length];b.textContent=other;b.dataset.target='1';}
        if(side===1)b.addEventListener('click',pick);
        board.appendChild(b);
      });
      boards.appendChild(board);
    });
    endAt=performance.now()+30000;
  }
  function pick(e){
    if(!active||e.currentTarget.dataset.target!=='1'||e.currentTarget.dataset.found==='1')return;
    e.currentTarget.dataset.found='1';e.currentTarget.style.outline='3px solid #59d8d2';found++;totalFound++;foundEl.textContent=found+' / 3';
    if(found===3){round++;if(round===3)finish();else makeRound();}
  }
  function finish(){
    active=false;clearInterval(timer);boards.innerHTML='';start.style.display='none';score.textContent=totalFound+' differences found';sumText.textContent='You completed '+round+' of 3 comparison rounds.';summary.style.display='block';
  }
  function begin(){
    clearInterval(timer);round=0;totalFound=0;active=true;summary.style.display='none';start.style.display='none';makeRound();
    timer=setInterval(function(){var left=Math.max(0,Math.ceil((endAt-performance.now())/1000));timeEl.textContent=left;if(left<=0)finish();},100);
  }
  start.addEventListener('click',begin);restart.addEventListener('click',begin);
})();
</script>
