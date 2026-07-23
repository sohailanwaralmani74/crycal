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
    var riseInches = parseFloat(document.getElementById('input_roofRiseInches').value) || 0;
    var runFeet = parseFloat(document.getElementById('input_roofRunFeet').value) || 0;
    var footprintArea = parseFloat(document.getElementById('input_footprintAreaSqFt').value) || 0;

    var pitchVal = runFeet > 0 ? (riseInches / runFeet) : 0;
    var pitchAngle = Math.atan(pitchVal / 12) * (180 / Math.PI);
    var multiplier = Math.sqrt(1 + Math.pow(pitchVal / 12, 2));

    var riseFeet = riseInches / 12;
    var diagonalSlopeFeet = runFeet * multiplier;
    var slopedArea = footprintArea * multiplier;

    var outPitch = document.querySelector('#output_pitchRatio .output-number');
    var outAngle = document.querySelector('#output_pitchAngle .output-number');
    var outMult = document.querySelector('#output_multiplierFactor .output-number');
    var outArea = document.querySelector('#output_slopedRoofArea .output-number');

    if (outPitch) outPitch.textContent = pitchVal.toFixed(1) + ' / 12';
    if (outAngle) outAngle.textContent = pitchAngle.toFixed(2) + '°';
    if (outMult) outMult.textContent = multiplier.toFixed(4);
    if (outArea) outArea.textContent = slopedArea.toFixed(1) + ' sq ft';

    updateChart(riseFeet, runFeet, diagonalSlopeFeet, footprintArea, slopedArea);

    if (window.logHistory) {
      window.logHistory('roof-pitch-calculator', {
        roofRiseInches: riseInches + ' in',
        roofRunFeet: runFeet + ' ft',
        pitchRatio: pitchVal.toFixed(1) + '/12',
        pitchAngle: pitchAngle.toFixed(2) + '°',
        multiplierFactor: multiplier.toFixed(4),
        slopedRoofArea: slopedArea.toFixed(1) + ' sq ft'
      });
    }
  }

  function updateChart(riseFeet, runFeet, diagonalFeet, footprintArea, slopedArea) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'pitchComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'areaMultiplier') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Flat Footprint Area (sq ft)', 'Sloped Roof Area (sq ft)'],
          datasets: [{
            label: 'Square Footage',
            data: [parseFloat(footprintArea.toFixed(1)), parseFloat(slopedArea.toFixed(1))],
            backgroundColor: ['#4A90E2', '#2F6F5E']
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
        type: 'bar',
        data: {
          labels: ['Rise (ft)', 'Run (ft)', 'Diagonal Slope (ft)'],
          datasets: [{
            label: 'Feet',
            data: [
              parseFloat(riseFeet.toFixed(2)),
              parseFloat(runFeet.toFixed(2)),
              parseFloat(diagonalFeet.toFixed(2))
            ],
            backgroundColor: ['#C08A2E', '#4A90E2', '#2F6F5E']
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
    document.getElementById('input_roofRiseInches').value = 72;
    document.getElementById('input_roofRunFeet').value = 12;
    document.getElementById('input_footprintAreaSqFt').value = 1200;
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
