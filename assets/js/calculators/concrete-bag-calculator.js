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
    var netVolCuFt = parseFloat(document.getElementById('input_volumeCuFt').value) || 0;
    var price80 = parseFloat(document.getElementById('input_pricePerBag80lb').value) || 0;
    var price60 = parseFloat(document.getElementById('input_pricePerBag60lb').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var totalVolCuFt = netVolCuFt * (1 + (wastePct / 100));
    var totalVolCuYd = totalVolCuFt / 27;

    var bags80 = Math.ceil(totalVolCuFt / 0.60);
    var bags60 = Math.ceil(totalVolCuFt / 0.45);

    var cost80 = bags80 * price80;
    var cost60 = bags60 * price60;

    var out80Bags = document.querySelector('#output_totalBags80lb .output-number');
    var out60Bags = document.querySelector('#output_totalBags60lb .output-number');
    var out80Cost = document.querySelector('#output_totalCost80lb .output-number');
    var out60Cost = document.querySelector('#output_totalCost60lb .output-number');
    var outYds = document.querySelector('#output_totalCubicYards .output-number');

    if (out80Bags) out80Bags.textContent = bags80 + ' bags';
    if (out60Bags) out60Bags.textContent = bags60 + ' bags';
    if (out80Cost) out80Cost.textContent = formatCurrency(cost80);
    if (out60Cost) out60Cost.textContent = formatCurrency(cost60);
    if (outYds) outYds.textContent = totalVolCuYd.toFixed(2) + ' cu yds';

    updateChart(bags80, bags60, cost80, cost60);

    if (window.logHistory) {
      window.logHistory('concrete-bag-calculator', {
        volumeCuFt: netVolCuFt + ' cu ft',
        totalBags80lb: bags80 + ' bags',
        totalBags60lb: bags60 + ' bags',
        totalCost80lb: formatCurrency(cost80)
      });
    }
  }

  function updateChart(bags80, bags60, cost80, cost60) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bagComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['80 lb Bags Total Cost', '60 lb Bags Total Cost'],
          datasets: [{
            label: 'Total Material Cost',
            data: [parseFloat(cost80.toFixed(2)), parseFloat(cost60.toFixed(2))],
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
        type: 'bar',
        data: {
          labels: ['80 lb Bags Needed', '60 lb Bags Needed'],
          datasets: [{
            label: 'Bag Count',
            data: [bags80, bags60],
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
    document.getElementById('input_volumeCuFt').value = 50;
    document.getElementById('input_pricePerBag80lb').value = 6.50;
    document.getElementById('input_pricePerBag60lb').value = 5.25;
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
