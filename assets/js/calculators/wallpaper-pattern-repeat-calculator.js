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
    var wallW = parseFloat(document.getElementById('input_wallWidthFt').value) || 0;
    var wallH = parseFloat(document.getElementById('input_wallHeightFt').value) || 0;
    var repeatIn = parseFloat(document.getElementById('input_patternRepeatIn').value) || 0;
    var rollW = parseFloat(document.getElementById('input_rollWidthIn').value) || 20.5;
    var rollL = parseFloat(document.getElementById('input_rollLengthFt').value) || 33;
    var rollPrice = parseFloat(document.getElementById('input_rollPrice').value) || 0;

    var wallHIn = wallH * 12;
    var baseCutIn = wallHIn + 4; // 4" trimming margin

    var adjustedCutIn = baseCutIn;
    if (repeatIn > 0) {
      var repeatsNeeded = Math.ceil(baseCutIn / repeatIn);
      adjustedCutIn = repeatsNeeded * repeatIn;
    }

    var cutLengthFt = adjustedCutIn / 12;
    var usableStripsPerRoll = cutLengthFt > 0 ? Math.floor(rollL / cutLengthFt) : 0;
    if (usableStripsPerRoll < 1) usableStripsPerRoll = 1;

    var totalStrips = Math.ceil((wallW * 12) / rollW);
    var totalRolls = Math.ceil(totalStrips / usableStripsPerRoll);

    var wallAreaSqFt = wallW * wallH;
    var rollAreaSqFt = (rollW / 12) * rollL;
    var totalPurchasedSqFt = totalRolls * rollAreaSqFt;

    var wasteSqFt = Math.max(0, totalPurchasedSqFt - wallAreaSqFt);
    var wastePct = totalPurchasedSqFt > 0 ? (wasteSqFt / totalPurchasedSqFt) * 100 : 0;

    var totalCost = totalRolls * rollPrice;

    var outCutLength = document.querySelector('#output_singleStripUsableHeightFt .output-number');
    var outStripsPerRoll = document.querySelector('#output_stripsPerRoll .output-number');
    var outTotalStrips = document.querySelector('#output_totalStripsNeeded .output-number');
    var outTotalRolls = document.querySelector('#output_totalRollsNeeded .output-number');
    var outWastePct = document.querySelector('#output_wastePercentage .output-number');
    var outCost = document.querySelector('#output_totalWallpaperCost .output-number');

    if (outCutLength) outCutLength.textContent = cutLengthFt.toFixed(2) + ' ft (' + adjustedCutIn.toFixed(0) + '")';
    if (outStripsPerRoll) outStripsPerRoll.textContent = usableStripsPerRoll + ' strips / roll';
    if (outTotalStrips) outTotalStrips.textContent = totalStrips + ' Strips';
    if (outTotalRolls) outTotalRolls.textContent = totalRolls + ' Rolls';
    if (outWastePct) outWastePct.textContent = wastePct.toFixed(1) + '%';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(wallAreaSqFt, wasteSqFt, totalStrips, totalRolls);

    if (window.logHistory) {
      window.logHistory('wallpaper-pattern-repeat-calculator', {
        wallWidthFt: wallW + ' ft',
        wallHeightFt: wallH + ' ft',
        totalStripsNeeded: totalStrips + ' Strips',
        totalRollsNeeded: totalRolls + ' Rolls',
        totalWallpaperCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netWallArea, wasteArea, strips, rolls) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'wasteBreakdownChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'rollRequirementChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Wall Strips Needed', 'Double Rolls to Order'],
          datasets: [{
            label: 'Count',
            data: [strips, rolls],
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
          labels: ['Effective Net Wall Area', 'Pattern Match & Trimming Waste'],
          datasets: [{
            data: [parseFloat(netWallArea.toFixed(1)), parseFloat(wasteArea.toFixed(1))],
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
    document.getElementById('input_wallWidthFt').value = 16;
    document.getElementById('input_wallHeightFt').value = 9;
    document.getElementById('input_patternRepeatIn').value = 18;
    document.getElementById('input_rollWidthIn').value = 20.5;
    document.getElementById('input_rollLengthFt').value = 33;
    document.getElementById('input_rollPrice').value = 45.00;
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
