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
    var area = parseFloat(document.getElementById('input_roofAreaSqFt').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercent').value) || 0;
    var eaveFt = parseFloat(document.getElementById('input_eaveLengthFt').value) || 0;
    var ridgeFt = parseFloat(document.getElementById('input_ridgeLengthFt').value) || 0;
    var coveragePerBundle = parseFloat(document.getElementById('input_shingleCoverageSqFt').value) || 33.33;

    var areaWithWaste = area * (1 + wastePct / 100);
    var totalSquares = Math.ceil((areaWithWaste / 100) * 100) / 100;
    var fieldBundles = Math.ceil(areaWithWaste / coveragePerBundle);
    var starterBundles = Math.ceil(eaveFt / 105);
    var ridgeBundles = Math.ceil(ridgeFt / 33);

    var outBundles = document.querySelector('#output_totalShingleBundles .output-number');
    var outSquares = document.querySelector('#output_totalRoofSquares .output-number');
    var outStarter = document.querySelector('#output_starterStripBundles .output-number');
    var outRidge = document.querySelector('#output_ridgeCapBundles .output-number');

    if (outBundles) outBundles.textContent = fieldBundles + ' bundles';
    if (outSquares) outSquares.textContent = totalSquares.toFixed(2) + ' sq';
    if (outStarter) outStarter.textContent = starterBundles + ' bundles';
    if (outRidge) outRidge.textContent = ridgeBundles + ' bundles';

    updateChart(fieldBundles, starterBundles, ridgeBundles, area, coveragePerBundle);

    if (window.logHistory) {
      window.logHistory('shingle-calculator', {
        roofAreaSqFt: area + ' sq ft',
        wastePercent: wastePct + '%',
        totalShingleBundles: fieldBundles + ' bundles',
        totalRoofSquares: totalSquares.toFixed(2) + ' sq'
      });
    }
  }

  function updateChart(fieldBundles, starterBundles, ridgeBundles, baseArea, coveragePerBundle) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bundleBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'wasteImpact') {
      var wasteRates = [0, 5, 10, 15, 20];
      var bundleCounts = wasteRates.map(function(w) {
        return Math.ceil((baseArea * (1 + w / 100)) / coveragePerBundle);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['0% Waste', '5% Waste', '10% Waste', '15% Waste', '20% Waste'],
          datasets: [{
            label: 'Field Shingle Bundles Needed',
            data: bundleCounts,
            backgroundColor: ['#2F6F5E', '#3D8B75', '#C08A2E', '#D99B36', '#B03A2E']
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
          labels: ['Field Shingle Bundles', 'Starter Strip Bundles', 'Ridge & Hip Cap Bundles'],
          datasets: [{
            data: [fieldBundles, starterBundles, ridgeBundles],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#5D6D7E']
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
    document.getElementById('input_roofAreaSqFt').value = 2200;
    document.getElementById('input_wastePercent').value = 10;
    document.getElementById('input_eaveLengthFt').value = 140;
    document.getElementById('input_ridgeLengthFt').value = 50;
    document.getElementById('input_shingleCoverageSqFt').value = "33.33";
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
