(function() {
  'use strict';

  var chartInstance = null;

  function getGlobalCurrency() {
    var picker = document.getElementById('globalCurrencyPicker');
    return picker ? picker.value : 'USD';
  }

  function formatCurrency(val) {
    var curr = getGlobalCurrency();
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
    } catch(e) {
      return '$' + val.toFixed(2);
    }
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

    var currPicker = document.getElementById('globalCurrencyPicker');
    if (currPicker) currPicker.addEventListener('change', calculate);

    calculate();
  }

  function calculate() {
    var projectType = document.getElementById('input_projectType').value;
    var length = parseFloat(document.getElementById('input_spaceLength').value) || 0;
    var width = parseFloat(document.getElementById('input_spaceWidth').value) || 0;
    var wallH = parseFloat(document.getElementById('input_crawlspaceWallHeight').value) || 0;
    var overlapPct = parseFloat(document.getElementById('input_overlapPercentage').value) || 15;
    var polyThick = document.getElementById('input_polyThickness').value;
    var rollW = parseFloat(document.getElementById('input_rollWidthFeet').value) || 12;
    var rollL = parseFloat(document.getElementById('input_rollLengthFeet').value) || 100;
    var rollPrice = parseFloat(document.getElementById('input_rollPrice').value) || 0;
    var tapePrice = parseFloat(document.getElementById('input_tapePrice').value) || 0;

    var floorArea = length * width;
    var perimeterFt = 2 * (length + width);
    var wallArea = projectType === 'crawlspace' ? (perimeterFt * wallH) : 0;
    var netArea = floorArea + wallArea;

    var grossArea = netArea * (1.0 + (overlapPct / 100.0));
    var rollAreaSqFt = rollW * rollL;

    var rollsNeeded = rollAreaSqFt > 0 ? Math.ceil(grossArea / rollAreaSqFt) : 0;

    var tapeLinearFt = (netArea * 0.25) + perimeterFt;
    var tapeRollsNeeded = Math.ceil(tapeLinearFt / 180.0);

    var polyCost = rollsNeeded * rollPrice;
    var tapeCost = tapeRollsNeeded * tapePrice;
    var totalCost = polyCost + tapeCost;

    var outNetArea = document.querySelector('#output_netAreaSqFt .output-number');
    var outGrossArea = document.querySelector('#output_grossAreaSqFt .output-number');
    var outRolls = document.querySelector('#output_polyRollsNeeded .output-number');
    var outTape = document.querySelector('#output_seamTapeRollsNeeded .output-number');
    var outCost = document.querySelector('#output_totalMaterialCost .output-number');

    if (outNetArea) outNetArea.textContent = Math.round(netArea).toLocaleString() + ' sq ft';
    if (outGrossArea) outGrossArea.textContent = Math.round(grossArea).toLocaleString() + ' sq ft';
    if (outRolls) outRolls.textContent = rollsNeeded + ' roll(s) (' + rollW + '\'×' + rollL + '\', ' + polyThick + ')';
    if (outTape) outTape.textContent = tapeRollsNeeded + ' roll(s) (' + Math.round(tapeLinearFt) + ' linear ft total)';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(netArea, (grossArea - netArea), polyCost, tapeCost);

    if (window.logHistory) {
      window.logHistory('vapor-barrier-calculator', {
        netAreaSqFt: Math.round(netArea) + ' sq ft',
        polyThickness: polyThick,
        polyRollsNeeded: rollsNeeded + ' rolls',
        totalMaterialCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netSqFt, overlapSqFt, polyCost, tapeCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'areaBreakdownNetVsOverlap';

    var ctx = canvas.getContext('2d');
    if (tabId === 'polyRollUsageByThickness') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Poly Plastic Rolls Cost', 'Seam Tape & Sealant Cost'],
          datasets: [{
            label: 'Material Cost ',
            data: [parseFloat(polyCost.toFixed(2)), parseFloat(tapeCost.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#C08A2E']
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
          labels: ['Net Surface Area (sq ft)', 'Seam Overlap & Waste Allowance (sq ft)'],
          datasets: [{
            data: [Math.round(netSqFt), Math.round(overlapSqFt)],
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
    document.getElementById('input_projectType').value = 'crawlspace';
    document.getElementById('input_spaceLength').value = 40;
    document.getElementById('input_spaceWidth').value = 30;
    document.getElementById('input_crawlspaceWallHeight').value = 4;
    document.getElementById('input_overlapPercentage').value = '15';
    document.getElementById('input_polyThickness').value = '10mil';
    document.getElementById('input_rollWidthFeet').value = '12';
    document.getElementById('input_rollLengthFeet').value = '100';
    document.getElementById('input_rollPrice').value = 165.00;
    document.getElementById('input_tapePrice').value = 28.00;
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
