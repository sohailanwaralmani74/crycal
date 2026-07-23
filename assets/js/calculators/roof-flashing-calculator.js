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
    var dripFeet = parseFloat(document.getElementById('input_roofEaveRakeFeet').value) || 0;
    var wallFeet = parseFloat(document.getElementById('input_wallIntersectionFeet').value) || 0;
    var valleyFeet = parseFloat(document.getElementById('input_valleyLengthFeet').value) || 0;
    var chimneyW = parseFloat(document.getElementById('input_chimneyWidthInches').value) || 0;
    var chimneyD = parseFloat(document.getElementById('input_chimneyDepthInches').value) || 0;
    var exposure = parseFloat(document.getElementById('input_shingleExposureInches').value) || 5;

    // Drip edge 10-ft sticks with 10% waste
    var dripSticks = Math.ceil((dripFeet * 1.10) / 10);

    // Valley metal 10-ft sticks with 10% waste
    var valleySticks = Math.ceil((valleyFeet * 1.10) / 10);

    // Step flashing pieces
    var wallInches = wallFeet * 12;
    var stepNetPieces = Math.ceil(wallInches / exposure);
    var stepGrossPieces = Math.ceil(stepNetPieces * 1.10);

    // Chimney kit calculation
    var chimneyApronPieces = chimneyW > 0 ? 1 : 0;
    var chimneyStepPieces = chimneyD > 0 ? Math.ceil((chimneyD * 2) / exposure) : 0;
    var chimneyCricketPieces = chimneyW > 0 ? 1 : 0;

    var chimneySummary = 'No Chimney Flashing';
    if (chimneyW > 0 || chimneyD > 0) {
      chimneySummary = '1 Base Apron (' + chimneyW + '"), ' + chimneyStepPieces + ' Step Cards, 1 Back Cricket (' + chimneyW + '")';
    }

    var outStep = document.querySelector('#output_stepFlashingPieces .output-number');
    var outDrip = document.querySelector('#output_dripEdgeSticks .output-number');
    var outValley = document.querySelector('#output_valleyMetalSticks .output-number');
    var outChimney = document.querySelector('#output_chimneyFlashingKit .output-number');

    if (outStep) outStep.textContent = stepGrossPieces + ' pcs (4"x4"x7" cards)';
    if (outDrip) outDrip.textContent = dripSticks + ' sticks @ 10\' (' + Math.round(dripFeet * 1.10) + ' gross ft)';
    if (outValley) outValley.textContent = valleySticks + ' sticks @ 10\' (' + Math.round(valleyFeet * 1.10) + ' gross ft)';
    if (outChimney) outChimney.textContent = chimneySummary;

    updateChart(dripFeet, wallFeet, valleyFeet, (dripFeet + wallFeet + valleyFeet) * 0.10);

    if (window.logHistory) {
      window.logHistory('roof-flashing-calculator', {
        roofEaveRakeFeet: dripFeet + ' ft',
        wallIntersectionFeet: wallFeet + ' ft',
        stepFlashingPieces: stepGrossPieces + ' pcs',
        dripEdgeSticks: dripSticks + ' sticks',
        valleyMetalSticks: valleySticks + ' sticks',
        chimneyFlashingKit: chimneySummary
      });
    }
  }

  function updateChart(drip, wall, valley, wasteFeet) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'flashingComponentBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'flashingWasteAllowance') {
      var netTotal = drip + wall + valley;
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Installed Flashing (ft)', '10% Overlap & Cut Waste (ft)'],
          datasets: [{
            data: [parseFloat(netTotal.toFixed(1)), parseFloat(wasteFeet.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
          labels: ['Drip Edge (ft)', 'Sidewall Step (ft)', 'Valley Metal (ft)'],
          datasets: [{
            label: 'Linear Feet',
            data: [
              parseFloat(drip.toFixed(1)),
              parseFloat(wall.toFixed(1)),
              parseFloat(valley.toFixed(1))
            ],
            backgroundColor: ['#4A90E2', '#C08A2E', '#2F6F5E']
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
    document.getElementById('input_roofEaveRakeFeet').value = 180;
    document.getElementById('input_wallIntersectionFeet').value = 30;
    document.getElementById('input_valleyLengthFeet').value = 24;
    document.getElementById('input_chimneyWidthInches').value = 32;
    document.getElementById('input_chimneyDepthInches').value = 24;
    document.getElementById('input_shingleExposureInches').value = 5;
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
