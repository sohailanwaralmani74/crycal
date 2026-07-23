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
    var areaSqFt = parseFloat(document.getElementById('input_totalAreaSqFt').value) || 0;
    var lenFt = parseFloat(document.getElementById('input_sheetLengthFt').value) || 8;
    var widthFt = parseFloat(document.getElementById('input_sheetWidthFt').value) || 4;
    var wastePct = parseFloat(document.getElementById('input_wasteFactorPct').value) || 0;
    var pricePerSheet = parseFloat(document.getElementById('input_pricePerSheet').value) || 0;

    var singleSheetSqFt = lenFt * widthFt;
    var netSheets = singleSheetSqFt > 0 ? (areaSqFt / singleSheetSqFt) : 0;
    var totalSheets = Math.ceil(netSheets * (1 + wastePct / 100));
    var wasteSheets = Math.max(0, totalSheets - Math.floor(netSheets));

    var totalCost = totalSheets * pricePerSheet;
    var costPerSqFt = areaSqFt > 0 ? (totalCost / areaSqFt) : 0;

    var outTotalSheets = document.querySelector('#output_totalSheetsNeeded .output-number');
    var outNetCoverage = document.querySelector('#output_netSheetCoverage .output-number');
    var outWasteSheets = document.querySelector('#output_wasteSheetCount .output-number');
    var outTotalCost = document.querySelector('#output_totalPlywoodProjectCost .output-number');
    var outCostPerSqFt = document.querySelector('#output_costPerSqFtCoverage .output-number');

    if (outTotalSheets) outTotalSheets.textContent = totalSheets + ' Sheets';
    if (outNetCoverage) outNetCoverage.textContent = areaSqFt + ' sq ft';
    if (outWasteSheets) outWasteSheets.textContent = wasteSheets + ' Sheets';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);
    if (outCostPerSqFt) outCostPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(totalSheets - wasteSheets, wasteSheets, areaSqFt, totalCost);

    if (window.logHistory) {
      window.logHistory('plywood-sheet-calculator', {
        totalAreaSqFt: areaSqFt + ' sq ft',
        totalSheetsNeeded: totalSheets + ' Sheets',
        wasteSheetCount: wasteSheets + ' Sheets',
        totalPlywoodProjectCost: formatCurrency(totalCost),
        costPerSqFtCoverage: formatCurrency(costPerSqFt) + ' / sq ft'
      });
    }
  }

  function updateChart(netSheets, wasteSheets, areaSqFt, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'areaVsCostTab') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Area (sq ft)', 'Total Material Cost'],
          datasets: [{
            label: 'Area vs Expense',
            data: [areaSqFt, parseFloat(totalCost.toFixed(2))],
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
          labels: ['Net Coverage Sheets', 'Waste & Cut Overage Sheets'],
          datasets: [{
            data: [Math.max(0, netSheets), wasteSheets],
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
    document.getElementById('input_totalAreaSqFt').value = 1200;
    document.getElementById('input_sheetLengthFt').value = 8;
    document.getElementById('input_sheetWidthFt').value = 4;
    document.getElementById('input_wasteFactorPct').value = 10;
    document.getElementById('input_pricePerSheet').value = 28.50;
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
