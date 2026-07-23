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

  function getCoverageRate(sidingType) {
    switch (sidingType) {
      case 'smooth_vinyl': return 400;
      case 'rough_stucco': return 250;
      case 'brick_masonry': return 200;
      case 'fiber_cement': return 350;
      case 'wood_clapboard':
      default: return 350;
    }
  }

  function calculate() {
    var grossArea = parseFloat(document.getElementById('input_sidingAreaSqFt').value) || 0;
    var openArea = parseFloat(document.getElementById('input_openingsSqFt').value) || 0;
    var sidingType = document.getElementById('input_sidingType').value;
    var trimFeet = parseFloat(document.getElementById('input_soffitTrimFeet').value) || 0;
    var coats = parseInt(document.getElementById('input_coatCount').value, 10) || 2;
    var pricePerGal = parseFloat(document.getElementById('input_paintPricePerGal').value) || 0;

    var netSidingArea = Math.max(0, grossArea - openArea);
    var trimArea = trimFeet * 1.0;
    var coverageRate = getCoverageRate(sidingType);

    var rawBodyGal = (netSidingArea / coverageRate) * coats;
    var rawTrimGal = (trimArea / 350) * coats;

    var bodyGal = Math.ceil(rawBodyGal);
    var trimGal = Math.ceil(rawTrimGal);
    var totalGal = bodyGal + trimGal;
    var totalCost = totalGal * pricePerGal;

    var outNetArea = document.querySelector('#output_netSidingArea .output-number');
    var outTrimArea = document.querySelector('#output_soffitTrimArea .output-number');
    var outTotalGal = document.querySelector('#output_totalPaintGallons .output-number');
    var outBodyGal = document.querySelector('#output_bodyPaintGallons .output-number');
    var outTrimGal = document.querySelector('#output_trimPaintGallons .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outNetArea) outNetArea.textContent = netSidingArea.toLocaleString() + ' sq ft';
    if (outTrimArea) outTrimArea.textContent = trimArea.toLocaleString() + ' sq ft';
    if (outTotalGal) outTotalGal.textContent = totalGal + ' gal (' + totalGal + ' cans)';
    if (outBodyGal) outBodyGal.textContent = bodyGal + ' gal (' + rawBodyGal.toFixed(1) + ' actual)';
    if (outTrimGal) outTrimGal.textContent = trimGal + ' gal (' + rawTrimGal.toFixed(1) + ' actual)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(bodyGal, trimGal, (netSidingArea / coverageRate), coats);

    if (window.logHistory) {
      window.logHistory('exterior-siding-paint-calculator', {
        netSidingArea: netSidingArea + ' sq ft',
        coatCount: coats + ' coats',
        totalPaintGallons: totalGal + ' gal',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(bodyGal, trimGal, galPerCoat, coats) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'paintVolumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'coverageByCoat') {
      var coatLabels = [];
      var coatData = [];
      for (var i = 1; i <= coats; i++) {
        coatLabels.push('Coat ' + i);
        coatData.push(parseFloat(galPerCoat.toFixed(1)));
      }
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: coatLabels,
          datasets: [{
            label: 'Body Paint Volume (Gallons)',
            data: coatData,
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
          labels: ['Siding Body Paint (Gallons)', 'Trim & Soffit Paint (Gallons)'],
          datasets: [{
            data: [bodyGal, trimGal],
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
    document.getElementById('input_sidingAreaSqFt').value = 1800;
    document.getElementById('input_openingsSqFt').value = 200;
    document.getElementById('input_sidingType').value = 'wood_clapboard';
    document.getElementById('input_soffitTrimFeet').value = 150;
    document.getElementById('input_coatCount').value = '2';
    document.getElementById('input_paintPricePerGal').value = 45.00;
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
