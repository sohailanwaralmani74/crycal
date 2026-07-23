(function() {
  'use strict';

  var chartInstance = null;

  var AWG_TABLE = [
    { name: '14 AWG', cm: 4110, copperAmp: 15, alumAmp: 0 },
    { name: '12 AWG', cm: 6530, copperAmp: 20, alumAmp: 15 },
    { name: '10 AWG', cm: 10380, copperAmp: 30, alumAmp: 25 },
    { name: '8 AWG', cm: 16510, copperAmp: 50, alumAmp: 40 },
    { name: '6 AWG', cm: 26240, copperAmp: 65, alumAmp: 50 },
    { name: '4 AWG', cm: 41740, copperAmp: 85, alumAmp: 65 },
    { name: '3 AWG', cm: 52620, copperAmp: 100, alumAmp: 75 },
    { name: '2 AWG', cm: 66360, copperAmp: 115, alumAmp: 90 },
    { name: '1 AWG', cm: 83690, copperAmp: 130, alumAmp: 100 },
    { name: '1/0 AWG', cm: 105600, copperAmp: 150, alumAmp: 120 },
    { name: '2/0 AWG', cm: 133100, copperAmp: 175, alumAmp: 135 },
    { name: '3/0 AWG', cm: 167800, copperAmp: 200, alumAmp: 155 },
    { name: '4/0 AWG', cm: 211600, copperAmp: 230, alumAmp: 180 },
    { name: '250 kcmil', cm: 250000, copperAmp: 255, alumAmp: 205 },
    { name: '300 kcmil', cm: 300000, copperAmp: 285, alumAmp: 230 },
    { name: '350 kcmil', cm: 350000, copperAmp: 310, alumAmp: 250 },
    { name: '500 kcmil', cm: 500000, copperAmp: 380, alumAmp: 310 }
  ];

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
    var amps = parseFloat(document.getElementById('input_circuitAmps').value) || 20;
    var voltage = parseFloat(document.getElementById('input_voltage').value) || 120;
    var distance = parseFloat(document.getElementById('input_runDistanceFeet').value) || 100;
    var material = document.getElementById('input_conductorMaterial').value || 'copper';
    var maxDropPercent = parseFloat(document.getElementById('input_maxVoltageDrop').value) || 3.0;
    var phase = document.getElementById('input_phaseType').value || '1phase';

    var K = (material === 'copper') ? 12.9 : 21.2;
    var maxDropVolts = voltage * (maxDropPercent / 100);

    var reqCM = 0;
    if (phase === '3phase') {
      reqCM = (Math.sqrt(3) * K * amps * distance) / maxDropVolts;
    } else {
      reqCM = (2 * K * amps * distance) / maxDropVolts;
    }

    var selectedWire = null;
    for (var i = 0; i < AWG_TABLE.length; i++) {
      var wire = AWG_TABLE[i];
      var ampCapacity = (material === 'copper') ? wire.copperAmp : wire.alumAmp;
      if (wire.cm >= reqCM && ampCapacity >= amps) {
        selectedWire = wire;
        break;
      }
    }

    if (!selectedWire) {
      selectedWire = AWG_TABLE[AWG_TABLE.length - 1];
    }

    var actualDropVolts = 0;
    if (phase === '3phase') {
      actualDropVolts = (Math.sqrt(3) * K * amps * distance) / selectedWire.cm;
    } else {
      actualDropVolts = (2 * K * amps * distance) / selectedWire.cm;
    }

    var actualDropPercent = (actualDropVolts / voltage) * 100;
    var loadVoltage = voltage - actualDropVolts;

    var outAWG = document.querySelector('#output_recommendedAWG .output-number');
    var outVolts = document.querySelector('#output_voltageDropVolts .output-number');
    var outPercent = document.querySelector('#output_voltageDropPercent .output-number');
    var outLoadV = document.querySelector('#output_voltageAtLoad .output-number');

    if (outAWG) outAWG.textContent = selectedWire.name + ' (' + selectedWire.cm.toLocaleString() + ' CM)';
    if (outVolts) outVolts.textContent = actualDropVolts.toFixed(2) + ' V';
    if (outPercent) outPercent.textContent = actualDropPercent.toFixed(2) + ' %';
    if (outLoadV) outLoadV.textContent = loadVoltage.toFixed(1) + ' V';

    updateChart(distance, voltage, K, amps, phase, selectedWire);

    if (window.logHistory) {
      window.logHistory('wire-gauge-calculator', {
        circuitAmps: amps + ' A',
        runDistanceFeet: distance + ' ft',
        recommendedAWG: selectedWire.name,
        voltageDropPercent: actualDropPercent.toFixed(2) + ' %',
        voltageAtLoad: loadVoltage.toFixed(1) + ' V'
      });
    }
  }

  function updateChart(distance, voltage, K, amps, phase, selectedWire) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'voltageDropVsDistance';

    var ctx = canvas.getContext('2d');
    if (tabId === 'wireResistanceComparison') {
      var labels = [];
      var dataPoints = [];
      for (var i = 0; i < Math.min(8, AWG_TABLE.length); i++) {
        labels.push(AWG_TABLE[i].name);
        dataPoints.push(AWG_TABLE[i].cm);
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Conductor Area (Circular Mils)',
            data: dataPoints,
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var distLabels = [25, 50, 75, 100, 150, 200, 250, 300];
      var dropValues = distLabels.map(function(d) {
        var vDrop = (phase === '3phase') ? (Math.sqrt(3) * K * amps * d) / selectedWire.cm : (2 * K * amps * d) / selectedWire.cm;
        return parseFloat(((vDrop / voltage) * 100).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: distLabels.map(function(d) { return d + ' ft'; }),
          datasets: [{
            label: 'Voltage Drop % (' + selectedWire.name + ')',
            data: dropValues,
            borderColor: '#C08A2E',
            backgroundColor: 'rgba(192, 138, 46, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { title: { display: true, text: 'Voltage Drop (%)' } },
            x: { title: { display: true, text: 'Run Distance (Feet)' } }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_circuitAmps').value = 20;
    document.getElementById('input_voltage').value = "120";
    document.getElementById('input_runDistanceFeet').value = 100;
    document.getElementById('input_conductorMaterial').value = "copper";
    document.getElementById('input_maxVoltageDrop').value = 3.0;
    document.getElementById('input_phaseType').value = "1phase";
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
