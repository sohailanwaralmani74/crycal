---
layout: default
title: "Optical Illusion Gallery — Wanjaaro"
description: "Interactive optical illusion challenges where you adjust visual patterns and compare your perceived match with the actual geometry."
permalink: /optical-illusion-gallery
category: perception
sidebar: true
sidebar_title: "Optical Illusion Gallery"
sidebar_subtitle: "Interactive visual perception"
sidebar_icon: "🌀"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Perception Test</span>
    <h1>Optical Illusion Gallery</h1>
    <p>Adjust the visual stimulus until it looks right, then reveal the actual measurement. Each challenge turns a familiar optical illusion into a simple perception task.</p>
  </section>

  <div class="illusion-toolbar">
    <button class="btn btn-primary" id="prev" type="button">← Previous</button>
    <div><strong id="counter">1 / 4</strong><span id="name">Müller-Lyer</span></div>
    <button class="btn btn-primary" id="next" type="button">Next →</button>
  </div>

  <section class="illusion-panel">
    <div id="illusion" class="illusion-stage" aria-label="Interactive optical illusion challenge"></div>
    <p id="instruction" class="illusion-instruction"></p>
    <div id="controls" class="illusion-controls"></div>
    <div id="feedback" class="illusion-feedback" aria-live="polite"></div>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>How the Challenge Works</h2><p>Perception is compared with the underlying geometry.</p></div></div>
    <p>The adjustable stimulus starts at a different size and you change it until it appears to match the reference. After you submit, Wanjaaro reveals the physical difference between your match and the actual target.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>Keep Your Setup Consistent</h2><p>Display conditions can change what you perceive.</p></div></div>
    <p>Brightness, contrast, viewing distance, ambient light, browser rendering, and display characteristics can affect visual judgments. Use similar conditions when comparing your own attempts.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>Interactive, Not Diagnostic</h2><p>A browser perception challenge, not a vision examination.</p></div></div>
    <p>The results describe your response to these visual stimuli. They are not a diagnosis of eyesight, color vision, or another visual condition.</p>
  </section>
</div>

