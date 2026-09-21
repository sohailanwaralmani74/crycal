---
layout: default
title: "Memory Tests — Wanjaaro"
description: "Browser-based memory tests for sequence recall, numbers, card matching, visual locations, word recall, and spatial working memory."
permalink: /memory
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge playable">Category</span>
    <h1>Memory Tests</h1>
    <p>Try different memory tasks that focus on sequence recall, numbers, visual locations, words, and short-term working memory.</p>
  </div>

  <div class="benchmark-card-grid">
    <a href="/sequence-memory" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🧠</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Sequence Memory</div><div class="benchmark-card-desc">Watch a growing pattern of highlighted cells, then reproduce the sequence in the same order.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-sequence">Best Level</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>

    <a href="/number-memory" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🔢</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Number Memory</div><div class="benchmark-card-desc">Study a number, wait for it to disappear, and enter it correctly as the digit count increases.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-number">Best Digits</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>

    <a href="/card-matching" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🃏</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Card Matching</div><div class="benchmark-card-desc">Reveal hidden cards and remember their locations to find matching pairs with as few moves as possible.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-cards">Best Moves</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>

    <a href="/visual-grid-memory" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🔲</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Visual Grid Memory</div><div class="benchmark-card-desc">Memorize highlighted grid cells, then select the same locations after the board clears.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-grid-memory">Best Level</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>

    <a href="/word-list-recall" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">📖</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Word List Recall</div><div class="benchmark-card-desc">Study a list of words, then recall as many as you can after the list disappears.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-words">Best Recall</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>

    <a href="/chimp-test" class="benchmark-card">
      <div><div class="benchmark-card-header"><span class="benchmark-card-icon">🐒</span><span class="benchmark-badge playable">Playable Now</span></div>
      <div class="benchmark-card-title">Chimp Test</div><div class="benchmark-card-desc">Remember the positions of numbered tiles after the labels disappear, then select them in numerical order.</div></div>
      <div class="benchmark-card-footer"><span class="benchmark-pb" id="pb-chimp">Best Level</span><span class="benchmark-btn">Start Test &rarr;</span></div>
    </a>
  </div>
</div>

<script>
(function() {
  var values = [
    ['wanjaaro_pb_sequence', 'pb-sequence', 'Your Best: Level ', ''],
    ['wanjaaro_pb_number', 'pb-number', 'Your Best: ', ' Digits'],
    ['wanjaaro_pb_cards', 'pb-cards', 'Your Best: ', ' Moves'],
    ['wanjaaro_pb_grid_memory', 'pb-grid-memory', 'Your Best: Level ', ''],
    ['wanjaaro_pb_words', 'pb-words', 'Your Best: ', ' Words'],
    ['wanjaaro_pb_chimp', 'pb-chimp', 'Your Best: ', ' Numbers']
  ];
  values.forEach(function(item) {
    var value = localStorage.getItem(item[0]);
    var el = document.getElementById(item[1]);
    if (value && el) el.textContent = item[2] + value + item[3];
  });
})();
</script>
