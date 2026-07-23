(function() {
  'use strict';

  var chartInstance = null;

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

    calculate();
  }

  function calculate() {
    var roomL = parseFloat(document.getElementById('input_roomLengthFt').value) || 0;
    var roomW = parseFloat(document.getElementById('input_roomWidthFt').value) || 0;
    var sofaL = parseFloat(document.getElementById('input_sofaLengthIn').value) || 0;
    var sofaD = parseFloat(document.getElementById('input_sofaDepthIn').value) || 0;
    var coffeeDist = parseFloat(document.getElementById('input_coffeeTableDistIn').value) || 16;
    var targetWalkway = parseFloat(document.getElementById('input_walkwayClearanceIn').value) || 36;

    var roomAreaSqFt = roomL * roomW;

    var primaryFootprintSqFt = (sofaL * (sofaD + coffeeDist)) / 144;
    var totalEstFurnitureSqFt = primaryFootprintSqFt * 2.2;

    var densityPct = roomAreaSqFt > 0 ? (totalEstFurnitureSqFt / roomAreaSqFt) * 100 : 0;
    var remainingSpanFt = roomW - ((sofaD + coffeeDist) / 12);

    var remainingSpanIn = remainingSpanFt * 12;

    var statusText = "PASS - Spacious Layout";
    if (densityPct > 50 || remainingSpanIn < targetWalkway) {
      statusText = "TIGHT - Constricted Clearance";
    } else if (densityPct >= 30 && densityPct <= 45) {
      statusText = "PASS - Ideal Scale Balance";
    } else if (densityPct < 25) {
      statusText = "PASS - Open / Sparse";
    }

    var outArea = document.querySelector('#output_roomAreaSqFt .output-number');
    var outFootprint = document.querySelector('#output_furnitureCoverageSqFt .output-number');
    var outRatio = document.querySelector('#output_furnitureRatioPercent .output-number');
    var outSpan = document.querySelector('#output_remainingWalkwaySpaceFt .output-number');
    var outStatus = document.querySelector('#output_clearanceStatus .output-number');

    if (outArea) outArea.textContent = roomAreaSqFt.toLocaleString() + ' sq ft';
    if (outFootprint) outFootprint.textContent = totalEstFurnitureSqFt.toFixed(1) + ' sq ft';
    if (outRatio) outRatio.textContent = densityPct.toFixed(1) + '%';
    if (outSpan) outSpan.textContent = remainingSpanFt.toFixed(1) + ' ft (' + remainingSpanIn.toFixed(0) + '")';
    if (outStatus) outStatus.textContent = statusText;

    updateChart(totalEstFurnitureSqFt, Math.max(0, roomAreaSqFt - totalEstFurnitureSqFt), coffeeDist, targetWalkway, remainingSpanIn);

    if (window.logHistory) {
      window.logHistory('furniture-layout-scale-calculator', {
        roomLengthFt: roomL + ' ft',
        roomWidthFt: roomW + ' ft',
        furnitureRatioPercent: densityPct.toFixed(1) + '%',
        clearanceStatus: statusText
      });
    }
  }

  function updateChart(furnArea, openArea, coffeeDist, targetWalkway, actualWalkway) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'roomDensityChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'clearanceMetricsChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Coffee Table Dist (in)', 'Target Walkway (in)', 'Calculated Room Clearance (in)'],
          datasets: [{
            label: 'Inches',
            data: [coffeeDist, targetWalkway, Math.max(0, actualWalkway)],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
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
          labels: ['Estimated Furniture Footprint', 'Open Walkway & Floor Space'],
          datasets: [{
            data: [parseFloat(furnArea.toFixed(1)), parseFloat(openArea.toFixed(1))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_roomLengthFt').value = 18;
    document.getElementById('input_roomWidthFt').value = 14;
    document.getElementById('input_sofaLengthIn').value = 84;
    document.getElementById('input_sofaDepthIn').value = 38;
    document.getElementById('input_coffeeTableDistIn').value = 16;
    document.getElementById('input_walkwayClearanceIn').value = 36;
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
