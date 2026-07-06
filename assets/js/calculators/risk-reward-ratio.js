/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Risk Reward Ratio Calculator
   Tool ID: risk-reward-ratio
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      entryPrice: parseFloat(document.getElementById('input_entryPrice').value) || 0,
      stopLossPrice: parseFloat(document.getElementById('input_stopLossPrice').value) || 0,
      takeProfitPrice: parseFloat(document.getElementById('input_takeProfitPrice').value) || 0,
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      positionSize: parseFloat(document.getElementById('input_positionSize').value) || 0,
      perUnitValue: parseFloat(document.getElementById('input_perUnitValue').value) || 0,
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

    // ── Distances (Long trade) ──
    var riskDistance = Math.abs(inputs.entryPrice - inputs.stopLossPrice);
    var rewardDistance = Math.abs(inputs.takeProfitPrice - inputs.entryPrice);

    // ── Risk Reward Ratio ──
    var riskRewardRatio = 0;
    if (rewardDistance > 0) {
      riskRewardRatio = riskDistance / rewardDistance;
    }

    // ── Reward to Risk Ratio ──
    var rewardToRiskRatio = 0;
    if (riskDistance > 0) {
      rewardToRiskRatio = rewardDistance / riskDistance;
    }

    // ── Dollar Risk & Reward ──
    var riskAmount = 0;
    var rewardAmount = 0;
    if (inputs.positionSize > 0 && inputs.perUnitValue > 0) {
      riskAmount = riskDistance * inputs.positionSize * inputs.perUnitValue;
      rewardAmount = rewardDistance * inputs.positionSize * inputs.perUnitValue;
    }

    // ── Risk Percentage ──
    var riskPercentage = 0;
    if (inputs.accountBalance > 0 && riskAmount > 0) {
      riskPercentage = (riskAmount / inputs.accountBalance) * 100;
    }

    // ── Required TP for 1:2 ──
    var requiredTP12 = 0;
    if (inputs.entryPrice > 0 && riskDistance > 0) {
      requiredTP12 = inputs.entryPrice + (riskDistance * 2);
    }

    // ── Update Outputs ──
    document.getElementById('output_riskDistance').querySelector('.output-number').textContent = formatCurrency(riskDistance);
    document.getElementById('output_rewardDistance').querySelector('.output-number').textContent = formatCurrency(rewardDistance);
    document.getElementById('output_riskRewardRatio').querySelector('.output-number').textContent = '1:' + riskRewardRatio.toFixed(2);
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_rewardAmount').querySelector('.output-number').textContent = formatCurrency(rewardAmount);
    document.getElementById('output_rewardToRiskRatio').querySelector('.output-number').textContent = rewardToRiskRatio.toFixed(2) + ':1';
    document.getElementById('output_riskPercentage').querySelector('.output-number').textContent = riskPercentage.toFixed(1) + '%';
    document.getElementById('output_requiredTakeProfit').querySelector('.output-number').textContent = formatCurrency(requiredTP12);

    // ── Charts ──
    updateCharts({
      riskAmount: riskAmount,
      rewardAmount: rewardAmount,
      riskDistance: riskDistance,
      rewardDistance: rewardDistance,
      accountBalance: inputs.accountBalance,
      riskRewardRatio: riskRewardRatio,
      entryPrice: inputs.entryPrice,
      stopLossPrice: inputs.stopLossPrice,
      takeProfitPrice: inputs.takeProfitPrice,
      requiredTP12: requiredTP12
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        entryPrice: inputs.entryPrice,
        stopLossPrice: inputs.stopLossPrice,
        takeProfitPrice: inputs.takeProfitPrice,
        riskRewardRatio: '1:' + riskRewardRatio.toFixed(2),
        riskAmount: riskAmount,
        rewardAmount: rewardAmount
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
      // Risk vs Reward (Dollar)
      var hasDollarValues = data.riskAmount > 0 || data.rewardAmount > 0;

      if (hasDollarValues) {
        // Show dollar comparison
        var total = data.riskAmount + data.rewardAmount;

        return {
          type: 'bar',
          data: {
            labels: ['Risk', 'Reward'],
            datasets: [{
              label: 'Amount',
              data: [data.riskAmount, data.rewardAmount],
              backgroundColor: ['#B23A3A', '#2F6F5E'],
              borderColor: ['#8a2a2a', '#1f4f42'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Risk vs Reward (Dollar)', font: { size: 14 } },
              tooltip: {
                callbacks: {
                  label: function(ctx) {
                    var label = ctx.label || '';
                    var value = ctx.parsed.y || 0;
                    var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                    return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
                  }
                }
              }
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
      } else {
        // Show price levels
        var minPrice = Math.min(data.stopLossPrice, data.entryPrice, data.takeProfitPrice, data.requiredTP12);
        var maxPrice = Math.max(data.stopLossPrice, data.entryPrice, data.takeProfitPrice, data.requiredTP12);
        var padding = (maxPrice - minPrice) * 0.1 || 5;

        return {
          type: 'line',
          data: {
            labels: ['Entry', 'Stop-Loss', 'Take-Profit', '1:2 Target'],
            datasets: [{
              label: 'Price Levels',
              data: [data.entryPrice, data.stopLossPrice, data.takeProfitPrice, data.requiredTP12],
              backgroundColor: ['#C08A2E', '#B23A3A', '#2F6F5E', '#4A90D9'],
              borderColor: ['#A87520', '#8a2a2a', '#1f4f42', '#3a7b8c'],
              borderWidth: 1,
              pointRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Price Level Comparison', font: { size: 14 } },
              tooltip: {
                callbacks: {
                  label: function(ctx) {
                    return ctx.label + ': ' + currencySymbol + ctx.parsed.y.toFixed(2);
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                title: { display: true, text: 'Price (' + currencySymbol + ')' },
                ticks: {
                  callback: function(v) { return currencySymbol + v.toFixed(2); }
                }
              }
            }
          }
        };
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
    document.getElementById('input_entryPrice').value = 100.00;
    document.getElementById('input_stopLossPrice').value = 95.00;
    document.getElementById('input_takeProfitPrice').value = 110.00;
    document.getElementById('input_accountBalance').value = 10000;
    document.getElementById('input_riskPercent').value = 1.0;
    document.getElementById('input_positionSize').value = 100;
    document.getElementById('input_perUnitValue').value = 1;
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