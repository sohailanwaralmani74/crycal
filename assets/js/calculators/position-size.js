/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Position Size Calculator
   Tool ID: position-size
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      stopLoss: parseFloat(document.getElementById('input_stopLoss').value) || 0,
      unitValue: parseFloat(document.getElementById('input_unitValue').value) || 0,
      unitType: document.getElementById('input_unitType').value || 'pips',
      positionUnit: document.getElementById('input_positionUnit').value || 'lots',
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

    // ── Calculate Position Size ──
    var positionSize = 0;
    if (inputs.stopLoss > 0 && inputs.unitValue > 0) {
      positionSize = riskAmount / (inputs.stopLoss * inputs.unitValue);
    }

    // ── Total Exposure ──
    var totalExposure = positionSize * inputs.stopLoss * inputs.unitValue;

    // ── Update Outputs ──
    document.getElementById('output_positionSize').querySelector('.output-number').textContent = positionSize.toFixed(4) + ' ' + inputs.positionUnit;
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_totalExposure').querySelector('.output-number').textContent = formatCurrency(totalExposure);

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      var items = [
        { label: 'Account Balance', amount: inputs.accountBalance, highlight: false },
        { label: 'Risk %', amount: inputs.riskPercent, suffix: '%', highlight: false },
        { label: 'Risk Amount', amount: riskAmount, highlight: true, color: '#B23A3A' },
        { label: 'Stop-Loss Distance', amount: inputs.stopLoss, suffix: ' ' + inputs.unitType, highlight: false },
        { label: 'Per-Unit Value', amount: inputs.unitValue, suffix: ' ' + inputs.unitType, highlight: false },
        { label: 'Position Size', amount: positionSize, suffix: ' ' + inputs.positionUnit, highlight: true, color: '#2F6F5E' },
        { label: 'Total Exposure', amount: totalExposure, highlight: true, color: '#C08A2E' }
      ];

      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = item.color ? 'color: ' + item.color + ';' : '';
        var suffix = item.suffix || '';
        var valueStr = typeof item.amount === 'number' && !isNaN(item.amount) 
          ? (item.label === 'Risk Amount' || item.label === 'Account Balance' || item.label === 'Total Exposure') 
            ? formatCurrency(item.amount) 
            : item.amount.toFixed(4) + suffix
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
      positionSize: positionSize,
      totalExposure: totalExposure,
      accountBalance: inputs.accountBalance
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        stopLoss: inputs.stopLoss,
        unitValue: inputs.unitValue,
        positionSize: positionSize,
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
    document.getElementById('input_stopLoss').value = 50;
    document.getElementById('input_unitValue').value = 10;
    document.getElementById('input_unitType').value = 'pips';
    document.getElementById('input_positionUnit').value = 'lots';
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