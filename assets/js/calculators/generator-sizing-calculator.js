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
    var fridgeCount = parseInt(document.getElementById('input_refrigeratorCount').value, 10) || 0;
    var sumpHP = parseFloat(document.getElementById('input_sumpPumpHorsepower').value) || 0;
    var wellHP = parseFloat(document.getElementById('input_wellPumpHorsepower').value) || 0;
    var acTons = parseFloat(document.getElementById('input_centralAirTons').value) || 0;
    var heatType = document.getElementById('input_heatingAppliance').value || 'gas_furnace';
    var genW = parseFloat(document.getElementById('input_lightingElectronicsWatts').value) || 2000;
    var waterW = parseFloat(document.getElementById('input_waterHeaterWatts').value) || 0;
    var margin = parseFloat(document.getElementById('input_safetyMarginPercent').value) || 20;

    var runW = 0;
    var maxSurgeDelta = 0;

    // Refrigerators
    var fridgeRun = fridgeCount * 700;
    var fridgeSurgeDelta = fridgeCount > 0 ? 1500 : 0;
    runW += fridgeRun;
    if (fridgeSurgeDelta > maxSurgeDelta) maxSurgeDelta = fridgeSurgeDelta;

    // Sump pump
    var sumpRun = 0;
    var sumpSurgeDelta = 0;
    if (sumpHP === 0.33) { sumpRun = 800; sumpSurgeDelta = 800; }
    else if (sumpHP === 0.5) { sumpRun = 1050; sumpSurgeDelta = 1100; }
    else if (sumpHP === 1.0) { sumpRun = 1500; sumpSurgeDelta = 1500; }
    runW += sumpRun;
    if (sumpSurgeDelta > maxSurgeDelta) maxSurgeDelta = sumpSurgeDelta;

    // Well pump
    var wellRun = 0;
    var wellSurgeDelta = 0;
    if (wellHP === 0.5) { wellRun = 1000; wellSurgeDelta = 1100; }
    else if (wellHP === 1.0) { wellRun = 1500; wellSurgeDelta = 1500; }
    else if (wellHP === 1.5) { wellRun = 2100; wellSurgeDelta = 1900; }
    runW += wellRun;
    if (wellSurgeDelta > maxSurgeDelta) maxSurgeDelta = wellSurgeDelta;

    // Central AC
    var acRun = 0;
    var acSurgeDelta = 0;
    if (acTons === 2.5) { acRun = 3500; acSurgeDelta = 6000; }
    else if (acTons === 3.5) { acRun = 5000; acSurgeDelta = 8500; }
    else if (acTons === 5.0) { acRun = 7000; acSurgeDelta = 11000; }
    runW += acRun;
    if (acSurgeDelta > maxSurgeDelta) maxSurgeDelta = acSurgeDelta;

    // Heating
    var heatRun = 0;
    var heatSurgeDelta = 0;
    if (heatType === 'gas_furnace') { heatRun = 800; heatSurgeDelta = 1200; }
    else if (heatType === 'electric_5k') { heatRun = 5000; heatSurgeDelta = 0; }
    else if (heatType === 'electric_10k') { heatRun = 10000; heatSurgeDelta = 0; }
    runW += heatRun;
    if (heatSurgeDelta > maxSurgeDelta) maxSurgeDelta = heatSurgeDelta;

    // General Lighting/Electronics & Water Heater
    runW += genW + waterW;

    var totalSurge = runW + maxSurgeDelta;
    var bufferedRunning = runW * (1 + (margin / 100));
    var bufferedSurge = totalSurge * (1 + (margin / 100));

    var recKW = (bufferedSurge / 1000).toFixed(1);

    var transferAmps = '30 Amp Manual Switch';
    var kwVal = parseFloat(recKW);
    if (kwVal > 18) {
      transferAmps = '200 Amp Automatic Switch (Whole Home)';
    } else if (kwVal > 12) {
      transferAmps = '100 Amp Automatic Switch';
    } else if (kwVal > 7.5) {
      transferAmps = '50 Amp Manual Transfer Switch';
    }

    var outRun = document.querySelector('#output_totalRunningWatts .output-number');
    var outSurge = document.querySelector('#output_totalSurgeWatts .output-number');
    var outKW = document.querySelector('#output_recommendedGenSizeKW .output-number');
    var outSwitch = document.querySelector('#output_recommendedTransferSwitchAmps .output-number');

    if (outRun) outRun.textContent = Math.round(runW).toLocaleString() + ' W';
    if (outSurge) outSurge.textContent = Math.round(totalSurge).toLocaleString() + ' W Peak';
    if (outKW) outKW.textContent = recKW + ' kW Generator';
    if (outSwitch) outSwitch.textContent = transferAmps;

    updateChart(runW, maxSurgeDelta, bufferedSurge, kwVal);

    if (window.logHistory) {
      window.logHistory('generator-sizing-calculator', {
        totalRunningWatts: Math.round(runW) + ' W',
        totalSurgeWatts: Math.round(totalSurge) + ' W',
        recommendedGenSizeKW: recKW + ' kW',
        recommendedTransferSwitchAmps: transferAmps
      });
    }
  }

  function updateChart(runW, surgeDelta, bufferedSurge, kwVal) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'applianceWattageBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'generatorCapacityBuffer') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Continuous Running Watts', 'Peak Surge Watts', 'Required Generator Rating (W)'],
          datasets: [{
            label: 'Wattage (W)',
            data: [Math.round(runW), Math.round(runW + surgeDelta), Math.round(bufferedSurge)],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Continuous Running Load (W)', 'Peak Motor Starting Surge (W)'],
          datasets: [{
            data: [Math.round(runW), Math.round(surgeDelta)],
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
    document.getElementById('input_refrigeratorCount').value = 1;
    document.getElementById('input_sumpPumpHorsepower').value = "0.5";
    document.getElementById('input_wellPumpHorsepower').value = "0";
    document.getElementById('input_centralAirTons').value = "0";
    document.getElementById('input_heatingAppliance').value = "gas_furnace";
    document.getElementById('input_lightingElectronicsWatts').value = 2000;
    document.getElementById('input_waterHeaterWatts').value = 0;
    document.getElementById('input_safetyMarginPercent').value = 20;
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
