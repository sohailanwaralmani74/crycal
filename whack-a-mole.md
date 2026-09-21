---
layout: default
title: "Whack-a-Mole Speed Test — Wanjaaro"
description: "A browser-based target response challenge. Hit appearing moles across a grid during a timed round and see how many targets you can clear."
permalink: /whack-a-mole
category: reflex
sidebar: true
sidebar_title: "Whack-a-Mole"
sidebar_subtitle: "Timed target response challenge"
sidebar_icon: "🔨"
---

<div class="benchmark-container">
  <section class="benchmark-hero">
    <span class="benchmark-badge playable">Reflex Test</span>
    <h1>Whack-a-Mole Speed Test</h1>
    <p>
      Targets appear in different positions across the board. Move your pointer to the next
      target and hit it before another one takes its place. This makes the challenge about
      reacting, aiming, and relocating the pointer repeatedly.
    </p>
  </section>

  <section class="benchmark-content-block" aria-labelledby="mole-rules">
    <h2 id="mole-rules">Clear the Board</h2>
    <p>
      Start a 30-second round. One mole is active at a time. Every successful hit moves the
      target to another cell, so the next click requires a fresh visual search and pointer
      movement.
    </p>
    <p>
      Only the active mole counts. Clicking an empty cell does not add to your total, which
      keeps the result focused on targets actually reached.
    </p>
  </section>

  <div style="max-width:430px;margin:0 auto 8px;display:flex;justify-content:flex-end;">
    <button id="mole-start" class="btn btn-primary" type="button">Start 30-Second Round</button>
  </div>

  <div class="test-arena-wrapper" style="margin-top:0;">
    <div id="mole-board" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:430px;margin:0 auto;padding:8px;"></div>
  </div>

  <div class="test-stats-bar" aria-label="Whack-a-mole results">
    <div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="mole-time">30 s</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Hits</div><div class="test-stat-val" id="mole-hits">0</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Misses</div><div class="test-stat-val" id="mole-misses">0</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Best Hits</div><div class="test-stat-val" id="mole-pb">--</div></div>
  </div>

  <div id="mole-summary" class="test-summary-card" style="display:none;" aria-live="polite">
    <span class="benchmark-badge playable">Round Complete</span>
    <h2 id="mole-score">--</h2>
    <p class="test-summary-rating">Your score is the number of active targets you successfully hit during the round.</p>
    <div class="summary-actions">
      <button id="mole-again" class="btn btn-primary" type="button">Play Again</button>
      <button id="mole-copy" class="btn btn-accent" type="button">Copy Result 📋</button>
    </div>
  </div>

  <section class="benchmark-dashboard" aria-labelledby="mole-difference">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="mole-difference">Why This Is Different From a Click Test</h2><p>The target changes after every successful hit.</p></div></div>
    <p>
      A simple repeated-click task can keep the pointer in one place. Here, each successful
      hit requires another visual search and movement. Your total therefore reflects a mixture
      of target detection, hand movement, aiming, and response timing.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="mole-score-reading">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="mole-score-reading">What the Hit Count Tells You</h2><p>More hits means more targets were reached during the fixed window.</p></div></div>
    <p>
      The result is a session score, not a universal reaction-time measurement. Screen size,
      pointer device, familiarity with the board, and target positions can all influence how
      quickly you can clear successive targets.
    </p>
  </section>

  <section class="benchmark-dashboard" aria-labelledby="mole-browser">
    <div class="dashboard-header"><div class="dashboard-title-group"><h2 id="mole-browser">Runs Without an Account</h2><p>The game logic stays in the page.</p></div><span class="benchmark-badge playable">Free to Use</span></div>
    <p>
      Target selection, timing, scoring, and the personal best are handled locally with
      JavaScript and browser storage. Nothing needs to be uploaded to play.
    </p>
  </section>
</div>

