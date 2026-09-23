---
layout: default
title: "Dual-Task Challenge — Wanjaaro"
description: "A browser game that combines moving-target tracking with quick arithmetic responses."
permalink: /dual-task
category: cognitive
sidebar: true
sidebar_title: "Dual-Task Challenge"
sidebar_subtitle: "Track and calculate at once"
sidebar_icon: "🔀"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Cognitive Game</span>
    <h1>Dual-Task Challenge</h1>
    <p>Keep your pointer on the moving target while solving quick arithmetic questions. Two tasks run at the same time.</p>
  </div>

  <div class="tool-panel" style="max-width:760px;margin:0 auto;">
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="dual-time">30</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Tracking</div><div class="test-stat-val" id="dual-track">0%</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Math</div><div class="test-stat-val" id="dual-math">0 / 0</div></div>
    </div>
    <div id="dual-arena" style="position:relative;height:330px;max-width:650px;margin:20px auto;border:1px solid var(--border-color);border-radius:14px;background:var(--surface-alt-color,#151a24);overflow:hidden;cursor:crosshair;">
      <div id="dual-target" style="position:absolute;width:44px;height:44px;border-radius:50%;background:#59d8d2;transform:translate(-50%,-50%);"></div>
      <div style="position:absolute;top:12px;left:12px;opacity:.75;font-size:.9rem;">Keep the pointer on the circle</div>
    </div>
    <div style="text-align:center;padding:8px 12px 24px;">
      <div id="dual-question" style="font-size:1.8rem;font-weight:800;min-height:44px;">Ready?</div>
      <input id="dual-answer" type="number" inputmode="numeric" placeholder="Answer" aria-label="Math answer"
        style="width:160px;padding:11px;text-align:center;font-size:1.1rem;border-radius:9px;border:1px solid var(--border-color);background:var(--surface-color);color:var(--text-color);">
      <button id="dual-start" class="btn btn-primary">Start Challenge</button>
      <div id="dual-feedback" style="min-height:25px;margin-top:10px;"></div>
    </div>
    <div id="dual-summary" class="test-summary-card" style="display:none;">
      <span class="benchmark-badge playable">Finished</span>
      <h2 id="dual-score">—</h2>
      <p id="dual-summary-text"></p>
      <button id="dual-restart" class="btn btn-primary">Play Again</button>
    </div>
  </div>

  <div class="benchmark-info-section">
    <h3>Two Tasks at Once</h3>
    <p>The target moves continuously while arithmetic prompts appear during the same 30-second run. Tracking is based on how much of the active game time the pointer stays inside the target.</p>
    <p>Your score is a game result, not a clinical measurement of attention or multitasking ability.</p>
  </div>
</div>

<script>
(function(){
  var arena=document.getElementById('dual-arena'),target=document.getElementById('dual-target'),q=document.getElementById('dual-question'),input=document.getElementById('dual-answer');
  var start=document.getElementById('dual-start'),restart=document.getElementById('dual-restart'),timeEl=document.getElementById('dual-time'),trackEl=document.getElementById('dual-track'),mathEl=document.getElementById('dual-math'),feedback=document.getElementById('dual-feedback'),summary=document.getElementById('dual-summary'),score=document.getElementById('dual-score'),sumText=document.getElementById('dual-summary-text');
  var active=false,endAt=0,raf=0,timer=0,last=0,insideMs=0,totalMs=0,correct=0,attempted=0,answer=0,x=80,y=100,vx=145,vy=110;
  function newQuestion(){var a=2+Math.floor(Math.random()*12),b=2+Math.floor(Math.random()*12);answer=a*b;q.textContent=a+' × '+b;input.value='';}
  function inside(){var r=arena.getBoundingClientRect(),t=target.getBoundingClientRect(),cx=t.left+t.width/2,cy=t.top+t.height/2;var dx=(lastX-cx),dy=(lastY-cy);return Math.sqrt(dx*dx+dy*dy)<30;}
  var lastX=0,lastY=0;
  arena.addEventListener('mousemove',function(e){var r=arena.getBoundingClientRect();lastX=e.clientX;lastY=e.clientY;});
  function animate(now){
    if(!active)return;
    var dt=Math.min(40,now-last);last=now;
    x+=vx*dt/1000;y+=vy*dt/1000;
    if(x<30||x>arena.clientWidth-30){vx*=-1;x=Math.max(30,Math.min(arena.clientWidth-30,x));}
    if(y<45||y>arena.clientHeight-30){vy*=-1;y=Math.max(45,Math.min(arena.clientHeight-30,y));}
    target.style.left=x+'px';target.style.top=y+'px';
    totalMs+=dt;if(inside())insideMs+=dt;
    trackEl.textContent=Math.round(insideMs/Math.max(1,totalMs)*100)+'%';
    raf=requestAnimationFrame(animate);
  }
  function finish(){
    active=false;cancelAnimationFrame(raf);clearInterval(timer);input.disabled=true;start.style.display='none';timeEl.textContent='0';
    var tracking=Math.round(insideMs/Math.max(1,totalMs)*100);score.textContent=tracking+'% tracking';
    sumText.textContent='Math: '+correct+' correct out of '+attempted+'. Tracking: '+tracking+'% of active time.';
    summary.style.display='block';
  }
  function submit(){if(!active||input.value==='')return;attempted++;if(Number(input.value)===answer){correct++;feedback.textContent='Correct';}else feedback.textContent='Next';mathEl.textContent=correct+' / '+attempted;newQuestion();}
  function begin(){
    active=true;summary.style.display='none';start.style.display='none';input.disabled=false;correct=0;attempted=0;insideMs=0;totalMs=0;timeEl.textContent='30';trackEl.textContent='0%';mathEl.textContent='0 / 0';feedback.textContent='';x=80;y=100;vx=145;vy=110;newQuestion();endAt=performance.now()+30000;last=performance.now();raf=requestAnimationFrame(animate);
    timer=setInterval(function(){var left=Math.max(0,Math.ceil((endAt-performance.now())/1000));timeEl.textContent=left;if(left<=0)finish();},100);
    input.focus();
  }
  input.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
  start.addEventListener('click',begin);restart.addEventListener('click',begin);
})();
</script>
