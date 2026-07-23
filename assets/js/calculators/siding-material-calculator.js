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
    var grossArea = parseFloat(document.getElementById('input_wallArea').value) || 0;
    var deductions = parseFloat(document.getElementById('input_deductions').value) || 0;
    var sidingType = document.getElementById('input_sidingType').value || 'vinyl';
    var outsideCornersFt = parseFloat(document.getElementById('input_outsideCorners').value) || 0;
    var insideCornersFt = parseFloat(document.getElementById('input_insideCorners').value) || 0;
    var trimLengthFt = parseFloat(document.getElementById('input_trimLength').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePct').value) || 0;
    var pricePerSquare = parseFloat(document.getElementById('input_pricePerSquare').value) || 0;

    var netArea = Math.max(0, grossArea - deductions);
    var grossAreaWithWaste = netArea * (1 + (wastePct / 100));

    var squaresNeeded = Math.ceil(grossAreaWithWaste / 100);

    var outCornerPieces = Math.ceil(outsideCornersFt / 10);
    var inCornerPieces = Math.ceil(insideCornersFt / 10);
    var starterPieces = Math.ceil(Math.sqrt(grossArea) * 4 / 10); // Approx house base perimeter
    var jChannelPieces = Math.ceil(trimLengthFt / 12.5);

    var costSiding = squaresNeeded * pricePerSquare;
    var costTrim = (outCornerPieces * 22.00) + (inCornerPieces * 18.00) + (starterPieces * 8.50) + (jChannelPieces * 9.00);
    var totalCost = costSiding + costTrim;

    var outNetArea = document.querySelector('#output_netArea .output-number');
    var outSquares = document.querySelector('#output_sidingSquares .output-number');
    var outOutCorners = document.querySelector('#output_outsideCornerPieces .output-number');
    var outInCorners = document.querySelector('#output_insideCornerPieces .output-number');
    var outStarter = document.querySelector('#output_starterStrips .output-number');
    var outJChannel = document.querySelector('#output_jChannelPieces .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outNetArea) outNetArea.textContent = netArea.toLocaleString() + ' sq ft';
    if (outSquares) outSquares.textContent = squaresNeeded + ' Squares (' + Math.round(grossAreaWithWaste) + ' sq ft w/ waste)';
    if (outOutCorners) outOutCorners.textContent = outCornerPieces + ' pieces (10 ft outside corners)';
    if (outInCorners) outInCorners.textContent = inCornerPieces + ' pieces (10 ft inside corners)';
    if (outStarter) outStarter.textContent = starterPieces + ' pieces (10 ft starter strip)';
    if (outJChannel) outJChannel.textContent = jChannelPieces + ' pieces (12.5 ft J-channel)';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netArea, grossAreaWithWaste - netArea, costSiding, costTrim);

    if (window.logHistory) {
      window.logHistory('siding-material-calculator', {
        wallArea: netArea.toLocaleString() + ' sq ft',
        sidingType: sidingType,
        sidingSquares: squaresNeeded + ' Sq',
        jChannelPieces: jChannelPieces + ' pcs',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netArea, wasteArea, costSiding, costTrim) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'componentCost') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Siding Panels Cost ', 'Corner & Trim Accessories '],
          datasets: [{
            data: [
              parseFloat(costSiding.toFixed(2)),
              parseFloat(costTrim.toFixed(2))
            ],
            backgroundColor: ['#2980B9', '#F39C12']
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
          labels: ['Net Wall Area (sq ft)', 'Waste Margin (sq ft)'],
          datasets: [{
            label: 'Square Footage',
            data: [Math.round(netArea), Math.round(wasteArea)],
            backgroundColor: ['#2980B9', '#E74C3C']
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
    document.getElementById('input_wallArea').value = 2000;
    document.getElementById('input_deductions').value = 300;
    document.getElementById('input_sidingType').value = 'vinyl';
    document.getElementById('input_outsideCorners').value = 40;
    document.getElementById('input_insideCorners').value = 20;
    document.getElementById('input_trimLength').value = 180;
    document.getElementById('input_wastePct').value = 10;
    document.getElementById('input_pricePerSquare').value = 180.00;
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
