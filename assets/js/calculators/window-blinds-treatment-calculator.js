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
    var winW = parseFloat(document.getElementById('input_windowWidth').value) || 0;
    var winH = parseFloat(document.getElementById('input_windowHeight').value) || 0;
    var winDepth = parseFloat(document.getElementById('input_windowDepth').value) || 0;
    var mountStyle = document.getElementById('input_mountType').value || 'inside';
    var slatW = parseFloat(document.getElementById('input_slatWidth').value) || 2.0;
    var overlap = parseFloat(document.getElementById('input_outsideOverlap').value) || 2;
    var pricePerSqFt = parseFloat(document.getElementById('input_pricePerSqFt').value) || 0;

    var orderW = winW;
    var orderH = winH;

    if (mountStyle === 'inside') {
      orderW = Math.max(1, winW - 0.5); // 0.5" factory clearance
      orderH = winH;
    } else {
      orderW = winW + (2 * overlap);
      orderH = winH + (2 * overlap);
    }

    var slatCount = Math.ceil(orderH / slatW);
    var areaSqFt = (orderW * orderH) / 144.0;
    var totalCost = areaSqFt * pricePerSqFt;

    var outOrderW = document.querySelector('#output_orderedBlindWidth .output-number');
    var outOrderH = document.querySelector('#output_orderedBlindHeight .output-number');
    var outSlats = document.querySelector('#output_estimatedSlatCount .output-number');
    var outSqFt = document.querySelector('#output_blindSquareFootage .output-number');
    var outCost = document.querySelector('#output_totalBlindCost .output-number');

    if (outOrderW) outOrderW.textContent = orderW.toFixed(2) + ' in (' + mountStyle + ' mount)';
    if (outOrderH) outOrderH.textContent = orderH.toFixed(2) + ' in';
    if (outSlats) outSlats.textContent = slatCount + ' Slats (' + slatW + '" size)';
    if (outSqFt) outSqFt.textContent = areaSqFt.toFixed(2) + ' sq ft';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(winW, winH, orderW, orderH, totalCost, areaSqFt);

    if (window.logHistory) {
      window.logHistory('window-blinds-treatment-calculator', {
        orderedBlindWidth: orderW.toFixed(2) + '" x ' + orderH.toFixed(2) + '"',
        orderedBlindHeight: orderH.toFixed(2) + '"',
        blindSquareFootage: areaSqFt.toFixed(2) + ' sq ft',
        totalBlindCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(winW, winH, orderW, orderH, totalCost, areaSqFt) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'mountDimensionChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'blindCostBreakdown') {
      var hardwareCost = totalCost * 0.15;
      var blindMaterialCost = Math.max(0, totalCost - hardwareCost);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Blind Fabric / Slat Material Cost', 'Mounting Hardware & Cordage'],
          datasets: [{
            data: [parseFloat(blindMaterialCost.toFixed(2)), parseFloat(hardwareCost.toFixed(2))],
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
          labels: ['Opening Width', 'Ordered Width', 'Opening Height', 'Ordered Height'],
          datasets: [{
            label: 'Dimensions (Inches)',
            data: [parseFloat(winW.toFixed(2)), parseFloat(orderW.toFixed(2)), parseFloat(winH.toFixed(2)), parseFloat(orderH.toFixed(2))],
            backgroundColor: ['#2563EB', '#2F6F5E', '#C08A2E', '#DC2626']
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
    document.getElementById('input_windowWidth').value = 36;
    document.getElementById('input_windowHeight').value = 60;
    document.getElementById('input_windowDepth').value = 3.5;
    document.getElementById('input_mountType').value = "inside";
    document.getElementById('input_slatWidth').value = "2.0";
    document.getElementById('input_outsideOverlap').value = 2;
    document.getElementById('input_pricePerSqFt').value = 12;
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
