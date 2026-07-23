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
    var numSteps = parseFloat(document.getElementById('input_numberOfSteps').value) || 0;
    var riserInches = parseFloat(document.getElementById('input_riserHeightInches').value) || 0;
    var treadInches = parseFloat(document.getElementById('input_treadDepthInches').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_stairWidthFt').value) || 0;
    var platformDepthFt = parseFloat(document.getElementById('input_platformDepthFt').value) || 0;
    var bagWeight = document.getElementById('input_bagWeightLbs').value || '80';
    var costPerBag = parseFloat(document.getElementById('input_bagCost').value) || 0;

    var riserFt = riserInches / 12;
    var treadFt = treadInches / 12;

    // Steps volume sum: width * tread * riser * (N * (N + 1) / 2)
    var stepsSumFactor = (numSteps * (numSteps + 1)) / 2;
    var stepsCuFt = widthFt * treadFt * riserFt * stepsSumFactor;

    // Landing / platform volume
    var landingHeightFt = numSteps * riserFt;
    var platformCuFt = widthFt * platformDepthFt * landingHeightFt;

    var netTotalCuFt = stepsCuFt + platformCuFt;
    var totalCuYds = (netTotalCuFt / 27) * 1.10; // +10% waste

    var bagYieldCuFt = 0.60;
    if (bagWeight === '60') bagYieldCuFt = 0.45;
    if (bagWeight === '40') bagYieldCuFt = 0.30;

    var bagsNeeded = Math.ceil((netTotalCuFt * 1.10) / bagYieldCuFt);
    var matCost = bagsNeeded * costPerBag;

    var outYards = document.querySelector('#output_totalStairVolumeYards .output-number');
    var outCuFt = document.querySelector('#output_totalStairVolumeCuFt .output-number');
    var outBags = document.querySelector('#output_bagsNeeded .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outYards) outYards.textContent = totalCuYds.toFixed(2) + ' cu yds';
    if (outCuFt) outCuFt.textContent = (netTotalCuFt * 1.10).toFixed(1) + ' cu ft';
    if (outBags) outBags.textContent = bagsNeeded + ' bags (' + bagWeight + ' lb)';
    if (outCost) outCost.textContent = formatCurrency(matCost);

    updateChart(stepsCuFt, platformCuFt, bagsNeeded, matCost);

    if (window.logHistory) {
      window.logHistory('concrete-stairs-calculator', {
        numberOfSteps: numSteps + ' steps',
        stairWidthFt: widthFt + ' ft',
        totalStairVolumeYards: totalCuYds.toFixed(2) + ' cu yds',
        bagsNeeded: bagsNeeded + ' bags'
      });
    }
  }

  function updateChart(stepsCuFt, platformCuFt, bagsNeeded, matCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'bagComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bags Needed', 'Material Cost '],
          datasets: [{
            label: 'Bags & Cost',
            data: [bagsNeeded, parseFloat(matCost.toFixed(2))],
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
          labels: ['Stair Steps Concrete Volume', 'Top Landing Platform Volume'],
          datasets: [{
            data: [parseFloat(stepsCuFt.toFixed(2)), parseFloat(platformCuFt.toFixed(2))],
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
    document.getElementById('input_numberOfSteps').value = 5;
    document.getElementById('input_riserHeightInches').value = 7;
    document.getElementById('input_treadDepthInches').value = 11;
    document.getElementById('input_stairWidthFt').value = 4;
    document.getElementById('input_platformDepthFt').value = 3;
    document.getElementById('input_bagWeightLbs').value = '80';
    document.getElementById('input_bagCost').value = 6.50;
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
