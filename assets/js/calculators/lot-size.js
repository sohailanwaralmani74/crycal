/* ═══════════════════════════════════════════════════════════
   CRYCAL — Lot Size Calculator
   Tool ID: lot-size
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      accountBalance: parseFloat(document.getElementById('input_accountBalance').value) || 0,
      riskPercent: parseFloat(document.getElementById('input_riskPercent').value) || 0,
      stopLossPips: parseFloat(document.getElementById('input_stopLossPips').value) || 0,
      pipValue: parseFloat(document.getElementById('input_pipValue').value) || 0,
      accountCurrency: document.getElementById('input_accountCurrency').value || 'USD',
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

    // ── Calculate Position Size (standard lots) ──
    var positionSizeLots = 0;
    if (inputs.stopLossPips > 0 && inputs.pipValue > 0) {
      positionSizeLots = riskAmount / (inputs.stopLossPips * inputs.pipValue);
    }

    // ── Convert to Mini and Micro Lots ──
    var miniLots = positionSizeLots * 10;
    var microLots = positionSizeLots * 100;

    // ── Total Exposure ──
    var totalExposure = positionSizeLots * inputs.stopLossPips * inputs.pipValue;

    // ── Update Outputs ──
    document.getElementById('output_positionSizeLots').querySelector('.output-number').textContent = positionSizeLots.toFixed(2) + ' lots';
    document.getElementById('output_riskAmount').querySelector('.output-number').textContent = formatCurrency(riskAmount);
    document.getElementById('output_pipValueDisplay').querySelector('.output-number').textContent = formatCurrency(inputs.pipValue);
    document.getElementById('output_totalExposure').querySelector('.output-number').textContent = formatCurrency(totalExposure);
    document.getElementById('output_miniLots').querySelector('.output-number').textContent = miniLots.toFixed(2) + ' mini lots';
    document.getElementById('output_microLots').querySelector('.output-number').textContent = microLots.toFixed(2) + ' micro lots';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      var items = [
        { label: 'Account Balance', amount: inputs.accountBalance, highlight: false },
        { label: 'Risk %', amount: inputs.riskPercent, suffix: '%', highlight: false },
        { label: 'Risk Amount', amount: riskAmount, highlight: true, color: '#B23A3A' },
        { label: 'Stop-Loss (pips)', amount: inputs.stopLossPips, highlight: false },
        { label: 'Pip Value', amount: inputs.pipValue, highlight: false },
        { label: 'Standard Lots', amount: positionSizeLots, suffix: ' lots', highlight: true, color: '#2F6F5E' },
        { label: 'Mini Lots', amount: miniLots, suffix: ' mini lots', highlight: true, color: '#C08A2E' },
        { label: 'Micro Lots', amount: microLots, suffix: ' micro lots', highlight: true, color: '#4A90D9' },
        { label: 'Total Exposure', amount: totalExposure, highlight: true, color: '#8E44AD' }
      ];

      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = item.color ? 'color: ' + item.color + ';' : '';
        var suffix = item.suffix || '';
        var valueStr = typeof item.amount === 'number' && !isNaN(item.amount) 
          ? (item.label === 'Risk Amount' || item.label === 'Account Balance' || item.label === 'Total Exposure' || item.label === 'Pip Value') 
            ? formatCurrency(item.amount) 
            : item.amount.toFixed(2) + suffix
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
      positionSizeLots: positionSizeLots,
      miniLots: miniLots,
      microLots: microLots,
      accountBalance: inputs.accountBalance
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        accountBalance: inputs.accountBalance,
        riskPercent: inputs.riskPercent,
        stopLossPips: inputs.stopLossPips,
        pipValue: inputs.pipValue,
        positionSizeLots: positionSizeLots,
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
      return {
        type: 'bar',
        data: {
          labels: ['Standard Lots', 'Mini Lots', 'Micro Lots'],
          datasets: [{
            label: 'Position Size',
            data: [data.positionSizeLots, data.miniLots, data.microLots],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#4A90D9'],
            borderColor: ['#1f4f42', '#A87520', '#3a7b8c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Lot Size Comparison', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Units' }
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
    document.getElementById('input_stopLossPips').value = 50;
    document.getElementById('input_pipValue').value = 10;
    document.getElementById('input_accountCurrency').value = 'USD';
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