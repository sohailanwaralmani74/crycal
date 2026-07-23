(function() {
  'use strict';

  var chartInstance = null;

  var baseCoolingBTU = {
    'zone1': 35,
    'zone2': 30,
    'zone3': 25,
    'zone4': 20,
    'zone5': 20
  };

  var baseHeatingBTU = {
    'zone1': 30,
    'zone2': 35,
    'zone3': 45,
    'zone4': 55,
    'zone5': 60
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
    var sqFt = parseFloat(document.getElementById('input_roomSqFt').value) || 0;
    var height = parseFloat(document.getElementById('input_ceilingHeight').value) || 8;
    var zone = document.getElementById('input_climateZone').value || 'zone3';
    var insul = document.getElementById('input_insulationQuality').value || 'average';
    var sun = document.getElementById('input_sunExposure').value || 'normal';
    var occupants = parseInt(document.getElementById('input_occupantsCount').value, 10) || 1;

    var baseCool = baseCoolingBTU[zone] || 25;
    var baseHeat = baseHeatingBTU[zone] || 45;

    var insulMult = insul === 'poor' ? 1.25 : (insul === 'excellent' ? 0.80 : 1.00);
    var heightMult = height / 8.0;
    var sunMult = sun === 'shaded' ? 0.90 : (sun === 'sunny' ? 1.15 : 1.00);
    var extraOccupantsBTU = occupants > 2 ? (occupants - 2) * 600 : 0;

    var rawCoolingBTU = (sqFt * baseCool * insulMult * heightMult * sunMult) + extraOccupantsBTU;
    var rawHeatingBTU = (sqFt * baseHeat * insulMult * heightMult * sunMult);

    var coolingTonnageExact = rawCoolingBTU / 12000;
    // Round tonnage up to nearest 0.5 Tons
    var roundedTonnage = Math.ceil(coolingTonnageExact * 2) / 2;
    if (roundedTonnage < 1.5) roundedTonnage = 1.5;

    var furnaceKBTU = Math.ceil(rawHeatingBTU / 10000) * 10;
    var recSystem = roundedTonnage.toFixed(1) + ' Ton AC / ' + furnaceKBTU + 'k BTU Heating';

    var outCool = document.querySelector('#output_coolingBTU .output-number');
    var outTons = document.querySelector('#output_coolingTonnage .output-number');
    var outHeat = document.querySelector('#output_heatingBTU .output-number');
    var outRec = document.querySelector('#output_recommendedSystemSize .output-number');

    if (outCool) outCool.textContent = Math.round(rawCoolingBTU).toLocaleString() + ' BTU/hr';
    if (outTons) outTons.textContent = roundedTonnage.toFixed(1) + ' Tons';
    if (outHeat) outHeat.textContent = Math.round(rawHeatingBTU).toLocaleString() + ' BTU/hr';
    if (outRec) outRec.textContent = recSystem;

    updateChart(rawCoolingBTU, rawHeatingBTU, sqFt, baseCool, insulMult, heightMult, sunMult);

    if (window.logHistory) {
      window.logHistory('btu-hvac-sizing-calculator', {
        roomSqFt: sqFt + ' sq ft',
        climateZone: zone.toUpperCase(),
        coolingBTU: Math.round(rawCoolingBTU).toLocaleString() + ' BTU',
        coolingTonnage: roundedTonnage.toFixed(1) + ' Tons',
        heatingBTU: Math.round(rawHeatingBTU).toLocaleString() + ' BTU'
      });
    }
  }

  function updateChart(coolingBTU, heatingBTU, sqFt, baseCool, insulMult, heightMult, sunMult) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'btuComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'loadFactors') {
      var baseSqFtLoad = sqFt * baseCool;
      var insulationAdj = Math.abs(baseSqFtLoad * (insulMult - 1.0));
      var volumeSunAdj = Math.abs(coolingBTU - baseSqFtLoad - insulationAdj);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Base Square Footage Load', 'Insulation Adjustment', 'Ceiling Height & Solar Gain'],
          datasets: [{
            data: [
              parseFloat(baseSqFtLoad.toFixed(0)),
              parseFloat(insulationAdj.toFixed(0)),
              parseFloat(volumeSunAdj.toFixed(0))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#1A4A3E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Required Cooling Load (BTU/hr)', 'Required Heating Load (BTU/hr)'],
          datasets: [{
            label: 'BTU / hr',
            data: [Math.round(coolingBTU), Math.round(heatingBTU)],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_roomSqFt').value = 1500;
    document.getElementById('input_ceilingHeight').value = 8;
    document.getElementById('input_climateZone').value = 'zone3';
    document.getElementById('input_insulationQuality').value = 'average';
    document.getElementById('input_sunExposure').value = 'normal';
    document.getElementById('input_occupantsCount').value = 4;
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
