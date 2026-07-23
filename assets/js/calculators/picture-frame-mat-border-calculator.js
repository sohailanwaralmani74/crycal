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
    var artW = parseFloat(document.getElementById('input_artworkWidth').value) || 0;
    var artH = parseFloat(document.getElementById('input_artworkHeight').value) || 0;
    var borderW = parseFloat(document.getElementById('input_matBorderWidth').value) || 0;
    var overlap = parseFloat(document.getElementById('input_overlapAllowance').value) || 0;
    var profileW = parseFloat(document.getElementById('input_frameProfileWidth').value) || 0;

    var openingW = Math.max(0.5, artW - (2 * overlap));
    var openingH = Math.max(0.5, artH - (2 * overlap));

    var matOuterW = openingW + (2 * borderW);
    var matOuterH = openingH + (2 * borderW);

    var frameExtW = matOuterW + (2 * profileW);
    var frameExtH = matOuterH + (2 * profileW);

    var artArea = artW * artH;
    var matBoardArea = (matOuterW * matOuterH) - (openingW * openingH);

    var outOpeningW = document.querySelector('#output_matOpeningWidth .output-number');
    var outOpeningH = document.querySelector('#output_matOpeningHeight .output-number');
    var outOuterW = document.querySelector('#output_matBoardOuterWidth .output-number');
    var outOuterH = document.querySelector('#output_matBoardOuterHeight .output-number');
    var outFrameExtW = document.querySelector('#output_totalFrameOuterWidth .output-number');
    var outFrameExtH = document.querySelector('#output_totalFrameOuterHeight .output-number');

    if (outOpeningW) outOpeningW.textContent = openingW.toFixed(2) + ' in';
    if (outOpeningH) outOpeningH.textContent = openingH.toFixed(2) + ' in';
    if (outOuterW) outOuterW.textContent = matOuterW.toFixed(2) + ' in';
    if (outOuterH) outOuterH.textContent = matOuterH.toFixed(2) + ' in';
    if (outFrameExtW) outFrameExtW.textContent = frameExtW.toFixed(2) + ' in';
    if (outFrameExtH) outFrameExtH.textContent = frameExtH.toFixed(2) + ' in';

    updateChart(artW, artH, openingW, openingH, matOuterW, matOuterH, frameExtW, frameExtH, artArea, matBoardArea);

    if (window.logHistory) {
      window.logHistory('picture-frame-mat-border-calculator', {
        matOpeningWidth: openingW.toFixed(2) + '" x ' + openingH.toFixed(2) + '"',
        matBoardOuterWidth: matOuterW.toFixed(2) + '" x ' + matOuterH.toFixed(2) + '"',
        totalFrameOuterWidth: frameExtW.toFixed(2) + '"',
        totalFrameOuterHeight: frameExtH.toFixed(2) + '"'
      });
    }
  }

  function updateChart(artW, artH, openingW, openingH, matOuterW, matOuterH, frameExtW, frameExtH, artArea, matArea) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'dimensionComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'matAreaBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Artwork Window Opening Area (sq in)', 'Mat Board Border Area (sq in)'],
          datasets: [{
            data: [parseFloat(artArea.toFixed(1)), parseFloat(matArea.toFixed(1))],
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
          labels: ['Artwork Width', 'Mat Opening Cut', 'Glass / Mat Outer', 'Frame Exterior Width'],
          datasets: [{
            label: 'Width (Inches)',
            data: [parseFloat(artW.toFixed(2)), parseFloat(openingW.toFixed(2)), parseFloat(matOuterW.toFixed(2)), parseFloat(frameExtW.toFixed(2))],
            backgroundColor: ['#2563EB', '#2F6F5E', '#C08A2E', '#DC2626']
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
    document.getElementById('input_artworkWidth').value = 8;
    document.getElementById('input_artworkHeight').value = 10;
    document.getElementById('input_matBorderWidth').value = 2;
    document.getElementById('input_overlapAllowance').value = 0.25;
    document.getElementById('input_frameProfileWidth').value = 1.25;
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
