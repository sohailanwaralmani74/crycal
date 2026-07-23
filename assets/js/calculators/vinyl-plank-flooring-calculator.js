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
    var roomArea = parseFloat(document.getElementById('input_roomAreaSqFt').value) || 0;
    var sqFtPerCarton = parseFloat(document.getElementById('input_sqFtPerCarton').value) || 24;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 10;
    var transitions = parseInt(document.getElementById('input_doorwayTransitions').value, 10) || 0;
    var priceCarton = parseFloat(document.getElementById('input_pricePerCarton').value) || 0;
    var priceTransition = parseFloat(document.getElementById('input_pricePerTransition').value) || 0;
    var underlaymentRate = parseFloat(document.getElementById('input_underlaymentCostPerSqFt').value) || 0;

    var areaNeeded = roomArea * (1 + (wastePct / 100));
    var totalCartons = Math.ceil(areaNeeded / sqFtPerCarton);
    var purchasedSqFt = totalCartons * sqFtPerCarton;

    var costFlooring = totalCartons * priceCarton;
    var costUnderlayment = purchasedSqFt * underlaymentRate;
    var costTransitions = transitions * priceTransition;
    var totalCost = costFlooring + costUnderlayment + costTransitions;

    var wasteSqFt = purchasedSqFt - roomArea;
    if (wasteSqFt < 0) wasteSqFt = 0;

    var outCartons = document.querySelector('#output_totalCartons .output-number');
    var outPurchased = document.querySelector('#output_purchasedSqFt .output-number');
    var outTransitions = document.querySelector('#output_transitionCount .output-number');
    var outCost = document.querySelector('#output_totalProjectCost .output-number');

    if (outCartons) outCartons.textContent = totalCartons + ' cartons (' + sqFtPerCarton + ' sq ft / box)';
    if (outPurchased) outPurchased.textContent = purchasedSqFt.toFixed(1) + ' sq ft';
    if (outTransitions) outTransitions.textContent = transitions + ' transition strips';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(costFlooring, costUnderlayment, costTransitions, roomArea, wasteSqFt);

    if (window.logHistory) {
      window.logHistory('vinyl-plank-flooring-calculator', {
        roomAreaSqFt: roomArea + ' sq ft',
        wasteFactor: wastePct + '%',
        totalCartons: totalCartons + ' cartons',
        purchasedSqFt: purchasedSqFt.toFixed(1) + ' sq ft',
        totalProjectCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(costFlooring, costUnderlayment, costTransitions, roomArea, wasteSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'sqFtBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Room Area (Sq Ft)', 'Purchased Waste & Overhang Area (Sq Ft)'],
          datasets: [{
            label: 'Square Feet',
            data: [roomArea, parseFloat(wasteSqFt.toFixed(1))],
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
          labels: ['LVP Flooring Cartons ', 'Underlayment Cushion ', 'Transition Strips '],
          datasets: [{
            data: [parseFloat(costFlooring.toFixed(2)), parseFloat(costUnderlayment.toFixed(2)), parseFloat(costTransitions.toFixed(2))],
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
    document.getElementById('input_roomAreaSqFt').value = 450;
    document.getElementById('input_sqFtPerCarton').value = 24;
    document.getElementById('input_wasteFactor').value = '10';
    document.getElementById('input_doorwayTransitions').value = 3;
    document.getElementById('input_pricePerCarton').value = 68.00;
    document.getElementById('input_pricePerTransition').value = 22.00;
    document.getElementById('input_underlaymentCostPerSqFt').value = 0.60;
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
