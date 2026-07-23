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
    var sqFt = parseFloat(document.getElementById('input_homeSqFt').value) || 2000;
    var smallApp = parseFloat(document.getElementById('input_smallApplianceCircuits').value) || 2;
    var laundry = parseFloat(document.getElementById('input_laundryCircuits').value) || 1;
    var rangeW = parseFloat(document.getElementById('input_electricRangeWatts').value) || 0;
    var dryerW = parseFloat(document.getElementById('input_electricDryerWatts').value) || 0;
    var waterW = parseFloat(document.getElementById('input_waterHeaterWatts').value) || 0;
    var hvacW = parseFloat(document.getElementById('input_hvacHeatPumpWatts').value) || 0;
    var evW = parseFloat(document.getElementById('input_evChargerWatts').value) || 0;
    var otherW = parseFloat(document.getElementById('input_otherFastLoadsWatts').value) || 0;

    // 1. General Lighting & Receptacle Load
    var rawGeneralVA = (sqFt * 3) + (smallApp * 1500) + (laundry * 1500);

    // 2. Apply NEC Demand Factor to General Load
    var demandedGeneralVA = 0;
    if (rawGeneralVA <= 3000) {
      demandedGeneralVA = rawGeneralVA;
    } else if (rawGeneralVA <= 120000) {
      demandedGeneralVA = 3000 + ((rawGeneralVA - 3000) * 0.35);
    } else {
      demandedGeneralVA = 3000 + ((120000 - 3000) * 0.35) + ((rawGeneralVA - 120000) * 0.25);
    }

    // 3. Electric Range Demand Factor (NEC Table 220.55 approximation)
    var demandedRangeVA = 0;
    if (rangeW > 0) {
      if (rangeW <= 12000) {
        demandedRangeVA = Math.max(8000, rangeW * 0.8);
      } else {
        demandedRangeVA = 8000 + ((rangeW - 12000) * 0.05 * 8000);
      }
    }

    // 4. Electric Dryer (min 5000 W or nameplate)
    var demandedDryerVA = (dryerW > 0) ? Math.max(5000, dryerW) : 0;

    // 5. Total Demanded Load
    var totalVA = demandedGeneralVA + demandedRangeVA + demandedDryerVA + waterW + hvacW + evW + otherW;
    var serviceAmps = totalVA / 240;

    // 6. Recommended Panel Size
    var recommendedPanel = '100 Amp Panel';
    if (serviceAmps > 300) {
      recommendedPanel = '400 Amp Panel (Dual 200A)';
    } else if (serviceAmps > 200) {
      recommendedPanel = '300 Amp Panel';
    } else if (serviceAmps > 150) {
      recommendedPanel = '200 Amp Panel';
    } else if (serviceAmps > 100) {
      recommendedPanel = '150 Amp Panel';
    }

    var outVA = document.querySelector('#output_totalDemandVA .output-number');
    var outAmps = document.querySelector('#output_serviceAmperage .output-number');
    var outPanel = document.querySelector('#output_recommendedPanelSize .output-number');
    var outGenVA = document.querySelector('#output_generalLightingDemandVA .output-number');

    if (outVA) outVA.textContent = Math.round(totalVA).toLocaleString() + ' VA';
    if (outAmps) outAmps.textContent = serviceAmps.toFixed(1) + ' Amps';
    if (outPanel) outPanel.textContent = recommendedPanel;
    if (outGenVA) outGenVA.textContent = Math.round(demandedGeneralVA).toLocaleString() + ' VA';

    updateChart(demandedGeneralVA, demandedRangeVA, demandedDryerVA, waterW, hvacW, evW, otherW, serviceAmps);

    if (window.logHistory) {
      window.logHistory('electrical-load-amperage-calculator', {
        homeSqFt: sqFt + ' sq ft',
        totalDemandVA: Math.round(totalVA) + ' VA',
        serviceAmperage: serviceAmps.toFixed(1) + ' A',
        recommendedPanelSize: recommendedPanel
      });
    }
  }

  function updateChart(genVA, rangeVA, dryerVA, waterW, hvacW, evW, otherW, serviceAmps) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'loadBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'panelCapacityMargin') {
      var panelLimit = 200;
      if (serviceAmps <= 100) panelLimit = 100;
      else if (serviceAmps <= 150) panelLimit = 150;
      else if (serviceAmps <= 200) panelLimit = 200;
      else if (serviceAmps <= 300) panelLimit = 300;
      else panelLimit = 400;

      var usedAmps = Math.min(serviceAmps, panelLimit);
      var marginAmps = Math.max(0, panelLimit - usedAmps);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Calculated Amps', 'Remaining Capacity Headroom'],
          datasets: [{
            label: 'Amperes @ 240V (' + panelLimit + 'A Panel)',
            data: [parseFloat(usedAmps.toFixed(1)), parseFloat(marginAmps.toFixed(1))],
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
        type: 'doughnut',
        data: {
          labels: ['General Lighting/Receptacles', 'Electric Range', 'Clothes Dryer', 'Water Heater', 'HVAC / Heat Pump', 'EV Charger', 'Other Appliances'],
          datasets: [{
            data: [
              Math.round(genVA),
              Math.round(rangeVA),
              Math.round(dryerVA),
              Math.round(waterW),
              Math.round(hvacW),
              Math.round(evW),
              Math.round(otherW)
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
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
    document.getElementById('input_homeSqFt').value = 2000;
    document.getElementById('input_smallApplianceCircuits').value = 2;
    document.getElementById('input_laundryCircuits').value = 1;
    document.getElementById('input_electricRangeWatts').value = 8000;
    document.getElementById('input_electricDryerWatts').value = 5000;
    document.getElementById('input_waterHeaterWatts').value = 4500;
    document.getElementById('input_hvacHeatPumpWatts').value = 7200;
    document.getElementById('input_evChargerWatts').value = 7680;
    document.getElementById('input_otherFastLoadsWatts').value = 2000;
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
