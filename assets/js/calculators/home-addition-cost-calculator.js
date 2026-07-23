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
    var sqFt = parseFloat(document.getElementById('input_additionSqFt').value) || 0;
    var story = document.getElementById('input_storyCount').value;
    var foundation = document.getElementById('input_foundationType').value;
    var finish = document.getElementById('input_finishTier').value;
    var hvacOpt = document.getElementById('input_includeHVAC').value;
    var permitPct = parseFloat(document.getElementById('input_permitsDesignPct').value) || 0;

    var finishRate = 180;
    if (finish === 'economy') finishRate = 120;
    if (finish === 'luxury') finishRate = 280;

    var foundRate = 12; // slab
    if (foundation === 'crawlspace') foundRate = 18;
    if (foundation === 'basement') foundRate = 35;
    if (foundation === 'bumpout') foundRate = 0;

    var storyMult = 1.0;
    if (story === 'second_story') storyMult = 1.4;
    if (story === 'two_story') storyMult = 1.7;

    var baseFramingCost = sqFt * finishRate * storyMult;
    var foundationRoofCost = sqFt * foundRate * (story === 'second_story' ? 0.5 : 1.0);

    var hvacCost = (hvacOpt === 'yes') ? 8000 : 0;

    var subtotal = baseFramingCost + foundationRoofCost + hvacCost;
    var permitCost = subtotal * (permitPct / 100);
    var totalCost = subtotal + permitCost;

    var effectiveCostPerSqFt = sqFt > 0 ? (totalCost / sqFt) : 0;

    var outBase = document.querySelector('#output_baseConstructionCost .output-number');
    var outFound = document.querySelector('#output_foundationRoofCost .output-number');
    var outPermits = document.querySelector('#output_permitsDesignCost .output-number');
    var outTotal = document.querySelector('#output_totalAdditionCost .output-number');

    if (outBase) outBase.textContent = formatCurrency(baseFramingCost);
    if (outFound) outFound.textContent = formatCurrency(foundationRoofCost);
    if (outPermits) outPermits.textContent = formatCurrency(permitCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalCost);

    updateChart(baseFramingCost, foundationRoofCost, hvacCost, permitCost, sqFt, storyMult, foundRate);

    if (window.logHistory) {
      window.logHistory('home-addition-cost-calculator', {
        additionSqFt: sqFt + ' sq ft',
        foundationType: foundation,
        costPerSqFt: formatCurrency(effectiveCostPerSqFt) + '/sq ft',
        totalCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(baseFraming, foundationCost, hvacCost, permitCost, sqFt, storyMult, foundRate) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costDistribution';

    var ctx = canvas.getContext('2d');

    if (tabId === 'sqftCostComparison') {
      var econCost = (sqFt * (120 + foundRate) * storyMult * 1.1) / (sqFt || 1);
      var stdCost = (sqFt * (180 + foundRate) * storyMult * 1.1) / (sqFt || 1);
      var luxCost = (sqFt * (280 + foundRate) * storyMult * 1.1) / (sqFt || 1);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Economy ($120/sqft base)', 'Standard ($180/sqft base)', 'Luxury ($280/sqft base)'],
          datasets: [{
            label: 'Cost Per Sq Ft ',
            data: [
              parseFloat(econCost.toFixed(0)),
              parseFloat(stdCost.toFixed(0)),
              parseFloat(luxCost.toFixed(0))
            ],
            backgroundColor: ['#10B981', '#2F6F5E', '#C08A2E']
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
          labels: ['Base Framing & Finishes', 'Foundation & Roof Systems', 'HVAC & Utility Extension', 'Permits & Design Plans'],
          datasets: [{
            data: [
              parseFloat(baseFraming.toFixed(0)),
              parseFloat(foundationCost.toFixed(0)),
              parseFloat(hvacCost.toFixed(0)),
              parseFloat(permitCost.toFixed(0))
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
    document.getElementById('input_additionSqFt').value = 400;
    document.getElementById('input_storyCount').value = 'single';
    document.getElementById('input_foundationType').value = 'slab';
    document.getElementById('input_finishTier').value = 'standard';
    document.getElementById('input_includeHVAC').value = 'yes';
    document.getElementById('input_permitsDesignPct').value = 10;
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
