(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var inputs = document.querySelectorAll('#inputsArea input, #inputsArea select, .tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculate() {
    var bore = parseFloat(document.getElementById('input_bore').value) || 4.00;
    var stroke = parseFloat(document.getElementById('input_stroke').value) || 3.48;
    var chamberCc = parseFloat(document.getElementById('input_chamberCc').value) || 64;
    var pistonCc = parseFloat(document.getElementById('input_pistonDishCc').value) || 5;
    var gasketBore = parseFloat(document.getElementById('input_gasketBore').value) || 4.10;
    var gasketThick = parseFloat(document.getElementById('input_gasketThickness').value) || 0.039;
    var deckHeight = parseFloat(document.getElementById('input_deckHeight').value) || 0.015;

    // Swept volume: (PI / 4) * bore^2 * stroke in cu in -> cc
    var sweptCuIn = (Math.PI / 4.0) * (bore * bore) * stroke;
    var sweptCc = sweptCuIn * 16.387064;

    // Gasket volume: (PI / 4) * gasketBore^2 * gasketThick in cu in -> cc
    var gasketCuIn = (Math.PI / 4.0) * (gasketBore * gasketBore) * gasketThick;
    var gasketCc = gasketCuIn * 16.387064;

    // Deck clearance volume: (PI / 4) * bore^2 * deckHeight in cu in -> cc
    var deckCuIn = (Math.PI / 4.0) * (bore * bore) * deckHeight;
    var deckCc = deckCuIn * 16.387064;

    var clearanceCc = chamberCc + pistonCc + gasketCc + deckCc;
    var totalVolCc = sweptCc + clearanceCc;

    var cr = (clearanceCc > 0) ? (totalVolCc / clearanceCc) : 0;

    setOutput('compressionRatio', cr.toFixed(2) + ' : 1');
    setOutput('sweptVolumeCc', sweptCc.toFixed(1) + ' cc');
    setOutput('clearanceVolumeCc', clearanceCc.toFixed(1) + ' cc');
    setOutput('gasketVolumeCc', gasketCc.toFixed(2) + ' cc');
    setOutput('deckVolumeCc', deckCc.toFixed(2) + ' cc');

    updateChart(sweptCc, chamberCc, pistonCc, gasketCc, deckCc, cr, bore, stroke, gasketBore, gasketThick, deckHeight);

    if (window.logHistory) {
      window.logHistory('engine-compression-ratio-calculator', {
        compressionRatio: cr.toFixed(2) + ':1',
        sweptVolumeCc: sweptCc.toFixed(1) + ' cc',
        clearanceVolumeCc: clearanceCc.toFixed(1) + ' cc'
      });
    }
  }

  function updateChart(sweptCc, chamberCc, pistonCc, gasketCc, deckCc, currentCr, bore, stroke, gasketBore, gasketThick, deckHeight) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'volumeBreakdown';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'crByChamberCc') {
      var chambers = [58, 62, 64, 68, 72, 76];
      var crList = chambers.map(function(ch) {
        var cCc = ch + pistonCc + gasketCc + deckCc;
        return parseFloat(((sweptCc + cCc) / cCc).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chambers.map(function(c) { return c + ' cc Head'; }),
          datasets: [{
            label: 'Static Compression Ratio',
            data: crList,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.3
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
          labels: ['Chamber (cc)', 'Piston Dish/Dome (cc)', 'Head Gasket (cc)', 'Deck Clearance (cc)'],
          datasets: [{
            data: [
              parseFloat(chamberCc.toFixed(1)),
              parseFloat(Math.max(0, pistonCc).toFixed(1)),
              parseFloat(gasketCc.toFixed(1)),
              parseFloat(deckCc.toFixed(1))
            ],
            backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80', '#D95B43']
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
    document.getElementById('input_bore').value = 4.00;
    document.getElementById('input_stroke').value = 3.48;
    document.getElementById('input_chamberCc').value = 64;
    document.getElementById('input_pistonDishCc').value = 5;
    document.getElementById('input_gasketBore').value = 4.10;
    document.getElementById('input_gasketThickness').value = 0.039;
    document.getElementById('input_deckHeight').value = 0.015;
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
