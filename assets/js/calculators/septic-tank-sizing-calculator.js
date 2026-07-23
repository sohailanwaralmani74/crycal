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
    var bedrooms = parseInt(document.getElementById('input_bedroomCount').value, 10) || 3;
    var sqFt = parseFloat(document.getElementById('input_homeSquareFeet').value) || 2200;
    var disposal = document.getElementById('input_garbageDisposal').value || 'yes';
    var highFlow = document.getElementById('input_highFlowFixtures').value || 'no';
    var mpi = parseFloat(document.getElementById('input_soilPercolationRate').value) || 30;

    // Daily Flow (GPD)
    var dailyFlowGPD = bedrooms * 150;
    if (highFlow === 'yes') dailyFlowGPD += 150;

    // Minimum Tank Size
    var baseTank = 1000;
    if (bedrooms === 4) baseTank = 1250;
    else if (bedrooms === 5) baseTank = 1500;
    else if (bedrooms === 6) baseTank = 1750;
    else if (bedrooms >= 7) baseTank = 2000;

    if (disposal === 'yes') {
      baseTank = Math.max(1250, baseTank * 1.20);
    }

    var tankGallons = Math.ceil(baseTank / 250) * 250;

    // Soil Application Rate (GPD/sq ft)
    var appRate = 0.60;
    if (mpi <= 10) appRate = 1.00;
    else if (mpi <= 20) appRate = 0.80;
    else if (mpi <= 30) appRate = 0.60;
    else if (mpi <= 45) appRate = 0.45;
    else if (mpi <= 60) appRate = 0.35;
    else appRate = 0.25;

    var drainFieldSqFt = dailyFlowGPD / appRate;
    var chamberCount = Math.ceil(drainFieldSqFt / 12); // 3ft x 4ft plastic chamber approx 12 sq ft effective

    var outFlow = document.querySelector('#output_estimatedDailyFlowGPD .output-number');
    var outTank = document.querySelector('#output_recommendedTankCapacityGallons .output-number');
    var outField = document.querySelector('#output_recommendedDrainFieldSqFt .output-number');
    var outChambers = document.querySelector('#output_recommendedChamberCount .output-number');

    if (outFlow) outFlow.textContent = Math.round(dailyFlowGPD) + ' GPD';
    if (outTank) outTank.textContent = tankGallons.toLocaleString() + ' Gallons Tank';
    if (outField) outField.textContent = Math.round(drainFieldSqFt).toLocaleString() + ' Sq Ft Area';
    if (outChambers) outChambers.textContent = chamberCount + ' Chambers (3 ft units)';

    updateChart(bedrooms, dailyFlowGPD, tankGallons, drainFieldSqFt);

    if (window.logHistory) {
      window.logHistory('septic-tank-sizing-calculator', {
        bedroomCount: bedrooms,
        estimatedDailyFlowGPD: Math.round(dailyFlowGPD) + ' GPD',
        recommendedTankCapacityGallons: tankGallons + ' gal',
        recommendedDrainFieldSqFt: Math.round(drainFieldSqFt) + ' sq ft'
      });
    }
  }

  function updateChart(bedrooms, dailyFlowGPD, tankGallons, drainFieldSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'tankCapacityVsBedrooms';

    var ctx = canvas.getContext('2d');
    if (tabId === 'dailyWastewaterBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Daily Wastewater Flow (GPD)', 'Tank Retention Volume Reserve (Gal / 2)'],
          datasets: [{
            data: [Math.round(dailyFlowGPD), Math.round(tankGallons / 2)],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var bedLabels = [1, 2, 3, 4, 5, 6];
      var sizes = bedLabels.map(function(b) {
        if (b <= 3) return 1000;
        if (b === 4) return 1250;
        if (b === 5) return 1500;
        return 1750;
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: bedLabels.map(function(b) { return b + ' Bed'; }),
          datasets: [{
            label: 'Standard Septic Tank Size (Gallons)',
            data: sizes,
            backgroundColor: '#2F6F5E'
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
    document.getElementById('input_bedroomCount').value = 3;
    document.getElementById('input_homeSquareFeet').value = 2200;
    document.getElementById('input_garbageDisposal').value = "yes";
    document.getElementById('input_highFlowFixtures').value = "no";
    document.getElementById('input_soilPercolationRate').value = 30;
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
