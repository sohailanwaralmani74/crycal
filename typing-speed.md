---
layout: default
title: "Typing Speed Test — Wanjaaro"
description: "Free browser typing speed test that measures WPM, accuracy, errors, and completed text over a timed passage."
permalink: /typing-speed
category: typing
sidebar: true
sidebar_title: "Typing Speed Test"
sidebar_subtitle: "Measure words per minute"
sidebar_icon: "⌨️"
---

<div class="tool-container">
  <div class="tool-hero">
    <span class="tool-badge">Typing</span>
    <h1>Typing Speed Test</h1>
    <p>Type the passage as quickly as you can while keeping your input accurate. Your result is based on the amount of text entered during the timed test.</p>
  </div>

  <section class="tool-panel">
    <div class="tool-instructions">
      <h2>Type the Passage</h2>
      <p>Press <strong>Start Test</strong>, then type the displayed text. The 60-second timer starts with your first character.</p>
    </div>
    <div id="passage" class="typing-passage" aria-label="Text to type"></div>
    <textarea id="input" class="typing-input" rows="5" disabled placeholder="Your typing appears here..."></textarea>
    <div class="tool-actions"><button id="start" class="tool-btn">Start Test</button></div>
    <div class="tool-stats">
      <div><strong id="time">60</strong><span>Seconds</span></div>
      <div><strong id="wpm">0</strong><span>WPM</span></div>
      <div><strong id="accuracy">100%</strong><span>Accuracy</span></div>
      <div><strong id="errors">0</strong><span>Errors</span></div>
    </div>
    <div id="result" class="tool-result" hidden></div>
  </section>

  <section class="tool-content">
    <h2>How WPM Is Calculated</h2>
    <p>Words per minute is calculated from the number of typed characters, using five characters as one standard word. The test also reports accuracy so a fast result can be viewed alongside typing errors.</p>

    <h2>Keep Your Runs Comparable</h2>
    <p>Use the same keyboard and a similar sitting position when comparing your own results. Changes in the passage, device, or typing conditions can affect the result.</p>

    <h2>Browser-Based Testing</h2>
    <p>This test runs in your browser. Your typing is processed on the page and your personal best is stored locally in your browser.</p>
  </section>
</div>

<style>
.typing-passage{padding:18px;border:1px solid var(--border-color,#ddd);border-radius:10px;line-height:1.8;margin:16px 0;background:var(--card-bg,#fafafa)}
.typing-input{width:100%;box-sizing:border-box;padding:14px;border:1px solid var(--border-color,#ddd);border-radius:10px;resize:vertical;font:inherit}
.tool-actions{margin:14px 0}
.tool-stats{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:16px 0}
.tool-stats>div{min-width:90px;text-align:center;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px}
.tool-stats strong,.tool-stats span{display:block}
.tool-stats span{font-size:.8rem;opacity:.7}
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
  const passages=[
    "Clear typing starts with steady movement across the keyboard. Keep your hands relaxed and let accuracy guide your pace.",
    "Good typing is not only about speed. Consistent finger movement and careful attention to the text help reduce unnecessary corrections.",
    "A short typing test can show how quickly you enter ordinary text. Repeat the test under similar conditions when comparing your own results."
  ];
  const passage=document.getElementById("passage"), input=document.getElementById("input"), start=document.getElementById("start");
  const timeEl=document.getElementById("time"), wpmEl=document.getElementById("wpm"), accEl=document.getElementById("accuracy"), errorsEl=document.getElementById("errors"), result=document.getElementById("result");
  let text="",running=false,startTime=0,timer=null,started=false;
  function renderStats(){
    const typed=input.value, correct=Math.min(typed.length,text.length);
    let errors=0;
    for(let i=0;i<typed.length;i++) if(typed[i]!==text[i]) errors++;
    const elapsed=started?Math.max((performance.now()-startTime)/1000,.01):0;
    const mins=elapsed/60;
    const wpm=Math.round((typed.length/5)/Math.max(mins,1/60));
    const accuracy=typed.length?Math.max(0,Math.round((typed.length-errors)/typed.length*100)):100;
    wpmEl.textContent=running?wpm:0; accEl.textContent=accuracy+"%"; errorsEl.textContent=errors;
    if(running) timeEl.textContent=Math.max(0,60-Math.floor((performance.now()-startTime)/1000));
    return {wpm,accuracy,errors,correct};
  }
  function finish(){
    if(!running)return;
    running=false; clearInterval(timer); input.disabled=true;
    const s=renderStats(), old=Number(localStorage.getItem("wanjaaro_pb_wpm")||0);
    if(s.wpm>old)localStorage.setItem("wanjaaro_pb_wpm",s.wpm);
    result.hidden=false;
    result.innerHTML="<strong>Result:</strong> "+s.wpm+" WPM · "+s.accuracy+"% accuracy · "+s.errors+" errors.";
    start.textContent="Try Again";
  }
  function begin(){
    text=passages[Math.floor(Math.random()*passages.length)];
    passage.textContent=text; input.value=""; input.disabled=false; input.focus();
    result.hidden=true; running=true; started=false; startTime=0; timeEl.textContent="60"; wpmEl.textContent="0"; accEl.textContent="100%"; errorsEl.textContent="0"; start.textContent="Restart Test";
    clearInterval(timer);
  }
  input.addEventListener("input",function(){
    if(!running)return;
    if(!started){started=true;startTime=performance.now();timer=setInterval(renderStats,100);}
    renderStats();
    if(input.value.length>=text.length) finish();
  });
  start.addEventListener("click",begin);
  passage.textContent="Press Start Test to load a passage.";
  window.addEventListener("beforeunload",()=>clearInterval(timer));
})();
</script>
