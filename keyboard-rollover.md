---
layout: default
title: "Keyboard Rollover & Ghosting Test — Wanjaaro"
description: "Test which simultaneous keyboard presses your browser detects and inspect possible rollover or key blocking behavior."
permalink: /keyboard-rollover
category: typing
sidebar: true
sidebar_title: "Keyboard Rollover Test"
sidebar_subtitle: "Check simultaneous key detection"
sidebar_icon: "⌨️"
---

<div class="tool-container">
  <div class="tool-hero">
    <span class="tool-badge">Typing</span>
    <h1>Keyboard Rollover / Ghosting Test</h1>
    <p>Press several keys at the same time and watch which key events reach the browser. This is a browser-level check of simultaneous key detection.</p>
  </div>

  <section class="tool-panel">
    <div class="tool-instructions">
      <h2>Press Keys Together</h2>
      <p>Click <strong>Start Test</strong>, then hold a combination of keys. The page highlights keys while their keydown events are received.</p>
    </div>
    <div id="keyboard" class="keyboard" tabindex="0"></div>
    <div class="tool-stats">
      <div><strong id="held">0</strong><span>Keys Detected</span></div>
      <div><strong id="peak">0</strong><span>Peak Simultaneous</span></div>
      <div><strong id="events">0</strong><span>Key Events</span></div>
    </div>
    <div class="tool-actions"><button id="start" class="tool-btn">Start Test</button><button id="clear" class="tool-btn" disabled>Clear</button></div>
    <div id="detected" class="tool-result">Press Start Test, then hold keys together.</div>
  </section>

  <section class="tool-content">
    <h2>What the Browser Can See</h2>
    <p>The test records keydown and keyup events delivered to the page. If a physical keyboard blocks or fails to report a simultaneous press, that key may not appear here.</p>

    <h2>Rollover and Ghosting Are Not the Same</h2>
    <p>Rollover describes how many simultaneous key presses a keyboard can register. Ghosting refers to unintended or missing key behavior around certain combinations. Browser event handling can reveal symptoms, but it cannot prove every electrical property of the keyboard.</p>

    <h2>Try Several Combinations</h2>
    <p>Test combinations you actually use, such as movement keys with modifier keys. Keep the same combination when comparing different keyboards so the observations remain meaningful.</p>
  </section>
</div>

<style>
.keyboard{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;min-height:120px;padding:18px;border:1px solid var(--border-color,#ddd);border-radius:10px}
.key{min-width:44px;padding:10px 8px;border:1px solid var(--border-color,#ddd);border-radius:7px;text-align:center;background:var(--card-bg,#fafafa)}
.key.active{outline:2px solid currentColor}
.tool-stats{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:16px 0}
.tool-stats>div{min-width:100px;text-align:center;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px}
.tool-stats strong,.tool-stats span{display:block}.tool-stats span{font-size:.8rem;opacity:.7}
.tool-actions{display:flex;gap:8px;justify-content:center}
</style>

<script>
(function(){
  const keyboard=document.getElementById("keyboard"),start=document.getElementById("start"),clear=document.getElementById("clear"),heldEl=document.getElementById("held"),peakEl=document.getElementById("peak"),eventsEl=document.getElementById("events"),detected=document.getElementById("detected");
  const keys=["A","S","D","F","J","K","L",";","Q","W","E","R","U","I","O","P","Z","X","C","V","B","N","M","Shift","Ctrl","Alt","Space"];
  let running=false,held=new Set(),peak=0,events=0;
  keys.forEach(k=>{const el=document.createElement("div");el.className="key";el.dataset.key=k;el.textContent=k;keyboard.appendChild(el)});
  function label(e){return e.code==="Space"?"Space":e.key.length===1?e.key.toUpperCase():e.key}
  function update(){heldEl.textContent=held.size;peak=Math.max(peak,held.size);peakEl.textContent=peak;eventsEl.textContent=events;detected.textContent=held.size?"Detected: "+Array.from(held).join(" + "):"No keys currently held."}
  function setKey(k,on){const el=Array.from(keyboard.children).find(x=>x.dataset.key===k);if(el)el.classList.toggle("active",on)}
  window.addEventListener("keydown",e=>{if(!running)return;e.preventDefault();const k=label(e);if(!held.has(k)){held.add(k);events++;setKey(k,true);update()}});
  window.addEventListener("keyup",e=>{if(!running)return;const k=label(e);held.delete(k);setKey(k,false);update()});
  start.addEventListener("click",()=>{running=!running;start.textContent=running?"Stop Test":"Start Test";clear.disabled=!running;if(running){held.clear();peak=0;events=0;update();keyboard.focus()}});
  clear.addEventListener("click",()=>{held.clear();peak=0;events=0;Array.from(keyboard.children).forEach(x=>x.classList.remove("active"));update()});
})();
</script>
