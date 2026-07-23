(function() {
  'use strict';

  var chartInstance = null;

  var MATERIAL_PRICES = {
    'wood_privacy': { '4': 22.00, '6': 26.00, '8': 32.00, gateUnit: 250 },
    'vinyl_privacy': { '4': 28.00, '6': 34.00, '8': 42.00, gateUnit: 300 },
    'chain_link': { '4': 14.00, '6': 18.00, '8': 22.00, gateUnit: 200 },
    'aluminum_ornamental': { '4': 38.00, '6': 45.00, '8': 55.00, gateUnit: 350 },
    'composite': { '4': 42.00, '6': 50.00, '8': 62.00, gateUnit: 400 }
  };

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
    var fenceLengthFt = parseFloat(document.getElementById('input_fenceLengthFt').value) || 0;
    var fenceMaterial = document.getElementById('input_fenceMaterial').value || 'wood_privacy';
    var fenceHeightFt = document.getElementById('input_fenceHeightFt').value || '6';
    var gateCount = parseInt(document.getElementById('input_gateCount').value, 10) || 0;
    var laborOption = document.getElementById('input_installationType').value || 'professional';

    var matConfig = MATERIAL_PRICES[fenceMaterial] || MATERIAL_PRICES['wood_privacy'];
    var baseRate = matConfig[fenceHeightFt] || matConfig['6'];
    var gateUnitPrice = matConfig.gateUnit || 250;

    var gateCostTotal = gateCount * gateUnitPrice;
    var rawMaterialCost = fenceLengthFt * baseRate;
    var totalMaterialSubtotal = rawMaterialCost + gateCostTotal;

    var laborRatePerFt = (laborOption === 'professional') ? 14.00 : 0.00;
    var laborCostTotal = fenceLengthFt * laborRatePerFt;

    var totalCost = totalMaterialSubtotal + laborCostTotal;
    var effCostPerFt = fenceLengthFt > 0 ? (totalCost / fenceLengthFt) : 0;

    var outTotalCost = document.querySelector('#output_totalFenceCost .output-number');
    var outMatCost = document.querySelector('#output_materialCost .output-number');
    var outLaborCost = document.querySelector('#output_laborCost .output-number');
    var outGateCost = document.querySelector('#output_gateCostSubtotal .output-number');
    var outCostFt = document.querySelector('#output_costPerLinearFt .output-number');

    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);
    if (outMatCost) outMatCost.textContent = formatCurrency(totalMaterialSubtotal);
    if (outLaborCost) outLaborCost.textContent = formatCurrency(laborCostTotal);
    if (outGateCost) outGateCost.textContent = formatCurrency(gateCostTotal);
    if (outCostFt) outCostFt.textContent = formatCurrency(effCostPerFt) + ' / ft';

    updateChart(totalMaterialSubtotal, laborCostTotal, gateCostTotal, fenceLengthFt, fenceHeightFt);

    if (window.logHistory) {
      window.logHistory('fencing-cost-calculator', {
        fenceLengthFt: fenceLengthFt + ' ft',
        fenceMaterial: fenceMaterial,
        fenceHeightFt: fenceHeightFt + ' ft',
        gateCount: gateCount,
        totalFenceCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(materialSubtotal, laborCost, gateCost, fenceLengthFt, fenceHeightFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialComparison') {
      var h = fenceHeightFt || '6';
      var woodC = (fenceLengthFt * MATERIAL_PRICES['wood_privacy'][h]) + 14 * fenceLengthFt;
      var vinylC = (fenceLengthFt * MATERIAL_PRICES['vinyl_privacy'][h]) + 14 * fenceLengthFt;
      var chainC = (fenceLengthFt * MATERIAL_PRICES['chain_link'][h]) + 14 * fenceLengthFt;
      var alumC = (fenceLengthFt * MATERIAL_PRICES['aluminum_ornamental'][h]) + 14 * fenceLengthFt;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Wood Privacy', 'Vinyl Privacy', 'Chain Link', 'Aluminum'],
          datasets: [{
            label: 'Estimated Installed Cost ',
            data: [
              parseFloat(woodC.toFixed(2)),
              parseFloat(vinylC.toFixed(2)),
              parseFloat(chainC.toFixed(2)),
              parseFloat(alumC.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7B9D', '#A259FF']
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
          labels: ['Panels & Posts Material', 'Installation Labor', 'Gates & Hardware'],
          datasets: [{
            data: [
              parseFloat((materialSubtotal - gateCost).toFixed(2)),
              parseFloat(laborCost.toFixed(2)),
              parseFloat(gateCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7B9D']
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
    document.getElementById('input_fenceLengthFt').value = 150;
    document.getElementById('input_fenceMaterial').value = 'wood_privacy';
    document.getElementById('input_fenceHeightFt').value = '6';
    document.getElementById('input_gateCount').value = 1;
    document.getElementById('input_installationType').value = 'professional';
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
