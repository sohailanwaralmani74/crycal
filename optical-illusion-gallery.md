---
layout: default
title: "Optical Illusion Gallery — Wanjaaro"
description: "Interactive optical illusion tests using classic visual patterns. Judge what looks larger, then reveal whether the physical shapes were actually different."
permalink: /optical-illusion-gallery
category: perception
sidebar: true
sidebar_title: "Optical Illusion Gallery"
sidebar_subtitle: "Interactive visual perception tests"
sidebar_icon: "🌀"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Perception Test</span>
    <h1>Optical Illusion Gallery</h1>
    <p>These are real visual illusions, not measurement demos. Make a quick visual judgment, then reveal the physical relationship behind the image.</p>
  </section>

  <section class="illusion-panel">
    <div class="illusion-top">
      <div>
        <strong id="illusion-name">Müller-Lyer</strong>
        <span id="round">Round 1 / 12</span>
      </div>
      <div class="illusion-status" id="status">Make your choice</div>
    </div>

    <div id="stage" class="illusion-stage" aria-label="Optical illusion test"></div>

    <p id="instruction" class="illusion-instruction">Which central shape or line looks larger?</p>

    <div id="choices" class="illusion-choices">
      <button class="btn btn-primary" id="left-choice" type="button">Left</button>
      <button class="btn btn-primary" id="right-choice" type="button">Right</button>
    </div>

    <div class="illusion-actions">
      <button class="btn btn-accent" id="reveal" type="button" disabled>Reveal the Illusion</button>
      <button class="btn btn-primary" id="next" type="button" hidden>Next Challenge →</button>
    </div>

    <div id="feedback" class="illusion-feedback" aria-live="polite"></div>
  </section>

  <section class="benchmark-dashboard" id="results" hidden>
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Your Session</h2>
        <p>How often your visual judgment followed the illusion shown.</p>
      </div>
    </div>
    <div class="illusion-results">
      <div><strong id="score">0 / 12</strong><span>illusion-consistent choices</span></div>
      <div><strong id="muller-result">0 / 4</strong><span>Müller-Lyer</span></div>
      <div><strong id="ponzo-result">0 / 4</strong><span>Ponzo</span></div>
      <div><strong id="ebbinghaus-result">0 / 4</strong><span>Ebbinghaus</span></div>
    </div>
    <p id="result-text"></p>
    <button class="btn btn-accent" id="restart" type="button">Try Another Session</button>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>What You Are Actually Doing</h2>
        <p>Judgment first, measurement second.</p>
      </div>
    </div>
    <p>Each challenge changes the surrounding visual context while keeping the central comparison controlled. You first answer what appears larger or longer. Only after your choice does the page remove the uncertainty and show the physical relationship.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Three Classic Illusions</h2>
        <p>Different patterns, different perceptual cues.</p>
      </div>
    </div>
    <p><strong>Müller-Lyer:</strong> arrow-like fins can change the apparent length of equal line segments. <strong>Ponzo:</strong> converging lines can make equal lines appear to have different lengths. <strong>Ebbinghaus:</strong> identical central circles can appear different in size depending on the surrounding circles.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-title-group">
        <h2>Not an Eyesight Test</h2>
        <p>A visual perception experiment for the browser.</p>
      </div>
    </div>
    <p>Your result describes your responses to these particular displays. It is not a measure of visual acuity, eye health, intelligence, or general perception ability. Screen size, zoom, viewing distance, and display conditions can change how the stimuli look.</p>
  </section>
</div>

