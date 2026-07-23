(function() {
  'use strict';

  var chartInstance = null;

  var STANDARD_RUGS = [
    { name: "3' × 5'", w: 3, l: 5, area: 15 },
    { name: "4' × 6'", w: 4, l: 6, area: 24 },
    { name: "5' × 8'", w: 5, l: 8, area: 40 },
    { name: "6' × 9'", w: 6, l: 9, area: 54 },
    { name: "8' × 10'", w: 8, l: 10, area: 80 },
    { name: "9' × 12'", w: 9, l: 12, area: 108 },
    { name: "10' × 14'", w: 10, l: 14, area: 140 },
    { name: "12' × 15'", w: 12, l: 15, area: 180 }
  ];

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
    var lengthFt = parseFloat(document.getElementById('input_roomLengthFt').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_roomWidthFt').value) || 0;
    var roomType = document.getElementById('input_roomType').value || 'living';
    var borderIn = parseFloat(document.getElementById('input_clearanceBorderIn').value) || 18;

    var borderFt = borderIn / 12;

    var maxLenFt = Math.max(1, lengthFt - (2 * borderFt));
    var maxWidFt = Math.max(1, widthFt - (2 * borderFt));

    var roomAreaSqFt = lengthFt * widthFt;

    // Find best standard rug match
    var bestRug = STANDARD_RUGS[0];
    var bestDiff = 999;

    for (var i = 0; i < STANDARD_RUGS.length; i++) {
      var r = STANDARD_RUGS[i];
      // Check fit (width <= maxWid & length <= maxLen or rotated)
      var fitNormal = (r.w <= maxWidFt + 0.5 && r.l <= maxLenFt + 0.5);
      var fitRotated = (r.l <= maxWidFt + 0.5 && r.w <= maxLenFt + 0.5);

      if (fitNormal || fitRotated) {
        var diff = Math.abs(maxWidFt * maxLenFt - r.area);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestRug = r;
        }
      }
    }

    var rugAreaSqFt = bestRug.area;
    var coveragePct = roomAreaSqFt > 0 ? (rugAreaSqFt / roomAreaSqFt) * 100 : 0;
    var actualBorderIn = ((lengthFt - bestRug.l) * 12) / 2;
    if (actualBorderIn < 0) actualBorderIn = ((widthFt - bestRug.l) * 12) / 2;
    actualBorderIn = Math.max(0, actualBorderIn);

    var outMaxLen = document.querySelector('#output_maxRugLengthFt .output-number');
    var outMaxWid = document.querySelector('#output_maxRugWidthFt .output-number');
    var outRecRug = document.querySelector('#output_recommendedStandardSize .output-number');
    var outCoverage = document.querySelector('#output_coveragePercentage .output-number');
    var outBorder = document.querySelector('#output_actualBorderIn .output-number');

    if (outMaxLen) outMaxLen.textContent = maxLenFt.toFixed(1) + ' ft';
    if (outMaxWid) outMaxWid.textContent = maxWidFt.toFixed(1) + ' ft';
    if (outRecRug) outRecRug.textContent = bestRug.name;
    if (outCoverage) outCoverage.textContent = coveragePct.toFixed(1) + '%';
    if (outBorder) outBorder.textContent = actualBorderIn.toFixed(1) + ' inches';

    updateChart(rugAreaSqFt, Math.max(0, roomAreaSqFt - rugAreaSqFt), lengthFt, widthFt, bestRug.l, bestRug.w);

    if (window.logHistory) {
      window.logHistory('rug-size-calculator', {
        roomLengthFt: lengthFt + ' ft',
        roomWidthFt: widthFt + ' ft',
        recommendedStandardSize: bestRug.name,
        coveragePercentage: coveragePct.toFixed(1) + '%'
      });
    }
  }

  function updateChart(rugArea, bareArea, roomL, roomW, rugL, rugW) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaCoverageChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'dimensionComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Room Length (ft)', 'Rug Length (ft)', 'Room Width (ft)', 'Rug Width (ft)'],
          datasets: [{
            label: 'Feet',
            data: [roomL, rugL, roomW, rugW],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#C08A2E', '#E11D48']
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
          labels: ['Rug Covered Floor Area', 'Exposed Bare Floor Area'],
          datasets: [{
            data: [parseFloat(rugArea.toFixed(1)), parseFloat(bareArea.toFixed(1))],
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
    document.getElementById('input_roomLengthFt').value = 16;
    document.getElementById('input_roomWidthFt').value = 12;
    document.getElementById('input_roomType').value = 'living';
    document.getElementById('input_clearanceBorderIn').value = 18;
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
