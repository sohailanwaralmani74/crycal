(function() {
  'use strict';

  var chartInstance = null;

  var MATERIAL_RATES = {
    pressure_treated: 15.00,
    cedar: 25.00,
    composite: 40.00,
    premium_hardwood: 55.00
  };

  var RAILING_RATES = {
    none: 0.00,
    wood: 25.00,
    aluminum: 45.00,
    glass: 75.00
  };

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
    var length = parseFloat(document.getElementById('input_deckLengthFt').value) || 0;
    var width = parseFloat(document.getElementById('input_deckWidthFt').value) || 0;
    var materialKey = document.getElementById('input_deckMaterial').value || 'pressure_treated';
    var railingKey = document.getElementById('input_railingType').value || 'wood';
    var includeLabor = document.getElementById('input_includeLabor').value || 'yes';
    var framingRate = parseFloat(document.getElementById('input_substructureCostSqFt').value) || 0;

    var area = length * width;
    var perimeterRailingFt = (2 * length) + width; // 3 sides exposed assuming 1 attached to home

    var deckingRate = MATERIAL_RATES[materialKey] || 15.00;
    var railingRate = RAILING_RATES[railingKey] || 0.00;

    var materialBoardsCost = area * deckingRate;
    var materialRailingsCost = perimeterRailingFt * railingRate;
    var totalDeckingMaterialCost = materialBoardsCost + materialRailingsCost;

    var substructureCost = area * framingRate;
    var subtotalMaterials = totalDeckingMaterialCost + substructureCost;

    var laborCost = 0;
    if (includeLabor === 'yes') {
      laborCost = subtotalMaterials * 1.25; // Labor adds ~60% of total (1.25 multiplier on materials)
    }

    var totalCost = subtotalMaterials + laborCost;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outArea = document.querySelector('#output_totalAreaSqFt .output-number');
    var outDecking = document.querySelector('#output_deckingMaterialCost .output-number');
    var outSubstructure = document.querySelector('#output_substructureFramingCost .output-number');
    var outLabor = document.querySelector('#output_laborCost .output-number');
    var outTotal = document.querySelector('#output_totalDeckCost .output-number');
    var outCostPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outArea) outArea.textContent = area.toLocaleString() + ' sq ft';
    if (outDecking) outDecking.textContent = formatCurrency(totalDeckingMaterialCost);
    if (outSubstructure) outSubstructure.textContent = formatCurrency(substructureCost);
    if (outLabor) outLabor.textContent = formatCurrency(laborCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outCostPerSqFt) outCostPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(totalDeckingMaterialCost, substructureCost, laborCost, area, perimeterRailingFt);

    if (window.logHistory) {
      window.logHistory('deck-size-cost-calculator', {
        deckLengthFt: length + ' ft',
        deckWidthFt: width + ' ft',
        totalAreaSqFt: area + ' sq ft',
        totalDeckCost: formatCurrency(totalCost),
        costPerSqFt: formatCurrency(costPerSqFt) + ' / sq ft'
      });
    }
  }

  function updateChart(deckingCost, framingCost, laborCost, area, perimeterFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialComparison') {
      // Comparison across materials for this area
      var ptCost = (area * MATERIAL_RATES.pressure_treated) + framingCost;
      var cedarCost = (area * MATERIAL_RATES.cedar) + framingCost;
      var compositeCost = (area * MATERIAL_RATES.composite) + framingCost;
      var hardwoodCost = (area * MATERIAL_RATES.premium_hardwood) + framingCost;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['P-Treated Pine', 'Cedar', 'Trex Composite', 'Ipe Hardwood'],
          datasets: [{
            label: 'Material + Framing ',
            data: [ptCost, cedarCost, compositeCost, hardwoodCost],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#C08A2E', '#E11D48']
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
          labels: ['Decking & Railings', 'Substructure & Framing', 'Labor & Installation'],
          datasets: [{
            data: [
              parseFloat(deckingCost.toFixed(2)),
              parseFloat(framingCost.toFixed(2)),
              parseFloat(laborCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
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
    document.getElementById('input_deckLengthFt').value = 16;
    document.getElementById('input_deckWidthFt').value = 12;
    document.getElementById('input_deckMaterial').value = 'pressure_treated';
    document.getElementById('input_railingType').value = 'wood';
    document.getElementById('input_includeLabor').value = 'yes';
    document.getElementById('input_substructureCostSqFt').value = 8.00;
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
