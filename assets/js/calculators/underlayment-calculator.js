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
    var roofArea = parseFloat(document.getElementById('input_roofAreaSqFt').value) || 0;
    var materialType = document.getElementById('input_underlaymentType').value || 'synthetic';
    var roofPitch = document.getElementById('input_roofPitch').value || 'standard';
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;
    var pricePerRoll = parseFloat(document.getElementById('input_pricePerRoll').value) || 0;

    var netRollCoverage = 900;
    if (materialType === 'felt30') netRollCoverage = 190;
    else if (materialType === 'felt15') netRollCoverage = 380;
    else if (materialType === 'peel_stick') netRollCoverage = 180;

    var slopeMultiplier = (roofPitch === 'low_slope') ? 1.90 : 1.0;
    var effectiveAreaToCover = roofArea * slopeMultiplier;

    var netRolls = effectiveAreaToCover / netRollCoverage;
    var totalRollsWithWaste = Math.ceil(netRolls * (1 + (wastePct / 100)));

    var roofSquares = (roofArea / 100).toFixed(1);
    var totalCost = totalRollsWithWaste * pricePerRoll;
    var wasteRolls = totalRollsWithWaste - Math.floor(netRolls);
    if (wasteRolls < 0) wasteRolls = 0;

    var outRolls = document.querySelector('#output_totalRolls .output-number');
    var outSquares = document.querySelector('#output_totalRoofSquares .output-number');
    var outCoverage = document.querySelector('#output_coveragePerRoll .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outRolls) outRolls.textContent = totalRollsWithWaste + ' rolls';
    if (outSquares) outSquares.textContent = roofSquares + ' squares';
    if (outCoverage) outCoverage.textContent = Math.round(netRollCoverage) + ' sq ft net / roll';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(netRolls, wasteRolls, roofArea, pricePerRoll, wastePct, slopeMultiplier);

    if (window.logHistory) {
      window.logHistory('underlayment-calculator', {
        roofAreaSqFt: roofArea + ' sq ft',
        underlaymentType: materialType,
        totalRolls: totalRollsWithWaste + ' rolls',
        totalRoofSquares: roofSquares + ' squares',
        totalMaterialCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netRolls, wasteRolls, roofArea, pricePerRoll, wastePct, slopeMultiplier) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'rollBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costComparison') {
      var materials = [
        { name: 'Synthetic', coverage: 900, price: 85 },
        { name: '#30 Felt', coverage: 190, price: 28 },
        { name: '#15 Felt', coverage: 380, price: 26 },
        { name: 'Ice & Water Shield', coverage: 180, price: 95 }
      ];

      var costs = materials.map(function(m) {
        var rolls = Math.ceil((roofArea * slopeMultiplier / m.coverage) * (1 + (wastePct / 100)));
        return parseFloat((rolls * m.price).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Synthetic (10-Sq)', '#30 Felt', '#15 Felt', 'Ice & Water Shield'],
          datasets: [{
            label: 'Estimated Material Cost ',
            data: costs,
            backgroundColor: ['#2F6F5E', '#4A90E2', '#C08A2E', '#E74C3C']
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
          labels: ['Net Underlayment Rolls', 'Waste Allowance Rolls'],
          datasets: [{
            data: [parseFloat(netRolls.toFixed(1)), parseFloat(wasteRolls.toFixed(1))],
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
    document.getElementById('input_roofAreaSqFt').value = 2400;
    document.getElementById('input_underlaymentType').value = 'synthetic';
    document.getElementById('input_roofPitch').value = 'standard';
    document.getElementById('input_wasteFactor').value = 10;
    document.getElementById('input_pricePerRoll').value = 85.00;
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
