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
    var roomArea = parseFloat(document.getElementById('input_roomAreaSqFt').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var sqFtPerCarton = parseFloat(document.getElementById('input_sqFtPerCarton').value) || 22;
    var pricePerSqFt = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;
    var laborPerSqFt = parseFloat(document.getElementById('input_laborPerSqFt').value) || 0;

    var wasteSqFt = roomArea * (wastePct / 100);
    var orderSqFt = roomArea + wasteSqFt;

    var cartonsNeeded = sqFtPerCarton > 0 ? Math.ceil(orderSqFt / sqFtPerCarton) : 0;
    var matCost = orderSqFt * pricePerSqFt;
    var laborCost = roomArea * laborPerSqFt;
    var totalCost = matCost + laborCost;

    var outCartons = document.querySelector('#output_totalCartonsNeeded .output-number');
    var outOrder = document.querySelector('#output_totalOrderSqFt .output-number');
    var outMat = document.querySelector('#output_totalMaterialCost .output-number');
    var outTotal = document.querySelector('#output_totalProjectCost .output-number');

    if (outCartons) outCartons.textContent = cartonsNeeded + ' cartons';
    if (outOrder) outOrder.textContent = orderSqFt.toFixed(2) + ' sq ft';
    if (outMat) outMat.textContent = formatCurrency(matCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalCost);

    updateChart(matCost, laborCost, roomArea, wasteSqFt);

    if (window.logHistory) {
      window.logHistory('hardwood-flooring-calculator', {
        roomAreaSqFt: roomArea + ' sq ft',
        totalCartonsNeeded: cartonsNeeded + ' cartons',
        totalMaterialCost: formatCurrency(matCost),
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(matCost, laborCost, roomArea, wasteSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costSplit';

    var ctx = canvas.getContext('2d');

    if (tabId === 'cartonBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Room Area', 'Waste Overage'],
          datasets: [{
            label: 'Square Feet',
            data: [parseFloat(roomArea.toFixed(2)), parseFloat(wasteSqFt.toFixed(2))],
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
          labels: ['Hardwood Material Cost', 'Installation Labor Cost'],
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
    document.getElementById('input_roomAreaSqFt').value = 500;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_sqFtPerCarton').value = 22;
    document.getElementById('input_pricePerSqFt').value = 6.50;
    document.getElementById('input_laborPerSqFt').value = 4.00;
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
