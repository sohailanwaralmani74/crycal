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
    var area = parseFloat(document.getElementById('input_projectAreaSqFt').value) || 0;
    var thicknessInches = parseFloat(document.getElementById('input_slabThicknessInches').value) || 0;
    var pricePerYard = parseFloat(document.getElementById('input_baseConcreteCostPerYard').value) || 0;
    var laborPerSqFt = parseFloat(document.getElementById('input_stampingLaborCostPerSqFt').value) || 0;
    var colorPerSqFt = parseFloat(document.getElementById('input_colorHardenerCost').value) || 0;
    var sealerPerSqFt = parseFloat(document.getElementById('input_sealerCostPerSqFt').value) || 0;

    var thicknessFeet = thicknessInches / 12;
    var netCuFt = area * thicknessFeet;
    var totalCuYd = (netCuFt / 27) * 1.10; // +10% waste

    var readyMixCost = totalCuYd * pricePerYard;
    var colorCost = area * colorPerSqFt;
    var sealerCost = area * sealerPerSqFt;
    var totalMatCost = readyMixCost + colorCost + sealerCost;
    var totalLabCost = area * laborPerSqFt;
    var totalCost = totalMatCost + totalLabCost;
    var costPerSqFt = area > 0 ? (totalCost / area) : 0;

    var outTotal = document.querySelector('#output_totalStampedProjectCost .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');
    var outMat = document.querySelector('#output_totalMaterialsCost .output-number');
    var outLab = document.querySelector('#output_totalLaborCost .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalCost);
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';
    if (outMat) outMat.textContent = formatCurrency(totalMatCost);
    if (outLab) outLab.textContent = formatCurrency(totalLabCost);

    updateChart(totalMatCost, totalLabCost, readyMixCost, (colorCost + sealerCost));

    if (window.logHistory) {
      window.logHistory('stamped-concrete-cost-calculator', {
        projectAreaSqFt: area + ' sq ft',
        slabThicknessInches: thicknessInches + ' in',
        totalStampedProjectCost: formatCurrency(totalCost),
        costPerSqFt: formatCurrency(costPerSqFt) + ' / sq ft'
      });
    }
  }

  function updateChart(matCost, labCost, readyMixCost, additivesCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialSplit') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ready-Mix Base Concrete', 'Color & Sealer Additives'],
          datasets: [{
            label: 'Material Breakdown',
            data: [parseFloat(readyMixCost.toFixed(2)), parseFloat(additivesCost.toFixed(2))],
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
          labels: ['Total Materials Cost', 'Contractor Stamping & Finishing Labor'],
          datasets: [{
            data: [parseFloat(matCost.toFixed(2)), parseFloat(labCost.toFixed(2))],
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
    document.getElementById('input_projectAreaSqFt').value = 500;
    document.getElementById('input_slabThicknessInches').value = 4;
    document.getElementById('input_baseConcreteCostPerYard').value = 140;
    document.getElementById('input_stampingLaborCostPerSqFt').value = 9.50;
    document.getElementById('input_colorHardenerCost').value = 1.20;
    document.getElementById('input_sealerCostPerSqFt').value = 0.60;
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
