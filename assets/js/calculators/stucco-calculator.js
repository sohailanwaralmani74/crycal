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
    var area = parseFloat(document.getElementById('input_wallAreaSqFt').value) || 0;
    var system = document.getElementById('input_stuccoSystem').value || 'three_coat';
    var baseBagCost = parseFloat(document.getElementById('input_bagCost').value) || 0;
    var finishBagCost = parseFloat(document.getElementById('input_finishBagCost').value) || 0;
    var laborPerSqFt = parseFloat(document.getElementById('input_laborCostPerSqFt').value) || 0;

    var scratchBags = 0;
    var brownBags = 0;
    var finishBags = 0;

    if (system === 'three_coat') {
      scratchBags = Math.ceil((area / 22) * 1.10);
      brownBags = Math.ceil((area / 22) * 1.10);
      finishBags = Math.ceil((area / 80) * 1.10);
    } else if (system === 'two_coat') {
      scratchBags = Math.ceil((area / 22) * 1.10);
      brownBags = 0;
      finishBags = Math.ceil((area / 80) * 1.10);
    } else { // one_coat
      scratchBags = Math.ceil((area / 25) * 1.10);
      brownBags = 0;
      finishBags = Math.ceil((area / 90) * 1.10);
    }

    var totalBaseBags = scratchBags + brownBags;
    var matCost = (totalBaseBags * baseBagCost) + (finishBags * finishBagCost);
    var labCost = area * laborPerSqFt;
    var totalCost = matCost + labCost;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outTotal = document.querySelector('#output_totalStuccoCost .output-number');
    var outBaseBags = document.querySelector('#output_totalBaseBags .output-number');
    var outFinishBags = document.querySelector('#output_totalFinishBags .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outBaseBags) outBaseBags.textContent = totalBaseBags + ' bags';
    if (outFinishBags) outFinishBags.textContent = finishBags + ' bags';
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(matCost, labCost, totalBaseBags, finishBags);

    if (window.logHistory) {
      window.logHistory('stucco-calculator', {
        wallAreaSqFt: area + ' sq ft',
        stuccoSystem: system.replace('_', ' ').toUpperCase(),
        totalBaseBags: totalBaseBags + ' bags',
        totalStuccoCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(matCost, labCost, baseBags, finishBags) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'bagBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Base Coat Bags (Scratch + Brown)', 'Finish Coat Bags'],
          datasets: [{
            label: '80 lb Bags Needed',
            data: [baseBags, finishBags],
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
          labels: ['Stucco Materials Cost', 'Contractor Labor Cost'],
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
    document.getElementById('input_wallAreaSqFt').value = 1000;
    document.getElementById('input_stuccoSystem').value = 'three_coat';
    document.getElementById('input_bagCost').value = 14.50;
    document.getElementById('input_finishBagCost').value = 19.00;
    document.getElementById('input_laborCostPerSqFt').value = 6.50;
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
