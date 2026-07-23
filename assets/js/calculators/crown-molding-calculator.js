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
    var netPerimeter = parseFloat(document.getElementById('input_roomPerimeterFt').value) || 0;
    var stickLenFt = parseFloat(document.getElementById('input_stickLengthFt').value) || 12;
    var insideCorners = parseFloat(document.getElementById('input_insideCorners').value) || 0;
    var outsideCorners = parseFloat(document.getElementById('input_outsideCorners').value) || 0;
    var wastePct = parseFloat(document.getElementById('input_wastePercent').value) || 15;
    var pricePerFt = parseFloat(document.getElementById('input_pricePerFoot').value) || 0;

    var totalCorners = insideCorners + outsideCorners;
    var extraCornerPct = totalCorners * 1.5; // 1.5% extra waste per corner
    var effectiveWastePct = wastePct + extraCornerPct;

    var grossLinearFt = netPerimeter * (1 + (effectiveWastePct / 100));
    var sticksCount = Math.ceil(grossLinearFt / stickLenFt);

    var totalPurchasedFt = sticksCount * stickLenFt;
    var totalCost = totalPurchasedFt * pricePerFt;
    var miterWasteFt = totalPurchasedFt - netPerimeter;

    var outNet = document.querySelector('#output_netLinearFeet .output-number');
    var outGross = document.querySelector('#output_grossLinearFeet .output-number');
    var outSticks = document.querySelector('#output_totalSticksNeeded .output-number');
    var outCost = document.querySelector('#output_moldingMaterialCost .output-number');
    var outWasteFt = document.querySelector('#output_estimatedCornerWasteFt .output-number');

    if (outNet) outNet.textContent = netPerimeter.toFixed(1) + ' linear ft';
    if (outGross) outGross.textContent = grossLinearFt.toFixed(1) + ' linear ft';
    if (outSticks) outSticks.textContent = sticksCount + ' Sticks (' + stickLenFt + '\' stock)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);
    if (outWasteFt) outWasteFt.textContent = miterWasteFt.toFixed(1) + ' linear ft';

    updateChart(netPerimeter, Math.max(0, miterWasteFt), sticksCount, totalPurchasedFt);

    if (window.logHistory) {
      window.logHistory('crown-molding-calculator', {
        roomPerimeterFt: netPerimeter + ' ft',
        grossLinearFeet: grossLinearFt.toFixed(1) + ' ft',
        totalSticksNeeded: sticksCount + ' Sticks',
        moldingMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netFt, wasteFt, sticksCount, totalPurchasedFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'moldingWasteChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'boardCountChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Molding Sticks', 'Total Purchased Feet (ft)'],
          datasets: [{
            label: 'Quantity',
            data: [sticksCount, totalPurchasedFt],
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
          labels: ['Net Room Perimeter', 'Miter Cutting & Corner Waste'],
          datasets: [{
            data: [parseFloat(netFt.toFixed(1)), parseFloat(wasteFt.toFixed(1))],
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
    document.getElementById('input_roomPerimeterFt').value = 64;
    document.getElementById('input_stickLengthFt').value = "12";
    document.getElementById('input_insideCorners').value = 4;
    document.getElementById('input_outsideCorners').value = 0;
    document.getElementById('input_wastePercent').value = 15;
    document.getElementById('input_pricePerFoot').value = 3.50;
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
