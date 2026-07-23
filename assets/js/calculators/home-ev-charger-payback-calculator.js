(function() {
  'use strict';

  var chartInstance = null;

  function init() {
    var inputs = document.querySelectorAll('#inputsArea input, #inputsArea select, .tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function formatCurrency(num) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    } catch (e) {
      return '$' + num.toFixed(2);
    }
  }

  function setOutput(id, text) {
    var el = document.getElementById('output_' + id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculate() {
    var hardware = parseFloat(document.getElementById('input_hardwareCost').value) || 550;
    var install = parseFloat(document.getElementById('input_installationCost').value) || 850;
    var rebate = parseFloat(document.getElementById('input_taxCreditRebate').value) || 300;
    var homeRate = parseFloat(document.getElementById('input_homeRate').value) || 0.15;
    var publicRate = parseFloat(document.getElementById('input_publicRate').value) || 0.42;
    var miles = parseFloat(document.getElementById('input_monthlyMiles').value) || 1100;
    var eff = parseFloat(document.getElementById('input_evEfficiency').value) || 3.4;

    var netInstallCost = Math.max(0, (hardware + install - rebate));
    var monthlyKwh = miles / Math.max(0.5, eff);

    var monthlyHomeCost = monthlyKwh * homeRate;
    var monthlyPublicCost = monthlyKwh * publicRate;

    var monthlySavings = Math.max(0, monthlyPublicCost - monthlyHomeCost);
    var annualSavings = monthlySavings * 12;

    var paybackMonths = (monthlySavings > 0) ? (netInstallCost / monthlySavings) : 0;
    var paybackYears = paybackMonths / 12.0;

    var fiveYearNetSavings = (monthlySavings * 60) - netInstallCost;

    setOutput('netInstallCost', formatCurrency(netInstallCost));
    setOutput('monthlySavings', formatCurrency(monthlySavings) + ' / mo');
    setOutput('annualSavings', formatCurrency(annualSavings) + ' / yr');
    setOutput('paybackMonths', paybackMonths > 0 ? paybackMonths.toFixed(1) + ' Months' : 'N/A');
    setOutput('paybackYears', paybackYears > 0 ? paybackYears.toFixed(1) + ' Years' : 'N/A');
    setOutput('fiveYearNetSavings', formatCurrency(fiveYearNetSavings));

    updateChart(netInstallCost, monthlySavings, monthlyHomeCost, monthlyPublicCost);

    if (window.logHistory) {
      window.logHistory('home-ev-charger-payback-calculator', {
        netInstallCost: formatCurrency(netInstallCost),
        monthlySavings: formatCurrency(monthlySavings),
        paybackMonths: paybackMonths.toFixed(1) + ' mos',
        fiveYearNetSavings: formatCurrency(fiveYearNetSavings)
      });
    }
  }

  function updateChart(netInstallCost, monthlySavings, monthlyHomeCost, monthlyPublicCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'cumulativeSavings';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'rateComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Home Charging', 'Public Station Charging'],
          datasets: [{
            label: 'Monthly Charging Cost ',
            data: [
              parseFloat(monthlyHomeCost.toFixed(2)),
              parseFloat(monthlyPublicCost.toFixed(2))
            ],
            backgroundColor: ['#4ade80', '#D95B43']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var months = [0, 6, 12, 18, 24, 36, 48, 60];
      var netValues = months.map(function(m) {
        return parseFloat(((monthlySavings * m) - netInstallCost).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months.map(function(m) { return m + ' Mos'; }),
          datasets: [{
            label: 'Net Cumulative Return ',
            data: netValues,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.2
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
    document.getElementById('input_hardwareCost').value = 550;
    document.getElementById('input_installationCost').value = 850;
    document.getElementById('input_taxCreditRebate').value = 300;
    document.getElementById('input_homeRate').value = 0.15;
    document.getElementById('input_publicRate').value = 0.42;
    document.getElementById('input_monthlyMiles').value = 1100;
    document.getElementById('input_evEfficiency').value = 3.4;
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
