(function() {
  'use strict';

  var chartInstance = null;

  var BLOCK_CONFIGS = {
    'standard_12x6': { faceSqFt: 0.50, lengthInches: 12 },
    'jumbo_18x8': { faceSqFt: 1.00, lengthInches: 18 },
    'mini_8x4': { faceSqFt: 0.2222, lengthInches: 8 }
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
    var lengthFt = parseFloat(document.getElementById('input_wallLengthFt').value) || 0;
    var heightFt = parseFloat(document.getElementById('input_wallHeightFt').value) || 0;
    var blockKey = document.getElementById('input_blockType').value || 'standard_12x6';
    var priceBlock = parseFloat(document.getElementById('input_blockCost').value) || 0;
    var priceCap = parseFloat(document.getElementById('input_capstoneCost').value) || 0;
    var priceGravel = parseFloat(document.getElementById('input_gravelCostPerYard').value) || 0;

    var config = BLOCK_CONFIGS[blockKey] || BLOCK_CONFIGS['standard_12x6'];
    var faceAreaSqFt = lengthFt * heightFt;

    var netBlocks = config.faceSqFt > 0 ? (faceAreaSqFt / config.faceSqFt) : 0;
    var totalBlocks = Math.ceil(netBlocks * 1.05);

    var capstoneLenFt = config.lengthInches / 12;
    var totalCapstones = capstoneLenFt > 0 ? Math.ceil(lengthFt / capstoneLenFt) : 0;

    var gravelCuYd = ((lengthFt * heightFt * 1.0) / 27) * 1.10;

    var blockCostTotal = totalBlocks * priceBlock;
    var capCostTotal = totalCapstones * priceCap;
    var gravelCostTotal = gravelCuYd * priceGravel;
    var totalCost = blockCostTotal + capCostTotal + gravelCostTotal;

    var outBlocks = document.querySelector('#output_totalBlocksNeeded .output-number');
    var outCaps = document.querySelector('#output_totalCapstonesNeeded .output-number');
    var outArea = document.querySelector('#output_totalWallAreaSqFt .output-number');
    var outGravel = document.querySelector('#output_gravelBackfillYards .output-number');
    var outCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outBlocks) outBlocks.textContent = totalBlocks.toLocaleString() + ' Blocks';
    if (outCaps) outCaps.textContent = totalCapstones + ' Capstones';
    if (outArea) outArea.textContent = faceAreaSqFt.toFixed(1) + ' sq ft';
    if (outGravel) outGravel.textContent = gravelCuYd.toFixed(2) + ' Cu Yds';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(blockCostTotal, capCostTotal, gravelCostTotal, totalBlocks, totalCapstones);

    if (window.logHistory) {
      window.logHistory('retaining-wall-block-calculator', {
        wallLengthFt: lengthFt + ' ft',
        wallHeightFt: heightFt + ' ft',
        totalBlocksNeeded: totalBlocks.toLocaleString() + ' Blocks',
        totalCapstonesNeeded: totalCapstones + ' Caps',
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(blockCost, capCost, gravelCost, totalBlocks, totalCapstones) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialQuantities') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Wall Blocks Needed', 'Top Capstones Needed'],
          datasets: [{
            label: 'Material Item Counts',
            data: [totalBlocks, totalCapstones],
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
          labels: ['Retaining Wall Blocks Cost', 'Top Capstones Cost', 'Gravel Backfill Cost'],
          datasets: [{
            data: [
              parseFloat(blockCost.toFixed(2)),
              parseFloat(capCost.toFixed(2)),
              parseFloat(gravelCost.toFixed(2))
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
    document.getElementById('input_wallLengthFt').value = 30;
    document.getElementById('input_wallHeightFt').value = 3.5;
    document.getElementById('input_blockType').value = 'standard_12x6';
    document.getElementById('input_blockCost').value = 4.25;
    document.getElementById('input_capstoneCost').value = 4.75;
    document.getElementById('input_gravelCostPerYard').value = 42.00;
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
