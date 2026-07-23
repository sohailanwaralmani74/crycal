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
    var pattern = document.getElementById('input_plantingPattern').value;
    var length = parseFloat(document.getElementById('input_areaLength').value) || 0;
    var width = parseFloat(document.getElementById('input_areaWidth').value) || 0;
    var spacing = parseFloat(document.getElementById('input_plantSpacing').value) || 1;
    var pricePerPlant = parseFloat(document.getElementById('input_plantPrice').value) || 0;
    var mulchDepthInches = parseFloat(document.getElementById('input_mulchDepthInches').value) || 3;

    var totalPlants = 0;
    var rowsCount = 1;
    var colsCount = 1;
    var totalAreaSqFt = 0;

    if (pattern === 'linear_row') {
      colsCount = Math.floor(length / spacing) + 1;
      rowsCount = 1;
      totalPlants = colsCount;
      totalAreaSqFt = length * spacing;
    } else if (pattern === 'double_staggered') {
      colsCount = Math.floor(length / spacing) + 1;
      rowsCount = 2;
      totalPlants = colsCount * 2;
      totalAreaSqFt = length * (spacing * 1.5);
    } else if (pattern === 'square_grid') {
      colsCount = Math.floor(length / spacing) + 1;
      rowsCount = Math.floor(width / spacing) + 1;
      totalPlants = colsCount * rowsCount;
      totalAreaSqFt = length * width;
    } else if (pattern === 'triangular_grid') {
      colsCount = Math.floor(length / spacing) + 1;
      var rowDist = spacing * 0.866;
      rowsCount = Math.floor(width / rowDist) + 1;
      totalPlants = colsCount * rowsCount;
      totalAreaSqFt = length * width;
    }

    var sqFtPerPlant = totalPlants > 0 ? (totalAreaSqFt / totalPlants) : 0;

    // Mulch ring: 3ft radius = 28.27 sq ft per plant
    var ringSqFt = 28.27;
    var mulchVolumeCuFt = totalPlants * ringSqFt * (mulchDepthInches / 12.0);
    var mulchCuYds = mulchVolumeCuFt / 27.0;

    var totalCost = totalPlants * pricePerPlant;

    var outPlants = document.querySelector('#output_totalPlantsNeeded .output-number');
    var outSqFtPer = document.querySelector('#output_sqFtPerPlant .output-number');
    var outRowCol = document.querySelector('#output_rowColCount .output-number');
    var outMulch = document.querySelector('#output_totalMulchCuYds .output-number');
    var outCost = document.querySelector('#output_totalPlantCost .output-number');

    if (outPlants) outPlants.textContent = totalPlants.toLocaleString() + ' plants / trees';
    if (outSqFtPer) outSqFtPer.textContent = sqFtPerPlant.toFixed(1) + ' sq ft / plant';
    if (outRowCol) outRowCol.textContent = rowsCount + ' row(s) × ' + colsCount + ' col(s)';
    if (outMulch) outMulch.textContent = mulchCuYds.toFixed(2) + ' cu yds (' + mulchDepthInches + '" depth)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(totalPlants, sqFtPerPlant, length, pricePerPlant);

    if (window.logHistory) {
      window.logHistory('tree-shrub-spacing-calculator', {
        areaLength: length + ' ft',
        plantSpacing: spacing + ' ft',
        totalPlantsNeeded: totalPlants + ' plants',
        totalPlantCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(totalPlants, sqFtPerPlant, length, pricePerPlant) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'plantDensityDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'plantCountBySpacingOption') {
      var spacings = [3, 4, 5, 6, 8, 10];
      var labels = ['3 ft', '4 ft', '5 ft', '6 ft', '8 ft', '10 ft'];
      var plantCounts = spacings.map(function(s) {
        return Math.floor(length / s) + 1;
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Single Row Plant Count (' + length + ' ft run)',
            data: plantCounts,
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var canopyArea = totalPlants * Math.PI * 4; // 2ft radius canopy
      var openArea = Math.max(0, (totalPlants * sqFtPerPlant) - canopyArea);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Est. Foliage Canopy Area (sq ft)', 'Open Inter-Plant Space (sq ft)'],
          datasets: [{
            data: [Math.round(canopyArea), Math.round(openArea)],
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
    document.getElementById('input_plantingPattern').value = 'linear_row';
    document.getElementById('input_areaLength').value = 100;
    document.getElementById('input_areaWidth').value = 40;
    document.getElementById('input_plantSpacing').value = 6;
    document.getElementById('input_plantPrice').value = 24.50;
    document.getElementById('input_mulchDepthInches').value = '3';
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
