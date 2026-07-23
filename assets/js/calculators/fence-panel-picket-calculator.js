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
    var fenceLen = parseFloat(document.getElementById('input_fenceLengthFt').value) || 0;
    var picketWidth = parseFloat(document.getElementById('input_picketWidthIn').value) || 0.1;
    var picketGap = parseFloat(document.getElementById('input_picketGapIn').value) || 0;
    var railsPerSec = parseInt(document.getElementById('input_railsPerSection').value, 10) || 2;
    var railLen = parseFloat(document.getElementById('input_railLengthFt').value) || 1;
    var picketPrice = parseFloat(document.getElementById('input_picketPrice').value) || 0;
    var railPrice = parseFloat(document.getElementById('input_railPrice').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var fenceInches = fenceLen * 12;
    var effWidth = picketWidth + picketGap;
    var rawPickets = effWidth > 0 ? (fenceInches / effWidth) : 0;
    var totalPickets = Math.ceil(rawPickets * (1 + wastePct / 100));

    var sections = Math.ceil(fenceLen / railLen);
    var totalRails = sections * railsPerSec;

    var picketCost = totalPickets * picketPrice;
    var railCost = totalRails * railPrice;
    var totalLumberCost = picketCost + railCost;

    var outPickets = document.querySelector('#output_totalPicketsNeeded .output-number');
    var outRails = document.querySelector('#output_totalRailsNeeded .output-number');
    var outPicketsCost = document.querySelector('#output_totalPicketCost .output-number');
    var outRailsCost = document.querySelector('#output_totalRailCost .output-number');
    var outTotalCost = document.querySelector('#output_totalFenceLumberCost .output-number');

    if (outPickets) outPickets.textContent = totalPickets + ' Pickets';
    if (outRails) outRails.textContent = totalRails + ' Rails (2x4)';
    if (outPicketsCost) outPicketsCost.textContent = formatCurrency(picketCost);
    if (outRailsCost) outRailsCost.textContent = formatCurrency(railCost);
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalLumberCost);

    updateChart(picketCost, railCost, totalPickets, totalRails);

    if (window.logHistory) {
      window.logHistory('fence-panel-picket-calculator', {
        fenceLengthFt: fenceLen + ' ft',
        picketWidthIn: picketWidth + ' in',
        totalPicketsNeeded: totalPickets + ' Pickets',
        totalRailsNeeded: totalRails + ' Rails',
        totalFenceLumberCost: formatCurrency(totalLumberCost)
      });
    }
  }

  function updateChart(picketCost, railCost, pickets, rails) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'quantitiesTab') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Pickets Needed', '2x4 Rails Needed'],
          datasets: [{
            label: 'Item Count',
            data: [pickets, rails],
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
          labels: ['Vertical Pickets Cost', 'Horizontal 2x4 Rails Cost'],
          datasets: [{
            data: [parseFloat(picketCost.toFixed(2)), parseFloat(railCost.toFixed(2))],
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
    document.getElementById('input_fenceLengthFt').value = 150;
    document.getElementById('input_picketWidthIn').value = 5.5;
    document.getElementById('input_picketGapIn').value = 0;
    document.getElementById('input_railsPerSection').value = 3;
    document.getElementById('input_railLengthFt').value = 8;
    document.getElementById('input_picketPrice').value = 2.75;
    document.getElementById('input_railPrice').value = 7.50;
    document.getElementById('input_wastePercentage').value = 10;
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
