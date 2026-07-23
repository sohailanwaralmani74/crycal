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

  function getCoverageRate(woodCond) {
    switch (woodCond) {
      case 'new_smooth': return 250;
      case 'weathered_rough': return 150;
      case 'composite_recoat': return 300;
      case 'pressure_treated':
      default: return 200;
    }
  }

  function calculate() {
    var length = parseFloat(document.getElementById('input_deckLength').value) || 0;
    var width = parseFloat(document.getElementById('input_deckWidth').value) || 0;
    var railingFt = parseFloat(document.getElementById('input_railingFeet').value) || 0;
    var steps = parseInt(document.getElementById('input_stairSteps').value, 10) || 0;
    var stepW = parseFloat(document.getElementById('input_stepWidth').value) || 0;
    var woodCond = document.getElementById('input_woodCondition').value;
    var coats = parseInt(document.getElementById('input_coatCount').value, 10) || 2;
    var pricePerGal = parseFloat(document.getElementById('input_stainPricePerGal').value) || 0;

    var floorArea = length * width;
    var railingArea = railingFt * 2.8;
    var stairArea = steps * (stepW * 2.25);
    var totalArea = floorArea + railingArea + stairArea;

    var coverageRate = getCoverageRate(woodCond);
    var coatMultiplier = coats === 1 ? 1.0 : 1.6;
    var totalGallonsRaw = (totalArea / coverageRate) * coatMultiplier;

    var totalQuartsRaw = totalGallonsRaw * 4;
    var fullGallons = Math.floor(totalGallonsRaw);
    var remainingQuarts = Math.ceil((totalGallonsRaw - fullGallons) * 4);

    if (remainingQuarts === 4) {
      fullGallons += 1;
      remainingQuarts = 0;
    }

    var galPrice = pricePerGal;
    var qtPrice = pricePerGal * 0.35;
    var totalCost = (fullGallons * galPrice) + (remainingQuarts * qtPrice);

    var outArea = document.querySelector('#output_totalSurfaceArea .output-number');
    var outGal = document.querySelector('#output_stainGallons .output-number');
    var outQt = document.querySelector('#output_stainQuarts .output-number');
    var outFullGal = document.querySelector('#output_gallonCansNeeded .output-number');
    var outAddQt = document.querySelector('#output_quartCansNeeded .output-number');
    var outCost = document.querySelector('#output_totalStainCost .output-number');

    if (outArea) outArea.textContent = Math.round(totalArea).toLocaleString() + ' sq ft';
    if (outGal) outGal.textContent = totalGallonsRaw.toFixed(2) + ' gal';
    if (outQt) outQt.textContent = Math.ceil(totalQuartsRaw) + ' qts';
    if (outFullGal) outFullGal.textContent = fullGallons + ' gal can(s)';
    if (outAddQt) outAddQt.textContent = remainingQuarts + ' qt can(s)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(floorArea, railingArea, stairArea, (totalArea / coverageRate), coats);

    if (window.logHistory) {
      window.logHistory('deck-wood-stain-calculator', {
        totalSurfaceArea: Math.round(totalArea) + ' sq ft',
        coatCount: coats + ' coats',
        gallonCansNeeded: fullGallons + ' gal + ' + remainingQuarts + ' qt',
        totalStainCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(floorArea, railingArea, stairArea, coat1Gal, coats) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'stainByCoat') {
      var coat2Gal = coats > 1 ? coat1Gal * 0.6 : 0;
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: coats > 1 ? ['Coat 1 (Saturation)', 'Coat 2 (Finish)'] : ['Coat 1 (Saturation)'],
          datasets: [{
            label: 'Stain Volume (Gallons)',
            data: coats > 1 ? [parseFloat(coat1Gal.toFixed(2)), parseFloat(coat2Gal.toFixed(2))] : [parseFloat(coat1Gal.toFixed(2))],
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
          labels: ['Deck Floor Boards (sq ft)', 'Railing & Balusters (sq ft)', 'Stairs & Risers (sq ft)'],
          datasets: [{
            data: [Math.round(floorArea), Math.round(railingArea), Math.round(stairArea)],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59']
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
    document.getElementById('input_deckLength').value = 20;
    document.getElementById('input_deckWidth').value = 16;
    document.getElementById('input_railingFeet').value = 52;
    document.getElementById('input_stairSteps').value = 4;
    document.getElementById('input_stepWidth').value = 4;
    document.getElementById('input_woodCondition').value = 'pressure_treated';
    document.getElementById('input_coatCount').value = '2';
    document.getElementById('input_stainPricePerGal').value = 48.00;
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
