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
    var hp = parseFloat(document.getElementById('input_horsepower').value) || 450;
    var weight = parseFloat(document.getElementById('input_vehicleWeight').value) || 3500;
    var drivetrain = document.getElementById('input_drivetrain').value;

    var lbsPerHp = weight / Math.max(10, hp);

    var driveMult = (drivetrain === 'awd') ? 0.94 : (drivetrain === 'fwd') ? 1.06 : 1.0;

    // Hale's Formula: ET = 5.825 * (W/HP)^(1/3)
    var baseEt = 5.825 * Math.pow(lbsPerHp, 0.3333);
    var quarterEt = Math.max(7.5, baseEt * driveMult);

    // Trap speed: 234 * (HP/W)^(1/3)
    var trapSpeed = 234.0 * Math.pow((hp / weight), 0.3333);

    var eighthEt = quarterEt * 0.64;
    var eighthSpeed = trapSpeed * 0.80;

    setOutput('quarterMileEt', quarterEt.toFixed(2) + ' Seconds');
    setOutput('trapSpeedMph', trapSpeed.toFixed(1) + ' MPH');
    setOutput('eighthMileEt', eighthEt.toFixed(2) + ' Seconds');
    setOutput('eighthMileSpeed', eighthSpeed.toFixed(1) + ' MPH');
    setOutput('weightToHp', lbsPerHp.toFixed(2) + ' lbs / hp');

    updateChart(weight, driveMult, quarterEt, trapSpeed);

    if (window.logHistory) {
      window.logHistory('quarter-mile-time-estimator', {
        quarterMileEt: quarterEt.toFixed(2) + ' s',
        trapSpeedMph: trapSpeed.toFixed(1) + ' MPH',
        eighthMileEt: eighthEt.toFixed(2) + ' s',
        eighthMileSpeed: eighthSpeed.toFixed(1) + ' MPH'
      });
    }
  }

  function updateChart(weight, driveMult, currentEt, currentSpeed) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'dragTrajectory';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'etByHorsepower') {
      var hpList = [200, 300, 400, 500, 600, 750, 1000];
      var etList = hpList.map(function(h) {
        var lbs = weight / h;
        var et = 5.825 * Math.pow(lbs, 0.3333) * driveMult;
        return parseFloat(Math.max(7.5, et).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: hpList.map(function(h) { return h + ' hp'; }),
          datasets: [{
            label: '1/4 Mile ET (Seconds)',
            data: etList,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
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
      var markers = ['60 ft', '330 ft', '1/8 Mile (660ft)', '1000 ft', '1/4 Mile (1320ft)'];
      var speedTrajectory = [
        parseFloat((currentSpeed * 0.35).toFixed(1)),
        parseFloat((currentSpeed * 0.62).toFixed(1)),
        parseFloat((currentSpeed * 0.80).toFixed(1)),
        parseFloat((currentSpeed * 0.92).toFixed(1)),
        parseFloat(currentSpeed.toFixed(1))
      ];

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: markers,
          datasets: [{
            label: 'Speed (MPH)',
            data: speedTrajectory,
            backgroundColor: '#4ade80'
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
    document.getElementById('input_horsepower').value = 450;
    document.getElementById('input_vehicleWeight').value = 3500;
    document.getElementById('input_drivetrain').value = 'rwd';
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
