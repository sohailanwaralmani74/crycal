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
    var homeVal = parseFloat(document.getElementById('input_currentHomeValue').value) || 0;
    var cost = parseFloat(document.getElementById('input_projectCost').value) || 0;
    var renoType = document.getElementById('input_renovationType').value || 'kitchen_minor';
    var customRoi = parseFloat(document.getElementById('input_customRoiPct').value) || 70;

    var roiPct = 70.0;
    if (renoType === 'garage_door') roiPct = 194.0;
    else if (renoType === 'kitchen_minor') roiPct = 85.2;
    else if (renoType === 'bath_remodel') roiPct = 66.7;
    else if (renoType === 'deck_addition') roiPct = 64.8;
    else if (renoType === 'kitchen_major') roiPct = 54.0;
    else if (renoType === 'custom') roiPct = customRoi;

    var valueIncrease = cost * (roiPct / 100.0);
    var newHomeVal = homeVal + valueIncrease;
    var netCost = cost - valueIncrease;
    var boostPerDollar = cost > 0 ? (valueIncrease / cost) : 0;

    var outIncrease = document.querySelector('#output_estimatedValueIncrease .output-number');
    var outNewVal = document.querySelector('#output_newHomeValue .output-number');
    var outRoiPct = document.querySelector('#output_renovationRoiPct .output-number');
    var outNetCost = document.querySelector('#output_netCostAfterResale .output-number');
    var outBoost = document.querySelector('#output_valueBoostPerDollar .output-number');

    if (outIncrease) outIncrease.textContent = formatCurrency(valueIncrease);
    if (outNewVal) outNewVal.textContent = formatCurrency(newHomeVal);
    if (outRoiPct) outRoiPct.textContent = roiPct.toFixed(1) + '% Recouped';
    if (outNetCost) {
      if (netCost < 0) {
        outNetCost.textContent = formatCurrency(Math.abs(netCost)) + ' Net Profit';
      } else {
        outNetCost.textContent = formatCurrency(netCost) + ' Net Cost';
      }
    }
    if (outBoost) outBoost.textContent = formatCurrency(boostPerDollar) + ' per $1 spent';

    updateChart(cost, valueIncrease, netCost, homeVal, newHomeVal);

    if (window.logHistory) {
      window.logHistory('renovation-roi-calculator', {
        estimatedValueIncrease: formatCurrency(valueIncrease),
        newHomeValue: formatCurrency(newHomeVal),
        renovationRoiPct: roiPct.toFixed(1) + '%',
        netCostAfterResale: formatCurrency(netCost)
      });
    }
  }

  function updateChart(cost, valueIncrease, netCost, homeVal, newHomeVal) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'roiCostVsValueChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'homeValueGrowthChart') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Current Home Baseline Value', 'Added Resale Equity Value'],
          datasets: [{
            data: [parseFloat(homeVal.toFixed(2)), parseFloat(valueIncrease.toFixed(2))],
            backgroundColor: ['#2563EB', '#2F6F5E']
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
          labels: ['Total Project Cost', 'Resale Value Added', 'Net Out-of-Pocket Cost'],
          datasets: [{
            label: 'Dollars ',
            data: [parseFloat(cost.toFixed(2)), parseFloat(valueIncrease.toFixed(2)), parseFloat(Math.max(0, netCost).toFixed(2))],
            backgroundColor: ['#2563EB', '#2F6F5E', '#C08A2E']
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
    document.getElementById('input_currentHomeValue').value = 450000;
    document.getElementById('input_projectCost').value = 50000;
    document.getElementById('input_renovationType').value = "kitchen_minor";
    document.getElementById('input_customRoiPct').value = 70;
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
