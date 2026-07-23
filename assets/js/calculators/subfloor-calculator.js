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
    var areaSqFt = parseFloat(document.getElementById('input_floorAreaSqFt').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactorPct').value) || 0;
    var priceSheet = parseFloat(document.getElementById('input_pricePerSheet').value) || 0;
    var priceAdhesive = parseFloat(document.getElementById('input_adhesiveTubePrice').value) || 0;
    var priceScrewBox = parseFloat(document.getElementById('input_screwBoxPrice').value) || 0;

    var netSheets = areaSqFt > 0 ? (areaSqFt / 32) : 0;
    var totalSheets = Math.ceil(netSheets * (1 + wastePct / 100));

    var adhesiveTubes = totalSheets > 0 ? Math.ceil(totalSheets / 5) : 0;
    var totalScrews = totalSheets * 36;
    var screwBoxes = totalScrews > 0 ? Math.ceil(totalScrews / 500) : 0;

    var sheetCost = totalSheets * priceSheet;
    var adhesiveCost = adhesiveTubes * priceAdhesive;
    var screwCost = screwBoxes * priceScrewBox;
    var totalCost = sheetCost + adhesiveCost + screwCost;

    var outSheets = document.querySelector('#output_totalSheetsNeeded .output-number');
    var outTubes = document.querySelector('#output_adhesiveTubesNeeded .output-number');
    var outScrews = document.querySelector('#output_totalScrewsNeeded .output-number');
    var outBoxes = document.querySelector('#output_screwBoxesNeeded .output-number');
    var outTotalCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outSheets) outSheets.textContent = totalSheets + ' Sheets';
    if (outTubes) outTubes.textContent = adhesiveTubes + ' Tubes (28 oz)';
    if (outScrews) outScrews.textContent = totalScrews.toLocaleString() + ' Screws';
    if (outBoxes) outBoxes.textContent = screwBoxes + ' Boxes (500/box)';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);

    updateChart(sheetCost, adhesiveCost, screwCost, totalSheets, adhesiveTubes, screwBoxes);

    if (window.logHistory) {
      window.logHistory('subfloor-calculator', {
        floorAreaSqFt: areaSqFt + ' sq ft',
        totalSheetsNeeded: totalSheets + ' Sheets',
        adhesiveTubesNeeded: adhesiveTubes + ' Tubes',
        totalScrewsNeeded: totalScrews.toLocaleString() + ' Screws',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(sheetCost, adhesiveCost, screwCost, sheets, tubes, boxes) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialQuantities') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['3/4" T&G Sheets', 'Adhesive Tubes', 'Screw Boxes (500s)'],
          datasets: [{
            label: 'Material Items Count',
            data: [sheets, tubes, boxes],
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
          labels: ['Subfloor Sheets Cost', 'Adhesive Cost', 'Fastener Screws Cost'],
          datasets: [{
            data: [
              parseFloat(sheetCost.toFixed(2)),
              parseFloat(adhesiveCost.toFixed(2)),
              parseFloat(screwCost.toFixed(2))
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
    document.getElementById('input_floorAreaSqFt').value = 800;
    document.getElementById('input_wasteFactorPct').value = 10;
    document.getElementById('input_pricePerSheet').value = 34.50;
    document.getElementById('input_adhesiveTubePrice').value = 9.50;
    document.getElementById('input_screwBoxPrice').value = 28.00;
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
