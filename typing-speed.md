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
