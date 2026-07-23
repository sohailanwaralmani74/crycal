(function() {
  var chartInstance = null;
  var currentTab = 'cac';
  var lastChartData = null;

  function getInputs() {
    var channel1Spend = parseFloat(document.getElementById('input_channel1Spend').value) || 0;
    var channel1Deals = parseFloat(document.getElementById('input_channel1Deals').value) || 1;
    var channel2Spend = parseFloat(document.getElementById('input_channel2Spend').value) || 0;
    var channel2Deals = parseFloat(document.getElementById('input_channel2Deals').value) || 1;
    var arpu = parseFloat(document.getElementById('input_arpu').value) || 150;
    var grossMargin = parseFloat(document.getElementById('input_grossMargin').value) || 80;

    return {
      channel1Spend: channel1Spend,
      channel1Deals: channel1Deals,
      channel2Spend: channel2Spend,
      channel2Deals: channel2Deals,
      arpu: arpu,
      grossMargin: grossMargin / 100
    };
  }

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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateChannelComparison(inputs) {
    var c1Spend = inputs.channel1Spend;
    var c1Deals = inputs.channel1Deals;
    var c2Spend = inputs.channel2Spend;
    var c2Deals = inputs.channel2Deals;
    var arpu = inputs.arpu;
    var margin = inputs.grossMargin;

    if (c1Deals <= 0 || c2Deals <= 0 || arpu <= 0 || margin <= 0) {
      return { error: 'Deals, ARPU, and Margin must be greater than zero.' };
    }

    var c1Cac = c1Spend / c1Deals;
    var c2Cac = c2Spend / c2Deals;

    var monthlyMarginContribution = arpu * margin;
    var c1Payback = c1Cac / monthlyMarginContribution;
    var c2Payback = c2Cac / monthlyMarginContribution;

    var winner = c1Cac < c2Cac ? 'Channel 1 (Lower CAC & Faster Payback)' : 'Channel 2 (Lower CAC & Faster Payback)';
    if (Math.abs(c1Cac - c2Cac) < 1) winner = 'Equal Efficiency Across Channels';

    return {
      channel1Cac: c1Cac,
      channel1Payback: c1Payback,
      channel2Cac: c2Cac,
      channel2Payback: c2Payback,
      bestChannel: winner,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateChannelComparison(inputs);

    if (result.error) {
      setOutputText('output_channel1Cac', '—');
      setOutputText('output_channel1Payback', '—');
      setOutputText('output_channel2Cac', '—');
      setOutputText('output_channel2Payback', '—');
      setOutputText('output_bestChannel', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_channel1Cac', formatCurrency(result.channel1Cac));
    setOutputText('output_channel1Payback', result.channel1Payback.toFixed(1) + ' months');
    setOutputText('output_channel2Cac', formatCurrency(result.channel2Cac));
    setOutputText('output_channel2Payback', result.channel2Payback.toFixed(1) + ' months');
    setOutputText('output_bestChannel', result.bestChannel);

    var chartPayload = {
      c1Cac: result.channel1Cac,
      c2Cac: result.channel2Cac,
      c1Payback: result.channel1Payback,
      c2Payback: result.channel2Payback
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        channel1Spend: inputs.channel1Spend,
        channel2Spend: inputs.channel2Spend,
        channel1Cac: formatCurrency(result.channel1Cac),
        channel2Cac: formatCurrency(result.channel2Cac)
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

    if (tab === 'cac') {
      return {
        type: 'bar',
        data: {
          labels: ['Channel 1 CAC', 'Channel 2 CAC'],
          datasets: [{
            label: 'CAC ($)',
            data: [data.c1Cac, data.c2Cac],
            backgroundColor: [data.c1Cac <= data.c2Cac ? '#10b981' : '#ef4444', data.c2Cac <= data.c1Cac ? '#10b981' : '#ef4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Customer Acquisition Cost (CAC) Comparison ($)', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    if (tab === 'payback') {
      return {
        type: 'bar',
        data: {
          labels: ['Channel 1 Payback (Months)', 'Channel 2 Payback (Months)'],
          datasets: [{
            label: 'Months',
            data: [data.c1Payback, data.c2Payback],
            backgroundColor: ['#3b82f6', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'CAC Payback Period in Months', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_channel1Spend').value = 15000;
    document.getElementById('input_channel1Deals').value = 15;
    document.getElementById('input_channel2Spend').value = 8000;
    document.getElementById('input_channel2Deals').value = 16;
    document.getElementById('input_arpu').value = 150;
    document.getElementById('input_grossMargin').value = 80;
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
