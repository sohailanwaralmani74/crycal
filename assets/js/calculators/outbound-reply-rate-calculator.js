/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Outbound Reply Rate Calculator
   Tool ID: outbound-reply-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function setOutputText(id, text) {
    var el = document.getElementById(id) || document.getElementById('output_' + id);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = text;
      } else {
        var numEl = el.querySelector('.output-number');
        if (numEl) numEl.textContent = text;
        else el.textContent = text;
      }
    }
  }

  function getInputs() {
    return {
      sent: parseFloat(document.getElementById('input_emails_sent')?.value) || 0,
      replies: parseFloat(document.getElementById('input_replies_received')?.value) || 0,
      positive: parseFloat(document.getElementById('input_positive_replies')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var sent = inputs.sent;
    var replies = Math.min(inputs.replies, sent);
    var positive = Math.min(inputs.positive, replies);

    var totalReplyRate = sent > 0 ? (replies / sent) * 100 : 0;
    var positiveReplyRate = sent > 0 ? (positive / sent) * 100 : 0;
    var neutralReplies = Math.max(0, replies - positive);
    var noReply = Math.max(0, sent - replies);

    setOutputText('total_reply_rate', totalReplyRate.toFixed(2) + '%');
    setOutputText('output_total_reply_rate', totalReplyRate.toFixed(2) + '%');
    setOutputText('positive_reply_rate', positiveReplyRate.toFixed(2) + '%');
    setOutputText('output_positive_reply_rate', positiveReplyRate.toFixed(2) + '%');

    updateCharts({
      sent: sent,
      replies: replies,
      positive: positive,
      neutral: neutralReplies,
      noReply: noReply,
      totalReplyRate: totalReplyRate,
      positiveReplyRate: positiveReplyRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        emailsSent: sent,
        repliesReceived: replies,
        positiveReplies: positive,
        totalReplyRate: totalReplyRate.toFixed(2) + '%',
        positiveReplyRate: positiveReplyRate.toFixed(2) + '%'
      });
    }
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (currentTab === 'bar' || currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Positive Replies', 'Neutral / Other Replies', 'No Reply'],
          datasets: [{
            label: 'Emails',
            data: [data.positive, data.neutral, data.noReply],
            backgroundColor: ['#10b981', '#f59e0b', '#cbd5e1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Positive Replies', 'Neutral / Other Replies', 'No Reply'],
          datasets: [{
            data: [data.positive, data.neutral, data.noReply],
            backgroundColor: ['#10b981', '#f59e0b', '#cbd5e1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.chart-tab').forEach(function(t) {
      if ((t.dataset && t.dataset.tab === tabId) || (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf(tabId) !== -1)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    updateTool();
  }

  function resetTool() {
    var s = document.getElementById('input_emails_sent');
    var r = document.getElementById('input_replies_received');
    var p = document.getElementById('input_positive_replies');
    if (s) s.value = '1000';
    if (r) r.value = '50';
    if (p) p.value = '10';
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select, input[id^="input_"]').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    updateTool();
  });
  setTimeout(updateTool, 100);
})();
