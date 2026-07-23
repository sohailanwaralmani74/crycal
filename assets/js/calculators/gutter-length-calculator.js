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
    var eaveLength = parseFloat(document.getElementById('input_roofEaveLength').value) || 0;
    var stories = document.getElementById('input_buildingHeightStories').value || '1';
    var spacing = parseFloat(document.getElementById('input_downspoutSpacing').value) || 35;
    var includeGuards = document.getElementById('input_includeGuards').value || 'yes';
    var priceGutter = parseFloat(document.getElementById('input_pricePerFtGutter').value) || 0;
    var priceGuard = parseFloat(document.getElementById('input_pricePerFtGuard').value) || 0;
    var priceDownspout = parseFloat(document.getElementById('input_pricePerDownspout').value) || 0;

    var totalGutterLF = Math.ceil(eaveLength * 1.05); // 5% waste
    var downspouts = Math.max(2, Math.ceil(eaveLength / spacing));

    var totalElbows = downspouts * 3;
    var aElbows = downspouts * 2;
    var bElbows = downspouts * 1;

    var costGutters = totalGutterLF * priceGutter;
    var costDownspouts = downspouts * priceDownspout;
    var costGuards = (includeGuards === 'yes') ? (totalGutterLF * priceGuard) : 0;
    var totalCost = costGutters + costDownspouts + costGuards;

    var outLF = document.querySelector('#output_totalGutterLF .output-number');
    var outDownspouts = document.querySelector('#output_downspoutCount .output-number');
    var outElbows = document.querySelector('#output_elbowCount .output-number');
    var outCost = document.querySelector('#output_totalSystemCost .output-number');

    if (outLF) outLF.textContent = totalGutterLF + ' LF';
    if (outDownspouts) outDownspouts.textContent = downspouts + ' units (' + (stories * 10) + '\' ft height)';
    if (outElbows) outElbows.textContent = totalElbows + ' total (' + aElbows + ' A-Elbows, ' + bElbows + ' B-Elbows)';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(costGutters, costDownspouts, costGuards, aElbows, bElbows);

    if (window.logHistory) {
      window.logHistory('gutter-length-calculator', {
        roofEaveLength: eaveLength + ' ft',
        buildingHeightStories: stories + '-story',
        totalGutterLF: totalGutterLF + ' LF',
        downspoutCount: downspouts + ' downspouts',
        totalSystemCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(costGutters, costDownspouts, costGuards, aElbows, bElbows) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'componentCostBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'elbowBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['A-Style Elbows (Front-Back)', 'B-Style Elbows (Side-Side)'],
          datasets: [{
            label: 'Fittings Count',
            data: [aElbows, bElbows],
            backgroundColor: ['#4A90E2', '#C08A2E']
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
          labels: ['Seamless Gutters ', 'Downspout Assemblies ', 'Gutter Guards '],
          datasets: [{
            data: [parseFloat(costGutters.toFixed(2)), parseFloat(costDownspouts.toFixed(2)), parseFloat(costGuards.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#4A90E2', '#C08A2E']
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
    document.getElementById('input_roofEaveLength').value = 150;
    document.getElementById('input_buildingHeightStories').value = '1';
    document.getElementById('input_downspoutSpacing').value = 35;
    document.getElementById('input_includeGuards').value = 'yes';
    document.getElementById('input_pricePerFtGutter').value = 6.50;
    document.getElementById('input_pricePerFtGuard').value = 3.50;
    document.getElementById('input_pricePerDownspout').value = 28.00;
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
