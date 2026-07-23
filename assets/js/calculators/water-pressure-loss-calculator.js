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
    var d = parseFloat(document.getElementById('input_pipeDiameterInches').value) || 0.745;
    var C = parseFloat(document.getElementById('input_pipeMaterial').value) || 150;
    var Q = parseFloat(document.getElementById('input_flowRateGPM').value) || 10;
    var lengthFt = parseFloat(document.getElementById('input_totalPipeLengthFt').value) || 100;
    var elevFt = parseFloat(document.getElementById('input_elevationChangeFt').value) || 0;
    var supplyPSI = parseFloat(document.getElementById('input_supplyPressurePSI').value) || 50;

    // Hazen-Williams friction loss per 100 ft
    var p100 = 4.52 * (Math.pow(Q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.8655)));
    var frictionLoss = p100 * (lengthFt / 100);

    // Elevation loss/gain
    var elevationLoss = 0.433 * elevFt;

    var totalLoss = frictionLoss + elevationLoss;
    var residualPSI = supplyPSI - totalLoss;

    var outFriction = document.querySelector('#output_frictionLossPSI .output-number');
    var outElev = document.querySelector('#output_elevationLossPSI .output-number');
    var outNet = document.querySelector('#output_netPressureDropPSI .output-number');
    var outResidual = document.querySelector('#output_residualPressurePSI .output-number');

    if (outFriction) outFriction.textContent = frictionLoss.toFixed(2) + ' PSI';
    if (outElev) outElev.textContent = elevationLoss.toFixed(2) + ' PSI (' + (elevFt >= 0 ? 'Loss' : 'Gain') + ')';
    if (outNet) outNet.textContent = totalLoss.toFixed(2) + ' PSI';
    if (outResidual) outResidual.textContent = residualPSI.toFixed(1) + ' PSI Residual';

    updateChart(lengthFt, Q, C, d, supplyPSI, elevationLoss);

    if (window.logHistory) {
      window.logHistory('water-pressure-loss-calculator', {
        flowRateGPM: Q + ' GPM',
        totalPipeLengthFt: lengthFt + ' ft',
        frictionLossPSI: frictionLoss.toFixed(2) + ' PSI',
        residualPressurePSI: residualPSI.toFixed(1) + ' PSI'
      });
    }
  }

  function updateChart(lengthFt, Q, C, d, supplyPSI, elevationLoss) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'frictionVsDistance';

    var ctx = canvas.getContext('2d');
    if (tabId === 'flowVsFrictionDrop') {
      var gpms = [2, 5, 8, 10, 12, 15, 20];
      var dropsAtGPM = gpms.map(function(g) {
        var p100_g = 4.52 * (Math.pow(g, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.8655)));
        return parseFloat((p100_g * (lengthFt / 100)).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: gpms.map(function(g) { return g + ' GPM'; }),
          datasets: [{
            label: 'Friction Pressure Drop (PSI)',
            data: dropsAtGPM,
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
      var distances = [25, 50, 75, 100, 150, 200];
      var residualAtDist = distances.map(function(dist) {
        var p100_d = 4.52 * (Math.pow(Q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.8655)));
        var fLoss = p100_d * (dist / 100);
        return parseFloat(Math.max(0, supplyPSI - fLoss - elevationLoss).toFixed(1));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: distances.map(function(dist) { return dist + ' ft'; }),
          datasets: [{
            label: 'Residual Outlet Pressure (PSI)',
            data: residualAtDist,
            borderColor: '#C08A2E',
            backgroundColor: 'rgba(192, 138, 46, 0.1)',
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
    document.getElementById('input_pipeDiameterInches').value = "0.745";
    document.getElementById('input_pipeMaterial').value = "150";
    document.getElementById('input_flowRateGPM').value = 10;
    document.getElementById('input_totalPipeLengthFt').value = 100;
    document.getElementById('input_elevationChangeFt').value = 20;
    document.getElementById('input_supplyPressurePSI').value = 50;
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
