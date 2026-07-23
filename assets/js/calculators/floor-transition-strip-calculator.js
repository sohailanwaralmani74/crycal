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
    var doorways = parseInt(document.getElementById('input_doorwayCount').value, 10) || 0;
    var openSeamFeet = parseFloat(document.getElementById('input_openTransitionFeet').value) || 0;
    var profileType = document.getElementById('input_transitionType').value;
    var stickLengthInches = parseFloat(document.getElementById('input_standardStripLengthInches').value) || 72;

    var doorwayFeet = doorways * 3.0; // 36" = 3.0 ft per doorway
    var netTotalFeet = doorwayFeet + openSeamFeet;
    var grossTotalFeet = netTotalFeet * 1.10; // 10% waste

    var stickLengthFeet = stickLengthInches / 12;
    var sticksNeeded = Math.ceil(grossTotalFeet / stickLengthFeet);

    var trackFeet = netTotalFeet;
    var wasteFeet = grossTotalFeet - netTotalFeet;

    var profileNameStr = 'T-Molding';
    if (profileType === 'reducer') profileNameStr = 'Reducer';
    else if (profileType === 'end_cap') profileNameStr = 'End Cap / Square Nose';
    else if (profileType === 'carpet_gripper') profileNameStr = 'Metal Carpet Gripper Bar';

    var outTotal = document.querySelector('#output_totalTransitionLinearFeet .output-number');
    var outSticks = document.querySelector('#output_moldingSticksNeeded .output-number');
    var outTrack = document.querySelector('#output_trackMetalFeet .output-number');
    var outWaste = document.querySelector('#output_estimatedWasteFeet .output-number');

    if (outTotal) outTotal.textContent = netTotalFeet.toFixed(1) + ' linear ft (' + doorways + ' doorways @ 3\' + ' + openSeamFeet.toFixed(1) + '\' open seams)';
    if (outSticks) outSticks.textContent = sticksNeeded + ' Sticks @ ' + stickLengthInches + '" (' + profileNameStr + ')';
    if (outTrack) outTrack.textContent = trackFeet.toFixed(1) + ' linear ft Aluminum U-Channel Base Track';
    if (outWaste) outWaste.textContent = wasteFeet.toFixed(1) + ' linear ft (10% overlap/cutting offcut buffer)';

    updateChart(doorwayFeet, openSeamFeet, netTotalFeet, wasteFeet);

    if (window.logHistory) {
      window.logHistory('floor-transition-strip-calculator', {
        doorwayCount: doorways,
        openTransitionFeet: openSeamFeet + ' ft',
        totalTransitionLinearFeet: netTotalFeet.toFixed(1) + ' ft',
        moldingSticksNeeded: sticksNeeded + ' Sticks',
        trackMetalFeet: trackFeet.toFixed(1) + ' ft',
        estimatedWasteFeet: wasteFeet.toFixed(1) + ' ft'
      });
    }
  }

  function updateChart(doorwayFt, openFt, netTotalFt, wasteFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'transitionSeamBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'stickUtilization') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Installed Seams (ft)', '10% Offcut Waste (ft)'],
          datasets: [{
            data: [parseFloat(netTotalFt.toFixed(1)), parseFloat(wasteFt.toFixed(1))],
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
          labels: ['Doorway Seams (ft)', 'Open Room Seams (ft)'],
          datasets: [{
            label: 'Linear Feet',
            data: [
              parseFloat(doorwayFt.toFixed(1)),
              parseFloat(openFt.toFixed(1))
            ],
            backgroundColor: ['#4A90E2', '#C08A2E']
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
    document.getElementById('input_doorwayCount').value = 4;
    document.getElementById('input_openTransitionFeet').value = 16;
    document.getElementById('input_transitionType').value = "t_molding";
    document.getElementById('input_standardStripLengthInches').value = "72";
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
