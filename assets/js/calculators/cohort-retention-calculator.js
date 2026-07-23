/* ═══════════════════════════════════════════════════════════
   CRYCAL — Cohort Retention Calculator
   Tool ID: cohort-retention-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'curve';

  function getInputs() {
    return {
      initialCohortSize: parseFloat(document.getElementById('input_initialCohortSize').value) || 0,
      month1Active: parseFloat(document.getElementById('input_month1Active').value) || 0,
      month3Active: parseFloat(document.getElementById('input_month3Active').value) || 0,
      month6Active: parseFloat(document.getElementById('input_month6Active').value) || 0,
      month12Active: parseFloat(document.getElementById('input_month12Active').value) || 0
    };
  }

  function formatPercentage(value) {
    return value.toFixed(1) + '%';
  }

  function updateTool() {
    var inputs = getInputs();
    var size = inputs.initialCohortSize;
    var m1 = inputs.month1Active;
    var m3 = inputs.month3Active;
    var m6 = inputs.month6Active;
    var m12 = inputs.month12Active;

    var pct1 = size > 0 ? (m1 / size) * 100 : 0;
    var pct3 = size > 0 ? (m3 / size) * 100 : 0;
    var pct6 = size > 0 ? (m6 / size) * 100 : 0;
    var pct12 = size > 0 ? (m12 / size) * 100 : 0;

    var el1 = document.getElementById('output_month1RetentionPct');
    if (el1) el1.querySelector('.output-number').textContent = formatPercentage(pct1);

    var el3 = document.getElementById('output_month3RetentionPct');
    if (el3) el3.querySelector('.output-number').textContent = formatPercentage(pct3);

    var el6 = document.getElementById('output_month6RetentionPct');
    if (el6) el6.querySelector('.output-number').textContent = formatPercentage(pct6);

    var el12 = document.getElementById('output_month12RetentionPct');
    if (el12) el12.querySelector('.output-number').textContent = formatPercentage(pct12);

    updateCharts({
      pct1: pct1,
      pct3: pct3,
      pct6: pct6,
      pct12: pct12
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        initialCohortSize: size,
        month1RetentionPct: pct1.toFixed(1) + '%',
        month6RetentionPct: pct6.toFixed(1) + '%',
        month12RetentionPct: pct12.toFixed(1) + '%'
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

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Month 0', 'Month 1', 'Month 3', 'Month 6', 'Month 12'],
        datasets: [{
          label: 'Cohort Retention Rate (%)',
          data: [100, data.pct1, data.pct3, data.pct6, data.pct12],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 6,
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Signup Cohort Retention Curve (%)', font: { size: 14 } }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function(v) { return v + '%'; }
            }
          }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_initialCohortSize').value = 100;
    document.getElementById('input_month1Active').value = 90;
    document.getElementById('input_month3Active').value = 82;
    document.getElementById('input_month6Active').value = 75;
    document.getElementById('input_month12Active').value = 68;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();
