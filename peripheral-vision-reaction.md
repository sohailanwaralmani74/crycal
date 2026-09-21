---
layout: default
title: "Peripheral Vision Reaction Test — Wanjaaro"
description: "A browser-based peripheral reaction challenge. Keep your gaze near the center and respond when a visual target appears away from your central focus."
permalink: /peripheral-vision-reaction
category: reflex
sidebar: true
sidebar_title: "Peripheral Vision Reaction"
sidebar_subtitle: "Off-center visual response"
sidebar_icon: "👁️"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Reflex Test</span>
    <h1>Peripheral Vision Reaction Test</h1>
    <p>
      Keep your gaze near the center of the screen while watching for a target in the outer
      area. The challenge changes where you need to notice the signal instead of placing it
      directly in your main point of focus.
    </p>
  </section>

  <section class="benchmark-content-block" aria-labelledby="pvrules">
    <h2 id="pvrules">Keep Your Eyes Near the Center</h2>
    <p>
      Place your gaze on the central marker and begin. During each round, a small target will
      appear at one of several positions around it. Respond when you notice the target by
      clicking the center marker or pressing Space.
    </p>
    <p>
      Try not to chase the target with your eyes before responding. The purpose of the
      arrangement is to make the signal available outside your central fixation point.
    </p>
  </section>

  <div class="test-arena-wrapper">
    <div id="pv-arena" style="position:relative;max-width:700px;height:420px;margin:auto;border-radius:16px;background:#18242a;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;" tabindex="0">
      <div style="width:46px;height:46px;border-radius:50%;background:#f0f0f0;color:#18242a;display:flex;align-items:center;justify-content:center;font-weight:700;">+</div>
      <div id="pv-target" style="position:absolute;width:30px;height:30px;border-radius:50%;background:#ffcc33;display:none;box-shadow:0 0 0 8px rgba(255,204,51,.18);"></div>
      <div id="pv-message" style="position:absolute;bottom:18px;left:0;right:0;text-align:center;color:#fff;">Click or press Space to begin.</div>
    </div>
  </div>

  <div class="test-stats-bar" aria-label="Peripheral reaction results">
    <div class="test-stat-item"><div class="test-stat-label">Round</div><div class="test-stat-val" id="pv-round">0 / 8</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Latest</div><div class="test-stat-val" id="pv-latest">-- ms</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Average</div><div class="test-stat-val" id="pv-average">-- ms</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Best</div><div class="test-stat-val" id="pv-pb">-- ms</div></div>
  </div>

  <div id="pv-summary" class="test-summary-card" style="display:none;" aria-live="polite">
    <span class="benchmark-badge playable">Eight Rounds Complete</span>
    <h2 id="pv-score">--</h2>
    <p class="test-summary-rating">This average represents the completed off-center visual responses in this session.</p>
    <div class="summary-actions">
      <button id="pv-again" class="btn btn-primary" type="button">Try Again</button>
      <button id="pv-copy" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <section class="benchmark-dashboard" aria-labelledby="pv-focus">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="pv-focus">Why the Center Marker Matters</h2><p>The target is intentionally separated from your main viewing point.</p></div></div>
    <p>
      Looking directly at the target changes the task. Keeping a central fixation point gives
      the test a consistent starting arrangement while the signal arrives elsewhere in the
      visual field.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="pv-reading">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="pv-reading">Use the Average for Comparison</h2><p>One session contains eight off-center responses.</p></div></div>
    <p>
      A lower average means the recorded responses were shorter in that session. Screen size,
      viewing distance, attention, target position, and whether you move your eyes toward the
      target can affect the result, so repeated sessions are best compared under similar
      conditions.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="pv-browser">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="pv-browser">A Browser-Based Visual Challenge</h2><p>No camera or account is required.</p></div><span class="benchmark-badge playable">Free to Use</span></div>
    <p>
      The test uses a fixed central reference and randomly selected off-center positions.
      Timing, rounds, scoring, and the personal best are handled in the browser.
    </p>
  </section>
</div>

