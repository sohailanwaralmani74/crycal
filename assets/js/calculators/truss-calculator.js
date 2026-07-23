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
    var buildingLength = parseFloat(document.getElementById('input_buildingLength').value) || 0;
    var trussSpacingInches = parseFloat(document.getElementById('input_trussSpacing').value) || 24;
    var gableOption = parseInt(document.getElementById('input_gableTrusses').value, 10) || 0;
    var priceCommon = parseFloat(document.getElementById('input_pricePerTruss').value) || 0;
    var priceGable = parseFloat(document.getElementById('input_pricePerGable').value) || 0;

    var spacingFt = trussSpacingInches / 12;
    var totalTrusses = Math.ceil(buildingLength / spacingFt) + 1;

    var gableCount = 0;
    var commonCount = totalTrusses;

    if (gableOption === 2 && totalTrusses >= 2) {
      gableCount = 2;
      commonCount = totalTrusses - 2;
    }

    var costCommon = commonCount * priceCommon;
    var costGable = gableCount * priceGable;
    var totalCost = costCommon + costGable;

    var outTotal = document.querySelector('#output_totalTrusses .output-number');
    var outCommon = document.querySelector('#output_commonTrusses .output-number');
    var outGable = document.querySelector('#output_gableTrussesCount .output-number');
    var outCost = document.querySelector('#output_totalOrderCost .output-number');

    if (outTotal) outTotal.textContent = totalTrusses + ' trusses';
    if (outCommon) outCommon.textContent = commonCount + ' common trusses';
    if (outGable) outGable.textContent = gableCount + ' gable trusses';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(commonCount, gableCount, costCommon, costGable);

    if (window.logHistory) {
      window.logHistory('truss-calculator', {
        buildingLength: buildingLength + ' ft',
        trussSpacing: trussSpacingInches + '" OC',
        totalTrusses: totalTrusses + ' trusses',
        commonTrusses: commonCount + ' common',
        totalOrderCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(commonCount, gableCount, costCommon, costGable) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'trussTypeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'trussCostBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Common Trusses Cost ', 'Gable End Trusses Cost '],
          datasets: [{
            data: [parseFloat(costCommon.toFixed(2)), parseFloat(costGable.toFixed(2))],
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
          labels: ['Common Web Trusses', 'Gable End Trusses'],
          datasets: [{
            label: 'Trusses Count',
            data: [commonCount, gableCount],
            backgroundColor: ['#2F6F5E', '#4A90E2']
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
    document.getElementById('input_buildingLength').value = 40;
    document.getElementById('input_trussSpacing').value = '24';
    document.getElementById('input_gableTrusses').value = '2';
    document.getElementById('input_pricePerTruss').value = 125.00;
    document.getElementById('input_pricePerGable').value = 165.00;
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
