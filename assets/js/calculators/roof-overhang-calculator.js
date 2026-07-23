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
    var horizInches = parseFloat(document.getElementById('input_horizontalOverhangInches').value) || 0;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 0;
    var wallHeightFeet = parseFloat(document.getElementById('input_wallHeightFeet').value) || 0;
    var atticAreaSqFt = parseFloat(document.getElementById('input_atticAreaSqFt').value) || 0;

    var pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));

    var tailLengthInches = horizInches * pitchFactor;
    var fasciaDropInches = horizInches * (pitch / 12);

    // IRC 1:300 rule, 50% intake split
    var totalNfvaSqFt = atticAreaSqFt / 300;
    var soffitIntakeSqFt = totalNfvaSqFt * 0.5;
    var soffitIntakeSqIn = soffitIntakeSqFt * 144;

    var recommendedBoard = '1x6 (5.5" Depth)';
    if (fasciaDropInches > 5.5 && fasciaDropInches <= 7.25) {
      recommendedBoard = '1x8 (7.25" Depth)';
    } else if (fasciaDropInches > 7.25 && fasciaDropInches <= 9.25) {
      recommendedBoard = '1x10 (9.25" Depth)';
    } else if (fasciaDropInches > 9.25) {
      recommendedBoard = '1x12 (11.25" Depth)';
    }

    var outTail = document.querySelector('#output_overhangTailLength .output-number');
    var outDrop = document.querySelector('#output_fasciaBoardDrop .output-number');
    var outVenting = document.querySelector('#output_soffitVentAreaNeeded .output-number');
    var outLumber = document.querySelector('#output_recommendedStockBoard .output-number');

    if (outTail) outTail.textContent = tailLengthInches.toFixed(2) + '" (' + (tailLengthInches / 12).toFixed(2) + ' ft)';
    if (outDrop) outDrop.textContent = fasciaDropInches.toFixed(2) + '" (' + (fasciaDropInches / 12).toFixed(2) + ' ft)';
    if (outVenting) outVenting.textContent = soffitIntakeSqFt.toFixed(2) + ' sq ft (' + Math.round(soffitIntakeSqIn) + ' sq in)';
    if (outLumber) outLumber.textContent = recommendedBoard;

    updateChart(horizInches, fasciaDropInches, tailLengthInches, soffitIntakeSqIn);

    if (window.logHistory) {
      window.logHistory('roof-overhang-calculator', {
        horizontalOverhangInches: horizInches + '"',
        roofPitch: pitch + '/12',
        overhangTailLength: tailLengthInches.toFixed(2) + '"',
        fasciaBoardDrop: fasciaDropInches.toFixed(2) + '"',
        soffitVentAreaNeeded: soffitIntakeSqFt.toFixed(2) + ' sq ft',
        recommendedStockBoard: recommendedBoard
      });
    }
  }

  function updateChart(horizInches, dropInches, tailInches, soffitSqIn) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'overhangTriangle';

    var ctx = canvas.getContext('2d');
    if (tabId === 'atticVentingSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Soffit Intake NFVA (sq in)', 'Ridge Exhaust NFVA (sq in)'],
          datasets: [{
            data: [Math.round(soffitSqIn), Math.round(soffitSqIn)],
            backgroundColor: ['#2F6F5E', '#4A90E2']
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
          labels: ['Horizontal Width (in)', 'Vertical Plumb Drop (in)', 'Rafter Tail Length (in)'],
          datasets: [{
            label: 'Inches',
            data: [
              parseFloat(horizInches.toFixed(2)),
              parseFloat(dropInches.toFixed(2)),
              parseFloat(tailInches.toFixed(2))
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
    document.getElementById('input_horizontalOverhangInches').value = 16;
    document.getElementById('input_roofPitch').value = 6;
    document.getElementById('input_wallHeightFeet').value = 9;
    document.getElementById('input_atticAreaSqFt').value = 1200;
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
