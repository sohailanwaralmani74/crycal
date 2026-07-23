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
    var length = parseFloat(document.getElementById('input_lawnLength').value) || 0;
    var width = parseFloat(document.getElementById('input_lawnWidth').value) || 0;
    var rollW = parseFloat(document.getElementById('input_rollWidthFeet').value) || 15;
    var turfPriceSqFt = parseFloat(document.getElementById('input_turfPricePerSqFt').value) || 0;
    var infillRate = parseFloat(document.getElementById('input_infillRateLbs').value) || 2.0;
    var sandBagPrice = parseFloat(document.getElementById('input_sandBagPrice').value) || 0;
    var seamTapePrice = parseFloat(document.getElementById('input_seamTapePrice').value) || 0;
    var nailsPrice100 = parseFloat(document.getElementById('input_turfNailsPrice').value) || 0;

    var netSqFt = length * width;

    var rollStrips = rollW > 0 ? Math.ceil(width / rollW) : 1;
    var turfSqFtPurchased = (rollStrips * rollW) * length * 1.05;

    var totalInfillLbs = netSqFt * infillRate;
    var sandBagsCount = Math.ceil(totalInfillLbs / 50.0);

    var seamTapeFeet = Math.max(0, (rollStrips - 1) * length);
    var seamTapeRolls = Math.ceil(seamTapeFeet / 50.0);

    var perimeterFt = 2 * (length + width);
    var nailsCount = Math.ceil((perimeterFt / 0.33) + (netSqFt / 2.0));
    var nailPacksCount = Math.ceil(nailsCount / 100.0);

    var turfCost = turfSqFtPurchased * turfPriceSqFt;
    var sandCost = sandBagsCount * sandBagPrice;
    var tapeCost = seamTapeRolls * seamTapePrice;
    var nailsCost = nailPacksCount * nailsPrice100;
    var totalCost = turfCost + sandCost + tapeCost + nailsCost;

    var outNetArea = document.querySelector('#output_totalLawnSqFt .output-number');
    var outTurfSqFt = document.querySelector('#output_turfSqFtNeeded .output-number');
    var outRolls = document.querySelector('#output_turfRollsCount .output-number');
    var outSand = document.querySelector('#output_infillSandBags .output-number');
    var outNails = document.querySelector('#output_turfNailsCount .output-number');
    var outCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outNetArea) outNetArea.textContent = Math.round(netSqFt).toLocaleString() + ' sq ft';
    if (outTurfSqFt) outTurfSqFt.textContent = Math.round(turfSqFtPurchased).toLocaleString() + ' sq ft';
    if (outRolls) outRolls.textContent = rollStrips + ' strip(s) (' + rollW + '\' wide × ' + Math.round(length) + '\' long)';
    if (outSand) outSand.textContent = sandBagsCount + ' bags (' + Math.round(totalInfillLbs).toLocaleString() + ' lbs silica sand)';
    if (outNails) outNails.textContent = nailsCount + ' nails (' + nailPacksCount + ' × 100-pk)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(turfCost, sandCost, (tapeCost + nailsCost), totalInfillLbs);

    if (window.logHistory) {
      window.logHistory('artificial-turf-calculator', {
        totalLawnSqFt: Math.round(netSqFt) + ' sq ft',
        turfPricePerSqFt: formatCurrency(turfPriceSqFt),
        infillSandBags: sandBagsCount + ' bags',
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(turfCost, sandCost, hardwareCost, totalInfillLbs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdownTurfVsInfill';

    var ctx = canvas.getContext('2d');
    if (tabId === 'infillWeightByArea') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Silica Sand Infill (lbs)'],
          datasets: [{
            label: 'Infill Weight (lbs)',
            data: [Math.round(totalInfillLbs)],
            backgroundColor: ['#2F6F5E']
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
          labels: ['Synthetic Grass Turf', 'Silica Sand Infill', 'Seam Tape & Turf Nails'],
          datasets: [{
            data: [
              parseFloat(turfCost.toFixed(2)),
              parseFloat(sandCost.toFixed(2)),
              parseFloat(hardwareCost.toFixed(2))
            ],
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
    document.getElementById('input_lawnLength').value = 30;
    document.getElementById('input_lawnWidth').value = 20;
    document.getElementById('input_rollWidthFeet').value = '15';
    document.getElementById('input_turfPricePerSqFt').value = 3.80;
    document.getElementById('input_infillRateLbs').value = '2.0';
    document.getElementById('input_sandBagPrice').value = 12.00;
    document.getElementById('input_seamTapePrice').value = 35.00;
    document.getElementById('input_turfNailsPrice').value = 18.00;
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
