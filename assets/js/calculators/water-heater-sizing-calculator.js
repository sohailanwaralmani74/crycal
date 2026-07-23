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
    var heaterType = document.getElementById('input_heaterType').value || 'tankless';
    var occupants = parseInt(document.getElementById('input_occupantsCount').value, 10) || 4;
    var showers = parseInt(document.getElementById('input_peakHourShowers').value, 10) || 2;
    var inTemp = parseFloat(document.getElementById('input_incomingWaterTemp').value) || 50;
    var outTemp = parseFloat(document.getElementById('input_targetWaterTemp').value) || 120;
    var fuel = document.getElementById('input_fuelType').value || 'gas';

    var deltaT = Math.max(10, outTemp - inTemp);

    // Peak Hour Demand (Gallons / FHR)
    var showerGallons = showers * 16;
    var occupantGallons = occupants * 3;
    var laundryGallons = 15;
    var dishwasherGallons = 6;
    var totalFHRGallons = showerGallons + occupantGallons + laundryGallons + dishwasherGallons;

    // Tank storage recommended size
    var recTankSize = '50 Gallon Tank (FHR ' + Math.round(totalFHRGallons) + ' gal)';
    if (totalFHRGallons > 80) recTankSize = '75–80 Gallon Heavy Duty Tank';
    else if (totalFHRGallons > 65) recTankSize = '50 Gallon Gas / 66 Gallon Electric';
    else if (totalFHRGallons > 45) recTankSize = '40 Gallon Storage Tank';
    else recTankSize = '30–40 Gallon Tank';

    // Tankless GPM calculation
    var peakGPM = (showers * 2.0) + 1.5; // showers + sink/appliance concurrent allowance
    var requiredBTU = peakGPM * deltaT * 500;
    var requiredKW = (peakGPM * deltaT) / 6.83;

    var recTanklessRating = fuel === 'gas' ? Math.round(requiredBTU / 1000) + ',000 BTU/hr Gas Unit' : requiredKW.toFixed(1) + ' kW Electric Unit';

    var outFHR = document.querySelector('#output_peakHourGallonsFHR .output-number');
    var outTank = document.querySelector('#output_recommendedTankGallons .output-number');
    var outGPM = document.querySelector('#output_peakTanklessFlowGPM .output-number');
    var outDeltaT = document.querySelector('#output_temperatureRiseDeltaT .output-number');

    if (outFHR) outFHR.textContent = Math.round(totalFHRGallons) + ' Gallons (FHR)';
    if (outTank) outTank.textContent = (heaterType === 'tank') ? recTankSize : recTanklessRating;
    if (outGPM) outGPM.textContent = peakGPM.toFixed(1) + ' GPM';
    if (outDeltaT) outDeltaT.textContent = deltaT.toFixed(0) + ' °F Rise';

    updateChart(showerGallons, occupantGallons, laundryGallons, dishwasherGallons, peakGPM, deltaT);

    if (window.logHistory) {
      window.logHistory('water-heater-sizing-calculator', {
        occupantsCount: occupants,
        peakHourGallonsFHR: Math.round(totalFHRGallons) + ' gal',
        peakTanklessFlowGPM: peakGPM.toFixed(1) + ' GPM',
        temperatureRiseDeltaT: deltaT.toFixed(0) + ' °F'
      });
    }
  }

  function updateChart(showerGal, occupantGal, laundryGal, dishwasherGal, peakGPM, deltaT) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'flowVsDeltaT';

    var ctx = canvas.getContext('2d');
    if (tabId === 'hotWaterUsageBreakdown') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Showers & Baths', 'General Sink Sinks', 'Clothes Washing', 'Dishwasher'],
          datasets: [{
            data: [showerGal, occupantGal, laundryGal, dishwasherGal],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6', '#10B981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var temps = [35, 45, 55, 65, 75];
      var gpmsAtTemps = temps.map(function(t) {
        var dT = 120 - t;
        return parseFloat((199000 / (dT * 500)).toFixed(1)); // GPM for standard 199k BTU gas tankless
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: temps.map(function(t) { return t + '°F Ground'; }),
          datasets: [{
            label: '199,000 BTU Tankless Max GPM Output',
            data: gpmsAtTemps,
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { title: { display: true, text: 'Max GPM Delivery' } },
            x: { title: { display: true, text: 'Incoming Tap Temp (°F)' } }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_heaterType').value = "tankless";
    document.getElementById('input_occupantsCount').value = 4;
    document.getElementById('input_peakHourShowers').value = 2;
    document.getElementById('input_incomingWaterTemp').value = 50;
    document.getElementById('input_targetWaterTemp').value = 120;
    document.getElementById('input_fuelType').value = "gas";
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
