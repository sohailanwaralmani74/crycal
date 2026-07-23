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
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    } catch (e) {
      return '$' + num.toFixed(0);
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

  function getAgiCap(status) {
    switch (status) {
      case 'single': return 150000;
      case 'head_of_household': return 225000;
      case 'joint':
      default: return 300000;
    }
  }

  function getMsrpCap(type) {
    return (type === 'sedan') ? 55000 : 80000;
  }

  function calculate() {
    var msrp = parseFloat(document.getElementById('input_msrp').value) || 45000;
    var vehicleType = document.getElementById('input_vehicleType').value;
    var filingStatus = document.getElementById('input_filingStatus').value;
    var agi = parseFloat(document.getElementById('input_agi').value) || 140000;
    var assembly = document.getElementById('input_assemblyLocation').value;
    var battery = document.getElementById('input_batterySourcing').value;
    var stateRebate = parseFloat(document.getElementById('input_stateRebate').value) || 0;

    var agiCap = getAgiCap(filingStatus);
    var msrpCap = getMsrpCap(vehicleType);

    var incomeOk = (agi <= agiCap);
    var msrpOk = (msrp <= msrpCap);
    var assemblyOk = (assembly === 'north_america');

    var fedCredit = 0;
    if (incomeOk && msrpOk && assemblyOk) {
      if (battery === 'full') {
        fedCredit = 7500;
      } else if (battery === 'partial') {
        fedCredit = 3750;
      } else {
        fedCredit = 0;
      }
    }

    var totalIncentive = fedCredit + stateRebate;
    var effectivePrice = Math.max(0, msrp - totalIncentive);

    var incomeStatusText = incomeOk ? '✅ Eligible (Below ' + formatCurrency(agiCap) + ')' : '❌ Ineligible (Exceeds ' + formatCurrency(agiCap) + ')';
    var msrpStatusText = msrpOk ? '✅ Eligible (Below ' + formatCurrency(msrpCap) + ')' : '❌ Ineligible (Exceeds ' + formatCurrency(msrpCap) + ')';

    setOutput('federalCredit', formatCurrency(fedCredit));
    setOutput('stateRebateAmount', formatCurrency(stateRebate));
    setOutput('totalIncentive', formatCurrency(totalIncentive));
    setOutput('effectivePrice', formatCurrency(effectivePrice));
    setOutput('incomeEligible', incomeStatusText);
    setOutput('msrpEligible', msrpStatusText);

    updateChart(msrp, fedCredit, stateRebate, effectivePrice);

    if (window.logHistory) {
      window.logHistory('ev-tax-credit-rebate-estimator', {
        federalCredit: formatCurrency(fedCredit),
        totalIncentive: formatCurrency(totalIncentive),
        effectivePrice: formatCurrency(effectivePrice),
        incomeEligible: incomeOk ? 'Eligible' : 'Exceeded'
      });
    }
  }

  function updateChart(msrp, fedCredit, stateRebate, effectivePrice) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTabEl = document.querySelector('.chart-tab.active');
    var activeTab = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'priceBreakdown';

    var ctx = canvas.getContext('2d');

    if (activeTab === 'incentiveSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Federal $7.5k Tax Credit', 'State & Utility Rebate'],
          datasets: [{
            data: [fedCredit, stateRebate],
            backgroundColor: ['#4A90D9', '#4ade80']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Vehicle Price'],
          datasets: [
            {
              label: 'Net Effective Price ',
              data: [effectivePrice],
              backgroundColor: '#4ade80'
            },
            {
              label: 'Federal Tax Credit ',
              data: [fedCredit],
              backgroundColor: '#4A90D9'
            },
            {
              label: 'State Rebate ',
              data: [stateRebate],
              backgroundColor: '#fbbf24'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_msrp').value = 45000;
    document.getElementById('input_vehicleType').value = 'suv_truck_van';
    document.getElementById('input_filingStatus').value = 'joint';
    document.getElementById('input_agi').value = 140000;
    document.getElementById('input_assemblyLocation').value = 'north_america';
    document.getElementById('input_batterySourcing').value = 'full';
    document.getElementById('input_stateRebate').value = 2000;
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
