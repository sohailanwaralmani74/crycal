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
    var surfaceArea = parseFloat(document.getElementById('input_totalSurfaceArea').value) || 0;
    var thickness = document.getElementById('input_panelThickness').value || '7_16';
    var application = document.getElementById('input_application').value || 'wall';
    var wastePct = parseFloat(document.getElementById('input_wastePct').value) || 0;
    var pricePerPanel = parseFloat(document.getElementById('input_pricePerPanel').value) || 0;

    var exactNetSheets = surfaceArea / 32;
    var grossAreaWithWaste = surfaceArea * (1 + (wastePct / 100));

    var totalPanels = Math.ceil(grossAreaWithWaste / 32);
    var wasteSheets = totalPanels - exactNetSheets;

    var totalCost = totalPanels * pricePerPanel;

    var outNetSheets = document.querySelector('#output_netSheets .output-number');
    var outPanels = document.querySelector('#output_totalPanels .output-number');
    var outCoverage = document.querySelector('#output_totalCoverage .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outNetSheets) outNetSheets.textContent = exactNetSheets.toFixed(2) + ' sheets (Exact math)';
    if (outPanels) outPanels.textContent = totalPanels + ' Panels (4\'x8\' sheets)';
    if (outCoverage) outCoverage.textContent = (totalPanels * 32).toLocaleString() + ' sq ft covered';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(exactNetSheets, wasteSheets, totalCost);

    if (window.logHistory) {
      window.logHistory('osb-sheathing-calculator', {
        totalSurfaceArea: surfaceArea + ' sq ft',
        panelThickness: thickness,
        totalPanels: totalPanels + ' panels',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(netSheets, wasteSheets, totalCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'panelBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Net Material Cost ', 'Waste & Cut Margin Cost '],
          datasets: [{
            data: [
              parseFloat((netSheets * (totalCost / ((netSheets + wasteSheets) || 1))).toFixed(2)),
              parseFloat((wasteSheets * (totalCost / ((netSheets + wasteSheets) || 1))).toFixed(2))
            ],
            backgroundColor: ['#27AE60', '#E67E22']
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
          labels: ['Net OSB Sheets Needed', 'Waste & Cutting Allowance'],
          datasets: [{
            label: 'Sheets',
            data: [parseFloat(netSheets.toFixed(2)), parseFloat(Math.max(0, wasteSheets).toFixed(2))],
            backgroundColor: ['#27AE60', '#E67E22']
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
    document.getElementById('input_totalSurfaceArea').value = 1600;
    document.getElementById('input_panelThickness').value = '7_16';
    document.getElementById('input_application').value = 'wall';
    document.getElementById('input_wastePct').value = 10;
    document.getElementById('input_pricePerPanel').value = 19.50;
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
