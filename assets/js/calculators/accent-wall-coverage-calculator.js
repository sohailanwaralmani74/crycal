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
    var wallW = parseFloat(document.getElementById('input_wallWidthFt').value) || 0;
    var wallH = parseFloat(document.getElementById('input_wallHeightFt').value) || 0;
    var accentStyle = document.getElementById('input_accentType').value || 'board_batten';
    var boardWIn = parseFloat(document.getElementById('input_boardWidthIn').value) || 3.5;
    var cols = parseInt(document.getElementById('input_gridColumns').value, 10) || 4;
    var rows = parseInt(document.getElementById('input_gridRows').value, 10) || 3;
    var coats = parseInt(document.getElementById('input_paintCoats').value, 10) || 2;

    var grossSqFt = wallW * wallH;
    var paintGal = (grossSqFt * coats) / 350.0;
    paintGal = Math.ceil(paintGal * 10) / 10;

    var vertFt = 0;
    var horizFt = 0;

    if (accentStyle === 'board_batten') {
      vertFt = (cols + 1) * wallH;
      horizFt = 1 * wallW; // Top rail
    } else if (accentStyle === 'lattice_grid') {
      vertFt = (cols + 1) * wallH;
      horizFt = (rows + 1) * wallW;
    } else {
      // Paint only
      vertFt = 0;
      horizFt = 0;
    }

    var subtotalTrimFt = vertFt + horizFt;
    var totalTrimFt = subtotalTrimFt * 1.10; // 10% waste allowance
    var boards8ft = Math.ceil(totalTrimFt / 8.0);

    var wallWIn = wallW * 12.0;
    var wallHIn = wallH * 12.0;

    var totalVertBoardWidthIn = (cols + 1) * boardWIn;
    var totalHorizBoardWidthIn = (rows + 1) * boardWIn;

    var innerBoxW = cols > 0 ? (wallWIn - totalVertBoardWidthIn) / cols : 0;
    var innerBoxH = rows > 0 ? (wallHIn - totalHorizBoardWidthIn) / rows : 0;

    innerBoxW = Math.max(0, innerBoxW);
    innerBoxH = Math.max(0, innerBoxH);

    var outArea = document.querySelector('#output_wallAreaSqFt .output-number');
    var outPaint = document.querySelector('#output_paintGallonsNeeded .output-number');
    var outTrimFt = document.querySelector('#output_totalTrimLinearFt .output-number');
    var outBoards = document.querySelector('#output_boardSticks8ft .output-number');
    var outBoxW = document.querySelector('#output_gridBoxWidthIn .output-number');
    var outBoxH = document.querySelector('#output_gridBoxHeightIn .output-number');

    if (outArea) outArea.textContent = grossSqFt.toFixed(1) + ' sq ft';
    if (outPaint) outPaint.textContent = paintGal.toFixed(1) + ' Gallons (' + coats + ' coats)';
    if (outTrimFt) outTrimFt.textContent = totalTrimFt.toFixed(1) + ' linear ft (incl 10% waste)';
    if (outBoards) outBoards.textContent = boards8ft + ' Boards (8\' stock)';
    if (outBoxW) outBoxW.textContent = innerBoxW.toFixed(2) + ' in';
    if (outBoxH) outBoxH.textContent = innerBoxH.toFixed(2) + ' in';

    updateChart(grossSqFt, totalTrimFt, boardWIn, vertFt, horizFt);

    if (window.logHistory) {
      window.logHistory('accent-wall-coverage-calculator', {
        wallAreaSqFt: grossSqFt.toFixed(1) + ' sq ft',
        paintGallonsNeeded: paintGal.toFixed(1) + ' gal',
        totalTrimLinearFt: totalTrimFt.toFixed(1) + ' ft',
        boardSticks8ft: boards8ft + ' Boards'
      });
    }
  }

  function updateChart(grossSqFt, totalTrimFt, boardWIn, vertFt, horizFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'trimVSWallAreaChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'linearFeetBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Vertical Battens (ft)', 'Horizontal Rails (ft)', 'Total Trim (ft)'],
          datasets: [{
            label: 'Linear Footage',
            data: [parseFloat(vertFt.toFixed(1)), parseFloat(horizFt.toFixed(1)), parseFloat(totalTrimFt.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#2563EB', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var trimSqFt = (totalTrimFt * (boardWIn / 12.0));
      var flatDrywallSqFt = Math.max(0, grossSqFt - trimSqFt);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Flat Drywall Surface Area (sq ft)', 'Trim Board Covered Area (sq ft)'],
          datasets: [{
            data: [parseFloat(flatDrywallSqFt.toFixed(1)), parseFloat(trimSqFt.toFixed(1))],
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
    document.getElementById('input_wallWidthFt').value = 14;
    document.getElementById('input_wallHeightFt').value = 9;
    document.getElementById('input_accentType').value = "board_batten";
    document.getElementById('input_boardWidthIn').value = 3.5;
    document.getElementById('input_gridColumns').value = 4;
    document.getElementById('input_gridRows').value = 3;
    document.getElementById('input_paintCoats').value = 2;
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