<script>
(function() {
  var board=document.getElementById('mole-board'), start=document.getElementById('mole-start');
  var timeEl=document.getElementById('mole-time'), hitsEl=document.getElementById('mole-hits');
  var missesEl=document.getElementById('mole-misses'), pbEl=document.getElementById('mole-pb');
  var summary=document.getElementById('mole-summary'), score=document.getElementById('mole-score');
  var again=document.getElementById('mole-again'), copy=document.getElementById('mole-copy');
  var cells=[], active=-1, hits=0, misses=0, running=false, timer=null, end=0;
  var pbKey='wanjaaro_pb_whack_a_mole';
  var pb=localStorage.getItem(pbKey); if(pb) pbEl.textContent=pb;

  for(var i=0;i<25;i++){
    var cell=document.createElement('button');
    cell.type='button'; cell.setAttribute('aria-label','Mole grid cell');
    cell.style.cssText='aspect-ratio:1;border:1px solid var(--border-color,#ddd);border-radius:8px;background:var(--card-bg,#f7f7f7);font-size:clamp(18px,3vw,28px);cursor:pointer;';
    cell.dataset.index=i; board.appendChild(cell); cells.push(cell);
    cell.addEventListener('click',function(){
      if(!running) return;
      if(parseInt(this.dataset.index,10)===active){ hits++; hitsEl.textContent=hits; choose(); }
      else { misses++; missesEl.textContent=misses; }
    });
  }
  function choose(){
    cells.forEach(function(c){c.textContent=''; c.removeAttribute('data-active');});
    active=Math.floor(Math.random()*25);
    cells[active].textContent='🔨';
    cells[active].setAttribute('data-active','true');
  }
  function update(){
    var left=Math.max(0,Math.ceil((end-performance.now())/1000));
    timeEl.textContent=left+' s';
    if(left<=0) finish(); else timer=setTimeout(update,100);
  }
  function run(){
    clearTimeout(timer); hits=0; misses=0; running=true; summary.style.display='none';
    hitsEl.textContent='0'; missesEl.textContent='0'; timeEl.textContent='30 s'; choose();
    end=performance.now()+30000; update();
  }
  function finish(){
    if(!running)return; running=false; clearTimeout(timer);
    cells.forEach(function(c){c.textContent='';});
    score.textContent=hits+' hits';
    if(!pb || hits>parseInt(pb,10)){localStorage.setItem(pbKey,hits);pbEl.textContent=hits+' (New PB!)';pb=hits;}
    summary.style.display='block'; summary.scrollIntoView({behavior:'smooth'});
  }
  start.addEventListener('click',run); again.addEventListener('click',run);
  copy.addEventListener('click',function(){
    var t='🔨 Wanjaaro Whack-a-Mole: '+hits+' hits in 30 seconds\nTest: https://wanjaaro.com/whack-a-mole';
    if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){copy.textContent='Copied to Clipboard! ✓';setTimeout(function(){copy.textContent='Copy Result 📋';},2000);});
  });
})();
</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebPage","@id":"https://wanjaaro.com/whack-a-mole#webpage","url":"https://wanjaaro.com/whack-a-mole","name":"Whack-a-Mole Speed Test — Wanjaaro","description":"A browser-based target response challenge.","isPartOf":{"@id":"https://wanjaaro.com/#website"}},
{"@type":"WebApplication","@id":"https://wanjaaro.com/whack-a-mole#application","name":"Wanjaaro Whack-a-Mole Speed Test","url":"https://wanjaaro.com/whack-a-mole","applicationCategory":"GameApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled"},
{"@type":"BreadcrumbList","@id":"https://wanjaaro.com/whack-a-mole#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},{"@type":"ListItem","position":2,"name":"Reflex & Reaction Tests","item":"https://wanjaaro.com/reflex"},{"@type":"ListItem","position":3,"name":"Whack-a-Mole Speed Test","item":"https://wanjaaro.com/whack-a-mole"}]}]}
</script>
