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
    var rise = parseFloat(document.getElementById('input_riseInches').value) || 6;
    var bWidth = parseFloat(document.getElementById('input_buildingWidth').value) || 30;
    var bLength = parseFloat(document.getElementById('input_buildingLength').value) || 40;
    var overhang = parseFloat(document.getElementById('input_overhangInches').value) || 12;

    var angleRad = Math.atan(rise / 12);
    var angleDeg = angleRad * (180 / Math.PI);
    var multiplier = Math.sqrt(1 + Math.pow(rise / 12, 2));

    var overhangFt = overhang / 12;
    var totalWidth = bWidth + (2 * overhangFt);
    var totalLength = bLength + (2 * overhangFt);

    var footprintArea = totalWidth * totalLength;
    var actualRoofArea = footprintArea * multiplier;

    var pitchRatioStr = rise.toString() + ' / 12';

    var outRatio = document.querySelector('#output_pitchRatio .output-number');
    var outAngle = document.querySelector('#output_angleDegrees .output-number');
    var outMult = document.querySelector('#output_slopeMultiplier .output-number');
    var outArea = document.querySelector('#output_actualRoofArea .output-number');

    if (outRatio) outRatio.textContent = pitchRatioStr;
    if (outAngle) outAngle.textContent = angleDeg.toFixed(2) + '°';
    if (outMult) outMult.textContent = multiplier.toFixed(3);
    if (outArea) outArea.textContent = Math.round(actualRoofArea).toLocaleString() + ' sq ft';

    updateChart(rise, footprintArea, actualRoofArea);

    if (window.logHistory) {
      window.logHistory('roof-pitch-angle-calculator', {
        riseInches: rise + '" rise',
        pitchRatio: pitchRatioStr,
        angleDegrees: angleDeg.toFixed(2) + '°',
        slopeMultiplier: multiplier.toFixed(3),
        actualRoofArea: Math.round(actualRoofArea) + ' sq ft'
      });
    }
  }

  function updateChart(currentRise, footprintArea, actualRoofArea) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'pitchAngleChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'areaVsFootprint') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Flat Footprint Area (with Overhang)', 'Pitch-Adjusted Roof Area'],
          datasets: [{
            label: 'Area (Sq Ft)',
            data: [Math.round(footprintArea), Math.round(actualRoofArea)],
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
      var rises = [2, 4, 6, 8, 10, 12];
      var angles = rises.map(function(r) {
        return parseFloat((Math.atan(r / 12) * (180 / Math.PI)).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2/12', '4/12', '6/12', '8/12', '10/12', '12/12'],
          datasets: [{
            label: 'Slope Angle (Degrees)',
            data: angles,
            borderColor: '#4A90E2',
            backgroundColor: 'rgba(74, 144, 226, 0.1)',
            fill: true,
            tension: 0.3
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
    document.getElementById('input_riseInches').value = 6;
    document.getElementById('input_buildingWidth').value = 30;
    document.getElementById('input_buildingLength').value = 40;
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
