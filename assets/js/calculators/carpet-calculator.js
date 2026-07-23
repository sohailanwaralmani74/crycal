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
    var roomLength = parseFloat(document.getElementById('input_roomLength').value) || 0;
    var roomWidth = parseFloat(document.getElementById('input_roomWidth').value) || 0;
    var rollWidth = parseFloat(document.getElementById('input_rollWidth').value) || 12;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var priceCarpetYd = parseFloat(document.getElementById('input_pricePerSqYd').value) || 0;
    var pricePadYd = parseFloat(document.getElementById('input_pricePaddingSqYd').value) || 0;
    var priceLaborYd = parseFloat(document.getElementById('input_priceInstallSqYd').value) || 0;

    var netSqFt = roomLength * roomWidth;
    var netSqYds = netSqFt / 9;

    var cuts = Math.ceil(roomWidth / rollWidth);
    var linearFeet = cuts * roomLength;
    var rawSqFtOrdered = linearFeet * rollWidth;
    var carpetSqYardsWithWaste = Math.ceil((rawSqFtOrdered * (1 + (wastePct / 100))) / 9);

    var paddingSqYards = Math.ceil((netSqFt * (1 + (wastePct / 100))) / 9);

    var costCarpet = carpetSqYardsWithWaste * priceCarpetYd;
    var costPadding = paddingSqYards * pricePadYd;
    var costLabor = carpetSqYardsWithWaste * priceLaborYd;
    var totalCost = costCarpet + costPadding + costLabor;

    var wasteSqYards = carpetSqYardsWithWaste - Math.round(netSqYds);
    if (wasteSqYards < 0) wasteSqYards = 0;

    var outCarpetYds = document.querySelector('#output_carpetSqYards .output-number');
    var outLF = document.querySelector('#output_rollLinearFeet .output-number');
    var outPadYds = document.querySelector('#output_paddingSqYards .output-number');
    var outCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outCarpetYds) outCarpetYds.textContent = carpetSqYardsWithWaste + ' sq yards';
    if (outLF) outLF.textContent = Math.round(linearFeet) + ' LF (' + rollWidth + '\' roll)';
    if (outPadYds) outPadYds.textContent = paddingSqYards + ' sq yards';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(costCarpet, costPadding, costLabor, netSqYds, wasteSqYards);

    if (window.logHistory) {
      window.logHistory('carpet-calculator', {
        roomLength: roomLength + 'x' + roomWidth + ' ft',
        rollWidth: rollWidth + '\' roll',
        carpetSqYards: carpetSqYardsWithWaste + ' sq yd',
        paddingSqYards: paddingSqYards + ' sq yd',
        totalProjectCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(costCarpet, costPadding, costLabor, netSqYds, wasteSqYards) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'projectCostBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'areaBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Room Area (Sq Yd)', 'Seam & Cut Waste Area (Sq Yd)'],
          datasets: [{
            label: 'Square Yards',
            data: [parseFloat(netSqYds.toFixed(1)), parseFloat(wasteSqYards.toFixed(1))],
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
          labels: ['Carpet Material ', 'Underpad Cushion ', 'Installation Labor '],
          datasets: [{
            data: [parseFloat(costCarpet.toFixed(2)), parseFloat(costPadding.toFixed(2)), parseFloat(costLabor.toFixed(2))],
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
    document.getElementById('input_roomLength').value = 18;
    document.getElementById('input_roomWidth').value = 14;
    document.getElementById('input_rollWidth').value = '12';
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerSqYd').value = 24.50;
    document.getElementById('input_pricePaddingSqYd').value = 5.50;
    document.getElementById('input_priceInstallSqYd').value = 8.00;
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
