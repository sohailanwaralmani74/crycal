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
    var lengthFt = parseFloat(document.getElementById('input_footingLengthFt').value) || 0;
    var widthInches = parseFloat(document.getElementById('input_footingWidthInches').value) || 0;
    var depthInches = parseFloat(document.getElementById('input_footingDepthInches').value) || 0;
    var rebarRuns = parseFloat(document.getElementById('input_rebarRuns').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('input_concretePricePerYard').value) || 0;
    var pricePerRebarFt = parseFloat(document.getElementById('input_rebarPricePerFoot').value) || 0;

    var widthFt = widthInches / 12;
    var depthFt = depthInches / 12;

    var netCuFt = lengthFt * widthFt * depthFt;
    var totalCuYds = (netCuFt / 27) * 1.10; // +10% waste

    var rebarFeet = lengthFt * rebarRuns * 1.15; // +15% lap factor

    var concreteCost = totalCuYds * pricePerYard;
    var rebarCost = rebarFeet * pricePerRebarFt;
    var totalCost = concreteCost + rebarCost;

    var outTotal = document.querySelector('#output_totalFootingCost .output-number');
    var outVolume = document.querySelector('#output_concreteVolumeYards .output-number');
    var outRebar = document.querySelector('#output_rebarLengthFeet .output-number');
    var outConcCost = document.querySelector('#output_concreteCostTotal .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outVolume) outVolume.textContent = totalCuYds.toFixed(2) + ' cu yds';
    if (outRebar) outRebar.textContent = Math.ceil(rebarFeet) + ' lin ft';
    if (outConcCost) outConcCost.textContent = formatCurrency(concreteCost);

    updateChart(concreteCost, rebarCost, totalCuYds, rebarFeet);

    if (window.logHistory) {
      window.logHistory('footing-calculator', {
        footingLengthFt: lengthFt + ' ft',
        footingWidthInches: widthInches + ' in',
        concreteVolumeYards: totalCuYds.toFixed(2) + ' cu yds',
        totalFootingCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(concreteCost, rebarCost, totalCuYds, rebarFeet) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'volumeVsLength') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Concrete Volume (cu yds)', 'Rebar Length (lin ft / 10)'],
          datasets: [{
            label: 'Material Quantities',
            data: [parseFloat(totalCuYds.toFixed(2)), parseFloat((rebarFeet / 10).toFixed(2))],
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
          labels: ['Ready-Mix Concrete Cost', 'Rebar Material Cost'],
          datasets: [{
            data: [parseFloat(concreteCost.toFixed(2)), parseFloat(rebarCost.toFixed(2))],
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
    document.getElementById('input_footingLengthFt').value = 150;
    document.getElementById('input_footingWidthInches').value = 20;
    document.getElementById('input_footingDepthInches').value = 12;
    document.getElementById('input_rebarRuns').value = 2;
    document.getElementById('input_concretePricePerYard').value = 140;
    document.getElementById('input_rebarPricePerFoot').value = 0.85;
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
