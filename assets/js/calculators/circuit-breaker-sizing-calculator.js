(function() {
  'use strict';

  var chartInstance = null;

  var STANDARD_BREAKERS = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];

  function getWireSize(breakerAmps) {
    if (breakerAmps <= 15) return '14 AWG Copper';
    if (breakerAmps <= 20) return '12 AWG Copper';
    if (breakerAmps <= 30) return '10 AWG Copper';
    if (breakerAmps <= 40) return '8 AWG Copper';
    if (breakerAmps <= 50) return '6 AWG Copper';
    if (breakerAmps <= 60) return '6 AWG THHN / 4 AWG Copper';
    if (breakerAmps <= 70) return '4 AWG Copper';
    if (breakerAmps <= 80) return '3 AWG Copper';
    if (breakerAmps <= 90) return '2 AWG Copper';
    if (breakerAmps <= 100) return '1 AWG / 2 AWG Copper';
    if (breakerAmps <= 125) return '1/0 AWG Copper';
    if (breakerAmps <= 150) return '2/0 AWG Copper';
    if (breakerAmps <= 175) return '3/0 AWG Copper';
    return '4/0 AWG Copper';
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

    calculate();
  }

  function calculate() {
    var contAmps = parseFloat(document.getElementById('input_continuousLoadAmps').value) || 0;
    var nonContAmps = parseFloat(document.getElementById('input_nonContinuousLoadAmps').value) || 0;
    var voltage = parseFloat(document.getElementById('input_circuitVoltage').value) || 120;
    var ratingType = document.getElementById('input_breakerSafetyRating').value || 'standard';

    var mca = 0;
    if (ratingType === 'hundred_percent') {
      mca = contAmps + nonContAmps;
    } else {
      mca = (1.25 * contAmps) + (1.0 * nonContAmps);
    }

    var selectedBreaker = 15;
    for (var i = 0; i < STANDARD_BREAKERS.length; i++) {
      if (STANDARD_BREAKERS[i] >= mca) {
        selectedBreaker = STANDARD_BREAKERS[i];
        break;
      }
    }
    if (mca > STANDARD_BREAKERS[STANDARD_BREAKERS.length - 1]) {
      selectedBreaker = Math.ceil(mca / 5) * 5;
    }

    var maxContAllowed = (ratingType === 'hundred_percent') ? selectedBreaker : (selectedBreaker * 0.8);
    var wireGauge = getWireSize(selectedBreaker);

    var outMCA = document.querySelector('#output_minCircuitAmpacity .output-number');
    var outBreaker = document.querySelector('#output_recommendedBreakerSize .output-number');
    var outMaxCont = document.querySelector('#output_maxContinuousLoadAllowed .output-number');
    var outWire = document.querySelector('#output_minimumWireGauge .output-number');

    if (outMCA) outMCA.textContent = mca.toFixed(2) + ' Amps';
    if (outBreaker) outBreaker.textContent = selectedBreaker + ' Amp Breaker';
    if (outMaxCont) outMaxCont.textContent = maxContAllowed.toFixed(1) + ' Amps Continuous';
    if (outWire) outWire.textContent = wireGauge;

    updateChart(contAmps, nonContAmps, mca, selectedBreaker, maxContAllowed);

    if (window.logHistory) {
      window.logHistory('circuit-breaker-sizing-calculator', {
        continuousLoadAmps: contAmps + ' A',
        minCircuitAmpacity: mca.toFixed(2) + ' A',
        recommendedBreakerSize: selectedBreaker + ' A',
        minimumWireGauge: wireGauge
      });
    }
  }

  function updateChart(contAmps, nonContAmps, mca, selectedBreaker, maxContAllowed) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'loadVsCapacity';

    var ctx = canvas.getContext('2d');
    if (tabId === 'continuousRule') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Actual Continuous Load', 'NEC 25% Continuous Margin', 'Non-Continuous Load'],
          datasets: [{
            data: [
              parseFloat(contAmps.toFixed(1)),
              parseFloat((contAmps * 0.25).toFixed(1)),
              parseFloat(nonContAmps.toFixed(1))
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6']
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
          labels: ['Connected Raw Load (A)', 'Calculated MCA (A)', 'Breaker Continuous Limit (A)', 'Nominal Breaker Rating (A)'],
          datasets: [{
            label: 'Amperage (A)',
            data: [
              parseFloat((contAmps + nonContAmps).toFixed(1)),
              parseFloat(mca.toFixed(1)),
              parseFloat(maxContAllowed.toFixed(1)),
              selectedBreaker
            ],
            backgroundColor: ['#3B82F6', '#2F6F5E', '#C08A2E', '#8B5CF6']
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
    document.getElementById('input_continuousLoadAmps').value = 12;
    document.getElementById('input_nonContinuousLoadAmps').value = 4;
    document.getElementById('input_circuitVoltage').value = "120";
    document.getElementById('input_breakerSafetyRating').value = "standard";
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
