---
layout: default
title: "Spin Wheel — Wanjaaro"
description: "Create a simple browser spin wheel for random choices without an account."
permalink: /spin-wheel
category: fun
sidebar: true
sidebar_title: "Spin Wheel"
sidebar_subtitle: "Make a random choice"
sidebar_icon: "🎡"
---

<div class="benchmark-container">
<div class="benchmark-hero"><span class="benchmark-badge playable">Fun Utility</span><h1>Spin Wheel</h1><p>Add choices, spin the wheel, and let the browser pick one at random.</p></div>
<div class="benchmark-card">
<label for="wheel-items"><strong>Choices</strong></label>
<textarea id="wheel-items" rows="7" style="width:100%;margin:1rem 0;padding:.8rem;" placeholder="Pizza&#10;Burger&#10;Tacos&#10;Sushi">Pizza
Burger
Tacos
Sushi</textarea>
<div style="text-align:center"><div id="wheel-result" style="font-size:2rem;font-weight:800;min-height:3rem;margin:1rem">—</div><button id="wheel-spin" class="btn btn-primary">Spin the Wheel</button></div>
</div>
<div class="benchmark-info-section"><h3>How it works</h3><p>Each non-empty line is treated as one choice. The selection is made locally in your browser.</p></div>
</div>
<script>
(function(){var input=document.getElementById('wheel-items'),btn=document.getElementById('wheel-spin'),out=document.getElementById('wheel-result');btn.addEventListener('click',function(){var a=input.value.split(/\n/).map(function(x){return x.trim();}).filter(Boolean);if(!a.length){out.textContent='Add at least one choice.';return;}btn.disabled=true;out.textContent='Spinning…';var n=18+Math.floor(Math.random()*12),i=0;var t=setInterval(function(){out.textContent=a[i%a.length];i++;if(i>=n){clearInterval(t);out.textContent='🎯 '+a[Math.floor(Math.random()*a.length)];btn.disabled=false;}},70);});})();
</script>