<style>
.illusion-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}
.illusion-top{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;text-align:left}
.illusion-top>div:first-child{display:flex;flex-direction:column;gap:.2rem}
.illusion-top span{font-size:.82rem;color:var(--text-muted)}
.illusion-status{font-size:.85rem;font-weight:700;color:var(--text-secondary)}
.illusion-stage{height:340px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:var(--surface-muted);border-radius:var(--radius-md);color:#222}
.illusion-instruction{max-width:720px;margin:1rem auto;color:var(--text-secondary);line-height:1.55;font-weight:600}
.illusion-choices,.illusion-actions{display:flex;justify-content:center;gap:.7rem;flex-wrap:wrap}
.illusion-actions{margin-top:.7rem}
.illusion-feedback{min-height:2.4em;margin-top:1rem;font-weight:700;color:var(--text-secondary);line-height:1.5}
.illusion-results{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;margin:1rem 0}
.illusion-results>div{padding:1rem;border:1px solid var(--border-light);border-radius:var(--radius-md);text-align:center;background:var(--surface-muted)}
.illusion-results strong,.illusion-results span{display:block}
.illusion-results strong{font-size:1.35rem}
.illusion-results span{font-size:.78rem;color:var(--text-muted);margin-top:.25rem}
.mline{position:absolute;height:5px;background:#222;border-radius:4px}
.mline:before,.mline:after{content:"";position:absolute;width:24px;height:5px;background:#222;top:0}
.mline:before{left:0}.mline:after{right:0}
.mline.out:before{transform:rotate(35deg);transform-origin:left}.mline.out:after{transform:rotate(-35deg);transform-origin:right}
.mline.in:before{transform:rotate(-35deg);transform-origin:left}.mline.in:after{transform:rotate(35deg);transform-origin:right}
.pz-line{position:absolute;height:5px;background:#222;border-radius:4px}
.pz-track{position:absolute;width:4px;height:285px;background:#555;bottom:22px}
.pz-left{left:38%;transform:rotate(-22deg);transform-origin:bottom}
.pz-right{right:38%;transform:rotate(22deg);transform-origin:bottom}
.circle{position:absolute;border-radius:50%;background:#222}
.circle-group{position:absolute;display:flex;align-items:center;gap:22px}
.circle-group .surround{display:grid;grid-template-columns:repeat(4,24px);gap:7px}
.circle-group .surround span{width:24px;height:24px;border-radius:50%;background:#777}
.circle-group .center{width:42px;height:42px;border-radius:50%;background:#222}
.reveal-diff .mline,.reveal-diff .pz-line,.reveal-diff .circle{outline:3px solid #356ae6;outline-offset:5px}
@media(max-width:640px){
  .illusion-panel{padding:1rem}.illusion-stage{height:300px}
  .illusion-results{grid-template-columns:repeat(2,1fr)}
  .illusion-top{align-items:flex-start}
  .illusion-status{text-align:right}
}
</style>

<script>
(function(){
  var stage=document.getElementById('stage');
  var nameEl=document.getElementById('illusion-name');
  var roundEl=document.getElementById('round');
  var statusEl=document.getElementById('status');
  var instructionEl=document.getElementById('instruction');
  var feedbackEl=document.getElementById('feedback');
  var leftBtn=document.getElementById('left-choice');
  var rightBtn=document.getElementById('right-choice');
  var revealBtn=document.getElementById('reveal');
  var nextBtn=document.getElementById('next');
  var results=document.getElementById('results');
  var index=0, selected=null, answered=false;
  var counts={total:0,muller:0,ponzo:0,ebbinghaus:0};
  var trials=[];

  function shuffle(a){
    for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}
    return a;
  }

  function makeTrials(){
    var types=['muller','muller','muller','muller','ponzo','ponzo','ponzo','ponzo','ebbinghaus','ebbinghaus','ebbinghaus','ebbinghaus'];
    return shuffle(types).map(function(type){return {type:type, illusionSide:Math.random()<.5?'left':'right'}});
  }

  function renderMuller(t){
    var leftClass=t.illusionSide==='left'?'out':'in';
    var rightClass=t.illusionSide==='right'?'out':'in';
    stage.innerHTML='<div class="mline '+leftClass+'" style="width:210px;left:calc(50% - 250px);top:42%"></div>'+
                    '<div class="mline '+rightClass+'" style="width:210px;right:calc(50% - 250px);top:58%"></div>';
    instructionEl.textContent='Which line looks longer? The physical shafts are the same length.';
  }

  function renderPonzo(t){
    var illusionX=t.illusionSide==='left'?'calc(50% - 155px)':'calc(50% + 155px)';
    var otherX=t.illusionSide==='left'?'calc(50% + 155px)':'calc(50% - 155px)';
    stage.innerHTML='<div class="pz-track pz-left"></div><div class="pz-track pz-right"></div>'+
      '<div class="pz-line" style="width:170px;left:'+illusionX+';top:105px;transform:translateX(-50%)"></div>'+
      '<div class="pz-line" style="width:170px;left:'+otherX+';top:210px;transform:translateX(-50%)"></div>';
    instructionEl.textContent='Which line looks longer? The two black lines are physically the same length.';
  }

  function renderEbbinghaus(t){
    var left='<div class="circle-group" style="left:calc(50% - 285px)"><div class="surround">'+
      '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="center"></div></div>';
    var right='<div class="circle-group" style="right:calc(50% - 285px)"><div class="center"></div><div class="surround">'+
      '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>';
    if(t.illusionSide==='left'){
      stage.innerHTML=left+right;
    }else{
      stage.innerHTML=right+left;
    }
    instructionEl.textContent='Which central circle looks larger? The two central circles are physically identical.';
  }

  function render(){
    selected=null; answered=false;
    revealBtn.disabled=true; nextBtn.hidden=true;
    leftBtn.disabled=false; rightBtn.disabled=false;
    feedbackEl.textContent=''; statusEl.textContent='Make your choice';
    roundEl.textContent='Round '+(index+1)+' / '+trials.length;
    var t=trials[index];
    nameEl.textContent=t.type==='muller'?'Müller-Lyer':t.type==='ponzo'?'Ponzo':'Ebbinghaus';
    if(t.type==='muller')renderMuller(t);
    if(t.type==='ponzo')renderPonzo(t);
    if(t.type==='ebbinghaus')renderEbbinghaus(t);
  }

  function choose(side){
    if(answered)return;
    selected=side; answered=true;
    leftBtn.disabled=true; rightBtn.disabled=true;
    revealBtn.disabled=false; statusEl.textContent='Choice recorded';
  }

  function reveal(){
    if(!answered)return;
    var t=trials[index];
    var consistent=selected===t.illusionSide;
    counts.total++;
    if(consistent){
      counts[t.type]++;
      feedbackEl.textContent='The illusion pushed the appearance toward the '+t.illusionSide+' side. Your choice followed that visual impression.';
    }else{
      feedbackEl.textContent='You chose against the usual illusion direction in this display. The underlying physical relationship was then revealed.';
    }
    stage.classList.add('reveal-diff');
    revealBtn.disabled=true;
    if(index<trials.length-1)nextBtn.hidden=false;
    else finish();
  }

  function finish(){
    document.getElementById('score').textContent=counts.total+' / '+trials.length;
    document.getElementById('muller-result').textContent=counts.muller+' / 4';
    document.getElementById('ponzo-result').textContent=counts.ponzo+' / 4';
    document.getElementById('ebbinghaus-result').textContent=counts.ebbinghaus+' / 4';
    document.getElementById('result-text').textContent='This session records how often your choices followed the visual effect presented by each illusion. It is an experience of perceptual context, not a score for eyesight or ability.';
    results.hidden=false;
    results.scrollIntoView({behavior:'smooth',block:'start'});
  }

  leftBtn.onclick=function(){choose('left')};
  rightBtn.onclick=function(){choose('right')};
  revealBtn.onclick=reveal;
  nextBtn.onclick=function(){index++;stage.classList.remove('reveal-diff');render()};
  document.getElementById('restart').onclick=function(){
    index=0;counts={total:0,muller:0,ponzo:0,ebbinghaus:0};trials=makeTrials();results.hidden=true;stage.classList.remove('reveal-diff');render();
  };

  trials=makeTrials();
  render();
})();
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebPage",
  "name":"Optical Illusion Gallery — Wanjaaro",
  "url":"https://wanjaaro.com/optical-illusion-gallery",
  "description":"Interactive browser-based optical illusion tests using classic visual patterns."
}
</script>
