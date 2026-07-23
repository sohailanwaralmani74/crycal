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
    var area = parseFloat(document.getElementById('input_areaSqFt').value) || 0;
    var depth = parseFloat(document.getElementById('input_depthInches').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('input_pricePerYard').value) || 0;
    var bagCost2 = parseFloat(document.getElementById('input_bagCost2CuFt').value) || 0;
    var bagCost3 = parseFloat(document.getElementById('input_bagCost3CuFt').value) || 0;

    var cuFt = area * (depth / 12);
    var cuYds = cuFt / 27;

    var bags2 = Math.ceil(cuFt / 2);
    var bags3 = Math.ceil(cuFt / 3);

    var totalBulkCost = cuYds * pricePerYard;
    var total2CuFtBagCost = bags2 * bagCost2;
    var total3CuFtBagCost = bags3 * bagCost3;

    var outYds = document.querySelector('#output_cubicYards .output-number');
    var outFt = document.querySelector('#output_cubicFeet .output-number');
    var outBags2 = document.querySelector('#output_bags2CuFt .output-number');
    var outBags3 = document.querySelector('#output_bags3CuFt .output-number');
    var outCost = document.querySelector('#output_totalBulkCost .output-number');

    if (outYds) outYds.textContent = cuYds.toFixed(2) + ' cu yd';
    if (outFt) outFt.textContent = cuFt.toFixed(1) + ' cu ft';
    if (outBags2) outBags2.textContent = bags2 + ' bags';
    if (outBags3) outBags3.textContent = bags3 + ' bags';
    if (outCost) outCost.textContent = formatCurrency(totalBulkCost);

    updateChart(cuYds, cuFt, totalBulkCost, total2CuFtBagCost, total3CuFtBagCost);

    if (window.logHistory) {
      window.logHistory('mulch-calculator', {
        areaSqFt: area + ' sq ft',
        depthInches: depth + ' in',
        cubicYards: cuYds.toFixed(2) + ' cu yd',
        totalBulkCost: formatCurrency(totalBulkCost)
      });
    }
  }

  function updateChart(cuYds, cuFt, bulkCost, bag2Cost, bag3Cost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bulk Delivery', '2 cu ft Bags Total', '3 cu ft Bags Total'],
          datasets: [{
            label: 'Total Material Cost',
            data: [
              parseFloat(bulkCost.toFixed(2)),
              parseFloat(bag2Cost.toFixed(2)),
              parseFloat(bag3Cost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90E2']
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
          labels: ['Cubic Yards (Bulk Units)', 'Cubic Feet (Bag Volume)'],
          datasets: [{
            data: [parseFloat(cuYds.toFixed(2)), parseFloat(cuFt.toFixed(2))],
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
    document.getElementById('input_areaSqFt').value = 500;
    document.getElementById('input_depthInches').value = 3;
    document.getElementById('input_pricePerYard').value = 38.00;
    document.getElementById('input_bagCost2CuFt').value = 4.50;
    document.getElementById('input_bagCost3CuFt').value = 6.50;
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
