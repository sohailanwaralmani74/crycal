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
    var roomL = parseFloat(document.getElementById('input_roomLength').value) || 0;
    var roomW = parseFloat(document.getElementById('input_roomWidth').value) || 0;
    var ceilingH = parseFloat(document.getElementById('input_ceilingHeight').value) || 9;
    var targetFc = parseFloat(document.getElementById('input_desiredIlluminance').value) || 30;
    var lumensPerFixture = parseFloat(document.getElementById('input_fixtureLumens').value) || 800;

    var roomArea = roomL * roomW;
    var cu = 0.60; // Coefficient of Utilization
    var totalLumensNeeded = (roomArea * targetFc) / cu;
    var estFixtures = Math.ceil(totalLumensNeeded / lumensPerFixture);
    estFixtures = Math.max(1, estFixtures);

    // Calculate grid aspect ratio matching room
    var ratio = roomW > 0 ? (roomW / roomL) : 1;
    var cols = Math.round(Math.sqrt(estFixtures * ratio));
    cols = Math.max(1, cols);
    var rows = Math.ceil(estFixtures / cols);
    rows = Math.max(1, rows);

    var totalFixtures = rows * cols;
    var deliveredLumens = totalFixtures * lumensPerFixture;

    var rowSpacing = roomL > 0 ? (roomL / rows) : 0;
    var colSpacing = roomW > 0 ? (roomW / cols) : 0;

    var wallDistL = rowSpacing / 2;
    var wallDistW = colSpacing / 2;

    var outFixtures = document.querySelector('#output_totalFixturesNeeded .output-number');
    var outGrid = document.querySelector('#output_gridRowsCols .output-number');
    var outRowSp = document.querySelector('#output_rowSpacingFt .output-number');
    var outColSp = document.querySelector('#output_colSpacingFt .output-number');
    var outWallL = document.querySelector('#output_wallDistanceLengthFt .output-number');
    var outWallW = document.querySelector('#output_wallDistanceWidthFt .output-number');

    if (outFixtures) outFixtures.textContent = totalFixtures + ' Recessed Fixtures';
    if (outGrid) outGrid.textContent = rows + ' Rows × ' + cols + ' Columns (' + totalFixtures + ' total)';
    if (outRowSp) outRowSp.textContent = rowSpacing.toFixed(2) + ' ft';
    if (outColSp) outColSp.textContent = colSpacing.toFixed(2) + ' ft';
    if (outWallL) outWallL.textContent = wallDistL.toFixed(2) + ' ft';
    if (outWallW) outWallW.textContent = wallDistW.toFixed(2) + ' ft';

    updateChart(rows, cols, totalFixtures, totalLumensNeeded, deliveredLumens);

    if (window.logHistory) {
      window.logHistory('lighting-fixture-spacing-calculator', {
        totalFixturesNeeded: totalFixtures + ' Fixtures',
        gridRowsCols: rows + ' × ' + cols,
        rowSpacingFt: rowSpacing.toFixed(2) + ' ft',
        colSpacingFt: colSpacing.toFixed(2) + ' ft'
      });
    }
  }

  function updateChart(rows, cols, totalFixtures, neededLumens, deliveredLumens) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'fixtureGridChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'lumensCoverageChart') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Delivered Fixture Lumens', 'Target Room Lumens Required'],
          datasets: [{
            data: [Math.round(deliveredLumens), Math.round(neededLumens)],
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
          labels: ['Grid Rows', 'Grid Columns', 'Total Fixtures'],
          datasets: [{
            label: 'Quantity',
            data: [rows, cols, totalFixtures],
            backgroundColor: ['#2563EB', '#2F6F5E', '#C08A2E']
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
    document.getElementById('input_roomLength').value = 20;
    document.getElementById('input_roomWidth').value = 15;
    document.getElementById('input_ceilingHeight').value = 9;
    document.getElementById('input_desiredIlluminance').value = "30";
    document.getElementById('input_fixtureLumens').value = 800;
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
