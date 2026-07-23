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
    var wallLength = parseFloat(document.getElementById('input_wallLengthFeet').value) || 0;
    var spacingInches = parseFloat(document.getElementById('input_studSpacing').value) || 16;
    var corners = parseFloat(document.getElementById('input_cornerCount').value) || 0;
    var openings = parseFloat(document.getElementById('input_openingCount').value) || 0;
    var priceStud = parseFloat(document.getElementById('input_pricePerStud').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;

    var baseStuds = Math.ceil((wallLength * 12) / spacingInches) + 1;
    var cornerStuds = corners * 2;
    var openingStuds = openings * 2;
    var netStuds = baseStuds + cornerStuds + openingStuds;
    var totalStudsWithWaste = Math.ceil(netStuds * (1 + (wastePct / 100)));

    // Plates: 3 runs (1 bottom + 2 top plates) = Wall Length * 3
    var plateLF = wallLength * 3;
    var plateBoards16ft = Math.ceil(plateLF / 16);

    // Assume 16ft plate board costs ~ 2x single stud price
    var pricePlateBoard = priceStud * 2;

    var costStuds = totalStudsWithWaste * priceStud;
    var costPlates = plateBoards16ft * pricePlateBoard;
    var totalCost = costStuds + costPlates;
    var totalPieces = totalStudsWithWaste + plateBoards16ft;

    var outStuds = document.querySelector('#output_totalStuds .output-number');
    var outPlates = document.querySelector('#output_totalPlateBoards .output-number');
    var outPieces = document.querySelector('#output_totalLumberPieces .output-number');
    var outCost = document.querySelector('#output_totalEstimatedCost .output-number');

    if (outStuds) outStuds.textContent = totalStudsWithWaste + ' studs';
    if (outPlates) outPlates.textContent = plateBoards16ft + ' boards (16\')';
    if (outPieces) outPieces.textContent = totalPieces + ' pieces';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(totalStudsWithWaste, plateBoards16ft, costStuds, costPlates);

    if (window.logHistory) {
      window.logHistory('stud-framing-calculator', {
        wallLengthFeet: wallLength + ' ft',
        studSpacing: spacingInches + '" OC',
        totalStuds: totalStudsWithWaste + ' studs',
        totalPlateBoards: plateBoards16ft + ' boards',
        totalEstimatedCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(studs, plates, costStuds, costPlates) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'studBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Wall Studs Cost ', 'Plate Boards Cost '],
          datasets: [{
            data: [parseFloat(costStuds.toFixed(2)), parseFloat(costPlates.toFixed(2))],
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
          labels: ['Wall Studs (pcs)', '16ft Plate Boards (pcs)'],
          datasets: [{
            label: 'Pieces',
            data: [studs, plates],
            backgroundColor: ['#2F6F5E', '#4A90E2']
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
    document.getElementById('input_wallLengthFeet').value = 40;
    document.getElementById('input_studSpacing').value = "16";
    document.getElementById('input_cornerCount').value = 2;
    document.getElementById('input_openingCount').value = 2;
    document.getElementById('input_pricePerStud').value = 6.50;
    document.getElementById('input_wasteFactor').value = 10;
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
