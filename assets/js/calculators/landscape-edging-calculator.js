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
    var perimeterFt = parseFloat(document.getElementById('input_gardenPerimeterFt').value) || 0;
    var sectionLenFt = parseFloat(document.getElementById('input_sectionLengthFt').value) || 20;
    var stakeSpacingIn = parseFloat(document.getElementById('input_stakeSpacingIn').value) || 24;
    var pricePerSection = parseFloat(document.getElementById('input_edgingPrice').value) || 0;
    var pricePerStake = parseFloat(document.getElementById('input_stakePackPrice').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteMarginPercent').value) || 0;

    var grossLinearFt = perimeterFt * (1 + (wastePct / 100));
    var sectionsCount = Math.ceil(grossLinearFt / sectionLenFt);

    var stakeIntervalFt = stakeSpacingIn / 12;
    var baseStakes = stakeIntervalFt > 0 ? Math.ceil(grossLinearFt / stakeIntervalFt) : 0;
    var totalStakes = baseStakes + sectionsCount; // Add joint anchor stakes

    var edgingCost = sectionsCount * pricePerSection;
    var stakesCost = totalStakes * pricePerStake;
    var totalCost = edgingCost + stakesCost;

    var outLinearFt = document.querySelector('#output_totalLinearFeetNeeded .output-number');
    var outSections = document.querySelector('#output_sectionsCount .output-number');
    var outStakes = document.querySelector('#output_totalStakesNeeded .output-number');
    var outEdgingCost = document.querySelector('#output_edgingMaterialCost .output-number');
    var outStakesCost = document.querySelector('#output_stakesCost .output-number');
    var outTotalCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outLinearFt) outLinearFt.textContent = grossLinearFt.toFixed(1) + ' linear ft';
    if (outSections) outSections.textContent = sectionsCount + (sectionLenFt === 20 ? ' Rolls' : ' Sections');
    if (outStakes) outStakes.textContent = totalStakes + ' Stakes';
    if (outEdgingCost) outEdgingCost.textContent = formatCurrency(edgingCost);
    if (outStakesCost) outStakesCost.textContent = formatCurrency(stakesCost);
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);

    updateChart(edgingCost, stakesCost, sectionsCount, totalStakes);

    if (window.logHistory) {
      window.logHistory('landscape-edging-calculator', {
        gardenPerimeterFt: perimeterFt + ' ft',
        sectionsCount: sectionsCount + ' Units',
        totalStakesNeeded: totalStakes + ' Stakes',
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(edgingCost, stakesCost, sections, stakes) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'quantitiesOverview') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Edging Sections / Rolls', 'Anchoring Stakes'],
          datasets: [{
            label: 'Quantity Count',
            data: [sections, stakes],
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
          labels: ['Edging Material Cost', 'Anchoring Stakes Cost'],
          datasets: [{
            data: [parseFloat(edgingCost.toFixed(2)), parseFloat(stakesCost.toFixed(2))],
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
    document.getElementById('input_gardenPerimeterFt').value = 60;
    document.getElementById('input_sectionLengthFt').value = "20";
    document.getElementById('input_stakeSpacingIn').value = 24;
    document.getElementById('input_edgingPrice').value = 12.00;
    document.getElementById('input_stakePackPrice').value = 0.75;
    document.getElementById('input_wasteMarginPercent').value = 10;
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
