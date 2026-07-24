/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Sales Cycle Length Calculator
   Tool ID: sales-cycle-length-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'overview';

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
      totalDays: parseFloat(document.getElementById('input_total_days')?.value) || 0,
      deals: parseFloat(document.getElementById('input_number_deals')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var totalDays = inputs.totalDays;
    var deals = inputs.deals;
    var avgCycle = deals > 0 ? totalDays / deals : 0;

    setOutputText('average_cycle', avgCycle.toFixed(1) + ' Days');
    setOutputText('output_average_cycle', avgCycle.toFixed(1) + ' Days');

    updateCharts({
      totalDays: totalDays,
      deals: deals,
      avgCycle: avgCycle
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalDays: totalDays,
        numberOfDeals: deals,
        averageCycleDays: avgCycle.toFixed(1)
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

    if (currentTab === 'benchmark') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Avg Cycle', 'SMB Benchmark (30d)', 'Enterprise Benchmark (90d)'],
          datasets: [{
            label: 'Days',
            data: [data.avgCycle, 30, 90],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
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
        type: 'bar',
        data: {
          labels: ['Average Sales Cycle Length'],
          datasets: [{
            label: 'Days to Close',
            data: [data.avgCycle],
            backgroundColor: ['#3b82f6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
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
    var d = document.getElementById('input_total_days');
    var n = document.getElementById('input_number_deals');
    if (d) d.value = '1800';
    if (n) n.value = '30';
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
