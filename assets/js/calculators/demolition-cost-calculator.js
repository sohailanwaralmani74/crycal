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
    var areaSqFt = parseFloat(document.getElementById('input_demoAreaSqFt').value) || 0;
    var scope = document.getElementById('input_demoType').value || 'interior_gut';
    var laborRate = parseFloat(document.getElementById('input_laborCostPerSqFt').value) || 0;
    var tippingRate = parseFloat(document.getElementById('input_haulAwayRatePerTon').value) || 0;
    var dumpsterCount = parseInt(document.getElementById('input_dumpsterRentalCount').value, 10) || 1;

    var multiplier = 0.020; // Default interior gut tons per sq ft
    if (scope === 'kitchen_bath') multiplier = 0.015;
    else if (scope === 'flooring_only') multiplier = 0.008;
    else if (scope === 'exterior_deck') multiplier = 0.012;

    var laborCost = areaSqFt * laborRate;
    var weightTons = areaSqFt * multiplier;

    var recommendedDumpster = "10-Yard Roll-Off";
    if (weightTons > 15) recommendedDumpster = "40-Yard Roll-Off (Multiple Trips)";
    else if (weightTons > 8) recommendedDumpster = "30-Yard Roll-Off Dumpster";
    else if (weightTons > 3) recommendedDumpster = "20-Yard Roll-Off Dumpster";

    var baseDumpsterFee = dumpsterCount * 450.0;
    var landfillTippingFee = weightTons * tippingRate;
    var totalDisposalCost = baseDumpsterFee + landfillTippingFee;

    var totalProjectCost = laborCost + totalDisposalCost;

    var outLaborCost = document.querySelector('#output_totalDemoLaborCost .output-number');
    var outTons = document.querySelector('#output_estimatedDebrisWeightTons .output-number');
    var outDumpster = document.querySelector('#output_recommendedDumpsterYardage .output-number');
    var outDisposal = document.querySelector('#output_totalDisposalCost .output-number');
    var outTotalCost = document.querySelector('#output_totalProjectDemoCost .output-number');

    if (outLaborCost) outLaborCost.textContent = formatCurrency(laborCost);
    if (outTons) outTons.textContent = weightTons.toFixed(1) + ' Tons (' + Math.round(weightTons * 2000) + ' lbs)';
    if (outDumpster) outDumpster.textContent = recommendedDumpster;
    if (outDisposal) outDisposal.textContent = formatCurrency(totalDisposalCost);
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalProjectCost);

    updateChart(laborCost, totalDisposalCost, areaSqFt, weightTons);

    if (window.logHistory) {
      window.logHistory('demolition-cost-calculator', {
        totalProjectDemoCost: formatCurrency(totalProjectCost),
        totalDemoLaborCost: formatCurrency(laborCost),
        estimatedDebrisWeightTons: weightTons.toFixed(1) + ' Tons',
        recommendedDumpsterYardage: recommendedDumpster
      });
    }
  }

  function updateChart(laborCost, disposalCost, areaSqFt, weightTons) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'demoCostSplitChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'debrisWeightChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Area (Sq Ft / 10)', 'Debris Weight (Tons)'],
          datasets: [{
            label: 'Demo Scale',
            data: [parseFloat((areaSqFt / 10).toFixed(1)), parseFloat(weightTons.toFixed(1))],
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
          labels: ['Tear-Out Labor & Crew Cost', 'Dumpster Rental & Landfill Disposal'],
          datasets: [{
            data: [parseFloat(laborCost.toFixed(2)), parseFloat(disposalCost.toFixed(2))],
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
    document.getElementById('input_demoAreaSqFt').value = 1200;
    document.getElementById('input_demoType').value = "interior_gut";
    document.getElementById('input_laborCostPerSqFt').value = 3.50;
    document.getElementById('input_haulAwayRatePerTon').value = 80;
    document.getElementById('input_dumpsterRentalCount').value = 1;
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
