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
    var length = parseFloat(document.getElementById('input_length').value) || 0;
    var width = parseFloat(document.getElementById('input_width').value) || 0;
    var depthInches = parseFloat(document.getElementById('input_depthInches').value) || 0;
    var density = parseFloat(document.getElementById('input_asphaltDensity').value) || 145;
    var wastePct = parseFloat(document.getElementById('input_wastePct').value) || 0;
    var pricePerTon = parseFloat(document.getElementById('input_pricePerTon').value) || 0;

    var areaSqFt = length * width;
    var volumeCuFt = areaSqFt * (depthInches / 12);
    var volumeCuYds = volumeCuFt / 27;

    var netWeightLbs = volumeCuFt * density;
    var netTons = netWeightLbs / 2000;

    var grossTons = netTons * (1 + (wastePct / 100));
    var wasteTons = grossTons - netTons;

    var totalCost = grossTons * pricePerTon;

    var outTonnage = document.querySelector('#output_tonnageNeeded .output-number');
    var outCubicYards = document.querySelector('#output_cubicYards .output-number');
    var outSqFt = document.querySelector('#output_totalSqFt .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outTonnage) outTonnage.textContent = grossTons.toFixed(2) + ' Tons';
    if (outCubicYards) outCubicYards.textContent = volumeCuYds.toFixed(2) + ' cu yds';
    if (outSqFt) outSqFt.textContent = areaSqFt.toLocaleString() + ' sq ft';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netTons, wasteTons, totalCost, grossTons);

    if (window.logHistory) {
      window.logHistory('asphalt-calculator', {
        length: length + ' x ' + width + ' ft',
        depthInches: depthInches + ' in',
        tonnageNeeded: grossTons.toFixed(2) + ' Tons',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netTons, wasteTons, totalCost, grossTons) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialVsCompaction';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costByDepth') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Material Cost ', 'Waste/Allowance Cost '],
          datasets: [{
            data: [
              parseFloat((netTons * (totalCost / (grossTons || 1))).toFixed(2)),
              parseFloat((wasteTons * (totalCost / (grossTons || 1))).toFixed(2))
            ],
            backgroundColor: ['#2F3640', '#E1B12C']
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
          labels: ['Net Asphalt Needed', 'Waste & Compaction Factor'],
          datasets: [{
            label: 'Weight (Tons)',
            data: [parseFloat(netTons.toFixed(2)), parseFloat(wasteTons.toFixed(2))],
            backgroundColor: ['#2F3640', '#E1B12C']
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
    document.getElementById('input_length').value = 50;
    document.getElementById('input_width').value = 20;
    document.getElementById('input_depthInches').value = 3;
    document.getElementById('input_asphaltDensity').value = 145;
    document.getElementById('input_wastePct').value = 5;
    document.getElementById('input_pricePerTon').value = 100.00;
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
