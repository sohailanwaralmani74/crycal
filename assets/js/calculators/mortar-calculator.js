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
    var wallArea = parseFloat(document.getElementById('input_wallArea').value) || 0;
    var unitType = document.getElementById('input_unitType').value || 'brick';
    var bagSize = parseFloat(document.getElementById('input_bagSize').value) || 80;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var pricePerBag = parseFloat(document.getElementById('input_pricePerBag').value) || 0;

    var unitCount = 0;
    var netBags80 = 0;

    if (unitType === 'brick') {
      unitCount = Math.ceil(wallArea * 7); // 700 bricks / 100 sq ft = 7 per sq ft
      netBags80 = wallArea * 0.055;
    } else if (unitType === 'cmu8') {
      unitCount = Math.ceil(wallArea * 1.125); // 112.5 blocks / 100 sq ft
      netBags80 = wallArea * 0.0336;
    } else if (unitType === 'cmu12') {
      unitCount = Math.ceil(wallArea * 1.125);
      netBags80 = wallArea * 0.0470;
    }

    // Scale for bag size (70lb vs 80lb)
    var netBags = netBags80 * (80 / bagSize);
    var totalBagsWithWaste = Math.ceil(netBags * (1 + (wastePct / 100)));

    // Cubic feet calculation (80lb = 0.67 cu ft, 70lb = 0.58 cu ft)
    var cuFtPerBag = (bagSize === 70) ? 0.58 : 0.67;
    var totalCubicFeet = netBags * cuFtPerBag;

    var totalCost = totalBagsWithWaste * pricePerBag;
    var wasteBags = totalBagsWithWaste - Math.floor(netBags);
    if (wasteBags < 0) wasteBags = 0;
    var wasteCost = wasteBags * pricePerBag;
    var netCost = netBags * pricePerBag;

    var outBags = document.querySelector('#output_totalBags .output-number');
    var outCuFt = document.querySelector('#output_cubicFeet .output-number');
    var outUnits = document.querySelector('#output_totalUnits .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outBags) outBags.textContent = totalBagsWithWaste + ' bags (' + bagSize + ' lb)';
    if (outCuFt) outCuFt.textContent = totalCubicFeet.toFixed(2) + ' cu ft';
    if (outUnits) outUnits.textContent = unitCount.toLocaleString() + ' units';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netBags, wasteBags, netCost, wasteCost);

    if (window.logHistory) {
      window.logHistory('mortar-calculator', {
        wallArea: wallArea + ' sq ft',
        unitType: unitType,
        totalBags: totalBagsWithWaste + ' bags',
        cubicFeet: totalCubicFeet.toFixed(2) + ' cu ft',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netBags, wasteBags, netCost, wasteCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bagBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Mortar Cost ', 'Waste Allowance Cost '],
          datasets: [{
            data: [parseFloat(netCost.toFixed(2)), parseFloat(wasteCost.toFixed(2))],
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
          labels: ['Net Mortar Bags', 'Waste Bags'],
          datasets: [{
            label: 'Bags',
            data: [parseFloat(netBags.toFixed(1)), parseFloat(wasteBags.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#4A90E2']
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
    document.getElementById('input_wallArea').value = 250;
    document.getElementById('input_unitType').value = 'brick';
    document.getElementById('input_bagSize').value = '80';
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerBag').value = 12.50;
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
