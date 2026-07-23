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
    var length = parseFloat(document.getElementById('input_tubLengthFeet').value) || 0;
    var width = parseFloat(document.getElementById('input_tubWidthFeet').value) || 0;
    var overhangIn = parseFloat(document.getElementById('input_overhangMarginInches').value) || 12;
    var thickIn = parseFloat(document.getElementById('input_slabThicknessInches').value) || 6;
    var dryWeight = parseFloat(document.getElementById('input_dryTubWeightLbs').value) || 0;
    var gallons = parseFloat(document.getElementById('input_waterCapacityGallons').value) || 0;
    var bathers = parseInt(document.getElementById('input_batherCount').value, 10) || 0;
    var concretePriceCuYd = parseFloat(document.getElementById('input_concretePricePerCuYd').value) || 0;

    var padL = length + (2 * (overhangIn / 12.0));
    var padW = width + (2 * (overhangIn / 12.0));
    var padSqFt = padL * padW;

    var netCuFt = padSqFt * (thickIn / 12.0);
    var grossCuFt = netCuFt * 1.08; // 8% waste
    var cuYds = grossCuFt / 27.0;
    var bags80lb = Math.ceil(grossCuFt / 0.60); // 80lb bag yields 0.60 cu ft

    var waterWeight = gallons * 8.34;
    var batherWeight = bathers * 175.0;
    var totalOperatingWeight = dryWeight + waterWeight + batherWeight;

    // Concrete weight ~ 145 lbs/cu ft
    var slabWeightLbs = netCuFt * 145.0;
    var grandTotalWeightLbs = totalOperatingWeight + slabWeightLbs;

    var soilBearingPsf = padSqFt > 0 ? (grandTotalWeightLbs / padSqFt) : 0;
    var soilBearingPsi = soilBearingPsf / 144.0;

    var totalCost = cuYds * concretePriceCuYd;

    var outPadDim = document.querySelector('#output_padDimensions .output-number');
    var outCuYds = document.querySelector('#output_concreteVolumeCuYds .output-number');
    var outBags = document.querySelector('#output_concreteBags80lb .output-number');
    var outWeight = document.querySelector('#output_totalFilledWeightLbs .output-number');
    var outPsf = document.querySelector('#output_soilBearingPsf .output-number');
    var outCost = document.querySelector('#output_totalConcreteCost .output-number');

    if (outPadDim) outPadDim.textContent = padL.toFixed(1) + '\' × ' + padW.toFixed(1) + '\' (' + Math.round(padSqFt) + ' sq ft)';
    if (outCuYds) outCuYds.textContent = cuYds.toFixed(2) + ' cu yds (' + thickIn + '" thickness)';
    if (outBags) outBags.textContent = bags80lb + ' bags (80 lb ea)';
    if (outWeight) outWeight.textContent = Math.round(totalOperatingWeight).toLocaleString() + ' lbs (' + (totalOperatingWeight / 2000.0).toFixed(2) + ' tons)';
    if (outPsf) outPsf.textContent = Math.round(soilBearingPsf) + ' PSF (' + soilBearingPsi.toFixed(2) + ' PSI) — Safe for Soil';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(dryWeight, waterWeight, batherWeight, slabWeightLbs, thickIn, padSqFt);

    if (window.logHistory) {
      window.logHistory('hot-tub-pad-size-calculator', {
        padDimensions: padL.toFixed(1) + '\' × ' + padW.toFixed(1) + '\'',
        slabThicknessInches: thickIn + '"',
        concreteVolumeCuYds: cuYds.toFixed(2) + ' cu yd',
        totalFilledWeightLbs: Math.round(totalOperatingWeight) + ' lbs'
      });
    }
  }

  function updateChart(dryWeight, waterWeight, batherWeight, slabWeight, thickIn, padSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'weightDistributionBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'volumeBySlabThickness') {
      var thicknesses = [4, 5, 6];
      var labels = ['4" Slab', '5" Slab', '6" Slab'];
      var volumes = thicknesses.map(function(t) {
        return parseFloat(((padSqFt * (t / 12.0) * 1.08) / 27.0).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Concrete Volume (Cubic Yards)',
            data: volumes,
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
          labels: ['Dry Hot Tub Shell', 'Water Weight', 'Bathers Load', 'Concrete Slab Weight'],
          datasets: [{
            data: [
              Math.round(dryWeight),
              Math.round(waterWeight),
              Math.round(batherWeight),
              Math.round(slabWeight)
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59', '#D9A74A']
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
    document.getElementById('input_tubLengthFeet').value = 7.0;
    document.getElementById('input_tubWidthFeet').value = 7.0;
    document.getElementById('input_overhangMarginInches').value = '12';
    document.getElementById('input_slabThicknessInches').value = '6';
    document.getElementById('input_dryTubWeightLbs').value = 800;
    document.getElementById('input_waterCapacityGallons').value = 400;
    document.getElementById('input_batherCount').value = 6;
    document.getElementById('input_concretePricePerCuYd').value = 165.00;
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
