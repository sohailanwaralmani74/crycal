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
    var length = parseFloat(document.getElementById('input_slabLengthFeet').value) || 0;
    var width = parseFloat(document.getElementById('input_slabWidthFeet').value) || 0;
    var thicknessInches = parseFloat(document.getElementById('input_slabThicknessInches').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercentage').value) || 0;

    var thicknessFeet = thicknessInches / 12;
    var netCuFt = length * width * thicknessFeet;
    var totalCuFt = netCuFt * (1 + (wastePct / 100));
    var totalCuYd = totalCuFt / 27;

    // 80lb bag yields ~0.60 cu ft; 60lb bag yields ~0.45 cu ft
    var bags80lb = Math.ceil(totalCuFt / 0.60);
    var bags60lb = Math.ceil(totalCuFt / 0.45);

    var outYards = document.querySelector('#output_totalCubicYards .output-number');
    var outCuFt = document.querySelector('#output_totalCubicFeet .output-number');
    var outBags80 = document.querySelector('#output_bags80lbCount .output-number');
    var outBags60 = document.querySelector('#output_bags60lbCount .output-number');

    if (outYards) outYards.textContent = totalCuYd.toFixed(2) + ' cu yd';
    if (outCuFt) outCuFt.textContent = totalCuFt.toFixed(2) + ' cu ft';
    if (outBags80) outBags80.textContent = bags80lb + ' bags';
    if (outBags60) outBags60.textContent = bags60lb + ' bags';

    updateChart(netCuFt, totalCuFt - netCuFt, bags80lb, bags60lb);

    if (window.logHistory) {
      window.logHistory('concrete-yardage-calculator', {
        slabLengthFeet: length + ' ft',
        slabWidthFeet: width + ' ft',
        slabThicknessInches: thicknessInches + ' in',
        totalCubicYards: totalCuYd.toFixed(2) + ' cu yd',
        bags80lbCount: bags80lb + ' bags'
      });
    }
  }

  function updateChart(netCuFt, wasteCuFt, bags80, bags60) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'bagComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['80 lb Pre-Mix Bags', '60 lb Pre-Mix Bags'],
          datasets: [{
            label: 'Total Bags Required',
            data: [bags80, bags60],
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
          labels: ['Net Slab Volume (cu ft)', 'Waste & Overage (cu ft)'],
          datasets: [{
            data: [parseFloat(netCuFt.toFixed(2)), parseFloat(wasteCuFt.toFixed(2))],
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
    document.getElementById('input_slabLengthFeet').value = 20;
    document.getElementById('input_slabWidthFeet').value = 10;
    document.getElementById('input_slabThicknessInches').value = 4;
    document.getElementById('input_wastePercentage').value = 10;
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
