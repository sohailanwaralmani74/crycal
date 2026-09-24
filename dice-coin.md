---
layout: default
title: "Dice & Coin — Wanjaaro"
description: "Roll virtual dice or flip a coin instantly in your browser."
permalink: /dice-coin
category: fun
sidebar: true
sidebar_title: "Dice & Coin"
sidebar_subtitle: "Quick random tools"
sidebar_icon: "🎲"
---

<div class="benchmark-container">
<div class="benchmark-hero"><span class="benchmark-badge playable">Fun Utility</span><h1>Dice &amp; Coin</h1><p>Roll dice or flip a coin with random results generated directly in your browser.</p></div>
<div class="benchmark-card" style="text-align:center">
<div id="random-result" style="font-size:3rem;font-weight:800;min-height:4rem;margin:1rem">—</div>
<button id="roll" class="btn btn-primary">Roll Dice</button>
<button id="flip" class="btn btn-accent">Flip Coin</button>
</div>
<div class="benchmark-info-section"><h3>Quick random choices</h3><p>Dice rolls use standard six-sided dice. Coin flips return heads or tails. Nothing is sent to a server.</p></div>
</div>
<script>
(function(){var out=document.getElementById('random-result');document.getElementById('roll').onclick=function(){out.textContent='🎲 '+(Math.floor(Math.random()*6)+1);};document.getElementById('flip').onclick=function(){out.textContent=Math.random()<.5?'🪙 Heads':'🪙 Tails';};})();
</script>
