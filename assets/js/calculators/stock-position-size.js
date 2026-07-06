/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Stock Position Size Calculator
   Tool ID: stock-position-size
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      stopLossAmount: parseFloat(document.getElementById('input_stopLossAmount').value) || 0,
      stockPrice: parseFloat(document.getElementById('input_stockPrice').value) || 0,
      stockSymbol: document.getElementById('input_stockSymbol').value || '',
      includeCommission: document.getElementById('input_includeCommission').value === 'true',
      commissionAmount: parseFloat(document.getElementById('input_commissionAmount').value) || 0,
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

    // ── Calculate Risk Amount ──
    var riskAmount = inputs.accountBalance * (inputs.riskPercent / 100);

    // ── Calculate Number of Shares ──
    var numberOfShares = 0;
    if (inputs.stopLossAmount > 0) {
      numberOfShares = riskAmount / inputs.stopLossAmount;
    }

    // ── Commission ──
    var commission = inputs.includeCommission ? inputs.commissionAmount : 0;

    // ── Total Cost ──
    var totalCost = numberOfShares * inputs.stockPrice;
    var totalCostWithCommission = totalCost + commission;

    // ── Position Size Value ──
    var positionSizeValue = numberOfShares * inputs.stockPrice;

    // ── Risk Per Share ──
    var riskPerShare = inputs.stopLossAmount;

    // ── Update Outputs ──
    var symbolDisplay = inputs.stockSymbol ? ' shares of ' + inputs.stockSymbol : ' shares';
    document.getElementById('output_numberOfShares').querySelector('.output-number').textContent = numberOfShares.toFixed(0) + symbolDisplay;
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_totalCost').querySelector('.output-number').textContent = formatCurrency(totalCostWithCommission);
    document.getElementById('output_positionSizeValue').querySelector('.output-number').textContent = formatCurrency(positionSizeValue);
    document.getElementById('output_riskPerShare').querySelector('.output-number').textContent = formatCurrency(riskPerShare);
    document.getElementById('output_commissionOutput').querySelector('.output-number').textContent = formatCurrency(commission);

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      var symbol = inputs.stockSymbol ? ' (' + inputs.stockSymbol + ')' : '';
      var items = [
        { label: 'Account Balance', amount: inputs.accountBalance, highlight: false },
        { label: 'Risk %', amount: inputs.riskPercent, suffix: '%', highlight: false },
        { label: 'Risk Amount', amount: riskAmount, highlight: true, color: '#B23A3A' },
        { label: 'Stop-Loss per Share', amount: inputs.stopLossAmount, highlight: false },
        { label: 'Stock Price' + symbol, amount: inputs.stockPrice, highlight: false },
        { label: 'Number of Shares', amount: numberOfShares, suffix: ' shares', highlight: true, color: '#2F6F5E' },
        { label: 'Total Cost (without commission)', amount: totalCost, highlight: false }
      ];

      if (commission > 0) {
        items.push({ label: 'Commission', amount: commission, highlight: false, color: '#F39C12' });
        items.push({ label: 'Total Cost (with commission)', amount: totalCostWithCommission, highlight: true, color: '#8E44AD' });
      }

      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = item.color ? 'color: ' + item.color + ';' : '';
        var suffix = item.suffix || '';
        var valueStr = typeof item.amount === 'number' && !isNaN(item.amount) 
          ? (item.label === 'Risk Amount' || item.label === 'Account Balance' || item.label === 'Stock Price' || item.label === 'Total Cost' || item.label === 'Total Cost (with commission)' || item.label === 'Commission' || item.label === 'Stop-Loss per Share') 
            ? formatCurrency(item.amount) 
            : item.amount.toFixed(0) + suffix
          : '—';
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default); ' + style + '">';
        html += '<span style="' + (item.highlight ? 'font-weight: 600;' : 'color: var(--text-muted);') + '">' + item.label + '</span>';
        html += '<span style="' + color + '"><strong>' + valueStr + '</strong></span>';
        html += '</div>';
      });

      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      riskAmount: riskAmount,
      remainingBalance: inputs.accountBalance - riskAmount,
      numberOfShares: numberOfShares,
      totalCost: totalCostWithCommission,
      accountBalance: inputs.accountBalance,
      stockPrice: inputs.stockPrice,
      commission: commission,
      positionSizeValue: positionSizeValue
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        stopLossAmount: inputs.stopLossAmount,
        stockPrice: inputs.stockPrice,
        numberOfShares: numberOfShares,
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

    if (tab === 'breakdown') {
      var riskPct = (data.riskAmount / data.accountBalance) * 100;
      var remainingPct = 100 - riskPct;

      return {
        type: 'doughnut',
        data: {
          labels: ['Risk Amount (' + riskPct.toFixed(1) + '%)', 'Remaining Balance (' + remainingPct.toFixed(1) + '%)'],
          datasets: [{
            data: [data.riskAmount, data.accountBalance - data.riskAmount],
            backgroundColor: ['#B23A3A', '#2F6F5E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Risk Allocation', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  return label + ': ' + currencySymbol + value.toFixed(2);
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'comparison') {
      var totalCost = data.positionSizeValue;
      var commission = data.commission || 0;

      return {
        type: 'bar',
        data: {
          labels: ['Position Size', 'Commission', 'Total Cost'],
          datasets: [{
            label: 'Amount',
            data: [totalCost, commission, totalCost + commission],
            backgroundColor: ['#2F6F5E', '#F39C12', '#8E44AD'],
            borderColor: ['#1f4f42', '#c97d0c', '#6c3483'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cost Breakdown', font: { size: 14 } }
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
    document.getElementById('input_accountBalance').value = 50000;
    document.getElementById('input_riskPercent').value = 1.0;
    document.getElementById('input_stopLossAmount').value = 2.50;
    document.getElementById('input_stockPrice').value = 50.00;
    document.getElementById('input_stockSymbol').value = '';
    document.getElementById('input_includeCommission').value = 'false';
    document.getElementById('input_commissionAmount').value = 0;
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