---
layout: default
title: "Metronome Sync Challenge — Wanjaaro"
description: "Follow a browser metronome, then keep the same tempo after the clicks disappear."
permalink: /metronome-sync
category: timing
sidebar: true
sidebar_title: "Metronome Sync"
sidebar_subtitle: "Keep the tempo"
sidebar_icon: "🎼"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Timing Benchmark</span>
    <h1>Metronome Sync Challenge</h1>
    <p>Listen to eight beats, then keep tapping at the same tempo while the metronome goes silent. When it returns, see how far your taps drifted.</p>
  </div>

  <div class="benchmark-card" style="text-align:center;">
    <div id="sync-status" class="benchmark-card-desc">You will hear 8 guide beats, followed by 8 silent beats.</div>
    <div id="sync-beat" style="font-size:3rem;font-weight:800;margin:1.5rem 0;">—</div>
    <button id="sync-start" class="btn btn-primary">Start Challenge</button>
    <button id="sync-tap" class="btn btn-accent" style="display:none;min-width:180px;">TAP</button>
  </div>

  <div class="test-stats-bar" style="max-width:650px;">
    <div class="test-stat-item"><div class="test-stat-label">Beat</div><div class="test-stat-val" id="sync-count">0 / 16</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Mode</div><div class="test-stat-val" id="sync-mode">—</div></div>
    <div class="test-stat-item"><div class="test-stat-label">Drift</div><div class="test-stat-val" id="sync-drift">—</div></div>
  </div>

  <div id="sync-result" class="test-summary-card" style="display:none;max-width:650px;">
    <span class="benchmark-badge playable">Result</span>
    <h2 id="sync-score">—</h2>
    <p id="sync-summary">—</p>
    <div class="summary-actions"><button id="sync-again" class="btn btn-primary">Try Again</button><button id="sync-copy" class="btn btn-accent">Share Result 📋</button></div>
  </div>

  <div class="benchmark-info-section">
    <h3>How the challenge works</h3>
    <p>The metronome runs at 90 BPM. The first eight beats provide an audio reference. The next eight beats are silent, so you have to maintain the tempo yourself. Your drift is the average absolute offset during the silent section.</p>
  </div>
</div>

<script>
(function(){
  var start=document.getElementById('sync-start'), tap=document.getElementById('sync-tap'), status=document.getElementById('sync-status'), beat=document.getElementById('sync-beat');
  var count=document.getElementById('sync-count'), mode=document.getElementById('sync-mode'), drift=document.getElementById('sync-drift');
  var result=document.getElementById('sync-result'), score=document.getElementById('sync-score'), summary=document.getElementById('sync-summary'), again=document.getElementById('sync-again'), copy=document.getElementById('sync-copy');
  var interval=60000/90,total=16,guide=8,running=false,index=0,expected=0,timer=null,allOffsets=[],audio=null;

  function beep(){try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();var o=audio.createOscillator(),g=audio.createGain();o.frequency.value=880;g.gain.setValueAtTime(.08,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.08);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.08);}catch(e){}}
  function next(){if(!running)return;index++;expected=performance.now();count.textContent=index+' / '+total;var silent=index>guide;mode.textContent=silent?'Silent':'Guide';status.textContent=silent?'Keep the tempo without the click.':'Listen and tap with the click.';if(!silent)beep();beat.textContent='●';setTimeout(function(){if(running)beat.textContent='—';},100);timer=setTimeout(next,interval);}
  function finish(){running=false;clearTimeout(timer);tap.style.display='none';start.style.display='inline-block';start.textContent='Try Again';var arr=allOffsets.slice(guide);var avg=arr.length?Math.round(arr.reduce(function(a,b){return a+b;},0)/arr.length):null;drift.textContent=avg===null?'—':avg+' ms';score.textContent=avg===null?'No silent taps':'±'+avg+' ms drift';summary.textContent=avg===null?'No taps were recorded during the silent section.':'Average absolute offset during the 8 silent beats: '+avg+' ms.';result.style.display='block';}
  function begin(){clearTimeout(timer);running=true;index=0;expected=0;allOffsets=[];result.style.display='none';start.style.display='none';tap.style.display='inline-block';count.textContent='0 / '+total;mode.textContent='—';drift.textContent='—';status.textContent='Listen for the guide beats.';setTimeout(function(){if(running)next();},300);}
  function register(){if(!running||!expected)return;allOffsets.push(Math.round(Math.abs(performance.now()-expected)));if(index>=total)finish();}
  start.addEventListener('click',begin);again.addEventListener('click',begin);tap.addEventListener('click',register);document.addEventListener('keydown',function(e){if(e.code==='Space'&&running){e.preventDefault();register();}});copy.addEventListener('click',function(){navigator.clipboard.writeText('🎼 Wanjaaro Metronome Sync: '+score.textContent+'\nhttps://wanjaaro.com/metronome-sync').then(function(){copy.textContent='Copied ✓';setTimeout(function(){copy.textContent='Share Result 📋';},1500);});});
})();
</script>
