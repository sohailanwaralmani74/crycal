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

  function getNextLumberLength(totalFeet) {
    var standardLengths = [8, 10, 12, 14, 16, 18, 20, 22, 24];
    for (var i = 0; i < standardLengths.length; i++) {
      if (standardLengths[i] >= totalFeet) {
        return standardLengths[i] + ' Foot Board';
      }
    }
    return Math.ceil(totalFeet) + ' Foot Board';
  }

  function calculate() {
    var runFeet = parseFloat(document.getElementById('input_roofRunFeet').value) || 0;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 0;
    var ridgeThick = parseFloat(document.getElementById('input_ridgeThicknessInches').value) || 0;
    var overhangInches = parseFloat(document.getElementById('input_overhangInches').value) || 0;

    var ridgeSetbackFeet = (ridgeThick / 2) / 12;
    var adjRunFeet = runFeet - ridgeSetbackFeet;
    var riseFeet = adjRunFeet * (pitch / 12);

    var commonRafterFeet = Math.sqrt(adjRunFeet * adjRunFeet + riseFeet * riseFeet);

    var pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));
    var overhangTailFeet = (overhangInches / 12) * pitchFactor;
    var totalRafterFeet = commonRafterFeet + overhangTailFeet;

    var pitchAngle = Math.atan(pitch / 12) * (180 / Math.PI);
    var boardStock = getNextLumberLength(totalRafterFeet);

    var outCommon = document.querySelector('#output_commonRafterLength .output-number');
    var outTotal = document.querySelector('#output_totalRafterLength .output-number');
    var outAngle = document.querySelector('#output_pitchAngleDegrees .output-number');
    var outLumber = document.querySelector('#output_recommendedLumberLength .output-number');

    if (outCommon) outCommon.textContent = formatFeetInches(commonRafterFeet);
    if (outTotal) outTotal.textContent = formatFeetInches(totalRafterFeet);
    if (outAngle) outAngle.textContent = pitchAngle.toFixed(2) + '°';
    if (outLumber) outLumber.textContent = boardStock;

    updateChart(commonRafterFeet, overhangTailFeet, adjRunFeet, riseFeet);

    if (window.logHistory) {
      window.logHistory('rafter-length-calculator', {
        roofRunFeet: runFeet + ' ft',
        roofPitch: pitch + '/12',
        commonRafterLength: commonRafterFeet.toFixed(2) + ' ft',
        totalRafterLength: totalRafterFeet.toFixed(2) + ' ft',
        pitchAngleDegrees: pitchAngle.toFixed(2) + '°',
        recommendedLumberLength: boardStock
      });
    }
  }

  function updateChart(commonFeet, overhangFeet, runFeet, riseFeet) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'lengthComponents';

    var ctx = canvas.getContext('2d');
    if (tabId === 'triangleDimensions') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Roof Run (ft)', 'Roof Rise (ft)', 'Rafter Hypotenuse (ft)'],
          datasets: [{
            label: 'Feet',
            data: [
              parseFloat(runFeet.toFixed(2)),
              parseFloat(riseFeet.toFixed(2)),
              parseFloat(commonFeet.toFixed(2))
            ],
            backgroundColor: ['#4A90E2', '#C08A2E', '#2F6F5E']
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
          labels: ['Common Rafter Length (ft)', 'Overhang Tail (ft)'],
          datasets: [{
            data: [parseFloat(commonFeet.toFixed(2)), parseFloat(overhangFeet.toFixed(2))],
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
    document.getElementById('input_roofRunFeet').value = 12;
    document.getElementById('input_roofPitch').value = 6;
    document.getElementById('input_ridgeThicknessInches').value = 1.5;
    document.getElementById('input_overhangInches').value = 12;
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
