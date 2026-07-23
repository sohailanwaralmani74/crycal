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
    var length = parseFloat(document.getElementById('input_length').value) || 0;
    var width = parseFloat(document.getElementById('input_width').value) || 0;
    var coatSystem = document.getElementById('input_coatSystem').value || 'double';
    var includePrimer = document.getElementById('input_includePrimer').value || 'yes';
    var flakeDensity = document.getElementById('input_flakeDensity').value || 'medium';
    var includeTopcoat = document.getElementById('input_includeTopcoat').value || 'yes';
    var pricePerKit = parseFloat(document.getElementById('input_pricePerKit').value) || 0;

    var areaSqFt = length * width;

    var epoxySqFtPerKit = 150;
    if (coatSystem === 'single') epoxySqFtPerKit = 250;
    else if (coatSystem === 'polyaspartic') epoxySqFtPerKit = 200;

    var epoxyKits = Math.ceil(areaSqFt / epoxySqFtPerKit);

    var primerKits = (includePrimer === 'yes') ? Math.ceil(areaSqFt / 300) : 0;
    var topcoatKits = (includeTopcoat === 'yes') ? Math.ceil(areaSqFt / 300) : 0;

    var flakeLbsPerSqFt = 0;
    if (flakeDensity === 'light') flakeLbsPerSqFt = 0.01;
    else if (flakeDensity === 'medium') flakeLbsPerSqFt = 0.05;
    else if (flakeDensity === 'full') flakeLbsPerSqFt = 0.20;

    var totalFlakeLbs = areaSqFt * flakeLbsPerSqFt;
    var flakeBags = Math.ceil(totalFlakeLbs / 5);

    var costEpoxy = epoxyKits * pricePerKit;
    var costPrimer = primerKits * (pricePerKit * 0.75);
    var costTopcoat = topcoatKits * (pricePerKit * 0.85);
    var costFlakes = flakeBags * 25.00;

    var totalCost = costEpoxy + costPrimer + costTopcoat + costFlakes;

    var outArea = document.querySelector('#output_totalArea .output-number');
    var outEpoxyKits = document.querySelector('#output_epoxyKits .output-number');
    var outPrimerKits = document.querySelector('#output_primerKits .output-number');
    var outFlakeBags = document.querySelector('#output_flakeBags .output-number');
    var outTopcoatKits = document.querySelector('#output_topcoatKits .output-number');
    var outCost = document.querySelector('#output_totalCost .output-number');

    if (outArea) outArea.textContent = areaSqFt.toLocaleString() + ' sq ft';
    if (outEpoxyKits) outEpoxyKits.textContent = epoxyKits + ' kits';
    if (outPrimerKits) outPrimerKits.textContent = primerKits + ' kits';
    if (outFlakeBags) outFlakeBags.textContent = flakeBags + ' bags (5 lb bags)';
    if (outTopcoatKits) outTopcoatKits.textContent = topcoatKits + ' kits';
    if (outCost) outCost.textContent = '$' + totalCost.toFixed(2);

    updateChart(epoxyKits, primerKits, flakeBags, topcoatKits, costEpoxy, costPrimer, costTopcoat, costFlakes);

    if (window.logHistory) {
      window.logHistory('epoxy-garage-floor-calculator', {
        length: length + ' x ' + width + ' ft',
        coatSystem: coatSystem,
        epoxyKits: epoxyKits + ' kits',
        flakeBags: flakeBags + ' bags',
        totalCost: '$' + totalCost.toFixed(2)
      });
    }
  }

  function updateChart(epoxyKits, primerKits, flakeBags, topcoatKits, costEpoxy, costPrimer, costTopcoat, costFlakes) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'materialQuantities';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Epoxy Base ', 'Primer ', 'Clear Topcoat ', 'Vinyl Flakes '],
          datasets: [{
            data: [
              parseFloat(costEpoxy.toFixed(2)),
              parseFloat(costPrimer.toFixed(2)),
              parseFloat(costTopcoat.toFixed(2)),
              parseFloat(costFlakes.toFixed(2))
            ],
            backgroundColor: ['#1B9CFC', '#F8EFBA', '#55E6C1', '#FD7272']
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
          labels: ['Epoxy Base Kits', 'Primer Kits', 'Flake Bags (5lb)', 'Topcoat Kits'],
          datasets: [{
            label: 'Quantity',
            data: [epoxyKits, primerKits, flakeBags, topcoatKits],
            backgroundColor: ['#1B9CFC', '#F8EFBA', '#FD7272', '#55E6C1']
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
    document.getElementById('input_length').value = 24;
    document.getElementById('input_width').value = 24;
    document.getElementById('input_coatSystem').value = 'double';
    document.getElementById('input_includePrimer').value = 'yes';
    document.getElementById('input_flakeDensity').value = 'medium';
    document.getElementById('input_includeTopcoat').value = 'yes';
    document.getElementById('input_pricePerKit').value = 120.00;
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
