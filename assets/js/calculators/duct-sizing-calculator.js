(function() {
  'use strict';

  var chartInstance = null;

  var STANDARD_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  function getRecommendedDuctSize(exactDia) {
    for (var i = 0; i < STANDARD_SIZES.length; i++) {
      if (STANDARD_SIZES[i] >= exactDia) {
        return STANDARD_SIZES[i];
      }
    }
    return Math.ceil(exactDia / 2) * 2;
  }

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
    var cfm = parseFloat(document.getElementById('input_airflowCFM').value) || 0;
    var fpm = parseFloat(document.getElementById('input_airVelocityFPM').value) || 700;
    var frictionFactor = parseFloat(document.getElementById('input_ductFrictionLoss').value) || 0.10;
    var ductLengthFt = parseFloat(document.getElementById('input_ductLengthFt').value) || 25;

    var areaSqFt = fpm > 0 ? (cfm / fpm) : 0;
    var areaSqIn = areaSqFt * 144;
    var exactDia = areaSqIn > 0 ? Math.sqrt((4 * areaSqIn) / Math.PI) : 0;
    var recSize = getRecommendedDuctSize(exactDia);

    var totalPressureDrop = frictionFactor * (ductLengthFt / 100);

    var outExact = document.querySelector('#output_exactDuctDiameterInches .output-number');
    var outRec = document.querySelector('#output_recommendedDuctDiameterInches .output-number');
    var outArea = document.querySelector('#output_ductCrossSectionAreaSqFt .output-number');
    var outDrop = document.querySelector('#output_totalPressureDropInches .output-number');

    if (outExact) outExact.textContent = exactDia.toFixed(2) + ' Inches';
    if (outRec) outRec.textContent = recSize + ' Inches Round';
    if (outArea) outArea.textContent = areaSqFt.toFixed(3) + ' sq ft (' + areaSqIn.toFixed(1) + ' sq in)';
    if (outDrop) outDrop.textContent = totalPressureDrop.toFixed(3) + ' in w.g.';

    updateChart(cfm, fpm, exactDia, recSize);

    if (window.logHistory) {
      window.logHistory('duct-sizing-calculator', {
        airflowCFM: cfm + ' CFM',
        airVelocityFPM: fpm + ' FPM',
        exactDuctDiameterInches: exactDia.toFixed(2) + ' in',
        recommendedDuctDiameterInches: recSize + ' in',
        totalPressureDropInches: totalPressureDrop.toFixed(3) + ' in w.g.'
      });
    }
  }

  function updateChart(cfm, fpm, exactDia, recSize) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'airflowVsVelocity';

    var ctx = canvas.getContext('2d');
    if (tabId === 'ductSizeComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Calculated Exact Diameter (in)', 'Recommended Trade Duct Size (in)'],
          datasets: [{
            label: 'Duct Diameter (Inches)',
            data: [parseFloat(exactDia.toFixed(2)), recSize],
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
          labels: ['Target Airflow Volume (CFM)', 'Air Velocity Limit (FPM / 2)'],
          datasets: [{
            data: [cfm, Math.round(fpm / 2)],
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
    document.getElementById('input_airflowCFM').value = 400;
    document.getElementById('input_airVelocityFPM').value = 700;
    document.getElementById('input_ductFrictionLoss').value = 0.10;
    document.getElementById('input_ductLengthFt').value = 25;
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
