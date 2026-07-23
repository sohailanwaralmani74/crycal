(function() {
  'use strict';

  var chartInstance = null;

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
    var area = parseFloat(document.getElementById('input_areaSqFt').value) || 0;
    var depth = parseFloat(document.getElementById('input_depthInches').value) || 0;
    var density = parseFloat(document.getElementById('input_densityTonsPerYd').value) || 1.30;
    var pricePerYard = parseFloat(document.getElementById('input_pricePerYard').value) || 0;
    var bagCost = parseFloat(document.getElementById('input_bagCost40Lb').value) || 0;

    var cuFt = area * (depth / 12);
    var cuYds = cuFt / 27;
    var weightTons = cuYds * density;
    var weightLbs = weightTons * 2000;
    var bags = Math.ceil(weightLbs / 40);

    var totalBulkCost = cuYds * pricePerYard;
    var totalBagCost = bags * bagCost;

    var outYds = document.querySelector('#output_cubicYards .output-number');
    var outTons = document.querySelector('#output_soilWeightTons .output-number');
    var outBags = document.querySelector('#output_bags40Lb .output-number');
    var outCost = document.querySelector('#output_totalBulkCost .output-number');

    if (outYds) outYds.textContent = cuYds.toFixed(2) + ' cu yd';
    if (outTons) outTons.textContent = weightTons.toFixed(2) + ' tons';
    if (outBags) outBags.textContent = bags + ' bags';
    if (outCost) outCost.textContent = formatCurrency(totalBulkCost);

    updateChart(cuYds, weightTons, totalBulkCost, totalBagCost);

    if (window.logHistory) {
      window.logHistory('topsoil-calculator', {
        areaSqFt: area + ' sq ft',
        depthInches: depth + ' in',
        cubicYards: cuYds.toFixed(2) + ' cu yd',
        soilWeightTons: weightTons.toFixed(2) + ' tons'
      });
    }
  }

  function updateChart(cuYds, weightTons, bulkCost, bagCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeWeight';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bulk Topsoil Delivery', '40 lb Retail Bags Total'],
          datasets: [{
            label: 'Total Material Cost',
            data: [
              parseFloat(bulkCost.toFixed(2)),
              parseFloat(bagCost.toFixed(2))
            ],
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
        type: 'doughnut',
        data: {
          labels: ['Volume (Cubic Yards)', 'Weight (Tons)'],
          datasets: [{
            data: [parseFloat(cuYds.toFixed(2)), parseFloat(weightTons.toFixed(2))],
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
    document.getElementById('input_areaSqFt').value = 400;
    document.getElementById('input_depthInches').value = 4;
    document.getElementById('input_densityTonsPerYd').value = 1.30;
    document.getElementById('input_pricePerYard').value = 32.00;
    document.getElementById('input_bagCost40Lb').value = 3.50;
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
