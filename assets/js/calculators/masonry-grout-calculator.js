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
    var blockCount = parseFloat(document.getElementById('input_blockCount').value) || 0;
    var blockSize = document.getElementById('input_blockSize').value || '8inch';
    var groutSpacing = document.getElementById('input_groutSpacing').value || 'full';
    var wastePct = parseFloat(document.getElementById('input_wastePct').value) || 0;
    var pricePer80lbBag = parseFloat(document.getElementById('input_pricePer80lbBag').value) || 0;

    var coreVolPerBlock = 0.28;
    if (blockSize === '6inch') coreVolPerBlock = 0.16;
    else if (blockSize === '10inch') coreVolPerBlock = 0.38;
    else if (blockSize === '12inch') coreVolPerBlock = 0.47;

    var spacingFactor = 1.0;
    if (groutSpacing === '16inch') spacingFactor = 0.50;
    else if (groutSpacing === '24inch') spacingFactor = 0.333;
    else if (groutSpacing === '32inch') spacingFactor = 0.25;
    else if (groutSpacing === '48inch') spacingFactor = 0.167;

    var filledCoresCount = Math.ceil(blockCount * spacingFactor);

    var netCubicFeet = filledCoresCount * coreVolPerBlock;
    var grossCubicFeet = netCubicFeet * (1 + (wastePct / 100));
    var grossCubicYards = grossCubicFeet / 27;

    var bags80lb = Math.ceil(grossCubicFeet * 1.50);

    var totalCost = bags80lb * pricePer80lbBag;

    var outYards = document.querySelector('#output_totalCubicYards .output-number');
    var outFeet = document.querySelector('#output_totalCubicFeet .output-number');
    var outBags = document.querySelector('#output_bags80lb .output-number');
    var outCores = document.querySelector('#output_filledCores .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outYards) outYards.textContent = grossCubicYards.toFixed(2) + ' cu yds';
    if (outFeet) outFeet.textContent = grossCubicFeet.toFixed(1) + ' cu ft';
    if (outBags) outBags.textContent = bags80lb.toLocaleString() + ' bags';
    if (outCores) outCores.textContent = filledCoresCount.toLocaleString() + ' blocks';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netCubicFeet, grossCubicFeet - netCubicFeet, totalCost);

    if (window.logHistory) {
      window.logHistory('masonry-grout-calculator', {
        blockCount: blockCount + ' blocks (' + blockSize + ')',
        totalCubicYards: grossCubicYards.toFixed(2) + ' cu yds',
        bags80lb: bags80lb + ' bags',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netCuFt, wasteCuFt, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Core Grout ', 'Waste Allowance '],
          datasets: [{
            data: [
              parseFloat((netCuFt * (totalCost / ((netCuFt + wasteCuFt) || 1))).toFixed(2)),
              parseFloat((wasteCuFt * (totalCost / ((netCuFt + wasteCuFt) || 1))).toFixed(2))
            ],
            backgroundColor: ['#27AE60', '#F39C12']
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
          labels: ['Net Grout (Cu Ft)', 'Waste Allowance (Cu Ft)'],
          datasets: [{
            label: 'Volume (Cu Ft)',
            data: [parseFloat(netCuFt.toFixed(1)), parseFloat(wasteCuFt.toFixed(1))],
            backgroundColor: ['#27AE60', '#F39C12']
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
    document.getElementById('input_blockCount').value = 500;
    document.getElementById('input_blockSize').value = '8inch';
    document.getElementById('input_groutSpacing').value = 'full';
    document.getElementById('input_wastePct').value = 10;
    document.getElementById('input_pricePer80lbBag').value = 9.50;
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
