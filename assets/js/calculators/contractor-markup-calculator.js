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
    var directCosts = parseFloat(document.getElementById('input_directCosts').value) || 0;
    var overheadCosts = parseFloat(document.getElementById('input_overheadCosts').value) || 0;
    var markupPct = parseFloat(document.getElementById('input_targetMarkupPct').value) || 0;
    var taxRatePct = parseFloat(document.getElementById('input_taxRatePct').value) || 0;

    var costBasis = directCosts + overheadCosts;
    var markupDollars = costBasis * (markupPct / 100.0);
    var preTaxBid = costBasis + markupDollars;
    var grossBidPrice = preTaxBid * (1.0 + (taxRatePct / 100.0));
    var taxDollars = grossBidPrice - preTaxBid;

    var marginPct = preTaxBid > 0 ? ((preTaxBid - directCosts) / preTaxBid) * 100.0 : 0;
    var netProfit = markupDollars;

    var outBasis = document.querySelector('#output_totalCostBasis .output-number');
    var outMarkup = document.querySelector('#output_markupDollarAmount .output-number');
    var outBid = document.querySelector('#output_grossBidPrice .output-number');
    var outMargin = document.querySelector('#output_grossProfitMarginPct .output-number');
    var outNetProf = document.querySelector('#output_netProfitDollars .output-number');

    if (outBasis) outBasis.textContent = formatCurrency(costBasis);
    if (outMarkup) outMarkup.textContent = formatCurrency(markupDollars) + ' (' + markupPct + '% markup)';
    if (outBid) outBid.textContent = formatCurrency(grossBidPrice);
    if (outMargin) outMargin.textContent = marginPct.toFixed(2) + '% Margin';
    if (outNetProf) outNetProf.textContent = formatCurrency(netProfit);

    updateChart(directCosts, overheadCosts, markupDollars, taxDollars, markupPct, marginPct);

    if (window.logHistory) {
      window.logHistory('contractor-markup-calculator', {
        grossBidPrice: formatCurrency(grossBidPrice),
        markupDollarAmount: formatCurrency(markupDollars),
        grossProfitMarginPct: marginPct.toFixed(2) + '%',
        totalCostBasis: formatCurrency(costBasis)
      });
    }
  }

  function updateChart(directCosts, overheadCosts, markupDollars, taxDollars, markupPct, marginPct) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'bidPriceBreakdownChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'markupVsMarginChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Target Markup % (on Costs)', 'Gross Profit Margin % (on Sales)'],
          datasets: [{
            label: 'Percentage (%)',
            data: [parseFloat(markupPct.toFixed(2)), parseFloat(marginPct.toFixed(2))],
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
          labels: ['Direct Job Costs', 'Allocated Overhead Expenses', 'Contractor Markup Profit', 'Tax / Contingency Buffer'],
          datasets: [{
            data: [parseFloat(directCosts.toFixed(2)), parseFloat(overheadCosts.toFixed(2)), parseFloat(markupDollars.toFixed(2)), parseFloat(taxDollars.toFixed(2))],
            backgroundColor: ['#2563EB', '#2F6F5E', '#C08A2E', '#DC2626']
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
    document.getElementById('input_directCosts').value = 40000;
    document.getElementById('input_overheadCosts').value = 5000;
    document.getElementById('input_targetMarkupPct').value = 25;
    document.getElementById('input_taxRatePct').value = 5;
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
