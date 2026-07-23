/* ═══════════════════════════════════════════════════════════
   CRYCAL — Gross Revenue Retention (GRR) Calculator
   Tool ID: gross-revenue-retention-grr-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'retention';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      contractionMrr: parseFloat(document.getElementById('input_contractionMrr').value) || 0,
      churnedMrr: parseFloat(document.getElementById('input_churnedMrr').value) || 0
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
    var starting = inputs.startingMrr;
    var contraction = inputs.contractionMrr;
    var churned = inputs.churnedMrr;

    var grossLoss = contraction + churned;
    var retainedMrr = Math.max(0, starting - grossLoss);
    var grrPct = starting > 0 ? (retainedMrr / starting) * 100 : 0;
    var grossLossPct = starting > 0 ? (grossLoss / starting) * 100 : 0;

    var elGrr = document.getElementById('output_grrPercentage');
    if (elGrr) elGrr.querySelector('.output-number').textContent = formatPercentage(grrPct);

    var elRetained = document.getElementById('output_retainedMrr');
    if (elRetained) elRetained.querySelector('.output-number').textContent = formatCurrency(retainedMrr);

    var elLoss = document.getElementById('output_grossRevenueLoss');
    if (elLoss) elLoss.querySelector('.output-number').textContent = formatCurrency(grossLoss);

    var elLossRate = document.getElementById('output_grossLossRate');
    if (elLossRate) elLossRate.querySelector('.output-number').textContent = formatPercentage(grossLossPct);

    updateCharts({
      retained: retainedMrr,
      contraction: contraction,
      churned: churned
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        contractionMrr: contraction,
        churnedMrr: churned,
        grrPercentage: grrPct.toFixed(2) + '%',
        retainedMrr: retainedMrr
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
      type: 'doughnut',
      data: {
        labels: ['Retained Revenue', 'Contraction Loss', 'Churn Loss'],
        datasets: [{
          data: [data.retained, data.contraction, data.churned],
          backgroundColor: ['#059669', '#f59e0b', '#dc2626']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Gross Revenue Retention & Loss Breakdown', font: { size: 14 } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_startingMrr').value = 100000;
    document.getElementById('input_contractionMrr').value = 4000;
    document.getElementById('input_churnedMrr').value = 6000;
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
