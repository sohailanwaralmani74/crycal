---
layout: default
title: "Typing Accuracy Test — Wanjaaro"
description: "Free browser typing accuracy test focused on reproducing text correctly, tracking mistakes and corrected characters."
permalink: /typing-accuracy
category: typing
sidebar: true
sidebar_title: "Typing Accuracy Test"
sidebar_subtitle: "Focus on error-free input"
sidebar_icon: "🎯"
---

<div class="tool-container">
  <div class="tool-hero">
    <span class="tool-badge">Typing</span>
    <h1>Typing Accuracy Test</h1>
    <p>This challenge puts accuracy first. Type each sentence exactly as shown and correct mistakes before moving to the next one.</p>
  </div>

  <section class="tool-panel">
    <div class="tool-instructions">
      <h2>Complete Three Sentences</h2>
      <p>Start the challenge, then reproduce each sentence. You cannot continue until the current sentence matches the target exactly.</p>
    </div>
    <div id="target" class="typing-passage"></div>
    <input id="input" class="typing-input" disabled autocomplete="off" spellcheck="false" placeholder="Type the sentence exactly...">
    <div class="tool-actions"><button id="start" class="tool-btn">Start Test</button></div>
    <div class="tool-stats">
      <div><strong id="step">0/3</strong><span>Sentences</span></div>
      <div><strong id="accuracy">100%</strong><span>Accuracy</span></div>
      <div><strong id="mistakes">0</strong><span>Mistakes</span></div>
      <div><strong id="chars">0</strong><span>Correct Characters</span></div>
    </div>
    <div id="result" class="tool-result" hidden></div>
  </section>

  <section class="tool-content">
    <h2>Accuracy Is the Main Result</h2>
    <p>Every character is compared with the target. A mistake is counted when the typed text contains a character that does not match the corresponding target character. Corrections are part of the task rather than being hidden from the final result.</p>

    <h2>Why This Differs From a Speed Test</h2>
    <p>The goal here is to finish the text correctly, not to maximize the amount entered during a timer. That makes the test useful when you want to concentrate on clean input.</p>

    <h2>Browser-Only Processing</h2>
    <p>The comparison happens locally in your browser. No account or upload is required, and your best accuracy is kept in local browser storage.</p>
  </section>
</div>

<style>
.typing-passage{padding:18px;border:1px solid var(--border-color,#ddd);border-radius:10px;line-height:1.8;margin:16px 0;background:var(--card-bg,#fafafa)}
.typing-input{width:100%;box-sizing:border-box;padding:14px;border:1px solid var(--border-color,#ddd);border-radius:10px;font:inherit}
.tool-actions{margin:14px 0}
.tool-stats{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:16px 0}
.tool-stats>div{min-width:90px;text-align:center;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px}
.tool-stats strong,.tool-stats span{display:block}.tool-stats span{font-size:.8rem;opacity:.7}
</style>

<script>
(function(){
  const sentences=[
    "Careful typing begins with attention to every character.",
    "Short practice sessions can help you notice repeated typing mistakes.",
    "Accuracy becomes easier to maintain when your hands stay relaxed."
  ];
  const target=document.getElementById("target"),input=document.getElementById("input"),start=document.getElementById("start"),step=document.getElementById("step"),acc=document.getElementById("accuracy"),mistakesEl=document.getElementById("mistakes"),chars=document.getElementById("chars"),result=document.getElementById("result");
  let index=0,totalMistakes=0,totalChars=0,running=false;
  function setSentence(){target.textContent=sentences[index];input.value="";input.focus();step.textContent=(index+1)+"/"+sentences.length}
  function update(){
    const value=input.value,t=sentences[index];
    let wrong=0,correct=0;
    for(let i=0;i<value.length;i++){if(value[i]===t[i])correct++;else wrong++}
    totalMistakes=Math.max(totalMistakes,totalMistakes+wrong-(window._lastWrong||0)); window._lastWrong=wrong;
    const typed=Math.max(value.length,1), accuracy=Math.round(Math.max(0,(correct/typed))*100);
    acc.textContent=accuracy+"%";mistakesEl.textContent=totalMistakes;chars.textContent=totalChars+correct;
    if(value===t){
      totalChars+=correct; window._lastWrong=0; index++;
      if(index<sentences.length){setSentence();return}
      running=false;input.disabled=true;step.textContent="3/3";
      const finalAccuracy=Math.round(Math.max(0,(totalChars/sentences.join("").length))*100);
      acc.textContent=finalAccuracy+"%";
      const old=Number(localStorage.getItem("wanjaaro_pb_accuracy")||0);
      if(finalAccuracy>old)localStorage.setItem("wanjaaro_pb_accuracy",finalAccuracy);
      result.hidden=false;result.innerHTML="<strong>Completed:</strong> "+finalAccuracy+"% accuracy · "+totalMistakes+" mistakes.";
      start.textContent="Try Again";
    }
  }
  start.addEventListener("click",function(){index=0;totalMistakes=0;totalChars=0;window._lastWrong=0;running=true;input.disabled=false;result.hidden=true;start.textContent="Restart Test";setSentence();acc.textContent="100%";mistakesEl.textContent="0";chars.textContent="0"});
  input.addEventListener("input",function(){if(running)update()});
  target.textContent="Press Start Test to begin.";
})();
</script>
