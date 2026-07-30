/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Futures Position Size Calculator
   Tool ID: futures-position-size
   Supports: ES, NQ, CL, GC, and all futures contracts
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
      tickSize: parseFloat(document.getElementById('input_tickSize').value) || 0,
      tickValue: parseFloat(document.getElementById('input_tickValue').value) || 0,
      contractMultiplier: parseFloat(document.getElementById('input_contractMultiplier').value) || 1,
      leverage: parseFloat(document.getElementById('input_leverage').value) || 1
    }
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

    // ── Stop Distance (Points) ──
    var stopDistancePoints = inputs.entryPrice - inputs.stopLossPrice;

    // ── Value Per Point ──
    var valuePerPoint = 0;
    if (inputs.tickSize > 0) {
      valuePerPoint = inputs.tickValue / inputs.tickSize;
    }

    // ── Risk Per Contract ──
    var riskPerContract = stopDistancePoints * valuePerPoint;

    // ── Position Size (Contracts) ──
    var positionSizeContracts = 0;
    if (riskPerContract > 0) {
      positionSizeContracts = riskAmount / riskPerContract;
    }

    // ── Total Exposure ──
    var totalExposure = positionSizeContracts * inputs.entryPrice * inputs.contractMultiplier;

    // ── Required Margin ──
    var requiredMargin = 0;
    if (inputs.leverage > 0) {
      requiredMargin = totalExposure / inputs.leverage;
    }

    // ── Stop Distance (Ticks) ──
    var stopDistanceTicks = 0;
    if (inputs.tickSize > 0) {
      stopDistanceTicks = stopDistancePoints / inputs.tickSize;
    }

    // ── Update Outputs ──
    document.getElementById('output_positionSizeContracts').querySelector('.output-number').textContent = positionSizeContracts.toFixed(2) + ' contracts';
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_totalExposure').querySelector('.output-number').textContent = formatCurrency(totalExposure);
    document.getElementById('output_requiredMargin').querySelector('.output-number').textContent = formatCurrency(requiredMargin);
    document.getElementById('output_stopDistancePoints').querySelector('.output-number').textContent = stopDistancePoints.toFixed(2) + ' points';
    document.getElementById('output_stopDistanceTicks').querySelector('.output-number').textContent = Math.round(stopDistanceTicks) + ' ticks';
    document.getElementById('output_valuePerPoint').querySelector('.output-number').textContent = formatCurrency(valuePerPoint);
    document.getElementById('output_totalRiskPerContract').querySelector('.output-number').textContent = formatCurrency(riskPerContract);

    // ── Charts ──
    updateCharts({
      riskAmount: riskAmount,
      remainingBalance: inputs.accountBalance - riskAmount,
      totalExposure: totalExposure,
      requiredMargin: requiredMargin,
      accountBalance: inputs.accountBalance,
      positionSizeContracts: positionSizeContracts,
      stopDistancePoints: stopDistancePoints,
      stopDistanceTicks: stopDistanceTicks
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        entryPrice: inputs.entryPrice,
        stopLossPrice: inputs.stopLossPrice,
        tickSize: inputs.tickSize,
        tickValue: inputs.tickValue,
        positionSizeContracts: positionSizeContracts,
        riskAmount: riskAmount
      }
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
      var exposurePct = data.accountBalance > 0 ? (data.totalExposure / data.accountBalance) * 100 : 0;
      var marginPct = data.accountBalance > 0 ? (data.requiredMargin / data.accountBalance) * 100 : 0;

      return {
        type: 'bar',
        data: {
          labels: ['Risk Allocation', 'Exposure & Margin'],
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
      }
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
    var _el_input_accountBalance = document.getElementById('input_accountBalance');
    _el_input_accountBalance.value = (_el_input_accountBalance.dataset && _el_input_accountBalance.dataset.default !== undefined) ? _el_input_accountBalance.dataset.default : (_el_input_accountBalance.getAttribute('value') || '');
    var _el_input_riskPercent = document.getElementById('input_riskPercent');
    _el_input_riskPercent.value = (_el_input_riskPercent.dataset && _el_input_riskPercent.dataset.default !== undefined) ? _el_input_riskPercent.dataset.default : (_el_input_riskPercent.getAttribute('value') || '');
    var _el_input_entryPrice = document.getElementById('input_entryPrice');
    _el_input_entryPrice.value = (_el_input_entryPrice.dataset && _el_input_entryPrice.dataset.default !== undefined) ? _el_input_entryPrice.dataset.default : (_el_input_entryPrice.getAttribute('value') || '');
    var _el_input_stopLossPrice = document.getElementById('input_stopLossPrice');
    _el_input_stopLossPrice.value = (_el_input_stopLossPrice.dataset && _el_input_stopLossPrice.dataset.default !== undefined) ? _el_input_stopLossPrice.dataset.default : (_el_input_stopLossPrice.getAttribute('value') || '');
    var _el_input_currentPrice = document.getElementById('input_currentPrice');
    _el_input_currentPrice.value = (_el_input_currentPrice.dataset && _el_input_currentPrice.dataset.default !== undefined) ? _el_input_currentPrice.dataset.default : (_el_input_currentPrice.getAttribute('value') || '');
    var _el_input_tickSize = document.getElementById('input_tickSize');
    _el_input_tickSize.value = (_el_input_tickSize.dataset && _el_input_tickSize.dataset.default !== undefined) ? _el_input_tickSize.dataset.default : (_el_input_tickSize.getAttribute('value') || '');
    var _el_input_tickValue = document.getElementById('input_tickValue');
    _el_input_tickValue.value = (_el_input_tickValue.dataset && _el_input_tickValue.dataset.default !== undefined) ? _el_input_tickValue.dataset.default : (_el_input_tickValue.getAttribute('value') || '');
    var _el_input_contractMultiplier = document.getElementById('input_contractMultiplier');
    _el_input_contractMultiplier.value = (_el_input_contractMultiplier.dataset && _el_input_contractMultiplier.dataset.default !== undefined) ? _el_input_contractMultiplier.dataset.default : (_el_input_contractMultiplier.getAttribute('value') || '');
    var _el_input_leverage = document.getElementById('input_leverage');
    _el_input_leverage.value = (_el_input_leverage.dataset && _el_input_leverage.dataset.default !== undefined) ? _el_input_leverage.dataset.default : (_el_input_leverage.getAttribute('value') || '');
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

    
    if (typeof window.updateTool === 'function') window.updateTool();
  });

})();