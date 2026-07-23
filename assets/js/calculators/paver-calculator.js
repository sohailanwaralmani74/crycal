(function() {
  'use strict';

  var chartInstance = null;

  var PAVER_SIZES = {
    '4x8': 0.2222,
    '6x6': 0.25,
    '6x9': 0.375,
    '12x12': 1.0,
    '16x16': 1.7778
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
    var lenFt = parseFloat(document.getElementById('input_patioLengthFt').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_patioWidthFt').value) || 0;
    var paverKey = document.getElementById('input_paverSize').value || '6x9';
    var wastePct = parseFloat(document.getElementById('input_wasteFactorPct').value) || 0;
    var pricePaver = parseFloat(document.getElementById('input_pricePerPaver').value) || 0;
    var baseDepth = parseFloat(document.getElementById('input_baseDepthInches').value) || 4;
    var sandDepth = parseFloat(document.getElementById('input_sandDepthInches').value) || 1;

    var areaSqFt = lenFt * widthFt;
    var paverArea = PAVER_SIZES[paverKey] || 0.375;

    var netPavers = paverArea > 0 ? (areaSqFt / paverArea) : 0;
    var totalPavers = Math.ceil(netPavers * (1 + wastePct / 100));

    var baseCuYd = (areaSqFt * (baseDepth / 12)) / 27;
    var baseTons = baseCuYd * 1.45;

    var sandCuYd = (areaSqFt * (sandDepth / 12)) / 27;

    var paverCost = totalPavers * pricePaver;
    var baseCost = baseTons * 35.00;
    var sandCost = sandCuYd * 45.00;
    var totalCost = paverCost + baseCost + sandCost;

    var outPavers = document.querySelector('#output_totalPaversNeeded .output-number');
    var outArea = document.querySelector('#output_patioAreaSqFt .output-number');
    var outBaseTons = document.querySelector('#output_baseStoneTons .output-number');
    var outSandYds = document.querySelector('#output_beddingSandYards .output-number');
    var outTotalCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outPavers) outPavers.textContent = totalPavers.toLocaleString() + ' Pavers';
    if (outArea) outArea.textContent = areaSqFt + ' sq ft';
    if (outBaseTons) outBaseTons.textContent = baseTons.toFixed(2) + ' Tons (' + baseCuYd.toFixed(2) + ' cu yds)';
    if (outSandYds) outSandYds.textContent = sandCuYd.toFixed(2) + ' Cu Yds';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);

    updateChart(paverCost, baseCost, sandCost, totalPavers, baseTons, sandCuYd);

    if (window.logHistory) {
      window.logHistory('paver-calculator', {
        patioLengthFt: lenFt + ' ft',
        patioWidthFt: widthFt + ' ft',
        totalPaversNeeded: totalPavers.toLocaleString() + ' Pavers',
        baseStoneTons: baseTons.toFixed(2) + ' tons',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(paverCost, baseCost, sandCost, totalPavers, baseTons, sandCuYd) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialWeights') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pavers Count / 10', 'Base Stone (Tons)', 'Bedding Sand (Cu Yds)'],
          datasets: [{
            label: 'Material Quantities',
            data: [Math.round(totalPavers / 10), parseFloat(baseTons.toFixed(2)), parseFloat(sandCuYd.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7B9D']
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
          labels: ['Pavers Cost', 'Base Stone Gravel Cost', 'Bedding Sand Cost'],
          datasets: [{
            data: [
              parseFloat(paverCost.toFixed(2)),
              parseFloat(baseCost.toFixed(2)),
              parseFloat(sandCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7B9D']
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
    document.getElementById('input_patioLengthFt').value = 20;
    document.getElementById('input_patioWidthFt').value = 15;
    document.getElementById('input_paverSize').value = '6x9';
    document.getElementById('input_wasteFactorPct').value = 10;
    document.getElementById('input_pricePerPaver').value = 1.85;
    document.getElementById('input_baseDepthInches').value = 4;
    document.getElementById('input_sandDepthInches').value = 1;
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
