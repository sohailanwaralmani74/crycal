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
    var pg = parseFloat(document.getElementById('input_groundSnowLoadPsf').value) || 0;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 0;
    var areaSqFt = parseFloat(document.getElementById('input_roofAreaSqFt').value) || 0;
    var Ce = parseFloat(document.getElementById('input_exposureFactor').value) || 1.0;
    var Ct = parseFloat(document.getElementById('input_thermalFactor').value) || 1.0;
    var Is = parseFloat(document.getElementById('input_importanceFactor').value) || 1.0;

    // Flat roof snow load
    var pf = 0.7 * Ce * Ct * Is * pg;

    // Slope angle
    var angleDeg = Math.atan(pitch / 12) * (180 / Math.PI);

    // Slope factor Cs
    var Cs = 1.0;
    if (angleDeg > 30 && angleDeg < 70) {
      Cs = 1.0 - ((angleDeg - 30) / 40);
    } else if (angleDeg >= 70) {
      Cs = 0.0;
    }

    var ps = Cs * pf;

    var totalWeightLbs = ps * areaSqFt;
    var totalWeightTons = totalWeightLbs / 2000;

    var outFlat = document.querySelector('#output_flatRoofSnowLoad .output-number');
    var outSloped = document.querySelector('#output_slopedRoofDesignPressure .output-number');
    var outWeightLbs = document.querySelector('#output_totalSnowWeightLbs .output-number');
    var outWeightTons = document.querySelector('#output_snowWeightTons .output-number');

    if (outFlat) outFlat.textContent = pf.toFixed(1) + ' PSF';
    if (outSloped) outSloped.textContent = ps.toFixed(1) + ' PSF (Cs = ' + Cs.toFixed(3) + ')';
    if (outWeightLbs) outWeightLbs.textContent = Math.round(totalWeightLbs).toLocaleString() + ' lbs';
    if (outWeightTons) outWeightTons.textContent = totalWeightTons.toFixed(2) + ' US Tons';

    updateChart(pg, pf, ps, totalWeightLbs);

    if (window.logHistory) {
      window.logHistory('roof-snow-load-calculator', {
        groundSnowLoadPsf: pg + ' PSF',
        roofPitch: pitch + '/12',
        flatRoofSnowLoad: pf.toFixed(1) + ' PSF',
        slopedRoofDesignPressure: ps.toFixed(1) + ' PSF',
        totalSnowWeightLbs: Math.round(totalWeightLbs) + ' lbs',
        snowWeightTons: totalWeightTons.toFixed(2) + ' Tons'
      });
    }
  }

  function updateChart(pg, pf, ps, totalLbs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'loadComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'totalWeightBreakdown') {
      var deadLoadLbs = 15 * 2000; // estimated dead load reference
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Calculated Snow Load (lbs)', 'Reference Roof Structure Dead Load (lbs)'],
          datasets: [{
            data: [Math.round(totalLbs), Math.round(deadLoadLbs)],
            backgroundColor: ['#4A90E2', '#2F6F5E']
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
          labels: ['Ground Snow (pg)', 'Flat Roof (pf)', 'Sloped Roof (ps)'],
          datasets: [{
            label: 'Pressure (PSF)',
            data: [
              parseFloat(pg.toFixed(1)),
              parseFloat(pf.toFixed(1)),
              parseFloat(ps.toFixed(1))
            ],
            backgroundColor: ['#C08A2E', '#4A90E2', '#2F6F5E']
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
    document.getElementById('input_groundSnowLoadPsf').value = 40;
    document.getElementById('input_roofPitch').value = 4;
    document.getElementById('input_roofAreaSqFt').value = 2000;
    document.getElementById('input_exposureFactor').value = "1.0";
    document.getElementById('input_thermalFactor').value = "1.0";
    document.getElementById('input_importanceFactor').value = "1.0";
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
