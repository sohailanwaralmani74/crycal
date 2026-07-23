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
    var totalRiseIn = parseFloat(document.getElementById('input_totalRiseInches').value) || 0;
    var targetRiserIn = parseFloat(document.getElementById('input_targetRiserHeightIn').value) || 7.5;
    var treadDepthIn = parseFloat(document.getElementById('input_treadDepthIn').value) || 10;
    var stringersCount = parseInt(document.getElementById('input_numStringers').value, 10) || 2;
    var boardStockFt = parseFloat(document.getElementById('input_lumberLengthFt').value) || 12;
    var pricePerBoard = parseFloat(document.getElementById('input_pricePerStringerBoard').value) || 0;

    var numRisers = targetRiserIn > 0 ? Math.round(totalRiseIn / targetRiserIn) : 0;
    if (numRisers < 1) numRisers = 1;

    var exactRiserH = numRisers > 0 ? (totalRiseIn / numRisers) : 0;
    var numTreads = Math.max(0, numRisers - 1);
    var totalRunIn = numTreads * treadDepthIn;

    var runFeet = Math.floor(totalRunIn / 12);
    var runInchesRemainder = (totalRunIn % 12).toFixed(1);
    var runStr = runFeet + ' ft ' + runInchesRemainder + ' in';

    var hypotenuseIn = Math.sqrt(Math.pow(totalRiseIn, 2) + Math.pow(totalRunIn, 2));
    var minStringerLenFt = hypotenuseIn / 12;

    var totalCost = stringersCount * pricePerBoard;

    var outRisers = document.querySelector('#output_totalRisersCount .output-number');
    var outRiserHeight = document.querySelector('#output_exactRiserHeightIn .output-number');
    var outTreads = document.querySelector('#output_totalTreadsCount .output-number');
    var outRun = document.querySelector('#output_totalStairRunFtIn .output-number');
    var outStringerLen = document.querySelector('#output_minStringerLengthFt .output-number');
    var outCost = document.querySelector('#output_totalStringerLumberCost .output-number');

    if (outRisers) outRisers.textContent = numRisers + ' Risers';
    if (outRiserHeight) outRiserHeight.textContent = exactRiserH.toFixed(3) + ' in';
    if (outTreads) outTreads.textContent = numTreads + ' Treads';
    if (outRun) outRun.textContent = runStr;
    if (outStringerLen) outStringerLen.textContent = minStringerLenFt.toFixed(2) + ' ft (' + boardStockFt + ' ft Stock)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(totalRiseIn / 12, totalRunIn / 12, minStringerLenFt, stringersCount, pricePerBoard);

    if (window.logHistory) {
      window.logHistory('stair-stringer-calculator', {
        totalRiseInches: totalRiseIn + ' in',
        totalRisersCount: numRisers + ' Risers',
        exactRiserHeightIn: exactRiserH.toFixed(2) + ' in',
        totalStairRunFtIn: runStr,
        totalStringerLumberCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(riseFt, runFt, hypotenuseFt, stringersCount, pricePerBoard) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'geometryTab';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costTab') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Stringer Boards Count (' + stringersCount + ')', 'Unit Price ($' + pricePerBoard + ')'],
          datasets: [{
            data: [stringersCount, pricePerBoard],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
          labels: ['Vertical Rise (ft)', 'Horizontal Run (ft)', 'Stringer Length (ft)'],
          datasets: [{
            label: 'Feet',
            data: [parseFloat(riseFt.toFixed(2)), parseFloat(runFt.toFixed(2)), parseFloat(hypotenuseFt.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_totalRiseInches').value = 108;
    document.getElementById('input_targetRiserHeightIn').value = 7.5;
    document.getElementById('input_treadDepthIn').value = 10.5;
    document.getElementById('input_numStringers').value = 3;
    document.getElementById('input_lumberLengthFt').value = 12;
    document.getElementById('input_pricePerStringerBoard').value = 34.00;
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
