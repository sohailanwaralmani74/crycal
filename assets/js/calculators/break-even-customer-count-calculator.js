(function() {

  var chartInstance = null;
  var currentTab = 'breakEvenGraph';
  var lastChartData = null;

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function updateTool() {

    var fixedCosts = parseFloat(document.getElementById('input_fixedCosts').value) || 0;
    var arpu = parseFloat(document.getElementById('input_arpu').value) || 1;
    var cogsPerAccount = parseFloat(document.getElementById('input_cogsPerAccount').value) || 0;

    var unitContribution = arpu - cogsPerAccount;
    if (unitContribution <= 0) unitContribution = 1;

    var breakEvenCustomers = Math.ceil(fixedCosts / unitContribution);
    var breakEvenMrr = breakEvenCustomers * arpu;
    var grossMarginPct = (unitContribution / arpu);

    var status = '';
    var recommendation = '';

    if (breakEvenCustomers <= 100) {
      status = '🚀 Low Threshold Breakeven (<= 100 Accounts)';
      recommendation = 'Achievable customer threshold. High ARPU or lean fixed costs enable fast profitability.';
    } else if (breakEvenCustomers <= 500) {
      status = '✅ Standard Breakeven (101 - 500 Accounts)';
      recommendation = 'Healthy operational balance. Focus on accelerating inbound trial conversion rates.';
    } else {
      status = '🟡 High Volume Breakeven (> 500 Accounts)';
      recommendation = 'Requires high subscriber volume. Consider increasing ARPU or trimming fixed OpEx overhead.';
    }

    setOutputText('output_breakEvenCustomers', breakEvenCustomers.toLocaleString() + ' Accounts');
    setOutputText('output_breakEvenMrr', formatCurrency(breakEvenMrr) + ' / mo');
    setOutputText('output_unitContribution', formatCurrency(unitContribution) + ' / acct');
    setOutputText('output_grossMarginPct', formatPercent(grossMarginPct));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      fixedCosts: fixedCosts,
      arpu: arpu,
      unitContribution: unitContribution,
      breakEvenCustomers: breakEvenCustomers,
      breakEvenMrr: breakEvenMrr
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        fixedCosts: fixedCosts,
        arpu: arpu,
        breakEvenCustomers: breakEvenCustomers,
        status: status
      });
    }

  }

  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {

    if (!data) return null;
    if (tab === 'breakEvenGraph') {
      var counts = [0, Math.round(data.breakEvenCustomers * 0.5), data.breakEvenCustomers, Math.round(data.breakEvenCustomers * 1.5), Math.round(data.breakEvenCustomers * 2.0)];
      var revenues = counts.map(function(c) { return c * data.arpu; });
      var totalCosts = counts.map(function(c) { return data.fixedCosts + (c * (data.arpu - data.unitContribution)); });
      return {
        type: 'line',
        data: {
          labels: counts.map(function(c){ return c + ' Accts'; }),
          datasets: [
            { label: 'Total Revenue ($)', data: revenues, borderColor: '#34D399', fill: false },
            { label: 'Total Costs ($)', data: totalCosts, borderColor: '#EC4899', fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'revenueSplit') {
      return {
        type: 'bar',
        data: {
          labels: ['At Breakeven Vol', 'At 2x Breakeven Vol'],
          datasets: [
            { label: 'Fixed Costs', data: [data.fixedCosts, data.fixedCosts], backgroundColor: '#EC4899' },
            { label: 'Net Operating Profit', data: [0, data.fixedCosts], backgroundColor: '#34D399' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    return null;

  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {

    document.getElementById('input_fixedCosts').value = 75000;
    document.getElementById('input_arpu').value = 250;
    document.getElementById('input_cogsPerAccount').value = 50;
    updateTool();

  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
