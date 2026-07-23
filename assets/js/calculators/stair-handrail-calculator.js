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
    var run = parseFloat(document.getElementById('input_stairRun').value) || 0;
    var rise = parseFloat(document.getElementById('input_stairRise').value) || 0;
    var extensionInches = parseFloat(document.getElementById('input_railExtension').value) || 0;
    var bracketSpacing = parseFloat(document.getElementById('input_bracketSpacing').value) || 36;
    var pricePerFoot = parseFloat(document.getElementById('input_pricePerRailFoot').value) || 0;
    var pricePerBracket = parseFloat(document.getElementById('input_pricePerBracket').value) || 0;

    var diagInches = Math.sqrt((run * run) + (rise * rise));
    var totalLengthInches = diagInches + (extensionInches * 2);
    var totalLengthFt = totalLengthInches / 12;

    var angleRad = Math.atan2(rise, run);
    var angleDeg = angleRad * (180 / Math.PI);

    var numBrackets = Math.max(2, Math.ceil((totalLengthInches - 12) / bracketSpacing) + 1);
    var wallReturnsCount = 2; // Top & Bottom wall returns

    var costRail = totalLengthFt * pricePerFoot;
    var costBrackets = numBrackets * pricePerBracket;
    var costReturns = wallReturnsCount * 14.00; // Average return fitting price
    var totalCost = costRail + costBrackets + costReturns;

    var outRailFt = document.querySelector('#output_totalRailLengthFt .output-number');
    var outAngle = document.querySelector('#output_stairSlopeAngle .output-number');
    var outBrackets = document.querySelector('#output_wallBrackets .output-number');
    var outReturns = document.querySelector('#output_wallReturns .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outRailFt) outRailFt.textContent = totalLengthFt.toFixed(1) + ' Feet (' + Math.round(totalLengthInches) + ' inches)';
    if (outAngle) outAngle.textContent = angleDeg.toFixed(1) + '° Slope Incline';
    if (outBrackets) outBrackets.textContent = numBrackets + ' Brackets (spaced @ ' + bracketSpacing + '" o.c.)';
    if (outReturns) outReturns.textContent = wallReturnsCount + ' Safety Wall Returns';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(totalLengthFt, run / 12, angleDeg, costRail, costBrackets, costReturns);

    if (window.logHistory) {
      window.logHistory('stair-handrail-calculator', {
        stairRun: (run / 12).toFixed(1) + ' ft',
        stairRise: (rise / 12).toFixed(1) + ' ft',
        totalRailLengthFt: totalLengthFt.toFixed(1) + ' ft',
        wallBrackets: numBrackets + ' brackets',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(totalLengthFt, runFt, angleDeg, costRail, costBrackets, costReturns) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'lengthvsIncline';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Handrail Material ', 'Wall Brackets ', 'Wall Return Fittings '],
          datasets: [{
            data: [
              parseFloat(costRail.toFixed(2)),
              parseFloat(costBrackets.toFixed(2)),
              parseFloat(costReturns.toFixed(2))
            ],
            backgroundColor: ['#6C5CE7', '#00B894', '#FF7675']
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
          labels: ['Horizontal Stair Run (ft)', 'Diagonal Handrail Length (ft)'],
          datasets: [{
            label: 'Feet',
            data: [parseFloat(runFt.toFixed(1)), parseFloat(totalLengthFt.toFixed(1))],
            backgroundColor: ['#0984E3', '#6C5CE7']
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
    document.getElementById('input_stairRun').value = 120;
    document.getElementById('input_stairRise').value = 84;
    document.getElementById('input_railExtension').value = 12;
    document.getElementById('input_bracketSpacing').value = '36';
    document.getElementById('input_pricePerRailFoot').value = 8.50;
    document.getElementById('input_pricePerBracket').value = 11.00;
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
