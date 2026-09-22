---
layout: default
title: "Pitch / Tone Matching Test — Wanjaaro"
description: "Free browser-based pitch matching test. Adjust a tone until it matches a reference tone and measure the frequency difference."
permalink: /pitch-tone-matching
category: perception
sidebar: true
sidebar_title: "Pitch / Tone Matching"
sidebar_subtitle: "Match a reference tone"
sidebar_icon: "🎵"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Perception</span>
    <h1>Pitch / Tone Matching Test</h1>
    <p>Listen to a reference tone, then adjust a second tone until it sounds as close as possible. Your score is based on the difference between the two frequencies.</p>
  </section>

  <section class="tone-panel">
    <div class="tone-stats"><div><span>Round</span><strong id="round">0 / 8</strong></div><div><span>Best Difference</span><strong id="best">--</strong></div><div><span>Last Difference</span><strong id="last">--</strong></div></div>
    <button class="btn btn-accent" id="start" type="button">Start Test</button>
    <div id="controls" hidden>
      <div class="tone-buttons"><button class="btn btn-primary" id="ref" type="button">Play Reference</button><button class="btn btn-primary" id="test" type="button">Play Your Tone</button></div>
      <label class="tone-slider">Adjust Pitch <input id="slider" type="range" min="200" max="800" value="500" step="1"><strong id="hz">500 Hz</strong></label>
      <button class="btn btn-accent" id="submit" type="button">Submit Match</button>
    </div>
    <p id="status">Use headphones or speakers at a comfortable volume.</p>
  </section>

  <section id="summary" class="test-summary-card" hidden>
    <span class="benchmark-badge playable">Session Complete</span><h2 id="result"></h2><p id="detail"></p>
    <div class="summary-actions"><button class="btn btn-primary" id="again" type="button">Run Again</button></div>
  </section>

  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>How Matching Works</h2><p>Frequency is used as the measurable target.</p></div></div><p>Each round generates a reference frequency. You adjust the second tone with the slider and submit your closest match. The result records the absolute difference in hertz.</p></section>
  <section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>Listening Conditions Matter</h2><p>Keep your audio setup consistent.</p></div></div><p>Headphones, speakers, volume, background noise, and hearing differences can affect how easy a frequency is to distinguish. This is an interactive listening challenge, not a hearing assessment.</p></section>
</div>

<style>
.tone-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-md);text-align:center}.tone-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-bottom:1.25rem}.tone-stats>div{padding:.8rem;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}.tone-stats span{display:block;font-size:.7rem;text-transform:uppercase;color:var(--text-muted);font-weight:800}.tone-stats strong{font-family:var(--font-mono)}.tone-buttons{display:flex;justify-content:center;gap:.7rem;margin:1.2rem 0}.tone-slider{display:flex;flex-direction:column;gap:.7rem;max-width:520px;margin:1.3rem auto;font-weight:700}.tone-slider input{width:100%}.tone-slider strong{font-family:var(--font-mono)}#status{color:var(--text-secondary);min-height:1.5em}@media(max-width:640px){.tone-buttons{flex-direction:column}.tone-stats{gap:.4rem}}
</style>

<script>
(function(){
  var audio=null,reference=0,round=0,total=0,best=Infinity,active=false;
  var roundEl=document.getElementById('round'),bestEl=document.getElementById('best'),lastEl=document.getElementById('last'),start=document.getElementById('start'),controls=document.getElementById('controls'),slider=document.getElementById('slider'),hz=document.getElementById('hz'),status=document.getElementById('status'),summary=document.getElementById('summary');
  function play(freq){audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();var o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.08,audio.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.55);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.58)}
  function next(){round++;if(round>8){finish();return}reference=Math.round(250+Math.random()*450);slider.value=Math.round(reference+(Math.random()>.5?1:-1)*Math.min(120,Math.max(25,reference*.15)));hz.textContent=slider.value+' Hz';roundEl.textContent=round+' / 8';status.textContent='Play the reference, adjust the slider, then submit your match.'}
  function begin(){round=0;total=0;best=Infinity;active=true;summary.hidden=true;start.hidden=true;controls.hidden=false;next()}
  function finish(){active=false;controls.hidden=true;start.hidden=false;start.textContent='Try Again';summary.hidden=false;document.getElementById('result').textContent='Average difference: '+(total/8).toFixed(1)+' Hz';document.getElementById('detail').textContent='Smaller differences mean your selected tone was closer to the reference frequency.'}
  document.getElementById('ref').onclick=function(){play(reference)};document.getElementById('test').onclick=function(){play(Number(slider.value))};slider.oninput=function(){hz.textContent=this.value+' Hz'};
  document.getElementById('submit').onclick=function(){if(!active)return;var d=Math.abs(Number(slider.value)-reference);total+=d;best=Math.min(best,d);lastEl.textContent=d+' Hz';bestEl.textContent=best+' Hz';next()};
  start.onclick=begin;document.getElementById('again').onclick=begin;
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"Pitch / Tone Matching Test — Wanjaaro","url":"https://wanjaaro.com/pitch-tone-matching","applicationCategory":"EducationalApplication","operatingSystem":"Any"}
</script>
