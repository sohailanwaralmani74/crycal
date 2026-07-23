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
    var area = parseFloat(document.getElementById('input_totalAreaSqFt').value) || 0;
    var tileLen = parseFloat(document.getElementById('input_tileLengthInches').value) || 12;
    var tileWid = parseFloat(document.getElementById('input_tileWidthInches').value) || 12;
    var tileThick = parseFloat(document.getElementById('input_tileThicknessInches').value) || 0.375;
    var jointWid = parseFloat(document.getElementById('input_groutJointInches').value) || 0.125;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var bagWeight = parseFloat(document.getElementById('input_bagWeightLbs').value) || 25;

    // Formula: Grout lbs per sq ft = ((L + W) * J * T * 1.6) / (L * W)
    var denominator = tileLen * tileWid;
    if (denominator <= 0) denominator = 1;

    var lbsPerSqFt = ((tileLen + tileWid) * jointWid * tileThick * 1.6) / denominator;
    var netLbs = area * lbsPerSqFt;
    var wasteLbs = netLbs * (wastePct / 100);
    var totalLbs = netLbs + wasteLbs;

    var bagsNeeded = bagWeight > 0 ? Math.ceil(totalLbs / bagWeight) : 0;
    var estimatedCost = totalLbs * 1.50; // average grout price per lb

    var outWeight = document.querySelector('#output_groutWeightLbs .output-number');
    var outBags = document.querySelector('#output_bagsNeeded .output-number');
    var outPerSqFt = document.querySelector('#output_groutPerSqFt .output-number');
    var outCost = document.querySelector('#output_estimatedGroutCost .output-number');

    if (outWeight) outWeight.textContent = totalLbs.toFixed(2) + ' lbs';
    if (outBags) outBags.textContent = bagsNeeded + ' bags (' + bagWeight + ' lbs each)';
    if (outPerSqFt) outPerSqFt.textContent = lbsPerSqFt.toFixed(3) + ' lbs / sq ft';
    if (outCost) outCost.textContent = formatCurrency(estimatedCost);

    updateChart(netLbs, wasteLbs, bagsNeeded, bagWeight);

    if (window.logHistory) {
      window.logHistory('tile-grout-calculator', {
        totalAreaSqFt: area + ' sq ft',
        groutJointInches: jointWid + ' in',
        groutWeightLbs: totalLbs.toFixed(2) + ' lbs',
        bagsNeeded: bagsNeeded + ' bags'
      });
    }
  }

  function updateChart(netLbs, wasteLbs, bagsNeeded, bagWeight) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'groutWeightBreakdown';

    var ctx = canvas.getContext('2d');

    if (tabId === 'bagRequirement') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Required Grout Weight (' + netLbs.toFixed(1) + ' lbs)', 'Bag Capacity Overage'],
          datasets: [{
            data: [parseFloat(netLbs.toFixed(2)), parseFloat(((bagsNeeded * bagWeight) - netLbs).toFixed(2))],
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
          labels: ['Net Grout Weight', 'Waste & Spillage Overage'],
          datasets: [{
            label: 'Weight (lbs)',
            data: [parseFloat(netLbs.toFixed(2)), parseFloat(wasteLbs.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_totalAreaSqFt').value = 200;
    document.getElementById('input_tileLengthInches').value = 12;
    document.getElementById('input_tileWidthInches').value = 12;
    document.getElementById('input_tileThicknessInches').value = 0.375;
    document.getElementById('input_groutJointInches').value = 0.125;
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_bagWeightLbs').value = 25;
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
