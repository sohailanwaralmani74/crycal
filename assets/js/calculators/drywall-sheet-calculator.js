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
    var sheetSqFt = parseFloat(document.getElementById('input_sheetSize').value) || 32;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;
    var pricePerSheet = parseFloat(document.getElementById('input_pricePerSheet').value) || 0;

    var grossArea = area * (1 + wastePct / 100);
    var exactSheets = sheetSqFt > 0 ? (grossArea / sheetSqFt) : 0;
    var totalSheets = Math.ceil(exactSheets);

    var totalCost = totalSheets * pricePerSheet;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outSheets = document.querySelector('#output_totalSheetsNeeded .output-number');
    var outExact = document.querySelector('#output_exactSheetsCalculated .output-number');
    var outCost = document.querySelector('#output_totalDrywallCost .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outSheets) outSheets.textContent = totalSheets + ' sheets';
    if (outExact) outExact.textContent = exactSheets.toFixed(2) + ' sheets';
    if (outCost) outCost.textContent = formatCurrency(totalCost);
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(area, grossArea - area, totalSheets, sheetSqFt);

    if (window.logHistory) {
      window.logHistory('drywall-sheet-calculator', {
        totalAreaSqFt: area + ' sq ft',
        sheetSize: sheetSqFt + ' sq ft',
        totalSheetsNeeded: totalSheets + ' sheets',
        totalDrywallCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netArea, wasteArea, totalSheets, sheetSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'sheetComparison') {
      var count4x8 = Math.ceil((netArea * 1.10) / 32);
      var count4x12 = Math.ceil((netArea * 1.10) / 48);
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['4x8 Sheets (32 sq ft)', '4x12 Sheets (48 sq ft)'],
          datasets: [{
            label: 'Panels Needed',
            data: [count4x8, count4x12],
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
          labels: ['Net Surface Area (sq ft)', 'Waste & Cutting Allowance (sq ft)'],
          datasets: [{
            data: [parseFloat(netArea.toFixed(1)), parseFloat(wasteArea.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#E07A5F']
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
    document.getElementById('input_totalAreaSqFt').value = 800;
    document.getElementById('input_sheetSize').value = '32';
    document.getElementById('input_wastePercentage').value = 10;
    document.getElementById('input_pricePerSheet').value = 15.50;
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
