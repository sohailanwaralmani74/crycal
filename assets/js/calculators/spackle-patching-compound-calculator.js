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
    var smallHoles = parseInt(document.getElementById('input_smallHolesCount').value, 10) || 0;
    var medHoles = parseInt(document.getElementById('input_mediumHolesCount').value, 10) || 0;
    var largePatchSqFt = parseFloat(document.getElementById('input_largePatchAreaSqFt').value) || 0;
    var seamFeet = parseFloat(document.getElementById('input_jointTouchupFeet').value) || 0;
    var sizeMult = parseFloat(document.getElementById('input_containerSize').value) || 1.0;
    var containerPrice = parseFloat(document.getElementById('input_containerPrice').value) || 0;

    var smallVol = smallHoles * 0.05;
    var medVol = medHoles * 0.75;
    var largeVol = largePatchSqFt * 6.0;
    var seamVol = seamFeet * 0.25;

    var rawFlOz = (smallVol + medVol + largeVol + seamVol) * 1.20;
    if (rawFlOz === 0) rawFlOz = 0;

    var containerFlOz = sizeMult * 16.0; // 1.0 mult = 1 pint = 16 fl oz
    var tubsNeeded = containerFlOz > 0 ? Math.ceil(rawFlOz / containerFlOz) : 0;
    var totalCost = tubsNeeded * containerPrice;

    var sandingSponges = Math.max(1, Math.ceil(rawFlOz / 16.0));

    var quartsVal = rawFlOz / 32.0;
    var pintsVal = rawFlOz / 16.0;

    var outFlOz = document.querySelector('#output_totalVolumeFlOz .output-number');
    var outQt = document.querySelector('#output_totalVolumeQuarts .output-number');
    var outTubs = document.querySelector('#output_tubsNeeded .output-number');
    var outSand = document.querySelector('#output_sandingSponges .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outFlOz) outFlOz.textContent = rawFlOz.toFixed(1) + ' fl oz';
    if (outQt) outQt.textContent = pintsVal.toFixed(2) + ' pints (' + quartsVal.toFixed(2) + ' qts)';
    if (outTubs) outTubs.textContent = tubsNeeded + ' tub(s) (' + (containerFlOz === 8 ? '8 fl oz' : (containerFlOz === 16 ? '16 fl oz' : (containerFlOz === 32 ? '32 fl oz' : '1 gal'))) + ')';
    if (outSand) outSand.textContent = sandingSponges + ' block(s)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(smallVol, medVol, largeVol, seamVol, rawFlOz, containerFlOz * tubsNeeded);

    if (window.logHistory) {
      window.logHistory('spackle-patching-compound-calculator', {
        totalVolumeFlOz: rawFlOz.toFixed(1) + ' fl oz',
        containerSize: (containerFlOz / 16.0) + ' pt',
        tubsNeeded: tubsNeeded + ' tubs',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(smallVol, medVol, largeVol, seamVol, reqFlOz, capFlOz) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeByRepairType';

    var ctx = canvas.getContext('2d');
    if (tabId === 'containerVolumeVsNeeded') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Required Spackle', 'Purchased Tub Capacity'],
          datasets: [{
            label: 'Volume (Fluid Ounces)',
            data: [parseFloat(reqFlOz.toFixed(1)), parseFloat(capFlOz.toFixed(1))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
          labels: ['Nail Holes', 'Medium Dents', 'Large Patches', 'Seam Touch-ups'],
          datasets: [{
            data: [
              parseFloat(smallVol.toFixed(1)),
              parseFloat(medVol.toFixed(1)),
              parseFloat(largeVol.toFixed(1)),
              parseFloat(seamVol.toFixed(1))
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
    document.getElementById('input_smallHolesCount').value = 15;
    document.getElementById('input_mediumHolesCount').value = 4;
    document.getElementById('input_largePatchAreaSqFt').value = 1.5;
    document.getElementById('input_jointTouchupFeet').value = 20;
    document.getElementById('input_containerSize').value = '1.0';
    document.getElementById('input_containerPrice').value = 9.50;
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
