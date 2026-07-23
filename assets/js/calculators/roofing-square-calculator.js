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
    var length = parseFloat(document.getElementById('input_buildingLength').value) || 0;
    var width = parseFloat(document.getElementById('input_buildingWidth').value) || 0;
    var overhang = parseFloat(document.getElementById('input_eaveOverhang').value) || 0;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercent').value) || 0;

    var totalLength = length + (2 * overhang);
    var totalWidth = width + (2 * overhang);
    var footprintArea = totalLength * totalWidth;

    var pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2));
    var actualArea = footprintArea * pitchMultiplier;
    var netSquares = actualArea / 100;
    var wasteArea = actualArea * (wastePct / 100);
    var totalAreaWithWaste = actualArea + wasteArea;
    var totalSquaresWithWaste = Math.ceil((totalAreaWithWaste / 100) * 100) / 100;

    var outTotalSquares = document.querySelector('#output_totalRoofSquares .output-number');
    var outActualArea = document.querySelector('#output_actualRoofArea .output-number');
    var outNetSquares = document.querySelector('#output_netRoofSquares .output-number');
    var outPitchMult = document.querySelector('#output_pitchMultiplier .output-number');

    if (outTotalSquares) outTotalSquares.textContent = totalSquaresWithWaste.toFixed(2) + ' sq';
    if (outActualArea) outActualArea.textContent = Math.round(actualArea).toLocaleString() + ' sq ft';
    if (outNetSquares) outNetSquares.textContent = netSquares.toFixed(2) + ' sq';
    if (outPitchMult) outPitchMult.textContent = pitchMultiplier.toFixed(3) + 'x';

    updateChart(actualArea, wasteArea, pitch);

    if (window.logHistory) {
      window.logHistory('roofing-square-calculator', {
        buildingLength: length + ' ft',
        buildingWidth: width + ' ft',
        roofPitch: pitch + '/12',
        totalRoofSquares: totalSquaresWithWaste.toFixed(2) + ' sq'
      });
    }
  }

  function updateChart(actualArea, wasteArea, currentPitch) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'pitchComparison') {
      var pitches = [0, 3, 4, 6, 8, 10, 12];
      var mults = pitches.map(function(p) {
        return parseFloat(Math.sqrt(1 + Math.pow(p / 12, 2)).toFixed(3));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['0/12', '3/12', '4/12', '6/12', '8/12', '10/12', '12/12'],
          datasets: [{
            label: 'Slope Pitch Multiplier',
            data: mults,
            backgroundColor: pitches.map(function(p) {
              return p === currentPitch ? '#2F6F5E' : '#C08A2E';
            })
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 1.0, max: 1.5 }
          }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Roof Surface Area (sq ft)', 'Waste & Cut Allowance (sq ft)'],
          datasets: [{
            data: [parseFloat(actualArea.toFixed(1)), parseFloat(wasteArea.toFixed(1))],
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
    document.getElementById('input_buildingLength').value = 40;
    document.getElementById('input_buildingWidth').value = 30;
    document.getElementById('input_eaveOverhang').value = 1.5;
    document.getElementById('input_roofPitch').value = 6;
    document.getElementById('input_wastePercent').value = 10;
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
