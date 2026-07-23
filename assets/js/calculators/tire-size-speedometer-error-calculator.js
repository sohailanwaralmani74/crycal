(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var inputs = document.querySelectorAll('#inputsArea input, #inputsArea select, .tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateTireDiameter(width, aspect, rim) {
    var sidewallMm = width * (aspect / 100.0);
    var sidewallInches = (sidewallMm * 2.0) / 25.4;
    return rim + sidewallInches;
  }

  function calculate() {
    var oWidth = parseFloat(document.getElementById('input_origWidth').value) || 225;
    var oAspect = parseFloat(document.getElementById('input_origAspect').value) || 45;
    var oRim = parseFloat(document.getElementById('input_origRim').value) || 17;

    var nWidth = parseFloat(document.getElementById('input_newWidth').value) || 245;
    var nAspect = parseFloat(document.getElementById('input_newAspect').value) || 40;
    var nRim = parseFloat(document.getElementById('input_newRim').value) || 18;

    var indicatedSpeed = parseFloat(document.getElementById('input_indicatedSpeed').value) || 65;

    var origDia = calculateTireDiameter(oWidth, oAspect, oRim);
    var newDia = calculateTireDiameter(nWidth, nAspect, nRim);

    var diffPct = ((newDia - origDia) / origDia) * 100.0;
    var actualSpeed = indicatedSpeed * (newDia / origDia);
    var speedError = actualSpeed - indicatedSpeed;

    var origRevsPerMile = 63360.0 / (Math.PI * origDia);
    var newRevsPerMile = 63360.0 / (Math.PI * newDia);
    var revsDiff = newRevsPerMile - origRevsPerMile;

    var diffSign = (diffPct >= 0) ? '+' : '';

    setOutput('origDiameter', origDia.toFixed(2) + ' Inches');
    setOutput('newDiameter', newDia.toFixed(2) + ' Inches');
    setOutput('diameterDiffPercent', diffSign + diffPct.toFixed(2) + '%');
    setOutput('actualSpeed', actualSpeed.toFixed(1) + ' MPH');
    setOutput('speedErrorMph', (speedError >= 0 ? '+' : '') + speedError.toFixed(1) + ' MPH');
    setOutput('revsPerMileDiff', (revsDiff >= 0 ? '+' : '') + Math.round(revsDiff) + ' revs/mi');

    updateChart(indicatedSpeed, actualSpeed, origDia, newDia);

    if (window.logHistory) {
      window.logHistory('tire-size-speedometer-error-calculator', {
        origDiameter: origDia.toFixed(2) + ' in',
        newDiameter: newDia.toFixed(2) + ' in',
        diameterDiffPercent: diffSign + diffPct.toFixed(2) + '%',
        actualSpeed: actualSpeed.toFixed(1) + ' MPH',
        speedErrorMph: (speedError >= 0 ? '+' : '') + speedError.toFixed(1) + ' MPH'
      });
    }
  }

  function updateChart(indicatedSpeed, actualSpeed, origDia, newDia) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'speedComparison';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'diameterComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Stock Tire Diameter', 'New Tire Diameter'],
          datasets: [{
            label: 'Diameter (Inches)',
            data: [
              parseFloat(origDia.toFixed(2)),
              parseFloat(newDia.toFixed(2))
            ],
            backgroundColor: ['#4A90D9', '#4ade80']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var speeds = [30, 45, 60, 65, 75, 90];
      var ratio = newDia / origDia;
      var actualSpeeds = speeds.map(function(s) {
        return parseFloat((s * ratio).toFixed(1));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: speeds.map(function(s) { return s + ' MPH Speedo'; }),
          datasets: [
            {
              label: 'Indicated Speed (MPH)',
              data: speeds,
              backgroundColor: '#4A90D9'
            },
            {
              label: 'Actual Ground Speed (MPH)',
              data: actualSpeeds,
              backgroundColor: '#4ade80'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_origWidth').value = 225;
    document.getElementById('input_origAspect').value = 45;
    document.getElementById('input_origRim').value = 17;
    document.getElementById('input_newWidth').value = 245;
    document.getElementById('input_newAspect').value = 40;
    document.getElementById('input_newRim').value = 18;
    document.getElementById('input_indicatedSpeed').value = 65;
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
