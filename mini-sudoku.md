---
layout: default
title: "Mini Sudoku — Wanjaaro"
description: "Play a compact browser Sudoku puzzle and fill each row, column, and 2x3 box without repeating numbers."
permalink: /mini-sudoku
category: puzzles
sidebar: true
sidebar_title: "Mini Sudoku"
sidebar_subtitle: "Compact 6×6 Sudoku"
sidebar_icon: "✍️"
---
<div class="benchmark-container"><div class="benchmark-hero"><span class="benchmark-badge playable">Puzzle Game</span><h1>Mini Sudoku</h1><p>Fill the 6×6 grid so every row, column, and 2×3 box contains the numbers 1 through 6 once.</p></div><div class="tool-panel" style="max-width:520px;margin:auto;text-align:center"><div id="board" style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;max-width:420px;margin:20px auto"></div><button id="check" class="btn btn-primary">Check Puzzle</button> <button id="new" class="btn btn-secondary">New Puzzle</button><div id="msg" style="min-height:28px;margin-top:12px"></div></div></div>
<script>(function(){var b=document.getElementById('board'),msg=document.getElementById('msg'),solution=[1,2,3,4,5,6,4,5,6,1,2,3,2,3,4,5,6,1,5,6,1,2,3,4,3,4,5,6,1,2,6,1,2,3,4,5],puzzle=[1,0,3,0,5,0,0,5,0,1,0,3,2,0,4,0,6,0,0,6,1,0,3,4,3,0,0,6,0,2,6,1,0,3,4,0];function draw(){b.innerHTML='';puzzle.forEach(function(v,i){var x=document.createElement('input');x.type='text';x.inputMode='numeric';x.maxLength=1;x.value=v||'';x.disabled=!!v;x.style.cssText='width:100%;aspect-ratio:1;text-align:center;font-size:1.2rem;font-weight:700;border:1px solid var(--border-color);background:var(--surface-alt-color,#202633);color:var(--text-color);border-radius:4px';x.oninput=function(){x.value=x.value.replace(/[^1-6]/g,'');puzzle[i]=Number(x.value)||0};b.appendChild(x)})}document.getElementById('check').onclick=function(){msg.textContent=puzzle.every(function(v,i){return v===solution[i]})?'Solved!':'Some cells are incorrect or empty.'};document.getElementById('new').onclick=function(){puzzle=[1,0,3,0,5,0,0,5,0,1,0,3,2,0,4,0,6,0,0,6,1,0,3,4,3,0,0,6,0,2,6,1,0,3,4,0];msg.textContent='';draw()};draw()})()</script>