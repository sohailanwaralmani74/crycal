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
    var area = parseFloat(document.getElementById('input_projectArea').value) || 0;
    var fastenerType = document.getElementById('input_fastenerType').value || 'drywall_screws';
    var containerSize = document.getElementById('input_fastenerContainerSize').value || '5lb';
    var pricePerBox = parseFloat(document.getElementById('input_pricePerBox').value) || 0;

    var pieceRatePerSqFt = 0.35; // drywall screws: 350 per 1000 sq ft = 0.35/sq ft
    var piecesPerLb = 220;

    if (fastenerType === 'framing_nails') {
      pieceRatePerSqFt = 0.55;
      piecesPerLb = 48;
    } else if (fastenerType === 'deck_screws') {
      pieceRatePerSqFt = 3.50;
      piecesPerLb = 75;
    } else if (fastenerType === 'roofing_nails') {
      pieceRatePerSqFt = 3.20;
      piecesPerLb = 140;
    } else if (fastenerType === 'subfloor_screws') {
      pieceRatePerSqFt = 2.50;
      piecesPerLb = 110;
    }

    var totalFastenerCount = Math.ceil(area * pieceRatePerSqFt);
    var totalWeightLbs = totalFastenerCount / piecesPerLb;

    var boxWeight = 5;
    if (containerSize === '1lb') boxWeight = 1;
    else if (containerSize === '25lb') boxWeight = 25;

    var boxesRequired = Math.ceil(totalWeightLbs / boxWeight);
    if (boxesRequired < 1) boxesRequired = 1;

    var totalCost = boxesRequired * pricePerBox;

    var outCount = document.querySelector('#output_totalFastenerCount .output-number');
    var outWeight = document.querySelector('#output_totalWeightLbs .output-number');
    var outBoxes = document.querySelector('#output_boxesRequired .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outCount) outCount.textContent = totalFastenerCount.toLocaleString() + ' pieces';
    if (outWeight) outWeight.textContent = totalWeightLbs.toFixed(1) + ' lbs (' + totalWeightLbs.toFixed(2) + ' lbs net)';
    if (outBoxes) outBoxes.textContent = boxesRequired + ' boxes (' + containerSize + ' packages)';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(area, totalFastenerCount, totalWeightLbs, totalCost);

    if (window.logHistory) {
      window.logHistory('screw-nail-quantity-calculator', {
        projectArea: area + ' sq ft',
        fastenerType: fastenerType,
        totalFastenerCount: totalFastenerCount + ' pcs',
        boxesRequired: boxesRequired + ' boxes',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(area, totalFastenerCount, totalWeightLbs, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'fastenerCountBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Fasteners Total Cost ', 'Estimated Waste Factor Allowance '],
          datasets: [{
            data: [
              parseFloat((totalCost * 0.95).toFixed(2)),
              parseFloat((totalCost * 0.05).toFixed(2))
            ],
            backgroundColor: ['#16A085', '#F39C12']
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
          labels: ['Project Area (sq ft)', 'Fastener Pieces Count', 'Total Weight (lbs)'],
          datasets: [{
            label: 'Quantity',
            data: [area, totalFastenerCount, parseFloat(totalWeightLbs.toFixed(1))],
            backgroundColor: ['#2980B9', '#16A085', '#8E44AD']
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
    document.getElementById('input_projectArea').value = 1000;
    document.getElementById('input_fastenerType').value = 'drywall_screws';
    document.getElementById('input_fastenerContainerSize').value = '5lb';
    document.getElementById('input_pricePerBox').value = 28.00;
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
