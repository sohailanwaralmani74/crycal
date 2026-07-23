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

  function getHvacPowerKw(setting) {
    switch (setting) {
      case 'off': return 0.0;
      case 'eco_ac': return 0.8;
      case 'max_ac': return 2.0;
      case 'eco_heat': return 1.8;
      case 'max_heat': return 4.5;
      default: return 0.8;
    }
  }

  function getTerrainMultiplier(terrain) {
    switch (terrain) {
      case 'flat': return 1.0;
      case 'rolling': return 0.94;
      case 'hilly': return 0.86;
      default: return 1.0;
    }
  }

  function calculate() {
    var battery = parseFloat(document.getElementById('input_usableBatteryKwh').value) || 75;
    var baseEff = parseFloat(document.getElementById('input_baseEfficiency').value) || 3.5;
    var speed = parseFloat(document.getElementById('input_avgSpeed').value) || 65;
    var temp = parseFloat(document.getElementById('input_ambientTemp').value) || 70;
    var hvac = document.getElementById('input_hvacSetting').value;
    var terrain = document.getElementById('input_terrain').value;

    // Speed penalty relative to 55 mph baseline
    var speedMultiplier = 1.0;
    if (speed > 55) {
      speedMultiplier = Math.max(0.60, 1.0 - 0.0125 * (speed - 55));
    } else if (speed < 55) {
      speedMultiplier = Math.min(1.15, 1.0 + 0.005 * (55 - speed));
    }

    // Temperature penalty relative to 70°F
    var tempMultiplier = 1.0;
    if (temp < 70) {
      tempMultiplier = Math.max(0.65, 1.0 - 0.006 * (70 - temp));
    } else if (temp > 70) {
      tempMultiplier = Math.max(0.85, 1.0 - 0.002 * (temp - 70));
    }

    var terrainMultiplier = getTerrainMultiplier(terrain);
    var hvacKw = getHvacPowerKw(hvac);

    // Compute net efficiency
    var adjustedEff = baseEff * speedMultiplier * tempMultiplier * terrainMultiplier;
    // Deduct HVAC energy rate per mile (kW / mph = kWh/mi)
    var hvacKwhPerMile = (speed > 0) ? (hvacKw / speed) : 0;
    var netWhPerMileKwh = (1.0 / Math.max(0.5, adjustedEff)) + hvacKwhPerMile;
    var finalEff = 1.0 / netWhPerMileKwh;

    var estimatedRange = battery * finalEff;

    var tempLossPct = Math.round((1.0 - tempMultiplier) * 100);
    var speedLossPct = Math.round((1.0 - speedMultiplier) * 100);

    setOutput('estimatedRange', Math.round(estimatedRange) + ' Miles');
    setOutput('adjustedEfficiency', finalEff.toFixed(2) + ' mi/kWh');
    setOutput('tempPenalty', (tempLossPct > 0 ? '-' : '') + tempLossPct + '%');
    setOutput('speedPenalty', (speedLossPct > 0 ? '-' : '') + speedLossPct + '%');
    setOutput('hvacPowerKw', hvacKw.toFixed(1) + ' kW');
    setOutput('totalEnergyConsumed', battery.toFixed(1) + ' kWh');

    updateChart(battery, baseEff, temp, hvac, terrain, speed);

    if (window.logHistory) {
      window.logHistory('ev-range-estimator', {
        estimatedRange: Math.round(estimatedRange) + ' mi',
        adjustedEfficiency: finalEff.toFixed(2) + ' mi/kWh',
        tempPenalty: tempLossPct + '%',
        speedPenalty: speedLossPct + '%'
      });
    }
  }

  function updateChart(battery, baseEff, temp, hvac, terrain, currentSpeed) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'rangeBySpeed';

    var ctx = canvas.getContext('2d');
    var hvacKw = getHvacPowerKw(hvac);
    var terrainMult = getTerrainMultiplier(terrain);

    if (activeTab === 'rangeByTemp') {
      var temps = [0, 20, 40, 60, 70, 90, 105];
      var speedMult = (currentSpeed > 55) ? Math.max(0.60, 1.0 - 0.0125 * (currentSpeed - 55)) : 1.0;

      var tempRanges = temps.map(function(t) {
        var tm = (t < 70) ? Math.max(0.65, 1.0 - 0.006 * (70 - t)) : Math.max(0.85, 1.0 - 0.002 * (t - 70));
        var eff = baseEff * speedMult * tm * terrainMult;
        var hvacExtra = (currentSpeed > 0) ? (hvacKw / currentSpeed) : 0;
        var netEff = 1.0 / ((1.0 / Math.max(0.5, eff)) + hvacExtra);
        return Math.round(battery * netEff);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: temps.map(function(t) { return t + '°F'; }),
          datasets: [{
            label: 'Estimated Range (Miles)',
            data: tempRanges,
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
      var speeds = [45, 55, 65, 70, 75, 80, 85];
      var tempMult = (temp < 70) ? Math.max(0.65, 1.0 - 0.006 * (70 - temp)) : Math.max(0.85, 1.0 - 0.002 * (temp - 70));

      var speedRanges = speeds.map(function(s) {
        var sm = (s > 55) ? Math.max(0.60, 1.0 - 0.0125 * (s - 55)) : (1.0 + 0.005 * (55 - s));
        var eff = baseEff * sm * tempMult * terrainMult;
        var hvacExtra = (s > 0) ? (hvacKw / s) : 0;
        var netEff = 1.0 / ((1.0 / Math.max(0.5, eff)) + hvacExtra);
        return Math.round(battery * netEff);
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: speeds.map(function(s) { return s + ' mph'; }),
          datasets: [{
            label: 'Estimated Range (Miles)',
            data: speedRanges,
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
    document.getElementById('input_usableBatteryKwh').value = 75;
    document.getElementById('input_baseEfficiency').value = 3.5;
    document.getElementById('input_avgSpeed').value = 65;
    document.getElementById('input_ambientTemp').value = 70;
    document.getElementById('input_hvacSetting').value = 'eco_ac';
    document.getElementById('input_terrain').value = 'flat';
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
