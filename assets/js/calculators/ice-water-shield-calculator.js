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
    var eaveFeet = parseFloat(document.getElementById('input_eaveLengthFeet').value) || 0;
    var overhangInches = parseFloat(document.getElementById('input_overhangWidthInches').value) || 0;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 0;
    var valleyFeet = parseFloat(document.getElementById('input_valleyLengthFeet').value) || 0;
    var lowSlopeSqFt = parseFloat(document.getElementById('input_lowSlopeAreaSqFt').value) || 0;
    var rollWInches = parseFloat(document.getElementById('input_rollWidthInches').value) || 36;
    var rollLFeet = parseFloat(document.getElementById('input_rollLengthFeet').value) || 65;

    var pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));

    // IRC code: overhang depth + 24" inside wall line along slope
    var overhangSlopeInches = overhangInches * pitchFactor;
    var wallExtensionSlopeInches = 24 * pitchFactor;
    var totalEaveSlopeWidthInches = overhangSlopeInches + wallExtensionSlopeInches;

    var netRollWidthInches = rollWInches - 3; // 3" overlap
    var coursesNeeded = Math.ceil(totalEaveSlopeWidthInches / netRollWidthInches);
    if (coursesNeeded < 1) coursesNeeded = 1;

    var totalEaveWidthCoveredFeet = (coursesNeeded * rollWInches) / 12;
    var eaveSqFt = eaveFeet * totalEaveWidthCoveredFeet;

    var valleyWidthFeet = rollWInches / 12;
    var valleySqFt = valleyFeet * valleyWidthFeet;

    var netTotalSqFt = eaveSqFt + valleySqFt + lowSlopeSqFt;
    var grossTotalSqFt = netTotalSqFt * 1.10; // 10% waste & end laps

    var rollCoverageSqFt = (rollWInches / 12) * rollLFeet;
    var rollsToBuy = Math.ceil(grossTotalSqFt / rollCoverageSqFt);

    var outWidth = document.querySelector('#output_eaveMembraneWidthInches .output-number');
    var outCourses = document.querySelector('#output_eaveCoursesNeeded .output-number');
    var outSqFt = document.querySelector('#output_totalShieldSqFt .output-number');
    var outRolls = document.querySelector('#output_rollsNeeded .output-number');

    if (outWidth) outWidth.textContent = totalEaveSlopeWidthInches.toFixed(1) + '" along slope (' + (totalEaveSlopeWidthInches / 12).toFixed(2) + ' ft)';
    if (outCourses) outCourses.textContent = coursesNeeded + ' Course' + (coursesNeeded > 1 ? 's' : '') + ' (' + (coursesNeeded * rollWInches) + '" total eave width)';
    if (outSqFt) outSqFt.textContent = Math.round(netTotalSqFt) + ' sq ft Net (' + Math.round(grossTotalSqFt) + ' sq ft Gross)';
    if (outRolls) outRolls.textContent = rollsToBuy + ' Roll' + (rollsToBuy > 1 ? 's' : '') + ' (' + rollWInches + '" x ' + rollLFeet + '\' = ' + Math.round(rollCoverageSqFt) + ' sq ft/roll)';

    updateChart(eaveSqFt, valleySqFt, lowSlopeSqFt, netTotalSqFt, grossTotalSqFt - netTotalSqFt);

    if (window.logHistory) {
      window.logHistory('ice-water-shield-calculator', {
        eaveLengthFeet: eaveFeet + ' ft',
        roofPitch: pitch + '/12',
        eaveMembraneWidthInches: totalEaveSlopeWidthInches.toFixed(1) + '"',
        eaveCoursesNeeded: coursesNeeded + ' Courses',
        totalShieldSqFt: Math.round(grossTotalSqFt) + ' sq ft',
        rollsNeeded: rollsToBuy + ' Rolls'
      });
    }
  }

  function updateChart(eaveSqFt, valleySqFt, lowSlopeSqFt, netTotal, wasteSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'membraneAllocation';

    var ctx = canvas.getContext('2d');
    if (tabId === 'rollCoverageRatio') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Installed Area (sq ft)', '10% Waste & Overlap (sq ft)'],
          datasets: [{
            data: [Math.round(netTotal), Math.round(wasteSqFt)],
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
          labels: ['Eave Protection (sq ft)', 'Valley Seams (sq ft)', 'Low-Slope Deck (sq ft)'],
          datasets: [{
            label: 'Square Feet',
            data: [
              Math.round(eaveSqFt),
              Math.round(valleySqFt),
              Math.round(lowSlopeSqFt)
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
    document.getElementById('input_eaveLengthFeet').value = 120;
    document.getElementById('input_overhangWidthInches').value = 18;
    document.getElementById('input_roofPitch').value = 5;
    document.getElementById('input_valleyLengthFeet').value = 36;
    document.getElementById('input_lowSlopeAreaSqFt').value = 0;
    document.getElementById('input_rollWidthInches').value = 36;
    document.getElementById('input_rollLengthFeet').value = 65;
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
