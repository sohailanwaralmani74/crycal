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

    if (preset === '3x6') {
      lenInput.value = 3;
      widInput.value = 6;
    } else if (preset === '4x12') {
      lenInput.value = 4;
      widInput.value = 12;
    } else if (preset === '2x2') {
      lenInput.value = 2;
      widInput.value = 2;
    } else if (preset === '6x6') {
      lenInput.value = 6;
      widInput.value = 6;
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
    var wallLen = parseFloat(document.getElementById('input_wallLengthFeet').value) || 0;
    var splashHeight = parseFloat(document.getElementById('input_backsplashHeightInches').value) || 0;
    var outlets = parseFloat(document.getElementById('input_outletDeductions').value) || 0;
    var tileLen = parseFloat(document.getElementById('input_tileLengthInches').value) || 3;
    var tileWid = parseFloat(document.getElementById('input_tileWidthInches').value) || 6;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var sqFtPerBox = parseFloat(document.getElementById('input_sqFtPerBox').value) || 10;
    var pricePerSqFt = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;

    var grossSqFt = wallLen * (splashHeight / 12);
    var outletDeductionSqFt = outlets * 0.15;
    var netSqFt = Math.max(0, grossSqFt - outletDeductionSqFt);

    var tileAreaSqFt = (tileLen * tileWid) / 144;
    if (tileAreaSqFt <= 0) tileAreaSqFt = 0.125;

    var orderSqFt = netSqFt * (1 + (wastePct / 100));
    var totalTiles = Math.ceil(orderSqFt / tileAreaSqFt);
    var boxesNeeded = sqFtPerBox > 0 ? Math.ceil(orderSqFt / sqFtPerBox) : 0;
    var totalCost = orderSqFt * pricePerSqFt;

    var outNet = document.querySelector('#output_netBacksplashSqFt .output-number');
    var outTiles = document.querySelector('#output_totalTilesNeeded .output-number');
    var outBoxes = document.querySelector('#output_totalBoxesNeeded .output-number');
    var outCost = document.querySelector('#output_totalBacksplashCost .output-number');

    if (outNet) outNet.textContent = netSqFt.toFixed(2) + ' sq ft';
    if (outTiles) outTiles.textContent = totalTiles + ' tiles';
    if (outBoxes) outBoxes.textContent = boxesNeeded + ' boxes';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(netSqFt, orderSqFt - netSqFt, boxesNeeded, totalCost);

    if (window.logHistory) {
      window.logHistory('backsplash-tile-calculator', {
        netSqFt: netSqFt.toFixed(2) + ' sq ft',
        tilesNeeded: totalTiles + ' tiles',
        boxesNeeded: boxesNeeded + ' boxes',
        totalCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netSqFt, wasteSqFt, boxesNeeded, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdown';

    var ctx = canvas.getContext('2d');

    if (tabId === 'boxCost') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Backsplash Material Cost', 'Purchased Boxes (' + boxesNeeded + ')'],
          datasets: [{
            data: [parseFloat(totalCost.toFixed(2)), boxesNeeded * 5],
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
          labels: ['Net Backsplash Sq Ft', 'Waste Allowance Sq Ft'],
          datasets: [{
            label: 'Square Feet',
            data: [parseFloat(netSqFt.toFixed(2)), parseFloat(wasteSqFt.toFixed(2))],
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
    document.getElementById('input_wallLengthFeet').value = 12;
    document.getElementById('input_backsplashHeightInches').value = 18;
    document.getElementById('input_outletDeductions').value = 4;
    document.getElementById('input_tilePreset').value = '3x6';
    document.getElementById('input_tileLengthInches').value = 3;
    document.getElementById('input_tileWidthInches').value = 6;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_sqFtPerBox').value = 10;
    document.getElementById('input_pricePerSqFt').value = 8.50;
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
