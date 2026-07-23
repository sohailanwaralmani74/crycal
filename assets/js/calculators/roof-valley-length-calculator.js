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

  function formatFeetInches(decimalFeet) {
    var totalInches = decimalFeet * 12;
    var feet = Math.floor(totalInches / 12);
    var inches = (totalInches % 12).toFixed(1);
    return feet + '\' ' + inches + '" (' + decimalFeet.toFixed(2) + ' ft)';
  }

  function calculate() {
    var runFeet = parseFloat(document.getElementById('input_roofRunFeet').value) || 0;
    var majorPitch = parseFloat(document.getElementById('input_majorPitch').value) || 0;
    var minorPitch = parseFloat(document.getElementById('input_minorPitch').value) || 0;
    var overhangInches = parseFloat(document.getElementById('input_overhangInches').value) || 0;
    var wastePercent = parseFloat(document.getElementById('input_wasteFactorPercent').value) || 0;

    var p1 = majorPitch / 12;
    var p2 = minorPitch / 12;

    var valleyMultiplier = Math.sqrt(1 + p1 * p1 + p2 * p2);

    var valleyRafterFeet = runFeet * valleyMultiplier;
    var overhangTailFeet = (overhangInches / 12) * valleyMultiplier;
    var totalValleyFeet = valleyRafterFeet + overhangTailFeet;

    var wasteFactor = 1 + (wastePercent / 100);
    var flashingFeetGross = totalValleyFeet * wasteFactor;
    var flashing10ftSticks = Math.ceil(flashingFeetGross / 10);

    var commonMultiplier = Math.sqrt(1 + p1 * p1);
    var commonRafterFeet = runFeet * commonMultiplier;

    var outValleyRafter = document.querySelector('#output_valleyRafterLength .output-number');
    var outTotalValley = document.querySelector('#output_totalValleyLength .output-number');
    var outMultiplier = document.querySelector('#output_valleyMultiplier .output-number');
    var outFlashing = document.querySelector('#output_wValleyFlashingFeet .output-number');

    if (outValleyRafter) outValleyRafter.textContent = formatFeetInches(valleyRafterFeet);
    if (outTotalValley) outTotalValley.textContent = formatFeetInches(totalValleyFeet);
    if (outMultiplier) outMultiplier.textContent = valleyMultiplier.toFixed(3);
    if (outFlashing) outFlashing.textContent = flashingFeetGross.toFixed(1) + ' ft (' + flashing10ftSticks + ' pcs @ 10\')';

    updateChart(commonRafterFeet, valleyRafterFeet, totalValleyFeet, flashingFeetGross - totalValleyFeet);

    if (window.logHistory) {
      window.logHistory('roof-valley-length-calculator', {
        roofRunFeet: runFeet + ' ft',
        majorPitch: majorPitch + '/12',
        valleyRafterLength: valleyRafterFeet.toFixed(2) + ' ft',
        totalValleyLength: totalValleyFeet.toFixed(2) + ' ft',
        valleyMultiplier: valleyMultiplier.toFixed(3),
        wValleyFlashingFeet: flashingFeetGross.toFixed(1) + ' ft'
      });
    }
  }

  function updateChart(commonFeet, valleyFeet, netFlashing, wasteFlashing) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'valleyVsCommon';

    var ctx = canvas.getContext('2d');
    if (tabId === 'flashingMaterials') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Flashing Needed (ft)', 'Waste & Lap Overlap (ft)'],
          datasets: [{
            data: [parseFloat(netFlashing.toFixed(1)), parseFloat(wasteFlashing.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Common Rafter (ft)', 'Valley Rafter (ft)'],
          datasets: [{
            label: 'Length in Feet',
            data: [parseFloat(commonFeet.toFixed(2)), parseFloat(valleyFeet.toFixed(2))],
            backgroundColor: ['#4A90E2', '#2F6F5E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_roofRunFeet').value = 15;
    document.getElementById('input_majorPitch').value = 6;
    document.getElementById('input_minorPitch').value = 6;
    document.getElementById('input_overhangInches').value = 12;
    document.getElementById('input_wasteFactorPercent').value = 10;
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
