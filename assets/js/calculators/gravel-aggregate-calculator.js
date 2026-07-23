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
    var area = parseFloat(document.getElementById('input_areaSquareFeet').value) || 0;
    var depthIn = parseFloat(document.getElementById('input_depthInches').value) || 0;
    var type = document.getElementById('input_gravelType').value || 'crushed_stone';
    var pricePerTon = parseFloat(document.getElementById('input_pricePerTon').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var densityLbs = 2700; // default crushed stone
    if (type === 'pea_gravel') densityLbs = 2600;
    if (type === 'river_rock') densityLbs = 2800;
    if (type === 'decomposed_granite') densityLbs = 3000;

    var depthFt = depthIn / 12;
    var netCuFt = area * depthFt;
    var totalCuFt = netCuFt * (1 + (wastePct / 100));
    var totalCuYd = totalCuFt / 27;

    var totalLbs = totalCuYd * densityLbs;
    var totalTons = totalLbs / 2000;

    var baseCost = (netCuFt / 27 * densityLbs / 2000) * pricePerTon;
    var totalCost = totalTons * pricePerTon;
    var wasteCost = totalCost - baseCost;

    var outYds = document.querySelector('#output_totalCubicYards .output-number');
    var outTons = document.querySelector('#output_totalTons .output-number');
    var outFt = document.querySelector('#output_totalCubicFeet .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outYds) outYds.textContent = totalCuYd.toFixed(2) + ' cu yds';
    if (outTons) outTons.textContent = totalTons.toFixed(2) + ' tons';
    if (outFt) outFt.textContent = totalCuFt.toFixed(1) + ' cu ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(totalCuYd, totalTons, baseCost, wasteCost);

    if (window.logHistory) {
      window.logHistory('gravel-aggregate-calculator', {
        areaSquareFeet: area + ' sq ft',
        depthInches: depthIn + ' in',
        totalCubicYards: totalCuYd.toFixed(2) + ' cu yds',
        totalTons: totalTons.toFixed(2) + ' tons',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(totalCuYd, totalTons, baseCost, wasteCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeVsTons';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Gravel Material Cost', 'Compaction & Overage Cost'],
          datasets: [{
            data: [parseFloat(baseCost.toFixed(2)), parseFloat(wasteCost.toFixed(2))],
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
          labels: ['Volume (Cubic Yards)', 'Weight (Tons)'],
          datasets: [{
            label: 'Material Quantity',
            data: [parseFloat(totalCuYd.toFixed(2)), parseFloat(totalTons.toFixed(2))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_areaSquareFeet').value = 500;
    document.getElementById('input_depthInches').value = 4;
    document.getElementById('input_gravelType').value = 'crushed_stone';
    document.getElementById('input_pricePerTon').value = 45.00;
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
