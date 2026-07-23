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
    var linFt = parseFloat(document.getElementById('input_linearFeet').value) || 0;
    var widthIn = parseFloat(document.getElementById('input_jointWidth').value) || 0.25;
    var depthIn = parseFloat(document.getElementById('input_jointDepth').value) || 0.25;
    var tubeSizeOz = parseFloat(document.getElementById('input_tubeSize').value) || 10.1;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 10;
    var tubePrice = parseFloat(document.getElementById('input_tubePrice').value) || 0;

    var jointAreaSqIn = widthIn * depthIn;
    var totalVolCuIn = jointAreaSqIn * (linFt * 12);
    var wasteVolCuIn = totalVolCuIn * (wastePct / 100);
    var grossVolCuIn = totalVolCuIn + wasteVolCuIn;

    // 10.1 oz = 14.6 cu in; 28 oz = 40.5 cu in
    var tubeCuIn = tubeSizeOz === 28.0 ? 40.5 : 14.6;

    var feetPerTube = jointAreaSqIn > 0 ? (tubeCuIn / (jointAreaSqIn * 12)) : 0;
    var tubesNeeded = tubeCuIn > 0 ? Math.ceil(grossVolCuIn / tubeCuIn) : 0;

    var backerRodFt = depthIn > 0.25 || widthIn > 0.375 ? Math.ceil(linFt * 1.05) : 0;
    var totalCost = tubesNeeded * tubePrice;

    var outVol = document.querySelector('#output_totalJointVolumeCuIn .output-number');
    var outFtPerTube = document.querySelector('#output_feetPerTube .output-number');
    var outTubes = document.querySelector('#output_tubesNeeded .output-number');
    var outBacker = document.querySelector('#output_backerRodFeet .output-number');
    var outCost = document.querySelector('#output_totalCaulkCost .output-number');

    if (outVol) outVol.textContent = grossVolCuIn.toFixed(1) + ' cu in (' + totalVolCuIn.toFixed(1) + ' net)';
    if (outFtPerTube) outFtPerTube.textContent = feetPerTube.toFixed(1) + ' ft / tube';
    if (outTubes) outTubes.textContent = tubesNeeded + ' tube(s) (' + tubeSizeOz + ' oz)';
    if (outBacker) outBacker.textContent = backerRodFt > 0 ? backerRodFt + ' linear ft (Recommended)' : '0 ft (Not Needed)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(totalVolCuIn, wasteVolCuIn, linFt, tubeCuIn, depthIn);

    if (window.logHistory) {
      window.logHistory('caulk-calculator', {
        linearFeet: linFt + ' ft',
        jointWidth: widthIn + '"',
        tubesNeeded: tubesNeeded + ' tubes',
        totalCaulkCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netVol, wasteVol, linFt, tubeCuIn, depthIn) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'caulkUsagePerSection';

    var ctx = canvas.getContext('2d');
    if (tabId === 'tubeCountByJointSize') {
      var widths = [0.125, 0.25, 0.375, 0.50];
      var labels = ['1/8"', '1/4"', '3/8"', '1/2"'];
      var tubeCounts = widths.map(function(w) {
        var area = w * depthIn;
        var vol = area * linFt * 12 * 1.10;
        return Math.ceil(vol / tubeCuIn);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Tubes Needed (' + linFt + ' ft run)',
            data: tubeCounts,
            backgroundColor: '#2F6F5E'
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
          labels: ['Net Joint Caulk Volume (cu in)', 'Waste & Over-fill Allowance (cu in)'],
          datasets: [{
            data: [parseFloat(netVol.toFixed(1)), parseFloat(wasteVol.toFixed(1))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_linearFeet').value = 150;
    document.getElementById('input_jointWidth').value = '0.25';
    document.getElementById('input_jointDepth').value = '0.25';
    document.getElementById('input_tubeSize').value = '10.1';
    document.getElementById('input_wasteFactor').value = '10';
    document.getElementById('input_tubePrice').value = 6.50;
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
