(function() {
  'use strict';

  var chartInstance = null;

  // Inner diameters for standard trade sizes (in inches)
  var INNER_DIAMETERS = {
    pex: { '1/2"': 0.475, '3/4"': 0.671, '1"': 0.862, '1-1/4"': 1.054, '1-1/2"': 1.244 },
    copper: { '1/2"': 0.527, '3/4"': 0.745, '1"': 0.995, '1-1/4"': 1.245, '1-1/2"': 1.481 },
    cpvc: { '1/2"': 0.489, '3/4"': 0.715, '1"': 0.921, '1-1/4"': 1.155, '1-1/2"': 1.362 }
  };

  function wsfuToGPM(wsfu, systemType) {
    if (systemType === 'flush_valve') {
      if (wsfu <= 10) return 15 + (wsfu * 1.5);
      if (wsfu <= 30) return 30 + (wsfu * 0.8);
      return 54 + (wsfu * 0.4);
    } else {
      if (wsfu <= 5) return 3 + (wsfu * 0.8);
      if (wsfu <= 20) return 5 + (wsfu * 0.75);
      if (wsfu <= 50) return 15 + (wsfu * 0.45);
      return 30 + (wsfu * 0.3);
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

    calculate();
  }

  function calculate() {
    var wsfu = parseFloat(document.getElementById('input_fixtureUnits').value) || 18;
    var material = document.getElementById('input_pipeMaterial').value || 'pex';
    var maxVelocity = parseFloat(document.getElementById('input_maxAllowedVelocity').value) || 8.0;
    var systemType = document.getElementById('input_systemType').value || 'flush_tank';

    var gpm = wsfuToGPM(wsfu, systemType);
    var sizes = ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"'];
    var matSizes = INNER_DIAMETERS[material] || INNER_DIAMETERS.pex;

    var selectedSize = sizes[sizes.length - 1];
    var actualVelocity = 0;

    for (var i = 0; i < sizes.length; i++) {
      var sz = sizes[i];
      var d = matSizes[sz];
      var vel = (0.408 * gpm) / (d * d);
      if (vel <= maxVelocity) {
        selectedSize = sz;
        actualVelocity = vel;
        break;
      }
    }

    if (actualVelocity === 0) {
      var dLast = matSizes[sizes[sizes.length - 1]];
      actualVelocity = (0.408 * gpm) / (dLast * dLast);
    }

    var compliance = (actualVelocity <= maxVelocity) ? 'Pass (Velocity <= ' + maxVelocity + ' FPS)' : 'Warning (Exceeds ' + maxVelocity + ' FPS Limit)';

    var outGPM = document.querySelector('#output_calculatedFlowGPM .output-number');
    var outSize = document.querySelector('#output_recommendedPipeSize .output-number');
    var outVel = document.querySelector('#output_actualVelocityFPS .output-number');
    var outComp = document.querySelector('#output_velocityCompliance .output-number');

    if (outGPM) outGPM.textContent = gpm.toFixed(1) + ' GPM';
    if (outSize) outSize.textContent = selectedSize + ' Nominal ' + material.toUpperCase();
    if (outVel) outVel.textContent = actualVelocity.toFixed(2) + ' FPS';
    if (outComp) outComp.textContent = compliance;

    updateChart(wsfu, gpm, selectedSize, actualVelocity, maxVelocity);

    if (window.logHistory) {
      window.logHistory('pipe-sizing-calculator', {
        fixtureUnits: wsfu + ' WSFU',
        calculatedFlowGPM: gpm.toFixed(1) + ' GPM',
        recommendedPipeSize: selectedSize,
        actualVelocityFPS: actualVelocity.toFixed(2) + ' FPS'
      });
    }
  }

  function updateChart(wsfu, gpm, selectedSize, actualVelocity, maxVelocity) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'flowVsVelocity';

    var ctx = canvas.getContext('2d');
    if (tabId === 'wsfuToGpmCurve') {
      var wsfuPts = [5, 10, 15, 20, 30, 40, 50, 75, 100];
      var gpmPts = wsfuPts.map(function(w) { return parseFloat(wsfuToGPM(w, 'flush_tank').toFixed(1)); });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: wsfuPts.map(function(w) { return w + ' WSFU'; }),
          datasets: [{
            label: "Hunter's Demand Curve (GPM)",
            data: gpmPts,
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.3
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
          labels: ['Calculated Water Velocity (FPS)', 'Maximum Allowed Limit (FPS)'],
          datasets: [{
            label: 'Fluid Velocity (FPS)',
            data: [parseFloat(actualVelocity.toFixed(2)), maxVelocity],
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
    document.getElementById('input_fixtureUnits').value = 18;
    document.getElementById('input_pipeMaterial').value = "pex";
    document.getElementById('input_maxAllowedVelocity').value = 8.0;
    document.getElementById('input_systemType').value = "flush_tank";
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
