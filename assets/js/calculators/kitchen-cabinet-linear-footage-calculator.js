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
    var baseWallFt = parseFloat(document.getElementById('input_baseWallLinearFt').value) || 0;
    var upperWallFt = parseFloat(document.getElementById('input_upperWallLinearFt').value) || 0;
    var cornerCount = parseFloat(document.getElementById('input_cornerLazySusans').value) || 0;
    var baseCostPerFt = parseFloat(document.getElementById('input_avgBaseCostPerFt').value) || 0;
    var upperCostPerFt = parseFloat(document.getElementById('input_avgUpperCostPerFt').value) || 0;
    var lazySusanCost = parseFloat(document.getElementById('input_lazySusanCostPerUnit').value) || 0;

    var netBaseFt = Math.max(0, baseWallFt);
    var netUpperFt = Math.max(0, upperWallFt);
    var totalFt = netBaseFt + netUpperFt;

    var baseCost = netBaseFt * baseCostPerFt;
    var upperCost = netUpperFt * upperCostPerFt;
    var cornerCost = cornerCount * lazySusanCost;
    var totalCost = baseCost + upperCost + cornerCost;
    var cornerAllowance = cornerCount * 3.0; // 3 linear feet occupied per corner

    var outBaseFt = document.querySelector('#output_totalBaseLinearFt .output-number');
    var outUpperFt = document.querySelector('#output_totalUpperLinearFt .output-number');
    var outTotalFt = document.querySelector('#output_totalKitchenLinearFt .output-number');
    var outCost = document.querySelector('#output_estimatedCabinetCost .output-number');
    var outCornerSpace = document.querySelector('#output_cornerSpaceFootage .output-number');

    if (outBaseFt) outBaseFt.textContent = netBaseFt.toFixed(1) + ' linear ft';
    if (outUpperFt) outUpperFt.textContent = netUpperFt.toFixed(1) + ' linear ft';
    if (outTotalFt) outTotalFt.textContent = totalFt.toFixed(1) + ' linear ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);
    if (outCornerSpace) outCornerSpace.textContent = cornerCount + ' units (' + cornerAllowance.toFixed(1) + ' ft corner space)';

    updateChart(baseCost, upperCost, cornerCost, netBaseFt, netUpperFt, totalFt);

    if (window.logHistory) {
      window.logHistory('kitchen-cabinet-linear-footage-calculator', {
        totalKitchenLinearFt: totalFt.toFixed(1) + ' ft',
        totalBaseLinearFt: netBaseFt.toFixed(1) + ' ft',
        totalUpperLinearFt: netUpperFt.toFixed(1) + ' ft',
        estimatedCabinetCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(baseCost, upperCost, cornerCost, baseFt, upperFt, totalFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'cabinetCostBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'footageBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Base Cabinets (ft)', 'Upper Cabinets (ft)', 'Combined Total (ft)'],
          datasets: [{
            label: 'Linear Footage',
            data: [parseFloat(baseFt.toFixed(1)), parseFloat(upperFt.toFixed(1)), parseFloat(totalFt.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#2563EB', '#C08A2E']
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
          labels: ['Base Cabinets Cost', 'Upper Cabinets Cost', 'Corner / Lazy Susan Units Cost'],
          datasets: [{
            data: [parseFloat(baseCost.toFixed(2)), parseFloat(upperCost.toFixed(2)), parseFloat(cornerCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#2563EB', '#C08A2E']
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
    document.getElementById('input_baseWallLinearFt').value = 24;
    document.getElementById('input_upperWallLinearFt').value = 20;
    document.getElementById('input_cornerLazySusans').value = 1;
    document.getElementById('input_avgBaseCostPerFt').value = 250;
    document.getElementById('input_avgUpperCostPerFt').value = 200;
    document.getElementById('input_lazySusanCostPerUnit').value = 650;
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
