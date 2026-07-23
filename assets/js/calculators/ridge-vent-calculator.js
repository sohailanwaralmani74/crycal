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
    var footprint = parseFloat(document.getElementById('input_atticFootprintSqFt').value) || 0;
    var ratioVal = parseFloat(document.getElementById('input_ventilationRatio').value) || 300;
    var ventRating = parseFloat(document.getElementById('input_ridgeVentNfvaRating').value) || 18;
    var availableRidge = parseFloat(document.getElementById('input_roofRidgeLengthFeet').value) || 0;

    var totalNfvaSqFt = footprint / ratioVal;
    var totalNfvaSqIn = totalNfvaSqFt * 144;

    var ridgeExhaustSqIn = totalNfvaSqIn * 0.5;
    var soffitIntakeSqIn = totalNfvaSqIn * 0.5;

    var ridgeVentFeetNeeded = ridgeExhaustSqIn / ventRating;
    var soffitVentsCount = Math.ceil(soffitIntakeSqIn / 50); // 50 sq in per standard 16x8 vent

    var outTotalNfva = document.querySelector('#output_totalNfvaNeeded .output-number');
    var outRidgeNfva = document.querySelector('#output_ridgeExhaustNfva .output-number');
    var outRidgeFeet = document.querySelector('#output_ridgeVentLinearFeet .output-number');
    var outSoffitNfva = document.querySelector('#output_soffitIntakeNfva .output-number');

    if (outTotalNfva) outTotalNfva.textContent = totalNfvaSqFt.toFixed(2) + ' sq ft (' + Math.round(totalNfvaSqIn) + ' sq in)';
    if (outRidgeNfva) outRidgeNfva.textContent = Math.round(ridgeExhaustSqIn) + ' sq in (50% Split)';
    if (outRidgeFeet) outRidgeFeet.textContent = ridgeVentFeetNeeded.toFixed(1) + ' linear ft (Max Ridge: ' + availableRidge + ' ft)';
    if (outSoffitNfva) outSoffitNfva.textContent = Math.round(soffitIntakeSqIn) + ' sq in (~' + soffitVentsCount + ' vents @ 16x8")';

    updateChart(ridgeExhaustSqIn, soffitIntakeSqIn, ridgeVentFeetNeeded, availableRidge);

    if (window.logHistory) {
      window.logHistory('ridge-vent-calculator', {
        atticFootprintSqFt: footprint + ' sq ft',
        ventilationRatio: '1:' + ratioVal,
        totalNfvaNeeded: totalNfvaSqFt.toFixed(2) + ' sq ft',
        ridgeExhaustNfva: Math.round(ridgeExhaustSqIn) + ' sq in',
        ridgeVentLinearFeet: ridgeVentFeetNeeded.toFixed(1) + ' ft',
        soffitIntakeNfva: Math.round(soffitIntakeSqIn) + ' sq in'
      });
    }
  }

  function updateChart(ridgeSqIn, soffitSqIn, neededRidge, availRidge) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'ventBalance';

    var ctx = canvas.getContext('2d');
    if (tabId === 'ridgeCapCapacity') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Required Ridge Vent (ft)', 'Total Available Ridge (ft)'],
          datasets: [{
            label: 'Linear Feet',
            data: [
              parseFloat(neededRidge.toFixed(1)),
              parseFloat(availRidge.toFixed(1))
            ],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
          labels: ['Ridge Exhaust NFVA (sq in)', 'Soffit Intake NFVA (sq in)'],
          datasets: [{
            data: [Math.round(ridgeSqIn), Math.round(soffitSqIn)],
            backgroundColor: ['#C08A2E', '#4A90E2']
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
    document.getElementById('input_atticFootprintSqFt').value = 1500;
    document.getElementById('input_ventilationRatio').value = "300";
    document.getElementById('input_ridgeVentNfvaRating').value = 18;
    document.getElementById('input_roofRidgeLengthFeet').value = 40;
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
