---
layout: default
title: "Rhythm Tap — Wanjaaro"
description: "Tap along with a steady browser metronome and see how closely your taps match the beat."
permalink: /rhythm-tap
category: timing
sidebar: true
sidebar_title: "Rhythm Tap"
sidebar_subtitle: "Match the beat"
sidebar_icon: "🥁"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Timing Benchmark</span>
    <h1>Rhythm Tap</h1>
    <p>Follow the beat and tap when you hear each click. Your result is based on how far your taps land from the expected beat.</p>
  </div>

  <div class="benchmark-card" style="text-align:center;">
    <div id="rhythm-status" class="benchmark-card-desc">Press Start, then tap Space or the button with the beat.</div>
    <div id="rhythm-beat" style="font-size:3rem;font-weight:800;margin:1.5rem 0;">—</div>
    <button id="rhythm-start" class="btn btn-primary">Start Test</button>
    <button id="rhythm-tap" class="btn btn-accent" style="display:none;min-width:180px;">TAP</button>
  </div>

  <div class="test-stats-bar" style="max-width:650px;">
    <div class="test-stat-item"><div class="test-stat-label">Beat</div><div class="test-stat-val" id="rhythm-count">0 / 16</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Last Offset</div><div class="test-stat-val" id="rhythm-last">—</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Average</div><div class="test-stat-val" id="rhythm-avg">—</div></div>
  </div>

  <div id="rhythm-result" class="test-summary-card" style="display:none;max-width:650px;">
    <span class="benchmark-badge playable">Result</span>
    <h2 id="rhythm-score">—</h2>
    <p id="rhythm-summary">—</p>
    <div class="summary-actions"><button id="rhythm-restart" class="btn btn-primary">Try Again</button><button id="rhythm-copy" class="btn btn-accent">Share Result 📋</button></div>
  </div>

  <div class="benchmark-info-section">
    <h3>How it works</h3>
    <p>The test uses a fixed 90 BPM beat for 16 taps. Your score is the average absolute timing offset from the scheduled beats. Lower is closer to the beat.</p>
  </div>
</div>

<script>
(function(){
  var start=document.getElementById('rhythm-start'), tap=document.getElementById('rhythm-tap');
  var status=document.getElementById('rhythm-status'), beatEl=document.getElementById('rhythm-beat');
  var countEl=document.getElementById('rhythm-count'), lastEl=document.getElementById('rhythm-last'), avgEl=document.getElementById('rhythm-avg');
  var result=document.getElementById('rhythm-result'), scoreEl=document.getElementById('rhythm-score'), summary=document.getElementById('rhythm-summary');
  var restart=document.getElementById('rhythm-restart'), copy=document.getElementById('rhythm-copy');
  var total=16, interval=60000/90, beatIndex=0, expected=0, running=false, offsets=[], timer=null, audio=null;

  function sound(){
    try{
      if(!audio) audio=new (window.AudioContext||window.webkitAudioContext)();
      if(audio.state==='suspended') audio.resume();
      var o=audio.createOscillator(), g=audio.createGain();
      o.frequency.value=880; g.gain.setValueAtTime(.08,audio.currentTime); g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.09);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime+.09);
    }catch(e){}
  }
  function renderBeat(){ beatEl.textContent='●'; setTimeout(function(){if(running)beatEl.textContent='—';},120); }
  function nextBeat(){
    if(!running)return;
    expected=performance.now();
    beatIndex++;
    countEl.textContent=beatIndex+' / '+total;
    sound(); renderBeat();
    timer=setTimeout(nextBeat,interval);
  }
  function finish(){
    running=false; clearTimeout(timer); tap.style.display='none'; start.style.display='inline-block'; start.textContent='Try Again';
    var avg=offsets.length?Math.round(offsets.reduce(function(a,b){return a+b;},0)/offsets.length):null;
    avgEl.textContent=avg===null?'—':avg+' ms';
    scoreEl.textContent=avg===null?'No taps recorded':avg+' ms average offset';
    summary.textContent=avg===null?'No taps were recorded.':('You recorded '+offsets.length+' of '+total+' taps. Lower offset means closer timing.');
    result.style.display='block';
  }
  function begin(){
    clearTimeout(timer); running=true; beatIndex=0; offsets=[]; expected=0;
    result.style.display='none'; start.style.display='none'; tap.style.display='inline-block'; status.textContent='Tap Space or the button as each beat sounds.';
    countEl.textContent='0 / '+total; lastEl.textContent='—'; avgEl.textContent='—'; beatEl.textContent='—';
    setTimeout(function(){ if(running) nextBeat(); },300);
  }
  function registerTap(){
    if(!running || !expected)return;
    var offset=Math.round(performance.now()-expected);
    offsets.push(Math.abs(offset)); lastEl.textContent=(offset>0?'+':'')+offset+' ms';
    var avg=Math.round(offsets.reduce(function(a,b){return a+b;},0)/offsets.length); avgEl.textContent=avg+' ms';
    if(offsets.length>=total) finish();
  }
  start.addEventListener('click',begin); restart.addEventListener('click',begin); tap.addEventListener('click',registerTap);
  document.addEventListener('keydown',function(e){if(e.code==='Space' && running){e.preventDefault();registerTap();}});
  copy.addEventListener('click',function(){navigator.clipboard.writeText('🥁 Wanjaaro Rhythm Tap: '+scoreEl.textContent+'\nhttps://wanjaaro.com/rhythm-tap').then(function(){copy.textContent='Copied ✓';setTimeout(function(){copy.textContent='Share Result 📋';},1500);});});
})();
</script>
