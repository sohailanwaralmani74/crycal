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
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(0);
    }
  }

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var bathTypeSelect = document.getElementById('input_bathType');
    if (bathTypeSelect) {
      bathTypeSelect.addEventListener('change', function() {
        var bType = bathTypeSelect.value;
        var sqFtInput = document.getElementById('input_bathroomSqFt');
        if (bType === 'half') sqFtInput.value = 25;
        if (bType === 'full') sqFtInput.value = 50;
        if (bType === 'master') sqFtInput.value = 100;
        calculate();
      });
    }

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
    var bType = document.getElementById('input_bathType').value;
    var sqFt = parseFloat(document.getElementById('input_bathroomSqFt').value) || 0;
    var tileTier = document.getElementById('input_tileQuality').value;
    var fixtureCount = parseFloat(document.getElementById('input_fixtureCount').value) || 1;
    var movePlumbing = document.getElementById('input_plumbingRelocation').value;
    var scopeTier = document.getElementById('input_remodelScope').value;

    var tileRate = 30; // standard porcelain
    if (tileTier === 'vinyl') tileRate = 15;
    if (tileTier === 'luxury') tileRate = 60;

    var tileAreaMult = (bType === 'half') ? 1.2 : 2.5; // floor + wall surround
    var tileArea = sqFt * tileAreaMult;
    var tileCost = tileArea * tileRate;

    var scopeBase = 1500;
    if (scopeTier === 'cosmetic') scopeBase = 500;
    if (scopeTier === 'luxury') scopeBase = 4000;

    var fixturesCost = (fixtureCount * 650) + scopeBase;
    var plumbingMoveFee = (movePlumbing === 'yes') ? 2500 : 0;

    var laborCost = ((tileCost + fixturesCost) * 0.85) + plumbingMoveFee + (sqFt * 25);
    var totalCost = tileCost + fixturesCost + laborCost;

    var outTile = document.querySelector('#output_tileWaterproofingCost .output-number');
    var outFixtures = document.querySelector('#output_plumbingFixturesCost .output-number');
    var outLabor = document.querySelector('#output_laborContractorCost .output-number');
    var outTotal = document.querySelector('#output_totalBathroomCost .output-number');

    if (outTile) outTile.textContent = formatCurrency(tileCost);
    if (outFixtures) outFixtures.textContent = formatCurrency(fixturesCost);
    if (outLabor) outLabor.textContent = formatCurrency(laborCost);
    if (outTotal) outTotal.textContent = formatCurrency(totalCost);

    updateChart(tileCost, fixturesCost, laborCost, sqFt);

    if (window.logHistory) {
      window.logHistory('bathroom-remodel-cost-calculator', {
        bathType: bType,
        sqFt: sqFt + ' sq ft',
        tileQuality: tileTier,
        totalCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(tileCost, fixturesCost, laborCost, sqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costCategories';

    var ctx = canvas.getContext('2d');

    if (tabId === 'bathTypeComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Half Bath (25 sqft)', 'Standard Full Bath (50 sqft)', 'Master Suite (100 sqft)'],
          datasets: [
            {
              label: 'Cosmetic ',
              data: [3300, 9500, 18000],
              backgroundColor: '#10B981'
            },
            {
              label: 'Standard Overhaul ',
              data: [5950, 15750, 28500],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Luxury Suite ',
              data: [9800, 26000, 52000],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Tile & Waterproofing Systems', 'Plumbing Fixtures & Vanity', 'Trade Labor & Demolition'],
          datasets: [{
            data: [
              parseFloat(tileCost.toFixed(0)),
              parseFloat(fixturesCost.toFixed(0)),
              parseFloat(laborCost.toFixed(0))
            ],
            backgroundColor: ['#2F6F5E', '#3B82F6', '#C08A2E']
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
    document.getElementById('input_bathType').value = 'full';
    document.getElementById('input_bathroomSqFt').value = 50;
    document.getElementById('input_tileQuality').value = 'standard';
    document.getElementById('input_fixtureCount').value = 3;
    document.getElementById('input_plumbingRelocation').value = 'no';
    document.getElementById('input_remodelScope').value = 'standard';
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
