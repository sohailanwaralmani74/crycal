/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Churn by Cohort Calculator
   Tool ID: churn-by-cohort-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'retention';

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
      startingUsers: parseFloat(document.getElementById('input_starting_users')?.value) || 0,
      activeUsers: parseFloat(document.getElementById('input_active_users')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var startingUsers = inputs.startingUsers;
    var activeUsers = Math.min(inputs.activeUsers, startingUsers);
    var churnedUsers = Math.max(0, startingUsers - activeUsers);

    var churnRate = startingUsers > 0 ? (churnedUsers / startingUsers) * 100 : 0;
    var retentionRate = startingUsers > 0 ? (activeUsers / startingUsers) * 100 : 0;

    setOutputText('churned_users', churnedUsers.toFixed(0));
    setOutputText('output_churned_users', churnedUsers.toFixed(0));
    setOutputText('cohort_churn_rate', churnRate.toFixed(2) + '%');
    setOutputText('output_cohort_churn_rate', churnRate.toFixed(2) + '%');
    setOutputText('retention_rate', retentionRate.toFixed(2) + '%');
    setOutputText('output_retention_rate', retentionRate.toFixed(2) + '%');

    updateCharts({
      active: activeUsers,
      churned: churnedUsers,
      churnRate: churnRate,
      retentionRate: retentionRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingUsers: startingUsers,
        activeUsers: activeUsers,
        churnedUsers: churnedUsers,
        churnRate: churnRate.toFixed(2) + '%',
        retentionRate: retentionRate.toFixed(2) + '%'
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

    if (currentTab === 'rates' || currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Retention Rate (%)', 'Churn Rate (%)'],
          datasets: [{
            label: 'Percentage (%)',
            data: [data.retentionRate, data.churnRate],
            backgroundColor: ['#2ecc71', '#e74c3c']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Retained Users', 'Churned Users'],
          datasets: [{
            data: [data.active, data.churned],
            backgroundColor: ['#2ecc71', '#e74c3c']
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
    var startEl = document.getElementById('input_starting_users');
    var activeEl = document.getElementById('input_active_users');
    if (startEl) startEl.value = '500';
    if (activeEl) activeEl.value = '400';
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
