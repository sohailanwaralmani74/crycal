(function() {
  'use strict';

  var chartInstance = null;

  var POROSITY_MAP = {
    'raw_drywall': 250,
    'bare_wood': 275,
    'previously_painted': 350,
    'masonry_stucco': 200
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
    var areaSqFt = parseFloat(document.getElementById('input_surfaceAreaSqFt').value) || 0;
    var surfaceType = document.getElementById('input_surfaceType').value || 'raw_drywall';
    var coats = parseInt(document.getElementById('input_coatCount').value, 10) || 1;
    var pricePerGal = parseFloat(document.getElementById('input_pricePerGallon').value) || 0;

    var coverageRate = POROSITY_MAP[surfaceType] || 250;
    var totalCoverageNeeded = areaSqFt * coats;

    var exactGal = coverageRate > 0 ? (totalCoverageNeeded / coverageRate) : 0;
    var gallonsNeeded = Math.ceil(exactGal);

    var pails5Gal = Math.floor(gallonsNeeded / 5);
    var cans1Gal = gallonsNeeded % 5;

    var totalCost = gallonsNeeded * pricePerGal;

    var outGallons = document.querySelector('#output_totalGallonsNeeded .output-number');
    var outPails = document.querySelector('#output_total5GalPails .output-number');
    var outCans = document.querySelector('#output_total1GalCans .output-number');
    var outCoverage = document.querySelector('#output_effectiveCoverageSqFt .output-number');
    var outCost = document.querySelector('#output_totalPrimerCost .output-number');

    if (outGallons) outGallons.textContent = gallonsNeeded + ' Gallons (' + exactGal.toFixed(1) + ' exact)';
    if (outPails) outPails.textContent = pails5Gal + ' Pails (5-Gal)';
    if (outCans) outCans.textContent = cans1Gal + ' Cans (1-Gal)';
    if (outCoverage) outCoverage.textContent = coverageRate + ' sq ft / gal';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(pails5Gal * 5, cans1Gal, areaSqFt, gallonsNeeded);

    if (window.logHistory) {
      window.logHistory('primer-coverage-calculator', {
        surfaceAreaSqFt: areaSqFt + ' sq ft',
        surfaceType: surfaceType,
        coatCount: coats,
        totalGallonsNeeded: gallonsNeeded + ' Gallons',
        totalPrimerCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(pailsGallons, cansGallons, areaSqFt, totalGallons) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'pailsVsCans';

    var ctx = canvas.getContext('2d');
    if (tabId === 'surfaceVsGallons') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Surface Area (sq ft)', 'Primer Gallons Needed × 100'],
          datasets: [{
            label: 'Area vs Primer Gallons',
            data: [areaSqFt, totalGallons * 100],
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
          labels: ['Gallons from 5-Gal Pails', 'Gallons from 1-Gal Cans'],
          datasets: [{
            data: [pailsGallons, cansGallons],
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
    document.getElementById('input_surfaceAreaSqFt').value = 1200;
    document.getElementById('input_surfaceType').value = 'raw_drywall';
    document.getElementById('input_coatCount').value = '1';
    document.getElementById('input_pricePerGallon').value = 24.00;
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
