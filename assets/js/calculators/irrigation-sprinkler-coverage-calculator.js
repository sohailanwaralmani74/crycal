(function() {
  'use strict';

  var chartInstance = null;

  var HEAD_SPECS = {
    rotor: { radius: 35, gpm: 3.0, pr: 0.45 },
    spray: { radius: 15, gpm: 1.5, pr: 1.55 },
    rotary_nozzle: { radius: 20, gpm: 0.8, pr: 0.40 }
  };

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
    var areaSqFt = parseFloat(document.getElementById('input_lawnAreaSqFt').value) || 0;
    var headKey = document.getElementById('input_headType').value || 'rotor';
    var overlapPct = parseFloat(document.getElementById('input_overlapPattern').value) || 100;
    var supplyGpm = parseFloat(document.getElementById('input_waterFlowGpm').value) || 12;
    var pressurePsi = parseFloat(document.getElementById('input_waterPressurePsi').value) || 45;

    var spec = HEAD_SPECS[headKey] || HEAD_SPECS.rotor;

    // Adjust radius based on pressure factor (nominal 45 psi)
    var pressureFactor = Math.min(1.15, Math.max(0.75, Math.sqrt(pressurePsi / 45)));
    var effectiveRadiusFt = spec.radius * pressureFactor * (overlapPct === 100 ? 0.707 : 0.85);

    var coverageAreaPerHead = Math.pow(effectiveRadiusFt, 2);
    var totalHeads = Math.max(1, Math.ceil(areaSqFt / Math.max(25, coverageAreaPerHead)));

    var totalFlowGpm = totalHeads * spec.gpm;

    // Max safe supply per zone is 80% of supply GPM
    var safeSupplyGpm = supplyGpm * 0.80;
    var numberOfZones = Math.max(1, Math.ceil(totalFlowGpm / safeSupplyGpm));
    var headsPerZone = Math.round((totalHeads / numberOfZones) * 10) / 10;

    var precipRateInHr = (96.25 * spec.gpm) / Math.pow(effectiveRadiusFt, 2);

    var outHeads = document.querySelector('#output_totalHeadsCount .output-number');
    var outFlow = document.querySelector('#output_totalFlowRequiredGpm .output-number');
    var outZones = document.querySelector('#output_numberOfZones .output-number');
    var outHeadsPerZone = document.querySelector('#output_headsPerZone .output-number');
    var outPrecip = document.querySelector('#output_precipitationRate .output-number');

    if (outHeads) outHeads.textContent = totalHeads + ' Heads';
    if (outFlow) outFlow.textContent = totalFlowGpm.toFixed(1) + ' GPM';
    if (outZones) outZones.textContent = numberOfZones + ' Zones';
    if (outHeadsPerZone) outHeadsPerZone.textContent = headsPerZone + ' heads / zone';
    if (outPrecip) outPrecip.textContent = precipRateInHr.toFixed(2) + ' in / hr';

    updateChart(supplyGpm, safeSupplyGpm, totalFlowGpm, numberOfZones, totalHeads);

    if (window.logHistory) {
      window.logHistory('irrigation-sprinkler-coverage-calculator', {
        lawnAreaSqFt: areaSqFt + ' sq ft',
        totalHeadsCount: totalHeads + ' Heads',
        numberOfZones: numberOfZones + ' Zones',
        totalFlowRequiredGpm: totalFlowGpm.toFixed(1) + ' GPM'
      });
    }
  }

  function updateChart(supplyGpm, safeSupplyGpm, totalFlowGpm, zones, totalHeads) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'zoneFlowDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'headCountTab') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Irrigation Zones', 'Sprinkler Heads Count'],
          datasets: [{
            data: [zones, totalHeads],
            backgroundColor: ['#2F6F5E', '#3B82F6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var flowPerZone = totalFlowGpm / zones;
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Single Zone Demand GPM', 'Max Safe Zone Capacity (80%)', 'Total Available Supply GPM'],
          datasets: [{
            label: 'Water Flow (GPM)',
            data: [
              parseFloat(flowPerZone.toFixed(1)),
              parseFloat(safeSupplyGpm.toFixed(1)),
              parseFloat(supplyGpm.toFixed(1))
            ],
            backgroundColor: ['#3B82F6', '#2F6F5E', '#C08A2E']
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
    document.getElementById('input_lawnAreaSqFt').value = 2500;
    document.getElementById('input_headType').value = 'rotor';
    document.getElementById('input_overlapPattern').value = "100";
    document.getElementById('input_waterFlowGpm').value = 12;
    document.getElementById('input_waterPressurePsi').value = 45;
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
