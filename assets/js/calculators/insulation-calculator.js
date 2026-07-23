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
    var area = parseFloat(document.getElementById('input_squareFootage').value) || 0;
    var studSpacing = document.getElementById('input_studSpacing').value || '16';
    var rValue = document.getElementById('input_targetRValue').value || 'R13';
    var pkgPrice = parseFloat(document.getElementById('input_packagePrice').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wasteFactor').value) || 0;

    // Standard package coverage in sq ft based on R-value & width
    var coverageMap = {
      'R13': { '16': 106.6, '24': 163.0 },
      'R19': { '16': 77.5,  '24': 118.9 },
      'R30': { '16': 48.75, '24': 74.75 },
      'R38': { '16': 42.8,  '24': 65.6 }
    };

    var pkgCoverage = (coverageMap[rValue] && coverageMap[rValue][studSpacing]) ? coverageMap[rValue][studSpacing] : 100;

    var effectiveSqFt = area * (1 + (wastePct / 100));
    var packagesNeeded = Math.ceil(effectiveSqFt / pkgCoverage);
    var totalCost = packagesNeeded * pkgPrice;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;
    var totalPackageCapacity = packagesNeeded * pkgCoverage;

    var outPkgs = document.querySelector('#output_packagesNeeded .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');
    var outSqFt = document.querySelector('#output_totalRollSqFt .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');

    if (outPkgs) outPkgs.textContent = packagesNeeded + ' pkgs';
    if (outCost) outCost.textContent = formatCurrency(totalCost);
    if (outSqFt) outSqFt.textContent = Math.round(effectiveSqFt) + ' sq ft';
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';

    updateChart(area, effectiveSqFt - area, totalCost, packagesNeeded, pkgCoverage);

    if (window.logHistory) {
      window.logHistory('insulation-calculator', {
        squareFootage: area + ' sq ft',
        targetRValue: rValue + ' (' + studSpacing + '" OC)',
        packagesNeeded: packagesNeeded + ' pkgs',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netArea, wasteArea, totalCost, pkgs, pkgCoverage) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'packageBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      var netCost = totalCost * (netArea / (netArea + wasteArea || 1));
      var wasteCost = totalCost - netCost;
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Coverage Material Cost', 'Waste & Trim Allowance Cost'],
          datasets: [{
            data: [parseFloat(netCost.toFixed(2)), parseFloat(wasteCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
          labels: ['Required Area (with waste)', 'Total Package Capacity'],
          datasets: [{
            label: 'Square Feet',
            data: [Math.round(netArea + wasteArea), Math.round(pkgs * pkgCoverage)],
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
    document.getElementById('input_squareFootage').value = 1000;
    document.getElementById('input_studSpacing').value = '16';
    document.getElementById('input_targetRValue').value = 'R13';
    document.getElementById('input_packagePrice').value = 65.00;
    document.getElementById('input_wasteFactor').value = 10;
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
