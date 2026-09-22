---
layout: default
title: "Contrast Test — Wanjaaro"
description: "Free browser-based contrast perception test. Find the patterned tile that is easiest to miss as contrast decreases."
permalink: /contrast-test
category: perception
sidebar: true
sidebar_title: "Contrast Test"
sidebar_subtitle: "Find subtle visual differences"
sidebar_icon: "◐"
---

<div class="benchmark-container">
  <section class="benchmark-hero"><span class="benchmark-badge playable">Perception</span><h1>Contrast Test</h1><p>Find the patterned tile that differs from the background. The contrast becomes weaker as you progress.</p></section>
  <section class="contrast-panel">
    <div class="contrast-stats"><div><span>Round</span><strong id="round">0 / 18</strong></div><div><span>Correct</span><strong id="correct">0</strong></div><div><span>Lowest Contrast</span><strong id="best">--</strong></div></div>
    <div id="grid" class="contrast-grid"></div>
    <p id="status">Press Start Test to begin.</p>
    <button class="btn btn-accent" id="start" type="button">Start Test</button>
  </section>
  <section id="summary" class="test-summary-card" hidden><span class="benchmark-badge playable">Session Complete</span><h2 id="result"></h2><p id="detail"></p><div class="summary-actions"><button class="btn btn-primary" id="again" type="button">Run Again</button></div></section>
  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>What This Test Measures</h2><p>Detection of small differences in displayed contrast.</p></div></div><p>The pattern becomes closer in luminance to its surrounding tiles as rounds progress. Your result depends on how easily you can detect that difference on the current display.</p></section>
  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>Display Conditions Matter</h2><p>Brightness and room lighting can change the challenge.</p></div></div><p>Monitor calibration, brightness, ambient light, viewing distance, display quality, and individual visual differences can affect contrast perception. This is not a clinical contrast-sensitivity examination.</p></section>
</div>

<style>
.contrast-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}.contrast-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-bottom:1rem}.contrast-stats>div{padding:.75rem;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}.contrast-stats span{display:block;font-size:.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:800}.contrast-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:500px;margin:0 auto}.contrast-cell{aspect-ratio:1;border:0;border-radius:10px;cursor:pointer}.contrast-cell:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
@media(max-width:640px){.contrast-panel{padding:1rem}.contrast-grid{gap:6px}}
</style>

<script>
(function(){
  var grid=document.getElementById('grid'),roundEl=document.getElementById('round'),correctEl=document.getElementById('correct'),bestEl=document.getElementById('best'),status=document.getElementById('status'),start=document.getElementById('start'),summary=document.getElementById('summary'),result=document.getElementById('result'),detail=document.getElementById('detail');
  var round=0,correct=0,best=Infinity,active=false,delta=0;
  function make(){grid.innerHTML='';delta=Math.max(8,40-(round-1)*1.8);var base=235,odd=base-delta,idx=Math.floor(Math.random()*16);for(var i=0;i<16;i++){var b=document.createElement('button');b.className='contrast-cell';b.type='button';b.style.background='rgb('+base+' '+base+' '+base+')';if(i===idx)b.style.background='rgb('+odd+' '+odd+' '+odd+')';b.dataset.ok=i===idx?'1':'0';b.setAttribute('aria-label','Contrast tile '+(i+1));b.onclick=function(){if(!active)return;if(this.dataset.ok==='1'){correct++;best=Math.min(best,delta);correctEl.textContent=correct;bestEl.textContent=best.toFixed(1);Array.from(grid.children).forEach(function(x){x.disabled=true});if(round>=18)finish();else setTimeout(next,180)}else{status.textContent='Try another tile.'}};grid.appendChild(b)}roundEl.textContent=round+' / 18'}
  function next(){round++;status.textContent='Find the tile that differs from the others.';make()}
  function begin(){round=0;correct=0;best=Infinity;active=true;summary.hidden=true;start.hidden=true;correctEl.textContent='0';bestEl.textContent='--';next()}
  function finish(){active=false;result.textContent=correct+' / 18 correct';detail.textContent='Lowest contrast difference detected: '+best.toFixed(1)+'. Results can change with display and lighting conditions.';summary.hidden=false;start.hidden=false;start.textContent='Try Again';}
  start.onclick=begin;document.getElementById('again').onclick=begin;
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"Contrast Test — Wanjaaro","url":"https://wanjaaro.com/contrast-test","applicationCategory":"EducationalApplication","operatingSystem":"Any"}
</script>
