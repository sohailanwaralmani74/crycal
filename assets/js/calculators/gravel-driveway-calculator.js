(function() {
  'use strict';

  var chartInstance = null;

  var DENSITY_MAP = {
    'crushed_stone': 1.40,
    'pea_gravel': 1.35,
    'bank_run': 1.25,
    'dense_base': 1.50
  };

  function getGlobalCurrency() {
    var picker = document.getElementById('globalCurrencyPicker');
    return picker ? picker.value : 'USD';
  }

  function formatCurrency(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(2);
    }
  }

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

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var lengthFt = parseFloat(document.getElementById('input_drivewayLengthFt').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_drivewayWidthFt').value) || 0;
    var depthInches = parseFloat(document.getElementById('input_gravelDepthInches').value) || 0;
    var gravelType = document.getElementById('input_gravelType').value || 'crushed_stone';
    var pricePerTon = parseFloat(document.getElementById('input_costPerTon').value) || 0;

    var areaSqFt = lengthFt * widthFt;
    var volumeCuFt = areaSqFt * (depthInches / 12);
    var volumeCuYd = volumeCuFt / 27;

    var density = DENSITY_MAP[gravelType] || 1.40;
    var weightTons = volumeCuYd * density;

    var totalCost = weightTons * pricePerTon;

    var outYds = document.querySelector('#output_volumeCubicYards .output-number');
    var outFt = document.querySelector('#output_volumeCubicFeet .output-number');
    var outTons = document.querySelector('#output_weightTons .output-number');
    var outArea = document.querySelector('#output_surfaceAreaSqFt .output-number');
    var outCost = document.querySelector('#output_totalGravelCost .output-number');

    if (outYds) outYds.textContent = volumeCuYd.toFixed(2) + ' Cu Yds';
    if (outFt) outFt.textContent = volumeCuFt.toFixed(1) + ' Cu Ft';
    if (outTons) outTons.textContent = weightTons.toFixed(2) + ' Tons';
    if (outArea) outArea.textContent = areaSqFt + ' sq ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(volumeCuYd, weightTons, areaSqFt, totalCost, depthInches);

    if (window.logHistory) {
      window.logHistory('gravel-driveway-calculator', {
        drivewayLengthFt: lengthFt + ' ft',
        drivewayWidthFt: widthFt + ' ft',
        volumeCubicYards: volumeCuYd.toFixed(2) + ' cu yds',
        weightTons: weightTons.toFixed(2) + ' tons',
        totalGravelCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(volumeCuYd, weightTons, areaSqFt, totalCost, depthInches) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeVsWeight';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costByDepth') {
      var depth2Cost = (areaSqFt * (2 / 12) / 27 * 1.40) * (totalCost / (weightTons || 1));
      var depth4Cost = totalCost;
      var depth6Cost = (areaSqFt * (6 / 12) / 27 * 1.40) * (totalCost / (weightTons || 1));

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['2" Depth (Resurfacing)', '4" Depth (Current)', '6" Depth (New Heavy Base)'],
          datasets: [{
            label: 'Cost by Depth ',
            data: [
              parseFloat(depth2Cost.toFixed(2)),
              parseFloat(depth4Cost.toFixed(2)),
              parseFloat(depth6Cost.toFixed(2))
            ],
            backgroundColor: ['#4A7B9D', '#2F6F5E', '#C08A2E']
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
          labels: ['Volume (Cubic Yards)', 'Weight (Tons)'],
          datasets: [{
            data: [parseFloat(volumeCuYd.toFixed(2)), parseFloat(weightTons.toFixed(2))],
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
    document.getElementById('input_drivewayLengthFt').value = 50;
    document.getElementById('input_drivewayWidthFt').value = 12;
    document.getElementById('input_gravelDepthInches').value = 4;
    document.getElementById('input_gravelType').value = 'crushed_stone';
    document.getElementById('input_costPerTon').value = 38.00;
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
