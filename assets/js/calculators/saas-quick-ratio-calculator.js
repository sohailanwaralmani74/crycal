/* ═══════════════════════════════════════════════════════════
   CRYCAL — SaaS Quick Ratio Calculator
   Tool ID: saas-quick-ratio-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      newMrr: parseFloat(document.getElementById('input_newMrr').value) || 0,
      expansionMrr: parseFloat(document.getElementById('input_expansionMrr').value) || 0,
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

  function updateTool() {
    var inputs = getInputs();
    var newMrr = inputs.newMrr;
    var expansion = inputs.expansionMrr;
    var contraction = inputs.contractionMrr;
    var churned = inputs.churnedMrr;

    var grossGains = newMrr + expansion;
    var grossLosses = contraction + churned;
    var quickRatio = grossLosses > 0 ? (grossGains / grossLosses) : 0;
    var netMrr = grossGains - grossLosses;

    var elRatio = document.getElementById('output_quickRatio');
    if (elRatio) elRatio.querySelector('.output-number').textContent = quickRatio.toFixed(2) + 'x';

    var elGains = document.getElementById('output_totalGrossAddition');
    if (elGains) elGains.querySelector('.output-number').textContent = formatCurrency(grossGains);

    var elLosses = document.getElementById('output_totalGrossLoss');
    if (elLosses) elLosses.querySelector('.output-number').textContent = formatCurrency(grossLosses);

    var elNet = document.getElementById('output_netMrrGrowth');
    if (elNet) elNet.querySelector('.output-number').textContent = formatCurrency(netMrr);

    updateCharts({
      grossGains: grossGains,
      grossLosses: grossLosses
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        newMrr: newMrr,
        expansionMrr: expansion,
        churnedMrr: churned,
        quickRatio: quickRatio.toFixed(2) + 'x',
        netMrrGrowth: netMrr
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
        labels: ['Gross Additions (New + Expansion)', 'Gross Loss (Contraction + Churn)'],
        datasets: [{
          label: 'MRR ($)',
          data: [data.grossGains, data.grossLosses],
          backgroundColor: ['#16a34a', '#dc2626']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Gross MRR Additions vs. Losses', font: { size: 14 } }
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
    document.getElementById('input_newMrr').value = 20000;
    document.getElementById('input_expansionMrr').value = 10000;
    document.getElementById('input_contractionMrr').value = 2000;
    document.getElementById('input_churnedMrr').value = 4000;
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
