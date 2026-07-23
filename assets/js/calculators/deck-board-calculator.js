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
    var deckLength = parseFloat(document.getElementById('input_deckLength').value) || 0;
    var deckWidth = parseFloat(document.getElementById('input_deckWidth').value) || 0;
    var boardType = document.getElementById('input_boardType').value || '54x6';
    var stockLength = parseFloat(document.getElementById('input_boardLength').value) || 16;
    var gapSize = parseFloat(document.getElementById('input_gapSize').value) || 0.125;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var pricePerBoard = parseFloat(document.getElementById('input_pricePerBoard').value) || 0;

    var actualWidthInches = 5.5;
    if (boardType === '2x4') actualWidthInches = 3.5;

    var effectiveWidthFt = (actualWidthInches + gapSize) / 12;
    var boardRuns = Math.ceil(deckWidth / effectiveWidthFt);

    var netLinearFeet = boardRuns * deckLength;
    var stockBoardsPerRun = Math.ceil(deckLength / stockLength);
    var netStockBoards = boardRuns * stockBoardsPerRun;

    var totalStockBoardsWithWaste = Math.ceil(netStockBoards * (1 + (wastePct / 100)));
    var totalLinearFeetWithWaste = totalStockBoardsWithWaste * stockLength;

    var deckArea = deckLength * deckWidth;
    var totalCost = totalStockBoardsWithWaste * pricePerBoard;
    var wasteBoards = totalStockBoardsWithWaste - netStockBoards;

    var outBoards = document.querySelector('#output_totalBoards .output-number');
    var outLF = document.querySelector('#output_linearFeet .output-number');
    var outArea = document.querySelector('#output_deckArea .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outBoards) outBoards.textContent = totalStockBoardsWithWaste + ' boards (' + stockLength + '\')';
    if (outLF) outLF.textContent = Math.round(totalLinearFeetWithWaste).toLocaleString() + ' LF';
    if (outArea) outArea.textContent = deckArea.toFixed(1) + ' sq ft';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netStockBoards, wasteBoards, deckLength, boardRuns, pricePerBoard, wastePct);

    if (window.logHistory) {
      window.logHistory('deck-board-calculator', {
        deckLength: deckLength + 'x' + deckWidth + ' ft',
        boardType: boardType,
        totalBoards: totalStockBoardsWithWaste + ' boards',
        linearFeet: Math.round(totalLinearFeetWithWaste) + ' LF',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netBoards, wasteBoards, deckLength, boardRuns, pricePerBoard, wastePct) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'boardBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costByStockLength') {
      var stockLengths = [12, 16, 20];
      var costs = stockLengths.map(function(len) {
        var boardsPerRun = Math.ceil(deckLength / len);
        var netB = boardRuns * boardsPerRun;
        var totalB = Math.ceil(netB * (1 + (wastePct / 100)));
        return parseFloat((totalB * pricePerBoard).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['12ft Stock Boards', '16ft Stock Boards', '20ft Stock Boards'],
          datasets: [{
            label: 'Estimated Material Cost ',
            data: costs,
            backgroundColor: ['#2F6F5E', '#4A90E2', '#C08A2E']
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
          labels: ['Net Stock Boards', 'Waste Allowance Boards'],
          datasets: [{
            data: [netBoards, wasteBoards],
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
    document.getElementById('input_deckLength').value = 20;
    document.getElementById('input_deckWidth').value = 12;
    document.getElementById('input_boardType').value = '54x6';
    document.getElementById('input_boardLength').value = '16';
    document.getElementById('input_gapSize').value = 0.125;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerBoard').value = 18.50;
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
