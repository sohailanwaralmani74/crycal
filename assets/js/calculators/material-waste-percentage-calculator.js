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

  function handleComplexityChange() {
    var complexity = document.getElementById('input_complexityLevel').value;
    var wasteInput = document.getElementById('input_customWastePct');

    if (complexity === 'simple') wasteInput.value = 5;
    if (complexity === 'standard') wasteInput.value = 10;
    if (complexity === 'complex') wasteInput.value = 15;
    if (complexity === 'intricate') wasteInput.value = 20;
  }

  function getUnitLabel(unitType) {
    if (unitType === 'sqft') return 'sq ft';
    if (unitType === 'linft') return 'lin ft';
    if (unitType === 'pieces') return 'pieces';
    if (unitType === 'boardfeet') return 'bd ft';
    if (unitType === 'bags') return 'bags';
    return 'units';
  }

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var compSelect = document.getElementById('input_complexityLevel');
    if (compSelect) {
      compSelect.addEventListener('change', function() {
        handleComplexityChange();
        calculate();
      });
    }

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
    var netQty = parseFloat(document.getElementById('input_netMaterialQuantity').value) || 0;
    var unitType = document.getElementById('input_unitType').value;
    var wastePct = parseFloat(document.getElementById('input_customWastePct').value) || 0;
    var unitPrice = parseFloat(document.getElementById('input_unitPrice').value) || 0;

    var unitLabel = getUnitLabel(unitType);

    var wasteQty = netQty * (wastePct / 100);
    var totalOrderQty = netQty + wasteQty;

    var netCost = netQty * unitPrice;
    var wasteCost = wasteQty * unitPrice;
    var totalOrderCost = totalOrderQty * unitPrice;

    var outOrder = document.querySelector('#output_orderWithCustomWaste .output-number');
    var outWaste = document.querySelector('#output_wasteQuantity .output-number');
    var outTotalCost = document.querySelector('#output_totalOrderCost .output-number');
    var outWasteCost = document.querySelector('#output_wasteCostDifference .output-number');

    if (outOrder) outOrder.textContent = Math.ceil(totalOrderQty) + ' ' + unitLabel;
    if (outWaste) outWaste.textContent = wasteQty.toFixed(1) + ' ' + unitLabel;
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalOrderCost);
    if (outWasteCost) outWasteCost.textContent = formatCurrency(wasteCost);

    updateChart(netQty, wasteQty, unitPrice, netCost, wasteCost);

    if (window.logHistory) {
      window.logHistory('material-waste-percentage-calculator', {
        netQuantity: netQty + ' ' + unitLabel,
        wastePct: wastePct + '%',
        totalOrder: Math.ceil(totalOrderQty) + ' ' + unitLabel,
        totalCost: formatCurrency(totalOrderCost)
      });
    }
  }

  function updateChart(netQty, wasteQty, unitPrice, netCost, wasteCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'wasteMultipliers';

    var ctx = canvas.getContext('2d');

    if (tabId === 'costOfWaste') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Material Cost', 'Waste Overage Cost Buffer'],
          datasets: [{
            data: [
              parseFloat(netCost.toFixed(2)),
              parseFloat(wasteCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var qty5 = netQty * 1.05;
      var qty10 = netQty * 1.10;
      var qty15 = netQty * 1.15;
      var qty20 = netQty * 1.20;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['5% Waste (Simple)', '10% Waste (Standard)', '15% Waste (Diagonal)', '20% Waste (Intricate)'],
          datasets: [{
            label: 'Total Order Quantity',
            data: [
              parseFloat(qty5.toFixed(1)),
              parseFloat(qty10.toFixed(1)),
              parseFloat(qty15.toFixed(1)),
              parseFloat(qty20.toFixed(1))
            ],
            backgroundColor: ['#10B981', '#2F6F5E', '#3B82F6', '#C08A2E']
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
    document.getElementById('input_netMaterialQuantity').value = 1500;
    document.getElementById('input_unitType').value = 'sqft';
    document.getElementById('input_complexityLevel').value = 'standard';
    document.getElementById('input_customWastePct').value = 10;
    document.getElementById('input_unitPrice').value = 4.25;
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
