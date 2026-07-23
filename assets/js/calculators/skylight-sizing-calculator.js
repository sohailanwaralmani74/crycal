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

  function getSkylightConfig(targetSqFt) {
    // Standard sizes:
    // 22x22 -> 3.36 sq ft
    // 22x46 -> 7.03 sq ft
    // 30x46 -> 9.58 sq ft
    // 46x46 -> 14.69 sq ft
    if (targetSqFt <= 4.5) {
      return '1x Unit @ 22" x 22" (3.36 sq ft)';
    } else if (targetSqFt <= 8.5) {
      return '1x Unit @ 22" x 46" (7.03 sq ft)';
    } else if (targetSqFt <= 12.0) {
      return '1x Unit @ 30" x 46" (9.58 sq ft)';
    } else if (targetSqFt <= 15.5) {
      return '2x Units @ 22" x 46" (14.06 sq ft total)';
    } else if (targetSqFt <= 21.0) {
      return '2x Units @ 30" x 46" (19.16 sq ft total)';
    } else {
      var count = Math.ceil(targetSqFt / 9.58);
      return count + 'x Units @ 30" x 46" (' + (count * 9.58).toFixed(1) + ' sq ft total)';
    }
  }

  function calculate() {
    var roomL = parseFloat(document.getElementById('input_roomLengthFeet').value) || 0;
    var roomW = parseFloat(document.getElementById('input_roomWidthFeet').value) || 0;
    var expTargetPct = parseFloat(document.getElementById('input_windowExposure').value) || 8;
    var pitch = parseFloat(document.getElementById('input_roofPitch').value) || 6;
    var ceilingH = parseFloat(document.getElementById('input_ceilingHeightFeet').value) || 9;

    var roomAreaSqFt = roomL * roomW;
    var recommendedSqFt = roomAreaSqFt * (expTargetPct / 100);

    var configStr = getSkylightConfig(recommendedSqFt);

    var pitchAngle = Math.atan(pitch / 12) * (180 / Math.PI);
    var shaftFlareAngle = 45; // standard recommended shaft flare
    if (ceilingH > 10) shaftFlareAngle = 60;

    var estimatedLumens = recommendedSqFt * 600;
    var ledBulbCount = Math.ceil(estimatedLumens / 800); // 800 lumens = 60W bulb equivalent

    var outArea = document.querySelector('#output_recommendedSkylightSqFt .output-number');
    var outConfig = document.querySelector('#output_skylightQuantitySize .output-number');
    var outFlare = document.querySelector('#output_shaftFlareAngle .output-number');
    var outLumens = document.querySelector('#output_estimatedDaylightLumens .output-number');

    if (outArea) outArea.textContent = recommendedSqFt.toFixed(2) + ' sq ft (' + expTargetPct + '% of ' + Math.round(roomAreaSqFt) + ' sq ft floor)';
    if (outConfig) outConfig.textContent = configStr;
    if (outFlare) outFlare.textContent = shaftFlareAngle + '° Outward Shaft Flare (Roof Pitch: ' + pitchAngle.toFixed(1) + '°)';
    if (outLumens) outLumens.textContent = Math.round(estimatedLumens).toLocaleString() + ' Lumens (~' + ledBulbCount + 'x 60W LED Bulbs)';

    updateChart(recommendedSqFt, roomAreaSqFt, estimatedLumens, ledBulbCount);

    if (window.logHistory) {
      window.logHistory('skylight-sizing-calculator', {
        roomLengthFeet: roomL + ' ft',
        roomWidthFeet: roomW + ' ft',
        windowExposure: expTargetPct + '%',
        recommendedSkylightSqFt: recommendedSqFt.toFixed(2) + ' sq ft',
        skylightQuantitySize: configStr,
        estimatedDaylightLumens: Math.round(estimatedLumens) + ' lm'
      });
    }
  }

  function updateChart(glassSqFt, roomSqFt, lumens, bulbs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'skylightToFloorRatio';

    var ctx = canvas.getContext('2d');
    if (tabId === 'lumensComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Skylight Daylight Lumens', 'Equivalent 60W LED Bulbs Output'],
          datasets: [{
            label: 'Lumens',
            data: [
              Math.round(lumens),
              bulbs * 800
            ],
            backgroundColor: ['#C08A2E', '#4A90E2']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var remainingRoom = roomSqFt - glassSqFt;
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Skylight Glass Area (sq ft)', 'Room Floor Area (sq ft)'],
          datasets: [{
            data: [parseFloat(glassSqFt.toFixed(2)), parseFloat(remainingRoom.toFixed(2))],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_roomLengthFeet').value = 16;
    document.getElementById('input_roomWidthFeet').value = 14;
    document.getElementById('input_windowExposure').value = "8";
    document.getElementById('input_roofPitch').value = 6;
    document.getElementById('input_ceilingHeightFeet').value = 9;
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
