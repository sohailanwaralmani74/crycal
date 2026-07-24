/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Customer Health Score Calculator
   Tool ID: customer-health-score-calculator
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
      usage: parseFloat(document.getElementById('input_product_usage')?.value) || 0,
      support: parseFloat(document.getElementById('input_support_tickets')?.value) || 0,
      feedback: parseFloat(document.getElementById('input_customer_feedback')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var usage = inputs.usage;
    var support = inputs.support;
    var feedback = inputs.feedback;

    var healthScore = (usage + support + feedback) / 3;

    setOutputText('health_score', healthScore.toFixed(1) + ' / 100');
    setOutputText('output_health_score', healthScore.toFixed(1) + ' / 100');

    updateCharts({
      usage: usage,
      support: support,
      feedback: feedback,
      health: healthScore
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        productUsage: usage,
        supportTickets: support,
        customerFeedback: feedback,
        healthScore: healthScore.toFixed(1)
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

    if (currentTab === 'radar' || currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Product Usage', 'Support Satisfaction', 'Customer Feedback'],
          datasets: [{
            label: 'Score',
            data: [data.usage, data.support, data.feedback],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { beginAtZero: true, max: 100 } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Usage', 'Support', 'Feedback', 'Overall Health'],
          datasets: [{
            label: 'Score (out of 100)',
            data: [data.usage, data.support, data.feedback, data.health],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 100 } }
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
    var u = document.getElementById('input_product_usage');
    var s = document.getElementById('input_support_tickets');
    var f = document.getElementById('input_customer_feedback');
    if (u) u.value = '80';
    if (s) s.value = '70';
    if (f) f.value = '90';
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
