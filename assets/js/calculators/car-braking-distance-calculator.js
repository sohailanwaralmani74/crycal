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

  function getMuValue(key) {
    switch (key) {
      case 'wet_asphalt_0.5': return 0.5;
      case 'packed_snow_0.2': return 0.2;
      case 'glare_ice_0.1': return 0.1;
      case 'dry_asphalt_0.8':
      default: return 0.8;
    }
  }

  function calculate() {
    var speedMph = parseFloat(document.getElementById('input_speedMph').value) || 60;
    var muKey = document.getElementById('input_frictionCoeff').value;
    var reactionSec = parseFloat(document.getElementById('input_reactionTime').value) || 1.5;
    var gradePct = parseFloat(document.getElementById('input_roadGrade').value) || 0;

    var mu = getMuValue(muKey);
    var gradeDec = gradePct / 100.0;

    var speedFps = speedMph * 1.46667;
    var reactionDistFt = speedFps * reactionSec;

    var netMu = Math.max(0.05, mu + gradeDec);
    var brakingDistFt = (speedMph * speedMph) / (30.0 * netMu);

    var totalStoppingFt = reactionDistFt + brakingDistFt;
    var totalStoppingMeters = totalStoppingFt * 0.3048;

    // Deceleration time: t_brake = v / (g * mu)
    var decelTime = (speedFps) / (32.174 * netMu);
    var totalStoppingTimeSec = reactionSec + decelTime;

    setOutput('reactionDistance', Math.round(reactionDistFt) + ' Feet');
    setOutput('brakingDistance', Math.round(brakingDistFt) + ' Feet');
    setOutput('totalStoppingDistance', Math.round(totalStoppingFt) + ' Feet');
    setOutput('stoppingDistanceMeters', totalStoppingMeters.toFixed(1) + ' Meters');
    setOutput('stoppingTimeSeconds', totalStoppingTimeSec.toFixed(1) + ' Seconds');

    updateChart(reactionDistFt, brakingDistFt, speedMph, netMu, reactionSec);

    if (window.logHistory) {
      window.logHistory('car-braking-distance-calculator', {
        reactionDistance: Math.round(reactionDistFt) + ' ft',
        brakingDistance: Math.round(brakingDistFt) + ' ft',
        totalStoppingDistance: Math.round(totalStoppingFt) + ' ft',
        stoppingTimeSeconds: totalStoppingTimeSec.toFixed(1) + ' s'
      });
    }
  }

  function updateChart(reactionDistFt, brakingDistFt, currentSpeed, netMu, reactionSec) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'distanceSplit';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'distanceBySpeed') {
      var speeds = [20, 30, 40, 50, 60, 70, 80];
      var totalDists = speeds.map(function(s) {
        var rDist = s * 1.46667 * reactionSec;
        var bDist = (s * s) / (30.0 * netMu);
        return Math.round(rDist + bDist);
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: speeds.map(function(s) { return s + ' MPH'; }),
          datasets: [{
            label: 'Total Stopping Distance (Feet)',
            data: totalDists,
            borderColor: '#D95B43',
            backgroundColor: 'rgba(217, 91, 67, 0.15)',
            fill: true,
            tension: 0.3
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
          labels: ['Current Speed (' + currentSpeed + ' MPH)'],
          datasets: [
            {
              label: 'Perception-Reaction Distance (ft)',
              data: [Math.round(reactionDistFt)],
              backgroundColor: '#4A90D9'
            },
            {
              label: 'Physical Braking Distance (ft)',
              data: [Math.round(brakingDistFt)],
              backgroundColor: '#D95B43'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_speedMph').value = 60;
    document.getElementById('input_frictionCoeff').value = 'dry_asphalt_0.8';
    document.getElementById('input_reactionTime').value = 1.5;
    document.getElementById('input_roadGrade').value = 0;
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
