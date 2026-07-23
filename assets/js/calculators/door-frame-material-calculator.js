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
    var doorW = parseFloat(document.getElementById('input_doorWidthInches').value) || 36;
    var doorH = parseFloat(document.getElementById('input_doorHeightInches').value) || 80;
    var studDepth = document.getElementById('input_wallStudDepth').value || '2x4';
    var drywallT = parseFloat(document.getElementById('input_sheathingThicknessInches').value) || 1.0;
    var casingW = parseFloat(document.getElementById('input_casingProfileWidthInches').value) || 2.5;
    var doorCount = parseInt(document.getElementById('input_doorCount').value, 10) || 1;
    var incThreshold = document.getElementById('input_includeExteriorThreshold').value || 'no';

    // Jamb Width
    var recJamb = '4-9/16" (4.5625") Jamb';
    var jambValInches = 4.5625;
    if (studDepth === '2x6') {
      recJamb = '6-9/16" (6.5625") Jamb';
      jambValInches = 6.5625;
    } else {
      var customVal = 3.5 + drywallT;
      if (Math.abs(customVal - 4.5) < 0.2) recJamb = '4-9/16" (Standard 2x4 Jamb)';
      else recJamb = customVal.toFixed(3) + '" Custom Depth Jamb';
    }

    // Rough Opening (RO)
    var roW = doorW + 2.0;
    var roH = doorH + 2.5;
    var roText = roW + '" W x ' + roH + '" H (' + (roW/12).toFixed(2) + '\' x ' + (roH/12).toFixed(2) + '\')';

    // Casing Linear Feet (2 sides per door)
    var perSideInches = (2 * (doorH + casingW)) + (doorW + (2 * casingW));
    var totalCasingFt = ((perSideInches * 2) / 12) * doorCount * 1.10;

    // Threshold & Stop
    var thresholdFt = (incThreshold === 'yes') ? ((doorW + 2) / 12) * doorCount : 0;
    var stopFt = (((2 * doorH) + doorW) / 12) * doorCount * 1.05;

    var outJamb = document.querySelector('#output_recommendedJambWidth .output-number');
    var outRO = document.querySelector('#output_roughOpeningDimensions .output-number');
    var outCasing = document.querySelector('#output_totalCasingLinearFeet .output-number');
    var outThreshold = document.querySelector('#output_thresholdMaterialFeet .output-number');

    if (outJamb) outJamb.textContent = recJamb;
    if (outRO) outRO.textContent = roText;
    if (outCasing) outCasing.textContent = totalCasingFt.toFixed(1) + ' Linear Feet (2-Sided)';
    if (outThreshold) outThreshold.textContent = stopFt.toFixed(1) + ' ft Door Stop ' + (thresholdFt > 0 ? '(+ ' + thresholdFt.toFixed(1) + ' ft Sill Threshold)' : '');

    updateChart(studDepth === '2x4' ? 3.5 : 5.5, drywallT, jambValInches, totalCasingFt);

    if (window.logHistory) {
      window.logHistory('door-frame-material-calculator', {
        doorWidthInches: doorW + ' in',
        doorHeightInches: doorH + ' in',
        recommendedJambWidth: recJamb,
        roughOpeningDimensions: roW + '" x ' + roH + '"'
      });
    }
  }

  function updateChart(studInches, drywallInches, totalJambInches, casingFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'jambWidthComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'casingLinearFootage') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Casing Needed (ft)', 'With 10% Waste Factor (ft)'],
          datasets: [{
            label: 'Casing Trim Linear Feet',
            data: [parseFloat((casingFt / 1.10).toFixed(1)), parseFloat(casingFt.toFixed(1))],
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
          labels: ['Wood Stud Thickness (in)', 'Drywall Sheathing Thickness (in)', 'Total Calculated Jamb Depth (in)'],
          datasets: [{
            label: 'Wall Layer Thickness (Inches)',
            data: [studInches, drywallInches, totalJambInches],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
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
    document.getElementById('input_doorWidthInches').value = "36";
    document.getElementById('input_doorHeightInches').value = "80";
    document.getElementById('input_wallStudDepth').value = "2x4";
    document.getElementById('input_sheathingThicknessInches').value = 1.0;
    document.getElementById('input_casingProfileWidthInches').value = 2.5;
    document.getElementById('input_doorCount').value = 1;
    document.getElementById('input_includeExteriorThreshold').value = "no";
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
