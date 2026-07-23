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
    var length = parseFloat(document.getElementById('input_roomLength').value) || 0;
    var width = parseFloat(document.getElementById('input_roomWidth').value) || 0;
    var height = parseFloat(document.getElementById('input_wallHeight').value) || 0;
    var doors = parseFloat(document.getElementById('input_doorsCount').value) || 0;
    var windows = parseFloat(document.getElementById('input_windowsCount').value) || 0;
    var incCeiling = document.getElementById('input_includeCeiling').value === 'yes';
    var coats = parseInt(document.getElementById('input_paintCoats').value, 10) || 2;
    var coverage = parseFloat(document.getElementById('input_coveragePerGallon').value) || 350;
    var pricePerGal = parseFloat(document.getElementById('input_pricePerGallon').value) || 0;

    var perimeter = 2 * (length + width);
    var grossWallArea = perimeter * height;
    var ceilingArea = incCeiling ? (length * width) : 0;
    var deductions = (doors * 21) + (windows * 15);
    var netArea = Math.max(0, grossWallArea + ceilingArea - deductions);

    var totalAreaWithCoats = netArea * coats;
    var exactGallons = coverage > 0 ? (totalAreaWithCoats / coverage) : 0;
    var gallons = Math.ceil(exactGallons);
    var quarts = Math.ceil(exactGallons * 4);

    var totalCost = gallons * pricePerGal;

    var outArea = document.querySelector('#output_netPaintableArea .output-number');
    var outGal = document.querySelector('#output_gallonsNeeded .output-number');
    var outQt = document.querySelector('#output_quartsNeeded .output-number');
    var outCost = document.querySelector('#output_totalPaintCost .output-number');

    if (outArea) outArea.textContent = netArea.toFixed(0) + ' sq ft';
    if (outGal) outGal.textContent = gallons + ' gallons (' + exactGallons.toFixed(2) + ' gal exact)';
    if (outQt) outQt.textContent = quarts + ' quarts';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(grossWallArea - (doors * 21 + windows * 15), ceilingArea, deductions, totalCost / Math.max(1, coats), coats);

    if (window.logHistory) {
      window.logHistory('paint-calculator', {
        roomLength: length + 'x' + width + 'x' + height + ' ft',
        paintCoats: coats + ' coats',
        gallonsNeeded: gallons + ' gal',
        totalPaintCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netWallArea, ceilingArea, deductions, costPerCoat, coats) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costByCoat') {
      var coatLabels = coats === 1 ? ['Coat 1 Cost'] : ['Coat 1 Cost', 'Coat 2 Cost'];
      var coatData = coats === 1 ? [costPerCoat] : [costPerCoat, costPerCoat];
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: coatLabels,
          datasets: [{
            label: 'Cost per Coat',
            data: coatData,
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
          labels: ['Net Wall Area (sq ft)', 'Ceiling Area (sq ft)', 'Deductions (Doors/Windows)'],
          datasets: [{
            data: [Math.max(0, netWallArea), ceilingArea, deductions],
            backgroundColor: ['#2F6F5E', '#4A7C59', '#E07A5F']
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
    document.getElementById('input_roomLength').value = 15;
    document.getElementById('input_roomWidth').value = 12;
    document.getElementById('input_wallHeight').value = 8;
    document.getElementById('input_doorsCount').value = 2;
    document.getElementById('input_windowsCount').value = 2;
    document.getElementById('input_includeCeiling').value = 'yes';
    document.getElementById('input_paintCoats').value = '2';
    document.getElementById('input_coveragePerGallon').value = 350;
    document.getElementById('input_pricePerGallon').value = 45.00;
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
