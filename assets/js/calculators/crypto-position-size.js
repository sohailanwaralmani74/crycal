/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Crypto Position Size Calculator
   Tool ID: crypto-position-size
   Supports: Linear (USDT-margined) & Inverse (Coin-margined)
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      entryPrice: parseFloat(document.getElementById('input_entryPrice').value) || 0,
      stopLossPrice: parseFloat(document.getElementById('input_stopLossPrice').value) || 0,
      currentPrice: parseFloat(document.getElementById('input_currentPrice').value) || 0,
      contractType: document.getElementById('input_contractType').value || 'linear',
      contractSize: parseFloat(document.getElementById('input_contractSize').value) || 1,
      leverage: parseFloat(document.getElementById('input_leverage').value) || 1
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

    // ── Calculate Price Distance ──
    var priceDistance = inputs.entryPrice - inputs.stopLossPrice;

    // ── Risk Amount ──
    var riskAmount = inputs.accountBalance * (inputs.riskPercent / 100);

    // ── Calculate Position Size ──
    var positionSizeContracts = 0;
    var positionSizeUnits = 0;

    if (priceDistance > 0 && inputs.contractType === 'linear') {
      // Linear: USDT-margined
      positionSizeContracts = riskAmount / priceDistance;
      // Adjust for contract size (e.g., 1 contract = $1 or user-defined)
      positionSizeUnits = positionSizeContracts * inputs.contractSize;
    } else if (priceDistance > 0 && inputs.contractType === 'inverse') {
      // Inverse: Coin-margined
      positionSizeContracts = (riskAmount * inputs.entryPrice) / priceDistance;
      // Adjust for contract size
      positionSizeUnits = positionSizeContracts / inputs.contractSize;
    }

    // ── Total Exposure ──
    var totalExposure = 0;
    if (inputs.contractType === 'linear') {
      totalExposure = positionSizeContracts * inputs.entryPrice;
    } else {
      totalExposure = (positionSizeContracts / inputs.entryPrice) * inputs.entryPrice;
    }

    // ── Required Margin ──
    var requiredMargin = 0;
    if (inputs.leverage > 0) {
      requiredMargin = totalExposure / inputs.leverage;
    }

    // ── Update Outputs ──
    document.getElementById('output_positionSizeContracts').querySelector('.output-number').textContent = positionSizeContracts.toFixed(2) + ' contracts';
    document.getElementById('output_positionSizeUnits').querySelector('.output-number').textContent = positionSizeUnits.toFixed(2) + ' units';
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_totalExposure').querySelector('.output-number').textContent = formatCurrency(totalExposure);
    document.getElementById('output_requiredMargin').querySelector('.output-number').textContent = formatCurrency(requiredMargin);
    document.getElementById('output_priceDistance').querySelector('.output-number').textContent = formatCurrency(priceDistance);

    // ── Charts ──
    updateCharts({
      riskAmount: riskAmount,
      remainingBalance: inputs.accountBalance - riskAmount,
      totalExposure: totalExposure,
      requiredMargin: requiredMargin,
      accountBalance: inputs.accountBalance,
      entryPrice: inputs.entryPrice,
      stopLossPrice: inputs.stopLossPrice,
      priceDistance: priceDistance,
      positionSizeContracts: positionSizeContracts,
      contractType: inputs.contractType
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        entryPrice: inputs.entryPrice,
        stopLossPrice: inputs.stopLossPrice,
        contractType: inputs.contractType,
        positionSizeContracts: positionSizeContracts,
        riskAmount: riskAmount
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
      // Risk vs Remaining
      var riskPct = (data.riskAmount / data.accountBalance) * 100;
      var remainingPct = 100 - riskPct;

      // Exposure vs Margin
      var exposurePct = data.accountBalance > 0 ? (data.totalExposure / data.accountBalance) * 100 : 0;
      var marginPct = data.accountBalance > 0 ? (data.requiredMargin / data.accountBalance) * 100 : 0;

      return {
        type: 'bar',
        data: {
          labels: ['Risk Allocation', 'Exposure vs Margin'],
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
              label: 'Total Exposure (' + exposurePct.toFixed(1) + '%)',
              data: [0, data.totalExposure],
              backgroundColor: '#C08A2E',
              borderColor: '#A87520',
              borderWidth: 1
            },
            {
              label: 'Required Margin (' + marginPct.toFixed(1) + '%)',
              data: [0, data.requiredMargin],
              backgroundColor: '#4A90D9',
              borderColor: '#3a7b8c',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Risk, Exposure & Margin', font: { size: 14 } }
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
    document.getElementById('input_accountBalance').value = 10000;
    document.getElementById('input_riskPercent').value = 1.0;
    document.getElementById('input_entryPrice').value = 60000;
    document.getElementById('input_stopLossPrice').value = 58200;
    document.getElementById('input_currentPrice').value = 60000;
    document.getElementById('input_contractType').value = 'linear';
    document.getElementById('input_contractSize').value = 1;
    document.getElementById('input_leverage').value = 1;
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