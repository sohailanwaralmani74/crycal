---
layout: calculator
title: "Concrete Slab Calculator — Calculate Concrete Needed"
description: "Calculate concrete volume and cubic yards needed for a rectangular slab. Enter dimensions, choose units, add waste, and get an instant estimate."
permalink: /concrete-slab-calculator
category: concrete
---

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebApplication","name":"Concrete Slab Calculator","url":"https://wanjaaro.com/concrete-slab-calculator","applicationCategory":"UtilitiesApplication","operatingSystem":"Any","description":"Browser-based calculator for estimating concrete volume and cubic yards required for a rectangular slab."}
</script>

<div class="slab-page" data-calculator="concrete-slab">
  <nav class="slab-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/">Concrete</a><span>/</span><span aria-current="page">Concrete Slab Calculator</span></nav>

  <header class="slab-hero">
    <p class="slab-eyebrow">Concrete &amp; Foundations</p>
    <h1>Concrete Slab Calculator</h1>
    <p>Calculate how much concrete you need for a rectangular slab. Enter the slab dimensions, choose your units, and add a waste allowance to get the estimated order quantity.</p>
  </header>

  <div class="slab-workspace">
    <div class="slab-tool">
      <div class="slab-tool-top">
      <section class="slab-panel input-panel">
        <div class="panel-heading"><h2>Slab dimensions</h2><p>Enter the finished dimensions of the slab.</p></div>
        <div class="slab-fields">
          <div class="slab-field"><label for="length">Length</label><div class="unit-control"><input id="length" type="number" min="0" step="any" value="20" inputmode="decimal"><select id="lengthUnit" aria-label="Length unit"><option value="ft">ft</option><option value="m">m</option><option value="in">in</option><option value="cm">cm</option></select></div></div>
          <div class="slab-field"><label for="width">Width</label><div class="unit-control"><input id="width" type="number" min="0" step="any" value="10" inputmode="decimal"><select id="widthUnit" aria-label="Width unit"><option value="ft">ft</option><option value="m">m</option><option value="in">in</option><option value="cm">cm</option></select></div></div>
          <div class="slab-field"><label for="thickness">Thickness</label><div class="unit-control"><input id="thickness" type="number" min="0" step="any" value="4" inputmode="decimal"><select id="thicknessUnit" aria-label="Thickness unit"><option value="in">in</option><option value="ft">ft</option><option value="cm">cm</option><option value="m">m</option></select></div></div>
          <div class="slab-field"><label for="waste">Waste allowance</label><div class="unit-control"><input id="waste" type="number" min="0" max="100" step="0.5" value="10" inputmode="decimal"><span class="unit-static">%</span></div></div>
        </div>
        <p class="field-note">Waste is an estimating allowance. Adjust it for site conditions, forms, grade changes, and supplier requirements.</p>
        <div id="calcError" class="slab-error" role="alert"></div>
        <div class="slab-actions"><button id="calculate" class="slab-btn primary" type="button">Calculate</button><button id="share" class="slab-btn secondary" type="button" disabled>Share Calculation</button></div>
      </section>

      <section class="slab-panel result-panel" aria-live="polite">
        <div class="result-heading"><div><p class="result-label">Estimated order quantity</p><div class="result-main"><span id="yards">—</span><span>yd³</span></div></div><p class="result-context">Includes your selected waste allowance.</p></div>
        <div class="result-details">
          <div><span>Base volume</span><strong id="baseVolume">—</strong></div>
          <div><span>With waste</span><strong id="wasteVolume">—</strong></div>
          <div><span>Cubic feet</span><strong id="cubicFeet">—</strong></div>
        </div>
      </section>
      </div>

      <div class="slab-info-row">
        <section class="slab-panel info-panel"><h2>Formula</h2><p>Volume = Length × Width × Thickness</p><p>Cubic yards = Cubic feet ÷ 27</p><p>Order volume = Volume × (1 + waste ÷ 100)</p></section>
        <section class="slab-panel info-panel"><h2>How it works</h2><p>All dimensions are converted to feet before the volume is calculated. The base volume is converted to cubic yards, then the selected waste allowance is added.</p></section>
      </div>

      <section class="slab-panel history-panel"><div class="panel-heading"><h2>Calculation history</h2><p>Saved locally in this browser. No account is required.</p></div><div id="historyList" class="history-list"><p class="history-empty">No saved calculations yet.</p></div></section>
    </div>
    <aside class="slab-ad" aria-label="Advertisement"><span>Advertisement</span></aside>
  </div>
