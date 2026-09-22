---
layout: default
title: "Color Perception Test — Wanjaaro"
description: "Free browser-based color perception test. Find the tile that differs from the others as the color difference becomes smaller."
permalink: /color-perception
category: perception
sidebar: true
sidebar_title: "Color Perception"
sidebar_subtitle: "Find the different color"
sidebar_icon: "🎨"
---

<div class="benchmark-container color-test">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Perception Test</span>
    <h1>Color Perception Test</h1>
    <p>Find the one tile that is slightly different from the rest. The difference becomes smaller as you progress, so focus on the colors rather than rushing your clicks.</p>
  </section>

  <section class="benchmark-content-block">
    <h2>Find the Different Tile</h2>
    <p>Each round shows a grid of similar colors with one different tile. Select the odd tile to continue. The test records correct answers, mistakes, and the smallest color difference you successfully identified.</p>
  </section>

  <div class="color-test-panel">
    <div class="color-test-top">
      <div><span class="color-label">Round</span><strong id="round">0 / 20</strong></div>
      <div><span class="color-label">Correct</span><strong id="correct">0</strong></div>
      <div><span class="color-label">Mistakes</span><strong id="mistakes">0</strong></div>
      <div><span class="color-label">Best Difference</span><strong id="best">--</strong></div>
    </div>

    <div id="grid" class="color-grid" aria-label="Color perception test grid"></div>
    <p id="status" class="color-status">Press Start Test to begin.</p>
    <button id="start" class="btn btn-accent" type="button">Start Test</button>
  </div>

  <section id="summary" class="test-summary-card" hidden aria-live="polite">
    <span class="benchmark-badge playable">Session Complete</span>
    <h2 id="result">--</h2>
    <p id="result-detail"></p>
    <div class="summary-actions">
      <button id="restart" class="btn btn-primary" type="button">Run Again</button>
      <button id="copy" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>What This Test Measures</h2>
        <p>Visual discrimination between nearby displayed colors.</p>
      </div>
    </div>
    <p>The challenge becomes harder by reducing the color difference between the odd tile and the surrounding tiles. Your result reflects how far you progressed and how consistently you selected the different tile.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Your Display Matters</h2>
        <p>Color appearance depends on the viewing setup.</p>
      </div>
    </div>
    <p>Display calibration, brightness, ambient light, viewing angle, browser rendering, and individual color perception can all affect the result. For personal comparisons, use the same display and similar lighting conditions.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Not a Vision Test</h2>
        <p>A browser challenge, not a clinical assessment.</p>
      </div>
    </div>
    <p>This test is intended as a visual perception challenge. It does not diagnose color vision deficiency or any other vision condition.</p>
  </section>
</div>

<style>
.color-test-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}
.color-test-top{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-bottom:1.25rem}
.color-test-top>div{padding:.7rem .45rem;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}
.color-label{display:block;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);font-weight:800;margin-bottom:.25rem}
.color-test-top strong{font-family:var(--font-mono);font-size:1.05rem}
.color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:400px;margin:0 auto;padding:6px}
.color-cell{aspect-ratio:1;border:0;border-radius:10px;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);transition:transform .1s ease,box-shadow .1s ease}
.color-cell:hover{transform:scale(1.025);box-shadow:inset 0 0 0 2px rgba(0,0,0,.18)}
.color-cell:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.color-status{min-height:1.5em;margin:.7rem 0 1rem;color:var(--text-secondary)}
.color-test-panel .btn{min-width:140px}
@media(max-width:640px){
  .color-test-panel{padding:1rem}
  .color-test-top{gap:.45rem}
  .color-test-top>div{padding:.55rem .3rem}
  .color-test-top strong{font-size:.9rem}
  .color-grid{gap:5px;padding:4px;max-width:300px}
}
</style>

