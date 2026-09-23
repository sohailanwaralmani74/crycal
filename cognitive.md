---
layout: default
title: "Quick-Fire Cognitive Games — Wanjaaro"
description: "Benchmark your cognitive control, mental math speed, Stroop effect resistance, and dual-task executive processing."
permalink: /cognitive
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Quick-Fire Cognitive Games</h1>
    <p>Test executive function, inhibitory control, working memory processing speed, and mental agility under rapid time pressure.</p>
  </div>

  <div class="benchmark-card-grid">
    <a href="/stroop-test" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🧠</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Stroop Effect Test</div>
      <div class="benchmark-card-desc">Choose the ink color instead of reading the word. Twenty quick rounds test response speed while the word and ink color conflict.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-stroop">Personal Best</span><span class="benchmark-btn">Start Game →</span></div>
    </a>
    <a href="/mental-math-sprint" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">➕</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Mental Math Sprint</div>
      <div class="benchmark-card-desc">Solve short arithmetic problems for 60 seconds. Answer quickly, keep moving, and see how many you can get right.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb">60 Seconds</span><span class="benchmark-btn">Start Game →</span></div>
    </a>
    <a href="/odd-one-out" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🔍</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Odd-One-Out</div>
      <div class="benchmark-card-desc">Find the single different tile as quickly as possible. The grid grows as the rounds progress.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb">12 Rounds</span><span class="benchmark-btn">Start Game →</span></div>
    </a>
    <a href="/spot-the-difference" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🔎</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Spot the Difference</div>
      <div class="benchmark-card-desc">Compare two boards and find three changed tiles before the timer runs out.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb">3 Rounds</span><span class="benchmark-btn">Start Game →</span></div>
    </a>
    <a href="/dual-task" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🔀</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Dual-Task Challenge</div>
      <div class="benchmark-card-desc">Track a moving target while solving quick arithmetic questions during the same 30-second run.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb">30 Seconds</span><span class="benchmark-btn">Start Game →</span></div>
    </a>
  </div>
<script>
(function() {
  var s = localStorage.getItem('wanjaaro_pb_stroop');
  if (s) {
    var el = document.getElementById('pb-stroop');
    if (el) el.textContent = 'Your Best: ' + s + ' ms';
  }
})();
</script>


<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"CollectionPage",
  "name":"Quick-Fire Cognitive Games — Wanjaaro",
  "url":"https://wanjaaro.com/cognitive",
  "mainEntity":{
    "@type":"ItemList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"url":"https://wanjaaro.com/stroop-test","name":"Stroop Effect Test"},
      {"@type":"ListItem","position":2,"url":"https://wanjaaro.com/mental-math-sprint","name":"Mental Math Sprint"},
      {"@type":"ListItem","position":3,"url":"https://wanjaaro.com/odd-one-out","name":"Odd-One-Out"},
      {"@type":"ListItem","position":4,"url":"https://wanjaaro.com/spot-the-difference","name":"Spot the Difference"},
      {"@type":"ListItem","position":5,"url":"https://wanjaaro.com/dual-task","name":"Dual-Task Challenge"}
    ]
  }
}
</script>