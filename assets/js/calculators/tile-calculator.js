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

  function handlePresetChange() {
    var preset = document.getElementById('input_tilePreset').value;
    var lenInput = document.getElementById('input_tileLengthInches');
    var widInput = document.getElementById('input_tileWidthInches');

    if (preset === '12x12') {
      lenInput.value = 12;
      widInput.value = 12;
    } else if (preset === '12x24') {
      lenInput.value = 12;
      widInput.value = 24;
    } else if (preset === '24x24') {
      lenInput.value = 24;
      widInput.value = 24;
    } else if (preset === '6x24') {
      lenInput.value = 6;
      widInput.value = 24;
    } else if (preset === '4x12') {
      lenInput.value = 4;
      widInput.value = 12;
    }
  }

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var presetSelect = document.getElementById('input_tilePreset');
    if (presetSelect) {
      presetSelect.addEventListener('change', function() {
        handlePresetChange();
        calculate();
      });
    }

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
    var length = parseFloat(document.getElementById('input_roomLength').value) || 0;
    var width = parseFloat(document.getElementById('input_roomWidth').value) || 0;
    var tileLen = parseFloat(document.getElementById('input_tileLengthInches').value) || 12;
    var tileWid = parseFloat(document.getElementById('input_tileWidthInches').value) || 12;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var sqFtPerBox = parseFloat(document.getElementById('input_sqFtPerBox').value) || 16;
    var pricePerSqFt = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;

    var roomAreaSqFt = length * width;
    var tileAreaSqFt = (tileLen * tileWid) / 144;
    if (tileAreaSqFt <= 0) tileAreaSqFt = 1;

    var netTiles = roomAreaSqFt / tileAreaSqFt;
    var wasteSqFt = roomAreaSqFt * (wastePct / 100);
    var orderSqFt = roomAreaSqFt + wasteSqFt;

    var totalTiles = Math.ceil(orderSqFt / tileAreaSqFt);
    var wasteTiles = totalTiles - Math.ceil(netTiles);
    if (wasteTiles < 0) wasteTiles = 0;

    var boxesNeeded = sqFtPerBox > 0 ? Math.ceil(orderSqFt / sqFtPerBox) : 0;
    var totalCost = orderSqFt * pricePerSqFt;

    var outTiles = document.querySelector('#output_totalTilesNeeded .output-number');
    var outBoxes = document.querySelector('#output_totalBoxesNeeded .output-number');
    var outOrder = document.querySelector('#output_totalOrderSqFt .output-number');
    var outCost = document.querySelector('#output_totalTileCost .output-number');

    if (outTiles) outTiles.textContent = totalTiles + ' tiles';
    if (outBoxes) outBoxes.textContent = boxesNeeded + ' boxes';
    if (outOrder) outOrder.textContent = orderSqFt.toFixed(2) + ' sq ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(Math.ceil(netTiles), wasteTiles, boxesNeeded, totalCost);

    if (window.logHistory) {
      window.logHistory('tile-calculator', {
        roomArea: roomAreaSqFt.toFixed(2) + ' sq ft',
        totalTilesNeeded: totalTiles + ' tiles',
        totalBoxesNeeded: boxesNeeded + ' boxes',
        totalTileCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netTiles, wasteTiles, boxesNeeded, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'tileCount';

    var ctx = canvas.getContext('2d');

    if (tabId === 'costVsBoxes') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Tile Material Cost', 'Purchased Boxes (' + boxesNeeded + ')'],
          datasets: [{
            data: [parseFloat(totalCost.toFixed(2)), boxesNeeded * 10], // scaled for visual slice
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
          labels: ['Net Tiles Required', 'Waste Overage Tiles'],
          datasets: [{
            label: 'Tile Count',
            data: [netTiles, wasteTiles],
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
    document.getElementById('input_roomLength').value = 15;
    document.getElementById('input_roomWidth').value = 12;
    document.getElementById('input_tilePreset').value = '12x24';
    document.getElementById('input_tileLengthInches').value = 12;
    document.getElementById('input_tileWidthInches').value = 24;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_sqFtPerBox').value = 16;
    document.getElementById('input_pricePerSqFt').value = 3.75;
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
