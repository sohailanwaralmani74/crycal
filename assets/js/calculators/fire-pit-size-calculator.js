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
    var innerDia = parseFloat(document.getElementById('input_innerDiameterInches').value) || 36;
    var blockDepth = parseFloat(document.getElementById('input_wallBlockDepthInches').value) || 8;
    var blockFaceLen = parseFloat(document.getElementById('input_blockFaceLengthInches').value) || 12;
    var blockHeight = parseFloat(document.getElementById('input_blockHeightInches').value) || 4;
    var pitHeight = parseFloat(document.getElementById('input_pitHeightInches').value) || 16;
    var priceBlock = parseFloat(document.getElementById('input_blockPrice').value) || 0;
    var priceRockBag = parseFloat(document.getElementById('input_lavaRockBagPrice').value) || 0;

    var outerDia = innerDia + (2 * blockDepth);
    var outerCircumference = Math.PI * outerDia;

    var blocksPerLayer = blockFaceLen > 0 ? Math.ceil(outerCircumference / blockFaceLen) : 0;
    var totalLayers = blockHeight > 0 ? Math.ceil(pitHeight / blockHeight) : 0;
    var totalBlocks = blocksPerLayer * totalLayers;

    var innerRadiusFt = (innerDia / 2) / 12;
    var innerFloorAreaSqFt = Math.PI * Math.pow(innerRadiusFt, 2);
    var lavaRockCuFt = innerFloorAreaSqFt * (4 / 12);
    var lavaRockBags = Math.ceil(lavaRockCuFt / 0.5);

    var blockCost = totalBlocks * priceBlock;
    var rockCost = lavaRockBags * priceRockBag;
    var totalCost = blockCost + rockCost;

    var outOuterDia = document.querySelector('#output_outerDiameterInches .output-number');
    var outPerLayer = document.querySelector('#output_blocksPerLayer .output-number');
    var outLayers = document.querySelector('#output_totalLayers .output-number');
    var outTotalBlocks = document.querySelector('#output_totalBlocksNeeded .output-number');
    var outRockBags = document.querySelector('#output_lavaRockBagsNeeded .output-number');
    var outTotalCost = document.querySelector('#output_totalFirePitCost .output-number');

    if (outOuterDia) outOuterDia.textContent = outerDia.toFixed(1) + ' Inches (' + outerCircumference.toFixed(1) + '" circ)';
    if (outPerLayer) outPerLayer.textContent = blocksPerLayer + ' Blocks / Ring';
    if (outLayers) outLayers.textContent = totalLayers + ' Vertical Courses';
    if (outTotalBlocks) outTotalBlocks.textContent = totalBlocks + ' Total Blocks';
    if (outRockBags) outRockBags.textContent = lavaRockBags + ' Bags (' + lavaRockCuFt.toFixed(2) + ' cu ft)';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);

    updateChart(blockCost, rockCost, blocksPerLayer, totalLayers);

    if (window.logHistory) {
      window.logHistory('fire-pit-size-calculator', {
        innerDiameterInches: innerDia + ' in',
        pitHeightInches: pitHeight + ' in',
        totalBlocksNeeded: totalBlocks + ' Blocks',
        lavaRockBagsNeeded: lavaRockBags + ' Bags',
        totalFirePitCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(blockCost, rockCost, blocksPerLayer, totalLayers) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'blockDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Wall Blocks Cost', 'Lava Rock Fill Cost'],
          datasets: [{
            data: [parseFloat(blockCost.toFixed(2)), parseFloat(rockCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Blocks Per Ring Layer', 'Vertical Block Courses'],
          datasets: [{
            label: 'Ring Count vs Course Height',
            data: [blocksPerLayer, totalLayers],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_innerDiameterInches').value = 36;
    document.getElementById('input_wallBlockDepthInches').value = 8;
    document.getElementById('input_blockFaceLengthInches').value = 12;
    document.getElementById('input_blockHeightInches').value = 4;
    document.getElementById('input_pitHeightInches').value = 16;
    document.getElementById('input_blockPrice').value = 3.75;
    document.getElementById('input_lavaRockBagPrice').value = 8.50;
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
