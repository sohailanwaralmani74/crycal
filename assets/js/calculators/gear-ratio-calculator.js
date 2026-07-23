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
    var gear = parseFloat(document.getElementById('input_gearRatio').value) || 0.82;
    var finalDrive = parseFloat(document.getElementById('input_finalDrive').value) || 3.73;
    var tireDia = parseFloat(document.getElementById('input_tireDiameter').value) || 26.5;
    var speed = parseFloat(document.getElementById('input_vehicleSpeed').value) || 70;

    var overallRatio = gear * finalDrive;

    // RPM = (MPH * overallRatio * 336.135) / tireDia
    var rpm = (speed * overallRatio * 336.135) / Math.max(1.0, tireDia);

    // Speed at 2000 RPM, 3000 RPM, 6500 RPM
    var speed2000 = (2000.0 * tireDia) / (overallRatio * 336.135);
    var speed3000 = (3000.0 * tireDia) / (overallRatio * 336.135);
    var speedRedline = (6500.0 * tireDia) / (overallRatio * 336.135);

    setOutput('engineRpm', Math.round(rpm).toLocaleString() + ' RPM');
    setOutput('overallRatio', overallRatio.toFixed(2) + ' : 1');
    setOutput('speedAt2000Rpm', Math.round(speed2000) + ' MPH');
    setOutput('speedAt3000Rpm', Math.round(speed3000) + ' MPH');
    setOutput('speedAtRedline', Math.round(speedRedline) + ' MPH');

    updateChart(overallRatio, tireDia, gear, finalDrive);

    if (window.logHistory) {
      window.logHistory('gear-ratio-calculator', {
        engineRpm: Math.round(rpm) + ' RPM',
        overallRatio: overallRatio.toFixed(2) + ':1',
        speedAt2000Rpm: Math.round(speed2000) + ' MPH',
        speedAt3000Rpm: Math.round(speed3000) + ' MPH'
      });
    }
  }

  function updateChart(overallRatio, tireDia, gearRatio, finalDrive) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'rpmVsSpeed';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'gearShiftSpeed') {
      var gearRatios = [3.82, 2.36, 1.68, 1.25, 0.98, gearRatio];
      var gearLabels = ['1st', '2nd', '3rd', '4th', '5th', 'Selected Gear'];
      var maxSpeedsAt6500 = gearRatios.map(function(g) {
        var tot = g * finalDrive;
        return Math.round((6500.0 * tireDia) / (tot * 336.135));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: gearLabels,
          datasets: [{
            label: 'Max Speed at 6,500 RPM (MPH)',
            data: maxSpeedsAt6500,
            backgroundColor: '#4A90D9'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var speeds = [30, 45, 60, 70, 80, 90, 100];
      var rpms = speeds.map(function(s) {
        return Math.round((s * overallRatio * 336.135) / tireDia);
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: speeds.map(function(s) { return s + ' MPH'; }),
          datasets: [{
            label: 'Engine RPM',
            data: rpms,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.15)',
            fill: true,
            tension: 0.2
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
    document.getElementById('input_gearRatio').value = 0.82;
    document.getElementById('input_finalDrive').value = 3.73;
    document.getElementById('input_tireDiameter').value = 26.5;
    document.getElementById('input_vehicleSpeed').value = 70;
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
