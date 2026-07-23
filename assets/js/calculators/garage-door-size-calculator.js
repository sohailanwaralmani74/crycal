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
    var tradeSize = document.getElementById('input_doorTradeSize').value || '16x7';
    var headroom = parseFloat(document.getElementById('input_ceilingHeadroomInches').value) || 14;
    var sideroom = parseFloat(document.getElementById('input_sideroomInches').value) || 4.5;
    var openerType = document.getElementById('input_openerType').value || 'trolley';
    var vehicles = parseInt(document.getElementById('input_vehicleCount').value, 10) || 2;

    var doorWidthFt = 16;
    var doorHeightFt = 7;

    if (tradeSize === '8x7') { doorWidthFt = 8; doorHeightFt = 7; }
    else if (tradeSize === '9x7') { doorWidthFt = 9; doorHeightFt = 7; }
    else if (tradeSize === '10x7') { doorWidthFt = 10; doorHeightFt = 7; }
    else if (tradeSize === '16x7') { doorWidthFt = 16; doorHeightFt = 7; }
    else if (tradeSize === '18x7') { doorWidthFt = 18; doorHeightFt = 7; }
    else if (tradeSize === '16x8') { doorWidthFt = 16; doorHeightFt = 8; }

    var finishedOpening = doorWidthFt + '\' 0" Wide x ' + doorHeightFt + '\' 0" High';

    // Track Headroom Category
    var reqHeadroomStd = (openerType === 'trolley') ? 14 : 12;
    var trackType = 'Standard 12"/15" Radius Track';

    if (headroom < 7) {
      trackType = 'Special Low-Headroom Dual Track (Low Ceiling Warning)';
    } else if (headroom < reqHeadroomStd) {
      trackType = 'Low-Headroom Double Track Package Required (' + headroom + '" vs ' + reqHeadroomStd + '" std)';
    } else if (headroom > 18) {
      trackType = 'High-Lift Track Conversion Available (High Ceiling)';
    }

    // Backroom Depth
    var backroomFt = (openerType === 'trolley') ? (doorHeightFt + 4.0) : (doorHeightFt + 1.5);
    var backroomText = backroomFt.toFixed(1) + ' Feet (' + (backroomFt * 12).toFixed(0) + ' Inches)';

    // Spring System
    var springSystem = (doorWidthFt >= 16) ? 'Dual Heavy-Duty Torsion Springs' : 'Single Torsion Spring System';

    var outSize = document.querySelector('#output_recommendedTradeSize .output-number');
    var outTrack = document.querySelector('#output_trackHeadroomType .output-number');
    var outBack = document.querySelector('#output_backroomDepthRequired .output-number');
    var outSpring = document.querySelector('#output_torsionSpringCategory .output-number');

    if (outSize) outSize.textContent = finishedOpening;
    if (outTrack) outTrack.textContent = trackType;
    if (outBack) outBack.textContent = backroomText;
    if (outSpring) outSpring.textContent = springSystem;

    updateChart(headroom, reqHeadroomStd, doorHeightFt, backroomFt);

    if (window.logHistory) {
      window.logHistory('garage-door-size-calculator', {
        doorTradeSize: tradeSize,
        ceilingHeadroomInches: headroom + ' in',
        trackHeadroomType: trackType,
        backroomDepthRequired: backroomFt.toFixed(1) + ' ft'
      });
    }
  }

  function updateChart(availHeadroom, reqHeadroom, doorH, backroomFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'headroomClearanceBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'backroomDepthComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Door Height (ft)', 'Trolley Opener Extension (ft)', 'Total Backroom Required (ft)'],
          datasets: [{
            label: 'Depth (Feet)',
            data: [doorH, 4.0, backroomFt],
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
        type: 'bar',
        data: {
          labels: ['Available Ceiling Headroom (in)', 'Standard Track Required Headroom (in)'],
          datasets: [{
            label: 'Headroom Clearance (Inches)',
            data: [availHeadroom, reqHeadroom],
            backgroundColor: [availHeadroom >= reqHeadroom ? '#2F6F5E' : '#C08A2E', '#3B82F6']
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
    document.getElementById('input_doorTradeSize').value = "16x7";
    document.getElementById('input_ceilingHeadroomInches').value = 14;
    document.getElementById('input_sideroomInches').value = 4.5;
    document.getElementById('input_openerType').value = "trolley";
    document.getElementById('input_vehicleCount').value = 2;
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
