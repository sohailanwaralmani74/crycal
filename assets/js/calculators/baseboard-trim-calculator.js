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
    var perimeterFt = parseFloat(document.getElementById('input_roomPerimeterFt').value) || 0;
    var deductionFt = parseFloat(document.getElementById('input_doorwayDeductionFt').value) || 0;
    var boardLenFt = parseFloat(document.getElementById('input_boardLengthFt').value) || 12;
    var wastePct = parseFloat(document.getElementById('input_wasteFactorPct').value) || 0;
    var pricePerFt = parseFloat(document.getElementById('input_pricePerLinearFt').value) || 0;

    var netFt = Math.max(0, perimeterFt - deductionFt);
    var grossFt = netFt * (1 + wastePct / 100);
    var totalBoards = boardLenFt > 0 ? Math.ceil(grossFt / boardLenFt) : 0;
    var purchasedFt = totalBoards * boardLenFt;

    var totalCost = purchasedFt * pricePerFt;
    var effCostPerFt = netFt > 0 ? (totalCost / netFt) : 0;

    var outNet = document.querySelector('#output_netLinearFeet .output-number');
    var outGross = document.querySelector('#output_grossLinearFeet .output-number');
    var outBoards = document.querySelector('#output_totalBoardsNeeded .output-number');
    var outTotalCost = document.querySelector('#output_totalTrimCost .output-number');
    var outEffCost = document.querySelector('#output_effectiveCostPerFt .output-number');

    if (outNet) outNet.textContent = netFt.toFixed(1) + ' Linear Feet';
    if (outGross) outGross.textContent = grossFt.toFixed(1) + ' Linear Feet';
    if (outBoards) outBoards.textContent = totalBoards + ' Boards (' + boardLenFt + ' ft each)';
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);
    if (outEffCost) outEffCost.textContent = formatCurrency(effCostPerFt) + ' / net ft';

    updateChart(netFt, Math.max(0, grossFt - netFt), totalBoards, totalCost);

    if (window.logHistory) {
      window.logHistory('baseboard-trim-calculator', {
        roomPerimeterFt: perimeterFt + ' ft',
        netLinearFeet: netFt.toFixed(1) + ' ft',
        grossLinearFeet: grossFt.toFixed(1) + ' ft',
        totalBoardsNeeded: totalBoards + ' Boards',
        totalTrimCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netFt, wasteFt, totalBoards, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'trimLengthBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costVsPieces') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Boards Needed', 'Total Trim Material Cost '],
          datasets: [{
            label: 'Quantity vs Cost',
            data: [totalBoards, parseFloat(totalCost.toFixed(2))],
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
          labels: ['Net Linear Feet', 'Miter & Cutting Waste Feet'],
          datasets: [{
            data: [parseFloat(netFt.toFixed(1)), parseFloat(wasteFt.toFixed(1))],
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
    document.getElementById('input_roomPerimeterFt').value = 120;
    document.getElementById('input_doorwayDeductionFt').value = 12;
    document.getElementById('input_boardLengthFt').value = "12";
    document.getElementById('input_wasteFactorPct').value = 10;
    document.getElementById('input_pricePerLinearFt').value = 2.25;
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
