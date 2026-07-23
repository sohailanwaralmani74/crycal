(function() {
  'use strict';

  var chartInstance = null;

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

    calculate();
  }

  function calculate() {
    var winW = parseFloat(document.getElementById('input_windowWidthInches').value) || 36;
    var winH = parseFloat(document.getElementById('input_windowHeightInches').value) || 60;
    var casingW = parseFloat(document.getElementById('input_casingWidthInches').value) || 3.5;
    var hornO = parseFloat(document.getElementById('input_stoolHornOverhangInches').value) || 2.5;
    var winCount = parseInt(document.getElementById('input_windowCount').value, 10) || 1;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 10;

    // Per window dimensions (inches)
    var headerInches = winW + (2 * casingW);
    var sideLegInches = winH + casingW;
    var stoolInches = winW + (2 * casingW) + (2 * hornO);
    var apronInches = winW + (2 * casingW);

    // Per window linear feet
    var casingFtPerWin = (headerInches + (2 * sideLegInches)) / 12;
    var stoolApronFtPerWin = (stoolInches + apronInches) / 12;

    var totalCasingFtNet = casingFtPerWin * winCount;
    var totalStoolApronFtNet = stoolApronFtPerWin * winCount;
    var netCombinedFt = totalCasingFtNet + totalStoolApronFtNet;

    var totalWithWasteFt = netCombinedFt * (1 + (wastePct / 100));

    var boards8ft = Math.ceil(totalWithWasteFt / 8);
    var boards16ft = Math.ceil(totalWithWasteFt / 16);

    var outCasing = document.querySelector('#output_casingLinearFeet .output-number');
    var outStool = document.querySelector('#output_stoolApronLinearFeet .output-number');
    var outTotal = document.querySelector('#output_totalTrimLinearFeetWithWaste .output-number');
    var outBoards = document.querySelector('#output_boardCounts8ft16ft .output-number');

    if (outCasing) outCasing.textContent = totalCasingFtNet.toFixed(1) + ' Linear Feet';
    if (outStool) outStool.textContent = totalStoolApronFtNet.toFixed(1) + ' Linear Feet';
    if (outTotal) outTotal.textContent = totalWithWasteFt.toFixed(1) + ' Linear Feet';
    if (outBoards) outBoards.textContent = boards8ft + ' x 8ft Boards (or ' + boards16ft + ' x 16ft)';

    updateChart(totalCasingFtNet, totalStoolApronFtNet, netCombinedFt, totalWithWasteFt);

    if (window.logHistory) {
      window.logHistory('window-trim-casing-calculator', {
        windowWidthInches: winW + ' in',
        windowHeightInches: winH + ' in',
        windowCount: winCount,
        totalTrimLinearFeetWithWaste: totalWithWasteFt.toFixed(1) + ' ft'
      });
    }
  }

  function updateChart(casingFt, stoolApronFt, netFt, wasteFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'trimComponentBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'boardWasteComparison') {
      var wasteDifference = wasteFt - netFt;
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Trim Required (ft)', 'Miter Cut Waste Factor (ft)', 'Total Order Quantity (ft)'],
          datasets: [{
            label: 'Linear Feet',
            data: [parseFloat(netFt.toFixed(1)), parseFloat(wasteDifference.toFixed(1)), parseFloat(wasteFt.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Side & Header Casing (ft)', 'Stool & Apron Ledge (ft)'],
          datasets: [{
            data: [parseFloat(casingFt.toFixed(1)), parseFloat(stoolApronFt.toFixed(1))],
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
    document.getElementById('input_windowWidthInches').value = 36;
    document.getElementById('input_windowHeightInches').value = 60;
    document.getElementById('input_casingWidthInches').value = 3.5;
    document.getElementById('input_stoolHornOverhangInches').value = 2.5;
    document.getElementById('input_windowCount').value = 4;
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
