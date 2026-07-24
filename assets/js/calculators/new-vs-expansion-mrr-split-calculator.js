/* ═══════════════════════════════════════════════════════════
   Wanjaaro — New vs Expansion MRR Split Calculator
   Tool ID: new-vs-expansion-mrr-split-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'split';

  function getInputs() {
    return {
      newLogoMrr: parseFloat(document.getElementById('input_newLogoMrr').value) || 0,
      expansionMrr: parseFloat(document.getElementById('input_expansionMrr').value) || 0,
      reactivatedMrr: parseFloat(document.getElementById('input_reactivatedMrr').value) || 0
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
    return value.toFixed(1) + '%';
  }

  function updateTool() {
    var inputs = getInputs();
    var newLogo = inputs.newLogoMrr;
    var expansion = inputs.expansionMrr;
    var reactivated = inputs.reactivatedMrr;

    var totalGross = newLogo + expansion + reactivated;
    var newLogoPct = totalGross > 0 ? (newLogo / totalGross) * 100 : 0;
    var expansionPct = totalGross > 0 ? (expansion / totalGross) * 100 : 0;
    var reactivationPct = totalGross > 0 ? (reactivated / totalGross) * 100 : 0;

    var elTotal = document.getElementById('output_totalGrossNewMrr');
    if (elTotal) elTotal.querySelector('.output-number').textContent = formatCurrency(totalGross);

    var elNewShare = document.getElementById('output_newLogoSharePct');
    if (elNewShare) elNewShare.querySelector('.output-number').textContent = formatPercentage(newLogoPct);

    var elExpShare = document.getElementById('output_expansionSharePct');
    if (elExpShare) elExpShare.querySelector('.output-number').textContent = formatPercentage(expansionPct);

    var elReactShare = document.getElementById('output_reactivationSharePct');
    if (elReactShare) elReactShare.querySelector('.output-number').textContent = formatPercentage(reactivationPct);

    updateCharts({
      newLogo: newLogo,
      expansion: expansion,
      reactivated: reactivated
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        newLogoMrr: newLogo,
        expansionMrr: expansion,
        totalGrossNewMrr: totalGross,
        newLogoSharePct: newLogoPct.toFixed(1) + '%',
        expansionSharePct: expansionPct.toFixed(1) + '%'
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
        labels: ['New Logo MRR', 'Expansion MRR', 'Reactivated MRR'],
        datasets: [{
          data: [data.newLogo, data.expansion, data.reactivated],
          backgroundColor: ['#2563eb', '#16a34a', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Gross Added MRR Source Breakdown', font: { size: 14 } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_newLogoMrr').value = 15000;
    document.getElementById('input_expansionMrr').value = 10000;
    document.getElementById('input_reactivatedMrr').value = 2000;
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
