/* ═══════════════════════════════════════════════════════════
   CRYCAL — Downgrade & Contraction MRR Calculator
   Tool ID: downgrade-contraction-mrr-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      tierDowngradeMrr: parseFloat(document.getElementById('input_tierDowngradeMrr').value) || 0,
      seatRemovalMrr: parseFloat(document.getElementById('input_seatRemovalMrr').value) || 0,
      featureDiscountMrr: parseFloat(document.getElementById('input_featureDiscountMrr').value) || 0
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
    var tierLoss = inputs.tierDowngradeMrr;
    var seatLoss = inputs.seatRemovalMrr;
    var featureLoss = inputs.featureDiscountMrr;

    var totalContraction = tierLoss + seatLoss + featureLoss;
    var contractionRate = starting > 0 ? (totalContraction / starting) * 100 : 0;
    var annualizedLoss = totalContraction * 12;
    var share = starting > 0 ? (totalContraction / starting) * 100 : 0;

    var elTotal = document.getElementById('output_totalContractionMrr');
    if (elTotal) elTotal.querySelector('.output-number').textContent = formatCurrency(totalContraction);

    var elRate = document.getElementById('output_contractionRatePct');
    if (elRate) elRate.querySelector('.output-number').textContent = formatPercentage(contractionRate);

    var elAnnual = document.getElementById('output_annualizedContractionLoss');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatCurrency(annualizedLoss);

    var elShare = document.getElementById('output_contractionShareOfGrossLoss');
    if (elShare) elShare.querySelector('.output-number').textContent = formatPercentage(share);

    updateCharts({
      tierLoss: tierLoss,
      seatLoss: seatLoss,
      featureLoss: featureLoss
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        totalContractionMrr: totalContraction,
        contractionRatePct: contractionRate.toFixed(2) + '%',
        annualizedContractionLoss: annualizedLoss
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
      type: 'pie',
      data: {
        labels: ['Tier Downgrades', 'Seat Reductions', 'Module Removals & Discounts'],
        datasets: [{
          data: [data.tierLoss, data.seatLoss, data.featureLoss],
          backgroundColor: ['#f59e0b', '#dc2626', '#b91c1c']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Contraction Revenue Loss Sources', font: { size: 14 } }
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
    document.getElementById('input_tierDowngradeMrr').value = 2500;
    document.getElementById('input_seatRemovalMrr').value = 1500;
    document.getElementById('input_featureDiscountMrr').value = 1000;
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
