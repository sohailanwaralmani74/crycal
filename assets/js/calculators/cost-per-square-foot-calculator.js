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
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val) + '/sq ft';
    } catch(e) {
      return '$' + val.toFixed(2) + '/sq ft';
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
    var totalCost = parseFloat(document.getElementById('input_totalBuildingCost').value) || 0;
    var finishedSqFt = parseFloat(document.getElementById('input_totalLivingAreaSqFt').value) || 0;
    var unfinishedSqFt = parseFloat(document.getElementById('input_unfinishedSqFt').value) || 0;
    var specRate = parseFloat(document.getElementById('input_specHomeRatePerSqFt').value) || 150;
    var customRate = parseFloat(document.getElementById('input_customHomeRatePerSqFt').value) || 250;

    var grossSqFt = finishedSqFt + unfinishedSqFt;

    var costPerFinSqFt = finishedSqFt > 0 ? (totalCost / finishedSqFt) : 0;
    var costPerGrossSqFt = grossSqFt > 0 ? (totalCost / grossSqFt) : 0;

    var specTotalEst = finishedSqFt * specRate;
    var customTotalEst = finishedSqFt * customRate;

    var outFin = document.querySelector('#output_costPerFinishedSqFt .output-number');
    var outGross = document.querySelector('#output_costPerGrossSqFt .output-number');
    var outSpec = document.querySelector('#output_specHomeComparison .output-number');
    var outCustom = document.querySelector('#output_customHomeComparison .output-number');

    if (outFin) outFin.textContent = formatRate(costPerFinSqFt);
    if (outGross) outGross.textContent = formatRate(costPerGrossSqFt);
    if (outSpec) outSpec.textContent = formatCurrency(specTotalEst);
    if (outCustom) outCustom.textContent = formatCurrency(customTotalEst);

    updateChart(costPerFinSqFt, specRate, customRate, totalCost, finishedSqFt, unfinishedSqFt);

    if (window.logHistory) {
      window.logHistory('cost-per-square-foot-calculator', {
        totalCost: formatCurrency(totalCost),
        finishedSqFt: finishedSqFt + ' sq ft',
        costPerSqFt: formatRate(costPerFinSqFt),
        customHomeEst: formatCurrency(customTotalEst)
      });
    }
  }

  function updateChart(actualRate, specRate, customRate, totalCost, finishedSqFt, unfinishedSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'rateComparison';

    var ctx = canvas.getContext('2d');

    if (tabId === 'areaBreakdown') {
      var finShare = totalCost * (finishedSqFt / (finishedSqFt + unfinishedSqFt * 0.3 || 1));
      var unfinShare = totalCost - finShare;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Finished Living Space Cost', 'Unfinished Garage/Porch Allocation'],
          datasets: [{
            data: [
              parseFloat(finShare.toFixed(0)),
              parseFloat(Math.max(0, unfinShare).toFixed(0))
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
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Project Rate', 'Spec / Production Rate', 'Custom Builder Rate'],
          datasets: [{
            label: 'Cost Per Sq Ft ',
            data: [
              parseFloat(actualRate.toFixed(2)),
              parseFloat(specRate.toFixed(2)),
              parseFloat(customRate.toFixed(2))
            ],
            backgroundColor: ['#3B82F6', '#10B981', '#C08A2E']
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
    document.getElementById('input_totalBuildingCost').value = 450000;
    document.getElementById('input_totalLivingAreaSqFt').value = 2400;
    document.getElementById('input_unfinishedSqFt').value = 600;
    document.getElementById('input_specHomeRatePerSqFt').value = 150;
    document.getElementById('input_customHomeRatePerSqFt').value = 250;
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
