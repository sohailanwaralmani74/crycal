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
    var lengthFt = parseFloat(document.getElementById('input_wallLengthFt').value) || 0;
    var heightFt = parseFloat(document.getElementById('input_wallHeightFt').value) || 0;
    var blockLengthInches = parseFloat(document.getElementById('input_blockLengthInches').value) || 0;
    var blockHeightInches = parseFloat(document.getElementById('input_blockHeightInches').value) || 0;
    var pricePerBlock = parseFloat(document.getElementById('input_blockCost').value) || 0;
    var pricePerCap = parseFloat(document.getElementById('input_capstoneCost').value) || 0;
    var pricePerGravelYard = parseFloat(document.getElementById('input_gravelCostPerYard').value) || 0;

    var wallAreaSqFt = lengthFt * heightFt;
    var blockAreaSqFt = (blockLengthInches / 12) * (blockHeightInches / 12);

    var rawBlocks = blockAreaSqFt > 0 ? (wallAreaSqFt / blockAreaSqFt) : 0;
    var totalBlocks = Math.ceil(rawBlocks * 1.05); // +5% waste

    var capLengthFt = blockLengthInches / 12;
    var totalCapstones = capLengthFt > 0 ? Math.ceil(lengthFt / capLengthFt) : 0;

    // 1 ft wide gravel column behind wall + 10% compaction
    var netGravelCuFt = lengthFt * heightFt * 1.0;
    var gravelCuYds = (netGravelCuFt / 27) * 1.10;

    var blockCostTotal = totalBlocks * pricePerBlock;
    var capCostTotal = totalCapstones * pricePerCap;
    var gravelCostTotal = gravelCuYds * pricePerGravelYard;
    var totalCost = blockCostTotal + capCostTotal + gravelCostTotal;

    var outTotal = document.querySelector('#output_totalWallCost .output-number');
    var outBlocks = document.querySelector('#output_totalBlocksNeeded .output-number');
    var outCaps = document.querySelector('#output_totalCapstonesNeeded .output-number');
    var outGravel = document.querySelector('#output_gravelVolumeYards .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outBlocks) outBlocks.textContent = totalBlocks + ' blocks';
    if (outCaps) outCaps.textContent = totalCapstones + ' capstones';
    if (outGravel) outGravel.textContent = gravelCuYds.toFixed(2) + ' cu yds';

    updateChart(blockCostTotal, capCostTotal, gravelCostTotal, totalBlocks, gravelCuYds);

    if (window.logHistory) {
      window.logHistory('retaining-wall-calculator', {
        wallLengthFt: lengthFt + ' ft',
        wallHeightFt: heightFt + ' ft',
        totalBlocksNeeded: totalBlocks + ' blocks',
        totalWallCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(blockCostTotal, capCostTotal, gravelCostTotal, totalBlocks, gravelCuYds) {
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
          labels: ['Wall Block Count', 'Gravel Volume (cu yds × 10)'],
          datasets: [{
            label: 'Quantities',
            data: [totalBlocks, parseFloat((gravelCuYds * 10).toFixed(2))],
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
          labels: ['Wall Blocks Cost', 'Capstones Cost', 'Gravel Backfill Cost'],
          datasets: [{
            data: [parseFloat(blockCostTotal.toFixed(2)), parseFloat(capCostTotal.toFixed(2)), parseFloat(gravelCostTotal.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4B7B94']
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
    document.getElementById('input_wallLengthFt').value = 40;
    document.getElementById('input_wallHeightFt').value = 4;
    document.getElementById('input_blockLengthInches').value = 12;
    document.getElementById('input_blockHeightInches').value = 6;
    document.getElementById('input_blockCost').value = 4.50;
    document.getElementById('input_capstoneCost').value = 5.00;
    document.getElementById('input_gravelCostPerYard').value = 45.00;
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
