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

  function snapToCommercialTransformer(minWatts) {
    if (minWatts <= 45) return 45;
    if (minWatts <= 75) return 75;
    if (minWatts <= 120) return 120;
    if (minWatts <= 150) return 150;
    if (minWatts <= 200) return 200;
    if (minWatts <= 300) return 300;
    return 600;
  }

  function calculate() {
    var pathLen = parseFloat(document.getElementById('input_walkwayLength').value) || 0;
    var spacing = parseFloat(document.getElementById('input_pathLightSpacing').value) || 8;
    var pathWattage = parseFloat(document.getElementById('input_pathLightWattage').value) || 3;
    var spotCount = parseInt(document.getElementById('input_spotlightCount').value, 10) || 0;
    var spotWattage = parseFloat(document.getElementById('input_spotlightWattage').value) || 7;
    var wireRunFt = parseFloat(document.getElementById('input_totalWireRunFeet').value) || 100;
    var fixturePrice = parseFloat(document.getElementById('input_fixturePrice').value) || 0;

    var pathCount = spacing > 0 ? (Math.floor(pathLen / spacing) + 1) : 0;
    var totalFixtures = pathCount + spotCount;

    var pathWattsTotal = pathCount * pathWattage;
    var spotWattsTotal = spotCount * spotWattage;
    var totalWatts = pathWattsTotal + spotWattsTotal;

    var minTransformerWatts = totalWatts * 1.25;
    var transformerWatts = snapToCommercialTransformer(minTransformerWatts);

    var wireGauge = '16/2 AWG Direct Burial';
    if (totalWatts > 150 || wireRunFt > 100) {
      wireGauge = '12/2 AWG Heavy Duty Low-Voltage Wire';
    } else if (totalWatts > 75 || wireRunFt > 50) {
      wireGauge = '14/2 AWG Standard Low-Voltage Wire';
    }

    var transPrice = transformerWatts <= 75 ? 65 : (transformerWatts <= 150 ? 110 : 185);
    var wirePrice = (wireRunFt / 100.0) * (wireGauge.indexOf('12/2') !== -1 ? 75 : 55);

    var totalCost = (totalFixtures * fixturePrice) + transPrice + wirePrice;

    var outPathCount = document.querySelector('#output_pathLightCount .output-number');
    var outTotalFixtures = document.querySelector('#output_totalFixtureCount .output-number');
    var outTotalWatts = document.querySelector('#output_totalSystemWattage .output-number');
    var outTrans = document.querySelector('#output_recommendedTransformer .output-number');
    var outGauge = document.querySelector('#output_recommendedWireGauge .output-number');
    var outCost = document.querySelector('#output_totalEquipmentCost .output-number');

    if (outPathCount) outPathCount.textContent = pathCount + ' fixtures (' + spacing + '\' spacing)';
    if (outTotalFixtures) outTotalFixtures.textContent = totalFixtures + ' fixtures (' + pathCount + ' path + ' + spotCount + ' spot)';
    if (outTotalWatts) outTotalWatts.textContent = Math.round(totalWatts) + ' Watts';
    if (outTrans) outTrans.textContent = transformerWatts + ' Watt Transformer (Min ' + Math.ceil(minTransformerWatts) + 'W)';
    if (outGauge) outGauge.textContent = wireGauge;
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(pathWattsTotal, spotWattsTotal, totalWatts, transformerWatts);

    if (window.logHistory) {
      window.logHistory('outdoor-lighting-spacing-calculator', {
        walkwayLength: pathLen + ' ft',
        pathLightSpacing: spacing + ' ft',
        totalSystemWattage: Math.round(totalWatts) + ' W',
        totalEquipmentCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(pathWatts, spotWatts, totalWatts, transformerWatts) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'powerConsumptionBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'transformerCapacityLoad') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Actual Fixture Load (W)', 'Available Transformer Capacity (W)'],
          datasets: [{
            label: 'System Power (Watts)',
            data: [Math.round(totalWatts), transformerWatts],
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
          labels: ['Path Light Load (Watts)', 'Spotlight Load (Watts)'],
          datasets: [{
            data: [Math.round(pathWatts), Math.round(spotWatts)],
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
    document.getElementById('input_walkwayLength').value = 60;
    document.getElementById('input_pathLightSpacing').value = '8';
    document.getElementById('input_pathLightWattage').value = '3';
    document.getElementById('input_spotlightCount').value = 4;
    document.getElementById('input_spotlightWattage').value = '7';
    document.getElementById('input_totalWireRunFeet').value = 100;
    document.getElementById('input_fixturePrice').value = 28.00;
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
