/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Compound Monthly Growth Rate (CMGR) Calculator
   Tool ID: cmgr-compound-monthly-growth-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'compounding';

  function getInputs() {
    return {
      startingRevenue: parseFloat(document.getElementById('input_startingRevenue').value) || 0,
      endingRevenue: parseFloat(document.getElementById('input_endingRevenue').value) || 0,
      durationMonths: parseFloat(document.getElementById('input_durationMonths').value) || 1
    };
  }

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  function updateTool() {
    var inputs = getInputs();
    var start = inputs.startingRevenue;
    var end = inputs.endingRevenue;
    var n = Math.max(1, inputs.durationMonths);

    var totalGrowthPct = start > 0 ? ((end - start) / start) * 100 : 0;
    var cmgrPct = (start > 0 && end > 0) ? (Math.pow(end / start, 1 / n) - 1) * 100 : 0;
    var cmgrDec = cmgrPct / 100;
    var annualizedPct = (Math.pow(1 + cmgrDec, 12) - 1) * 100;
    var nextMonthMrr = end * (1 + cmgrDec);

    var elCmgr = document.getElementById('output_cmgrPercentage');
    if (elCmgr) elCmgr.querySelector('.output-number').textContent = formatPercentage(cmgrPct);

    var elTotal = document.getElementById('output_totalGrowthPercentage');
    if (elTotal) elTotal.querySelector('.output-number').textContent = formatPercentage(totalGrowthPct);

    var elAnn = document.getElementById('output_annualizedEquivalentRate');
    if (elAnn) elAnn.querySelector('.output-number').textContent = formatPercentage(annualizedPct);

    var elNext = document.getElementById('output_projectedNextMonthMrr');
    if (elNext) elNext.querySelector('.output-number').textContent = formatCurrency(nextMonthMrr);

    updateCharts({
      start: start,
      end: end,
      n: n,
      cmgrDec: cmgrDec
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingRevenue: start,
        endingRevenue: end,
        durationMonths: n,
        cmgrPercentage: cmgrPct.toFixed(2) + '%',
        totalGrowthPercentage: totalGrowthPct.toFixed(2) + '%'
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

    var labels = [];
    var series = [];

    for (var i = 0; i <= data.n; i++) {
      labels.push('Mo ' + i);
      var val = data.start * Math.pow(1 + data.cmgrDec, i);
      series.push(val);
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Compounding Monthly Revenue ($)',
          data: series,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Compounding Revenue Growth Trajectory', font: { size: 14 } }
        },
        scales: {
          y: {
            ticks: {
              callback: function(v) { return '$' + v.toLocaleString(); }
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
    document.getElementById('input_startingRevenue').value = 10000;
    document.getElementById('input_endingRevenue').value = 25000;
    document.getElementById('input_durationMonths').value = 6;
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
