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

  function getPitchMultiplier(pitch) {
    switch (pitch) {
      case '4_12': return 1.054;
      case '8_12': return 1.202;
      case '10_12': return 1.302;
      case '12_12': return 1.414;
      case '6_12':
      default: return 1.118;
    }
  }

  function calculate() {
    var area = parseFloat(document.getElementById('input_atticFloorSqFt').value) || 0;
    var pitchKey = document.getElementById('input_roofPitch').value;
    var codeRatio = parseFloat(document.getElementById('input_buildingCodeRatio').value) || 300;
    var splitKey = document.getElementById('input_intakeExhaustSplit').value;
    var soffitRating = parseFloat(document.getElementById('input_soffitNfvaPerPiece').value) || 9.0;
    var ridgeRating = parseFloat(document.getElementById('input_ridgeNfvaPerFoot').value) || 18.0;

    var pitchMult = getPitchMultiplier(pitchKey);
    var effectiveArea = area * pitchMult;

    var totalNfvaSqFt = codeRatio > 0 ? (effectiveArea / codeRatio) : 0;
    var totalNfvaSqIn = totalNfvaSqFt * 144.0;

    var intakePct = splitKey === '60_40' ? 0.60 : 0.50;
    var exhaustPct = 1.0 - intakePct;

    var intakeNfvaSqIn = totalNfvaSqIn * intakePct;
    var exhaustNfvaSqIn = totalNfvaSqIn * exhaustPct;

    var soffitVents = soffitRating > 0 ? Math.ceil(intakeNfvaSqIn / soffitRating) : 0;
    var ridgeFeet = ridgeRating > 0 ? Math.ceil(exhaustNfvaSqIn / ridgeRating) : 0;

    var outTotalSqIn = document.querySelector('#output_totalNfvaSqIn .output-number');
    var outTotalSqFt = document.querySelector('#output_totalNfvaSqFt .output-number');
    var outIntakeSqIn = document.querySelector('#output_intakeNfvaSqIn .output-number');
    var outExhaustSqIn = document.querySelector('#output_exhaustNfvaSqIn .output-number');
    var outSoffitCount = document.querySelector('#output_soffitVentsCount .output-number');
    var outRidgeFt = document.querySelector('#output_ridgeVentFeet .output-number');

    if (outTotalSqIn) outTotalSqIn.textContent = Math.round(totalNfvaSqIn).toLocaleString() + ' sq in';
    if (outTotalSqFt) outTotalSqFt.textContent = totalNfvaSqFt.toFixed(2) + ' sq ft';
    if (outIntakeSqIn) outIntakeSqIn.textContent = Math.round(intakeNfvaSqIn).toLocaleString() + ' sq in (' + Math.round(intakePct * 100) + '%)';
    if (outExhaustSqIn) outExhaustSqIn.textContent = Math.round(exhaustNfvaSqIn).toLocaleString() + ' sq in (' + Math.round(exhaustPct * 100) + '%)';
    if (outSoffitCount) outSoffitCount.textContent = soffitVents + ' units (' + soffitRating + ' sq in ea)';
    if (outRidgeFt) outRidgeFt.textContent = ridgeFeet + ' linear ft (' + ridgeRating + ' sq in/ft)';

    updateChart(intakeNfvaSqIn, exhaustNfvaSqIn, soffitVents, ridgeFeet);

    if (window.logHistory) {
      window.logHistory('attic-ventilation-calculator', {
        atticFloorSqFt: area + ' sq ft',
        buildingCodeRatio: '1:' + codeRatio,
        totalNfvaSqIn: Math.round(totalNfvaSqIn) + ' sq in',
        ridgeVentFeet: ridgeFeet + ' ft'
      });
    }
  }

  function updateChart(intakeSqIn, exhaustSqIn, soffitUnits, ridgeFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'intakeVsExhaustSplit';

    var ctx = canvas.getContext('2d');
    if (tabId === 'ventCountComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Soffit Intake Vents (Pieces)', 'Ridge Exhaust Vent (Linear Feet)'],
          datasets: [{
            label: 'Vent Hardware Requirements',
            data: [soffitUnits, ridgeFt],
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
          labels: ['Intake Soffit NFVA (sq in)', 'Exhaust Ridge NFVA (sq in)'],
          datasets: [{
            data: [Math.round(intakeSqIn), Math.round(exhaustSqIn)],
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
    document.getElementById('input_atticFloorSqFt').value = 1500;
    document.getElementById('input_roofPitch').value = '6_12';
    document.getElementById('input_buildingCodeRatio').value = '300';
    document.getElementById('input_intakeExhaustSplit').value = '50_50';
    document.getElementById('input_soffitNfvaPerPiece').value = 9.0;
    document.getElementById('input_ridgeNfvaPerFoot').value = 18.0;
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
