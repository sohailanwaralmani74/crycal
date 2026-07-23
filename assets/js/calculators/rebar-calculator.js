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
    var len = parseFloat(document.getElementById('input_slabLengthFeet').value) || 0;
    var wid = parseFloat(document.getElementById('input_slabWidthFeet').value) || 0;
    var barSize = document.getElementById('input_rebarSize').value || '#4';
    var spacingIn = parseFloat(document.getElementById('input_gridSpacingInches').value) || 18;
    var overlapIn = parseFloat(document.getElementById('input_overlapInches').value) || 12;
    var clearanceIn = parseFloat(document.getElementById('input_clearanceMarginInches').value) || 3;
    var pricePerFt = parseFloat(document.getElementById('input_pricePerFoot').value) || 0;

    var unitWeight = 0.668; // default #4
    if (barSize === '#3') unitWeight = 0.376;
    if (barSize === '#5') unitWeight = 1.043;

    var actLen = Math.max(0, len - (2 * clearanceIn / 12));
    var actWid = Math.max(0, wid - (2 * clearanceIn / 12));

    var numLong = spacingIn > 0 ? (Math.floor((actWid * 12) / spacingIn) + 1) : 0;
    var numTrans = spacingIn > 0 ? (Math.floor((actLen * 12) / spacingIn) + 1) : 0;

    var netLongFt = numLong * actLen;
    var netTransFt = numTrans * actWid;
    var netTotalFt = netLongFt + netTransFt;

    // Lap splice calculations
    var splicesPerLong = actLen > 20 ? Math.floor((actLen - 0.001) / 20) : 0;
    var splicesPerTrans = actWid > 20 ? Math.floor((actWid - 0.001) / 20) : 0;
    var totalSpliceFt = ((numLong * splicesPerLong) + (numTrans * splicesPerTrans)) * (overlapIn / 12);

    var totalLinearFt = (netTotalFt + totalSpliceFt) * 1.10; // +10% cutting waste
    var sticks = Math.ceil(totalLinearFt / 20);
    var totalWeightLbs = totalLinearFt * unitWeight;
    var totalCost = totalLinearFt * pricePerFt;

    var outFt = document.querySelector('#output_totalLinearFeet .output-number');
    var outSticks = document.querySelector('#output_totalRebarSticks .output-number');
    var outWgt = document.querySelector('#output_totalRebarWeightLbs .output-number');
    var outCost = document.querySelector('#output_totalRebarCost .output-number');

    if (outFt) outFt.textContent = Math.round(totalLinearFt) + ' linear ft';
    if (outSticks) outSticks.textContent = sticks + ' sticks (20 ft)';
    if (outWgt) outWgt.textContent = Math.round(totalWeightLbs) + ' lbs';
    if (outCost) outCost.textContent = formatCurrency(totalCost);

    updateChart(netLongFt, netTransFt, totalLinearFt, totalWeightLbs);

    if (window.logHistory) {
      window.logHistory('rebar-calculator', {
        slabLengthFeet: len + ' ft',
        slabWidthFeet: wid + ' ft',
        totalLinearFeet: Math.round(totalLinearFt) + ' ft',
        totalRebarCost: formatCurrency(totalCost)
      });
    }
  }

  function updateChart(netLongFt, netTransFt, totalLinearFt, totalWeightLbs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'rebarDirection';

    var ctx = canvas.getContext('2d');
    if (tabId === 'costWeight') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Linear Feet (ft)', 'Total Steel Weight (lbs)'],
          datasets: [{
            label: 'Footage vs Weight',
            data: [Math.round(totalLinearFt), Math.round(totalWeightLbs)],
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
        type: 'bar',
        data: {
          labels: ['Longitudinal Bars (Length)', 'Transverse Bars (Width)'],
          datasets: [{
            label: 'Linear Feet',
            data: [Math.round(netLongFt), Math.round(netTransFt)],
            backgroundColor: ['#C08A2E', '#2F6F5E']
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
    document.getElementById('input_slabLengthFeet').value = 30;
    document.getElementById('input_slabWidthFeet').value = 20;
    document.getElementById('input_rebarSize').value = '#4';
    document.getElementById('input_gridSpacingInches').value = 18;
    document.getElementById('input_overlapInches').value = 12;
    document.getElementById('input_clearanceMarginInches').value = 3;
    document.getElementById('input_pricePerFoot').value = 0.85;
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
