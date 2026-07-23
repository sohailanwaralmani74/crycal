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
    var lengthFt = parseFloat(document.getElementById('input_floorLengthFeet').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_floorWidthFeet').value) || 0;
    var depthInches = parseFloat(document.getElementById('input_averagePourDepthInches').value) || 0.25;
    var bagWeightLbs = parseFloat(document.getElementById('input_bagWeightLbs').value) || 50;
    var yield18SqFt = parseFloat(document.getElementById('input_bagYieldSqFtPer18Inch').value) || 40;
    var primerCovSqFt = parseFloat(document.getElementById('input_primerCoverageSqFt').value) || 300;

    var areaSqFt = lengthFt * widthFt;
    var volumeCuFt = areaSqFt * (depthInches / 12);

    // Yield scaling: coverage at depth D = yield18 * (0.125 / D)
    var coverageAtDepth = yield18SqFt * (0.125 / depthInches);
    var netBags = areaSqFt / coverageAtDepth;
    var grossBags = Math.ceil(netBags * 1.10); // 10% waste

    var primerGallons = Math.ceil(areaSqFt / primerCovSqFt);
    var totalDryWeightLbs = grossBags * bagWeightLbs;

    var outArea = document.querySelector('#output_totalFloorSqFt .output-number');
    var outVol = document.querySelector('#output_volumeCubicFeet .output-number');
    var outBags = document.querySelector('#output_sluBagsNeeded .output-number');
    var outPrimer = document.querySelector('#output_primerGallonsNeeded .output-number');

    if (outArea) outArea.textContent = Math.round(areaSqFt).toLocaleString() + ' sq ft';
    if (outVol) outVol.textContent = volumeCuFt.toFixed(2) + ' cu ft (' + (volumeCuFt / 27).toFixed(2) + ' cu yd)';
    if (outBags) outBags.textContent = grossBags + ' Bags @ ' + bagWeightLbs + ' lbs (' + totalDryWeightLbs.toLocaleString() + ' lbs powder)';
    if (outPrimer) outPrimer.textContent = primerGallons + ' Gallon' + (primerGallons > 1 ? 's' : '') + ' (' + Math.round(areaSqFt) + ' sq ft substrate)';

    updateChart(areaSqFt, depthInches, yield18SqFt, grossBags, totalDryWeightLbs);

    if (window.logHistory) {
      window.logHistory('floor-leveling-compound-calculator', {
        floorLengthFeet: lengthFt + ' ft',
        floorWidthFeet: widthFt + ' ft',
        averagePourDepthInches: depthInches + '"',
        totalFloorSqFt: Math.round(areaSqFt) + ' sq ft',
        sluBagsNeeded: grossBags + ' Bags',
        primerGallonsNeeded: primerGallons + ' gal'
      });
    }
  }

  function updateChart(areaSqFt, depthInches, yield18, currentBags, dryLbs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bagsByDepth';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialWeight') {
      var waterLbs = currentBags * 5 * 8.34; // 5 qts water per bag = 10.4 lbs water
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Dry SLU Powder Weight (lbs)', 'Mixing Water Weight (lbs)'],
          datasets: [{
            data: [Math.round(dryLbs), Math.round(waterLbs)],
            backgroundColor: ['#C08A2E', '#4A90E2']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      // Bags for 1/8", 1/4", 1/2", 1"
      var b18 = Math.ceil((areaSqFt / (yield18 * (0.125 / 0.125))) * 1.10);
      var b25 = Math.ceil((areaSqFt / (yield18 * (0.125 / 0.25))) * 1.10);
      var b50 = Math.ceil((areaSqFt / (yield18 * (0.125 / 0.50))) * 1.10);
      var b100 = Math.ceil((areaSqFt / (yield18 * (0.125 / 1.00))) * 1.10);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1/8" Depth', '1/4" Depth', '1/2" Depth', '1" Depth'],
          datasets: [{
            label: '50lb Bags Needed',
            data: [b18, b25, b50, b100],
            backgroundColor: ['#2F6F5E', '#4A90E2', '#C08A2E', '#E74C3C']
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
    document.getElementById('input_floorLengthFeet').value = 20;
    document.getElementById('input_floorWidthFeet').value = 15;
    document.getElementById('input_averagePourDepthInches').value = "0.25";
    document.getElementById('input_bagWeightLbs').value = 50;
    document.getElementById('input_bagYieldSqFtPer18Inch').value = 40;
    document.getElementById('input_primerCoverageSqFt').value = 300;
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
