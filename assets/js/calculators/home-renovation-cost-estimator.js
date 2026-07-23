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
    var sqFt = parseFloat(document.getElementById('input_homeSqFt').value) || 0;
    var locFactor = parseFloat(document.getElementById('input_locationFactor').value) || 1.0;
    var contingencyPct = parseFloat(document.getElementById('input_contingencyPct').value) || 0;
    var lowRate = parseFloat(document.getElementById('input_customLowRate').value) || 25;
    var medRate = parseFloat(document.getElementById('input_customMedRate').value) || 65;
    var highRate = parseFloat(document.getElementById('input_customHighRate').value) || 125;

    var lowBase = sqFt * lowRate * locFactor;
    var medBase = sqFt * medRate * locFactor;
    var highBase = sqFt * highRate * locFactor;

    var contingencyVal = medBase * (contingencyPct / 100);

    var lowTotal = lowBase + (lowBase * (contingencyPct / 100));
    var medTotal = medBase + contingencyVal;
    var highTotal = highBase + (highBase * (contingencyPct / 100));

    var outLow = document.querySelector('#output_lowTierEstimate .output-number');
    var outMed = document.querySelector('#output_midTierEstimate .output-number');
    var outHigh = document.querySelector('#output_highTierEstimate .output-number');
    var outCont = document.querySelector('#output_contingencyAmount .output-number');

    if (outLow) outLow.textContent = formatCurrency(lowTotal);
    if (outMed) outMed.textContent = formatCurrency(medTotal);
    if (outHigh) outHigh.textContent = formatCurrency(highTotal);
    if (outCont) outCont.textContent = formatCurrency(contingencyVal);

    updateChart(lowTotal, medTotal, highTotal, medBase);

    if (window.logHistory) {
      window.logHistory('home-renovation-cost-estimator', {
        homeSqFt: sqFt + ' sq ft',
        lowTier: formatCurrency(lowTotal),
        midTier: formatCurrency(medTotal),
        highTier: formatCurrency(highTotal)
      });
    }
  }

  function updateChart(lowTotal, medTotal, highTotal, medBase) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'tierComparison';

    var ctx = canvas.getContext('2d');

    if (tabId === 'budgetBreakdown') {
      var finishes = medBase * 0.35;
      var mep = medBase * 0.20;
      var finishesOther = medBase * 0.25;
      var demo = medBase * 0.10;
      var mgmt = medBase * 0.10;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Kitchen & Bath Finishes (35%)', 'Flooring & Paint (25%)', 'MEP Electrical/Plumbing (20%)', 'Demolition (10%)', 'Contractor Mgmt (10%)'],
          datasets: [{
            data: [
              parseFloat(finishes.toFixed(0)),
              parseFloat(finishesOther.toFixed(0)),
              parseFloat(mep.toFixed(0)),
              parseFloat(demo.toFixed(0)),
              parseFloat(mgmt.toFixed(0))
            ],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#10B981', '#EF4444', '#C08A2E']
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
          labels: ['Low Tier (Cosmetic)', 'Mid Tier (Standard)', 'High Tier (Luxury / Gut)'],
          datasets: [{
            label: 'Total Renovation Cost ',
            data: [
              parseFloat(lowTotal.toFixed(0)),
              parseFloat(medTotal.toFixed(0)),
              parseFloat(highTotal.toFixed(0))
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
    }
  }

  function reset() {
    document.getElementById('input_homeSqFt').value = 2000;
    document.getElementById('input_renovationScope').value = 'standard';
    document.getElementById('input_locationFactor').value = '1.0';
    document.getElementById('input_contingencyPct').value = 15;
    document.getElementById('input_customLowRate').value = 25;
    document.getElementById('input_customMedRate').value = 65;
    document.getElementById('input_customHighRate').value = 125;
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
