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

  function calculate() {
    var whp = parseFloat(document.getElementById('input_horsepower').value) || 400;
    var cd = parseFloat(document.getElementById('input_cd').value) || 0.32;
    var frontalAreaSqFt = parseFloat(document.getElementById('input_frontalArea').value) || 22.0;
    var rho = parseFloat(document.getElementById('input_airDensity').value) || 1.225;
    var crr = parseFloat(document.getElementById('input_rollingResistance').value) || 0.015;
    var weightLbs = parseFloat(document.getElementById('input_vehicleWeight').value) || 3500;

    var areaM2 = frontalAreaSqFt * 0.092903;
    var cdA = cd * frontalAreaSqFt;
    var massKg = weightLbs * 0.453592;
    var totalWattsAvailable = whp * 745.7;

    // Iterative binary search for top speed in m/s
    var low = 0;
    var high = 150; // ~335 mph
    var vMs = 0;

    for (var i = 0; i < 40; i++) {
      var mid = (low + high) / 2.0;
      var dragWatts = 0.5 * rho * cd * areaM2 * Math.pow(mid, 3);
      var rollingWatts = crr * massKg * 9.81 * mid;
      var totalReqWatts = dragWatts + rollingWatts;

      if (totalReqWatts > totalWattsAvailable) {
        high = mid;
      } else {
        low = mid;
      }
    }

    vMs = (low + high) / 2.0;

    var topMph = vMs * 2.23694;
    var topKmh = vMs * 3.6;

    // Power breakdown at top speed
    var finalDragWatts = 0.5 * rho * cd * areaM2 * Math.pow(vMs, 3);
    var finalRollingWatts = crr * massKg * 9.81 * vMs;

    var dragHp = finalDragWatts / 745.7;
    var rollingHp = finalRollingWatts / 745.7;

    setOutput('topSpeedMph', Math.round(topMph) + ' MPH');
    setOutput('topSpeedKmh', Math.round(topKmh) + ' km/h');
    setOutput('dragPowerHp', Math.round(dragHp) + ' whp (' + Math.round((dragHp/whp)*100) + '%)');
    setOutput('rollingPowerHp', Math.round(rollingHp) + ' whp (' + Math.round((rollingHp/whp)*100) + '%)');
    setOutput('dragAreaCdA', cdA.toFixed(2) + ' sq ft');

    updateChart(whp, cd, areaM2, rho, crr, massKg, topMph);

    if (window.logHistory) {
      window.logHistory('car-top-speed-estimator', {
        topSpeedMph: Math.round(topMph) + ' MPH',
        topSpeedKmh: Math.round(topKmh) + ' km/h',
        dragPowerHp: Math.round(dragHp) + ' whp',
        rollingPowerHp: Math.round(rollingHp) + ' whp'
      });
    }
  }

  function updateChart(whp, cd, areaM2, rho, crr, massKg, topMph) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'powerVsSpeed';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'dragVsRolling') {
      var vMs = topMph / 2.23694;
      var dragHp = (0.5 * rho * cd * areaM2 * Math.pow(vMs, 3)) / 745.7;
      var rollHp = (crr * massKg * 9.81 * vMs) / 745.7;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Aerodynamic Drag Power (whp)', 'Rolling Resistance Power (whp)'],
          datasets: [{
            data: [
              parseFloat(dragHp.toFixed(1)),
              parseFloat(rollHp.toFixed(1))
            ],
            backgroundColor: ['#D95B43', '#4A90D9']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var speedsMph = [60, 90, 120, 150, 180, 210, 240];
      var requiredHps = speedsMph.map(function(s) {
        var v = s / 2.23694;
        var dw = 0.5 * rho * cd * areaM2 * Math.pow(v, 3);
        var rw = crr * massKg * 9.81 * v;
        return Math.round((dw + rw) / 745.7);
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: speedsMph.map(function(s) { return s + ' MPH'; }),
          datasets: [{
            label: 'Required Horsepower (whp)',
            data: requiredHps,
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
    }
  }

  function reset() {
    document.getElementById('input_horsepower').value = 400;
    document.getElementById('input_cd').value = 0.32;
    document.getElementById('input_frontalArea').value = 22.0;
    document.getElementById('input_airDensity').value = 1.225;
    document.getElementById('input_rollingResistance').value = 0.015;
    document.getElementById('input_vehicleWeight').value = 3500;
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
