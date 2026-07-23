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
    var counterLen = parseFloat(document.getElementById('input_counterLengthInches').value) || 0;
    var counterDep = parseFloat(document.getElementById('input_counterDepthInches').value) || 0;
    var islandLen = parseFloat(document.getElementById('input_islandLengthInches').value) || 0;
    var islandWid = parseFloat(document.getElementById('input_islandWidthInches').value) || 0;
    var splashHeight = parseFloat(document.getElementById('input_backsplashHeightInches').value) || 0;
    var sinks = parseFloat(document.getElementById('input_sinkCutouts').value) || 0;
    var cooktops = parseFloat(document.getElementById('input_cooktopCutouts').value) || 0;
    var pricePerSqFt = parseFloat(document.getElementById('input_materialPricePerSqFt').value) || 0;
    var slabSize = parseFloat(document.getElementById('input_slabSizeSqFt').value) || 55;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;

    var mainSqFt = (counterLen * counterDep) / 144;
    var islandSqFt = (islandLen * islandWid) / 144;
    var splashSqFt = ((counterLen + islandLen) * splashHeight) / 144;

    var cutoutsDeduction = (sinks * 5.0) + (cooktops * 4.0);

    var grossSqFt = mainSqFt + islandSqFt + splashSqFt;
    var netSqFt = Math.max(0, grossSqFt - cutoutsDeduction);

    var totalOrderSqFt = netSqFt * (1 + (wastePct / 100));
    var slabsNeeded = slabSize > 0 ? Math.ceil(totalOrderSqFt / slabSize) : 0;
    var totalCost = totalOrderSqFt * pricePerSqFt;

    var outNet = document.querySelector('#output_netCountertopSqFt .output-number');
    var outCutouts = document.querySelector('#output_cutoutsDeductionSqFt .output-number');
    var outSlabs = document.querySelector('#output_totalSlabsNeeded .output-number');
    var outCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outNet) outNet.textContent = netSqFt.toFixed(1) + ' sq ft';
    if (outCutouts) outCutouts.textContent = cutoutsDeduction.toFixed(1) + ' sq ft';
    if (outSlabs) outSlabs.textContent = slabsNeeded + ' slabs';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(mainSqFt, islandSqFt, splashSqFt, cutoutsDeduction, netSqFt, totalCost, wastePct);

    if (window.logHistory) {
      window.logHistory('countertop-square-footage-calculator', {
        netSqFt: netSqFt.toFixed(1) + ' sq ft',
        slabCount: slabsNeeded + ' slabs',
        totalCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(mainSqFt, islandSqFt, splashSqFt, cutouts, netSqFt, totalCost, wastePct) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'sqftBreakdown';

    var ctx = canvas.getContext('2d');

    if (tabId === 'costBreakdown') {
      var baseMatCost = netSqFt * (totalCost / (netSqFt * (1 + wastePct / 100) || 1));
      var wasteCost = totalCost - baseMatCost;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Surface Material Cost', 'Fabrication & Waste Cost'],
          datasets: [{
            data: [parseFloat(baseMatCost.toFixed(0)), parseFloat(wasteCost.toFixed(0))],
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
          labels: ['Main Counter', 'Island', 'Backsplash', 'Cutouts Deduction'],
          datasets: [{
            label: 'Square Feet',
            data: [
              parseFloat(mainSqFt.toFixed(1)),
              parseFloat(islandSqFt.toFixed(1)),
              parseFloat(splashSqFt.toFixed(1)),
              parseFloat(cutouts.toFixed(1))
            ],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#10B981', '#EF4444']
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
    document.getElementById('input_counterLengthInches').value = 120;
    document.getElementById('input_counterDepthInches').value = 25.5;
    document.getElementById('input_islandLengthInches').value = 72;
    document.getElementById('input_islandWidthInches').value = 36;
    document.getElementById('input_backsplashHeightInches').value = 4;
    document.getElementById('input_sinkCutouts').value = 1;
    document.getElementById('input_cooktopCutouts').value = 1;
    document.getElementById('input_materialPricePerSqFt').value = 65;
    document.getElementById('input_slabSizeSqFt').value = 55;
    document.getElementById('input_wasteFactor').value = 15;
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
