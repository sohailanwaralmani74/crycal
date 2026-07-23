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
    var roofArea = parseFloat(document.getElementById('input_roofFootprintSqFt').value) || 0;
    var efficiency = parseFloat(document.getElementById('input_roofPitchEfficiency').value) || 0.95;
    var rainInches = parseFloat(document.getElementById('input_designRainfallInches').value) || 1.0;
    var unitCap = parseFloat(document.getElementById('input_barrelUnitCapacity').value) || 55;
    var barrelPrice = parseFloat(document.getElementById('input_barrelPrice').value) || 0;
    var dailyUsageGal = parseFloat(document.getElementById('input_avgDailyIrrigationGal').value) || 15;

    var grossRunoffGal = roofArea * rainInches * 0.6233;
    var effectiveHarvestGal = grossRunoffGal * efficiency;

    var barrelsNeeded = unitCap > 0 ? Math.ceil(effectiveHarvestGal / unitCap) : 0;
    var storageCapacityGal = barrelsNeeded * unitCap;
    var overflowGal = Math.max(0, effectiveHarvestGal - storageCapacityGal);

    var daysProvided = dailyUsageGal > 0 ? (effectiveHarvestGal / dailyUsageGal) : 0;
    var totalCost = barrelsNeeded * barrelPrice;

    var outGross = document.querySelector('#output_totalStormRunoffGallons .output-number');
    var outEffective = document.querySelector('#output_effectiveHarvestGallons .output-number');
    var outBarrels = document.querySelector('#output_barrelsNeeded .output-number');
    var outDays = document.querySelector('#output_irrigationDaysProvided .output-number');
    var outCost = document.querySelector('#output_totalSystemCost .output-number');

    if (outGross) outGross.textContent = Math.round(grossRunoffGal).toLocaleString() + ' gallons';
    if (outEffective) outEffective.textContent = Math.round(effectiveHarvestGal).toLocaleString() + ' gallons (' + Math.round(efficiency * 100) + '% harvested)';
    if (outBarrels) outBarrels.textContent = barrelsNeeded + ' unit(s) (' + unitCap + ' gal ea)';
    if (outDays) outDays.textContent = daysProvided.toFixed(1) + ' days (' + dailyUsageGal + ' gal/day usage)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(Math.min(effectiveHarvestGal, storageCapacityGal), overflowGal, roofArea, efficiency);

    if (window.logHistory) {
      window.logHistory('rain-barrel-sizing-calculator', {
        roofFootprintSqFt: roofArea + ' sq ft',
        designRainfallInches: rainInches + '"',
        effectiveHarvestGallons: Math.round(effectiveHarvestGal) + ' gal',
        barrelsNeeded: barrelsNeeded + ' units'
      });
    }
  }

  function updateChart(harvestedGal, overflowGal, roofArea, efficiency) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'stormwaterHarvestVsOverflow';

    var ctx = canvas.getContext('2d');
    if (tabId === 'runoffByRainfallInches') {
      var rainDepths = [0.25, 0.50, 1.00, 2.00];
      var labels = ['0.25" Rain', '0.50" Rain', '1.00" Rain', '2.00" Rain'];
      var runoffData = rainDepths.map(function(r) {
        return Math.round(roofArea * r * 0.6233 * efficiency);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Effective Harvested Water (Gallons)',
            data: runoffData,
            backgroundColor: '#2F6F5E'
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
          labels: ['Stored Rainwater (Gallons)', 'Downspout Overflow Volume (Gallons)'],
          datasets: [{
            data: [Math.round(harvestedGal), Math.round(overflowGal)],
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
    document.getElementById('input_roofFootprintSqFt').value = 800;
    document.getElementById('input_roofPitchEfficiency').value = '0.95';
    document.getElementById('input_designRainfallInches').value = '1.0';
    document.getElementById('input_barrelUnitCapacity').value = '55';
    document.getElementById('input_barrelPrice').value = 85.00;
    document.getElementById('input_avgDailyIrrigationGal').value = 15;
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
