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
    var area = parseFloat(document.getElementById('input_totalWindowAreaSqFt').value) || 250;
    var uOld = parseFloat(document.getElementById('input_currentWindowUValue').value) || 0.80;
    var uNew = parseFloat(document.getElementById('input_newWindowUValue').value) || 0.27;
    var deltaT = parseFloat(document.getElementById('input_winterDesignDeltaT').value) || 50;
    var hdd = parseFloat(document.getElementById('input_heatingDegreeDaysHDD').value) || 4500;
    var costKWh = parseFloat(document.getElementById('input_energyCostPerKWh').value) || 0.18;

    // R-Values
    var rOld = 1 / uOld;
    var rNew = 1 / uNew;

    // Peak Heat Loss (BTU/hr)
    var btuOld = uOld * area * deltaT;
    var btuNew = uNew * area * deltaT;
    var btuReduction = btuOld - btuNew;

    // Annual Energy Loss (BTU & kWh)
    var annualBtuOld = uOld * area * hdd * 24;
    var annualBtuNew = uNew * area * hdd * 24;
    var annualBtuSavings = annualBtuOld - annualBtuNew;

    var annualKWhSavings = annualBtuSavings / 3412;
    var annualDollarSavings = annualKWhSavings * costKWh;

    var outRVal = document.querySelector('#output_equivalentRValues .output-number');
    var outBTU = document.querySelector('#output_peakHeatLossReductionBTU .output-number');
    var outKWh = document.querySelector('#output_annualEnergySavingsKWh .output-number');
    var outCost = document.querySelector('#output_annualCostSavingsDollars .output-number');

    if (outRVal) outRVal.textContent = 'R-' + rOld.toFixed(2) + ' -> R-' + rNew.toFixed(2);
    if (outBTU) outBTU.textContent = Math.round(btuReduction).toLocaleString() + ' BTU/hr Saved (' + Math.round(btuOld) + ' -> ' + Math.round(btuNew) + ')';
    if (outKWh) outKWh.textContent = Math.round(annualKWhSavings).toLocaleString() + ' kWh / Year';
    if (outCost) outCost.textContent = '$' + Math.round(annualDollarSavings).toLocaleString() + ' / Year Savings';

    updateChart(btuOld, btuNew, annualDollarSavings);

    if (window.logHistory) {
      window.logHistory('window-u-value-energy-loss-calculator', {
        totalWindowAreaSqFt: area + ' sq ft',
        equivalentRValues: 'R-' + rOld.toFixed(2) + ' to R-' + rNew.toFixed(2),
        annualEnergySavingsKWh: Math.round(annualKWhSavings) + ' kWh',
        annualCostSavingsDollars: '$' + Math.round(annualDollarSavings) + '/yr'
      });
    }
  }

  function updateChart(btuOld, btuNew, annualDollarSavings) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'heatLossComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'annualCostSavings') {
      var years = [1, 3, 5, 7, 10];
      var cumulativeSavings = years.map(function(y) { return Math.round(annualDollarSavings * y); });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years.map(function(y) { return 'Year ' + y; }),
          datasets: [{
            label: 'Cumulative Dollar Savings ',
            data: cumulativeSavings,
            backgroundColor: '#2F6F5E'
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
          labels: ['Current Window Heat Loss (BTU/hr)', 'Upgraded Window Heat Loss (BTU/hr)'],
          datasets: [{
            label: 'Peak Conductive Heat Loss Rate (BTU/hr)',
            data: [Math.round(btuOld), Math.round(btuNew)],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_totalWindowAreaSqFt').value = 250;
    document.getElementById('input_currentWindowUValue').value = "0.80";
    document.getElementById('input_newWindowUValue').value = "0.27";
    document.getElementById('input_winterDesignDeltaT').value = 50;
    document.getElementById('input_heatingDegreeDaysHDD').value = 4500;
    document.getElementById('input_energyCostPerKWh').value = 0.18;
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
