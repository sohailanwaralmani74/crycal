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
    var area = parseFloat(document.getElementById('input_slabAreaSqFt').value) || 0;
    var thicknessInches = parseFloat(document.getElementById('input_slabThicknessInches').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('input_concreteCostPerYard').value) || 0;
    var laborPerSqFt = parseFloat(document.getElementById('input_laborCostPerSqFt').value) || 0;

    var thicknessFeet = thicknessInches / 12;
    var netCuFt = area * thicknessFeet;
    var totalCuYd = (netCuFt / 27) * 1.10; // +10% waste

    var matCost = totalCuYd * pricePerYard;
    var labCost = area * laborPerSqFt;
    var totalCost = matCost + labCost;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outTotal = document.querySelector('#output_totalSlabProjectCost .output-number');
    var outPerSqFt = document.querySelector('#output_totalCostPerSqFt .output-number');
    var outMat = document.querySelector('#output_totalMaterialCost .output-number');
    var outLab = document.querySelector('#output_totalLaborCost .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';
    if (outMat) outMat.textContent = formatCurrency(matCost);
    if (outLab) outLab.textContent = formatCurrency(labCost);

    updateChart(matCost, labCost, totalCuYd, pricePerYard);

    if (window.logHistory) {
      window.logHistory('concrete-slab-cost-calculator', {
        slabAreaSqFt: area + ' sq ft',
        slabThicknessInches: thicknessInches + ' in',
        totalSlabProjectCost: formatCurrency(totalCost),
        totalCostPerSqFt: formatCurrency(costPerSqFt) + ' / sq ft'
      });
    }
  }

  function updateChart(matCost, labCost, cuYds, pricePerYard) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'volumeCost') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Concrete Volume (cu yds)', 'Cost Per Yard'],
          datasets: [{
            label: 'Volume vs Rate',
            data: [parseFloat(cuYds.toFixed(2)), pricePerYard],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
          labels: ['Concrete Material Cost', 'Contractor Labor Cost'],
          datasets: [{
            data: [parseFloat(matCost.toFixed(2)), parseFloat(labCost.toFixed(2))],
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
    document.getElementById('input_slabAreaSqFt').value = 400;
    document.getElementById('input_slabThicknessInches').value = 4;
    document.getElementById('input_concreteCostPerYard').value = 135;
    document.getElementById('input_laborCostPerSqFt').value = 5.50;
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
