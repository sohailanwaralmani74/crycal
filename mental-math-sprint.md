---
layout: default
title: "Mental Math Sprint — Wanjaaro"
description: "A timed mental arithmetic game with addition, subtraction, and multiplication questions."
permalink: /mental-math-sprint
category: cognitive
sidebar: true
sidebar_title: "Mental Math Sprint"
sidebar_subtitle: "60-second arithmetic challenge"
sidebar_icon: "➕"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Cognitive Game</span>
    <h1>Mental Math Sprint</h1>
    <p>Solve as many short arithmetic problems as you can in 60 seconds. Type your answer and press Enter to move immediately to the next problem.</p>
  </div>

  <div class="tool-panel" style="max-width:680px;margin:0 auto;">
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="math-time">60</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Correct</div><div class="test-stat-val" id="math-correct">0</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Accuracy</div><div class="test-stat-val" id="math-accuracy">—</div></div>
    </div>
    <div id="math-game" style="text-align:center;padding:28px 18px;">
      <div id="math-question" style="font-size:clamp(2.2rem,7vw,4rem);font-weight:800;min-height:80px;">Ready?</div>
      <input id="math-answer" type="number" inputmode="numeric" autocomplete="off" aria-label="Your answer" placeholder="Answer"
        style="display:block;width:min(280px,100%);margin:18px auto;padding:14px 16px;font-size:1.35rem;text-align:center;border-radius:10px;border:1px solid var(--border-color);background:var(--surface-color);color:var(--text-color);">
      <button id="math-start" class="btn btn-primary">Start 60-Second Sprint</button>
      <div id="math-feedback" style="min-height:28px;margin-top:14px;"></div>
    </div>
    <div id="math-summary" class="test-summary-card" style="display:none;">
      <span class="benchmark-badge playable">Finished</span>
      <h2 id="math-score">0 correct</h2>
      <p id="math-summary-text"></p>
      <button id="math-restart" class="btn btn-primary">Play Again</button>
    </div>
  </div>

  <div class="benchmark-info-section">
    <h3>How It Works</h3>
    <p>You get a stream of short addition, subtraction, and multiplication problems. Correct answers advance immediately; unanswered time is the main limit. Your result is the number of correct answers and your accuracy for that run.</p>
    <h3>Keep Runs Comparable</h3>
    <p>Use the same keyboard and normal browser conditions when comparing your own runs. This is a quick game, not a standardized cognitive assessment.</p>
  </div>
</div>

<script>
(function(){
  var timeEl=document.getElementById('math-time'), correctEl=document.getElementById('math-correct'), accEl=document.getElementById('math-accuracy');
  var qEl=document.getElementById('math-question'), input=document.getElementById('math-answer'), start=document.getElementById('math-start');
  var feedback=document.getElementById('math-feedback'), summary=document.getElementById('math-summary'), score=document.getElementById('math-score'), summaryText=document.getElementById('math-summary-text'), restart=document.getElementById('math-restart');
  var active=false, endAt=0, timer=0, correct=0, attempted=0, answer=0;
  function question(){
    var op=Math.floor(Math.random()*3), a,b;
    if(op===0){a=10+Math.floor(Math.random()*90);b=1+Math.floor(Math.random()*90);answer=a+b;qEl.textContent=a+' + '+b;}
    else if(op===1){a=20+Math.floor(Math.random()*80);b=1+Math.floor(Math.random()*a);answer=a-b;qEl.textContent=a+' − '+b;}
    else {a=2+Math.floor(Math.random()*13);b=2+Math.floor(Math.random()*13);answer=a*b;qEl.textContent=a+' × '+b;}
    input.value=''; input.focus();
  }
  function finish(){
    active=false; clearInterval(timer); timeEl.textContent='0'; input.disabled=true; start.style.display='none';
    var accuracy=attempted?Math.round(correct/attempted*100):0;
    score.textContent=correct+' correct';
    summaryText.textContent='You answered '+attempted+' questions with '+accuracy+'% accuracy.';
    summary.style.display='block';
    var old=parseInt(localStorage.getItem('wanjaaro_pb_math_sprint')||'0',10);
    if(correct>old)localStorage.setItem('wanjaaro_pb_math_sprint',String(correct));
  }
  function submit(){
    if(!active||input.value==='')return;
    attempted++;
    if(Number(input.value)===answer){correct++;feedback.textContent='Correct';}
    else feedback.textContent='Next';
    correctEl.textContent=correct; accEl.textContent=Math.round(correct/attempted*100)+'%'; question();
  }
  function begin(){
    clearInterval(timer); active=true; correct=0;attempted=0;timeEl.textContent='60';correctEl.textContent='0';accEl.textContent='—';feedback.textContent='';
    summary.style.display='none';start.style.display='none';input.disabled=false;endAt=performance.now()+60000;question();
    timer=setInterval(function(){var left=Math.max(0,Math.ceil((endAt-performance.now())/1000));timeEl.textContent=left;if(left<=0)finish();},100);
  }
  input.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
  start.addEventListener('click',begin); restart.addEventListener('click',begin);
})();
</script>
