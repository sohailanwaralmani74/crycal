/* ═══════════════════════════════════════════════════════════
   CRYCAL — Revenue Churn Calculator
   Tool ID: revenue-churn-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      churnedMrr: parseFloat(document.getElementById('input_churnedMrr').value) || 0,
      contractionMrr: parseFloat(document.getElementById('input_contractionMrr').value) || 0,
      expansionMrr: parseFloat(document.getElementById('input_expansionMrr').value) || 0
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
    var churned = inputs.churnedMrr;
    var contraction = inputs.contractionMrr;
    var expansion = inputs.expansionMrr;

    var grossLoss = churned + contraction;
    var grossChurnPct = starting > 0 ? (grossLoss / starting) * 100 : 0;
    var netLoss = grossLoss - expansion;
    var netChurnPct = starting > 0 ? (netLoss / starting) * 100 : 0;
    var annualizedLoss = grossLoss * 12;

    var elGross = document.getElementById('output_grossRevenueChurn');
    if (elGross) elGross.querySelector('.output-number').textContent = formatPercentage(grossChurnPct);

    var elNet = document.getElementById('output_netRevenueChurn');
    if (elNet) elNet.querySelector('.output-number').textContent = formatPercentage(netChurnPct);

    var elLoss = document.getElementById('output_totalGrossDollarsLost');
    if (elLoss) elLoss.querySelector('.output-number').textContent = formatCurrency(grossLoss);

    var elAnnual = document.getElementById('output_annualizedChurnCost');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatCurrency(annualizedLoss);

    updateCharts({
      grossChurnPct: grossChurnPct,
      netChurnPct: netChurnPct
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        grossRevenueChurn: grossChurnPct.toFixed(2) + '%',
        netRevenueChurn: netChurnPct.toFixed(2) + '%',
        totalGrossDollarsLost: grossLoss
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
      type: 'bar',
      data: {
        labels: ['Gross Revenue Churn (%)', 'Net Revenue Churn (%)'],
        datasets: [{
          label: 'Churn Rate %',
          data: [data.grossChurnPct, data.netChurnPct],
          backgroundColor: ['#dc2626', data.netChurnPct < 0 ? '#16a34a' : '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Gross vs. Net Revenue Churn Comparison', font: { size: 14 } }
        },
        scales: {
          y: {
            ticks: {
              callback: function(v) { return v.toFixed(1) + '%'; }
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
    document.getElementById('input_startingMrr').value = 100000;
    document.getElementById('input_churnedMrr').value = 5000;
    document.getElementById('input_contractionMrr').value = 2000;
    document.getElementById('input_expansionMrr').value = 4000;
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
