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

  function formatTime(decimalHours) {
    var totalMins = Math.round(decimalHours * 60);
    var hrs = Math.floor(totalMins / 60);
    var mins = totalMins % 60;
    if (hrs === 0) return mins + ' Mins';
    return hrs + ' Hrs ' + (mins < 10 ? '0' : '') + mins + ' Mins';
  }

  function calculate() {
    var capacity = parseFloat(document.getElementById('input_batteryCapacity').value) || 80;
    var startSoc = parseFloat(document.getElementById('input_startSoc').value) || 10;
    var targetSoc = parseFloat(document.getElementById('input_targetSoc').value) || 80;
    var chargerPower = parseFloat(document.getElementById('input_chargerPowerKw').value) || 11.5;
    var maxAcceptance = parseFloat(document.getElementById('input_maxVehicleAcceptanceKw').value) || 150;
    var level = document.getElementById('input_chargingLevel').value;
    var effPercent = parseFloat(document.getElementById('input_efficiency').value) || 90;

    if (targetSoc < startSoc) targetSoc = startSoc;
    var eff = effPercent / 100.0;

    var bottleneckKw = Math.min(chargerPower, maxAcceptance);
    var effectiveKw = bottleneckKw * eff;

    var socDiff = (targetSoc - startSoc) / 100.0;
    var kwhDelivered = capacity * socDiff;

    // Apply taper factor for DC Fast when charging above 80%
    var taperFactor = 1.0;
    if (level === 'dc_fast' && targetSoc > 80) {
      var portionAbove80 = (targetSoc - Math.max(80, startSoc)) / (targetSoc - startSoc);
      taperFactor += portionAbove80 * 0.45;
    }

    var decimalHours = (effectiveKw > 0) ? ((kwhDelivered / effectiveKw) * taperFactor) : 0;
    var rangeAddedPerHour = effectiveKw * 3.5; // Average 3.5 mi/kWh

    setOutput('effectivePowerKw', effectiveKw.toFixed(1) + ' kW');
    setOutput('chargingTimeHours', decimalHours.toFixed(2) + ' Hours');
    setOutput('chargingTimeFormatted', formatTime(decimalHours));
    setOutput('rangeAddedPerHour', Math.round(rangeAddedPerHour) + ' mi / hr');
    setOutput('kwhDelivered', kwhDelivered.toFixed(1) + ' kWh');

    updateChart(capacity, startSoc, targetSoc, maxAcceptance, eff, decimalHours);

    if (window.logHistory) {
      window.logHistory('ev-charging-time-calculator', {
        effectivePowerKw: effectiveKw.toFixed(1) + ' kW',
        chargingTimeFormatted: formatTime(decimalHours),
        rangeAddedPerHour: Math.round(rangeAddedPerHour) + ' mi/hr',
        kwhDelivered: kwhDelivered.toFixed(1) + ' kWh'
      });
    }
  }

  function updateChart(capacity, startSoc, targetSoc, maxAcceptance, eff, currentDuration) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'levelComparison';

    var ctx = canvas.getContext('2d');
    var kwhDelivered = capacity * ((targetSoc - startSoc) / 100.0);

    if (activeTab === 'rangePerHour') {
      var powers = [1.4, 7.6, 11.5, 50, 150, 250];
      var labels = ['L1 1.4kW', 'L2 7.6kW', 'L2 11.5kW', 'DC 50kW', 'DC 150kW', 'DC 250kW'];
      var rates = powers.map(function(p) {
        var effPower = Math.min(p, maxAcceptance) * eff;
        return Math.round(effPower * 3.5);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Range Added per Hour (mi/hr)',
            data: rates,
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
      var l1Hrs = (kwhDelivered / (1.44 * eff));
      var l2Hrs = (kwhDelivered / (Math.min(11.52, maxAcceptance) * eff));
      var dcHrs = (kwhDelivered / (Math.min(150, maxAcceptance) * eff));

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Level 1 (120V / 1.4kW)', 'Level 2 (240V / 11.5kW)', 'DC Fast (150kW)'],
          datasets: [{
            label: 'Duration (Hours)',
            data: [
              parseFloat(l1Hrs.toFixed(1)),
              parseFloat(l2Hrs.toFixed(2)),
              parseFloat(dcHrs.toFixed(2))
            ],
            backgroundColor: ['#D95B43', '#fbbf24', '#4ade80']
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
    document.getElementById('input_batteryCapacity').value = 80;
    document.getElementById('input_startSoc').value = 10;
    document.getElementById('input_targetSoc').value = 80;
    document.getElementById('input_chargerPowerKw').value = 11.5;
    document.getElementById('input_maxVehicleAcceptanceKw').value = 150;
    document.getElementById('input_chargingLevel').value = 'level2_240v';
    document.getElementById('input_efficiency').value = 90;
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
