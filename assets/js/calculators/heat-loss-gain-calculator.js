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
    var wallArea = parseFloat(document.getElementById('input_wallAreaSqFt').value) || 0;
    var wallR = parseFloat(document.getElementById('input_wallRValue').value) || 13;
    var windowArea = parseFloat(document.getElementById('input_windowAreaSqFt').value) || 0;
    var windowU = parseFloat(document.getElementById('input_windowUFactor').value) || 0.30;
    var ceilingArea = parseFloat(document.getElementById('input_ceilingAreaSqFt').value) || 0;
    var ceilingR = parseFloat(document.getElementById('input_ceilingRValue').value) || 30;
    var indoorT = parseFloat(document.getElementById('input_indoorTemp').value) || 70;
    var winterOutdoorT = parseFloat(document.getElementById('input_outdoorWinterTemp').value) || 15;
    var summerOutdoorT = parseFloat(document.getElementById('input_outdoorSummerTemp').value) || 95;

    var deltaTWinter = Math.max(0, indoorT - winterOutdoorT);
    var deltaTSummer = Math.max(0, summerOutdoorT - indoorT);

    var wallU = 1.0 / wallR;
    var ceilingU = 1.0 / ceilingR;

    var wallLossWinter = wallU * wallArea * deltaTWinter;
    var windowLossWinter = windowU * windowArea * deltaTWinter;
    var ceilingLossWinter = ceilingU * ceilingArea * deltaTWinter;

    var rawWinterLoss = wallLossWinter + windowLossWinter + ceilingLossWinter;
    var totalWinterLossBtu = rawWinterLoss * 1.25; // 25% infiltration factor

    var wallGainSummer = wallU * wallArea * deltaTSummer;
    var windowGainSummer = (windowU * windowArea * deltaTSummer) + (windowArea * 25.0); // +25 BTU/sqft solar heat gain coefficient
    var ceilingGainSummer = ceilingU * ceilingArea * (deltaTSummer + 20.0); // +20F attic heat build-up

    var rawSummerGain = wallGainSummer + windowGainSummer + ceilingGainSummer;
    var totalSummerGainBtu = rawSummerGain * 1.20;

    var heatingKw = totalWinterLossBtu / 3412.14;
    var heatingMbh = totalWinterLossBtu / 1000.0;
    var coolingTons = totalSummerGainBtu / 12000.0;

    var dominant = 'Exterior Walls';
    if (windowLossWinter >= wallLossWinter && windowLossWinter >= ceilingLossWinter) {
      dominant = 'Windows & Glass';
    } else if (ceilingLossWinter >= wallLossWinter && ceilingLossWinter >= windowLossWinter) {
      dominant = 'Attic Ceiling';
    }

    var outWinterBtu = document.querySelector('#output_heatingHeatLossBtu .output-number');
    var outSummerBtu = document.querySelector('#output_coolingHeatGainBtu .output-number');
    var outKw = document.querySelector('#output_heatingCapacityKw .output-number');
    var outTons = document.querySelector('#output_coolingCapacityTons .output-number');
    var outDominant = document.querySelector('#output_dominantEnvelopeLoss .output-number');

    if (outWinterBtu) outWinterBtu.textContent = Math.round(totalWinterLossBtu).toLocaleString() + ' BTU/hr';
    if (outSummerBtu) outSummerBtu.textContent = Math.round(totalSummerGainBtu).toLocaleString() + ' BTU/hr';
    if (outKw) outKw.textContent = heatingKw.toFixed(1) + ' kW (' + heatingMbh.toFixed(1) + ' MBH)';
    if (outTons) outTons.textContent = coolingTons.toFixed(2) + ' Tons';
    if (outDominant) outDominant.textContent = dominant + ' (' + Math.round((Math.max(wallLossWinter, windowLossWinter, ceilingLossWinter) / (rawWinterLoss || 1)) * 100) + '% of conductive loss)';

    updateChart(wallLossWinter, windowLossWinter, ceilingLossWinter, (totalWinterLossBtu - rawWinterLoss), totalWinterLossBtu, totalSummerGainBtu);

    if (window.logHistory) {
      window.logHistory('heat-loss-gain-calculator', {
        wallAreaSqFt: wallArea + ' sq ft',
        outdoorWinterTemp: winterOutdoorT + '°F',
        heatingHeatLossBtu: Math.round(totalWinterLossBtu) + ' BTU',
        coolingCapacityTons: coolingTons.toFixed(2) + ' Tons'
      });
    }
  }

  function updateChart(wallLoss, windowLoss, ceilingLoss, infiltLoss, totalWinterBtu, totalSummerBtu) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'heatLossByEnvelope';

    var ctx = canvas.getContext('2d');
    if (tabId === 'heatingVsCoolingLoad') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Peak Winter Heat Loss (BTU/hr)', 'Peak Summer Heat Gain (BTU/hr)'],
          datasets: [{
            label: 'BTU Load',
            data: [Math.round(totalWinterBtu), Math.round(totalSummerBtu)],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
        type: 'doughnut',
        data: {
          labels: ['Exterior Walls', 'Windows & Glass', 'Attic Ceiling', 'Air Infiltration'],
          datasets: [{
            data: [
              Math.round(wallLoss),
              Math.round(windowLoss),
              Math.round(ceilingLoss),
              Math.round(infiltLoss)
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59', '#D9A74A']
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
    document.getElementById('input_wallAreaSqFt').value = 1200;
    document.getElementById('input_wallRValue').value = '13';
    document.getElementById('input_windowAreaSqFt').value = 250;
    document.getElementById('input_windowUFactor').value = '0.30';
    document.getElementById('input_ceilingAreaSqFt').value = 1500;
    document.getElementById('input_ceilingRValue').value = '30';
    document.getElementById('input_indoorTemp').value = 70;
    document.getElementById('input_outdoorWinterTemp').value = 15;
    document.getElementById('input_outdoorSummerTemp').value = 95;
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
