(function() {
  'use strict';

  var chartInstance = null;

  var insulationRates = {
    'fiberglass_batt': 3.14,
    'blown_cellulose': 3.70,
    'open_cell_foam': 3.70,
    'closed_cell_foam': 6.50,
    'rigid_polyiso': 6.00,
    'rigid_xps': 5.00,
    'mineral_wool': 4.20
  };

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
    var matType = document.getElementById('input_insulationType').value || 'fiberglass_batt';
    var thickness = parseFloat(document.getElementById('input_insulationThickness').value) || 0;
    var studType = document.getElementById('input_studMaterial').value || 'wood_2x4';
    var sheathingR = parseFloat(document.getElementById('input_sheathingRValue').value) || 0;

    var rPerInch = insulationRates[matType] || 3.14;
    var nominalCavityR = thickness * rPerInch;

    var effCavityR = nominalCavityR;
    var airFilmsR = 0.85; // Interior air film (0.68) + Exterior air film (0.17)

    if (studType === 'wood_2x4' || studType === 'wood_2x6') {
      var studRPerInch = 1.25; // Wood studs
      var studR = thickness * studRPerInch;
      var fStud = 0.15; // 15% framing area
      var fCavity = 0.85; // 85% cavity area

      var uCavity = nominalCavityR > 0 ? (1 / nominalCavityR) : 0;
      var uStud = studR > 0 ? (1 / studR) : 0;
      var uOverallCavity = (fCavity * uCavity) + (fStud * uStud);
      effCavityR = uOverallCavity > 0 ? (1 / uOverallCavity) : nominalCavityR;
    } else if (studType === 'metal_stud') {
      // Steel stud thermal bridging penalty (~50% reduction factor)
      effCavityR = nominalCavityR * 0.50;
    } else {
      // solid_cavity (no studs)
      effCavityR = nominalCavityR;
    }

    var totalAssemblyR = effCavityR + sheathingR + airFilmsR;
    var uFactor = totalAssemblyR > 0 ? (1 / totalAssemblyR) : 0;
    var nominalTotalR = nominalCavityR + sheathingR + airFilmsR;
    var efficiency = nominalTotalR > 0 ? (totalAssemblyR / nominalTotalR) * 100 : 100;

    var outTotalR = document.querySelector('#output_totalAssemblyRValue .output-number');
    var outUFactor = document.querySelector('#output_uFactor .output-number');
    var outCavityR = document.querySelector('#output_cavityRValue .output-number');
    var outEff = document.querySelector('#output_thermalEfficiency .output-number');

    if (outTotalR) outTotalR.textContent = 'R-' + totalAssemblyR.toFixed(2);
    if (outUFactor) outUFactor.textContent = uFactor.toFixed(4);
    if (outCavityR) outCavityR.textContent = 'R-' + nominalCavityR.toFixed(2);
    if (outEff) outEff.textContent = efficiency.toFixed(1) + '%';

    updateChart(nominalCavityR, effCavityR, totalAssemblyR, uFactor);

    if (window.logHistory) {
      window.logHistory('r-value-calculator', {
        insulationType: matType.replace(/_/g, ' '),
        insulationThickness: thickness + ' in',
        totalAssemblyRValue: 'R-' + totalAssemblyR.toFixed(2),
        uFactor: uFactor.toFixed(4)
      });
    }
  }

  function updateChart(nominalCavityR, effCavityR, totalAssemblyR, uFactor) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'rValueBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'materialEfficiency') {
      var rLoss = Math.max(0, nominalCavityR - effCavityR);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Effective Assembly R-Value', 'Stud Thermal Bridging Loss'],
          datasets: [{
            data: [parseFloat(totalAssemblyR.toFixed(2)), parseFloat(rLoss.toFixed(2))],
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
          labels: ['Nominal Cavity R-Value', 'Effective Cavity R-Value', 'Total Assembly R-Value'],
          datasets: [{
            label: 'R-Value Rating',
            data: [
              parseFloat(nominalCavityR.toFixed(2)),
              parseFloat(effCavityR.toFixed(2)),
              parseFloat(totalAssemblyR.toFixed(2))
            ],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#1A4A3E']
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
    document.getElementById('input_insulationType').value = 'fiberglass_batt';
    document.getElementById('input_insulationThickness').value = 3.5;
    document.getElementById('input_studMaterial').value = 'wood_2x4';
    document.getElementById('input_sheathingRValue').value = 1.5;
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
