/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Involuntary vs Voluntary Churn Calculator
   Tool ID: involuntary-vs-voluntary-churn-calculator
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
      totalChurned: parseFloat(document.getElementById('input_total_churned')?.value) || 0,
      involuntaryChurned: parseFloat(document.getElementById('input_involuntary_churned')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var totalChurned = inputs.totalChurned;
    var involuntaryChurned = Math.min(inputs.involuntaryChurned, totalChurned);
    var voluntaryChurned = Math.max(0, totalChurned - involuntaryChurned);

    var voluntaryRate = totalChurned > 0 ? (voluntaryChurned / totalChurned) * 100 : 0;
    var involuntaryRate = totalChurned > 0 ? (involuntaryChurned / totalChurned) * 100 : 0;

    setOutputText('voluntary_churned', voluntaryChurned.toFixed(0));
    setOutputText('output_voluntary_churned', voluntaryChurned.toFixed(0));
    setOutputText('voluntary_rate', voluntaryRate.toFixed(2) + '%');
    setOutputText('output_voluntary_rate', voluntaryRate.toFixed(2) + '%');
    setOutputText('involuntary_rate', involuntaryRate.toFixed(2) + '%');
    setOutputText('output_involuntary_rate', involuntaryRate.toFixed(2) + '%');

    updateCharts({
      voluntary: voluntaryChurned,
      involuntary: involuntaryChurned,
      voluntaryRate: voluntaryRate,
      involuntaryRate: involuntaryRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalChurned: totalChurned,
        involuntaryChurned: involuntaryChurned,
        voluntaryChurned: voluntaryChurned,
        voluntaryRate: voluntaryRate.toFixed(2) + '%',
        involuntaryRate: involuntaryRate.toFixed(2) + '%'
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
          labels: ['Voluntary Rate (%)', 'Involuntary Rate (%)'],
          datasets: [{
            label: 'Rate (%)',
            data: [data.voluntaryRate, data.involuntaryRate],
            backgroundColor: ['#e74c3c', '#f39c12']
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
          labels: ['Voluntary Churn', 'Involuntary Churn'],
          datasets: [{
            data: [data.voluntary, data.involuntary],
            backgroundColor: ['#e74c3c', '#f39c12']
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
    var total = document.getElementById('input_total_churned');
    var invol = document.getElementById('input_involuntary_churned');
    if (total) total.value = '100';
    if (invol) invol.value = '20';
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
