/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Expansion Revenue Calculator
   Tool ID: expansion-revenue-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      tierUpgradeMrr: parseFloat(document.getElementById('input_tierUpgradeMrr').value) || 0,
      seatAddonMrr: parseFloat(document.getElementById('input_seatAddonMrr').value) || 0,
      crossSellMrr: parseFloat(document.getElementById('input_crossSellMrr').value) || 0,
      usageOverageMrr: parseFloat(document.getElementById('input_usageOverageMrr').value) || 0
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
    var upgrade = inputs.tierUpgradeMrr;
    var seats = inputs.seatAddonMrr;
    var crossSell = inputs.crossSellMrr;
    var usage = inputs.usageOverageMrr;

    var totalExpansion = upgrade + seats + crossSell + usage;
    var expansionRate = starting > 0 ? (totalExpansion / starting) * 100 : 0;
    var annualized = totalExpansion * 12;
    var share = starting > 0 ? (totalExpansion / starting) * 100 : 0;

    var elTotal = document.getElementById('output_totalExpansionMrr');
    if (elTotal) elTotal.querySelector('.output-number').textContent = formatCurrency(totalExpansion);

    var elRate = document.getElementById('output_expansionRate');
    if (elRate) elRate.querySelector('.output-number').textContent = formatPercentage(expansionRate);

    var elAnnual = document.getElementById('output_annualizedExpansion');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatCurrency(annualized);

    var elShare = document.getElementById('output_expansionShare');
    if (elShare) elShare.querySelector('.output-number').textContent = formatPercentage(share);

    updateCharts({
      upgrade: upgrade,
      seats: seats,
      crossSell: crossSell,
      usage: usage
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        totalExpansionMrr: totalExpansion,
        expansionRate: expansionRate.toFixed(2) + '%',
        annualizedExpansion: annualized
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
        labels: ['Tier Upgrades', 'Seat Add-ons', 'Cross-sells', 'Usage Overages'],
        datasets: [{
          data: [data.upgrade, data.seats, data.crossSell, data.usage],
          backgroundColor: ['#2563eb', '#16a34a', '#8b5cf6', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Expansion Revenue Sources Breakdown', font: { size: 14 } }
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
    document.getElementById('input_tierUpgradeMrr').value = 8000;
    document.getElementById('input_seatAddonMrr').value = 5000;
    document.getElementById('input_crossSellMrr').value = 3000;
    document.getElementById('input_usageOverageMrr').value = 2000;
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
