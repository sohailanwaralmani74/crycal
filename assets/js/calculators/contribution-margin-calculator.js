(function() {

  var chartInstance = null;
  var currentTab = 'costStructure';
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

    var totalRevenue = parseFloat(document.getElementById('input_totalRevenue').value) || 0;
    var variableCogs = parseFloat(document.getElementById('input_variableCogs').value) || 0;
    var variableSm = parseFloat(document.getElementById('input_variableSm').value) || 0;
    var variableCs = parseFloat(document.getElementById('input_variableCs').value) || 0;

    var totalVariableCosts = variableCogs + variableSm + variableCs;
    var contributionMarginDollars = totalRevenue - totalVariableCosts;
    var contributionMarginPct = totalRevenue > 0 ? (contributionMarginDollars / totalRevenue) : 0;

    var status = '';
    var recommendation = '';

    if (contributionMarginPct >= 0.55) {
      status = '✅ Strong Contribution Margin (>= 55%)';
      recommendation = 'Excellent variable unit profitability. Strong cash flow generated to cover fixed R&D overhead.';
    } else if (contributionMarginPct >= 0.40) {
      status = '✅ Healthy Contribution Margin (40% - 54%)';
      recommendation = 'Solid profile. Monitor variable marketing acquisition channels to expand margins toward 60%.';
    } else if (contributionMarginPct >= 0.20) {
      status = '🟡 Moderate Margin (20% - 39%)';
      recommendation = 'Variable costs are consuming a large share of revenue. Audit ad CAC and support efficiency.';
    } else {
      status = '🔴 Fragile / Low Margin (< 20%)';
      recommendation = 'Unit contribution is severely restricted. Re-evaluate customer pricing and variable sales commissions.';
    }

    setOutputText('output_contributionMarginDollars', formatCurrency(contributionMarginDollars));
    setOutputText('output_contributionMarginPct', formatPercent(contributionMarginPct));
    setOutputText('output_totalVariableCosts', formatCurrency(totalVariableCosts));
    setOutputText('output_coverageForFixedCosts', formatCurrency(Math.max(0, contributionMarginDollars)));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      totalRevenue: totalRevenue,
      totalVariableCosts: totalVariableCosts,
      contributionMarginDollars: contributionMarginDollars,
      variableCogs: variableCogs,
      variableSm: variableSm,
      variableCs: variableCs
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalRevenue: totalRevenue,
        contributionMarginDollars: contributionMarginDollars,
        contributionMarginPct: (contributionMarginPct * 100).toFixed(1) + '%',
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
    if (tab === 'costStructure') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Total Variable Costs', 'Contribution Margin'],
          datasets: [{
            data: [data.totalVariableCosts, Math.max(0, data.contributionMarginDollars)],
            backgroundColor: ['#EC4899', '#34D399'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      };
    }
    if (tab === 'variableCostBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Variable COGS', 'Variable S&M', 'Variable CS/Support'],
          datasets: [{
            label: 'Cost ($)',
            data: [data.variableCogs, data.variableSm, data.variableCs],
            backgroundColor: ['#60A5FA', '#F59E0B', '#8B5CF6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
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

    document.getElementById('input_totalRevenue').value = 150000;
    document.getElementById('input_variableCogs').value = 22000;
    document.getElementById('input_variableSm').value = 35000;
    document.getElementById('input_variableCs').value = 13000;
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
