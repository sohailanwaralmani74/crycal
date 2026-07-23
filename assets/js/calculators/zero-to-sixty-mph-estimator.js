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

  function getPerformanceCategory(seconds) {
    if (seconds <= 2.5) return '🏎️ Hypercar / Electric Beast';
    if (seconds <= 3.5) return '🔥 Supercar Performance';
    if (seconds <= 4.5) return '🚀 High-Performance Sports Car';
    if (seconds <= 6.0) return '⚡ Sporty / Performance Daily';
    if (seconds <= 8.0) return '🚘 Average Passenger Vehicle';
    return '🐢 Economy / Heavy Utility';
  }

  function calculate() {
    var hp = parseFloat(document.getElementById('input_horsepower').value) || 350;
    var weight = parseFloat(document.getElementById('input_curbWeight').value) || 3400;
    var drivetrain = document.getElementById('input_drivetrain').value;
    var transmission = document.getElementById('input_transmission').value;
    var tireGrip = document.getElementById('input_tireGrip').value;

    var lbsPerHp = weight / Math.max(10, hp);
    var hpPerTon = (hp / (weight / 2000.0));

    var driveMult = (drivetrain === 'awd') ? 0.88 : (drivetrain === 'fwd') ? 1.12 : 1.0;
    var transMult = (transmission === 'ev_direct') ? 0.88 : (transmission === 'dct') ? 0.93 : (transmission === 'manual') ? 1.06 : 1.0;
    var tireMult = (tireGrip === 'drag_radial') ? 0.88 : (tireGrip === 'street') ? 1.08 : 1.0;

    var baseTime = 13.8 * Math.pow(lbsPerHp, 0.62);
    var estimatedTime = Math.max(1.8, baseTime * driveMult * transMult * tireMult);

    // Peak G force approx: v / (t * g) = 26.82 m/s / (t * 9.81)
    var peakG = Math.min(1.8, (26.82 / (estimatedTime * 9.81)) * 1.35);

    var categoryText = getPerformanceCategory(estimatedTime);

    setOutput('zeroToSixty', estimatedTime.toFixed(1) + ' Seconds');
    setOutput('powerToWeightRatio', Math.round(hpPerTon) + ' hp / US Ton');
    setOutput('weightToPowerRatio', lbsPerHp.toFixed(2) + ' lbs / hp');
    setOutput('launchGForce', peakG.toFixed(2) + ' G');
    setOutput('performanceCategory', categoryText);

    updateChart(weight, drivetrain, transmission, tireGrip, hp);

    if (window.logHistory) {
      window.logHistory('zero-to-sixty-mph-estimator', {
        zeroToSixty: estimatedTime.toFixed(1) + ' s',
        powerToWeightRatio: Math.round(hpPerTon) + ' hp/ton',
        weightToPowerRatio: lbsPerHp.toFixed(2) + ' lbs/hp',
        performanceCategory: categoryText
      });
    }
  }

  function updateChart(weight, drivetrain, transmission, tireGrip, currentHp) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'hpVsTime';

    var ctx = canvas.getContext('2d');

    var driveMult = (drivetrain === 'awd') ? 0.88 : (drivetrain === 'fwd') ? 1.12 : 1.0;
    var transMult = (transmission === 'ev_direct') ? 0.88 : (transmission === 'dct') ? 0.93 : (transmission === 'manual') ? 1.06 : 1.0;
    var tireMult = (tireGrip === 'drag_radial') ? 0.88 : (tireGrip === 'street') ? 1.08 : 1.0;

    if (activeTab === 'drivetrainCompare') {
      var dTypes = ['fwd', 'rwd', 'awd'];
      var dLabels = ['Front-Wheel Drive (FWD)', 'Rear-Wheel Drive (RWD)', 'All-Wheel Drive (AWD)'];
      var times = dTypes.map(function(d) {
        var dm = (d === 'awd') ? 0.88 : (d === 'fwd') ? 1.12 : 1.0;
        var lbs = weight / Math.max(10, currentHp);
        var bt = 13.8 * Math.pow(lbs, 0.62);
        return parseFloat(Math.max(1.8, bt * dm * transMult * tireMult).toFixed(1));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dLabels,
          datasets: [{
            label: '0-60 mph Time (Seconds)',
            data: times,
            backgroundColor: ['#D95B43', '#fbbf24', '#4ade80']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var hpLevels = [150, 250, 350, 450, 600, 800, 1000];
      var hpTimes = hpLevels.map(function(h) {
        var lbs = weight / h;
        var bt = 13.8 * Math.pow(lbs, 0.62);
        return parseFloat(Math.max(1.8, bt * driveMult * transMult * tireMult).toFixed(1));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: hpLevels.map(function(h) { return h + ' hp'; }),
          datasets: [{
            label: '0-60 mph Time (Seconds)',
            data: hpTimes,
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
    }
  }

  function reset() {
    document.getElementById('input_horsepower').value = 350;
    document.getElementById('input_curbWeight').value = 3400;
    document.getElementById('input_drivetrain').value = 'rwd';
    document.getElementById('input_transmission').value = 'dct';
    document.getElementById('input_tireGrip').value = 'performance';
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
