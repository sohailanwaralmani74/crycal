/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Options Position Size Calculator
   Tool ID: options-position-size
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      optionPremium: parseFloat(document.getElementById('input_optionPremium').value) || 0,
      delta: parseFloat(document.getElementById('input_delta').value) || 0,
      contractMultiplier: parseFloat(document.getElementById('input_contractMultiplier').value) || 100,
      underlyingPrice: parseFloat(document.getElementById('input_underlyingPrice').value) || 0,
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Risk Amount ──
    var riskAmount = inputs.accountBalance * (inputs.riskPercent / 100);

    // ── Total Cost Per Contract ──
    var costPerContract = inputs.optionPremium * inputs.contractMultiplier;

    // ── Number of Contracts ──
    var numberOfContracts = 0;
    if (costPerContract > 0) {
      numberOfContracts = riskAmount / costPerContract;
    }

    // ── Total Premium Cost ──
    var totalPremiumCost = numberOfContracts * costPerContract;

    // ── Delta-Adjusted Shares ──
    var deltaAdjustedShares = numberOfContracts * inputs.delta * inputs.contractMultiplier;

    // ── Delta-Adjusted Exposure ──
    var deltaAdjustedExposure = 0;
    if (inputs.underlyingPrice > 0) {
      deltaAdjustedExposure = deltaAdjustedShares * inputs.underlyingPrice;
    }

    // ── Effective Delta (as a percentage of account) ──
    var effectiveDelta = inputs.accountBalance > 0 ? (deltaAdjustedExposure / inputs.accountBalance) * 100 : 0;

    // ── Update Outputs ──
    document.getElementById('output_numberOfContracts').querySelector('.output-number').textContent = Math.round(numberOfContracts);
    document.getElementById('output_totalPremiumCost').querySelector('.output-number').textContent = formatCurrency(totalPremiumCost);
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_deltaAdjustedShares').querySelector('.output-number').textContent = deltaAdjustedShares.toFixed(0);
    document.getElementById('output_deltaAdjustedExposure').querySelector('.output-number').textContent = formatCurrency(deltaAdjustedExposure);
    document.getElementById('output_effectiveDelta').querySelector('.output-number').textContent = effectiveDelta.toFixed(1) + '%';

    // ── Charts ──
    updateCharts({
      riskAmount: riskAmount,
      remainingBalance: inputs.accountBalance - riskAmount,
      totalPremiumCost: totalPremiumCost,
      deltaAdjustedExposure: deltaAdjustedExposure,
      accountBalance: inputs.accountBalance,
      numberOfContracts: numberOfContracts
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        optionPremium: inputs.optionPremium,
        delta: inputs.delta,
        numberOfContracts: Math.round(numberOfContracts),
        totalPremiumCost: totalPremiumCost
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');

    if (tab === 'comparison') {
      var riskPct = (data.riskAmount / data.accountBalance) * 100;
      var remainingPct = 100 - riskPct;

      // For exposure vs account
      var exposurePct = data.accountBalance > 0 ? (data.deltaAdjustedExposure / data.accountBalance) * 100 : 0;

      return {
        type: 'bar',
        data: {
          labels: ['Risk Allocation', 'Delta-Adjusted Exposure'],
          datasets: [
            {
              label: 'Risk Amount (' + riskPct.toFixed(1) + '%)',
              data: [data.riskAmount, 0],
              backgroundColor: '#B23A3A',
              borderColor: '#8a2a2a',
              borderWidth: 1
            },
            {
              label: 'Remaining Balance (' + remainingPct.toFixed(1) + '%)',
              data: [data.accountBalance - data.riskAmount, 0],
              backgroundColor: '#2F6F5E',
              borderColor: '#1f4f42',
              borderWidth: 1
            },
            {
              label: 'Delta-Adjusted Exposure (' + exposurePct.toFixed(1) + '%)',
              data: [0, data.deltaAdjustedExposure],
              backgroundColor: '#C08A2E',
              borderColor: '#A87520',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Risk & Exposure', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_accountBalance').value = 25000;
    document.getElementById('input_riskPercent').value = 1.0;
    document.getElementById('input_optionPremium').value = 2.50;
    document.getElementById('input_delta').value = 0.50;
    document.getElementById('input_contractMultiplier').value = 100;
    document.getElementById('input_underlyingPrice').value = 0;
    document.getElementById('input_compoundingFrequency').value = 'monthly';
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);
  });

})();