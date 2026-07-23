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
    var length = parseFloat(document.getElementById('input_roomLength').value) || 0;
    var width = parseFloat(document.getElementById('input_roomWidth').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var matPrice = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;
    var laborPrice = parseFloat(document.getElementById('input_laborPerSqFt').value) || 0;

    var netSqFt = length * width;
    var wasteSqFt = netSqFt * (wastePct / 100);
    var orderSqFt = netSqFt + wasteSqFt;

    var matCost = orderSqFt * matPrice;
    var laborCost = netSqFt * laborPrice;
    var totalCost = matCost + laborCost;

    var outNet = document.querySelector('#output_netSquareFootage .output-number');
    var outOrder = document.querySelector('#output_totalOrderSqFt .output-number');
    var outMat = document.querySelector('#output_totalMaterialCost .output-number');
    var outTotal = document.querySelector('#output_totalProjectCost .output-number');

    if (outNet) outNet.textContent = netSqFt.toFixed(2) + ' sq ft';
    if (outOrder) outOrder.textContent = orderSqFt.toFixed(2) + ' sq ft';
    if (outMat) outMat.textContent = formatCurrency(matCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalCost);

    updateChart(matCost, laborCost, netSqFt, wasteSqFt);

    if (window.logHistory) {
      window.logHistory('flooring-square-footage-calculator', {
        netSquareFootage: netSqFt.toFixed(2) + ' sq ft',
        totalOrderSqFt: orderSqFt.toFixed(2) + ' sq ft',
        totalMaterialCost: formatCurrency(matCost),
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(matCost, laborCost, netSqFt, wasteSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');

    if (tabId === 'sqftBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Floor Area', 'Waste Overage'],
          datasets: [{
            label: 'Square Feet',
            data: [parseFloat(netSqFt.toFixed(2)), parseFloat(wasteSqFt.toFixed(2))],
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
          labels: ['Material Cost', 'Installation Labor'],
          datasets: [{
            data: [parseFloat(matCost.toFixed(2)), parseFloat(laborCost.toFixed(2))],
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
    document.getElementById('input_roomLength').value = 20;
    document.getElementById('input_roomWidth').value = 15;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerSqFt').value = 4.50;
    document.getElementById('input_laborPerSqFt').value = 2.50;
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
