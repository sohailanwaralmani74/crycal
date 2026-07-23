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

  function setOutput(id, val) {
    var el = document.querySelector('#output_' + id + ' .output-number') || document.getElementById('output_' + id);
    if (el) el.textContent = val;
  }

  function calculate() {
    var accentArea = parseFloat(document.getElementById('input_accentWallArea').value) || 0;
    var primaryArea = parseFloat(document.getElementById('input_primaryWallArea').value) || 0;
    var coats = parseInt(document.getElementById('input_paintCoats').value, 10) || 2;
    var coverage = parseFloat(document.getElementById('input_coveragePerGallon').value) || 350;
    var priceGal = parseFloat(document.getElementById('input_pricePerGallon').value) || 0;
    var priceQt = parseFloat(document.getElementById('input_pricePerQuart').value) || 0;

    var totalAccentSqFt = accentArea * coats;
    var totalPrimarySqFt = primaryArea * coats;

    var quartCoverage = coverage / 4;
    var accentQuarts = totalAccentSqFt > 0 ? Math.ceil(totalAccentSqFt / quartCoverage) : 0;
    var primaryGallons = totalPrimarySqFt > 0 ? Math.ceil(totalPrimarySqFt / coverage) : 0;

    var accentCost = accentQuarts * priceQt;
    var primaryCost = primaryGallons * priceGal;
    var totalCost = accentCost + primaryCost;
    var totalGallonsEquivalent = (accentQuarts / 4) + primaryGallons;

    setOutput('accentPaintQuarts', accentQuarts + ' Quarts');
    setOutput('primaryPaintGallons', primaryGallons + ' Gallons');
    setOutput('totalPaintGallons', totalGallonsEquivalent.toFixed(2) + ' Gallons');
    setOutput('totalPaintCost', formatCurrency(totalCost));

    updateChart(accentQuarts, primaryGallons, accentCost, primaryCost);

    if (window.logHistory) {
      window.logHistory('paint-color-coverage-calculator', {
        accentPaintQuarts: accentQuarts + ' Quarts',
        primaryPaintGallons: primaryGallons + ' Gallons',
        totalPaintGallons: totalGallonsEquivalent.toFixed(2) + ' Gal',
        totalPaintCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(accentQuarts, primaryGallons, accentCost, primaryCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Accent Wall Paint Cost', 'Primary Walls Paint Cost'],
          datasets: [{
            data: [parseFloat(accentCost.toFixed(2)), parseFloat(primaryCost.toFixed(2))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
          labels: ['Accent Paint (Quarts)', 'Primary Paint (Gallons)'],
          datasets: [{
            label: 'Volume Units Needed',
            data: [accentQuarts, primaryGallons],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_accentWallArea').value = 150;
    document.getElementById('input_primaryWallArea').value = 450;
    document.getElementById('input_paintCoats').value = 2;
    document.getElementById('input_coveragePerGallon').value = 350;
    document.getElementById('input_pricePerGallon').value = 45.00;
    document.getElementById('input_pricePerQuart').value = 18.00;
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
