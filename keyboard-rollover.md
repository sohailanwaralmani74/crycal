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

<style>
.tool-container{max-width:920px;margin:0 auto;padding:2.25rem 1.25rem 4rem;color:var(--ink-900)}
.tool-hero{margin-bottom:1.75rem}.tool-badge{display:inline-flex;padding:.35rem .7rem;border-radius:999px;background:var(--accent-subtle);color:var(--accent-text);font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.tool-hero h1{font-size:clamp(2rem,4vw,3rem);line-height:1.08;margin:.75rem 0 .65rem;letter-spacing:-.03em}.tool-hero p{max-width:720px;color:var(--text-secondary);font-size:1.02rem;line-height:1.65;margin:0}
.tool-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-md)}
.tool-instructions h2{font-size:1.25rem;margin:0 0 .4rem}.tool-instructions p{margin:0;color:var(--text-secondary);line-height:1.6}
.keyboard{display:grid;grid-template-columns:repeat(9,minmax(42px,1fr));gap:8px;min-height:0;padding:1.25rem;margin:1.5rem 0;background:var(--ink-900);border:2px solid var(--ink-800);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg)}
.key{min-width:0;padding:.8rem .35rem;border:1px solid var(--ink-700);border-radius:var(--radius-sm);text-align:center;background:var(--ink-800);color:#fff;font-family:var(--font-mono);font-size:.82rem;font-weight:700;user-select:none;transition:transform .08s ease,background .1s ease,box-shadow .1s ease}
.key.active{background:#fff;color:var(--ink-900);border-color:#fff;box-shadow:0 0 0 2px var(--accent);transform:translateY(-2px)}
.tool-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin:1.25rem 0}.tool-stats>div{padding:.9rem .65rem;text-align:center;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}.tool-stats strong,.tool-stats span{display:block}.tool-stats strong{font-family:var(--font-mono);font-size:1.45rem}.tool-stats span{margin-top:.3rem;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);font-weight:700}
.tool-actions{display:flex;gap:.7rem;justify-content:center;margin:1.25rem 0}.tool-btn{border:0;border-radius:var(--radius-sm);padding:.8rem 1.2rem;background:var(--accent);color:#fff;font-weight:800;cursor:pointer;box-shadow:var(--shadow-sm)}.tool-btn:hover{filter:brightness(1.06)}
.tool-result{padding:1rem;border:1px solid var(--border-light);border-radius:var(--radius-md);background:var(--surface-muted);text-align:center;line-height:1.5}
.tool-content{margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border-light)}.tool-content h2{font-size:1.35rem;margin:0 0 .6rem}.tool-content p{max-width:800px;color:var(--text-secondary);line-height:1.7;margin:0 0 1.6rem}
@media(max-width:700px){.tool-container{padding:1.5rem .9rem 3rem}.tool-panel{padding:1.15rem}.keyboard{grid-template-columns:repeat(6,minmax(36px,1fr));gap:6px;padding:.8rem}.key{padding:.7rem .2rem;font-size:.72rem}.tool-stats{grid-template-columns:1fr 1fr}.tool-actions{flex-direction:column}.tool-btn{width:100%}}
</style>

<script>
(function(){
  const keyboard=document.getElementById("keyboard"),start=document.getElementById("start"),clear=document.getElementById("clear"),heldEl=document.getElementById("held"),peakEl=document.getElementById("peak"),eventsEl=document.getElementById("events"),detected=document.getElementById("detected");
  const keys=["A","S","D","F","J","K","L",";","Q","W","E","R","U","I","O","P","Z","X","C","V","B","N","M","Shift","Ctrl","Alt","Space"];
  let running=false,held=new Set(),peak=0,events=0;
  keys.forEach(k=>{const el=document.createElement("div");el.className="key";el.dataset.key=k;el.textContent=k;keyboard.appendChild(el)});
  function label(e){return e.code==="Space"?"Space":e.key.length===1?e.key.toUpperCase():e.key}
  function update(){heldEl.textContent=held.size;peak=Math.max(peak,held.size);peakEl.textContent=peak;eventsEl.textContent=events;detected.textContent=held.size?"Detected: "+Array.from(held).join(" + "):"No keys currently held."}
  function clearHeld(){held.clear();Array.from(keyboard.children).forEach(x=>x.classList.remove("active"));update()}
  function setKey(k,on){const el=Array.from(keyboard.children).find(x=>x.dataset.key===k);if(el)el.classList.toggle("active",on)}
  window.addEventListener("keydown",e=>{if(!running)return;const k=label(e);if(!held.has(k)){held.add(k);events++;setKey(k,true);update()}});
  window.addEventListener("keyup",e=>{if(!running)return;const k=label(e);held.delete(k);setKey(k,false);update()});
  window.addEventListener("blur",()=>{if(running)clearHeld()});
  start.addEventListener("click",()=>{running=!running;if(running){held.clear();peak=0;events=0;start.textContent="Stop Test";clear.disabled=false;update();keyboard.focus()}else{clearHeld();start.textContent="Start Test";clear.disabled=true}});
  clear.addEventListener("click",()=>{clearHeld();peak=0;events=0;update()});update();
})();
</script>