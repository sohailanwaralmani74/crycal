(function() {
  'use strict';

  var chartInstance = null;

  function getGlobalCurrency() {
    var picker = document.getElementById('globalCurrencyPicker');
    return picker ? picker.value : 'USD';
  }

  function formatCurrency(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(2);
    }
  }

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var inputs = document.querySelectorAll('.tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var netArea = parseFloat(document.getElementById('input_lawnAreaSqFt').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;
    var pricePerSqFt = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;
    var palletPrice = parseFloat(document.getElementById('input_palletPrice').value) || 0;

    var totalSqFt = netArea * (1 + (wastePct / 100));
    var wasteSqFt = totalSqFt - netArea;
    var pallets = Math.ceil(totalSqFt / 450);
    var rolls = Math.ceil(totalSqFt / 10);

    var totalCostSqFt = totalSqFt * pricePerSqFt;
    var totalCostPallet = pallets * palletPrice;

    var outSqFt = document.querySelector('#output_totalSodSqFt .output-number');
    var outPallets = document.querySelector('#output_palletCount .output-number');
    var outRolls = document.querySelector('#output_rollCount .output-number');
    var outCost = document.querySelector('#output_totalSodCost .output-number');

    if (outSqFt) outSqFt.textContent = Math.ceil(totalSqFt) + ' sq ft';
    if (outPallets) outPallets.textContent = pallets + ' pallets';
    if (outRolls) outRolls.textContent = rolls + ' rolls';
    if (outCost) outCost.textContent = formatCurrency(totalCostSqFt);

    updateChart(netArea, wasteSqFt, totalCostSqFt, totalCostPallet);

    if (window.logHistory) {
      window.logHistory('sod-grass-calculator', {
        lawnAreaSqFt: netArea + ' sq ft',
        totalSodSqFt: Math.ceil(totalSqFt) + ' sq ft',
        palletCount: pallets + ' pallets',
        totalSodCost: formatCurrency(totalCostSqFt)
      });
    }
  }

  function updateChart(netArea, wasteSqFt, costSqFt, costPallet) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'quantityBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'purchaseMethodCost') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Per Sq Ft Price Total', 'Full Pallets Price Total'],
          datasets: [{
            label: 'Cost Comparison',
            data: [
              parseFloat(costSqFt.toFixed(2)),
              parseFloat(costPallet.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Lawn Area (sq ft)', 'Waste & Overlap Buffer (sq ft)'],
          datasets: [{
            data: [parseFloat(netArea.toFixed(0)), parseFloat(wasteSqFt.toFixed(0))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_lawnAreaSqFt').value = 1000;
    document.getElementById('input_wastePercentage').value = 5;
    document.getElementById('input_pricePerSqFt').value = 0.65;
    document.getElementById('input_palletPrice').value = 260.00;
    calculate();
  }

  window.updateTool = calculate;
  window.resetTool = reset;
  window.switchChartTab = function(tabId) {
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var target = document.querySelector('.chart-tab[data-tab="' + tabId + '"]');
    if (target) target.classList.add('active');
    calculate();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
