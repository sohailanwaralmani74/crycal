---
layout: calculator
title: "Concrete Slab Calculator — Calculate Concrete Needed"
description: "Calculate concrete volume and cubic yards needed for a slab from length, width, thickness, and waste. Free browser calculator."
permalink: /concrete-slab-calculator
category: concrete
---

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"WebApplication",
  "name":"Concrete Slab Calculator",
  "url":"https://wanjaaro.com/concrete-slab-calculator",
  "applicationCategory":"UtilitiesApplication",
  "operatingSystem":"Any",
  "description":"Browser-based calculator for estimating concrete volume and cubic yards required for a slab."
}
</script>

<div class="calculator-page" data-calculator="concrete-slab">
  <div class="calc-breadcrumb"><a href="/">Home</a> / <a href="/">Concrete</a> / Concrete Slab Calculator</div>
  <header class="calc-hero">
    <div class="eyebrow">Concrete &amp; Foundations</div>
    <h1>Concrete Slab Calculator</h1>
    <p>Calculate the concrete volume for a rectangular slab and estimate the amount to order in cubic yards. Add a waste allowance to account for normal job-site variation.</p>
  </header>

  <div class="calc-layout">
    <section class="calc-main">
      <div class="calc-card">
        <div class="calc-card-header"><h2>Slab dimensions</h2><p>Enter the finished slab dimensions. Use the unit selector beside each value.</p></div>
        <div class="calc-body">
          <div class="field-grid">
            <div class="field"><label for="length">Length</label><div class="field-control"><input id="length" type="number" min="0" step="any" value="20" inputmode="decimal"><select id="lengthUnit" aria-label="Length unit"><option value="ft">ft</option><option value="m">m</option></select></div></div>
            <div class="field"><label for="width">Width</label><div class="field-control"><input id="width" type="number" min="0" step="any" value="10" inputmode="decimal"><select id="widthUnit" aria-label="Width unit"><option value="ft">ft</option><option value="m">m</option></select></div></div>
            <div class="field"><label for="thickness">Thickness</label><div class="field-control"><input id="thickness" type="number" min="0" step="any" value="4" inputmode="decimal"><select id="thicknessUnit" aria-label="Thickness unit"><option value="in">in</option><option value="ft">ft</option><option value="cm">cm</option><option value="m">m</option></select></div></div>
            <div class="field"><label for="waste">Waste allowance</label><div class="field-control"><input id="waste" type="number" min="0" max="100" step="0.5" value="10" inputmode="decimal"><select disabled aria-label="Waste unit"><option>%</option></select></div><div class="hint">A common estimating allowance; adjust for your project.</div></div>
          </div>
          <div id="calcError" class="error" role="alert"></div>
          <div class="actions"><button class="btn btn-primary" id="calculate" type="button">Calculate</button><button class="btn btn-secondary" id="share" type="button" disabled>Share Calculation</button></div>
        </div>
      </div>

      <section class="result-card" aria-live="polite">
        <div class="result-top"><div class="result-kicker">Concrete required</div><div class="result-number"><span id="yards">—</span><span class="result-unit">yd³</span></div></div>
        <div class="result-grid">
          <div class="result-stat"><span class="result-label">Base volume</span><span class="result-value" id="baseVolume">—</span></div>
          <div class="result-stat"><span class="result-label">With waste</span><span class="result-value" id="wasteVolume">—</span></div>
          <div class="result-stat"><span class="result-label">Cubic feet</span><span class="result-value" id="cubicFeet">—</span></div>
        </div>
        <div class="result-note">Order quantities should be confirmed against the supplier's load requirements, site conditions, forms, reinforcement, and any required over-excavation or grade changes.</div>
      </section>

      <section class="info-grid">
        <article class="info-card"><h2>Formula</h2><div class="formula">Volume = Length × Width × Thickness<br>Cubic yards = Cubic feet ÷ 27<br>Order volume = Volume × (1 + waste ÷ 100)</div></article>
        <article class="info-card"><h2>How it works</h2><p>The calculator converts all dimensions to feet, multiplies length × width × thickness, converts the result from cubic feet to cubic yards, then applies the selected waste allowance.</p></article>
      </section>

      <section class="calc-card history"><div class="calc-card-header"><h2>Calculation history</h2><p>Successful calculations are stored in this browser only. No account is required.</p></div><div class="calc-body"><div id="historyList" class="history-list"><div class="empty">No saved calculations yet.</div></div></div></section>
    </section>
    <aside class="side-ad" aria-label="Advertisement">Advertisement</aside>
  </div>
</div>

