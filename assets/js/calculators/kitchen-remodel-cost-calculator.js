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
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(0);
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
    var budget = parseFloat(document.getElementById('input_totalBudget').value) || 0;
    var size = document.getElementById('input_kitchenSize').value;
    var cabPct = parseFloat(document.getElementById('input_cabinetPct').value) || 30;
    var counterPct = parseFloat(document.getElementById('input_countertopPct').value) || 20;
    var appPct = parseFloat(document.getElementById('input_appliancePct').value) || 20;
    var laborPct = parseFloat(document.getElementById('input_laborPct').value) || 30;

    var sumPct = cabPct + counterPct + appPct + laborPct;
    if (sumPct <= 0) sumPct = 100;

    var cabCost = budget * (cabPct / sumPct);
    var counterCost = budget * (counterPct / sumPct);
    var appCost = budget * (appPct / sumPct);
    var laborCost = budget * (laborPct / sumPct);

    var outCab = document.querySelector('#output_cabinetCost .output-number');
    var outCounter = document.querySelector('#output_countertopCost .output-number');
    var outApp = document.querySelector('#output_applianceCost .output-number');
    var outLabor = document.querySelector('#output_laborCost .output-number');

    if (outCab) outCab.textContent = formatCurrency(cabCost);
    if (outCounter) outCounter.textContent = formatCurrency(counterCost);
    if (outApp) outApp.textContent = formatCurrency(appCost);
    if (outLabor) outLabor.textContent = formatCurrency(laborCost);

    updateChart(cabCost, counterCost, appCost, laborCost, cabPct, counterPct, appPct, laborPct);

    if (window.logHistory) {
      window.logHistory('kitchen-remodel-cost-calculator', {
        kitchenSize: size,
        totalBudget: formatCurrency(budget),
        cabinetCost: formatCurrency(cabCost),
        laborCost: formatCurrency(laborCost)
      });
    }
  }

  function updateChart(cabCost, counterCost, appCost, laborCost, cabPct, counterPct, appPct, laborPct) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'budgetSplit';

    var ctx = canvas.getContext('2d');

    if (tabId === 'tierComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Small Kitchen (<100 sqft)', 'Medium Kitchen (100-200 sqft)', 'Large Kitchen (200+ sqft)'],
          datasets: [
            {
              label: 'Minor Refresh ',
              data: [15000, 23000, 32000],
              backgroundColor: '#10B981'
            },
            {
              label: 'Mid-Range Remodel ',
              data: [28000, 45000, 70000],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Deluxe Luxury ',
              data: [52000, 88000, 145000],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Cabinets & Hardware (' + cabPct.toFixed(0) + '%)',
            'Countertops & Backsplash (' + counterPct.toFixed(0) + '%)',
            'Appliances & Fixtures (' + appPct.toFixed(0) + '%)',
            'Contractor & Trade Labor (' + laborPct.toFixed(0) + '%)'
          ],
          datasets: [{
            data: [
              parseFloat(cabCost.toFixed(0)),
              parseFloat(counterCost.toFixed(0)),
              parseFloat(appCost.toFixed(0)),
              parseFloat(laborCost.toFixed(0))
            ],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#10B981', '#C08A2E']
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
    document.getElementById('input_totalBudget').value = 35000;
    document.getElementById('input_kitchenSize').value = 'medium';
    document.getElementById('input_remodelTier').value = 'standard';
    document.getElementById('input_cabinetPct').value = 30;
    document.getElementById('input_countertopPct').value = 20;
    document.getElementById('input_appliancePct').value = 20;
    document.getElementById('input_laborPct').value = 30;
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
