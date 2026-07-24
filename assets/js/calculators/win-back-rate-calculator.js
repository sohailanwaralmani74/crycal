/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Win-Back Rate Calculator
   Tool ID: win-back-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'doughnut';

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
      churnedPool: parseFloat(document.getElementById('input_total_churned_pool')?.value) || 0,
      reactivated: parseFloat(document.getElementById('input_reactivated_customers')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var churnedPool = inputs.churnedPool;
    var reactivated = Math.min(inputs.reactivated, churnedPool);
    var unrecovered = Math.max(0, churnedPool - reactivated);
    var winBackRate = churnedPool > 0 ? (reactivated / churnedPool) * 100 : 0;

    setOutputText('win_back_rate', winBackRate.toFixed(2) + '%');
    setOutputText('output_win_back_rate', winBackRate.toFixed(2) + '%');
    setOutputText('unrecovered_customers', unrecovered.toFixed(0));
    setOutputText('output_unrecovered_customers', unrecovered.toFixed(0));

    updateCharts({
      reactivated: reactivated,
      unrecovered: unrecovered,
      winBackRate: winBackRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        churnedPool: churnedPool,
        reactivated: reactivated,
        winBackRate: winBackRate.toFixed(2) + '%',
        unrecovered: unrecovered
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
          labels: ['Reactivated', 'Unrecovered'],
          datasets: [{
            label: 'Customer Count',
            data: [data.reactivated, data.unrecovered],
            backgroundColor: ['#27ae60', '#95a5a6']
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
        type: 'doughnut',
        data: {
          labels: ['Reactivated', 'Unrecovered'],
          datasets: [{
            data: [data.reactivated, data.unrecovered],
            backgroundColor: ['#27ae60', '#95a5a6']
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
    var poolEl = document.getElementById('input_total_churned_pool');
    var reactEl = document.getElementById('input_reactivated_customers');
    if (poolEl) poolEl.value = '500';
    if (reactEl) reactEl.value = '25';
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
