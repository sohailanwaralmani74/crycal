---
layout: default
title: "Word List Recall Test — Wanjaaro"
description: "Free browser-based word recall test. Study a list of words, then enter as many as you remember after the list disappears."
permalink: /word-list-recall
category: memory
sidebar: true
sidebar_title: "Word List Recall"
sidebar_subtitle: "Recall words without order"
sidebar_icon: "📖"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Memory Test</span>
    <h1>Word List Recall Test</h1>
    <p>Study a short list of words, then recall as many as possible after the list disappears. The order of your answers does not matter.</p>
  </div>

  <div class="benchmark-card">
    <div id="words" class="word-list"></div>
    <div id="recall" hidden>
      <input id="answer" type="text" autocomplete="off" aria-label="Enter a remembered word">
      <button class="btn btn-accent" id="add">Add Word</button>
      <button class="btn btn-primary" id="finish">Finish</button>
    </div>
    <button class="btn btn-accent" id="start">Start Test</button>
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Correct</div><div class="test-stat-val" id="score">0</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Words Shown</div><div class="test-stat-val">12</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Best</div><div class="test-stat-val" id="best">--</div></div>
    </div>
    <p id="status"></p>
  </div>

  <div class="benchmark-info-section">
    <h3>Recall Without a Sequence</h3>
    <p>The words are hidden before you answer. You can enter remembered words in any order, so the task is about retaining the list rather than its original arrangement.</p>
    <h3>How the Score Works</h3>
    <p>Only words from the displayed list count. Each correct word is counted once, even if you enter it repeatedly.</p>
    <h3>Why Lists Feel Different</h3>
    <p>Familiar words, attention during the study period, and interruptions can all affect how many items you recall. Compare your own attempts under similar conditions.</p>
  </div>
</div>

<script>
(function(){
  var bank=['river','window','garden','silver','planet','coffee','bridge','orange','forest','pencil','market','cloud','guitar','button','winter','lantern','camera','island','yellow','ticket'];
  var words=document.getElementById('words'),recall=document.getElementById('recall'),answer=document.getElementById('answer'),add=document.getElementById('add'),finish=document.getElementById('finish'),start=document.getElementById('start'),scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),status=document.getElementById('status');
  var best=Number(localStorage.getItem('wanjaaro_pb_words')||0),target=[],found={};bestEl.textContent=best||'--';

  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

  function addWord(){
    var value=answer.value.trim().toLowerCase();answer.value='';
    if(!value)return;
    if(target.indexOf(value)>=0&&!found[value]){
      found[value]=true;scoreEl.textContent=Number(scoreEl.textContent)+1;
    }
    answer.focus();
  }

  start.onclick=function(){
    target=shuffle(bank.slice()).slice(0,12);found={};scoreEl.textContent='0';status.textContent='Study the list.';
    words.textContent=target.join('  •  ');start.hidden=true;
    setTimeout(function(){words.textContent='The list is hidden.';recall.hidden=false;answer.focus();status.textContent='Enter the words you remember.';},7000);
  };
  add.onclick=addWord;
  answer.addEventListener('keydown',function(e){if(e.key==='Enter')addWord();});
  finish.onclick=function(){
    var score=Number(scoreEl.textContent);
    if(score>best){best=score;localStorage.setItem('wanjaaro_pb_words',best);bestEl.textContent=best;}
    status.textContent='You recalled '+score+' of '+target.length+' words.';
    recall.hidden=true;start.hidden=false;start.textContent='Try Again';
  };
})();
</script>
