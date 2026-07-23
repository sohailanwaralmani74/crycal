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
    var volumeYards = parseFloat(document.getElementById('input_volumeCubicYards').value) || 0;
    var targetPSI = document.getElementById('input_targetPSI').value || '3000';
    var wastePct = parseFloat(document.getElementById('input_wastePct').value) || 0;
    var cementPrice = parseFloat(document.getElementById('input_cementPrice').value) || 0;
    var sandPrice = parseFloat(document.getElementById('input_sandPrice').value) || 0;
    var gravelPrice = parseFloat(document.getElementById('input_gravelPrice').value) || 0;

    var grossVolume = volumeYards * (1 + (wastePct / 100));

    var cementLbsPerYd = 517;
    var sandLbsPerYd = 1400;
    var gravelLbsPerYd = 1900;
    var waterGalPerYd = 34;

    if (targetPSI === '2500') {
      cementLbsPerYd = 470;
      sandLbsPerYd = 1450;
      gravelLbsPerYd = 1950;
      waterGalPerYd = 32;
    } else if (targetPSI === '4000') {
      cementLbsPerYd = 611;
      sandLbsPerYd = 1300;
      gravelLbsPerYd = 1850;
      waterGalPerYd = 36;
    } else if (targetPSI === '5000') {
      cementLbsPerYd = 752;
      sandLbsPerYd = 1150;
      gravelLbsPerYd = 1800;
      waterGalPerYd = 38;
    }

    var totalCementLbs = grossVolume * cementLbsPerYd;
    var cementBags = Math.ceil(totalCementLbs / 94);
    var sandLbs = grossVolume * sandLbsPerYd;
    var sandTons = sandLbs / 2000;
    var gravelLbs = grossVolume * gravelLbsPerYd;
    var gravelTons = gravelLbs / 2000;
    var waterGallons = Math.round(grossVolume * waterGalPerYd);

    var costCement = cementBags * cementPrice;
    var costSand = sandTons * sandPrice;
    var costGravel = gravelTons * gravelPrice;
    var totalCost = costCement + costSand + costGravel;

    var outCement = document.querySelector('#output_cementBags .output-number');
    var outSand = document.querySelector('#output_sandWeight .output-number');
    var outGravel = document.querySelector('#output_gravelWeight .output-number');
    var outWater = document.querySelector('#output_waterGallons .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outCement) outCement.textContent = cementBags.toLocaleString() + ' bags';
    if (outSand) outSand.textContent = sandTons.toFixed(2) + ' tons (' + Math.round(sandLbs).toLocaleString() + ' lbs)';
    if (outGravel) outGravel.textContent = gravelTons.toFixed(2) + ' tons (' + Math.round(gravelLbs).toLocaleString() + ' lbs)';
    if (outWater) outWater.textContent = waterGallons.toLocaleString() + ' gal';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(totalCementLbs, sandLbs, gravelLbs, costCement, costSand, costGravel);

    if (window.logHistory) {
      window.logHistory('concrete-mix-ratio-calculator', {
        volumeCubicYards: volumeYards + ' cu yd',
        targetPSI: targetPSI + ' PSI',
        cementBags: cementBags + ' bags',
        sandWeight: sandTons.toFixed(2) + ' tons',
        totalMaterialCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(cementLbs, sandLbs, gravelLbs, costCement, costSand, costGravel) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'weightBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Cement Cost ', 'Sand Cost ', 'Gravel Cost '],
          datasets: [{
            data: [parseFloat(costCement.toFixed(2)), parseFloat(costSand.toFixed(2)), parseFloat(costGravel.toFixed(2))],
            backgroundColor: ['#3A6073', '#E65C00', '#78909C']
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
          labels: ['Cement (lbs)', 'Sand (lbs)', 'Gravel (lbs)'],
          datasets: [{
            label: 'Weight (lbs)',
            data: [Math.round(cementLbs), Math.round(sandLbs), Math.round(gravelLbs)],
            backgroundColor: ['#3A6073', '#E65C00', '#78909C']
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
    document.getElementById('input_volumeCubicYards').value = 1;
    document.getElementById('input_targetPSI').value = '3000';
    document.getElementById('input_wastePct').value = 10;
    document.getElementById('input_cementPrice').value = 15.00;
    document.getElementById('input_sandPrice').value = 25.00;
    document.getElementById('input_gravelPrice').value = 30.00;
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
