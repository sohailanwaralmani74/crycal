---
layout: default
title: "Daily Benchmark Challenge — Wanjaaro"
description: "A synchronized daily challenge for everyone that resets at midnight. Track your streaks, personal records, and daily percentiles."
permalink: /daily
---

<div class="benchmark-container">
  <div class="benchmark-hero">
    <span class="benchmark-badge daily" style="margin-bottom: 0.5rem; display: inline-block;">Resets at Midnight UTC</span>
    <h1>Daily Benchmark Challenge</h1>
    <p>Every day at midnight, a fresh synchronized challenge unlocks. Complete today's seed, maintain your daily streak, and share your score card!</p>
  </div>

  <div class="test-stats-bar" style="margin-bottom: 2rem;">
    <div class="test-stat-item">
      <div class="test-stat-label">Daily Streak</div>
      <div class="test-stat-val" id="daily-streak">0 Days</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Today's Date</div>
      <div class="test-stat-val" id="today-date">--</div>
    </div>
    <div class="test-stat-item">
      <div class="test-stat-label">Status</div>
      <div class="test-stat-val" id="daily-status" style="color:#067c7a;">Ready</div>
    </div>
  </div>

  <div style="background:#ffffff; border:1px solid var(--border-default); border-radius:14px; padding:2rem; margin-bottom: 2rem;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
      <div>
        <span class="benchmark-badge playable" style="margin-bottom:0.5rem; display:inline-block;">Today's Event</span>
        <h2 style="font-size:1.8rem; color:var(--ink); margin:0 0 0.5rem; padding-left:0; border-left:none;" id="daily-event-title">Daily Reaction Time &amp; Aim Challenge</h2>
        <p style="color:var(--text-muted); max-width:650px; line-height:1.6; margin:0;" id="daily-event-desc">
          Test your neurological reaction speed over 5 standardized rounds. Every player worldwide gets the exact same seed pattern today!
        </p>
      </div>
      <a href="/reaction-time?daily=true" id="daily-play-btn" class="btn-primary" style="padding: 0.85rem 1.75rem; text-decoration:none; font-weight:700; border-radius:8px; display:inline-block; font-size:1rem; background:#07dbd7; color:#082633;">
        Play Today's Challenge &rarr;
      </a>
    </div>
  </div>

  <h3 style="font-size:1.3rem; margin:2.5rem 0 1rem; padding-left:0; border-left:none;">Weekly Rotation Schedule</h3>
  <div class="benchmark-card-grid">
    <div class="benchmark-card">
      <div class="benchmark-card-header">
        <span class="benchmark-card-icon">⚡</span>
        <span class="benchmark-badge playable">Monday &amp; Thursday</span>
      </div>
      <div class="benchmark-card-title">Daily Reaction Time Challenge</div>
      <div class="benchmark-card-desc">Standardized 5-trial visual reaction test with streak tracking and global percentile bracket estimation.</div>
    </div>

    <div class="benchmark-card">
      <div class="benchmark-card-header">
        <span class="benchmark-card-icon">🐒</span>
        <span class="benchmark-badge playable">Tuesday &amp; Friday</span>
      </div>
      <div class="benchmark-card-title">Daily Chimp &amp; Memory Test</div>
      <div class="benchmark-card-desc">Push your working memory span with the Ayumu chimp test sequence. Compare level reached with yesterday's performance.</div>
    </div>

    <div class="benchmark-card">
      <div class="benchmark-card-header">
        <span class="benchmark-card-icon">⌨️</span>
        <span class="benchmark-badge playable">Wednesday &amp; Saturday</span>
      </div>
      <div class="benchmark-card-title">Daily Typing Passage</div>
      <div class="benchmark-card-desc">The exact same 150-word literary passage served to all typists. Benchmark net WPM and flawless accuracy streaks.</div>
    </div>

    <div class="benchmark-card">
      <div class="benchmark-card-header">
        <span class="benchmark-card-icon">🧩</span>
        <span class="benchmark-badge playable">Sunday Special</span>
      </div>
      <div class="benchmark-card-title">Sunday Logic &amp; Pattern Sprint</div>
      <div class="benchmark-card-desc">Comprehensive cognitive pentathlon: Stroop interference + Simon sequence + target flick sprint combined into a composite score.</div>
    </div>
  </div>
</div>

<script>
(function() {
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('today-date').textContent = today;
  
  var streak = parseInt(localStorage.getItem('wanjaaro_daily_streak') || '0', 10);
  var lastPlayed = localStorage.getItem('wanjaaro_daily_last_played');
  
  if (lastPlayed === today) {
    document.getElementById('daily-status').textContent = 'Completed Today! ✨';
    document.getElementById('daily-status').style.color = '#067c7a';
  } else {
    document.getElementById('daily-status').textContent = 'Ready to Play';
  }
  
  document.getElementById('daily-streak').textContent = streak + (streak === 1 ? ' Day' : ' Days');
})();
</script>
