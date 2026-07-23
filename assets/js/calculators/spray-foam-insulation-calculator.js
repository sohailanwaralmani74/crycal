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
    var area = parseFloat(document.getElementById('input_areaSqFt').value) || 0;
    var foamType = document.getElementById('input_foamType').value || 'closed_cell';
    var thickness = parseFloat(document.getElementById('input_thicknessInches').value) || 0;
    var ratePerBdFt = parseFloat(document.getElementById('input_boardFootRate').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var rawBdFt = area * thickness;
    var totalBoardFeet = Math.ceil(rawBdFt * (1 + (wastePct / 100)));
    var totalCost = totalBoardFeet * ratePerBdFt;

    var rPerInch = foamType === 'closed_cell' ? 6.8 : 3.7;
    var achievedR = thickness * rPerInch;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outBdFt = document.querySelector('#output_totalBoardFeet .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');
    var outRVal = document.querySelector('#output_achievedRValue .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outBdFt) outBdFt.textContent = totalBoardFeet.toLocaleString() + ' bd ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);
    if (outRVal) outRVal.textContent = 'R-' + achievedR.toFixed(1);
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(rawBdFt, totalBoardFeet - rawBdFt, ratePerBdFt, thickness, achievedR);

    if (window.logHistory) {
      window.logHistory('spray-foam-insulation-calculator', {
        areaSqFt: area + ' sq ft',
        foamType: foamType === 'closed_cell' ? 'Closed Cell (2.0 lb)' : 'Open Cell (0.5 lb)',
        totalBoardFeet: totalBoardFeet + ' bd ft',
        totalCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(rawBdFt, wasteBdFt, rate, thickness, achievedR) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'rValueComparison') {
      var openCellR = thickness * 3.7;
      var closedCellR = thickness * 6.8;
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Open Cell (0.5 lb)', 'Closed Cell (2.0 lb)'],
          datasets: [{
            label: 'Achieved R-Value (' + thickness + ' inches)',
            data: [parseFloat(openCellR.toFixed(1)), parseFloat(closedCellR.toFixed(1))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var rawCost = rawBdFt * rate;
      var wasteCost = wasteBdFt * rate;
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Foam Material Cost', 'Over-spray & Shaving Allowance'],
          datasets: [{
            data: [parseFloat(rawCost.toFixed(2)), parseFloat(wasteCost.toFixed(2))],
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
    document.getElementById('input_areaSqFt').value = 1200;
    document.getElementById('input_foamType').value = 'closed_cell';
    document.getElementById('input_thicknessInches').value = 3;
    document.getElementById('input_boardFootRate').value = 1.50;
    document.getElementById('input_wastePercentage').value = 10;
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
