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
    var lengthFt = parseFloat(document.getElementById('input_trenchLengthFeet').value) || 0;
    var widthIn = parseFloat(document.getElementById('input_trenchWidthInches').value) || 12;
    var depthIn = parseFloat(document.getElementById('input_trenchDepthInches').value) || 24;
    var pipeDiamIn = parseFloat(document.getElementById('input_pipeDiameterInches').value) || 4;
    var gravelPriceCuYd = parseFloat(document.getElementById('input_gravelPricePerCuYd').value) || 0;
    var fabricPriceRoll = parseFloat(document.getElementById('input_fabricPricePerRoll').value) || 0;
    var pipePriceFt = parseFloat(document.getElementById('input_pipePricePerFoot').value) || 0;

    var pipeFeetNeeded = Math.ceil(lengthFt * 1.05);

    var grossCuFt = lengthFt * (widthIn / 12.0) * (depthIn / 12.0);
    var pipeRadiusFt = (pipeDiamIn / 2.0) / 12.0;
    var pipeDisplacementCuFt = Math.PI * (pipeRadiusFt * pipeRadiusFt) * lengthFt;

    var netGravelCuFt = Math.max(0, grossCuFt - pipeDisplacementCuFt) * 1.10; // 10% compaction
    var gravelCuYds = netGravelCuFt / 27.0;
    var gravelTons = gravelCuYds * 1.35;

    var fabricPerimeterFt = (2 * (widthIn / 12.0)) + (2 * (depthIn / 12.0)) + 1.0; // 1ft overlap
    var fabricSqFt = fabricPerimeterFt * lengthFt;
    var fabricRolls = Math.ceil(fabricSqFt / 300.0);

    var grossExcavationCuYds = grossCuFt / 27.0;

    var pipeCost = pipeFeetNeeded * pipePriceFt;
    var gravelCost = gravelCuYds * gravelPriceCuYd;
    var fabricCost = fabricRolls * fabricPriceRoll;
    var totalCost = pipeCost + gravelCost + fabricCost;

    var outPipe = document.querySelector('#output_drainPipeFeet .output-number');
    var outGravel = document.querySelector('#output_gravelVolumeCuYds .output-number');
    var outFabric = document.querySelector('#output_filterFabricSqFt .output-number');
    var outExca = document.querySelector('#output_totalExcavationVolume .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outPipe) outPipe.textContent = pipeFeetNeeded + ' linear ft (' + pipeDiamIn + '" perforated)';
    if (outGravel) outGravel.textContent = gravelCuYds.toFixed(2) + ' cu yds (' + gravelTons.toFixed(2) + ' tons #57 stone)';
    if (outFabric) outFabric.textContent = Math.round(fabricSqFt) + ' sq ft (' + fabricRolls + ' roll(s) @ 300 sq ft)';
    if (outExca) outExca.textContent = grossExcavationCuYds.toFixed(2) + ' cu yds dirt';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(gravelCost, pipeCost, fabricCost, gravelCuYds, lengthFt, widthIn);

    if (window.logHistory) {
      window.logHistory('french-drain-calculator', {
        trenchLengthFeet: lengthFt + ' ft',
        trenchDepthInches: depthIn + '"',
        gravelVolumeCuYds: gravelCuYds.toFixed(2) + ' cu yd',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(gravelCost, pipeCost, fabricCost, gravelCuYds, lengthFt, widthIn) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialCostBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'backfillVolumeByTrenchDepth') {
      var depths = [18, 24, 30, 36];
      var labels = ['18" Deep', '24" Deep', '30" Deep', '36" Deep'];
      var volumes = depths.map(function(d) {
        var gross = lengthFt * (widthIn / 12.0) * (d / 12.0);
        return parseFloat(((gross * 0.90 * 1.10) / 27.0).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Gravel Volume (Cubic Yards)',
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
          labels: ['Washed Gravel #57 Stone', 'Perforated Drain Pipe', 'Geotextile Filter Fabric'],
          datasets: [{
            data: [
              parseFloat(gravelCost.toFixed(2)),
              parseFloat(pipeCost.toFixed(2)),
              parseFloat(fabricCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59']
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
    document.getElementById('input_trenchLengthFeet').value = 50;
    document.getElementById('input_trenchWidthInches').value = '12';
    document.getElementById('input_trenchDepthInches').value = '24';
    document.getElementById('input_pipeDiameterInches').value = '4';
    document.getElementById('input_gravelPricePerCuYd').value = 48.00;
    document.getElementById('input_fabricPricePerRoll').value = 45.00;
    document.getElementById('input_pipePricePerFoot').value = 1.85;
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
