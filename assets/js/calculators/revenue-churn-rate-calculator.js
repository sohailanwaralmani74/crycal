/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Revenue Churn Rate Calculator
   Tool ID: revenue-churn-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      grossLostMrr: parseFloat(document.getElementById('input_grossLostMrr').value) || 0,
      expansionMrr: parseFloat(document.getElementById('input_expansionMrr').value) || 0
    };
  }

  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  function updateTool() {
    var inputs = getInputs();
    var starting = inputs.startingMrr;
    var grossLoss = inputs.grossLostMrr;
    var expansion = inputs.expansionMrr;

    var grossChurnPct = starting > 0 ? (grossLoss / starting) * 100 : 0;
    var netLoss = grossLoss - expansion;
    var netChurnPct = starting > 0 ? (netLoss / starting) * 100 : 0;
    var grossRetentionDec = 1 - (grossChurnPct / 100);
    var annualGrossChurnPct = (1 - Math.pow(grossRetentionDec, 12)) * 100;
    var impliedNrrPct = 100 - netChurnPct;

    var elGross = document.getElementById('output_grossRevenueChurnRatePct');
    if (elGross) elGross.querySelector('.output-number').textContent = formatPercentage(grossChurnPct);

    var elNet = document.getElementById('output_netRevenueChurnRatePct');
    if (elNet) elNet.querySelector('.output-number').textContent = formatPercentage(netChurnPct);

    var elAnnual = document.getElementById('output_annualizedGrossRevenueChurnPct');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatPercentage(annualGrossChurnPct);

    var elNrr = document.getElementById('output_netRevenueRetentionPct');
    if (elNrr) elNrr.querySelector('.output-number').textContent = formatPercentage(impliedNrrPct);

    updateCharts({
      grossChurnPct: grossChurnPct,
      netChurnPct: netChurnPct
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        grossLostMrr: grossLoss,
        grossRevenueChurnRatePct: grossChurnPct.toFixed(2) + '%',
        netRevenueChurnRatePct: netChurnPct.toFixed(2) + '%'
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
        labels: ['Gross Revenue Churn Rate (%)', 'Net Revenue Churn Rate (%)'],
        datasets: [{
          label: 'Monthly Rate %',
          data: [data.grossChurnPct, data.netChurnPct],
          backgroundColor: ['#dc2626', data.netChurnPct < 0 ? '#16a34a' : '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Gross vs. Net Revenue Churn Rate %', font: { size: 14 } }
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
    document.getElementById('input_grossLostMrr').value = 4000;
    document.getElementById('input_expansionMrr').value = 6000;
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
