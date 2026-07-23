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
    var roomL = parseFloat(document.getElementById('input_roomLengthFeet').value) || 0;
    var roomW = parseFloat(document.getElementById('input_roomWidthFeet').value) || 0;
    var unheatedSqFt = parseFloat(document.getElementById('input_unheatedFixturesSqFt').value) || 0;
    var systemType = document.getElementById('input_heatingType').value;
    var voltage = parseFloat(document.getElementById('input_voltage').value) || 120;
    var wattDensity = parseFloat(document.getElementById('input_wattageDensity').value) || 12;

    var grossRoomSqFt = roomL * roomW;
    var netUnadjustedSqFt = grossRoomSqFt - unheatedSqFt;
    if (netUnadjustedSqFt < 0) netUnadjustedSqFt = 0;

    // 10% perimeter gap allowance
    var netHeatedSqFt = netUnadjustedSqFt * 0.90;

    var materialQtyStr = '';
    if (systemType === 'mat') {
      materialQtyStr = Math.round(netHeatedSqFt) + ' sq ft Heating Mesh Mat';
    } else if (systemType === 'cable') {
      var cableFeet = netHeatedSqFt * 4; // 3" spacing -> 4 ft wire per sq ft
      materialQtyStr = Math.round(cableFeet) + ' linear ft Cable (@ 3" spacing)';
    } else if (systemType === 'hydronic') {
      var pexFeet = netHeatedSqFt * 1.35; // 8"-9" PEX loop spacing
      materialQtyStr = Math.round(pexFeet) + ' linear ft 1/2" PEX Oxygen Barrier Tubing';
    }

    var totalWatts = netHeatedSqFt * wattDensity;
    var amperage = totalWatts / voltage;

    var outNetArea = document.querySelector('#output_heatedAreaSqFt .output-number');
    var outQty = document.querySelector('#output_cableOrMatQuantity .output-number');
    var outWatts = document.querySelector('#output_thermostatWattageLoad .output-number');
    var outAmps = document.querySelector('#output_electricalAmperage .output-number');

    if (outNetArea) outNetArea.textContent = Math.round(netHeatedSqFt) + ' sq ft (' + Math.round(grossRoomSqFt) + ' sq ft gross, -' + Math.round(unheatedSqFt) + ' sq ft fixtures)';
    if (outQty) outQty.textContent = materialQtyStr;
    if (outWatts) outWatts.textContent = Math.round(totalWatts).toLocaleString() + ' Watts (@ ' + wattDensity + ' W/sq ft)';
    if (outAmps) outAmps.textContent = amperage.toFixed(2) + ' Amps @ ' + voltage + 'V AC (' + Math.ceil(amperage * 1.25) + 'A Breaker Recommended)';

    updateChart(netHeatedSqFt, grossRoomSqFt - netHeatedSqFt, totalWatts, voltage);

    if (window.logHistory) {
      window.logHistory('radiant-floor-heating-calculator', {
        roomLengthFeet: roomL + ' ft',
        roomWidthFeet: roomW + ' ft',
        heatedAreaSqFt: Math.round(netHeatedSqFt) + ' sq ft',
        cableOrMatQuantity: materialQtyStr,
        thermostatWattageLoad: Math.round(totalWatts) + ' W',
        electricalAmperage: amperage.toFixed(2) + ' A'
      });
    }
  }

  function updateChart(netArea, unheatedArea, watts, voltage) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'floorAreaDivision';

    var ctx = canvas.getContext('2d');
    if (tabId === 'powerLoadByVoltage') {
      var amps120 = watts / 120;
      var amps240 = watts / 240;
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Current @ 120V Circuit (Amps)', 'Current @ 240V Circuit (Amps)'],
          datasets: [{
            label: 'Amperage',
            data: [
              parseFloat(amps120.toFixed(2)),
              parseFloat(amps240.toFixed(2))
            ],
            backgroundColor: ['#E74C3C', '#2F6F5E']
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
          labels: ['Net Heated Area (sq ft)', 'Unheated Fixtures & Perimeter (sq ft)'],
          datasets: [{
            data: [Math.round(netArea), Math.round(unheatedArea)],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
    document.getElementById('input_roomLengthFeet').value = 14;
    document.getElementById('input_roomWidthFeet').value = 12;
    document.getElementById('input_unheatedFixturesSqFt').value = 28;
    document.getElementById('input_heatingType').value = "mat";
    document.getElementById('input_voltage').value = "120";
    document.getElementById('input_wattageDensity').value = 12;
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
