---
layout: default
title: "Typing Consistency Test — Wanjaaro"
description: "Measure typing rhythm by tracking the timing between keystrokes during a short browser-based typing challenge."
permalink: /typing-consistency
category: typing
sidebar: true
sidebar_title: "Typing Consistency"
sidebar_subtitle: "Measure your typing rhythm"
sidebar_icon: "📊"
---

<div class="tool-container">
  <div class="tool-hero">
    <span class="tool-badge">Typing</span>
    <h1>Typing Consistency / Rhythm Test</h1>
    <p>Type the passage naturally while the test records the gaps between your keystrokes. The final result describes how evenly those intervals were distributed.</p>
  </div>

  <section class="tool-panel">
    <div class="tool-instructions">
      <h2>Keep a Natural Rhythm</h2>
      <p>Start the test and type the displayed passage. Avoid deliberately changing your pace to chase a particular score.</p>
    </div>
    <div id="target" class="typing-passage"></div>
    <textarea id="input" class="typing-input" rows="4" disabled placeholder="Start the test to begin typing..."></textarea>
    <div class="tool-actions"><button id="start" class="tool-btn">Start Test</button></div>
    <div class="tool-stats">
      <div><strong id="consistency">—</strong><span>Consistency</span></div>
      <div><strong id="mean">—</strong><span>Avg Gap</span></div>
      <div><strong id="spread">—</strong><span>Timing Spread</span></div>
      <div><strong id="keys">0</strong><span>Keystrokes</span></div>
    </div>
    <div id="result" class="tool-result" hidden></div>
  </section>

  <section class="tool-content">
    <h2>How Rhythm Is Measured</h2>
    <p>The test records the time between successive keystrokes after typing begins. It calculates the average interval and the spread of those intervals, then converts the spread into a simple consistency value for this test.</p>

    <h2>What Can Change the Result</h2>
    <p>Long pauses, corrections, unfamiliar words, and changes in typing pace can widen the timing spread. Keyboard feel and the text itself can also affect the pattern.</p>

    <h2>Compare Your Own Runs</h2>
    <p>Use the same passage and keyboard when comparing results. The consistency value is intended as a repeatable measurement within this test rather than a universal typing rating.</p>
  </section>
</div>

<style>
.typing-passage{padding:18px;border:1px solid var(--border-color,#ddd);border-radius:10px;line-height:1.8;margin:16px 0;background:var(--card-bg,#fafafa)}
.typing-input{width:100%;box-sizing:border-box;padding:14px;border:1px solid var(--border-color,#ddd);border-radius:10px;resize:vertical;font:inherit}
.tool-actions{margin:14px 0}
.tool-stats{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:16px 0}
.tool-stats>div{min-width:95px;text-align:center;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px}
.tool-stats strong,.tool-stats span{display:block}.tool-stats span{font-size:.8rem;opacity:.7}
</style>

<script>
(function(){
  const text="Smooth typing depends on controlled movement and a steady pace across the keyboard.";
  const target=document.getElementById("target"),input=document.getElementById("input"),start=document.getElementById("start"),cons=document.getElementById("consistency"),mean=document.getElementById("mean"),spread=document.getElementById("spread"),keysEl=document.getElementById("keys"),result=document.getElementById("result");
  let running=false,lastTime=0,gaps=[],typed=0;
  target.textContent=text;
  function calc(){
    if(!gaps.length)return;
    const avg=gaps.reduce((a,b)=>a+b,0)/gaps.length;
    const variance=gaps.reduce((a,b)=>a+Math.pow(b-avg,2),0)/gaps.length;
    const sd=Math.sqrt(variance);
    const consistency=Math.max(0,Math.min(100,Math.round(100-(sd/Math.max(avg,1))*100)));
    mean.textContent=Math.round(avg)+" ms";spread.textContent=Math.round(sd)+" ms";cons.textContent=consistency+"%";keysEl.textContent=typed;
    return {consistency,avg,sd};
  }
  function finish(){
    if(!running)return;running=false;input.disabled=true;const s=calc();
    const old=Number(localStorage.getItem("wanjaaro_pb_typing_consistency")||0);
    if(s&&s.consistency>old)localStorage.setItem("wanjaaro_pb_typing_consistency",s.consistency);
    result.hidden=false;result.innerHTML="<strong>Result:</strong> "+s.consistency+"% consistency · "+Math.round(s.avg)+" ms average gap · "+Math.round(s.sd)+" ms timing spread.";
    start.textContent="Try Again";
  }
  start.addEventListener("click",()=>{
    running=true;lastTime=0;gaps=[];typed=0;input.value="";input.disabled=false;result.hidden=true;
    cons.textContent="—";mean.textContent="—";spread.textContent="—";keysEl.textContent="0";start.textContent="Restart Test";input.focus();
  });
  input.addEventListener("keydown",e=>{
    if(!running)return;
    const now=performance.now();
    if(lastTime)gaps.push(now-lastTime);
    lastTime=now;typed++;calc();
  });
  input.addEventListener("input",()=>{if(input.value===text)finish()});
})();
</script>
