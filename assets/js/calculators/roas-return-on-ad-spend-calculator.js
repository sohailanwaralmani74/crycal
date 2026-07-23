(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  function getInputs() {
    var adSpend = parseFloat(document.getElementById('input_adSpend').value) || 0;
    var revenueGenerated = parseFloat(document.getElementById('input_revenueGenerated').value) || 0;
    var profitMargin = parseFloat(document.getElementById('input_profitMargin').value) || 70;

    return {
      adSpend: adSpend,
      revenueGenerated: revenueGenerated,
      profitMargin: profitMargin / 100
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

  function calculateROAS(inputs) {
    var adSpend = inputs.adSpend;
    var revenue = inputs.revenueGenerated;
    var margin = inputs.profitMargin;

    if (adSpend <= 0) {
      return { error: 'Ad spend must be greater than zero.' };
    }

    var roasRatio = revenue / adSpend;
    var roasPercentage = roasRatio * 100;
    var netProfit = revenue - adSpend;
    var breakEvenRoas = margin > 0 ? (1 / margin) : 1;
    var isProfitable = roasRatio >= breakEvenRoas;

    return {
      roasRatio: roasRatio,
      roasPercentage: roasPercentage,
      netProfit: netProfit,
      breakEvenRoas: breakEvenRoas,
      isProfitable: isProfitable,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateROAS(inputs);

    if (result.error) {
      setOutputText('output_roasRatio', '—');
      setOutputText('output_roasPercentage', '—');
      setOutputText('output_netProfit', '—');
      setOutputText('output_breakEvenRoas', '—');
      setOutputText('output_profitMarginPostAd', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_roasRatio', result.roasRatio.toFixed(2) + 'x');
    setOutputText('output_roasPercentage', result.roasPercentage.toFixed(0) + '%');
    setOutputText('output_netProfit', formatCurrency(result.netProfit));
    setOutputText('output_breakEvenRoas', result.breakEvenRoas.toFixed(2) + 'x');
    setOutputText('output_profitMarginPostAd', result.isProfitable ? 'Profitable (Exceeds Target)' : 'Unprofitable (Below Target)');

    var chartPayload = {
      adSpend: inputs.adSpend,
      revenue: inputs.revenueGenerated,
      netProfit: result.netProfit,
      roasRatio: result.roasRatio,
      breakEvenRoas: result.breakEvenRoas
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        adSpend: inputs.adSpend,
        revenueGenerated: inputs.revenueGenerated,
        roasRatio: result.roasRatio.toFixed(2) + 'x',
        netProfit: result.netProfit
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

    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Ad Spend', 'Attributed Revenue', 'Net Profit'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.adSpend, data.revenue, data.netProfit],
            backgroundColor: ['#ef4444', '#3b82f6', data.netProfit >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Campaign Financial Breakdown', color: '#e8edf0' }
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

    if (tab === 'roi') {
      return {
        type: 'bar',
        data: {
          labels: ['Actual ROAS', 'Break-Even ROAS'],
          datasets: [{
            label: 'ROAS Multiplier (x)',
            data: [data.roasRatio, data.breakEvenRoas],
            backgroundColor: ['#6366f1', '#64748b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'ROAS vs Break-Even Target Benchmark', color: '#e8edf0' }
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
    document.getElementById('input_adSpend').value = 10000;
    document.getElementById('input_revenueGenerated').value = 45000;
    document.getElementById('input_profitMargin').value = 70;
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
