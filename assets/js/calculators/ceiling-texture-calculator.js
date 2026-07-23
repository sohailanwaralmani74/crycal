(function() {
  'use strict';

  var chartInstance = null;

  var PATTERN_MAP = {
    'popcorn': { baseCoverage: 350, baseWeight: 40 },
    'knockdown': { baseCoverage: 400, baseWeight: 50 },
    'orange_peel': { baseCoverage: 500, baseWeight: 50 },
    'smooth_skim': { baseCoverage: 250, baseWeight: 40 }
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
    var areaSqFt = parseFloat(document.getElementById('input_ceilingAreaSqFt').value) || 0;
    var textureStyle = document.getElementById('input_textureStyle').value || 'knockdown';
    var bagWeightLbs = parseFloat(document.getElementById('input_bagWeightLbs').value) || 50;
    var pricePerBag = parseFloat(document.getElementById('input_bagPrice').value) || 0;

    var patternInfo = PATTERN_MAP[textureStyle] || PATTERN_MAP['knockdown'];
    var adjCoverage = patternInfo.baseCoverage * (bagWeightLbs / patternInfo.baseWeight);

    var bagsNeeded = areaSqFt > 0 && adjCoverage > 0 ? Math.ceil(areaSqFt / adjCoverage) : 0;
    var totalLbs = bagsNeeded * bagWeightLbs;
    var totalCost = bagsNeeded * pricePerBag;
    var costPerSqFt = areaSqFt > 0 ? (totalCost / areaSqFt) : 0;

    var outBags = document.querySelector('#output_bagsNeeded .output-number');
    var outLbs = document.querySelector('#output_totalLbsNeeded .output-number');
    var outCoverage = document.querySelector('#output_coveragePerBagSqFt .output-number');
    var outTotalCost = document.querySelector('#output_totalTextureCost .output-number');
    var outCostSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outBags) outBags.textContent = bagsNeeded + ' Bags (' + bagWeightLbs + ' lbs each)';
    if (outLbs) outLbs.textContent = totalLbs.toLocaleString() + ' Lbs Dry Mix';
    if (outCoverage) outCoverage.textContent = Math.round(adjCoverage) + ' sq ft / bag';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);
    if (outCostSqFt) outCostSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(totalLbs, totalCost, areaSqFt, bagsNeeded * adjCoverage);

    if (window.logHistory) {
      window.logHistory('ceiling-texture-calculator', {
        ceilingAreaSqFt: areaSqFt + ' sq ft',
        textureStyle: textureStyle,
        bagsNeeded: bagsNeeded + ' Bags',
        totalLbsNeeded: totalLbs + ' lbs',
        totalTextureCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(totalLbs, totalCost, areaSqFt, capacitySqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'coverageComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ceiling Area Needed (sq ft)', 'Total Purchased Bag Coverage Capacity (sq ft)'],
          datasets: [{
            label: 'Area vs Bag Capacity',
            data: [areaSqFt, capacitySqFt],
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
          labels: ['Dry Mix Weight (Pounds)', 'Total Purchased Material Cost '],
          datasets: [{
            data: [totalLbs, parseFloat(totalCost.toFixed(2))],
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
    document.getElementById('input_ceilingAreaSqFt').value = 900;
    document.getElementById('input_textureStyle').value = 'knockdown';
    document.getElementById('input_bagWeightLbs').value = 50;
    document.getElementById('input_bagPrice').value = 18.50;
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
