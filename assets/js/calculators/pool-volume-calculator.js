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

    var shapeSelect = document.getElementById('input_poolShape');
    if (shapeSelect) {
      shapeSelect.addEventListener('change', toggleWidthVisibility);
      toggleWidthVisibility();
    }

    calculate();
  }

  function toggleWidthVisibility() {
    var shape = document.getElementById('input_poolShape').value;
    var widthInput = document.getElementById('input_widthFt');
    if (!widthInput) return;
    var container = widthInput.closest('.input-group') || widthInput.parentElement;

    if (shape === 'round') {
      if (container) container.style.opacity = '0.5';
      widthInput.disabled = true;
    } else {
      if (container) container.style.opacity = '1';
      widthInput.disabled = false;
    }
  }

  function calculate() {
    var shape = document.getElementById('input_poolShape').value;
    var lengthFt = parseFloat(document.getElementById('input_lengthFt').value) || 0;
    var widthFt = parseFloat(document.getElementById('input_widthFt').value) || 0;
    var shallowDepth = parseFloat(document.getElementById('input_shallowDepthFt').value) || 0;
    var deepDepth = parseFloat(document.getElementById('input_deepDepthFt').value) || 0;

    var avgDepth = (shallowDepth + deepDepth) / 2;
    var volumeCuFt = 0;

    if (shape === 'round') {
      var radius = lengthFt / 2;
      volumeCuFt = Math.PI * Math.pow(radius, 2) * avgDepth;
    } else if (shape === 'oval') {
      var radiusL = lengthFt / 2;
      var radiusW = widthFt / 2;
      volumeCuFt = Math.PI * radiusL * radiusW * avgDepth;
    } else {
      // rectangular
      volumeCuFt = lengthFt * widthFt * avgDepth;
    }

    var gallons = volumeCuFt * 7.48052;
    var liters = gallons * 3.78541;
    var waterWeightLbs = gallons * 8.34;

    var outGallons = document.querySelector('#output_volumeGallons .output-number');
    var outLiters = document.querySelector('#output_volumeLiters .output-number');
    var outAvgDepth = document.querySelector('#output_avgDepthFt .output-number');
    var outWeight = document.querySelector('#output_waterWeightLbs .output-number');

    if (outGallons) outGallons.textContent = Math.round(gallons).toLocaleString() + ' Gal';
    if (outLiters) outLiters.textContent = Math.round(liters).toLocaleString() + ' L';
    if (outAvgDepth) outAvgDepth.textContent = avgDepth.toFixed(1) + ' ft';
    if (outWeight) outWeight.textContent = Math.round(waterWeightLbs).toLocaleString() + ' lbs';

    updateChart(gallons, liters, shallowDepth, deepDepth, avgDepth);

    if (window.logHistory) {
      window.logHistory('pool-volume-calculator', {
        poolShape: shape.charAt(0).toUpperCase() + shape.slice(1),
        lengthFt: lengthFt + ' ft',
        volumeGallons: Math.round(gallons).toLocaleString() + ' Gal',
        volumeLiters: Math.round(liters).toLocaleString() + ' L'
      });
    }
  }

  function updateChart(gallons, liters, shallow, deep, avg) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeUnits';

    var ctx = canvas.getContext('2d');
    if (tabId === 'depthProfile') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Shallow End (ft)', 'Deep End (ft)', 'Average Depth (ft)'],
          datasets: [{
            label: 'Depth in Feet',
            data: [shallow, deep, parseFloat(avg.toFixed(1))],
            backgroundColor: ['#4BC0C0', '#36A2EB', '#2F6F5E']
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
        type: 'bar',
        data: {
          labels: ['US Gallons', 'Liters'],
          datasets: [{
            label: 'Pool Capacity',
            data: [Math.round(gallons), Math.round(liters)],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_poolShape').value = 'rectangular';
    document.getElementById('input_lengthFt').value = 32;
    document.getElementById('input_widthFt').value = 16;
    document.getElementById('input_shallowDepthFt').value = 3;
    document.getElementById('input_deepDepthFt').value = 8;
    toggleWidthVisibility();
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