<script>
(function(){
  var grid=document.getElementById('grid');
  var roundEl=document.getElementById('round');
  var correctEl=document.getElementById('correct');
  var mistakesEl=document.getElementById('mistakes');
  var bestEl=document.getElementById('best');
  var status=document.getElementById('status');
  var start=document.getElementById('start');
  var summary=document.getElementById('summary');
  var result=document.getElementById('result');
  var detail=document.getElementById('result-detail');
  var rounds=20,round=0,correct=0,mistakes=0,bestDelta=Infinity,currentDelta=0,active=false;
  var pb=Number(localStorage.getItem('wanjaaro_pb_color_perception')||0);
  if(pb) bestEl.textContent=pb+' Δ';

  function deltaForRound(n){
    return Math.max(2,18-(n-1)*0.8);
  }

  function colorForRound(){
    var hue=Math.floor(Math.random()*360);
    var sat=55+Math.floor(Math.random()*16);
    var light=45+Math.floor(Math.random()*11);
    return {base:'hsl('+hue+' '+sat+'% '+light+'%)',odd:'hsl('+hue+' '+sat+'% '+(light+currentDelta/2)+'%)'};
  }

  function showRound(){
    grid.innerHTML='';
    currentDelta=deltaForRound(round);
    var colors=colorForRound();
    var odd=Math.floor(Math.random()*16);
    for(var i=0;i<16;i++){
      var cell=document.createElement('button');
      cell.type='button';
      cell.className='color-cell';
      cell.style.background=i===odd?colors.odd:colors.base;
      cell.setAttribute('aria-label','Color tile '+(i+1));
      cell.dataset.correct=i===odd?'true':'false';
      cell.onclick=function(){
        if(!active)return;
        if(this.dataset.correct==='true'){
          correct++;
          if(currentDelta<bestDelta)bestDelta=currentDelta;
          correctEl.textContent=correct;
          status.textContent='Correct. The next round is slightly harder.';
          setTimeout(nextRound,220);
        }else{
          mistakes++;
          mistakesEl.textContent=mistakes;
          status.textContent='Not that tile. Try again.';
        }
        Array.from(grid.children).forEach(function(c){c.disabled=true});
        if(this.dataset.correct!=='true'){
          setTimeout(function(){Array.from(grid.children).forEach(function(c){c.disabled=false})},180);
        }
      };
      grid.appendChild(cell);
    }
    roundEl.textContent=round+' / '+rounds;
  }

  function nextRound(){
    if(round>=rounds){finish();return}
    round++;
    showRound();
  }

  function finish(){
    active=false;
    Array.from(grid.children).forEach(function(c){c.disabled=true});
    var score=correct+'/'+rounds;
    var shownBest=bestDelta===Infinity?'--':bestDelta.toFixed(1)+' Δ';
    result.textContent=score+' correct';
    detail.textContent='You identified the different tile in '+correct+' of '+rounds+' rounds. Smallest color difference reached: '+shownBest+'.';
    summary.hidden=false;
    start.textContent='Try Again';
    if(bestDelta!==Infinity && (!pb || bestDelta<pb)){
      pb=bestDelta;
      localStorage.setItem('wanjaaro_pb_color_perception',String(pb));
      bestEl.textContent=pb.toFixed(1)+' Δ';
    }
    summary.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function begin(){
    round=0;correct=0;mistakes=0;bestDelta=Infinity;active=true;
    correctEl.textContent='0';mistakesEl.textContent='0';roundEl.textContent='0 / '+rounds;
    summary.hidden=true;start.textContent='Restart Test';status.textContent='Find the different tile.';
    nextRound();
  }

  start.onclick=begin;
  document.getElementById('restart').onclick=begin;
  document.getElementById('copy').onclick=function(){
    var text='🎨 Wanjaaro Color Perception: '+correct+'/'+rounds+' correct';
    if(bestDelta!==Infinity)text+=' · smallest difference '+bestDelta.toFixed(1);
    text+='\nhttps://wanjaaro.com/color-perception';
    if(navigator.clipboard)navigator.clipboard.writeText(text);
  };
})();
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebPage",
      "@id":"https://wanjaaro.com/color-perception#webpage",
      "url":"https://wanjaaro.com/color-perception",
      "name":"Color Perception Test — Wanjaaro",
      "description":"Browser-based color perception test that asks users to find the different tile as the color difference becomes smaller."
    },
    {
      "@type":"WebApplication",
      "@id":"https://wanjaaro.com/color-perception#application",
      "name":"Wanjaaro Color Perception Test",
      "url":"https://wanjaaro.com/color-perception",
      "applicationCategory":"EducationalApplication",
      "operatingSystem":"Any",
      "browserRequirements":"JavaScript enabled"
    },
    {
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},
        {"@type":"ListItem","position":2,"name":"Perception & Senses","item":"https://wanjaaro.com/perception"},
        {"@type":"ListItem","position":3,"name":"Color Perception","item":"https://wanjaaro.com/color-perception"}
      ]
    }
  ]
}
</script>
