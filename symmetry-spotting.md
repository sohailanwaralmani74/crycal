---
layout: default
title: "Symmetry Spotting Test — Wanjaaro"
description: "Free browser-based symmetry spotting test. Decide whether geometric patterns contain vertical symmetry."
permalink: /symmetry-spotting
category: perception
sidebar: true
sidebar_title: "Symmetry Spotting"
sidebar_subtitle: "Find visual symmetry"
sidebar_icon: "🦋"
---

<div class="benchmark-container">
  <section class="benchmark-hero"><span class="benchmark-badge playable">Perception</span><h1>Symmetry Spotting Test</h1><p>Look at each pattern and decide whether it has vertical symmetry. Work through the shapes as accurately as you can.</p></section>
  <section class="symmetry-panel">
    <div class="symmetry-stats"><div><span>Round</span><strong id="round">0 / 15</strong></div><div><span>Correct</span><strong id="correct">0</strong></div><div><span>Accuracy</span><strong id="accuracy">--</strong></div></div>
    <div id="shape" class="shape-area"></div>
    <div class="symmetry-actions"><button class="btn btn-primary" id="yes" type="button">Symmetrical</button><button class="btn btn-primary" id="no" type="button">Not Symmetrical</button></div>
    <button class="btn btn-accent" id="start" type="button">Start Test</button>
    <p id="status">Decide whether the shape mirrors across the vertical center line.</p>
  </section>
  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>What You Are Looking For</h2><p>Compare both sides of the pattern.</p></div></div><p>A symmetrical pattern has matching structure on opposite sides of a vertical center line. The challenge uses simple geometric shapes so the judgment depends on visual inspection rather than reading.</p></section>
  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>Accuracy Before Speed</h2><p>Fast answers are not useful if the pattern is misread.</p></div></div><p>Lighting, screen size, scaling, and visual attention can change how quickly a pattern is recognized. Use similar viewing conditions when comparing your own sessions.</p></section>
</div>

<style>
.symmetry-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}.symmetry-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-bottom:1rem}.symmetry-stats>div{padding:.75rem;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}.symmetry-stats span{display:block;font-size:.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:800}.shape-area{height:280px;display:flex;align-items:center;justify-content:center;background:var(--surface-muted);border-radius:var(--radius-md);position:relative;overflow:hidden}.shape{width:130px;height:130px;position:relative}.shape span{position:absolute;background:var(--accent);border-radius:6px}.shape .a{width:42px;height:25px;left:15px;top:15px}.shape .b{width:28px;height:60px;left:15px;top:55px}.shape .c{width:52px;height:22px;left:55px;top:82px}.shape .d{width:20px;height:38px;left:96px;top:35px}.symmetry-actions{display:flex;justify-content:center;gap:.7rem;margin:1rem 0}.symmetry-actions button{min-width:150px}@media(max-width:640px){.symmetry-actions{flex-direction:column}.symmetry-actions button{width:100%}}
</style>

<script>
(function(){
  var shape=document.getElementById('shape'),roundEl=document.getElementById('round'),correctEl=document.getElementById('correct'),accuracyEl=document.getElementById('accuracy'),status=document.getElementById('status'),start=document.getElementById('start'),yes=document.getElementById('yes'),no=document.getElementById('no');
  var round=0,correct=0,active=false,target=false,startedAt=0;
  var patterns=[
    ['M','A'],['M','N'],['M','A'],['M','N'],['M','A'],['M','N'],['M','A'],['M','N'],['M','A'],['M','N'],['M','A'],['M','N'],['M','A'],['M','N'],['M','A']
  ];
  function draw(){var type=patterns[round-1][1];target=type==='A';shape.innerHTML='<div class="shape">'+(target?'<span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span><span class="e"></span>':'<span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span>')+'</div>';roundEl.textContent=round+' / 15';startedAt=performance.now()}
  function answer(value){if(!active)return;var ok=value===target;if(ok)correct++;correctEl.textContent=correct;accuracyEl.textContent=Math.round(correct/round*100)+'%';status.textContent=ok?'Correct.':'Not quite.';if(round>=15){active=false;start.hidden=false;start.textContent='Try Again';status.textContent='Session complete: '+correct+' / 15 correct.';return}setTimeout(function(){round++;draw()},220)}
  function begin(){round=1;correct=0;active=true;start.hidden=true;accuracyEl.textContent='0%';status.textContent='Decide whether the shape is symmetrical.';draw()}
  yes.onclick=function(){answer(true)};no.onclick=function(){answer(false)};start.onclick=begin;
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"Symmetry Spotting Test — Wanjaaro","url":"https://wanjaaro.com/symmetry-spotting","applicationCategory":"EducationalApplication","operatingSystem":"Any"}
</script>
