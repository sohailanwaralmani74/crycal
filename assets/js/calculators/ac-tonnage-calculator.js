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

  function getZoneBtu(zoneKey) {
    switch (zoneKey) {
      case '1_hot': return 25;
      case '3_moderate': return 20;
      case '4_cool': return 18;
      case '2_warm':
      default: return 22;
    }
  }

  function getSunFactor(sunKey) {
    switch (sunKey) {
      case 'shaded': return 0.90;
      case 'high_sun': return 1.10;
      case 'average':
      default: return 1.00;
    }
  }

  function getInsulationFactor(insKey) {
    switch (insKey) {
      case 'poor': return 1.15;
      case 'high_efficient': return 0.88;
      case 'average':
      default: return 1.00;
    }
  }

  function snapToCommercialTons(rawTons) {
    if (rawTons <= 1.75) return 1.5;
    if (rawTons <= 2.25) return 2.0;
    if (rawTons <= 2.75) return 2.5;
    if (rawTons <= 3.25) return 3.0;
    if (rawTons <= 3.75) return 3.5;
    if (rawTons <= 4.25) return 4.0;
    if (rawTons <= 4.75) return 4.5;
    return 5.0;
  }

  function calculate() {
    var sqft = parseFloat(document.getElementById('input_homeSqFt').value) || 0;
    var ceilingFt = parseFloat(document.getElementById('input_ceilingHeight').value) || 8.0;
    var zoneKey = document.getElementById('input_climateZone').value;
    var sunKey = document.getElementById('input_sunExposure').value;
    var insKey = document.getElementById('input_insulationQuality').value;
    var occupants = parseInt(document.getElementById('input_occupantCount').value, 10) || 0;

    var zoneBtuRate = getZoneBtu(zoneKey);
    var sunMult = getSunFactor(sunKey);
    var insMult = getInsulationFactor(insKey);
    var ceilingMult = ceilingFt / 8.0;

    var baseBtu = sqft * zoneBtuRate;
    var adjustedSpaceBtu = baseBtu * ceilingMult * sunMult * insMult;
    var occupantBtu = occupants * 600;

    var totalBtu = adjustedSpaceBtu + occupantBtu;
    var rawTons = totalBtu / 12000.0;
    var commercialTons = snapToCommercialTons(rawTons);

    var cfm = commercialTons * 400;
    var seasonalKwh = Math.round(commercialTons * 950);

    var outBtu = document.querySelector('#output_coolingLoadBtu .output-number');
    var outTons = document.querySelector('#output_requiredTonnage .output-number');
    var outUnit = document.querySelector('#output_recommendedUnit .output-number');
    var outCfm = document.querySelector('#output_airflowCfm .output-number');
    var outKwh = document.querySelector('#output_estSeasonalKwh .output-number');

    if (outBtu) outBtu.textContent = Math.round(totalBtu).toLocaleString() + ' BTU/hr';
    if (outTons) outTons.textContent = rawTons.toFixed(2) + ' Tons (Calculated)';
    if (outUnit) outUnit.textContent = commercialTons.toFixed(1) + ' Ton (' + (commercialTons * 12000).toLocaleString() + ' BTU)';
    if (outCfm) outCfm.textContent = Math.round(cfm).toLocaleString() + ' CFM';
    if (outKwh) outKwh.textContent = seasonalKwh.toLocaleString() + ' kWh / summer';

    updateChart(baseBtu, (adjustedSpaceBtu - baseBtu), occupantBtu, sqft, ceilingMult, sunMult, insMult);

    if (window.logHistory) {
      window.logHistory('ac-tonnage-calculator', {
        homeSqFt: sqft + ' sq ft',
        climateZone: zoneKey,
        coolingLoadBtu: Math.round(totalBtu) + ' BTU',
        requiredTonnage: commercialTons.toFixed(1) + ' Tons'
      });
    }
  }

  function updateChart(baseBtu, envAdjustBtu, occupantBtu, sqft, ceilingMult, sunMult, insMult) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'loadFactorBreakdown';

    var ctx = canvas.getContext('2d');
    if (tabId === 'tonnageByZone') {
      var zoneRates = [25, 22, 20, 18];
      var zoneLabels = ['Zone 1 (Hot)', 'Zone 2 (Warm)', 'Zone 3 (Moderate)', 'Zone 4 (Cool)'];
      var zoneTons = zoneRates.map(function(rate) {
        var btu = (sqft * rate * ceilingMult * sunMult * insMult) + 2400;
        return parseFloat((btu / 12000.0).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: zoneLabels,
          datasets: [{
            label: 'Calculated AC Tonnage',
            data: zoneTons,
            backgroundColor: '#2F6F5E'
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
          labels: ['Base Square Footage BTU', 'Ceiling/Sun/Insulation Adjustment', 'Occupant Body Heat BTU'],
          datasets: [{
            data: [
              Math.round(baseBtu),
              Math.max(0, Math.round(envAdjustBtu)),
              Math.round(occupantBtu)
            ],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A7C59']
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
    document.getElementById('input_homeSqFt').value = 1800;
    document.getElementById('input_ceilingHeight').value = '8';
    document.getElementById('input_climateZone').value = '2_warm';
    document.getElementById('input_sunExposure').value = 'average';
    document.getElementById('input_insulationQuality').value = 'average';
    document.getElementById('input_occupantCount').value = 4;
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
