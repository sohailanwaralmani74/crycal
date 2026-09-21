---
layout: default
title: "Click Accuracy Test — Wanjaaro"
description: "Test how accurately you can click the center of visual targets. Measure center-hit precision across a short browser session."
permalink: /click-accuracy
category: aim
sidebar: true
sidebar_title: "Click Accuracy"
sidebar_subtitle: "Center-hit precision test"
sidebar_icon: "🎯"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Aim Test</span>
    <h1>Click Accuracy Test</h1>
    <p>Click as close to the center of each target as you can. This test focuses on placement accuracy rather than how quickly you can move between targets.</p>
  </section>

  <section class="benchmark-content-block">
    <h2>Hit the Center</h2>
    <p>Each round places a target inside the test area. Click once on every target. The closer your pointer lands to the target center, the higher your accuracy score for that click.</p>
  </section>

  <div class="test-arena-wrapper">
    <div id="accuracy-arena" class="test-arena" tabindex="0" role="button" aria-label="Click accuracy test">
      <div id="accuracy-target" style="display:none;position:absolute;width:54px;height:54px;border-radius:50%;background:#d94b4b;border:7px solid #f5c2c2;box-sizing:border-box;cursor:crosshair;"></div>
      <div id="accuracy-message" class="test-arena-icon">🎯</div>
      <h2 id="accuracy-title">Ready?</h2>
      <p id="accuracy-subtitle">Click to begin.</p>
    </div>
  </div>

  <div class="test-stats-bar" aria-label="Click accuracy results">
    <div class="test-stat-item"><div class="test-stat-label">Targets</div><div class="test-stat-val" id="accuracy-count">0 / 20</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Average</div><div class="test-stat-val" id="accuracy-score">--</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Last Hit</div><div class="test-stat-val" id="accuracy-last">--</div></div>
    <div class="test-stat-item"><div class="test-stat-label">PB</div><div class="test-stat-val" id="accuracy-pb">--</div></div>
  </div>

  <div id="accuracy-summary" class="test-summary-card" style="display:none;" aria-live="polite">
    <span class="benchmark-badge playable">Session Complete</span>
    <h2 id="accuracy-result">--</h2>
    <p class="test-summary-rating">Your score is the average percentage of each click's distance from the target center.</p>
    <div class="summary-actions">
      <button id="accuracy-restart" class="btn btn-primary" type="button">Run Again</button>
      <button id="accuracy-copy" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>What This Test Measures</h2><p>Placement control with a mouse or pointer.</p></div></div>
    <p>A high result means your clicks tended to land near the center of the targets. Target size, pointer sensitivity, display scaling, and hand control can all affect the result.</p>
  </section>

  <section class="benchmark-dashboard">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2>Read the Score</h2><p>Accuracy is based on distance, not speed.</p></div></div>
    <p>The percentage is calculated separately for every target and then averaged. A miss outside the target receives no center-distance bonus.</p>
  </section>
</div>

<script>
(function() {
  var arena=document.getElementById('accuracy-arena'), target=document.getElementById('accuracy-target');
  var msg=document.getElementById('accuracy-message'), title=document.getElementById('accuracy-title'), sub=document.getElementById('accuracy-subtitle');
  var count=document.getElementById('accuracy-count'), score=document.getElementById('accuracy-score'), last=document.getElementById('accuracy-last'), pb=document.getElementById('accuracy-pb'), summary=document.getElementById('accuracy-summary'), result=document.getElementById('accuracy-result');
  var rounds=20, n=0, total=0, best=localStorage.getItem('wanjaaro_pb_click_accuracy'), active=false, targetX=0, targetY=0, targetR=27;
  if(best) pb.textContent=best+'%';

  function place() {
    var w=arena.clientWidth, h=arena.clientHeight;
    targetX=36+Math.random()*(w-72); targetY=36+Math.random()*(h-72);
    target.style.left=(targetX-targetR)+'px'; target.style.top=(targetY-targetR)+'px'; target.style.display='block';
    count.textContent=n+' / '+rounds;
  }
  function start() {
    n=0; total=0; active=true; summary.style.display='none'; msg.style.display='none'; title.style.display='none'; sub.style.display='none';
    place();
  }
  function finish() {
    active=false; target.style.display='none'; var avg=Math.round(total/rounds);
    result.textContent=avg+'% average center accuracy'; score.textContent=avg+'%'; summary.style.display='block';
    if(!best || avg>parseInt(best,10)){ localStorage.setItem('wanjaaro_pb_click_accuracy',avg); pb.textContent=avg+'% (New PB!)'; best=String(avg); }
    summary.scrollIntoView({behavior:'smooth'});
  }
  arena.addEventListener('click',function(e){
    if(!active){start();return;}
    var r=arena.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, d=Math.hypot(x-targetX,y-targetY);
    var pct=Math.max(0,Math.round((1-Math.min(d,90)/90)*100)); total+=pct; n++; last.textContent=pct+'%'; score.textContent=Math.round(total/n)+'%';
    if(n>=rounds) finish(); else place();
  });
  document.getElementById('accuracy-restart').onclick=start;
  document.getElementById('accuracy-copy').onclick=function(){navigator.clipboard&&navigator.clipboard.writeText('🎯 Wanjaaro Click Accuracy: '+Math.round(total/rounds)+'%\nhttps://wanjaaro.com/click-accuracy');};
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebPage","@id":"https://wanjaaro.com/click-accuracy#webpage","url":"https://wanjaaro.com/click-accuracy","name":"Click Accuracy Test — Wanjaaro","description":"Test how accurately you can click the center of visual targets."},
{"@type":"WebApplication","@id":"https://wanjaaro.com/click-accuracy#application","name":"Wanjaaro Click Accuracy Test","url":"https://wanjaaro.com/click-accuracy","applicationCategory":"EducationalApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled"},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},{"@type":"ListItem","position":2,"name":"Aim & Precision Tests","item":"https://wanjaaro.com/aim"},{"@type":"ListItem","position":3,"name":"Click Accuracy","item":"https://wanjaaro.com/click-accuracy"}]}
]}
</script>
