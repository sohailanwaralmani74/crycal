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
    var winWidthIn = parseFloat(document.getElementById('input_windowWidthIn').value) || 0;
    var winHeightIn = parseFloat(document.getElementById('input_windowHeightIn').value) || 0;
    var fullness = parseFloat(document.getElementById('input_fullnessRatio').value) || 2.0;
    var boltWidthIn = parseFloat(document.getElementById('input_fabricWidthIn').value) || 54;
    var repeatIn = parseFloat(document.getElementById('input_patternRepeatIn').value) || 0;
    var hemAllowanceIn = parseFloat(document.getElementById('input_hemHeaderAllowanceIn').value) || 16;

    var totalGatheredWidthIn = winWidthIn * fullness;
    var panelsCount = Math.ceil(totalGatheredWidthIn / boltWidthIn);

    var baseCutLength = winHeightIn + hemAllowanceIn;
    var adjustedCutLength = baseCutLength;

    if (repeatIn > 0) {
      var repeatsPerPanel = Math.ceil(baseCutLength / repeatIn);
      adjustedCutLength = repeatsPerPanel * repeatIn;
    }

    var totalInches = panelsCount * adjustedCutLength;
    var totalYards = totalInches / 36;
    var totalMeters = totalYards * 0.9144;

    var outWidth = document.querySelector('#output_totalCurtainWidthIn .output-number');
    var outPanels = document.querySelector('#output_numberOfPanels .output-number');
    var outCutLength = document.querySelector('#output_cutLengthIn .output-number');
    var outYards = document.querySelector('#output_totalFabricYards .output-number');
    var outMeters = document.querySelector('#output_totalFabricMeters .output-number');

    if (outWidth) outWidth.textContent = totalGatheredWidthIn.toFixed(0) + ' inches';
    if (outPanels) outPanels.textContent = panelsCount + ' Panels';
    if (outCutLength) outCutLength.textContent = adjustedCutLength.toFixed(1) + ' inches';
    if (outYards) outYards.textContent = totalYards.toFixed(2) + ' yards';
    if (outMeters) outMeters.textContent = totalMeters.toFixed(2) + ' meters';

    updateChart(winHeightIn, hemAllowanceIn, (adjustedCutLength - baseCutLength), winWidthIn, totalGatheredWidthIn);

    if (window.logHistory) {
      window.logHistory('curtain-drape-fabric-calculator', {
        windowWidthIn: winWidthIn + ' in',
        windowHeightIn: winHeightIn + ' in',
        numberOfPanels: panelsCount + ' Panels',
        totalFabricYards: totalYards.toFixed(2) + ' Yards'
      });
    }
  }

  function updateChart(finishedHeight, hemAllowance, repeatWaste, flatWidth, gatheredWidth) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'fabricUsageChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'fullnessComparison') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Flat Window Width', 'Added Gathered Fullness'],
          datasets: [{
            data: [flatWidth, Math.max(0, gatheredWidth - flatWidth)],
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
          labels: ['Finished Length', 'Header & Hem Allowance', 'Pattern Repeat Match Waste'],
          datasets: [{
            label: 'Inches per Panel',
            data: [finishedHeight, hemAllowance, Math.max(0, repeatWaste)],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
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
    document.getElementById('input_windowWidthIn').value = 60;
    document.getElementById('input_windowHeightIn').value = 84;
    document.getElementById('input_fullnessRatio').value = "2.0";
    document.getElementById('input_fabricWidthIn').value = "54";
    document.getElementById('input_patternRepeatIn').value = 0;
    document.getElementById('input_hemHeaderAllowanceIn').value = 16;
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