<script>
(function(){
  var arena=document.getElementById('pv-arena'), target=document.getElementById('pv-target'), msg=document.getElementById('pv-message');
  var roundEl=document.getElementById('pv-round'), latestEl=document.getElementById('pv-latest'), avgEl=document.getElementById('pv-average'), pbEl=document.getElementById('pv-pb');
  var summary=document.getElementById('pv-summary'), score=document.getElementById('pv-score'), again=document.getElementById('pv-again'), copy=document.getElementById('pv-copy');
  var round=0, max=8, scores=[], state='idle', timer=null, start=0, positions=[
    [16,20],[50,12],[84,20],[10,50],[90,50],[16,80],[50,88],[84,80]
  ];
  var key='wanjaaro_pb_peripheral_reaction', pb=localStorage.getItem(key); if(pb)pbEl.textContent=pb;

  function begin(){ round=0;scores=[];summary.style.display='none';roundEl.textContent='0 / '+max;latestEl.textContent='-- ms';avgEl.textContent='-- ms';state='waiting';msg.textContent='Keep looking near the center...';schedule(); }
  function schedule(){
    clearTimeout(timer);target.style.display='none';state='waiting';msg.textContent='Wait for the off-center signal.';
    timer=setTimeout(function(){
      var p=positions[Math.floor(Math.random()*positions.length)];
      target.style.left='calc('+p[0]+'% - 15px)';target.style.top='calc('+p[1]+'% - 15px)';
      target.style.display='block';state='ready';start=performance.now();msg.textContent='Respond when you notice it.';
    },1000+Math.random()*2200);
  }
  function respond(){
    if(state==='idle'||state==='finished'){begin();return;}
    if(state==='waiting'){return;}
    if(state!=='ready')return;
    var value=Math.round(performance.now()-start);scores.push(value);round++;
    latestEl.textContent=value+' ms';roundEl.textContent=round+' / '+max;
    var avg=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);avgEl.textContent=avg+' ms';
    target.style.display='none';
    if(round>=max){finish(avg);}else{state='between';msg.textContent='Good. Return your attention to the center.';setTimeout(schedule,650);}
  }
  function finish(avg){
    state='finished';msg.textContent='Eight rounds complete.';score.textContent=avg+' ms average';
    var old=localStorage.getItem(key);
    if(!old||avg<parseInt(old,10)){localStorage.setItem(key,avg);pbEl.textContent=avg+' ms (New PB!)';}
    summary.style.display='block';summary.scrollIntoView({behavior:'smooth'});
  }
  arena.addEventListener('click',function(e){e.preventDefault();respond();});
  arena.addEventListener('keydown',function(e){if(e.code==='Space'||e.key===' '){e.preventDefault();respond();}});
  again.addEventListener('click',begin);
  copy.addEventListener('click',function(){var t='👁️ Wanjaaro Peripheral Vision Reaction: '+avgEl.textContent+' average\nTest: https://wanjaaro.com/peripheral-vision-reaction';if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){copy.textContent='Copied to Clipboard! ✓';setTimeout(function(){copy.textContent='Copy Result 📋';},2000);});});
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebPage","@id":"https://wanjaaro.com/peripheral-vision-reaction#webpage","url":"https://wanjaaro.com/peripheral-vision-reaction","name":"Peripheral Vision Reaction Test — Wanjaaro","description":"A browser-based peripheral reaction challenge.","isPartOf":{"@id":"https://wanjaaro.com/#website"}},
{"@type":"WebApplication","@id":"https://wanjaaro.com/peripheral-vision-reaction#application","name":"Wanjaaro Peripheral Vision Reaction Test","url":"https://wanjaaro.com/peripheral-vision-reaction","applicationCategory":"EducationalApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled"},
{"@type":"BreadcrumbList","@id":"https://wanjaaro.com/peripheral-vision-reaction#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},{"@type":"ListItem","position":2,"name":"Reflex & Reaction Tests","item":"https://wanjaaro.com/reflex"},{"@type":"ListItem","position":3,"name":"Peripheral Vision Reaction","item":"https://wanjaaro.com/peripheral-vision-reaction"}]}]}
</script>
