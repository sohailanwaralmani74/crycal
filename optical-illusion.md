---
layout: default
title: "Optical Illusion Gallery — Wanjaaro"
description: "Explore interactive optical illusions in your browser and test how lines, spacing, and surrounding shapes affect visual perception."
permalink: /optical-illusion
category: perception
sidebar: true
sidebar_title: "Optical Illusion Gallery"
sidebar_subtitle: "Explore visual perception"
sidebar_icon: "🌀"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Perception</span>
    <h1>Optical Illusion Gallery</h1>
    <p>Explore interactive visual illusions and see how surrounding lines, spacing, and shapes can change what you perceive.</p>
  </section>

  <div class="illusion-toolbar">
    <button class="btn btn-primary" id="prev" type="button">← Previous</button>
    <div><strong id="counter">1 / 4</strong><span id="name">Müller-Lyer</span></div>
    <button class="btn btn-primary" id="next" type="button">Next →</button>
  </div>

  <section class="illusion-panel">
    <div id="illusion" class="illusion-stage" aria-label="Interactive optical illusion"></div>
    <p id="description" class="illusion-description"></p>
    <button class="btn btn-accent" id="toggle" type="button">Show Reference</button>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>What You Are Seeing</h2><p>Perception can depend on visual context.</p></div></div>
    <p>Optical illusions demonstrate that the visual system does not simply read every line or shape in isolation. Surrounding elements, perspective cues, contrast, and spacing can influence how a pattern appears.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>Interactive, Not Diagnostic</h2><p>A visual exploration tool.</p></div></div>
    <p>This gallery is designed for exploration and comparison. It is not a test of eyesight or a clinical assessment of visual function.</p>
  </section>
</div>

<style>
.illusion-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1rem 0;text-align:center}
.illusion-toolbar>div{display:flex;flex-direction:column;gap:.2rem}.illusion-toolbar span{font-size:.8rem;color:var(--text-muted)}
.illusion-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}
.illusion-stage{height:360px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:var(--surface-muted);border-radius:var(--radius-md)}
.illusion-description{max-width:700px;margin:1rem auto;color:var(--text-secondary);line-height:1.6}
.illusion-line{position:absolute;height:4px;background:currentColor}.illusion-line i{position:absolute;width:22px;height:4px;background:currentColor;top:0}
.muller-a,.muller-b{width:230px}.muller-a{transform:translateY(-55px)}.muller-b{transform:translateY(55px)}
.muller-a i:first-child{left:0;transform:rotate(35deg);transform-origin:left}.muller-a i:last-child{right:0;transform:rotate(-35deg);transform-origin:right}
.muller-b i:first-child{left:0;transform:rotate(-35deg);transform-origin:left}.muller-b i:last-child{right:0;transform:rotate(35deg);transform-origin:right}
.ponzo-line{position:absolute;width:4px;height:270px;background:currentColor;transform-origin:bottom}.ponzo-left{transform:rotate(-18deg);left:43%}.ponzo-right{transform:rotate(18deg);left:57%}
.ponzo-mark{position:absolute;width:210px;height:4px;background:currentColor}.ponzo-top{top:110px}.ponzo-bottom{top:240px}
.hermann{display:grid;grid-template-columns:repeat(5,42px);gap:10px}.hermann span{width:42px;height:42px;background:#222;border-radius:4px}
.cafe{display:grid;grid-template-columns:repeat(5,55px);gap:0;background:#ddd;padding:8px}.cafe span{height:34px;background:#222;border:2px solid #ddd}.cafe span:nth-child(even){transform:translateY(5px)}
.reference{position:absolute;width:270px;height:2px;background:#d34d4d;opacity:.9}
@media(max-width:640px){.illusion-stage{height:300px}.illusion-toolbar .btn{padding:.65rem .7rem}.hermann{transform:scale(.85)}}
</style>

<script>
(function(){
  var stage=document.getElementById('illusion'),desc=document.getElementById('description'),name=document.getElementById('name'),counter=document.getElementById('counter'),toggle=document.getElementById('toggle');
  var items=[
    {name:'Müller-Lyer',desc:'The two horizontal lines are the same length. The arrow-like ends can make one appear longer.',build:function(){stage.innerHTML='<div class="illusion-line muller-a"><i></i><i></i></div><div class="illusion-line muller-b"><i></i><i></i></div>'}},
    {name:'Ponzo',desc:'The converging lines provide perspective cues that can make equally sized horizontal marks appear different.',build:function(){stage.innerHTML='<div class="ponzo-line ponzo-left"></div><div class="ponzo-line ponzo-right"></div><div class="ponzo-mark ponzo-top"></div><div class="ponzo-mark ponzo-bottom"></div>'}},
    {name:'Hermann Grid',desc:'Look across the intersections. Faint patches can appear where the dark lines cross even though no such patches are actually drawn.',build:function(){stage.innerHTML='<div class="hermann">'+Array(25).fill('<span></span>').join('')+'</div>'}},
    {name:'Cafe Wall',desc:'The horizontal rows are parallel, but the offset tiles and contrasting mortar can make the lines appear slanted.',build:function(){stage.innerHTML='<div class="cafe">'+Array(25).fill('<span></span>').join('')+'</div>'}}
  ];
  var index=0,reference=null;
  function render(){var x=items[index];name.textContent=x.name;counter.textContent=(index+1)+' / '+items.length;desc.textContent=x.desc;toggle.textContent='Show Reference';reference=null;x.build()}
  document.getElementById('prev').onclick=function(){index=(index+items.length-1)%items.length;render()};
  document.getElementById('next').onclick=function(){index=(index+1)%items.length;render()};
  toggle.onclick=function(){if(reference){reference.remove();reference=null;toggle.textContent='Show Reference';return}reference=document.createElement('div');reference.className='reference';stage.appendChild(reference);toggle.textContent='Hide Reference'};
  render();
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"Optical Illusion Gallery — Wanjaaro","url":"https://wanjaaro.com/optical-illusion","description":"Interactive browser-based optical illusion gallery."}
</script>