<style>
.illusion-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1rem 0;text-align:center}
.illusion-toolbar>div{display:flex;flex-direction:column;gap:.2rem}.illusion-toolbar span{font-size:.8rem;color:var(--text-muted)}
.illusion-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}
.illusion-stage{height:330px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:var(--surface-muted);border-radius:var(--radius-md);color:#222}
.illusion-instruction{max-width:720px;margin:1rem auto .8rem;color:var(--text-secondary);line-height:1.55}
.illusion-controls{display:flex;justify-content:center;align-items:center;gap:.7rem;flex-wrap:wrap}
.illusion-controls input[type=range]{width:min(420px,80vw)}
.illusion-controls output{min-width:70px;font-family:var(--font-mono);font-weight:700}
.illusion-feedback{min-height:1.6em;margin-top:.8rem;font-weight:700;color:var(--text-secondary)}
.illusion-line{position:absolute;height:4px;background:currentColor}.illusion-line i{position:absolute;width:22px;height:4px;background:currentColor;top:0}
.muller-a,.muller-b{width:230px}.muller-a{transform:translateY(-58px)}.muller-b{transform:translateY(58px)}
.muller-a i:first-child{left:0;transform:rotate(35deg);transform-origin:left}.muller-a i:last-child{right:0;transform:rotate(-35deg);transform-origin:right}
.muller-b i:first-child{left:0;transform:rotate(-35deg);transform-origin:left}.muller-b i:last-child{right:0;transform:rotate(35deg);transform-origin:right}
.adjust-line{position:absolute;height:4px;background:#356ae6;left:50%;transform:translateX(-50%)}
.adjust-line i{position:absolute;width:22px;height:4px;background:#356ae6;top:0}
.ponzo-track{position:absolute;width:4px;height:270px;background:currentColor;transform-origin:bottom}.ponzo-left{transform:rotate(-18deg);left:43%}.ponzo-right{transform:rotate(18deg);left:57%}
.ponzo-reference{position:absolute;width:210px;height:4px;background:currentColor;top:105px;left:50%;transform:translateX(-50%)}
.hermann{display:grid;grid-template-columns:repeat(5,42px);gap:10px}.hermann span{width:42px;height:42px;background:#222;border-radius:4px}
.cafe{display:grid;grid-template-columns:repeat(5,55px);gap:0;background:#ddd;padding:8px}.cafe span{height:34px;background:#222;border:2px solid #ddd}.cafe span:nth-child(even){transform:translateY(5px)}
.illusion-choice{min-width:155px}
@media(max-width:640px){.illusion-panel{padding:1rem}.illusion-stage{height:290px}.illusion-toolbar .btn{padding:.65rem .7rem}.hermann{transform:scale(.82)}}
</style>

<script>
(function(){
  var stage=document.getElementById('illusion');
  var instruction=document.getElementById('instruction');
  var name=document.getElementById('name');
  var counter=document.getElementById('counter');
  var controls=document.getElementById('controls');
  var feedback=document.getElementById('feedback');
  var index=0;

  var items=[
    {
      name:'Müller-Lyer Match',
      instruction:'Adjust the blue line until it looks the same length as the black line. Then check your match.',
      build:function(){
        stage.innerHTML='<div class="illusion-line muller-a"><i></i><i></i></div><div id="target" class="adjust-line"><i></i><i></i></div>';
        stage.querySelector('#target').style.top='calc(50% + 35px)';
        controls.innerHTML='<input id="size" type="range" min="170" max="300" value="230" aria-label="Adjust comparison line length"><output id="value">230 px</output><button class="btn btn-accent" id="check" type="button">Check Match</button>';
        wireLengthTest(230);
      }
    },
    {
      name:'Ponzo Match',
      instruction:'The converging lines create a perspective cue. Adjust the blue line until it looks equal to the black reference line.',
      build:function(){
        stage.innerHTML='<div class="ponzo-track ponzo-left"></div><div class="ponzo-track ponzo-right"></div><div class="ponzo-reference"></div><div id="target" class="adjust-line" style="top:225px"></div>';
        controls.innerHTML='<input id="size" type="range" min="140" max="290" value="210" aria-label="Adjust comparison line length"><output id="value">210 px</output><button class="btn btn-accent" id="check" type="button">Check Match</button>';
        wireLengthTest(210);
      }
    },
    {
      name:'Hermann Grid',
      instruction:'Look at the intersections. Do you notice faint spots or patches that are not actually drawn?',
      build:function(){
        stage.innerHTML='<div class="hermann">'+Array(25).fill('<span></span>').join('')+'</div>';
        controls.innerHTML='<button class="btn btn-primary illusion-choice" id="yes" type="button">I See Spots</button><button class="btn btn-accent illusion-choice" id="no" type="button">I See No Spots</button>';
        document.getElementById('yes').onclick=function(){feedback.textContent='The grid contains no added spots. The apparent patches are part of the illusion.'};
        document.getElementById('no').onclick=function(){feedback.textContent='There are no added spots. Some viewers nevertheless notice faint patches at intersections.'};
      }
    },
    {
      name:'Cafe Wall',
      instruction:'The rows are physically parallel. Before revealing that, decide whether they look tilted or parallel to you.',
      build:function(){
        stage.innerHTML='<div class="cafe">'+Array(25).fill('<span></span>').join('')+'</div>';
        controls.innerHTML='<button class="btn btn-primary illusion-choice" id="tilted" type="button">They Look Tilted</button><button class="btn btn-accent illusion-choice" id="parallel" type="button">They Look Parallel</button>';
        document.getElementById('tilted').onclick=function(){feedback.textContent='The rows are actually parallel. The offset tiles and contrasting mortar create the tilted appearance.'};
        document.getElementById('parallel').onclick=function(){feedback.textContent='The rows are actually parallel, even though the pattern can make them appear tilted.'};
      }
    }
  ];

  function wireLengthTest(actual){
    var size=document.getElementById('size');
    var value=document.getElementById('value');
    var target=document.getElementById('target');
    function update(){target.style.width=size.value+'px';value.textContent=size.value+' px'}
    size.oninput=update;
    update();
    document.getElementById('check').onclick=function(){
      var error=Math.abs(Number(size.value)-actual);
      feedback.textContent=error===0
        ? 'Your match landed exactly on the physical reference length.'
        : 'Your perceived match was '+error+' px from the physical reference. The reference is '+actual+' px.';
    };
  }

  function render(){
    var item=items[index];
    name.textContent=item.name;
    counter.textContent=(index+1)+' / '+items.length;
    instruction.textContent=item.instruction;
    feedback.textContent='';
    controls.innerHTML='';
    item.build();
  }

  document.getElementById('prev').onclick=function(){index=(index+items.length-1)%items.length;render()};
  document.getElementById('next').onclick=function(){index=(index+1)%items.length;render()};
  render();
})();
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebPage",
  "name":"Optical Illusion Gallery — Wanjaaro",
  "url":"https://wanjaaro.com/optical-illusion-gallery",
  "description":"Interactive browser-based optical illusion challenges for visual perception."
}
</script>
