(function() {
  'use strict';

  var chartInstance = null;

  function getGlobalCurrency() {
    var picker = document.getElementById('globalCurrencyPicker');
    return picker ? picker.value : 'USD';
  }

  function formatCurrency(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(2);
    }
  }

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

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var r1L = parseFloat(document.getElementById('input_room1LengthFt').value) || 0;
    var r1W = parseFloat(document.getElementById('input_room1WidthFt').value) || 0;
    var r2L = parseFloat(document.getElementById('input_room2LengthFt').value) || 0;
    var r2W = parseFloat(document.getElementById('input_room2WidthFt').value) || 0;
    var r3L = parseFloat(document.getElementById('input_room3LengthFt').value) || 0;
    var r3W = parseFloat(document.getElementById('input_room3WidthFt').value) || 0;

    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;
    var pricePerSqFt = parseFloat(document.getElementById('input_costPerSqFt').value) || 0;

    var area1 = r1L * r1W;
    var area2 = r2L * r2W;
    var area3 = r3L * r3W;

    var netSqFt = area1 + area2 + area3;
    var grossSqFt = netSqFt * (1 + (wastePct / 100));
    var sqYards = grossSqFt / 9;
    var totalCost = grossSqFt * pricePerSqFt;

    var outNet = document.querySelector('#output_netSquareFootage .output-number');
    var outGross = document.querySelector('#output_grossSquareFootage .output-number');
    var outYards = document.querySelector('#output_totalYardsSquare .output-number');
    var outCost = document.querySelector('#output_totalFlooringCost .output-number');

    if (outNet) outNet.textContent = netSqFt.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' sq ft';
    if (outGross) outGross.textContent = grossSqFt.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' sq ft';
    if (outYards) outYards.textContent = sqYards.toFixed(2) + ' sq yd';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(area1, area2, area3, netSqFt, grossSqFt - netSqFt, totalCost);

    if (window.logHistory) {
      window.logHistory('room-square-footage-calculator', {
        room1LengthFt: r1L + ' ft',
        room1WidthFt: r1W + ' ft',
        netSquareFootage: netSqFt.toFixed(1) + ' sq ft',
        grossSquareFootage: grossSqFt.toFixed(1) + ' sq ft',
        totalFlooringCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(a1, a2, a3, netArea, wasteArea, cost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'roomAreaDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'wasteCostTab') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Net Area (sq ft)', 'Waste Overage Area (sq ft)'],
          datasets: [{
            label: 'Square Feet',
            data: [parseFloat(netArea.toFixed(1)), parseFloat(wasteArea.toFixed(1))],
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
          labels: ['Section 1 (Main Area)', 'Section 2 (Alcove)', 'Section 3 (Closet/Hall)'],
          datasets: [{
            data: [
              parseFloat(a1.toFixed(1)),
              parseFloat(a2.toFixed(1)),
              parseFloat(a3.toFixed(1))
            ],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#C08A2E']
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
    document.getElementById('input_room1LengthFt').value = 15;
    document.getElementById('input_room1WidthFt').value = 12;
    document.getElementById('input_room2LengthFt').value = 10;
    document.getElementById('input_room2WidthFt').value = 8;
    document.getElementById('input_room3LengthFt').value = 6;
    document.getElementById('input_room3WidthFt').value = 4;
    document.getElementById('input_wastePercentage').value = 10;
    document.getElementById('input_costPerSqFt').value = 4.50;
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
