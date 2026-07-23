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

  function getEngineCharacter(ratio) {
    if (ratio > 1.05) return '🏎️ Oversquare / Short-Stroke (High-RPM Power)';
    if (ratio < 0.95) return '🚜 Undersquare / Long-Stroke (Low-End Torque)';
    return '⚖️ Square Engine Design (Balanced Power & Torque)';
  }

  function calculate() {
    var boreInput = parseFloat(document.getElementById('input_bore').value) || 4.00;
    var strokeInput = parseFloat(document.getElementById('input_stroke').value) || 3.48;
    var cylinders = parseInt(document.getElementById('input_cylinders').value, 10) || 8;
    var unitSystem = document.getElementById('input_unitSystem').value;

    var boreInches = boreInput;
    var strokeInches = strokeInput;

    if (unitSystem === 'mm') {
      boreInches = boreInput / 25.4;
      strokeInches = strokeInput / 25.4;
    }

    var singleCylinderCid = (Math.PI / 4.0) * (boreInches * boreInches) * strokeInches;
    var totalCid = singleCylinderCid * cylinders;
    var totalCc = totalCid * 16.387064;
    var totalLiters = totalCc / 1000.0;
    var singleCc = totalCc / Math.max(1, cylinders);

    var bsRatio = (strokeInches > 0) ? (boreInches / strokeInches) : 0;
    var charText = getEngineCharacter(bsRatio);

    setOutput('displacementCubicInches', totalCid.toFixed(1) + ' CID');
    setOutput('displacementCc', Math.round(totalCc).toLocaleString() + ' CC');
    setOutput('displacementLiters', totalLiters.toFixed(2) + ' Liters (' + totalLiters.toFixed(1) + 'L)');
    setOutput('singleCylinderCc', Math.round(singleCc) + ' CC / cylinder');
    setOutput('boreToStrokeRatio', bsRatio.toFixed(2) + ' (' + (bsRatio > 1.0 ? 'Oversquare' : bsRatio < 1.0 ? 'Undersquare' : 'Square') + ')');

    updateChart(totalCid, totalCc, totalLiters, cylinders, singleCc);

    if (window.logHistory) {
      window.logHistory('engine-displacement-calculator', {
        displacementCubicInches: totalCid.toFixed(1) + ' CID',
        displacementCc: Math.round(totalCc) + ' CC',
        displacementLiters: totalLiters.toFixed(2) + ' L',
        boreToStrokeRatio: bsRatio.toFixed(2)
      });
    }
  }

  function updateChart(totalCid, totalCc, totalLiters, cylinders, singleCc) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'displacementUnits';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'boreStrokeProfile') {
      var cylinderLabels = [];
      var cylinderVolumes = [];
      for (var i = 1; i <= cylinders; i++) {
        cylinderLabels.push('Cyl ' + i);
        cylinderVolumes.push(Math.round(singleCc));
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: cylinderLabels,
          datasets: [{
            label: 'Cylinder Volume Contribution (CC)',
            data: cylinderVolumes,
            backgroundColor: '#4A90D9'
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
        type: 'bar',
        data: {
          labels: ['Volume Metrics'],
          datasets: [
            {
              label: 'Displacement (CC)',
              data: [Math.round(totalCc)],
              backgroundColor: '#4A90D9'
            },
            {
              label: 'Displacement (CID x 10)',
              data: [Math.round(totalCid * 10)],
              backgroundColor: '#4ade80'
            }
          ]
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
    document.getElementById('input_cylinders').value = 8;
    document.getElementById('input_unitSystem').value = 'inches';
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
