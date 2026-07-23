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
    var area = parseFloat(document.getElementById('input_drywallAreaSqFt').value) || 0;
    var coats = parseInt(document.getElementById('input_coatCount').value, 10) || 3;
    var bktSize = parseFloat(document.getElementById('input_bucketSize').value) || 4.5;
    var bktPrice = parseFloat(document.getElementById('input_bucketPrice').value) || 0;
    var rollLen = parseFloat(document.getElementById('input_tapeRollLength').value) || 250;
    var rollPrice = parseFloat(document.getElementById('input_tapeRollPrice').value) || 0;

    var baseGallons = area * 0.053;
    var coatMult = coats === 1 ? 0.40 : (coats === 2 ? 0.75 : 1.00);
    var totalGallons = baseGallons * coatMult;

    var buckets = bktSize > 0 ? Math.ceil(totalGallons / bktSize) : 0;
    var tapeFeet = (area * 0.50) * 1.10;
    var tapeRolls = rollLen > 0 ? Math.ceil(tapeFeet / rollLen) : 0;
    var cornerBead = Math.round(area * 0.15);

    var mudCost = buckets * bktPrice;
    var tapeCost = tapeRolls * rollPrice;
    var totalCost = mudCost + tapeCost;

    var outGal = document.querySelector('#output_jointCompoundGallons .output-number');
    var outBkt = document.querySelector('#output_bucketsNeeded .output-number');
    var outTape = document.querySelector('#output_tapeRollsNeeded .output-number');
    var outBead = document.querySelector('#output_cornerBeadFeet .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outGal) outGal.textContent = totalGallons.toFixed(1) + ' gal';
    if (outBkt) outBkt.textContent = buckets + ' buckets (' + bktSize + ' gal ea)';
    if (outTape) outTape.textContent = tapeRolls + ' rolls (' + rollLen + ' ft ea)';
    if (outBead) outBead.textContent = cornerBead + ' linear ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(mudCost, tapeCost, baseGallons * 0.40, baseGallons * 0.35, baseGallons * 0.25);

    if (window.logHistory) {
      window.logHistory('drywall-mud-joint-compound-calculator', {
        drywallAreaSqFt: area + ' sq ft',
        coatCount: coats + ' coats',
        bucketsNeeded: buckets + ' buckets',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(mudCost, tapeCost, coat1Gal, coat2Gal, coat3Gal) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'coatUsage') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Coat 1 (Taping)', 'Coat 2 (Fill Coat)', 'Coat 3 (Finish/Skim)'],
          datasets: [{
            label: 'Compound Volume (Gallons)',
            data: [parseFloat(coat1Gal.toFixed(1)), parseFloat(coat2Gal.toFixed(1)), parseFloat(coat3Gal.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59']
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
          labels: ['Joint Compound Mud Cost', 'Drywall Tape Cost'],
          datasets: [{
            data: [parseFloat(mudCost.toFixed(2)), parseFloat(tapeCost.toFixed(2))],
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
    document.getElementById('input_drywallAreaSqFt').value = 800;
    document.getElementById('input_coatCount').value = '3';
    document.getElementById('input_bucketSize').value = '4.5';
    document.getElementById('input_bucketPrice').value = 18.00;
    document.getElementById('input_tapeRollLength').value = '250';
    document.getElementById('input_tapeRollPrice').value = 7.50;
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
