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
    var perimeter = parseFloat(document.getElementById('input_roomPerimeter').value) || 0;
    var height = parseFloat(document.getElementById('input_wallHeight').value) || 0;
    var deduction = parseFloat(document.getElementById('input_deductionArea').value) || 0;
    var widthIn = parseFloat(document.getElementById('input_rollWidthInches').value) || 20.5;
    var lengthFt = parseFloat(document.getElementById('input_rollLengthFeet').value) || 33;
    var repeatIn = parseFloat(document.getElementById('input_patternRepeatInches').value) || 0;
    var pricePerDblRoll = parseFloat(document.getElementById('input_pricePerDoubleRoll').value) || 0;

    var grossWallArea = perimeter * height;
    var netWallArea = Math.max(0, grossWallArea - deduction);
    var widthFt = widthIn / 12;
    var grossRollSqFt = widthFt * lengthFt;

    var repeatFt = repeatIn / 12;
    var effectiveStripHeight = height + (repeatIn > 0 ? repeatFt : 0);
    var stripsPerRoll = effectiveStripHeight > 0 ? Math.floor(lengthFt / effectiveStripHeight) : 0;

    var usableRollSqFt = 0;
    if (stripsPerRoll > 0) {
      usableRollSqFt = stripsPerRoll * widthFt * height;
    } else {
      usableRollSqFt = grossRollSqFt * 0.70;
    }

    var doubleRolls = usableRollSqFt > 0 ? Math.ceil(netWallArea / usableRollSqFt) : 0;
    var singleRolls = doubleRolls * 2;
    var wastePct = grossRollSqFt > 0 ? Math.max(0, ((grossRollSqFt - usableRollSqFt) / grossRollSqFt) * 100) : 0;

    var totalCost = doubleRolls * pricePerDblRoll;

    var outDbl = document.querySelector('#output_doubleRollsNeeded .output-number');
    var outSgl = document.querySelector('#output_singleRollsNeeded .output-number');
    var outWaste = document.querySelector('#output_wastePercentage .output-number');
    var outCost = document.querySelector('#output_totalWallpaperCost .output-number');

    if (outDbl) outDbl.textContent = doubleRolls + ' double rolls';
    if (outSgl) outSgl.textContent = singleRolls + ' single rolls eq.';
    if (outWaste) outWaste.textContent = wastePct.toFixed(1) + '%';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    var totalUsedArea = doubleRolls * grossRollSqFt;
    var totalWasteArea = Math.max(0, totalUsedArea - netWallArea);

    updateChart(netWallArea, totalWasteArea, singleRolls, doubleRolls);

    if (window.logHistory) {
      window.logHistory('wallpaper-calculator', {
        roomPerimeter: perimeter + ' ft',
        wallHeight: height + ' ft',
        doubleRollsNeeded: doubleRolls + ' dbl rolls',
        totalWallpaperCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netArea, wasteArea, singleRolls, doubleRolls) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'wallpaperCoverage';

    var ctx = canvas.getContext('2d');
    if (tabId === 'rollComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Single Rolls Equivalent', 'Double Rolls (Bottles/Bolts)'],
          datasets: [{
            label: 'Roll Count',
            data: [singleRolls, doubleRolls],
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
          labels: ['Usable Wall Surface (sq ft)', 'Pattern Match & Trimming Waste (sq ft)'],
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
    document.getElementById('input_roomPerimeter').value = 54;
    document.getElementById('input_wallHeight').value = 8;
    document.getElementById('input_deductionArea').value = 40;
    document.getElementById('input_rollWidthInches').value = '20.5';
    document.getElementById('input_rollLengthFeet').value = 33;
    document.getElementById('input_patternRepeatInches').value = 12;
    document.getElementById('input_pricePerDoubleRoll').value = 40.00;
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
