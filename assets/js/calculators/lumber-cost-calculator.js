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
    var count = parseFloat(document.getElementById('input_boardCount').value) || 0;
    var length = parseFloat(document.getElementById('input_boardLengthFeet').value) || 0;
    var pricePerLF = parseFloat(document.getElementById('input_pricePerLinearFoot').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;

    var netLF = count * length;
    var costBoard = length * pricePerLF;
    var subtotalCost = netLF * pricePerLF;
    var wasteCost = subtotalCost * (wastePct / 100);
    var totalCost = subtotalCost + wasteCost;
    var wasteLF = netLF * (wastePct / 100);

    var outLF = document.querySelector('#output_totalLinearFeet .output-number');
    var outCostBoard = document.querySelector('#output_costPerBoard .output-number');
    var outSubtotal = document.querySelector('#output_netSubtotalCost .output-number');
    var outTotalCost = document.querySelector('#output_totalCostWithWaste .output-number');

    if (outLF) outLF.textContent = netLF.toFixed(1) + ' LF';
    if (outCostBoard) outCostBoard.textContent = '$' + costBoard.toFixed(2);
    if (outSubtotal) outSubtotal.textContent = '$' + subtotalCost.toFixed(2);
    if (outTotalCost) outTotalCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(subtotalCost, wasteCost, netLF, wasteLF);

    if (window.logHistory) {
      window.logHistory('lumber-cost-calculator', {
        boardCount: count,
        boardLengthFeet: length + ' ft',
        pricePerLinearFoot: '$' + pricePerLF.toFixed(2) + '/LF',
        totalLinearFeet: netLF.toFixed(1) + ' LF',
        netSubtotalCost: '$' + subtotalCost.toFixed(2),
        totalCostWithWaste: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(subtotalCost, wasteCost, netLF, wasteLF) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costComponents';

    var ctx = canvas.getContext('2d');
    if (tabId === 'linearFeetBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Linear Feet (LF)', 'Waste & Trim Overage (LF)'],
          datasets: [{
            data: [parseFloat(netLF.toFixed(1)), parseFloat(wasteLF.toFixed(1))],
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
        type: 'doughnut',
        data: {
          labels: ['Material Subtotal ', 'Waste & Trim Overage '],
          datasets: [{
            data: [parseFloat(subtotalCost.toFixed(2)), parseFloat(wasteCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#B23A3A']
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
    document.getElementById('input_boardCount').value = 25;
    document.getElementById('input_boardLengthFeet').value = 12;
    document.getElementById('input_pricePerLinearFoot').value = 1.25;
    document.getElementById('input_wasteFactor').value = 10;
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
