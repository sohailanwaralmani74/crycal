---
layout: default
title: "Card Matching Memory Test — Wanjaaro"
description: "Free browser-based card matching memory test. Remember hidden card locations and find every matching pair."
permalink: /card-matching
category: memory
sidebar: true
sidebar_title: "Card Matching"
sidebar_subtitle: "Remember hidden pairs"
sidebar_icon: "🃏"
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Memory Test</span>
    <h1>Card Matching Memory Test</h1>
    <p>Turn over two cards at a time, remember where symbols appear, and clear the board by finding every matching pair.</p>
  </div>

  <div class="benchmark-card">
    <div id="cards" class="memory-card-grid"></div>
    <button class="btn btn-accent" id="start">Start Test</button>
    <div class="test-stats-bar">
      <div class="test-stat-item"><div class="test-stat-label">Moves</div><div class="test-stat-val" id="moves">0</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="time">0.0s</div></div>
      <div class="test-stat-item"><div class="test-stat-label">Best</div><div class="test-stat-val" id="best">--</div></div>
    </div>
    <p id="status"></p>
  </div>

  <div class="benchmark-info-section">
    <h3>Remember the Locations</h3>
    <p>Unmatched cards turn face down again. Remembering where a symbol appeared gives you information to use on a later turn.</p>
    <h3>How Moves Are Counted</h3>
    <p>Each pair of cards you reveal counts as one move. Your personal best records the fewest moves you have needed to clear the board.</p>
    <h3>Speed Still Matters</h3>
    <p>The board rewards memory first, while the timer shows how quickly you completed the task. A slower run can still use fewer moves.</p>
  </div>
</div>

<script>
(function(){
  var symbols=['★','●','▲','■','◆','♥','☀','☂'];
  var board=document.getElementById('cards'),start=document.getElementById('start'),movesEl=document.getElementById('moves'),timeEl=document.getElementById('time'),bestEl=document.getElementById('best'),status=document.getElementById('status');
  var best=Number(localStorage.getItem('wanjaaro_pb_cards')||0),first=null,locked=false,moves=0,matched=0,startedAt=0,timer=null;
  bestEl.textContent=best||'--';

  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

  function finish(){
    clearInterval(timer);
    var seconds=(performance.now()-startedAt)/1000;
    timeEl.textContent=seconds.toFixed(1)+'s';
    if(!best||moves<best){best=moves;localStorage.setItem('wanjaaro_pb_cards',best);bestEl.textContent=best;}
    status.textContent='Finished in '+moves+' moves and '+seconds.toFixed(1)+' seconds.';
    start.hidden=false;start.textContent='Play Again';
  }

  function begin(){
    clearInterval(timer);board.innerHTML='';first=null;locked=false;moves=0;matched=0;
    movesEl.textContent='0';timeEl.textContent='0.0s';status.textContent='Find the matching pairs.';
    shuffle(symbols.concat(symbols)).forEach(function(symbol){
      var card=document.createElement('button');
      card.type='button';card.className='memory-card';card.dataset.symbol=symbol;card.textContent='?';
      card.onclick=function(){
        if(locked||card.classList.contains('matched')||card===first)return;
        card.classList.add('flipped');card.textContent=symbol;
        if(!first){first=card;return;}
        moves++;movesEl.textContent=moves;
        if(first.dataset.symbol===symbol){
          first.classList.add('matched');card.classList.add('matched');first=null;matched+=2;
          if(matched===16)finish();
        }else{
          var previous=first;first=null;locked=true;
          setTimeout(function(){previous.classList.remove('flipped');previous.textContent='?';card.classList.remove('flipped');card.textContent='?';locked=false;},650);
        }
      };
      board.appendChild(card);
    });
    start.hidden=true;startedAt=performance.now();
    timer=setInterval(function(){timeEl.textContent=((performance.now()-startedAt)/1000).toFixed(1)+'s';},100);
  }
  start.onclick=begin;
})();
</script>

<style>
.memory-card-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:420px;margin:20px auto}
.memory-card{aspect-ratio:1;border:0;border-radius:9px;font-size:clamp(22px,4vw,34px);cursor:pointer}
.memory-card.flipped,.memory-card.matched{filter:brightness(1.12)}
</style>
