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
    var len = parseFloat(document.getElementById('input_wallLengthFeet').value) || 0;
    var hgt = parseFloat(document.getElementById('input_wallHeightFeet').value) || 0;
    var priceBlock = parseFloat(document.getElementById('input_pricePerBlock').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var wallSqFt = len * hgt;
    var netBlocks = wallSqFt * 1.125;
    var totalBlocks = Math.ceil(netBlocks * (1 + (wastePct / 100)));

    var mortarBags = Math.ceil(totalBlocks / 30);
    var blockCost = totalBlocks * priceBlock;
    var mortarCost = mortarBags * 12.00; // estimated $12/bag mortar
    var totalCost = blockCost + mortarCost;

    var outBlocks = document.querySelector('#output_totalBlocksNeeded .output-number');
    var outSqFt = document.querySelector('#output_wallSquareFeet .output-number');
    var outMortar = document.querySelector('#output_mortarBagsNeeded .output-number');
    var outBlockCost = document.querySelector('#output_totalBlockCost .output-number');
    var outProjCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outBlocks) outBlocks.textContent = totalBlocks + ' blocks';
    if (outSqFt) outSqFt.textContent = wallSqFt.toFixed(1) + ' sq ft';
    if (outMortar) outMortar.textContent = mortarBags + ' bags (80 lb)';
    if (outBlockCost) outBlockCost.textContent = formatCurrency(blockCost);
    if (outProjCost) outProjCost.textContent = formatCurrency(totalCost);

    updateChart(blockCost, mortarCost, totalBlocks, mortarBags);

    if (window.logHistory) {
      window.logHistory('concrete-block-cmu-calculator', {
        wallLengthFeet: len + ' ft',
        wallHeightFeet: hgt + ' ft',
        totalBlocksNeeded: totalBlocks + ' blocks',
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(blockCost, mortarCost, totalBlocks, mortarBags) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialCount') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['CMU Blocks', 'Mortar Bags (80 lb)'],
          datasets: [{
            label: 'Material Quantity',
            data: [totalBlocks, mortarBags],
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
          labels: ['CMU Block Material Cost', 'Mortar Material Cost'],
          datasets: [{
            data: [parseFloat(blockCost.toFixed(2)), parseFloat(mortarCost.toFixed(2))],
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
    document.getElementById('input_wallLengthFeet').value = 40;
    document.getElementById('input_wallHeightFeet').value = 8;
    document.getElementById('input_blockType').value = '8x8x16';
    document.getElementById('input_pricePerBlock').value = 2.25;
    document.getElementById('input_wastePercentage').value = 10;
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
