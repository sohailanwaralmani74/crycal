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
    var miles = parseFloat(document.getElementById('input_annualMiles').value) || 13000;
    var eff = parseFloat(document.getElementById('input_evEfficiency').value) || 3.5;
    var homeRate = parseFloat(document.getElementById('input_homeRate').value) || 0.14;
    var publicRate = parseFloat(document.getElementById('input_publicRate').value) || 0.42;
    var homePct = parseFloat(document.getElementById('input_homeChargeRatio').value) || 85;

    if (homePct > 100) homePct = 100;
    if (homePct < 0) homePct = 0;

    var totalKwh = miles / Math.max(0.5, eff);
    var homeRatio = homePct / 100.0;
    var publicRatio = 1.0 - homeRatio;

    var homeKwh = totalKwh * homeRatio;
    var publicKwh = totalKwh * publicRatio;

    var homeAnnualCost = homeKwh * homeRate;
    var publicAnnualCost = publicKwh * publicRate;

    var blendedAnnualCost = homeAnnualCost + publicAnnualCost;
    var purePublicCost = totalKwh * publicRate;
    var pureHomeCost = totalKwh * homeRate;

    var annualSavingsVsPublic = Math.max(0, purePublicCost - blendedAnnualCost);
    var blendedCostPerMile = (miles > 0) ? (blendedAnnualCost / miles) : 0;

    setOutput('homeAnnualCost', formatCurrency(homeAnnualCost) + ' / yr');
    setOutput('publicAnnualCost', formatCurrency(publicAnnualCost) + ' / yr');
    setOutput('blendedAnnualCost', formatCurrency(blendedAnnualCost) + ' / yr');
    setOutput('purePublicCost', formatCurrency(purePublicCost) + ' / yr');
    setOutput('pureHomeCost', formatCurrency(pureHomeCost) + ' / yr');
    setOutput('annualSavingsVsPublic', formatCurrency(annualSavingsVsPublic) + ' / yr');
    setOutput('blendedCostPerMile', formatCurrency(blendedCostPerMile) + ' / mi');

    updateChart(totalKwh, homeRate, publicRate, homeAnnualCost, publicAnnualCost);

    if (window.logHistory) {
      window.logHistory('public-vs-home-ev-charging-cost-calculator', {
        blendedAnnualCost: formatCurrency(blendedAnnualCost),
        purePublicCost: formatCurrency(purePublicCost),
        pureHomeCost: formatCurrency(pureHomeCost),
        annualSavingsVsPublic: formatCurrency(annualSavingsVsPublic)
      });
    }
  }

  function updateChart(totalKwh, homeRate, publicRate, homeAnnualCost, publicAnnualCost) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'ratioComparison';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'annualCostSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Home Charging Expense ', 'Public Station Expense '],
          datasets: [{
            data: [
              parseFloat(homeAnnualCost.toFixed(2)),
              parseFloat(publicAnnualCost.toFixed(2))
            ],
            backgroundColor: ['#4ade80', '#D95B43']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      var ratios = [0, 20, 40, 60, 80, 85, 100];
      var costs = ratios.map(function(r) {
        var hKwh = totalKwh * (r / 100.0);
        var pKwh = totalKwh * (1.0 - (r / 100.0));
        return parseFloat(((hKwh * homeRate) + (pKwh * publicRate)).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ratios.map(function(r) { return r + '% Home'; }),
          datasets: [{
            label: 'Total Annual Charging Cost ',
            data: costs,
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
    document.getElementById('input_annualMiles').value = 13000;
    document.getElementById('input_evEfficiency').value = 3.5;
    document.getElementById('input_homeRate').value = 0.14;
    document.getElementById('input_publicRate').value = 0.42;
    document.getElementById('input_homeChargeRatio').value = 85;
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
