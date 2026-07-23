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

  function formatRate(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val) + '/hr';
    } catch(e) {
      return '$' + val.toFixed(0) + '/hr';
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
    var matCost = parseFloat(document.getElementById('input_projectMaterialCost').value) || 0;
    var ratioPreset = document.getElementById('input_ratioPreset').value;
    var crewSize = parseFloat(document.getElementById('input_crewSize').value) || 1;
    var workerRate = parseFloat(document.getElementById('input_hourlyRatePerWorker').value) || 0;
    var hours = parseFloat(document.getElementById('input_estimatedHours').value) || 0;
    var markupPct = parseFloat(document.getElementById('input_subcontractorMarkup').value) || 0;

    var laborCost = 0;
    if (ratioPreset === '40_60') {
      laborCost = matCost * (40 / 60);
    } else if (ratioPreset === '50_50') {
      laborCost = matCost * (50 / 50);
    } else if (ratioPreset === '60_40') {
      laborCost = matCost * (60 / 40);
    } else {
      laborCost = crewSize * workerRate * hours;
    }

    var crewBurnRate = crewSize * workerRate;
    var directSubtotal = matCost + laborCost;
    var markupCost = directSubtotal * (markupPct / 100);
    var totalQuote = directSubtotal + markupCost;

    var outLabor = document.querySelector('#output_estimatedLaborCost .output-number');
    var outBurn = document.querySelector('#output_crewHourlyBurnRate .output-number');
    var outMarkup = document.querySelector('#output_contractorOverheadProfit .output-number');
    var outTotal = document.querySelector('#output_totalProjectQuote .output-number');

    if (outLabor) outLabor.textContent = formatCurrency(laborCost);
    if (outBurn) outBurn.textContent = formatRate(crewBurnRate);
    if (outMarkup) outMarkup.textContent = formatCurrency(markupCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalQuote);

    updateChart(matCost, laborCost, markupCost, crewSize, workerRate, hours);

    if (window.logHistory) {
      window.logHistory('contractor-labor-cost-calculator', {
        materialCost: formatCurrency(matCost),
        laborCost: formatCurrency(laborCost),
        crewBurnRate: formatRate(crewBurnRate),
        totalQuote: formatCurrency(totalQuote)
      });
    }
  }

  function updateChart(matCost, laborCost, markupCost, crewSize, workerRate, hours) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialVsLabor';

    var ctx = canvas.getContext('2d');

    if (tabId === 'crewCostBreakdown') {
      var directWages = crewSize * workerRate * hours * 0.70;
      var overheadBenefit = Math.max(0, laborCost - directWages);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Direct Worker Wages (70%)', 'Taxes & Insurance Burden (30%)', 'Overhead & Profit Markup'],
          datasets: [{
            label: 'Cost ',
            data: [
              parseFloat(directWages.toFixed(0)),
              parseFloat(overheadBenefit.toFixed(0)),
              parseFloat(markupCost.toFixed(0))
            ],
            backgroundColor: ['#10B981', '#3B82F6', '#C08A2E']
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
          labels: ['Materials & Equipment', 'Contractor Direct Labor', 'Overhead & Profit Markup'],
          datasets: [{
            data: [
              parseFloat(matCost.toFixed(0)),
              parseFloat(laborCost.toFixed(0)),
              parseFloat(markupCost.toFixed(0))
            ],
            backgroundColor: ['#3B82F6', '#2F6F5E', '#C08A2E']
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
    document.getElementById('input_projectMaterialCost').value = 12000;
    document.getElementById('input_ratioPreset').value = '50_50';
    document.getElementById('input_crewSize').value = 3;
    document.getElementById('input_hourlyRatePerWorker').value = 45;
    document.getElementById('input_estimatedHours').value = 80;
    document.getElementById('input_subcontractorMarkup').value = 20;
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
