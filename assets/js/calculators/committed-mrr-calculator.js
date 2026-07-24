/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Committed MRR Calculator
   Tool ID: committed-mrr-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      currentMrr: parseFloat(document.getElementById('input_currentMrr').value) || 0,
      signedFutureMrr: parseFloat(document.getElementById('input_signedFutureMrr').value) || 0,
      pendingExpansionMrr: parseFloat(document.getElementById('input_pendingExpansionMrr').value) || 0,
      knownChurnMrr: parseFloat(document.getElementById('input_knownChurnMrr').value) || 0,
      knownContractionMrr: parseFloat(document.getElementById('input_knownContractionMrr').value) || 0
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
    var current = inputs.currentMrr;
    var futureNew = inputs.signedFutureMrr;
    var futureExp = inputs.pendingExpansionMrr;
    var churn = inputs.knownChurnMrr;
    var contraction = inputs.knownContractionMrr;

    var totalAdditions = futureNew + futureExp;
    var totalLosses = churn + contraction;
    var netDelta = totalAdditions - totalLosses;
    var cmrr = current + netDelta;
    var carr = cmrr * 12;
    var growthPct = current > 0 ? (netDelta / current) * 100 : 0;

    var elCmrr = document.getElementById('output_committedMrr');
    if (elCmrr) elCmrr.querySelector('.output-number').textContent = formatCurrency(cmrr);

    var elCarr = document.getElementById('output_committedArr');
    if (elCarr) elCarr.querySelector('.output-number').textContent = formatCurrency(carr);

    var elDelta = document.getElementById('output_netCommittedDelta');
    if (elDelta) elDelta.querySelector('.output-number').textContent = formatCurrency(netDelta);

    var elGrowth = document.getElementById('output_cmrrGrowthPct');
    if (elGrowth) elGrowth.querySelector('.output-number').textContent = formatPercentage(growthPct);

    updateCharts({
      current: current,
      futureNew: futureNew,
      futureExp: futureExp,
      churn: churn,
      contraction: contraction,
      cmrr: cmrr
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentMrr: current,
        signedFutureMrr: futureNew,
        knownChurnMrr: churn,
        committedMrr: cmrr,
        committedArr: carr
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
        labels: ['Current MRR', '+ Signed New', '+ Signed Expansion', '- Pending Churn', '- Pending Contraction', 'Committed MRR'],
        datasets: [{
          label: 'MRR ($)',
          data: [data.current, data.futureNew, data.futureExp, -data.churn, -data.contraction, data.cmrr],
          backgroundColor: ['#2563eb', '#16a34a', '#8b5cf6', '#dc2626', '#f59e0b', '#059669']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Committed MRR (CMRR) Waterfall Breakdown', font: { size: 14 } }
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
    document.getElementById('input_currentMrr').value = 100000;
    document.getElementById('input_signedFutureMrr').value = 15000;
    document.getElementById('input_pendingExpansionMrr').value = 5000;
    document.getElementById('input_knownChurnMrr').value = 3000;
    document.getElementById('input_knownContractionMrr').value = 2000;
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