<div id="slabToast" class="slab-toast" role="status" aria-live="polite"></div>
<div id="slabToast" class="slab-toast" role="status" aria-live="polite"></div>

<style>
:root{--slab-ink:#263238;--slab-muted:#66737a;--slab-border:#d9dfe2;--slab-paper:#fff;--slab-surface:#f6f7f7;--slab-accent:#176b68;--slab-accent-dark:#0f514f}
.slab-page{font-family:var(--font-sans);max-width:1180px;margin:0 auto;padding:0 28px 60px;color:var(--slab-ink)}
.slab-breadcrumb{display:flex;gap:9px;align-items:center;font-size:13px;color:var(--slab-muted);padding:20px 0}.slab-breadcrumb a{color:var(--slab-muted);text-decoration:none}.slab-breadcrumb a:hover{color:var(--slab-accent)}
.slab-hero{padding:18px 0 28px;border-bottom:1px solid var(--slab-border)}.slab-eyebrow{font-size:12px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--slab-accent);margin:0 0 8px}.slab-hero h1{font-family:var(--font-sans);font-size:34px;line-height:1.2;letter-spacing:-.025em;font-weight:650;margin:0 0 10px}.slab-hero>p:last-child{max-width:760px;font-size:16px;line-height:1.65;color:var(--slab-muted);margin:0}
.slab-workspace{display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:26px;margin-top:26px}.slab-tool{min-width:0}.slab-ad{min-height:280px;border:1px dashed #cbd2d5;background:#fafafa;display:flex;align-items:center;justify-content:center;color:#8a9499;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
.slab-tool-top{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);gap:18px;align-items:stretch}.slab-panel{background:var(--slab-paper);border:1px solid var(--slab-border);border-radius:5px}.input-panel{padding:24px}.panel-heading h2,.info-panel h2{font-family:var(--font-sans);font-size:18px;font-weight:650;line-height:1.3;margin:0 0 4px}.panel-heading p{font-size:13px;color:var(--slab-muted);margin:0}.slab-fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:22px}.slab-field label{display:block;font-size:13px;font-weight:600;margin:0 0 7px;color:#35434a}.unit-control{height:44px;display:flex;border:1px solid #cbd3d7;border-radius:5px;background:#fff;overflow:hidden}.unit-control:focus-within{border-color:var(--slab-accent);box-shadow:0 0 0 2px rgba(23,107,104,.10)}.unit-control input{min-width:0;flex:1;border:0;outline:0;padding:0 11px;font:inherit;font-size:15px;color:var(--slab-ink);background:transparent}.unit-control select,.unit-static{width:58px;border:0;border-left:1px solid #dfe4e6;background:#f7f8f8;padding:0 8px;font-size:13px;color:#4d5a60;display:flex;align-items:center;justify-content:center}.unit-control select{cursor:pointer}.field-note{font-size:12px;line-height:1.5;color:var(--slab-muted);margin:12px 0 0}.slab-error{display:none;color:#9b3d32;font-size:13px;margin-top:14px}.slab-error.show{display:block}.slab-actions{display:flex;gap:10px;margin-top:22px}.slab-btn{height:42px;padding:0 17px;border-radius:5px;font:600 14px var(--font-sans);cursor:pointer}.slab-btn.primary{border:1px solid var(--slab-accent);background:var(--slab-accent);color:#fff}.slab-btn.primary:hover{background:var(--slab-accent-dark)}.slab-btn.secondary{border:1px solid #cbd3d7;background:#fff;color:#344248}.slab-btn.secondary:hover:not(:disabled){border-color:var(--slab-accent);color:var(--slab-accent)}.slab-btn:disabled{opacity:.48;cursor:not-allowed}
.result-panel{margin-top:0;padding:24px;background:#f2f6f5;border-color:#c9d9d7}.result-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:20px}.result-label{font-size:12px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:#52706d;margin:0 0 4px}.result-main{display:flex;align-items:baseline;gap:8px;color:#164f4c}.result-main span:first-child{font-size:38px;line-height:1.1;font-weight:700;letter-spacing:-.025em}.result-main span:last-child{font-size:17px;font-weight:600}.result-context{font-size:12px;color:var(--slab-muted);margin:0}.result-details{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #d3dfdd;margin-top:20px;padding-top:16px;gap:20px}.result-details div{display:flex;flex-direction:column;gap:3px}.result-details span{font-size:12px;color:var(--slab-muted)}.result-details strong{font-size:16px;font-weight:650;color:#26383b}
.slab-info-row{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.info-panel{padding:20px}.info-panel p{font-size:13px;line-height:1.6;color:var(--slab-muted);margin:8px 0 0}.history-panel{margin-top:18px;padding:20px}.history-list{margin-top:18px}.history-empty{font-size:13px;color:var(--slab-muted);margin:0}.history-item{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:13px 0;border-top:1px solid #e4e8e9}.history-item:first-child{border-top:0}.history-inputs{font-size:13px;line-height:1.55;color:#35434a}.history-inputs strong{font-weight:600;color:#263238}.history-item strong{font-size:14px}.history-meta{font-size:11px;color:#7b858a;margin-top:2px}.history-actions{display:flex;gap:7px;flex-shrink:0}.slab-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,12px);background:#263238;color:#fff;border-radius:4px;padding:10px 14px;font:500 13px var(--font-sans);box-shadow:0 6px 20px rgba(0,0,0,.16);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .18s,transform .18s,visibility .18s;z-index:3000}.slab-toast.show{opacity:1;visibility:visible;transform:translate(-50%,0)}.mini-btn{font:600 12px var(--font-sans);border:1px solid #ccd4d7;background:#fff;border-radius:4px;padding:7px 10px;cursor:pointer}.mini-btn:hover{border-color:var(--slab-accent);color:var(--slab-accent)}
@media(max-width:980px){.slab-workspace{grid-template-columns:1fr}.slab-ad{min-height:150px;order:2}.slab-tool-top{grid-template-columns:1fr}.result-panel{min-height:240px}}
@media(max-width:600px){.slab-page{padding:0 16px 40px}.slab-hero h1{font-size:28px}.slab-fields{grid-template-columns:1fr}.slab-info-row{grid-template-columns:1fr}.result-heading{display:block}.result-context{margin-top:10px}.result-details{grid-template-columns:1fr 1fr}.slab-actions{flex-wrap:wrap}.slab-btn{flex:1}.history-item{align-items:flex-start;flex-direction:column}.slab-ad{min-height:120px}}
 .slab-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,10px);background:#263238;color:#fff;border-radius:4px;padding:10px 14px;font-size:13px;opacity:0;visibility:hidden;transition:.18s;z-index:3000}.slab-toast.show{opacity:1;visibility:visible;transform:translate(-50%,0)}
</style>

<script>
(function(){'use strict';
var KEY='wanjaaro:concrete-slab-history:v2',last=null,$=function(id){return document.getElementById(id)};
function n(id){return parseFloat($(id).value)}
function feet(v,u){return u==='m'?v*3.280839895:u==='cm'?v*.03280839895:u==='in'?v/12:v}
function r(v,d){var p=Math.pow(10,d);return Math.round(v*p)/p}
function read(){return{length:n('length'),width:n('width'),thickness:n('thickness'),waste:n('waste'),lengthUnit:$('lengthUnit').value,widthUnit:$('widthUnit').value,thicknessUnit:$('thicknessUnit').value}}
function calculate(save){var x=read(),err=$('calcError');if(![x.length,x.width,x.thickness,x.waste].every(Number.isFinite)||x.length<=0||x.width<=0||x.thickness<=0||x.waste<0||x.waste>100){err.textContent='Enter positive dimensions and a waste allowance from 0% to 100%.';err.classList.add('show');$('share').disabled=true;return false}err.classList.remove('show');var base=feet(x.length,x.lengthUnit)*feet(x.width,x.widthUnit)*feet(x.thickness,x.thicknessUnit),ordered=base*(1+x.waste/100),yards=ordered/27;$('yards').textContent=r(yards,2).toLocaleString();$('baseVolume').textContent=r(base/27,2).toLocaleString()+' yd³';$('wasteVolume').textContent=r(ordered/27,2).toLocaleString()+' yd³';$('cubicFeet').textContent=r(ordered,1).toLocaleString()+' ft³';$('share').disabled=false;last={inputs:x,result:{yards:r(yards,2),baseYards:r(base/27,2),cubicFeet:r(ordered,1)},time:new Date().toISOString()};if(save!==false)saveHistory(last);return true}
function history(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function saveHistory(x){var h=history();h.unshift(x);try{localStorage.setItem(KEY,JSON.stringify(h.slice(0,20)))}catch(e){}renderHistory()}
function renderHistory(){var list=$('historyList'),h=history();if(!h.length){list.innerHTML='<p class="history-empty">No saved calculations yet.</p>';return}list.innerHTML=h.map(function(x,i){var a=x.inputs;return'<div class="history-item"><div class="history-inputs"><strong>Slab dimensions</strong> — '+a.length+' '+a.lengthUnit+' × '+a.width+' '+a.widthUnit+' × '+a.thickness+' '+a.thicknessUnit+'<div>Waste allowance: '+a.waste+'%</div><div class="history-meta">'+new Date(x.time).toLocaleString()+'</div></div><div class="history-actions"><button class="mini-btn" data-r="'+i+'">Restore</button><button class="mini-btn" data-d="'+i+'">Delete</button></div></div>'}).join('')}
function restore(i){var x=history()[i].inputs;['length','width','thickness','waste'].forEach(function(k){$(k).value=x[k]});$('lengthUnit').value=x.lengthUnit;$('widthUnit').value=x.widthUnit;$('thicknessUnit').value=x.thicknessUnit;calculate(false);window.scrollTo({top:0,behavior:'smooth'})}
$('calculate').addEventListener('click',function(){calculate(true)});function showToast(message){var t=document.getElementById('slabToast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(window.__slabToastTimer);window.__slabToastTimer=setTimeout(function(){t.classList.remove('show')},2200)}
$('share').addEventListener('click',function(){if(!last||!calculate(false))return;var payload=btoa(unescape(encodeURIComponent(JSON.stringify(last.inputs)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');var url=location.origin+location.pathname+'?share='+payload;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(url).then(function(){showToast('Share URL copied to clipboard')},function(){showToast('Could not copy the share URL')})}else{var ta=document.createElement('textarea');ta.value=url;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);showToast(ok?'Share URL copied to clipboard':'Could not copy the share URL')}});
$('historyList').addEventListener('click',function(e){var ri=e.target.getAttribute('data-r'),di=e.target.getAttribute('data-d');if(ri!==null)restore(+ri);if(di!==null){var h=history();h.splice(+di,1);localStorage.setItem(KEY,JSON.stringify(h));renderHistory()}});
var share=new URLSearchParams(location.search).get('share');if(share){try{var x=JSON.parse(decodeURIComponent(escape(atob(share.replace(/-/g,'+').replace(/_/g,'/')))));Object.keys(x).forEach(function(k){if($(k))$(k).value=x[k]});calculate(false);var meta=document.querySelector('meta[name="robots"]');if(meta)meta.content='noindex,follow'}catch(e){}}else calculate(false);renderHistory();
})();
</script>
