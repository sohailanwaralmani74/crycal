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
    var openingWidth = parseFloat(document.getElementById('input_openingWidth').value) || 0;
    var loadBearing = document.getElementById('input_loadBearing').value || 'one_floor';
    var buildingWidth = parseFloat(document.getElementById('input_buildingWidth').value) || 28;
    var snowLoad = parseFloat(document.getElementById('input_snowLoad').value) || 30;
    var lumberType = document.getElementById('input_lumberType').value || 'double_2x10';

    var baseSpan = 6.4;
    if (lumberType === 'double_2x6') baseSpan = 3.9;
    else if (lumberType === 'double_2x8') baseSpan = 5.25;
    else if (lumberType === 'double_2x10') baseSpan = 6.4;
    else if (lumberType === 'double_2x12') baseSpan = 7.6;
    else if (lumberType === 'triple_2x10') baseSpan = 8.1;
    else if (lumberType === 'triple_2x12') baseSpan = 9.5;
    else if (lumberType === 'lami_lumber') baseSpan = 9.8;
    else if (lumberType === 'lami_lumber_11') baseSpan = 12.5;

    var loadMultiplier = 1.0;
    if (loadBearing === 'non_bearing') {
      loadMultiplier = 1.6;
    } else if (loadBearing === 'two_floor') {
      loadMultiplier = 0.72;
    }

    var widthFactor = Math.sqrt(28 / Math.max(10, buildingWidth));
    var snowFactor = Math.sqrt(30 / Math.max(20, snowLoad));

    var maxSpan = baseSpan * loadMultiplier * widthFactor * snowFactor;

    var tribSpan = buildingWidth / 2;
    var psfLoad = 15 + snowLoad;
    if (loadBearing === 'two_floor') psfLoad += 40;
    if (loadBearing === 'non_bearing') psfLoad = 10;
    var uniformLoadLbsFt = tribSpan * psfLoad;

    var requiredJackStuds = 1;
    if (loadBearing !== 'non_bearing' && (openingWidth > 6.0 || loadBearing === 'two_floor')) {
      requiredJackStuds = 2;
    }
    if (openingWidth > 10.0) {
      requiredJackStuds = 3;
    }

    var statusText = 'PASS — Structurally Adequate';
    if (openingWidth > maxSpan) {
      statusText = 'WARNING — Exceeds Max Span Capacity (Upsize Header)';
    } else if (openingWidth > maxSpan * 0.9) {
      statusText = 'PASS — Approaching Max Span (Check Deflection)';
    }

    var outSpan = document.querySelector('#output_maxAllowableSpan .output-number');
    var outStatus = document.querySelector('#output_structuralStatus .output-number');
    var outLoad = document.querySelector('#output_totalDesignLoad .output-number');
    var outJack = document.querySelector('#output_jackStudRecommendation .output-number');

    if (outSpan) outSpan.textContent = maxSpan.toFixed(1) + ' Feet (' + Math.floor(maxSpan) + ' ft ' + Math.round((maxSpan % 1) * 12) + ' in)';
    if (outStatus) {
      outStatus.textContent = statusText;
      outStatus.style.color = (openingWidth > maxSpan) ? '#D63031' : '#00B894';
    }
    if (outLoad) outLoad.textContent = Math.round(uniformLoadLbsFt) + ' lbs/ft';
    if (outJack) outJack.textContent = requiredJackStuds + ' Jack Studs per side (' + (requiredJackStuds * 2) + ' total)';

    updateChart(openingWidth, maxSpan, uniformLoadLbsFt);

    if (window.logHistory) {
      window.logHistory('header-beam-size-calculator', {
        openingWidth: openingWidth + ' ft',
        loadBearing: loadBearing,
        lumberType: lumberType,
        maxAllowableSpan: maxSpan.toFixed(1) + ' ft',
        structuralStatus: statusText
      });
    }
  }

  function updateChart(openingWidth, maxSpan, uniformLoadLbsFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'spanComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'loadDistribution') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Uniform Lineal Load (lbs/ft)', 'Capacity Reserve Margin'],
          datasets: [{
            data: [
              Math.round(uniformLoadLbsFt),
              Math.max(100, Math.round(uniformLoadLbsFt * (maxSpan / (openingWidth || 1) - 1)))
            ],
            backgroundColor: ['#E67E22', '#2ECC71']
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
          labels: ['Proposed Opening Width', 'Max Allowable Span Capacity'],
          datasets: [{
            label: 'Feet',
            data: [parseFloat(openingWidth.toFixed(1)), parseFloat(maxSpan.toFixed(1))],
            backgroundColor: [ (openingWidth > maxSpan) ? '#E74C3C' : '#3498DB', '#2ECC71']
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
    document.getElementById('input_openingWidth').value = 6.0;
    document.getElementById('input_loadBearing').value = 'one_floor';
    document.getElementById('input_buildingWidth').value = 28;
    document.getElementById('input_snowLoad').value = '30';
    document.getElementById('input_lumberType').value = 'double_2x10';
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
