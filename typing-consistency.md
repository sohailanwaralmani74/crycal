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

<style>
.tool-container{max-width:920px;margin:0 auto;padding:2.25rem 1.25rem 4rem;color:var(--ink-900)}
.tool-hero{margin-bottom:1.75rem}
.tool-badge{display:inline-flex;align-items:center;padding:.35rem .7rem;border-radius:999px;background:var(--accent-subtle);color:var(--accent-text);font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.tool-hero h1{font-size:clamp(2rem,4vw,3rem);line-height:1.08;margin:.75rem 0 .65rem;letter-spacing:-.03em}
.tool-hero p{max-width:720px;color:var(--text-secondary);font-size:1.02rem;line-height:1.65;margin:0}
.tool-panel{background:var(--surface-white);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-md)}
.tool-instructions{margin-bottom:1.5rem}
.tool-instructions h2{font-size:1.25rem;margin:0 0 .4rem;color:var(--ink-900)}
.tool-instructions p{margin:0;color:var(--text-secondary);line-height:1.6}
.tool-btn{border:0;border-radius:var(--radius-sm);padding:.8rem 1.2rem;background:var(--accent);color:#fff;font-weight:800;font-size:.95rem;cursor:pointer;box-shadow:var(--shadow-sm);transition:transform .12s ease,filter .12s ease}
.tool-btn:hover{filter:brightness(1.06);transform:translateY(-1px)}
.tool-btn:active{transform:translateY(0)}
.tool-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.typing-passage{padding:1.35rem 1.5rem;border:1px solid var(--border-medium);border-radius:var(--radius-md);line-height:1.9;margin:1rem 0 1.1rem;background:var(--surface-muted);color:var(--ink-900);font-size:1.08rem;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}
.typing-input{width:100%;box-sizing:border-box;padding:1rem 1.1rem;border:2px solid var(--border-medium);border-radius:var(--radius-md);resize:vertical;font:inherit;font-size:1.05rem;line-height:1.6;color:var(--ink-900);background:var(--surface-white);outline:none;transition:border-color .15s ease,box-shadow .15s ease}
.typing-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-subtle)}
.typing-input:disabled{background:var(--surface-muted);cursor:not-allowed}
.tool-actions{display:flex;gap:.7rem;align-items:center;justify-content:center;margin:1.25rem 0}
.tool-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin:1.25rem 0 0}
.tool-stats>div{min-width:0;text-align:center;padding:.9rem .65rem;background:var(--surface-muted);border:1px solid var(--border-light);border-radius:var(--radius-md)}
.tool-stats strong,.tool-stats span{display:block}
.tool-stats strong{font-family:var(--font-mono);font-size:1.45rem;line-height:1.2;color:var(--ink-900)}
.tool-stats span{margin-top:.3rem;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);font-weight:700}
.tool-result{margin-top:1.25rem;padding:1rem 1.15rem;border:1px solid var(--accent-border);border-radius:var(--radius-md);background:var(--accent-subtle);color:var(--ink-900);line-height:1.5;text-align:center}
.tool-content{margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border-light)}
.tool-content h2{font-size:1.35rem;margin:0 0 .6rem;color:var(--ink-900)}
.tool-content p{max-width:800px;color:var(--text-secondary);line-height:1.7;margin:0 0 1.6rem}
@media(max-width:640px){
  .tool-container{padding:1.5rem .9rem 3rem}
  .tool-panel{padding:1.15rem}
  .tool-stats{grid-template-columns:repeat(2,1fr)}
  .tool-hero h1{font-size:2rem}
  .typing-passage{padding:1rem;font-size:1rem}
  .tool-btn{width:100%}
  .tool-actions{flex-direction:column}
}
</style>

<script>
(function(){
  const text="Smooth typing depends on controlled movement and a steady pace across the keyboard.";
  const target=document.getElementById("target"),input=document.getElementById("input"),start=document.getElementById("start"),cons=document.getElementById("consistency"),mean=document.getElementById("mean"),spread=document.getElementById("spread"),keysEl=document.getElementById("keys"),result=document.getElementById("result");
  let running=false,lastTime=0,gaps=[],typed=0;
  target.textContent=text;
  function calc(){if(!gaps.length)return null;const avg=gaps.reduce((a,b)=>a+b,0)/gaps.length,variance=gaps.reduce((a,b)=>a+Math.pow(b-avg,2),0)/gaps.length,sd=Math.sqrt(variance),consistency=Math.max(0,Math.min(100,Math.round(100-(sd/Math.max(avg,1))*100)));mean.textContent=Math.round(avg)+" ms";spread.textContent=Math.round(sd)+" ms";cons.textContent=consistency+"%";keysEl.textContent=typed;return {consistency,avg,sd}}
  function finish(){if(!running)return;running=false;input.disabled=true;const s=calc(),old=Number(localStorage.getItem("wanjaaro_pb_typing_consistency")||0);if(s&&s.consistency>old)localStorage.setItem("wanjaaro_pb_typing_consistency",s.consistency);result.hidden=false;result.innerHTML="<strong>Result:</strong> "+s.consistency+"% consistency · "+Math.round(s.avg)+" ms average gap · "+Math.round(s.sd)+" ms timing spread.";start.textContent="Try Again"}
  start.addEventListener("click",()=>{running=true;lastTime=0;gaps=[];typed=0;input.value="";input.disabled=false;result.hidden=true;cons.textContent="—";mean.textContent="—";spread.textContent="—";keysEl.textContent="0";start.textContent="Restart Test";input.focus()});
  input.addEventListener("keydown",e=>{if(!running||e.key.length!==1&&e.key!==" ")return;const now=performance.now();if(lastTime)gaps.push(now-lastTime);lastTime=now;typed++;calc()});
  input.addEventListener("input",()=>{if(running&&input.value===text)finish()});
})();
</script>