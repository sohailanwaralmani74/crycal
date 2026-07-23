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
    var runFt = parseFloat(document.getElementById('input_totalShelvingRunsFt').value) || 0;
    var tiers = parseFloat(document.getElementById('input_numberOfTiers').value) || 1;
    var spacingIn = parseFloat(document.getElementById('input_bracketSpacingIn').value) || 24;
    var boardStockFt = parseFloat(document.getElementById('input_boardLengthFt').value) || 8;
    var priceBoard = parseFloat(document.getElementById('input_pricePerBoard').value) || 0;
    var priceBracket = parseFloat(document.getElementById('input_pricePerBracket').value) || 0;

    var totalLinearFt = runFt * tiers;
    var totalBoards = boardStockFt > 0 ? Math.ceil(totalLinearFt / boardStockFt) : 0;

    var spacingFt = spacingIn / 12;
    var bracketsPerTier = spacingFt > 0 ? Math.ceil(runFt / spacingFt) + 1 : 2;
    var totalBrackets = bracketsPerTier * tiers;

    var boardsCost = totalBoards * priceBoard;
    var bracketsCost = totalBrackets * priceBracket;
    var totalCost = boardsCost + bracketsCost;

    var outLinearFt = document.querySelector('#output_totalShelfLinearFeet .output-number');
    var outBoards = document.querySelector('#output_totalBoardsNeeded .output-number');
    var outBrackets = document.querySelector('#output_totalBracketsNeeded .output-number');
    var outBoardsCost = document.querySelector('#output_boardsCost .output-number');
    var outBracketsCost = document.querySelector('#output_bracketsCost .output-number');
    var outTotalCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outLinearFt) outLinearFt.textContent = totalLinearFt.toFixed(1) + ' linear ft';
    if (outBoards) outBoards.textContent = totalBoards + ' Boards (' + boardStockFt + '\' stock)';
    if (outBrackets) outBrackets.textContent = totalBrackets + ' Brackets';
    if (outBoardsCost) outBoardsCost.textContent = formatCurrency(boardsCost);
    if (outBracketsCost) outBracketsCost.textContent = formatCurrency(bracketsCost);
    if (outTotalCost) outTotalCost.textContent = formatCurrency(totalCost);

    updateChart(boardsCost, bracketsCost, totalBoards, totalBrackets);

    if (window.logHistory) {
      window.logHistory('shelving-closet-organizer-calculator', {
        totalShelvingRunsFt: runFt + ' ft',
        numberOfTiers: tiers + ' Tiers',
        totalBoardsNeeded: totalBoards + ' Boards',
        totalBracketsNeeded: totalBrackets + ' Brackets',
        totalProjectCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(boardsCost, bracketsCost, boards, brackets) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costComponentChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialsCountChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Shelf Boards Needed', 'Support Brackets Needed'],
          datasets: [{
            label: 'Items Count',
            data: [boards, brackets],
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
          labels: ['Shelf Boards Cost', 'Support Brackets Cost'],
          datasets: [{
            data: [parseFloat(boardsCost.toFixed(2)), parseFloat(bracketsCost.toFixed(2))],
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
    document.getElementById('input_totalShelvingRunsFt').value = 12;
    document.getElementById('input_numberOfTiers').value = 4;
    document.getElementById('input_bracketSpacingIn').value = 24;
    document.getElementById('input_boardLengthFt').value = "8";
    document.getElementById('input_pricePerBoard').value = 18.00;
    document.getElementById('input_pricePerBracket').value = 4.50;
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
