---
layout: default
title: "Shareable Result Card — Wanjaaro"
description: "Turn a Wanjaaro result into a clean shareable text card directly in your browser."
permalink: /shareable-result-card
category: fun
sidebar: true
sidebar_title: "Result Card"
sidebar_subtitle: "Format a result"
sidebar_icon: "📤"
---

<div class="benchmark-container">
<div class="benchmark-hero"><span class="benchmark-badge playable">Fun Utility</span><h1>Shareable Result Card</h1><p>Enter a test name and result, then create a compact result message you can copy or share.</p></div>
<div class="benchmark-card">
<label>Test name</label><input id="card-test" style="width:100%;padding:.8rem;margin:.4rem 0 1rem" placeholder="Visual Reaction Time">
<label>Result</label><input id="card-result" style="width:100%;padding:.8rem;margin:.4rem 0 1rem" placeholder="214 ms">
<label>Optional note</label><input id="card-note" style="width:100%;padding:.8rem;margin:.4rem 0 1rem" placeholder="New personal best">
<button id="make-card" class="btn btn-primary">Create Result</button>
<pre id="card-output" style="white-space:pre-wrap;margin-top:1rem;padding:1rem;border-radius:8px;min-height:5rem">Your result will appear here.</pre>
<button id="copy-card" class="btn btn-accent">Copy Result</button>
</div>
</div>
<script>
(function(){var t=document.getElementById('card-test'),r=document.getElementById('card-result'),n=document.getElementById('card-note'),o=document.getElementById('card-output'),c=document.getElementById('copy-card');function make(){var a=t.value.trim()||'Wanjaaro Test',b=r.value.trim()||'—',d=n.value.trim();o.textContent='🧠 Wanjaaro — '+a+'\nResult: '+b+(d?'\n'+d:'')+'\nhttps://wanjaaro.com/'+location.pathname.replace(/^\//,'');}document.getElementById('make-card').onclick=make;c.onclick=function(){if(o.textContent==='Your result will appear here.')make();navigator.clipboard.writeText(o.textContent).then(function(){c.textContent='Copied ✓';setTimeout(function(){c.textContent='Copy Result';},1500);});};})();
</script>
