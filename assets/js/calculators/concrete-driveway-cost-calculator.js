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
    var length = parseFloat(document.getElementById('input_drivewayLengthFt').value) || 0;
    var width = parseFloat(document.getElementById('input_drivewayWidthFt').value) || 0;
    var thicknessInches = parseFloat(document.getElementById('input_drivewayThicknessInches').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('input_concreteCostPerYard').value) || 0;
    var gridSpacingInches = parseFloat(document.getElementById('input_rebarGridSpacingInches').value) || 18;
    var laborPerSqFt = parseFloat(document.getElementById('input_laborCostPerSqFt').value) || 0;

    var area = length * width;
    var thicknessFeet = thicknessInches / 12;
    var netCuFt = area * thicknessFeet;
    var totalCuYd = (netCuFt / 27) * 1.10; // +10% waste

    // Rebar grid calculation
    var gridSpacingFt = gridSpacingInches / 12;
    var numLongitudinal = gridSpacingFt > 0 ? (Math.floor(width / gridSpacingFt) + 1) : 0;
    var numTransverse = gridSpacingFt > 0 ? (Math.floor(length / gridSpacingFt) + 1) : 0;
    var rawRebarFeet = (numLongitudinal * length) + (numTransverse * width);
    var totalRebarFeet = rawRebarFeet * 1.15; // +15% overlap/waste

    var concCost = totalCuYd * pricePerYard;
    var rebarCost = totalRebarFeet * 0.85; // $0.85/ft for #4 rebar
    var labCost = area * laborPerSqFt;
    var totalCost = concCost + rebarCost + labCost;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outTotal = document.querySelector('#output_totalDrivewayCost .output-number');
    var outVolume = document.querySelector('#output_concreteVolumeYards .output-number');
    var outRebar = document.querySelector('#output_rebarTotalFeet .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outVolume) outVolume.textContent = totalCuYd.toFixed(2) + ' cu yds';
    if (outRebar) outRebar.textContent = Math.ceil(totalRebarFeet) + ' lin ft';
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(concCost, rebarCost, labCost, area, totalCuYd);

    if (window.logHistory) {
      window.logHistory('concrete-driveway-cost-calculator', {
        drivewayLengthFt: length + ' ft',
        drivewayWidthFt: width + ' ft',
        concreteVolumeYards: totalCuYd.toFixed(2) + ' cu yds',
        totalDrivewayCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(concCost, rebarCost, labCost, area, totalCuYd) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'volumeAndArea') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Driveway Area (sq ft / 10)', 'Concrete Volume (cu yds)'],
          datasets: [{
            label: 'Dimensions',
            data: [parseFloat((area / 10).toFixed(2)), parseFloat(totalCuYd.toFixed(2))],
            backgroundColor: ['#4B7B94', '#2F6F5E']
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
          labels: ['Ready-Mix Concrete Material', 'Rebar Mesh Grid', 'Excavation & Labor'],
          datasets: [{
            data: [parseFloat(concCost.toFixed(2)), parseFloat(rebarCost.toFixed(2)), parseFloat(labCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4B7B94']
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
    document.getElementById('input_drivewayLengthFt').value = 50;
    document.getElementById('input_drivewayWidthFt').value = 20;
    document.getElementById('input_drivewayThicknessInches').value = 5;
    document.getElementById('input_concreteCostPerYard').value = 140;
    document.getElementById('input_rebarGridSpacingInches').value = 18;
    document.getElementById('input_laborCostPerSqFt').value = 6.00;
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
