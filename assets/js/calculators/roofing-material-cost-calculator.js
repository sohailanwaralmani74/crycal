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

    var matSelect = document.getElementById('input_materialType');
    if (matSelect) {
      matSelect.addEventListener('change', function() {
        var customInput = document.getElementById('input_customMaterialPrice');
        if (customInput) {
          if (this.value === 'custom') {
            customInput.style.display = 'block';
          } else {
            customInput.style.display = 'none';
          }
        }
        calculate();
      });
    }

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var area = parseFloat(document.getElementById('input_roofAreaSqFt').value) || 0;
    var matSelectVal = document.getElementById('input_materialType').value;
    var customPrice = parseFloat(document.getElementById('input_customMaterialPrice').value) || 0;
    var underlaymentPerSq = parseFloat(document.getElementById('input_underlaymentCostPerSq').value) || 0;
    var laborPerSqFt = parseFloat(document.getElementById('input_laborCostPerSqFt').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercent').value) || 0;

    var matPricePerSq = matSelectVal === 'custom' ? customPrice : (parseFloat(matSelectVal) || 140);

    var areaWithWaste = area * (1 + wastePct / 100);
    var totalSquares = areaWithWaste / 100;

    var primaryMatCost = totalSquares * matPricePerSq;
    var accessoryCost = totalSquares * underlaymentPerSq;
    var totalMatCost = primaryMatCost + accessoryCost;
    var totalLaborCost = area * laborPerSqFt;
    var totalProjectCost = totalMatCost + totalLaborCost;
    var costPerSqFt = area > 0 ? (totalProjectCost / area) : 0;

    var outTotal = document.querySelector('#output_totalProjectCost .output-number');
    var outPerSqFt = document.querySelector('#output_costPerSqFt .output-number');
    var outMat = document.querySelector('#output_totalMaterialCost .output-number');
    var outLab = document.querySelector('#output_totalLaborCost .output-number');

    if (outTotal) outTotal.textContent = formatCurrency(totalProjectCost);
    if (outPerSqFt) outPerSqFt.textContent = formatCurrency(costPerSqFt) + ' / sq ft';
    if (outMat) outMat.textContent = formatCurrency(totalMatCost);
    if (outLab) outLab.textContent = formatCurrency(totalLaborCost);

    updateChart(primaryMatCost, accessoryCost, totalLaborCost, area, laborPerSqFt, underlaymentPerSq, wastePct);

    if (window.logHistory) {
      window.logHistory('roofing-material-cost-calculator', {
        roofAreaSqFt: area + ' sq ft',
        materialType: formatCurrency(matPricePerSq) + ' / sq',
        totalProjectCost: formatCurrency(totalProjectCost),
        costPerSqFt: formatCurrency(costPerSqFt) + ' / sq ft'
      });
    }
  }

  function updateChart(primaryMatCost, accessoryCost, totalLaborCost, area, laborPerSqFt, underlaymentPerSq, wastePct) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'costDistribution';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialComparison') {
      var materials = [
        { name: '3-Tab Asphalt', rate: 90 },
        { name: 'Architectural', rate: 140 },
        { name: 'Standing Metal', rate: 350 },
        { name: 'Clay/Concrete Tile', rate: 600 },
        { name: 'Natural Slate', rate: 1100 }
      ];

      var totalSquares = (area * (1 + wastePct / 100)) / 100;
      var laborCost = area * laborPerSqFt;
      var accCost = totalSquares * underlaymentPerSq;

      var matCosts = materials.map(function(m) {
        var matCost = totalSquares * m.rate;
        return parseFloat((matCost + accCost + laborCost).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: materials.map(function(m) { return m.name; }),
          datasets: [{
            label: 'Total Installed Cost (' + getGlobalCurrency() + ')',
            data: matCosts,
            backgroundColor: ['#5D6D7E', '#2F6F5E', '#C08A2E', '#D99B36', '#B03A2E']
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
          labels: ['Primary Roofing Material', 'Underlayment & Accessories', 'Contractor Labor & Removal'],
          datasets: [{
            data: [
              parseFloat(primaryMatCost.toFixed(2)),
              parseFloat(accessoryCost.toFixed(2)),
              parseFloat(totalLaborCost.toFixed(2))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#5D6D7E']
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
    document.getElementById('input_roofAreaSqFt').value = 2000;
    document.getElementById('input_materialType').value = "140";
    document.getElementById('input_customMaterialPrice').value = 140;
    document.getElementById('input_customMaterialPrice').style.display = 'none';
    document.getElementById('input_underlaymentCostPerSq').value = 25;
    document.getElementById('input_laborCostPerSqFt').value = 4.50;
    document.getElementById('input_wastePercent').value = 10;
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
