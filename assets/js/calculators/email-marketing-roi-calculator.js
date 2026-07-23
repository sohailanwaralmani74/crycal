(function() {
  var chartInstance = null;
  var currentTab = 'financials';
  var lastChartData = null;

  function getInputs() {
    var softwareCost = parseFloat(document.getElementById('input_softwareCost').value) || 0;
    var teamLaborCost = parseFloat(document.getElementById('input_teamLaborCost').value) || 0;
    var monthlyEmailsSent = parseFloat(document.getElementById('input_monthlyEmailsSent').value) || 0;
    var openRate = parseFloat(document.getElementById('input_openRate').value) || 25;
    var clickRate = parseFloat(document.getElementById('input_clickRate').value) || 3.5;
    var conversionRate = parseFloat(document.getElementById('input_conversionRate').value) || 2.0;
    var averageDealValue = parseFloat(document.getElementById('input_averageDealValue').value) || 1500;

    return {
      softwareCost: softwareCost,
      teamLaborCost: teamLaborCost,
      monthlyEmailsSent: monthlyEmailsSent,
      openRate: openRate / 100,
      clickRate: clickRate / 100,
      conversionRate: conversionRate / 100,
      averageDealValue: averageDealValue
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

  function calculateEmailRoi(inputs) {
    var totalCost = inputs.softwareCost + inputs.teamLaborCost;
    var volume = inputs.monthlyEmailsSent;

    if (volume <= 0 || totalCost <= 0) {
      return { error: 'Volume and Total Cost must be greater than zero.' };
    }

    var opens = Math.round(volume * inputs.openRate);
    var clicks = Math.round(volume * inputs.clickRate);
    var closedDeals = Math.round(clicks * inputs.conversionRate);
    var revenue = closedDeals * inputs.averageDealValue;
    var netProfit = revenue - totalCost;
    var roiPercent = (netProfit / totalCost) * 100;

    return {
      totalEmailCost: totalCost,
      opens: opens,
      clicks: clicks,
      closedDeals: closedDeals,
      monthlyPipelineRevenue: revenue,
      netEmailProfit: netProfit,
      emailRoi: roiPercent,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateEmailRoi(inputs);

    if (result.error) {
      setOutputText('output_totalEmailCost', '—');
      setOutputText('output_totalClicks', '—');
      setOutputText('output_closedDeals', '—');
      setOutputText('output_monthlyPipelineRevenue', '—');
      setOutputText('output_netEmailProfit', '—');
      setOutputText('output_emailRoi', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalEmailCost', formatCurrency(result.totalEmailCost));
    setOutputText('output_totalClicks', result.clicks.toLocaleString() + ' clicks');
    setOutputText('output_closedDeals', result.closedDeals + ' deals');
    setOutputText('output_monthlyPipelineRevenue', formatCurrency(result.monthlyPipelineRevenue));
    setOutputText('output_netEmailProfit', formatCurrency(result.netEmailProfit));
    setOutputText('output_emailRoi', result.emailRoi.toFixed(0) + '%');

    var chartPayload = {
      totalCost: result.totalEmailCost,
      revenue: result.monthlyPipelineRevenue,
      netProfit: result.netEmailProfit,
      volume: inputs.monthlyEmailsSent,
      opens: result.opens,
      clicks: result.clicks,
      deals: result.closedDeals
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        softwareCost: inputs.softwareCost,
        monthlyPipelineRevenue: formatCurrency(result.monthlyPipelineRevenue),
        netEmailProfit: formatCurrency(result.netEmailProfit),
        emailRoi: result.emailRoi.toFixed(0) + '%'
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

    if (tab === 'financials') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Expense', 'Pipeline Revenue', 'Net Profit'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.totalCost, data.revenue, data.netProfit],
            backgroundColor: ['#ef4444', '#3b82f6', data.netProfit >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Email Financial Return ($)', color: '#e8edf0' }
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

    if (tab === 'funnel') {
      return {
        type: 'bar',
        data: {
          labels: ['Emails Sent', 'Opens', 'Clicks', 'Closed Deals'],
          datasets: [{
            label: 'Count',
            data: [data.volume, data.opens, data.clicks, data.deals],
            backgroundColor: ['#64748b', '#06b6d4', '#3b82f6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Email Conversion Funnel', color: '#e8edf0' }
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
    document.getElementById('input_softwareCost').value = 500;
    document.getElementById('input_teamLaborCost').value = 2500;
    document.getElementById('input_monthlyEmailsSent').value = 50000;
    document.getElementById('input_openRate').value = 25;
    document.getElementById('input_clickRate').value = 3.5;
    document.getElementById('input_conversionRate').value = 2.0;
    document.getElementById('input_averageDealValue').value = 1500;
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
