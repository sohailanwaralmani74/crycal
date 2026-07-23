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
    var thickness = parseFloat(document.getElementById('input_thicknessInches').value) || 0;
    var width = parseFloat(document.getElementById('input_widthInches').value) || 0;
    var length = parseFloat(document.getElementById('input_lengthFeet').value) || 0;
    var count = parseFloat(document.getElementById('input_pieceCount').value) || 0;
    var pricePerBF = parseFloat(document.getElementById('input_pricePerBoardFoot').value) || 0;

    var singleBF = (thickness * width * length) / 12;
    var totalBF = singleBF * count;
    var pieceCost = singleBF * pricePerBF;
    var totalCost = totalBF * pricePerBF;

    var outSingleBF = document.querySelector('#output_singleBoardFeet .output-number');
    var outTotalBF = document.querySelector('#output_totalBoardFeet .output-number');
    var outCostPiece = document.querySelector('#output_costPerPiece .output-number');
    var outTotalCost = document.querySelector('#output_totalOrderCost .output-number');

    if (outSingleBF) outSingleBF.textContent = singleBF.toFixed(2) + ' BF';
    if (outTotalBF) outTotalBF.textContent = totalBF.toFixed(2) + ' BF';
    if (outCostPiece) outCostPiece.textContent = '$' + pieceCost.toFixed(2);
    if (outTotalCost) outTotalCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(singleBF, totalBF, pieceCost, totalCost);

    if (window.logHistory) {
      window.logHistory('board-feet-calculator', {
        thicknessInches: thickness + ' in',
        widthInches: width + ' in',
        lengthFeet: length + ' ft',
        pieceCount: count,
        totalBoardFeet: totalBF.toFixed(2) + ' BF',
        totalOrderCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(singleBF, totalBF, pieceCost, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bfBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Single Piece Cost ', 'Total Order Cost '],
          datasets: [{
            label: 'Cost ',
            data: [parseFloat(pieceCost.toFixed(2)), parseFloat(totalCost.toFixed(2))],
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
        type: 'bar',
        data: {
          labels: ['Board Feet per Piece', 'Total Board Feet (Order)'],
          datasets: [{
            label: 'Volume (BF)',
            data: [parseFloat(singleBF.toFixed(2)), parseFloat(totalBF.toFixed(2))],
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
    document.getElementById('input_thicknessInches').value = 2;
    document.getElementById('input_widthInches').value = 6;
    document.getElementById('input_lengthFeet').value = 8;
    document.getElementById('input_pieceCount').value = 10;
    document.getElementById('input_pricePerBoardFoot').value = 4.50;
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
