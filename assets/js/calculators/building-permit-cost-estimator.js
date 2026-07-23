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
    var val = parseFloat(document.getElementById('input_projectValuation').value) || 0;
    var incElec = document.getElementById('input_includeElectrical').value === 'true';
    var incPlumb = document.getElementById('input_includePlumbing').value === 'true';
    var incHvac = document.getElementById('input_includeHVAC').value === 'true';
    var planPct = parseFloat(document.getElementById('input_planReviewFeePct').value) || 0;
    var stateFee = parseFloat(document.getElementById('input_stateSurchargeFee').value) || 0;

    var baseFee = 150.0;
    if (val <= 10000) {
      baseFee = 150.0;
    } else if (val <= 50000) {
      baseFee = 150.0 + ((val - 10000) / 1000.0) * 7.0;
    } else if (val <= 100000) {
      baseFee = 430.0 + ((val - 50000) / 1000.0) * 5.0;
    } else {
      baseFee = 680.0 + ((val - 100000) / 1000.0) * 4.0;
    }

    var elecFee = incElec ? Math.max(75.0, baseFee * 0.20) : 0;
    var plumbFee = incPlumb ? Math.max(75.0, baseFee * 0.20) : 0;
    var hvacFee = incHvac ? Math.max(75.0, baseFee * 0.15) : 0;

    var tradeFees = elecFee + plumbFee + hvacFee;
    var planReviewFee = baseFee * (planPct / 100.0);
    var totalPermitCost = baseFee + tradeFees + planReviewFee + stateFee;

    var pctValuation = val > 0 ? (totalPermitCost / val) * 100.0 : 0;

    var outBaseFee = document.querySelector('#output_baseBuildingPermitFee .output-number');
    var outTradeFees = document.querySelector('#output_tradeSubPermitFees .output-number');
    var outPlanReview = document.querySelector('#output_planReviewSurcharge .output-number');
    var outTotalPermit = document.querySelector('#output_totalPermitFee .output-number');
    var outPctVal = document.querySelector('#output_permitPctOfValuation .output-number');

    if (outBaseFee) outBaseFee.textContent = formatCurrency(baseFee);
    if (outTradeFees) outTradeFees.textContent = formatCurrency(tradeFees);
    if (outPlanReview) outPlanReview.textContent = formatCurrency(planReviewFee) + ' (' + planPct + '%)';
    if (outTotalPermit) outTotalPermit.textContent = formatCurrency(totalPermitCost);
    if (outPctVal) outPctVal.textContent = pctValuation.toFixed(2) + '% of valuation';

    updateChart(baseFee, tradeFees, planReviewFee, stateFee, val);

    if (window.logHistory) {
      window.logHistory('building-permit-cost-estimator', {
        totalPermitFee: formatCurrency(totalPermitCost),
        baseBuildingPermitFee: formatCurrency(baseFee),
        tradeSubPermitFees: formatCurrency(tradeFees),
        permitPctOfValuation: pctValuation.toFixed(2) + '%'
      });
    }
  }

  function updateChart(baseFee, tradeFees, planReviewFee, stateFee, valuation) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'permitFeeBreakdownChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'valuationTierChart') {
      // Benchmark valuations
      var benchmarks = [25000, 50000, 100000, 250000];
      var benchmarkFees = benchmarks.map(function(v) {
        var b = 150;
        if (v <= 10000) b = 150;
        else if (v <= 50000) b = 150 + ((v - 10000)/1000)*7;
        else if (v <= 100000) b = 430 + ((v - 50000)/1000)*5;
        else b = 680 + ((v - 100000)/1000)*4;
        return b * 1.6; // approx total with trades/plan review
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['$25k Project', '$50k Project', '$100k Project', '$250k Project'],
          datasets: [{
            label: 'Estimated Permit Cost ',
            data: benchmarkFees,
            backgroundColor: ['#2F6F5E', '#2563EB', '#C08A2E', '#DC2626']
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
          labels: ['Base Building Permit', 'Trade Sub-Permits (Elec/Plumb/HVAC)', 'Plan Review Fee', 'State Admin Fee'],
          datasets: [{
            data: [parseFloat(baseFee.toFixed(2)), parseFloat(tradeFees.toFixed(2)), parseFloat(planReviewFee.toFixed(2)), parseFloat(stateFee.toFixed(2))],
            backgroundColor: ['#2F6F5E', '#2563EB', '#C08A2E', '#9333EA']
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
    document.getElementById('input_projectValuation').value = 85000;
    document.getElementById('input_includeElectrical').value = "true";
    document.getElementById('input_includePlumbing').value = "true";
    document.getElementById('input_includeHVAC').value = "true";
    document.getElementById('input_planReviewFeePct').value = 25;
    document.getElementById('input_stateSurchargeFee').value = 50;
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