<script>
(function(){
  'use strict';
  var KEY='wanjaaro:concrete-slab-history:v1', last=null;
  var $=function(id){return document.getElementById(id)};
  function num(id){return parseFloat($(id).value)}
  function toFeet(value,unit){if(unit==='m')return value*3.280839895; if(unit==='cm')return value*0.03280839895; if(unit==='in')return value/12; return value}
  function round(v,d){var p=Math.pow(10,d);return Math.round(v*p)/p}
  function read(){return {length:num('length'),width:num('width'),thickness:num('thickness'),waste:num('waste'),lengthUnit:$('lengthUnit').value,widthUnit:$('widthUnit').value,thicknessUnit:$('thicknessUnit').value}}
  function calculate(save){
    var x=read(), err=$('calcError');
    if(![x.length,x.width,x.thickness,x.waste].every(Number.isFinite)||x.length<=0||x.width<=0||x.thickness<=0||x.waste<0||x.waste>100){err.textContent='Enter positive dimensions and a waste allowance from 0% to 100%.';err.classList.add('show');$('share').disabled=true;return false}
    err.classList.remove('show');
    var l=toFeet(x.length,x.lengthUnit), w=toFeet(x.width,x.widthUnit), t=toFeet(x.thickness,x.thicknessUnit), base=l*w*t, ordered=base*(1+x.waste/100), yards=ordered/27;
    $('yards').textContent=round(yards,2).toLocaleString();$('baseVolume').textContent=round(base/27,2).toLocaleString()+' yd³';$('wasteVolume').textContent=round(ordered/27,2).toLocaleString()+' yd³';$('cubicFeet').textContent=round(ordered,1).toLocaleString()+' ft³';$('share').disabled=false;
    last={inputs:x,result:{yards:round(yards,2),baseYards:round(base/27,2),cubicFeet:round(ordered,1)},time:new Date().toISOString()};
    if(save!==false)saveHistory(last); return true;
  }
  function loadHistory(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function saveHistory(item){var h=loadHistory();h.unshift(item);h=h.slice(0,20);try{localStorage.setItem(KEY,JSON.stringify(h))}catch(e){} renderHistory()}
  function renderHistory(){var list=$('historyList'),h=loadHistory();if(!h.length){list.innerHTML='<div class="empty">No saved calculations yet.</div>';return}list.innerHTML=h.map(function(item,i){var d=new Date(item.time);return '<div class="history-item"><div><strong>'+item.result.yards.toLocaleString()+' yd³</strong><div class="history-meta">'+d.toLocaleString()+'</div></div><div class="history-actions"><button class="mini-btn" data-restore="'+i+'">Restore</button><button class="mini-btn" data-delete="'+i+'">Delete</button></div></div>'}).join('')}
  function restore(i){var h=loadHistory(),x=h[i]&&h[i].inputs;if(!x)return; $('length').value=x.length;$('width').value=x.width;$('thickness').value=x.thickness;$('waste').value=x.waste;$('lengthUnit').value=x.lengthUnit;$('widthUnit').value=x.widthUnit;$('thicknessUnit').value=x.thicknessUnit;calculate(false);window.scrollTo({top:0,behavior:'smooth'})}
  $('calculate').addEventListener('click',function(){calculate(true)});$('share').addEventListener('click',function(){if(!last||!calculate(false))return;var payload=btoa(unescape(encodeURIComponent(JSON.stringify(last.inputs)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');var url=location.origin+location.pathname+'?share='+payload;navigator.clipboard?navigator.clipboard.writeText(url).then(function(){alert('Share URL copied to clipboard.')},function(){prompt('Copy this share URL:',url)}):prompt('Copy this share URL:',url)});
  $('historyList').addEventListener('click',function(e){var r=e.target.getAttribute('data-restore'),d=e.target.getAttribute('data-delete');if(r!==null)restore(+r);if(d!==null){var h=loadHistory();h.splice(+d,1);localStorage.setItem(KEY,JSON.stringify(h));renderHistory()}});
  var params=new URLSearchParams(location.search),share=params.get('share');
  if(share){try{var input=JSON.parse(decodeURIComponent(escape(atob(share.replace(/-/g,'+').replace(/_/g,'/')))));Object.keys(input).forEach(function(k){if($(k)||$(k+'Unit')){if($(k))$(k).value=input[k];else $(k+'Unit').value=input[k]}});calculate(false);var m=document.querySelector('meta[name="robots"]');if(m)m.content='noindex,follow';}catch(e){}}
  renderHistory(); if(!share)calculate(false);
})();
</script>
