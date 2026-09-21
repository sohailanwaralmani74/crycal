---
layout: default
title: "Steady Hand Tracing Test — Wanjaaro"
description: "Trace a winding path with your pointer while staying inside its boundaries in this browser-based precision test."
permalink: /steady-hand-tracing
category: aim
sidebar: true
sidebar_title: "Steady Hand Tracing"
sidebar_subtitle: "Pointer control challenge"
sidebar_icon: "〰️"
---

<div class="benchmark-container">
<section class="benchmark-hero"><span class="benchmark-badge playable">Aim Test</span><h1>Steady Hand Tracing Test</h1><p>Guide your pointer through a winding path from start to finish. Stay inside the corridor and reach the end without crossing its edges.</p></section>
<section class="benchmark-content-block"><h2>Trace the Route</h2><p>Click the green start point to begin, then drag the pointer along the route. Keep the pointer inside the corridor and release only after reaching the red end point.</p></section>
<div class="test-arena-wrapper"><canvas id="trace-canvas" class="test-arena" width="800" height="360" style="display:block;width:100%;height:auto;touch-action:none;cursor:crosshair;"></canvas></div>
<div class="test-stats-bar"><div class="test-stat-item"><div class="test-stat-label">Progress</div><div class="test-stat-val" id="trace-progress">0%</div></div><div class="test-stat-item"><div class="test-stat-label">Errors</div><div class="test-stat-val" id="trace-errors">0</div></div><div class="test-stat-item"><div class="test-stat-label">Time</div><div class="test-stat-val" id="trace-time">--</div></div><div class="test-stat-item"><div class="test-stat-label">PB</div><div class="test-stat-val" id="trace-pb">--</div></div></div>
<div id="trace-summary" class="test-summary-card" style="display:none;"><span class="benchmark-badge playable">Route Complete</span><h2 id="trace-result">--</h2><p class="test-summary-rating">Errors count pointer positions that moved outside the route corridor.</p><div class="summary-actions"><button id="trace-restart" class="btn btn-primary">Run Again</button><button id="trace-copy" class="btn btn-accent">Copy Result 📋</button></div></div>
<section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>Precision, Not Just Speed</h2><p>The route rewards controlled movement.</p></div></div><p>A fast trace with repeated boundary crossings will produce a different result from a slower trace that stays inside the route. The error count makes that difference visible.</p></section>
<section class="benchmark-dashboard"><div class="dashboard-header"><div class="dashboard-title-group"><h2>Keep Your Setup Consistent</h2><p>Pointer sensitivity changes the physical movement required.</p></div></div><p>Use the same pointer settings and browser zoom when comparing your own attempts.</p></section>
</div>
<script>
(function(){
var c=document.getElementById('trace-canvas'),x=c.getContext('2d'),prog=document.getElementById('trace-progress'),err=document.getElementById('trace-errors'),time=document.getElementById('trace-time'),pb=document.getElementById('trace-pb'),sum=document.getElementById('trace-summary'),res=document.getElementById('trace-result');
var running=false,dragging=false,errors=0,startTime=0,lastT=0,outside=false,best=localStorage.getItem('wanjaaro_pb_steady_hand');
if(best)pb.textContent=best+' errors';

function pathPoint(t){return{x:55+t*690,y:180+95*Math.sin(t*Math.PI*2)+35*Math.sin(t*Math.PI*5)};}
function draw(){
 x.clearRect(0,0,c.width,c.height);x.lineCap='round';x.lineJoin='round';
 x.lineWidth=58;x.beginPath();
 for(var i=0;i<=240;i++){var p=pathPoint(i/240);i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y);}
 x.strokeStyle='#d9dde2';x.stroke();
 x.lineWidth=42;x.strokeStyle='#5b6670';x.stroke();
 var st=pathPoint(0),en=pathPoint(1);
 x.fillStyle='#3aa76d';x.beginPath();x.arc(st.x,st.y,22,0,Math.PI*2);x.fill();
 x.fillStyle='#d94b4b';x.beginPath();x.arc(en.x,en.y,22,0,Math.PI*2);x.fill();
}
function nearest(px,py){
 var bestT=0,bestD=Infinity;
 for(var i=0;i<480;i++){
   var t=i/480,p=pathPoint(t),d=Math.hypot(px-p.x,py-p.y);
   if(d<bestD){bestD=d;bestT=t;}
 }
 return{t:bestT,d:bestD};
}
function coords(e){var r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
function reset(){running=false;dragging=false;errors=0;lastT=0;outside=false;prog.textContent='0%';err.textContent='0';time.textContent='--';sum.style.display='none';draw();}
function finish(){
 running=false;dragging=false;
 var sec=(performance.now()-startTime)/1000;time.textContent=sec.toFixed(2)+'s';
 res.textContent=sec.toFixed(2)+' seconds · '+errors+' errors';sum.style.display='block';
 if(!best||errors<parseInt(best,10)){localStorage.setItem('wanjaaro_pb_steady_hand',errors);pb.textContent=errors+' errors (New PB!)';best=String(errors);}
}
c.addEventListener('pointerdown',function(e){
 var p=coords(e),n=nearest(p.x,p.y);
 if(n.t<.08&&n.d<=30){
   running=true;dragging=true;errors=0;lastT=0;outside=false;startTime=performance.now();
   prog.textContent='0%';err.textContent='0';c.setPointerCapture(e.pointerId);
 }
});
c.addEventListener('pointermove',function(e){
 if(!running||!dragging)return;
 var p=coords(e),n=nearest(p.x,p.y);
 var inside=n.d<=29;
 if(!inside&&!outside){errors++;err.textContent=errors;outside=true;}
 if(inside)outside=false;
 if(n.t>=lastT){lastT=n.t;prog.textContent=Math.round(n.t*100)+'%';}
});
c.addEventListener('pointerup',function(e){
 if(!running)return;
 var p=coords(e),n=nearest(p.x,p.y);
 dragging=false;
 if(c.releasePointerCapture)c.releasePointerCapture(e.pointerId);
 if(n.t>.97&&n.d<=32){finish();}
 else if(n.t>.97){status.textContent='Reach the red end point while keeping the pointer inside the route.';}
 else{status.textContent='Keep dragging to the red end point.';}
});
c.addEventListener('pointercancel',function(){dragging=false;});
document.getElementById('trace-restart').onclick=reset;
document.getElementById('trace-copy').onclick=function(){navigator.clipboard&&navigator.clipboard.writeText('〰️ Wanjaaro Steady Hand: '+time.textContent+', '+errors+' errors\nhttps://wanjaaro.com/steady-hand-tracing');};
draw();
})();
</script>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":"https://wanjaaro.com/steady-hand-tracing","name":"Steady Hand Tracing Test — Wanjaaro"},{"@type":"WebApplication","url":"https://wanjaaro.com/steady-hand-tracing","name":"Wanjaaro Steady Hand Tracing Test","applicationCategory":"EducationalApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Wanjaaro","item":"https://wanjaaro.com/"},{"@type":"ListItem","position":2,"name":"Aim & Precision Tests","item":"https://wanjaaro.com/aim"},{"@type":"ListItem","position":3,"name":"Steady Hand Tracing","item":"https://wanjaaro.com/steady-hand-tracing"}]}]}</script>
