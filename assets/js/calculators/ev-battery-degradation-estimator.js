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
    var origCapacity = parseFloat(document.getElementById('input_originalCapacity').value) || 77;
    var origRange = parseFloat(document.getElementById('input_originalRange').value) || 300;
    var age = parseFloat(document.getElementById('input_vehicleAgeYears').value) || 5;
    var miles = parseFloat(document.getElementById('input_annualMiles').value) || 12000;
    var fastCharge = document.getElementById('input_chargingHabits').value;
    var climate = document.getElementById('input_climate').value;
    var chemistry = document.getElementById('input_chemistry').value;

    var climateMult = (climate === 'hot') ? 1.35 : (climate === 'freezing') ? 1.15 : 1.0;
    var fcMult = (fastCharge === 'frequent') ? 1.40 : (fastCharge === 'low') ? 0.80 : 1.0;
    var chemMult = (chemistry === 'lfp') ? 0.70 : 1.0;

    var baseAnnualRate = 1.6 + (miles / 12000.0) * 0.4;
    var annualRate = baseAnnualRate * climateMult * fcMult * chemMult;

    // Initial settling loss (2.5%) + annual loss
    var totalLossPct = 2.5 + Math.max(0, age - 1) * annualRate;
    var retentionPct = Math.max(50, 100 - totalLossPct);

    var remainingCapacity = origCapacity * (retentionPct / 100.0);
    var remainingRange = origRange * (retentionPct / 100.0);
    var lostRange = Math.max(0, origRange - remainingRange);

    setOutput('retentionPercent', retentionPct.toFixed(1) + '%');
    setOutput('remainingCapacityKwh', remainingCapacity.toFixed(1) + ' kWh');
    setOutput('remainingRangeMiles', Math.round(remainingRange) + ' Miles');
    setOutput('lostRangeMiles', Math.round(lostRange) + ' Miles');
    setOutput('annualDegradationRate', annualRate.toFixed(2) + '% / yr');

    updateChart(origCapacity, origRange, annualRate);

    if (window.logHistory) {
      window.logHistory('ev-battery-degradation-estimator', {
        retentionPercent: retentionPct.toFixed(1) + '%',
        remainingCapacityKwh: remainingCapacity.toFixed(1) + ' kWh',
        remainingRangeMiles: Math.round(remainingRange) + ' mi',
        lostRangeMiles: Math.round(lostRange) + ' mi'
      });
    }
  }

  function updateChart(origCapacity, origRange, annualRate) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'capacityOverTime';

    var ctx = canvas.getContext('2d');
    var years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (activeTab === 'rangeLossOverTime') {
      var rangeData = years.map(function(y) {
        if (y === 0) return Math.round(origRange);
        var lossPct = 2.5 + Math.max(0, y - 1) * annualRate;
        var soh = Math.max(50, 100 - lossPct);
        return Math.round(origRange * (soh / 100.0));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years.map(function(y) { return 'Yr ' + y; }),
          datasets: [{
            label: 'Max Range (Miles)',
            data: rangeData,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var capacityData = years.map(function(y) {
        if (y === 0) return 100.0;
        var lossPct = 2.5 + Math.max(0, y - 1) * annualRate;
        return parseFloat(Math.max(50, 100 - lossPct).toFixed(1));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years.map(function(y) { return 'Yr ' + y; }),
          datasets: [{
            label: 'Capacity Retention (SOH %)',
            data: capacityData,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 50, max: 100 }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_originalCapacity').value = 77;
    document.getElementById('input_originalRange').value = 300;
    document.getElementById('input_vehicleAgeYears').value = 5;
    document.getElementById('input_annualMiles').value = 12000;
    document.getElementById('input_chargingHabits').value = 'moderate';
    document.getElementById('input_climate').value = 'mild';
    document.getElementById('input_chemistry').value = 'nmc_nca';
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
