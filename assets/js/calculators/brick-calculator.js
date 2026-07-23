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
    var wallLength = parseFloat(document.getElementById('input_wallLength').value) || 0;
    var wallHeight = parseFloat(document.getElementById('input_wallHeight').value) || 0;
    var openingArea = parseFloat(document.getElementById('input_openingArea').value) || 0;
    var brickType = document.getElementById('input_brickType').value || 'modular';
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var pricePerBrick = parseFloat(document.getElementById('input_pricePerBrick').value) || 0;
    var pricePerMortarBag = parseFloat(document.getElementById('input_pricePerMortarBag').value) || 0;

    var grossArea = wallLength * wallHeight;
    var netArea = Math.max(0, grossArea - openingArea);

    var bricksPerSqFt = 6.55;
    if (brickType === 'closure') bricksPerSqFt = 4.50;
    else if (brickType === 'utility') bricksPerSqFt = 3.00;
    else if (brickType === 'queen') bricksPerSqFt = 5.80;

    var netBricks = netArea * bricksPerSqFt;
    var totalBricksWithWaste = Math.ceil(netBricks * (1 + (wastePct / 100)));

    // Mortar estimation: ~7 bags of 80lb per 1000 bricks => ~1 bag per 143 bricks
    var mortarBags = Math.ceil(totalBricksWithWaste / 143);

    var costBricks = totalBricksWithWaste * pricePerBrick;
    var costMortar = mortarBags * pricePerMortarBag;
    var totalCost = costBricks + costMortar;

    var outBricks = document.querySelector('#output_totalBricks .output-number');
    var outNetArea = document.querySelector('#output_netWallArea .output-number');
    var outMortar = document.querySelector('#output_mortarBags .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outBricks) outBricks.textContent = totalBricksWithWaste.toLocaleString() + ' bricks';
    if (outNetArea) outNetArea.textContent = netArea.toFixed(1) + ' sq ft';
    if (outMortar) outMortar.textContent = mortarBags + ' bags (80 lb)';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(totalBricksWithWaste, mortarBags, costBricks, costMortar);

    if (window.logHistory) {
      window.logHistory('brick-calculator', {
        wallLength: wallLength + ' x ' + wallHeight + ' ft',
        brickType: brickType,
        totalBricks: totalBricksWithWaste + ' bricks',
        mortarBags: mortarBags + ' bags',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(bricks, mortarBags, costBricks, costMortar) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'brickVsMortar';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Bricks Cost ', 'Mortar Bags Cost '],
          datasets: [{
            data: [parseFloat(costBricks.toFixed(2)), parseFloat(costMortar.toFixed(2))],
            backgroundColor: ['#A5382B', '#2F6F5E']
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
          labels: ['Bricks Count', 'Mortar Bags (80lb)'],
          datasets: [{
            label: 'Quantity',
            data: [bricks, mortarBags],
            backgroundColor: ['#A5382B', '#4A90E2']
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
    document.getElementById('input_wallLength').value = 30;
    document.getElementById('input_wallHeight').value = 8;
    document.getElementById('input_openingArea').value = 21;
    document.getElementById('input_brickType').value = 'modular';
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerBrick').value = 0.85;
    document.getElementById('input_pricePerMortarBag').value = 12.50;
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
